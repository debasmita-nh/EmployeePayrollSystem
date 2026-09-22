/* =====================================================
   Employee Payroll System — Project 04
   Vanilla JavaScript · data persisted in localStorage
   ===================================================== */
(function () {
  'use strict';

  /* ---------------- constants & state ---------------- */
  const STORAGE_KEY = 'eps_employees_v1';
  const DEPARTMENTS = ['Engineering', 'Human Resources', 'Finance', 'Marketing', 'Sales', 'Operations'];

  const SAMPLE = [
    { id: 'EMP001', name: 'Linthoi Chanu Laishram', email: 'linthoi.l@bluewave.in',    department: 'Engineering',     position: 'Chief Technology Officer',     basic: 125000, hra: 45000, allow: 18000, pf: 9375,  tax: 22500, ded: 1200, joinDate: '2019-03-04' },
    { id: 'EMP002', name: 'Mutum Bijoy Singh',      email: 'bijoy.mutum@bluewave.in',  department: 'Operations',      position: 'Operations Manager',           basic: 72000,  hra: 26000, allow: 11000, pf: 5400,  tax: 7800,  ded: 900,  joinDate: '2020-01-15' },
    { id: 'EMP003', name: 'Ananya Sharma',          email: 'ananya.sharma@bluewave.in', department: 'Engineering',     position: 'Senior Software Engineer',     basic: 62000,  hra: 22000, allow: 8500,  pf: 4650,  tax: 5200,  ded: 800,  joinDate: '2022-04-18' },
    { id: 'EMP004', name: 'Rohan Mehta',            email: 'rohan.mehta@bluewave.in',  department: 'Finance',         position: 'Accounts Manager',             basic: 55000,  hra: 18000, allow: 6000,  pf: 4125,  tax: 4800,  ded: 500,  joinDate: '2021-01-11' },
    { id: 'EMP005', name: 'Priya Devi Nameirakpam', email: 'priya.n@bluewave.in',      department: 'Human Resources', position: 'HR Head',                      basic: 68000,  hra: 24000, allow: 7500,  pf: 5100,  tax: 6500,  ded: 700,  joinDate: '2020-07-20' },
    { id: 'EMP006', name: 'Karan Singh',            email: 'karan.singh@bluewave.in',  department: 'Sales',           position: 'Sales Head',                   basic: 68000,  hra: 23000, allow: 12000, pf: 5100,  tax: 6900,  ded: 1000, joinDate: '2020-09-21' },
    { id: 'EMP007', name: 'Meena Bishnoi',          email: 'meena.bishnoi@bluewave.in', department: 'Marketing',       position: 'Marketing Executive',          basic: 45000,  hra: 15000, allow: 6500,  pf: 3375,  tax: 3000,  ded: 400,  joinDate: '2024-02-15' },
    { id: 'EMP008', name: 'Thangjam Sanajaoba',     email: 's.thangjam@bluewave.in',   department: 'Engineering',     position: 'Frontend Developer',           basic: 48000,  hra: 16000, allow: 5500,  pf: 3600,  tax: 2700,  ded: 400,  joinDate: '2023-06-01' },
    { id: 'EMP009', name: 'Sorokhaibam Nirmala',    email: 'n.sorokhai@bluewave.in',   department: 'Finance',         position: 'Junior Accountant',            basic: 32000,  hra: 11000, allow: 3500,  pf: 2400,  tax: 900,   ded: 250,  joinDate: '2024-08-12' },
    { id: 'EMP010', name: 'Athokpam Johnson',       email: 'j.athokpam@bluewave.in',   department: 'Engineering',     position: 'Backend Developer',            basic: 52000,  hra: 18000, allow: 6000,  pf: 3900,  tax: 3500,  ded: 500,  joinDate: '2022-11-09' },
    { id: 'EMP011', name: 'Deepti Talukdar',        email: 'deepti.t@bluewave.in',     department: 'Marketing',       position: 'Digital Marketing Lead',       basic: 58000,  hra: 20000, allow: 8000,  pf: 4350,  tax: 4500,  ded: 600,  joinDate: '2021-12-28' },
    { id: 'EMP012', name: 'Yumlembam Roshan',       email: 'roshan.y@bluewave.in',     department: 'Sales',           position: 'Area Sales Executive',         basic: 38000,  hra: 13000, allow: 9500,  pf: 2850,  tax: 1800,  ded: 800,  joinDate: '2023-03-22' },
    { id: 'EMP013', name: 'Salam Ongbi Devi',       email: 's.devi@bluewave.in',       department: 'Operations',      position: 'Office Administrator',         basic: 28000,  hra: 10000, allow: 3000,  pf: 2100,  tax: 500,   ded: 200,  joinDate: '2024-01-02' }
  ];

  const state = {
    employees: [],
    query: '',
    dept: 'all',
    editingId: null
  };

  /* ---------------- tiny helpers ---------------- */
  const $ = (sel) => document.querySelector(sel);

  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, (c) => ({
      '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
    })[c]);
  }
  const fmt = (n) => '₹' + (Number(n) || 0).toLocaleString('en-IN');
  const num = (v) => { const n = parseFloat(v); return Number.isFinite(n) && n >= 0 ? n : 0; };
  const monthYear = (d) => d.toLocaleDateString('en-IN', { month: 'long', year: 'numeric' });
  const initials = (name) => {
    const p = String(name || '?').trim().split(/\s+/);
    return ((p[0] ? p[0][0] : '') + (p[1] ? p[1][0] : '')).toUpperCase();
  };

  /* salary math */
  const grossOf = (e) => (e.basic || 0) + (e.hra || 0) + (e.allow || 0);
  const dedOf   = (e) => (e.pf || 0) + (e.tax || 0) + (e.ded || 0);
  const netOf   = (e) => grossOf(e) - dedOf(e);

  /* Indian-style number → words (lakh / crore) */
  const ONES = ['','One','Two','Three','Four','Five','Six','Seven','Eight','Nine','Ten','Eleven','Twelve','Thirteen','Fourteen','Fifteen','Sixteen','Seventeen','Eighteen','Nineteen'];
  const TENS = ['','Ten','Twenty','Thirty','Forty','Fifty','Sixty','Seventy','Eighty','Ninety'];
  function two(n) { return n < 20 ? ONES[n] : TENS[Math.floor(n / 10)] + (n % 10 ? ' ' + ONES[n % 10] : ''); }
  function three(n) {
    let s = '';
    if (n >= 100) { s = ONES[Math.floor(n / 100)] + ' Hundred' + (n % 100 ? ' ' : ''); n %= 100; }
    if (n) s += two(n);
    return s.trim();
  }
  function inrWords(n) {
    n = Math.round(Number(n) || 0);
    if (n === 0) return 'Zero Rupees Only';
    let out = '';
    const crore = Math.floor(n / 10000000); n %= 10000000;
    const lakh = Math.floor(n / 100000); n %= 100000;
    const thousand = Math.floor(n / 1000); n %= 1000;
    if (crore) out += two(crore) + ' Crore ';
    if (lakh) out += two(lakh) + ' Lakh ';
    if (thousand) out += two(thousand) + ' Thousand ';
    if (n) out += three(n) + ' ';
    return (out.trim() + ' Rupees Only').replace(/\s+/g, ' ');
  }

  /* ---------------- persistence (Save payroll data) ---------------- */
  function load() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      const arr = raw ? JSON.parse(raw) : [];
      return Array.isArray(arr) ? arr : [];
    } catch (e) { return []; }
  }
  function save() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state.employees));
    const t = new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
    const el = $('#lastSaved');
    if (el) el.textContent = t + ' today';
  }

  function nextId() {
    let max = 0;
    state.employees.forEach((e) => {
      const m = /EMP-?(\d+)/i.exec(e.id || '');
      if (m) max = Math.max(max, parseInt(m[1], 10));
    });
    return 'EMP' + String(max + 1).padStart(3, '0');
  }

  /* ---------------- rendering ---------------- */
  const ICONS = {
    slip:  '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6"/><path d="M8 13h8M8 17h5"/></svg>',
    edit:  '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M17 3a2.8 2.8 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5z"/></svg>',
    trash: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 6h18"/><path d="M8 6V4a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v2"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"/><path d="M10 11v6M14 11v6"/></svg>'
  };

  function rowHTML(e) {
    return `<tr data-id="${esc(e.id)}">
      <td>
        <div class="emp-cell">
          <span class="avatar">${esc(initials(e.name))}</span>
          <div><b>${esc(e.name)}</b><small>${esc(e.id)} · ${esc(e.email || '—')}</small></div>
        </div>
      </td>
      <td><span class="pill">${esc(e.department)}</span></td>
      <td class="pos">${esc(e.position)}</td>
      <td class="num">${fmt(e.basic)}</td>
      <td class="num">${fmt((e.hra || 0) + (e.allow || 0))}</td>
      <td class="num">${fmt(dedOf(e))}</td>
      <td class="num net">${fmt(netOf(e))}</td>
      <td>
        <div class="row-actions">
          <button class="icon-btn" data-action="slip" data-id="${esc(e.id)}" title="Generate payslip" aria-label="Generate payslip for ${esc(e.name)}">${ICONS.slip}</button>
          <button class="icon-btn" data-action="edit" data-id="${esc(e.id)}" title="Edit employee" aria-label="Edit ${esc(e.name)}">${ICONS.edit}</button>
          <button class="icon-btn danger" data-action="delete" data-id="${esc(e.id)}" title="Delete employee" aria-label="Delete ${esc(e.name)}">${ICONS.trash}</button>
        </div>
      </td>
    </tr>`;
  }

  function filtered() {
    const q = state.query.trim().toLowerCase();
    return state.employees.filter((e) => {
      if (state.dept !== 'all' && e.department !== state.dept) return false;
      if (!q) return true;
      return [e.id, e.name, e.email, e.department, e.position]
        .some((v) => (v || '').toLowerCase().includes(q));
    });
  }

  function updateStats() {
    const es = state.employees;
    $('#statCount').textContent = es.length;
    $('#statPayroll').textContent = fmt(es.reduce((s, e) => s + netOf(e), 0));
    $('#statAllow').textContent = fmt(es.reduce((s, e) => s + (e.hra || 0) + (e.allow || 0), 0));
    $('#statDed').textContent = fmt(es.reduce((s, e) => s + dedOf(e), 0));
  }

  function renderEmpty(hasVisible) {
    const el = $('#emptyState');
    if (hasVisible) { el.hidden = true; return; }
    el.hidden = false;
    const hasData = state.employees.length > 0;
    if (hasData) {
      $('#emptyTitle').textContent = 'No matching employees';
      $('#emptyText').textContent = 'Try a different name, ID or department — or clear the filters.';
      $('#btnEmptyAdd').hidden = true;
      $('#btnSample').hidden = true;
      $('#btnClear').hidden = false;
    } else {
      $('#emptyTitle').textContent = 'No employees yet';
      $('#emptyText').textContent = 'Add your first employee to start building the payroll.';
      $('#btnEmptyAdd').hidden = false;
      $('#btnSample').hidden = false;
      $('#btnClear').hidden = true;
    }
  }

  function render() {
    const list = filtered();
    $('#tbody').innerHTML = list.map(rowHTML).join('');
    const total = state.employees.length;
    $('#resultCount').textContent = list.length
      ? `Showing ${list.length} of ${total} employee${total === 1 ? '' : 's'}`
      : '';
    updateStats();
    renderEmpty(list.length > 0);
  }

  /* ---------------- toast ---------------- */
  let toastTimer = null;
  function toast(msg) {
    const t = $('#toast');
    t.textContent = msg;
    t.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => t.classList.remove('show'), 2800);
  }

  /* ---------------- Add / Edit employee modal ---------------- */
  function openEmpModal(id) {
    state.editingId = id;
    const form = $('#empForm');
    form.reset();
    $('#formError').hidden = true;
    if (id) {
      const e = state.employees.find((x) => x.id === id);
      if (!e) return;
      $('#empModalTitle').textContent = 'Edit Employee';
      $('#empSave').textContent = 'Update Employee';
      $('#fId').value = e.id;
      $('#fName').value = e.name;
      $('#fEmail').value = e.email || '';
      $('#fDept').value = e.department;
      $('#fPos').value = e.position;
      $('#fBasic').value = e.basic;
      $('#fHra').value = e.hra || '';
      $('#fAllow').value = e.allow || '';
      $('#fPf').value = e.pf || '';
      $('#fTax').value = e.tax || '';
      $('#fDed').value = e.ded || '';
      $('#fJoin').value = e.joinDate || '';
    } else {
      $('#empModalTitle').textContent = 'Add Employee';
      $('#empSave').textContent = 'Save Employee';
      $('#fId').value = nextId();
      $('#fJoin').value = new Date().toISOString().slice(0, 10);
    }
    updatePreview();
    const m = $('#empModal');
    m.hidden = false;
    requestAnimationFrame(() => m.classList.add('open'));
    setTimeout(() => $('#fName').focus(), 60);
  }

  function closeEmpModal() {
    const m = $('#empModal');
    if (m.hidden) return;
    m.classList.remove('open');
    setTimeout(() => { m.hidden = true; }, 200);
    state.editingId = null;
  }

  function updatePreview() {
    const g = num($('#fBasic').value) + num($('#fHra').value) + num($('#fAllow').value);
    const d = num($('#fPf').value) + num($('#fTax').value) + num($('#fDed').value);
    $('#prevGross').textContent = fmt(g);
    $('#prevDed').textContent = '− ' + fmt(d);
    $('#prevNet').textContent = fmt(g - d);
  }

  function showFormError(msg) {
    const el = $('#formError');
    el.textContent = msg;
    el.hidden = false;
  }

  function onFormSubmit(ev) {
    ev.preventDefault();
    const name = $('#fName').value.trim();
    const dept = $('#fDept').value;
    const pos = $('#fPos').value.trim();
    const basic = parseFloat($('#fBasic').value);

    if (!name) return showFormError('Please enter the employee name.');
    if (!dept) return showFormError('Please select a department.');
    if (!pos) return showFormError('Please enter the position / designation.');
    if (!(basic > 0)) return showFormError('Basic salary must be greater than 0.');

    const data = {
      id: $('#fId').value,
      name,
      email: $('#fEmail').value.trim(),
      department: dept,
      position: pos,
      basic,
      hra: num($('#fHra').value),
      allow: num($('#fAllow').value),
      pf: num($('#fPf').value),
      tax: num($('#fTax').value),
      ded: num($('#fDed').value),
      joinDate: $('#fJoin').value
    };

    if (state.editingId) {
      const i = state.employees.findIndex((e) => e.id === state.editingId);
      if (i > -1) state.employees[i] = data;
      toast(`${name}'s record updated — payroll data saved.`);
    } else {
      state.employees.push(data);
      toast(`${name} added — payroll data saved.`);
    }
    save();
    render();
    closeEmpModal();
  }

  /* ---------------- payslip (Generate payslips) ---------------- */
  function openSlip(id) {
    const e = state.employees.find((x) => x.id === id);
    if (!e) return;
    const g = grossOf(e), d = dedOf(e), n = netOf(e);
    const period = monthYear(new Date());
    const generated = new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
    const joined = e.joinDate
      ? new Date(e.joinDate + 'T00:00:00').toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })
      : '—';
    const row = (label, val) => `<tr><td>${esc(label)}</td><td class="num">${val}</td></tr>`;

    $('#payslipPrint').innerHTML = `
      <div class="ps-head">
        <div class="ps-brand">
          <div class="ps-logo">₹</div>
          <div class="ps-co">
            <strong>BlueWave Solutions Pvt. Ltd.</strong>
            <span>HR &amp; Payroll · Imphal, Manipur</span>
          </div>
        </div>
        <div class="ps-period">
          <span class="ps-badge">PAYSLIP</span>
          <span class="ps-month">${esc(period)}</span>
        </div>
      </div>

      <div class="ps-meta-grid">
        <div><span>Employee Name</span><b>${esc(e.name)}</b></div>
        <div><span>Employee ID</span><b>${esc(e.id)}</b></div>
        <div><span>Department</span><b>${esc(e.department)}</b></div>
        <div><span>Designation</span><b>${esc(e.position)}</b></div>
        <div><span>Email</span><b>${esc(e.email || '—')}</b></div>
        <div><span>Joined On</span><b>${esc(joined)}</b></div>
      </div>

      <div class="ps-tables">
        <table class="ps-table">
          <caption>Earnings</caption>
          ${row('Basic Salary', fmt(e.basic))}
          ${row('House Rent Allowance', fmt(e.hra))}
          ${row('Other Allowances', fmt(e.allow))}
          <tr class="total"><td>Total Earnings</td><td class="num">${fmt(g)}</td></tr>
        </table>
        <table class="ps-table">
          <caption>Deductions</caption>
          ${row('Provident Fund / Insurance', fmt(e.pf))}
          ${row('Tax / TDS', fmt(e.tax))}
          ${row('Other Deductions', fmt(e.ded))}
          <tr class="total"><td>Total Deductions</td><td class="num">${fmt(d)}</td></tr>
        </table>
      </div>

      <div class="ps-net">
        <span>Net Pay · ${esc(period)}</span>
        <b>${fmt(n)}</b>
      </div>

      <p class="ps-words"><span>In words:</span> ${esc(inrWords(n))}</p>
      <p class="ps-foot">This is a system-generated payslip and does not require a signature.<br/>Generated on ${esc(generated)} · Employee Payroll System (Project 04)</p>`;

    const m = $('#slipModal');
    m.hidden = false;
    requestAnimationFrame(() => m.classList.add('open'));
    document.body.classList.add('print-mode');
  }

  function closeSlip() {
    const m = $('#slipModal');
    if (m.hidden) return;
    m.classList.remove('open');
    setTimeout(() => { m.hidden = true; }, 200);
    document.body.classList.remove('print-mode');
  }

  /* ---------------- delete ---------------- */
  function deleteEmployee(id) {
    const e = state.employees.find((x) => x.id === id);
    state.employees = state.employees.filter((x) => x.id !== id);
    save();
    render();
    toast(`${e ? e.name : 'Employee'} removed — payroll data saved.`);
  }

  /* ---------------- export CSV ---------------- */
  function exportCsv() {
    if (!state.employees.length) { toast('No payroll data to export yet.'); return; }
    const head = ['Employee ID', 'Name', 'Email', 'Department', 'Position', 'Basic', 'HRA', 'Other Allowances', 'PF/Insurance', 'Tax/TDS', 'Other Deductions', 'Gross', 'Total Deductions', 'Net Salary', 'Joined'];
    const rows = state.employees.map((e) => [
      e.id, e.name, e.email || '', e.department, e.position,
      e.basic, e.hra || 0, e.allow || 0, e.pf || 0, e.tax || 0, e.ded || 0,
      grossOf(e), dedOf(e), netOf(e), e.joinDate || ''
    ]);
    const csv = '\uFEFF' + [head, ...rows]
      .map((r) => r.map((c) => '"' + String(c).replace(/"/g, '""') + '"').join(','))
      .join('\n');
    const a = document.createElement('a');
    a.href = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8' }));
    a.download = 'payroll-data.csv';
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(a.href);
    toast('Payroll data exported as CSV.');
  }

  /* ---------------- sample data ---------------- */
  function loadSample() {
    state.employees = SAMPLE.map((s) => ({ ...s }));
    save();
    render();
    toast('Sample payroll data loaded — saved to browser storage.');
  }

  function clearFilters() {
    state.query = '';
    state.dept = 'all';
    $('#searchInput').value = '';
    $('#deptFilter').value = 'all';
    render();
  }

  /* ---------------- events & init ---------------- */
  function init() {
    state.employees = load();

    const opts = DEPARTMENTS.map((d) => `<option value="${d}">${d}</option>`).join('');
    $('#deptFilter').insertAdjacentHTML('beforeend', opts);
    $('#fDept').insertAdjacentHTML('beforeend', opts);

    $('#btnAdd').addEventListener('click', () => openEmpModal());
    $('#btnEmptyAdd').addEventListener('click', () => openEmpModal());
    $('#btnSample').addEventListener('click', loadSample);
    $('#btnClear').addEventListener('click', clearFilters);
    $('#btnExport').addEventListener('click', exportCsv);

    $('#empModalClose').addEventListener('click', closeEmpModal);
    $('#empCancel').addEventListener('click', closeEmpModal);
    $('#slipClose').addEventListener('click', closeSlip);
    $('#slipPrint').addEventListener('click', () => window.print());

    $('#empModal').addEventListener('click', (ev) => { if (ev.target === ev.currentTarget) closeEmpModal(); });
    $('#slipModal').addEventListener('click', (ev) => { if (ev.target === ev.currentTarget) closeSlip(); });

    $('#empForm').addEventListener('input', updatePreview);
    $('#empForm').addEventListener('submit', onFormSubmit);

    $('#searchInput').addEventListener('input', (ev) => { state.query = ev.target.value; render(); });
    $('#deptFilter').addEventListener('change', (ev) => { state.dept = ev.target.value; render(); });

    document.addEventListener('keydown', (ev) => {
      if (ev.key === 'Escape') { closeEmpModal(); closeSlip(); }
    });

    $('#tbody').addEventListener('click', (ev) => {
      const btn = ev.target.closest('button[data-action]');
      if (!btn) return;
      const id = btn.dataset.id;
      const action = btn.dataset.action;
      if (action === 'slip') openSlip(id);
      else if (action === 'edit') openEmpModal(id);
      else if (action === 'delete') {
        if (btn.classList.contains('confirming')) {
          clearTimeout(btn._t);
          deleteEmployee(id);
        } else {
          btn.classList.add('confirming');
          btn.innerHTML = 'Sure?';
          btn._t = setTimeout(() => { btn.classList.remove('confirming'); render(); }, 2600);
        }
      }
    });

    render();
  }

  document.addEventListener('DOMContentLoaded', init);
})();
