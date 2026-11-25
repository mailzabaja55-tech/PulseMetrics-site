/* PulseMetrics v2.0.0 — Interactive 9-Module Enterprise B2B Marketing & Lead Intelligence SPA */
const ST = {
  tab: 'dashboard',
  preset: 'month',
  start: '',
  end: '',
  compare: 'auto',
  chartMetric: 'visitors',
  setTab: 'api',
  leadQ: '',
  leadStage: '',
  leadCh: '',
  leadView: 'table',
  cmtIntent: '',
  cmtFocusIdx: 0,
  fbStatus: '',
  fbCat: '',
  lastFbId: null,
  focusMode: false,
  me: null,
  ws: null,
};

const E = s => String(s ?? '').replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const NF = n => Number(n || 0).toLocaleString('th-TH');
const PLAT_LBL = { facebook: 'Facebook', youtube: 'YouTube', tiktok: 'TikTok', instagram: 'Instagram', website: 'Website', ga4: 'GA4', gsc: 'Search Console', line: 'LINE OA', google: 'Google', direct: 'Direct' };
const PLAT_CLS = { facebook: 'p-fb', youtube: 'p-yt', tiktok: 'p-tt', instagram: 'p-ig', website: 'p-web', ga4: 'p-ga4', gsc: 'p-gsc', line: 'p-line', google: 'p-gsc' };
const STAGE_LBL = { new: 'ทักใหม่', talking: 'กำลังคุย', quoted: 'เสนอราคาแล้ว', won: 'ปิดการขาย ✓', lost: 'ไม่ปิด' };
const ROLE_LBL = { executive: 'ผู้บริหาร (Executive)', marketing: 'การตลาด (Marketing)', chat_admin: 'แอดมินแชท (Sales)' };

function hasPerm(p) {
  const perms = (ST.me && ST.me.user && ST.me.user.perms) || [];
  return perms.includes(p);
}

async function api(url, opts) {
  const r = await fetch(url, opts);
  const data = await r.json().catch(() => ({ ok: false, error: 'HTTP ' + r.status }));
  if (r.status === 401 && data.auth_required) showLoginGate(data.brand);
  return data;
}

function toast(msg) {
  const t = document.getElementById('toastBox');
  t.textContent = msg;
  t.style.display = 'block';
  clearTimeout(window._tT);
  window._tT = setTimeout(() => t.style.display = 'none', 3600);
}

function qRange() {
  const p = new URLSearchParams({ preset: ST.preset, compare: ST.compare });
  if (ST.preset === 'custom' && ST.start && ST.end) { p.set('start', ST.start); p.set('end', ST.end); }
  return p.toString();
}

function deltaHtml(v, suffix = '%') {
  const n = Number(v || 0);
  const cls = n > 0 ? 'up' : n < 0 ? 'dn' : 'fl';
  const arr = n > 0 ? '▲ +' : n < 0 ? '▼ ' : '• ';
  return `<span class="delta ${cls}">${arr}${n}${suffix}</span>`;
}

function toggleTheme() {
  const cur = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark';
  document.documentElement.dataset.theme = cur;
  try { localStorage.setItem('pm_theme', cur); } catch (e) {}
}
try { const sv = localStorage.getItem('pm_theme'); if (sv) document.documentElement.dataset.theme = sv; } catch (e) {}

function applyBrand(b) {
  if (!b) return;
  if (b.brand_accent) document.documentElement.style.setProperty('--ac', b.brand_accent);
  const logo = b.brand_logo_text || 'PM';
  const name = b.brand_name || 'PulseMetrics';
  const tag = b.brand_tagline || 'MKT & Lead Intelligence';
  const setTxt = (id, v) => { const el = document.getElementById(id); if (el) el.textContent = v; };
  setTxt('brandLogo', logo); setTxt('brandName', name); setTxt('brandTag', tag);
  setTxt('lgLogo', logo); setTxt('lgName', name); setTxt('lgTag', tag);
  document.title = name + ' — ' + tag;
}

function showLoginGate(brand) {
  if (brand) applyBrand(brand);
  document.getElementById('loginGate').style.display = 'grid';
}

async function submitGateLogin() {
  const email = document.getElementById('lgEmail').value.trim();
  const password = document.getElementById('lgPass').value;
  const errEl = document.getElementById('lgErr');
  errEl.style.display = 'none';
  const r = await api('/api/auth/login', {
    method: 'POST', headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  if (r.ok) {
    document.getElementById('loginGate').style.display = 'none';
    toast('ยินดีต้อนรับ ' + r.user.name + ' ✓');
    boot();
  } else {
    errEl.textContent = r.error || 'เข้าสู่ระบบไม่สำเร็จ';
    errEl.style.display = 'block';
  }
}

function openModal(html) {
  document.getElementById('modalCard').innerHTML = html;
  document.getElementById('modalBg').classList.add('open');
}
function closeModal() { document.getElementById('modalBg').classList.remove('open'); }

/* =========================== CUSTOM DIALOGS (ZERO RAW prompt/confirm) =========================== */
let _dlgResolve = null;
function closeDialog(val) {
  document.getElementById('dlgBg').classList.remove('open');
  const fn = _dlgResolve; _dlgResolve = null;
  if (fn) fn(val);
}
function uiConfirm(title, desc, danger = false) {
  return new Promise(resolve => {
    _dlgResolve = resolve;
    document.getElementById('dlgCard').innerHTML = `
      <div class="card-hd"><b>${E(title)}</b><button class="btn sm ghost" onclick="closeDialog(false)">ปิด</button></div>
      <p class="dim" style="margin:0 0 16px;font-size:13.5px">${E(desc)}</p>
      <div style="display:flex;justify-content:flex-end;gap:8px">
        <button class="btn sm ghost" onclick="closeDialog(false)">ยกเลิก</button>
        <button class="btn sm ${danger ? 'danger' : 'primary'}" onclick="closeDialog(true)">ยืนยัน</button>
      </div>`;
    document.getElementById('dlgBg').classList.add('open');
  });
}
function uiPrompt(title, desc, defaultVal = '', placeholder = '', isPassword = false) {
  return new Promise(resolve => {
    _dlgResolve = resolve;
    document.getElementById('dlgCard').innerHTML = `
      <div class="card-hd"><b>${E(title)}</b><button class="btn sm ghost" onclick="closeDialog(null)">ปิด</button></div>
      <p class="dim" style="margin:0 0 10px;font-size:13px">${E(desc)}</p>
      <input class="inp" id="dlgInp" type="${isPassword ? 'password' : 'text'}" value="${E(defaultVal)}" placeholder="${E(placeholder)}" onkeydown="if(event.key==='Enter')closeDialog(document.getElementById('dlgInp').value)">
      <div style="display:flex;justify-content:flex-end;gap:8px;margin-top:14px">
        <button class="btn sm ghost" onclick="closeDialog(null)">ยกเลิก</button>
        <button class="btn sm primary" onclick="closeDialog(document.getElementById('dlgInp').value)">ตกลง</button>
      </div>`;
    document.getElementById('dlgBg').classList.add('open');
    setTimeout(() => { const el = document.getElementById('dlgInp'); if (el) { el.focus(); el.select(); } }, 30);
  });
}

/* =========================== CTRL+K GLOBAL COMMAND PALETTE =========================== */
function openCmdPalette() {
  document.getElementById('cmdBg').classList.add('open');
  const inp = document.getElementById('cmdInp');
  inp.value = '';
  runCmdSearch('');
  setTimeout(() => inp.focus(), 30);
}
function closeCmdPalette() { document.getElementById('cmdBg').classList.remove('open'); }
function toggleFocusMode() {
  ST.focusMode = !ST.focusMode;
  document.body.classList.toggle('focus-mode', ST.focusMode);
  const b = document.getElementById('focusBtn');
  if (b) b.classList.toggle('on', ST.focusMode);
  toast(ST.focusMode ? '🔕 เปิดโหมดโฟกัส (ซ่อนป้ายแจ้งเตือนชั่วคราว)' : '🔔 ปิดโหมดโฟกัสแล้ว');
}

function openShortcutsModal() {
  openModal(`
    <div class="card-hd"><b>⌨️ คีย์ลัดทั้งหมด (Mail-Style Studio Shortcuts)</b><button class="btn sm ghost" onclick="closeModal()">ปิด</button></div>
    <table class="tb">
      <tr><th>คีย์ลัด</th><th>คำสั่ง</th></tr>
      <tr><td><code>Ctrl + K</code></td><td>ค้นหาด่วนทั่วแอป (ลูกค้า / โพสต์ / แคมเปญ / คีย์เวิร์ด / เมนู)</td></tr>
      <tr><td><code>Alt + 1</code> ถึง <code>Alt + 6</code></td><td>สลับหน้าไว (แดชบอร์ด / แชท CRM / คอมเมนต์ / เว็บไซต์ / โพสต์ / งบแอด ROAS)</td></tr>
      <tr><td><code>Alt + N</code></td><td>เปิดสมุดจดไอเดียแคมเปญด่วน (Quick Idea Pad) จากทุกหน้า</td></tr>
      <tr><td><code>Alt + F</code></td><td>สลับโหมดโฟกัส (ซ่อนป้ายเลขแจ้งเตือนชั่วคราว)</td></tr>
      <tr><td><code>J</code> / <code>K</code> / <code>R</code> / <code>L</code></td><td>ในหน้าคอมเมนต์: เลื่อนลง / เลื่อนขึ้น / ตอบด่วน / แปลงเป็น Lead 1 คลิก</td></tr>
      <tr><td><code>?</code></td><td>เปิดหน้าต่างคีย์ลัดนี้</td></tr>
      <tr><td><code>Esc</code></td><td>ปิดหน้าต่างป๊อปอัปทั้งหมด</td></tr>
    </table>`);
}

async function openIdeaPad() {
  const r = await api('/api/ideas');
  const ideas = (r && r.ideas) || [];
  openModal(`
    <div class="card-hd"><b>📝 สมุดจดไอเดียแคมเปญด่วน (Alt+N · ส่งเข้าปฏิทินได้ใน 1 คลิก)</b><button class="btn sm ghost" onclick="closeModal()">ปิด</button></div>
    <div class="fgrid" style="margin-bottom:10px">
      <label style="grid-column:1/-1">หัวข้อไอเดียคอนเทนต์ / แคมเปญ *<input class="inp" id="idTi" placeholder="เช่น คลิปสั้น 30 วิ เทียบก่อน-หลังติดลิงก์ /go/ วัดยอดทัก"></label>
      <label>แพลตฟอร์ม<select class="inp" id="idPl"><option value="facebook">Facebook</option><option value="tiktok">TikTok</option><option value="instagram">Instagram</option><option value="youtube">YouTube</option><option value="website">Website SEO</option></select></label>
      <label>แท็ก / หมวด<input class="inp" id="idTg" placeholder="เช่น ไวรัล, ROAS, เคสลูกค้า"></label>
      <label style="grid-column:1/-1">โน้ตสั้นๆ<input class="inp" id="idNt" placeholder="รายละเอียด hook หรือ CTA ที่อยากใส่…"></label>
    </div>
    <div style="display:flex;justify-content:flex-end;margin-bottom:14px"><button class="btn sm primary" onclick="saveQuickIdea()">+ บันทึกไอเดีย</button></div>
    <b style="display:block;margin-bottom:8px">คลังไอเดียที่จดไว้ (${ideas.length})</b>
    <div style="max-height:280px;overflow:auto;display:grid;gap:8px">
      ${ideas.map(it => `<div class="note-item" style="margin:0;display:flex;justify-content:space-between;align-items:center;gap:10px;flex-wrap:wrap">
        <div style="min-width:220px;flex:1">
          <span class="pill ${PLAT_CLS[it.platform] || ''}">${PLAT_LBL[it.platform] || it.platform}</span>
          <b style="margin-left:5px">${E(it.title)}</b>
          <div class="dim" style="font-size:11.5px;margin-top:2px">${E(it.tags || '')} ${it.notes ? '· ' + E(it.notes) : ''}</div>
        </div>
        <div style="display:flex;gap:5px">
          ${it.status === 'planned' ? '<span class="pill p-ok">อยู่ในปฏิทินแล้ว ✓</span>' : `<button class="btn sm ghost" onclick="ideaToCal(${it.id})">📅 ส่งเข้าปฏิทิน</button>`}
          <button class="btn sm ghost" onclick="delQuickIdea(${it.id})">ลบ</button>
        </div>
      </div>`).join('') || '<div class="dim">ยังไม่มีไอเดียที่จดไว้</div>'}
    </div>`);
}
async function saveQuickIdea() {
  const title = document.getElementById('idTi').value.trim();
  if (!title) { toast('พิมพ์หัวข้อไอเดียก่อนครับ'); return; }
  const r = await api('/api/ideas', {
    method: 'POST', headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ title, platform: document.getElementById('idPl').value, tags: document.getElementById('idTg').value, notes: document.getElementById('idNt').value }),
  });
  if (r.ok) { toast('จดไอเดียเก็บไว้แล้ว ✓'); openIdeaPad(); }
}
async function ideaToCal(id) {
  const r = await api('/api/ideas', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ action: 'to_calendar', id }) });
  if (r.ok) { toast('ส่งเข้าปฏิทินวันที่ ' + r.plan_date + ' และสร้างลิงก์ ' + r.tracking_url + ' แล้ว ✓'); openIdeaPad(); if (ST.tab === 'calendar') renderTab(); }
}
async function delQuickIdea(id) {
  await api('/api/ideas', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ action: 'delete', id }) });
  openIdeaPad();
}

document.addEventListener('keydown', e => {
  const tag = (document.activeElement && document.activeElement.tagName || '').toLowerCase();
  const typing = tag === 'input' || tag === 'textarea' || tag === 'select' || (document.activeElement && document.activeElement.isContentEditable);
  if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') { e.preventDefault(); openCmdPalette(); return; }
  if (e.key === 'Escape') { closeCmdPalette(); closeDialog(null); closeModal(); return; }
  if (e.altKey && !e.ctrlKey && !e.metaKey) {
    const k = e.key.toLowerCase();
    const map = { '1': 'dashboard', '2': 'leads', '3': 'comments', '4': 'website', '5': 'posts', '6': 'roi' };
    if (map[k] && hasPerm(map[k])) { e.preventDefault(); goTab(map[k]); return; }
    if (k === 'n') { e.preventDefault(); openIdeaPad(); return; }
    if (k === 'f') { e.preventDefault(); toggleFocusMode(); return; }
  }
  if (typing) return;
  if (e.key === '?') { e.preventDefault(); openShortcutsModal(); return; }
  if (ST.tab === 'comments' && window._cmtRows && window._cmtRows.length) {
    const k = e.key.toLowerCase();
    if (k === 'j') { ST.cmtFocusIdx = Math.min(window._cmtRows.length - 1, ST.cmtFocusIdx + 1); highlightFocusedCmt(); }
    else if (k === 'k') { ST.cmtFocusIdx = Math.max(0, ST.cmtFocusIdx - 1); highlightFocusedCmt(); }
    else if (k === 'r') { const row = window._cmtRows[ST.cmtFocusIdx]; if (row && !row.replied) replyCmt(row.id); }
    else if (k === 'l') { const row = window._cmtRows[ST.cmtFocusIdx]; if (row && !row.converted_lead_id) convertCommentToLead(row.id); }
  }
});
let _cmdTimer = null;
function runCmdSearch(q) {
  const navPages = [
    ['dashboard', '📊 แดชบอร์ดหลัก'], ['leads', '💬 แชท & Lead CRM Pro'], ['comments', '🗨️ คอมเมนต์ลูกค้า'],
    ['feedback', '💌 กล่องฟีดแบค & ข้อเสนอแนะ'], ['website', '🌐 สถิติ & เว็บไซต์ (GA4/GSC)'],
    ['posts', '🎯 วิเคราะห์โพสต์ & ยอดทัก'], ['roi', '💰 งบแอด & ROAS / CPL'],
    ['competitors', '🏆 ส่องคู่แข่ง & Outlier Radar'], ['strategy', '🧭 การตลาด & กลยุทธ์'],
    ['goals', '🏆 เป้าหมายบริษัท'], ['calendar', '📅 ปฏิทินคอนเทนต์'], ['settings', '⚙️ ตั้งค่า, API & NAS'],
  ].filter(([k]) => hasPerm(k === 'competitors' ? 'strategy' : k));
  const ql = String(q || '').trim().toLowerCase();
  const matchedNav = navPages.filter(([k, l]) => !ql || l.toLowerCase().includes(ql) || k.includes(ql));
  const host = document.getElementById('cmdRes');
  const navHtml = matchedNav.length ? `<div class="cmd-sec">เมนู &amp; ทางลัด</div>` + matchedNav.map(([k, l]) =>
    `<div class="cmd-item" onclick="closeCmdPalette();goTab('${k}')"><span>${l}</span><span class="dim" style="font-size:11.5px">เปิดหน้า →</span></div>`
  ).join('') : '';
  host.innerHTML = navHtml + (ql ? '<div class="dim" style="padding:10px;font-size:12px">กำลังค้นหาในข้อมูลบริษัท…</div>' : '');
  clearTimeout(_cmdTimer);
  if (!ql) return;
  _cmdTimer = setTimeout(async () => {
    const r = await api('/api/search?q=' + encodeURIComponent(ql));
    if (!r || !r.ok) return;
    let html = navHtml;
    if ((r.leads || []).length) {
      html += `<div class="cmd-sec">ลูกค้าทัก (CRM)</div>` + r.leads.map(l =>
        `<div class="cmd-item" onclick="closeCmdPalette();ST.leadQ=${JSON.stringify(l.customer_name)};goTab('leads')"><span><b>${E(l.customer_name)}</b> <span class="dim">· ${E(STAGE_LBL[l.stage] || l.stage)}</span></span><b>฿${NF(l.deal_value)}</b></div>`
      ).join('');
    }
    if ((r.posts || []).length) {
      html += `<div class="cmd-sec">โพสต์ &amp; คลิป</div>` + r.posts.map(p =>
        `<div class="cmd-item" onclick="closeCmdPalette();openPostDetail(${p.id})"><span><span class="pill ${PLAT_CLS[p.platform] || ''}">${PLAT_LBL[p.platform] || p.platform}</span> ${E(p.title.slice(0, 52))}</span><b style="color:var(--ok)">${p.leads_count} ทัก</b></div>`
      ).join('');
    }
    if ((r.campaigns || []).length) {
      html += `<div class="cmd-sec">แคมเปญโฆษณา (ROAS)</div>` + r.campaigns.map(cp =>
        `<div class="cmd-item" onclick="closeCmdPalette();goTab('roi')"><span><b>${E(cp.campaign_name)}</b></span><span class="dim">งบ ฿${NF(cp.spend_thb)} · ยอด ฿${NF(cp.revenue_thb)}</span></div>`
      ).join('');
    }
    if ((r.keywords || []).length) {
      html += `<div class="cmd-sec">คีย์เวิร์ด Google (GSC)</div>` + r.keywords.map(k =>
        `<div class="cmd-item" onclick="closeCmdPalette();goTab('website')"><span><b>${E(k.keyword)}</b> <span class="dim">${E(k.landing_page)}</span></span><span class="dim">#${k.avg_position}</span></div>`
      ).join('');
    }
    host.innerHTML = html || '<div class="empty">ไม่พบข้อมูลที่ตรงกับ "' + E(ql) + '"</div>';
  }, 160);
}

function setPreset(p) {
  ST.preset = p;
  document.querySelectorAll('#presetBar button').forEach(b => b.classList.toggle('on', b.dataset.p === p));
  const cd = document.getElementById('custDates');
  cd.style.display = p === 'custom' ? 'inline-flex' : 'none';
  if (p !== 'custom') renderTab();
  else {
    const today = new Date(), s = new Date(today.getTime() - 29 * 86400000);
    if (!document.getElementById('dtStart').value) document.getElementById('dtStart').value = s.toISOString().slice(0, 10);
    if (!document.getElementById('dtEnd').value) document.getElementById('dtEnd').value = today.toISOString().slice(0, 10);
  }
}
function applyCustomDate() {
  ST.start = document.getElementById('dtStart').value;
  ST.end = document.getElementById('dtEnd').value;
  if (!ST.start || !ST.end) { toast('เลือกวันเริ่มต้นและวันสิ้นสุดก่อนครับ'); return; }
  renderTab();
}
function setCompare(v) { ST.compare = v; renderTab(); }

function goTab(tab) {
  ST.tab = tab;
  document.querySelectorAll('#mainNav a').forEach(a => a.classList.toggle('on', a.dataset.tab === tab));
  document.getElementById('sidebar').classList.remove('open');
  renderTab();
}

async function boot() {
  const me = await api('/api/auth/me');
  if (!me || me.auth_required) return;
  ST.me = me;
  applyBrand(me.brand);
  document.getElementById('loginGate').style.display = 'none';

  // Role-based nav visibility
  document.querySelectorAll('#mainNav a[data-perm]').forEach(a => {
    a.style.display = hasPerm(a.dataset.perm) ? 'flex' : 'none';
  });
  document.querySelectorAll('[data-perm-btn]').forEach(b => {
    b.style.display = hasPerm(b.dataset.permBtn) ? 'inline-flex' : 'none';
  });
  if (!hasPerm(ST.tab === 'settings' ? 'settings' : ST.tab)) ST.tab = 'dashboard';
  document.querySelectorAll('#mainNav a').forEach(a => a.classList.toggle('on', a.dataset.tab === ST.tab));

  const sel = document.getElementById('wsSel');
  sel.innerHTML = (me.workspaces || []).map(w => `<option value="${w.id}" ${w.id === me.user.workspace_id ? 'selected' : ''}>${E(w.name)}</option>`).join('');
  document.getElementById('uName').textContent = me.user.name;
  document.getElementById('uRole').textContent = ROLE_LBL[me.user.role] || me.user.role;
  document.getElementById('uAv').textContent = (me.user.role || 'EX').slice(0, 2).toUpperCase();
  const curWs = (me.workspaces || []).find(w => w.id === me.user.workspace_id);
  const db = document.getElementById('demoBadge');
  if (curWs) { db.textContent = curWs.demo_mode ? 'DEMO MODE' : 'LIVE API'; db.classList.toggle('live', !curWs.demo_mode); }
  refreshBadges();
  startFeedbackWatcher();
  renderTab();
}

