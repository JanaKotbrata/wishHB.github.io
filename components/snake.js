import { initCanvas } from "./firework.js";
class SnakeGame extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
  }

  connectedCallback() {
    this.shadowRoot.innerHTML = `
      <style>
        .game-container {
          position: relative;
          width: 100%;
          height: 400px;
          background-color: rgba(192,160,126,0.63);
          border: 1px solid #be723d;
          border-radius: 8px;
          box-shadow: 0 0 30px rgb(58,47,68);
        }
        .snake, .food, .special, .obstacle {
          position: absolute;
          width: 20px;
          height: 20px;
        }
        .snake {
          background-color: green;
          border-radius: 7px;
        }
        .food {
         color: red;
         background-image: url('./images/heart.png');
         background-size: cover;
        }
        .special {
         background-image: url('./images/birthday-cake.png');
          background-color: gold;
           background-size: cover;
        }
        .obstacle {
          background-color: black;
        }
        .hidden {
          display: none;
        }
        .submit-btn {/*wtf nefunguje z hb.css,tak je to tady ted*/
          margin-top: 1%;
          padding: 10px;
          font-size: 16px;
          font-weight: bold;
          color: white;
          background-color: rgb(76, 153, 198);
          border: none;
          border-radius: 8px;
          cursor: pointer;
          transition: background-color 0.3s;
        }

        .submit-btn:hover {
            background-color: #0056b3;
        }
        .controls {
          display: flex;
          justify-content: center;
          margin-top: 10px;
        }
        .control-btn {
          width: 50px;
          height: 50px;
          margin: 5px;
          background-color: #4c99c6;
          color: white;
          font-size: 18px;
          font-weight: bold;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          transition: background-color 0.3s;
        }
        .control-btn:active {
          background-color: #3b7ba0;
        }
      </style>
      <div id="for-hidden">
      <p id="info">Pomoz hadovi růst! Sbírej červené jídlo, vyhýbej se překážkám a sněz zlatý dort, aby hra skončila.</p>
      <div class="game-container" id="game-container"></div>
      <div class="controls">
        <button class="control-btn" id="up">↑</button>
      </div>
      <div class="controls">
        <button class="control-btn" id="left">←</button>
        <button class="control-btn" id="down">↓</button>
        <button class="control-btn" id="right">→</button>
      </div>
      </div>
      <div id="game-over" class="hidden">
        <h2>Gratuluji!</h2>
        <p>Snědl jsi dort a dokončil jsi všechny úkoly!</p>
        <button class="submit-btn" id="continue-button">Vyzvednout dárek</button>
      </div>
    `;

    this.gameContainer = this.shadowRoot.getElementById("game-container");
    this.gameOverScreen = this.shadowRoot.getElementById("game-over");
   this.continueButton = this.shadowRoot.getElementById("continue-button");

    this.snake = [{ x: 200, y: 200 }];
    this.direction = { x: 0, y: 0 };
    this.food = { x: this.randomXPosition(), y: this.randomPosition() };
    this.specialFood = { x: this.randomXPosition(), y: this.randomPosition() };
    this.gameInterval = null;

    this.updateObstacleCount(); // Dynamicky nastav počet překážek
    window.addEventListener("resize", this.updateObstacleCount.bind(this)); // Sleduj změny velikosti okna

    this.continueButton.addEventListener("click", this.goToCongratulations.bind(this));
    window.addEventListener("keydown", this.changeDirection.bind(this));

    // Přidání událostí pro tlačítka
    this.shadowRoot.getElementById("up").addEventListener("click", () => this.setDirection(0, -1));
    this.shadowRoot.getElementById("down").addEventListener("click", () => this.setDirection(0, 1));
    this.shadowRoot.getElementById("left").addEventListener("click", () => this.setDirection(-1, 0));
    this.shadowRoot.getElementById("right").addEventListener("click", () => this.setDirection(1, 0));

    this.startGame();
  }

  randomPosition() {
    const containerHeight = this.gameContainer.offsetHeight;
    return Math.floor(Math.random() * (containerHeight / 20)) * 20;
  }

  randomXPosition() {
    const containerWidth = this.gameContainer.offsetWidth;
    return Math.floor(Math.random() * (containerWidth / 20)) * 20;
  }

  generateObstacles(count) {
    const obstacles = [];
    for (let i = 0; i < count; i++) {
      obstacles.push({ x: this.randomXPosition(), y: this.randomPosition() });
    }
    return obstacles;
  }

  updateObstacleCount() {
    const width = this.gameContainer.offsetWidth;
    let count;
    if (width < 500) {
      count = 5; // Pro menší zařízení
    } else if (width < 1080) {
      count = 10; // Pro střední zařízení
    } else {
      count = 15; // Pro větší zařízení
    }
    this.obstacles = this.generateObstacles(count); // Aktualizuj překážky
  }

  createDiv(className, x, y) {
    const div = document.createElement("div");
    div.classList.add(className);
    div.style.left = `${x}px`;
    div.style.top = `${y}px`;
    return div;
  }

  drawGame() {
    this.gameContainer.innerHTML = "";

    this.snake.forEach((segment) => {
      this.gameContainer.appendChild(this.createDiv("snake", segment.x, segment.y));
    });

    this.gameContainer.appendChild(this.createDiv("food", this.food.x, this.food.y));
    this.gameContainer.appendChild(this.createDiv("special", this.specialFood.x, this.specialFood.y));
    this.obstacles.forEach((obstacle) => {
      this.gameContainer.appendChild(this.createDiv("obstacle", obstacle.x, obstacle.y));
    });
  }

  moveSnake() {
    const newHead = {
      x: this.snake[0].x + this.direction.x * 20,
      y: this.snake[0].y + this.direction.y * 20,
    };

    this.snake.unshift(newHead);

    if (newHead.x === this.food.x && newHead.y === this.food.y) {
      this.food = { x: this.randomXPosition(), y: this.randomPosition() };
    } else {
      this.snake.pop();
    }

    if (newHead.x === this.specialFood.x && newHead.y === this.specialFood.y) {
      clearInterval(this.gameInterval);
      this.gameContainer.classList.add("hidden");
      this.gameOverScreen.classList.remove("hidden");
      this.shadowRoot.getElementById("for-hidden").classList.add("hidden");
      return;
    }

    if (this.obstacles.some((obstacle) => obstacle.x === newHead.x && obstacle.y === newHead.y)) {
      alert("Narazil jsi do překážky! Game Over.");
      clearInterval(this.gameInterval);
      this.resetGame();
      return;
    }

    if (
      newHead.x < 0 ||
      newHead.y < 0 ||
      newHead.x >= this.gameContainer.offsetWidth ||
      newHead.y >= this.gameContainer.offsetHeight ||
      this.snake.some((segment, index) => index !== 0 && segment.x === newHead.x && segment.y === newHead.y)
    ) {
      alert("Game Over! Narazil jsi.");
      clearInterval(this.gameInterval);
      this.resetGame();
    }
  }

  changeDirection(event) {
    switch (event.key) {
      case "ArrowUp":
        this.setDirection(0, -1);
        break;
      case "ArrowDown":
        this.setDirection(0, 1);
        break;
      case "ArrowLeft":
        this.setDirection(-1, 0);
        break;
      case "ArrowRight":
        this.setDirection(1, 0);
        break;
    }
  }

  setDirection(x, y) {
    if ((x !== 0 && this.direction.x === 0) || (y !== 0 && this.direction.y === 0)) {
      this.direction = { x, y };
    }
  }

  resetGame() {
    this.snake = [{ x: 200, y: 200 }];
    this.direction = { x: 0, y: 0 };
    this.food = { x: this.randomXPosition(), y: this.randomPosition() };
    this.specialFood = { x: this.randomXPosition(), y: this.randomPosition() };
    this.obstacles = this.generateObstacles(5);
    this.gameContainer.classList.remove("hidden");
    this.gameOverScreen.classList.add("hidden");
    this.startGame();
  }

  startGame() {
    this.gameInterval = setInterval(() => {
      this.moveSnake();
      this.drawGame();
    }, 200);
  }

  goToCongratulations() {
    alert("Miluji Tě! 🥰 Napiš mi na WhatsApp tajný kód: !BUBLINKY!");
    const canvas = document.querySelector("canvas");
    canvas.classList.remove("hidden");
    initCanvas();
  }
}

customElements.define("snake-game", SnakeGame);
