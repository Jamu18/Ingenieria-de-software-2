// main.js

// Variables globales
let currentUser = null;
let expenses = [];
let salary = 0;
let savingGoal = 0;

// API URL base
const API_URL = 'http://localhost:3002/api';

// Función para obtener el token JWT
function getToken() {
    return localStorage.getItem('token');
}

// Función para hacer peticiones autenticadas
async function authFetch(url, options = {}) {
    const token = getToken();
    return fetch(url, {
        ...options,
        headers: {
            ...options.headers,
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        }
    });
}

// Verificar si hay una sesión activa al cargar la página
function checkSession() {
    const token = getToken();
    if (token) {
        // Token exists: mostrar dashboard sin verificar con servidor
        document.getElementById("auth-area").style.display = "none";
        document.getElementById("register-area").style.display = "none";
        document.getElementById("dashboard").style.display = "block";
        // Load expenses from server
        loadUserData();
    } else {
        // No token: mostrar login
        document.getElementById("auth-area").style.display = "block";
        document.getElementById("register-area").style.display = "none";
        document.getElementById("dashboard").style.display = "none";
    }
}

// Cargar datos del usuario (gastos y configuración)
async function loadUserData() {
    try {
        const expensesRes = await authFetch(`${API_URL}/expenses`);
        if (expensesRes.ok) {
            const data = await expensesRes.json();
            if (Array.isArray(data)) expenses = data;
            else expenses = data.expenses || [];
            await renderExpenses();
        } else if (expensesRes.status === 401) {
            console.warn('Token inválido o expirado');
            localStorage.removeItem('token');
            window.location.href = 'index.html';
        }
        updateSummary();
    } catch (error) {
        console.error('Error al cargar gastos:', error);
    }
}

// Inicializar: comprobar sesión cuando el DOM esté listo (o ejecutar inmediatamente si ya cargó)
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    checkSession();
    loadGoals();
  });
} else {
  checkSession();
  loadGoals();
}

// ==== LOGIN & REGISTRO ====
const btnLogin = document.getElementById("btn-login");
if (btnLogin) btnLogin.addEventListener("click", async () => {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  
  try {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email, password })
    });

    const data = await response.json();
    
    if (response.ok) {
      localStorage.setItem('token', data.token);
      document.getElementById("auth-area").style.display = "none";
      document.getElementById("register-area").style.display = "none";
      document.getElementById("dashboard").style.display = "block";
      await loadUserData();
      updateSummary();
    } else {
      alert(data.message || "Credenciales incorrectas");
    }
  } catch (error) {
    console.error('Error:', error);
    alert("Error al intentar iniciar sesión");
  }
});

const linkRegister = document.getElementById("link-register");
if (linkRegister) linkRegister.addEventListener("click", () => {
  const authArea = document.getElementById("auth-area");
  const regArea = document.getElementById("register-area");
  if (authArea) authArea.style.display = "none";
  if (regArea) regArea.style.display = "block";
});

const linkBackLogin = document.getElementById("link-back-login");
if (linkBackLogin) linkBackLogin.addEventListener("click", () => {
  const regArea = document.getElementById("register-area");
  const authArea = document.getElementById("auth-area");
  if (regArea) regArea.style.display = "none";
  if (authArea) authArea.style.display = "block";
});

const btnRegister = document.getElementById("btn-register");
if (btnRegister) btnRegister.addEventListener("click", async () => {
  const name = document.getElementById("r-name").value;
  const email = document.getElementById("r-email").value;
  const password = document.getElementById("r-password").value;
  const currency = document.getElementById("r-currency").value;

  if (!name || !email || !password) {
    alert("Completa todos los campos");
    return;
  }

  try {
    const response = await fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ name, email, password, currency })
    });

    const data = await response.json();
    
    if (response.ok) {
      alert("Registro exitoso. Por favor inicia sesión.");
      document.getElementById("register-area").style.display = "none";
      document.getElementById("auth-area").style.display = "block";
    } else {
      alert(data.message || "Error al registrar usuario");
    }
  } catch (error) {
    console.error('Error:', error);
    alert("Error al intentar registrar");
  }
});

// ==== SUELDO Y DISTRIBUCIÓN ====
let distributionConfig = JSON.parse(localStorage.getItem("distributionConfig")) || {
  basicNeeds: 50,
  personal: 30,
  savings: 20
};