async function refreshBadges() {
  try {
    const [ld, cm, fb] = await Promise.all([api('/api/leads'), api('/api/comments'), api('/api/feedback/summary')]);
    const bl = document.getElementById('bdLeads');
    const newL = (ld.summary && ld.summary.new) || 0;
    bl.textContent = newL || ''; bl.classList.toggle('show', newL > 0);
    const bc = document.getElementById('bdCmts');
    const unC = (cm.comments || []).filter(x => !x.replied).length;
    bc.textContent = unC || ''; bc.classList.toggle('show', unC > 0);
    const bf = document.getElementById('bdFb');
    if (bf && fb && fb.ok) {
      const nFb = fb.new_count || 0;
      bf.textContent = nFb || ''; bf.classList.toggle('show', nFb > 0);
      if (fb.latest && ST.lastFbId === null) ST.lastFbId = fb.latest.id;
    }
  } catch (e) {}
}

function startFeedbackWatcher() {
  if (window._fbPoll) return;
  window._fbPoll = setInterval(async () => {
    if (!ST.me || !hasPerm('feedback')) return;
    try {
      const r = await api('/api/feedback/summary');
      if (!r || !r.ok) return;
      const bf = document.getElementById('bdFb');
      if (bf) { bf.textContent = r.new_count || ''; bf.classList.toggle('show', (r.new_count || 0) > 0); }
      if (r.latest) {
        if (ST.lastFbId !== null && r.latest.id > ST.lastFbId) {
          toast(`🔔 ฟีดแบคใหม่จาก ${r.latest.sender_name} (⭐${r.latest.rating}): ${String(r.latest.message || '').slice(0, 55)}`);
          if (ST.tab === 'feedback') renderTab();
        }
        ST.lastFbId = r.latest.id;
      }
    } catch (e) {}
  }, 12000);
}

async function switchWorkspace(id) {
  await api('/api/auth/switch-workspace', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ workspace_id: Number(id) }) });
  toast('สลับบริษัท / Workspace แล้ว ✓');
  boot();
}

function openLoginModal() {
  const users = (ST.me && ST.me.users) || [];
  const u = (ST.me && ST.me.user) || {};
  openModal(`
    <div class="card-hd"><b>บัญชีผู้ใช้ &amp; สิทธิ์การใช้งาน (RBAC)</b><button class="btn sm ghost" onclick="closeModal()">ปิด</button></div>
    <div style="display:flex;align-items:center;justify-content:space-between;padding:10px 12px;border-radius:11px;background:var(--ac-soft);margin-bottom:14px">
      <div><b>${E(u.name)}</b> <span class="dim">(${E(u.email)})</span><div style="font-size:12px;color:var(--ac);font-weight:700">${E(ROLE_LBL[u.role] || u.role)}</div></div>
      <button class="btn sm danger" onclick="doLogout()">ออกจากระบบ</button>
    </div>
    <b style="display:block;margin-bottom:8px">เข้าสู่ระบบด้วยอีเมล / รหัสผ่าน</b>
    <div class="fgrid" style="margin-bottom:10px">
      <label>อีเมล<input class="inp" id="mlEmail" type="email" placeholder="user@company.com"></label>
      <label>รหัสผ่าน<input class="inp" id="mlPass" type="password" placeholder="••••••••" onkeydown="if(event.key==='Enter')submitModalLogin()"></label>
    </div>
    <div style="display:flex;justify-content:flex-end;margin-bottom:14px"><button class="btn sm primary" onclick="submitModalLogin()">เข้าสู่ระบบ</button></div>
    ${users.length && !(ST.me && ST.me.require_login) ? `
      <b style="display:block;margin-bottom:8px">สลับบัญชีทดสอบด่วน (Demo Mode)</b>
      <div style="display:grid;gap:8px">${users.map(x => `
        <div style="display:flex;align-items:center;justify-content:space-between;padding:9px 12px;border:1px solid var(--bd);border-radius:11px;background:var(--surf2)">
          <div><b>${E(x.name)}</b><div class="dim" style="font-size:12px">${E(x.email)} · ${E(ROLE_LBL[x.role] || x.role)}</div></div>
          <button class="btn sm ghost" onclick="quickLogin('${E(x.email)}')">สลับใช้บัญชีนี้</button>
        </div>`).join('')}
      </div>` : ''}`);
}

async function submitModalLogin() {
  const email = document.getElementById('mlEmail').value.trim();
  const password = document.getElementById('mlPass').value;
  const r = await api('/api/auth/login', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email, password }) });
  if (r.ok) { closeModal(); toast('เข้าสู่ระบบในนาม ' + r.user.name + ' ✓'); boot(); } else toast(r.error || 'เข้าสู่ระบบไม่สำเร็จ');
}

async function quickLogin(email) {
  const pwMap = { 'admin@pulsemetrics.local': 'admin123', 'mkt@pulsemetrics.local': 'mkt123', 'sales@pulsemetrics.local': 'sales123' };
  const r = await api('/api/auth/login', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email, password: pwMap[email] || 'admin123' }) });
  if (r.ok) { closeModal(); toast('เข้าสู่ระบบในนาม ' + r.user.name + ' ✓'); boot(); } else toast(r.error || 'เข้าสู่ระบบไม่สำเร็จ');
}

async function doLogout() {
  await api('/api/auth/logout', { method: 'POST' });
  closeModal();
  toast('ออกจากระบบแล้ว');
  boot();
}

function openExecReport() {
  window.open('/report?' + qRange(), '_blank');
}
function exportExcel() {
  window.open('/api/export/excel?' + qRange(), '_blank');
  toast('กำลังดาวน์โหลดไฟล์ Excel (6 แท็บ) ✓');
}
async function syncSheets() {
  const b = document.getElementById('gsBtn');
  b.disabled = true; b.textContent = 'กำลังส่งออก…';
  try {
    const r = await api('/api/export/gsheets', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ preset: ST.preset, start: ST.start, end: ST.end, compare: ST.compare }),
    });
    if (!r.ok) { toast(r.error || 'ส่งออกไม่สำเร็จ'); return; }
    toast(r.message || 'ส่งออกเรียบร้อย ✓');
    if (r.mode === 'live_gsheet' && r.sheet_url) window.open(r.sheet_url, '_blank');
    else if (r.download_url) window.open(r.download_url, '_blank');
  } finally { b.disabled = false; b.textContent = '📊 Google Sheets'; }
}

function svgDualLine(curPts, prevPts, key, color, label = '') {
  const W = 720, H = 215, pad = 28;
  if (!curPts.length) return '<div class="empty">ยังไม่มีข้อมูลในช่วงเวลานี้</div>';
  const allV = [...curPts.map(x => Number(x[key] || 0)), ...prevPts.map(x => Number(x[key] || 0)), 1];
  const mx = Math.max(...allV) * 1.1;
  const coords = arr => arr.map((x, i) => ({
    px: pad + (i / Math.max(1, arr.length - 1)) * (W - pad * 2),
    py: H - pad - (Number(x[key] || 0) / mx) * (H - pad * 2),
    val: Number(x[key] || 0),
    lbl: x.dt || x.label || '',
  }));
  const cPts = coords(curPts);
  const pPts = coords(prevPts.slice(0, curPts.length));
  const curLine = cPts.map(p => `${p.px.toFixed(1)},${p.py.toFixed(1)}`).join(' ');
  const prvLine = pPts.length > 1 ? pPts.map(p => `${p.px.toFixed(1)},${p.py.toFixed(1)}`).join(' ') : '';
  const area = `${pad},${H - pad} ${curLine} ${(W - pad).toFixed(1)},${H - pad}`;
  const step = Math.max(1, Math.floor(curPts.length / 6));
  const xLabels = curPts.map((x, i) => (i % step === 0 || i === curPts.length - 1)
    ? `<text x="${(pad + (i / Math.max(1, curPts.length - 1)) * (W - pad * 2)).toFixed(1)}" y="${H - 6}" text-anchor="middle" fill="var(--dim)" font-size="10.5">${E(x.label)}</text>` : '').join('');

  window._chartMeta = { cPts, pPts, color, label };
  const hitW = Math.max(12, (W - pad * 2) / Math.max(1, cPts.length));
  const hits = cPts.map((p, i) => `<rect x="${(p.px - hitW / 2).toFixed(1)}" y="${pad}" width="${hitW.toFixed(1)}" height="${H - pad * 2}" fill="transparent" style="cursor:crosshair" onmouseenter="showChartTip(event,${i})" onmousemove="showChartTip(event,${i})" onmouseleave="hideChartTip()"/>`).join('');

  return `<div class="chart-wrap" id="chartWrap">
    <div class="chart-tip" id="chartTip"></div>
    <svg class="chart-svg" viewBox="0 0 ${W} ${H}">
      <defs><linearGradient id="cg" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="${color}" stop-opacity=".26"/><stop offset="100%" stop-color="${color}" stop-opacity="0"/></linearGradient></defs>
      <line x1="${pad}" y1="${pad}" x2="${W - pad}" y2="${pad}" stroke="var(--bd)" stroke-dasharray="3 3"/>
      <line x1="${pad}" y1="${H / 2}" x2="${W - pad}" y2="${H / 2}" stroke="var(--bd)" stroke-dasharray="3 3"/>
      <line x1="${pad}" y1="${H - pad}" x2="${W - pad}" y2="${H - pad}" stroke="var(--bd)"/>
      <polygon points="${area}" fill="url(#cg)"/>
      ${prvLine ? `<polyline points="${prvLine}" fill="none" stroke="var(--dim)" stroke-width="2" stroke-dasharray="5 4" opacity=".65"/>` : ''}
      <polyline points="${curLine}" fill="none" stroke="${color}" stroke-width="2.8" stroke-linejoin="round" stroke-linecap="round"/>
      <circle id="chartDot" cx="-20" cy="-20" r="5" fill="${color}" stroke="#fff" stroke-width="2" style="display:none"/>
      <text x="${pad}" y="16" fill="var(--dim)" font-size="10.5">สูงสุด ${NF(Math.round(mx))} (เอาเมาส์ชี้ดูรายวันได้)</text>
      ${xLabels}
      ${hits}
    </svg>
  </div>`;
}
function showChartTip(ev, idx) {
  const m = window._chartMeta, tip = document.getElementById('chartTip'), wrap = document.getElementById('chartWrap'), dot = document.getElementById('chartDot');
  if (!m || !tip || !wrap || !m.cPts[idx]) return;
  const c = m.cPts[idx], p = m.pPts[idx];
  const diff = p && p.val > 0 ? ((100 * (c.val - p.val) / p.val).toFixed(1)) : null;
  tip.innerHTML = `<b>${E(c.lbl)}</b> · ${E(m.label)}<br>ช่วงปัจจุบัน: <b style="color:#60a5fa">${NF(c.val)}</b>`
    + (p ? `<br>ช่วงก่อนหน้า (${E(p.lbl)}): <b>${NF(p.val)}</b>` + (diff !== null ? ` (${Number(diff) >= 0 ? '+' : ''}${diff}%)` : '') : '');
  const rc = wrap.getBoundingClientRect();
  const lx = Math.min(rc.width - 190, Math.max(8, ev.clientX - rc.left + 12));
  const ly = Math.max(6, ev.clientY - rc.top - 58);
  tip.style.left = lx + 'px'; tip.style.top = ly + 'px'; tip.style.display = 'block';
  if (dot) { dot.setAttribute('cx', c.px.toFixed(1)); dot.setAttribute('cy', c.py.toFixed(1)); dot.style.display = 'block'; }
}
function hideChartTip() {
  const tip = document.getElementById('chartTip'), dot = document.getElementById('chartDot');
  if (tip) tip.style.display = 'none';
  if (dot) dot.style.display = 'none';
}

async function renderTab() {
  const host = document.getElementById('appView');
  if (ST.tab === 'dashboard') return viewDashboard(host);
  if (ST.tab === 'leads') return viewLeads(host);
  if (ST.tab === 'comments') return viewComments(host);
  if (ST.tab === 'feedback') return viewFeedback(host);
  if (ST.tab === 'website') return viewWebsite(host);
  if (ST.tab === 'posts') return viewPosts(host);
  if (ST.tab === 'roi') return viewRoi(host);
  if (ST.tab === 'competitors') return viewCompetitors(host);
  if (ST.tab === 'strategy') return viewStrategy(host);
  if (ST.tab === 'goals') return viewGoals(host);
  if (ST.tab === 'calendar') return viewCalendar(host);
  if (ST.tab === 'settings') return viewSettings(host);
}

/* =========================== 1. EXECUTIVE DASHBOARD =========================== */
async function viewDashboard(host) {
  const d = await api('/api/dashboard?' + qRange());
  if (!d.ok) { host.innerHTML = `<div class="empty">${E(d.error || 'โหลดข้อมูลไม่สำเร็จ')}</div>`; return; }
  const c = d.current, dl = d.deltas, r = d.range;
  const mTabs = [
    ['visitors', 'คนเข้าเว็บ (GA4)', '#2563eb'],
    ['leads', 'ลูกค้าทัก (Leads)', '#16a34a'],
    ['gsc_imp', 'เสิร์ชเจอ Google', '#0ea5e9'],
    ['fb_views', 'วิว Facebook', '#1877f2'],
    ['yt_views', 'วิว YouTube', '#ef4444'],
  ];
  const curM = mTabs.find(x => x[0] === ST.chartMetric) || mTabs[0];
  const maxCh = Math.max(1, ...(d.channels || []).map(x => x.users));
  const h = d.health || { total: 0, grade: '-', dimensions: [] };
  const brief = d.morning_brief || [];
  window._lastDash = d;

  host.innerHTML = `
    <div class="page-hd">
      <div><h1>แดชบอร์ดหลัก — ${E(d.workspace.name)}</h1>
      <div class="sub">ช่วงข้อมูล <b>${E(r.start)} ถึง ${E(r.end)}</b> · เปรียบเทียบแบบ <b>${E(r.compare_label)}</b> (${E(r.prev_start)} – ${E(r.prev_end)})</div></div>
      <div style="display:flex;gap:8px;flex-wrap:wrap">
        <button class="btn sm primary" onclick="openWeeklyDigestCard()">📸 การ์ดสรุปสัปดาห์ (PNG)</button>
        <button class="btn sm ghost" onclick="openExecReport()">📄 รายงานผู้บริหาร (PDF)</button>
        <button class="btn sm ghost" onclick="goTab('posts')">ดูยอดทักรายโพสต์ →</button>
      </div>
    </div>

    <div class="grid2">
      <div class="card" style="margin-bottom:16px">
        <div class="card-hd"><b>☀️ เช้านี้ทำ 3 อย่างนี้ก่อน (Morning Brief · 0 โทเคน)</b><button class="btn sm ghost" onclick="openIdeaPad()">📝 จดไอเดีย (Alt+N)</button></div>
        <div class="brief-grid">
          ${brief.map(b => `<div class="brief-item ${E(b.priority)}">
            <div><b>${b.icon} ${E(b.title)}</b><div class="dim" style="font-size:12px;margin-top:2px">${E(b.detail)}</div></div>
            <button class="btn sm ghost" style="white-space:nowrap" onclick="goTab('${E(b.tab)}')">${E(b.btn)}</button>
          </div>`).join('')}
        </div>
      </div>
      <div class="card" style="margin-bottom:16px">
        <div class="card-hd"><b>💚 คะแนนสุขภาพการตลาดองค์กร (5 มิติ)</b><span class="pill ${h.total >= 75 ? 'p-ok' : h.total >= 55 ? 'p-warn' : 'p-bad'}">เกรด ${E(h.grade)}</span></div>
        <div class="health-top">
          <div class="health-ring ${h.total >= 75 ? '' : h.total >= 55 ? 'mid' : 'low'}">${h.total}</div>
          <div style="flex:1;display:grid;gap:5px">
            ${(h.dimensions || []).map(dm => `<div style="display:grid;grid-template-columns:135px 1fr 44px;gap:8px;align-items:center;font-size:12px" title="${E(dm.note)}">
              <span>${E(dm.label)}</span>
              <div class="bar-trk" style="height:8px"><i style="width:${Math.max(6, 100 * dm.score / dm.max)}%"></i></div>
              <b class="r">${dm.score}/${dm.max}</b>
            </div>`).join('')}
          </div>
        </div>
      </div>
    </div>

    <div class="kpi-grid">
      <div class="kpi" style="--kcol:var(--ok)"><small>ลูกค้าทักเข้ามารวม (Leads)</small><div class="val">${NF(c.total_leads)} คน</div>${deltaHtml(dl.total_leads)} <span class="dim" style="font-size:11.5px">FB ${c.fb_leads} · เว็บ ${c.web_leads} · YT ${c.yt_leads}</span></div>
      <div class="kpi" style="--kcol:var(--ga)"><small>ผู้เข้าชมเว็บไซต์ (GA4 Users)</small><div class="val">${NF(c.visitors)}</div>${deltaHtml(dl.visitors)} <span class="dim" style="font-size:11.5px">${NF(c.pageviews)} Pageviews</span></div>
      <div class="kpi" style="--kcol:var(--gsc)"><small>เสิร์ชเจอบน Google (GSC)</small><div class="val">${NF(c.gsc_impressions)}</div>${deltaHtml(dl.gsc_impressions)} <span class="dim" style="font-size:11.5px">คลิก ${NF(c.gsc_clicks)} (${c.gsc_ctr}%)</span></div>
      <div class="kpi" style="--kcol:var(--fb)"><small>ยอดรับชม Facebook Page</small><div class="val">${NF(c.fb_views)}</div>${deltaHtml(dl.fb_views)} <span class="dim" style="font-size:11.5px">มีส่วนร่วม ${NF(c.fb_engagements)}</span></div>
      <div class="kpi" style="--kcol:var(--yt)"><small>ยอดรับชม YouTube</small><div class="val">${NF(c.yt_views)}</div>${deltaHtml(dl.yt_views)} <span class="dim" style="font-size:11.5px">มีส่วนร่วม ${NF(c.yt_engagements)}</span></div>
    </div>

    <div class="grid2">
      <div class="card">
        <div class="card-hd">
          <div><b>แนวโน้มผลงานเทียบช่วงก่อนหน้า (${E(r.compare_label)})</b><div class="dim" style="font-size:12px">เส้นทึบ = ช่วงปัจจุบัน · เส้นประ = ช่วงเปรียบเทียบ</div></div>
          <div class="seg">${mTabs.map(([k, l]) => `<button class="${ST.chartMetric === k ? 'on' : ''}" onclick="ST.chartMetric='${k}';renderTab()">${l}</button>`).join('')}</div>
        </div>
        ${svgDualLine(d.series.current, d.series.previous, curM[0], curM[2], curM[1])}
      </div>
      <div class="card">
        <div class="card-hd"><b>ลูกค้าเข้าช่องทางไหนเยอะสุด (Traffic Sources)</b><span class="dim" style="font-size:12px">จาก GA4 + Tracker</span></div>
        <div class="bar-list">
          ${(d.channels || []).length ? d.channels.map(ch => `<div class="bar-row">
            <b style="overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${E(ch.channel)}</b>
            <div class="bar-trk"><i style="width:${Math.max(4, 100 * ch.users / maxCh)}%"></i></div>
            <div class="r"><b>${ch.share_pct}%</b> <span class="dim">(${NF(ch.leads)} ทัก)</span></div>
          </div>`).join('') : '<div class="empty">ยังไม่มีข้อมูลช่องทางเข้าเว็บ</div>'}
        </div>
      </div>
    </div>

    <div class="card">
      <div class="card-hd">
        <div><b>💡 คำแนะนำสำหรับแพลตฟอร์มเพื่อต่อยอด (Platform Growth Advisor · 0 โทเคน)</b>
        <div class="dim" style="font-size:12px">วิเคราะห์อัตโนมัติจากข้อมูลจริงทั้ง 4 แพลตฟอร์ม (Google Search Console · GA4 · Facebook · YouTube)</div></div>
      </div>
      <div class="adv-grid">${(d.advisor || []).length ? d.advisor.map(a => `
        <div class="adv-card ${E(a.priority)}">
          <div style="display:flex;align-items:center;justify-content:space-between;gap:6px">
            <span class="pill ${PLAT_CLS[a.platform] || ''}">${E(a.label)}</span>
            <span class="dim" style="font-size:11.5px;font-weight:700">${E(a.metric)}</span>
          </div>
          <b style="font-size:14px">${E(a.title)}</b>
          <div class="dim" style="font-size:12.5px">${E(a.action)}</div>
        </div>`).join('') : '<div class="empty">รอข้อมูลจาก API จริงหรือ Tracker เพื่อสร้างคำแนะนำอัตโนมัติ</div>'}
      </div>
    </div>

    <div class="card">
      <div class="card-hd">
        <div><b>🎯 โพสต์ที่พาลูกค้าทักเข้ามามากที่สุด (คลิกดูต้นทาง / คอมเมนต์ / รายชื่อคนทัก)</b></div>
        <button class="btn sm ghost" onclick="goTab('posts')">ดูทั้งหมด →</button>
      </div>
      <div style="overflow-x:auto"><table class="tb">
        <tr><th>ช่องทาง</th><th>ชื่อโพสต์ / คลิป (คลิกดูรายละเอียด &amp; คอมเมนต์)</th><th class="r">ยอดชม</th><th class="r">คอมเมนต์</th><th class="r">คลิกเข้าเว็บ</th><th class="r">เข้ามาแล้วทัก</th><th class="r">ยอดปิด (บาท)</th><th>ต้นทาง</th></tr>
        ${(d.top_posts || []).slice(0, 7).map(p => `<tr>
          <td><span class="pill ${PLAT_CLS[p.platform] || ''}">${PLAT_LBL[p.platform] || p.platform}</span></td>
          <td><a class="link-src" onclick="openPostDetail(${p.id})">${E(p.title)}</a><div class="dim" style="font-size:11.5px">${E(p.published_at)} · รหัส <code>${E(p.tracking_code)}</code></div></td>
          <td class="r">${NF(p.views)}</td>
          <td class="r">${NF(p.comments_count)}</td>
          <td class="r">${NF(p.web_clicks)}</td>
          <td class="r"><b style="color:var(--ok);font-size:14.5px">${NF(p.effective_leads)} คน</b></td>
          <td class="r"><b>฿${NF(p.revenue_thb)}</b></td>
          <td style="white-space:nowrap"><a class="btn sm ghost" href="${E(p.source_url)}" target="_blank">เปิดโพสต์ ↗</a></td>
        </tr>`).join('') || '<tr><td colspan="8" class="empty">ยังไม่มีข้อมูลโพสต์</td></tr>'}
      </table></div>
    </div>`;
}

