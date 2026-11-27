/* PulseMetrics × Mail 24-Theme Pack & Living Animated Canvas FX Engine
 * Exact 24 themes from Mail (14 Static + 10 Living Animated Themes + Mouse Interactive FX).
 * Shared across PulseMetrics Desktop/Web App, GitHub Pages Demo, and Landing Website.
 */
(function(){
'use strict';

const THEMES = [
  {id:'pink',name:'ชมพูสว่าง',sub:'ค่าเริ่มต้น',dark:false,anim:false,sw1:'#f6f7fb',sw2:'#FF6FAE',
   vars:{'--bg':'#f6f7fb','--surf':'#ffffff','--surf2':'#f0f1f6','--surf3':'#f8f9fc','--bd':'#dcdfe9','--tx':'#12101c','--tx2':'#2b293b','--dim':'#49475c','--ac':'#e8458b','--on-ac':'#ffffff','--ac-ink':'#bf2466','--ac-soft':'#fde9f2','--ac-bd':'#f6b6d1','--brand':'#FF6FAE','--brand-grad':'linear-gradient(135deg,#FF7BB5 0%,#e8458b 100%)','--brand-tx':'#ffffff'}},
  {id:'dark',name:'โหมดมืด',sub:'Midnight Pink',dark:true,anim:false,sw1:'#181b28',sw2:'#ff5ca0',
   vars:{'--bg':'#0f111a','--surf':'#181b28','--surf2':'#222638','--surf3':'#1d2132','--bd':'#323854','--tx':'#f8f9fd','--tx2':'#e4e8f7','--dim':'#bcc4df','--ac':'#ff5ca0','--on-ac':'#ffffff','--ac-ink':'#ff99c5','--ac-soft':'rgba(255,92,160,.18)','--ac-bd':'rgba(255,92,160,.48)','--brand':'#1e1729','--brand-grad':'linear-gradient(135deg,#2a1938 0%,#171525 100%)','--brand-tx':'#ffffff'}},
  {id:'cyber',name:'ดาร์กไซเบอร์',sub:'Dark Cyan',dark:true,anim:false,sw1:'#131a2a',sw2:'#22d3ee',
   vars:{'--bg':'#0a0e18','--surf':'#131a2a','--surf2':'#1c263c','--surf3':'#162033','--bd':'#2b3b5a','--tx':'#f6faff','--tx2':'#dee9f9','--dim':'#b4c7e3','--ac':'#06b6d4','--on-ac':'#04151e','--ac-ink':'#5ce8ff','--ac-soft':'rgba(34,211,238,.17)','--ac-bd':'rgba(34,211,238,.48)','--brand':'#101c31','--brand-grad':'linear-gradient(135deg,#0d2740 0%,#0d1526 100%)','--brand-tx':'#f2fbff'}},
  {id:'ocean',name:'ฟ้าโอเชียน',sub:'Ocean Blue',dark:false,anim:false,sw1:'#f2f7fd',sw2:'#2563eb',
   vars:{'--bg':'#f2f7fd','--surf':'#ffffff','--surf2':'#e8f0fb','--surf3':'#f5f9ff','--bd':'#cddcf2','--tx':'#0f172a','--tx2':'#283854','--dim':'#445778','--ac':'#2563eb','--on-ac':'#ffffff','--ac-ink':'#1d4ed8','--ac-soft':'#e3efff','--ac-bd':'#93c5fd','--brand':'#3b82f6','--brand-grad':'linear-gradient(135deg,#60a5fa 0%,#2563eb 100%)','--brand-tx':'#ffffff'}},
  {id:'purple',name:'ม่วงลาเวนเดอร์',sub:'Lavender',dark:false,anim:false,sw1:'#f6f4fd',sw2:'#7c3aed',
   vars:{'--bg':'#f6f4fd','--surf':'#ffffff','--surf2':'#efeafd','--surf3':'#f9f7ff','--bd':'#d9d0f5','--tx':'#161129','--tx2':'#352c52','--dim':'#524773','--ac':'#7c3aed','--on-ac':'#ffffff','--ac-ink':'#6d28d9','--ac-soft':'#ede9fe','--ac-bd':'#c4b5fd','--brand':'#8b5cf6','--brand-grad':'linear-gradient(135deg,#a78bfa 0%,#7c3aed 100%)','--brand-tx':'#ffffff'}},
  {id:'mint',name:'เขียวมินต์',sub:'Mint Fresh',dark:false,anim:false,sw1:'#f2faf7',sw2:'#0d9488',
   vars:{'--bg':'#f2faf7','--surf':'#ffffff','--surf2':'#e6f5f0','--surf3':'#f5fcf9','--bd':'#c4e5da','--tx':'#0d1f1c','--tx2':'#25403b','--dim':'#3f615a','--ac':'#0d9488','--on-ac':'#ffffff','--ac-ink':'#0f766e','--ac-soft':'#daf5ef','--ac-bd':'#7ee0d2','--brand':'#14b8a6','--brand-grad':'linear-gradient(135deg,#2dd4bf 0%,#0d9488 100%)','--brand-tx':'#ffffff'}},
  {id:'warm',name:'ครีมอุ่น',sub:'Warm Cream',dark:false,anim:false,sw1:'#f6f0e4',sw2:'#c2552d',
   vars:{'--bg':'#f6f0e4','--surf':'#fdfaf3','--surf2':'#ede4d4','--surf3':'#f9f4ea','--bd':'#ddd1bd','--tx':'#261e16','--tx2':'#4a3c2e','--dim':'#736250','--ac':'#c2552d','--on-ac':'#ffffff','--ac-ink':'#9e3f1c','--ac-soft':'#fae9e0','--ac-bd':'#e8b9a3','--brand':'#c2552d','--brand-grad':'linear-gradient(135deg,#df7951 0%,#c2552d 100%)','--brand-tx':'#ffffff'}},
  {id:'clay',name:'กลาส & เคลย์',sub:'Glass Clay',dark:false,anim:false,sw1:'#eef2ff',sw2:'#4f7cff',
   vars:{'--bg':'#e6edff','--surf':'#eef2ff','--surf2':'#e3e9fb','--surf3':'#f3f6ff','--bd':'rgba(255,255,255,.7)','--tx':'#1d2540','--tx2':'#323c63','--dim':'#56608a','--ac':'#4f7cff','--on-ac':'#ffffff','--ac-ink':'#3459d6','--ac-soft':'#dfe7ff','--ac-bd':'#aebfff','--brand':'#6c8bff','--brand-grad':'linear-gradient(135deg,#7f9dff 0%,#8b5cf6 100%)','--brand-tx':'#ffffff'}},
  {id:'verdelo',name:'มรกตดาร์ก',sub:'Verdelo Mint',dark:true,anim:false,sw1:'#0d1311',sw2:'#34d399',
   vars:{'--bg':'#0a0d0c','--surf':'#111614','--surf2':'#181f1c','--surf3':'#141a17','--bd':'#232e29','--tx':'#f2f7f4','--tx2':'#cbd8d1','--dim':'#899c92','--ac':'#34d399','--on-ac':'#041f15','--ac-ink':'#6ee7b7','--ac-soft':'rgba(52,211,153,.15)','--ac-bd':'rgba(52,211,153,.42)','--brand':'#0d1311','--brand-grad':'linear-gradient(135deg,#12241d 0%,#0b100e 100%)','--brand-tx':'#f2f7f4'}},
  {id:'obsidian',name:'โอบซิเดียนมะนาว',sub:'Obsidian Lime',dark:true,anim:false,sw1:'#11140f',sw2:'#a3e635',
   vars:{'--bg':'#0b0e0a','--surf':'#131711','--surf2':'#1b2118','--surf3':'#161b14','--bd':'#293224','--tx':'#f4f7ef','--tx2':'#d2dbc8','--dim':'#8e9b84','--ac':'#a3e635','--on-ac':'#142004','--ac-ink':'#bef264','--ac-soft':'rgba(163,230,53,.15)','--ac-bd':'rgba(163,230,53,.42)','--brand':'#121710','--brand-grad':'linear-gradient(135deg,#1d2616 0%,#0f130d 100%)','--brand-tx':'#f4f7ef'}},
  {id:'stone',name:'สโตน & ส้มอิฐ',sub:'Stone Bento',dark:false,anim:false,sw1:'#f7f5f2',sw2:'#d9521e',
   vars:{'--bg':'#f7f5f2','--surf':'#ffffff','--surf2':'#efeae3','--surf3':'#faf8f5','--bd':'#e4ddd3','--tx':'#191716','--tx2':'#3f3a36','--dim':'#6e665f','--ac':'#d9521e','--on-ac':'#ffffff','--ac-ink':'#b83f12','--ac-soft':'#fcece5','--ac-bd':'#f2b89e','--brand':'#18181b','--brand-grad':'linear-gradient(135deg,#242429 0%,#141417 100%)','--brand-tx':'#fafaf9'}},
  {id:'mono',name:'โมโนโครม',sub:'Corbel Mono',dark:false,anim:false,sw1:'#f5f6f8',sw2:'#111111',
   vars:{'--bg':'#f5f6f8','--surf':'#ffffff','--surf2':'#eceef2','--surf3':'#f9fafb','--bd':'#dfe3ea','--tx':'#111111','--tx2':'#333740','--dim':'#646a76','--ac':'#111111','--on-ac':'#ffffff','--ac-ink':'#111111','--ac-soft':'rgba(17,17,17,.08)','--ac-bd':'rgba(17,17,17,.26)','--brand':'#111111','--brand-grad':'linear-gradient(135deg,#23252a 0%,#111111 100%)','--brand-tx':'#ffffff'}},
  {id:'copper',name:'คอปเปอร์กลาส',sub:'Copper Glass',dark:false,anim:false,sw1:'#f4e6dc',sw2:'#e05a3a',
   vars:{'--bg':'#efe0d6','--surf':'rgba(255,250,246,.78)','--surf2':'rgba(246,232,223,.82)','--surf3':'rgba(255,252,249,.86)','--bd':'rgba(255,255,255,.72)','--tx':'#231712','--tx2':'#4a3329','--dim':'#7a5b4d','--ac':'#e05a3a','--on-ac':'#ffffff','--ac-ink':'#be4124','--ac-soft':'rgba(224,90,58,.15)','--ac-bd':'rgba(224,90,58,.42)','--brand':'#c84f34','--brand-grad':'linear-gradient(135deg,#eb7555 0%,#b8422a 100%)','--brand-tx':'#ffffff'}},
  {id:'sage',name:'เซจพาสเทล',sub:'Lullo Pastel',dark:false,anim:false,sw1:'#d6e2d5',sw2:'#d96248',
   vars:{'--bg':'#faf6ee','--surf':'#ffffff','--surf2':'#f1ece0','--surf3':'#fdfaf4','--bd':'#e3dccb','--tx':'#212621','--tx2':'#3e473e','--dim':'#687368','--ac':'#d96248','--on-ac':'#ffffff','--ac-ink':'#b84830','--ac-soft':'#fcebe6','--ac-bd':'#f0b7a8','--brand':'#6c8c6e','--brand-grad':'linear-gradient(135deg,#84a586 0%,#5c7b5e 100%)','--brand-tx':'#ffffff'}},
  {id:'aurora',name:'ออโรร่า',sub:'Aurora Flow',dark:true,anim:true,sw1:'#0b2d30',sw2:'#2dd4bf',
   vars:{'--bg':'#050b11','--surf':'rgba(9,18,26,.68)','--surf2':'rgba(15,28,40,.74)','--surf3':'rgba(11,22,32,.72)','--bd':'rgba(45,212,191,.30)','--tx':'#f0fdfa','--tx2':'#ccfbf1','--dim':'#8ec5be','--ac':'#2dd4bf','--on-ac':'#04221f','--ac-ink':'#5eead4','--ac-soft':'rgba(45,212,191,.18)','--ac-bd':'rgba(45,212,191,.50)','--brand':'#0a1720','--brand-grad':'linear-gradient(120deg,#0d9488 0%,#0ea5e9 50%,#7c3aed 100%)','--brand-tx':'#f0fdfa'}},
  {id:'cosmic',name:'อวกาศดาวลอย',sub:'Cosmic Drift',dark:true,anim:true,sw1:'#140d2b',sw2:'#a855f7',
   vars:{'--bg':'#050510','--surf':'rgba(13,13,29,.68)','--surf2':'rgba(22,20,46,.76)','--surf3':'rgba(16,16,36,.72)','--bd':'rgba(168,85,247,.32)','--tx':'#f5f3ff','--tx2':'#ddd6fe','--dim':'#a89ecc','--ac':'#a855f7','--on-ac':'#ffffff','--ac-ink':'#d8b4fe','--ac-soft':'rgba(168,85,247,.20)','--ac-bd':'rgba(168,85,247,.52)','--brand':'#120e28','--brand-grad':'linear-gradient(120deg,#4c1d95 0%,#7e22ce 50%,#2563eb 100%)','--brand-tx':'#f5f3ff'}},
  {id:'neongrid',name:'ไซเบอร์กริด',sub:'Neon Grid',dark:true,anim:true,sw1:'#140b24',sw2:'#f43f8e',
   vars:{'--bg':'#060514','--surf':'rgba(14,11,32,.70)','--surf2':'rgba(24,18,48,.78)','--surf3':'rgba(18,14,40,.74)','--bd':'rgba(244,63,142,.36)','--tx':'#fdf2f8','--tx2':'#fbcfe8','--dim':'#b99ec9','--ac':'#f43f8e','--on-ac':'#ffffff','--ac-ink':'#ff85c0','--ac-soft':'rgba(244,63,142,.20)','--ac-bd':'rgba(244,63,142,.56)','--brand':'#140b26','--brand-grad':'linear-gradient(120deg,#db2777 0%,#7c3aed 50%,#06b6d4 100%)','--brand-tx':'#fdf2f8'}},
  {id:'liquid',name:'ลิควิดพาสเทล',sub:'Liquid Mesh',dark:false,anim:true,sw1:'#fce7f3',sw2:'#ec4899',
   vars:{'--bg':'#f7f1ff','--surf':'rgba(255,255,255,.66)','--surf2':'rgba(246,238,255,.74)','--surf3':'rgba(255,252,255,.76)','--bd':'rgba(236,72,153,.28)','--tx':'#1f1630','--tx2':'#3f2d59','--dim':'#6a5685','--ac':'#ec4899','--on-ac':'#ffffff','--ac-ink':'#be185d','--ac-soft':'rgba(236,72,153,.15)','--ac-bd':'rgba(236,72,153,.42)','--brand':'#ec4899','--brand-grad':'linear-gradient(120deg,#ff6fae 0%,#a855f7 50%,#2dd4bf 100%)','--brand-tx':'#ffffff'}},
  {id:'sakura',name:'ซากุระร่วง',sub:'Sakura Breeze',dark:false,anim:true,sw1:'#fff0f6',sw2:'#f472b6',
   vars:{'--bg':'#fff5f8','--surf':'rgba(255,255,255,.68)','--surf2':'rgba(255,241,247,.76)','--surf3':'rgba(255,250,252,.78)','--bd':'rgba(244,114,182,.30)','--tx':'#2b1623','--tx2':'#542e45','--dim':'#855973','--ac':'#ec4899','--on-ac':'#ffffff','--ac-ink':'#be185d','--ac-soft':'rgba(244,114,182,.16)','--ac-bd':'rgba(244,114,182,.44)','--brand':'#f472b6','--brand-grad':'linear-gradient(120deg,#ff85c0 0%,#f472b6 50%,#fb7185 100%)','--brand-tx':'#ffffff'}},
  {id:'rain',name:'ฝนตก Lo-Fi',sub:'Lo-Fi Rain',dark:true,anim:true,sw1:'#0b1426',sw2:'#60a5fa',
   vars:{'--bg':'#060c18','--surf':'rgba(11,20,36,.68)','--surf2':'rgba(17,29,50,.76)','--surf3':'rgba(13,23,42,.72)','--bd':'rgba(96,165,250,.30)','--tx':'#eff6ff','--tx2':'#cbdcf7','--dim':'#8ca4cc','--ac':'#60a5fa','--on-ac':'#06152b','--ac-ink':'#93c5fd','--ac-soft':'rgba(96,165,250,.18)','--ac-bd':'rgba(96,165,250,.48)','--brand':'#0e1a30','--brand-grad':'linear-gradient(120deg,#1d4ed8 0%,#0f172a 50%,#0284c7 100%)','--brand-tx':'#eff6ff'}},
  {id:'firefly',name:'หิ่งห้อย',sub:'Firefly Glow',dark:true,anim:true,sw1:'#07140d',sw2:'#facc15',
   vars:{'--bg':'#040d09','--surf':'rgba(8,20,14,.68)','--surf2':'rgba(14,30,22,.76)','--surf3':'rgba(10,24,17,.72)','--bd':'rgba(250,204,21,.28)','--tx':'#f6fcef','--tx2':'#d7e6cc','--dim':'#91a888','--ac':'#facc15','--on-ac':'#1a1503','--ac-ink':'#fde047','--ac-soft':'rgba(250,204,21,.16)','--ac-bd':'rgba(250,204,21,.46)','--brand':'#0c1e15','--brand-grad':'linear-gradient(120deg,#14532d 0%,#365314 50%,#854d0e 100%)','--brand-tx':'#fefce8'}},
  {id:'matrix',name:'เมทริกซ์โค้ด',sub:'Matrix Rain',dark:true,anim:true,sw1:'#040d06',sw2:'#22c55e',
   vars:{'--bg':'#030905','--surf':'rgba(6,16,9,.72)','--surf2':'rgba(10,26,15,.78)','--surf3':'rgba(8,20,12,.75)','--bd':'rgba(34,197,94,.34)','--tx':'#ecfdf3','--tx2':'#bbf7d0','--dim':'#76b38b','--ac':'#22c55e','--on-ac':'#031a09','--ac-ink':'#4ade80','--ac-soft':'rgba(34,197,94,.18)','--ac-bd':'rgba(34,197,94,.52)','--brand':'#06160b','--brand-grad':'linear-gradient(120deg,#15803d 0%,#052e16 50%,#16a34a 100%)','--brand-tx':'#ecfdf3'}},
  {id:'ember',name:'สะเก็ดไฟลาวา',sub:'Ember Forge',dark:true,anim:true,sw1:'#180906',sw2:'#f97316',
   vars:{'--bg':'#0c0504','--surf':'rgba(22,11,8,.70)','--surf2':'rgba(34,17,12,.78)','--surf3':'rgba(27,13,10,.74)','--bd':'rgba(249,115,22,.34)','--tx':'#fff7ed','--tx2':'#fed7aa','--dim':'#c29274','--ac':'#f97316','--on-ac':'#1c0902','--ac-ink':'#fb923c','--ac-soft':'rgba(249,115,22,.18)','--ac-bd':'rgba(249,115,22,.52)','--brand':'#1f0d08','--brand-grad':'linear-gradient(120deg,#dc2626 0%,#ea580c 50%,#d97706 100%)','--brand-tx':'#fff7ed'}},
  {id:'deepsea',name:'ใต้ทะเลลึก',sub:'Deep Ocean',dark:true,anim:true,sw1:'#051926',sw2:'#38bdf8',
   vars:{'--bg':'#03101c','--surf':'rgba(6,22,36,.68)','--surf2':'rgba(10,33,52,.76)','--surf3':'rgba(8,27,44,.72)','--bd':'rgba(56,189,248,.32)','--tx':'#f0f9ff','--tx2':'#bae6fd','--dim':'#7db2cf','--ac':'#38bdf8','--on-ac':'#041b29','--ac-ink':'#7dd3fc','--ac-soft':'rgba(56,189,248,.18)','--ac-bd':'rgba(56,189,248,.50)','--brand':'#071f33','--brand-grad':'linear-gradient(120deg,#0369a1 0%,#0f766e 50%,#0284c7 100%)','--brand-tx':'#f0f9ff'}},
];

const FONTS = [
  {id:'noto',name:'Noto Thai',stack:"'Noto Sans Thai','Leelawadee UI','Segoe UI',sans-serif"},
  {id:'plex',name:'IBM Plex',stack:"'IBM Plex Sans Thai','Leelawadee UI','Segoe UI',sans-serif"},
  {id:'prompt',name:'Prompt',stack:"'Prompt','Leelawadee UI','Segoe UI',sans-serif"},
  {id:'sys',name:'ระบบเดิม',stack:"'Segoe UI','Leelawadee UI',sans-serif"},
];
const SIZES = [
  {id:'sm',name:'กะทัดรัด',px:'14.5px'},
  {id:'md',name:'ปกติ',px:'15.5px'},
  {id:'lg',name:'ใหญ่',px:'17px'},
];
const DENSITIES = [
  {id:'compact',name:'กะทัดรัด'},
  {id:'normal',name:'ปกติ'},
  {id:'spacious',name:'โปร่งสบาย'},
];
const ACCENT_PRESETS = ['','#e8458b','#c2552d','#f59e0b','#2563eb','#7c3aed','#10b981'];

function hexRgb(h){
  return [parseInt(h.slice(1,3),16), parseInt(h.slice(3,5),16), parseInt(h.slice(5,7),16)];
}
function shadeHex(h, f){
  const [r,g,b] = hexRgb(h);
  const cl = v => Math.max(0, Math.min(255, Math.round(v)));
  return '#' + [cl(r*f), cl(g*f), cl(b*f)].map(x => x.toString(16).padStart(2,'0')).join('');
}
function applyCustomAc(ac, isDark){
  const st = document.documentElement.style;
  const ks = ['--ac','--on-ac','--ac-ink','--ac-soft','--ac-bd','--brand','--brand-grad'];
  if (!ac || !/^#[0-9a-f]{6}$/i.test(ac)) { ks.forEach(k => st.removeProperty(k)); return; }
  const [r,g,b] = hexRgb(ac);
  const lum = (0.299*r + 0.587*g + 0.114*b) / 255;
  st.setProperty('--ac', ac);
  st.setProperty('--on-ac', lum > 0.62 ? '#0a121c' : '#ffffff');
  st.setProperty('--ac-ink', isDark ? shadeHex(ac, 1.22) : shadeHex(ac, 0.82));
  st.setProperty('--ac-soft', `rgba(${r},${g},${b},${isDark ? .18 : .13})`);
  st.setProperty('--ac-bd', `rgba(${r},${g},${b},.44)`);
  if (!isDark) {
    st.setProperty('--brand', ac);
    st.setProperty('--brand-grad', `linear-gradient(135deg,${shadeHex(ac,1.16)} 0%,${shadeHex(ac,0.88)} 100%)`);
  } else {
    st.removeProperty('--brand');
    st.removeProperty('--brand-grad');
  }
}

function withThemeRipple(ev, enabled, fn){
  if (!enabled || typeof document.startViewTransition !== 'function') { fn(); return; }
  const r = ev && ev.currentTarget && ev.currentTarget.getBoundingClientRect ? ev.currentTarget.getBoundingClientRect() : null;
  const x = r ? (r.left + r.width / 2) : ((ev && ev.clientX) || (window.innerWidth / 2));
  const y = r ? (r.top + r.height / 2) : ((ev && ev.clientY) || (window.innerHeight / 2));
  const end = Math.hypot(Math.max(x, window.innerWidth - x), Math.max(y, window.innerHeight - y));
  try {
    const vt = document.startViewTransition(() => fn());
    vt.ready.then(() => {
      document.documentElement.animate(
        {clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${end}px at ${x}px ${y}px)`]},
        {duration: 560, easing: 'cubic-bezier(.22,1,.36,1)', pseudoElement: '::view-transition-new(root)'}
      );
    }).catch(() => {});
  } catch (e) { fn(); }
}

function injectThemeCss(){
  if (typeof document === 'undefined' || !document.head || document.getElementById('pm-24-themes-css')) return;
  const lines = [];
  for (const t of THEMES) {
    const vs = Object.entries(t.vars).map(([k,v]) => `${k}:${v}`).join(';');
    lines.push(`html[data-theme="${t.id}"]{color-scheme:${t.dark ? 'dark' : 'light'};${vs}}`);
  }
  for (const f of FONTS) lines.push(`html[data-font="${f.id}"]{--font:${f.stack}}`);
  for (const s of SIZES) lines.push(`html[data-size="${s.id}"]{--fs:${s.px}}`);
  lines.push(`
@keyframes mailGradSlide{0%{background-position:0% 50%}50%{background-position:100% 50%}100%{background-position:0% 50%}}
@keyframes mailNeonBorder{0%,100%{box-shadow:0 0 0 1px var(--ac-bd),0 6px 24px rgba(0,0,0,.32)}50%{box-shadow:0 0 18px var(--ac-bd),0 6px 28px rgba(0,0,0,.38)}}
@keyframes mailSwSpin{0%{filter:hue-rotate(0deg)}100%{filter:hue-rotate(360deg)}}
#mailThemeFx{position:fixed;inset:0;width:100%;height:100%;pointer-events:none;z-index:0;display:none}
html[data-anim="1"] #mailThemeFx{display:block}
.thsw.anim{animation:mailSwSpin 5s linear infinite;box-shadow:0 0 8px rgba(168,85,247,.45)}
html[data-anim="1"] .app,html[data-anim="1"] .wrap,html[data-anim="1"] header.top,html[data-anim="1"] footer.foot{position:relative;z-index:1}
html[data-anim="1"] main{background:transparent!important}
html[data-anim="1"] .brand{background-size:240% 240%!important;animation:mailGradSlide 6s ease infinite!important}
html[data-anim="1"] #pmNavPill{animation:mailNeonBorder 3.4s ease-in-out infinite}
html[data-anim="1"][data-dark="1"] .pop-panel,html[data-anim="1"][data-dark="1"] #siteThPanel{background:rgba(12,14,24,.93)!important;backdrop-filter:blur(20px);-webkit-backdrop-filter:blur(20px)}
html[data-anim="1"][data-dark="0"] .pop-panel,html[data-anim="1"][data-dark="0"] #siteThPanel{background:rgba(255,255,255,.95)!important;backdrop-filter:blur(20px);-webkit-backdrop-filter:blur(20px)}
html[data-theme="aurora"] body{background:#040a10}
html[data-theme="aurora"] nav#nav,html[data-theme="aurora"] header.top{background:rgba(6,15,22,.66)!important;backdrop-filter:blur(14px);-webkit-backdrop-filter:blur(14px);border-color:rgba(45,212,191,.28)!important}
html[data-theme="aurora"] .card,html[data-theme="aurora"] .kpi,html[data-theme="aurora"] .lic-card,html[data-theme="aurora"] .form-box{backdrop-filter:blur(10px);-webkit-backdrop-filter:blur(10px);box-shadow:0 6px 24px rgba(13,148,136,.12),0 2px 10px rgba(0,0,0,.35)}
html[data-theme="cosmic"] body{background:#04040f}
html[data-theme="cosmic"] nav#nav,html[data-theme="cosmic"] header.top{background:rgba(10,9,25,.66)!important;backdrop-filter:blur(14px);-webkit-backdrop-filter:blur(14px);border-color:rgba(168,85,247,.30)!important}
html[data-theme="cosmic"] .card,html[data-theme="cosmic"] .kpi,html[data-theme="cosmic"] .lic-card,html[data-theme="cosmic"] .form-box{backdrop-filter:blur(10px);-webkit-backdrop-filter:blur(10px);box-shadow:0 6px 24px rgba(168,85,247,.14),0 2px 10px rgba(0,0,0,.38)}
html[data-theme="neongrid"] body{background:#060414}
html[data-theme="neongrid"] nav#nav,html[data-theme="neongrid"] header.top{background:rgba(11,8,28,.68)!important;backdrop-filter:blur(14px);-webkit-backdrop-filter:blur(14px);border-color:rgba(244,63,142,.36)!important}
html[data-theme="neongrid"] .card,html[data-theme="neongrid"] .kpi,html[data-theme="neongrid"] .lic-card,html[data-theme="neongrid"] .form-box{backdrop-filter:blur(8px);-webkit-backdrop-filter:blur(8px);border-color:rgba(244,63,142,.32)!important;box-shadow:0 0 18px rgba(244,63,142,.12),0 2px 12px rgba(0,0,0,.42)}
html[data-theme="liquid"] body{background:#f7f1ff}
html[data-theme="liquid"] nav#nav,html[data-theme="liquid"] header.top{background:rgba(255,255,255,.56)!important;backdrop-filter:blur(18px) saturate(150%);-webkit-backdrop-filter:blur(18px) saturate(150%);border-color:rgba(255,255,255,.82)!important}
html[data-theme="liquid"] .card,html[data-theme="liquid"] .kpi,html[data-theme="liquid"] .lic-card,html[data-theme="liquid"] .form-box{background:rgba(255,255,255,.68)!important;backdrop-filter:blur(12px);-webkit-backdrop-filter:blur(12px);border:1px solid rgba(255,255,255,.84)!important;box-shadow:0 8px 26px rgba(168,85,247,.10)!important}
html[data-theme="sakura"] body{background:#fff5f8}
html[data-theme="sakura"] nav#nav,html[data-theme="sakura"] header.top{background:rgba(255,248,251,.60)!important;backdrop-filter:blur(16px);-webkit-backdrop-filter:blur(16px);border-color:rgba(244,114,182,.26)!important}
html[data-theme="sakura"] .card,html[data-theme="sakura"] .kpi,html[data-theme="sakura"] .lic-card,html[data-theme="sakura"] .form-box{background:rgba(255,255,255,.70)!important;backdrop-filter:blur(11px);-webkit-backdrop-filter:blur(11px);border:1px solid rgba(244,114,182,.26)!important;box-shadow:0 8px 24px rgba(236,72,153,.09)!important}
html[data-theme="rain"] body{background:#060c18}
html[data-theme="rain"] nav#nav,html[data-theme="rain"] header.top{background:rgba(8,15,28,.68)!important;backdrop-filter:blur(14px);-webkit-backdrop-filter:blur(14px);border-color:rgba(96,165,250,.28)!important}
html[data-theme="rain"] .card,html[data-theme="rain"] .kpi,html[data-theme="rain"] .lic-card,html[data-theme="rain"] .form-box{backdrop-filter:blur(10px);-webkit-backdrop-filter:blur(10px);box-shadow:0 6px 24px rgba(59,130,246,.12),0 2px 10px rgba(0,0,0,.38)}
html[data-theme="firefly"] body{background:#040d09}
html[data-theme="firefly"] nav#nav,html[data-theme="firefly"] header.top{background:rgba(6,16,11,.68)!important;backdrop-filter:blur(14px);-webkit-backdrop-filter:blur(14px);border-color:rgba(250,204,21,.26)!important}
html[data-theme="firefly"] .card,html[data-theme="firefly"] .kpi,html[data-theme="firefly"] .lic-card,html[data-theme="firefly"] .form-box{backdrop-filter:blur(10px);-webkit-backdrop-filter:blur(10px);box-shadow:0 6px 24px rgba(250,204,21,.08),0 2px 10px rgba(0,0,0,.38)}
html[data-theme="matrix"] body{background:#030905}
html[data-theme="matrix"] nav#nav,html[data-theme="matrix"] header.top{background:rgba(4,12,7,.72)!important;backdrop-filter:blur(12px);-webkit-backdrop-filter:blur(12px);border-color:rgba(34,197,94,.32)!important}
html[data-theme="matrix"] .card,html[data-theme="matrix"] .kpi,html[data-theme="matrix"] .lic-card,html[data-theme="matrix"] .form-box{backdrop-filter:blur(8px);-webkit-backdrop-filter:blur(8px);box-shadow:0 0 18px rgba(34,197,94,.10),0 2px 10px rgba(0,0,0,.42)}
html[data-theme="ember"] body{background:#0c0504}
html[data-theme="ember"] nav#nav,html[data-theme="ember"] header.top{background:rgba(18,8,6,.70)!important;backdrop-filter:blur(14px);-webkit-backdrop-filter:blur(14px);border-color:rgba(249,115,22,.32)!important}
html[data-theme="ember"] .card,html[data-theme="ember"] .kpi,html[data-theme="ember"] .lic-card,html[data-theme="ember"] .form-box{backdrop-filter:blur(10px);-webkit-backdrop-filter:blur(10px);box-shadow:0 6px 24px rgba(249,115,22,.12),0 2px 12px rgba(0,0,0,.42)}
html[data-theme="deepsea"] body{background:#03101c}
html[data-theme="deepsea"] nav#nav,html[data-theme="deepsea"] header.top{background:rgba(5,18,30,.68)!important;backdrop-filter:blur(14px);-webkit-backdrop-filter:blur(14px);border-color:rgba(56,189,248,.30)!important}
html[data-theme="deepsea"] .card,html[data-theme="deepsea"] .kpi,html[data-theme="deepsea"] .lic-card,html[data-theme="deepsea"] .form-box{backdrop-filter:blur(10px);-webkit-backdrop-filter:blur(10px);box-shadow:0 6px 24px rgba(56,189,248,.12),0 2px 10px rgba(0,0,0,.38)}
::view-transition-old(root),::view-transition-new(root){animation:none;mix-blend-mode:normal}
::view-transition-old(root){z-index:1}
::view-transition-new(root){z-index:99999}
`);
  const st = document.createElement('style');
  st.id = 'pm-24-themes-css';
  st.textContent = lines.join('\n');
  document.head.appendChild(st);
}

// ---------- Living Animated Theme Canvas Engine (10 themes + interactive Mouse React) ----------
let fxRaf = 0, fxMode = '', fxLast = 0, fxMouseEnabled = true;
let fxStars = [], fxMeteors = [], fxSparks = [], fxOrbs = [], fxPetals = [];
let fxRain = [], fxRipples = [], fxFlies = [], fxMat = [], fxEmbers = [], fxBubbles = [];
const fxM = {x: -999, y: -999, t: 0};
const FX_MCH = '0123456789ABCDEFXYZ#$%@*+=<>アイウエオカキクケコサシスセソタチツテト';

function ensureCanvas(){
  if (typeof document === 'undefined') return null;
  let cv = document.getElementById('mailThemeFx');
  if (!cv && document.body) {
    cv = document.createElement('canvas');
    cv.id = 'mailThemeFx';
    cv.setAttribute('aria-hidden', 'true');
    if (document.body.prepend) document.body.prepend(cv);
    else document.body.appendChild(cv);
  }
  return cv;
}

function fxInitPool(mode, W, H){
  if (mode === 'cosmic') {
    fxStars = Array.from({length:110}, () => ({x:Math.random()*W, y:Math.random()*H, r:.7+Math.random()*2.1, sp:.18+Math.random()*.65, ph:Math.random()*6.28, col:['#ffffff','#d8b4fe','#93c5fd','#f9a8d4'][Math.floor(Math.random()*4)]}));
    fxMeteors = [];
  } else if (mode === 'neongrid') {
    fxSparks = Array.from({length:38}, () => ({x:Math.random()*W, y:Math.random()*H, vy:-.9-Math.random()*1.8, len:14+Math.random()*26, col:Math.random()>.45?'#22d3ee':'#f43f8e'}));
  } else if (mode === 'liquid') {
    const cols = [[255,111,174],[168,85,247],[45,212,191],[251,146,60],[96,165,250]];
    fxOrbs = Array.from({length:12}, (_,i) => ({x:Math.random()*W, y:Math.random()*H, r:110+Math.random()*160, vx:(Math.random()-.5)*1.1, vy:(Math.random()-.5)*1.1, c:cols[i%cols.length]}));
  } else if (mode === 'sakura') {
    const pcols = ['#f9a8d4','#f472b6','#fbcfe8','#fda4af'];
    fxPetals = Array.from({length:46}, (_,i) => ({x:Math.random()*W, y:Math.random()*H, sz:6+Math.random()*8, vx:-.6-Math.random()*.9, vy:.7+Math.random()*1.1, rot:Math.random()*6.28, vr:(Math.random()-.5)*.06, sw:Math.random()*6.28, col:pcols[i%pcols.length]}));
  } else if (mode === 'rain') {
    fxRain = Array.from({length:85}, () => ({x:Math.random()*W, y:Math.random()*H, len:14+Math.random()*24, vy:8+Math.random()*7, al:.22+Math.random()*.35}));
    fxRipples = [];
  } else if (mode === 'firefly') {
    fxFlies = Array.from({length:55}, () => ({x:Math.random()*W, y:Math.random()*H, vx:(Math.random()-.5)*.7, vy:(Math.random()-.5)*.7, r:2+Math.random()*3, ph:Math.random()*6.28, col:Math.random()>.35?[250,204,21]:[74,222,128]}));
  } else if (mode === 'matrix') {
    const cols = Math.max(12, Math.floor(W/22));
    fxMat = Array.from({length:cols}, (_,i) => ({x:i*22+6, y:Math.random()*H, sp:4+Math.random()*7, len:8+Math.floor(Math.random()*14)}));
  } else if (mode === 'ember') {
    fxEmbers = Array.from({length:72}, () => ({x:Math.random()*W, y:H*Math.random(), vx:(Math.random()-.5)*.9, vy:-1.2-Math.random()*2.6, r:1.2+Math.random()*3.2, ph:Math.random()*6.28, col:Math.random()>.45?[249,115,22]:Math.random()>.5?[250,204,21]:[239,68,68]}));
  } else if (mode === 'deepsea') {
    fxBubbles = Array.from({length:48}, () => ({x:Math.random()*W, y:Math.random()*H, r:3+Math.random()*10, vy:-.55-Math.random()*1.3, ph:Math.random()*6.28}));
  }
}

function fxFrame(now){
  const cv = ensureCanvas();
  if (!fxMode || (typeof document !== 'undefined' && document.hidden) || !cv) { fxRaf = 0; return; }
  if (typeof requestAnimationFrame === 'function') fxRaf = requestAnimationFrame(fxFrame);
  if (now - fxLast < 28) return;
  fxLast = now;
  const W = (typeof window !== 'undefined' && window.innerWidth) || 1280;
  const H = (typeof window !== 'undefined' && window.innerHeight) || 720;
  if (cv.width !== W || cv.height !== H) { cv.width = W; cv.height = H; fxInitPool(fxMode, W, H); }
  const ctx = cv.getContext ? cv.getContext('2d') : null;
  if (!ctx) return;
  const t = now * 0.001, mOn = fxMouseEnabled && (now - fxM.t < 4000);

  if (fxMode === 'aurora') {
    ctx.fillStyle = '#040a10'; ctx.fillRect(0, 0, W, H);
    ctx.save(); ctx.globalCompositeOperation = 'lighter';
    const myOff = mOn ? (fxM.y / H - .5) * 45 : 0;
    const bands = [
      {y:H*.24+myOff*.5, amp:65, f:.0032, sp:1.05, c1:'rgba(16,185,129,.42)', c2:'rgba(6,182,212,0)'},
      {y:H*.42+myOff, amp:80, f:.0026, sp:-.82, c1:'rgba(6,182,212,.38)', c2:'rgba(139,92,246,0)'},
      {y:H*.60+myOff*.7, amp:70, f:.0038, sp:.72, c1:'rgba(139,92,246,.34)', c2:'rgba(45,212,191,0)'},
    ];
    for (const b of bands) {
      ctx.beginPath(); ctx.moveTo(0, H);
      for (let x = 0; x <= W; x += 28) {
        const y = b.y + Math.sin(x*b.f + t*b.sp)*b.amp + Math.cos(x*b.f*1.7 - t*b.sp*.7)*(b.amp*.45);
        ctx.lineTo(x, y);
      }
      ctx.lineTo(W, H); ctx.closePath();
      const g = ctx.createLinearGradient(0, b.y - b.amp*1.4, 0, b.y + 260);
      g.addColorStop(0, 'rgba(0,0,0,0)'); g.addColorStop(.32, b.c1); g.addColorStop(1, b.c2);
      ctx.fillStyle = g; ctx.fill();
    }
    for (let i = 0; i < 24; i++) {
      const sx = ((i*173 + t*26) % W), sy = ((i*97 + Math.sin(t+i)*24 + H) % H);
      ctx.fillStyle = `rgba(94,234,212,${(.25+.35*Math.sin(t*2.4+i)).toFixed(2)})`;
      ctx.beginPath(); ctx.arc(sx, sy, 1.6, 0, 6.28); ctx.fill();
    }
    ctx.restore();
  } else if (fxMode === 'cosmic') {
    ctx.fillStyle = '#04040f'; ctx.fillRect(0, 0, W, H);
    const nb1 = ctx.createRadialGradient(W*(.25+.08*Math.sin(t*.4)), H*(.28+.06*Math.cos(t*.3)), 10, W*.25, H*.28, W*.42);
    nb1.addColorStop(0, 'rgba(168,85,247,.34)'); nb1.addColorStop(1, 'rgba(0,0,0,0)'); ctx.fillStyle = nb1; ctx.fillRect(0, 0, W, H);
    const nb2 = ctx.createRadialGradient(W*(.78+.07*Math.cos(t*.35)), H*(.72+.07*Math.sin(t*.4)), 10, W*.78, H*.72, W*.4);
    nb2.addColorStop(0, 'rgba(59,130,246,.30)'); nb2.addColorStop(1, 'rgba(0,0,0,0)'); ctx.fillStyle = nb2; ctx.fillRect(0, 0, W, H);
    for (const s of fxStars) {
      s.x -= s.sp; s.y -= s.sp*.35;
      if (mOn) { const dx = s.x-fxM.x, dy = s.y-fxM.y, d2 = dx*dx+dy*dy; if (d2<14400 && d2>1) { const d = Math.sqrt(d2); s.x += dx/d*1.6; s.y += dy/d*1.6; } }
      if (s.x < -4) s.x = W+4; if (s.x > W+4) s.x = -4; if (s.y < -4) s.y = H+4; if (s.y > H+4) s.y = -4;
      ctx.globalAlpha = .38 + .62*Math.abs(Math.sin(t*2.2 + s.ph)); ctx.fillStyle = s.col;
      ctx.beginPath(); ctx.arc(s.x, s.y, s.r, 0, 6.28); ctx.fill();
    }
    ctx.globalAlpha = 1;
    if (Math.random() < .03 && fxMeteors.length < 3) fxMeteors.push({x:W*(.3+Math.random()*.8), y:-10, vx:-11-Math.random()*6, vy:6+Math.random()*4, life:1});
    for (let i = fxMeteors.length - 1; i >= 0; i--) {
      const m = fxMeteors[i]; m.x += m.vx; m.y += m.vy; m.life -= .024;
      if (m.life <= 0 || m.x < -80 || m.y > H+80) { fxMeteors.splice(i, 1); continue; }
      const mg = ctx.createLinearGradient(m.x, m.y, m.x - m.vx*7, m.y - m.vy*7);
      mg.addColorStop(0, `rgba(255,255,255,${m.life.toFixed(2)})`); mg.addColorStop(1, 'rgba(168,85,247,0)');
      ctx.strokeStyle = mg; ctx.lineWidth = 2.2; ctx.beginPath(); ctx.moveTo(m.x, m.y); ctx.lineTo(m.x - m.vx*7, m.y - m.vy*7); ctx.stroke();
    }
  } else if (fxMode === 'neongrid') {
    ctx.fillStyle = '#060414'; ctx.fillRect(0, 0, W, H);
    const hy = H*.44, vp = mOn ? (W*.55 + (fxM.x - W*.5)*.12) : W*.55;
    const sun = ctx.createRadialGradient(vp, hy, 10, vp, hy, W*.45);
    sun.addColorStop(0, 'rgba(244,63,142,.42)'); sun.addColorStop(.45, 'rgba(124,58,237,.22)'); sun.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = sun; ctx.fillRect(0, 0, W, H);
    ctx.strokeStyle = 'rgba(34,211,238,.28)'; ctx.lineWidth = 1;
    for (let i = -18; i <= 18; i++) { ctx.beginPath(); ctx.moveTo(vp + i*24, hy); ctx.lineTo(vp + i*155, H); ctx.stroke(); }
    const rows = 14, off = (t*1.15) % 1; ctx.strokeStyle = 'rgba(244,63,142,.36)';
    for (let j = 0; j < rows; j++) { const p = Math.pow((j+off)/rows, 2.1), y = hy + p*(H-hy); ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke(); }
    ctx.strokeStyle = 'rgba(34,211,238,.55)'; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.moveTo(0, hy); ctx.lineTo(W, hy); ctx.stroke();
    for (const sp of fxSparks) {
      sp.y += sp.vy; if (sp.y < -30) { sp.y = H+20; sp.x = Math.random()*W; }
      ctx.strokeStyle = sp.col; ctx.globalAlpha = .72; ctx.lineWidth = 1.8;
      ctx.beginPath(); ctx.moveTo(sp.x, sp.y); ctx.lineTo(sp.x, sp.y + sp.len); ctx.stroke();
    }
    ctx.globalAlpha = 1;
  } else if (fxMode === 'liquid') {
    ctx.fillStyle = '#f7f1ff'; ctx.fillRect(0, 0, W, H);
    for (const o of fxOrbs) {
      o.x += o.vx; o.y += o.vy;
      if (mOn) { const dx = o.x-fxM.x, dy = o.y-fxM.y, d2 = dx*dx+dy*dy; if (d2<40000 && d2>1) { const d = Math.sqrt(d2); o.x += dx/d*1.4; o.y += dy/d*1.4; } }
      if (o.x < -o.r) o.x = W+o.r; if (o.x > W+o.r) o.x = -o.r; if (o.y < -o.r) o.y = H+o.r; if (o.y > H+o.r) o.y = -o.r;
      const g = ctx.createRadialGradient(o.x, o.y, 10, o.x, o.y, o.r);
      g.addColorStop(0, `rgba(${o.c[0]},${o.c[1]},${o.c[2]},.48)`); g.addColorStop(1, `rgba(${o.c[0]},${o.c[1]},${o.c[2]},0)`);
      ctx.fillStyle = g; ctx.beginPath(); ctx.arc(o.x, o.y, o.r, 0, 6.28); ctx.fill();
    }
  } else if (fxMode === 'sakura') {
    const bg = ctx.createLinearGradient(0, 0, W, H);
    bg.addColorStop(0, '#fff5f8'); bg.addColorStop(.5, '#ffeef6'); bg.addColorStop(1, '#f8efff');
    ctx.fillStyle = bg; ctx.fillRect(0, 0, W, H);
    for (const p of fxPetals) {
      p.x += p.vx + Math.sin(t*1.3 + p.sw)*.55; p.y += p.vy; p.rot += p.vr;
      if (mOn) { const dx = p.x-fxM.x, dy = p.y-fxM.y, d2 = dx*dx+dy*dy; if (d2<22500 && d2>1) { const d = Math.sqrt(d2); p.x += dx/d*2.4; p.y += dy/d*1.8; } }
      if (p.y > H+20) { p.y = -18; p.x = Math.random()*W; } if (p.x < -24) p.x = W+18; if (p.x > W+24) p.x = -18;
      ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(p.rot); ctx.scale(1, .58 + .32*Math.sin(t*2 + p.sw));
      ctx.fillStyle = p.col; ctx.globalAlpha = .82;
      ctx.beginPath(); ctx.moveTo(0, -p.sz);
      ctx.bezierCurveTo(p.sz, -p.sz*.6, p.sz*.8, p.sz, 0, p.sz);
      ctx.bezierCurveTo(-p.sz*.8, p.sz, -p.sz, -p.sz*.6, 0, -p.sz);
      ctx.fill(); ctx.restore();
    }
    ctx.globalAlpha = 1;
  } else if (fxMode === 'rain') {
    ctx.fillStyle = '#060c18'; ctx.fillRect(0, 0, W, H);
    const bk1 = ctx.createRadialGradient(W*.2, H*.25, 10, W*.2, H*.25, 220);
    bk1.addColorStop(0, 'rgba(59,130,246,.22)'); bk1.addColorStop(1, 'rgba(0,0,0,0)'); ctx.fillStyle = bk1; ctx.fillRect(0, 0, W, H);
    const bk2 = ctx.createRadialGradient(W*.82, H*.3, 10, W*.82, H*.3, 200);
    bk2.addColorStop(0, 'rgba(244,114,182,.16)'); bk2.addColorStop(1, 'rgba(0,0,0,0)'); ctx.fillStyle = bk2; ctx.fillRect(0, 0, W, H);
    ctx.lineWidth = 1.3; ctx.lineCap = 'round';
    for (const d of fxRain) {
      d.y += d.vy; d.x -= d.vy*.22;
      if (d.y > H) { if (fxRipples.length < 16 && Math.random() < .35) fxRipples.push({x:d.x, y:H-8-Math.random()*36, r:2, al:.55}); d.y = -24; d.x = Math.random()*(W+180); }
      ctx.strokeStyle = `rgba(147,197,253,${d.al.toFixed(2)})`;
      ctx.beginPath(); ctx.moveTo(d.x, d.y); ctx.lineTo(d.x + d.len*.22, d.y - d.len); ctx.stroke();
    }
    if (mOn && Math.random() < .12 && fxRipples.length < 18) fxRipples.push({x:fxM.x, y:fxM.y, r:4, al:.48});
    for (let i = fxRipples.length - 1; i >= 0; i--) {
      const rp = fxRipples[i]; rp.r += 1.4; rp.al -= .022;
      if (rp.al <= 0) { fxRipples.splice(i, 1); continue; }
      ctx.strokeStyle = `rgba(147,197,253,${rp.al.toFixed(2)})`; ctx.lineWidth = 1.2;
      ctx.beginPath(); ctx.ellipse(rp.x, rp.y, rp.r, rp.r*.38, 0, 0, 6.28); ctx.stroke();
    }
  } else if (fxMode === 'firefly') {
    ctx.fillStyle = '#040d09'; ctx.fillRect(0, 0, W, H);
    const fg = ctx.createRadialGradient(W*.5, H*.85, 20, W*.5, H*.85, W*.55);
    fg.addColorStop(0, 'rgba(20,83,45,.34)'); fg.addColorStop(1, 'rgba(0,0,0,0)'); ctx.fillStyle = fg; ctx.fillRect(0, 0, W, H);
    for (const f of fxFlies) {
      f.x += f.vx + Math.sin(t*1.1 + f.ph)*.38; f.y += f.vy + Math.cos(t*.9 + f.ph)*.32;
      if (mOn) { const dx = fxM.x-f.x, dy = fxM.y-f.y, d2 = dx*dx+dy*dy; if (d2<48000 && d2>400) { const d = Math.sqrt(d2); f.x += dx/d*1.1; f.y += dy/d*1.1; } }
      if (f.x < -15) f.x = W+15; if (f.x > W+15) f.x = -15; if (f.y < -15) f.y = H+15; if (f.y > H+15) f.y = -15;
      const gl = .25 + .75*Math.abs(Math.sin(t*1.8 + f.ph));
      const g = ctx.createRadialGradient(f.x, f.y, 0, f.x, f.y, f.r*6.5);
      g.addColorStop(0, `rgba(${f.col[0]},${f.col[1]},${f.col[2]},${gl.toFixed(2)})`); g.addColorStop(1, `rgba(${f.col[0]},${f.col[1]},${f.col[2]},0)`);
      ctx.fillStyle = g; ctx.beginPath(); ctx.arc(f.x, f.y, f.r*6.5, 0, 6.28); ctx.fill();
    }
  } else if (fxMode === 'matrix') {
    ctx.fillStyle = 'rgba(3,9,5,.28)'; ctx.fillRect(0, 0, W, H);
    ctx.font = '700 14px monospace';
    for (const c of fxMat) {
      c.y += c.sp; if (c.y - c.len*16 > H) { c.y = -Math.random()*120; c.sp = 4 + Math.random()*7; }
      const near = mOn && Math.abs(c.x - fxM.x) < 65;
      for (let k = 0; k < c.len; k++) {
        const cy = c.y - k*16; if (cy < -16 || cy > H+16) continue;
        const ch = FX_MCH[Math.floor((c.x + cy + t*14) % FX_MCH.length + FX_MCH.length) % FX_MCH.length];
        ctx.fillStyle = k === 0 ? (near ? '#ffffff' : '#bbf7d0') : `rgba(34,197,94,${((1 - k/c.len)*(near ? .95 : .55)).toFixed(2)})`;
        ctx.fillText(ch, c.x, cy);
      }
    }
  } else if (fxMode === 'ember') {
    ctx.fillStyle = '#0c0504'; ctx.fillRect(0, 0, W, H);
    const eg = ctx.createLinearGradient(0, H*.55, 0, H);
    eg.addColorStop(0, 'rgba(0,0,0,0)'); eg.addColorStop(1, 'rgba(220,38,38,.36)'); ctx.fillStyle = eg; ctx.fillRect(0, 0, W, H);
    for (const e of fxEmbers) {
      e.x += e.vx + Math.sin(t*2.4 + e.ph)*.65; e.y += e.vy;
      if (mOn) { const dx = e.x-fxM.x, dy = e.y-fxM.y, d2 = dx*dx+dy*dy; if (d2<25600 && d2>1) { const d = Math.sqrt(d2); e.x += dx/d*2.2; e.y -= 1.6; } }
      if (e.y < -15) { e.y = H+10; e.x = Math.random()*W; } if (e.x < -15) e.x = W+15; if (e.x > W+15) e.x = -15;
      const al = .45 + .55*Math.abs(Math.sin(t*4 + e.ph));
      const g = ctx.createRadialGradient(e.x, e.y, 0, e.x, e.y, e.r*4);
      g.addColorStop(0, `rgba(${e.col[0]},${e.col[1]},${e.col[2]},${al.toFixed(2)})`); g.addColorStop(1, `rgba(${e.col[0]},${e.col[1]},${e.col[2]},0)`);
      ctx.fillStyle = g; ctx.beginPath(); ctx.arc(e.x, e.y, e.r*4, 0, 6.28); ctx.fill();
    }
  } else if (fxMode === 'deepsea') {
    const og = ctx.createLinearGradient(0, 0, 0, H);
    og.addColorStop(0, '#06253b'); og.addColorStop(1, '#020b14'); ctx.fillStyle = og; ctx.fillRect(0, 0, W, H);
    ctx.save(); ctx.globalCompositeOperation = 'lighter';
    for (let r = 0; r < 4; r++) {
      const rx = W*(.18 + r*.22) + Math.sin(t*.6 + r)*45;
      const rg = ctx.createLinearGradient(rx, 0, rx+80, H*.85);
      rg.addColorStop(0, 'rgba(56,189,248,.20)'); rg.addColorStop(1, 'rgba(56,189,248,0)');
      ctx.fillStyle = rg; ctx.beginPath(); ctx.moveTo(rx-40, 0); ctx.lineTo(rx+50, 0); ctx.lineTo(rx+180, H*.9); ctx.lineTo(rx-10, H*.9); ctx.closePath(); ctx.fill();
    }
    ctx.restore();
    for (const b of fxBubbles) {
      b.y += b.vy; b.x += Math.sin(t*1.6 + b.ph)*.45;
      if (mOn) { const dx = b.x-fxM.x, dy = b.y-fxM.y, d2 = dx*dx+dy*dy; if (d2<22500 && d2>1) { const d = Math.sqrt(d2); b.x += dx/d*2; b.y += dy/d*1.5; } }
      if (b.y < -20) { b.y = H+20; b.x = Math.random()*W; }
      ctx.strokeStyle = 'rgba(125,211,252,.52)'; ctx.lineWidth = 1.2; ctx.beginPath(); ctx.arc(b.x, b.y, b.r, 0, 6.28); ctx.stroke();
      ctx.fillStyle = 'rgba(224,242,254,.55)'; ctx.beginPath(); ctx.arc(b.x - b.r*.32, b.y - b.r*.32, Math.max(1.2, b.r*.24), 0, 6.28); ctx.fill();
    }
  }
}

function sync(themeId, isAnim, mouseOn){
  fxMouseEnabled = mouseOn !== false;
  injectThemeCss();
  const cv = ensureCanvas();
  const reduced = typeof window !== 'undefined' && typeof window.matchMedia === 'function' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (!isAnim || !cv || reduced) {
    fxMode = '';
    if (fxRaf && typeof cancelAnimationFrame === 'function') { cancelAnimationFrame(fxRaf); fxRaf = 0; }
    return;
  }
  const changed = fxMode !== themeId;
  fxMode = themeId;
  if (changed) {
    const W = (typeof window !== 'undefined' && window.innerWidth) || 1280;
    const H = (typeof window !== 'undefined' && window.innerHeight) || 720;
    cv.width = W; cv.height = H;
    const ctx = cv.getContext ? cv.getContext('2d') : null;
    if (ctx) ctx.clearRect(0, 0, W, H);
    fxInitPool(fxMode, W, H);
  }
  if (!fxRaf && typeof requestAnimationFrame === 'function') fxRaf = requestAnimationFrame(fxFrame);
}

if (typeof document !== 'undefined' && document.addEventListener) {
  document.addEventListener('mousemove', e => {
    if (!fxMode || !fxMouseEnabled) return;
    fxM.x = e.clientX; fxM.y = e.clientY;
    fxM.t = (typeof performance !== 'undefined' && performance.now) ? performance.now() : Date.now();
  }, {passive: true});
  document.addEventListener('visibilitychange', () => {
    if (!document.hidden && fxMode && !fxRaf && typeof requestAnimationFrame === 'function') {
      fxRaf = requestAnimationFrame(fxFrame);
    }
  });
}

// ---------- Standalone Website Theme Picker Widget (for docs/index.html & static/site.html) ----------
function mountSitePicker(opts){
  const cfg = Object.assign({buttonId:'siteThBtn', panelId:'siteThPanel', defaultTheme:'ocean', prefsKey:'pulsemetrics_suite_prefs'}, opts || {});
  injectThemeCss();
  const E = s => String(s ?? '').replace(/[&<>"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
  let saved = {};
  let hadSaved = false;
  try {
    const raw = localStorage.getItem(cfg.prefsKey);
    if (raw) { saved = JSON.parse(raw) || {}; hadSaved = !!saved.theme; }
  } catch(e){}
  const pr = Object.assign({theme: hadSaved ? saved.theme : cfg.defaultTheme, font:'noto', accent:'', fx_mouse:true, theme_ripple:true}, saved);
  if (!THEMES.some(t => t.id === pr.theme)) pr.theme = cfg.defaultTheme;
  let tab = 'static';
  try {
    const st = localStorage.getItem('pulsemetrics_th_tab');
    if (st && ['static','anim','sys'].includes(st)) tab = st;
    else if ((THEMES.find(t => t.id === pr.theme) || {}).anim) tab = 'anim';
  } catch(e){}

  function persist(){
    try {
      const cur = JSON.parse(localStorage.getItem(cfg.prefsKey) || '{}');
      Object.assign(cur, {theme:pr.theme, font:pr.font, accent:pr.accent, fx_mouse:pr.fx_mouse, theme_ripple:pr.theme_ripple});
      localStorage.setItem(cfg.prefsKey, JSON.stringify(cur));
    } catch(e){}
  }
  function apply(save){
    const h = document.documentElement;
    const tObj = THEMES.find(t => t.id === pr.theme) || THEMES[0];
    h.setAttribute('data-theme', tObj.id);
    h.setAttribute('data-dark', tObj.dark ? '1' : '0');
    h.setAttribute('data-anim', tObj.anim ? '1' : '0');
    h.setAttribute('data-font', pr.font || 'noto');
    applyCustomAc(pr.accent, !!tObj.dark);
    sync(tObj.id, !!tObj.anim, pr.fx_mouse !== false);
    const btn = document.getElementById(cfg.buttonId);
    if (btn) {
      const dot = btn.querySelector('.sth-dot');
      if (dot) dot.style.background = pr.accent || tObj.sw2;
      const lbl = btn.querySelector('.sth-lbl');
      if (lbl) lbl.textContent = 'ธีม: ' + tObj.name;
    }
    if (save) persist();
  }
  function draw(){
    const P = document.getElementById(cfg.panelId);
    if (!P) return;
    const tObj = THEMES.find(t => t.id === pr.theme) || THEMES[0];
    const statTh = THEMES.filter(t => !t.anim), animTh = THEMES.filter(t => t.anim);
    const thBtn = t => `<button type="button" class="sth-opt ${pr.theme===t.id?'on':''}" data-th="${t.id}"><span class="thsw ${t.anim?'anim':''}" style="background:linear-gradient(135deg,${t.sw1} 50%,${t.sw2} 50%)"></span><span class="sth-nm">${E(t.name)}<small>${E(t.sub)}</small></span></button>`;
    let body = '';
    if (tab === 'static') {
      body = `<div class="sth-grid">${statTh.map(thBtn).join('')}</div>`
        + `<div class="sth-sec">สีธีมกำหนดเอง (Custom Accent)</div><div class="sth-dots">`
        + ACCENT_PRESETS.map(c => `<button type="button" class="sth-cdot ${pr.accent===c?'on':''}" data-ac="${c}" title="${c||'ค่าเริ่มต้นธีม'}" style="background:${c||'conic-gradient(#ff6fae,#3b82f6,#10b981,#ff6fae)'}"></button>`).join('')
        + `<input type="color" id="sth-col" value="${E(pr.accent||tObj.sw2)}" title="เลือกสีอิสระ"></div>`;
    } else if (tab === 'anim') {
      body = `<div class="sth-grid">${animTh.map(thBtn).join('')}</div>`
        + `<div class="sth-sec">เอฟเฟกต์แอนิเมชัน (ชุดเดียวกับแอป Mail)</div><div class="sth-segs">`
        + `<button type="button" class="sth-seg ${pr.fx_mouse!==false?'on':''}" id="sth-mouse">เมาส์โต้ตอบ: ${pr.fx_mouse!==false?'เปิด':'ปิด'}</button>`
        + `<button type="button" class="sth-seg ${pr.theme_ripple!==false?'on':''}" id="sth-rip">ธีมวงกลม: ${pr.theme_ripple!==false?'เปิด':'ปิด'}</button></div>`;
    } else {
      body = `<div class="sth-sec" style="margin-top:2px">ฟอนต์ภาษาไทย</div><div class="sth-segs">`
        + FONTS.map(f => `<button type="button" class="sth-seg ${pr.font===f.id?'on':''}" data-fn="${f.id}">${E(f.name)}</button>`).join('') + `</div>`
        + `<div class="sth-note">ธีมที่เลือกจะซิงก์กับหน้าแดชบอร์ด Demo อัตโนมัติเมื่อกดเข้าเล่นครับ</div>`;
    }
    P.innerHTML = `<div class="sth-hd"><div><b>ธีม PulseMetrics (24 แบบ)</b><small>${E(tObj.name)} · ชุดเดียวกับแอป Mail</small></div><button type="button" class="sth-rst" id="sth-rst">รีเซ็ต</button></div>`
      + `<div class="sth-tabs">`
      + `<button type="button" class="sth-tab ${tab==='static'?'on':''}" data-tht="static">ธีมสี (${statTh.length})</button>`
      + `<button type="button" class="sth-tab ${tab==='anim'?'on':''}" data-tht="anim">อนิเมชั่น (${animTh.length})</button>`
      + `<button type="button" class="sth-tab ${tab==='sys'?'on':''}" data-tht="sys">ฟอนต์</button></div>`
      + body
      + `<div class="sth-ft"><button type="button" class="sth-q" id="sth-flip">${tObj.dark?'สลับโหมดสว่าง':'สลับโหมดมืด'}</button><button type="button" class="sth-q" id="sth-cls">ปิด</button></div>`;
    P.querySelectorAll('[data-tht]').forEach(b => b.onclick = e => { e.stopPropagation(); tab = b.dataset.tht; try{localStorage.setItem('pulsemetrics_th_tab', tab);}catch(err){} draw(); });
    P.querySelectorAll('[data-th]').forEach(b => b.onclick = e => {
      e.stopPropagation();
      withThemeRipple(e, pr.theme_ripple !== false, () => { pr.theme = b.dataset.th; pr.accent = ''; apply(true); draw(); });
    });
    P.querySelectorAll('[data-ac]').forEach(b => b.onclick = e => { e.stopPropagation(); pr.accent = b.dataset.ac; apply(true); draw(); });
    P.querySelectorAll('[data-fn]').forEach(b => b.onclick = e => { e.stopPropagation(); pr.font = b.dataset.fn; apply(true); draw(); });
    const col = document.getElementById('sth-col');
    if (col) { col.onclick = e => e.stopPropagation(); col.oninput = e => { pr.accent = e.target.value.toLowerCase(); apply(true); }; }
    const ms = document.getElementById('sth-mouse'); if (ms) ms.onclick = e => { e.stopPropagation(); pr.fx_mouse = !(pr.fx_mouse !== false); apply(true); draw(); };
    const rp = document.getElementById('sth-rip'); if (rp) rp.onclick = e => { e.stopPropagation(); pr.theme_ripple = !(pr.theme_ripple !== false); apply(true); draw(); };
    const fl = document.getElementById('sth-flip'); if (fl) fl.onclick = e => { e.stopPropagation(); withThemeRipple(e, pr.theme_ripple !== false, () => { pr.theme = tObj.dark ? 'ocean' : 'aurora'; pr.accent = ''; apply(true); draw(); }); };
    const rst = document.getElementById('sth-rst'); if (rst) rst.onclick = e => { e.stopPropagation(); withThemeRipple(e, pr.theme_ripple !== false, () => { pr.theme = cfg.defaultTheme; pr.font = 'noto'; pr.accent = ''; pr.fx_mouse = true; pr.theme_ripple = true; apply(true); draw(); }); };
    const cls = document.getElementById('sth-cls'); if (cls) cls.onclick = e => { e.stopPropagation(); P.classList.remove('open'); };
  }

  const btn = document.getElementById(cfg.buttonId);
  const P = document.getElementById(cfg.panelId);
  if (btn && P) {
    btn.onclick = e => { e.stopPropagation(); const was = P.classList.contains('open'); if (!was) draw(); P.classList.toggle('open', !was); };
    document.addEventListener('click', e => { if (!e.target.closest('#' + cfg.panelId) && !e.target.closest('#' + cfg.buttonId)) P.classList.remove('open'); });
    document.addEventListener('keydown', e => { if (e.key === 'Escape') P.classList.remove('open'); });
  }
  apply(false);
  return {apply, draw, prefs: pr};
}

window.PM_THEME_FX = {
  THEMES, FONTS, SIZES, DENSITIES, ACCENT_PRESETS,
  hexRgb, shadeHex, applyCustomAc, withThemeRipple,
  injectThemeCss, sync, mountSitePicker,
};
})();
