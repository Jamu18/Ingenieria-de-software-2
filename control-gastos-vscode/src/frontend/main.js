let currentUser = null;
let users = JSON.parse(localStorage.getItem("users")) || [];
let expenses = JSON.parse(localStorage.getItem("expenses")) || [];
let salary = parseFloat(localStorage.getItem("salary")) || 0;
let savingGoal = parseFloat(localStorage.getItem("savingGoal")) || 0;

const $ = (id) => document.getElementById(id);
const qs = (s) => document.querySelector(s);
const qsa = (s) => Array.from(document.querySelectorAll(s));

// Símbolos de moneda y formato dinámico según el usuario actual (o USD por defecto)
const currencySymbols = { USD: '$', EUR: '€', JPY: '¥', GBP: '£', CNY: '¥' };
const getCurrencySymbol = () => {
  if (currentUser && currentUser.currency) return currencySymbols[currentUser.currency] || currentUser.currency;
  // Si no hay usuario, intentar usar la moneda guardada en localStorage (por compatibilidad)
  const saved = localStorage.getItem('currency') || null;
  if (saved) return currencySymbols[saved] || saved;
  return currencySymbols['USD'];
};
const fmt = (n) => `${getCurrencySymbol()}${(n || 0).toFixed(2)}`;

// Toast
function showToast(msg, type = "success") {
  const cont = $("toast"); if (!cont) return;
  const n = document.createElement("div");
  n.className = `toast__item ${type}`; n.textContent = msg;
  cont.appendChild(n); setTimeout(() => n.remove(), 2800);
}

// Router / Tabs
function showView(id) {
  qsa(".view").forEach(v => v.classList.remove("is-visible"));
  $(id).classList.add("is-visible");
  qsa(".tab").forEach(t => t.classList.toggle("is-active", t.dataset.view === id));
}

function initTabs() { 
  const tabs = qsa(".tab");
  tabs.forEach(tab => {
    tab.addEventListener("click", () => {
      const viewId = tab.dataset.view;
      if (viewId) {
        showView(viewId);
        console.log('Cambiando a vista:', viewId); // Para debug
      }
    });
  });
}

// Donut
const CIRC = 2 * Math.PI * 52;
function updateDonut(p) {
  const seg = $("donut-segment"), lbl = $("donut-label");
  const x = Math.max(0, Math.min(100, p || 0));
  if (seg) seg.style.strokeDashoffset = String(CIRC * (1 - x / 100));
  if (lbl) lbl.textContent = x.toFixed(0) + "%";
}

// KPIs
function renderStats() {
  const spent = expenses.reduce((s, e) => s + e.amount, 0);
  const available = salary - spent - (savingGoal || 0);
  const suggested = salary * 0.2;
  const set = (id, v) => { const el = $(id); if (el) el.textContent = v; };
  set("kpi-salary", fmt(salary));
  set("kpi-spent", fmt(spent));
  set("kpi-available", fmt(available));
  set("kpi-suggested", fmt(suggested));
  const pct = salary > 0 ? Math.min(100, Math.max(0, (spent / salary) * 100)) : 0;
  updateDonut(pct);
}
function updateSummary() {
  const spent = expenses.reduce((s, e) => s + e.amount, 0);
  const available = salary - spent - (savingGoal || 0);
  const suggested = (salary * 0.2);
  const el = $("suggested-saving");
  if (el) el.textContent = `Meta manual: ${fmt(savingGoal || 0)} | Sugerido: ${fmt(suggested)} | Disponible: ${fmt(available || 0)}`;
  renderStats();
}

// Expenses
function renderExpenses() {
  const list = $("expenses-list"); if (!list) return; list.innerHTML = "";
  expenses.forEach((exp, i) => {
    const li = document.createElement("li");
    const left = document.createElement("div"); left.textContent = `${exp.date} · ${exp.title}`;
    const amount = document.createElement("span"); amount.className = "badge-amount"; amount.textContent = fmt(exp.amount);
    const actions = document.createElement("div"); actions.className = "actions-row";
    const be = document.createElement("button"); be.className = "btn-small"; be.textContent = "Editar";
    be.onclick = () => { editExpense(i); showToast("Gasto listo para editar"); };
    const bd = document.createElement("button"); bd.className = "btn-small"; bd.textContent = "Borrar";
    bd.onclick = () => { deleteExpense(i); showToast("Gasto borrado", "error"); };
    actions.appendChild(be); actions.appendChild(bd);
    li.appendChild(left); li.appendChild(amount); li.appendChild(actions);
    list.appendChild(li);
  });
}
function editExpense(i) {
  const e = expenses[i];
  $("g-title").value = e.title; $("g-amount").value = e.amount; $("g-date").value = e.date;
  deleteExpense(i);
}
function deleteExpense(i) {
  expenses.splice(i, 1);
  localStorage.setItem("expenses", JSON.stringify(expenses));
  renderExpenses(); updateSummary();
}

