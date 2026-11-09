/* Rafael Z: Safari Low Power Mode fallback for DECORATIVE background videos (hero, sunset, format-card loops).
 *
 * Problem: with Low Power Mode on (also "Never Auto-Play"), Safari refuses play() on a <video> and draws its grey start button.
 * Fix:     Safari treats an .mp4 shown in an <img> as an image, which loops silently. When (and only when) a decorative video
 *          has been refused autoplay, it is replaced by <img src="same.mp4"> with the same id, classes, inline style, size and
 *          crop. Same file, no extra assets. Nothing is forced and no browser setting is touched; browsers where <video> plays
 *          never reach this code, and browsers that cannot show an MP4 as an image (it fails to load) keep the video.
 *
 * Use:     window.RZ_lpmSwap(videoElement) -> true if the swap was started. Called by the ambient-video code in index.html and
 *          assets/js/pages.js after two NotAllowedError refusals.
 * Switch:  set window.RZ_LPM_IMG_FALLBACK = false before this file loads (or add ?lpm=off to any page URL) to disable it.
 * Rollback: delete this file's <script> tags (index.html, solo/, trio/) or revert the commit; the poster-still fallback remains.
 */
(function(){
  var off=false;
  try{off=/[?&]lpm=off\b/.test(location.search)}catch(e){}
  if(window.RZ_LPM_IMG_FALLBACK===undefined)window.RZ_LPM_IMG_FALLBACK=!off;
  window.RZ_lpmSwap=function(v){
    if(!window.RZ_LPM_IMG_FALLBACK||!v||v.dataset.rzSwapped||v.dataset.rzSwapping)return false;
    var src=v.currentSrc||v.getAttribute('src');if(!src)return false;
    v.dataset.rzSwapping='1';
    var im=new Image();
    im.onload=function(){                       // this browser can show the MP4 as an image: swap
      if(!v.parentNode)return;
      im.className=(v.className?v.className+' ':'')+'rz-vid';
      if(v.id)im.id=v.id;
      if(v.getAttribute('style'))im.setAttribute('style',v.getAttribute('style'));
      im.alt=v.getAttribute('aria-label')||'';
      if(!im.alt)im.setAttribute('aria-hidden','true');
      im.setAttribute('data-rz-fallback','lpm');im.setAttribute('decoding','async');im.draggable=false;
      if(v.width)im.width=v.width;if(v.height)im.height=v.height;
      var st=v.nextElementSibling;if(st&&st.tagName==='SPAN'&&st.getAttribute('aria-hidden')&&!st.textContent)st.remove();  // poster still, if any
      v.dataset.rzSwapped='1';v.pause();
      v.parentNode.replaceChild(im,v);
      try{v.removeAttribute('src');v.load()}catch(e){}   // free the decoder
    };
    im.onerror=function(){delete v.dataset.rzSwapping};   // cannot show MP4 as image here: leave the video alone
    im.src=src;
    return true;
  };
})();
