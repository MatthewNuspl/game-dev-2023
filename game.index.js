<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
    <link rel="stylesheet" href="style.css">
</head>
<body>
    <header>
        <div class="header-title-container">
            <h1>Hunt the Ace</h1>
        </div>
        <div class="header-round-info-container">
            <div class="header-img-container">
                <img src="/images/AceSpades.png" alt="" class="header-img">
            </div>
            <div class="header-score-container">
                <h2 class="score">Score&nbsp;<span class="badge">0</span></h2>
            </div>
            <div class="header-round-container">
                <h2 class="round">Round&nbsp;<span class="badge">0</span></h2>
            </div>
        </div>
        <div class="header-status-info-container">
            <p class="current-status">
                Click 'Play Game' button to play game
            </p>
        </div>
        <div class="header-button-container">
            <div class="game-play-button-container">
                <button id = "playGame" class="play-game">Play Game</button>
            </div>
        </div>
    </header>
    <main>
        <div class="card-container">
            <div class="card-pos-a">

            </div>
            <div class="card-pos-b">
                
            </div>
            <div class="card-pos-c">
                
            </div>
            <div class="card-pos-d">
                
            </div>
        </div>
    </main>
    <script src="game.html"></script>
<script>
const cardObjectDefinitions = [
    {id:1, imagePath:'king of hearts.png'},
    {id:2, imagePath:'Jack of clubs.png'},
    {id:3, imagePath:'Queen of diamonds.jfif'},
    {id:4, imagePath:'Ace of spades.png'}
]
const aceId = 4

const cardBackImgPath = 'card facing down.jfif'

let cards = []

const playGameButtonElem = document.getElementById('playGame')

const cardContainerElem = document.querySelector('.card-container')

const collapsedGridAreaTemplate = '"a a" "a a"'
const cardCollectionCellClass = ".card-pos-a"

const numCards = cardObjectDefinitions.length

let cardPositions = []


let gameInProgress = false 
let shufflingInProgress = false 
let cardsRevealed = false


const currentGameStatusElem = document.querySelector('.current-status')
const scoreContainerElem = document.querySelector('.header-score-container')
const scoreElem = document.querySelector('.score')
const roundContainerElem = document.querySelector('.header-round-container')
const roundElem = document.querySelector('.round')

const winColor = "green"
const loseColor = "red"
const primaryColor = "black"

let roundNum = 0
let maxRounds = 4
let score = 0

let gameObj = {}

const localStorageGameKey = "HTA"


/* <div class="card">
<div class="card-inner">
    <div class="card-front">
        <img src="/images/card-JackClubs.png" alt="" class="card-img">
    </div>
    <div class="card-back">
        <img src="/images/card-back-Blue.png" alt="" class="card-img">
    </div>
</div>
</div> */


loadGame()


function gameOver()
{
    updateStatusElement(scoreContainerElem,"none")
    updateStatusElement(roundContainerElem,"none")

    const gameOverMessage = `Game Over! Final Score - <span class = 'badge'>${score}</span> Click 'Play Game' button to play again`

    updateStatusElement(currentGameStatusElem,"block",primaryColor,gameOverMessage)

    gameInProgress = false
    playGameButtonElem.disabled = false
}

function endRound()
{
    setTimeout(()=>{
        if(roundNum == maxRounds)
        {
            gameOver()
            return
        }
        else
        {
            startRound()
        }
    },3000)
}

function chooseCard(card)
{
    if(canChooseCard())
    {
        evaluateCardChoice(card)
        saveGameObjectToLocalStorage(score, roundNum)
        flipCard(card,false)

        setTimeout(() => {
            flipCards(false)
            updateStatusElement(currentGameStatusElem,"block", primaryColor,"Card positions revealed")

            endRound()

        },3000)
        cardsRevealed = true
    }

}

function calculateScoreToAdd(roundNum)
{
    if(roundNum == 1)
    {
        return 100
    }
    else if(roundNum == 2)
    {
        return 50
    }
    else if(roundNum == 3)
    {
        return 25
    }
    else
    {
        return 10
    }
}