// Auth / Flow
function showLogin() {
  $("auth-card").style.display = "block";
  $("app-shell").style.display = "none";
  document.body.classList.add("is-auth"); // activa imagen de fondo limpia
}
function showApp() {
  $("auth-card").style.display = "none";
  $("app-shell").style.display = "block";
  showView("view-overview");
  document.body.classList.remove("is-auth"); // quita imagen de fondo
}

function bindAuth() {
  $("link-register").onclick = (e) => { e.preventDefault(); $("auth-area").style.display = "none"; $("register-area").style.display = "block"; };
  $("link-back-login").onclick = (e) => { e.preventDefault(); $("register-area").style.display = "none"; $("auth-area").style.display = "block"; };

  $("btn-login").onclick = () => {
    const email = $("email").value.trim(), pass = $("password").value.trim();
    const user = users.find(u => u.email === email && u.password === pass);
    if (!user) return alert("Credenciales incorrectas");
    currentUser = user; showApp();
    $("user-name").textContent = currentUser.name || email.split("@")[0];
    qs(".menu-name").textContent = currentUser.name || "Usuario";
    qs(".menu-email").textContent = currentUser.email || email;
    $("acc-email").value = currentUser.email || email;
    $("acc-name").value = currentUser.name || "";
    $("acc-currency").value = currentUser.currency || "USD";
    renderExpenses(); updateSummary(); loadSavedLogo();
  };

  $("btn-register").onclick = () => {
    const name = $("r-name").value.trim(), email = $("r-email").value.trim(), pass = $("r-password").value.trim();
    const currency = $("r-currency").value;
    if (!name || !email || !pass) return alert("Completa todos los campos");
    if (users.some(u => u.email === email)) return alert("Ese correo ya está registrado");
    users.push({ name, email, password: pass, currency });
    localStorage.setItem("users", JSON.stringify(users));
    // Guardar moneda preferida globalmente para usuarios no logueados
    localStorage.setItem('currency', currency);
    alert("Usuario registrado. Ahora inicia sesión.");
    $("register-area").style.display = "none"; $("auth-area").style.display = "block";
  };
}

// Account + logo
const DEFAULT_LOGO = "./img/logo-cliente.png";
const LOGO_KEY = "clientLogo";

function loadSavedLogo() {
  const saved = localStorage.getItem(LOGO_KEY);
  const top = $("client-logo"); const pv = $("acc-logo-preview");
  if (saved) { if (top) top.src = saved; if (pv) pv.src = saved; }
  else { if (top) top.src = DEFAULT_LOGO; if (pv) pv.src = DEFAULT_LOGO; }
}
function handleLogoFile(file) {
  if (!file) return;
  const MAX = 512 * 1024; if (file.size > MAX) { alert("Máximo 512 KB"); return; }
  const r = new FileReader();
  r.onload = () => {
    const data = r.result; localStorage.setItem(LOGO_KEY, data);
    const top = $("client-logo"), pv = $("acc-logo-preview");
    if (top) top.src = data; if (pv) pv.src = data; showToast("Logo actualizado");
  };
  r.readAsDataURL(file);
}
function removeLogo() {
  localStorage.removeItem(LOGO_KEY);
  const top = $("client-logo"), pv = $("acc-logo-preview"), inp = $("acc-logo");
  if (top) top.src = DEFAULT_LOGO; if (pv) pv.src = DEFAULT_LOGO; if (inp) inp.value = "";
  showToast("Logo restaurado");
}

