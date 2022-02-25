const difficulty = {
  easy: [1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 6, 6],
  medium: [1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 6, 6, 7, 7, 8, 8, 9, 9, 10, 10, 11, 11, 12, 12],
  hard: [1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 6, 6, 7, 7, 8, 8, 9, 9, 10, 10, 11, 11, 12, 12, 13, 13, 14, 14, 15, 15]
};

const settingButton = document.querySelector(".setting-button");
const settingContainer = document.querySelector(".settings-container");
const complexityButton = document.querySelectorAll(".complexity");
const coverButton = document.querySelectorAll(".cover");
const closeButton = document.querySelector(".close-button");
const startButton = document.querySelector(".start-button");
const cardsContainer = document.querySelector(".cards-container");
const resultsTableButton = document.querySelector(".results-table-button");
const score = document.querySelector(".score");
const time = document.querySelector(".time");
const moves = document.querySelector(".moves");
const move = document.querySelector(".move");
const stopGameModal = document.querySelector(".stop-game");
const winTimeValue = document.querySelector(".win-time-value");
const winMoveValue = document.querySelector(".win-move-value");
const winNameForm = document.querySelector(".win-name");
const winNameValue = document.querySelector(".win-name-input");
const newGameButton = document.querySelectorAll(".new-game-button");
const resultsModal = document.querySelector(".results-modal");
const resultsTable = document.querySelector(".results-table");

let chooseDifficulty = "Easy";
let chooseCover = "marvel";
let results = JSON.parse(localStorage.getItem("results")) || [];
let animation = false;
let timerStart = false;
let firstCard;
let timerId;
let stopwatch = 0;
let moveCalc = 0;
let allCards;

startButton.addEventListener("click", startGame);
newGameButton.forEach((but) => but.addEventListener("click", startGame));
winNameForm.addEventListener("submit", saveName);
closeButton.addEventListener("click", closeModals);
resultsTableButton.addEventListener("click", showResultsModal);
settingButton.addEventListener("click", showSettingModal);
complexityButton.forEach((but) => but.addEventListener("click", changeComplexity));
coverButton.forEach((but) => but.addEventListener("click", changeCover));

["marvel", "dc"].forEach((com) => {
  for (let i = 0; i <= 16; i++) {
    const img = new Image();
    img.src = `./assets/img/${com}/${i}.jpg`;
  }
});

function startGame() {
  startButton.style.display = "none";
  stopGameModal.style.display = "none";
  closeModals();
  clearInterval(timerId);
  timerStart = false;
  stopwatch = 0;
  moveCalc = 0;
  score.style.display = "block";
  time.innerText = "00:00";
  moves.style.display = "block";
  move.innerText = "0";
  cardsContainer.innerHTML = "";

  switch (chooseDifficulty) {
    case "Easy":
      createCards(
        difficulty.easy.sort(() => Math.round(Math.random() * 100) - 50)
      );
      allCards = difficulty.easy.length;
      cardsContainer.style.maxWidth = "430px";
      break;
    case "Medium":
      createCards(
        difficulty.medium.sort(() => Math.round(Math.random() * 100) - 50)
      );
      allCards = difficulty.medium.length;
      cardsContainer.style.maxWidth = "870px";
      break;
    case "Hard":
      createCards(
        difficulty.hard.sort(() => Math.round(Math.random() * 100) - 50)
      );
      allCards = difficulty.hard.length;
      cardsContainer.style.maxWidth = "100%";
      break;
  }
}

function createCards(cards) {
  cards.map((card) => {
    const div = document.createElement("div");
    div.classList.add("card-container");
    div.id = card;

    div.innerHTML = `
      <div class="front-card">
        <img src="./assets/img/${chooseCover}/0.jpg" alt="card">
      </div>
      <div class="back-card">
        <img src="./assets/img/${chooseCover}/${card}.jpg" alt="card">
      </div>`;

    cardsContainer.append(div);
  });

  const allCards = document.querySelectorAll(".card-container");
  allCards.forEach((card) => card.addEventListener("click", clickCard));
}

