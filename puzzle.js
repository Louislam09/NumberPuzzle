let puzzleContainer = document.querySelector(".puzzle-container");
let aboutMeContainer = document.querySelector(".game__about-me");

// CONFIGURATION SECTION
let configContainer = document.querySelector(".game__mode");
let puzzleTypeSelect = document.querySelector(".puzzle__type");
let puzzleSizeSelect = document.querySelector(".puzzle__size");
let puzzleThemeSelect = document.querySelector(".puzzle__theme");
let continueButton = document.querySelector(".puzzle__continue-button");

// TIMER SECTION
let timerContainer = document.querySelector(".game__timer");
let moveCounterDiv = document.querySelector(".timer__moves");
let remakeDiv = document.querySelector(".timer__remake");
let homeDiv = document.querySelector(".timer__home");
let puzzleClockDiv = document.querySelector(".timer__clock");

// HOME SECTION
let homeContainer = document.querySelector(".game__home");
let homePlayButton = document.querySelector(".home__play-button");
let howToPlayButton = document.querySelector(".home__how_to_play-button");
let aboutMeButton = document.querySelector(".home__about_me-button");
let aboutMeQuitButton = document.querySelector(".about-me__exit__button");

// WIN SECTION
let winMessageContainer = document.querySelector(".game__win-message");
let winMessageSpan = document.querySelectorAll(".game__win-message > span:nth-child(odd)");
let winTimeSpan = document.querySelector(".win__time");
let winMoveSpan = document.querySelector(".win__move");
let winPlayButton = document.querySelector(".win__play-button");
let winHomeButton = document.querySelector(".win__home-button");

let listPieces = [];
let winPosition = [];
let changePos = []
let firstElementTarget;
let lastElementTarget;

let startX = 0;
let startY = 0;
let endX = 0;
let endY = 0;
let moveCounter = 0;
let gameSecond;
let gameMinute;
let stopTimer;

// config
let puzzleSize = puzzleSizeSelect.value;
let puzzlePieceStyle = puzzleThemeSelect.value;
let puzzlePieceType = puzzleTypeSelect.value;
let howToPlayUrl = "https://youtu.be/e-JkloV4wvc";

// SOUNDS
let tapSound = new Audio();
tapSound.src = "sound/tap_sound.mp3";
tapSound.volume = 0.5;

window.addEventListener('load', () => {
    registerSW();
})


class Piece {
    constructor(content, board, style) {
        this.piece = document.createElement('span');
        this.pieceContent = content;
        this.pieceGlobalClass = "puzzle__piece";
        this.pieceContentClass = `piece__${content}`;
        this.board = board;
        this.pieceStyle = style;
        this.appendToPuzzle();
    }

    setPieceSize() {
        if (this.board === "3x3") {
            this.piece.style.width = "150px";
            this.piece.style.height = "150px";
        }
        if (this.board === "4x4") {
            this.piece.style.width = "100px";
            this.piece.style.height = "100px";
        }
        this.setPieceStye();
    }
    setPieceStye() {
        if (this.pieceStyle === "wood") {
            this.piece.style.background = getComputedStyle(document.documentElement, null).getPropertyValue(`--${this.pieceStyle}`);
            timerContainer.style.background = getComputedStyle(document.documentElement, null).getPropertyValue(`--${this.pieceStyle}-timer`);
            winMessageSpan.forEach(span => span.style.background = getComputedStyle(document.documentElement, null).getPropertyValue(`--${this.pieceStyle}-timer`));
        }
        if (this.pieceStyle === "metal") {
            this.piece.style.background = getComputedStyle(document.documentElement, null).getPropertyValue(`--${this.pieceStyle}`);
            timerContainer.style.background = getComputedStyle(document.documentElement, null).getPropertyValue(`--${this.pieceStyle}-timer`);
            winMessageSpan.forEach(span => span.style.background = getComputedStyle(document.documentElement, null).getPropertyValue(`--${this.pieceStyle}-timer`));
        }
    }
    appendToPuzzle() {
        this.setPieceSize();
        this.piece.className = this.pieceGlobalClass + " " + this.pieceContentClass;
        this.piece.innerText = this.pieceContent;
        puzzleContainer.appendChild(this.piece);
    }
}


