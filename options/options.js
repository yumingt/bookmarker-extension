const rulesContainer = document.querySelector(".rules-container");

let rules = {
  yes: "no"
};

function makeRule(start, dest) {
  let rule = document.createElement("div");
  rule.classList.add("rule");
  rule.id = start;

  rule.innerHTML = `
  <span class="start">${start}</span>
  <span class="join">is converted to</span>
  <span class="dest">${dest}</span>`;

  let removeButton = document.createElement("button");
  removeButton.value = start;
  removeButton.onclick = removeRule;
  removeButton.innerText = "remove";

  rule.appendChild(removeButton);

  rulesContainer.appendChild(rule);
}

function restoreRules() {
  chrome.storage.sync.get({ rules: rules }, function (items) {
    rules = items.rules;
    for (const entry of Object.entries(items.rules)) {
      makeRule(entry[0], entry[1]);
    }
  });
}

function saveRule(start, dest) {
  rules[start] = dest;
  chrome.storage.sync.set({ rules: rules }, function () {
    makeRule(start, dest);
  });
}

function removeRule(e) {
  const ruleToRemove = e.target.value;

  delete rules[ruleToRemove];
  chrome.storage.sync.set({ rules: rules }, function () {
    document.getElementById(ruleToRemove).remove();
  });
}

document.addEventListener("DOMContentLoaded", restoreRules);

document.getElementById("add-rule").addEventListener("click", (e) => {
  const start = document.querySelector("#rule-start");
  const end = document.querySelector("#rule-dest");

  saveRule(start.value, end.value);
  start.value = "";
  end.value = "";
});
