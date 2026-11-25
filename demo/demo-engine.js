/* PulseMetrics v3.1.0 — Full Browser Interactive Demo Engine (Zero Backend Required)
 * Intercepts /api/* fetch calls + /report + /quote/{id} + /api/leads/export.csv
 * so visitors on GitHub Pages experience the EXACT Desktop App 100% interactively!
 */
(function () {
  const STORE_KEY = 'pm_live_demo_v31';
  const today = new Date();
  const fmtD = d => d.toISOString().slice(0, 10);
  const addD = (n) => { const x = new Date(today.getTime() + n * 86400000); return fmtD(x); };
  const nowStr = () => new Date().toISOString().slice(0, 16).replace('T', ' ');

  const ROLE_PERMS = {
    executive: ['dashboard', 'leads', 'comments', 'feedback', 'website', 'posts', 'roi', 'strategy', 'goals', 'calendar', 'exports', 'sync', 'settings', 'users', 'branding', 'nas_admin'],
    marketing: ['dashboard', 'leads', 'comments', 'feedback', 'website', 'posts', 'roi', 'strategy', 'goals', 'calendar', 'exports', 'sync', 'settings'],
    chat_admin: ['dashboard', 'leads', 'comments', 'feedback', 'posts'],
  };

  function seedState() {
    const series30 = [], prev30 = [];
    for (let i = 29; i >= 0; i--) {
      const dt = addD(-i), pdt = addD(-i - 30);
      const wave = 0.88 + 0.24 * Math.sin(i * 0.7) + (29 - i) * 0.008;
      const vis = Math.round(760 * wave);
      series30.push({ label: dt.slice(5), dt, visitors: vis, gsc_imp: vis * 9, fb_views: Math.round(vis * 2.8), yt_views: Math.round(vis * 1.9), leads: Math.max(4, Math.round(vis * 0.015)) });
      const pvis = Math.round(620 * (0.9 + 0.2 * Math.cos(i * 0.65)));
      prev30.push({ label: pdt.slice(5), dt: pdt, visitors: pvis, gsc_imp: pvis * 8, fb_views: Math.round(pvis * 2.4), yt_views: Math.round(pvis * 1.6), leads: Math.max(3, Math.round(pvis * 0.013)) });
    }
    return {
      user_id: 1,
      workspace_id: 1,
      nextId: 500,
      settings: {
        brand_name: 'PulseMetrics',
        brand_tagline: 'MKT & Lead Intelligence',
        brand_logo_text: 'PM',
        brand_accent: '#2563eb',
        contact_email: (window.PM_SITE_CONFIG && window.PM_SITE_CONFIG.email) || 'contact@pulsemetrics.th',
        contact_phone: (window.PM_SITE_CONFIG && window.PM_SITE_CONFIG.phone) || '02-000-0000',
        contact_line: (window.PM_SITE_CONFIG && window.PM_SITE_CONFIG.lineId) || '@pulsemetrics',
        contact_fb: (window.PM_SITE_CONFIG && window.PM_SITE_CONFIG.fbName) || 'PulseMetrics Official',
        company_tax_id: '0105569000123',
        company_address: 'กรุงเทพมหานคร ประเทศไทย',
        require_login: '0',
        license_key: 'PM3-PRO-DEMO-LIVE-2026',
        license_edition: 'Business Pro (Interactive Demo)',
        license_holder: 'PulseMetrics Official',
        alert_discord_webhook: '',
        alert_telegram_bot_token: '',
        alert_telegram_chat_id: '',
        alert_line_token: '',
        alert_line_target_id: '',
        alert_on_new_lead: '1',
        alert_on_feedback: '1',
        alert_weekly_digest: '1',
      },
      workspaces: [
        { id: 1, slug: 'pulsemetrics', name: 'PulseMetrics Official (Demo)', website_url: '../', ga4_property_id: 'properties/428190512', gsc_site_url: 'https://pulsemetrics.th/', fb_page_id: '10293847561029', fb_page_name: 'PulseMetrics Official', yt_channel_id: 'UCpulsemetrics', yt_channel_name: 'PulseMetrics Channel', line_oa_id: '@pulsemetrics', gsheet_id: '', gsheet_sync_freq: 'daily', demo_mode: 1 },
        { id: 2, slug: 'demo-enterprise', name: 'Demo Enterprise Co., Ltd. (บริษัทลูกค้าตัวอย่าง)', website_url: '../', ga4_property_id: 'properties/519204811', gsc_site_url: 'https://demo-enterprise.co.th/', fb_page_id: '882910482910', fb_page_name: 'Demo Enterprise TH', yt_channel_id: 'UCdemoEnt', yt_channel_name: 'Demo Enterprise', line_oa_id: '@demo_ent', gsheet_id: '', gsheet_sync_freq: 'manual', demo_mode: 1 },
      ],
      users: [
        { id: 1, email: 'admin@pulsemetrics.local', name: 'Executive Admin', role: 'executive', default_workspace_id: 1, created_at: addD(-30) },
        { id: 2, email: 'mkt@pulsemetrics.local', name: 'Marketing Lead', role: 'marketing', default_workspace_id: 1, created_at: addD(-25) },
        { id: 3, email: 'sales@pulsemetrics.local', name: 'Sales & Chat Admin', role: 'chat_admin', default_workspace_id: 1, created_at: addD(-20) },
      ],
      series30, prev30,
      channels: [
        { channel: 'Google Search', users: 8940, sessions: 10820, leads: 118, share_pct: 36.2, conv_pct: 1.32 },
        { channel: 'Facebook', users: 7180, sessions: 8620, leads: 109, share_pct: 29.1, conv_pct: 1.52 },
        { channel: 'YouTube', users: 3690, sessions: 4410, leads: 52, share_pct: 14.9, conv_pct: 1.41 },
        { channel: 'TikTok', users: 2140, sessions: 2580, leads: 31, share_pct: 8.7, conv_pct: 1.45 },
        { channel: 'Direct', users: 1620, sessions: 1940, leads: 18, share_pct: 6.6, conv_pct: 1.11 },
        { channel: 'LINE OA', users: 1110, sessions: 1320, leads: 24, share_pct: 4.5, conv_pct: 2.16 },
      ],
      pages: [
        { path: '/', title: 'หน้าแรก PulseMetrics — แดชบอร์ดการตลาดองค์กรลิขสิทธิ์ขายขาด', pageviews: 11420, users: 8120, bounce_rate: 36.4, gsc_impressions: 62400, gsc_clicks: 3820, gsc_ctr: 6.12, gsc_position: 3.8, cta_clicks: 284 },
        { path: '/features', title: 'จุดเด่นระบบ GA4 + Search Console + FB + YT + TikTok', pageviews: 7210, users: 5290, bounce_rate: 40.2, gsc_impressions: 44800, gsc_clicks: 2410, gsc_ctr: 5.38, gsc_position: 4.9, cta_clicks: 168 },
        { path: '/license', title: 'ลิขสิทธิ์ขายขาด One-Time License สำหรับองค์กร', pageviews: 5640, users: 4180, bounce_rate: 29.5, gsc_impressions: 32900, gsc_clicks: 2180, gsc_ctr: 6.63, gsc_position: 3.1, cta_clicks: 392 },
        { path: '/blog/ga4-lead-guide', title: 'คู่มือวัดยอดลูกค้าทักจาก Facebook & Google GA4', pageviews: 4190, users: 3120, bounce_rate: 58.6, gsc_impressions: 41200, gsc_clicks: 890, gsc_ctr: 2.16, gsc_position: 8.4, cta_clicks: 74 },
        { path: '/nas', title: 'ติดตั้ง PulseMetrics บน NAS องค์กรทุกรุ่น + Desktop App', pageviews: 3180, users: 2410, bounce_rate: 34.1, gsc_impressions: 24100, gsc_clicks: 1290, gsc_ctr: 5.35, gsc_position: 5.7, cta_clicks: 112 },
        { path: '/contact', title: 'ขอใบเสนอราคา / นัดเดโมระบบ PulseMetrics', pageviews: 2490, users: 1980, bounce_rate: 22.8, gsc_impressions: 12800, gsc_clicks: 940, gsc_ctr: 7.34, gsc_position: 2.4, cta_clicks: 318 },
      ],
      keywords: [
        { keyword: 'วัดยอดลูกค้าทักจาก facebook ga4', landing_page: '/blog/ga4-lead-guide', impressions: 21500, clicks: 290, ctr: 1.35, avg_position: 8.7 },
        { keyword: 'ระบบวิเคราะห์การตลาดองค์กร', landing_page: '/features', impressions: 18400, clicks: 410, ctr: 2.23, avg_position: 6.2 },
        { keyword: 'ทำ marketing dashboard บริษัท', landing_page: '/', impressions: 14200, clicks: 980, ctr: 6.9, avg_position: 3.1 },
        { keyword: 'เชื่อมต่อ google search console dashboard', landing_page: '/features', impressions: 12900, clicks: 220, ctr: 1.71, avg_position: 9.4 },
        { keyword: 'ติดตั้ง dashboard บน nas synology', landing_page: '/nas', impressions: 11200, clicks: 530, ctr: 4.73, avg_position: 4.9 },
        { keyword: 'แดชบอร์ดการตลาด ลิขสิทธิ์ขายขาด', landing_page: '/license', impressions: 9600, clicks: 780, ctr: 8.13, avg_position: 2.8 },
      ],
      posts: [
        { id: 1, workspace_id: 1, platform: 'facebook', title: 'เคสลูกค้าจริง: เปลี่ยนยอดวิวเพจให้กลายเป็นลูกค้าทักเพิ่ม +210% ใน 30 วัน', source_url: 'https://www.facebook.com/', published_at: addD(-5) + ' 11:20', tracking_code: 'fb-case-210', category: 'เคสลูกค้า', reach: 24800, views: 19600, likes: 625, comments_count: 51, shares: 118, web_clicks: 740, leads_count: 34, revenue_thb: 410000 },
        { id: 2, workspace_id: 1, platform: 'facebook', title: 'เปิดตัว PulseMetrics ลิขสิทธิ์ขายขาด — รวม GA4 + Search Console + FB + YT ในจอเดียว!', source_url: 'https://www.facebook.com/', published_at: addD(-2) + ' 10:15', tracking_code: 'fb-q4-promo', category: 'เปิดตัวสินค้า', reach: 18400, views: 14200, likes: 412, comments_count: 38, shares: 64, web_clicks: 520, leads_count: 29, revenue_thb: 320000 },
        { id: 3, workspace_id: 1, platform: 'website', title: 'หน้าลิขสิทธิ์ขายขาด PulseMetrics (/license) — ลูกค้าเสิร์ช Google เข้าตรง', source_url: '../#license', published_at: addD(-7) + ' 09:00', tracking_code: 'web-pricing', category: 'หน้าขาย', reach: 9800, views: 8400, likes: 0, comments_count: 0, shares: 0, web_clicks: 8400, leads_count: 24, revenue_thb: 290000 },
        { id: 4, workspace_id: 1, platform: 'tiktok', title: 'คลิปสั้น 30 วิ: ดูยังไงว่าโพสต์ไหนพาลูกค้าทักแชทเยอะสุด! #การตลาด', source_url: 'https://www.tiktok.com/', published_at: addD(-3) + ' 18:30', tracking_code: 'tt-demo-30s', category: 'คลิปสั้นไวรัล', reach: 42000, views: 38500, likes: 1420, comments_count: 64, shares: 190, web_clicks: 530, leads_count: 19, revenue_thb: 145000 },
        { id: 5, workspace_id: 1, platform: 'youtube', title: 'รีวิวระบบ PulseMetrics วัดยอดลูกค้าทักจาก Facebook + YouTube + GA4 บน NAS (Demo เต็ม)', source_url: 'https://www.youtube.com/', published_at: addD(-4) + ' 15:00', tracking_code: 'yt-demo-full', category: 'รีวิวระบบ', reach: 14500, views: 11800, likes: 480, comments_count: 42, shares: 39, web_clicks: 410, leads_count: 18, revenue_thb: 240000 },
        { id: 6, workspace_id: 1, platform: 'instagram', title: 'IG Reels: แดชบอร์ดองค์กรลิขสิทธิ์ขายขาด ติดตั้งบน NAS ง่ายๆ ใน 3 นาที', source_url: 'https://www.instagram.com/', published_at: addD(-6) + ' 17:10', tracking_code: 'ig-case-reel', category: 'เคสลูกค้า', reach: 26500, views: 21800, likes: 890, comments_count: 38, shares: 95, web_clicks: 410, leads_count: 14, revenue_thb: 130000 },
      ],
      leads: [
        { id: 101, workspace_id: 1, customer_name: 'คุณวรัญญา (Velvet Skin)', contact: 'FB Inbox', channel: 'facebook', source_platform: 'facebook', post_id: 2, tracking_code: 'fb-q4-promo', landing_page: '/license', message: 'ขอใบเสนอราคารุ่น Business Pro + เชื่อม Google Sheets KPI รายเดือนค่ะ', stage: 'new', deal_value: 65000, assignee: '', next_followup: '', created_at: addD(-1) + ' 09:20', updated_at: addD(-1) + ' 09:20' },
        { id: 102, workspace_id: 1, customer_name: 'คุณธนกฤต (บจก. สยามเทค)', contact: '081-234-5678', channel: 'facebook', source_platform: 'facebook', post_id: 2, tracking_code: 'fb-q4-promo', landing_page: '/license', message: 'เห็นโพสต์โปร Q4 ครับ อยากนัดเดโม MKT Dashboard เชื่อม GA4 + FB + YT ครับ', stage: 'quoted', deal_value: 120000, assignee: 'Sales & Chat Admin', next_followup: addD(2), created_at: addD(-2) + ' 11:05', updated_at: addD(-1) + ' 14:30' },
        { id: 103, workspace_id: 1, customer_name: 'คุณพิมพ์ชนก (Lumina Agency)', contact: '@pimchanok', channel: 'line', source_platform: 'facebook', post_id: 1, tracking_code: 'fb-case-210', landing_page: '/features', message: 'อ่านเคสลูกค้าเพิ่มยอดทัก +210% แล้วสนใจมาก อยากใช้ให้ลูกค้า 5 แบรนด์ค่ะ', stage: 'won', deal_value: 180000, assignee: 'Executive Admin', next_followup: '', created_at: addD(-3) + ' 15:40', updated_at: addD(-2) + ' 16:00' },
        { id: 104, workspace_id: 1, customer_name: 'คุณสมชาย (K-Logistics)', contact: 'somchai@klog.co.th', channel: 'website', source_platform: 'youtube', post_id: 5, tracking_code: 'yt-demo-full', landing_page: '/contact', message: 'ดูคลิปเดโมจาก YouTube แล้วกดลิงก์เข้าเว็บครับ อยากติดตั้งบน Synology NAS', stage: 'talking', deal_value: 95000, assignee: 'Sales & Chat Admin', next_followup: addD(1), created_at: addD(-3) + ' 10:15', updated_at: addD(-2) + ' 11:00' },
        { id: 105, workspace_id: 1, customer_name: 'คุณกิตติพงษ์ (BuildPro)', contact: '089-555-0192', channel: 'website', source_platform: 'google', post_id: 3, tracking_code: 'web-pricing', landing_page: '/license', message: 'เสิร์ช Google เจอหน้าลิขสิทธิ์ขายขาดครับ ต้องการวัดผลเว็บ + เพจเฟส + ช่องยูทูป', stage: 'won', deal_value: 145000, assignee: 'Executive Admin', next_followup: '', created_at: addD(-4) + ' 13:22', updated_at: addD(-3) + ' 17:10' },
        { id: 106, workspace_id: 1, customer_name: 'คุณนภัสสร (Urban Home)', contact: '@napassorn_uh', channel: 'tiktok', source_platform: 'tiktok', post_id: 4, tracking_code: 'tt-demo-30s', landing_page: '/features', message: 'เห็นคลิป TikTok 30 วิค่ะ อยากให้ช่วยวางระบบติด UTM ทุกโพสต์', stage: 'talking', deal_value: 85000, assignee: 'Marketing Lead', next_followup: addD(3), created_at: addD(-5) + ' 19:00', updated_at: addD(-4) + ' 10:00' },
      ],
      leadNotes: {
        102: [{ id: 1, author_name: 'Sales & Chat Admin', note: 'ส่งใบเสนอราคา Business Pro และสาธิตหน้าแดชบอร์ดเรียบร้อยแล้ว รอผู้บริหารอนุมัติ', created_at: addD(-1) + ' 14:30' }],
        103: [{ id: 2, author_name: 'Executive Admin', note: 'ยืนยันสั่งซื้อรุ่น Agency White-Label และส่งมอบติดตั้งบน NAS เสร็จสมบูรณ์ ✓', created_at: addD(-2) + ' 16:00' }],
      },
      comments: [
        { id: 201, post_id: 2, platform: 'facebook', author: 'คุณธนกฤต ว.', content: 'สนใจแพ็กเกจองค์กรครับ รองรับติดตั้งบน NAS บริษัทไหมครับ ขอรายละเอียดหน่อย', intent: 'buying', source_url: 'https://www.facebook.com/', created_at: addD(-1) + ' 11:20', replied: 0, reply_text: '', converted_lead_id: null },
        { id: 202, post_id: 1, platform: 'facebook', author: 'คุณพิมพ์ชนก ส.', content: 'อยากได้ระบบวัดยอดทักรายโพสต์แบบนี้เลยครับ ขอเรทราคาขายขาดหน่อย', intent: 'buying', source_url: 'https://www.facebook.com/', created_at: addD(-2) + ' 14:05', replied: 0, reply_text: '', converted_lead_id: null },
        { id: 203, post_id: 5, platform: 'youtube', author: 'Somchai Tech', content: 'เชื่อม GA4 กับ Google Sheets อัตโนมัติได้ไหมครับ ทีมผมใช้อยู่', intent: 'question', source_url: 'https://www.youtube.com/', created_at: addD(-3) + ' 16:40', replied: 0, reply_text: '', converted_lead_id: null },
        { id: 204, post_id: 4, platform: 'tiktok', author: 'Boss K. Marketing', content: 'ชอบมากครับ มีแอป Desktop บน Windows ด้วยไหมครับ', intent: 'buying', source_url: 'https://www.tiktok.com/', created_at: addD(-2) + ' 20:10', replied: 0, reply_text: '', converted_lead_id: null },
      ],
      quickReplies: [
        { id: 1, label: '💰 ส่งข้อมูลราคา/ขายขาด', text: 'ขอบคุณที่สนใจครับ! PulseMetrics เป็นลิขสิทธิ์ขายขาดไม่มีค่ารายเดือน ส่งรายละเอียดรุ่น Standard / Business Pro ให้ทางแชทแล้วครับ', category: 'price' },
        { id: 2, label: '🖥️ รองรับ NAS & Desktop', text: 'รองรับทั้งแอป Windows Desktop และติดตั้งบน NAS ทุกรุ่น (Synology/QNAP/Docker/SMB) ข้อมูลอยู่กับบริษัท 100% ครับ', category: 'nas' },
        { id: 3, label: '📅 นัดเดโม 15 นาที', text: 'ยินดีนัดสาธิตระบบจริง (15 นาที) ให้ทีมบริหารและทีมการตลาดดูพร้อมกันครับ สะดวกวันไหนแจ้งได้เลยครับ', category: 'demo' },
        { id: 4, label: '📊 ซิงก์ GA4 & Sheets', text: 'เชื่อมต่อ GA4, Search Console, FB, YT และส่งออก Google Sheets 6 แท็บได้อัตโนมัติครับ', category: 'feature' },
      ],
      feedbacks: [
        { id: 301, source: 'site_web', sender_name: 'ตัวอย่างฟีดแบคจากเพื่อน', category: 'ux', rating: 5, page_ref: 'demo:dashboard', message: 'แดชบอร์ดสวยและอ่านง่ายมากครับ ชอบกราฟ Hover Tooltip กับปุ่มลากวาง CRM Kanban!', status: 'new', reply_note: '', created_at: addD(-1) + ' 18:00' },
      ],
      campaigns: [
        { id: 401, dt: addD(-3), platform: 'facebook', campaign_name: 'FB Lead Gen — โปรลิขสิทธิ์ขายขาด Q4', tracking_code: 'fb-q4-promo', spend_thb: 24500, impressions: 92000, clicks: 1840, leads_cnt: 34, revenue_thb: 320000, notes: 'CPL ต่ำสุดในกลุ่ม B2B' },
        { id: 402, dt: addD(-6), platform: 'google', campaign_name: 'Google Search — คีย์เวิร์ด Marketing Dashboard', tracking_code: 'web-pricing', spend_thb: 18000, impressions: 38000, clicks: 1120, leads_cnt: 24, revenue_thb: 290000, notes: 'Intent ซื้อสูง ปิดง่าย' },
        { id: 403, dt: addD(-8), platform: 'tiktok', campaign_name: 'TikTok Spark Ads — คลิปรีวิวแดชบอร์ด 30 วิ', tracking_code: 'tt-demo-30s', spend_thb: 12000, impressions: 145000, clicks: 2300, leads_cnt: 19, revenue_thb: 145000, notes: 'Reach สูง ดึงคนเข้าเว็บดี' },
        { id: 404, dt: addD(-11), platform: 'instagram', campaign_name: 'IG Reels — เคสลูกค้าเพิ่มยอดทัก +210%', tracking_code: 'ig-case-reel', spend_thb: 9500, impressions: 64000, clicks: 980, leads_cnt: 14, revenue_thb: 130000, notes: 'เจ้าของแบรนด์ DM เยอะ' },
        { id: 405, dt: addD(-14), platform: 'youtube', campaign_name: 'YouTube Discovery — เดโมระบบบน NAS เต็ม', tracking_code: 'yt-demo-full', spend_thb: 11000, impressions: 48000, clicks: 890, leads_cnt: 18, revenue_thb: 240000, notes: 'ดีลใหญ่ กลุ่มองค์กร' },
      ],
      competitors: [
        { id: 1, brand_name: 'B2B Growth Lab', platform: 'tiktok', title: '3 สัญญาณที่บอกว่ายิงแอดแล้วเงินรั่ว แต่เซลส์ไม่รู้!', source_url: 'https://www.tiktok.com/', views: 94000, engagements: 6800, baseline_views: 22000, notes: 'Hook 3 วิแรกแรงมาก เหมาะทำคลิปสั้นต่อยอด' },
        { id: 2, brand_name: 'AgencyAlpha TH', platform: 'facebook', title: 'เทียบชัดๆ: วางระบบ GA4 + Dashboard ให้ผู้บริหารดูใน 1 หน้า (เคสยอดขายโต 3 เท่า)', source_url: 'https://www.facebook.com/', views: 48500, engagements: 3120, baseline_views: 14000, notes: 'เปิดด้วยตัวเลขผลลัพธ์ + แจกตารางตัวอย่างท้ายโพสต์' },
        { id: 3, brand_name: 'MarTech Pro', platform: 'youtube', title: 'สอนอ่าน Google Search Console หาคีย์เวิร์ดทำเงินใน 10 นาที', source_url: 'https://www.youtube.com/', views: 36200, engagements: 2140, baseline_views: 12500, notes: 'ปกสีตัดกันชัด คำโปรยสั้น 4 คำ' },
        { id: 4, brand_name: 'DataCraft Studio', platform: 'instagram', title: 'Carousel: เช็กลิสต์ตั้ง KPI การตลาด B2B ไตรมาส 4', source_url: 'https://www.instagram.com/', views: 18400, engagements: 1290, baseline_views: 11000, notes: 'สไลด์อ่านง่าย คนกดเซฟสูง' },
      ],
      goals: [
        { id: 1, period_label: fmtD(today).slice(0, 7), period_type: 'month', start_date: fmtD(today).slice(0, 8) + '01', end_date: addD(10), target_visitors: 25000, target_leads: 350, target_conv_pct: 22.0, target_revenue: 850000 },
        { id: 2, period_label: 'Q4-2026', period_type: 'quarter', start_date: '2026-10-01', end_date: '2026-12-31', target_visitors: 75000, target_leads: 980, target_conv_pct: 24.0, target_revenue: 2400000 },
      ],
      calendar: [
        { id: 1, plan_date: addD(1), plan_time: '10:30', platform: 'facebook', title: 'อินโฟกราฟิก: วิธีอ่าน WoW / MoM / YoY ใน 1 นาที', campaign: 'Q4 Awareness', tracking_code: 'fb-wow-info', target_url: '../', status: 'planned', notes: 'ติดลิงก์ /go/fb-wow-info' },
        { id: 2, plan_date: addD(2), plan_time: '14:00', platform: 'youtube', title: 'Case Study: เชื่อม GA4 + Search Console หาคีย์เวิร์ดทำเงิน', campaign: 'Q4 SEO', tracking_code: 'yt-seo-case', target_url: '../', status: 'in_progress', notes: 'ปักหมุดลิงก์คอมเมนต์แรก' },
        { id: 3, plan_date: addD(4), plan_time: '18:00', platform: 'tiktok', title: 'คลิป 30 วิ: ลากวาง CRM Kanban + ออกใบเสนอราคา PDF ใน 1 คลิก', campaign: 'Q4 Product', tracking_code: 'tt-kanban-30s', target_url: '../', status: 'planned', notes: 'เน้น Demo หน้าจอจริง' },
      ],
      ideas: [
        { id: 1, title: 'ทำคลิปสั้น 30 วิ เทียบก่อน-หลังติดลิงก์ /go/ วัดยอดลูกค้าทักรายโพสต์', platform: 'tiktok', tags: 'ไวรัล, Lead Tracking', notes: 'ต่อยอดจาก Outlier คู่แข่ง', status: 'idea' },
        { id: 2, title: 'โพสต์แจก Template ตารางตั้งงบแอด & คำนวณ ROAS/CPL สำหรับผู้บริหาร', platform: 'facebook', tags: 'แจกไฟล์, ROAS', notes: 'ใส่ CTA ทักแชทรับไฟล์', status: 'idea' },
      ],
      backups: [
        { filename: 'pulsemetrics_auto_' + fmtD(today).replace(/-/g, '') + '_080000.db', size_kb: 412.5, created_at: fmtD(today) + ' 08:00:00' },
      ],
      syncLogs: [
        { target: 'backup', status: 'ok', summary: 'สำรองฐานข้อมูลอัตโนมัติ (auto) เสร็จสมบูรณ์', created_at: fmtD(today) + ' 08:00' },
        { target: 'excel', status: 'ok', summary: 'ส่งออกรายงาน 6 แท็บสำเร็จ', created_at: addD(-1) + ' 17:15' },
      ],
    };
  }

  let DB;
  try {
    const saved = localStorage.getItem(STORE_KEY);
    DB = saved ? JSON.parse(saved) : seedState();
    if (!DB || !DB.workspaces || !DB.posts) DB = seedState();
  } catch (e) { DB = seedState(); }
  const saveDB = () => { try { localStorage.setItem(STORE_KEY, JSON.stringify(DB)); } catch (e) {} };
  window.resetPulseDemo = () => { DB = seedState(); saveDB(); location.reload(); };

  const curUser = () => {
    const u = DB.users.find(x => x.id === DB.user_id) || DB.users[0];
    return { user_id: u.id, email: u.email, name: u.name, role: u.role, workspace_id: DB.workspace_id, perms: ROLE_PERMS[u.role] || ROLE_PERMS.executive };
  };
  const curWs = () => DB.workspaces.find(w => w.id === DB.workspace_id) || DB.workspaces[0];

  function calcDashboard(qs) {
    const preset = qs.get('preset') || 'month';
    const cmp = qs.get('compare') || 'auto';
    const scale = (DB.workspace_id === 2 ? 0.58 : 1.0) * (preset === 'day' || preset === 'week' ? 0.26 : preset === 'year' ? 11.4 : 1.0);
    const mult = arr => arr.map(p => ({ ...p, visitors: Math.round(p.visitors * scale / (preset === 'year' ? 11.4 : 1)), gsc_imp: Math.round(p.gsc_imp * scale / (preset === 'year' ? 11.4 : 1)), fb_views: Math.round(p.fb_views * scale / (preset === 'year' ? 11.4 : 1)), yt_views: Math.round(p.yt_views * scale / (preset === 'year' ? 11.4 : 1)), leads: Math.max(1, Math.round(p.leads * scale / (preset === 'year' ? 11.4 : 1))) }));
    const sliceN = (preset === 'day' || preset === 'week') ? 7 : 30;
    const sCur = mult(DB.series30.slice(-sliceN));
    const sPrv = mult(DB.prev30.slice(-sliceN));
    const wonLeads = DB.leads.filter(l => l.stage === 'won');
    const wonRev = wonLeads.reduce((a, b) => a + Number(b.deal_value || 0), 0);
    const cur = {
      visitors: Math.round(24680 * scale), sessions: Math.round(30120 * scale), pageviews: Math.round(68400 * scale), bounce_rate: 37.8,
      gsc_impressions: Math.round(218200 * scale), gsc_clicks: Math.round(11530 * scale), gsc_ctr: 5.28, gsc_position: 5.1,
      fb_views: Math.round(78400 * scale), fb_engagements: Math.round(5240 * scale), fb_leads: Math.round(158 * scale),
      yt_views: Math.round(46900 * scale), yt_engagements: Math.round(2890 * scale), yt_leads: Math.round(74 * scale),
      web_leads: Math.round(112 * scale), total_leads: Math.round(344 * scale),
      won_deals: wonLeads.length, won_revenue: wonRev,
    };
    const deltas = { visitors: 19.2, pageviews: 21.4, gsc_impressions: 24.6, gsc_clicks: 18.8, fb_views: 26.5, yt_views: 15.4, total_leads: 28.4 };
    const cmpLbl = cmp === 'yoy' || preset === 'year' ? 'YoY (เทียบปีก่อน)' : cmp === 'wow' || preset === 'week' || preset === 'day' ? 'WoW (เทียบสัปดาห์ก่อน)' : 'MoM (เทียบเดือนก่อน)';
    const newCnt = DB.leads.filter(l => l.stage === 'new').length;
    const unCmt = DB.comments.filter(c => !c.replied).length;
    const buyCmt = DB.comments.filter(c => !c.replied && c.intent === 'buying').length;
    const posts = DB.posts.map(p => ({ ...p, effective_leads: Math.max(p.leads_count, DB.leads.filter(l => l.post_id === p.id).length), lead_rate_pct: Number((100 * p.leads_count / Math.max(1, p.web_clicks || p.views)).toFixed(2)) })).sort((a, b) => b.effective_leads - a.effective_leads);
    return {
      ok: true, workspace: curWs(),
      range: { start: addD(preset === 'year' ? -364 : sliceN === 7 ? -6 : -29), end: fmtD(today), prev_start: addD(-59), prev_end: addD(-30), preset, compare: cmp, compare_label: cmpLbl },
      current: cur, previous: cur, deltas,
      series: { current: sCur, previous: sPrv },
      channels: DB.channels,
      top_posts: posts,
      advisor: [
        { platform: 'gsc', label: 'Google Search Console', priority: 'high', title: 'คีย์เวิร์ด "วัดยอดลูกค้าทักจาก facebook ga4" เจอบ่อย 21,500 ครั้ง แต่คลิกแค่ 1.35%', action: 'หน้า /blog/ga4-lead-guide อยู่อันดับ #8.7 — ปรับ Title/Meta ให้มีจุดขายหรือราคาจะดันคลิกเพิ่มได้ ~2–3 เท่า', metric: '21,500 Impressions · อันดับ #8.7' },
        { platform: 'ga4', label: 'Google Analytics (GA4)', priority: 'high', title: 'หน้า /blog/ga4-lead-guide คนเข้าดู 4,190 ครั้ง แต่ Bounce Rate สูง 58.6%', action: 'เพิ่มปุ่มทักแชท/ขอใบเสนอราคาแบบลอยด้านบน เพื่อเปลี่ยนคนอ่านบทความเป็นลูกค้าทัก', metric: 'อันดับ 1: Google Search (36.2%)' },
        { platform: 'facebook', label: 'Facebook Page', priority: 'med', title: 'โพสต์แนว "เคสลูกค้า" ทำยอดทักสูงสุด (34 คนทัก)', action: 'ต่อยอดเป็นซีรีส์ 3 ตอน พร้อมติดลิงก์ /go/fb-case-210 และปุ่มส่งข้อความทุกโพสต์', metric: '34 ทัก · ฿410,000' },
        { platform: 'youtube', label: 'YouTube', priority: 'med', title: 'คลิป "รีวิวระบบ PulseMetrics…" พาเข้าเว็บ 410 ครั้ง → ทัก 18 คน', action: 'ปักหมุดคอมเมนต์แรกพร้อมลิงก์ /go/ และตัด Shorts/TikTok 30 วิเชื่อมกลับหน้า /license', metric: '11,800 วิว · 18 ทัก' },
      ],
      health: {
        total: 84, grade: 'A',
        dimensions: [
          { key: 'traffic', label: 'การเติบโตผู้เข้าเว็บ', score: 18, max: 20, note: '+19.2% เทียบช่วงก่อน' },
          { key: 'seo', label: 'พลังค้นหา SEO (GSC)', score: 16, max: 20, note: 'CTR 5.28% · อันดับ #5.1' },
          { key: 'leads', label: 'อัตราเปลี่ยนเป็นคนทัก', score: 17, max: 20, note: '1.39% ของคนเข้าเว็บ' },
          { key: 'sla', label: 'ความไวตอบลูกค้า (SLA)', score: Math.max(8, 20 - newCnt * 3), max: 20, note: `ทักใหม่รอตอบ: ${newCnt} ราย` },
          { key: 'roas', label: 'ความคุ้มค่าแอด (ROAS)', score: 18, max: 20, note: '15.0x ROAS' },
        ],
      },
      morning_brief: [
        { priority: newCnt > 0 ? 'urgent' : 'ok', icon: '💬', title: newCnt > 0 ? `ตอบลูกค้าทักใหม่ที่รออยู่ ${newCnt} ราย` : 'ตอบลูกค้าทักใหม่ครบทุกแชทแล้ว ✓', detail: 'ลองสลับเป็นโหมด Kanban ลากวาง หรือกดออกใบเสนอราคา PDF ได้ทันที', tab: 'leads', btn: 'เปิด CRM แชท →' },
        { priority: buyCmt > 0 ? 'high' : 'ok', icon: '🔥', title: unCmt > 0 ? `ปิดคอมเมนต์สนใจซื้อ ${buyCmt} ข้อความ (ค้างตอบรวม ${unCmt})` : 'ตอบคอมเมนต์ลูกค้าครบแล้ว ✓', detail: 'ลองกดปุ่มคำตอบด่วน 1 คลิก หรือกดคีย์ J/K/R/L เพื่อตอบรัวเร็ว', tab: 'comments', btn: 'เปิดกล่องคอมเมนต์ →' },
        { priority: 'med', icon: '📅', title: `เตรียมลงคอนเทนต์ตามแผนอีก ${DB.calendar.filter(x => x.status !== 'published').length} ชิ้น`, detail: 'ลองเปิด Packaging Lab เช็กคะแนนชื่อไทย 0–100 และ Safe-Zone 4 แพลตฟอร์ม', tab: 'calendar', btn: 'เปิดปฏิทินคอนเทนต์ →' },
      ],
    };
  }

  function jsonResp(obj, status = 200) {
    return new Response(JSON.stringify(obj), { status, headers: { 'Content-Type': 'application/json; charset=utf-8' } });
  }

  // Intercept window.fetch for /api/*
  const origFetch = window.fetch.bind(window);
  window.fetch = async function (input, opts) {
    const urlStr = typeof input === 'string' ? input : (input && input.url) || '';
    if (!urlStr.startsWith('/api/')) return origFetch(input, opts);

    const u = new URL(urlStr, location.origin);
    const path = u.pathname;
    const method = ((opts && opts.method) || 'GET').toUpperCase();
    let body = {};
    if (opts && opts.body && typeof opts.body === 'string') {
      try { body = JSON.parse(opts.body); } catch (e) {}
    }

    if (path === '/api/auth/me') {
      return jsonResp({ ok: true, user: curUser(), workspaces: DB.workspaces, users: DB.users, require_login: false, brand: DB.settings });
    }
    if (path === '/api/auth/login') {
      const usr = DB.users.find(x => x.email.toLowerCase() === String(body.email || '').toLowerCase()) || DB.users[0];
      DB.user_id = usr.id; saveDB();
      return jsonResp({ ok: true, user: curUser() });
    }
    if (path === '/api/auth/logout') return jsonResp({ ok: true });
    if (path === '/api/auth/switch-workspace') {
      DB.workspace_id = Number(body.workspace_id) || 1; saveDB();
      return jsonResp({ ok: true, workspace_id: DB.workspace_id });
    }
    if (path === '/api/dashboard') return jsonResp(calcDashboard(u.searchParams));
    if (path === '/api/website') {
      const ov = calcDashboard(u.searchParams);
      return jsonResp({ ok: true, range: ov.range, current: ov.current, deltas: ov.deltas, pages: DB.pages, keywords: DB.keywords, channels: DB.channels, recent_events: [{ event_type: 'pageview', path: '/demo/', tracking_code: 'fb-q4-promo', created_at: nowStr() }] });
    }
    if (path === '/api/posts') {
      if (method === 'POST') {
        const id = ++DB.nextId, code = (body.tracking_code || (String(body.platform || 'fb').slice(0, 2) + '-' + id)).toLowerCase();
        DB.posts.unshift({ id, workspace_id: DB.workspace_id, platform: body.platform || 'facebook', title: body.title || 'โพสต์ใหม่', source_url: body.source_url || '../', published_at: nowStr(), tracking_code: code, category: body.category || 'แคมเปญ', reach: 0, views: 0, likes: 0, comments_count: 0, shares: 0, web_clicks: 0, leads_count: 0, revenue_thb: 0 });
        saveDB();
        return jsonResp({ ok: true, id, tracking_code: code, tracking_url: '/go/' + code });
      }
      const posts = DB.posts.map(p => ({ ...p, effective_leads: Math.max(p.leads_count, DB.leads.filter(l => l.post_id === p.id).length), lead_rate_pct: Number((100 * p.leads_count / Math.max(1, p.web_clicks || p.views || 1)).toFixed(2)) }));
      return jsonResp({ ok: true, posts });
    }
    const mPost = path.match(/^\/api\/posts\/(\d+)$/);
    if (mPost) {
      const pid = Number(mPost[1]);
      const p = DB.posts.find(x => x.id === pid);
      if (!p) return jsonResp({ ok: false, error: 'ไม่พบโพสต์นี้' }, 404);
      return jsonResp({ ok: true, post: p, comments: DB.comments.filter(c => c.post_id === pid), leads: DB.leads.filter(l => l.post_id === pid) });
    }
    if (path === '/api/leads') {
      if (method === 'POST') {
        if (body.action === 'update') {
          const l = DB.leads.find(x => x.id === Number(body.id));
          if (l) {
            if (body.stage) l.stage = body.stage;
            if (body.deal_value !== undefined) l.deal_value = Number(body.deal_value) || 0;
            if (body.post_id !== undefined) l.post_id = body.post_id ? Number(body.post_id) : null;
            if (body.assignee !== undefined) l.assignee = body.assignee;
            if (body.next_followup !== undefined) l.next_followup = body.next_followup;
            l.updated_at = nowStr(); saveDB();
          }
          return jsonResp({ ok: true });
        }
        const id = ++DB.nextId;
        DB.leads.unshift({ id, workspace_id: DB.workspace_id, customer_name: body.customer_name || 'ลูกค้าใหม่', contact: body.contact || '', channel: body.channel || 'facebook', source_platform: body.channel || 'facebook', post_id: body.post_id ? Number(body.post_id) : null, tracking_code: '', landing_page: '/demo', message: body.message || '', stage: 'new', deal_value: Number(body.deal_value) || 0, assignee: body.assignee || curUser().name, next_followup: body.next_followup || '', created_at: nowStr(), updated_at: nowStr() });
        saveDB(); return jsonResp({ ok: true, id });
      }
      const q = (u.searchParams.get('q') || '').toLowerCase(), sf = u.searchParams.get('stage') || '', cf = u.searchParams.get('channel') || '';
      let rows = DB.leads.map(l => {
        const p = DB.posts.find(x => x.id === l.post_id);
        return { ...l, post_title: p ? p.title : '', post_url: p ? p.source_url : '', notes_count: (DB.leadNotes[l.id] || []).length, sla_overdue: l.stage === 'new' };
      });
      if (sf) rows = rows.filter(r => r.stage === sf);
      if (cf) rows = rows.filter(r => r.channel === cf);
      if (q) rows = rows.filter(r => `${r.customer_name} ${r.contact} ${r.message} ${r.assignee}`.toLowerCase().includes(q));
      const summary = {
        total: DB.leads.length, filtered: rows.length,
        new: DB.leads.filter(r => r.stage === 'new').length,
        talking: DB.leads.filter(r => r.stage === 'talking' || r.stage === 'quoted').length,
        won: DB.leads.filter(r => r.stage === 'won').length,
        won_thb: DB.leads.filter(r => r.stage === 'won').reduce((a, b) => a + Number(b.deal_value || 0), 0),
        pipeline_thb: DB.leads.filter(r => r.stage !== 'won' && r.stage !== 'lost').reduce((a, b) => a + Number(b.deal_value || 0), 0),
      };
      return jsonResp({ ok: true, leads: rows, posts: DB.posts, summary });
    }
    const mLn = path.match(/^\/api\/leads\/(\d+)\/notes$/);
    if (mLn) {
      const lid = Number(mLn[1]), l = DB.leads.find(x => x.id === lid);
      if (!l) return jsonResp({ ok: false, error: 'ไม่พบลูกค้า' }, 404);
      if (method === 'POST') {
        DB.leadNotes[lid] = DB.leadNotes[lid] || [];
        DB.leadNotes[lid].unshift({ id: ++DB.nextId, author_name: curUser().name, note: body.note || '', created_at: nowStr() });
        if (body.assignee !== undefined) l.assignee = body.assignee;
        if (body.next_followup !== undefined) l.next_followup = body.next_followup;
        saveDB(); return jsonResp({ ok: true });
      }
      return jsonResp({ ok: true, lead: l, notes: DB.leadNotes[lid] || [] });
    }
    if (path === '/api/comments') {
      if (method === 'POST') {
        const cm = DB.comments.find(x => x.id === Number(body.id));
        if (cm) { cm.replied = 1; cm.reply_text = body.reply_text || ''; saveDB(); }
        return jsonResp({ ok: true });
      }
      const intF = u.searchParams.get('intent') || '';
      const rows = DB.comments.filter(c => !intF || c.intent === intF).map(c => {
        const p = DB.posts.find(x => x.id === c.post_id);
        return { ...c, post_title: p ? p.title : '', post_code: p ? p.tracking_code : '' };
      });
      return jsonResp({ ok: true, comments: rows });
    }
    if (path === '/api/comments/convert-lead') {
      const cm = DB.comments.find(x => x.id === Number(body.comment_id));
      if (!cm) return jsonResp({ ok: false, error: 'ไม่พบคอมเมนต์' }, 404);
      if (!cm.converted_lead_id) {
        const id = ++DB.nextId;
        DB.leads.unshift({ id, workspace_id: DB.workspace_id, customer_name: cm.author, contact: cm.platform.toUpperCase() + ' Comment', channel: cm.platform === 'youtube' ? 'website' : cm.platform, source_platform: cm.platform, post_id: cm.post_id, tracking_code: '', landing_page: cm.source_url, message: '[จากคอมเมนต์] ' + cm.content, stage: 'new', deal_value: 0, assignee: curUser().name, next_followup: '', created_at: nowStr(), updated_at: nowStr() });
        cm.converted_lead_id = id; saveDB();
      }
      return jsonResp({ ok: true, lead_id: cm.converted_lead_id, message: `แปลงคอมเมนต์ของ ${cm.author} เป็น Lead ใน CRM แล้ว ✓` });
    }
    if (path === '/api/quick-replies') {
      if (method === 'POST') {
        if (body.action === 'delete') DB.quickReplies = DB.quickReplies.filter(x => x.id !== Number(body.id));
        else DB.quickReplies.push({ id: ++DB.nextId, label: body.label || 'คำตอบ', text: body.text || '', category: body.category || 'sales' });
        saveDB(); return jsonResp({ ok: true });
      }
      return jsonResp({ ok: true, replies: DB.quickReplies });
    }
    if (path === '/api/feedback') {
      if (method === 'POST') {
        if (body.action === 'delete') { DB.feedbacks = DB.feedbacks.filter(x => x.id !== Number(body.id)); saveDB(); return jsonResp({ ok: true }); }
        if (body.action === 'update') {
          const f = DB.feedbacks.find(x => x.id === Number(body.id));
          if (f) { if (body.status) f.status = body.status; if (body.reply_note !== undefined) f.reply_note = body.reply_note; saveDB(); }
          return jsonResp({ ok: true });
        }
        const id = ++DB.nextId;
        DB.feedbacks.unshift({ id, source: body.source || 'app', sender_name: body.sender_name || 'เพื่อน (Demo)', category: body.category || 'ux', rating: Number(body.rating) || 5, page_ref: body.page_ref || 'demo', message: body.message || '', status: 'new', reply_note: '', created_at: nowStr() });
        saveDB();
        // Optional forward to real apiBase if configured
        const cfg = window.PM_SITE_CONFIG || {};
        if (cfg.apiBase) { origFetch(cfg.apiBase.replace(/\/+$/, '') + '/api/feedback', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) }).catch(() => {}); }
        return jsonResp({ ok: true, id, message: 'บันทึกฟีดแบคเข้ากล่องใน Demo แล้ว ✓ (ขอบคุณที่ช่วยทดสอบครับ!)' });
      }
      const sf = u.searchParams.get('status') || '', cf = u.searchParams.get('category') || '';
      const rows = DB.feedbacks.filter(x => (!sf || x.status === sf) && (!cf || x.category === cf));
      const avg = DB.feedbacks.length ? Number((DB.feedbacks.reduce((a, b) => a + Number(b.rating || 5), 0) / DB.feedbacks.length).toFixed(1)) : 0;
      return jsonResp({ ok: true, feedbacks: rows, summary: { total: DB.feedbacks.length, new: DB.feedbacks.filter(x => x.status === 'new').length, reviewing: DB.feedbacks.filter(x => x.status === 'reviewing').length, done: DB.feedbacks.filter(x => x.status === 'done').length, avg_rating: avg, latest_id: DB.feedbacks[0] ? DB.feedbacks[0].id : 0 } });
    }
    if (path === '/api/feedback/summary') {
      return jsonResp({ ok: true, new_count: DB.feedbacks.filter(x => x.status === 'new').length, latest: DB.feedbacks[0] || null });
    }
    if (path === '/api/feedback/sync') return jsonResp({ ok: true, imported: 0, message: 'โหมด Live Demo ออนไลน์ — ฟีดแบคทั้งหมดแสดงในกล่องนี้ทันทีครับ ✓' });
    if (path === '/api/roi') {
      if (method === 'POST') {
        if (body.action === 'delete') DB.campaigns = DB.campaigns.filter(x => x.id !== Number(body.id));
        else DB.campaigns.unshift({ id: ++DB.nextId, dt: body.dt || fmtD(today), platform: body.platform || 'facebook', campaign_name: body.campaign_name || 'แคมเปญใหม่', tracking_code: body.tracking_code || '', spend_thb: Number(body.spend_thb) || 0, impressions: Number(body.impressions) || 0, clicks: Number(body.clicks) || 0, leads_cnt: Number(body.leads_cnt) || 0, revenue_thb: Number(body.revenue_thb) || 0, notes: body.notes || '' });
        saveDB(); return jsonResp({ ok: true });
      }
      const camps = DB.campaigns.map(c => ({ ...c, cpl: c.leads_cnt ? Math.round(c.spend_thb / c.leads_cnt) : 0, roas: c.spend_thb ? Number((c.revenue_thb / c.spend_thb).toFixed(2)) : 0, ctr: c.impressions ? Number((100 * c.clicks / c.impressions).toFixed(2)) : 0 }));
      const sp = camps.reduce((a, b) => a + b.spend_thb, 0), rv = camps.reduce((a, b) => a + b.revenue_thb, 0), ld = camps.reduce((a, b) => a + b.leads_cnt, 0), ck = camps.reduce((a, b) => a + b.clicks, 0);
      const won = DB.leads.filter(l => l.stage === 'won').length || 1;
      const byP = {};
      camps.forEach(c => { const b = byP[c.platform] || (byP[c.platform] = { platform: c.platform, spend_thb: 0, leads_cnt: 0, revenue_thb: 0 }); b.spend_thb += c.spend_thb; b.leads_cnt += c.leads_cnt; b.revenue_thb += c.revenue_thb; });
      const platforms = Object.values(byP).map(b => ({ ...b, cpl: b.leads_cnt ? Math.round(b.spend_thb / b.leads_cnt) : 0, roas: b.spend_thb ? Number((b.revenue_thb / b.spend_thb).toFixed(2)) : 0 })).sort((a, b) => b.revenue_thb - a.revenue_thb);
      return jsonResp({ ok: true, summary: { spend_thb: sp, clicks: ck, leads_cnt: ld, won_deals: won, revenue_thb: rv, cpl: ld ? Math.round(sp / ld) : 0, cac: Math.round(sp / won), roas: sp ? Number((rv / sp).toFixed(2)) : 0, roi_pct: sp ? Number((100 * (rv - sp) / sp).toFixed(1)) : 0 }, platforms, campaigns: camps });
    }
    if (path === '/api/competitors') {
      if (method === 'POST') {
        if (body.action === 'delete') DB.competitors = DB.competitors.filter(x => x.id !== Number(body.id));
        else DB.competitors.unshift({ id: ++DB.nextId, brand_name: body.brand_name || 'คู่แข่ง', platform: body.platform || 'facebook', title: body.title || '', source_url: body.source_url || '', views: Number(body.views) || 0, engagements: 0, baseline_views: Number(body.baseline_views) || 5000, notes: body.notes || '' });
        saveDB(); return jsonResp({ ok: true });
      }
      const rows = DB.competitors.map(c => { const x = Number((c.views / Math.max(1, c.baseline_views)).toFixed(2)); return { ...c, outlier_x: x, is_outlier: x >= 2.2 }; }).sort((a, b) => b.outlier_x - a.outlier_x);
      return jsonResp({ ok: true, competitors: rows, outliers_count: rows.filter(x => x.is_outlier).length });
    }
    if (path === '/api/goals') {
      if (method === 'POST') {
        DB.goals.unshift({ id: ++DB.nextId, ...body }); saveDB();
      }
      const goals = DB.goals.map(g => {
        const aVis = Math.round(g.target_visitors * 0.86), aLd = Math.round(g.target_leads * 0.91), aRev = Math.round(g.target_revenue * 0.82);
        return { ...g, elapsed_days: 22, total_days: 30, actual: { visitors: aVis, leads: aLd, conv_pct: 21.5, revenue: aRev }, forecast: { visitors: Math.round(aVis * 1.32), leads: Math.round(aLd * 1.32), revenue: Math.round(aRev * 1.32) }, pct: { visitors: 86, leads: 91, conv_pct: 95, revenue: 82 }, on_track: true };
      });
      return jsonResp({ ok: true, goals });
    }
    if (path === '/api/calendar') {
      if (method === 'POST') {
        if (body.action === 'delete') DB.calendar = DB.calendar.filter(x => x.id !== Number(body.id));
        else if (body.action === 'status') { const it = DB.calendar.find(x => x.id === Number(body.id)); if (it) it.status = body.status; }
        else if (body.action === 'move') { const it = DB.calendar.find(x => x.id === Number(body.id)); if (it) it.plan_date = body.plan_date; }
        else { const code = body.tracking_code || ('pm-' + (++DB.nextId)); DB.calendar.push({ id: ++DB.nextId, plan_date: body.plan_date || addD(1), plan_time: body.plan_time || '10:30', platform: body.platform || 'facebook', title: body.title || 'คอนเทนต์ใหม่', campaign: body.campaign || 'แคมเปญ', tracking_code: code, target_url: body.target_url || '../', status: 'planned', notes: 'Auto UTM Demo' }); saveDB(); return jsonResp({ ok: true, tracking_url: '/go/' + code }); }
        saveDB(); return jsonResp({ ok: true });
      }
      return jsonResp({ ok: true, items: DB.calendar });
    }
    if (path === '/api/evergreen') {
      return jsonResp({ ok: true, posts: DB.posts.map(p => ({ ...p, age_days: 38, repost_tip: 'รีโพสต์ซ้ำได้เลย (>30 วัน)' })) });
    }
    if (path === '/api/ideas') {
      if (method === 'POST') {
        if (body.action === 'delete') DB.ideas = DB.ideas.filter(x => x.id !== Number(body.id));
        else if (body.action === 'to_calendar') {
          const it = DB.ideas.find(x => x.id === Number(body.id));
          if (it) { it.status = 'planned'; const pdate = addD(2), code = 'id-' + (++DB.nextId); DB.calendar.push({ id: ++DB.nextId, plan_date: pdate, plan_time: '10:30', platform: it.platform, title: it.title, campaign: it.tags || 'Idea Pad', tracking_code: code, target_url: '../', status: 'planned', notes: it.notes }); saveDB(); return jsonResp({ ok: true, plan_date: pdate, tracking_url: '/go/' + code }); }
        } else { DB.ideas.unshift({ id: ++DB.nextId, title: body.title || '', platform: body.platform || 'facebook', tags: body.tags || '', notes: body.notes || '', status: 'idea' }); }
        saveDB(); return jsonResp({ ok: true });
      }
      return jsonResp({ ok: true, ideas: DB.ideas });
    }
    if (path === '/api/search') {
      const q = (u.searchParams.get('q') || '').toLowerCase();
      return jsonResp({
        ok: true, query: q,
        leads: DB.leads.filter(l => `${l.customer_name} ${l.message}`.toLowerCase().includes(q)).slice(0, 6),
        posts: DB.posts.filter(p => `${p.title} ${p.tracking_code}`.toLowerCase().includes(q)).slice(0, 6),
        keywords: DB.keywords.filter(k => k.keyword.toLowerCase().includes(q)).slice(0, 6),
        campaigns: DB.campaigns.filter(c => c.campaign_name.toLowerCase().includes(q)).slice(0, 6),
      });
    }
    if (path === '/api/workspace') {
      if (method === 'POST') {
        if (body.action === 'create_workspace') {
          const id = ++DB.nextId; DB.workspaces.push({ id, slug: 'ws-' + id, name: body.name || 'บริษัทใหม่', website_url: body.website_url || '', demo_mode: 1, gsheet_sync_freq: 'manual' }); saveDB(); return jsonResp({ ok: true, workspace_id: id });
        }
        Object.assign(curWs(), body); saveDB(); return jsonResp({ ok: true });
      }
      return jsonResp({ ok: true, workspace: { ...curWs(), api_config_status: { google_service_account_json: { configured: false, preview: '' }, fb_page_token: { configured: false, preview: '' }, yt_api_key: { configured: false, preview: '' }, line_channel_secret: { configured: false, preview: '' }, fb_verify_token: { configured: false, preview: '' } } }, sync_logs: DB.syncLogs, data_dir: 'Browser Interactive Demo (localStorage)' });
    }
    if (path === '/api/users') {
      if (method === 'POST') {
        if (body.action === 'create') DB.users.push({ id: ++DB.nextId, name: body.name, email: body.email, role: body.role || 'marketing', created_at: fmtD(today) });
        else if (body.action === 'update') { const usr = DB.users.find(x => x.id === Number(body.id)); if (usr && body.role) usr.role = body.role; }
        else if (body.action === 'delete') DB.users = DB.users.filter(x => x.id !== Number(body.id));
        saveDB(); return jsonResp({ ok: true });
      }
      return jsonResp({ ok: true, users: DB.users });
    }
    if (path === '/api/admin/settings') {
      if (method === 'POST') { Object.assign(DB.settings, body); saveDB(); }
      return jsonResp({ ok: true, settings: DB.settings, license: { valid: true, status: 'verified', message: 'Interactive Web Demo (เวอร์ชันสมบูรณ์ v3.1.0)' } });
    }
    if (path === '/api/admin/license/verify') return jsonResp({ ok: true, license: { valid: true, message: 'โหมด Demo ออนไลน์ — เวอร์ชันจริงรองรับตรวจสอบ Signed Key ออฟไลน์ ✓' } });
    if (path === '/api/system/health') return jsonResp({ ok: true, version: '3.1.0 (Web Demo)', data_dir: 'Browser Demo Mode', db_size_kb: 412.5, journal_mode: 'WAL', smb_mode: false, disk_free_gb: 248.4, disk_total_gb: 500, backup_count: DB.backups.length, scheduler: { running: true, ticks: 12 }, counts: { posts: DB.posts.length, leads: DB.leads.length } });
    if (path === '/api/system/doctor' || path === '/api/system/doctor/fix') {
      return jsonResp({ ok: true, score: 100, passed: 7, total: 7, message: 'ซ่อมและตรวจสุขภาพระบบครบ 7/7 จุดแล้ว ✓', checks: [
        { label: 'ความสมบูรณ์ฐานข้อมูล SQLite', ok: true, detail: 'PRAGMA integrity_check: OK' },
        { label: 'ความสะอาด Session ล็อกอิน', ok: true, detail: 'ไม่มี Session ตกค้าง' },
        { label: 'บัญชีผู้บริหาร (Executive RBAC)', ok: true, detail: `${DB.workspaces.length} Workspaces · 1 บัญชี Executive` },
        { label: 'พื้นที่ว่างดิสก์ / NAS', ok: true, detail: 'ว่าง 248.4 / 500 GB' },
        { label: 'จุดสำรองฐานข้อมูล (SQLite Backup)', ok: true, detail: `มี ${DB.backups.length} ไฟล์ล่าสุด` },
        { label: 'โหมดจัดเก็บฐานข้อมูล (WAL / SMB)', ok: true, detail: 'โหมด WAL พร้อมใช้งาน' },
        { label: 'สถานะลิขสิทธิ์ขายขาด (License)', ok: true, detail: 'Interactive Demo v3.1.0 ✓' },
      ] });
    }
    if (path === '/api/system/backups') {
      if (method === 'POST') { const bk = { filename: 'pulsemetrics_demo_' + fmtD(today).replace(/-/g, '') + '.db', size_kb: 415.2, created_at: nowStr() }; DB.backups.unshift(bk); saveDB(); return jsonResp({ ok: true, backup: bk }); }
      return jsonResp({ ok: true, backups: DB.backups });
    }
    if (path === '/api/connectors/test' || path === '/api/connectors/sync' || path === '/api/alerts/test' || path === '/api/alerts/digest') {
      return jsonResp({ ok: true, synced_ok: 4, skipped: 0, message: 'โหมด Demo ออนไลน์ — ในเวอร์ชันติดตั้งบน Windows/NAS จะเชื่อมต่อ API จริงและแจ้งเตือนมือถือได้ทันที ✓' });
    }
    if (path === '/api/export/gsheets') return jsonResp({ ok: true, mode: 'demo', message: 'ในเวอร์ชันติดตั้งจริงจะซิงก์ครบ 6 แท็บขึ้น Google Sheets อัตโนมัติ (ลองกดดูรายงาน PDF หรือการ์ดสรุป PNG ได้เลยครับ ✓)' });
    return jsonResp({ ok: true });
  };

  // Intercept /report, /quote/{id}, /api/export/excel, /api/leads/export.csv so they work with ZERO 404s on GitHub Pages!
  function openPrintableHtml(htmlStr) {
    const w = window.open('', '_blank');
    if (w) { w.document.open(); w.document.write(htmlStr); w.document.close(); }
  }
  function downloadCsvLeads() {
    const hdr = ['ID', 'ชื่อลูกค้า', 'ติดต่อ', 'ช่องทาง', 'สถานะ', 'มูลค่า (บาท)', 'ผู้ดูแล', 'ข้อความ'];
    const lines = [hdr.join(','), ...DB.leads.map(l => [l.id, `"${(l.customer_name || '').replace(/"/g, '""')}"`, `"${(l.contact || '').replace(/"/g, '""')}"`, l.channel, l.stage, l.deal_value, `"${(l.assignee || '').replace(/"/g, '""')}"`, `"${(l.message || '').replace(/"/g, '""')}"`].join(','))];
    const blob = new Blob(['\ufeff' + lines.join('\n')], { type: 'text/csv;charset=utf-8' });
    const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = 'PulseMetrics_Demo_Leads.csv'; a.click();
  }
  function renderDemoReport() {
    const ov = calcDashboard(new URLSearchParams('preset=month&compare=mom'));
    const c = ov.current, b = DB.settings;
    openPrintableHtml(`<!doctype html><html lang="th"><head><meta charset="utf-8"><title>${b.brand_name} Executive Report</title><style>body{font-family:"Noto Sans Thai","Segoe UI",sans-serif;background:#e2e8f0;margin:0;padding:20px;color:#0f172a}.s{max-width:860px;margin:0 auto;background:#fff;padding:30px 34px;border-radius:16px}.g{display:grid;grid-template-columns:repeat(3,1fr);gap:10px;margin:14px 0}.k{border:1px solid #cbd5e1;border-radius:10px;padding:12px;background:#f8fafc}.k b{font-size:22px;display:block}table{width:100%;border-collapse:collapse;font-size:13px}th,td{padding:8px;border-bottom:1px solid #e2e8f0;text-align:left}th{background:#f1f5f9}.btn{background:#2563eb;color:#fff;border:0;padding:9px 16px;border-radius:9px;font-weight:700;cursor:pointer}@media print{body{background:#fff;padding:0}.no-p{display:none}}</style></head><body><div class="s"><div style="display:flex;justify-content:space-between;align-items:center;border-bottom:2px solid #0f172a;padding-bottom:14px"><div><h1 style="margin:0;font-size:22px">รายงานสรุปผู้บริหาร — ${ov.workspace.name}</h1><div style="color:#475569">ช่วง ${ov.range.start} ถึง ${ov.range.end} (${ov.range.compare_label})</div></div><button class="btn no-p" onclick="window.print()">🖨️ พิมพ์ / บันทึก PDF</button></div><div class="g"><div class="k"><small>ลูกค้าทักรวม</small><b style="color:#16a34a">${c.total_leads} คน</b></div><div class="k"><small>ผู้เข้าชมเว็บ (GA4)</small><b>${c.visitors.toLocaleString()}</b></div><div class="k"><small>ปิดการขาย CRM</small><b style="color:#2563eb">฿${c.won_revenue.toLocaleString()}</b></div></div><h3>โพสต์ที่พาลูกค้าทักสูงสุด</h3><table><tr><th>ช่องทาง</th><th>ชื่อโพสต์</th><th>ยอดชม</th><th>คนทัก</th><th>ยอดปิด</th></tr>${ov.top_posts.map(p => `<tr><td>${p.platform.toUpperCase()}</td><td>${p.title}</td><td>${p.views.toLocaleString()}</td><td><b>${p.effective_leads}</b></td><td>฿${p.revenue_thb.toLocaleString()}</td></tr>`).join('')}</table></div></body></html>`);
  }
  function renderDemoQuote(lid) {
    const l = DB.leads.find(x => x.id === Number(lid)) || DB.leads[0];
    const amt = Number(l.deal_value || 65000), vat = amt * 0.07, grand = amt + vat, b = DB.settings;
    openPrintableHtml(`<!doctype html><html lang="th"><head><meta charset="utf-8"><title>ใบเสนอราคา QT-${l.id}</title><style>body{font-family:"Noto Sans Thai","Segoe UI",sans-serif;background:#e2e8f0;margin:0;padding:20px;color:#0f172a}.s{max-width:800px;margin:0 auto;background:#fff;padding:32px 36px;border-radius:16px}table{width:100%;border-collapse:collapse;margin:16px 0}th,td{padding:10px;border-bottom:1px solid #cbd5e1;text-align:left}th{background:#0f172a;color:#fff}.r{text-align:right}.btn{background:#2563eb;color:#fff;border:0;padding:9px 16px;border-radius:9px;font-weight:700;cursor:pointer}@media print{body{background:#fff;padding:0}.no-p{display:none}}</style></head><body><div class="s"><div style="display:flex;justify-content:space-between;border-bottom:2px solid #0f172a;padding-bottom:14px"><div><b style="font-size:20px">${b.license_holder}</b><div style="color:#475569;font-size:13px">${b.company_address} · เลขผู้เสียภาษี ${b.company_tax_id}</div></div><div style="text-align:right"><h1 style="margin:0;color:#2563eb">ใบเสนอราคา</h1><div>เลขที่ QT-2026-${l.id} · วันที่ ${fmtD(today)}</div><button class="btn no-p" style="margin-top:8px" onclick="window.print()">🖨️ พิมพ์ / บันทึก PDF</button></div></div><p><b>เสนอให้แก่:</b> ${l.customer_name} (${l.contact})</p><table><tr><th>รายการ</th><th class="r">จำนวน</th><th class="r">ราคา (บาท)</th></tr><tr><td contenteditable="true"><b>ชุดระบบ ${b.brand_name} (ลิขสิทธิ์ขายขาด One-Time License)</b><div style="font-size:12.5px;color:#475569">${l.message}</div></td><td class="r">1 ชุด</td><td class="r">฿${amt.toLocaleString()}</td></tr></table><div style="width:280px;margin-left:auto"><div style="display:flex;justify-content:space-between;padding:5px 0"><span>รวมเป็นเงิน</span><b>฿${amt.toLocaleString()}</b></div><div style="display:flex;justify-content:space-between;padding:5px 0"><span>VAT 7%</span><b>฿${vat.toLocaleString()}</b></div><div style="display:flex;justify-content:space-between;padding:8px 0;border-top:2px solid #0f172a;font-size:17px;font-weight:800;color:#2563eb"><span>ยอดสุทธิ</span><span>฿${grand.toLocaleString()}</span></div></div></div></body></html>`);
  }

  const origOpen = window.open.bind(window);
  window.open = function (url, target, feats) {
    const s = String(url || '');
    if (s.startsWith('/report')) { renderDemoReport(); return null; }
    if (s.startsWith('/api/export/excel')) { downloadCsvLeads(); return null; }
    const mq = s.match(/^\/quote\/(\d+)/);
    if (mq) { renderDemoQuote(mq[1]); return null; }
    return origOpen(url, target, feats);
  };

  document.addEventListener('click', (ev) => {
    const a = ev.target && ev.target.closest ? ev.target.closest('a[href]') : null;
    if (!a) return;
    const h = a.getAttribute('href') || '';
    if (h.startsWith('/quote/')) { ev.preventDefault(); renderDemoQuote(h.split('/')[2]); }
    else if (h === '/api/leads/export.csv') { ev.preventDefault(); downloadCsvLeads(); }
    else if (h.startsWith('/go/')) { ev.preventDefault(); if (window.toast) window.toast('ลิงก์ติดตาม ' + h + ' (เวอร์ชันติดตั้งจริงจะ Redirect พร้อมเก็บ UTM เข้าโพสต์นี้อัตโนมัติ)'); }
    else if (h === '/site') { ev.preventDefault(); location.href = '../'; }
  });
})();