async function openPostDetail(postId) {
  const r = await api('/api/posts/' + postId);
  if (!r.ok) { toast(r.error || 'โหลดข้อมูลโพสต์ไม่สำเร็จ'); return; }
  const p = r.post, lds = r.leads || [], cmts = r.comments || [];
  openModal(`
    <div class="card-hd">
      <div><span class="pill ${PLAT_CLS[p.platform] || ''}">${PLAT_LBL[p.platform] || p.platform}</span> <b style="margin-left:6px">${E(p.title)}</b></div>
      <button class="btn sm ghost" onclick="closeModal()">ปิด</button>
    </div>
    <div style="display:flex;gap:8px;flex-wrap:wrap;margin-bottom:12px">
      <a class="btn sm primary" href="${E(p.source_url)}" target="_blank">เปิดโพสต์ต้นทางจริง ↗</a>
      <a class="btn sm ghost" href="/go/${E(p.tracking_code)}" target="_blank">ทดสอบลิงก์ติดตาม /go/${E(p.tracking_code)} ↗</a>
      <button class="btn sm ghost" onclick="navigator.clipboard.writeText(location.origin+'/go/${E(p.tracking_code)}');toast('คัดลอกลิงก์ติดตามโพสต์แล้ว ✓')">คัดลอกลิงก์ติด UTM</button>
    </div>
    <div class="kpi-grid" style="grid-template-columns:repeat(4,1fr)">
      <div class="kpi"><small>ยอดรับชม</small><div class="val" style="font-size:20px">${NF(p.views)}</div></div>
      <div class="kpi"><small>คลิกเข้าเว็บ</small><div class="val" style="font-size:20px">${NF(p.web_clicks)}</div></div>
      <div class="kpi" style="--kcol:var(--ok)"><small>เข้ามาแล้วทัก</small><div class="val" style="font-size:20px;color:var(--ok)">${NF(Math.max(p.leads_count, lds.length))} คน</div></div>
      <div class="kpi"><small>ยอดปิดการขาย</small><div class="val" style="font-size:20px">฿${NF(p.revenue_thb)}</div></div>
    </div>
    <b style="display:block;margin:12px 0 6px">💬 ลูกค้าที่ทักเข้ามาจากโพสต์นี้ (${lds.length} รายการใน CRM)</b>
    ${lds.length ? lds.map(l => `<div style="padding:9px 11px;border:1px solid var(--bd);border-radius:10px;margin-bottom:6px;background:var(--surf2)">
      <div style="display:flex;justify-content:space-between;gap:8px"><b>${E(l.customer_name)}</b><span class="pill p-ok">${STAGE_LBL[l.stage] || l.stage} · ฿${NF(l.deal_value)}</span></div>
      <div class="dim" style="font-size:12.5px;margin-top:2px">${E(l.message)}</div>
    </div>`).join('') : '<div class="dim">ยังไม่มีรายชื่อลูกค้าผูกกับโพสต์นี้</div>'}
    <b style="display:block;margin:14px 0 6px">🗨️ คอมเมนต์ใต้โพสต์นี้ (${cmts.length})</b>
    ${cmts.length ? cmts.map(c => `<div style="padding:8px 11px;border:1px solid var(--bd);border-radius:10px;margin-bottom:6px">
      <b>${E(c.author)}</b> <span class="dim" style="font-size:11.5px">· ${E(c.created_at)}</span>
      <div style="margin-top:3px">${E(c.content)}</div>
    </div>`).join('') : '<div class="dim">ยังไม่มีคอมเมนต์ที่ดึงเข้ามา</div>'}`);
}

function openWeeklyDigestCard() {
  const d = window._lastDash;
  if (!d) { toast('รอโหลดข้อมูลแดชบอร์ดสักครู่ครับ'); return; }
  const c = d.current, dl = d.deltas, r = d.range, h = d.health || { total: 80, grade: 'A' };
  const brand = (ST.me && ST.me.brand && ST.me.brand.brand_name) || 'PulseMetrics';
  const topP = (d.top_posts || [])[0];
  const txtSummary = `📊 สรุปผลงาน ${d.workspace.name} (${r.start} – ${r.end} · ${r.compare_label})\n`
    + `• ลูกค้าทักรวม: ${NF(c.total_leads)} คน (${dl.total_leads >= 0 ? '+' : ''}${dl.total_leads}%)\n`
    + `• ผู้เข้าชมเว็บ (GA4): ${NF(c.visitors)} (${dl.visitors >= 0 ? '+' : ''}${dl.visitors}%)\n`
    + `• เสิร์ชเจอ Google (GSC): ${NF(c.gsc_impressions)} (${dl.gsc_impressions >= 0 ? '+' : ''}${dl.gsc_impressions}%)\n`
    + `• ยอดปิดการขาย CRM: ฿${NF(c.won_revenue)} (${NF(c.won_deals)} ดีล)\n`
    + `• คะแนนสุขภาพการตลาด: ${h.total}/100 (เกรด ${h.grade})\n`
    + (topP ? `• โพสต์ทักสูงสุด: ${topP.title.slice(0, 52)} (${topP.effective_leads} ทัก)` : '');

  openModal(`
    <div class="card-hd"><b>📸 การ์ดสรุปผลงานประจำสัปดาห์ (ส่งเข้ากรุ๊ป LINE / ผู้บริหาร 1 คลิก)</b><button class="btn sm ghost" onclick="closeModal()">ปิด</button></div>
    <canvas id="dgCanvas" width="1200" height="675" style="width:100%;border-radius:14px;border:1px solid var(--bd);display:block;margin-bottom:12px"></canvas>
    <div style="display:flex;gap:8px;flex-wrap:wrap;justify-content:flex-end">
      <button class="btn sm ghost" onclick="navigator.clipboard.writeText(${JSON.stringify(txtSummary)});toast('คัดลอกข้อความสรุปแล้ว วางใน LINE ได้เลย ✓')">📋 คัดลอกข้อความสรุป</button>
      <button class="btn sm primary" onclick="downloadDigestPng()">📥 บันทึกภาพ PNG ส่ง LINE</button>
    </div>`);

  const cv = document.getElementById('dgCanvas');
  const ctx = cv.getContext('2d');
  const grd = ctx.createLinearGradient(0, 0, 1200, 675);
  grd.addColorStop(0, '#0f172a'); grd.addColorStop(0.55, '#172554'); grd.addColorStop(1, '#1e3a8a');
  ctx.fillStyle = grd; ctx.fillRect(0, 0, 1200, 675);

  ctx.fillStyle = '#93c5fd'; ctx.font = '700 22px "Noto Sans Thai", sans-serif';
  ctx.fillText(brand.toUpperCase() + '  ·  WEEKLY EXECUTIVE DIGEST', 52, 66);
  ctx.fillStyle = '#ffffff'; ctx.font = '800 42px "Noto Sans Thai", sans-serif';
  ctx.fillText(String(d.workspace.name || '').slice(0, 38), 52, 122);
  ctx.fillStyle = '#cbd5e1'; ctx.font = '500 22px "Noto Sans Thai", sans-serif';
  ctx.fillText(`ช่วงข้อมูล ${r.start} ถึง ${r.end}  (${r.compare_label})`, 52, 160);

  // Health Badge top-right
  ctx.fillStyle = 'rgba(34,197,94,0.18)';
  ctx.beginPath(); ctx.roundRect(955, 48, 195, 110, 18); ctx.fill();
  ctx.strokeStyle = '#4ade80'; ctx.lineWidth = 2; ctx.stroke();
  ctx.fillStyle = '#86efac'; ctx.font = '700 17px "Noto Sans Thai", sans-serif';
  ctx.fillText('HEALTH SCORE', 990, 82);
  ctx.fillStyle = '#ffffff'; ctx.font = '800 44px "Noto Sans Thai", sans-serif';
  ctx.fillText(`${h.total}/100`, 982, 136);

  const cards = [
    ['ลูกค้าทักเข้ามารวม (Leads)', NF(c.total_leads) + ' คน', (dl.total_leads >= 0 ? '▲ +' : '▼ ') + dl.total_leads + '%', '#4ade80'],
    ['ผู้เข้าชมเว็บ (GA4 Users)', NF(c.visitors), (dl.visitors >= 0 ? '▲ +' : '▼ ') + dl.visitors + '%', '#60a5fa'],
    ['เสิร์ชเจอ Google (GSC)', NF(c.gsc_impressions), (dl.gsc_impressions >= 0 ? '▲ +' : '▼ ') + dl.gsc_impressions + '%', '#38bdf8'],
    ['ยอดปิดการขาย CRM (Won)', '฿' + NF(c.won_revenue), NF(c.won_deals) + ' ดีลปิดสำเร็จ', '#c084fc'],
  ];
  cards.forEach(([lbl, val, sub, col], i) => {
    const x = 52 + (i % 2) * 560, y = 205 + Math.floor(i / 2) * 165;
    ctx.fillStyle = 'rgba(255,255,255,0.08)';
    ctx.beginPath(); ctx.roundRect(x, y, 535, 142, 18); ctx.fill();
    ctx.fillStyle = col; ctx.fillRect(x, y + 18, 6, 106);
    ctx.fillStyle = '#cbd5e1'; ctx.font = '600 20px "Noto Sans Thai", sans-serif';
    ctx.fillText(lbl, x + 26, y + 46);
    ctx.fillStyle = '#ffffff'; ctx.font = '800 42px "Noto Sans Thai", sans-serif';
    ctx.fillText(val, x + 26, y + 98);
    ctx.fillStyle = col; ctx.font = '700 19px "Noto Sans Thai", sans-serif';
    ctx.fillText(sub, x + 26, y + 128);
  });

  if (topP) {
    ctx.fillStyle = 'rgba(255,255,255,0.10)';
    ctx.beginPath(); ctx.roundRect(52, 548, 1096, 86, 16); ctx.fill();
    ctx.fillStyle = '#fde047'; ctx.font = '700 18px "Noto Sans Thai", sans-serif';
    ctx.fillText('🎯 โพสต์ที่พาลูกค้าทักสูงสุด:', 76, 582);
    ctx.fillStyle = '#ffffff'; ctx.font = '700 22px "Noto Sans Thai", sans-serif';
    ctx.fillText(`${String(topP.title || '').slice(0, 58)}   (${topP.effective_leads} คนทัก · ฿${NF(topP.revenue_thb)})`, 76, 616);
  }
}
function downloadDigestPng() {
  const cv = document.getElementById('dgCanvas');
  if (!cv) return;
  const a = document.createElement('a');
  a.download = `PulseMetrics_Digest_${new Date().toISOString().slice(0, 10)}.png`;
  a.href = cv.toDataURL('image/png');
  a.click();
  toast('บันทึกภาพการ์ดสรุปผลงาน PNG แล้ว ✓');
}

/* =========================== 2. CUSTOMER INBOX & LEADS CRM PRO =========================== */
async function viewLeads(host) {
  const qs = new URLSearchParams();
  if (ST.leadQ) qs.set('q', ST.leadQ);
  if (ST.leadStage) qs.set('stage', ST.leadStage);
  if (ST.leadCh) qs.set('channel', ST.leadCh);
  const d = await api('/api/leads?' + qs.toString());
  const s = d.summary || {}, rows = d.leads || [], posts = d.posts || [];
  window._leadPosts = posts;
  host.innerHTML = `
    <div class="page-hd">
      <div><h1>แชท &amp; ติดต่องานลูกค้า (Lead CRM Pro)</h1>
      <div class="sub">นับยอดลูกค้าทักเข้าจาก Facebook + LINE OA + TikTok + Instagram + เว็บ · แท็กผูกโพสต์ · ลากวาง Kanban · ใบเสนอราคา PDF</div></div>
      <div style="display:flex;gap:8px;flex-wrap:wrap;align-items:center">
        <div class="seg">
          <button class="${ST.leadView === 'table' ? 'on' : ''}" onclick="ST.leadView='table';renderTab()">📋 ตาราง</button>
          <button class="${ST.leadView === 'kanban' ? 'on' : ''}" onclick="ST.leadView='kanban';renderTab()">🗂️ Kanban ลากวาง</button>
        </div>
        <a class="btn sm ghost" href="/api/leads/export.csv" target="_blank">📥 Export CSV</a>
        <button class="btn primary sm" onclick="openAddLeadModal()">+ บันทึกลูกค้าทักใหม่</button>
      </div>
    </div>
    <div class="kpi-grid">
      <div class="kpi"><small>ลูกค้าทักทั้งหมด</small><div class="val">${NF(s.total)} คน</div></div>
      <div class="kpi" style="--kcol:var(--warn)"><small>ทักใหม่ (รอตอบ)</small><div class="val">${NF(s.new)} คน</div></div>
      <div class="kpi" style="--kcol:var(--ac)"><small>กำลังคุย / เสนอราคา</small><div class="val">${NF(s.talking)} ราย</div><span class="dim" style="font-size:12px">มูลค่าคิว ฿${NF(s.pipeline_thb)}</span></div>
      <div class="kpi" style="--kcol:var(--ok)"><small>ปิดการขายแล้ว (Won)</small><div class="val" style="color:var(--ok)">฿${NF(s.won_thb)}</div><span class="dim" style="font-size:12px">${NF(s.won)} ดีล</span></div>
    </div>

    <div class="card">
      <div class="filter-bar">
        <input class="inp" id="leadSearch" placeholder="🔍 ค้นหาชื่อลูกค้า / เบอร์ / ข้อความ / รหัสโพสต์…" value="${E(ST.leadQ)}" onkeydown="if(event.key==='Enter'){ST.leadQ=this.value;renderTab()}">
        <select class="inp" style="flex:0 0 155px" onchange="ST.leadStage=this.value;renderTab()">
          <option value="">ทุกสถานะ</option>
          ${Object.entries(STAGE_LBL).map(([k, v]) => `<option value="${k}" ${ST.leadStage === k ? 'selected' : ''}>${v}</option>`).join('')}
        </select>
        <select class="inp" style="flex:0 0 155px" onchange="ST.leadCh=this.value;renderTab()">
          <option value="">ทุกช่องทางทัก</option>
          <option value="facebook" ${ST.leadCh === 'facebook' ? 'selected' : ''}>Facebook Inbox</option>
          <option value="line" ${ST.leadCh === 'line' ? 'selected' : ''}>LINE OA</option>
          <option value="tiktok" ${ST.leadCh === 'tiktok' ? 'selected' : ''}>TikTok</option>
          <option value="instagram" ${ST.leadCh === 'instagram' ? 'selected' : ''}>Instagram</option>
          <option value="website" ${ST.leadCh === 'website' ? 'selected' : ''}>เว็บไซต์</option>
        </select>
        <button class="btn sm primary" onclick="ST.leadQ=document.getElementById('leadSearch').value;renderTab()">ค้นหา</button>
        ${(ST.leadQ || ST.leadStage || ST.leadCh) ? `<button class="btn sm ghost" onclick="ST.leadQ='';ST.leadStage='';ST.leadCh='';renderTab()">ล้างตัวกรอง</button>` : ''}
      </div>

      ${ST.leadView === 'kanban' ? `
        <div class="kanban-grid">
          ${Object.entries(STAGE_LBL).map(([sk, slbl]) => {
            const colRows = rows.filter(x => x.stage === sk);
            const colSum = colRows.reduce((a, b) => a + Number(b.deal_value || 0), 0);
            return `<div class="kb-col" ondragover="event.preventDefault();this.classList.add('over')" ondragleave="this.classList.remove('over')" ondrop="dropLeadStage(event,'${sk}',this)">
              <div class="kb-hd"><span>${slbl} (${colRows.length})</span><span class="dim" style="font-size:11.5px">฿${NF(colSum)}</span></div>
              ${colRows.map(l => `<div class="kb-card" draggable="true" ondragstart="event.dataTransfer.setData('text/plain','${l.id}')">
                <div style="display:flex;justify-content:space-between;gap:4px;align-items:center">
                  <b style="font-size:13px">${E(l.customer_name)}</b>
                  <span class="pill ${PLAT_CLS[l.channel] || ''}" style="font-size:10.5px">${PLAT_LBL[l.channel] || l.channel}</span>
                </div>
                <div class="dim" style="font-size:11.5px">${E((l.message || '').slice(0, 72))}</div>
                <div style="display:flex;justify-content:space-between;align-items:center;margin-top:2px">
                  <b style="color:var(--ok);font-size:13px">฿${NF(l.deal_value)}</b>
                  ${l.sla_overdue ? '<span class="sla-badge">⏰ >4ชม.</span>' : ''}
                </div>
                <div style="display:flex;gap:5px;flex-wrap:wrap;margin-top:3px">
                  <button class="btn sm ghost" style="padding:3px 7px;font-size:11px" onclick="openLeadNotes(${l.id})">📝 โน้ต (${l.notes_count || 0})</button>
                  <a class="btn sm ghost" style="padding:3px 7px;font-size:11px" href="/quote/${l.id}" target="_blank">🧾 ใบเสนอราคา</a>
                </div>
              </div>`).join('') || '<div class="dim" style="font-size:12px;text-align:center;padding:18px 6px">ลากลูกค้ามาวางที่นี่</div>'}
            </div>`;
          }).join('')}
        </div>` : `
      <div style="overflow-x:auto"><table class="tb">
        <tr><th>ลูกค้า &amp; ข้อความ</th><th>ช่องทางทัก</th><th>มาจากโพสต์ไหน (แท็ก 1 คลิก)</th><th>สถานะปิดการขาย</th><th class="r">มูลค่า (บาท)</th><th>จัดการ / PDF</th></tr>
        ${rows.map(l => `<tr>
          <td style="min-width:240px">
            <b>${E(l.customer_name)}</b>${l.sla_overdue ? '<span class="sla-badge">⏰ ค้าง >4 ชม.</span>' : ''}
            <div class="dim" style="font-size:11.5px">${E(l.contact)} · ${E(l.created_at)}${l.assignee ? ' · ผู้ดูแล: <b>' + E(l.assignee) + '</b>' : ''}</div>
            <div style="font-size:12.5px;color:var(--tx2);margin-top:2px">${E(l.message)}</div>
            ${l.next_followup ? `<div style="font-size:11.5px;color:var(--ac);margin-top:2px">📅 นัดติดตาม: <b>${E(l.next_followup)}</b></div>` : ''}
          </td>
          <td><span class="pill ${PLAT_CLS[l.channel] || ''}">${PLAT_LBL[l.channel] || l.channel}</span>
            ${l.landing_page ? `<div class="dim" style="font-size:11px;margin-top:3px">หน้า ${E(l.landing_page)}</div>` : ''}</td>
          <td style="min-width:195px">
            <select class="inp" style="padding:5px 8px;font-size:12px" onchange="updLead(${l.id}, {post_id:this.value})">
              <option value="">— ยังไม่ระบุโพสต์ —</option>
              ${posts.map(p => `<option value="${p.id}" ${l.post_id === p.id ? 'selected' : ''}>[${PLAT_LBL[p.platform]}] ${E(p.title.slice(0, 38))}</option>`).join('')}
            </select>
            ${l.post_url ? `<a class="link-src" style="font-size:11.5px;display:inline-block;margin-top:3px" href="${E(l.post_url)}" target="_blank">เปิดโพสต์ต้นทาง ↗</a>` : ''}
          </td>
          <td><select class="inp" style="padding:5px 8px;font-size:12px;width:128px" onchange="updLead(${l.id}, {stage:this.value})">
            ${Object.entries(STAGE_LBL).map(([k, v]) => `<option value="${k}" ${l.stage === k ? 'selected' : ''}>${v}</option>`).join('')}
          </select></td>
          <td class="r"><input class="inp" type="number" step="5000" style="width:104px;text-align:right;padding:5px 8px;font-size:12.5px" value="${l.deal_value || 0}" onchange="updLead(${l.id}, {deal_value:Number(this.value)||0})"></td>
          <td style="white-space:nowrap;display:flex;gap:5px;flex-wrap:wrap">
            <button class="btn sm ghost" onclick="openLeadNotes(${l.id})">📝 โน้ต (${l.notes_count || 0})</button>
            <a class="btn sm ghost" href="/quote/${l.id}" target="_blank" title="ออกใบเสนอราคา PDF 1 คลิก">🧾 PDF</a>
          </td>
        </tr>`).join('') || '<tr><td colspan="6" class="empty">ไม่พบรายการลูกค้าตามเงื่อนไขที่เลือก</td></tr>'}
      </table></div>`}
    </div>`;
}

function dropLeadStage(ev, newStage, colEl) {
  ev.preventDefault();
  colEl.classList.remove('over');
  const id = Number(ev.dataTransfer.getData('text/plain'));
  if (id) updLead(id, { stage: newStage });
}

async function updLead(id, patch) {
  await api('/api/leads', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ action: 'update', id, ...patch }) });
  toast('อัปเดตข้อมูลลูกค้าแล้ว ✓');
  refreshBadges();
  startFeedbackWatcher();
  renderTab();
}