function startGame() {
    hideSection(homeContainer);
    hideSection(winMessageContainer);
    hideSection(configContainer);
    showSection(puzzleContainer);
    showSection(timerContainer);
    gameMode(puzzleSize, puzzlePieceType, puzzlePieceStyle);
    pieceInitialState();
    shufflePiece();
    eventHandler();
}

homePlayButton.addEventListener('click', showConfig);
continueButton.addEventListener('click', startGame);
howToPlayButton.addEventListener('click', () => window.open(howToPlayUrl));
aboutMeButton.addEventListener('click', showAboutMe);
aboutMeQuitButton.addEventListener('click', hideAboutMe);

function showSection(element) {
    element.style.display = "";

}
function hideSection(element) {
    element.style.display = "none";

}
function pieceInitialState() {
    for (let i = 0; i < puzzleContainer.children.length; i++) {
        winPosition.push(puzzleContainer.children[i]);
        listPieces.push(puzzleContainer.children[i]);
    }
}
function gameMode(board, type, style) {
    let number;
    let letter;

    if (board === '3x3') number = 9;
    if (board === '4x4') number = 16;

    let letterFrom = 65;
    let letterTo = letterFrom + number;

    if (type === 'letter') {
        for (let i = letterFrom; i < letterTo; i++) {
            letter = String.fromCharCode(i);
            if (letter !== String.fromCharCode(letterTo - 1)) new Piece(letter, board, style);
            if (letter == String.fromCharCode(letterTo - 1)) new Piece("blank", board, style = "transparent");
        }
    }

    if (type === 'number') {
        for (let i = 0; i < number; i++) {
            if (i + 1 !== number) new Piece(i + 1, board, style);
            if (i + 1 == number) new Piece("blank", board, style = "transparent");
        }
    }

}
function eventHandler() {
    listPieces.forEach(piece => piece.addEventListener('click', moveOnTap))
    remakeDiv.addEventListener('click', remakePuzzleHandle);
    homeDiv.addEventListener('click', goHome);
    winPlayButton.addEventListener('click', remakePuzzleHandle);
    winHomeButton.addEventListener('click', goHome);

}
function moveCounterHandle() {
    moveCounter++
    moveCounterDiv.innerHTML = `<span>Moves👣|</span> ${moveCounter}`;
}
function remakePuzzleHandle() {
    moveCounter = 0;
    puzzleClockDiv.innerHTML = "";
    moveCounterDiv.innerHTML = "";
    shufflePiece();
    showSection(puzzleContainer);
    showSection(timerContainer);
    hideSection(winMessageContainer);

}
function pieceCanMove(board, lastElementTargetIndex, firstElementTargetIndex) {
    // available  movement in 4x4 board
    if (board === '3x3') {
        if (lastElementTargetIndex === 0) {
            let availableIndexes = [1, 3];
            if (availableIndexes.includes(firstElementTargetIndex)) {
                return true;
            }

        }
        if (lastElementTargetIndex === 1) {
            let availableIndexes = [0, 2, 4];
            if (availableIndexes.includes(firstElementTargetIndex)) {
                return true;
            }

        }
        if (lastElementTargetIndex === 2) {
            let availableIndexes = [1, 5];
            if (availableIndexes.includes(firstElementTargetIndex)) {
                return true;
            }

        }
        if (lastElementTargetIndex === 3) {
            let availableIndexes = [0, 4, 6];
            if (availableIndexes.includes(firstElementTargetIndex)) {
                return true;
            }

        }
        if (lastElementTargetIndex === 4) {
            let availableIndexes = [1, 3, 5, 7];
            if (availableIndexes.includes(firstElementTargetIndex)) {
                return true;
            }

        }
        if (lastElementTargetIndex === 5) {
            let availableIndexes = [2, 4, 8];
            if (availableIndexes.includes(firstElementTargetIndex)) {
                return true;
            };


        }
        if (lastElementTargetIndex === 6) {
            let availableIndexes = [3, 7];
            if (availableIndexes.includes(firstElementTargetIndex)) {
                return true;
            }

        }
        if (lastElementTargetIndex === 7) {
            let availableIndexes = [4, 6, 8];
            if (availableIndexes.includes(firstElementTargetIndex)) {
                return true;
            }

        }
        if (lastElementTargetIndex === 8) {
            let availableIndexes = [5, 7];
            if (availableIndexes.includes(firstElementTargetIndex)) {
                return true;
            }
        }
    }

    // available movement in 4x4 board
    if (board === '4x4') {
        if (lastElementTargetIndex === 0) {
            let availableIndexes = [1, 4];
            if (availableIndexes.includes(firstElementTargetIndex)) {
                return true;
            }

        }
        if (lastElementTargetIndex === 1) {
            let availableIndexes = [0, 2, 5];
            if (availableIndexes.includes(firstElementTargetIndex)) {
                return true;
            }

        }
        if (lastElementTargetIndex === 2) {
            let availableIndexes = [1, 3, 6];
            if (availableIndexes.includes(firstElementTargetIndex)) {
                return true;
            }

        }
        if (lastElementTargetIndex === 3) {
            let availableIndexes = [2, 7];
            if (availableIndexes.includes(firstElementTargetIndex)) {
                return true;
            }

        }
        if (lastElementTargetIndex === 4) {
            let availableIndexes = [0, 5, 8];
            if (availableIndexes.includes(firstElementTargetIndex)) {
                return true;
            }

        }
        if (lastElementTargetIndex === 5) {
            let availableIndexes = [1, 4, 6, 9];
            if (availableIndexes.includes(firstElementTargetIndex)) {
                return true;
            };


        }
        if (lastElementTargetIndex === 6) {
            let availableIndexes = [2, 5, 7, 10];
            if (availableIndexes.includes(firstElementTargetIndex)) {
                return true;
            }

        }
        if (lastElementTargetIndex === 7) {
            let availableIndexes = [3, 6, 11];
            if (availableIndexes.includes(firstElementTargetIndex)) {
                return true;
            }

        }
        if (lastElementTargetIndex === 8) {
            let availableIndexes = [4, 9, 12];
            if (availableIndexes.includes(firstElementTargetIndex)) {
                return true;
            }
        }
        if (lastElementTargetIndex === 9) {
            let availableIndexes = [5, 8, 10, 13];
            if (availableIndexes.includes(firstElementTargetIndex)) {
                return true;
            }
        }
        if (lastElementTargetIndex === 10) {
            let availableIndexes = [6, 9, 11, 14];
            if (availableIndexes.includes(firstElementTargetIndex)) {
                return true;
            }
        }
        if (lastElementTargetIndex === 11) {
            let availableIndexes = [7, 10, 15];
            if (availableIndexes.includes(firstElementTargetIndex)) {
                return true;
            }
        }
        if (lastElementTargetIndex === 12) {
            let availableIndexes = [8, 13];
            if (availableIndexes.includes(firstElementTargetIndex)) {
                return true;
            }
        }
        if (lastElementTargetIndex === 13) {
            let availableIndexes = [9, 12, 14];
            if (availableIndexes.includes(firstElementTargetIndex)) {
                return true;
            }
        }
        if (lastElementTargetIndex === 14) {
            let availableIndexes = [10, 13, 15];
            if (availableIndexes.includes(firstElementTargetIndex)) {
                return true;
            }
        }
        if (lastElementTargetIndex === 15) {
            let availableIndexes = [11, 14];
            if (availableIndexes.includes(firstElementTargetIndex)) {
                return true;
            }
        }
    }
}
function movePiece() {
    if (lastElementTarget.innerText = "piece__blank") {
        let lastElementTargetIndex = listPieces.indexOf(lastElementTarget);
        let firstElementTargetIndex = listPieces.indexOf(firstElementTarget);

        if (pieceCanMove(puzzleSize, lastElementTargetIndex, firstElementTargetIndex)) {
            tapSound.play();
            listPieces[lastElementTargetIndex] = firstElementTarget;
            listPieces[firstElementTargetIndex] = lastElementTarget;

            puzzleContainer.innerHTML = "";
            listPieces.forEach(el => puzzleContainer.appendChild(el));
            moveCounterHandle();
            isWinPosition(puzzleSize);
        }
    }
}
function moveOnTap(e) {
    firstElementTarget = e.target;
    lastElementTarget = document.querySelector(".piece__blank");
    movePiece()
}

