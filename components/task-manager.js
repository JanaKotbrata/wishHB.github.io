import { taskList } from "../helpers/task-config.js";
class TaskManager extends HTMLElement {
  constructor() {
    super();

    // Shadow DOM
    this.attachShadow({ mode: "open" });

    // Inicializace vlastností
    this.tasks = []; // Pole úkolů
    this.currentTaskIndex = 0; // Index aktuálního úkolu
  }

  connectedCallback() {
    this.tasks = taskList;

    this.renderTask();
  }

  renderTask() {
    // Vymažeme Shadow DOM pro další úkol
    this.shadowRoot.innerHTML = "";
    // Načti data aktuálního úkolu
    const task = this.tasks[this.currentTaskIndex];

    // Vytvoř styl komponenty
    const style = document.createElement("link");
    style.rel = "stylesheet";
    style.href = "css/hb.css";

    // Vytvoření obalu pro úkol
    const wrapper = document.createElement("div");
    wrapper.id = task?.id;
    wrapper.className = task?.class;
    wrapper.innerHTML = `
      <label><h2>${task?.h2}</h2></label>
      <input type="text" id="${task?.inputId}" placeholder="Napiš odpověď">
      <button class="submit-btn">Odeslat</button>
      <p class="hidden" style="color: red;">Špatně, zkus to znovu!</p>
    `;

    // Přidání Event Listeneru pro tlačítko
    wrapper.querySelector(".submit-btn").addEventListener("click", () => this.checkAnswer(task));

    // Přidání do Shadow DOM
    this.shadowRoot.appendChild(style);
    this.shadowRoot.appendChild(wrapper);
  }

  checkAnswer(task) {
    // Získáme hodnotu odpovědi
    const input = this.shadowRoot.querySelector(`#${task.inputId}`);
    const hint = this.shadowRoot.querySelector("p");
    const value = input.value.toLowerCase().replace(" ", "");
    if ((Array.isArray(task.correctAnswer) && task.correctAnswer.includes(value)) || value === task.correctAnswer) {
      // Pokud je odpověď správná, přejdi na další úkol nebo zobraz gratulace
      this.currentTaskIndex++;
      if (this.currentTaskIndex < this.tasks.length) {
        this.renderTask(); // Další úkol
      } else {
        this.showCongratulations(); // Gratulace
      }
    } else {
      // Špatná odpověď, zobraz nápovědu
      hint.classList.remove("hidden");
    }
  }
  showCongratulations() {
    // Vyčistíme Shadow DOM
    this.shadowRoot.innerHTML = `
      <snake-game></snake-game>
    `;
  }
}

customElements.define("task-manager", TaskManager);