function calculateScore()
{
    const scoreToAdd = calculateScoreToAdd(roundNum)
    score = score + scoreToAdd
}

function updateScore()
{
    calculateScore()
    updateStatusElement(scoreElem, "block", primaryColor, `Score <span class='badge'>${score}</span>`)

}

function updateStatusElement(elem, display, color, innerHTML)
{
    elem.style.display = display

    if(arguments.length > 2)
    {
        elem.style.color = color
        elem.innerHTML = innerHTML
    }

}

function outputChoiceFeedBack(hit)
{
    if(hit)
    {
        updateStatusElement(currentGameStatusElem, "block", winColor, "Hit!! - Well Done!! :)")
    }
    else
    {
        updateStatusElement(currentGameStatusElem, "block", loseColor, "Missed!! :(")
    }
}

function evaluateCardChoice(card)
{
    if(card.id == aceId)
    {
        updateScore()
        outputChoiceFeedBack(true)
    }
    else
    {
        outputChoiceFeedBack(false)
    }
}

function canChooseCard()
{
    return gameInProgress == true && !shufflingInProgress && !cardsRevealed
}



function loadGame(){
    createCards()

    cards = document.querySelectorAll('.card')

    cardFlyInEffect()

    playGameButtonElem.addEventListener('click', ()=>startGame())

    updateStatusElement(scoreContainerElem,"none")
    updateStatusElement(roundContainerElem,"none")

}

function checkForIncompleteGame()
{
    const serializedGameObj = getLocalStorageItemValue(localStorageGameKey)
    if(serializedGameObj)
    {
        gameObj = getObjectFromJSON(serializedGameObj)

        if(gameObj.round >= maxRounds)
        {
            removeLocalStorageItem(localStorageGameKey)
        }
        else
        {
            if(confirm('Would you like to continue with your last game?'))
            {
                score = gameObj.score
                roundNum = gameObj.round
            }
        }

    }

}

function startGame(){
    initializeNewGame()
    startRound()

}
function initializeNewGame(){
    score = 0
    roundNum = 0

    checkForIncompleteGame()

    shufflingInProgress = false

    updateStatusElement(scoreContainerElem,"flex")
    updateStatusElement(roundContainerElem,"flex")

    updateStatusElement(scoreElem,"block",primaryColor,`Score <span class='badge'>${score}</span>`)
    updateStatusElement(roundElem,"block",primaryColor,`Round <span class='badge'>${roundNum}</span>`)

}
function startRound()
{
    initializeNewRound()
    collectCards()
    flipCards(true)
    shuffleCards()

}
function initializeNewRound()
{
    roundNum++
    playGameButtonElem.disabled = true

    gameInProgress = true
    shufflingInProgress = true
    cardsRevealed = false

    updateStatusElement(currentGameStatusElem, "block", primaryColor, "Shuffling...")
    
    updateStatusElement(roundElem, "block", primaryColor, `Round <span class='badge'>${roundNum}</span>`)

}

function collectCards(){
    transformGridArea(collapsedGridAreaTemplate)
    addCardsToGridAreaCell(cardCollectionCellClass)

}

function transformGridArea(areas)
{
    cardContainerElem.style.gridTemplateAreas = areas

}
function addCardsToGridAreaCell(cellPositionClassName)
{
    const cellPositionElem = document.querySelector(cellPositionClassName)

    cards.forEach((card, index) =>{
        addChildElement(cellPositionElem, card)
    })

}

function flipCard(card, flipToBack)
{
    const innerCardElem = card.firstChild

    if(flipToBack && !innerCardElem.classList.contains('flip-it'))
    {
        innerCardElem.classList.add('flip-it')
    }
    else if(innerCardElem.classList.contains('flip-it'))
    {
        innerCardElem.classList.remove('flip-it')
    }

}

function flipCards(flipToBack){
    cards.forEach((card,index)=>{
        setTimeout(() => {
            flipCard(card,flipToBack)
        },index * 100)
    })
}

