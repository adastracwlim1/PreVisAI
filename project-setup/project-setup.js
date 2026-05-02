const dialog = document.querySelector("#scenarioDialog");
const dialogTitle = document.querySelector("#dialogTitle");
const projectName = document.querySelector("#projectName");
const scenarioFile = document.querySelector("#scenarioFile");
const scenarioPreview = document.querySelector("#scenarioPreview");
const continueButton = document.querySelector("#continueButton");
const projectListItems = document.querySelector("#projectListItems");
const newProjectButton = document.querySelector("#newProjectButton");
const newProjectCard = document.querySelector("#newProjectCard");
const dialogCloseButton = document.querySelector("#dialogCloseButton");

const defaultProjects = ["Orbital Witness", "Glass Desert", "Signal Room"];

const projectMeta = {
  "Orbital Witness": "Sci-fi thriller · 4 scenes",
  "Glass Desert": "Speculative drama · 3 scenes",
  "Signal Room": "Espionage short · 2 scenes"
};

let scenarioText = "";

function getProjects() {
  const savedProjects = JSON.parse(localStorage.getItem("projects") || "null");
  return savedProjects || defaultProjects;
}

function saveProjects(projects) {
  localStorage.setItem("projects", JSON.stringify(projects));
}

function addProject(name) {
  const projects = getProjects();

  if (!projects.includes(name)) {
    projects.unshift(name);
    saveProjects(projects);
  }
}

function renderProjects() {
  projectListItems.innerHTML = "";

  getProjects().forEach((name) => {
    const card = document.createElement("button");
    card.className = "project-card";
    card.type = "button";
    card.dataset.project = name;

    const eyebrow = document.createElement("span");
    eyebrow.className = "project-eyebrow";
    eyebrow.textContent = "Project";

    const title = document.createElement("span");
    title.className = "project-title";
    title.textContent = name;

    const foot = document.createElement("span");
    foot.className = "project-foot";

    const meta = document.createElement("span");
    meta.textContent = projectMeta[name] || "Scenario uploaded";

    const arrow = document.createElement("span");
    arrow.className = "project-arrow";
    arrow.textContent = "→";

    foot.append(meta, arrow);
    card.append(eyebrow, title, foot);

    card.addEventListener("click", () => {
      openScenarioDialog(name);
    });

    projectListItems.append(card);
  });
}

function openScenarioDialog(name = "") {
  scenarioText = "";
  dialogTitle.textContent = name ? name : "New project";
  projectName.value = name;
  scenarioFile.value = "";
  scenarioPreview.textContent = "Upload a .txt scenario file.";
  continueButton.disabled = true;
  dialog.showModal();
}

newProjectButton.addEventListener("click", () => {
  openScenarioDialog();
});

newProjectCard.addEventListener("click", () => {
  openScenarioDialog();
});

dialogCloseButton.addEventListener("click", () => {
  dialog.close("cancel");
});

scenarioFile.addEventListener("change", async () => {
  const [file] = scenarioFile.files;

  if (!file) {
    return;
  }

  scenarioText = await file.text();
  scenarioPreview.textContent = scenarioText;
  continueButton.disabled = false;
});

continueButton.addEventListener("click", (event) => {
  event.preventDefault();

  const name = projectName.value.trim() || "Untitled Project";

  addProject(name);
  renderProjects();
  sessionStorage.setItem("projectName", name);
  sessionStorage.setItem("projectScenario", scenarioText);
  window.location.href = "../storyboard-workflow/index.html";
});

renderProjects();