async function openLeadNotes(leadId) {
  const r = await api('/api/leads/' + leadId + '/notes');
  if (!r.ok) { toast(r.error || 'โหลดโน้ตไม่สำเร็จ'); return; }
  const l = r.lead, notes = r.notes || [];
  openModal(`
    <div class="card-hd">
      <div><b>📝 ประวัติการติดตาม: ${E(l.customer_name)}</b><div class="dim" style="font-size:12px">${E(l.contact)} · ${E(STAGE_LBL[l.stage] || l.stage)}</div></div>
      <button class="btn sm ghost" onclick="closeModal()">ปิด</button>
    </div>
    <div class="fgrid" style="margin-bottom:10px">
      <label>ผู้รับผิดชอบ (Assignee)<input class="inp" id="lnAsg" value="${E(l.assignee || '')}" placeholder="ชื่อเซลส์/แอดมิน"></label>
      <label>วันนัดติดตามถัดไป<input class="inp" type="date" id="lnFu" value="${E(l.next_followup || '')}"></label>
      <label style="grid-column:1/-1">เพิ่มบันทึกการคุย / ติดตามลูกค้า<textarea class="inp" id="lnTxt" rows="2" placeholder="เช่น โทรคุยแล้ว ลูกค้าขอใบเสนอราคารุ่น Business Pro ภายในวันศุกร์…"></textarea></label>
    </div>
    <div style="display:flex;justify-content:flex-end;gap:8px;margin-bottom:14px">
      <button class="btn primary sm" onclick="saveLeadNote(${l.id})">+ บันทึกโน้ตติดตาม</button>
    </div>
    <b style="display:block;margin-bottom:8px">ประวัติโน้ต (${notes.length})</b>
    ${notes.length ? notes.map(n => `<div class="note-item">
      <div style="display:flex;justify-content:space-between;font-size:12px"><b>${E(n.author_name)}</b><span class="dim">${E(n.created_at)}</span></div>
      <div style="margin-top:3px">${E(n.note)}</div>
    </div>`).join('') : '<div class="dim">ยังไม่มีโน้ตติดตามสำหรับลูกค้ารายนี้</div>'}`);
}

async function saveLeadNote(leadId) {
  const note = document.getElementById('lnTxt').value.trim();
  const assignee = document.getElementById('lnAsg').value.trim();
  const next_followup = document.getElementById('lnFu').value;
  if (!note) { toast('พิมพ์ข้อความโน้ตก่อนบันทึกครับ'); return; }
  const r = await api('/api/leads/' + leadId + '/notes', {
    method: 'POST', headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ note, assignee, next_followup }),
  });
  if (r.ok) { toast('บันทึกโน้ตติดตามแล้ว ✓'); openLeadNotes(leadId); renderTab(); } else toast(r.error || 'บันทึกไม่สำเร็จ');
}

function openAddLeadModal() {
  const posts = window._leadPosts || [];
  openModal(`
    <div class="card-hd"><b>บันทึกลูกค้าทักเข้ามาใหม่</b><button class="btn sm ghost" onclick="closeModal()">ปิด</button></div>
    <div class="fgrid">
      <label>ชื่อลูกค้า / บริษัท *<input class="inp" id="nlName" placeholder="เช่น คุณวิชัย (บจก. เอ็กซ์)"></label>
      <label>ช่องทางติดต่อ<input class="inp" id="nlCon" placeholder="เบอร์โทร / LINE / FB"></label>
      <label>ช่องทางที่ทักเข้ามา<select class="inp" id="nlCh"><option value="facebook">Facebook Inbox</option><option value="line">LINE OA</option><option value="tiktok">TikTok</option><option value="instagram">Instagram</option><option value="website">เว็บไซต์</option></select></label>
      <label>มูลค่าคาดการณ์ (บาท)<input class="inp" id="nlVal" type="number" value="50000"></label>
      <label>ผู้รับผิดชอบ<input class="inp" id="nlAsg" value="${E((ST.me && ST.me.user && ST.me.user.name) || '')}"></label>
      <label>วันนัดติดตาม<input class="inp" type="date" id="nlFu"></label>
      <label style="grid-column:1/-1">ทักมาจากโพสต์ต้นทาง<select class="inp" id="nlPost"><option value="">— ไม่ระบุ —</option>${posts.map(p => `<option value="${p.id}">[${PLAT_LBL[p.platform]}] ${E(p.title)}</option>`).join('')}</select></label>
      <label style="grid-column:1/-1">ข้อความที่ลูกค้าทัก<textarea class="inp" id="nlMsg" rows="2" placeholder="รายละเอียดที่ลูกค้าสอบถาม…"></textarea></label>
    </div>
    <div style="margin-top:14px;display:flex;justify-content:flex-end;gap:8px">
      <button class="btn ghost sm" onclick="closeModal()">ยกเลิก</button>
      <button class="btn primary sm" onclick="saveNewLead()">บันทึกข้อมูลลูกค้า</button>
    </div>`);
}
async function saveNewLead() {
  await api('/api/leads', {
    method: 'POST', headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      customer_name: document.getElementById('nlName').value, contact: document.getElementById('nlCon').value,
      channel: document.getElementById('nlCh').value, deal_value: Number(document.getElementById('nlVal').value) || 0,
      assignee: document.getElementById('nlAsg').value, next_followup: document.getElementById('nlFu').value,
      post_id: document.getElementById('nlPost').value, message: document.getElementById('nlMsg').value,
    }),
  });
  closeModal(); toast('บันทึกยอดลูกค้าทักแล้ว ✓'); refreshBadges(); renderTab();
}

/* =========================== 3. COMMENTS HUB PRO (QUICK REPLIES + J/K/R/L) =========================== */
async function viewComments(host) {
  const qs = ST.cmtIntent ? ('?intent=' + ST.cmtIntent) : '';
  const [d, qrRes] = await Promise.all([api('/api/comments' + qs), api('/api/quick-replies')]);
  const rows = d.comments || [], qrs = (qrRes && qrRes.replies) || [];
  window._cmtRows = rows;
  window._quickReplies = qrs;
  if (ST.cmtFocusIdx >= rows.length) ST.cmtFocusIdx = 0;
  const intLbl = { buying: ['สนใจซื้อ/ขอราคา', 'p-ok'], question: ['คำถาม', 'p-warn'], general: ['ทั่วไป', ''] };
  host.innerHTML = `
    <div class="page-hd">
      <div><h1>คอมเมนต์ลูกค้า (Facebook · YouTube · TikTok · IG)</h1>
      <div class="sub">คำตอบด่วน 1 คลิก · แปลงคอมเมนต์ซื้อเป็น Lead · คีย์ลัด: <code>J</code>/<code>K</code> เลื่อนแถว · <code>R</code> ตอบ · <code>L</code> สร้าง Lead</div></div>
      <div style="display:flex;gap:8px;flex-wrap:wrap;align-items:center">
        <button class="btn sm ghost" onclick="openQuickRepliesModal()">⚡ จัดการคำตอบด่วน (${qrs.length})</button>
        <div class="seg">
          <button class="${ST.cmtIntent === '' ? 'on' : ''}" onclick="ST.cmtIntent='';renderTab()">ทั้งหมด</button>
          <button class="${ST.cmtIntent === 'buying' ? 'on' : ''}" onclick="ST.cmtIntent='buying';renderTab()">🔥 สนใจซื้อ</button>
          <button class="${ST.cmtIntent === 'question' ? 'on' : ''}" onclick="ST.cmtIntent='question';renderTab()">❓ คำถาม</button>
        </div>
      </div>
    </div>
    <div class="card"><div style="overflow-x:auto"><table class="tb">
      <tr><th>แพลตฟอร์ม</th><th>ผู้คอมเมนต์ &amp; ข้อความ + คำตอบด่วน 1 คลิก</th><th>เจตนา</th><th>โพสต์ต้นทาง</th><th>จัดการ</th></tr>
      ${rows.map((c, idx) => {
        const it = intLbl[c.intent] || intLbl.general;
        return `<tr class="cmt-row ${idx === ST.cmtFocusIdx ? 'focused' : ''}" data-cidx="${idx}" onclick="ST.cmtFocusIdx=${idx};highlightFocusedCmt()">
          <td><span class="pill ${PLAT_CLS[c.platform] || ''}">${PLAT_LBL[c.platform] || c.platform}</span></td>
          <td style="min-width:280px"><b>${E(c.author)}</b> <span class="dim" style="font-size:11.5px">· ${E(c.created_at)}</span>
            <div style="margin-top:2px">${E(c.content)}</div>
            ${c.reply_text ? `<div class="dim" style="font-size:12px;margin-top:3px">↳ ตอบแล้ว: ${E(c.reply_text)}</div>` : (qrs.length ? `<div class="qr-row">${qrs.slice(0, 4).map(q => `<button class="qr-btn" onclick="event.stopPropagation();quickReplyCmt(${c.id},${JSON.stringify(q.text)})" title="${E(q.text)}">${E(q.label)}</button>`).join('')}</div>` : '')}
          </td>
          <td><span class="pill ${it[1]}">${it[0]}</span></td>
          <td>${c.post_id ? `<a class="link-src" onclick="openPostDetail(${c.post_id})">${E((c.post_title || 'ดูโพสต์').slice(0, 44))}</a>` : '—'}
            <div><a class="dim" style="font-size:11.5px" href="${E(c.source_url)}" target="_blank">เปิดลิงก์ต้นทาง ↗</a></div></td>
          <td style="white-space:nowrap;display:flex;gap:6px;flex-wrap:wrap">
            ${c.converted_lead_id
              ? '<span class="pill p-ok">✓ เข้า CRM แล้ว</span>'
              : `<button class="btn sm ghost" onclick="convertCommentToLead(${c.id})">➕ สร้าง Lead</button>`}
            ${c.replied ? '<span class="pill p-ok">ตอบแล้ว ✓</span>' : `<button class="btn sm primary" onclick="replyCmt(${c.id})">ตอบเอง</button>`}
          </td>
        </tr>`;
      }).join('') || '<tr><td colspan="5" class="empty">ยังไม่มีคอมเมนต์ในหมวดนี้</td></tr>'}
    </table></div></div>`;
}
function highlightFocusedCmt() {
  document.querySelectorAll('.cmt-row').forEach(tr => tr.classList.toggle('focused', Number(tr.dataset.cidx) === ST.cmtFocusIdx));
}
async function quickReplyCmt(id, text) {
  await api('/api/comments', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id, reply_text: text }) });
  toast('ตอบคอมเมนต์ด้วยคำตอบด่วนแล้ว ✓'); refreshBadges(); renderTab();
}
async function openQuickRepliesModal() {
  const r = await api('/api/quick-replies');
  const qrs = (r && r.replies) || [];
  openModal(`
    <div class="card-hd"><b>⚡ จัดการชุดคำตอบด่วน 1 คลิก</b><button class="btn sm ghost" onclick="closeModal()">ปิด</button></div>
    <div class="fgrid" style="margin-bottom:10px">
      <label>ชื่อปุ่มสั้น *<input class="inp" id="qrLbl" placeholder="เช่น 💰 ส่งโปรเดือนนี้"></label>
      <label>หมวด<input class="inp" id="qrCat" value="sales"></label>
      <label style="grid-column:1/-1">ข้อความตอบกลับ *<textarea class="inp" id="qrTxt" rows="2" placeholder="พิมพ์ข้อความสำเร็จรูป…"></textarea></label>
    </div>
    <div style="display:flex;justify-content:flex-end;margin-bottom:12px"><button class="btn sm primary" onclick="saveQuickReply()">+ เพิ่มคำตอบด่วน</button></div>
    <div style="max-height:240px;overflow:auto;display:grid;gap:7px">
      ${qrs.map(q => `<div class="note-item" style="margin:0;display:flex;justify-content:space-between;gap:10px">
        <div><b>${E(q.label)}</b><div class="dim" style="font-size:12px">${E(q.text)}</div></div>
        <button class="btn sm ghost" onclick="delQuickReply(${q.id})">ลบ</button>
      </div>`).join('')}
    </div>`);
}
async function saveQuickReply() {
  const r = await api('/api/quick-replies', {
    method: 'POST', headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ label: document.getElementById('qrLbl').value, category: document.getElementById('qrCat').value, text: document.getElementById('qrTxt').value }),
  });
  if (r.ok) { toast('เพิ่มคำตอบด่วนแล้ว ✓'); openQuickRepliesModal(); renderTab(); } else toast(r.error || 'บันทึกไม่สำเร็จ');
}
async function delQuickReply(id) {
  await api('/api/quick-replies', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ action: 'delete', id }) });
  openQuickRepliesModal(); renderTab();
}
async function replyCmt(id) {
  const txt = await uiPrompt('บันทึกการตอบคอมเมนต์', 'พิมพ์ข้อความที่ตอบลูกค้า (หรือเว้นว่างเพื่อทำเครื่องหมายว่าตอบแล้ว)', 'ส่งรายละเอียดเพิ่มเติมให้ทางแชทเรียบร้อยแล้วครับ');
  if (txt === null) return;
  await api('/api/comments', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id, reply_text: txt }) });
  toast('บันทึกการตอบคอมเมนต์แล้ว ✓'); refreshBadges(); renderTab();
}
async function convertCommentToLead(commentId) {
  const r = await api('/api/comments/convert-lead', {
    method: 'POST', headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ comment_id: commentId }),
  });
  if (r.ok) { toast(r.message || 'ส่งเข้า CRM แล้ว ✓'); refreshBadges(); renderTab(); } else toast(r.error || 'ไม่สามารถแปลงได้');
}

/* =========================== 3B. FEEDBACK INBOX & FLOATING WIDGET =========================== */
const FB_CAT_LBL = { ux: 'ดีไซน์ / UX', feature: 'ฟีเจอร์ที่อยากได้', bug: 'แจ้งบั๊ก', pricing: 'ราคา / แพ็กเกจ', general: 'ทั่วไป' };
const FB_ST_LBL = { new: 'ใหม่', reviewing: 'กำลังปรับ', done: 'ทำแล้ว ✓' };
const FB_SRC_LBL = { app: 'ในแอป', site_local: 'เว็บ /site', site_web: 'เว็บจริง', github_sync: 'เว็บจริง (GitHub)', netlify_sync: 'เว็บจริง (Netlify)' };

async function viewFeedback(host) {
  const qs = new URLSearchParams();
  if (ST.fbStatus) qs.set('status', ST.fbStatus);
  if (ST.fbCat) qs.set('category', ST.fbCat);
  const d = await api('/api/feedback?' + qs.toString());
  if (!d.ok) { host.innerHTML = `<div class="empty">${E(d.error || 'โหลดฟีดแบคไม่สำเร็จ')}</div>`; return; }
  const s = d.summary || {}, rows = d.feedbacks || [];
  if (s.latest_id) ST.lastFbId = s.latest_id;

  host.innerHTML = `
    <div class="page-hd">
      <div><h1>💌 กล่องฟีดแบค &amp; ข้อเสนอแนะ (Feedback Inbox)</h1>
      <div class="sub">รวมฟีดแบคจากเพื่อนและลูกค้าที่ส่งมาจากทั้งในแอป, หน้า /site และเว็บจริงออนไลน์ · เด้งแจ้งเตือนอัตโนมัติทุก 12 วินาที</div></div>
      <div style="display:flex;gap:8px;flex-wrap:wrap">
        <button class="btn ghost sm" onclick="syncCloudFeedback()">🔄 ดึงฟีดแบคจากเว็บจริง</button>
        <button class="btn primary sm" onclick="openFeedbackModal()">+ เขียนฟีดแบคทดสอบ</button>
      </div>
    </div>
    <div class="kpi-grid">
      <div class="kpi"><small>ฟีดแบคทั้งหมด</small><div class="val">${NF(s.total)} รายการ</div></div>
      <div class="kpi" style="--kcol:var(--bad)"><small>ฟีดแบคใหม่ (ยังไม่ได้ดู)</small><div class="val" style="color:var(--bad)">${NF(s.new)}</div></div>
      <div class="kpi" style="--kcol:var(--warn)"><small>กำลังปรับปรุง</small><div class="val">${NF(s.reviewing)}</div></div>
      <div class="kpi" style="--kcol:var(--ok)"><small>แก้ไขแล้ว (Done)</small><div class="val" style="color:var(--ok)">${NF(s.done)}</div></div>
      <div class="kpi" style="--kcol:#f59e0b"><small>คะแนนความพึงพอใจเฉลี่ย</small><div class="val">⭐ ${s.avg_rating || 0} / 5</div></div>
    </div>
    <div class="card">
      <div class="filter-bar">
        <div class="seg">
          <button class="${ST.fbStatus === '' ? 'on' : ''}" onclick="ST.fbStatus='';renderTab()">ทั้งหมด</button>
          <button class="${ST.fbStatus === 'new' ? 'on' : ''}" onclick="ST.fbStatus='new';renderTab()">🔴 ใหม่</button>
          <button class="${ST.fbStatus === 'reviewing' ? 'on' : ''}" onclick="ST.fbStatus='reviewing';renderTab()">🟡 กำลังปรับ</button>
          <button class="${ST.fbStatus === 'done' ? 'on' : ''}" onclick="ST.fbStatus='done';renderTab()">🟢 ทำแล้ว</button>
        </div>
        <select class="inp" style="flex:0 0 180px" onchange="ST.fbCat=this.value;renderTab()">
          <option value="">ทุกหมวดหมู่</option>
          ${Object.entries(FB_CAT_LBL).map(([k, v]) => `<option value="${k}" ${ST.fbCat === k ? 'selected' : ''}>${v}</option>`).join('')}
        </select>
      </div>
      <div style="overflow-x:auto"><table class="tb">
        <tr><th>ผู้ส่ง &amp; แหล่งที่มา</th><th>หมวด / คะแนน</th><th>ข้อความฟีดแบค</th><th>สถานะ &amp; โน้ตทีมพัฒนา</th><th></th></tr>
        ${rows.map(f => `<tr>
          <td style="min-width:165px">
            <b>${E(f.sender_name)}</b>
            <div style="margin-top:3px"><span class="pill ${f.source === 'app' ? 'p-fb' : 'p-ok'}">${E(FB_SRC_LBL[f.source] || f.source)}</span></div>
            <div class="dim" style="font-size:11px;margin-top:3px">${E(f.created_at)}</div>
          </td>
          <td style="white-space:nowrap">
            <span class="pill ${f.category === 'bug' ? 'p-bad' : f.category === 'feature' ? 'p-gsc' : ''}">${E(FB_CAT_LBL[f.category] || f.category)}</span>
            <div style="color:#d97706;font-size:13px;margin-top:4px">${'★'.repeat(f.rating || 5)}<span style="color:var(--bd)">${'★'.repeat(5 - (f.rating || 5))}</span></div>
          </td>
          <td style="min-width:260px">
            <div style="white-space:pre-wrap">${E(f.message)}</div>
            ${f.page_ref ? `<div class="dim" style="font-size:11.5px;margin-top:4px">หน้า: ${f.page_ref.startsWith('http') ? `<a class="link-src" href="${E(f.page_ref)}" target="_blank">${E(f.page_ref)}</a>` : `<code>${E(f.page_ref)}</code>`}</div>` : ''}
          </td>
          <td style="min-width:210px">
            <select class="inp" style="padding:5px 8px;font-size:12px;margin-bottom:6px" onchange="updFeedback(${f.id},{status:this.value})">
              ${Object.entries(FB_ST_LBL).map(([k, v]) => `<option value="${k}" ${f.status === k ? 'selected' : ''}>${v}</option>`).join('')}
            </select>
            <input class="inp" style="padding:5px 8px;font-size:12px" placeholder="โน้ตการแก้ไข…" value="${E(f.reply_note || '')}" onchange="updFeedback(${f.id},{reply_note:this.value})">
          </td>
          <td><button class="btn sm ghost" onclick="delFeedback(${f.id})">ลบ</button></td>
        </tr>`).join('') || '<tr><td colspan="5" class="empty">ยังไม่มีฟีดแบค — ส่งลิงก์เว็บหรือลองกดปุ่ม <b>💌 ฟีดแบค</b> มุมขวาล่างเพื่อทดสอบได้เลย!</td></tr>'}
      </table></div>
    </div>`;
}

function openFeedbackModal() {
  window._fbRating = 5;
  openModal(`
    <div class="card-hd"><b>💌 ส่งฟีดแบค / แจ้งจุดปรับปรุง</b><button class="btn sm ghost" onclick="closeModal()">ปิด</button></div>
    <p class="dim" style="margin-top:0;font-size:13px">ฟีดแบคจะเด้งเข้ากล่อง <b>💌 ฟีดแบค &amp; ข้อเสนอแนะ</b> ในแอป PulseMetrics ทันที (หน้าปัจจุบัน: <code>${E(ST.tab)}</code>)</p>
    <div class="fgrid">
      <label>ชื่อของคุณ (ไม่บังคับ)<input class="inp" id="fbName" value="${E((ST.me && ST.me.user && ST.me.user.name) || '')}" placeholder="เช่น บีม / แป้ง / เพื่อน"></label>
      <label>หมวดหมู่<select class="inp" id="fbCat">
        <option value="ux">🎨 ดีไซน์ / ความใช้งานง่าย (UX)</option>
        <option value="feature">✨ ฟีเจอร์ที่อยากให้เพิ่ม</option>
        <option value="bug">🐞 แจ้งบั๊ก / จุดผิดพลาด</option>
        <option value="pricing">💰 ราคา / แพ็กเกจลิขสิทธิ์</option>
        <option value="general">💬 ข้อเสนอแนะทั่วไป</option>
      </select></label>
      <label style="grid-column:1/-1">ให้คะแนนความชอบ (1–5 ดาว)
        <div class="stars-row" id="fbStars">${[1, 2, 3, 4, 5].map(n => `<button type="button" class="star-btn on" data-v="${n}" onclick="pickFbStar(${n})">★</button>`).join('')}</div>
      </label>
      <label style="grid-column:1/-1">รายละเอียดฟีดแบค *<textarea class="inp" id="fbMsg" rows="3" placeholder="ชอบตรงไหน อยากให้ปรับตรงไหน หรืออยากได้ฟีเจอร์อะไรเพิ่ม พิมพ์บอกได้เลยครับ…"></textarea></label>
    </div>
    <div style="margin-top:14px;display:flex;justify-content:flex-end;gap:8px">
      <button class="btn ghost sm" onclick="closeModal()">ยกเลิก</button>
      <button class="btn primary sm" onclick="submitAppFeedback()">ส่งฟีดแบคเข้าแอป</button>
    </div>`);
}
function pickFbStar(n) {
  window._fbRating = n;
  document.querySelectorAll('#fbStars .star-btn').forEach(b => b.classList.toggle('on', Number(b.dataset.v) <= n));
}
async function submitAppFeedback() {
  const msg = document.getElementById('fbMsg').value.trim();
  if (!msg) { toast('พิมพ์ข้อความฟีดแบคก่อนส่งครับ'); return; }
  const r = await api('/api/feedback', {
    method: 'POST', headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      workspace_id: (ST.me && ST.me.user && ST.me.user.workspace_id) || 1,
      source: 'app',
      sender_name: document.getElementById('fbName').value.trim() || 'ผู้ทดสอบแอป',
      category: document.getElementById('fbCat').value,
      rating: window._fbRating || 5,
      page_ref: 'app:' + ST.tab,
      message: msg,
    }),
  });
  if (r.ok) { closeModal(); toast(r.message || 'ส่งฟีดแบคแล้ว ✓'); refreshBadges(); if (ST.tab === 'feedback') renderTab(); }
  else toast(r.error || 'ส่งไม่สำเร็จ');
}
async function updFeedback(id, patch) {
  await api('/api/feedback', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ action: 'update', id, ...patch }) });
  toast('อัปเดตสถานะฟีดแบคแล้ว ✓'); refreshBadges(); renderTab();
}
async function delFeedback(id) {
  if (!(await uiConfirm('ลบรายการฟีดแบค?', 'ต้องการลบรายการฟีดแบคนี้ออกจากกล่องใช่หรือไม่?', true))) return;
  await api('/api/feedback', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ action: 'delete', id }) });
  refreshBadges(); renderTab();
}
async function syncCloudFeedback() {
  toast('กำลังดึงฟีดแบคจากเว็บจริง…');
  const r = await api('/api/feedback/sync', { method: 'POST' });
  toast(r.message || 'ซิงก์เรียบร้อย');
  refreshBadges(); renderTab();
}

