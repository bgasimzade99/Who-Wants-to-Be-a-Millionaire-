// ====== CONFIG ======
const QUESTION_TIME = 30; // seconds
const MONEY_PER_QUESTION = 1000;

// Put your audio files in same folder OR use a URL
const sfx = {
  correct: new Audio("correct.mp3"),
  win: new Audio("win.mp3"),
  wrong: new Audio("wrong.mp3"),
  timeout: new Audio("wrong.mp3"),
  clock: new Audio("clock.mp3"),
};

// ====== STATE ======
const questions = [
  { q: "What is the capital of France?", options: ["Berlin", "Madrid", "Paris", "Rome"], answer: "Paris" },
  { q: "Who wrote 'To Kill a Mockingbird'?", options: ["Harper Lee", "Mark Twain", "Ernest Hemingway", "F. Scott Fitzgerald"], answer: "Harper Lee" },
  { q: "What is the largest planet in our solar system?", options: ["Earth", "Jupiter", "Mars", "Saturn"], answer: "Jupiter" },
  { q: "What is the chemical symbol for gold?", options: ["Au", "Ag", "Fe", "Pb"], answer: "Au" },
  { q: "Who painted the Mona Lisa?", options: ["Leonardo da Vinci", "Pablo Picasso", "Vincent van Gogh", "Claude Monet"], answer: "Leonardo da Vinci" },
  { q: "What is the smallest prime number?", options: ["0", "1", "2", "3"], answer: "2" },
  { q: "What is the largest mammal?", options: ["Elephant", "Blue Whale", "Giraffe", "Hippopotamus"], answer: "Blue Whale" },
  { q: "Who is the author of '1984'?", options: ["George Orwell", "Aldous Huxley", "Ray Bradbury", "Philip K. Dick"], answer: "George Orwell" },
  { q: "What is the currency of Japan?", options: ["Yen", "Dollar", "Euro", "Pound"], answer: "Yen" },
  { q: "What is the largest ocean on Earth?", options: ["Atlantic Ocean", "Indian Ocean", "Arctic Ocean", "Pacific Ocean"], answer: "Pacific Ocean" },
  { q: "Who discovered penicillin?", options: ["Alexander Fleming", "Marie Curie", "Louis Pasteur", "Isaac Newton"], answer: "Alexander Fleming" },
  { q: "What is the tallest mountain in the world?", options: ["Mount Everest", "K2", "Kangchenjunga", "Lhotse"], answer: "Mount Everest" },
  { q: "What is the chemical formula for water?", options: ["H2O", "CO2", "O2", "NaCl"], answer: "H2O" },
];

let currentIndex = 0;
let money = 0;
let locked = false;

let timer = QUESTION_TIME;
let timerId = null;

// ====== DOM ======
const gameContainer = document.getElementById("game-container");
const startBtn = document.getElementById("start-button");
const nextBtn = document.getElementById("next-button");

// UI nodes we control
const ui = {
  topBar: document.createElement("div"),
  moneyText: document.createElement("div"),
  timerText: document.createElement("div"),
  questionEl: document.createElement("h2"),
  optionsWrap: document.createElement("div"),
  statusEl: document.createElement("div"),
};

// ====== INIT UI ======
function initUI() {
  ui.topBar.style.display = "flex";
  ui.topBar.style.justifyContent = "space-between";
  ui.topBar.style.alignItems = "center";
  ui.topBar.style.marginTop = "12px";
  ui.topBar.style.gap = "12px";

  ui.moneyText.style.fontWeight = "700";
  ui.timerText.style.fontWeight = "700";

  ui.optionsWrap.style.display = "grid";
  ui.optionsWrap.style.gridTemplateColumns = "1fr 1fr";
  ui.optionsWrap.style.gap = "10px";
  ui.optionsWrap.style.marginTop = "12px";

  ui.statusEl.style.marginTop = "12px";
  ui.statusEl.style.fontWeight = "700";

  ui.topBar.appendChild(ui.moneyText);
  ui.topBar.appendChild(ui.timerText);

  gameContainer.appendChild(ui.topBar);
  gameContainer.appendChild(ui.questionEl);
  gameContainer.appendChild(ui.optionsWrap);
  gameContainer.appendChild(ui.statusEl);

  nextBtn.style.display = "none";
}
initUI();

