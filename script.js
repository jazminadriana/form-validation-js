const calorieCounter = document.getElementById("calorie-counter");
const budgetInput = document.getElementById("budget");
const entryDropdown = document.getElementById("entry-dropdown");
const addEntryButton = document.getElementById("add-entry");
const clearButton = document.getElementById("clear");
const output = document.getElementById("output");
const outputText = document.querySelector(".output-text");
const themeToggle = document.getElementById("theme-toggle");

let isError = false;

function cleanInput(str) {
  return str.replace(/[+\-\s]/g, "");
}

function isInvalidInput(str) {
  return /\d+e\d+/i.test(str);
}

function addEntry() {
  const targetContainer = document.querySelector(`#${entryDropdown.value} .input-container`);
  const entryNum = targetContainer.querySelectorAll('input[type="text"]').length + 1;

  const html = `
    <label>Entry ${entryNum} Name</label>
    <input type="text" placeholder="Name" />
    <label>Entry ${entryNum} Calories</label>
    <input type="number" min="0" placeholder="Calories" />
  `;

  targetContainer.insertAdjacentHTML("beforeend", html);
  targetContainer.querySelector("input:last-of-type").focus();
}

function calculateCalories(e) {
  e.preventDefault();
  isError = false;

  if (!budgetInput.value) return alert("Please enter a calorie budget.");

  const sections = ["breakfast","lunch","dinner","snacks","exercise"];
  const calories = {};

  sections.forEach(sec => {
    const inputs = document.querySelectorAll(`#${sec} input[type="number"]`);
    calories[sec] = getCalories(inputs);
  });

  if (isError) return;

  const consumed = calories.breakfast + calories.lunch + calories.dinner + calories.snacks;
  const remaining = Number(budgetInput.value) - consumed + calories.exercise;
  const status = remaining < 0 ? "Surplus" : "Deficit";

  const progressEl = document.querySelector(".progress");
  const percent = (consumed / Number(budgetInput.value)) * 100;
  progressEl.style.width = `${Math.min(percent,100)}%`;
  progressEl.style.background = percent > 100 ? "var(--danger)" : "var(--success)";

  outputText.innerHTML = `
    <span class="${status.toLowerCase()}">${Math.abs(remaining)} Calorie ${status}</span>
    <hr>
    <p>${budgetInput.value} Calories Budgeted</p>
    <p>${consumed} Calories Consumed</p>
    <p>${calories.exercise} Calories Burned</p>
  `;
  output.classList.remove("hide");
}

function getCalories(list) {
  let total = 0;
  list.forEach(item => {
    const val = cleanInput(item.value);
    if (isInvalidInput(val)) {
      item.style.border = "2px solid red";
      alert("Invalid input detected");
      isError = true;
      return;
    }
    item.style.border = "1px solid #ccc";
    total += Number(val) || 0;
  });
  return total;
}

function clearForm() {
  document.querySelectorAll(".input-container").forEach(c => c.innerHTML = "");
  budgetInput.value = "";
  outputText.innerHTML = "";
  output.classList.add("hide");
}

// Theme toggle
function updateThemeBtn() {
  themeToggle.textContent = document.body.classList.contains("light-mode") ? "🌙 Dark Mode" : "☀️ Light Mode";
}

themeToggle.addEventListener("click", () => {
  document.body.classList.toggle("light-mode");
  updateThemeBtn();
});

updateThemeBtn();

// Event listeners
addEntryButton.addEventListener("click", addEntry);
calorieCounter.addEventListener("submit", calculateCalories);
clearButton.addEventListener("click", clearForm);