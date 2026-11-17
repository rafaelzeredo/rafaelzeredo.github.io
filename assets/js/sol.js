/* Rafael Z: "O Sol". A small real-time sun for the booking headline: a shaded, slowly turning sphere with a living surface
 * and corona, drawn by one fragment shader in plain WebGL (no library). Loaded on demand by assets/js/fx.js.
 *   RZ_sol(wrapper, {still:true|false})
 * Costs nothing until its section is near; renders at ~30 fps only while visible; one frame only with reduced motion;
 * falls back to a CSS sun (class "nogl") when WebGL is unavailable or the context is lost. */
(function(){
  var FS=[
  'precision highp float;uniform vec2 uR;uniform float uT;uniform vec2 uM;',
  'float hash(vec3 p){p=fract(p*.3183099+.1);p*=17.;return fract(p.x*p.y*p.z*(p.x+p.y+p.z));}',
  'float noise(vec3 x){vec3 i=floor(x),f=fract(x);f=f*f*(3.-2.*f);',
  ' return mix(mix(mix(hash(i),hash(i+vec3(1,0,0)),f.x),mix(hash(i+vec3(0,1,0)),hash(i+vec3(1,1,0)),f.x),f.y),',
  '            mix(mix(hash(i+vec3(0,0,1)),hash(i+vec3(1,0,1)),f.x),mix(hash(i+vec3(0,1,1)),hash(i+vec3(1,1,1)),f.x),f.y),f.z);}',
  'float fbm(vec3 p){float a=.5,s=0.;for(int i=0;i<5;i++){s+=a*noise(p);p=p*2.02+vec3(1.7,9.2,3.1);a*=.5;}return s;}',
  'void main(){',
  ' vec2 uv=(gl_FragCoord.xy-.5*uR)/uR.y;vec2 q=uv-uM*.014;float R=.205;float d=length(q);',
  ' float ang=atan(q.y,q.x);float e=max(d-R,0.);',
  ' float ray=fbm(vec3(cos(ang)*2.2,sin(ang)*2.2,uT*.06+d*3.));',
  ' float fl=fbm(vec3(q*7.,uT*.12));',
  ' float corona=exp(-e*(9.+10.*ray))*(.72+.6*fl);',
  ' float halo=exp(-e*3.2)*.40;float wide=exp(-e*1.45)*.15;',
  ' vec3 col=mix(vec3(.94,.50,.19),vec3(1.,.80,.36),clamp(corona,0.,1.))*corona+vec3(.90,.47,.25)*halo+vec3(.86,.55,.52)*wide;',
  ' float a=corona*.95+halo*.8+wide*.7;',
  ' if(d<R){',
  '  vec2 p=q/R;float z=sqrt(max(0.,1.-dot(p,p)));vec3 n=vec3(p,z);',
  '  float t=uT*.035;float cs=cos(t),sn=sin(t);vec3 s=vec3(n.x*cs+n.z*sn,n.y,-n.x*sn+n.z*cs);',
  '  float g1=fbm(s*3.2+vec3(0.,uT*.04,0.));float g2=fbm(s*9.+vec3(uT*.07,0.,g1*2.));',
  '  float cells=smoothstep(.32,.72,g2);float limb=pow(z,.72);',
  '  vec3 deep=vec3(.80,.30,.12),mid=vec3(.96,.62,.14),hot=vec3(1.,.90,.62);',
  '  vec3 sc=mix(deep,mid,limb);sc=mix(sc,hot,clamp(limb*(.18+1.15*g1)*(.38+.85*cells),0.,1.));sc*=.86+.2*g1;',
  '  sc+=vec3(1.,.75,.4)*pow(1.-z,3.)*.35;',
  '  float edge=smoothstep(R,R-.0035,d);col=mix(col,sc,edge);a=mix(a,1.,edge);',
  ' }',
  ' float vig=smoothstep(.5,.33,d);col*=vig;a=clamp(a,0.,1.)*vig;',
  ' gl_FragColor=vec4(col,a);',
  '}'].join('\n');
  var VS='attribute vec2 p;void main(){gl_Position=vec4(p,0.,1.);}';

  window.RZ_sol=function(wrap,opt){
    opt=opt||{};
    function fallback(){wrap.classList.add('nogl','ready');var c=wrap.querySelector('canvas');if(c)c.remove()}
    var cv=document.createElement('canvas'),gl=null;
    try{gl=cv.getContext('webgl',{alpha:true,premultipliedAlpha:true,antialias:false,powerPreference:'low-power'})}catch(e){}
    if(!gl)return fallback();
    function sh(type,src){var s=gl.createShader(type);gl.shaderSource(s,src);gl.compileShader(s);return gl.getShaderParameter(s,gl.COMPILE_STATUS)?s:null}
    var vs=sh(gl.VERTEX_SHADER,VS),fs=sh(gl.FRAGMENT_SHADER,FS);if(!vs||!fs)return fallback();
    var pr=gl.createProgram();gl.attachShader(pr,vs);gl.attachShader(pr,fs);gl.linkProgram(pr);
    if(!gl.getProgramParameter(pr,gl.LINK_STATUS))return fallback();
    gl.useProgram(pr);
    gl.bindBuffer(gl.ARRAY_BUFFER,gl.createBuffer());gl.bufferData(gl.ARRAY_BUFFER,new Float32Array([-1,-1,3,-1,-1,3]),gl.STATIC_DRAW);
    var loc=gl.getAttribLocation(pr,'p');gl.enableVertexAttribArray(loc);gl.vertexAttribPointer(loc,2,gl.FLOAT,false,0,0);
    var uR=gl.getUniformLocation(pr,'uR'),uT=gl.getUniformLocation(pr,'uT'),uM=gl.getUniformLocation(pr,'uM');
    gl.clearColor(0,0,0,0);
    wrap.appendChild(cv);
    var coarse=matchMedia('(pointer:coarse)').matches,cap=coarse?520:900;
    function size(){var w=wrap.clientWidth||320,px=Math.round(Math.min(cap,w*Math.min(devicePixelRatio||1,2)));if(cv.width!==px){cv.width=cv.height=px;gl.viewport(0,0,px,px)}}
    var host=wrap.parentElement,mx=0,my=0,tmx=0,tmy=0,t0=performance.now(),last=0,raf=0,vis=false,lost=false;
    function draw(now){
      size();mx+=(tmx-mx)*.06;my+=(tmy-my)*.06;
      gl.uniform2f(uR,cv.width,cv.height);gl.uniform1f(uT,opt.still?12:(now-t0)/1000+12);gl.uniform2f(uM,mx,my);
      gl.clear(gl.COLOR_BUFFER_BIT);gl.drawArrays(gl.TRIANGLES,0,3);
      // the sun sinks a little as its section scrolls past: entardecer
      var r=host.getBoundingClientRect(),p=Math.min(1,Math.max(0,(innerHeight-r.top)/(innerHeight+r.height)));
      wrap.style.transform='translate3d(0,'+((p-.35)*150).toFixed(1)+'px,0)';
    }
    function loop(now){raf=0;if(!vis||lost||document.hidden)return;if(now-last>31){last=now;draw(now)}raf=requestAnimationFrame(loop)}
    function wake(){if(opt.still){draw(performance.now());return}if(!raf&&vis&&!lost&&!document.hidden)raf=requestAnimationFrame(loop)}
    new IntersectionObserver(function(es){vis=es[0].isIntersecting;wake()},{rootMargin:'120px 0px'}).observe(wrap);
    document.addEventListener('visibilitychange',wake);
    addEventListener('resize',function(){if(opt.still)draw(performance.now())});
    if(opt.still)addEventListener('scroll',function(){if(vis)draw(performance.now())},{passive:true});
    if(!coarse)addEventListener('pointermove',function(e){var r=wrap.getBoundingClientRect();tmx=Math.max(-1.5,Math.min(1.5,(e.clientX-(r.left+r.width/2))/r.width));tmy=Math.max(-1.5,Math.min(1.5,((r.top+r.height/2)-e.clientY)/r.height))},{passive:true});
    cv.addEventListener('webglcontextlost',function(e){e.preventDefault();lost=true;fallback()});
    draw(performance.now());wrap.classList.add('ready');
  };
})();
