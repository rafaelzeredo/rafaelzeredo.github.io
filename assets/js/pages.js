// Rafael Z: shared behaviour for the dedicated pages. Same language memory ("rz-lang"), menu, reveal and film player as the homepage.
(function(){
  var d=document, root=d.documentElement, body=d.body;
  var WA='5561984167777';
  var MSG={pt:'Olá, Rafael! Gostaria de um orçamento para um show: ',en:'Hi Rafael! I would like a quote for a show: '};
  // language
  function setLang(l){
    root.dataset.lang=l;root.lang=l==='pt'?'pt-BR':'en';
    try{localStorage.setItem('rz-lang',l)}catch(e){}
    d.querySelectorAll('[data-wa]').forEach(function(a){
      a.href='https://wa.me/'+WA+'?text='+encodeURIComponent(MSG[l]+a.dataset.wa+'.');
    });
  }
  var saved=null;try{saved=localStorage.getItem('rz-lang')}catch(e){}
  setLang(saved==='en'?'en':'pt');
  d.querySelectorAll('.lang button').forEach(function(b){b.addEventListener('click',function(){setLang(b.dataset.set)})});
  // section colours (the homepage's day-to-night themes)
  var secs=[].slice.call(d.querySelectorAll('[data-t]'));
  if(secs.length){
    body.dataset.theme=secs[0].dataset.t;
    var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting)body.dataset.theme=e.target.dataset.t})},{rootMargin:'-45% 0px -50% 0px'});
    secs.forEach(function(s){io.observe(s)});
  }
  // menu
  var mb=d.getElementById('menuBtn'),sh=d.getElementById('sheet');
  function menu(o){body.classList.toggle('menu-open',o);mb.setAttribute('aria-expanded',o);sh.setAttribute('aria-hidden',!o);body.style.overflow=o?'hidden':''}
  mb.addEventListener('click',function(){menu(!body.classList.contains('menu-open'))});
  sh.querySelectorAll('a').forEach(function(a){a.addEventListener('click',function(){menu(false)})});
  addEventListener('keydown',function(e){if(e.key==='Escape'&&body.classList.contains('menu-open'))menu(false)});
  var top=d.getElementById('top');
  function sc(){top.classList.toggle('scrolled',scrollY>40)}
  addEventListener('scroll',sc,{passive:true});sc();
  // reveal
  var rio=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add('in');rio.unobserve(e.target)}})},{threshold:.12});
  d.querySelectorAll('.rv').forEach(function(e){rio.observe(e)});
  // films with sound: one at a time
  var players=[].slice.call(d.querySelectorAll('.vis[role=button]'));
  players.forEach(function(pl){
    var pv=pl.querySelector('video');
    function start(){players.forEach(function(o){if(o!==pl){var ov=o.querySelector('video');if(!ov.paused)ov.pause()}});pv.controls=true;var p=pv.play();if(p&&p.catch)p.catch(function(){});pl.classList.add('playing')}
    pl.addEventListener('click',function(){if(!pl.classList.contains('playing'))start()});
    pl.addEventListener('keydown',function(e){if((e.key==='Enter'||e.key===' ')&&!pl.classList.contains('playing')){e.preventDefault();start()}});
    pv.addEventListener('pause',function(){if(!pv.seeking)pl.classList.remove('playing')});
    pv.addEventListener('play',function(){pl.classList.add('playing')});
    var te=parseFloat(pl.dataset.titleEnd);
    if(te){var cap=function(){pl.classList.toggle('titling',!pv.ended&&pv.currentTime<te)};['play','timeupdate','seeked','ended'].forEach(function(ev){pv.addEventListener(ev,cap)})}
  });
  // silent loops: decorative, play only while on screen. If Safari refuses autoplay (Low Power Mode, "Never Auto-Play"),
  // the poster is laid over the paused video as a still (hiding WebKit's grey start button) and the first tap, click or key
  // press starts them; the still fades away once the video is really playing. Same behaviour as on the homepage.
  var ambient=[];
  d.querySelectorAll('video[data-loop]').forEach(function(v){
    v.muted=true;v.defaultMuted=true;v.controls=false;v.removeAttribute('controls');v.setAttribute('disablepictureinpicture','');v.setAttribute('disableremoteplayback','');v.setAttribute('tabindex','-1');
    var vis=false,tries=0,st=null;
    function still(on){
      if(on&&!st&&v.poster){var cs=getComputedStyle(v);st=d.createElement('span');st.setAttribute('aria-hidden','true');
        st.style.cssText='position:absolute;inset:0;pointer-events:none;background:url("'+v.poster+'") '+cs.objectPosition+'/cover no-repeat;transition:opacity .6s;z-index:'+cs.zIndex;
        v.insertAdjacentElement('afterend',st)}
      if(st)st.style.opacity=on?'1':'0'}
    function go(){if(!vis||!v.paused)return;var p=v.play();if(p&&p.catch)p.catch(function(e){if(e&&e.name==='NotAllowedError')still(true)})}
    function again(){go();if(vis&&v.paused&&tries++<24)setTimeout(again,400)}
    v.addEventListener('playing',function(){still(false)});
    new IntersectionObserver(function(es){es.forEach(function(e){vis=e.isIntersecting;if(vis){tries=0;again()}else v.pause()})},{threshold:.25}).observe(v);
    ['canplay','loadeddata'].forEach(function(ev){v.addEventListener(ev,go)});
    ambient.push(function(gesture){if(vis)return go();if(gesture&&v.paused&&!v.dataset.unlocked){var p=v.play();if(p&&p.then)p.then(function(){v.dataset.unlocked=1;if(!vis)v.pause()},function(){})}});
  });
  ['pointerdown','touchend','keydown','click'].forEach(function(ev){addEventListener(ev,function(){ambient.forEach(function(g){g(true)})},{passive:true,capture:true})});
  d.addEventListener('visibilitychange',function(){if(!d.hidden)ambient.forEach(function(g){g(false)})});
  // mobile booking dock: after the first screen, hidden over the booking section
  var dock=d.getElementById('dock'),bk=d.getElementById('contato');
  if(dock&&bk){
    var dk=function(){var past=scrollY>innerHeight*.6,inB=bk.getBoundingClientRect().top<innerHeight*.8;dock.classList.toggle('show',past&&!inB&&!body.classList.contains('menu-open'))};
    addEventListener('scroll',dk,{passive:true});dk();
  }
})();