/* =========================== 4. WEBSITE (GA4 + SEARCH CONSOLE + TRACKER) =========================== */
async function viewWebsite(host) {
  const d = await api('/api/website?' + qRange());
  if (!d.ok) { host.innerHTML = `<div class="empty">${E(d.error || 'ไม่มีสิทธิ์เข้าถึง')}</div>`; return; }
  const c = d.current, dl = d.deltas;
  const snippet = `<script src="${location.origin}/tracker.js" data-workspace="${ST.me.user.workspace_id}"></script>`;
  host.innerHTML = `
    <div class="page-hd">
      <div><h1>สถิติ &amp; เว็บไซต์ (GA4 + Google Search Console + Live Tracker)</h1>
      <div class="sub">ดูยอดคนเข้าเว็บ · หน้าไหนเจอบ่อยสุด · เสิร์ชคำไหนเจอเว็บเราบ่อย · ลูกค้าเข้าช่องทางไหนเยอะสุด</div></div>
      <a class="btn sm primary" href="/site" target="_blank">🚀 เปิดเว็บทางการทดสอบยิงข้อมูลจริง ↗</a>
    </div>
    <div class="kpi-grid">
      <div class="kpi" style="--kcol:var(--ga)"><small>ผู้เข้าชมเว็บ (Users)</small><div class="val">${NF(c.visitors)}</div>${deltaHtml(dl.visitors)}</div>
      <div class="kpi" style="--kcol:var(--ac)"><small>ยอดเปิดดูหน้า (Pageviews)</small><div class="val">${NF(c.pageviews)}</div>${deltaHtml(dl.pageviews)}</div>
      <div class="kpi" style="--kcol:var(--gsc)"><small>เสิร์ชเจอบน Google (Impressions)</small><div class="val">${NF(c.gsc_impressions)}</div>${deltaHtml(dl.gsc_impressions)}</div>
      <div class="kpi" style="--kcol:var(--ok)"><small>คลิกจาก Google / CTR</small><div class="val">${NF(c.gsc_clicks)}</div><span class="dim" style="font-size:12px">CTR ${c.gsc_ctr}% · อันดับเฉลี่ย #${c.gsc_position}</span></div>
    </div>

    <div class="card">
      <div class="card-hd"><b>📄 หน้าเว็บไซต์ที่ลูกค้าเปิดดูและเสิร์ชเจอบ่อยที่สุด</b><span class="dim" style="font-size:12px">รวม GA4 + Search Console + ยอดคลิกปุ่มทัก</span></div>
      <div style="overflow-x:auto"><table class="tb">
        <tr><th>หน้าเว็บ (Path)</th><th class="r">Pageviews</th><th class="r">Users</th><th class="r">Bounce %</th><th class="r">เสิร์ชเจอ (GSC)</th><th class="r">คลิก Google (CTR)</th><th class="r">อันดับเฉลี่ย</th><th class="r">คลิกปุ่มทัก</th></tr>
        ${(d.pages || []).map(p => `<tr>
          <td><b>${E(p.path)}</b><div class="dim" style="font-size:11.5px">${E(p.title)}</div></td>
          <td class="r"><b>${NF(p.pageviews)}</b></td><td class="r">${NF(p.users)}</td>
          <td class="r"><span class="${p.bounce_rate >= 52 ? 'pill p-warn' : ''}">${p.bounce_rate}%</span></td>
          <td class="r">${NF(p.gsc_impressions)}</td>
          <td class="r">${NF(p.gsc_clicks)} <span class="dim">(${p.gsc_ctr}%)</span></td>
          <td class="r">#${p.gsc_position}</td>
          <td class="r"><b style="color:var(--ok)">${NF(p.cta_clicks)}</b></td>
        </tr>`).join('') || '<tr><td colspan="8" class="empty">ยังไม่มีข้อมูลหน้าเว็บ</td></tr>'}
      </table></div>
    </div>

    <div class="grid2eq">
      <div class="card">
        <div class="card-hd"><b>🔎 คำค้นหาบน Google ที่เจอเว็บเราบ่อยสุด (Search Console)</b></div>
        <div style="overflow-x:auto"><table class="tb">
          <tr><th>คีย์เวิร์ด</th><th class="r">เจอบ่อย</th><th class="r">คลิก (CTR)</th><th class="r">อันดับ</th></tr>
          ${(d.keywords || []).map(k => `<tr><td><b>${E(k.keyword)}</b><div class="dim" style="font-size:11px">${E(k.landing_page)}</div></td><td class="r">${NF(k.impressions)}</td><td class="r">${NF(k.clicks)} (${k.ctr}%)</td><td class="r">#${k.avg_position}</td></tr>`).join('') || '<tr><td colspan="4" class="empty">ยังไม่มีคีย์เวิร์ด GSC</td></tr>'}
        </table></div>
      </div>
      <div class="card">
        <div class="card-hd"><b>📡 สคริปต์ติดตั้งบนเว็บไซต์จริง (1 บรรทัด) &amp; เหตุการณ์สดล่าสุด</b>
          <button class="btn sm ghost" onclick="navigator.clipboard.writeText(${JSON.stringify(snippet)});toast('คัดลอกสคริปต์แล้ว ✓')">คัดลอกโค้ด</button>
        </div>
        <div class="code-box">${E(snippet)}</div>
        <div class="dim" style="font-size:12px;margin:8px 0 6px">วางใน <code>&lt;head&gt;</code> ของเว็บจริง (WordPress / Webflow / HTML) เพื่อวัดยอดเข้าเว็บและปุ่มทักแชทตามโพสต์ทันที · เหตุการณ์สดล่าสุด (${(d.recent_events || []).length}):</div>
        <div style="max-height:210px;overflow:auto;font-size:12px">${(d.recent_events || []).length
          ? d.recent_events.map(ev => `<div style="padding:5px 0;border-top:1px solid var(--bd)"><b>${E(ev.event_type)}</b> · ${E(ev.path)} ${ev.tracking_code ? `<span class="pill p-ok">${E(ev.tracking_code)}</span>` : ''} <span class="dim">${E(ev.created_at)}</span></div>`).join('')
          : '<div class="dim">ยังไม่มีเหตุการณ์สด — ลองเปิด <a href="/site" target="_blank">/site</a> แล้วคลิกดูหน้าเว็บหรือกดปุ่มทักแชทได้เลย!</div>'}</div>
      </div>
    </div>`;
}

/* =========================== 5. POST & LEAD ATTRIBUTION =========================== */
async function viewPosts(host) {
  const d = await api('/api/posts');
  const rows = d.posts || [];
  host.innerHTML = `
    <div class="page-hd">
      <div><h1>วิเคราะห์โพสต์ &amp; ยอดลูกค้าทักรายโพสต์</h1>
      <div class="sub">ดูชัดทุกโพสต์ Facebook / คลิป YouTube / หน้าเว็บว่า "โพสต์นั้นเข้ามาแล้วทักกี่คน" พร้อมคลิกเปิดโพสต์ต้นทางและคอมเมนต์ได้ทันที</div></div>
      ${hasPerm('calendar') ? '<button class="btn primary sm" onclick="openAddPostModal()">+ เพิ่มโพสต์ &amp; สร้างลิงก์ติดตาม</button>' : ''}
    </div>
    <div class="card"><div style="overflow-x:auto"><table class="tb">
      <tr><th>ช่องทาง</th><th>ชื่อโพสต์ / คลิป (คลิกดูคนทัก &amp; คอมเมนต์)</th><th class="r">Reach / Views</th><th class="r">คอมเมนต์</th><th class="r">คลิกเข้าเว็บ</th><th class="r">เข้ามาแล้วทัก</th><th class="r">อัตราเข้า→ทัก</th><th class="r">ยอดปิด (บาท)</th><th>ลิงก์</th></tr>
      ${rows.map(p => `<tr>
        <td><span class="pill ${PLAT_CLS[p.platform] || ''}">${PLAT_LBL[p.platform] || p.platform}</span></td>
        <td><a class="link-src" onclick="openPostDetail(${p.id})">${E(p.title)}</a><div class="dim" style="font-size:11.5px">${E(p.published_at)} · ${E(p.category)} · <code>/go/${E(p.tracking_code)}</code></div></td>
        <td class="r">${NF(p.views)}</td>
        <td class="r"><a class="link-src" onclick="openPostDetail(${p.id})">${NF(p.comments_count)}</a></td>
        <td class="r">${NF(p.web_clicks)}</td>
        <td class="r"><b style="color:var(--ok);font-size:14.5px">${NF(p.effective_leads)} คน</b></td>
        <td class="r">${p.lead_rate_pct}%</td>
        <td class="r"><b>฿${NF(p.revenue_thb)}</b></td>
        <td style="white-space:nowrap"><a class="btn sm ghost" href="${E(p.source_url)}" target="_blank">ต้นทาง ↗</a> <a class="btn sm ghost" href="/go/${E(p.tracking_code)}" target="_blank">ลองคลิก</a></td>
      </tr>`).join('') || '<tr><td colspan="9" class="empty">ยังไม่มีข้อมูลโพสต์</td></tr>'}
    </table></div></div>`;
}
function openAddPostModal() {
  openModal(`
    <div class="card-hd"><b>เพิ่มโพสต์ / คลิป พร้อมสร้างลิงก์ติดตามยอดทักอัตโนมัติ</b><button class="btn sm ghost" onclick="closeModal()">ปิด</button></div>
    <div class="fgrid">
      <label>แพลตฟอร์ม<select class="inp" id="npPlat"><option value="facebook">Facebook Page</option><option value="youtube">YouTube</option><option value="tiktok">TikTok</option><option value="instagram">Instagram</option><option value="website">Website Page</option></select></label>
      <label>หมวดหมู่คอนเทนต์<input class="inp" id="npCat" placeholder="เช่น โปรโมชัน, เคสลูกค้า, ความรู้" value="แคมเปญ"></label>
      <label style="grid-column:1/-1">ชื่อโพสต์ / ชื่อคลิป *<input class="inp" id="npTitle" placeholder="เช่น โปรโมชันวางระบบ MKT Dashboard เดือนนี้"></label>
      <label>ลิงก์โพสต์ต้นทาง (URL)<input class="inp" id="npUrl" placeholder="https://facebook.com/... หรือ https://youtube.com/..."></label>
      <label>รหัสติดตามสั้น (ไม่ใส่ = สุ่มให้อัตโนมัติ)<input class="inp" id="npCode" placeholder="เช่น fb-nov-01"></label>
    </div>
    <div style="margin-top:14px;display:flex;justify-content:flex-end;gap:8px">
      <button class="btn ghost sm" onclick="closeModal()">ยกเลิก</button>
      <button class="btn primary sm" onclick="saveNewPost()">บันทึก &amp; สร้างลิงก์ /go/</button>
    </div>`);
}
async function saveNewPost() {
  const r = await api('/api/posts', {
    method: 'POST', headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      platform: document.getElementById('npPlat').value, category: document.getElementById('npCat').value,
      title: document.getElementById('npTitle').value, source_url: document.getElementById('npUrl').value,
      tracking_code: document.getElementById('npCode').value,
    }),
  });
  if (r.ok) { closeModal(); toast('สร้างโพสต์และลิงก์ติดตาม ' + r.tracking_url + ' แล้ว ✓'); renderTab(); } else toast(r.error || 'บันทึกไม่สำเร็จ');
}

/* =========================== 5B. AD SPEND & ROAS / CPL ANALYTICS =========================== */
async function viewRoi(host) {
  const d = await api('/api/roi?' + qRange());
  if (!d.ok) { host.innerHTML = `<div class="empty">${E(d.error || 'โหลดข้อมูล ROAS ไม่สำเร็จ')}</div>`; return; }
  const s = d.summary || {}, plats = d.platforms || [], camps = d.campaigns || [];
  const maxSp = Math.max(1, ...plats.map(x => x.spend_thb));
  host.innerHTML = `
    <div class="page-hd">
      <div><h1>💰 งบโฆษณา &amp; ความคุ้มค่า (Ad Spend · CPL · CAC · ROAS)</h1>
      <div class="sub">วัดชัดทุกบาทที่ยิงแอด: ค่าทักต่อคน (CPL) · ต้นทุนปิดดีล (CAC) · ความคุ้มค่า ROAS (x เท่า) แยกตามแพลตฟอร์ม</div></div>
      <button class="btn primary sm" onclick="openAddCampaignModal()">+ บันทึกงบแอด / แคมเปญ</button>
    </div>
    <div class="kpi-grid">
      <div class="kpi" style="--kcol:var(--warn)"><small>งบโฆษณารวม (Ad Spend)</small><div class="val">฿${NF(s.spend_thb)}</div><span class="dim" style="font-size:12px">${NF(s.clicks)} คลิก · ${NF(s.leads_cnt)} ทัก</span></div>
      <div class="kpi" style="--kcol:var(--ok)"><small>ความคุ้มค่าแอด (ROAS)</small><div class="val" style="color:var(--ok)">${s.roas}x</div><span class="dim" style="font-size:12px">ROI ${s.roi_pct >= 0 ? '+' : ''}${s.roi_pct}%</span></div>
      <div class="kpi" style="--kcol:var(--ac)"><small>ต้นทุนต่อลูกค้าทัก (CPL)</small><div class="val">฿${NF(s.cpl)}</div><span class="dim" style="font-size:12px">ต่อ 1 ลูกค้าทัก</span></div>
      <div class="kpi" style="--kcol:#7c3aed"><small>ต้นทุนปิด 1 ดีล (CAC)</small><div class="val">฿${NF(s.cac)}</div><span class="dim" style="font-size:12px">จาก ${NF(s.won_deals)} ดีลที่ปิดได้</span></div>
      <div class="kpi" style="--kcol:#0ea5e9"><small>ยอดขายจากแคมเปญ</small><div class="val">฿${NF(s.revenue_thb)}</div></div>
    </div>
    <div class="card">
      <div class="card-hd"><b>📊 เปรียบเทียบงบแอด vs ROAS แยกแพลตฟอร์ม</b></div>
      <div class="bar-list">
        ${plats.map(p => `<div class="bar-row" style="grid-template-columns:130px 1fr 220px">
          <span class="pill ${PLAT_CLS[p.platform] || ''}">${PLAT_LBL[p.platform] || p.platform}</span>
          <div class="bar-trk"><i style="width:${Math.max(5, 100 * p.spend_thb / maxSp)}%"></i></div>
          <div class="r"><b>฿${NF(p.spend_thb)}</b> · <span style="color:var(--ok);font-weight:700">${p.roas}x ROAS</span> <span class="dim">(CPL ฿${NF(p.cpl)})</span></div>
        </div>`).join('') || '<div class="empty">ยังไม่มีข้อมูลแคมเปญโฆษณา</div>'}
      </div>
    </div>
    <div class="card">
      <div class="card-hd"><b>📋 รายการแคมเปญโฆษณา (${camps.length} แคมเปญ)</b></div>
      <div style="overflow-x:auto"><table class="tb">
        <tr><th>วันที่</th><th>ช่องทาง</th><th>ชื่อแคมเปญ</th><th class="r">งบแอด (฿)</th><th class="r">คลิก (CTR)</th><th class="r">ทัก (คน)</th><th class="r">CPL (฿)</th><th class="r">ยอดปิด (฿)</th><th class="r">ROAS</th><th></th></tr>
        ${camps.map(cp => `<tr>
          <td style="white-space:nowrap">${E(cp.dt)}</td>
          <td><span class="pill ${PLAT_CLS[cp.platform] || ''}">${PLAT_LBL[cp.platform] || cp.platform}</span></td>
          <td><b>${E(cp.campaign_name)}</b><div class="dim" style="font-size:11.5px">${cp.tracking_code ? '<code>' + E(cp.tracking_code) + '</code> · ' : ''}${E(cp.notes || '')}</div></td>
          <td class="r"><b>฿${NF(cp.spend_thb)}</b></td>
          <td class="r">${NF(cp.clicks)} <span class="dim">(${cp.ctr}%)</span></td>
          <td class="r"><b>${NF(cp.leads_cnt)}</b></td>
          <td class="r">฿${NF(cp.cpl)}</td>
          <td class="r"><b>฿${NF(cp.revenue_thb)}</b></td>
          <td class="r"><span class="pill ${cp.roas >= 3 ? 'p-ok' : cp.roas >= 1 ? 'p-warn' : 'p-bad'}">${cp.roas}x</span></td>
          <td><button class="btn sm ghost" onclick="delCampaign(${cp.id})">ลบ</button></td>
        </tr>`).join('') || '<tr><td colspan="10" class="empty">ยังไม่มีรายการงบแอด — กด "+ บันทึกงบแอด / แคมเปญ" ด้านบนได้เลย</td></tr>'}
      </table></div>
    </div>`;
}
function openAddCampaignModal() {
  const td = new Date().toISOString().slice(0, 10);
  openModal(`
    <div class="card-hd"><b>บันทึกงบโฆษณา &amp; แคมเปญ (คำนวณ CPL / ROAS อัตโนมัติ)</b><button class="btn sm ghost" onclick="closeModal()">ปิด</button></div>
    <div class="fgrid">
      <label>วันที่<input class="inp" type="date" id="adDt" value="${td}"></label>
      <label>แพลตฟอร์ม<select class="inp" id="adPl">
        <option value="facebook">Facebook Ads</option><option value="google">Google Ads</option>
        <option value="tiktok">TikTok Ads</option><option value="instagram">Instagram Ads</option>
        <option value="youtube">YouTube Ads</option><option value="line">LINE Ads</option>
      </select></label>
      <label style="grid-column:1/-1">ชื่อแคมเปญ *<input class="inp" id="adNm" placeholder="เช่น FB Lead Gen — โปรลิขสิทธิ์ขายขาด"></label>
      <label>งบโฆษณา (บาท) *<input class="inp" type="number" id="adSp" value="15000"></label>
      <label>ยอดทักจากแคมเปญ (คน)<input class="inp" type="number" id="adLd" value="20"></label>
      <label>ยอดขายที่ปิดได้ (บาท)<input class="inp" type="number" id="adRv" value="150000"></label>
      <label>Impressions<input class="inp" type="number" id="adIm" value="50000"></label>
      <label>Clicks<input class="inp" type="number" id="adCk" value="950"></label>
      <label>รหัสโพสต์ (UTM Code)<input class="inp" id="adTc" placeholder="เช่น fb-q4-promo"></label>
      <label style="grid-column:1/-1">หมายเหตุ<input class="inp" id="adNt" placeholder="บันทึกข้อสังเกตของแคมเปญนี้…"></label>
    </div>
    <div style="margin-top:14px;display:flex;justify-content:flex-end;gap:8px">
      <button class="btn ghost sm" onclick="closeModal()">ยกเลิก</button>
      <button class="btn primary sm" onclick="saveCampaign()">บันทึกแคมเปญ</button>
    </div>`);
}
async function saveCampaign() {
  const r = await api('/api/roi', {
    method: 'POST', headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      dt: document.getElementById('adDt').value, platform: document.getElementById('adPl').value,
      campaign_name: document.getElementById('adNm').value, spend_thb: Number(document.getElementById('adSp').value) || 0,
      leads_cnt: Number(document.getElementById('adLd').value) || 0, revenue_thb: Number(document.getElementById('adRv').value) || 0,
      impressions: Number(document.getElementById('adIm').value) || 0, clicks: Number(document.getElementById('adCk').value) || 0,
      tracking_code: document.getElementById('adTc').value, notes: document.getElementById('adNt').value,
    }),
  });
  if (r.ok) { closeModal(); toast('บันทึกแคมเปญและคำนวณ ROAS แล้ว ✓'); renderTab(); } else toast(r.error || 'บันทึกไม่สำเร็จ');
}
async function delCampaign(id) {
  if (!(await uiConfirm('ลบแคมเปญโฆษณา?', 'ต้องการลบรายการงบโฆษณานี้ใช่หรือไม่?', true))) return;
  await api('/api/roi', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ action: 'delete', id }) });
  renderTab();
}

/* =========================== 5C. COMPETITORS & OUTLIER RADAR (0 TOKENS) =========================== */
async function viewCompetitors(host) {
  const d = await api('/api/competitors');
  if (!d.ok) { host.innerHTML = `<div class="empty">${E(d.error || 'โหลดข้อมูลคู่แข่งไม่สำเร็จ')}</div>`; return; }
  const rows = d.competitors || [];
  const outliers = rows.filter(x => x.is_outlier);
  host.innerHTML = `
    <div class="page-hd">
      <div><h1>🏆 ส่องคู่แข่ง &amp; Outlier Radar (0 โทเคน)</h1>
      <div class="sub">เก็บโพสต์/คลิปคู่แข่งในอุตสาหกรรมเดียวกัน · เรดาร์จับคอนเทนต์ที่ยอดพุ่งผิดปกติ (≥2.2x) เพื่อถอดสูตรมาวางแคมเปญ</div></div>
      <button class="btn primary sm" onclick="openAddCompModal()">+ เก็บโพสต์คู่แข่ง</button>
    </div>
    <div class="kpi-grid">
      <div class="kpi"><small>คอนเทนต์คู่แข่งที่ติดตาม</small><div class="val">${NF(rows.length)} รายการ</div></div>
      <div class="kpi" style="--kcol:var(--bad)"><small>🔥 Outlier ยอดพุ่ง ≥2.2x</small><div class="val" style="color:var(--bad)">${NF(outliers.length)} ชิ้น</div><span class="dim" style="font-size:12px">น่านำมาถอดสูตรทำคอนเทนต์</span></div>
      <div class="kpi" style="--kcol:var(--ok)"><small>สถิติยอดพุ่งสูงสุด</small><div class="val">${rows.length ? rows[0].outlier_x + 'x' : '—'}</div><span class="dim" style="font-size:12px">${rows.length ? E(rows[0].brand_name) : ''}</span></div>
    </div>
    <div class="card"><div style="overflow-x:auto"><table class="tb">
      <tr><th>คู่แข่ง &amp; แพลตฟอร์ม</th><th>หัวข้อคอนเทนต์ &amp; จุดเด่นที่ถอดสูตร</th><th class="r">ยอดชม</th><th class="r">ค่าเฉลี่ยช่อง</th><th class="r">พุ่งกี่เท่า</th><th>ต่อยอด</th></tr>
      ${rows.map(c => `<tr>
        <td><b>${E(c.brand_name)}</b><div style="margin-top:3px"><span class="pill ${PLAT_CLS[c.platform] || ''}">${PLAT_LBL[c.platform] || c.platform}</span></div></td>
        <td style="min-width:260px"><b>${E(c.title)}</b><div class="dim" style="font-size:12px;margin-top:2px">${E(c.notes || '')}</div></td>
        <td class="r"><b>${NF(c.views)}</b></td>
        <td class="r dim">${NF(c.baseline_views)}</td>
        <td class="r"><span class="pill ${c.is_outlier ? 'p-bad' : 'p-ok'}">${c.is_outlier ? '🔥 ' : ''}${c.outlier_x}x</span></td>
        <td style="white-space:nowrap;display:flex;gap:5px;flex-wrap:wrap">
          <button class="btn sm ghost" onclick="compToIdea(${JSON.stringify(c.title)},'${E(c.platform)}',${JSON.stringify('ถอดสูตรจาก ' + c.brand_name + ' (' + c.outlier_x + 'x): ' + (c.notes || ''))})">💡 จดไอเดีย</button>
          ${c.source_url ? `<a class="btn sm ghost" href="${E(c.source_url)}" target="_blank">ดูต้นทาง ↗</a>` : ''}
          <button class="btn sm ghost" onclick="delComp(${c.id})">ลบ</button>
        </td>
      </tr>`).join('') || '<tr><td colspan="6" class="empty">ยังไม่มีรายการคู่แข่ง</td></tr>'}
    </table></div></div>`;
}
function openAddCompModal() {
  openModal(`
    <div class="card-hd"><b>เพิ่มโพสต์ / คลิปคู่แข่งเข้า Outlier Radar</b><button class="btn sm ghost" onclick="closeModal()">ปิด</button></div>
    <div class="fgrid">
      <label>ชื่อแบรนด์ / เพจคู่แข่ง *<input class="inp" id="cpBr" placeholder="เช่น AgencyAlpha TH"></label>
      <label>แพลตฟอร์ม<select class="inp" id="cpPl"><option value="facebook">Facebook</option><option value="youtube">YouTube</option><option value="tiktok">TikTok</option><option value="instagram">Instagram</option><option value="website">Website</option></select></label>
      <label style="grid-column:1/-1">หัวข้อโพสต์ / คลิป *<input class="inp" id="cpTi" placeholder="พาดหัวหรือประเด็นหลักของคู่แข่ง"></label>
      <label>ยอดรับชม (Views)<input class="inp" type="number" id="cpVw" value="35000"></label>
      <label>ค่าเฉลี่ยปกติของช่องเขา<input class="inp" type="number" id="cpBs" value="10000"></label>
      <label style="grid-column:1/-1">ลิงก์ต้นทาง<input class="inp" id="cpUr" placeholder="https://..."></label>
      <label style="grid-column:1/-1">จุดเด่นที่ถอดสูตรได้<input class="inp" id="cpNt" placeholder="เช่น Hook 3 วิแรก, รูปปก, CTA ท้ายโพสต์"></label>
    </div>
    <div style="margin-top:14px;display:flex;justify-content:flex-end;gap:8px">
      <button class="btn ghost sm" onclick="closeModal()">ยกเลิก</button>
      <button class="btn primary sm" onclick="saveComp()">บันทึกเข้าเรดาร์</button>
    </div>`);
}
async function saveComp() {
  const r = await api('/api/competitors', {
    method: 'POST', headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      brand_name: document.getElementById('cpBr').value, platform: document.getElementById('cpPl').value,
      title: document.getElementById('cpTi').value, views: Number(document.getElementById('cpVw').value) || 0,
      baseline_views: Number(document.getElementById('cpBs').value) || 5000,
      source_url: document.getElementById('cpUr').value, notes: document.getElementById('cpNt').value,
    }),
  });
  if (r.ok) { closeModal(); toast('เพิ่มข้อมูลคู่แข่งเข้าเรดาร์แล้ว ✓'); renderTab(); } else toast(r.error || 'บันทึกไม่สำเร็จ');
}
async function compToIdea(title, platform, notes) {
  await api('/api/ideas', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ title: '[ต่อยอด] ' + title, platform, tags: 'Outlier คู่แข่ง', notes }) });
  toast('ส่งเข้าสมุดจดไอเดีย (Alt+N) เรียบร้อย ✓');
}
async function delComp(id) {
  if (!(await uiConfirm('ลบรายการคู่แข่ง?', 'ต้องการลบรายการนี้ออกจากเรดาร์คู่แข่งใช่หรือไม่?', true))) return;
  await api('/api/competitors', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ action: 'delete', id }) });
  renderTab();
}

/* =========================== 6. MARKETING & STRATEGY =========================== */
async function viewStrategy(host) {
  const d = await api('/api/dashboard?' + qRange());
  if (!d.ok) { host.innerHTML = `<div class="empty">${E(d.error || 'โหลดไม่สำเร็จ')}</div>`; return; }
  const c = d.current;
  const totReach = c.gsc_impressions + c.fb_views + c.yt_views;
  const fSteps = [
    ['1. คนเห็น / เสิร์ชเจอ (Reach)', totReach, '#2563eb', '100%'],
    ['2. เข้าเว็บไซต์ (GA4 Users)', c.visitors, '#0ea5e9', (100 * c.visitors / Math.max(1, totReach)).toFixed(1) + '%'],
    ['3. ลูกค้าทักเข้ามา (Leads)', c.total_leads, '#16a34a', (100 * c.total_leads / Math.max(1, c.visitors)).toFixed(2) + '% ของคนเข้าเว็บ'],
    ['4. ปิดการขายสำเร็จ (Won)', c.won_deals, '#7c3aed', (100 * c.won_deals / Math.max(1, c.total_leads)).toFixed(1) + '% ของคนทัก'],
  ];
  host.innerHTML = `
    <div class="page-hd">
      <div><h1>การตลาด &amp; กลยุทธ์ (Marketing Funnel &amp; Platform Advisor)</h1>
      <div class="sub">วิเคราะห์เส้นทางลูกค้าตั้งแต่เห็นโพสต์จนปิดการขาย + คำแนะนำต่อยอดเฉพาะแต่ละแพลตฟอร์ม</div></div>
    </div>
    <div class="card">
      <div class="card-hd"><b>🔻 Marketing-to-Sales Funnel (${E(d.range.start)} – ${E(d.range.end)})</b></div>
      <div class="funnel">${fSteps.map(([lbl, val, col, rate], i) => `
        <div class="fn-step">
          <b>${lbl}</b>
          <div class="fn-bar"><i style="width:${Math.max(12, 100 - i * 24)}%;background:${col}">${NF(val)}</i></div>
          <span class="dim" style="font-size:12px">${rate}</span>
        </div>`).join('')}
      </div>
    </div>
    <div class="card">
      <div class="card-hd"><b>💡 แผนคำแนะนำเพื่อต่อยอดรายแพลตฟอร์ม (Action Plan)</b></div>
      <div class="adv-grid">${(d.advisor || []).map(a => `
        <div class="adv-card ${E(a.priority)}">
          <div style="display:flex;justify-content:space-between;align-items:center"><span class="pill ${PLAT_CLS[a.platform] || ''}">${E(a.label)}</span><span class="dim" style="font-size:11.5px;font-weight:700">${E(a.metric)}</span></div>
          <b>${E(a.title)}</b><div class="dim" style="font-size:13px">${E(a.action)}</div>
        </div>`).join('')}
      </div>
    </div>`;
}

/* =========================== 7. COMPANY GOALS (KPI / OKR) =========================== */
async function viewGoals(host) {
  const d = await api('/api/goals');
  const goals = d.goals || [];
  host.innerHTML = `
    <div class="page-hd">
      <div><h1>เป้าหมายบริษัท (Company KPI &amp; OKR Pacing)</h1>
      <div class="sub">ติดตามเป้ารายเดือน/รายไตรมาสขององค์กร — เป้าคนเข้าเว็บ · เป้าลูกค้าทัก · เป้าอัตราปิดการขาย · เป้ายอดขาย (บาท)</div></div>
      <button class="btn primary sm" onclick="openGoalModal()">+ ตั้งเป้าหมายรอบใหม่</button>
    </div>
    ${goals.map(g => `<div class="card">
      <div class="card-hd">
        <div><b>🎯 รอบเป้าหมาย: ${E(g.period_label)} (${g.period_type === 'quarter' ? 'รายไตรมาส' : 'รายเดือน'})</b>
        <div class="dim" style="font-size:12px">ช่วง ${E(g.start_date)} – ${E(g.end_date)} · ผ่านมาแล้ว ${g.elapsed_days}/${g.total_days} วัน</div></div>
        <span class="pill ${g.on_track ? 'p-ok' : 'p-warn'}">${g.on_track ? '✓ มีแนวโน้มถึงเป้าตามแผน' : '⚡ ต้องเร่งยอดเพิ่มเพื่อให้ทันเป้า'}</span>
      </div>
      <div class="goal-grid">
        <div class="goal-box"><small class="dim">เป้าผู้เข้าชมเว็บไซต์</small><div style="font-size:20px;font-weight:800">${NF(g.actual.visitors)} / ${NF(g.target_visitors)}</div><div class="g-prog"><i style="width:${g.pct.visitors}%"></i></div><div class="dim" style="font-size:12px">${g.pct.visitors}% · คาดสิ้นรอบ ~${NF(g.forecast.visitors)}</div></div>
        <div class="goal-box"><small class="dim">เป้าลูกค้าทักเข้ามา (Leads)</small><div style="font-size:20px;font-weight:800;color:var(--ok)">${NF(g.actual.leads)} / ${NF(g.target_leads)} คน</div><div class="g-prog"><i style="width:${g.pct.leads}%;background:var(--ok)"></i></div><div class="dim" style="font-size:12px">${g.pct.leads}% · คาดสิ้นรอบ ~${NF(g.forecast.leads)} คน</div></div>
        <div class="goal-box"><small class="dim">เป้าอัตราปิดการขาย (Conversion)</small><div style="font-size:20px;font-weight:800">${g.actual.conv_pct}% / ${g.target_conv_pct}%</div><div class="g-prog"><i style="width:${g.pct.conv_pct}%;background:#7c3aed"></i></div><div class="dim" style="font-size:12px">คำนวณจากยอดปิดจริงใน CRM</div></div>
        <div class="goal-box"><small class="dim">เป้ายอดขายองค์กร (Revenue)</small><div style="font-size:20px;font-weight:800">฿${NF(g.actual.revenue)} / ฿${NF(g.target_revenue)}</div><div class="g-prog"><i style="width:${g.pct.revenue}%;background:var(--warn)"></i></div><div class="dim" style="font-size:12px">${g.pct.revenue}% · คาดสิ้นรอบ ~฿${NF(g.forecast.revenue)}</div></div>
      </div>
    </div>`).join('') || '<div class="empty">ยังไม่ได้ตั้งเป้าหมายบริษัท</div>'}`;
}
function openGoalModal() {
  const now = new Date(), y = now.getFullYear(), m = String(now.getMonth() + 1).padStart(2, '0');
  openModal(`
    <div class="card-hd"><b>ตั้งเป้าหมายบริษัท (Company KPI)</b><button class="btn sm ghost" onclick="closeModal()">ปิด</button></div>
    <div class="fgrid">
      <label>ชื่อรอบเป้าหมาย *<input class="inp" id="gLbl" value="${y}-${m}"></label>
      <label>ประเภท<select class="inp" id="gTyp"><option value="month">รายเดือน</option><option value="quarter">รายไตรมาส</option></select></label>
      <label>วันเริ่มต้น<input class="inp" type="date" id="gSt" value="${y}-${m}-01"></label>
      <label>วันสิ้นสุด<input class="inp" type="date" id="gEn" value="${y}-${m}-30"></label>
      <label>เป้าคนเข้าเว็บ (Users)<input class="inp" type="number" id="gVis" value="25000"></label>
      <label>เป้าลูกค้าทัก (Leads)<input class="inp" type="number" id="gLd" value="180"></label>
      <label>เป้าปิดการขาย (%)<input class="inp" type="number" step="0.5" id="gCv" value="22"></label>
      <label>เป้ายอดขาย (บาท)<input class="inp" type="number" step="10000" id="gRev" value="800000"></label>
    </div>
    <div style="margin-top:14px;display:flex;justify-content:flex-end;gap:8px">
      <button class="btn ghost sm" onclick="closeModal()">ยกเลิก</button>
      <button class="btn primary sm" onclick="saveGoal()">บันทึกเป้าหมายบริษัท</button>
    </div>`);
}
async function saveGoal() {
  await api('/api/goals', {
    method: 'POST', headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      period_label: document.getElementById('gLbl').value, period_type: document.getElementById('gTyp').value,
      start_date: document.getElementById('gSt').value, end_date: document.getElementById('gEn').value,
      target_visitors: Number(document.getElementById('gVis').value), target_leads: Number(document.getElementById('gLd').value),
      target_conv_pct: Number(document.getElementById('gCv').value), target_revenue: Number(document.getElementById('gRev').value),
    }),
  });
  closeModal(); toast('บันทึกเป้าหมายบริษัทแล้ว ✓'); renderTab();
}

/* =========================== 8. CONTENT CALENDAR + PACKAGING LAB + EVERGREEN =========================== */
async function viewCalendar(host) {
  const [d, evRes] = await Promise.all([api('/api/calendar'), api('/api/evergreen')]);
  const items = d.items || [], evergreens = (evRes && evRes.posts) || [];
  const stMap = { planned: 'วางแผน', in_progress: 'กำลังผลิต', published: 'เผยแพร่แล้ว ✓' };
  host.innerHTML = `
    <div class="page-hd">
      <div><h1>ปฏิทินคอนเทนต์, Packaging Lab &amp; Evergreen Repost</h1>
      <div class="sub">วางแผนโพสต์ + สร้างลิงก์ /go/ อัตโนมัติ · เลื่อนวันลง 1 คลิก · เช็กคะแนนชื่อไทย &amp; Safe-Zone 4 แพลตฟอร์ม</div></div>
      <div style="display:flex;gap:8px;flex-wrap:wrap">
        <button class="btn ghost sm" onclick="openPackagingLab()">✨ Packaging Lab (ชื่อ·แคปชัน·Safe-Zone)</button>
        <button class="btn primary sm" onclick="openCalModal()">+ เพิ่มแผนคอนเทนต์</button>
      </div>
    </div>
    <div class="card"><div style="overflow-x:auto"><table class="tb">
      <tr><th>วัน-เวลา (เปลี่ยนวันได้)</th><th>ช่องทาง</th><th>คอนเทนต์ / แคมเปญ</th><th>ลิงก์ติดตาม (Auto UTM)</th><th>สถานะ</th><th>จัดการ</th></tr>
      ${items.map(it => `<tr>
        <td style="white-space:nowrap">
          <input class="inp" type="date" style="width:135px;padding:4px 7px;font-size:12px" value="${E(it.plan_date)}" onchange="moveCalDate(${it.id}, this.value)">
          <button class="btn sm ghost" style="padding:3px 7px;font-size:11px" onclick="shiftCalPlus1(${it.id},'${E(it.plan_date)}')" title="เลื่อนวันลง +1 วัน">+1 วัน</button>
        </td>
        <td><span class="pill ${PLAT_CLS[it.platform] || ''}">${PLAT_LBL[it.platform] || it.platform}</span></td>
        <td><b>${E(it.title)}</b><div class="dim" style="font-size:11.5px">${E(it.campaign || 'ทั่วไป')} · ${E(it.notes || '')}</div></td>
        <td style="white-space:nowrap"><code>/go/${E(it.tracking_code)}</code> <a class="btn sm ghost" href="/go/${E(it.tracking_code)}" target="_blank">ลองคลิก ↗</a></td>
        <td><select class="inp" style="padding:4px 8px;font-size:12px;width:125px" onchange="updCal(${it.id},this.value)">
          ${Object.entries(stMap).map(([k, v]) => `<option value="${k}" ${it.status === k ? 'selected' : ''}>${v}</option>`).join('')}
        </select></td>
        <td style="white-space:nowrap;display:flex;gap:5px">
          <button class="btn sm ghost" onclick="openPackagingLab(${JSON.stringify(it.title)},'${E(it.platform)}')">✨ เช็กปก/ชื่อ</button>
          <button class="btn sm ghost" onclick="delCal(${it.id})">ลบ</button>
        </td>
      </tr>`).join('') || '<tr><td colspan="6" class="empty">ยังไม่มีแผนคอนเทนต์</td></tr>'}
    </table></div></div>

    <div class="card">
      <div class="card-hd">
        <div><b>♻️ คลังโพสต์ปังรีโพสต์ (Evergreen Repost Queue · 0 โทเคน)</b>
        <div class="dim" style="font-size:12px">คัดโพสต์/คลิปที่เคยทำยอดทักหรือยอดวิวสูง เพื่อนำมารีโพสต์หรือแตกเป็นคลิปสั้นข้ามแพลตฟอร์ม</div></div>
      </div>
      <div style="overflow-x:auto"><table class="tb">
        <tr><th>ช่องทางเดิม</th><th>ชื่อโพสต์ที่เคยปัง</th><th class="r">ยอดชม</th><th class="r">ยอดทัก</th><th>คำแนะนำ</th><th>รีโพสต์</th></tr>
        ${evergreens.slice(0, 6).map(p => `<tr>
          <td><span class="pill ${PLAT_CLS[p.platform] || ''}">${PLAT_LBL[p.platform] || p.platform}</span></td>
          <td><b>${E(p.title)}</b><div class="dim" style="font-size:11.5px">ลงเมื่อ ${E(p.published_at)} (ผ่านมา ${p.age_days} วัน)</div></td>
          <td class="r">${NF(p.views)}</td>
          <td class="r"><b style="color:var(--ok)">${NF(p.leads_count)} คน</b></td>
          <td><span class="pill p-gsc">${E(p.repost_tip)}</span></td>
          <td><button class="btn sm ghost" onclick="repostEvergreen(${JSON.stringify(p.title)},'${E(p.platform)}')">+ ส่งเข้าปฏิทิน</button></td>
        </tr>`).join('') || '<tr><td colspan="6" class="empty">ยังไม่มีโพสต์ในคลัง Evergreen</td></tr>'}
      </table></div>
    </div>`;
}
async function moveCalDate(id, newDate) {
  await api('/api/calendar', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ action: 'move', id, plan_date: newDate }) });
  toast('ย้ายวันลงเป็น ' + newDate + ' แล้ว ✓'); renderTab();
}
function shiftCalPlus1(id, curDate) {
  const dt = new Date(curDate + 'T00:00:00');
  dt.setDate(dt.getDate() + 1);
  moveCalDate(id, dt.toISOString().slice(0, 10));
}
async function repostEvergreen(title, platform) {
  const dt = new Date(); dt.setDate(dt.getDate() + 3);
  const r = await api('/api/calendar', {
    method: 'POST', headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ plan_date: dt.toISOString().slice(0, 10), plan_time: '11:00', platform, campaign: 'Evergreen Repost', title: '[รีโพสต์] ' + title, target_url: '/site' }),
  });
  if (r.ok) { toast('เพิ่มเข้าคิวรีโพสต์วันที่ ' + dt.toISOString().slice(0, 10) + ' แล้ว ✓'); renderTab(); }
}

function gradeThaiTitle(t) {
  const s = String(t || '').trim();
  if (!s) return { score: 0, tips: ['พิมพ์ชื่อโพสต์/คลิปเพื่อเริ่มให้คะแนน'] };
  let sc = 35;
  const tips = [];
  if (s.length >= 25 && s.length <= 78) sc += 20; else tips.push('ความยาวเหมาะสุดอยู่ที่ 25–78 ตัวอักษร (ตอนนี้ ' + s.length + ' ตัว)');
  if (/[0-9๐-๙]/.test(s)) sc += 15; else tips.push('ใส่ตัวเลข (เช่น 3 วิธี, +210%, ใน 1 นาที) จะเพิ่มอัตราคลิกได้ชัดเจน');
  const pwr = ['ฟรี', 'จริง', 'สูตร', 'ลับ', 'พลาด', 'คุ้ม', 'ด่วน', 'ง่าย', 'จบ', 'ขายขาด', 'เพิ่ม', 'วิธี', 'เทียบ', 'เคส', 'รีวิว', 'เช็กลิสต์', 'วัดชัด'];
  const hit = pwr.filter(w => s.includes(w));
  if (hit.length >= 2) sc += 20; else if (hit.length === 1) sc += 12; else tips.push('เพิ่มคำกระตุ้นความสนใจ เช่น วิธี, เคสจริง, เทียบชัด, เช็กลิสต์, เพิ่มยอด');
  if (/[?!！？—:]/.test(s)) sc += 10; else tips.push('ใส่เครื่องหมายเน้นจังหวะ เช่น : — ! หรือ ? เพื่อให้อ่านสแกนง่าย');
  return { score: Math.min(100, sc), tips: tips.length ? tips : ['โครงสร้างชื่อแข็งแรงมาก พร้อมลงโพสต์ได้เลย ✓'] };
}

function openPackagingLab(initTitle = '', initPlat = 'facebook') {
  openModal(`
    <div class="card-hd"><b>✨ Packaging Lab — เช็กชื่อไทย (0–100) · แปลงแคปชัน 4 แพลตฟอร์ม · Safe-Zone</b><button class="btn sm ghost" onclick="closeModal()">ปิด</button></div>
    <div class="grid2eq">
      <div>
        <label style="font-size:12.5px;font-weight:700;display:block;margin-bottom:8px">หัวข้อโพสต์ / ชื่อคลิป (Live Grader 0–100)
          <input class="inp" id="pkTitle" value="${E(initTitle)}" placeholder="เช่น 5 ข้อผิดพลาดที่ทำให้ยิงแอดแล้วลูกค้าไม่ทักแชท!" oninput="updatePackagingLab()">
        </label>
        <div id="pkScoreBox" style="padding:10px 12px;border-radius:11px;background:var(--surf2);border:1px solid var(--bd);margin-bottom:10px"></div>
        <label style="font-size:12.5px;font-weight:700;display:block;margin-bottom:8px">ข้อความหลัก / แคปชันตั้งต้น (แปลงอัตโนมัติ 4 ช่อง)
          <textarea class="inp" id="pkCap" rows="3" placeholder="สรุปจุดขายหลัก + ลิงก์ /go/…" oninput="updatePackagingLab()">รวมข้อมูล GA4 + Search Console + FB + YT และวัดยอดลูกค้าทักรายโพสต์ในจอเดียว ลิขสิทธิ์ขายขาดไม่มีรายเดือน</textarea>
        </label>
        <div id="pkAdapters" style="display:grid;gap:7px"></div>
      </div>
      <div>
        <div style="text-align:center;margin-bottom:8px;font-weight:700;font-size:13px">📱 พรีวิว Safe-Zone มือถือ (โซนแดง = ถูกปุ่มแพลตฟอร์มบัง)</div>
        <div class="safe-phone">
          <div class="safe-top">โซนบน (แถบสถานะ / ค้นหา)</div>
          <div class="safe-center" id="pkSafeTxt">ข้อความพาดหัวควรอยู่ในกรอบสีเขียวนี้</div>
          <div class="safe-right">ปุ่มไลก์<br>แชร์<br>เมนต์</div>
          <div class="safe-bot"><b id="pkSafePl">@brand</b><div id="pkSafeSub" style="font-size:10.5px;opacity:.88;overflow:hidden;white-space:nowrap;text-overflow:ellipsis">แคปชันตัวอย่างด้านล่าง…</div></div>
        </div>
      </div>
    </div>`);
  updatePackagingLab();
}
function updatePackagingLab() {
  const ti = (document.getElementById('pkTitle') || {}).value || '';
  const cap = (document.getElementById('pkCap') || {}).value || '';
  const g = gradeThaiTitle(ti);
  const col = g.score >= 80 ? 'var(--ok)' : g.score >= 60 ? 'var(--warn)' : 'var(--bad)';
  const sb = document.getElementById('pkScoreBox');
  if (sb) sb.innerHTML = `<div style="display:flex;align-items:center;justify-content:space-between"><b>คะแนนความน่าคลิก</b><b style="font-size:20px;color:${col}">${g.score} / 100</b></div><div class="dim" style="font-size:12px;margin-top:4px">${g.tips.map(x => '• ' + E(x)).join('<br>')}</div>`;
  const st = document.getElementById('pkSafeTxt'); if (st) st.textContent = ti || 'ข้อความพาดหัวควรอยู่ในกรอบสีเขียวนี้';
  const ss = document.getElementById('pkSafeSub'); if (ss) ss.textContent = cap || 'แคปชันตัวอย่างด้านล่าง…';

  const adapted = [
    ['Facebook', `🎯 ${ti}\n\n${cap}\n\n👉 ทักแชทขอรายละเอียดหรือใบเสนอราคาได้เลยครับ\n#การตลาดออนไลน์ #B2BMarketing #PulseMetrics`],
    ['TikTok', `${ti} 🔥 ${cap.slice(0, 90)}… #การตลาด #เจ้าของธุรกิจ #ยิงแอด #fyp`],
    ['Instagram', `✨ ${ti}\n.\n${cap}\n.\n💬 พิมพ์ "สนใจ" ใต้โพสต์หรือ DM ได้เลยครับ\n#MarketingTH #BusinessOwner #CRM`],
    ['YouTube', `${ti}\n\n📌 สรุปเนื้อหา: ${cap}\n🔗 ขอใบเสนอราคา / นัดเดโม: (วางลิงก์ /go/ ของคุณที่นี่)`],
  ];
  const adBox = document.getElementById('pkAdapters');
  if (adBox) adBox.innerHTML = adapted.map(([pl, txt]) => `<div style="padding:7px 9px;border:1px solid var(--bd);border-radius:9px;background:var(--surf2);font-size:12px">
    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:3px"><b>${pl}</b><button class="btn sm ghost" style="padding:2px 8px;font-size:11px" onclick="navigator.clipboard.writeText(${JSON.stringify(txt)});toast('คัดลอกแคปชัน ${pl} แล้ว ✓')">คัดลอก</button></div>
    <div class="dim" style="white-space:pre-line;max-height:54px;overflow:hidden">${E(txt)}</div>
  </div>`).join('');
}
function openCalModal() {
  const td = new Date().toISOString().slice(0, 10);
  openModal(`
    <div class="card-hd"><b>เพิ่มแผนคอนเทนต์ในปฏิทิน (สร้างลิงก์ติดตามอัตโนมัติ)</b><button class="btn sm ghost" onclick="closeModal()">ปิด</button></div>
    <div class="fgrid">
      <label>วันที่<input class="inp" type="date" id="cDt" value="${td}"></label>
      <label>เวลา<input class="inp" type="time" id="cTm" value="10:30"></label>
      <label>ช่องทาง<select class="inp" id="cPl"><option value="facebook">Facebook Page</option><option value="youtube">YouTube</option><option value="tiktok">TikTok</option><option value="instagram">Instagram</option><option value="website">บทความเว็บไซต์</option></select></label>
      <label>ชื่อแคมเปญ<input class="inp" id="cCp" placeholder="เช่น Q4 Lead Gen"></label>
      <label style="grid-column:1/-1">หัวข้อโพสต์ / คลิป *<input class="inp" id="cTi" placeholder="เช่น รีวิวแดชบอร์ดวัดยอดทักสำหรับทีม MKT x Sales"></label>
      <label>รหัสติดตาม (เว้นว่าง = สุ่มอัตโนมัติ)<input class="inp" id="cCd" placeholder="เช่น fb-q4-new"></label>
      <label>หน้าปลายทาง<input class="inp" id="cUr" value="/site"></label>
    </div>
    <div style="margin-top:14px;display:flex;justify-content:flex-end;gap:8px">
      <button class="btn ghost sm" onclick="closeModal()">ยกเลิก</button>
      <button class="btn primary sm" onclick="saveCal()">บันทึกเข้าปฏิทิน</button>
    </div>`);
}
async function saveCal() {
  const r = await api('/api/calendar', {
    method: 'POST', headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      plan_date: document.getElementById('cDt').value, plan_time: document.getElementById('cTm').value,
      platform: document.getElementById('cPl').value, campaign: document.getElementById('cCp').value,
      title: document.getElementById('cTi').value, tracking_code: document.getElementById('cCd').value,
      target_url: document.getElementById('cUr').value,
    }),
  });
  if (r.ok) { closeModal(); toast('เพิ่มแผนลงปฏิทินและสร้างลิงก์ ' + r.tracking_url + ' แล้ว ✓'); renderTab(); } else toast(r.error || 'บันทึกไม่สำเร็จ');
}
async function updCal(id, status) {
  await api('/api/calendar', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ action: 'status', id, status }) });
  toast('อัปเดตสถานะแล้ว ✓');
}
async function delCal(id) {
  if (!(await uiConfirm('ลบแผนคอนเทนต์?', 'ต้องการลบแผนคอนเทนต์นี้ออกจากปฏิทินใช่หรือไม่?', true))) return;
  await api('/api/calendar', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ action: 'delete', id }) });
  renderTab();
}