function getRandomElement() {
    let randomELement = listPieces.filter(piece => piece.innerText !== "blank");
    return randomELement;
}

async function shufflePiece() {
    stopTime();
    for (let i = 0; i < 1000; i++) {
        let randomELementAvailable = getRandomElement();
        let randomElement = randomELementAvailable[Math.floor(Math.random() * randomELementAvailable.length)];

        firstElementTarget = randomElement;
        lastElementTarget = document.querySelector(".piece__blank");

        let lastElementTargetIndex = listPieces.indexOf(lastElementTarget);
        let firstElementTargetIndex = listPieces.indexOf(firstElementTarget);

        if (pieceCanMove(puzzleSize, lastElementTargetIndex, firstElementTargetIndex)) {
            listPieces[lastElementTargetIndex] = firstElementTarget;
            listPieces[firstElementTargetIndex] = lastElementTarget;
            changePos.push(randomElement)

            if (i > 900) {
                await new Promise((resolve) => setTimeout(resolve, 0.000000000000000000001));
            }
            puzzleContainer.innerHTML = "";
            listPieces.forEach(el => puzzleContainer.appendChild(el));
        }
        if (i == 999) startTime();
    }
}

async function autoCompletePuzzle() {
    for (let i = changePos.length - 1; i > 0; i--) {
        firstElementTarget = changePos[i];
        movePiece()
        await new Promise((resolve) => setTimeout(resolve, 0.1));
    }
}