// Función para actualizar los porcentajes
function updatePercentages() {
  const basicNeeds = parseFloat(document.getElementById("basic-needs-percent").value);
  const personal = parseFloat(document.getElementById("personal-percent").value);
  const savings = parseFloat(document.getElementById("savings-percent").value);

  // Validar que los porcentajes sumen 100
  const total = basicNeeds + personal + savings;
  if (total !== 100) {
    alert("Los porcentajes deben sumar 100%");
    return false;
  }

  distributionConfig = { basicNeeds, personal, savings };
  localStorage.setItem("distributionConfig", JSON.stringify(distributionConfig));
  return true;
}

// Función para formatear montos en formato de moneda
function formatCurrency(amount) {
  return new Intl.NumberFormat('es-PE', {
    style: 'currency',
    currency: 'PEN',
    minimumFractionDigits: 2
  }).format(amount);
}

// Función para calcular y mostrar la distribución del sueldo
function updateDistribution() {
  const basicNeedsAmount = (salary * distributionConfig.basicNeeds / 100);
  const personalAmount = (salary * distributionConfig.personal / 100);
  const savingsAmount = (salary * distributionConfig.savings / 100);

  document.getElementById("basic-needs-amount").textContent = formatCurrency(basicNeedsAmount);
  document.getElementById("personal-amount").textContent = formatCurrency(personalAmount);
  document.getElementById("savings-amount").textContent = formatCurrency(savingsAmount);

  // Actualizar los porcentajes mostrados
  document.querySelector(".basic-needs .percent").textContent = `${distributionConfig.basicNeeds}%`;
  document.querySelector(".personal-expenses .percent").textContent = `${distributionConfig.personal}%`;
  document.querySelector(".savings .percent").textContent = `${distributionConfig.savings}%`;
}

// Evento para guardar sueldo y configuración
// Actualizar valores cuando se cambia el sueldo
const salaryInput = document.getElementById("salary-input");
if (salaryInput) {
  salaryInput.addEventListener("input", () => {
    salary = parseFloat(document.getElementById("salary-input").value) || 0;
    localStorage.setItem("salary", salary);
    updateDistribution();
    updateSummary();
  });
}

// Guardar configuración de porcentajes
const btnSaveSalary = document.getElementById("btn-save-salary");
if (btnSaveSalary) btnSaveSalary.addEventListener("click", () => {
  if (updatePercentages()) {
    updateDistribution();
    updateSummary();
  }
});

// Cargar valores guardados al iniciar (si existen los inputs)
const basicInput = document.getElementById("basic-needs-percent");
const personalInput = document.getElementById("personal-percent");
const savingsInput = document.getElementById("savings-percent");
if (basicInput) basicInput.value = distributionConfig.basicNeeds;
if (personalInput) personalInput.value = distributionConfig.personal;
if (savingsInput) savingsInput.value = distributionConfig.savings;

// Actualizar la distribución cuando se carga la página
if (salary > 0 && salaryInput) {
  salaryInput.value = salary;
  updateDistribution();
}

// ==== GASTOS ====
const btnAddExpense = document.getElementById("btn-add-expense");
if (btnAddExpense) btnAddExpense.addEventListener("click", async () => {
  // Gather elements safely
  const titleEl = document.getElementById("g-title");
  const amountEl = document.getElementById("g-amount");
  const dateEl = document.getElementById("g-date");
  const categoryEl = document.getElementById("g-category");
  const noteEl = document.getElementById("g-note");

  const title = titleEl ? titleEl.value.trim() : '';
  const amount = amountEl ? parseFloat(amountEl.value) : NaN;
  const date = dateEl ? dateEl.value : '';
  const category = categoryEl ? categoryEl.value : '';
  const note = noteEl ? noteEl.value : '';

  if (!title || Number.isNaN(amount) || !date) {
    alert("Completa todos los campos del gasto correctamente");
    return;
  }

  try {
    const payload = {
      title,
      amount,
      date,
      category,
      note
    };

    const response = await authFetch(`${API_URL}/expenses`, {
      method: 'POST',
      body: JSON.stringify(payload)
    });

    if (response.ok) {
      const newExpense = await response.json();
      
      // Agregar el gasto al array local
      expenses.push(newExpense);
      
      // Limpiar inputs
      if (titleEl) titleEl.value = '';
      if (amountEl) amountEl.value = '';
      if (dateEl) dateEl.value = '';
      if (categoryEl) categoryEl.value = '';
      if (noteEl) noteEl.value = '';
      
      // Renderizar la lista actualizada inmediatamente
      await renderExpenses();
      updateSummary();
      
    } else if (response.status === 401) {
      alert("Sesión expirada. Por favor inicia sesión de nuevo.");
      localStorage.removeItem('token');
      window.location.href = 'index.html';
    } else {
      const err = await response.json().catch(() => ({}));
      alert(err.message || "Error al guardar el gasto");
    }
  } catch (error) {
    console.error('Error al guardar gasto:', error);
    alert("Error al guardar el gasto");
  }
});