/* =========================== 9. SETTINGS, LIVE APIs, USERS, WHITE-LABEL & NAS =========================== */
async function viewSettings(host) {
  const d = await api('/api/workspace');
  if (!d.ok) { host.innerHTML = `<div class="empty">${E(d.error || 'ไม่มีสิทธิ์เข้าถึงหน้าตั้งค่า')}</div>`; return; }
  const isExec = hasPerm('nas_admin');
  if (!isExec && ST.setTab !== 'api') ST.setTab = 'api';

  const tabs = [['api', '🔌 แพลตฟอร์ม & API จริง']];
  if (isExec) {
    tabs.push(['alerts', '🔔 แจ้งเตือนมือถือ'], ['users', '👥 ผู้ใช้ & สิทธิ์ (RBAC)'], ['brand', '🎨 White-Label & ลิขสิทธิ์'], ['nas', '🖥️ ดูแล NAS & Backup']);
  }

  let bodyHtml = '';
  if (ST.setTab === 'api') bodyHtml = renderSettingsApi(d);
  else if (ST.setTab === 'alerts') bodyHtml = await renderSettingsAlerts();
  else if (ST.setTab === 'users') bodyHtml = await renderSettingsUsers();
  else if (ST.setTab === 'brand') bodyHtml = await renderSettingsBrand();
  else if (ST.setTab === 'nas') bodyHtml = await renderSettingsNas(d.workspace);

  host.innerHTML = `
    <div class="page-hd">
      <div><h1>ตั้งค่าระบบ, API จริง, RBAC &amp; NAS</h1>
      <div class="sub">เชื่อมต่อ Official APIs · จัดการทีมงาน · ปรับแบรนด์ White-Label · สำรองข้อมูล NAS ครบในที่เดียว</div></div>
      ${isExec ? '<button class="btn primary sm" onclick="openNewWsModal()">+ เพิ่มบริษัท / Workspace ใหม่</button>' : ''}
    </div>
    <div class="sub-tabs">${tabs.map(([k, l]) => `<button class="${ST.setTab === k ? 'on' : ''}" onclick="ST.setTab='${k}';renderTab()">${l}</button>`).join('')}</div>
    ${bodyHtml}`;
}

