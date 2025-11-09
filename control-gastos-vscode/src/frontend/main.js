let currentUser = null;
let users = JSON.parse(localStorage.getItem("users")) || [];
let expenses = JSON.parse(localStorage.getItem("expenses")) || [];
let salary = parseFloat(localStorage.getItem("salary")) || 0;
let savingGoal = parseFloat(localStorage.getItem("savingGoal")) || 0;

const $ = (id) => document.getElementById(id);
const qs = (sel) => document.querySelector(sel);
const qsa = (sel) => Array.from(document.querySelectorAll(sel));
const fmt = (n) => `$${(n || 0).toFixed(2)}`;

// ---------- TOAST ----------
function showToast(msg, type = "success") {
  const cont = $("toast"); if (!cont) return;
  const node = document.createElement("div");
  node.className = `toast__item ${type}`;
  node.textContent = msg;
  cont.appendChild(node);
  setTimeout(() => node.remove(), 2800);
}

// ---------- ROUTER ----------
function showView(id) {
  qsa(".view").forEach(v => v.classList.remove("is-visible"));
  $(id).classList.add("is-visible");
  qsa(".tab").forEach(t => t.classList.toggle("is-active", t.dataset.view === id));
}
function initTabs() {
  qsa(".tab").forEach(btn => btn.addEventListener("click", () => showView(btn.dataset.view)));
}

// ---------- DONUT ----------
const CIRC = 2 * Math.PI * 52; // r=52 -> perímetro ≈ 327
function updateDonut(pct) {
  const seg = $("donut-segment");
  const lbl = $("donut-label");
  const clamped = Math.max(0, Math.min(100, pct));
  if (seg) seg.style.strokeDashoffset = String(CIRC * (1 - clamped / 100));
  if (lbl) lbl.textContent = clamped.toFixed(0) + "%";
}

// ---------- KPIs / STATS ----------
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
  const suggested = (salary * 0.2).toFixed(2);
  const el = $("suggested-saving");
  if (el) el.textContent = `Meta manual: $${(savingGoal || 0).toFixed(2)} | Sugerido: $${suggested} | Disponible: $${(available || 0).toFixed(2)}`;
  renderStats();
}

// ---------- EXPENSES RENDER ----------
function renderExpenses() {
  const list = $("expenses-list"); if (!list) return;
  list.innerHTML = "";
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

// ---------- CRUD helpers ----------
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

// ---------- AUTH / FLOW ----------
function showLogin() {
  $("auth-card").style.display = "block";
  $("app-shell").style.display = "none";
}
function showApp() {
  $("auth-card").style.display = "none";
  $("app-shell").style.display = "block";
  showView("view-overview");           // Al entrar, solo KPIs + donut
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
    renderExpenses(); updateSummary();
  };

  $("btn-register").onclick = () => {
    const name = $("r-name").value.trim(), email = $("r-email").value.trim(), pass = $("r-password").value.trim();
    const currency = $("r-currency").value;
    if (!name || !email || !pass) return alert("Completa todos los campos");
    if (users.some(u => u.email === email)) return alert("Ese correo ya está registrado");
    users.push({ name, email, password: pass, currency });
    localStorage.setItem("users", JSON.stringify(users));
    alert("Usuario registrado. Ahora inicia sesión.");
    $("register-area").style.display = "none"; $("auth-area").style.display = "block";
  };
}

// ---------- ACCOUNT MENU & MODAL ----------
function bindAccount() {
  // Abrir menú al pasar el mouse (CSS) y modal al click
  $("client-logo").onclick = () => { $("account-menu").style.display = $("account-menu").style.display === "block" ? "none" : "block" };
  document.addEventListener("click", (e) => {
    const acc = qs(".account"); if (!acc) return;
    if (!acc.contains(e.target)) $("account-menu").style.display = "none";
  });

  $("btn-open-account").onclick = () => {
    $("account-modal").classList.add("is-open");
    $("acc-pass").value = "";
  };
  qsa("[data-close]").forEach(b => b.onclick = () => $("account-modal").classList.remove("is-open"));

  $("btn-save-account").onclick = () => {
    if (!currentUser) return;
    const name = $("acc-name").value.trim();
    const pass = $("acc-pass").value.trim();
    const currency = $("acc-currency").value;

    // actualizar en users[]
    const idx = users.findIndex(u => u.email === currentUser.email);
    if (idx >= 0) {
      users[idx].name = name || users[idx].name;
      if (pass) users[idx].password = pass;
      users[idx].currency = currency;
      localStorage.setItem("users", JSON.stringify(users));
      currentUser = users[idx];
    }

    // reflejar en UI
    $("user-name").textContent = currentUser.name || currentUser.email.split("@")[0];
    qs(".menu-name").textContent = currentUser.name || "Usuario";
    qs(".menu-email").textContent = currentUser.email;

    $("account-modal").classList.remove("is-open");
    showToast("Cuenta actualizada");
  };

  // Cerrar sesión
  $("btn-logout").onclick = () => {
    currentUser = null;
    showLogin();
    showToast("Sesión cerrada", "error");
  };
}

// ---------- NEW / SAVE EVENTS ----------
function bindDataActions() {
  const goNew = qs('#btn-go-new');
  if (goNew) goNew.onclick = () => { showView("view-new"); $("g-title").focus(); };

  $("btn-save-salary").onclick = () => {
    salary = parseFloat($("salary-input").value) || 0;
    localStorage.setItem("salary", salary);
    updateSummary(); showToast("Sueldo guardado");
  };

  $("btn-add-expense").onclick = () => {
    const title = $("g-title").value.trim();
    const amount = parseFloat($("g-amount").value);
    const date = $("g-date").value;
    if (!title || !amount || !date) return alert("Completa todos los campos del gasto");

    expenses.push({ title, amount, date });
    localStorage.setItem("expenses", JSON.stringify(expenses));
    $("g-title").value = ""; $("g-amount").value = ""; $("g-date").value = "";
    renderExpenses(); updateSummary(); showToast("Gasto agregado");
  };

  // Tabla en Historial
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

// ---------- INIT ----------
(function init() {
  bindAuth();
  bindAccount();
  bindDataActions();
  initTabs();
  showLogin();         // arranca en login
})();