// Handler para botones dinámicos de metas eliminadas (delegación)
document.addEventListener('click', function (e) {
  if (e.target && e.target.classList.contains('btn-delete-goal')) {
    const idx = parseInt(e.target.getAttribute('data-idx'));
    if (!Number.isNaN(idx)) {
      if (confirm('¿Eliminar meta?')) deleteGoal(idx);
    }
  }
});

async function renderExpenses() {
  const list = document.getElementById("expenses-list");
  list.innerHTML = "";

  expenses.sort((a, b) => new Date(b.date) - new Date(a.date));

  for (const expense of expenses) {
    const li = document.createElement("li");
    li.className = 'expense-item';
    
    const date = new Date(expense.date).toLocaleDateString();
    const amount = new Intl.NumberFormat('es-PE', {
      style: 'currency',
      currency: expense.currency || currentUser.currency
    }).format(expense.amount);

    li.innerHTML = `
      <div class="expense-main">
        <span class="expense-title">${expense.title}</span>
        <span class="expense-amount">${amount}</span>
      </div>
      <div class="expense-details">
        <span class="expense-date">${date}</span>
        ${expense.category ? `<span class="expense-category">${expense.category}</span>` : ''}
        ${expense.note ? `<span class="expense-note">${expense.note}</span>` : ''}
        <button class="btn-delete" data-id="${expense.id}">Eliminar</button>
      </div>
    `;

    li.querySelector('.btn-delete').addEventListener('click', async (e) => {
      if (confirm('¿Estás seguro de eliminar este gasto?')) {
        try {
          const response = await authFetch(`${API_URL}/expenses/${expense.id}`, {
            method: 'DELETE'
          });

          if (response.ok) {
            expenses = expenses.filter(e => e.id !== expense.id);
            await renderExpenses();
            updateSummary();
          } else {
            const error = await response.json();
            alert(error.message || "Error al eliminar el gasto");
          }
        } catch (error) {
          console.error('Error al eliminar gasto:', error);
          alert("Error al eliminar el gasto");
        }
      }
    });

    list.appendChild(li);
  }
}

  // Helper functions to edit/delete when viewing history (local fallback)
  function editExpense(index) {
    const exp = expenses[index];
    document.getElementById("g-title").value = exp.title;
    document.getElementById("g-amount").value = exp.amount;
    document.getElementById("g-date").value = exp.date;
    // For server-backed storage, editing should be implemented via PUT /expenses/:id
  }

  function deleteExpense(index) {
    // If using server, deletion is handled in renderExpenses via authFetch
    expenses.splice(index, 1);
    localStorage.setItem("expenses", JSON.stringify(expenses));
    renderExpenses();
    updateSummary();
  }

// ==== META DE AHORRO ====
function setSavingGoal() {
  const goal = prompt("¿Cuánto deseas ahorrar este mes?", savingGoal || "");
  if (goal) {
    savingGoal = parseFloat(goal) || 0;
    localStorage.setItem("savingGoal", savingGoal);
    updateSummary();
  }
}

// Handler para crear meta desde la página de Metas
const btnAddGoal = document.getElementById('btn-add-goal');
if (btnAddGoal) btnAddGoal.addEventListener('click', (e) => {
  const title = document.getElementById('goal-title').value;
  const amount = parseFloat(document.getElementById('goal-amount').value);
  const date = document.getElementById('goal-date').value;
  const description = document.getElementById('goal-description').value;

  if (!title || !amount) {
    alert('Completa título y monto de la meta');
    return;
  }

  saveGoal({ title, amount, date, description, saved: 0 });
  alert('Meta creada');
  // limpiar inputs
  document.getElementById('goal-title').value = '';
  document.getElementById('goal-amount').value = '';
  document.getElementById('goal-date').value = '';
  document.getElementById('goal-description').value = '';
});

