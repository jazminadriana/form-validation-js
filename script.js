const calorieCounter = document.getElementById("calorie-counter");
const budgetNumberInput = document.getElementById("budget");
const entryDropdown = document.getElementById("entry-dropdown");
const addEntryButton = document.getElementById("add-entry");
const clearButton = document.getElementById("clear");
const output = document.getElementById("output");
const outputText = document.querySelector(".output-text");

let isError = false;

function cleanInputString(str) {
  return str.replace(/[+\-\s]/g, "");
}

function isInvalidInput(str) {
  return /\d+e\d+/i.test(str);
}

function addEntry() {
  const targetInputContainer = document.querySelector(
    `#${entryDropdown.value} .input-container`
  );

  const entryNumber =
    targetInputContainer.querySelectorAll('input[type="text"]').length + 1;

  const HTMLString = `
    <label>Entry ${entryNumber} Name</label>
    <input type="text" placeholder="Name" />
    <label>Entry ${entryNumber} Calories</label>
    <input type="number" min="0" placeholder="Calories" />
  `;

  targetInputContainer.insertAdjacentHTML("beforeend", HTMLString);

  const inputs = targetInputContainer.querySelectorAll("input");
  inputs[inputs.length - 1].focus();
}

function calculateCalories(e) {
  e.preventDefault();
  isError = false;

  if (!budgetNumberInput.value) {
    alert("Please enter a calorie budget.");
    return;
  }

  const get = (sel) => document.querySelectorAll(sel);

  const breakfastCalories = getCaloriesFromInputs(get("#breakfast input[type='number']"));
  const lunchCalories = getCaloriesFromInputs(get("#lunch input[type='number']"));
  const dinnerCalories = getCaloriesFromInputs(get("#dinner input[type='number']"));
  const snacksCalories = getCaloriesFromInputs(get("#snacks input[type='number']"));
  const exerciseCalories = getCaloriesFromInputs(get("#exercise input[type='number']"));
  const budgetCalories = getCaloriesFromInputs([budgetNumberInput]);

  if (isError) return;

  const consumedCalories =
    breakfastCalories + lunchCalories + dinnerCalories + snacksCalories;

  const remainingCalories =
    budgetCalories - consumedCalories + exerciseCalories;

  const surplusOrDeficit = remainingCalories < 0 ? "Surplus" : "Deficit";

  // progress bar
  const progress = document.querySelector(".progress");
  const percentage = (consumedCalories / budgetCalories) * 100;
  progress.style.width = `${Math.min(percentage, 100)}%`;
  progress.style.background =
    percentage > 100 ? "var(--dark-red)" : "var(--light-green)";

  outputText.innerHTML = `
    <span class="${surplusOrDeficit.toLowerCase()}">
      ${Math.abs(remainingCalories)} Calorie ${surplusOrDeficit}
    </span>
    <hr>
    <p>${budgetCalories} Calories Budgeted</p>
    <p>${consumedCalories} Calories Consumed</p>
    <p>${exerciseCalories} Calories Burned</p>
  `;

  output.classList.remove("hide");
}

function getCaloriesFromInputs(list) {
  let calories = 0;

  for (const item of list) {
    const currVal = cleanInputString(item.value);

    if (isInvalidInput(currVal)) {
      item.style.border = "2px solid red";
      alert("Invalid input");
      isError = true;
      return 0;
    }

    item.style.border = "1px solid #ccc";
    calories += Number(currVal);
  }

  return calories;
}

function clearForm() {
  document.querySelectorAll(".input-container").forEach(
    (c) => (c.innerHTML = "")
  );
  budgetNumberInput.value = "";
  outputText.innerHTML = "";
  output.classList.add("hide");
}

// events
addEntryButton.addEventListener("click", addEntry);
calorieCounter.addEventListener("submit", calculateCalories);
clearButton.addEventListener("click", clearForm);

// theme toggle PRO
const themeToggle = document.getElementById("theme-toggle");

function updateThemeButton() {
  themeToggle.textContent =
    document.body.classList.contains("light-mode")
      ? "🌙 Dark Mode"
      : "☀️ Light Mode";
}

themeToggle.addEventListener("click", () => {
  document.body.classList.toggle("light-mode");
  updateThemeButton();
});

updateThemeButton();