function isWinPosition(board) {
    let win = 0;
    let pieceNumber;
    if (board == "3x3") pieceNumber = 9;
    if (board == "4x4") pieceNumber = 16;

    winPosition.forEach((element, index) => {
        if (element.className === listPieces[index].className) win++
        if (win === pieceNumber) {
            stopTime();
            hideSection(puzzleContainer);
            showWinMessage()
        }
    })
}
function startTime() {
    gameSecond = 0
    gameMinute = 0
    stopTimer = setInterval(() => {
        gameSecond++
        if (gameSecond < 10) gameSecond = `0${gameSecond}`;

        if (gameSecond == 60) {
            gameSecond = 0
            gameMinute++

            if (gameMinute < 10) gameMinute = `0${gameMinute}`;
        }
        puzzleClockDiv.innerHTML = `<span>⏰|</span> ${gameMinute} : ${gameSecond}`;
    }, 1000);
}
function stopTime() {
    clearInterval(stopTimer)
}
function showWinMessage() {
    winTimeSpan.innerText = `Time⏰:  ${gameMinute} : ${gameSecond}`;
    winMoveSpan.innerText = `Moves👣: ${moveCounter}`;
    moveCounter = 0;
    hideSection(timerContainer);
    showSection(winMessageContainer);
}
function goHome() {
    listPieces = [];
    winPosition = [];
    puzzleContainer.innerHTML = "";
    puzzleClockDiv.innerHTML = "";
    moveCounterDiv.innerHTML = "";
    moveCounter = 0;
    stopTime();
    hideSection(puzzleContainer);
    hideSection(timerContainer);
    hideSection(winMessageContainer);
    hideSection(configContainer);
    hideSection(aboutMeContainer);
    showSection(homeContainer);
}
function showConfig() {
    hideSection(homeContainer);
    showSection(configContainer);
}
function showAboutMe() {
    hideSection(homeContainer);
    showSection(aboutMeContainer);
}
function hideAboutMe() {
    hideSection(aboutMeContainer);
    showSection(homeContainer);
}
function getConfigData() {
    puzzleTypeSelect.addEventListener('change', () => {
        puzzlePieceType = puzzleTypeSelect.value;
    })

    puzzleSizeSelect.addEventListener('change', () => {
        puzzleSize = puzzleSizeSelect.value;
    })

    puzzleThemeSelect.addEventListener('change', () => {
        puzzlePieceStyle = puzzleThemeSelect.value;

    })
}

async function registerSW() {
    if ("serviceWorker" in navigator) {
        try {
            await navigator.serviceWorker.register("./sw.js");
        } catch (error) {
            console.log("ServiceWorker registration failed")
        }
    }
}


getConfigData();
goHome();

