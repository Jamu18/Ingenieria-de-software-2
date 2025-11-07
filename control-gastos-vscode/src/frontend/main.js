// main.js

// Datos en memoria (pueden guardarse en localStorage o backend PHP/MySQL si quieres luego)
let currentUser = null;
let users = JSON.parse(localStorage.getItem("users")) || [];
let expenses = JSON.parse(localStorage.getItem("expenses")) || [];
let salary = parseFloat(localStorage.getItem("salary")) || 0;
let savingGoal = parseFloat(localStorage.getItem("savingGoal")) || 0;

// ==== LOGIN & REGISTRO ====
document.getElementById("btn-login").addEventListener("click", () => {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  const user = users.find(u => u.email === email && u.password === password);

  if (user) {
    currentUser = user;
    saveSession(user); // Guardar sesión
    document.getElementById("auth-area").style.display = "none";
    document.getElementById("register-area").style.display = "none";
    document.getElementById("dashboard").style.display = "block";
    document.getElementById("user-name").textContent = currentUser.name;
    renderExpenses();
    updateSummary();
  } else {
    alert("Credenciales incorrectas");
  }
});

document.getElementById("link-register").addEventListener("click", () => {
  document.getElementById("auth-area").style.display = "none";
  document.getElementById("register-area").style.display = "block";
});

document.getElementById("link-back-login").addEventListener("click", () => {
  document.getElementById("register-area").style.display = "none";
  document.getElementById("auth-area").style.display = "block";
});

document.getElementById("btn-register").addEventListener("click", () => {
  const name = document.getElementById("r-name").value;
  const email = document.getElementById("r-email").value;
  const password = document.getElementById("r-password").value;

  if (!name || !email || !password) {
    alert("Completa todos los campos");
    return;
  }

  users.push({ name, email, password });
  localStorage.setItem("users", JSON.stringify(users));
  alert("Usuario registrado. Ahora inicia sesión.");
  document.getElementById("register-area").style.display = "none";
  document.getElementById("auth-area").style.display = "block";
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
document.getElementById("salary-input").addEventListener("input", () => {
  salary = parseFloat(document.getElementById("salary-input").value) || 0;
  localStorage.setItem("salary", salary);
  updateDistribution();
  updateSummary();
});

// Guardar configuración de porcentajes
document.getElementById("btn-save-salary").addEventListener("click", () => {
  if (updatePercentages()) {
    updateDistribution();
    updateSummary();
  }
});

// Cargar valores guardados al iniciar
document.getElementById("basic-needs-percent").value = distributionConfig.basicNeeds;
document.getElementById("personal-percent").value = distributionConfig.personal;
document.getElementById("savings-percent").value = distributionConfig.savings;

// Actualizar la distribución cuando se carga la página
if (salary > 0) {
  document.getElementById("salary-input").value = salary;
  updateDistribution();
}

// ==== GASTOS ====
document.getElementById("btn-add-expense").addEventListener("click", () => {
  const title = document.getElementById("g-title").value;
  const amount = parseFloat(document.getElementById("g-amount").value);
  const date = document.getElementById("g-date").value;

  if (!title || !amount || !date) {
    alert("Completa todos los campos del gasto");
    return;
  }

  expenses.push({ title, amount, date });
  localStorage.setItem("expenses", JSON.stringify(expenses));
  renderExpenses();
  updateSummary();

  // limpiar inputs
  document.getElementById("g-title").value = "";
  document.getElementById("g-amount").value = "";
  document.getElementById("g-date").value = "";
});

function renderExpenses() {
  const list = document.getElementById("expenses-list");
  list.innerHTML = "";

  expenses.forEach((exp, index) => {
    const li = document.createElement("li");
    li.textContent = `${exp.date} - ${exp.title}: $${exp.amount.toFixed(2)} `;

    // Botón editar
    const btnEdit = document.createElement("button");
    btnEdit.textContent = "Editar";
    btnEdit.onclick = () => editExpense(index);

    // Botón borrar
    const btnDelete = document.createElement("button");
    btnDelete.textContent = "Borrar";
    btnDelete.onclick = () => deleteExpense(index);

    li.appendChild(btnEdit);
    li.appendChild(btnDelete);
    list.appendChild(li);
  });
}

function editExpense(index) {
  const exp = expenses[index];
  document.getElementById("g-title").value = exp.title;
  document.getElementById("g-amount").value = exp.amount;
  document.getElementById("g-date").value = exp.date;
  deleteExpense(index);
}

function deleteExpense(index) {
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

// ==== RESUMEN ====
function updateSummary() {
  const totalExpenses = expenses.reduce((sum, exp) => sum + exp.amount, 0);
  const savings = (salary * distributionConfig.savings / 100);
  
  // Mostrar solo el ahorro calculado del porcentaje
  document.getElementById("savings-amount").textContent = formatCurrency(savings);
  document.getElementById("savings-percent").textContent = `${distributionConfig.savings}%`;
  
  // Actualizar los montos en la distribución
  updateDistribution();
}

// ==== HISTORIAL (Extra) ====
document.getElementById("btn-new-entry").addEventListener("click", () => {
  document.getElementById("history-area").style.display = "block";
  const tbody = document.querySelector("#history-table tbody");
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

document.getElementById("link-back-dashboard").addEventListener("click", () => {
  document.getElementById("history-area").style.display = "none";
  document.getElementById("dashboard").style.display = "block";
});
