/* PulseMetrics Business Suite — Live Core Engine (24 Mail Themes + Living FX + Motion + Real API Store) */
(function(){
'use strict';

const ICONS = {
  chat: '<path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>',
  chats: '<path d="M14 9a2 2 0 0 1-2 2H6l-4 4V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2z"/><path d="M18 9h2a2 2 0 0 1 2 2v11l-4-4h-6a2 2 0 0 1-2-2v-1"/>',
  clipboard: '<rect x="8" y="2" width="8" height="4" rx="1"/><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><path d="M12 11h4"/><path d="M12 16h4"/><path d="M8 11h.01"/><path d="M8 16h.01"/>',
  megaphone: '<path d="m3 11 18-5v12L3 14v-3z"/><path d="M11.6 16.8a3 3 0 1 1-5.8-1.6"/>',
  target: '<circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/>',
  calendar: '<rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4"/><path d="M8 2v4"/><path d="M3 10h18"/>',
  chart: '<path d="M3 3v18h18"/><path d="M18 17V9"/><path d="M13 17V5"/><path d="M8 17v-3"/>',
  anchor: '<circle cx="12" cy="5" r="3"/><path d="M12 22V8"/><path d="M5 12H2a10 10 0 0 0 20 0h-3"/>',
  refresh: '<path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"/><path d="M21 3v5h-5"/><path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"/><path d="M8 16H3v5"/>',
  link: '<path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>',
  sparkles: '<path d="m12 3-1.9 5.8a2 2 0 0 1-1.3 1.3L3 12l5.8 1.9a2 2 0 0 1 1.3 1.3L12 21l1.9-5.8a2 2 0 0 1 1.3-1.3L21 12l-5.8-1.9a2 2 0 0 1-1.3-1.3Z"/>',
  pen: '<path d="M12 20h9"/><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z"/>',
  settings: '<path d="M21 4h-7"/><path d="M10 4H3"/><path d="M21 12h-9"/><path d="M8 12H3"/><path d="M21 20h-5"/><path d="M12 20H3"/><path d="M14 2v4"/><path d="M8 10v4"/><path d="M16 18v4"/>',
  check: '<path d="M20 6 9 17l-5-5"/>',
  'check-circle': '<circle cx="12" cy="12" r="10"/><path d="m9 12 2 2 4-4"/>',
  x: '<path d="M18 6 6 18"/><path d="m6 6 12 12"/>',
  alert: '<path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><path d="M12 9v4"/><path d="M12 17h.01"/>',
  send: '<path d="m22 2-7 20-4-9-9-4Z"/><path d="M22 2 11 13"/>',
  upload: '<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><path d="m17 8-5-5-5 5"/><path d="M12 3v12"/>',
  download: '<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><path d="m7 10 5 5 5-5"/><path d="M12 15V3"/>',
  plus: '<path d="M5 12h14"/><path d="M12 5v14"/>',
  clock: '<circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/>',
  trash: '<path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/>',
  wrench: '<path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/>',
  bell: '<path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/>',
  trophy: '<path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/><path d="M4 22h16"/><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"/><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"/><path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"/>',
  trend: '<path d="M22 7 13.5 15.5 8.5 10.5 2 17"/><path d="M16 7h6v6"/>',
  flame: '<path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.07-2.14-.22-4.05 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.15.43-2.29 1-3a2.5 2.5 0 0 0 2.5 2.5z"/>',
  bulb: '<path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5"/><path d="M9 18h6"/><path d="M10 22h4"/>',
  search: '<circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>',
  inbox: '<path d="M22 12h-6l-2 3h-4l-2-3H2"/><path d="M5.45 5.11 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z"/>',
  save: '<path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><path d="M17 21v-8H7v8"/><path d="M7 3v5h8"/>',
  copy: '<rect width="14" height="14" x="8" y="8" rx="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/>',
  users: '<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>',
  lock: '<rect width="18" height="11" x="3" y="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>',
  file: '<path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"/><path d="M14 2v4a2 2 0 0 0 2 2h4"/><path d="M10 9H8"/><path d="M16 13H8"/><path d="M16 17H8"/>',
  palette: '<circle cx="13.5" cy="6.5" r="1"/><circle cx="17.5" cy="10.5" r="1"/><circle cx="8.5" cy="7.5" r="1"/><circle cx="6.5" cy="12.5" r="1"/><path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.93 0 1.65-.75 1.65-1.69 0-.44-.18-.84-.44-1.13-.29-.29-.44-.65-.44-1.13a1.64 1.64 0 0 1 1.67-1.67h2c3.05 0 5.55-2.5 5.55-5.55C21.97 6.01 17.46 2 12 2z"/>',
  coins: '<circle cx="8" cy="8" r="6"/><path d="M18.09 10.37A6 6 0 1 1 10.34 18"/><path d="M7 6h1v4"/>',
  info: '<circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/>',
  home: '<path d="M3 10.5 12 3l9 7.5"/><path d="M5 9.5V20a1 1 0 0 0 1 1h4v-6h4v6h4a1 1 0 0 0 1-1V9.5"/>',
  'arrow-left': '<path d="M19 12H5"/><path d="m12 19-7-7 7-7"/>',
  globe: '<circle cx="12" cy="12" r="10"/><path d="M2 12h20"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>',
  shield: '<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>',
  logout: '<path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/>',
};

const FX = window.PM_THEME_FX || null;
if (FX && FX.injectThemeCss) FX.injectThemeCss();

const THEMES = (FX && FX.THEMES) || [
  {id:'pink',name:'ชมพูสว่าง',sub:'ค่าเริ่มต้น',dark:false,anim:false,sw1:'#f6f7fb',sw2:'#FF6FAE'},
  {id:'dark',name:'โหมดมืด',sub:'Midnight Pink',dark:true,anim:false,sw1:'#181b28',sw2:'#ff5ca0'},
  {id:'cyber',name:'ดาร์กไซเบอร์',sub:'Dark Cyan',dark:true,anim:false,sw1:'#131a2a',sw2:'#22d3ee'},
  {id:'ocean',name:'ฟ้าโอเชียน',sub:'Ocean Blue',dark:false,anim:false,sw1:'#f2f7fd',sw2:'#2563eb'},
  {id:'purple',name:'ม่วงลาเวนเดอร์',sub:'Lavender',dark:false,anim:false,sw1:'#f6f4fd',sw2:'#7c3aed'},
  {id:'mint',name:'เขียวมินต์',sub:'Mint Fresh',dark:false,anim:false,sw1:'#f2faf7',sw2:'#0d9488'},
  {id:'warm',name:'ครีมอุ่น',sub:'Warm Cream',dark:false,anim:false,sw1:'#f6f0e4',sw2:'#c2552d'},
  {id:'clay',name:'กลาส & เคลย์',sub:'Glass Clay',dark:false,anim:false,sw1:'#eef2ff',sw2:'#4f7cff'},
  {id:'verdelo',name:'มรกตดาร์ก',sub:'Verdelo Mint',dark:true,anim:false,sw1:'#0d1311',sw2:'#34d399'},
  {id:'obsidian',name:'โอบซิเดียนมะนาว',sub:'Obsidian Lime',dark:true,anim:false,sw1:'#11140f',sw2:'#a3e635'},
  {id:'stone',name:'สโตน & ส้มอิฐ',sub:'Stone Bento',dark:false,anim:false,sw1:'#f7f5f2',sw2:'#d9521e'},
  {id:'mono',name:'โมโนโครม',sub:'Corbel Mono',dark:false,anim:false,sw1:'#f5f6f8',sw2:'#111111'},
  {id:'copper',name:'คอปเปอร์กลาส',sub:'Copper Glass',dark:false,anim:false,sw1:'#f4e6dc',sw2:'#e05a3a'},
  {id:'sage',name:'เซจพาสเทล',sub:'Lullo Pastel',dark:false,anim:false,sw1:'#d6e2d5',sw2:'#d96248'},
  {id:'aurora',name:'ออโรร่า',sub:'Aurora Flow',dark:true,anim:true,sw1:'#0b2d30',sw2:'#2dd4bf'},
  {id:'cosmic',name:'อวกาศดาวลอย',sub:'Cosmic Drift',dark:true,anim:true,sw1:'#140d2b',sw2:'#a855f7'},
  {id:'neongrid',name:'ไซเบอร์กริด',sub:'Neon Grid',dark:true,anim:true,sw1:'#140b24',sw2:'#f43f8e'},
  {id:'liquid',name:'ลิควิดพาสเทล',sub:'Liquid Mesh',dark:false,anim:true,sw1:'#fce7f3',sw2:'#ec4899'},
  {id:'sakura',name:'ซากุระร่วง',sub:'Sakura Breeze',dark:false,anim:true,sw1:'#fff0f6',sw2:'#f472b6'},
  {id:'rain',name:'ฝนตก Lo-Fi',sub:'Lo-Fi Rain',dark:true,anim:true,sw1:'#0b1426',sw2:'#60a5fa'},
  {id:'firefly',name:'หิ่งห้อย',sub:'Firefly Glow',dark:true,anim:true,sw1:'#07140d',sw2:'#facc15'},
  {id:'matrix',name:'เมทริกซ์โค้ด',sub:'Matrix Rain',dark:true,anim:true,sw1:'#040d06',sw2:'#22c55e'},
  {id:'ember',name:'สะเก็ดไฟลาวา',sub:'Ember Forge',dark:true,anim:true,sw1:'#180906',sw2:'#f97316'},
  {id:'deepsea',name:'ใต้ทะเลลึก',sub:'Deep Ocean',dark:true,anim:true,sw1:'#051926',sw2:'#38bdf8'},
];
const FONTS = (FX && FX.FONTS) || [{id:'noto',name:'Noto Thai'},{id:'plex',name:'IBM Plex'},{id:'prompt',name:'Prompt'},{id:'sys',name:'ระบบเดิม'}];
const SIZES = (FX && FX.SIZES) || [{id:'sm',name:'กะทัดรัด'},{id:'md',name:'ปกติ'},{id:'lg',name:'ใหญ่'}];
const DENSITIES = (FX && FX.DENSITIES) || [{id:'compact',name:'กะทัดรัด'},{id:'normal',name:'ปกติ'},{id:'spacious',name:'โปร่งสบาย'}];

const $ = id => document.getElementById(id);
const E = s => String(s ?? '').replace(/[&<>"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const fmt = n => Number(n || 0).toLocaleString('th-TH');
const svg = (k, cls='ic') => `<svg class="${cls}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${ICONS[k] || ICONS.info}</svg>`;

const PL = {
  yt:['YouTube','#FF0000'], youtube:['YouTube','#FF0000'],
  tt:['TikTok','#1fb8c0'], tiktok:['TikTok','#1fb8c0'],
  fb:['Facebook','#1877F2'], facebook:['Facebook','#1877F2'],
  ig:['Instagram','#E1306C'], instagram:['Instagram','#E1306C'],
  ga4:['Google GA4','#F9AB00'], google:['Google Ads / SEO','#2563EB'],
  web:['เว็บไซต์','#2563EB'], website:['เว็บไซต์','#2563EB'],
  gsc:['Search Console','#2563EB'],
  line:['LINE OA','#06C755'],
};
const PL_KEYS = ['yt','fb','ga4','gsc'];

let _igIconSeq = 0;
function plogo(p, sz=18){
  const s = Number(sz) || 18;
  const k = String(p || 'web').toLowerCase();
  let inner = '';
  if (k === 'yt' || k === 'youtube') {
    inner = `<svg width="${s}" height="${s}" viewBox="0 0 24 24" aria-hidden="true"><rect x="1.5" y="4.5" width="21" height="15" rx="4.2" fill="#FF0000"/><polygon points="10,8.6 16.4,12 10,15.4" fill="#fff"/></svg>`;
  } else if (k === 'tt' || k === 'tiktok') {
    inner = `<svg width="${s}" height="${s}" viewBox="0 0 24 24" aria-hidden="true"><rect x="1.5" y="1.5" width="21" height="21" rx="5.5" fill="#12121a" stroke="rgba(255,255,255,.18)" stroke-width="1"/><path d="M14.2 5.4c.5 1.7 1.8 2.9 3.5 3.1v2.3c-1.3-.1-2.5-.5-3.5-1.2v5.1a4.3 4.3 0 1 1-4.3-4.3c.3 0 .6 0 .9.1v2.4a1.9 1.9 0 1 0 1.2 1.8V5.4h2.2z" fill="#25F4EE" transform="translate(-0.6,-0.4)"/><path d="M14.2 5.4c.5 1.7 1.8 2.9 3.5 3.1v2.3c-1.3-.1-2.5-.5-3.5-1.2v5.1a4.3 4.3 0 1 1-4.3-4.3c.3 0 .6 0 .9.1v2.4a1.9 1.9 0 1 0 1.2 1.8V5.4h2.2z" fill="#FE2C55" transform="translate(0.6,0.4)"/><path d="M14.2 5.4c.5 1.7 1.8 2.9 3.5 3.1v2.3c-1.3-.1-2.5-.5-3.5-1.2v5.1a4.3 4.3 0 1 1-4.3-4.3c.3 0 .6 0 .9.1v2.4a1.9 1.9 0 1 0 1.2 1.8V5.4h2.2z" fill="#fff"/></svg>`;
  } else if (k === 'fb' || k === 'facebook') {
    inner = `<svg width="${s}" height="${s}" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="10.5" fill="#1877F2"/><path d="M15.4 12.9l.4-2.8h-2.7V8.3c0-.8.4-1.5 1.6-1.5h1.2V4.4s-1.1-.2-2.2-.2c-2.2 0-3.7 1.4-3.7 3.8v2.1H7.5v2.8H10v6.8c.5.1 1 .1 1.6.1s1.1 0 1.5-.1v-6.8h2.3z" fill="#fff"/></svg>`;
  } else if (k === 'ig' || k === 'instagram') {
    const gid = 'pm-ig-' + (++_igIconSeq);
    inner = `<svg width="${s}" height="${s}" viewBox="0 0 24 24" aria-hidden="true"><defs><radialGradient id="${gid}" cx="22%" cy="95%" r="105%"><stop offset="0%" stop-color="#FEDA75"/><stop offset="25%" stop-color="#FA7E1E"/><stop offset="48%" stop-color="#D62976"/><stop offset="75%" stop-color="#962FBF"/><stop offset="100%" stop-color="#4F5BD5"/></radialGradient></defs><rect x="1.5" y="1.5" width="21" height="21" rx="6" fill="url(#${gid})"/><rect x="6" y="6" width="12" height="12" rx="3.4" fill="none" stroke="#fff" stroke-width="1.8"/><circle cx="12" cy="12" r="2.9" fill="none" stroke="#fff" stroke-width="1.8"/><circle cx="15.8" cy="8.2" r="1.1" fill="#fff"/></svg>`;
  } else if (k === 'ga4') {
    inner = `<svg width="${s}" height="${s}" viewBox="0 0 24 24" aria-hidden="true"><rect x="1.5" y="1.5" width="21" height="21" rx="5.5" fill="#FFF4E5" stroke="#F9AB00" stroke-width="1.1"/><rect x="15.2" y="5" width="3.8" height="14" rx="1.9" fill="#F9AB00"/><rect x="10.1" y="9.8" width="3.8" height="9.2" rx="1.9" fill="#E37400"/><circle cx="6.9" cy="17.1" r="2" fill="#E37400"/></svg>`;
  } else if (k === 'line') {
    inner = `<svg width="${s}" height="${s}" viewBox="0 0 24 24" aria-hidden="true"><rect x="1.5" y="1.5" width="21" height="21" rx="5.5" fill="#06C755"/><path d="M12 6.3c-3.9 0-7 2.5-7 5.6 0 2.8 2.4 5.1 5.7 5.5.2.05.5.15.6.35l.1.8c0 .25.2.35.4.2 1.9-1.1 4.6-2.9 6-4.7 1-.9 1.2-1.8 1.2-2.1 0-3.1-3.1-5.6-7-5.6z" fill="#fff"/></svg>`;
  } else {
    inner = `<svg width="${s}" height="${s}" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="10.5" fill="#2563EB"/><circle cx="12" cy="12" r="6.8" fill="none" stroke="#fff" stroke-width="1.5"/><path d="M5.2 12h13.6M12 5.2a9.8 9.8 0 0 1 2.7 6.8 9.8 9.8 0 0 1-2.7 6.8 9.8 9.8 0 0 1-2.7-6.8 9.8 9.8 0 0 1 2.7-6.8z" fill="none" stroke="#fff" stroke-width="1.4"/></svg>`;
  }
  const tip = (PL[k] && PL[k][0]) || k;
  return `<span class="plogo" title="${E(tip)}">${inner}</span>`;
}
const plStrip = (sz=16) => `<span class="pl-strip">${['ga4','gsc','fb','yt'].map(p => plogo(p, sz)).join('')}</span>`;
function expIcon(kind){
  if (kind === 'gs') return '<svg width="17" height="17" viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="2" width="18" height="20" rx="2.5" fill="#0F9D58"/><rect x="6.5" y="8" width="11" height="9.5" rx="1" fill="none" stroke="#fff" stroke-width="1.5"/><line x1="6.5" y1="12" x2="17.5" y2="12" stroke="#fff" stroke-width="1.4"/><line x1="11.2" y1="8" x2="11.2" y2="17.5" stroke="#fff" stroke-width="1.4"/></svg>';
  if (kind === 'xl') return '<svg width="17" height="17" viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="2" width="18" height="20" rx="2.5" fill="#1D6F42"/><path d="M8.5 8.5l7 7M15.5 8.5l-7 7" stroke="#fff" stroke-width="2.1" stroke-linecap="round"/></svg>';
  return '<svg width="17" height="17" viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="2" width="18" height="20" rx="2.5" fill="#2563EB"/><path d="M7.5 9h9M7.5 13h9M7.5 17h6" stroke="#fff" stroke-width="1.8" stroke-linecap="round"/></svg>';
}

// Sidebar Menu Groups (Website & Google GA kept separate per user preference)
const GROUPS = [
  ['', [
    ['home', 'home', 'แดชบอร์ดหลัก', 'dashboard'],
    ['website', 'globe', 'เว็บเพจ & Google GA', 'website'],
    ['post', 'upload', 'ปฏิทิน & โพสต์วัดผล', 'posts'],
    ['stats', 'chart', 'สถิติ & วิเคราะห์', 'dashboard'],
    ['roi', 'trend', 'ยิงแอด & ROAS', 'roi'],
    ['marketing', 'megaphone', 'กลยุทธ์ & คู่แข่ง', 'strategy'],
    ['goal', 'target', 'เป้าหมายบริษัท KPI', 'goals'],
    ['inbox', 'chats', 'คอมเมนต์ & ตอบกลับ', 'comments'],
  ]],
  ['รายงาน & ส่งออก', [
    ['reports', 'file', 'รายงาน & ส่งออก', 'exports'],
  ]],
  ['ตั้งค่า & ระบบ', [
    ['settings', 'settings', 'ตั้งค่า & เชื่อมต่อ API', 'settings'],
    ['guide', 'bulb', 'คู่มือ & เริ่มใช้งานจริง', 'dashboard'],
    ['about', 'info', 'สถานะระบบ & Doctor', 'dashboard'],
  ]],
];
const PINNED = ['home', 'website', 'post', 'stats', 'roi', 'marketing', 'goal', 'inbox'];

// ---------- Prefs & Persisted UI State ----------
const PREFS_KEY = 'pulsemetrics_suite_prefs';
let prefs = {
  theme:'pink', font:'noto', size:'md', density:'normal', accent:'',
  mini:false, focus:false, dock_mini:true, nav_pill:true, theme_ripple:true, card_land:true, fx_mouse:true,
  brandTitle:'PulseMetrics',
  rangePreset:'month', rangeCompare:'auto', rangeStart:'', rangeEnd:'',
  postSub:'cal', mkSub:'advisor', setSub:'connectors', webSub:'overview', webMetric:'visitors',
  crmView:'kanban',
};
try {
  const prev = JSON.parse(localStorage.getItem(PREFS_KEY) || localStorage.getItem('pulsemetrics_lite_prefs') || '{}');
  if (['Mail × PulseMetrics', 'Mail Lite × PulseMetrics'].includes(prev.brandTitle)) prev.brandTitle = 'PulseMetrics';
  delete prev.mode;
  Object.assign(prefs, prev);
} catch(e){}
if (!THEMES.some(t => t.id === prefs.theme)) prefs.theme = 'pink';
prefs.nav_pill = prefs.nav_pill !== false;
prefs.theme_ripple = prefs.theme_ripple !== false;
prefs.card_land = prefs.card_land !== false;
prefs.fx_mouse = prefs.fx_mouse !== false;
function savePrefs(){ try { localStorage.setItem(PREFS_KEY, JSON.stringify(prefs)); } catch(e){} }

// ---------- Live Application State ----------
const APP = {
  me: null,
  workspaces: [],
  brand: {brand_name:'PulseMetrics', brand_tagline:'Business Marketing & Lead Intelligence'},
  requireLogin: false,
  dash: null, dashKey: '',
  web: null, webKey: '', webQuery: '',
  ws: null, syncLogs: [], dataDir: '',
  posts: [], calendar: [], evergreen: [],
  leads: [], leadPosts: [], leadSummary: {total:0,new:0,talking:0,won:0,won_thb:0,pipeline_thb:0},
  leadQ: '', leadStage: '', leadCh: '',
  comments: [], quickReplies: [], commentIntent: '', commentSelId: 0,
  roi: null, roiKey: '',
  goals: [],
  competitors: [],
  ideas: [],
  feedbacks: [], fbSummary: {total:0,new:0,reviewing:0,done:0,avg_rating:0}, fbStatus: '',
  adminSettings: null, license: null,
  users: [],
  backups: [],
  health: null, doctor: null,
  loading: {},
  loaded: {},
  syncing: '',
  chatLog: [{who:'assistant', text:'สวัสดีครับ! ผมคือผู้ช่วยวิเคราะห์ข้อมูลในเครื่อง (ฟรี 0 โทเคน) ของ PulseMetrics — พิมพ์ถามเช่น "สรุปยอด", "ลีดค้าง", "คีย์เวิร์ด", "ROAS" หรือ "พร้อมขาย" ได้เลยครับ'}],
};

function hasPerm(perm){
  if (!perm) return true;
  if (!APP.me || !Array.isArray(APP.me.perms)) return true;
  return APP.me.perms.includes(perm);
}

function getGroups(){
  return GROUPS.map(([g, arr]) => [g, arr.filter(it => hasPerm(it[3]))]).filter(([, arr]) => arr.length);
}
function getItemsMap(){
  const m = {};
  for (const [g, arr] of getGroups()) for (const [k, ic, title, perm] of arr) m[k] = {k, ic, title, perm, g: g || 'ทางลัดหลัก'};
  return m;
}

// ---------- API Helper ----------
async function api(url, opts){
  const cfg = Object.assign({headers:{}}, opts || {});
  if (cfg.body && typeof cfg.body === 'object' && !(cfg.body instanceof FormData)) {
    cfg.headers['Content-Type'] = 'application/json';
    cfg.body = JSON.stringify(cfg.body);
  }
  const r = await fetch(url, cfg);
  let data = null;
  try { data = await r.json(); } catch(e){ data = {ok:false, error:'ตอบกลับไม่ถูกต้อง (' + r.status + ')'}; }
  if (r.status === 401 && data && data.auth_required) {
    toast('เซสชันหมดอายุ กรุณาเข้าสู่ระบบใหม่', 'warn');
    setTimeout(() => location.reload(), 700);
  }
  return data;
}

function rangeQuery(){
  const p = new URLSearchParams({preset: prefs.rangePreset || 'month', compare: prefs.rangeCompare || 'auto'});
  if (prefs.rangePreset === 'custom' && prefs.rangeStart && prefs.rangeEnd) {
    p.set('start', prefs.rangeStart); p.set('end', prefs.rangeEnd);
  }
  return p.toString();
}

function resetWorkspaceCache(){
  APP.dash = null; APP.dashKey = '';
  APP.web = null; APP.webKey = '';
  APP.ws = null; APP.syncLogs = [];
  APP.posts = []; APP.calendar = []; APP.evergreen = [];
  APP.leads = []; APP.comments = []; APP.quickReplies = [];
  APP.roi = null; APP.roiKey = '';
  APP.goals = []; APP.competitors = []; APP.ideas = [];
  APP.loaded = {};
}

// ---------- Theme + Motion Engine (14 Mail Themes) ----------
function hexRgb(h){ return [parseInt(h.slice(1,3),16), parseInt(h.slice(3,5),16), parseInt(h.slice(5,7),16)]; }
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

function withThemeRipple(ev, fn){
  if (!prefs.theme_ripple || typeof document.startViewTransition !== 'function') { fn(); return; }
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

function pmSlidePill(pillEl, fromR, toR, radius, animate){
  if (!pillEl || !toR) return;
  if (pillEl._pillRaf) { cancelAnimationFrame(pillEl._pillRaf); pillEl._pillRaf = 0; }
  const rad = radius || 10;
  const setCP = r => {
    pillEl.style.clipPath = `inset(${Math.max(0,r.top).toFixed(1)}px ${Math.max(0,r.right).toFixed(1)}px ${Math.max(0,r.bottom).toFixed(1)}px ${Math.max(0,r.left).toFixed(1)}px round ${rad}px)`;
  };
  if (!animate || !fromR || typeof requestAnimationFrame !== 'function') { setCP(toR); return; }
  const leadKey = toR.top >= fromR.top ? 'bottom' : 'top';
  const trailKey = leadKey === 'bottom' ? 'top' : 'bottom';
  const t0 = (typeof performance !== 'undefined' && performance.now) ? performance.now() : Date.now();
  const lerp = (a,b,t) => a + (b - a) * t;
  const p3Out = t => 1 - Math.pow(1 - t, 3);
  const p3InOut = t => t < .5 ? 4*t*t*t : 1 - Math.pow(-2*t + 2, 3) / 2;
  const step = now => {
    const dt = now - t0;
    const pLead = Math.min(1, dt / 360), pTrail = Math.min(1, dt / 550);
    const eLead = p3Out(pLead), eTrail = p3InOut(pTrail);
    const cur = {top:0, right:0, bottom:0, left:0};
    for (const k of ['top','right','bottom','left']) {
      const e = k === leadKey ? eLead : (k === trailKey ? eTrail : eLead);
      cur[k] = lerp(fromR[k], toR[k], e);
    }
    setCP(cur);
    if (pTrail < 1) pillEl._pillRaf = requestAnimationFrame(step);
    else { pillEl._pillRaf = 0; setCP(toR); }
  };
  setCP(fromR);
  pillEl._pillRaf = requestAnimationFrame(step);
}

let _lastNavRect = null;
function measureNavItem(wrap, el){
  if (!wrap || !el || typeof wrap.getBoundingClientRect !== 'function' || typeof el.getBoundingClientRect !== 'function') return null;
  const wr = wrap.getBoundingClientRect(), er = el.getBoundingClientRect();
  if (!wr.width || !er.height) return null;
  const W = wrap.clientWidth || wr.width;
  const H = Math.max(wrap.scrollHeight || 0, wr.height || 0, (er.bottom - wr.top) + 12);
  const top = er.top - wr.top, left = er.left - wr.left;
  return {top, right: Math.max(0, W - left - er.width), bottom: Math.max(0, H - top - er.height), left, H};
}
function syncNavPill(animate){
  const wrap = $('nav-items');
  if (!wrap) return;
  let pill = $('pmNavPill');
  if (!pill) {
    pill = document.createElement('div');
    pill.id = 'pmNavPill';
    pill.setAttribute('aria-hidden', 'true');
    if (wrap.prepend) wrap.prepend(pill); else wrap.appendChild(pill);
  }
  if (!prefs.nav_pill) { pill.style.opacity = '0'; return; }
  const onA = wrap.querySelector && wrap.querySelector('a.on');
  const toR = measureNavItem(wrap, onA);
  if (!toR) { pill.style.opacity = '0'; return; }
  pill.style.height = toR.H + 'px';
  pill.style.opacity = '1';
  const prev = animate ? _lastNavRect : null;
  const moved = prev && (Math.abs(prev.top - toR.top) > 2 || Math.abs(prev.left - toR.left) > 2);
  pmSlidePill(pill, moved ? prev : null, toR, 10, !!moved);
  _lastNavRect = toR;
}

function pmLandCards(){
  if (!prefs.card_land) return;
  const host = $('page');
  if (!host || !host.querySelectorAll) return;
  const cards = [...host.querySelectorAll('.card,.kpi,.tile,.hero')].slice(0, 14);
  cards.forEach((el, i) => {
    if (typeof el.animate === 'function') {
      el.animate(
        [{opacity: 0, transform: 'translateY(16px) scale(0.985)'}, {opacity: 1, transform: 'translateY(0) scale(1)'}],
        {duration: 460, delay: i * 36, easing: 'cubic-bezier(.16,1,.3,1)', fill: 'backwards'}
      );
    }
  });
}

function applyPrefs(){
  const h = document.documentElement;
  const curObj = THEMES.find(t => t.id === prefs.theme) || THEMES[0];
  h.setAttribute('data-theme', curObj.id);
  h.setAttribute('data-dark', curObj.dark ? '1' : '0');
  h.setAttribute('data-anim', curObj.anim ? '1' : '0');
  h.setAttribute('data-fxmouse', prefs.fx_mouse !== false ? '1' : '0');
  h.setAttribute('data-font', prefs.font || 'noto');
  h.setAttribute('data-size', prefs.size || 'md');
  h.setAttribute('data-density', prefs.density || 'normal');
  h.setAttribute('data-dock', prefs.dock_mini !== false ? '1' : '0');
  h.setAttribute('data-pill', prefs.nav_pill !== false ? '1' : '0');
  h.setAttribute('data-ripple', prefs.theme_ripple !== false ? '1' : '0');
  h.setAttribute('data-land', prefs.card_land !== false ? '1' : '0');
  h.classList.toggle('nav-mini', !!prefs.mini);
  h.classList.toggle('focus-on', !!prefs.focus);
  applyCustomAc(prefs.accent, !!curObj.dark);
  if (FX && typeof FX.sync === 'function') FX.sync(curObj.id, !!curObj.anim, prefs.fx_mouse !== false);
  const dt = $('docktog');
  if (dt) dt.title = prefs.dock_mini !== false ? 'ขยายแถบเครื่องมือมุมขวาบน' : 'ย่อแถบเครื่องมือมุมขวาบน';
  const fb = $('focbtn'); if (fb) fb.classList.toggle('on', !!prefs.focus);
  const bn = (APP.brand && APP.brand.brand_name) || prefs.brandTitle || 'PulseMetrics';
  if ($('brand-name')) $('brand-name').textContent = bn;
  if ($('brand-sub')) $('brand-sub').textContent = (APP.brand && APP.brand.brand_tagline) || 'Business Suite';
  document.title = bn + ' — Business Marketing & Lead Intelligence';
  if (typeof requestAnimationFrame === 'function') requestAnimationFrame(() => syncNavPill(false));
  savePrefs();
}

// ---------- Helpers: Toasts, Clipboard, Modals, Charts ----------
function toast(msg, kind=''){
  const box = $('mailToasts');
  if (!box) return;
  const el = document.createElement('div');
  el.className = 'mtoast ' + kind;
  el.innerHTML = `<span class="tdot"></span><span>${E(msg)}</span>`;
  box.appendChild(el);
  setTimeout(()=>{ el.style.opacity='0'; setTimeout(()=>el.remove(), 220); }, 3200);
}

async function copyTextSafe(txt){
  if (navigator.clipboard && navigator.clipboard.writeText) {
    try { await navigator.clipboard.writeText(txt); return true; } catch(e){}
  }
  const ta = document.createElement('textarea'); ta.value = txt; document.body.appendChild(ta); ta.select();
  try { return document.execCommand('copy'); } catch(e){ return false; } finally { ta.remove(); }
}

function openModal(html){
  $('quoteBody').innerHTML = html;
  $('quoteOv').classList.add('open');
}
function closeModal(){ $('quoteOv').classList.remove('open'); }

function deltaChip(val, suffix=' เทียบช่วงก่อน'){
  const n = Number(val || 0);
  const cls = n > 0 ? 'ok' : n < 0 ? 'bad' : '';
  const sign = n > 0 ? '+' : '';
  return `<span class="chip ${cls}">${sign}${n}%${E(suffix)}</span>`;
}

function multiLineChart(labels, series, unit=''){
  if (!labels || !labels.length) return '<div class="dim" style="padding:20px;text-align:center">ยังไม่มีข้อมูลกราฟในช่วงเวลานี้</div>';
  const W=640, H=210, padL=46, padR=14, padT=16, padB=28;
  const allV = series.flatMap(s => s.vals || []);
  const mx = Math.max(1, ...allV) * 1.12;
  const xAt = i => padL + (i * (W - padL - padR) / Math.max(1, labels.length - 1));
  const yAt = v => H - padB - (v / mx) * (H - padT - padB);
  const grid = [0, 0.25, 0.5, 0.75, 1].map(r => {
    const y = yAt(mx * r).toFixed(1), val = Math.round(mx * r);
    const lbl = val >= 1000000 ? (val/1000000).toFixed(1)+'M' : val >= 1000 ? (val/1000).toFixed(0)+'K' : val;
    return `<line x1="${padL}" x2="${W-padR}" y1="${y}" y2="${y}" stroke="var(--bd)" stroke-dasharray="${r?3:0}"/><text x="${padL-6}" y="${+y+4}" text-anchor="end" font-size="10" fill="var(--dim)">${lbl}</text>`;
  }).join('');
  const paths = series.map(s => {
    const vals = s.vals || [];
    if (!vals.length) return '';
    const d = vals.map((v,i) => `${i?'L':'M'}${xAt(i).toFixed(1)},${yAt(v).toFixed(1)}`).join(' ');
    const dash = s.dash ? ' stroke-dasharray="5 4" opacity=".72"' : '';
    const step = vals.length > 24 ? Math.ceil(vals.length / 18) : 1;
    const dots = vals.map((v,i) => (i % step === 0 || i === vals.length - 1)
      ? `<circle class="ch-bar" cx="${xAt(i).toFixed(1)}" cy="${yAt(v).toFixed(1)}" r="${s.dash?3:3.8}" fill="${s.color}" stroke="var(--surf)" stroke-width="1.5" data-tip="${E(s.name)} · ${E(labels[i]||'')}: ${fmt(v)}${E(unit)}"/>`
      : '').join('');
    return `<path d="${d}" fill="none" stroke="${s.color}" stroke-width="${s.dash?2:2.5}" stroke-linecap="round" stroke-linejoin="round"${dash}/>${dots}`;
  }).join('');
  const xStep = Math.max(1, Math.floor(labels.length / 7));
  const xLbls = labels.map((l,i) => (i % xStep === 0 || i === labels.length - 1)
    ? `<text x="${xAt(i).toFixed(1)}" y="${H-8}" text-anchor="middle" font-size="10" fill="var(--dim)">${E(l)}</text>` : '').join('');
  return `<svg viewBox="0 0 ${W} ${H}" style="width:100%;max-height:215px;height:auto;display:block;margin:0 auto">${grid}${paths}${xLbls}</svg>`;
}

function donutSvg(slices, unitLabel='รวม'){
  const total = slices.reduce((a,b) => a + Number(b.val || 0), 0) || 1;
  const R = 54, C = 2 * Math.PI * R;
  let off = 0;
  const segs = slices.map(s => {
    const v = Number(s.val || 0);
    const len = (v / total) * C;
    const el = `<circle class="ch-bar" cx="72" cy="72" r="${R}" fill="none" stroke="${s.color}" stroke-width="20" stroke-dasharray="${len.toFixed(2)} ${(C-len).toFixed(2)}" stroke-dashoffset="${(-off).toFixed(2)}" transform="rotate(-90 72 72)" data-tip="${E(s.name)}: ${fmt(v)} (${Math.round(100*v/total)}%)"/>`;
    off += len;
    return el;
  }).join('');
  const bigTxt = total >= 1000000 ? (total/1000000).toFixed(1)+'M' : total >= 10000 ? Math.round(total/1000)+'K' : total >= 1000 ? (total/1000).toFixed(1)+'K' : fmt(total);
  return `<svg viewBox="0 0 144 144" style="width:146px;height:146px;flex:none">${segs}<text x="72" y="69" text-anchor="middle" font-size="15" font-weight="800" fill="var(--tx)">${bigTxt}</text><text x="72" y="85" text-anchor="middle" font-size="10" fill="var(--dim)">${E(unitLabel)}</text></svg>`;
}

function wireChartTips(){
  const tip = $('chartTip');
  if (!tip || !$('page')) return;
  $('page').querySelectorAll('[data-tip]').forEach(el => {
    el.onmouseenter = e => { tip.textContent = el.dataset.tip; tip.style.display = 'block'; tip.style.left = (e.clientX + 12) + 'px'; tip.style.top = (e.clientY - 34) + 'px'; };
    el.onmousemove = e => { tip.style.left = Math.min(window.innerWidth - 240, e.clientX + 12) + 'px'; tip.style.top = Math.max(12, e.clientY - 34) + 'px'; };
    el.onmouseleave = () => { tip.style.display = 'none'; };
  });
}

function gradeTitle(t){
  const s = (t || '').trim();
  let score = 45;
  const tips = [];
  if (s.length >= 22 && s.length <= 68) { score += 18; tips.push(['ok','ความยาวกำลังดี อ่านจบไวบนมือถือ']); }
  else tips.push(['warn','ควรยาวประมาณ 25–65 ตัวอักษรเพื่อไม่ให้โดนตัด']);
  if (/[0-9]/.test(s)) { score += 12; tips.push(['ok','มีตัวเลขชัดเจน ช่วยดึงสายตาและเพิ่มคลิก']); }
  else tips.push(['warn','ลองใส่ตัวเลข (เช่น 3 วิธี, 5 ข้อ, +210%)']);
  if (/[?!]/.test(s) || /ทำไม|อย่างไร|วิธี|ห้าม|เคส|ฟรี|ขายขาด|เปรียบเทียบ/.test(s)) { score += 15; tips.push(['ok','มีคำกระตุ้นความสนใจ / ประโยชน์ชัด']); }
  else tips.push(['warn','เพิ่มคำถามหรือผลลัพธ์ที่ลูกค้าจะได้ใน 4 คำแรก']);
  if (s.length <= 100 && !/[<>]/.test(s)) score += 10;
  return {score: Math.min(100, score), tips};
}

function pageHead(title, sub, rightHtml=''){
  const back = hist.length ? `<button type="button" class="ghost" id="btn-back" style="padding:5px 11px;font-size:12.5px;margin-bottom:8px;display:inline-flex;align-items:center;gap:5px">${svg('arrow-left')} ย้อนกลับ</button>` : '';
  return `${back}<div class="page-hd"><div><h1>${E(title)}</h1><div class="sub">${E(sub)}</div></div><div style="display:flex;gap:8px;align-items:center;flex-wrap:wrap">${rightHtml}</div></div>`;
}

function rangeBarHtml(extraRight=''){
  const rng = (APP.dash && APP.dash.range) || (APP.web && APP.web.range) || {};
  return `<div class="card" style="margin-bottom:14px;padding:11px 14px">
    <div style="display:flex;align-items:center;justify-content:space-between;gap:8px;flex-wrap:wrap">
      <div style="display:flex;align-items:center;gap:6px;flex-wrap:wrap">
        ${[['day','7 วัน'],['month','30 วัน'],['year','1 ปี'],['custom','กำหนดเอง']].map(([k,l]) => `<button type="button" class="tab-btn ${prefs.rangePreset===k?'on':''}" data-rpre="${k}">${l}</button>`).join('')}
        ${prefs.rangePreset==='custom' ? `<input type="date" id="rng-s" value="${E(prefs.rangeStart || rng.start || '')}" style="width:140px;padding:5px 8px;font-size:12.5px"><input type="date" id="rng-e" value="${E(prefs.rangeEnd || rng.end || '')}" style="width:140px;padding:5px 8px;font-size:12.5px"><button type="button" id="rng-apply" style="padding:5px 11px;font-size:12.5px">ดูช่วงนี้</button>` : ''}
      </div>
      <div style="display:flex;align-items:center;gap:7px;flex-wrap:wrap">
        <select id="rng-cmp" style="width:auto;padding:5px 10px;font-size:12.5px">
          <option value="auto" ${prefs.rangeCompare==='auto'?'selected':''}>เทียบอัตโนมัติ</option>
          <option value="wow" ${prefs.rangeCompare==='wow'?'selected':''}>WoW (เทียบสัปดาห์ก่อน)</option>
          <option value="mom" ${prefs.rangeCompare==='mom'?'selected':''}>MoM (เทียบเดือนก่อน)</option>
          <option value="yoy" ${prefs.rangeCompare==='yoy'?'selected':''}>YoY (เทียบปีก่อน)</option>
        </select>
        ${extraRight}
      </div>
    </div>
  </div>`;
}

function wireRangeBar(onReload){
  $('page').querySelectorAll('[data-rpre]').forEach(b => b.onclick = () => {
    prefs.rangePreset = b.dataset.rpre; savePrefs();
    if (prefs.rangePreset !== 'custom') onReload(true); else renderPage();
  });
  if ($('rng-apply')) $('rng-apply').onclick = () => {
    prefs.rangeStart = ($('rng-s') && $('rng-s').value) || '';
    prefs.rangeEnd = ($('rng-e') && $('rng-e').value) || '';
    savePrefs(); onReload(true);
  };
  if ($('rng-cmp')) $('rng-cmp').onchange = e => {
    prefs.rangeCompare = e.target.value; savePrefs(); onReload(true);
  };
}

// ---------- Navigation, Top Workspace Bar, Status Bar, Bell ----------
let curTab = 'home', recentTabs = ['home','website','post','stats'], hist = [];
const NAV_NEVER = ['guide', 'settings', 'about'], NAV_MAX = 9, NAV_USAGE = 'pulsemetrics_nav_usage';
function navDecay(last){ const d = (Date.now() - new Date(last || 0).getTime()) / 864e5; return isFinite(d) ? Math.pow(0.5, d / 14) : 1; }
function navUsage(){ try { return JSON.parse(localStorage.getItem(NAV_USAGE) || '{}'); } catch(e){ return {}; } }
function navRecord(k){
  try {
    const u = navUsage(), e = u[k] || {n:0};
    e.n = (e.n || 0) * navDecay(e.last) + 1; e.last = new Date().toISOString();
    u[k] = e; localStorage.setItem(NAV_USAGE, JSON.stringify(u));
  } catch(e){}
}
function navFavorites(map){
  const fav = PINNED.filter(k => map[k]), u = navUsage();
  const learned = Object.keys(u).filter(k => map[k] && !fav.includes(k) && !NAV_NEVER.includes(k))
    .map(k => [k, u[k].n * navDecay(u[k].last)]).filter(x => x[1] >= 3).sort((a,b) => b[1] - a[1]).map(x => x[0]);
  return fav.concat(learned.slice(0, Math.max(0, NAV_MAX - fav.length)));
}

function badgeOf(k){
  if (k === 'inbox') { const n = APP.comments.filter(c => !c.replied).length; return n ? String(n) : ''; }
  if (k === 'crm') { const n = Number((APP.leadSummary && APP.leadSummary.new) || 0); return n ? String(n) : ''; }
  if (k === 'feedback') { const n = Number((APP.fbSummary && APP.fbSummary.new) || 0); return n ? String(n) : ''; }
  return '';
}

function renderWsBar(){
  const bar = $('wsBar');
  if (!bar) return;
  const curWsId = (APP.me && APP.me.workspace_id) || 1;
  const curWs = APP.workspaces.find(w => w.id === curWsId) || APP.ws || {id:1, name:'PulseMetrics', demo_mode:1};
  const isDemo = Number(curWs.demo_mode) === 1;
  const roleMap = {executive:'Executive', marketing:'Marketing', chat_admin:'Sales/Chat'};
  const roleLbl = APP.me ? (roleMap[APP.me.role] || APP.me.role) : '';
  bar.innerHTML = `
    ${APP.workspaces.length ? `<select id="ws-sel" title="สลับบริษัท / Workspace">${APP.workspaces.map(w => `<option value="${w.id}" ${w.id===curWsId?'selected':''}>${E(w.name)}</option>`).join('')}</select>` : ''}
    <span class="ws-pill ${isDemo?'demo':'live'}" id="ws-mode-pill" title="${isDemo?'คลิกเพื่อไปตั้งค่าล้างข้อมูลตัวอย่างและเริ่มใช้งานจริง':'กำลังทำงานบนข้อมูลจริง (Live Mode)'}">
      ${isDemo ? 'โหมดตัวอย่าง · เริ่มใช้จริง →' : '● Live Mode'}
    </span>
    ${APP.me ? `<span class="ws-pill" title="${E(APP.me.email)}">${svg('users')} ${E(APP.me.name)} (${E(roleLbl)})</span>` : ''}
    ${(APP.me && (APP.me.authenticated || APP.requireLogin)) ? `<button type="button" class="ghost" id="btn-logout" style="padding:4px 9px;font-size:12px" title="ออกจากระบบ">${svg('logout')} ออก</button>` : ''}`;
  if ($('ws-sel')) $('ws-sel').onchange = async e => {
    const id = Number(e.target.value);
    const r = await api('/api/auth/switch-workspace', {method:'POST', body:{workspace_id: id}});
    if (r && r.ok) {
      if (APP.me) APP.me.workspace_id = id;
      resetWorkspaceCache();
      toast('สลับบริษัทเรียบร้อยแล้ว', 'ok');
      renderWsBar();
      renderPage();
    } else {
      toast((r && r.error) || 'สลับบริษัทไม่สำเร็จ', 'warn');
    }
  };
  if ($('ws-mode-pill') && isDemo) $('ws-mode-pill').onclick = () => { prefs.setSub = 'connectors'; savePrefs(); nav('settings'); };
  if ($('btn-logout')) $('btn-logout').onclick = async () => {
    await api('/api/auth/logout', {method:'POST'});
    location.reload();
  };
}

function renderNav(){
  const groups = getGroups(), map = getItemsMap();
  const itemHtml = (k, cls='') => {
    const it = map[k]; if (!it) return '';
    const bd = badgeOf(k);
    return `<a class="${k===curTab?'on':''} ${cls}" data-nav="${k}" title="${E(it.title)}">${svg(it.ic)}<span>${E(it.title)}</span>${bd?`<span class="nbadge">${bd}</span>`:''}</a>`;
  };
  const fav = navFavorites(map);
  let html = '<div class="navsec">ทางลัดหลัก</div>' + fav.map(k => itemHtml(k, 'fav')).join('');
  for (const [gname, items] of groups) {
    const rest = items.map(x => x[0]).filter(k => !fav.includes(k));
    if (!rest.length) continue;
    const nums = rest.map(k => badgeOf(k)).filter(b => /^\d+$/.test(b)).map(Number);
    const gcount = nums.reduce((a,b) => a + b, 0);
    const gb = gcount ? `<span class="nbadge gsum">${gcount}</span>` : '';
    html += `<details class="ngrp" data-g="${E(gname || 'อื่นๆ')}"><summary>${E(gname || 'อื่นๆ')}${gb}</summary>${rest.map(k => itemHtml(k)).join('')}</details>`;
  }
  $('nav-items').innerHTML = html;
  $('nav-items').querySelectorAll('details.ngrp').forEach(d => {
    const key = 'pulsenav_' + d.dataset.g;
    try {
      const sv = localStorage.getItem(key);
      if (d.querySelector('a.on')) { d.open = true; localStorage.setItem(key, '1'); }
      else if (sv === '1') d.open = true;
      else if (sv === null && (d.dataset.g === 'ตั้งค่า & ระบบ' || d.dataset.g === 'รายงาน & ฟีดแบค')) d.open = true;
    } catch(e){}
    d.addEventListener('toggle', () => {
      try { localStorage.setItem(key, d.open ? '1' : '0'); } catch(e){}
      if (typeof requestAnimationFrame === 'function') requestAnimationFrame(() => syncNavPill(false));
    });
  });
  $('nav-items').querySelectorAll('[data-nav]').forEach(a => a.onclick = () => nav(a.dataset.nav));
  renderWsTabs(map);
  renderWsBar();
  renderBell(map);
  renderStatusBar();
  if (typeof requestAnimationFrame === 'function') requestAnimationFrame(() => syncNavPill(true));
}

function renderWsTabs(map){
  recentTabs = recentTabs.filter(k => !!map[k]);
  if (!recentTabs.includes(curTab) && map[curTab]) recentTabs.unshift(curTab);
  recentTabs = recentTabs.slice(0, 6);
  $('mailWstabs').innerHTML = recentTabs.map(k => `<button type="button" class="wstab ${k===curTab?'on':''}" data-nav="${k}">${svg(map[k].ic)}<span>${E(map[k].title)}</span></button>`).join('');
  $('mailWstabs').querySelectorAll('[data-nav]').forEach(b => b.onclick = () => nav(b.dataset.nav));
}

function nav(tab, pushHist=true){
  const map = getItemsMap();
  if (!map[tab]) tab = 'home';
  const changed = curTab !== tab;
  if (pushHist && curTab && changed) hist.push(curTab);
  if (changed) navRecord(tab);
  curTab = tab;
  try { location.hash = '#' + tab; } catch(e){}
  $('nav').classList.remove('open');
  closePops();
  renderNav();
  renderPage();
  if (changed) pmLandCards();
  if (typeof window.scrollTo === 'function') window.scrollTo(0, 0);
}

function renderBell(map){
  const items = [];
  const ic = APP.comments.filter(c => !c.replied).length;
  const nl = Number((APP.leadSummary && APP.leadSummary.new) || 0);
  const nf = Number((APP.fbSummary && APP.fbSummary.new) || 0);
  const sla = APP.leads.filter(l => l.sla_overdue).length;
  if (sla && map.crm) items.push(['crm','bad',`มีลูกค้าทักใหม่เกิน 4 ชม. ยังไม่ได้ตอบ ${sla} ราย (SLA)`]);
  if (nl && map.crm) items.push(['crm','warn',`ลูกค้าทักใหม่ใน CRM รอรับงาน ${nl} ราย`]);
  if (ic && map.inbox) items.push(['inbox','ac',`คอมเมนต์ที่ยังไม่ได้ตอบ ${ic} รายการ`]);
  if (nf && map.feedback) items.push(['feedback','ac',`ฟีดแบคลูกค้าใหม่ ${nf} รายการ`]);
  if (!APP.requireLogin && map.settings) items.push(['settings','warn','Login Gate ยังปิดอยู่ — แนะนำเปิดก่อนใช้งานจริง']);
  $('bell-n').textContent = items.length;
  $('bell-n').style.display = items.length ? '' : 'none';
  $('bellpanel').innerHTML = `<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px"><b>การแจ้งเตือน</b><span class="chip">${items.length} รายการ</span></div>` +
    (items.map(([k,cl,txt]) => `<div class="row" style="cursor:pointer" data-nav="${k}"><span class="chip ${cl}">${E((map[k]||{title:k}).title)}</span><span class="t" style="font-size:13px">${E(txt)}</span></div>`).join('') || '<div class="dim">ไม่มีรายการแจ้งเตือนค้าง</div>');
  $('bellpanel').querySelectorAll('[data-nav]').forEach(r => r.onclick = () => nav(r.dataset.nav));
}

// ---------- Panels: Theme 24 (14 Static + 10 Living Animated), Live Ideas (/api/ideas), Live Search (Ctrl+K), Advisor Drawer ----------
let thTab = 'static';
try {
  const sv = localStorage.getItem('pulsemetrics_th_tab');
  if (sv && ['static','anim','sys'].includes(sv)) thTab = sv;
  else if ((THEMES.find(t => t.id === prefs.theme) || {}).anim) thTab = 'anim';
} catch(e){}

function renderThemePanel(){
  const curObj = THEMES.find(t => t.id === prefs.theme) || THEMES[0];
  const statTh = THEMES.filter(t => !t.anim), animTh = THEMES.filter(t => t.anim);
  const dots = ['','#e8458b','#c2552d','#f59e0b','#2563eb','#7c3aed','#10b981'];
  const thBtn = t => `<button type="button" class="th-opt ${prefs.theme===t.id?'on':''}" data-th="${t.id}"><span class="thsw ${t.anim?'anim':''}" style="background:linear-gradient(135deg,${t.sw1} 50%,${t.sw2} 50%)"></span><span class="thnm">${E(t.name)}<small>${E(t.sub)}</small></span></button>`;
  let body = '';
  if (thTab === 'static') {
    body = `<div class="th-grid">${statTh.map(thBtn).join('')}</div>`
      + `<div class="th-sec">สีธีมกำหนดเอง (Custom Accent)</div>`
      + `<div style="display:flex;align-items:center;gap:6px;flex-wrap:wrap;margin-bottom:4px">`
      + dots.map(c => `<button type="button" class="th-dot ${prefs.accent===c?'on':''}" data-ac="${c}" title="${c||'ค่าเริ่มต้นธีม'}" style="background:${c||'conic-gradient(#ff6fae,#3b82f6,#10b981,#ff6fae)'}"></button>`).join('')
      + `<input type="color" id="th-col" value="${E(prefs.accent || curObj.sw2)}" title="เลือกสีอิสระ" style="width:28px;height:24px;padding:1px;border-radius:6px;cursor:pointer"></div>`;
  } else if (thTab === 'anim') {
    body = `<div class="th-grid">${animTh.map(thBtn).join('')}</div>`
      + `<div class="th-sec">เอฟเฟกต์แอนิเมชัน (ชุดเดียวกับแอป Mail)</div>`
      + `<div class="th-segs f2">`
      + `<button type="button" class="th-seg ${prefs.fx_mouse!==false?'on':''}" id="th-mouse" title="ขยับเมาส์ผ่านฉากหลังแล้วอนุภาค/กลีบดอกไม้/หิ่งห้อยโต้ตอบตามเมาส์">เมาส์โต้ตอบ: ${prefs.fx_mouse!==false?'เปิด':'ปิด'}</button>`
      + `<button type="button" class="th-seg ${prefs.nav_pill?'on':''}" id="th-pill">เมนูยืด-หด: ${prefs.nav_pill?'เปิด':'ปิด'}</button>`
      + `<button type="button" class="th-seg ${prefs.theme_ripple?'on':''}" id="th-rip">ธีมวงกลม: ${prefs.theme_ripple?'เปิด':'ปิด'}</button>`
      + `<button type="button" class="th-seg ${prefs.card_land?'on':''}" id="th-land">การ์ดลอยเข้า: ${prefs.card_land?'เปิด':'ปิด'}</button>`
      + `</div>`;
  } else {
    body = `<div class="th-sec" style="margin-top:2px">ฟอนต์ภาษาไทย</div>`
      + `<div class="th-segs f2">${FONTS.map(f => `<button type="button" class="th-seg ${prefs.font===f.id?'on':''}" data-fn="${f.id}">${E(f.name)}</button>`).join('')}</div>`
      + `<div class="th-sec">ขนาดตัวอักษร</div>`
      + `<div class="th-segs">${SIZES.map(s => `<button type="button" class="th-seg ${prefs.size===s.id?'on':''}" data-sz="${s.id}">${E(s.name)}</button>`).join('')}</div>`
      + `<div class="th-sec">ความหนาแน่นหน้าจอ (UI Density)</div>`
      + `<div class="th-segs">${DENSITIES.map(d => `<button type="button" class="th-seg ${(prefs.density||'normal')===d.id?'on':''}" data-dn="${d.id}">${E(d.name)}</button>`).join('')}</div>`;
  }
  $('thpanel').innerHTML = `
    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:4px">
      <div><b>ตกแต่งหน้าตาแอป (24 ธีม)</b><div class="dim" style="font-size:11px">${E(curObj.name)} · ชุดเดียวกับแอป Mail</div></div>
      <button type="button" class="ghost" style="padding:3px 9px;font-size:11.5px" id="th-rst">รีเซ็ต</button>
    </div>
    <div class="th-tabs">
      <button type="button" class="th-tab ${thTab==='static'?'on':''}" data-tht="static">ธีมสี (${statTh.length})</button>
      <button type="button" class="th-tab ${thTab==='anim'?'on':''}" data-tht="anim">อนิเมชั่น (${animTh.length})</button>
      <button type="button" class="th-tab ${thTab==='sys'?'on':''}" data-tht="sys">ฟอนต์ &amp; ระบบ</button>
    </div>
    ${body}
    <div class="th-f">
      <button type="button" class="th-q" id="th-flip">${curObj.dark?'สลับโหมดสว่าง':'สลับโหมดมืด'}</button>
      <button type="button" class="th-q" id="th-mini">${prefs.mini?'ขยายแถบซ้าย':'ย่อแถบซ้าย'}</button>
    </div>`;
  $('thpanel').querySelectorAll('[data-tht]').forEach(b => b.onclick = e => {
    e.stopPropagation();
    thTab = b.dataset.tht;
    try { localStorage.setItem('pulsemetrics_th_tab', thTab); } catch(err){}
    renderThemePanel();
  });
  $('thpanel').querySelectorAll('[data-th]').forEach(b => b.onclick = e => {
    e.stopPropagation();
    withThemeRipple(e, () => { prefs.theme = b.dataset.th; prefs.accent = ''; applyPrefs(); renderThemePanel(); });
  });
  $('thpanel').querySelectorAll('[data-fn]').forEach(b => b.onclick = e => { e.stopPropagation(); prefs.font = b.dataset.fn; applyPrefs(); renderThemePanel(); });
  $('thpanel').querySelectorAll('[data-sz]').forEach(b => b.onclick = e => { e.stopPropagation(); prefs.size = b.dataset.sz; applyPrefs(); renderThemePanel(); });
  $('thpanel').querySelectorAll('[data-dn]').forEach(b => b.onclick = e => { e.stopPropagation(); prefs.density = b.dataset.dn; applyPrefs(); renderThemePanel(); });
  $('thpanel').querySelectorAll('[data-ac]').forEach(b => b.onclick = e => { e.stopPropagation(); prefs.accent = b.dataset.ac; applyPrefs(); renderThemePanel(); });
  if ($('th-col')) {
    $('th-col').onclick = e => e.stopPropagation();
    $('th-col').oninput = e => { prefs.accent = e.target.value.toLowerCase(); applyPrefs(); };
  }
  if ($('th-mouse')) $('th-mouse').onclick = e => { e.stopPropagation(); prefs.fx_mouse = !(prefs.fx_mouse !== false); applyPrefs(); renderThemePanel(); toast(prefs.fx_mouse ? 'เปิดเอฟเฟกต์เมาส์โต้ตอบแล้ว' : 'ปิดเอฟเฟกต์เมาส์โต้ตอบแล้ว', 'ok'); };
  if ($('th-pill')) $('th-pill').onclick = e => { e.stopPropagation(); prefs.nav_pill = !prefs.nav_pill; applyPrefs(); renderThemePanel(); };
  if ($('th-rip')) $('th-rip').onclick = e => { e.stopPropagation(); prefs.theme_ripple = !prefs.theme_ripple; applyPrefs(); renderThemePanel(); };
  if ($('th-land')) $('th-land').onclick = e => { e.stopPropagation(); prefs.card_land = !prefs.card_land; applyPrefs(); renderThemePanel(); };
  if ($('th-flip')) $('th-flip').onclick = e => {
    e.stopPropagation();
    withThemeRipple(e, () => { prefs.theme = curObj.dark ? 'pink' : 'verdelo'; prefs.accent = ''; applyPrefs(); renderThemePanel(); });
  };
  if ($('th-mini')) $('th-mini').onclick = e => { e.stopPropagation(); prefs.mini = !prefs.mini; applyPrefs(); renderThemePanel(); };
  if ($('th-rst')) $('th-rst').onclick = e => {
    e.stopPropagation();
    withThemeRipple(e, () => { prefs.theme='pink'; prefs.font='noto'; prefs.size='md'; prefs.density='normal'; prefs.accent=''; prefs.nav_pill=true; prefs.theme_ripple=true; prefs.card_land=true; prefs.fx_mouse=true; applyPrefs(); renderThemePanel(); });
  };
}

async function renderIdeas(reload=false){
  if (reload || !APP.ideas.length) {
    const r = await api('/api/ideas');
    if (r && r.ok) APP.ideas = r.ideas || [];
  }
  $('ideapanel').innerHTML = `
    <b>สมุดจดไอเดียคอนเทนต์ (บันทึกลงฐานข้อมูลจริง)</b>
    <div style="display:flex;gap:6px;margin:8px 0">
      <input id="idea-in" placeholder="เพิ่มไอเดียคอนเทนต์ใหม่...">
      <button type="button" id="idea-add">เพิ่ม</button>
    </div>
    <div style="max-height:260px;overflow-y:auto">
      ${APP.ideas.map(x => `<div class="row">
        <span class="t" style="font-size:12.5px"><b>${E(x.title)}</b><div class="dim">${E(x.platform||'facebook')} · ${E(x.status||'idea')}</div></span>
        ${x.status!=='planned'?`<button type="button" class="ghost" data-ical="${x.id}" style="padding:2px 7px;font-size:11px" title="ส่งเข้าปฏิทิน">+ปฏิทิน</button>`:'<span class="chip ok">ลงคิวแล้ว</span>'}
        <button type="button" class="ghost" data-idel="${x.id}" style="padding:2px 7px;font-size:11px">ลบ</button>
      </div>`).join('') || '<div class="dim">ยังไม่มีไอเดียที่จดไว้</div>'}
    </div>`;
  if ($('idea-add')) $('idea-add').onclick = async () => {
    const v = ($('idea-in').value || '').trim(); if (!v) return;
    const r = await api('/api/ideas', {method:'POST', body:{title:v, platform:'facebook'}});
    if (r && r.ok) { toast('บันทึกไอเดียแล้ว ✓', 'ok'); renderIdeas(true); }
  };
  $('ideapanel').querySelectorAll('[data-ical]').forEach(b => b.onclick = async () => {
    const r = await api('/api/ideas', {method:'POST', body:{action:'to_calendar', id:+b.dataset.ical}});
    if (r && r.ok) { toast('ส่งเข้าปฏิทินพร้อมลิงก์ ' + (r.tracking_url||'') + ' แล้ว ✓', 'ok'); renderIdeas(true); }
  });
  $('ideapanel').querySelectorAll('[data-idel]').forEach(b => b.onclick = async () => {
    const r = await api('/api/ideas', {method:'POST', body:{action:'delete', id:+b.dataset.idel}});
    if (r && r.ok) renderIdeas(true);
  });
}

function renderCopilot(){
  $('copLog').innerHTML = APP.chatLog.map(m => `<div class="msg ${m.who==='user'?'me':''}" style="white-space:pre-wrap">${E(m.text)}</div>`).join('');
  $('copLog').scrollTop = $('copLog').scrollHeight;
}
function sendCopilot(txt){
  const q = (txt ?? $('copIn').value).trim(); if (!q) return;
  APP.chatLog.push({who:'user', text:q});
  if ($('copIn')) $('copIn').value = '';
  const low = q.toLowerCase();
  const cur = (APP.dash && APP.dash.current) || {};
  const ls = APP.leadSummary || {};
  let ans = '';
  if (low.includes('ลีด') || low.includes('crm') || low.includes('ลูกค้า')) {
    ans = `สรุป CRM ปัจจุบัน:\n• ลีดทั้งหมด ${fmt(ls.total)} ราย (ทักใหม่ ${fmt(ls.new)} · กำลังคุย/เสนอราคา ${fmt(ls.talking)} · ปิดการขาย ${fmt(ls.won)})\n• มูลค่าในมือ (Pipeline): ${fmt(ls.pipeline_thb)} บาท\n• ยอดปิดการขายแล้ว: ${fmt(ls.won_thb)} บาท\nแนะนำเปิดหน้า "CRM & ใบเสนอราคา" เพื่ออัปเดตสถานะหรือออกใบเสนอราคา VAT 7% ครับ`;
  } else if (low.includes('เว็บ') || low.includes('ga') || low.includes('คีย์เวิร์ด') || low.includes('seo')) {
    const topKw = (APP.web && APP.web.keywords && APP.web.keywords[0]) || null;
    ans = `สรุปเว็บเพจ & Google GA4:\n• ผู้เข้าชมเว็บ: ${fmt(cur.visitors)} คน · เปิดดูหน้าเว็บ: ${fmt(cur.pageviews)} ครั้ง\n• Google Search Console: เสิร์ชเจอ ${fmt(cur.gsc_impressions)} ครั้ง · คลิก ${fmt(cur.gsc_clicks)} ครั้ง` +
      (topKw ? `\n• คีย์เวิร์ดเด่นสุด: "${topKw.keyword}" (${fmt(topKw.impressions)} ครั้ง · อันดับ #${topKw.avg_position})` : '');
  } else if (low.includes('roas') || low.includes('แอด') || low.includes('โฆษณา')) {
    const rs = (APP.roi && APP.roi.summary) || null;
    ans = rs ? `สรุปแคมเปญยิงแอด & ROAS:\n• งบแอดรวม: ${fmt(rs.spend_thb)} บาท · ลีด ${fmt(rs.leads_cnt)} ราย (CPL ${fmt(rs.cpl)} บาท)\n• รายได้: ${fmt(rs.revenue_thb)} บาท · ROAS ${rs.roas}x (ROI ${rs.roi_pct}%)`
             : 'เปิดหน้า "ยิงแอด & ROAS" เพื่อโหลดและบันทึกงบโฆษณาจริงของบริษัทได้เลยครับ';
  } else {
    const tips = (APP.dash && APP.dash.advisor) || [];
    ans = `สรุปภาพรวม (ฟรี 0 โทเคน):\n• ผู้เข้าชมเว็บ ${fmt(cur.visitors)} คน · ลูกค้าทักรวม ${fmt(cur.total_leads)} คน · ปิดยอด ${fmt(cur.won_revenue)} บาท\n` +
      (tips[0] ? `• คำแนะนำเด่นตอนนี้ (${tips[0].label}): ${tips[0].title}\n→ ${tips[0].action}` : '• กดเลือกเมนูด้านซ้ายเพื่อจัดการข้อมูลจริงและซิงก์ API ได้เลยครับ');
  }
  APP.chatLog.push({who:'assistant', text:ans});
  renderCopilot();
}

let _cmdTimer = null;
function openCmd(){
  $('cmdov').classList.add('open'); $('cmdin').value = ''; renderCmd(''); setTimeout(() => $('cmdin').focus(), 20);
}
function renderCmd(q, remote){
  const low = q.trim().toLowerCase(), map = getItemsMap();
  const base = [
    ...Object.values(map).map(it => ({kind:it.g, label:it.title, q:it.k, fn:()=>nav(it.k)})),
    {kind:'คำสั่ง', label:'ย่อ/ขยาย แถบเครื่องมือมุมขวาบน', q:'dock', fn:()=>{ prefs.dock_mini=!(prefs.dock_mini!==false); applyPrefs(); }},
    {kind:'คำสั่ง', label:'เปิด/ปิด แอนิเมชันเมนูยืด-หด (Elastic Pill)', q:'pill slide motion', fn:()=>{ prefs.nav_pill=!prefs.nav_pill; applyPrefs(); }},
    {kind:'คำสั่ง', label:'เปิด/ปิด เอฟเฟกต์เมาส์โต้ตอบ (Mouse FX)', q:'mouse fx animation อนิเมชั่น', fn:()=>{ prefs.fx_mouse=!(prefs.fx_mouse!==false); applyPrefs(); toast(prefs.fx_mouse?'เปิดเอฟเฟกต์เมาส์โต้ตอบแล้ว':'ปิดเอฟเฟกต์เมาส์โต้ตอบแล้ว','ok'); }},
    ...THEMES.map(t => ({kind:t.anim?'ธีมอนิเมชั่น':'ธีม', label:'ธีม: ' + t.name + ' (' + t.sub + ')', q:'theme ธีม ' + (t.anim?'anim อนิเมชั่น ':'') + t.id + ' ' + t.sub, fn:()=>{ prefs.theme=t.id; prefs.accent=''; applyPrefs(); toast('เปลี่ยนเป็นธีม ' + t.name + ' แล้ว', 'ok'); }})),
  ].filter(x => !low || (x.label + ' ' + x.kind + ' ' + (x.q||'')).toLowerCase().includes(low));

  const extra = [];
  if (remote) {
    (remote.posts || []).forEach(p => extra.push({kind:'โพสต์', label:`[${p.platform}] ${p.title} (${p.leads_count} ทัก)`, fn:()=>nav('post')}));
    (remote.keywords || []).forEach(k => extra.push({kind:'GSC คีย์เวิร์ด', label:`${k.keyword} (#${k.avg_position})`, fn:()=>{ prefs.webSub='gsc'; APP.webQuery=k.keyword; savePrefs(); nav('website'); }}));
    (remote.campaigns || []).forEach(c => extra.push({kind:'แคมเปญแอด', label:`${c.campaign_name} (${c.platform})`, fn:()=>nav('roi')}));
  }
  const list = [...extra, ...base].slice(0, 28);
  $('cmdlist').innerHTML = list.map((x,i) => `<button type="button" class="cmd-it ${i===0?'sel':''}" data-ci="${i}"><span class="ck">${E(x.kind)}</span><span class="cl">${E(x.label)}</span></button>`).join('') || '<div class="dim" style="padding:12px">ไม่พบรายการที่ค้นหา</div>';
  $('cmdlist').querySelectorAll('[data-ci]').forEach(b => b.onclick = () => { $('cmdov').classList.remove('open'); list[+b.dataset.ci].fn(); });
}

let pomoSec = 25*60, pomoOn = false, pomoT = null;
function renderStatusBar(){
  const mm = String(Math.floor(pomoSec/60)).padStart(2,'0'), ss = String(pomoSec%60).padStart(2,'0');
  const curWs = APP.workspaces.find(w => w.id === ((APP.me && APP.me.workspace_id) || 1)) || {};
  const licStatus = (APP.license && APP.license.status === 'verified') ? 'ลิขสิทธิ์แท้ ✓' : 'โหมดทดลอง';
  $('mailStatusBar').innerHTML = `
    <span class="sb-it"><span class="sb-dot"></span>${E(curWs.name || 'PulseMetrics')} · ${licStatus}</span>
    <span class="sb-sep"></span>
    <button type="button" class="sb-it" data-nav="website">เว็บเพจ &amp; GA4</button>
    <button type="button" class="sb-it" data-nav="inbox">คอมเมนต์รอตอบ ${APP.comments.filter(c=>!c.replied).length}</button>
    <span class="sb-sp"></span>
    <button type="button" class="sb-pomo ${pomoOn?'run':''}" id="sb-pomo">${svg('clock')} ${mm}:${ss}</button>`;
  $('mailStatusBar').querySelectorAll('[data-nav]').forEach(b => b.onclick = () => nav(b.dataset.nav));
  if ($('sb-pomo')) $('sb-pomo').onclick = () => {
    pomoOn = !pomoOn; clearInterval(pomoT);
    if (pomoOn) pomoT = setInterval(() => { pomoSec = Math.max(0, pomoSec-1); renderStatusBar(); }, 1000);
    renderStatusBar();
  };
}

function closePops(){ ['thpanel','ideapanel','bellpanel'].forEach(id => $(id) && $(id).classList.remove('open')); }
function togglePop(id, fn){
  const el = $(id); if (!el) return;
  const was = el.classList.contains('open');
  closePops();
  if (!was) { if (fn) fn(); el.classList.add('open'); }
}

function renderPage(){
  const R = window.PM_RENDERERS || {};
  const W = window.PM_WIRE || {};
  $('page').innerHTML = (R[curTab] || R.home || (() => '<div class="card">กำลังโหลด…</div>'))();
  const b = $('btn-back'); if (b) b.onclick = () => { if (hist.length) nav(hist.pop(), false); };
  $('page').querySelectorAll('[data-nav]').forEach(el => el.onclick = () => nav(el.dataset.nav));
  if (W[curTab]) W[curTab]();
  wireChartTips();
}

// Export globals for suite_pages.js
window.PM = {
  ICONS, THEMES, FONTS, SIZES, DENSITIES, PL, PL_KEYS,
  $, E, fmt, svg, plogo, plStrip, expIcon,
  prefs, savePrefs, applyPrefs, APP, hasPerm, api, rangeQuery, resetWorkspaceCache,
  toast, copyTextSafe, openModal, closeModal, deltaChip, multiLineChart, donutSvg, gradeTitle,
  pageHead, rangeBarHtml, wireRangeBar,
  nav, renderNav, renderPage, renderWsBar, renderThemePanel, togglePop, closePops,
  getCurTab: () => curTab,
};

// ---------- Shell Event Listeners ----------
$('navtog').onclick = () => { prefs.mini = !prefs.mini; applyPrefs(); };
$('mtog').onclick = () => $('nav').classList.toggle('open');
$('btn-refresh').onclick = () => { resetWorkspaceCache(); renderPage(); toast('กำลังรีเฟรชข้อมูลล่าสุดจากฐานข้อมูล…', 'ok'); };
$('docktog').onclick = e => { e.stopPropagation(); prefs.dock_mini = !(prefs.dock_mini !== false); applyPrefs(); };
$('copbtn').onclick = () => { closePops(); $('copDrawer').classList.add('open'); $('drawerBg').classList.add('open'); renderCopilot(); };
$('cmdbtn').onclick = openCmd;
$('ideabtn').onclick = () => togglePop('ideapanel', () => renderIdeas(true));
$('thbtn').onclick = () => togglePop('thpanel', renderThemePanel);
$('focbtn').onclick = () => { prefs.focus = !prefs.focus; applyPrefs(); };
$('bellbtn').onclick = () => togglePop('bellpanel', () => renderBell(getItemsMap()));
$('drawerBg').onclick = () => { $('copDrawer').classList.remove('open'); $('drawerBg').classList.remove('open'); };
$('copCls').onclick = () => { $('copDrawer').classList.remove('open'); $('drawerBg').classList.remove('open'); };
$('copSend').onclick = () => sendCopilot();
$('copIn').onkeydown = e => { if (e.key === 'Enter') sendCopilot(); };
$('cmdov').onclick = e => { if (e.target === $('cmdov')) $('cmdov').classList.remove('open'); };
$('cmdin').oninput = e => {
  const val = e.target.value;
  renderCmd(val);
  clearTimeout(_cmdTimer);
  if (val.trim().length >= 2) {
    _cmdTimer = setTimeout(async () => {
      const r = await api('/api/search?q=' + encodeURIComponent(val.trim()));
      if ($('cmdov').classList.contains('open') && $('cmdin').value === val) renderCmd(val, r && r.ok ? r : null);
    }, 200);
  }
};
$('quoteOv').onclick = e => { if (e.target === $('quoteOv')) closeModal(); };
document.addEventListener('click', e => {
  if (!e.target.closest('#utildock') && !e.target.closest('.pop-panel') && !e.target.closest('#set-th')) closePops();
});
document.addEventListener('keydown', e => {
  if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') { e.preventDefault(); openCmd(); }
  else if (e.altKey && e.key.toLowerCase() === 't') {
    e.preventDefault();
    const curObj = THEMES.find(t => t.id === prefs.theme) || THEMES[0];
    withThemeRipple(null, () => { prefs.theme = curObj.dark ? 'pink' : 'verdelo'; prefs.accent = ''; applyPrefs(); });
  }
  else if (e.altKey && e.key.toLowerCase() === 'n') { e.preventDefault(); togglePop('ideapanel', () => renderIdeas(true)); }
  else if (e.key === 'Escape') { closePops(); $('copDrawer').classList.remove('open'); $('drawerBg').classList.remove('open'); $('cmdov').classList.remove('open'); closeModal(); }
});
if (window.addEventListener) window.addEventListener('resize', () => syncNavPill(false));

// ---------- Boot ----------
window.PM_BOOT = async function(){
  applyPrefs();
  try {
    const me = await api('/api/auth/me');
    if (me && me.ok) {
      APP.me = me.user;
      APP.workspaces = me.workspaces || [];
      APP.requireLogin = !!me.require_login;
      if (me.brand) APP.brand = Object.assign(APP.brand, me.brand);
      applyPrefs();
    }
    // Prefetch lightweight badges in parallel (non-blocking)
    Promise.all([
      hasPerm('leads') ? api('/api/leads').then(r => { if (r && r.ok) { APP.leads = r.leads || []; APP.leadPosts = r.posts || []; APP.leadSummary = r.summary || APP.leadSummary; } }).catch(()=>{}) : null,
      hasPerm('comments') ? api('/api/comments').then(r => { if (r && r.ok) APP.comments = r.comments || []; }).catch(()=>{}) : null,
      hasPerm('feedback') ? api('/api/feedback/summary').then(r => { if (r && r.ok) APP.fbSummary.new = r.new_count || 0; }).catch(()=>{}) : null,
      hasPerm('settings') ? api('/api/admin/settings').then(r => { if (r && r.ok) { APP.adminSettings = r.settings; APP.license = r.license; } }).catch(()=>{}) : null,
    ]).then(() => renderNav()).catch(()=>{});
  } catch(e){}
  const startTab = (location.hash || '').replace(/^#/, '') || 'home';
  nav(startTab, false);
};
})();