function cardFlyInEffect()
{
    const id = setInterval(flyIn, 5)
    let cardCount = 0

    let count = 0

    function flyIn()
    {
        count++
        if(cardCount == numCards)
        {
            clearInterval(id)
            playGameButtonElem.style.display = "inline-block"            
        }
        if(count == 1 || count == 250 || count == 500 || count == 750)
        {
            cardCount++
            let card = document.getElementById(cardCount)
            card.classList.remove("fly-in")
        }
    }



}

function removeShuffleClasses()
{
    cards.forEach((card) =>{
        card.classList.remove("shuffle-left")
        card.classList.remove("shuffle-right")
    })
}
function animateShuffle(shuffleCount)
{
    const random1 = Math.floor(Math.random() * numCards) + 1
    const random2 = Math.floor(Math.random() * numCards) + 1

    let card1 = document.getElementById(random1)
    let card2 = document.getElementById(random2)

    if (shuffleCount % 4 == 0)
    {
        card1.classList.toggle("shuffle-left")
        card1.style.zIndex = 100
    }
    if (shuffleCount % 10 == 0)
    {
        card2.classList.toggle("shuffle-right")
        card2.style.zIndex = 200
    }

}

function shuffleCards()
{
    let shuffleCount = 0
    const id = setInterval(shuffle, 12)


    function shuffle()
    {
        randomizeCardPositions()
       
        animateShuffle(shuffleCount)
       
        if(shuffleCount == 500)
        {
            clearInterval(id)
            shufflingInProgress = false
            removeShuffleClasses()
            dealCards()
            updateStatusElement(currentGameStatusElem, "block", primaryColor, "Please click the card that you think is the Ace of Spades...")

        }
        else{
            shuffleCount++
        }

    }

}
function randomizeCardPositions()
{
    const random1 = Math.floor(Math.random() * numCards) + 1
    const random2 = Math.floor(Math.random() * numCards) + 1

    const temp = cardPositions[random1 - 1]

    cardPositions[random1 - 1] = cardPositions[random2 - 1]
    cardPositions[random2 - 1] = temp

}
function dealCards()
{
    addCardsToAppropriateCell()
    const areasTemplate = returnGridAreasMappedToCardPos()

    transformGridArea(areasTemplate)

}
function returnGridAreasMappedToCardPos()
{
    let firstPart = ""
    let secondPart = ""
    let areas = ""

    cards.forEach((card, index) => {
        if(cardPositions[index] == 1)
        {
            areas = areas + "a "
        }
        else if(cardPositions[index] == 2)
        {
            areas = areas + "b "
        }
        else if (cardPositions[index] == 3)
        {
            areas = areas + "c "
        }
        else if (cardPositions[index] == 4)
        {
            areas = areas + "d "
        }
        if (index == 1)
        {
            firstPart = areas.substring(0, areas.length - 1)
            areas = "";
        }
        else if (index == 3)
        {
            secondPart = areas.substring(0, areas.length - 1)
        }

    })

    return `"${firstPart}" "${secondPart}"`


}


function addCardsToAppropriateCell()
{
    cards.forEach((card)=>{
        addCardToGridCell(card)
    })
}



function createCards()
{
    cardObjectDefinitions.forEach((cardItem)=>{
        createCard(cardItem)
    })
}


