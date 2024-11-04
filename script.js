const words = [
    { word: "ROUTER", level: 1 },
    { word: "SWITCH", level: 1 },
    { word: "MODEM", level: 1 },
    { word: "FIREWALL", level: 2 },
    { word: "SERVIDOR", level: 2 },
    { word: "ETHERNET", level: 2 },
    { word: "BLOCKCHAIN", level: 3 },
    { word: "CIBERSEGURIDAD", level: 3 },
    { word: "NUBE", level: 3 },
    { word: "INTELIGENCIA", level: 4 },
    { word: "ARTIFICIAL", level: 4 },
    { word: "CRIPTOMONEDA", level: 4 },
    { word: "CUANTICA", level: 5 },
    { word: "BIOMETRIA", level: 5 },
    { word: "NANOTECNOLOGIA", level: 5 }
];

let currentWord = "";
let guessedLetters = [];
let wrongGuesses = 0;
let timeLeft = 60;
let timerInterval;
let currentLevel = 1;
let score = 0;

const wordEl = document.getElementById("word");
const keyboardEl = document.getElementById("keyboard");
const messageEl = document.getElementById("message");
const timerEl = document.getElementById("timer");
const levelEl = document.getElementById("level");
const scoreEl = document.getElementById("score");
const nextLevelBtn = document.getElementById("next-level");
const playAgainBtn = document.getElementById("play-again");
const restartGameBtn = document.getElementById("restart-game"); // Botón de reiniciar
const figureParts = document.querySelectorAll(".figure-part");

function initGame() {
    figureParts.forEach(part => part.style.display = 'none');
    
    const wordsForLevel = words.filter(w => w.level === currentLevel);
    currentWord = wordsForLevel[Math.floor(Math.random() * wordsForLevel.length)].word;
    guessedLetters = [];
    wrongGuesses = 0;
    timeLeft = 60;

    updateWord();
    updateKeyboard();
    updateTimer();
    updateLevel();
    updateScore();

    messageEl.textContent = "";
    nextLevelBtn.style.display = "none"; // Ocultar el botón de siguiente nivel
    playAgainBtn.style.display = "none"; // Ocultar el botón de volver a jugar
    restartGameBtn.style.display = "block"; // Asegurarse de que el botón de reiniciar siempre esté visible

    clearInterval(timerInterval);
    timerInterval = setInterval(updateTimer, 1000);
}

function updateWord() {
    wordEl.innerHTML = currentWord
        .split("")
        .map(letter => `<span class="letter">${guessedLetters.includes(letter) ? letter : "_"}</span>`)
        .join("");

    const revealedWord = currentWord
        .split("")
        .every(letter => guessedLetters.includes(letter));

    if (revealedWord) {
        endGame(true);
    }
}

function updateKeyboard() {
    const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    keyboardEl.innerHTML = alphabet
        .split("")
        .map(letter => `<button class="key${guessedLetters.includes(letter) ? " disabled" : ""}" onclick="guessLetter('${letter}')">${letter}</button>`)
        .join("");
}

function updateFigure() {
    for (let i = 0; i < figureParts.length; i++) {
        if (i < wrongGuesses) {
            figureParts[i].style.display = 'block';
        } else {
            figureParts[i].style.display = 'none';
        }
    }
}

function updateTimer() {
    if (timeLeft >= 0) {
        timerEl.textContent = `Tiempo restante: ${timeLeft}s`;
        timeLeft--;
        if (timeLeft < 0) {
            endGame(false);
        }
    }
}

function updateLevel() {
    levelEl.textContent = `Nivel ${currentLevel}`;
}

function updateScore() {
    scoreEl.textContent = `Puntuación: ${score}`;
}

function guessLetter(letter) {
    if (guessedLetters.includes(letter)) return;
    
    guessedLetters.push(letter);
    
    if (currentWord.includes(letter)) {
        updateWord();
        score += 10 * currentLevel; // Aumentar puntuación por letra correcta
    } else {
        wrongGuesses++;
        updateFigure();
        score -= 5; // Disminuir puntuación por letra incorrecta
        
        if (wrongGuesses >= 6) {
            endGame(false);
            return;
        }
    }

    updateScore();
    updateKeyboard();
}

function endGame(won) {
    clearInterval(timerInterval);
    
    if (won) {
        messageEl.textContent = "¡Felicidades! Has ganado";
        score += (timeLeft * 2) + (currentLevel * 50); // Bonus por tiempo restante y nivel
        nextLevelBtn.style.display = "block"; // Mostrar el botón de siguiente nivel
        playAgainBtn.style.display = "none"; // Ocultar el botón de volver a jugar
        restartGameBtn.style.display = "block"; // Asegurarse de que el botón de reiniciar siempre esté visible
    } else {
        messageEl.textContent = "Lo siento, has perdido";
        score -= 20; // Penalización por perder
        nextLevelBtn.style.display = "none"; // Ocultar el botón de siguiente nivel
        playAgainBtn.style.display = "block"; // Mostrar el botón de volver a jugar
        restartGameBtn.style.display = "block"; // Asegurarse de que el botón de reiniciar siempre esté visible
    }
    
    keyboardEl.innerHTML = "";
    updateScore();
}

nextLevelBtn.addEventListener("click", () => {
    currentLevel++;
    if (currentLevel > 5) {
        messageEl.textContent = "¡Felicidades! Has completado todos los niveles";
        nextLevelBtn.style.display = "none";
        playAgainBtn.style.display = "block";
        restartGameBtn.style.display = "block"; // Asegurarse de que el botón de reiniciar siempre esté visible
    } else {
        initGame();
    }
});

playAgainBtn.addEventListener("click", () => {
    currentLevel = 1;
    score = 0;
    initGame();
});

restartGameBtn.addEventListener("click", () => {
    currentLevel = 1;
    score = 0;
    initGame();
});

initGame();