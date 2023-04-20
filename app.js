const menu = document.getElementById('menu');
const deckView = document.getElementById('deck-view');
const scoreDiv = document.getElementById('score');
const cardIdDiv = document.getElementById('card-id');
const timerDiv = document.getElementById('timer');
const cardArea = document.getElementById('card-area');
const menuButton = document.getElementById('menu-button');
const bottomMiddle = document.getElementById('bottom-middle');
const bottomRight = document.getElementById('bottom-right');

let currentDeck;
let currentIndex = 0;
let timerInterval;

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

function formatTime(seconds) {
  const minutes = Math.floor(seconds / 60);
  seconds %= 60;
  return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

function startTimer(duration) {
  let remaining = duration;
  timerDiv.textContent = formatTime(remaining);

  timerInterval = setInterval(() => {
    remaining -= 1;
    timerDiv.textContent = formatTime(remaining);

    if (remaining <= 0) {
      clearInterval(timerInterval);
      // Add audio and visual effects here
    }
  }, 1000);
}

function loadDeck(deck) {
  currentDeck = { ...deck, cards: [...deck.cards] };
  shuffleArray(currentDeck.cards);
  currentIndex = 0;

  if (currentDeck.attrib.includes('score')) {
    scoreDiv.textContent = '0';
    bottomMiddle.textContent = '+1';
    bottomRight.textContent = '-1';
    bottomMiddle.onclick = () => {
      const currentScore = parseInt(scoreDiv.textContent, 10);
      scoreDiv.textContent = (currentScore + 1).toString();
    };
    bottomRight.onclick = () => {
      const currentScore = parseInt(scoreDiv.textContent, 10);
      scoreDiv.textContent = Math.max(currentScore - 1, 0).toString();
    };
  }

  if (currentDeck.attrib.includes('timer')) {
    const timerDuration = parseInt(currentDeck.timer, 10);
    bottomMiddle.textContent = 'Start';
    bottomRight.textContent = 'Reset';
    bottomMiddle.onclick = () => {
      clearInterval(timerInterval);
      startTimer(timerDuration);
    };
    bottomRight.onclick = () => {
      clearInterval(timerInterval);
      timerDiv.textContent = formatTime(timerDuration);
    };
  }

  displayCard();
}

function displayCard() {
  const card = currentDeck.cards[currentIndex];
  cardArea.innerHTML = '';
  cardArea.style.backgroundColor = currentDeck.card_color;
  cardArea.style.color = currentDeck.text_color;
  
  card.forEach((line) => {
    const lineElement = document.createElement('p');
    lineElement.textContent = line;
    cardArea.appendChild(lineElement);
  });

  if (currentDeck.amount === 1) {
    cardIdDiv.textContent = `Card ${currentIndex + 1}`;
  } else {
    cardIdDiv.textContent = `Cards ${currentIndex + 1}-${currentIndex + 2}`;
  }
}

function nextCard() {
  currentIndex = (currentIndex + currentDeck.amount) % currentDeck.cards.length;
  displayCard();
}

function prevCard() {
  currentIndex -= currentDeck.amount;
  if (currentIndex < 0) {
    currentIndex += currentDeck.cards.length
  }
  displayCard();
}

menuButton.onclick = () => {
  if (confirm('Are you sure you want to exit?')) {
    deckView.style.display = 'none';
    menu.style.display = 'flex';
    clearInterval(timerInterval);
  }
};

cardArea.onclick = (event) => {
  if (event.clientX > window.innerWidth / 2) {
    nextCard();
  } else {
    prevCard();
  }
};

// Swipe event handling
cardArea.addEventListener('touchstart', handleTouchStart, false);
cardArea.addEventListener('touchmove', handleTouchMove, false);

let xDown = null;

function handleTouchStart(event) {
  xDown = event.touches[0].clientX;
}

function handleTouchMove(event) {
  if (!xDown) {
    return;
  }

  const xUp = event.touches[0].clientX;
  const xDiff = xDown - xUp;

  if (Math.abs(xDiff) > 50) {
    if (xDiff > 0) {
      nextCard();
    } else {
      prevCard();
    }
    xDown = null;
  }
}

// Fetch decks and create menu items
fetch('decks.json')
  .then((response) => response.json())
  .then((decks) => {
    decks.forEach((deck) => {
      const menuItem = document.createElement('div');
      menuItem.className = 'menu-item';
      menuItem.style.backgroundColor = deck.card_color;
      menuItem.style.color = deck.text_color;
      menuItem.textContent = deck.title;
      menuItem.onclick = () => {
        menu.style.display = 'none';
        deckView.style.display = 'flex';
        loadDeck(deck);
      };
      menu.appendChild(menuItem);
    });
  });
