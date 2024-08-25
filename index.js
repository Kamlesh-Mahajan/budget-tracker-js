const form = document.querySelector(".add");
const incomeList = document.querySelector("ul.income-list");
const expenseList = document.querySelector("ul.expense-list");

const transactionHistorySection = document.querySelector(
  ".transaction-history"
);

const balance = document.getElementById("balance");
const income = document.getElementById("income");
const expense = document.getElementById("expense");

let transactions =
  localStorage.getItem("transactions") !== null
    ? JSON.parse(localStorage.getItem("transactions"))
    : [];

function updateStatistics() {
  const updatedIncome = transactions
    .filter((transaction) => transaction.amount > 0)
    .reduce((total, transaction) => (total += transaction.amount), 0);

  const updatedExpense = transactions
    .filter((transaction) => transaction.amount < 0)
    .reduce((total, transaction) => (total += Math.abs(transaction.amount)), 0);

  updatedBalance = updatedIncome - updatedExpense;
  income.textContent = updatedIncome;
  expense.textContent = updatedExpense;
  balance.textContent = updatedBalance;
  getTransaction();
}

function generateTemplate(id, source, amount, time) {
  return `<li data-id="${id}">
                <p>
                   <span>${source}</span>
                   <span id="time">${time}</span>
               </p>
                  <span>₹ ${Math.abs(amount)}</span>
                  <i class="bi bi-trash delete"></i>
         </li>`;
}

function addTransactionDOM(id, source, amount, time) {
  if (amount > 0) {
    incomeList.innerHTML += generateTemplate(id, source, amount, time);
  } else {
    expenseList.innerHTML += generateTemplate(id, source, amount, time);
  }
}

function addTransaction(source, amount) {
  if (amount === 0) {
    return alert("Please add proper values!");
  }

  const time = new Date();
  const transaction = {
    id: Math.floor(Math.random() * 10000),
    source: source,
    amount: amount,
    time: `${time.toLocaleTimeString()} ${time.toLocaleDateString()}`
  };
  transactions.push(transaction);
  localStorage.setItem("transactions", JSON.stringify(transactions));
  addTransactionDOM(transaction.id, source, amount, transaction.time);
  updateStatistics();
  getTransaction();
}

form.addEventListener("submit", (event) => {
  event.preventDefault();
  addTransaction(form.source.value.trim(), Number(form.amount.value));
  updateStatistics();

  form.reset();
});

function getTransaction() {
  incomeList.innerHTML = "";
  expenseList.innerHTML = "";

  let hasValidTransaction = false;

  transactions.forEach((transaction) => {
    if (transaction.amount === 0) {
      return;
    } else {
      hasValidTransaction = true;
      if (transaction.amount > 0) {
        incomeList.innerHTML += generateTemplate(
          transaction.id,
          transaction.source,
          transaction.amount,
          transaction.time
        );
      } else if (transaction.amount < 0) {
        expenseList.innerHTML += generateTemplate(
          transaction.id,
          transaction.source,
          transaction.amount,
          transaction.time
        );
      }
    }
  });

  if (hasValidTransaction) {
    transactionHistorySection.style.display = "block";
  } else {
    transactionHistorySection.style.display = "none";
  }
}

function deleteTransaction(id) {
  transactions = transactions.filter((transaction) => {
    return transaction.id !== id;
  });
  localStorage.setItem("transactions", JSON.stringify(transactions));
}

incomeList.addEventListener("click", (event) => {
  if (event.target.classList.contains("delete")) {
    event.target.parentElement.remove();
    deleteTransaction(Number(event.target.parentElement.dataset.id));
    updateStatistics();
  }
});

expenseList.addEventListener("click", (event) => {
  if (event.target.classList.contains("delete")) {
    event.target.parentElement.remove();
    deleteTransaction(Number(event.target.parentElement.dataset.id));
    updateStatistics();
  }
});

function init() {
  updateStatistics();
}

init();