function createCard(cardItem){

    //create div elements that make up a card
    const cardElem = createElement('div')
    const cardInnerElem = createElement('div')
    const cardFrontElem = createElement('div')
    const cardBackElem = createElement('div')

    //create front and back image elements for a card
    const cardFrontImg = createElement('img')
    const cardBackImg = createElement('img')

    //add class and id to card element
    addClassToElement(cardElem, 'card')
    addClassToElement(cardElem, 'fly-in')
    addIdToElement(cardElem, cardItem.id)

    //add class to inner card element
    addClassToElement(cardInnerElem, 'card-inner')
    
    //add class to front card element
    addClassToElement(cardFrontElem, 'card-front')

    //add class to back card element
    addClassToElement(cardBackElem, 'card-back')

    //add src attribute and appropriate value to img element - back of card
    addSrcToImageElem(cardBackImg, cardBackImgPath)

    //add src attribute and appropriate value to img element - front of card
    addSrcToImageElem(cardFrontImg, cardItem.imagePath)

    //assign class to back image element of back of card
    addClassToElement(cardBackImg, 'card-img')
   
    //assign class to front image element of front of card
    addClassToElement(cardFrontImg, 'card-img')

    //add front image element as child element to front card element
    addChildElement(cardFrontElem, cardFrontImg)

    //add back image element as child element to back card element
    addChildElement(cardBackElem, cardBackImg)

    //add front card element as child element to inner card element
    addChildElement(cardInnerElem, cardFrontElem)

    //add back card element as child element to inner card element
    addChildElement(cardInnerElem, cardBackElem)

    //add inner card element as child element to card element
    addChildElement(cardElem, cardInnerElem)

    //add card element as child element to appropriate grid cell
    addCardToGridCell(cardElem)

    initializeCardPositions(cardElem)

    attatchClickEventHandlerToCard(cardElem)


}
function attatchClickEventHandlerToCard(card){
    card.addEventListener('click', () => chooseCard(card))
}

function initializeCardPositions(card)
{
    cardPositions.push(card.id)
}

function createElement(elemType){
    return document.createElement(elemType)

}
function addClassToElement(elem, className){
    elem.classList.add(className)
}
function addIdToElement(elem, id){
    elem.id = id
}
function addSrcToImageElem(imgElem, src){
    imgElem.src = src
}
function addChildElement(parentElem, childElem){
    parentElem.appendChild(childElem)
}

function addCardToGridCell(card)
{
    const cardPositionClassName = mapCardIdToGridCell(card)

    const cardPosElem = document.querySelector(cardPositionClassName)

    addChildElement(cardPosElem, card)

}
function mapCardIdToGridCell(card){
   
    if(card.id == 1)
    {
        return '.card-pos-a'
    }
    else if(card.id == 2)
    {
        return '.card-pos-b'
    }
    else if(card.id == 3)
    {
        return '.card-pos-c'
    }
    else if(card.id == 4)
    {
        return '.card-pos-d'
    }
}

//local storage functions
function getSerializedObjectAsJSON(obj)
{
    return JSON.stringify(obj)
}
function getObjectFromJSON(json)
{
    return JSON.parse(json)
}
function updateLocalStorageItem(key, value)
{
    localStorage.setItem(key, value)
}
function removeLocalStorageItem(key)
{
    localStorage.removeItem(key)
}
function getLocalStorageItemValue(key)
{
    return localStorage.getItem(key)
}

function updateGameObject(score,round)
{
    gameObj.score = score
    gameObj.round = round
}
function saveGameObjectToLocalStorage(score,round)
{
    updateGameObject(score, round)
    updateLocalStorageItem(localStorageGameKey, getSerializedObjectAsJSON(gameObj))
}
</script>
<styles> @import url('https://fonts.googleapis.com/css2?family=Quicksand&display=swap');
:root{
    --card-width-lg:157px;
    --card-height-lg:220px;

    --card-width-sm:120px;
    --card-height-sm:168px;

    --num-cards:4;

    --card-horizontal-space-lg: 100px;
    --card-horizontal-space-sm: 50px;

    --badge-bg-color:darkgrey;
    --primary-color: black;
    --secondary-color: #ffffff;

    --primary-font: 'Quicksand', sans-serif;
}
body{
    height:100vh;
    font-family: var(--primary-font);
}

main{
    height: 55%;
    display: flex;
    justify-content: center;

}

.card-container{
    position: relative;
    height:100%;
    width:calc(var(--card-width-lg) * (var(--num-cards) / 2) + var(--card-horizontal-space-lg));
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-template-rows: 1fr 1fr;
    grid-template-areas: "a b"
                         "c d";

}

.card-pos-a{
    grid-area: a;
    /* background-color: gray; */
}
.card-pos-b{
    grid-area: b;
    /* background-color: goldenrod; */
}
.card-pos-c{
    grid-area: c;
    /* background-color: rosybrown; */
}
.card-pos-d{
    grid-area: d;
    /* background-color: darkcyan; */
}
.card-pos-a, .card-pos-b,.card-pos-c,.card-pos-d{
    display:flex;
    justify-content: center;
    align-items: center;
}