// ====== EVENTS ======
startBtn.addEventListener("click", startGame);
nextBtn.addEventListener("click", nextQuestion);

// ====== SOUND HELPERS ======
function safePlay(audio) {
  try {
    audio.currentTime = 0;
    audio.play();
  } catch (e) {}
}

function startClock() {
  try {
    sfx.clock.loop = true;
    sfx.clock.currentTime = 0;
    sfx.clock.play();
  } catch (e) {}
}

function stopClock() {
  try {
    sfx.clock.pause();
    sfx.clock.currentTime = 0;
  } catch (e) {}
}

// ====== GAME FLOW ======
function startGame() {
  currentIndex = 0;
  money = 0;
  locked = false;

  startBtn.style.display = "none";
  nextBtn.style.display = "none";
  ui.statusEl.textContent = "";

  renderQuestion();
}

function nextQuestion() {
  if (currentIndex >= questions.length - 1) {
    ui.statusEl.textContent = `You finished the game! 🎉 Total: $${money}`;
    nextBtn.style.display = "none";
    safePlay(sfx.win);

    startBtn.style.display = "inline-block";
    startBtn.textContent = "Play Again";
    stopTimer();
    return;
  }

  currentIndex++;
  ui.statusEl.textContent = "";
  renderQuestion();
}

function renderQuestion() {
  locked = false;
  clearOptions();

  const q = questions[currentIndex];
  ui.questionEl.textContent = `Q${currentIndex + 1}: ${q.q}`;

  updateMoney();
  startTimer();

  q.options.forEach((opt) => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.textContent = opt;

    btn.style.padding = "12px";
    btn.style.borderRadius = "10px";
    btn.style.border = "1px solid #333";
    btn.style.cursor = "pointer";
    btn.style.fontWeight = "600";

    btn.addEventListener("click", () => chooseAnswer(btn, opt));
    ui.optionsWrap.appendChild(btn);
  });
}

function chooseAnswer(clickedButton, selectedOption) {
  if (locked) return;
  locked = true;

  stopTimer();

  const q = questions[currentIndex];
  const buttons = Array.from(ui.optionsWrap.querySelectorAll("button"));

  buttons.forEach((b) => (b.disabled = true));

  const correctBtn = buttons.find((b) => b.textContent === q.answer);
  if (correctBtn) {
    correctBtn.style.backgroundColor = "green";
    correctBtn.style.color = "white";
  }

  if (selectedOption === q.answer) {
    safePlay(sfx.correct);
    money += MONEY_PER_QUESTION;

    ui.statusEl.textContent = `Correct ✅ You won $${MONEY_PER_QUESTION}. Total: $${money}`;
    updateMoney();

    nextBtn.style.display = "inline-block";
  } else {
    safePlay(sfx.wrong);
    clickedButton.style.backgroundColor = "red";
    clickedButton.style.color = "white";

    gameOver("Wrong answer ❌ You lost everything. Total: $0");
  }
}

function gameOver(message) {
  money = 0;
  updateMoney();
  ui.statusEl.textContent = message;

  locked = true;
  stopTimer();

  Array.from(ui.optionsWrap.querySelectorAll("button")).forEach((b) => (b.disabled = true));

  nextBtn.style.display = "none";
  startBtn.style.display = "inline-block";
  startBtn.textContent = "Restart";
}

// ====== TIMER ======
function startTimer() {
  stopTimer();     // clear any old timer + stop clock
  startClock();    // start ticking sound

  timer = QUESTION_TIME;
  updateTimer();

  timerId = setInterval(() => {
    timer--;
    updateTimer();

    if (timer <= 0) {
      stopTimer();
      safePlay(sfx.timeout);
      gameOver("Time is up ⏳ You lost everything. Total: $0");
    }
  }, 1000);
}

function stopTimer() {
  if (timerId) {
    clearInterval(timerId);
    timerId = null;
  }
  stopClock();
}

function updateTimer() {
  ui.timerText.textContent = `⏱️ ${timer}s`;
}

function updateMoney() {
  ui.moneyText.textContent = `💰 $${money}`;
}

// ====== HELPERS ======
function clearOptions() {
  ui.optionsWrap.innerHTML = "";
}