// ===== METAS DE AHORRO (localStorage) =====
function loadGoals() {
  const raw = localStorage.getItem('goals');
  const container = document.getElementById('goals-list');
  if (!container) return;
  let goals = [];
  try { goals = JSON.parse(raw) || []; } catch (e) { goals = []; }
  container.innerHTML = '';
  let totalSaved = 0;
  goals.forEach((g, idx) => {
    const div = document.createElement('div');
    div.className = 'goal-item';
    div.innerHTML = `
      <h4>${escapeHtml(g.title)}</h4>
      <p>Objetivo: ${formatCurrency(parseFloat(g.amount) || 0)}</p>
      <p>Fecha límite: ${g.date || ''}</p>
      <p>${g.description || ''}</p>
      <button class="btn-delete-goal" data-idx="${idx}">Eliminar</button>
    `;
    container.appendChild(div);
    const n = parseFloat(g.saved) || 0; totalSaved += n;
  });
  const totalEl = document.getElementById('total-savings');
  if (totalEl) totalEl.textContent = formatCurrency(totalSaved);
}

function saveGoal(goal) {
  let goals = [];
  try { goals = JSON.parse(localStorage.getItem('goals')) || []; } catch (e) { goals = []; }
  goals.push(goal);
  localStorage.setItem('goals', JSON.stringify(goals));
  loadGoals();
}

function deleteGoal(index) {
  let goals = [];
  try { goals = JSON.parse(localStorage.getItem('goals')) || []; } catch (e) { goals = []; }
  goals.splice(index, 1);
  localStorage.setItem('goals', JSON.stringify(goals));
  loadGoals();
}

// small helper to avoid XSS when injecting simple user strings
function escapeHtml(str) {
  if (!str) return '';
  return String(str).replace(/[&<>"']/g, function (s) {
    return ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":"&#39;"})[s];
  });
}

// ==== RESUMEN ====
function updateSummary() {
  const totalExpenses = expenses.reduce((sum, exp) => sum + exp.amount, 0);
  const savings = (salary * distributionConfig.savings / 100);
  
  // Mostrar solo el ahorro calculado del porcentaje
  const savingsAmountEl = document.getElementById("savings-amount");
  if (savingsAmountEl) savingsAmountEl.textContent = formatCurrency(savings);
  const savingsPercentEl = document.getElementById("savings-percent");
  if (savingsPercentEl) savingsPercentEl.textContent = `${distributionConfig.savings}%`;
  
  // Actualizar los montos en la distribución
  updateDistribution();

  // Actualizar totales en pantalla (si existen)
  const totalExpEl = document.getElementById('total-expenses');
  if (totalExpEl) totalExpEl.textContent = formatCurrency(totalExpenses);
  const remainingEl = document.getElementById('remaining-budget');
  if (remainingEl) remainingEl.textContent = formatCurrency(Math.max(0, salary - totalExpenses));
}

// ==== HISTORIAL (Extra) ====
const btnNewEntry = document.getElementById("btn-new-entry");
if (btnNewEntry) btnNewEntry.addEventListener("click", () => {
  const historyArea = document.getElementById("history-area");
  if (historyArea) historyArea.style.display = "block";
  const tbody = document.querySelector("#history-table tbody");
  if (!tbody) return;
  tbody.innerHTML = "";

  expenses.forEach((exp, i) => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${exp.date}</td>
      <td>${exp.title}</td>
      <td>$${exp.amount.toFixed(2)}</td>
      <td>
        <button onclick="editExpense(${i})">Editar</button>
        <button onclick="deleteExpense(${i})">Borrar</button>
      </td>
    `;
    tbody.appendChild(row);
  });
});

const linkBackDashboard = document.getElementById("link-back-dashboard");
if (linkBackDashboard) linkBackDashboard.addEventListener("click", () => {
  const historyArea = document.getElementById("history-area");
  const dashboard = document.getElementById("dashboard");
  if (historyArea) historyArea.style.display = "none";
  if (dashboard) dashboard.style.display = "block";
});