.card{
    position:absolute;
    height:var(--card-height-lg);
    width:var(--card-width-lg);
    perspective: 1000px;
    cursor: pointer;
    transition: transform 0.6s ease-in-out
}
.card-inner{
    position: relative;
    width:100%;
    height:100%;
    text-align: center;
    transition: transform 0.6s;
    transform-style: preserve-3d;
}
.card-front, .card-back{
    position:absolute;
    width:100%;
    height:100%;
    -webkit-backface-visibility: hidden;
    backface-visibility: hidden;
}
.card-img{
    height:100%;
}
.card-back{
    transform: rotateY(180deg);
}
.card-inner.flip-it{
    transform: rotateY(180deg);
}
header{
    display: flex;
    flex-direction: column;
    margin-bottom:10px;
}
.header-title-container{
    display: flex;
    justify-content: center;
}
.header-round-info-container{
    display: flex;
    justify-content: space-evenly;
}
.current-status{
    font-size:1.5rem;
    text-align: center;
}


.header-status-info-container,
.header-button-container,
.header-score-container,
.header-round-container,
.header-img-container{
    display: flex;
    justify-content: center;
    align-items: center;
}

.header-score-container,
.header-round-container,
.header-img-container
{
    width: 150px;
}
.header-img{
    height: 75px;
    border-radius: 5px;
    border: 1px solid black;
    padding: 5px;
    box-shadow: 0 4px 8px 0 rgba(0,0,0,0.2);
    transform: rotate(-3deg);
}
.badge{
    background-color: var(--badge-bg-color);
    color: var(--secondary-color);
    padding: 2px 10px 3px;
    border-radius: 15px;
}
.game-play-button-container{
    width:150px;
    height:70px;
}

/* CSS */
#playGame {
  appearance: none;
  background-color: transparent;
  border: 2px solid #1A1A1A;
  border-radius: 15px;
  box-sizing: border-box;
  color: #3B3B3B;
  cursor: pointer;
  display: none;
  font-family: var(--primary-font);
  font-size: 16px;
  font-weight: 600;
  line-height: normal;
  margin: 0;
  min-height: 60px;
  min-width: 0;
  outline: none;
  padding: 16px 24px;
  text-align: center;
  text-decoration: none;
  transition: all 300ms cubic-bezier(.23, 1, 0.32, 1);
  user-select: none;
  -webkit-user-select: none;
  touch-action: manipulation;
  width: 100%;
  will-change: transform;
  animation: game-play-button-fade-in 10s 1;
}

#playGame:disabled {
  pointer-events: none;
}

#playGame:hover {
  color: #fff;
  background-color: #1A1A1A;
  box-shadow: rgba(0, 0, 0, 0.25) 0 8px 15px;
  transform: translateY(-2px);
}

#playGame:active {
  box-shadow: none;
  transform: translateY(0);
}

@keyframes game-play-button-fade-in{
    from{opacity: 0;}
    to{opacity: 1;}
}


.card.shuffle-left{
    transform: translateX(300px) translateY(40px);
}
.card.shuffle-right{
    transform: translateX(-350px) translateY(-40px);
}
.card.fly-in{
    transform: translateY(-1000px) translateX(-600px) rotate(45deg);
}

@media screen and (max-width:600px){
    .card{
        width: var(--card-width-sm);
        height: var(--card-height-sm);
    }
    .card-container{
        width: calc(var(--card-width-sm) * (var(--num-cards)/2) + var(--card-horizontal-space-sm));
    }
    main{
        height:50%;
    }
    .current-status{
        font-size:1.2rem;
    }
    .game-play-button-container{
        width: 120px;
        height: 40px;
    }
    #playGame{
        padding: 6px 8px;
        font-size:12px;
        min-height:40px;
    }
    .header-img{
        height:55px;
    }
}
</style>
