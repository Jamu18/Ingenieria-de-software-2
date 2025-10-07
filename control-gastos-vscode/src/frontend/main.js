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

// ==== SUELDO ====
document.getElementById("btn-save-salary").addEventListener("click", () => {
  salary = parseFloat(document.getElementById("salary-input").value) || 0;
  localStorage.setItem("salary", salary);
  updateSummary();
});

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
  const available = salary - totalExpenses - savingGoal;
  const suggested = (salary * 0.2).toFixed(2);

  document.getElementById("suggested-saving").textContent = 
    `Meta manual: $${savingGoal.toFixed(2)} | Sugerido: $${suggested} | Disponible: $${available.toFixed(2)}`;
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