function renderSettingsApi(d) {
  const w = d.workspace || {}, logs = d.sync_logs || [], cs = w.api_config_status || {};
  const badge = k => cs[k] && cs[k].configured ? `<span class="pill p-ok">✓ ตั้งค่าแล้ว (${E(cs[k].preview)})</span>` : `<span class="pill p-warn">ยังไม่ใส่คีย์</span>`;
  const lineHook = `${location.origin}/api/webhook/line/${w.id}`;
  const fbHook = `${location.origin}/api/webhook/facebook/${w.id}`;

  return `
    <div class="card">
      <div class="card-hd">
        <b>🔌 ตั้งค่าการเชื่อมต่อของ Workspace: ${E(w.name)}</b>
        <div style="display:flex;gap:8px;flex-wrap:wrap">
          <button class="btn primary sm" onclick="syncAllPlatforms()">🔄 ซิงก์ทุกแพลตฟอร์มทันที</button>
          <button class="btn ghost sm" onclick="syncSheets()">📊 ส่งออก Google Sheets</button>
        </div>
      </div>
      <div class="fgrid">
        <label>ชื่อบริษัท / Workspace<input class="inp" id="wsName" value="${E(w.name)}"></label>
        <label>เว็บไซต์หลัก<input class="inp" id="wsWeb" value="${E(w.website_url)}"></label>
        <label>GA4 Property ID<input class="inp" id="wsGa4" value="${E(w.ga4_property_id)}" placeholder="properties/123456789"></label>
        <label>Google Search Console Site URL<input class="inp" id="wsGsc" value="${E(w.gsc_site_url)}" placeholder="https://example.com/"></label>
        <label>Facebook Page ID<input class="inp" id="wsFb" value="${E(w.fb_page_id)}"></label>
        <label>YouTube Channel ID<input class="inp" id="wsYt" value="${E(w.yt_channel_id)}"></label>
        <label>LINE OA ID<input class="inp" id="wsLn" value="${E(w.line_oa_id)}"></label>
        <label>Google Sheet ID (ปลายทาง KPI)<input class="inp" id="wsGs" value="${E(w.gsheet_id)}" placeholder="1HNYz7S_..."></label>
        <label>ความถี่ซิงก์อัตโนมัติ (Scheduler)<select class="inp" id="wsFreq">
          <option value="manual" ${w.gsheet_sync_freq === 'manual' ? 'selected' : ''}>กดเอง (Manual)</option>
          <option value="hourly" ${w.gsheet_sync_freq === 'hourly' ? 'selected' : ''}>อัตโนมัติทุกชั่วโมง</option>
          <option value="daily" ${w.gsheet_sync_freq === 'daily' ? 'selected' : ''}>อัตโนมัติทุกวัน 08:00</option>
        </select></label>
        <label>โหมดข้อมูล<select class="inp" id="wsDemo">
          <option value="1" ${w.demo_mode ? 'selected' : ''}>Demo Mode (ข้อมูลตัวอย่างพรีเซนต์ลูกค้า)</option>
          <option value="0" ${!w.demo_mode ? 'selected' : ''}>Live API Mode (ดึงข้อมูลจริงของบริษัท)</option>
        </select></label>
      </div>

      <h3 style="margin:18px 0 8px;font-size:14.5px">🔑 API Credentials (เว้นว่างไว้หากต้องการใช้คีย์เดิมที่บันทึกไว้)</h3>
      <div class="fgrid">
        <label style="grid-column:1/-1">Google Service Account JSON (ใช้ร่วมกันทั้ง GA4 + Search Console + Google Sheets) ${badge('google_service_account_json')}
          <textarea class="inp" id="credGoogle" rows="2" placeholder='วางเนื้อหาไฟล์ service-account.json {"type":"service_account",...}'></textarea>
        </label>
        <label>Meta Page Access Token (Facebook) ${badge('fb_page_token')}
          <input class="inp" id="credFb" type="password" placeholder="EAA... (เว้นว่าง = ใช้คีย์เดิม)">
        </label>
        <label>YouTube Data API v3 Key ${badge('yt_api_key')}
          <input class="inp" id="credYt" type="password" placeholder="AIza... (เว้นว่าง = ใช้คีย์เดิม)">
        </label>
        <label>LINE Channel Secret (ตรวจ HMAC Webhook) ${badge('line_channel_secret')}
          <input class="inp" id="credLineSec" type="password" placeholder="Channel Secret จาก LINE Developers">
        </label>
        <label>Meta Webhook Verify Token ${badge('fb_verify_token')}
          <input class="inp" id="credFbVer" placeholder="ค่าเริ่มต้น: pulsemetrics_verify">
        </label>
      </div>
      <div style="margin-top:12px;display:flex;gap:8px;flex-wrap:wrap">
        <button class="btn primary sm" onclick="saveWs()">💾 บันทึกการตั้งค่า &amp; คีย์ API</button>
      </div>

      <div class="conn-grid">
        ${[['ga4', 'Google Analytics 4'], ['gsc', 'Google Search Console'], ['facebook', 'Facebook Graph API'], ['youtube', 'YouTube Data v3']].map(([p, lbl]) => `
          <div class="conn-box">
            <b>${lbl}</b>
            <div style="display:flex;gap:6px">
              <button class="btn sm ghost" onclick="testConn('${p}')">ทดสอบคีย์</button>
              <button class="btn sm primary" onclick="syncOne('${p}')">ซิงก์เดี๋ยวนี้</button>
            </div>
          </div>`).join('')}
      </div>
    </div>

    <div class="grid2eq">
      <div class="card">
        <div class="card-hd"><b>🔗 Real-Time Lead Webhooks (รับแชทเข้า CRM อัตโนมัติ)</b><button class="btn sm ghost" onclick="testConn('line')">เช็กสถานะ LINE</button></div>
        <div style="font-size:12.5px;margin-bottom:6px"><b>LINE OA Messaging Webhook URL:</b></div>
        <div class="code-box" style="margin-bottom:10px">${E(lineHook)}</div>
        <div style="font-size:12.5px;margin-bottom:6px"><b>Facebook Messenger Webhook URL:</b></div>
        <div class="code-box">${E(fbHook)}</div>
        <div class="dim" style="font-size:12px;margin-top:8px">เมื่อลูกค้าทัก LINE หรือ FB พร้อมรหัสโพสต์ (เช่น <code>#fb-q4-promo</code> หรือลิงก์ <code>/go/</code>) ระบบจะสร้าง Lead และบวกยอดทักเข้าโพสต์นั้นทันที</div>
      </div>
      <div class="card">
        <div class="card-hd"><b>📜 ประวัติการซิงก์ &amp; ส่งออกล่าสุด</b></div>
        <div style="max-height:240px;overflow:auto">
          ${logs.length ? logs.map(l => `<div style="padding:6px 0;border-top:1px solid var(--bd);font-size:12.5px"><span class="pill ${l.status === 'ok' ? 'p-ok' : 'p-bad'}">${E(l.target)}</span> ${E(l.summary)} <span class="dim">(${E(l.created_at)})</span></div>`).join('') : '<div class="dim">ยังไม่มีประวัติการซิงก์</div>'}
        </div>
      </div>
    </div>`;
}

async function renderSettingsUsers() {
  const [uRes, sRes] = await Promise.all([api('/api/users'), api('/api/admin/settings')]);
  const users = uRes.users || [], st = sRes.settings || {};
  const reqLogin = st.require_login === '1';
  return `
    <div class="card">
      <div class="card-hd">
        <div><b>🔒 โหมดความปลอดภัยองค์กร (Production Login Gate)</b>
        <div class="dim" style="font-size:12px">เปิดเมื่อติดตั้งใช้งานจริงบน NAS เพื่อให้ทุกคนต้องกรอกอีเมล/รหัสผ่านก่อนเข้าแดชบอร์ด</div></div>
        <button class="btn sm ${reqLogin ? 'primary' : 'ghost'}" onclick="toggleRequireLogin(${reqLogin ? '0' : '1'})">${reqLogin ? '✓ บังคับล็อกอินเปิดอยู่ (คลิกเพื่อปิด)' : '🔓 เปิดบังคับล็อกอินก่อนใช้งาน'}</button>
      </div>
    </div>
    <div class="card">
      <div class="card-hd"><b>👥 จัดการบัญชีผู้ใช้และสิทธิ์ RBAC (${users.length} บัญชี)</b><button class="btn primary sm" onclick="openAddUserModal()">+ เพิ่มผู้ใช้ใหม่</button></div>
      <div style="overflow-x:auto"><table class="tb">
        <tr><th>ชื่อผู้ใช้</th><th>อีเมล</th><th>บทบาท (Role)</th><th>สร้างเมื่อ</th><th>จัดการ</th></tr>
        ${users.map(u => `<tr>
          <td><b>${E(u.name)}</b></td>
          <td>${E(u.email)}</td>
          <td><select class="inp" style="padding:4px 8px;font-size:12px;width:190px" onchange="updateUserRole(${u.id}, this.value)">
            ${Object.entries(ROLE_LBL).map(([k, v]) => `<option value="${k}" ${u.role === k ? 'selected' : ''}>${v}</option>`).join('')}
          </select></td>
          <td class="dim" style="font-size:12px">${E(u.created_at || '')}</td>
          <td style="white-space:nowrap">
            <button class="btn sm ghost" onclick="resetUserPw(${u.id}, '${E(u.name)}')">ตั้งรหัสใหม่</button>
            <button class="btn sm danger" onclick="deleteUser(${u.id}, '${E(u.name)}')">ลบ</button>
          </td>
        </tr>`).join('')}
      </table></div>
    </div>`;
}

