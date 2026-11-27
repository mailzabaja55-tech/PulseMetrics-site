/* PulseMetrics Business Suite — Live Analytics, Website/GA4, Content, Strategy & Goals */
(function(){
'use strict';
const {
  PL, $, E, fmt, svg, plogo, plStrip, expIcon,
  prefs, savePrefs, APP, hasPerm, api, rangeQuery,
  toast, copyTextSafe, openModal, closeModal, deltaChip, multiLineChart, donutSvg, gradeTitle,
  pageHead, rangeBarHtml, wireRangeBar, nav, renderNav, renderPage, getCurTab,
} = window.PM;

const R = window.PM_RENDERERS = window.PM_RENDERERS || {};
const W = window.PM_WIRE = window.PM_WIRE || {};

let pkgTitle = 'เปิดตัวระบบแดชบอร์ดการตลาดองค์กร — วัดยอดลูกค้าทักจาก Facebook + GA4 ในจอเดียว!';
let statsMetric = 'visitors';

// ---------- Shared Live Data Loaders ----------
async function loadDash(force=false){
  const key = rangeQuery();
  if (!force && APP.dash && APP.dashKey === key) return;
  if (APP.loading.dash) return;
  APP.loading.dash = true;
  try {
    const [rd, rws, rl] = await Promise.all([
      api('/api/dashboard?' + key),
      hasPerm('settings') ? api('/api/workspace') : Promise.resolve(null),
      hasPerm('leads') ? api('/api/leads') : Promise.resolve(null),
    ]);
    if (rd && rd.ok) { APP.dash = rd; APP.dashKey = key; }
    if (rws && rws.ok) { APP.ws = rws.workspace; APP.syncLogs = rws.sync_logs || []; APP.dataDir = rws.data_dir || ''; }
    if (rl && rl.ok) { APP.leads = rl.leads || []; APP.leadPosts = rl.posts || []; APP.leadSummary = rl.summary || APP.leadSummary; }
  } finally {
    APP.loading.dash = false;
    if (getCurTab() === 'home' || getCurTab() === 'stats' || getCurTab() === 'marketing') { renderNav(); renderPage(); }
  }
}

async function loadWebsite(force=false){
  const key = rangeQuery();
  if (!force && APP.web && APP.webKey === key) return;
  if (APP.loading.web) return;
  APP.loading.web = true;
  try {
    const [rw, rd, rws] = await Promise.all([
      api('/api/website?' + key),
      api('/api/dashboard?' + key),
      hasPerm('settings') ? api('/api/workspace') : Promise.resolve(null),
    ]);
    if (rw && rw.ok) { APP.web = rw; APP.webKey = key; }
    if (rd && rd.ok) { APP.dash = rd; APP.dashKey = key; }
    if (rws && rws.ok) { APP.ws = rws.workspace; APP.syncLogs = rws.sync_logs || []; }
  } finally {
    APP.loading.web = false;
    if (getCurTab() === 'website') renderPage();
  }
}

async function loadPostsAndCalendar(force=false){
  if (!force && APP.loaded.posts) return;
  if (APP.loading.posts) return;
  APP.loading.posts = true;
  try {
    const [rp, rc, re] = await Promise.all([
      api('/api/posts'),
      hasPerm('calendar') ? api('/api/calendar') : Promise.resolve(null),
      hasPerm('calendar') ? api('/api/evergreen') : Promise.resolve(null),
    ]);
    if (rp && rp.ok) APP.posts = rp.posts || [];
    if (rc && rc.ok) APP.calendar = rc.items || [];
    if (re && re.ok) APP.evergreen = re.items || re.posts || [];
    APP.loaded.posts = true;
  } finally {
    APP.loading.posts = false;
    if (getCurTab() === 'post' || getCurTab() === 'stats' || getCurTab() === 'marketing') renderPage();
  }
}

async function loadCompetitors(force=false){
  if (!force && APP.loaded.comp) return;
  if (APP.loading.comp) return;
  APP.loading.comp = true;
  try {
    const [rc, re] = await Promise.all([
      api('/api/competitors'),
      hasPerm('calendar') ? api('/api/evergreen') : Promise.resolve(null),
    ]);
    if (rc && rc.ok) APP.competitors = rc.competitors || [];
    if (re && re.ok) APP.evergreen = re.items || re.posts || [];
    APP.loaded.comp = true;
  } finally {
    APP.loading.comp = false;
    if (getCurTab() === 'marketing') renderPage();
  }
}

async function loadGoals(force=false){
  if (!force && APP.loaded.goals) return;
  if (APP.loading.goals) return;
  APP.loading.goals = true;
  try {
    const r = await api('/api/goals');
    if (r && r.ok) APP.goals = r.goals || [];
    APP.loaded.goals = true;
  } finally {
    APP.loading.goals = false;
    if (getCurTab() === 'goal') renderPage();
  }
}

async function syncConnector(plat){
  if (APP.syncing) return;
  APP.syncing = plat;
  renderPage();
  try {
    const r = await api('/api/connectors/sync', {method:'POST', body:{platform: plat}});
    if (r && r.ok) {
      toast(r.message || `ซิงก์ ${plat.toUpperCase()} เรียบร้อยแล้ว ✓`, 'ok');
      APP.syncing = '';
      await Promise.all([loadDash(true), getCurTab()==='website' ? loadWebsite(true) : Promise.resolve()]);
      return;
    }
    const err = (r && r.error) || 'ซิงก์ไม่สำเร็จ — ตรวจสอบการตั้งค่า API Key';
    toast(err, 'warn');
    if (plat === 'ga4' || plat === 'gsc') openGaSettingsModal();
  } finally {
    APP.syncing = '';
    renderPage();
  }
}

async function syncGSheetsNow(){
  toast('กำลังส่งออก 6 ชีตไปยัง Google Sheets…', 'ok');
  const r = await api('/api/export/gsheets', {
    method:'POST',
    body:{preset:prefs.rangePreset, start:prefs.rangeStart, end:prefs.rangeEnd, compare:prefs.rangeCompare},
  });
  if (r && r.ok) {
    toast(r.message || 'ซิงก์ข้อมูล 6 แท็บขึ้น Google Sheets สำเร็จ ✓', 'ok');
  } else {
    toast((r && r.error) || 'ยังไม่ได้ใส่ Google Sheet ID / Service Account ในหน้าตั้งค่า', 'warn');
  }
}

// ---------- GA4 / Website Quick Setup Modal ----------
async function openGaSettingsModal(){
  if (!APP.ws && hasPerm('settings')) {
    const rws = await api('/api/workspace');
    if (rws && rws.ok) { APP.ws = rws.workspace; APP.syncLogs = rws.sync_logs || []; }
  }
  const w = APP.ws || {};
  const cs = (w.api_config_status && w.api_config_status.google_service_account_json) || {};
  const saBadge = cs.configured
    ? `<span class="chip ok">ตั้งค่าแล้ว (${E(cs.preview || 'JSON')})</span>`
    : '<span class="chip warn">ยังไม่ได้ใส่ Google Service Account JSON</span>';
  openModal(`
    <div style="display:flex;align-items:center;justify-content:space-between;gap:10px;margin-bottom:10px">
      <div style="display:flex;align-items:center;gap:9px">${plogo('ga4',24)}<div><b style="font-size:16.5px">ตั้งค่าเชื่อมต่อเว็บเพจ &amp; Google Analytics (GA4)</b><div class="dim">ใช้ Google Service Account JSON ชุดเดียวกันได้ทั้ง GA4, Search Console และ Google Sheets</div></div></div>
      <button type="button" class="ghost" id="ga-cls" style="padding:4px 10px;font-size:12px">ปิด</button>
    </div>
    <div id="ga-msg" class="dim" style="margin-bottom:10px;font-size:12.5px"></div>
    <div style="display:grid;gap:10px">
      <div><label class="dim">เว็บไซต์หลัก (Website URL)</label><input id="ga-web" value="${E(w.website_url || '')}" placeholder="https://example.com"></div>
      <div class="grid g2" style="gap:10px">
        <div><label class="dim">GA4 Property ID</label><input id="ga-prop" value="${E(w.ga4_property_id || '')}" placeholder="properties/123456789"></div>
        <div><label class="dim">Google Search Console Site URL</label><input id="ga-gsc" value="${E(w.gsc_site_url || '')}" placeholder="https://example.com/"></div>
      </div>
      <div>
        <div style="display:flex;align-items:center;justify-content:space-between;gap:8px;margin-bottom:4px">
          <label class="dim">Google Service Account JSON (เว้นว่าง = ใช้คีย์เดิม)</label>${saBadge}
        </div>
        <textarea id="ga-sa" rows="4" placeholder='วางเนื้อหาไฟล์ service-account.json เช่น {"type":"service_account","client_email":"...","private_key":"..."}'></textarea>
      </div>
    </div>
    <div style="display:flex;justify-content:space-between;align-items:center;gap:8px;flex-wrap:wrap;margin-top:14px">
      <div style="display:flex;gap:6px;flex-wrap:wrap">
        <button type="button" class="ghost" id="ga-test-ga4" style="font-size:12px">ทดสอบ GA4</button>
        <button type="button" class="ghost" id="ga-test-gsc" style="font-size:12px">ทดสอบ Search Console</button>
      </div>
      <div style="display:flex;gap:8px;flex-wrap:wrap">
        <button type="button" class="ghost" id="ga-save">${svg('save')} บันทึกการตั้งค่า</button>
        <button type="button" id="ga-save-sync">${svg('refresh')} บันทึก &amp; ซิงก์ GA4</button>
      </div>
    </div>`);
  $('ga-cls').onclick = closeModal;
  const setStatus = (txt, ok=true) => { const el = $('ga-msg'); if (el) el.innerHTML = `<span class="chip ${ok?'ok':'warn'}">${E(txt)}</span>`; };
  const doSave = async () => {
    const body = {website_url:$('ga-web').value.trim(), ga4_property_id:$('ga-prop').value.trim(), gsc_site_url:$('ga-gsc').value.trim()};
    const sa = $('ga-sa').value.trim();
    if (sa) body.api_credentials = {google_service_account_json: sa};
    const r = await api('/api/workspace', {method:'POST', body});
    if (r && r.ok) {
      const rws = await api('/api/workspace');
      if (rws && rws.ok) { APP.ws = rws.workspace; APP.syncLogs = rws.sync_logs || []; }
      setStatus('บันทึกการตั้งค่าเว็บเพจ & Google GA4 เรียบร้อยแล้ว ✓', true);
      toast('บันทึกการตั้งค่า GA4 แล้ว', 'ok');
      renderPage();
      return true;
    }
    setStatus((r && r.error) || 'บันทึกไม่สำเร็จ', false);
    return false;
  };
  $('ga-save').onclick = doSave;
  $('ga-save-sync').onclick = async () => {
    if (!(await doSave())) return;
    setStatus('กำลังดึงข้อมูลจาก Google Analytics 4…', true);
    const r = await api('/api/connectors/sync', {method:'POST', body:{platform:'ga4'}});
    setStatus((r && (r.message || r.error)) || 'ไม่ทราบผล', !!(r && r.ok));
    if (r && r.ok) { toast(r.message || 'ซิงก์ GA4 สำเร็จ ✓', 'ok'); await loadWebsite(true); }
  };
  const doTest = async (plat) => {
    setStatus(`กำลังทดสอบเชื่อมต่อ ${plat.toUpperCase()}…`, true);
    const r = await api('/api/connectors/test', {method:'POST', body:{platform:plat}});
    setStatus((r && (r.message || r.error)) || 'ไม่ทราบผล', !!(r && r.ok));
  };
  $('ga-test-ga4').onclick = () => doTest('ga4');
  $('ga-test-gsc').onclick = () => doTest('gsc');
}

// ---------- 1. HOME (Executive Dashboard — Live) ----------
R.home = function(){
  const d = APP.dash;
  const cur = (d && d.current) || {};
  const dl = (d && d.deltas) || {};
  const rng = (d && d.range) || {};
  const health = (d && d.health) || {score:0, grade:'-', breakdown:[]};
  const brief = (d && d.morning_brief) || {items:[]};
  const ls = APP.leadSummary || {};
  const ser = (d && d.series && d.series.current) || [];
  const topPosts = (d && d.top_posts) || [];
  const advisor = (d && d.advisor) || [];
  const busy = APP.syncing;

  return pageHead(
    'แดชบอร์ดหลักผู้บริหาร',
    d ? `ข้อมูลจริงฐานข้อมูล · ช่วง ${rng.start||'-'} ถึง ${rng.end||'-'} (${rng.compare_label||''})` : 'กำลังโหลดข้อมูลจากฐานข้อมูล PulseMetrics…',
    `<a class="ghost" href="/report?${rangeQuery()}" target="_blank" rel="noopener" style="display:inline-flex;align-items:center;gap:6px;padding:7px 12px;border-radius:10px;border:1px solid var(--bd);background:var(--surf);color:var(--tx);text-decoration:none;font-size:13px;font-weight:600">${svg('file')} รายงาน PDF ↗</a>`
  ) + rangeBarHtml(`
    <a class="exp-btn xl" href="/api/export/excel?${rangeQuery()}" style="text-decoration:none">${expIcon('xl')} Excel 6 ชีต</a>
    <button type="button" class="exp-btn gs" id="home-gs">${expIcon('gs')} ซิงก์ Google Sheets</button>
    <button type="button" class="ghost" id="home-reload" style="padding:6px 10px;font-size:12.5px">${svg('refresh')} รีเฟรช</button>
  `) + `
  <div class="hero">
    <div style="display:flex;align-items:center;gap:16px;flex-wrap:wrap">
      <div class="hs-ring" style="--p:${health.score||0}"><div>${health.score||0}</div></div>
      <div>
        <div class="chip ac" style="margin-bottom:5px">${svg('sparkles')} Marketing Health Score · เกรด ${E(health.grade||'-')} (ฟรี 0 โทเคน)</div>
        <div style="font-size:19px;font-weight:800">ยอดขายปิดแล้ว ฿${fmt(ls.won_thb || cur.won_revenue)} · Pipeline ในมือ ฿${fmt(ls.pipeline_thb)}</div>
        <div class="dim" style="margin-top:2px">ผู้เข้าชมเว็บ ${fmt(cur.visitors)} คน · ลูกค้าทักรวม ${fmt(cur.total_leads)} คน · ปิดการขาย ${fmt(ls.won || cur.won_deals)} ดีล</div>
      </div>
    </div>
    <div style="display:flex;gap:8px;flex-wrap:wrap">
      <button type="button" data-nav="stats">${svg('chart')} สถิติ &amp; วิเคราะห์</button>
      <button type="button" class="ghost" data-nav="website">${plogo('ga4',16)} เว็บเพจ &amp; Google GA</button>
    </div>
  </div>

  <div class="card" style="margin-bottom:14px;padding:13px 15px">
    <div style="display:flex;align-items:center;justify-content:space-between;gap:8px;flex-wrap:wrap;margin-bottom:9px">
      <b style="font-size:14px;display:inline-flex;align-items:center;gap:6px">${svg('refresh')} ซิงก์ข้อมูลจริงจาก API 4 ช่องทาง &amp; ทางลัดเว็บเพจ</b>
      <div style="display:flex;gap:6px;flex-wrap:wrap">
        <button type="button" id="sync-all-live" ${busy?'disabled':''} style="padding:5px 11px;font-size:12px">${svg('refresh')} ${busy==='all'?'กำลังซิงก์ทั้งหมด…':'ซิงก์ทั้งหมด (GA4/GSC/FB/YT)'}</button>
        <button type="button" class="ghost" data-nav="settings" style="padding:5px 10px;font-size:12px">${svg('settings')} ตั้งค่า API</button>
      </div>
    </div>
    <div class="ops-row">
      ${[['ga4','Google GA4','ga4'],['gsc','Search Console','gsc'],['facebook','Facebook Page','fb'],['youtube','YouTube','yt']].map(([k,lbl,ic]) => `
        <button type="button" class="sync-btn ${busy===k?'busy':''}" data-lsync="${k}" ${busy?'disabled':''}>
          ${plogo(ic,18)}<span>${busy===k?'กำลังซิงก์…':lbl}</span><span class="st-tm">ซิงก์จริง</span>
        </button>`).join('')}
      <button type="button" class="sync-btn" data-nav="website">${plogo('web',18)}<span>ดูเว็บเพจ &amp; GA4</span><span class="st-tm">เปิด →</span></button>
    </div>
    <div class="dim" style="margin-top:8px;font-size:11.5px">ซิงก์อัตโนมัติผ่าน API จริง 4 ช่องทาง (GA4, Search Console, Facebook, YouTube) · TikTok &amp; Instagram วัดยอดเข้าเว็บ/ทักแชทผ่านลิงก์ <code>/go/รหัสโพสต์</code></div>
  </div>

  <div class="grid g4" style="margin-bottom:14px">
    <div class="card kpi"><div class="dim" style="display:flex;align-items:center;gap:6px">${plogo('ga4',17)} ผู้เข้าชมเว็บ (GA4)</div><div class="v">${fmt(cur.visitors)}</div>${deltaChip(dl.visitors)}</div>
    <div class="card kpi"><div class="dim" style="display:flex;align-items:center;gap:6px">${plogo('gsc',17)} เสิร์ชเจอ Google (GSC)</div><div class="v">${fmt(cur.gsc_impressions)}</div><div style="display:flex;gap:6px;flex-wrap:wrap">${deltaChip(dl.gsc_impressions)}<span class="dim">คลิก ${fmt(cur.gsc_clicks)}</span></div></div>
    <div class="card kpi"><div class="dim" style="display:flex;align-items:center;gap:6px">${plogo('fb',17)}${plogo('yt',17)} ยอดวิว FB + YouTube</div><div class="v">${fmt((cur.fb_views||0)+(cur.yt_views||0))}</div><div class="dim">FB ${fmt(cur.fb_views)} · YT ${fmt(cur.yt_views)}</div></div>
    <div class="card kpi"><div class="dim" style="display:flex;align-items:center;gap:6px">${svg('coins')} ลูกค้าทักรวม (Leads)</div><div class="v">${fmt(cur.total_leads)}</div>${deltaChip(dl.total_leads)}</div>
  </div>

  <div class="card" style="margin-bottom:14px">
    <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:8px;margin-bottom:6px">
      <h3 style="margin:0">${svg('trend')} กราฟแนวโน้มรายวันจากฐานข้อมูลจริง</h3>
      <button type="button" class="ghost" data-nav="stats" style="padding:4px 10px;font-size:12px">วิเคราะห์เชิงลึก →</button>
    </div>
    ${multiLineChart(ser.map(x => x.label), [
      {name:'ผู้เข้าชมเว็บ (GA4)', color:'#F9AB00', vals:ser.map(x => x.visitors||0)},
      {name:'Facebook Views', color:'#1877F2', vals:ser.map(x => x.fb_views||0)},
      {name:'YouTube Views', color:'#FF0000', vals:ser.map(x => x.yt_views||0)},
    ])}
  </div>

  <div class="grid g2" style="margin-bottom:14px">
    <div class="card">
      <h3>${svg('check-circle')} Morning Brief งานด่วนวันนี้</h3>
      ${(brief.items || []).map(it => `<div class="row"><span class="chip ${it.level==='urgent'?'bad':it.level==='warn'?'warn':'ok'}">${E(it.badge||'งาน')}</span><span class="t">${E(it.text)}</span></div>`).join('') || '<div class="dim">ไม่มีงานค้างเร่งด่วนในตอนนี้ ✓</div>'}
      <div style="display:flex;gap:8px;flex-wrap:wrap;margin-top:10px">
        <button type="button" class="ghost" data-nav="post" style="font-size:12px">ไปดูปฏิทิน &amp; โพสต์ →</button>
        <button type="button" class="ghost" data-nav="inbox" style="font-size:12px">ไปตอบคอมเมนต์ →</button>
      </div>
    </div>
    <div class="card">
      <h3>${svg('sparkles')} คำแนะนำต่อยอดจากข้อมูลจริง (ฟรี 0 โทเคน)</h3>
      ${advisor.slice(0,3).map(a => `<div class="row" style="align-items:flex-start"><span class="chip ${a.priority==='high'?'warn':'ac'}">${E(a.label)}</span><div class="t"><b style="font-size:13px">${E(a.title)}</b><div class="dim">${E(a.action)}</div></div></div>`).join('') || '<div class="dim">เมื่อมีข้อมูลโพสต์/เว็บ ระบบจะวิเคราะห์จุดต่อยอดให้อัตโนมัติ</div>'}
    </div>
  </div>

  <div class="card">
    <div style="display:flex;justify-content:space-between;align-items:center;gap:8px;margin-bottom:8px">
      <h3 style="margin:0">${svg('trophy')} โพสต์ที่สร้างลูกค้าทักมากที่สุด (Post-to-Lead Attribution)</h3>
      <button type="button" class="ghost" data-nav="post" style="padding:4px 10px;font-size:12px">จัดการโพสต์ทั้งหมด →</button>
    </div>
    <div style="overflow-x:auto">
      <table>
        <thead><tr><th>แพลตฟอร์ม</th><th>หัวข้อโพสต์</th><th>รหัสติดตาม</th><th>ยอดวิว</th><th>คลิกเว็บ</th><th>ลูกค้าทัก</th><th>ยอดขาย (฿)</th></tr></thead>
        <tbody>${topPosts.slice(0,6).map(p => `<tr>
          <td>${plogo(p.platform,16)} ${E(p.platform)}</td>
          <td><b>${E(p.title)}</b></td>
          <td><code>/go/${E(p.tracking_code)}</code></td>
          <td>${fmt(p.views)}</td>
          <td>${fmt(p.web_clicks)}</td>
          <td><span class="chip ok">${fmt(p.effective_leads)} คน</span></td>
          <td><b>฿${fmt(p.revenue_thb)}</b></td>
        </tr>`).join('') || '<tr><td colspan="7" class="dim" style="text-align:center;padding:16px">ยังไม่มีโพสต์ในฐานข้อมูล — เพิ่มโพสต์ได้ในหน้า "ปฏิทิน &amp; โพสต์วัดผล"</td></tr>'}</tbody>
      </table>
    </div>
  </div>`;
};
W.home = function(){
  if (!APP.dash || APP.dashKey !== rangeQuery()) loadDash(false);
  wireRangeBar(() => loadDash(true));
  if ($('home-reload')) $('home-reload').onclick = () => loadDash(true);
  if ($('home-gs')) $('home-gs').onclick = syncGSheetsNow;
  if ($('sync-all-live')) $('sync-all-live').onclick = () => syncConnector('all');
  $('page').querySelectorAll('[data-lsync]').forEach(b => b.onclick = () => syncConnector(b.dataset.lsync));
};

// ---------- 2. WEBSITE & GOOGLE GA4 (Separate Sidebar Menu — Live) ----------
R.website = function(){
  const d = APP.web || {};
  const c = d.current || {};
  const dl = d.deltas || {};
  const rng = d.range || {};
  const ws = APP.ws || {};
  const saCfg = ws.api_config_status && ws.api_config_status.google_service_account_json && ws.api_config_status.google_service_account_json.configured;
  const wsId = ws.id || (APP.me && APP.me.workspace_id) || 1;
  const origin = (location.origin && location.origin !== 'null') ? location.origin : 'http://127.0.0.1:8090';
  const snippet = `<script src="${origin}/tracker.js" data-workspace="${wsId}"><` + `/script>`;
  const pages = d.pages || [];
  const keywords = d.keywords || [];
  const channels = d.channels || [];
  const events = d.recent_events || [];
  const q = (APP.webQuery || '').trim().toLowerCase();
  const fPages = q ? pages.filter(p => (String(p.path||'') + ' ' + String(p.title||'')).toLowerCase().includes(q)) : pages;
  const fKws = q ? keywords.filter(k => (String(k.keyword||'') + ' ' + String(k.landing_page||'')).toLowerCase().includes(q)) : keywords;
  const chColors = ['#2563eb','#1877f2','#1baf7a','#ef4444','#f59e0b','#7c3aed','#06b6d4'];
  const chSlices = channels.map((ch, i) => ({name:ch.channel, val:Number(ch.users||0), color:chColors[i%chColors.length]}));
  const totCh = Math.max(1, chSlices.reduce((a,b) => a + b.val, 0));

  const mMap = {
    visitors:{label:'ผู้เข้าชมเว็บ (GA4 Users)', color:'#f59e0b', unit:' คน'},
    gsc_imp:{label:'เสิร์ชเจอบน Google (GSC)', color:'#2563eb', unit:' ครั้ง'},
    leads:{label:'ลูกค้าทักรวม (Leads)', color:'#1baf7a', unit:' คน'},
  };
  const mKey = mMap[prefs.webMetric] ? prefs.webMetric : 'visitors';
  const mInfo = mMap[mKey];
  const serCur = (APP.dash && APP.dash.series && APP.dash.series.current) || [];
  const serPrv = (APP.dash && APP.dash.series && APP.dash.series.previous) || [];
  const serLines = [{name:mInfo.label+' (ช่วงนี้)', color:mInfo.color, vals:serCur.map(x => Number(x[mKey]||0))}];
  if (serPrv.length) serLines.push({name:mInfo.label+' (ช่วงก่อน)', color:'#94a3b8', dash:true, vals:serCur.map((_,i) => Number((serPrv[i] && serPrv[i][mKey]) || 0))});

  const rightBtns = `
    <button type="button" class="sync-btn ${APP.syncing==='ga4'?'busy':''}" id="web-sync-ga4" ${APP.syncing?'disabled':''}>${plogo('ga4',17)} <span>${APP.syncing==='ga4'?'กำลังซิงก์ GA4…':'ซิงก์ Google GA4'}</span></button>
    <button type="button" class="sync-btn ${APP.syncing==='gsc'?'busy':''}" id="web-sync-gsc" ${APP.syncing?'disabled':''}>${plogo('web',17)} <span>${APP.syncing==='gsc'?'กำลังซิงก์ GSC…':'ซิงก์ Search Console'}</span></button>
    <button type="button" class="ghost" id="web-cfg-btn">${svg('settings')} ตั้งค่า GA4</button>
    <a class="ghost" href="/site" target="_blank" rel="noopener" style="display:inline-flex;align-items:center;gap:6px;padding:8px 12px;border-radius:10px;border:1px solid var(--bd);background:var(--surf);color:var(--tx);text-decoration:none;font-size:13px;font-weight:600">${svg('link')} เว็บทดสอบ (/site) ↗</a>`;

  return pageHead('เว็บเพจ & Google Analytics (GA4)', `${ws.website_url ? ws.website_url + ' · ' : ''}ช่วง ${rng.start||'-'} ถึง ${rng.end||'-'} · ${rng.compare_label||''}`, rightBtns) +
  rangeBarHtml(`
    <a class="exp-btn xl" href="/api/export/excel?${rangeQuery()}" style="text-decoration:none">${expIcon('xl')} Excel 6 ชีต</a>
    <button type="button" class="ghost" id="web-reload" style="padding:6px 10px;font-size:12.5px">${svg('refresh')} รีเฟรช</button>
  `) + `
  <div class="card" style="margin-bottom:14px;padding:10px 14px;display:flex;align-items:center;gap:8px;flex-wrap:wrap;font-size:12px">
    <span class="chip ok">เชื่อมต่อฐานข้อมูล PulseMetrics จริง</span>
    <span class="chip">${plogo('ga4',14)} GA4: <b>${E(ws.ga4_property_id || 'ยังไม่ระบุ Property ID')}</b></span>
    <span class="chip">${plogo('web',14)} GSC: <b>${E(ws.gsc_site_url || 'ยังไม่ระบุ Site URL')}</b></span>
    <span class="chip ${saCfg?'ok':'warn'}">${saCfg?'Google Service Account พร้อมซิงก์ ✓':'ยังไม่ได้ใส่ Service Account JSON'}</span>
  </div>

  <div class="grid g4" style="margin-bottom:14px">
    <div class="card kpi"><div class="dim" style="display:flex;align-items:center;gap:6px">${plogo('ga4',17)} ผู้เข้าชมเว็บ (GA4 Users)</div><div class="v">${fmt(c.visitors)}</div><div style="display:flex;gap:6px;flex-wrap:wrap">${deltaChip(dl.visitors)}<span class="dim">${fmt(c.sessions)} Sessions</span></div></div>
    <div class="card kpi"><div class="dim" style="display:flex;align-items:center;gap:6px">${plogo('web',17)} ยอดเปิดดูหน้าเว็บ (Pageviews)</div><div class="v">${fmt(c.pageviews)}</div><div style="display:flex;gap:6px;flex-wrap:wrap">${deltaChip(dl.pageviews)}<span class="dim">Bounce ${c.bounce_rate||0}%</span></div></div>
    <div class="card kpi"><div class="dim" style="display:flex;align-items:center;gap:6px">${svg('search')} เสิร์ชเจอบน Google (GSC)</div><div class="v">${fmt(c.gsc_impressions)}</div><div style="display:flex;gap:6px;flex-wrap:wrap">${deltaChip(dl.gsc_impressions)}<span class="dim">อันดับ #${c.gsc_position||0}</span></div></div>
    <div class="card kpi"><div class="dim" style="display:flex;align-items:center;gap:6px">${svg('target')} คลิกจาก Google / ทักจากเว็บ</div><div class="v">${fmt(c.gsc_clicks)}</div><div style="display:flex;gap:6px;flex-wrap:wrap"><span class="chip ac">CTR ${c.gsc_ctr||0}%</span><span class="chip ok">ทักจากเว็บ ${fmt(c.web_leads)} คน</span></div></div>
  </div>

  <div class="tabs">
    <button type="button" class="tab-btn ${prefs.webSub==='overview'?'on':''}" data-wsub="overview">${plogo('ga4',15)} ภาพรวม GA4 &amp; ช่องทางเข้าเว็บ</button>
    <button type="button" class="tab-btn ${prefs.webSub==='pages'?'on':''}" data-wsub="pages">${svg('file')} หน้าเว็บเพจทั้งหมด (${pages.length})</button>
    <button type="button" class="tab-btn ${prefs.webSub==='gsc'?'on':''}" data-wsub="gsc">${svg('search')} คีย์เวิร์ด Google (${keywords.length})</button>
    <button type="button" class="tab-btn ${prefs.webSub==='tracker'?'on':''}" data-wsub="tracker">${svg('link')} โค้ดติดเว็บ &amp; เหตุการณ์สด (${events.length})</button>
  </div>

  ${prefs.webSub === 'overview' ? `
  <div class="grid g21" style="margin-bottom:14px">
    <div class="card">
      <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:8px;margin-bottom:8px">
        <h3 style="margin:0">${svg('trend')} แนวโน้มเทียบช่วงก่อนหน้า (${E(rng.compare_label||'')})</h3>
        <div style="display:flex;gap:5px;flex-wrap:wrap">${[['visitors','GA4 Users'],['gsc_imp','เสิร์ชเจอ Google'],['leads','ลูกค้าทัก']].map(([k,l])=>`<button type="button" class="tab-btn ${mKey===k?'on':''}" data-wmet="${k}" style="padding:3px 10px;font-size:12px">${l}</button>`).join('')}</div>
      </div>
      ${multiLineChart(serCur.map(x => x.label), serLines, mInfo.unit)}
    </div>
    <div class="card">
      <h3>${svg('globe')} ช่องทางที่ลูกค้าเข้าเว็บ (Traffic Sources)</h3>
      ${chSlices.length ? `<div style="display:flex;align-items:center;gap:14px;flex-wrap:wrap">${donutSvg(chSlices,'ผู้เข้าชม')}<div style="flex:1;min-width:170px">${channels.map((ch,i)=>`<div class="row" style="padding:6px 0"><span class="pd" style="background:${chColors[i%chColors.length]}"></span><span class="t ell"><b>${E(ch.channel)}</b><div class="dim">${fmt(ch.users)} คน · ทัก ${fmt(ch.leads)} (${ch.conv_pct||0}%)</div></span><b>${ch.share_pct||Math.round(100*(ch.users||0)/totCh)}%</b></div>`).join('')}</div></div>` : '<div class="dim">ยังไม่มีข้อมูลช่องทางเข้าเว็บ</div>'}
    </div>
  </div>
  <div class="card">
    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px"><h3 style="margin:0">${svg('file')} หน้าเว็บเพจยอดนิยม (Top Pages)</h3><button type="button" class="ghost" data-wsub="pages" style="padding:4px 10px;font-size:12px">ดูทั้งหมด (${pages.length}) →</button></div>
    <div style="overflow-x:auto"><table><thead><tr><th>หน้าเว็บเพจ (Path)</th><th>Pageviews</th><th>Users</th><th>Bounce %</th><th>เสิร์ชเจอ</th><th>คลิก (CTR)</th><th>อันดับ</th><th>คลิกปุ่มทัก</th></tr></thead>
    <tbody>${pages.slice(0,8).map(p=>`<tr><td><b>${E(p.path)}</b><div class="dim">${E(p.title||'')}</div></td><td><b>${fmt(p.pageviews)}</b></td><td>${fmt(p.users)}</td><td><span class="chip ${Number(p.bounce_rate)>=52?'warn':'ok'}">${p.bounce_rate||0}%</span></td><td>${fmt(p.gsc_impressions)}</td><td>${fmt(p.gsc_clicks)} <span class="dim">(${p.gsc_ctr||0}%)</span></td><td>#${p.gsc_position||0}</td><td><span class="chip ok">${fmt(p.cta_clicks)}</span></td></tr>`).join('') || '<tr><td colspan="8" class="dim" style="text-align:center;padding:16px">ยังไม่มีข้อมูลหน้าเว็บในช่วงนี้</td></tr>'}</tbody></table></div>
  </div>` : prefs.webSub === 'pages' ? `
  <div class="card">
    <div style="display:flex;justify-content:space-between;align-items:center;gap:10px;flex-wrap:wrap;margin-bottom:10px"><h3 style="margin:0">${svg('file')} ตารางหน้าเว็บเพจทั้งหมด</h3><input id="web-search" value="${E(APP.webQuery)}" placeholder="ค้นหา Path หรือชื่อหน้าเว็บ…" style="max-width:260px"></div>
    <div style="overflow-x:auto"><table><thead><tr><th>หน้าเว็บเพจ (Path)</th><th>Pageviews</th><th>Users</th><th>Bounce %</th><th>เสิร์ชเจอ</th><th>คลิก (CTR)</th><th>อันดับ</th><th>คลิกปุ่มทัก</th></tr></thead>
    <tbody>${fPages.map(p=>`<tr><td><b>${E(p.path)}</b><div class="dim">${E(p.title||'')}</div></td><td><b>${fmt(p.pageviews)}</b></td><td>${fmt(p.users)}</td><td><span class="chip ${Number(p.bounce_rate)>=52?'warn':'ok'}">${p.bounce_rate||0}%</span></td><td>${fmt(p.gsc_impressions)}</td><td>${fmt(p.gsc_clicks)} <span class="dim">(${p.gsc_ctr||0}%)</span></td><td>#${p.gsc_position||0}</td><td><span class="chip ok">${fmt(p.cta_clicks)}</span></td></tr>`).join('') || '<tr><td colspan="8" class="dim" style="text-align:center;padding:16px">ไม่พบข้อมูล</td></tr>'}</tbody></table></div>
  </div>` : prefs.webSub === 'gsc' ? `
  <div class="card">
    <div style="display:flex;justify-content:space-between;align-items:center;gap:10px;flex-wrap:wrap;margin-bottom:10px"><h3 style="margin:0">${svg('search')} คีย์เวิร์ด Google Search Console</h3><input id="web-search" value="${E(APP.webQuery)}" placeholder="ค้นหาคีย์เวิร์ด…" style="max-width:260px"></div>
    <div style="overflow-x:auto"><table><thead><tr><th>คีย์เวิร์ด</th><th>หน้าปลายทาง</th><th>เสิร์ชเจอ</th><th>คลิก</th><th>CTR %</th><th>อันดับ</th><th>โอกาสต่อยอด</th></tr></thead>
    <tbody>${fKws.map(k=>{const pos=Number(k.avg_position||0),ctr=Number(k.ctr||0);const opp=(pos>=4&&pos<=12)?'<span class="chip warn">ดันขึ้น Top 3</span>':(Number(k.impressions||0)>=3000&&ctr<4)?'<span class="chip ac">ปรับ Title เพิ่มคลิก</span>':'<span class="chip ok">ผลงานดี</span>';return `<tr><td><b>${E(k.keyword)}</b></td><td><code>${E(k.landing_page||'/')}</code></td><td>${fmt(k.impressions)}</td><td><b>${fmt(k.clicks)}</b></td><td>${ctr}%</td><td>#${pos}</td><td>${opp}</td></tr>`;}).join('') || '<tr><td colspan="7" class="dim" style="text-align:center;padding:16px">ยังไม่มีข้อมูลคีย์เวิร์ด</td></tr>'}</tbody></table></div>
  </div>` : `
  <div class="grid g2">
    <div class="card">
      <div style="display:flex;justify-content:space-between;align-items:center;gap:8px;margin-bottom:8px"><h3 style="margin:0">${svg('link')} โค้ดวัดผลหน้าเว็บจริง (1 บรรทัด)</h3><button type="button" class="ghost" id="web-cp-snip" style="padding:4px 10px;font-size:12px">${svg('copy')} คัดลอกโค้ด</button></div>
      <pre style="margin:0 0 10px;padding:11px 13px;border-radius:10px;background:var(--surf2);border:1px solid var(--bd);overflow-x:auto;font-size:12.5px"><code>${E(snippet)}</code></pre>
      <div class="dim" style="margin-bottom:10px">วางโค้ดนี้ในแท็ก <code>&lt;head&gt;</code> ของเว็บจริง เพื่อเก็บยอดเปิดดูหน้าเว็บ, แหล่งที่มา UTM และยอดกดปุ่มทักแชทแบบเรียลไทม์เข้า PulseMetrics ทันที</div>
      <div style="display:flex;gap:8px;flex-wrap:wrap">
        <a class="exp-btn csv" href="/site" target="_blank" rel="noopener" style="text-decoration:none">${svg('globe')} เปิดเว็บทดสอบ (/site) ↗</a>
        <button type="button" class="ghost" id="web-cfg-btn2">${plogo('ga4',15)} ตั้งค่าเชื่อมต่อ GA4</button>
      </div>
    </div>
    <div class="card">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px"><h3 style="margin:0">${svg('clock')} เหตุการณ์สดล่าสุด (${events.length})</h3><button type="button" class="ghost" id="web-reload2" style="padding:4px 10px;font-size:12px">${svg('refresh')} รีเฟรช</button></div>
      <div style="max-height:290px;overflow-y:auto">${events.map(ev=>`<div class="row" style="padding:7px 0"><span class="chip ${ev.event_type==='pageview'?'':'ok'}">${E(ev.event_type||'pageview')}</span><span class="t ell"><b>${E(ev.path||'/')}</b> ${ev.tracking_code?`<span class="chip ac">${E(ev.tracking_code)}</span>`:''}</span><span class="dim">${E(ev.created_at||'')}</span></div>`).join('') || '<div class="dim" style="padding:14px 0">ยังไม่มีเหตุการณ์สด — ลองเปิด /site แล้วคลิกทดสอบ</div>'}</div>
    </div>
  </div>`}`;
};
W.website = function(){
  if (!APP.web || APP.webKey !== rangeQuery()) loadWebsite(false);
  wireRangeBar(() => loadWebsite(true));
  $('page').querySelectorAll('[data-wsub]').forEach(x => x.onclick = () => { prefs.webSub = x.dataset.wsub; savePrefs(); renderPage(); });
  $('page').querySelectorAll('[data-wmet]').forEach(x => x.onclick = () => { prefs.webMetric = x.dataset.wmet; savePrefs(); renderPage(); });
  if ($('web-sync-ga4')) $('web-sync-ga4').onclick = () => syncConnector('ga4');
  if ($('web-sync-gsc')) $('web-sync-gsc').onclick = () => syncConnector('gsc');
  if ($('web-cfg-btn')) $('web-cfg-btn').onclick = openGaSettingsModal;
  if ($('web-cfg-btn2')) $('web-cfg-btn2').onclick = openGaSettingsModal;
  if ($('web-reload')) $('web-reload').onclick = () => loadWebsite(true);
  if ($('web-reload2')) $('web-reload2').onclick = () => loadWebsite(true);
  if ($('web-search')) $('web-search').oninput = e => {
    APP.webQuery = e.target.value; renderPage();
    const el = $('web-search'); if (el) { el.focus(); el.setSelectionRange(el.value.length, el.value.length); }
  };
  if ($('web-cp-snip')) $('web-cp-snip').onclick = async () => {
    const wsId = (APP.ws && APP.ws.id) || (APP.me && APP.me.workspace_id) || 1;
    const origin = (location.origin && location.origin !== 'null') ? location.origin : 'http://127.0.0.1:8090';
    const ok = await copyTextSafe(`<script src="${origin}/tracker.js" data-workspace="${wsId}"><` + `/script>`);
    toast(ok ? 'คัดลอกโค้ด /tracker.js เรียบร้อย ✓' : 'คัดลอกไม่สำเร็จ', ok ? 'ok' : 'warn');
  };
};

// ---------- 3. STATS (Deep Analytics — Live) ----------
R.stats = function(){
  const d = APP.dash || {};
  const cur = d.current || {};
  const dl = d.deltas || {};
  const rng = d.range || {};
  const serCur = (d.series && d.series.current) || [];
  const serPrv = (d.series && d.series.previous) || [];
  const channels = d.channels || [];
  const posts = APP.posts.length ? APP.posts : (d.top_posts || []);
  const chColors = ['#2563eb','#1877f2','#1baf7a','#ef4444','#f59e0b','#7c3aed'];
  const mOpts = {
    visitors:['ผู้เข้าชมเว็บ (GA4)','#F9AB00',' คน'],
    fb_views:['ยอดวิว Facebook','#1877F2',' วิว'],
    yt_views:['ยอดวิว YouTube','#FF0000',' วิว'],
    gsc_imp:['เสิร์ชเจอ Google','#2563EB',' ครั้ง'],
    leads:['ลูกค้าทักรวม','#1baf7a',' คน'],
  };
  const [mLbl, mCol, mUnit] = mOpts[statsMetric] || mOpts.visitors;
  const lines = [{name:mLbl+' (ช่วงนี้)', color:mCol, vals:serCur.map(x => Number(x[statsMetric]||0))}];
  if (serPrv.length) lines.push({name:mLbl+' (ช่วงก่อน)', color:'#94a3b8', dash:true, vals:serCur.map((_,i) => Number((serPrv[i] && serPrv[i][statsMetric]) || 0))});

  return pageHead('สถิติ & วิเคราะห์เชิงลึก', `เทียบช่วงเวลา WoW / MoM / YoY · ${rng.start||'-'} ถึง ${rng.end||'-'}`,
    `<button type="button" class="ghost" data-nav="website">${plogo('ga4',15)} เว็บเพจ &amp; Google GA</button>`) +
  rangeBarHtml(`<button type="button" class="ghost" id="st-reload" style="padding:6px 10px;font-size:12.5px">${svg('refresh')} รีเฟรช</button>`) + `
  <div class="grid g4" style="margin-bottom:14px">
    <div class="card kpi"><div class="dim">ยอดเข้าชมเว็บ (GA4)</div><div class="v">${fmt(cur.visitors)}</div>${deltaChip(dl.visitors)}</div>
    <div class="card kpi"><div class="dim">ยอดวิว Facebook</div><div class="v">${fmt(cur.fb_views)}</div>${deltaChip(dl.fb_views)}</div>
    <div class="card kpi"><div class="dim">ยอดวิว YouTube</div><div class="v">${fmt(cur.yt_views)}</div>${deltaChip(dl.yt_views)}</div>
    <div class="card kpi"><div class="dim">ลูกค้าทักรวม / ปิดยอด</div><div class="v">${fmt(cur.total_leads)}</div><span class="chip ok">ปิดยอด ฿${fmt(cur.won_revenue)}</span></div>
  </div>
  <div class="grid g21" style="margin-bottom:14px">
    <div class="card">
      <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:6px;margin-bottom:8px">
        <h3 style="margin:0">${svg('trend')} เปรียบเทียบช่วงเวลา (${E(rng.compare_label||'')})</h3>
        <div style="display:flex;gap:5px;flex-wrap:wrap">${Object.keys(mOpts).map(k=>`<button type="button" class="tab-btn ${statsMetric===k?'on':''}" data-sm="${k}" style="padding:3px 9px;font-size:12px">${mOpts[k][0]}</button>`).join('')}</div>
      </div>
      ${multiLineChart(serCur.map(x => x.label), lines, mUnit)}
    </div>
    <div class="card">
      <h3>${svg('chart')} สัดส่วนช่องทางที่ลูกค้าเข้า</h3>
      ${channels.length ? `<div style="display:flex;align-items:center;gap:14px;flex-wrap:wrap">${donutSvg(channels.map((c,i)=>({name:c.channel,val:c.users,color:chColors[i%chColors.length]})),'ผู้เข้าชม')}<div style="flex:1;min-width:165px">${channels.map((c,i)=>`<div class="row" style="padding:5px 0"><span class="pd" style="background:${chColors[i%chColors.length]}"></span><span class="t ell"><b>${E(c.channel)}</b><div class="dim">ทัก ${fmt(c.leads)} คน</div></span><b>${c.share_pct}%</b></div>`).join('')}</div></div>` : '<div class="dim">ยังไม่มีข้อมูลช่องทาง</div>'}
    </div>
  </div>
  <div class="card">
    <h3>${svg('trophy')} ตารางผลงานรายโพสต์ทั้งหมด (${posts.length} รายการ)</h3>
    <div style="overflow-x:auto"><table><thead><tr><th>แพลตฟอร์ม</th><th>ชื่อโพสต์</th><th>วันที่ลง</th><th>ยอดวิว</th><th>คลิกเว็บ</th><th>ลูกค้าทัก</th><th>อัตราแปลง</th><th>ยอดขาย</th></tr></thead>
    <tbody>${posts.map(p=>`<tr><td>${plogo(p.platform,16)} ${E(p.platform)}</td><td><b>${E(p.title)}</b></td><td class="dim">${E(p.published_at||'')}</td><td>${fmt(p.views)}</td><td>${fmt(p.web_clicks)}</td><td><span class="chip ok">${fmt(p.effective_leads||p.leads_count)} คน</span></td><td>${p.lead_rate_pct||0}%</td><td><b>฿${fmt(p.revenue_thb)}</b></td></tr>`).join('') || '<tr><td colspan="8" class="dim" style="text-align:center;padding:16px">ยังไม่มีข้อมูลโพสต์</td></tr>'}</tbody></table></div>
  </div>`;
};
W.stats = function(){
  if (!APP.dash || APP.dashKey !== rangeQuery()) loadDash(false);
  if (!APP.loaded.posts) loadPostsAndCalendar(false);
  wireRangeBar(() => loadDash(true));
  if ($('st-reload')) $('st-reload').onclick = () => { loadDash(true); loadPostsAndCalendar(true); };
  $('page').querySelectorAll('[data-sm]').forEach(b => b.onclick = () => { statsMetric = b.dataset.sm; renderPage(); });
};

// ---------- 4. POSTS & CALENDAR + PACKAGING LAB (Live) ----------
R.post = function(){
  const gr = gradeTitle(pkgTitle);
  const origin = (location.origin && location.origin !== 'null') ? location.origin : 'http://127.0.0.1:8090';
  const todayStr = new Date().toISOString().slice(0, 10);
  return pageHead('ปฏิทิน & โพสต์วัดผล (/go/ Tracking)', 'วางแผนคิวลงคอนเทนต์, สร้างลิงก์ติดตาม /go/ อัตโนมัติ, ตรวจชื่อคลิปภาษาไทย และคิวรีโพสต์ Evergreen') + `
  <div class="tabs">
    <button type="button" class="tab-btn ${prefs.postSub==='cal'?'on':''}" data-ps="cal">${svg('calendar')} ปฏิทินลงคอนเทนต์ (${APP.calendar.length})</button>
    <button type="button" class="tab-btn ${prefs.postSub==='posts'?'on':''}" data-ps="posts">${svg('link')} โพสต์วัดผลทั้งหมด (${APP.posts.length})</button>
    <button type="button" class="tab-btn ${prefs.postSub==='pkg'?'on':''}" data-ps="pkg">${svg('sparkles')} Packaging Lab (ตรวจชื่อคลิป 0 โทเคน)</button>
  </div>
  ${prefs.postSub === 'cal' ? `
  <div class="grid g21">
    <div class="card">
      <h3>${svg('calendar')} แผนคิวลงคอนเทนต์จริง</h3>
      ${APP.calendar.map(it => `<div class="row" style="flex-wrap:wrap">
        ${plogo(it.platform,18)}
        <span style="min-width:118px;font-weight:700;font-size:12.5px">${E(it.plan_date)} ${E(it.plan_time||'')}</span>
        <span class="t ell"><b>${E(it.title)}</b><div class="dim">ลิงก์วัดผล: <code>${origin}/go/${E(it.tracking_code)}</code></div></span>
        <select data-cst="${it.id}" style="width:auto;padding:4px 8px;font-size:12px">
          <option value="planned" ${it.status==='planned'?'selected':''}>วางแผนไว้</option>
          <option value="in_progress" ${it.status==='in_progress'?'selected':''}>กำลังทำ</option>
          <option value="published" ${it.status==='published'?'selected':''}>ลงแล้ว ✓</option>
        </select>
        <button type="button" class="ghost" data-cpgo="${E(it.tracking_code)}" style="padding:4px 8px;font-size:11.5px">${svg('copy')} คัดลอกลิงก์</button>
        <button type="button" class="ghost" data-cdel="${it.id}" style="padding:4px 8px;font-size:11.5px">${svg('trash')}</button>
      </div>`).join('') || '<div class="dim" style="padding:14px 0">ยังไม่มีรายการในปฏิทิน — เพิ่มคิวแรกทางขวาได้เลย</div>'}
    </div>
    <div class="card">
      <h3>${svg('plus')} เพิ่มคิวลงคอนเทนต์ &amp; สร้างลิงก์วัดผล</h3>
      <div style="display:grid;gap:9px">
        <div><label class="dim">ชื่อคอนเทนต์ / แคปชัน</label><input id="cal-title" placeholder="เช่น โปรลิขสิทธิ์ขายขาด Q4 — วัดยอดทักรายโพสต์"></div>
        <div class="grid g2" style="gap:8px">
          <div><label class="dim">แพลตฟอร์ม</label><select id="cal-plat"><option value="facebook">Facebook</option><option value="youtube">YouTube</option><option value="tiktok">TikTok</option><option value="instagram">Instagram</option><option value="website">Website / Blog</option></select></div>
          <div><label class="dim">แคมเปญ</label><input id="cal-camp" placeholder="เช่น Q4 Lead Gen"></div>
        </div>
        <div class="grid g2" style="gap:8px">
          <div><label class="dim">วันที่ลง</label><input type="date" id="cal-dt" value="${todayStr}"></div>
          <div><label class="dim">เวลา</label><input type="time" id="cal-tm" value="10:30"></div>
        </div>
        <div><label class="dim">หน้าปลายทาง (Target URL)</label><input id="cal-url" value="/site" placeholder="/site หรือ https://example.com/pricing"></div>
        <button type="button" id="cal-add">${svg('save')} บันทึกลงปฏิทิน + สร้างลิงก์ /go/</button>
      </div>
    </div>
  </div>` : prefs.postSub === 'posts' ? `
  <div class="grid g21">
    <div class="card">
      <h3>${svg('link')} โพสต์ทั้งหมดในฐานข้อมูล (${APP.posts.length})</h3>
      <div style="overflow-x:auto"><table><thead><tr><th>ช่องทาง</th><th>ชื่อโพสต์</th><th>ลิงก์ /go/</th><th>วิว</th><th>คลิก</th><th>ลูกค้าทัก</th><th>ยอดขาย</th></tr></thead>
      <tbody>${APP.posts.map(p=>`<tr><td>${plogo(p.platform,16)}</td><td><b>${E(p.title)}</b><div class="dim">${E(p.published_at||'')} · ${E(p.category||'')}</div></td><td><button type="button" class="ghost" data-cpgo="${E(p.tracking_code)}" style="padding:3px 7px;font-size:11.5px">/go/${E(p.tracking_code)}</button></td><td>${fmt(p.views)}</td><td>${fmt(p.web_clicks)}</td><td><span class="chip ok">${fmt(p.effective_leads||p.leads_count)} คน</span></td><td><b>฿${fmt(p.revenue_thb)}</b></td></tr>`).join('') || '<tr><td colspan="7" class="dim" style="text-align:center;padding:16px">ยังไม่มีโพสต์</td></tr>'}</tbody></table></div>
    </div>
    <div class="card">
      <h3>${svg('plus')} บันทึกโพสต์ใหม่ (รองรับ TT / IG / FB / YT)</h3>
      <div style="display:grid;gap:9px">
        <div><label class="dim">ชื่อโพสต์ / คลิป</label><input id="p-title" placeholder="ชื่อโพสต์หรือคลิป"></div>
        <div class="grid g2" style="gap:8px">
          <div><label class="dim">แพลตฟอร์ม</label><select id="p-plat"><option value="facebook">Facebook</option><option value="youtube">YouTube</option><option value="tiktok">TikTok</option><option value="instagram">Instagram</option><option value="website">Website</option></select></div>
          <div><label class="dim">หมวดหมู่</label><input id="p-cat" value="แคมเปญ"></div>
        </div>
        <div><label class="dim">ลิงก์โพสต์ต้นทาง</label><input id="p-url" placeholder="https://..."></div>
        <div class="grid g2" style="gap:8px">
          <div><label class="dim">ยอดวิว</label><input type="number" id="p-views" value="0"></div>
          <div><label class="dim">ลูกค้าทัก</label><input type="number" id="p-leads" value="0"></div>
        </div>
        <button type="button" id="p-add">${svg('save')} บันทึกโพสต์ + สร้างลิงก์ติดตาม</button>
      </div>
    </div>
  </div>` : `
  <div class="card">
    <h3>${svg('sparkles')} Thai Title Grader (0–100) · ทำงานในเครื่องฟรี 0 โทเคน</h3>
    <label class="dim">พิมพ์ชื่อคลิป / พาดหัวโพสต์ภาษาไทยเพื่อประเมินคะแนนความน่าคลิก</label>
    <input id="pkg-in" value="${E(pkgTitle)}" style="margin:6px 0 12px">
    <div style="display:flex;align-items:center;gap:14px;flex-wrap:wrap">
      <div class="hs-ring" style="--p:${gr.score}"><div>${gr.score}</div></div>
      <div>
        <b>เกรดพาดหัว: ${gr.score>=85?'เด่นมาก (A+)':gr.score>=70?'ดีมาก (A)':'ปรับฮุกเพิ่มอีกนิด (B)'}</b>
        ${gr.tips.map(([k,t]) => `<div class="dim" style="margin-top:4px"><span class="chip ${k}">${k==='ok'?'ผ่าน':'แนะนำ'}</span> ${E(t)}</div>`).join('')}
      </div>
    </div>
  </div>`}`;
};
W.post = function(){
  if (!APP.loaded.posts) loadPostsAndCalendar(false);
  $('page').querySelectorAll('[data-ps]').forEach(b => b.onclick = () => { prefs.postSub = b.dataset.ps; savePrefs(); renderPage(); });
  $('page').querySelectorAll('[data-cpgo]').forEach(b => b.onclick = async () => {
    const origin = (location.origin && location.origin !== 'null') ? location.origin : 'http://127.0.0.1:8090';
    const url = `${origin}/go/${b.dataset.cpgo}`;
    await copyTextSafe(url);
    toast('คัดลอกลิงก์ติดตาม ' + url + ' แล้ว ✓', 'ok');
  });
  $('page').querySelectorAll('[data-cst]').forEach(sel => sel.onchange = async () => {
    const r = await api('/api/calendar', {method:'POST', body:{action:'status', id:+sel.dataset.cst, status:sel.value}});
    if (r && r.ok) { toast('อัปเดตสถานะปฏิทินแล้ว ✓', 'ok'); loadPostsAndCalendar(true); }
  });
  $('page').querySelectorAll('[data-cdel]').forEach(b => b.onclick = async () => {
    const r = await api('/api/calendar', {method:'POST', body:{action:'delete', id:+b.dataset.cdel}});
    if (r && r.ok) { toast('ลบรายการปฏิทินแล้ว', 'ok'); loadPostsAndCalendar(true); }
  });
  if ($('cal-add')) $('cal-add').onclick = async () => {
    const title = ($('cal-title').value || '').trim();
    if (!title) return toast('กรุณาใส่ชื่อคอนเทนต์', 'warn');
    const r = await api('/api/calendar', {method:'POST', body:{
      title, platform:$('cal-plat').value, campaign:$('cal-camp').value.trim(),
      plan_date:$('cal-dt').value, plan_time:$('cal-tm').value, target_url:$('cal-url').value.trim() || '/site',
    }});
    if (r && r.ok) { toast('เพิ่มคิวลงปฏิทินแล้ว · ลิงก์ ' + (r.tracking_url||''), 'ok'); loadPostsAndCalendar(true); }
    else toast((r && r.error) || 'บันทึกไม่สำเร็จ', 'warn');
  };
  if ($('p-add')) $('p-add').onclick = async () => {
    const title = ($('p-title').value || '').trim();
    if (!title) return toast('กรุณาใส่ชื่อโพสต์', 'warn');
    const r = await api('/api/posts', {method:'POST', body:{
      title, platform:$('p-plat').value, category:$('p-cat').value.trim(),
      source_url:$('p-url').value.trim(), views:+($('p-views').value||0), leads_count:+($('p-leads').value||0),
    }});
    if (r && r.ok) { toast('บันทึกโพสต์เรียบร้อย · ลิงก์ ' + (r.tracking_url||''), 'ok'); loadPostsAndCalendar(true); }
    else toast((r && r.error) || 'บันทึกไม่สำเร็จ', 'warn');
  };
  if ($('pkg-in')) $('pkg-in').oninput = e => {
    pkgTitle = e.target.value; renderPage();
    const el = $('pkg-in'); if (el) { el.focus(); el.setSelectionRange(el.value.length, el.value.length); }
  };
};

// ---------- 5. MARKETING & COMPETITOR OUTLIER RADAR (Live) ----------
R.marketing = function(){
  const advisor = (APP.dash && APP.dash.advisor) || [];
  const comps = APP.competitors || [];
  const ever = APP.evergreen || [];
  return pageHead('กลยุทธ์การตลาด & ส่องคู่แข่ง', 'คำแนะนำอัตโนมัติ 0 โทเคนจากข้อมูลจริง, Competitor Outlier Radar (2.2x+ ยอดวิวปกติ) และคิวรีโพสต์ Evergreen') + `
  <div class="tabs">
    <button type="button" class="tab-btn ${prefs.mkSub==='advisor'?'on':''}" data-mks="advisor">${svg('sparkles')} คำแนะนำต่อยอด (${advisor.length})</button>
    <button type="button" class="tab-btn ${prefs.mkSub==='radar'?'on':''}" data-mks="radar">${svg('trophy')} ส่องคู่แข่ง Outlier Radar (${comps.length})</button>
    <button type="button" class="tab-btn ${prefs.mkSub==='evergreen'?'on':''}" data-mks="evergreen">${svg('refresh')} คิวรีโพสต์ Evergreen (${ever.length})</button>
  </div>
  ${prefs.mkSub === 'advisor' ? `
  <div class="grid g2">${advisor.map(a => `<div class="card">
    <div style="display:flex;justify-content:space-between;align-items:center;gap:8px;margin-bottom:6px">
      <span class="chip ${a.priority==='high'?'warn':'ac'}">${E(a.label)}</span>
      <span class="dim">${E(a.metric||'')}</span>
    </div>
    <div style="font-weight:800;font-size:15px;margin-bottom:6px">${E(a.title)}</div>
    <div class="dim">${E(a.action)}</div>
  </div>`).join('') || '<div class="card dim">ยังไม่มีคำแนะนำ — ซิงก์ข้อมูล GA4 / GSC / Facebook / YouTube เพื่อเริ่มวิเคราะห์</div>'}</div>` :
  prefs.mkSub === 'radar' ? `
  <div class="grid g21">
    <div class="grid g2" style="align-content:start">${comps.map(c => `<div class="card">
      <div style="display:flex;justify-content:space-between;align-items:center;gap:6px;margin-bottom:6px">
        <span style="display:inline-flex;align-items:center;gap:6px">${plogo(c.platform,16)} <b>${E(c.brand_name)}</b></span>
        <span class="chip ${c.is_outlier?'ok':'ac'}">${c.outlier_x}× วิวปกติ</span>
      </div>
      <div style="font-weight:700;margin-bottom:6px">${E(c.title)}</div>
      <div class="dim" style="margin-bottom:6px">ยอดวิว <b>${fmt(c.views)}</b> (ยอดวิวปกติ ${fmt(c.baseline_views)})</div>
      ${c.notes ? `<div class="dim" style="font-size:12px;margin-bottom:8px">โน้ต: ${E(c.notes)}</div>` : ''}
      <div style="display:flex;justify-content:space-between;align-items:center">
        ${c.source_url ? `<a href="${E(c.source_url)}" target="_blank" rel="noopener" style="font-size:12px">เปิดดูโพสต์ ↗</a>` : '<span></span>'}
        <button type="button" class="ghost" data-compdel="${c.id}" style="padding:3px 8px;font-size:11.5px">${svg('trash')} ลบ</button>
      </div>
    </div>`).join('') || '<div class="card dim">ยังไม่มีรายการคู่แข่ง</div>'}</div>
    <div class="card">
      <h3>${svg('plus')} เพิ่มโพสต์คู่แข่ง</h3>
      <div style="display:grid;gap:8px">
        <div><label class="dim">ชื่อเพจ/ช่องคู่แข่ง</label><input id="cp-brand" placeholder="เช่น AgencyAlpha TH"></div>
        <div><label class="dim">แพลตฟอร์ม</label><select id="cp-plat"><option value="facebook">Facebook</option><option value="youtube">YouTube</option><option value="tiktok">TikTok</option><option value="instagram">Instagram</option></select></div>
        <div><label class="dim">หัวข้อคอนเทนต์ที่ปัง</label><input id="cp-title" placeholder="หัวข้อโพสต์หรือคลิป"></div>
        <div class="grid g2" style="gap:8px">
          <div><label class="dim">ยอดวิวโพสต์นี้</label><input type="number" id="cp-views" value="35000"></div>
          <div><label class="dim">ยอดวิวปกติช่องเขา</label><input type="number" id="cp-base" value="10000"></div>
        </div>
        <div><label class="dim">จุดเด่น / สิ่งที่จะเอามาต่อยอด</label><textarea id="cp-notes" rows="2"></textarea></div>
        <button type="button" id="cp-add">${svg('save')} บันทึกคู่แข่ง</button>
      </div>
    </div>
  </div>` : `
  <div class="card">
    <h3>${svg('refresh')} คอนเทนต์ผลงานดีที่น่าเอากลับมาทำซ้ำ / รีโพสต์</h3>
    <div style="overflow-x:auto"><table><thead><tr><th>แพลตฟอร์ม</th><th>หัวข้อโพสต์</th><th>ลงเมื่อ</th><th>ยอดวิว</th><th>ลูกค้าทัก</th><th>ยอดขาย</th></tr></thead>
    <tbody>${ever.map(p=>`<tr><td>${plogo(p.platform,16)} ${E(p.platform)}</td><td><b>${E(p.title)}</b></td><td class="dim">${E(p.published_at||'')}</td><td>${fmt(p.views)}</td><td><span class="chip ok">${fmt(p.leads_count||p.effective_leads)} คน</span></td><td><b>฿${fmt(p.revenue_thb)}</b></td></tr>`).join('') || '<tr><td colspan="6" class="dim" style="text-align:center;padding:16px">ยังไม่มีคิว Evergreen</td></tr>'}</tbody></table></div>
  </div>`}`;
};
W.marketing = function(){
  if (!APP.dash) loadDash(false);
  if (!APP.loaded.comp) loadCompetitors(false);
  $('page').querySelectorAll('[data-mks]').forEach(b => b.onclick = () => { prefs.mkSub = b.dataset.mks; savePrefs(); renderPage(); });
  $('page').querySelectorAll('[data-compdel]').forEach(b => b.onclick = async () => {
    const r = await api('/api/competitors', {method:'POST', body:{action:'delete', id:+b.dataset.compdel}});
    if (r && r.ok) { toast('ลบรายการคู่แข่งแล้ว', 'ok'); loadCompetitors(true); }
  });
  if ($('cp-add')) $('cp-add').onclick = async () => {
    const brand_name = ($('cp-brand').value||'').trim(), title = ($('cp-title').value||'').trim();
    if (!brand_name || !title) return toast('กรุณากรอกชื่อคู่แข่งและหัวข้อ', 'warn');
    const r = await api('/api/competitors', {method:'POST', body:{
      brand_name, platform:$('cp-plat').value, title,
      views:+($('cp-views').value||0), baseline_views:+($('cp-base').value||5000), notes:$('cp-notes').value.trim(),
    }});
    if (r && r.ok) { toast('บันทึกโพสต์คู่แข่งเรียบร้อย ✓', 'ok'); loadCompetitors(true); }
  };
};

// ---------- 6. COMPANY GOALS KPI (Live) ----------
R.goal = function(){
  const goals = APP.goals || [];
  const nowM = new Date().toISOString().slice(0, 7);
  const startM = nowM + '-01';
  const endM = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0).toISOString().slice(0, 10);
  return pageHead('เป้าหมายบริษัท (Company KPI Goals)', 'ติดตามเป้าผู้เข้าชมเว็บ, ลูกค้าทัก, อัตราปิดการขาย และยอดขายเทียบอัตราเร่งจริง (Pace Forecast)') + `
  <div class="grid g21">
    <div style="display:grid;gap:14px;align-content:start">
      ${goals.map(g => `<div class="card">
        <div style="display:flex;justify-content:space-between;align-items:center;gap:8px;flex-wrap:wrap;margin-bottom:10px">
          <div><b style="font-size:16px">รอบเป้าหมาย ${E(g.period_label)}</b><div class="dim">${E(g.start_date)} ถึง ${E(g.end_date)} · ผ่านมา ${g.elapsed_days}/${g.total_days} วัน</div></div>
          <span class="chip ${g.on_track?'ok':'warn'}">${g.on_track?'✓ ตามแผน (On Track)':'⚡ ต้องเร่งยอด'}</span>
        </div>
        ${[
          ['ผู้เข้าชมเว็บ (GA4)', g.actual.visitors, g.target_visitors, g.pct.visitors, ' คน', g.forecast.visitors],
          ['ลูกค้าทักรวม (Leads)', g.actual.leads, g.target_leads, g.pct.leads, ' คน', g.forecast.leads],
          ['อัตราปิดการขาย', g.actual.conv_pct, g.target_conv_pct, g.pct.conv_pct, '%', null],
          ['ยอดขายปิดดีล', g.actual.revenue, g.target_revenue, g.pct.revenue, ' ฿', g.forecast.revenue],
        ].map(([l,act,tgt,pct,u,fc]) => `<div style="margin-bottom:10px">
          <div style="display:flex;justify-content:space-between;font-size:13px;gap:8px;flex-wrap:wrap">
            <span>${l}</span>
            <b>${fmt(act)}${u} / ${fmt(tgt)}${u} (${pct}%)${fc!==null?` <span class="dim">· คาดจบ ${fmt(fc)}${u}</span>`:''}</b>
          </div>
          <div class="bar" style="margin-top:4px"><i style="width:${Math.min(100,pct)}%;background:${pct>=80?'#1f9d63':pct>=50?'var(--ac)':'#d9731f'}"></i></div>
        </div>`).join('')}
      </div>`).join('') || '<div class="card dim">ยังไม่มีเป้าหมายบริษัท — ตั้งเป้ารอบแรกทางขวาได้เลย</div>'}
    </div>
    <div class="card">
      <h3>${svg('target')} ตั้ง / อัปเดตเป้าหมาย KPI</h3>
      <div style="display:grid;gap:9px">
        <div class="grid g2" style="gap:8px">
          <div><label class="dim">ชื่อรอบ (เช่น 2026-11)</label><input id="g-lbl" value="${nowM}"></div>
          <div><label class="dim">ประเภท</label><select id="g-type"><option value="month">รายเดือน</option><option value="quarter">รายไตรมาส</option></select></div>
        </div>
        <div class="grid g2" style="gap:8px">
          <div><label class="dim">วันเริ่ม</label><input type="date" id="g-s" value="${startM}"></div>
          <div><label class="dim">วันสิ้นสุด</label><input type="date" id="g-e" value="${endM}"></div>
        </div>
        <div class="grid g2" style="gap:8px">
          <div><label class="dim">เป้าผู้เข้าชมเว็บ</label><input type="number" id="g-vis" value="25000"></div>
          <div><label class="dim">เป้าลูกค้าทัก (คน)</label><input type="number" id="g-lds" value="150"></div>
        </div>
        <div class="grid g2" style="gap:8px">
          <div><label class="dim">เป้าปิดการขาย (%)</label><input type="number" step="0.5" id="g-conv" value="22"></div>
          <div><label class="dim">เป้ายอดขาย (บาท)</label><input type="number" id="g-rev" value="650000"></div>
        </div>
        <button type="button" id="g-save">${svg('save')} บันทึกเป้าหมาย KPI จริง</button>
      </div>
    </div>
  </div>`;
};
W.goal = function(){
  if (!APP.loaded.goals) loadGoals(false);
  if ($('g-save')) $('g-save').onclick = async () => {
    const r = await api('/api/goals', {method:'POST', body:{
      period_label:$('g-lbl').value.trim(), period_type:$('g-type').value,
      start_date:$('g-s').value, end_date:$('g-e').value,
      target_visitors:+($('g-vis').value||0), target_leads:+($('g-lds').value||0),
      target_conv_pct:+($('g-conv').value||20), target_revenue:+($('g-rev').value||0),
    }});
    if (r && r.ok) { APP.goals = r.goals || []; toast('บันทึกเป้าหมายบริษัทเรียบร้อย ✓', 'ok'); renderPage(); }
    else toast((r && r.error) || 'บันทึกไม่สำเร็จ', 'warn');
  };
};

window.PM_SHARED = {loadDash, loadWebsite, loadPostsAndCalendar, loadCompetitors, loadGoals, syncConnector, syncGSheetsNow, openGaSettingsModal};
})();
