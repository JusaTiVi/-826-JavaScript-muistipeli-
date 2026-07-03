import { createCardElement, flipCard } from './card.js';

const allCards = [
    '🍎', '🍐', '🍒', '🍉', '🍇', '🍓', '🍌', '🍍', '🥝', '🥥', '🍑', '🍈', '🍋', '🍊', '🍏', '🍅'
];
const gameBoard = document.getElementById('game-board');
let firstCard = null;
let secondCard = null;
let lockBoard = false;

function shuffle(array) {
    array.sort(() => Math.random() - 0.5);
}

export function createBoard(cardCount) {
    const selectedCards = allCards.slice(0, cardCount / 2);
    const cards = [...selectedCards, ...selectedCards];
    shuffle(cards);
    cards.forEach(card => {
        const cardElement = createCardElement(card);
        const listener = () => flipCard(cardElement, handleCardFlip);
        cardElement.addEventListener('click', listener);
        cardElement._listener = listener;
        gameBoard.appendChild(cardElement);
    });
}

function handleCardFlip(cardElement) {
    if (lockBoard) return;
    if (cardElement === firstCard) return;

    if (!firstCard) {
        firstCard = cardElement;
        return;
    }

    secondCard = cardElement;
    checkForMatch();
}

function checkForMatch() {
    let isMatch = firstCard.dataset.card === secondCard.dataset.card;
    isMatch ? disableCards() : unflipCards();
}

function disableCards() {
    firstCard.removeEventListener('click', flipCard._listener);
    secondCard.removeEventListener('click', flipCard._listener);
    resetBoard();
}

function unflipCards() {
    lockBoard = true;
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