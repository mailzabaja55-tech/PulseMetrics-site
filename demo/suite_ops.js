/* PulseMetrics Business Suite — Live CRM, ROAS, Comments, Reports, Feedback, Settings (RBAC/License/Alerts/NAS Backup/Doctor) */
(function(){
'use strict';
const {
  PL, $, E, fmt, svg, plogo, expIcon,
  prefs, savePrefs, applyPrefs, APP, hasPerm, api, rangeQuery, resetWorkspaceCache,
  toast, copyTextSafe, openModal, closeModal, multiLineChart,
  pageHead, rangeBarHtml, wireRangeBar, nav, renderNav, renderPage, renderWsBar, renderThemePanel, togglePop, getCurTab,
} = window.PM;
const {syncConnector, syncGSheetsNow, openGaSettingsModal} = window.PM_SHARED;

const R = window.PM_RENDERERS = window.PM_RENDERERS || {};
const W = window.PM_WIRE = window.PM_WIRE || {};

// ---------- Live Loaders ----------
async function loadLeads(force=false){
  if (!force && APP.loaded.leads) return;
  if (APP.loading.leads) return;
  APP.loading.leads = true;
  try {
    const p = new URLSearchParams();
    if (APP.leadQ) p.set('q', APP.leadQ);
    if (APP.leadStage) p.set('stage', APP.leadStage);
    if (APP.leadCh) p.set('channel', APP.leadCh);
    const r = await api('/api/leads' + (p.toString() ? '?' + p.toString() : ''));
    if (r && r.ok) {
      APP.leads = r.leads || [];
      APP.leadPosts = r.posts || [];
      APP.leadSummary = r.summary || APP.leadSummary;
    }
    APP.loaded.leads = true;
  } finally {
    APP.loading.leads = false;
    if (getCurTab() === 'crm') { renderNav(); renderPage(); }
  }
}

async function loadRoi(force=false){
  const key = rangeQuery();
  if (!force && APP.roi && APP.roiKey === key) return;
  if (APP.loading.roi) return;
  APP.loading.roi = true;
  try {
    const r = await api('/api/roi?' + key);
    if (r && r.ok) { APP.roi = r; APP.roiKey = key; }
  } finally {
    APP.loading.roi = false;
    if (getCurTab() === 'roi') renderPage();
  }
}

async function loadComments(force=false){
  if (!force && APP.loaded.comments) return;
  if (APP.loading.comments) return;
  APP.loading.comments = true;
  try {
    const q = APP.commentIntent ? '?intent=' + encodeURIComponent(APP.commentIntent) : '';
    const [rc, rqr] = await Promise.all([api('/api/comments' + q), api('/api/quick-replies')]);
    if (rc && rc.ok) APP.comments = rc.comments || [];
    if (rqr && rqr.ok) APP.quickReplies = rqr.replies || [];
    APP.loaded.comments = true;
  } finally {
    APP.loading.comments = false;
    if (getCurTab() === 'inbox') { renderNav(); renderPage(); }
  }
}

async function loadFeedback(force=false){
  if (!force && APP.loaded.fb) return;
  if (APP.loading.fb) return;
  APP.loading.fb = true;
  try {
    const q = APP.fbStatus ? '?status=' + encodeURIComponent(APP.fbStatus) : '';
    const r = await api('/api/feedback' + q);
    if (r && r.ok) { APP.feedbacks = r.feedbacks || []; APP.fbSummary = r.summary || APP.fbSummary; }
    APP.loaded.fb = true;
  } finally {
    APP.loading.fb = false;
    if (getCurTab() === 'feedback') { renderNav(); renderPage(); }
  }
}

async function loadSettingsData(force=false){
  if (!force && APP.loaded.settings) return;
  if (APP.loading.settings) return;
  APP.loading.settings = true;
  try {
    const calls = [
      api('/api/workspace'),
      api('/api/admin/settings'),
      api('/api/system/health'),
      api('/api/system/doctor'),
      hasPerm('users') ? api('/api/users') : Promise.resolve(null),
      hasPerm('nas_admin') ? api('/api/system/backups') : Promise.resolve(null),
    ];
    const [rws, radm, rhl, rdoc, ru, rbk] = await Promise.all(calls);
    if (rws && rws.ok) { APP.ws = rws.workspace; APP.syncLogs = rws.sync_logs || []; APP.dataDir = rws.data_dir || ''; }
    if (radm && radm.ok) { APP.adminSettings = radm.settings; APP.license = radm.license; APP.requireLogin = radm.settings.require_login === '1'; }
    if (rhl && rhl.ok) APP.health = rhl;
    if (rdoc && rdoc.ok) APP.doctor = rdoc;
    if (ru && ru.ok) APP.users = ru.users || [];
    if (rbk && rbk.ok) APP.backups = rbk.backups || [];
    APP.loaded.settings = true;
  } finally {
    APP.loading.settings = false;
    if (getCurTab() === 'settings' || getCurTab() === 'about') { renderNav(); renderPage(); }
  }
}

// ---------- CRM Modals (Create Lead & Lead Notes) ----------
function openNewLeadModal(){
  openModal(`
    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:10px">
      <b style="font-size:16px">เพิ่มลูกค้าใหม่เข้า CRM Kanban</b>
      <button type="button" class="ghost" id="nl-cls" style="padding:4px 10px;font-size:12px">ปิด</button>
    </div>
    <div style="display:grid;gap:9px">
      <div class="grid g2" style="gap:8px">
        <div><label class="dim">ชื่อลูกค้า / บริษัท *</label><input id="nl-name" placeholder="เช่น คุณธนกฤต (บจก. สยามเทค)"></div>
        <div><label class="dim">เบอร์โทร / LINE / อีเมล</label><input id="nl-ct" placeholder="081-xxx-xxxx"></div>
      </div>
      <div class="grid g3" style="gap:8px">
        <div><label class="dim">ช่องทางทัก</label><select id="nl-ch"><option value="facebook">Facebook</option><option value="line">LINE OA</option><option value="website">Website</option><option value="tiktok">TikTok</option><option value="instagram">Instagram</option></select></div>
        <div><label class="dim">สถานะ</label><select id="nl-stg"><option value="new">ทักใหม่</option><option value="talking">กำลังคุย</option><option value="quoted">เสนอราคาแล้ว</option><option value="won">ปิดการขายแล้ว</option></select></div>
        <div><label class="dim">มูลค่าดีล (บาท)</label><input type="number" id="nl-val" value="50000"></div>
      </div>
      <div class="grid g2" style="gap:8px">
        <div><label class="dim">ผูกกับโพสต์ต้นทาง</label><select id="nl-post"><option value="">— ไม่ระบุ —</option>${APP.leadPosts.map(p=>`<option value="${p.id}">[${E(p.platform)}] ${E(p.title.slice(0,48))}</option>`).join('')}</select></div>
        <div><label class="dim">วันนัดติดตาม (Follow-up)</label><input type="date" id="nl-fu"></div>
      </div>
      <div><label class="dim">ข้อความ / ความต้องการลูกค้า</label><textarea id="nl-msg" rows="3" placeholder="รายละเอียดที่ลูกค้าสอบถาม..."></textarea></div>
      <div style="display:flex;justify-content:flex-end;gap:8px;margin-top:6px">
        <button type="button" class="ghost" id="nl-cls2">ยกเลิก</button>
        <button type="button" id="nl-save">${svg('save')} บันทึกลูกค้าเข้า CRM</button>
      </div>
    </div>`);
  $('nl-cls').onclick = $('nl-cls2').onclick = closeModal;
  $('nl-save').onclick = async () => {
    const customer_name = ($('nl-name').value || '').trim();
    if (!customer_name) return toast('กรุณาระบุชื่อลูกค้า', 'warn');
    const r = await api('/api/leads', {method:'POST', body:{
      customer_name, contact:$('nl-ct').value.trim(), channel:$('nl-ch').value,
      stage:$('nl-stg').value, deal_value:+($('nl-val').value||0),
      post_id:$('nl-post').value, next_followup:$('nl-fu').value, message:$('nl-msg').value.trim(),
    }});
    if (r && r.ok) { closeModal(); toast('เพิ่มลูกค้าเข้า CRM เรียบร้อย ✓', 'ok'); loadLeads(true); }
    else toast((r && r.error) || 'บันทึกไม่สำเร็จ', 'warn');
  };
}

async function openLeadNotesModal(leadId){
  const r = await api('/api/leads/' + leadId + '/notes');
  if (!r || !r.ok) return toast((r && r.error) || 'โหลดข้อมูลลูกค้าไม่สำเร็จ', 'warn');
  const l = r.lead, notes = r.notes || [];
  openModal(`
    <div style="display:flex;justify-content:space-between;align-items:center;gap:8px;margin-bottom:10px">
      <div><b style="font-size:16px">${E(l.customer_name)}</b><div class="dim">${E(l.contact||'-')} · ช่องทาง ${E(l.channel)} · มูลค่า ฿${fmt(l.deal_value)}</div></div>
      <div style="display:flex;gap:6px">
        <a class="ghost" href="/quote/${l.id}" target="_blank" rel="noopener" style="padding:5px 10px;border-radius:9px;border:1px solid var(--bd);text-decoration:none;color:var(--tx);font-size:12px;font-weight:600">${svg('file')} ใบเสนอราคา VAT 7% ↗</a>
        <button type="button" class="ghost" id="ln-cls" style="padding:4px 10px;font-size:12px">ปิด</button>
      </div>
    </div>
    <div class="card" style="background:var(--surf3);margin-bottom:10px;padding:10px 12px">
      <div class="dim" style="font-size:12px;margin-bottom:4px">ข้อความจากลูกค้า:</div>
      <div style="font-size:13.5px">${E(l.message)}</div>
    </div>
    <div class="grid g3" style="gap:8px;margin-bottom:10px">
      <div><label class="dim">สถานะดีล</label><select id="ln-stg">${[['new','ทักใหม่'],['talking','กำลังคุย'],['quoted','เสนอราคาแล้ว'],['won','ปิดการขายแล้ว'],['lost','ไม่ปิด']].map(([k,lb])=>`<option value="${k}" ${l.stage===k?'selected':''}>${lb}</option>`).join('')}</select></div>
      <div><label class="dim">มูลค่าดีล (บาท)</label><input type="number" id="ln-val" value="${Number(l.deal_value||0)}"></div>
      <div><label class="dim">วันนัดติดตาม</label><input type="date" id="ln-fu" value="${E(l.next_followup||'')}"></div>
    </div>
    <div style="display:flex;gap:8px;margin-bottom:12px;flex-wrap:wrap">
      <input id="ln-asgn" value="${E(l.assignee||'')}" placeholder="ผู้รับผิดชอบ" style="flex:1;min-width:140px">
      <button type="button" id="ln-upd">${svg('save')} อัปเดตดีล</button>
      <button type="button" class="ghost" id="ln-del" style="color:var(--bad)">${svg('trash')} ลบ</button>
    </div>
    <div style="border-top:1px solid var(--bd);padding-top:10px">
      <b style="font-size:13.5px">โน้ตติดตามงาน (${notes.length})</b>
      <div style="display:flex;gap:7px;margin:8px 0">
        <input id="ln-txt" placeholder="จดบันทึกการโทร / ส่งใบเสนอราคา...">
        <button type="button" id="ln-add">เพิ่มโน้ต</button>
      </div>
      <div style="max-height:190px;overflow-y:auto">
        ${notes.map(n => `<div class="row" style="padding:6px 0"><div class="t"><div style="font-size:13px">${E(n.note)}</div><div class="dim">${E(n.author_name)} · ${E(n.created_at)}</div></div></div>`).join('') || '<div class="dim">ยังไม่มีโน้ตติดตาม</div>'}
      </div>
    </div>`);
  $('ln-cls').onclick = closeModal;
  $('ln-upd').onclick = async () => {
    const res = await api('/api/leads', {method:'POST', body:{
      action:'update', id:l.id, stage:$('ln-stg').value, deal_value:+($('ln-val').value||0),
      assignee:$('ln-asgn').value.trim(), next_followup:$('ln-fu').value,
    }});
    if (res && res.ok) { toast('อัปเดตข้อมูลดีลแล้ว ✓', 'ok'); loadLeads(true); closeModal(); }
  };
  $('ln-del').onclick = async () => {
    if (!confirm('ยืนยันลบลูกค้ารายนี้ออกจาก CRM?')) return;
    const res = await api('/api/leads', {method:'POST', body:{action:'delete', id:l.id}});
    if (res && res.ok) { toast('ลบรายการลูกค้าแล้ว', 'ok'); loadLeads(true); closeModal(); }
  };
  $('ln-add').onclick = async () => {
    const note = ($('ln-txt').value||'').trim(); if (!note) return;
    const res = await api('/api/leads/' + l.id + '/notes', {method:'POST', body:{note, assignee:$('ln-asgn').value.trim(), next_followup:$('ln-fu').value}});
    if (res && res.ok) { toast('เพิ่มโน้ตติดตามแล้ว ✓', 'ok'); openLeadNotesModal(l.id); loadLeads(true); }
  };
}

// ---------- 7. CRM KANBAN & QUOTATION (Live) ----------
R.crm = function(){
  const cols = [['new','ทักใหม่','ac'],['talking','กำลังคุย','warn'],['quoted','เสนอราคาแล้ว','warn'],['won','ปิดการขายแล้ว','ok'],['lost','ไม่ปิด','']];
  const nextMap = {new:'talking', talking:'quoted', quoted:'won'};
  const ls = APP.leadSummary || {};
  return pageHead('CRM Kanban & ใบเสนอราคา VAT 7%', 'จัดการลีดจากทุกช่องทาง พร้อมจับ SLA เกิน 4 ชม., บันทึกโน้ตติดตาม และออกใบเสนอราคา PDF จริง',
    `<button type="button" id="crm-new">${svg('plus')} เพิ่มลูกค้าใหม่</button><a class="exp-btn csv" href="/api/leads/export.csv" style="text-decoration:none">${expIcon('csv')} ส่งออก CSV</a>`) + `
  <div class="grid g4" style="margin-bottom:14px">
    <div class="card kpi"><div class="dim">ลูกค้าทักทั้งหมด</div><div class="v">${fmt(ls.total)}</div><span class="chip ac">ทักใหม่ ${fmt(ls.new)}</span></div>
    <div class="card kpi"><div class="dim">กำลังคุย / เสนอราคา</div><div class="v">${fmt(ls.talking)}</div><span class="chip warn">Pipeline ฿${fmt(ls.pipeline_thb)}</span></div>
    <div class="card kpi"><div class="dim">ปิดการขายแล้ว</div><div class="v">${fmt(ls.won)}</div><span class="chip ok">฿${fmt(ls.won_thb)}</span></div>
    <div class="card kpi"><div class="dim">อัตราปิดการขาย</div><div class="v">${ls.total ? Math.round(100*ls.won/ls.total) : 0}%</div><span class="chip">ข้อมูลจากฐานข้อมูลจริง</span></div>
  </div>
  <div class="card" style="margin-bottom:14px;padding:10px 14px;display:flex;gap:8px;flex-wrap:wrap;align-items:center">
    <input id="crm-q" value="${E(APP.leadQ)}" placeholder="ค้นหาชื่อลูกค้า, เบอร์โทร, โค้ดโพสต์…" style="max-width:250px">
    <select id="crm-ch" style="width:auto">
      <option value="">ทุกช่องทาง</option>
      ${['facebook','line','website','tiktok','instagram'].map(c=>`<option value="${c}" ${APP.leadCh===c?'selected':''}>${c.toUpperCase()}</option>`).join('')}
    </select>
    <button type="button" class="ghost" id="crm-filter">กรอง</button>
    <button type="button" class="ghost" id="crm-reload" style="margin-left:auto">${svg('refresh')} รีเฟรช</button>
  </div>
  <div class="kb-grid">${cols.map(([st,label,cl]) => {
    const items = APP.leads.filter(l => l.stage === st);
    const sum = items.reduce((a,b) => a + Number(b.deal_value||0), 0);
    return `<div class="kb-col">
      <div class="kb-hd"><span>${label} (${items.length})</span><span class="chip ${cl}">฿${fmt(sum)}</span></div>
      ${items.map(l => `<div class="kb-card">
        <div style="display:flex;align-items:center;gap:6px;margin-bottom:4px">
          ${plogo(l.channel,16)}<b class="ell" style="flex:1">${E(l.customer_name)}</b>
          ${l.sla_overdue?'<span class="chip bad" title="ทักใหม่เกิน 4 ชม.">SLA!</span>':''}
        </div>
        <div class="dim" style="font-size:12px">${E(l.contact||'')} ${l.tracking_code?`· <code>${E(l.tracking_code)}</code>`:''}</div>
        <div style="font-size:12.5px;margin-top:4px;color:var(--tx2)">${E((l.message||'').slice(0,95))}</div>
        <div style="display:flex;justify-content:space-between;align-items:center;margin-top:6px">
          <b style="color:var(--ac-ink)">฿${fmt(l.deal_value)}</b>
          <span class="dim" style="font-size:11px">${l.notes_count?`โน้ต ${l.notes_count}`:''} ${l.next_followup?`· นัด ${E(l.next_followup)}`:''}</span>
        </div>
        <div class="kb-acts">
          ${nextMap[st]?`<button type="button" class="ghost" data-mv="${l.id}:${nextMap[st]}">เลื่อนขั้น →</button>`:''}
          <button type="button" class="ghost" data-lnote="${l.id}">โน้ต/แก้ไข</button>
          <a href="/quote/${l.id}" target="_blank" rel="noopener" style="padding:5px 8px;border-radius:8px;background:var(--ac);color:var(--on-ac);text-decoration:none;font-size:11.5px;font-weight:700">ใบเสนอราคา</a>
        </div>
      </div>`).join('') || '<div class="dim" style="text-align:center;padding:18px 0">ว่าง</div>'}
    </div>`;
  }).join('')}</div>`;
};
W.crm = function(){
  if (!APP.loaded.leads && !APP.leadQ && !APP.leadCh) loadLeads(false);
  if ($('crm-new')) $('crm-new').onclick = openNewLeadModal;
  if ($('crm-reload')) $('crm-reload').onclick = () => loadLeads(true);
  const doFilter = () => { APP.leadQ = ($('crm-q').value||'').trim(); APP.leadCh = $('crm-ch').value; loadLeads(true); };
  if ($('crm-filter')) $('crm-filter').onclick = doFilter;
  if ($('crm-q')) $('crm-q').onkeydown = e => { if (e.key === 'Enter') doFilter(); };
  if ($('crm-ch')) $('crm-ch').onchange = doFilter;
  $('page').querySelectorAll('[data-mv]').forEach(b => b.onclick = async () => {
    const [id, stage] = b.dataset.mv.split(':');
    const r = await api('/api/leads', {method:'POST', body:{action:'update', id:+id, stage}});
    if (r && r.ok) { toast('อัปเดตสถานะ CRM แล้ว ✓', 'ok'); loadLeads(true); }
  });
  $('page').querySelectorAll('[data-lnote]').forEach(b => b.onclick = () => openLeadNotesModal(+b.dataset.lnote));
};

// ---------- 8. AD SPEND & ROAS (Live) ----------
R.roi = function(){
  const d = APP.roi || {};
  const s = d.summary || {};
  const camps = d.campaigns || [];
  const plats = d.platforms || [];
  const todayStr = new Date().toISOString().slice(0, 10);
  return pageHead('ยิงแอด & ROI / ROAS', 'บันทึกงบโฆษณาจริง คำนวณ CPL (ต้นทุนต่อลีด), CAC, ROAS และกำไรสุทธิแยกแพลตฟอร์ม') +
  rangeBarHtml(`<button type="button" class="ghost" id="roi-reload" style="padding:6px 10px;font-size:12.5px">${svg('refresh')} รีเฟรช</button>`) + `
  <div class="grid g4" style="margin-bottom:14px">
    <div class="card kpi"><div class="dim">งบโฆษณารวม</div><div class="v">฿${fmt(s.spend_thb)}</div><span class="chip">${camps.length} แคมเปญ</span></div>
    <div class="card kpi"><div class="dim">ลีดที่ได้ / CPL เฉลี่ย</div><div class="v">${fmt(s.leads_cnt)} คน</div><span class="chip ok">CPL ฿${fmt(s.cpl)} · CAC ฿${fmt(s.cac)}</span></div>
    <div class="card kpi"><div class="dim">รายได้ที่สร้างได้</div><div class="v">฿${fmt(s.revenue_thb)}</div><span class="chip ok">ROI ${s.roi_pct||0}%</span></div>
    <div class="card kpi"><div class="dim">ROAS เฉลี่ย</div><div class="v">${s.roas||0}×</div><span class="chip ${Number(s.roas)>=3?'ok':'ac'}">${Number(s.roas)>=3?'คุ้มค่ามาก':'ติดตามใกล้ชิด'}</span></div>
  </div>
  <div class="grid g21" style="margin-bottom:14px">
    <div class="card">
      <h3>${svg('chart')} สรุปแยกตามแพลตฟอร์มยิงแอด</h3>
      <div style="overflow-x:auto"><table><thead><tr><th>แพลตฟอร์ม</th><th>แคมเปญ</th><th>งบแอด</th><th>ลีด</th><th>CPL</th><th>รายได้</th><th>ROAS</th></tr></thead>
      <tbody>${plats.map(p=>`<tr><td>${plogo(p.platform,16)} <b>${E(p.platform)}</b></td><td>${p.campaigns}</td><td>฿${fmt(p.spend_thb)}</td><td>${fmt(p.leads_cnt)}</td><td>฿${fmt(p.cpl)}</td><td><b>฿${fmt(p.revenue_thb)}</b></td><td><span class="chip ok">${p.roas}×</span></td></tr>`).join('') || '<tr><td colspan="7" class="dim" style="text-align:center;padding:16px">ยังไม่มีแคมเปญในช่วงนี้</td></tr>'}</tbody></table></div>
    </div>
    <div class="card">
      <h3>${svg('plus')} บันทึกแคมเปญยิงแอดใหม่</h3>
      <div style="display:grid;gap:8px">
        <div><label class="dim">ชื่อแคมเปญ *</label><input id="ad-name" placeholder="เช่น FB Lead Gen โปรเดือนนี้"></div>
        <div class="grid g2" style="gap:8px">
          <div><label class="dim">แพลตฟอร์ม</label><select id="ad-plat"><option value="facebook">Facebook</option><option value="google">Google Ads</option><option value="tiktok">TikTok</option><option value="instagram">Instagram</option><option value="youtube">YouTube</option><option value="line">LINE Ads</option></select></div>
          <div><label class="dim">วันที่</label><input type="date" id="ad-dt" value="${todayStr}"></div>
        </div>
        <div class="grid g2" style="gap:8px">
          <div><label class="dim">งบแอด (บาท)</label><input type="number" id="ad-sp" value="10000"></div>
          <div><label class="dim">รายได้ (บาท)</label><input type="number" id="ad-rev" value="45000"></div>
        </div>
        <div class="grid g2" style="gap:8px">
          <div><label class="dim">จำนวนคลิก</label><input type="number" id="ad-clk" value="500"></div>
          <div><label class="dim">ลูกค้าทัก (ลีด)</label><input type="number" id="ad-ld" value="15"></div>
        </div>
        <button type="button" id="ad-add">${svg('save')} บันทึกแคมเปญ</button>
      </div>
    </div>
  </div>
  <div class="card">
    <h3>${svg('file')} รายการแคมเปญทั้งหมด (${camps.length})</h3>
    <div style="overflow-x:auto"><table><thead><tr><th>วันที่</th><th>แคมเปญ</th><th>ช่องทาง</th><th>งบแอด</th><th>คลิก</th><th>ลีด</th><th>CPL</th><th>รายได้</th><th>ROAS</th><th></th></tr></thead>
    <tbody>${camps.map(c=>`<tr><td class="dim">${E(c.dt)}</td><td><b>${E(c.campaign_name)}</b></td><td>${plogo(c.platform,15)} ${E(c.platform)}</td><td>฿${fmt(c.spend_thb)}</td><td>${fmt(c.clicks)}</td><td>${fmt(c.leads_cnt)}</td><td>฿${fmt(c.cpl)}</td><td><b>฿${fmt(c.revenue_thb)}</b></td><td><span class="chip ok">${c.roas}×</span></td><td><button type="button" class="ghost" data-addel="${c.id}" style="padding:3px 7px;font-size:11px">${svg('trash')}</button></td></tr>`).join('') || '<tr><td colspan="10" class="dim" style="text-align:center;padding:16px">ยังไม่มีแคมเปญ</td></tr>'}</tbody></table></div>
  </div>`;
};
W.roi = function(){
  if (!APP.roi || APP.roiKey !== rangeQuery()) loadRoi(false);
  wireRangeBar(() => loadRoi(true));
  if ($('roi-reload')) $('roi-reload').onclick = () => loadRoi(true);
  if ($('ad-add')) $('ad-add').onclick = async () => {
    const campaign_name = ($('ad-name').value||'').trim();
    if (!campaign_name) return toast('กรุณากรอกชื่อแคมเปญ', 'warn');
    const r = await api('/api/roi', {method:'POST', body:{
      campaign_name, platform:$('ad-plat').value, dt:$('ad-dt').value,
      spend_thb:+($('ad-sp').value||0), revenue_thb:+($('ad-rev').value||0),
      clicks:+($('ad-clk').value||0), leads_cnt:+($('ad-ld').value||0),
    }});
    if (r && r.ok) { toast('บันทึกแคมเปญโฆษณาเรียบร้อย ✓', 'ok'); loadRoi(true); }
    else toast((r && r.error) || 'บันทึกไม่สำเร็จ', 'warn');
  };
  $('page').querySelectorAll('[data-addel]').forEach(b => b.onclick = async () => {
    const r = await api('/api/roi', {method:'POST', body:{action:'delete', id:+b.dataset.addel}});
    if (r && r.ok) { toast('ลบแคมเปญแล้ว', 'ok'); loadRoi(true); }
  });
};

// ---------- 9. COMMENTS HUB & 1-CLICK CONVERT TO LEAD (Live) ----------
R.inbox = function(){
  const list = APP.comments || [];
  const sel = list.find(c => c.id === APP.commentSelId) || list[0];
  if (sel) APP.commentSelId = sel.id;
  const intentLbl = {buying:'สนใจซื้อ', question:'ถามข้อมูล', general:'ทั่วไป'};
  return pageHead('คอมเมนต์ & ตอบกลับ', 'รวมคอมเมนต์จาก Facebook / YouTube พร้อมปุ่มคำตอบด่วนเพื่อตอบกลับอย่างรวดเร็ว') + `
  <div class="tabs">
    ${[['','ทั้งหมด'],['buying','สนใจซื้อ (Buying)'],['question','ถามข้อมูล'],['general','ทั่วไป']].map(([k,l])=>`<button type="button" class="tab-btn ${APP.commentIntent===k?'on':''}" data-cint="${k}">${l}</button>`).join('')}
    <button type="button" class="ghost" id="cm-reload" style="margin-left:auto;padding:4px 10px;font-size:12px">${svg('refresh')} รีเฟรช</button>
  </div>
  <div class="grid g12">
    <div class="card" style="max-height:520px;overflow-y:auto">
      ${list.map(c => `<div class="list-it ${sel && c.id===sel.id?'on':''}" data-csel="${c.id}">
        ${plogo(c.platform,20)}
        <div style="min-width:0;flex:1">
          <div style="display:flex;gap:6px;align-items:center"><b class="ell">${E(c.author)}</b><span class="chip ${c.intent==='buying'?'warn':''}" style="margin-left:auto">${E(intentLbl[c.intent]||c.intent)}</span></div>
          <div class="ell" style="font-size:13px">${E(c.content)}</div>
          <div class="dim" style="font-size:11px">${E(c.created_at||'')} ${c.converted_lead_id?'· ✓ เข้า CRM แล้ว':c.replied?'· ตอบแล้ว':''}</div>
        </div>
      </div>`).join('') || '<div class="dim" style="padding:18px;text-align:center">ยังไม่มีคอมเมนต์</div>'}
    </div>
    <div class="card">
      ${sel ? `
      <div style="display:flex;justify-content:space-between;align-items:center;gap:8px;flex-wrap:wrap;margin-bottom:8px">
        <h3 style="margin:0">${plogo(sel.platform,18)} ${E(sel.author)}</h3>
        <span class="chip ${sel.replied?'ok':'warn'}">${sel.replied?'ตอบแล้ว ✓':'รอตอบกลับ'}</span>
      </div>
      <div class="dim" style="margin-bottom:8px">โพสต์: ${E(sel.post_title || sel.post_code || '-')} · ${E(sel.created_at||'')}</div>
      <div class="msg" style="margin-bottom:12px">${E(sel.content)}</div>
      ${sel.replied && sel.reply_text ? `<div class="msg me" style="margin-bottom:12px">คำตอบที่บันทึกไว้: ${E(sel.reply_text)}</div>` : ''}
      <div style="margin-bottom:8px">
        <div class="dim" style="font-size:12px;margin-bottom:5px">ปุ่มคำตอบด่วน (คลิกเพื่อเติมข้อความ):</div>
        <div style="display:flex;gap:6px;flex-wrap:wrap">
          ${APP.quickReplies.map(q=>`<button type="button" class="ghost" data-qr="${E(q.text)}" style="padding:4px 9px;font-size:12px">${E(q.label)}</button>`).join('')}
        </div>
      </div>
      <textarea id="cm-rep" rows="3" placeholder="พิมพ์คำตอบคอมเมนต์...">${E(sel.reply_text||'')}</textarea>
      <div style="display:flex;gap:8px;margin-top:10px;flex-wrap:wrap">
        <button type="button" id="cm-send">${svg('send')} บันทึกคำตอบ</button>
        ${sel.source_url?`<a class="ghost" href="${E(sel.source_url)}" target="_blank" rel="noopener" style="padding:7px 12px;border-radius:10px;border:1px solid var(--bd);text-decoration:none;color:var(--tx);font-size:13px">เปิดโพสต์ต้นทาง ↗</a>`:''}
      </div>` : '<div class="dim">เลือกคอมเมนต์ทางซ้ายเพื่อตอบหรือแปลงเป็นลูกค้าใน CRM</div>'}
    </div>
  </div>`;
};
W.inbox = function(){
  if (!APP.loaded.comments) loadComments(false);
  if ($('cm-reload')) $('cm-reload').onclick = () => loadComments(true);
  $('page').querySelectorAll('[data-cint]').forEach(b => b.onclick = () => { APP.commentIntent = b.dataset.cint; loadComments(true); });
  $('page').querySelectorAll('[data-csel]').forEach(el => el.onclick = () => { APP.commentSelId = +el.dataset.csel; renderPage(); });
  $('page').querySelectorAll('[data-qr]').forEach(b => b.onclick = () => { if ($('cm-rep')) { $('cm-rep').value = b.dataset.qr; $('cm-rep').focus(); } });
  const sel = APP.comments.find(c => c.id === APP.commentSelId);
  if ($('cm-send') && sel) $('cm-send').onclick = async () => {
    const reply_text = ($('cm-rep').value||'').trim();
    if (!reply_text) return toast('กรุณาพิมพ์คำตอบ', 'warn');
    const r = await api('/api/comments', {method:'POST', body:{id:sel.id, reply_text}});
    if (r && r.ok) { toast('บันทึกคำตอบเรียบร้อย ✓', 'ok'); loadComments(true); }
  };
  if ($('cm-conv') && sel) $('cm-conv').onclick = async () => {
    const r = await api('/api/comments/convert-lead', {method:'POST', body:{comment_id:sel.id}});
    if (r && r.ok) { toast(r.message || 'ส่งเข้า CRM เรียบร้อย ✓', 'ok'); loadComments(true); loadLeads(true); }
    else toast((r && r.error) || 'แปลงไม่สำเร็จ', 'warn');
  };
};

// ---------- 10. REPORTS & EXPORTS (Live) ----------
R.reports = function(){
  return pageHead('รายงานผู้บริหาร & ส่งออกไฟล์จริง', 'ออกรายงาน Executive PDF พร้อมพิมพ์, Excel 6 ชีต (.xlsx), ซิงก์ Google Sheets 6 แท็บ และส่งสรุปรายสัปดาห์เข้ามือถือ') +
  rangeBarHtml('') + `
  <div class="grid g2" style="margin-bottom:14px">
    <div class="card">
      <h3>${svg('file')} Executive Summary PDF (พร้อมพิมพ์)</h3>
      <p class="dim">รวมตัวเลข GA4, Search Console, Facebook, YouTube, Funnel ยอดทัก→ปิดการขาย, เป้าหมายบริษัท และคำแนะนำผู้บริหาร พร้อมหัวแบรนด์ White-Label</p>
      <a class="exp-btn csv" href="/report?${rangeQuery()}" target="_blank" rel="noopener" style="text-decoration:none;display:inline-flex">${svg('download')} เปิดรายงานผู้บริหาร PDF ↗</a>
    </div>
    <div class="card">
      <h3>${expIcon('xl')} Excel 6 ชีต (.xlsx จริงจากเซิร์ฟเวอร์)</h3>
      <p class="dim">ไฟล์ Excel แท้ 6 แท็บ (ภาพรวม, รายวัน, เว็บเพจ/GA4, โพสต์, คอมเมนต์, ลีด CRM) รองรับภาษาไทย 100%</p>
      <a class="exp-btn xl" href="/api/export/excel?${rangeQuery()}" style="text-decoration:none;display:inline-flex">${expIcon('xl')} ดาวน์โหลด Excel (.xlsx)</a>
    </div>
    <div class="card">
      <h3>${expIcon('gs')} ซิงก์ตรงขึ้น Google Sheets (6 แท็บ)</h3>
      <p class="dim">อัปเดตข้อมูลล่าสุดขึ้น Google Spreadsheet ของบริษัทอัตโนมัติ (ตั้งค่า Sheet ID &amp; Service Account ได้ที่หน้าตั้งค่า)</p>
      <button type="button" class="exp-btn gs" id="rep-gs-live">${expIcon('gs')} ซิงก์ขึ้น Google Sheets ทันที</button>
    </div>
    <div class="card">
      <h3>${svg('bell')} ส่ง Weekly Digest เข้ามือถือ &amp; Export CRM CSV</h3>
      <p class="dim">ยิงรายงานสรุปรายสัปดาห์เข้า Discord / Telegram / LINE ที่ตั้งค่าไว้ หรือโหลดรายชื่อลูกค้า CRM เป็น CSV</p>
      <div style="display:flex;gap:8px;flex-wrap:wrap">
        <button type="button" id="rep-digest">${svg('send')} ส่ง Weekly Digest ทันที</button>
        <a class="exp-btn csv" href="/api/leads/export.csv" style="text-decoration:none">${expIcon('csv')} โหลด CRM CSV</a>
      </div>
    </div>
  </div>`;
};
W.reports = function(){
  wireRangeBar(() => renderPage());
  if ($('rep-gs-live')) $('rep-gs-live').onclick = syncGSheetsNow;
  if ($('rep-digest')) $('rep-digest').onclick = async () => {
    const r = await api('/api/alerts/digest', {method:'POST'});
    toast((r && (r.message || r.error)) || 'ดำเนินการแล้ว', r && r.ok ? 'ok' : 'warn');
  };
};

// ---------- 11. FEEDBACK INBOX (Live) ----------
R.feedback = function(){
  const s = APP.fbSummary || {};
  return pageHead('ฟีดแบคลูกค้า (Feedback Inbox)', 'รับฟีดแบคจากหน้าเว็บ /site หรือแบบฟอร์มลูกค้า พร้อมเปลี่ยนสถานะและซิงก์คลาวด์',
    `<button type="button" class="ghost" id="fb-sync">${svg('refresh')} ซิงก์คลาวด์</button>`) + `
  <div class="grid g4" style="margin-bottom:14px">
    <div class="card kpi"><div class="dim">ฟีดแบคทั้งหมด</div><div class="v">${fmt(s.total)}</div></div>
    <div class="card kpi"><div class="dim">รายการใหม่</div><div class="v">${fmt(s.new)}</div></div>
    <div class="card kpi"><div class="dim">กำลังตรวจสอบ</div><div class="v">${fmt(s.reviewing)}</div></div>
    <div class="card kpi"><div class="dim">คะแนนเฉลี่ย</div><div class="v">${s.avg_rating||0} / 5</div></div>
  </div>
  <div class="tabs">
    ${[['','ทั้งหมด'],['new','ใหม่'],['reviewing','กำลังดู'],['done','เสร็จแล้ว']].map(([k,l])=>`<button type="button" class="tab-btn ${APP.fbStatus===k?'on':''}" data-fbst="${k}">${l}</button>`).join('')}
  </div>
  <div class="card">
    ${APP.feedbacks.map(f => `<div class="row" style="align-items:flex-start;flex-wrap:wrap;gap:10px">
      <div class="t" style="min-width:240px">
        <div style="display:flex;gap:6px;align-items:center;flex-wrap:wrap">
          <b>${E(f.sender_name)}</b><span class="chip ac">${E(f.category)}</span><span class="chip ok">⭐ ${f.rating}/5</span><span class="dim">${E(f.created_at)}</span>
        </div>
        <div style="margin:5px 0">${E(f.message)}</div>
      </div>
      <div style="display:flex;gap:6px;align-items:center">
        <select data-fbu="${f.id}" style="width:auto;padding:4px 8px;font-size:12px">
          <option value="new" ${f.status==='new'?'selected':''}>ใหม่</option>
          <option value="reviewing" ${f.status==='reviewing'?'selected':''}>กำลังตรวจสอบ</option>
          <option value="done" ${f.status==='done'?'selected':''}>เสร็จแล้ว ✓</option>
        </select>
        <button type="button" class="ghost" data-fbdel="${f.id}" style="padding:4px 8px;font-size:12px">${svg('trash')}</button>
      </div>
    </div>`).join('') || '<div class="dim" style="padding:18px;text-align:center">ยังไม่มีรายการฟีดแบค</div>'}
  </div>`;
};
W.feedback = function(){
  if (!APP.loaded.fb) loadFeedback(false);
  $('page').querySelectorAll('[data-fbst]').forEach(b => b.onclick = () => { APP.fbStatus = b.dataset.fbst; loadFeedback(true); });
  if ($('fb-sync')) $('fb-sync').onclick = async () => {
    const r = await api('/api/feedback/sync', {method:'POST'});
    toast((r && (r.message || r.error)) || 'ซิงก์ฟีดแบคแล้ว', r && r.ok ? 'ok' : 'warn');
    loadFeedback(true);
  };
  $('page').querySelectorAll('[data-fbu]').forEach(sel => sel.onchange = async () => {
    const r = await api('/api/feedback', {method:'POST', body:{action:'update', id:+sel.dataset.fbu, status:sel.value}});
    if (r && r.ok) { toast('อัปเดตสถานะฟีดแบคแล้ว ✓', 'ok'); loadFeedback(true); }
  });
  $('page').querySelectorAll('[data-fbdel]').forEach(b => b.onclick = async () => {
    const r = await api('/api/feedback', {method:'POST', body:{action:'delete', id:+b.dataset.fbdel}});
    if (r && r.ok) { toast('ลบรายการฟีดแบคแล้ว', 'ok'); loadFeedback(true); }
  });
};

// ---------- 12. PRODUCTION SETTINGS (5 Tabs: Connectors, Brand/License/Auth, Users/Workspaces, Alerts, NAS Backups/Doctor) ----------
R.settings = function(){
  const ws = APP.ws || {};
  const cs = ws.api_config_status || {};
  const st = APP.adminSettings || {};
  const lic = APP.license || {};
  const hl = APP.health || {};
  const doc = APP.doctor || {};
  const origin = (location.origin && location.origin !== 'null') ? location.origin : 'http://127.0.0.1:8090';
  const wsId = ws.id || 1;
  const isExec = hasPerm('branding');
  const badgeCfg = k => (cs[k] && cs[k].configured) ? `<span class="chip ok">ตั้งค่าแล้ว (${E(cs[k].preview||'')})</span>` : '<span class="chip warn">ยังไม่ใส่คีย์</span>';

  return pageHead('ตั้งค่าระบบ & เชื่อมต่อ API จริง', 'จัดการคีย์ API (GA4/GSC/FB/YT/Sheets/LINE), ลิขสิทธิ์ขายขาด, Login Gate, สิทธิ์ทีมงาน RBAC และสำรองข้อมูล NAS',
    `<button type="button" class="ghost" id="set-th">${svg('palette')} ธีม 24 แบบ (Alt+T)</button>`) + `
  <div class="tabs">
    <button type="button" class="tab-btn ${prefs.setSub==='connectors'?'on':''}" data-ssub="connectors">${svg('link')} เชื่อมต่อ API &amp; Live Mode</button>
    <button type="button" class="tab-btn ${prefs.setSub==='brand'?'on':''}" data-ssub="brand">${svg('shield')} แบรนด์, ลิขสิทธิ์ &amp; ความปลอดภัย</button>
    <button type="button" class="tab-btn ${prefs.setSub==='team'?'on':''}" data-ssub="team">${svg('users')} ทีมงาน (RBAC) &amp; บริษัท</button>
    <button type="button" class="tab-btn ${prefs.setSub==='alerts'?'on':''}" data-ssub="alerts">${svg('bell')} แจ้งเตือนมือถือ</button>
    <button type="button" class="tab-btn ${prefs.setSub==='nas'?'on':''}" data-ssub="nas">${svg('wrench')} สำรองข้อมูล NAS &amp; Doctor</button>
  </div>

  ${prefs.setSub === 'connectors' ? `
  <div class="card" style="margin-bottom:14px">
    <div style="display:flex;justify-content:space-between;align-items:center;gap:10px;flex-wrap:wrap">
      <div>
        <b>สถานะข้อมูลของบริษัท: ${E(ws.name||'-')}</b>
        <div class="dim">${Number(ws.demo_mode)===1 ? 'กำลังแสดงข้อมูลตัวอย่าง (Demo Seed) — เมื่อพร้อมใช้งานจริง กดปุ่มขวาเพื่อล้างข้อมูลตัวอย่าง (ระบบสำรอง .db ก่อนล้างอัตโนมัติ)' : 'กำลังทำงานในโหมดใช้งานจริง (Live API Mode) ✓'}</div>
      </div>
      ${Number(ws.demo_mode)===1 && hasPerm('nas_admin') ? `<button type="button" id="set-clear-demo" style="background:var(--bad);color:#fff">${svg('trash')} ล้างข้อมูลตัวอย่าง → เริ่มใช้งานจริง</button>` : '<span class="chip ok">● Live Mode</span>'}
    </div>
  </div>
  <div class="grid g2" style="margin-bottom:14px">
    <div class="card">
      <h3>${plogo('ga4',18)} Google Analytics 4, Search Console &amp; Google Sheets</h3>
      <div style="display:grid;gap:9px">
        <div><label class="dim">เว็บไซต์หลัก (Website URL)</label><input id="c-web" value="${E(ws.website_url||'')}"></div>
        <div><label class="dim">GA4 Property ID</label><input id="c-ga4" value="${E(ws.ga4_property_id||'')}" placeholder="properties/123456789"></div>
        <div><label class="dim">Search Console Site URL</label><input id="c-gsc" value="${E(ws.gsc_site_url||'')}" placeholder="https://example.com/"></div>
        <div><label class="dim">Google Spreadsheet ID (ส่งออก 6 ชีต)</label><input id="c-gsheet" value="${E(ws.gsheet_id||'')}" placeholder="1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs..."></div>
        <div>
          <div style="display:flex;justify-content:space-between;margin-bottom:4px"><label class="dim">Google Service Account JSON (เว้นว่าง = ใช้ของเดิม)</label>${badgeCfg('google_service_account_json')}</div>
          <textarea id="c-gsa" rows="3" placeholder='{"type":"service_account",...}'></textarea>
        </div>
        <div style="display:flex;gap:6px;flex-wrap:wrap">
          <button type="button" class="ghost" data-ctest="ga4">ทดสอบ GA4</button>
          <button type="button" class="ghost" data-ctest="gsc">ทดสอบ GSC</button>
          <button type="button" class="ghost" data-ctest="gsheets">ทดสอบ Sheets</button>
        </div>
      </div>
    </div>
    <div class="card">
      <h3>${plogo('fb',18)}${plogo('yt',18)} Facebook Page, YouTube &amp; LINE OA</h3>
      <div style="display:grid;gap:9px">
        <div class="grid g2" style="gap:8px">
          <div><label class="dim">Facebook Page ID</label><input id="c-fbid" value="${E(ws.fb_page_id||'')}"></div>
          <div><label class="dim">ชื่อเพจ Facebook</label><input id="c-fbname" value="${E(ws.fb_page_name||'')}"></div>
        </div>
        <div><div style="display:flex;justify-content:space-between;margin-bottom:4px"><label class="dim">Facebook Page Access Token</label>${badgeCfg('fb_page_token')}</div><input type="password" id="c-fbtok" placeholder="EAAG... (เว้นว่าง = ใช้ของเดิม)"></div>
        <div class="grid g2" style="gap:8px">
          <div><label class="dim">YouTube Channel ID</label><input id="c-ytid" value="${E(ws.yt_channel_id||'')}"></div>
          <div><label class="dim">ชื่อช่อง YouTube</label><input id="c-ytname" value="${E(ws.yt_channel_name||'')}"></div>
        </div>
        <div><div style="display:flex;justify-content:space-between;margin-bottom:4px"><label class="dim">YouTube Data API v3 Key</label>${badgeCfg('yt_api_key')}</div><input type="password" id="c-ytkey" placeholder="AIza... (เว้นว่าง = ใช้ของเดิม)"></div>
        <div><div style="display:flex;justify-content:space-between;margin-bottom:4px"><label class="dim">LINE OA Channel Secret (Webhook)</label>${badgeCfg('line_channel_secret')}</div><input type="password" id="c-linesec" placeholder="เว้นว่าง = ใช้ของเดิม"></div>
        <div style="display:flex;gap:6px;flex-wrap:wrap">
          <button type="button" class="ghost" data-ctest="facebook">ทดสอบ FB</button>
          <button type="button" class="ghost" data-ctest="youtube">ทดสอบ YT</button>
        </div>
      </div>
    </div>
  </div>
  <div class="card" style="margin-bottom:14px;display:flex;justify-content:space-between;align-items:center;gap:10px;flex-wrap:wrap">
    <div class="dim" style="font-size:12px">Webhook URL (ต้องใช้ HTTPS สาธารณะเช่น Cloudflare Tunnel):<br>LINE OA: <code>${origin}/api/webhook/line/${wsId}</code> · Facebook: <code>${origin}/api/webhook/facebook/${wsId}</code></div>
    <div style="display:flex;gap:8px;flex-wrap:wrap">
      <button type="button" id="c-save-all">${svg('save')} บันทึกการเชื่อมต่อทั้งหมด</button>
      <button type="button" class="ghost" id="c-sync-all">${svg('refresh')} ซิงก์ทุกช่องทางทันที</button>
    </div>
  </div>` :

  prefs.setSub === 'brand' ? `
  <div class="grid g2" style="margin-bottom:14px">
    <div class="card">
      <h3>${svg('shield')} ลิขสิทธิ์ขายขาด (One-Time License)</h3>
      <div style="margin-bottom:10px"><span class="chip ${lic.status==='verified'?'ok':'warn'}">${E(lic.message || 'โหมดทดลอง')}</span></div>
      <div style="display:grid;gap:9px">
        <div><label class="dim">ชื่อบริษัทผู้ถือสิทธิ์ (Holder)</label><input id="l-holder" value="${E(st.license_holder||'')}"></div>
        <div><label class="dim">รุ่นลิขสิทธิ์ (Edition)</label><input id="l-ed" value="${E(st.license_edition||'')}"></div>
        <div><label class="dim">License Key (PM3-...)</label><input id="l-key" value="${E(st.license_key||'')}" placeholder="PM3-PRO-XXXX-XXXX-XXXX-XXXX"></div>
        <button type="button" id="l-verify" ${isExec?'':'disabled'}>${svg('check-circle')} ตรวจสอบ &amp; เปิดใช้งานลิขสิทธิ์</button>
      </div>
    </div>
    <div class="card">
      <h3>${svg('lock')} ความปลอดภัย &amp; เปลี่ยนรหัสผ่าน</h3>
      <div class="row" style="padding:8px 0;margin-bottom:10px">
        <div class="t"><b>เปิดบังคับล็อกอิน (Production Login Gate)</b><div class="dim">ต้องเปิดเมื่อส่งมอบลูกค้าจริงหรือวางบน NAS ออฟฟิศ</div></div>
        <input type="checkbox" id="s-reqlogin" ${st.require_login==='1'?'checked':''} ${isExec?'':'disabled'} style="width:20px;height:20px;accent-color:var(--ac)">
      </div>
      <div style="display:grid;gap:8px;border-top:1px solid var(--bd);padding-top:10px">
        <b style="font-size:13px">เปลี่ยนรหัสผ่านบัญชีของฉัน (${E((APP.me && APP.me.email) || '')})</b>
        <input type="password" id="pw-cur" placeholder="รหัสผ่านเดิม (เช่น admin123)">
        <input type="password" id="pw-new" placeholder="รหัสผ่านใหม่ (อย่างน้อย 6 ตัวอักษร)">
        <button type="button" id="pw-save">${svg('lock')} เปลี่ยนรหัสผ่านทันที</button>
      </div>
    </div>
  </div>
  <div class="card">
    <h3>${svg('palette')} White-Label แบรนด์ &amp; ข้อมูลบริษัทบนใบเสนอราคา PDF</h3>
    <div class="grid g2" style="gap:10px;margin-bottom:10px">
      <div><label class="dim">ชื่อแบรนด์ (แสดงบนหัวแอป &amp; PDF)</label><input id="b-name" value="${E(st.brand_name||'PulseMetrics')}"></div>
      <div><label class="dim">คำโปรย (Tagline)</label><input id="b-tag" value="${E(st.brand_tagline||'')}"></div>
      <div><label class="dim">เลขผู้เสียภาษีบริษัท (Tax ID)</label><input id="b-tax" value="${E(st.company_tax_id||'')}"></div>
      <div><label class="dim">เบอร์โทร / อีเมลติดต่อ</label><input id="b-phone" value="${E(st.contact_phone||'')}"></div>
      <div style="grid-column:1/-1"><label class="dim">ที่อยู่บริษัทบนใบเสนอราคา</label><input id="b-addr" value="${E(st.company_address||'')}"></div>
    </div>
    <button type="button" id="b-save" ${isExec?'':'disabled'}>${svg('save')} บันทึกการตั้งค่าแบรนด์ &amp; Login Gate</button>
  </div>` :

  prefs.setSub === 'team' ? `
  <div class="grid g2" style="margin-bottom:14px">
    <div class="card">
      <h3>${svg('users')} บัญชีผู้ใช้งาน &amp; สิทธิ์ (RBAC)</h3>
      ${APP.users.map(u => `<div class="row">
        <div class="t"><b>${E(u.name)}</b><div class="dim">${E(u.email)}</div></div>
        <span class="chip ${u.role==='executive'?'ac':u.role==='marketing'?'ok':''}">${E(u.role)}</span>
        ${hasPerm('users') ? `<button type="button" class="ghost" data-udel="${u.id}" style="padding:3px 8px;font-size:11.5px">${svg('trash')}</button>` : ''}
      </div>`).join('') || '<div class="dim">เฉพาะผู้บริหาร (Executive) จึงจะจัดการบัญชีผู้ใช้ได้</div>'}
    </div>
    <div class="card">
      <h3>${svg('plus')} เพิ่มผู้ใช้ใหม่</h3>
      <div style="display:grid;gap:8px">
        <input id="u-name" placeholder="ชื่อ-นามสกุล">
        <input id="u-email" type="email" placeholder="อีเมล (เช่น team@company.com)">
        <select id="u-role"><option value="marketing">Marketing (ดูสถิติ/โพสต์/ตั้งค่า API)</option><option value="chat_admin">Sales &amp; Chat Admin (CRM/คอมเมนต์)</option><option value="executive">Executive (สิทธิ์เต็มทั้งหมด)</option></select>
        <input id="u-pw" type="password" placeholder="รหัสผ่านเริ่มต้น (อย่างน้อย 6 ตัว)">
        <button type="button" id="u-add" ${hasPerm('users')?'':'disabled'}>${svg('save')} สร้างบัญชีผู้ใช้</button>
      </div>
      <div style="border-top:1px solid var(--bd);margin-top:14px;padding-top:12px">
        <b style="font-size:13.5px">สร้างบริษัท / Workspace ใหม่</b>
        <div style="display:flex;gap:7px;margin-top:7px">
          <input id="ws-new-name" placeholder="ชื่อบริษัท / แบรนด์ใหม่">
          <button type="button" id="ws-new-add" ${hasPerm('nas_admin')?'':'disabled'}>สร้าง</button>
        </div>
      </div>
    </div>
  </div>` :

  prefs.setSub === 'alerts' ? `
  <div class="card">
    <h3>${svg('bell')} แจ้งเตือนเข้ามือถือ (Discord / Telegram / LINE Push)</h3>
    <div class="grid g2" style="gap:10px;margin-bottom:10px">
      <div style="grid-column:1/-1"><label class="dim">Discord Webhook URL</label><input id="al-dc" value="${E(st.alert_discord_webhook||'')}" placeholder="https://discord.com/api/webhooks/..."></div>
      <div><label class="dim">Telegram Bot Token</label><input id="al-tg-tok" value="${E(st.alert_telegram_bot_token||'')}"></div>
      <div><label class="dim">Telegram Chat ID</label><input id="al-tg-id" value="${E(st.alert_telegram_chat_id||'')}"></div>
      <div><label class="dim">LINE Channel Access Token</label><input id="al-ln-tok" value="${E(st.alert_line_token||'')}"></div>
      <div><label class="dim">LINE User / Group ID</label><input id="al-ln-id" value="${E(st.alert_line_target_id||'')}"></div>
    </div>
    <div style="display:flex;gap:14px;flex-wrap:wrap;margin-bottom:12px;font-size:13px">
      <label style="display:inline-flex;gap:6px;align-items:center"><input type="checkbox" id="al-lead" ${st.alert_on_new_lead==='1'?'checked':''}> แจ้งเมื่อมีลูกค้าทักใหม่</label>
      <label style="display:inline-flex;gap:6px;align-items:center"><input type="checkbox" id="al-fb" ${st.alert_on_feedback==='1'?'checked':''}> แจ้งเมื่อมีฟีดแบคใหม่</label>
      <label style="display:inline-flex;gap:6px;align-items:center"><input type="checkbox" id="al-wk" ${st.alert_weekly_digest==='1'?'checked':''}> ส่งสรุปรายสัปดาห์อัตโนมัติ</label>
    </div>
    <div style="display:flex;gap:8px;flex-wrap:wrap">
      <button type="button" id="al-save" ${isExec?'':'disabled'}>${svg('save')} บันทึกการแจ้งเตือน</button>
      <button type="button" class="ghost" id="al-test">${svg('send')} ทดสอบยิงแจ้งเตือน</button>
    </div>
  </div>` : `
  <div class="grid g2">
    <div class="card">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px">
        <h3 style="margin:0">${svg('save')} จุดสำรองฐานข้อมูล SQLite (${APP.backups.length})</h3>
        <button type="button" id="bk-now" ${hasPerm('nas_admin')?'':'disabled'} style="padding:5px 10px;font-size:12px">+ สำรองข้อมูลตอนนี้</button>
      </div>
      <div class="dim" style="margin-bottom:8px;font-size:12px">โฟลเดอร์ข้อมูล: <code>${E(hl.data_dir||APP.dataDir||'-')}</code> · โหมด ${E(hl.journal_mode||'WAL')}</div>
      <div style="max-height:280px;overflow-y:auto">
        ${APP.backups.map(b => `<div class="row">
          <div class="t"><b style="font-size:12.5px">${E(b.filename)}</b><div class="dim">${b.size_kb} KB · ${E(b.created_at)}</div></div>
          <a class="ghost" href="/api/system/backups/${encodeURIComponent(b.filename)}" style="padding:3px 8px;border-radius:8px;border:1px solid var(--bd);text-decoration:none;color:var(--tx);font-size:11.5px">โหลด</a>
          <button type="button" class="ghost" data-brest="${E(b.filename)}" style="padding:3px 8px;font-size:11.5px">กู้คืน</button>
        </div>`).join('') || '<div class="dim">ยังไม่มีจุดสำรองข้อมูล</div>'}
      </div>
    </div>
    <div class="card">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px">
        <h3 style="margin:0">${svg('wrench')} System Doctor (${doc.score||0}/100)</h3>
        <button type="button" class="ghost" id="doc-fix" ${hasPerm('nas_admin')?'':'disabled'} style="padding:5px 10px;font-size:12px">ซ่อมอัตโนมัติ (1 คลิก)</button>
      </div>
      ${(doc.checks || []).map(ch => `<div class="row"><span class="chip ${ch.ok?'ok':'warn'}">${ch.ok?'ผ่าน':'เตือน'}</span><div class="t"><b>${E(ch.label)}</b><div class="dim">${E(ch.detail)}</div></div></div>`).join('') || '<div class="dim">กำลังตรวจสุขภาพระบบ…</div>'}
    </div>
  </div>`}`;
};
W.settings = function(){
  if (!APP.loaded.settings) loadSettingsData(false);
  if ($('set-th')) $('set-th').onclick = () => togglePop('thpanel', renderThemePanel);
  $('page').querySelectorAll('[data-ssub]').forEach(b => b.onclick = () => { prefs.setSub = b.dataset.ssub; savePrefs(); renderPage(); });

  // Tab 1: Connectors & Clear Demo
  $('page').querySelectorAll('[data-ctest]').forEach(b => b.onclick = async () => {
    const r = await api('/api/connectors/test', {method:'POST', body:{platform:b.dataset.ctest}});
    toast((r && (r.message || r.error)) || 'ทดสอบแล้ว', r && r.ok ? 'ok' : 'warn');
  });
  if ($('c-save-all')) $('c-save-all').onclick = async () => {
    const body = {
      website_url:$('c-web').value.trim(), ga4_property_id:$('c-ga4').value.trim(), gsc_site_url:$('c-gsc').value.trim(),
      gsheet_id:$('c-gsheet').value.trim(), fb_page_id:$('c-fbid').value.trim(), fb_page_name:$('c-fbname').value.trim(),
      yt_channel_id:$('c-ytid').value.trim(), yt_channel_name:$('c-ytname').value.trim(),
      api_credentials: {},
    };
    if ($('c-gsa').value.trim()) body.api_credentials.google_service_account_json = $('c-gsa').value.trim();
    if ($('c-fbtok').value.trim()) body.api_credentials.fb_page_token = $('c-fbtok').value.trim();
    if ($('c-ytkey').value.trim()) body.api_credentials.yt_api_key = $('c-ytkey').value.trim();
    if ($('c-linesec').value.trim()) body.api_credentials.line_channel_secret = $('c-linesec').value.trim();
    const r = await api('/api/workspace', {method:'POST', body});
    if (r && r.ok) { toast('บันทึกการตั้งค่า API เรียบร้อย ✓', 'ok'); loadSettingsData(true); }
    else toast((r && r.error) || 'บันทึกไม่สำเร็จ', 'warn');
  };
  if ($('c-sync-all')) $('c-sync-all').onclick = () => syncConnector('all');
  if ($('set-clear-demo')) $('set-clear-demo').onclick = async () => {
    if (!confirm('ยืนยันล้างข้อมูลตัวอย่างของบริษัทนี้และสลับเป็น Live Mode?\n(ระบบจะสำรองไฟล์ .db ให้อัตโนมัติก่อนล้าง)')) return;
    const r = await api('/api/workspace/clear-demo', {method:'POST', body:{confirm:'CLEAR_DEMO'}});
    if (r && r.ok) {
      toast(r.message || 'สลับเป็น Live Mode เรียบร้อย ✓', 'ok');
      resetWorkspaceCache();
      const me = await api('/api/auth/me'); if (me && me.ok) APP.workspaces = me.workspaces || [];
      loadSettingsData(true);
    } else toast((r && r.error) || 'ล้างข้อมูลไม่สำเร็จ', 'warn');
  };

  // Tab 2: Brand, License, Login Gate, Password
  if ($('l-verify')) $('l-verify').onclick = async () => {
    const r = await api('/api/admin/license/verify', {method:'POST', body:{
      license_holder:$('l-holder').value.trim(), license_edition:$('l-ed').value.trim(), license_key:$('l-key').value.trim(),
    }});
    if (r && r.license) {
      APP.license = r.license;
      toast(r.license.message, r.license.valid ? 'ok' : 'warn');
      loadSettingsData(true);
    }
  };
  if ($('b-save')) $('b-save').onclick = async () => {
    const r = await api('/api/admin/settings', {method:'POST', body:{
      brand_name:$('b-name').value.trim() || 'PulseMetrics',
      brand_tagline:$('b-tag').value.trim(),
      company_tax_id:$('b-tax').value.trim(),
      contact_phone:$('b-phone').value.trim(),
      company_address:$('b-addr').value.trim(),
      require_login:$('s-reqlogin').checked ? '1' : '0',
    }});
    if (r && r.ok) {
      APP.adminSettings = r.settings;
      APP.brand.brand_name = r.settings.brand_name;
      APP.brand.brand_tagline = r.settings.brand_tagline;
      APP.requireLogin = r.settings.require_login === '1';
      applyPrefs(); renderWsBar();
      toast('บันทึกการตั้งค่าแบรนด์และความปลอดภัยแล้ว ✓', 'ok');
    } else toast((r && r.error) || 'บันทึกไม่สำเร็จ', 'warn');
  };
  if ($('pw-save')) $('pw-save').onclick = async () => {
    const r = await api('/api/auth/change-password', {method:'POST', body:{current_password:$('pw-cur').value, new_password:$('pw-new').value}});
    toast((r && (r.message || r.error)) || 'ไม่สำเร็จ', r && r.ok ? 'ok' : 'warn');
    if (r && r.ok) { $('pw-cur').value = ''; $('pw-new').value = ''; }
  };

  // Tab 3: Users & Workspaces
  if ($('u-add')) $('u-add').onclick = async () => {
    const r = await api('/api/users', {method:'POST', body:{
      action:'create', name:$('u-name').value.trim(), email:$('u-email').value.trim(), role:$('u-role').value, password:$('u-pw').value,
    }});
    if (r && r.ok) { toast('เพิ่มผู้ใช้ใหม่เรียบร้อย ✓', 'ok'); loadSettingsData(true); }
    else toast((r && r.error) || 'สร้างผู้ใช้ไม่สำเร็จ', 'warn');
  };
  $('page').querySelectorAll('[data-udel]').forEach(b => b.onclick = async () => {
    if (!confirm('ยืนยันลบผู้ใช้นี้?')) return;
    const r = await api('/api/users', {method:'POST', body:{action:'delete', id:+b.dataset.udel}});
    if (r && r.ok) { toast('ลบผู้ใช้แล้ว', 'ok'); loadSettingsData(true); }
    else toast((r && r.error) || 'ลบไม่สำเร็จ', 'warn');
  });
  if ($('ws-new-add')) $('ws-new-add').onclick = async () => {
    const name = ($('ws-new-name').value||'').trim(); if (!name) return;
    const r = await api('/api/workspace', {method:'POST', body:{action:'create_workspace', name}});
    if (r && r.ok) {
      toast('สร้างบริษัทใหม่เรียบร้อย ✓', 'ok');
      const me = await api('/api/auth/me'); if (me && me.ok) APP.workspaces = me.workspaces || [];
      renderWsBar(); loadSettingsData(true);
    } else toast((r && r.error) || 'สร้างไม่สำเร็จ', 'warn');
  };

  // Tab 4: Alerts
  if ($('al-save')) $('al-save').onclick = async () => {
    const r = await api('/api/admin/settings', {method:'POST', body:{
      alert_discord_webhook:$('al-dc').value.trim(),
      alert_telegram_bot_token:$('al-tg-tok').value.trim(),
      alert_telegram_chat_id:$('al-tg-id').value.trim(),
      alert_line_token:$('al-ln-tok').value.trim(),
      alert_line_target_id:$('al-ln-id').value.trim(),
      alert_on_new_lead:$('al-lead').checked ? '1' : '0',
      alert_on_feedback:$('al-fb').checked ? '1' : '0',
      alert_weekly_digest:$('al-wk').checked ? '1' : '0',
    }});
    if (r && r.ok) { APP.adminSettings = r.settings; toast('บันทึกการแจ้งเตือนมือถือแล้ว ✓', 'ok'); }
    else toast((r && r.error) || 'บันทึกไม่สำเร็จ', 'warn');
  };
  if ($('al-test')) $('al-test').onclick = async () => {
    const r = await api('/api/alerts/test', {method:'POST'});
    toast((r && (r.message || r.error)) || 'ทดสอบแล้ว', r && r.ok ? 'ok' : 'warn');
  };

  // Tab 5: Backups & Doctor
  if ($('bk-now')) $('bk-now').onclick = async () => {
    const r = await api('/api/system/backups', {method:'POST', body:{tag:'manual'}});
    if (r && r.ok) { toast('สำรองฐานข้อมูลเรียบร้อย: ' + r.backup.filename, 'ok'); loadSettingsData(true); }
  };
  $('page').querySelectorAll('[data-brest]').forEach(b => b.onclick = async () => {
    if (!confirm('ยืนยันกู้คืนฐานข้อมูลจาก ' + b.dataset.brest + '?')) return;
    const r = await api('/api/system/restore', {method:'POST', body:{filename:b.dataset.brest}});
    if (r && r.ok) { toast('กู้คืนฐานข้อมูลเรียบร้อย ✓', 'ok'); resetWorkspaceCache(); loadSettingsData(true); }
    else toast((r && r.error) || 'กู้คืนไม่สำเร็จ', 'warn');
  });
  if ($('doc-fix')) $('doc-fix').onclick = async () => {
    const r = await api('/api/system/doctor/fix', {method:'POST'});
    if (r && r.ok) { APP.doctor = r; toast(r.message || 'บำรุงรักษาระบบเรียบร้อย ✓', 'ok'); loadSettingsData(true); }
  };
};

// ---------- 13. GUIDE & ABOUT (Live System Health) ----------
R.guide = function(){
  return pageHead('คู่มือเริ่มใช้งานจริง (Go-Live Checklist)', '4 ขั้นตอนส่งมอบและเปิดใช้งาน PulseMetrics กับข้อมูลจริงขององค์กร') + `
  <div class="grid g2">
    <div class="card">
      <h3>${svg('check-circle')} เช็กลิสต์เริ่มใช้งานจริง 4 ขั้นตอน</h3>
      <div class="row"><span class="chip ac">ขั้นที่ 1</span><span class="t">ไปที่ <b>ตั้งค่า → แบรนด์, ลิขสิทธิ์ &amp; ความปลอดภัย</b> เพื่อเปลี่ยนรหัสผ่าน Admin และเปิด <b>Login Gate</b></span></div>
      <div class="row"><span class="chip ac">ขั้นที่ 2</span><span class="t">ไปที่ <b>ตั้งค่า → เชื่อมต่อ API</b> กด <b>ล้างข้อมูลตัวอย่าง → Live Mode</b> แล้วใส่คีย์ GA4 / GSC / Facebook / YouTube</span></div>
      <div class="row"><span class="chip ac">ขั้นที่ 3</span><span class="t">คัดลอกโค้ด <code>/tracker.js</code> (1 บรรทัด) จากหน้า <b>เว็บเพจ &amp; Google GA</b> ไปแปะบนเว็บไซต์จริง</span></div>
      <div class="row"><span class="chip ac">ขั้นที่ 4</span><span class="t">กด <b>สำรองข้อมูล SQLite</b> ในหน้าตั้งค่า NAS และตั้งแจ้งเตือน Discord/Telegram/LINE สำหรับทีมขาย</span></div>
    </div>
    <div class="card">
      <h3>${svg('bulb')} ขอบเขตการเชื่อมต่อ &amp; คีย์ลัด</h3>
      <div class="row"><span class="chip ok">API ซิงก์อัตโนมัติ</span><span class="t">Google Analytics 4 (GA4), Google Search Console, Facebook Page, YouTube และ Google Sheets 6 ชีต</span></div>
      <div class="row"><span class="chip">TikTok &amp; IG</span><span class="t">รองรับบันทึกโพสต์, ยิงแอด ROAS และวัดคนเข้าเว็บ/ทักแชทผ่านลิงก์ย่อ <code>/go/รหัสโพสต์</code></span></div>
      <div class="row"><span class="chip">คีย์ลัด</span><span class="t"><code>Ctrl+K</code> ค้นหาทั้งระบบ · <code>Alt+T</code> สลับมืด/สว่าง · <code>Alt+N</code> สมุดจดไอเดีย</span></div>
    </div>
  </div>`;
};

R.about = function(){
  const hl = APP.health || {};
  const doc = APP.doctor || {};
  const lic = (hl.license || APP.license || {});
  const cnt = hl.counts || {};
  return pageHead('สถานะระบบ & System Doctor', 'ตรวจสอบความสมบูรณ์ของฐานข้อมูล SQLite, ลิขสิทธิ์ขายขาด และจุดสำรองข้อมูลแบบเรียลไทม์',
    `<button type="button" class="ghost" id="ab-reload">${svg('refresh')} ตรวจใหม่</button>`) + `
  <div class="grid g2">
    <div class="card">
      <h3>${svg('info')} ข้อมูลเซิร์ฟเวอร์จริง</h3>
      <div class="row"><span class="dim">เวอร์ชันระบบ</span><b style="margin-left:auto">PulseMetrics Business v${E(hl.version||'3.2.0')}</b></div>
      <div class="row"><span class="dim">สถานะลิขสิทธิ์</span><span class="chip ${lic.status==='verified'?'ok':'warn'}" style="margin-left:auto">${E(lic.message||'กำลังตรวจสอบ')}</span></div>
      <div class="row"><span class="dim">โหมด SQLite</span><b style="margin-left:auto">${E(hl.journal_mode||'WAL')} (${hl.db_size_kb||0} KB)</b></div>
      <div class="row"><span class="dim">พื้นที่ว่างดิสก์ / NAS</span><b style="margin-left:auto">${hl.disk_free_gb||0} GB / ${hl.disk_total_gb||0} GB</b></div>
      <div class="row"><span class="dim">ข้อมูลในฐานข้อมูล</span><span class="dim" style="margin-left:auto">${fmt(cnt.workspaces)} บริษัท · ${fmt(cnt.leads)} ลีด · ${fmt(cnt.posts)} โพสต์ · ${fmt(cnt.daily_metrics)} แถวสถิติ</span></div>
    </div>
    <div class="card">
      <h3>${svg('wrench')} ผลตรวจ System Doctor (${doc.passed||0}/${doc.total||7} ผ่าน)</h3>
      ${(doc.checks || []).map(ch => `<div class="row"><span class="chip ${ch.ok?'ok':'warn'}">${ch.ok?'ผ่าน':'เตือน'}</span><div class="t"><b>${E(ch.label)}</b><div class="dim">${E(ch.detail)}</div></div></div>`).join('') || '<div class="dim">กำลังตรวจสุขภาพระบบ…</div>'}
    </div>
  </div>`;
};
W.about = function(){
  if (!APP.loaded.settings) loadSettingsData(false);
  if ($('ab-reload')) $('ab-reload').onclick = () => loadSettingsData(true);
};

// Boot the unified production suite!
if (typeof window.PM_BOOT === 'function') window.PM_BOOT();
})();
