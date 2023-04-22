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
      card.classList.add("menu-item");
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

  cardId.textContent = `${currentIndex + 1} / ${currentDeck.cards.length}`;

  card1.innerHTML = ''; // Clear the content of card1
  card2.classList.add("hidden");

  if (Array.isArray(cardData) && cardData.length === 1) {
    card1.textContent = cardData[0];
    card1.classList.remove("hidden");
  } else {
    // Iterate through the cardData array and create a new paragraph for each item
    cardData.forEach(item => {
      const paragraph = document.createElement('p');
      paragraph.textContent = item;
      card1.appendChild(paragraph);
    });
    card1.classList.remove("hidden");
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

function handleArrowKeys(event) {
  if (event.key === "ArrowRight" || event.key === "ArrowUp") {
    nextCard();
  } else if (event.key === "ArrowLeft" || event.key === "ArrowDown") {
    previousCard();
  }
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


document.addEventListener("keydown", handleArrowKeys);


loadDecks();
