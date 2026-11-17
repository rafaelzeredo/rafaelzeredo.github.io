/* Rafael Z: the "elevate" layer (16 Nov 2026). Progressive enhancement only: every page works without this file.
 * Switch off: window.RZ_FX=false before this script, or add ?fx=off to a URL. Styles: assets/css/fx.css.
 * What it does: reading-progress line, film grain, headlines that rise line by line, outlined section numerals,
 * pointer tilt on cards and covers, a pointer label on draggable/openable things, animated open/close of the
 * "Momentos" entries, the archive lightbox, record sleeves on the music page, and the lazy WebGL sun (assets/js/sol.js). */
(function(){
  var d=document,root=d.documentElement,b=d.body;
  var off=window.RZ_FX===false;try{if(/[?&]fx=off\b/.test(location.search))off=true}catch(e){}
  var me=d.currentScript,base=me&&me.src?me.src.replace(/fx\.js.*$/,''):'assets/js/';

  /* ---- archive lightbox (works even with the effects off) ---- */
  var lb=d.getElementById('lightbox');
  if(lb){
    var lbImg=lb.querySelector('img'),lbCap=lb.querySelector('figcaption'),last=null;
    d.querySelectorAll('[data-zoom]').forEach(function(btn){
      btn.addEventListener('click',function(){
        if(!lb.showModal){window.open(btn.dataset.zoom,'_blank','noopener');return}
        var im=btn.querySelector('img'),fc=btn.closest('figure')&&btn.closest('figure').querySelector('figcaption');
        lbImg.src=btn.dataset.zoom;lbImg.alt=im?im.alt:'';if(im){lbImg.width=im.naturalWidth||im.width;lbImg.height=im.naturalHeight||im.height}
        lbCap.innerHTML=fc?fc.innerHTML:'';last=btn;
        lb.showModal();b.style.overflow='hidden';
      });
    });
    lb.addEventListener('click',function(e){if(e.target===lb||e.target.tagName==='FIGURE'||e.target.closest('.lb-x'))lb.close()});
    lb.addEventListener('close',function(){b.style.overflow='';if(last)last.focus()});
  }
  /* ---- a link to #djavan-2014 (or any entry id) opens that entry ---- */
  function openHash(){var id=location.hash.slice(1);if(!id)return;var el=d.getElementById(id);if(el&&el.tagName==='DETAILS'){el.open=true;setTimeout(function(){el.scrollIntoView({block:'start'})},60)}}
  openHash();addEventListener('hashchange',openHash);

  if(off)return;
  var reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
  var fine=matchMedia('(hover:hover) and (pointer:fine)').matches;
  root.classList.add('fx');
  function el(tag,cls){var e=d.createElement(tag);e.className=cls;e.setAttribute('aria-hidden','true');return e}

  /* ---- progress line + grain ---- */
  var bar=el('div','fx-progress');b.appendChild(bar);b.appendChild(el('div','fx-grain'));
  var tick=false;function prog(){tick=false;var h=root.scrollHeight-innerHeight;bar.style.transform='scaleX('+(h>0?Math.min(1,Math.max(0,scrollY/h)):0)+')'}
  addEventListener('scroll',function(){if(!tick){tick=true;requestAnimationFrame(prog)}},{passive:true});addEventListener('resize',prog);prog();

  /* ---- section numerals: taken from each section's own "01 Label" ---- */
  d.querySelectorAll('.label b').forEach(function(n){
    var t=n.textContent.trim(),sec=n.closest('section');
    if(!/^\d\d$/.test(t)||!sec||sec.querySelector(':scope > .fx-num')||sec.classList.contains('hero'))return;
    var s=el('span','fx-num');s.textContent=t;sec.classList.add('fx-has-num');sec.insertBefore(s,sec.firstChild);
  });

  /* ---- headlines: split at their line breaks, rise when they come into view ---- */
  if(!reduce){
    var heads=[].slice.call(d.querySelectorAll('h1.big,h2.big'));
    heads.forEach(function(h){
      var parts=[].filter.call(h.children,function(c){return c.hasAttribute('data-pt')||c.hasAttribute('data-en')});
      (parts.length?parts:[h]).forEach(function(p){
        p.innerHTML=p.innerHTML.split(/<br\s*\/?>/i).map(function(line,i){return '<span class="fx-ln" style="--i:'+i+'"><span>'+line+'</span></span>'}).join('');
      });
      h.classList.add('fx-split');
    });
    var hio=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add('fx-in');hio.unobserve(e.target)}})},{threshold:.15});
    heads.forEach(function(h){hio.observe(h)});
    var net=function(){heads.forEach(function(h){if(h.classList.contains('fx-in'))return;var r=h.getBoundingClientRect();if(r.top<innerHeight&&r.bottom>0)h.classList.add('fx-in')})};
    setTimeout(net,1800);var nt=0;addEventListener('scroll',function(){clearTimeout(nt);nt=setTimeout(net,450)},{passive:true});
  }

  /* ---- music page: a record inside each sleeve ---- */
  d.querySelectorAll('.ep .cov,.sg .cov').forEach(function(c){
    var im=c.querySelector('img');if(!im)return;
    var v=el('span','fx-vinyl');v.style.setProperty('--label','url("'+im.src+'")');   // absolute: a relative url() in a custom property resolves against fx.css
    c.classList.add('fx-sleeve');c.insertBefore(v,c.firstChild);
  });

  /* ---- depth: tilt toward the pointer ---- */
  if(fine&&!reduce){
    d.querySelectorAll('.fc .ph,.next a,.relic-btn,.sg .cov,.ep .cov').forEach(function(t){
      t.classList.add('fx-tilt');t.appendChild(el('span','fx-glare'));var max=t.classList.contains('relic-btn')?9:6,lt=0;
      t.addEventListener('pointermove',function(e){
        var r=t.getBoundingClientRect(),x=(e.clientX-r.left)/r.width,y=(e.clientY-r.top)/r.height;
        t.style.setProperty('--ry',((x-.5)*max).toFixed(2)+'deg');t.style.setProperty('--rx',((.5-y)*max).toFixed(2)+'deg');
        t.style.setProperty('--gx',(x*100).toFixed(1)+'%');t.style.setProperty('--gy',(y*100).toFixed(1)+'%');
        clearTimeout(lt);lt=setTimeout(function(){t.classList.add('fx-live')},200);
      });
      t.addEventListener('pointerleave',function(){clearTimeout(lt);t.classList.remove('fx-live');t.style.setProperty('--rx','0deg');t.style.setProperty('--ry','0deg')});
    });

    /* ---- pointer label ---- */
    var cur=el('div','fx-cur'),ct=d.createElement('span');cur.appendChild(ct);b.appendChild(cur);
    var L=[['.strip','Arraste','Drag'],['.relic-btn','Ampliar','Enlarge'],['.fc .ph','Ver','View'],['.next a','Ver','View']];
    var tx=0,ty=0,x=0,y=0,raf=0,shown=null;
    function loop(){x+=(tx-x)*.2;y+=(ty-y)*.2;cur.style.transform='translate3d('+x.toFixed(1)+'px,'+y.toFixed(1)+'px,0)';raf=(shown||Math.abs(tx-x)+Math.abs(ty-y)>.4)?requestAnimationFrame(loop):0}
    d.addEventListener('pointermove',function(e){
      if(e.pointerType&&e.pointerType!=='mouse')return;
      tx=e.clientX;ty=e.clientY;var hit=null,t=e.target;
      if(t&&t.closest)for(var i=0;i<L.length;i++){if(t.closest(L[i][0])){hit=L[i];break}}
      if(hit!==shown){
        if(hit){ct.textContent=root.dataset.lang==='en'?hit[2]:hit[1];if(!shown){x=tx;y=ty}}
        cur.classList.toggle('on',!!hit);shown=hit;
      }
      if(!raf)raf=requestAnimationFrame(loop);
    },{passive:true});
    d.addEventListener('pointerdown',function(){cur.classList.remove('on');shown=null},{passive:true});
    d.documentElement.addEventListener('pointerleave',function(){cur.classList.remove('on');shown=null});
  }

  /* ---- "Momentos": entries open and close smoothly ---- */
  if(!reduce&&'animate' in Element.prototype){
    d.querySelectorAll('.hl details').forEach(function(dt){
      var sm=dt.querySelector('summary'),an=null;
      sm.addEventListener('click',function(e){
        e.preventDefault();if(an){an.cancel();an=null}
        var from=dt.offsetHeight,closing=dt.open&&!dt.classList.contains('fx-closing'),to;
        if(closing){dt.classList.add('fx-closing');to=sm.offsetHeight+1}
        else{dt.classList.remove('fx-closing');dt.open=true;dt.style.height='';to=dt.offsetHeight}
        dt.style.overflow='hidden';
        an=dt.animate({height:[from+'px',to+'px']},{duration:closing?520:720,easing:'cubic-bezier(.16,1,.3,1)'});
        an.onfinish=function(){an=null;dt.style.overflow='';if(closing){dt.open=false;dt.classList.remove('fx-closing')}};
      });
    });
  }

  /* ---- O Sol: mount a canvas behind the booking headline and load the shader only when it comes near ---- */
  var hosts=[].slice.call(d.querySelectorAll('.contact,.book'));
  if(hosts.length){
    var suns=hosts.map(function(h){var w=el('div','fx-sol');h.insertBefore(w,h.firstChild);return w});
    var loaded=false,sio=new IntersectionObserver(function(es){
      es.forEach(function(e){
        if(!e.isIntersecting)return;
        if(!loaded){loaded=true;var s=d.createElement('script');s.src=base+'sol.js?v=1';s.onload=function(){suns.forEach(function(w){window.RZ_sol&&window.RZ_sol(w,{still:reduce})})};s.onerror=function(){suns.forEach(function(w){w.classList.add('nogl','ready')})};d.head.appendChild(s)}
        sio.disconnect();
      });
    },{rootMargin:'600px 0px'});
    suns.forEach(function(w){sio.observe(w)});
  }
})();
