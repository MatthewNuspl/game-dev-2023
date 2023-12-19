const suits = ["diamonds", "spades", "hearts", "clubs"];
const values = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"];

let shuffledCards = [];

// Shuffle the cards
function shuffleCards() {
    shuffledCards = [];
    for (const suit of suits) {
        for (const value of values) {
            shuffledCards.push({ suit, value });
        }
    }
    shuffledCards.sort(() => Math.random() - 0.5);
}

// Create the game board
function createGameBoard() {
    const gameBoard = document.getElementById("game-board");

    shuffleCards();

    for (let i = 0; i < shuffledCards.length; i++) {
        const card = document.createElement("div");
        card.className = "card";
        card.innerHTML = `
            <div class="card-inner" onclick="flipCard(this)">
                <div class="card-front">
                    <p>${shuffledCards[i].value}</p>
                    <p class="suit ${shuffledCards[i].suit}">${getSuitSymbol(shuffledCards[i].suit)}</p>
                </div>
                <div class="card-back">
                    <p class="suit ${shuffledCards[i].suit}">${getSuitSymbol(shuffledCards[i].suit)}</p>
                </div>
            </div>
        `;
        gameBoard.appendChild(card);
    }
}

// Get suit symbol
function getSuitSymbol(suit) {
    switch (suit) {
        case "diamonds":
            return "♦";
        case "spades":
            return "♠";
        case "hearts":
            return "♥";
        case "clubs":
            return "♣";
        default:
            return "";
    }
}

// Flip the card
function flipCard(card) {
    card.classList.add("flipped");

    const flippedCards = document.querySelectorAll(".flipped");

    if (flippedCards.length === 2) {
        const [card1, card2] = flippedCards;

        if (card1.innerHTML === card2.innerHTML) {
            // Matched cards
            setTimeout(() => {
                flippedCards.forEach((flippedCard) => flippedCard.classList.remove("flipped"));
            }, 1000);
        } else {
            // Unmatched cards
            setTimeout(() => {
                flippedCards.forEach((flippedCard) => flippedCard.classList.remove("flipped"));
            }, 1000);
        }
    }
}

// Initialize the game
window.onload = function () {
    createGameBoard();
};
