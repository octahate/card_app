const mainMenu = document.getElementById("main-menu");
const cardView = document.getElementById("card-view");
const topRow = document.getElementById("top-row");
const scoreElement = document.getElementById("score");
const cardId = document.getElementById("card-id");
const timerElement = document.getElementById("timer");
const cardArea = document.getElementById("card-area");
const card1 = document.getElementById("card1");
const card2 = document.getElementById("card2");
const bottomRow = document.getElementById("bottom-row");
const menuButton = document.getElementById("menu-button");
const bottomMiddle = document.getElementById("bottom-middle");
const bottomRight = document.getElementById("bottom-right");

let decks;
let currentDeck;
let currentIndex = 0;
let timerInterval;
let score = 0;

async function loadDecks() {
  try {
    const response = await fetch("decks.json");
    decks = await response.json();

    for (const deck of decks) {
      const card = document.createElement("div");
      card.textContent = deck.title;
      card.style.backgroundColor = deck.cardColor;
      card.style.color = deck.textColor;
      card.classList.add("deck-card");
      card.addEventListener("click", () => selectDeck(deck));
      mainMenu.appendChild(card);
    }
  } catch (error) {
    console.error("Error loading decks:", error);
  }
}

function selectDeck(deck) {
  mainMenu.classList.add("hidden");
  cardView.classList.remove("hidden");
  currentDeck = { ...deck, cards: shuffle([...deck.cards]) };
  currentIndex = 0;
  displayCard();
}

function displayCard() {
  const cardData = currentDeck.cards[currentIndex];

  cardId.textContent = `${currentIndex + 1}`;

  if (currentDeck.amount === 1) {
    card1.textContent = cardData;
    card1.classList.remove("hidden");
    card2.classList.add("hidden");
  } else {
    card1.textContent = cardData[0];
    card2.textContent = cardData[1];
    card1.classList.remove("hidden");
    card2.classList.remove("hidden");
  }

  if (currentDeck.attrib.includes("timer")) {
    timerElement.classList.remove("hidden");
    startTimer(currentDeck.timer);
  } else {
    timerElement.classList.add("hidden");
  }

  if (currentDeck.attrib.includes("score")) {
    scoreElement.classList.remove("hidden");
    scoreElement.textContent = `Score: ${score}`;
  } else {
    scoreElement.classList.add("hidden");
  }
}

function startTimer(duration) {
  clearInterval(timerInterval);
  let timeLeft = duration;
  updateTimerDisplay(timeLeft);

  timerInterval = setInterval(() => {
    timeLeft--;

    if (timeLeft < 0) {
      clearInterval(timerInterval);
      // Add timer end behavior (e.g. sound, vibration) here.
    } else {
      updateTimerDisplay(timeLeft);
    }
  }, 1000);
}

function updateTimerDisplay(timeLeft) {
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  timerElement.textContent = `${minutes}:${seconds.toString().padStart(2, "0")}`;
}

function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

function nextCard() {
  currentIndex++;
  if (currentIndex >= currentDeck.cards.length) {
    currentDeck.cards =
    currentDeck.cards = shuffle([...currentDeck.cards]);
    currentIndex = 0;
  }
  displayCard();
}

function previousCard() {
  currentIndex--;
  if (currentIndex < 0) {
    currentIndex = currentDeck.cards.length - 1;
  }
  displayCard();
}

function updateScore(amount) {
  score += amount;
  if (score < 0) {
    score = 0;
  }
  scoreElement.textContent = `Score: ${score}`;
}

cardArea.addEventListener("click", (event) => {
  if (event.clientX < cardArea.clientWidth / 2) {
    previousCard();
  } else {
    nextCard();
  }
});

menuButton.addEventListener("click", () => {
  if (confirm("Are you sure you want to exit?")) {
    cardView.classList.add("hidden");
    mainMenu.classList.remove("hidden");
  }
});

bottomMiddle.addEventListener("click", () => {
  if (currentDeck.attrib.includes("timer")) {
    startTimer(currentDeck.timer);
  } else if (currentDeck.attrib.includes("score")) {
    updateScore(1);
  }
});

bottomRight.addEventListener("click", () => {
  if (currentDeck.attrib.includes("timer")) {
    clearInterval(timerInterval);
    timerElement.textContent = "0:00";
  } else if (currentDeck.attrib.includes("score")) {
    updateScore(-1);
  }
});

loadDecks();
