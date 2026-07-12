import { createCardElement, flipCard } from './card.js';

const allCards = [
    '🍎', '🍐', '🍒', '🍉', '🍇', '🍓', '🍌', '🍍', '🥝', '🥥', '🍑', '🍈', '🍋', '🍊', '🍏', '🍅'
];
const timerElement = document.getElementById("timer");

let attempts = 0;
let seconds = 0;
let timerInterval = null;
const gameBoard = document.getElementById('game-board');
const restartButton = document.getElementById("restart")
let firstCard = null;
let secondCard = null;
let lockBoard = false;

function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

export function createBoard(cardCount) {
    attempts = 0
    if (cardCount === undefined) {
        cardCount = parseInt(
            prompt("Syötä korttien määrä (parillinen luku):"), 10
        )
    }
    resetBoard();
    gameBoard.innerHTML = ""
    startTimer();
    function resetGame() {
        firstCard = null;
        secondCard = null;
        lockBoard = false;
    }

    if (cardCount > allCards.length * 2) {
        alert("luvun täytyy olla alle 32!")
        return
    }
    gameBoard.innerHTML = '';

    const selectedCards = allCards.slice(0, cardCount / 2);
    const cards = [...selectedCards, ...selectedCards];

    shuffle(cards);

    cards.forEach(card => {
        const cardElement = createCardElement(card);

        const listener = () => {
            if (lockBoard) return;
            if (cardElement.classList.contains('flipped')) return;

            flipCard(cardElement);
            handleCardFlip(cardElement);
        }

        cardElement.addEventListener('click', listener);
        cardElement._listener = listener;

        gameBoard.appendChild(cardElement);
    });
}

function handleCardFlip(cardElement) {
    if (!firstCard) {
        firstCard = cardElement;
        return;
    }

    secondCard = cardElement;
    attempts++;
    lockBoard = true;
    checkForMatch();
}

function checkForMatch() {
    let isMatch = firstCard.dataset.card === secondCard.dataset.card;
    isMatch ? disableCards() : unflipCards();
}

function disableCards() {
    firstCard.removeEventListener('click', firstCard._listener);
    secondCard.removeEventListener('click', secondCard._listener);

    checkForWin();
    resetBoard();
}

function checkForWin() {
    const matchedCards = gameBoard.querySelectorAll(".flipped");

    if (matchedCards.length === gameBoard.children.length) {
        stopTimer()

        document.getElementById("final-time").textContent =
            timerElement.textContent.replace("Aika: ", "")

        document.getElementById("final-attempts").textContent = attempts

        document.getElementById("victory-screen").classList.remove("hidden")
    }
}
restartButton.addEventListener("click", () => {
    document.getElementById("victory-screen").classList.add("hidden")
    createBoard()
})
function unflipCards() {
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

function startTimer() {
    clearInterval(timerInterval)

    seconds = 0
    
    timerInterval = setInterval(() => {
        seconds++;
        timerElement.textContent = `Aika: ${seconds}s`
    }, 1000)
}

function stopTimer() {
    clearInterval(timerInterval)
}