function bindAccount() {
  $("client-logo").onclick = () => { $("account-menu").style.display = $("account-menu").style.display === "block" ? "none" : "block"; };
  document.addEventListener("click", (e) => { const acc = qs(".account"); if (!acc) return; if (!acc.contains(e.target)) $("account-menu").style.display = "none"; });

  $("btn-open-account").onclick = () => {
    // Abrir modal de cuenta. Si no existe un logo guardado, inicializar con el logo por defecto
    $("account-modal").classList.add("is-open");
    $("acc-pass").value = "";
    if (!localStorage.getItem(LOGO_KEY)) {
      // Guardamos la ruta del logo por defecto para que se muestre como "predeterminado" y persista
      localStorage.setItem(LOGO_KEY, DEFAULT_LOGO);
    }
    loadSavedLogo();
  };
  qsa("[data-close]").forEach(b => b.onclick = () => $("account-modal").classList.remove("is-open"));

  $("btn-save-account").onclick = () => {
    if (!currentUser) return;
    const name = $("acc-name").value.trim();
    const pass = $("acc-pass").value.trim();
    const currency = $("acc-currency").value;
    const idx = users.findIndex(u => u.email === currentUser.email);
    if (idx >= 0) {
      users[idx].name = name || users[idx].name;
      if (pass) users[idx].password = pass;
      users[idx].currency = currency;
      localStorage.setItem("users", JSON.stringify(users));
      currentUser = users[idx];
    }
    // Actualizar moneda preferida global
    localStorage.setItem('currency', currency);
    $("user-name").textContent = currentUser.name || currentUser.email.split("@")[0];
    qs(".menu-name").textContent = currentUser.name || "Usuario";
    qs(".menu-email").textContent = currentUser.email;
    $("account-modal").classList.remove("is-open");
    showToast("Cuenta actualizada");
  };

  const accLogoInput = $("acc-logo"), accLogoBtn = $("btn-upload-logo");
  if (accLogoBtn && accLogoInput) { accLogoBtn.onclick = () => accLogoInput.click(); accLogoInput.onchange = (e) => handleLogoFile(e.target.files[0]); }
  const removeBtn = $("btn-remove-logo"); if (removeBtn) removeBtn.onclick = removeLogo;

  $("btn-logout").onclick = () => { currentUser = null; showLogin(); showToast("Sesión cerrada", "error"); };
}

// Data actions
function bindDataActions() {
  const goNew = qs('#btn-go-new'); if (goNew) goNew.onclick = () => { showView("view-new"); $("g-title").focus(); };

  $("btn-save-salary").onclick = () => { salary = parseFloat($("salary-input").value) || 0; localStorage.setItem("salary", salary); updateSummary(); showToast("Sueldo guardado"); };

  $("btn-add-expense").onclick = () => {
    const title = $("g-title").value.trim(), amount = parseFloat($("g-amount").value), date = $("g-date").value;
    if (!title || !amount || !date) return alert("Completa todos los campos del gasto");
    expenses.push({ title, amount, date }); localStorage.setItem("expenses", JSON.stringify(expenses));
    $("g-title").value = ""; $("g-amount").value = ""; $("g-date").value = "";
    renderExpenses(); updateSummary(); showToast("Gasto agregado");
  };

  $("btn-new-entry").onclick = () => {
    showView("view-history");
    const tbody = qs("#history-table tbody"); tbody.innerHTML = "";
    expenses.forEach((e, i) => {
      const tr = document.createElement("tr");
      tr.innerHTML = `<td>${e.date}</td><td>${e.title}</td><td>${fmt(e.amount)}</td>
                    <td><button data-edit="${i}">Editar</button>
                        <button data-del="${i}">Borrar</button></td>`;
      tbody.appendChild(tr);
    });
    qs("#history-table").onclick = (ev) => {
      const iEdit = ev.target.getAttribute("data-edit");
      const iDel = ev.target.getAttribute("data-del");
      if (iEdit !== null) { editExpense(Number(iEdit)); showToast("Gasto listo para editar"); }
      if (iDel !== null) { deleteExpense(Number(iDel)); showToast("Gasto borrado", "error"); }
    };
  };
}

// Init
(function init() {
  bindAuth(); bindAccount(); bindDataActions(); initTabs(); loadSavedLogo();
  showLogin(); // muestra login + imagen limpia de fondo
})();