async function renderSettingsAlerts() {
  const sRes = await api('/api/admin/settings');
  const st = sRes.settings || {};
  return `
    <div class="card">
      <div class="card-hd">
        <div><b>🔔 ระบบแจ้งเตือนมือถืออัตโนมัติ (Discord / Telegram / LINE Push · 0 โทเคน)</b>
        <div class="dim" style="font-size:12px">เด้งแจ้งเตือนทันทีเมื่อมีลูกค้าทักใหม่ มีฟีดแบคเข้า และส่งสรุปผลงานประจำสัปดาห์ทุกเช้าวันจันทร์ 08:30</div></div>
        <div style="display:flex;gap:8px;flex-wrap:wrap">
          <button class="btn sm ghost" onclick="testMobileAlerts()">🧪 ทดสอบแจ้งเตือน</button>
          <button class="btn sm primary" onclick="sendWeeklyDigestNow()">📊 ส่งสรุปผู้บริหารตอนนี้</button>
        </div>
      </div>
      <div class="fgrid">
        <label style="grid-column:1/-1">Discord Webhook URL<input class="inp" id="alDisc" value="${E(st.alert_discord_webhook || '')}" placeholder="https://discord.com/api/webhooks/..."></label>
        <label>Telegram Bot Token<input class="inp" id="alTgTok" type="password" value="${E(st.alert_telegram_bot_token || '')}" placeholder="123456:ABC..."></label>
        <label>Telegram Chat ID<input class="inp" id="alTgChat" value="${E(st.alert_telegram_chat_id || '')}" placeholder="-100xxxxxxxxxx"></label>
        <label>LINE Channel Access Token (Push)<input class="inp" id="alLnTok" type="password" value="${E(st.alert_line_token || '')}" placeholder="Channel Access Token (Long-lived)"></label>
        <label>LINE User / Group ID ปลายทาง<input class="inp" id="alLnTo" value="${E(st.alert_line_target_id || '')}" placeholder="U... หรือ C..."></label>
      </div>
      <div style="display:flex;gap:16px;flex-wrap:wrap;margin:14px 0;font-size:13px">
        <label style="display:inline-flex;align-items:center;gap:6px"><input type="checkbox" id="alOnLead" ${st.alert_on_new_lead === '1' ? 'checked' : ''}> เตือนเมื่อมีลูกค้าทักใหม่</label>
        <label style="display:inline-flex;align-items:center;gap:6px"><input type="checkbox" id="alOnFb" ${st.alert_on_feedback === '1' ? 'checked' : ''}> เตือนเมื่อมีฟีดแบคใหม่</label>
        <label style="display:inline-flex;align-items:center;gap:6px"><input type="checkbox" id="alOnWk" ${st.alert_weekly_digest === '1' ? 'checked' : ''}> ส่งสรุปผลงานทุกวันจันทร์เช้า</label>
      </div>
      <button class="btn primary sm" onclick="saveAlertSettings()">💾 บันทึกการตั้งค่าแจ้งเตือน</button>
    </div>`;
}
async function saveAlertSettings() {
  const r = await api('/api/admin/settings', {
    method: 'POST', headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      alert_discord_webhook: document.getElementById('alDisc').value.trim(),
      alert_telegram_bot_token: document.getElementById('alTgTok').value.trim(),
      alert_telegram_chat_id: document.getElementById('alTgChat').value.trim(),
      alert_line_token: document.getElementById('alLnTok').value.trim(),
      alert_line_target_id: document.getElementById('alLnTo').value.trim(),
      alert_on_new_lead: document.getElementById('alOnLead').checked ? '1' : '0',
      alert_on_feedback: document.getElementById('alOnFb').checked ? '1' : '0',
      alert_weekly_digest: document.getElementById('alOnWk').checked ? '1' : '0',
    }),
  });
  toast(r.ok ? 'บันทึกช่องทางแจ้งเตือนมือถือแล้ว ✓' : (r.error || 'บันทึกไม่สำเร็จ'));
}
async function testMobileAlerts() {
  toast('กำลังส่งข้อความทดสอบแจ้งเตือน…');
  const r = await api('/api/alerts/test', { method: 'POST' });
  toast(r.message || 'เสร็จสิ้น');
}
async function sendWeeklyDigestNow() {
  toast('กำลังส่งสรุปผู้บริหาร…');
  const r = await api('/api/alerts/digest', { method: 'POST' });
  toast(r.message || 'เสร็จสิ้น');
}

async function renderSettingsBrand() {
  const sRes = await api('/api/admin/settings');
  const st = sRes.settings || {}, lic = sRes.license || {};
  const licPill = lic.valid ? `<span class="pill p-ok">✓ ${E(lic.message)}</span>` : `<span class="pill p-warn">⚡ ${E(lic.message || 'Demo License')}</span>`;
  return `
    <div class="card">
      <div class="card-hd"><b>🎨 ปรับแต่งแบรนด์ White-Label &amp; ข้อมูลออกใบเสนอราคา PDF</b>${licPill}</div>
      <div class="fgrid">
        <label>ชื่อแบรนด์ / แพลตฟอร์ม<input class="inp" id="brName" value="${E(st.brand_name)}"></label>
        <label>อักษรย่อบนโลโก้ (1–3 ตัว)<input class="inp" id="brLogo" maxlength="3" value="${E(st.brand_logo_text)}"></label>
        <label>คำโปรยใต้แบรนด์ (Tagline)<input class="inp" id="brTag" value="${E(st.brand_tagline)}"></label>
        <label>สีหลักของระบบ (Accent Color)<input class="inp" id="brAcc" type="color" style="height:38px;padding:3px" value="${E(st.brand_accent || '#2563eb')}"></label>
        <label>LINE OA ฝ่ายขาย<input class="inp" id="brLine" value="${E(st.contact_line)}"></label>
        <label>Facebook Page<input class="inp" id="brFb" value="${E(st.contact_fb)}"></label>
        <label>อีเมลติดต่อ<input class="inp" id="brEmail" value="${E(st.contact_email)}"></label>
        <label>เบอร์โทรติดต่อ<input class="inp" id="brPhone" value="${E(st.contact_phone)}"></label>
        <label>เลขประจำตัวผู้เสียภาษี (ใบเสนอราคา)<input class="inp" id="brTax" value="${E(st.company_tax_id || '')}"></label>
        <label>ที่อยู่บริษัท (ใบเสนอราคา)<input class="inp" id="brAddr" value="${E(st.company_address || '')}"></label>
      </div>
      <h3 style="margin:18px 0 8px;font-size:14.5px">📜 ตรวจสอบ &amp; เปิดใช้งานลิขสิทธิ์ขายขาด (Signed Offline License Key)</h3>
      <div class="fgrid">
        <label>รุ่นลิขสิทธิ์<input class="inp" id="licEd" value="${E(st.license_edition)}"></label>
        <label>ชื่อผู้ถือสิทธิ์ / องค์กร<input class="inp" id="licHold" value="${E(st.license_holder)}"></label>
        <label>License Key (ออกได้ด้วย license_tool.py)<input class="inp" id="licKey" value="${E(st.license_key)}"></label>
      </div>
      <div style="margin-top:14px;display:flex;gap:8px;flex-wrap:wrap">
        <button class="btn primary sm" onclick="saveBrandSettings()">💾 บันทึกแบรนด์ &amp; ข้อมูลบริษัท</button>
        <button class="btn ghost sm" onclick="verifyLicenseKey()">🔑 ตรวจสอบ &amp; เปิดใช้งาน License Key</button>
        <a class="btn ghost sm" href="/site" target="_blank">ดูผลบนหน้าเว็บ /site ↗</a>
      </div>
    </div>`;
}

async function renderSettingsNas(ws) {
  const [h, bkRes, doc] = await Promise.all([api('/api/system/health'), api('/api/system/backups'), api('/api/system/doctor')]);
  const bks = bkRes.backups || [], sc = h.scheduler || {}, checks = (doc && doc.checks) || [];
  return `
    <div class="card">
      <div class="card-hd">
        <div><b>🩺 System Doctor — ตรวจสุขภาพระบบ 7 จุด (${doc.passed || 0}/${doc.total || 7} · คะแนน ${doc.score || 100}%)</b></div>
        <div style="display:flex;gap:8px;flex-wrap:wrap">
          <button class="btn sm ghost" onclick="runDoctorFix()">🛠️ ซ่อมและบำรุงรักษาอัตโนมัติ 1 คลิก</button>
          <button class="btn primary sm" onclick="createNasBackup()">💾 Backup ฐานข้อมูลทันที (.db)</button>
        </div>
      </div>
      <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(290px,1fr));gap:8px;margin-bottom:14px">
        ${checks.map(ch => `<div class="doc-item">
          <div><b>${ch.ok ? '✅' : '⚠️'} ${E(ch.label)}</b><div class="dim" style="font-size:11.5px">${E(ch.detail)}</div></div>
          <span class="pill ${ch.ok ? 'p-ok' : 'p-warn'}">${ch.ok ? 'ปกติ' : 'ควรดูแล'}</span>
        </div>`).join('')}
      </div>
      <div class="stat-mini">
        <div><small>เวอร์ชัน &amp; ขนาด SQLite</small><b>v${E(h.version || '3.1.0')} · ${h.db_size_kb} KB</b></div>
        <div><small>โหมดจัดเก็บ (Journal)</small><b>${E(h.journal_mode)} ${h.smb_mode ? '(SMB)' : '(Local/Docker)'}</b></div>
        <div><small>พื้นที่ว่างดิสก์</small><b>${h.disk_free_gb} / ${h.disk_total_gb} GB</b></div>
        <div><small>Auto-Sync &amp; Backup Scheduler</small><b>${sc.running ? '✓ ทำงานอยู่' : 'หยุด'} (${sc.ticks || 0} รอบ)</b></div>
        <div><small>ข้อมูลทั้งหมด</small><b>${NF((h.counts || {}).posts)} โพสต์ · ${NF((h.counts || {}).leads)} Leads</b></div>
      </div>
      <div class="dim" style="font-size:12.5px">โฟลเดอร์จัดเก็บข้อมูลปัจจุบัน: <code>${E(h.data_dir)}</code></div>
    </div>

    <div class="grid2eq">
      <div class="card">
        <div class="card-hd"><b>📦 รายการไฟล์สำรองฐานข้อมูล (${bks.length} ไฟล์)</b></div>
        <div style="max-height:260px;overflow:auto">
          ${bks.length ? `<table class="tb">
            <tr><th>ชื่อไฟล์</th><th class="r">ขนาด</th><th>วันที่</th><th>จัดการ</th></tr>
            ${bks.map(b => `<tr>
              <td><code style="font-size:11.5px">${E(b.filename)}</code></td>
              <td class="r">${b.size_kb} KB</td>
              <td class="dim" style="font-size:11.5px">${E(b.created_at)}</td>
              <td style="white-space:nowrap">
                <a class="btn sm ghost" href="/api/system/backups/${E(b.filename)}">โหลด</a>
                <button class="btn sm danger" onclick="restoreNasBackup('${E(b.filename)}')">กู้คืน</button>
              </td>
            </tr>`).join('')}
          </table>` : '<div class="dim">ยังไม่มีไฟล์สำรอง — กดปุ่ม Backup ด้านบนเพื่อสร้างจุดสำรองแรก</div>'}
        </div>
      </div>

      <div class="card">
        <div class="card-hd"><b>🚀 เริ่มใช้งานจริงกับบริษัทลูกค้า (Client Onboarding)</b></div>
        <p class="dim" style="font-size:13px;margin-top:0">เมื่อพรีเซนต์จบและพร้อมเชื่อม API จริงของบริษัท <b>${E(ws.name)}</b> สามารถกดปุ่มด้านล่างเพื่อสำรองฐานข้อมูลอัตโนมัติ ล้างข้อมูลตัวอย่าง Demo ทั้งหมดของบริษัทนี้ และสลับเป็น <b>Live API Mode</b> ทันที</p>
        <button class="btn danger sm" onclick="clearDemoData()">🧹 ล้างข้อมูล Demo ของบริษัทนี้ &amp; เริ่มใช้งานจริง</button>
        <hr style="border:0;border-top:1px solid var(--bd);margin:14px 0">
        <div class="dim" style="font-size:12.5px;line-height:1.65">
          <b>Docker NAS:</b> รัน <code>docker compose up -d --build</code> (เก็บข้อมูลที่ <code>./data</code>)<br>
          <b>SMB NAS:</b> ตั้งค่า <code>PULSEMETRICS_DATA_DIR=Z:\\PulseMetricsData</code> และ <code>PULSEMETRICS_SMB_MODE=1</code>
        </div>
      </div>
    </div>`;
}

async function saveWs() {
  const api_credentials = {};
  const g = document.getElementById('credGoogle').value.trim(); if (g) api_credentials.google_service_account_json = g;
  const f = document.getElementById('credFb').value.trim(); if (f) api_credentials.fb_page_token = f;
  const y = document.getElementById('credYt').value.trim(); if (y) api_credentials.yt_api_key = y;
  const ls = document.getElementById('credLineSec').value.trim(); if (ls) api_credentials.line_channel_secret = ls;
  const fv = document.getElementById('credFbVer').value.trim(); if (fv) api_credentials.fb_verify_token = fv;

  const r = await api('/api/workspace', {
    method: 'POST', headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name: document.getElementById('wsName').value, website_url: document.getElementById('wsWeb').value,
      ga4_property_id: document.getElementById('wsGa4').value, gsc_site_url: document.getElementById('wsGsc').value,
      fb_page_id: document.getElementById('wsFb').value, yt_channel_id: document.getElementById('wsYt').value,
      line_oa_id: document.getElementById('wsLn').value, gsheet_id: document.getElementById('wsGs').value,
      gsheet_sync_freq: document.getElementById('wsFreq').value, demo_mode: document.getElementById('wsDemo').value === '1',
      api_credentials,
    }),
  });
  if (r.ok) { toast('บันทึกการตั้งค่าและคีย์ API แล้ว ✓'); boot(); } else toast(r.error || 'บันทึกไม่สำเร็จ');
}

async function testConn(platform) {
  toast('กำลังตรวจสอบการเชื่อมต่อ ' + platform.toUpperCase() + '…');
  const r = await api('/api/connectors/test', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ platform }) });
  toast((r.ok ? '✓ ' : '⚠ ') + (r.message || r.error || 'เสร็จสิ้น'));
}
async function syncOne(platform) {
  toast('กำลังซิงก์ข้อมูลจาก ' + platform.toUpperCase() + '…');
  const r = await api('/api/connectors/sync', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ platform }) });
  toast(r.ok ? (r.message || 'ซิงก์สำเร็จ ✓') : (r.error || 'ซิงก์ไม่สำเร็จ'));
  renderTab();
}
async function syncAllPlatforms() {
  toast('กำลังซิงก์ทุกแพลตฟอร์มที่ตั้งค่าไว้…');
  const r = await api('/api/connectors/sync', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ platform: 'all' }) });
  if (r.ok) toast(`ซิงก์สำเร็จ ${r.synced_ok} แพลตฟอร์ม (ข้าม ${r.skipped} แพลตฟอร์มที่ยังไม่ใส่คีย์)`);
  renderTab();
}

async function toggleRequireLogin(val) {
  const r = await api('/api/admin/settings', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ require_login: String(val) }) });
  if (r.ok) { toast(val === '1' ? 'เปิดบังคับล็อกอินก่อนใช้งานแล้ว 🔒' : 'ปิดโหมดบังคับล็อกอินแล้ว (Demo Mode)'); boot(); } else toast(r.error || 'อัปเดตไม่สำเร็จ');
}

function openAddUserModal() {
  openModal(`
    <div class="card-hd"><b>เพิ่มบัญชีผู้ใช้ใหม่ (RBAC)</b><button class="btn sm ghost" onclick="closeModal()">ปิด</button></div>
    <div class="fgrid">
      <label>ชื่อ-นามสกุล *<input class="inp" id="nuName" placeholder="เช่น คุณนัท (ฝ่ายขาย)"></label>
      <label>อีเมลเข้าสู่ระบบ *<input class="inp" id="nuEmail" type="email" placeholder="nut@company.co.th"></label>
      <label>บทบาท (Role)<select class="inp" id="nuRole">
        <option value="marketing">การตลาด (Marketing)</option>
        <option value="chat_admin">แอดมินแชท (Sales)</option>
        <option value="executive">ผู้บริหาร (Executive)</option>
      </select></label>
      <label>รหัสผ่านเริ่มต้น *<input class="inp" id="nuPw" type="password" placeholder="อย่างน้อย 4 ตัวอักษร"></label>
    </div>
    <div style="margin-top:14px;display:flex;justify-content:flex-end;gap:8px">
      <button class="btn ghost sm" onclick="closeModal()">ยกเลิก</button>
      <button class="btn primary sm" onclick="saveNewUser()">สร้างบัญชีผู้ใช้</button>
    </div>`);
}
async function saveNewUser() {
  const r = await api('/api/users', {
    method: 'POST', headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      action: 'create', name: document.getElementById('nuName').value,
      email: document.getElementById('nuEmail').value, role: document.getElementById('nuRole').value,
      password: document.getElementById('nuPw').value,
    }),
  });
  if (r.ok) { closeModal(); toast('สร้างบัญชีผู้ใช้แล้ว ✓'); renderTab(); } else toast(r.error || 'สร้างไม่สำเร็จ');
}
async function updateUserRole(id, role) {
  const r = await api('/api/users', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ action: 'update', id, role }) });
  if (r.ok) toast('อัปเดตสิทธิ์ผู้ใช้แล้ว ✓'); else { toast(r.error || 'อัปเดตไม่สำเร็จ'); renderTab(); }
}
async function resetUserPw(id, name) {
  const pw = await uiPrompt('ตั้งรหัสผ่านใหม่', 'กำหนดรหัสผ่านใหม่สำหรับ ' + name + ' (อย่างน้อย 4 ตัวอักษร)', '', '••••••••', true);
  if (!pw) return;
  const r = await api('/api/users', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ action: 'update', id, password: pw }) });
  toast(r.ok ? 'เปลี่ยนรหัสผ่านเรียบร้อย ✓' : (r.error || 'ไม่สำเร็จ'));
}
async function deleteUser(id, name) {
  if (!(await uiConfirm('ลบบัญชีผู้ใช้?', 'ยืนยันลบบัญชี ' + name + ' ออกจากระบบใช่หรือไม่?', true))) return;
  const r = await api('/api/users', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ action: 'delete', id }) });
  if (r.ok) { toast('ลบบัญชีแล้ว'); renderTab(); } else toast(r.error || 'ลบไม่สำเร็จ');
}

async function saveBrandSettings() {
  const r = await api('/api/admin/settings', {
    method: 'POST', headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      brand_name: document.getElementById('brName').value,
      brand_logo_text: document.getElementById('brLogo').value,
      brand_tagline: document.getElementById('brTag').value,
      brand_accent: document.getElementById('brAcc').value,
      contact_line: document.getElementById('brLine').value,
      contact_fb: document.getElementById('brFb').value,
      contact_email: document.getElementById('brEmail').value,
      contact_phone: document.getElementById('brPhone').value,
      company_tax_id: document.getElementById('brTax').value,
      company_address: document.getElementById('brAddr').value,
      license_edition: document.getElementById('licEd').value,
      license_holder: document.getElementById('licHold').value,
      license_key: document.getElementById('licKey').value,
    }),
  });
  if (r.ok) { toast('บันทึกแบรนด์ White-Label และลิขสิทธิ์แล้ว ✓'); boot(); } else toast(r.error || 'บันทึกไม่สำเร็จ');
}

async function verifyLicenseKey() {
  const r = await api('/api/admin/license/verify', {
    method: 'POST', headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      license_key: document.getElementById('licKey').value,
      license_holder: document.getElementById('licHold').value,
      license_edition: document.getElementById('licEd').value,
    }),
  });
  const lic = r && r.license;
  toast((lic && lic.message) || r.error || 'ตรวจสอบไม่สำเร็จ');
  renderTab();
}

async function runDoctorFix() {
  const r = await api('/api/system/doctor/fix', { method: 'POST' });
  toast((r && r.message) || 'ซ่อมระบบเรียบร้อย ✓');
  renderTab();
}
async function createNasBackup() {
  const r = await api('/api/system/backups', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ tag: 'manual' }) });
  if (r.ok) { toast('สำรองฐานข้อมูลแล้ว: ' + r.backup.filename + ' ✓'); renderTab(); } else toast(r.error || 'สำรองไม่สำเร็จ');
}
async function restoreNasBackup(filename) {
  if (!(await uiConfirm('กู้คืนฐานข้อมูล NAS?', 'ยืนยันกู้คืนฐานข้อมูลจากไฟล์ ' + filename + ' (ระบบจะสำรองไฟล์ปัจจุบันเก็บไว้ให้ก่อนอัตโนมัติ)', true))) return;
  const r = await api('/api/system/restore', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ filename }) });
  if (r.ok) { toast('กู้คืนฐานข้อมูลเรียบร้อย ✓'); boot(); } else toast(r.error || 'กู้คืนไม่สำเร็จ');
}
async function clearDemoData() {
  const ok = await uiPrompt('ล้างข้อมูลตัวอย่าง (Demo) เพื่อเริ่มใช้งานจริง', 'พิมพ์ CLEAR_DEMO เพื่อยืนยันการล้างข้อมูลตัวอย่างของบริษัทนี้และสลับเป็น Live API Mode (ระบบจะ Backup ก่อนล้างอัตโนมัติ)', '', 'CLEAR_DEMO');
  if (ok !== 'CLEAR_DEMO') return;
  const r = await api('/api/workspace/clear-demo', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ confirm: 'CLEAR_DEMO' }) });
  if (r.ok) { toast(r.message || 'ล้างข้อมูล Demo แล้ว ✓'); boot(); } else toast(r.error || 'ไม่สำเร็จ');
}

function openNewWsModal() {
  openModal(`
    <div class="card-hd"><b>สร้างบริษัท / Workspace ใหม่ (Multi-Tenant)</b><button class="btn sm ghost" onclick="closeModal()">ปิด</button></div>
    <div class="fgrid">
      <label style="grid-column:1/-1">ชื่อบริษัท / แบรนด์ลูกค้า *<input class="inp" id="nwName" placeholder="เช่น บจก. นิวเจน มาร์เก็ตติ้ง"></label>
      <label style="grid-column:1/-1">เว็บไซต์บริษัท<input class="inp" id="nwWeb" placeholder="https://company.co.th"></label>
    </div>
    <div style="margin-top:14px;display:flex;justify-content:flex-end;gap:8px">
      <button class="btn ghost sm" onclick="closeModal()">ยกเลิก</button>
      <button class="btn primary sm" onclick="createWs()">สร้าง Workspace</button>
    </div>`);
}
async function createWs() {
  const r = await api('/api/workspace', {
    method: 'POST', headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ action: 'create_workspace', name: document.getElementById('nwName').value, website_url: document.getElementById('nwWeb').value }),
  });
  if (r.ok) { closeModal(); await switchWorkspace(r.workspace_id); } else toast(r.error || 'สร้างไม่สำเร็จ');
}

boot();
