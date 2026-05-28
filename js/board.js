import { createCardElement, flipCard } from './card.js';

const allCards = [
    '🍎', '🍐', '🍒', '🍉', '🍇', '🍓', '🍌', '🍍', '🥝', '🥥', '🍑', '🍈', '🍋', '🍊', '🍏', '🍅'
];
const gameBoard = document.getElementById('game-board');
let firstCard = null; // ensimmäinen käännetty kortti
let secondCard = null; // toinen käännetty kortti
let lockBoard = false; // lukitsee laudan

// sekoittaa kortit
function shuffle(array) {
    array.sort(() => Math.random() - 0.5);
}

// luo pelilaudan, funktion arvo on korttien määrä
export function createBoard(cardCount) {
    const selectedCards = allCards.slice(0, cardCount / 2);
    const cards = [...selectedCards, ...selectedCards];
    shuffle(cards);
    cards.forEach(card => {
        const cardElement = createCardElement(card);
        cardElement.addEventListener('click', () => flipCard(cardElement, handleCardFlip));
        gameBoard.appendChild(cardElement);
    });
}

// käsittelee kortin kääntämisen
function handleCardFlip(cardElement) {
    // jos lauta on lukittu tai kortti on sama kuin alkuperäinen, älä tee mitään
    if (lockBoard) return;
    if (cardElement === firstCard) return;

    cardElement.classList.add('flipped');
    cardElement.textContent = cardElement.dataset.card;

    
    if (!firstCard) {
        firstCard = cardElement;
        return;
    }

    secondCard = cardElement;
    checkForMatch();
}

// katsoo onko käännetyt kortit saman arvoisia
function checkForMatch() {
    let isMatch = firstCard.dataset.card === secondCard.dataset.card;
    isMatch ? disableCards() : unflipCards();
}

// estää pelaajaa koskemasta käännettyjä kortteja
function disableCards() {
    firstCard.removeEventListener('click', flipCard);
    secondCard.removeEventListener('click', flipCard);
    resetBoard();
}

function unflipCards() {
    lockBoard = true;

    // miten kauan parittomat kortit pysyvät käännettyinä
    setTimeout(() => {
        firstCard.classList.remove('flipped');
        secondCard.classList.remove('flipped');
        firstCard.textContent = '';
        secondCard.textContent = '';
        resetBoard();
    }, 1500);
}

function resetBoard() {
    [firstCard, secondCard, lockBoard] = [null, null, false];
}