function clickCard(ev) {
  if (!timerStart) {
    timerId = setInterval(startTimer, 1000);
    timerStart = true;
  }

  const card = ev.path[2];

  const toggleCards = () => {
    card.classList.toggle("rotate");
    firstCard.classList.toggle("rotate");
    card.addEventListener("click", clickCard);
    firstCard.addEventListener("click", clickCard);
    firstCard = "";
    animation = false;
  };

  if (!animation) {
    card.classList.toggle("rotate");
    card.removeEventListener("click", clickCard);

    if (!firstCard) {
      firstCard = card;
    } else {
      if (firstCard.id == card.id) {
        firstCard = "";
        allCards = allCards - 2;
        showMove();
        allCards === 0 ? setTimeout(stopGame, 1000) : "";
      } else {
        animation = true;
        showMove();
        setTimeout(toggleCards, 1000);
      }
    }
  }
}

function startTimer() {
  stopwatch++;
  let min = Math.floor(stopwatch / 60);
  let sec = Math.floor(stopwatch - min * 60);

  min = min < 10 ? "0" + min : min;
  sec = sec < 10 ? "0" + sec : sec;

  time.innerText = `${min}:${sec}`;
}

function showMove() {
  moveCalc++;
  move.innerText = moveCalc;
}

function stopGame() {
  clearInterval(timerId);
  stopGameModal.style.display = "flex";
  winTimeValue.innerText = time.innerText;
  winMoveValue.innerText = move.innerText;
  timerStart = false;
  stopwatch = 0;
  moveCalc = 0;
}

function saveName(ev) {
  ev.preventDefault();
  if (winNameValue.value) {
    results.unshift([
      winNameValue.value,
      winTimeValue.innerText,
      winMoveValue.innerText,
    ]);
    localStorage.setItem("results", JSON.stringify(results));
    startGame();
    showResultsModal();
    winNameValue.value = "";
  }
}

function showResultsModal() {
  closeModals();
  resultsModal.style.display = "flex";
  closeButton.style.display = "block";
  resultsTable.innerHTML = "";

  clearInterval(timerId);
  timerStart = false;

  results.slice(0, 9).map((res) => {
    const div = document.createElement("div");
    div.classList.add("res-container");

    div.innerHTML = `
      <p class="res">${res[0]}</p>
      <p class="res">${res[1]}</p>
      <p class="res">${res[2]}</p>`;

    resultsTable.append(div);
  });
}

function showSettingModal() {
  closeModals();
  closeButton.style.display = "block";
  settingContainer.style.display = "flex";

  clearInterval(timerId);
  timerStart = false;
}

function closeModals() {
  settingContainer.style.display = "none";
  resultsModal.style.display = "none";
  closeButton.style.display = "none";
}

function changeComplexity(ev) {
  complexityButton.forEach((but) => {
    but.classList.remove("is-active");
  });

  ev.target.classList.add("is-active");
  chooseDifficulty = ev.target.innerText;
}

function changeCover(ev) {
  coverButton.forEach((but) => {
    but.classList.remove("is-active");
  });

  ev.target.classList.add("is-active");
  chooseCover = ev.target.alt;

  if (ev.target.alt === "marvel") {
    document.documentElement.style.setProperty("--color", "#8a1b22");
    document.documentElement.style.setProperty("--colorFilter", "invert(16%) sepia(55%) saturate(3254%) hue-rotate(338deg) brightness(88%) contrast(98%)");
  } else {
    document.documentElement.style.setProperty("--color", "#003979");
    document.documentElement.style.setProperty("--colorFilter", "invert(13%) sepia(91%) saturate(2304%) hue-rotate(200deg) brightness(98%) contrast(102%)");
  }
}
