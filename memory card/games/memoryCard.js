// Memory Card Matching Game - 10 Levels with Dark Glassmorphism Style
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

canvas.width = 800;
canvas.height = 500;

const cardSymbols = [
    '🍎', '🍊', '🍋', '🍇', '🍓', '🫐', '🍑', '🍒',
    '🥝', '🍍', '🥭', '🍌', '🌟', '⭐', '🌙', '☀️',
    '🌈', '🔥', '💎', '🎯', '🎲', '🎮', '🎸', '🎺'
];

const levelConfig = {
    1: { pairs: 2, attempts: 10 },
    2: { pairs: 3, attempts: 12 },
    3: { pairs: 4, attempts: 14 },
    4: { pairs: 5, attempts: 16 },
    5: { pairs: 6, attempts: 18 },
    6: { pairs: 7, attempts: 20 },
    7: { pairs: 8, attempts: 22 },
    8: { pairs: 9, attempts: 24 },
    9: { pairs: 10, attempts: 26 },
    10: { pairs: 12, attempts: 30 }
};

function getGridCols(pairs) {
    if (pairs <= 2) return 2;
    if (pairs <= 3) return 3;
    if (pairs <= 4) return 4;
    if (pairs <= 5) return 5;
    if (pairs <= 6) return 4;
    if (pairs <= 8) return 4;
    if (pairs <= 9) return 6;
    if (pairs <= 10) return 5;
    return 6;
}

let currentLevel = 1;
let maxLevels = 10;
let cards = [];
let flippedCards = [];
let matchedPairs = 0;
let score = 0;
let attempts = 0;
let maxAttempts = 10;
let gameOver = false;
let canClick = true;

// Dark Glassmorphism game UI
const gameContainer = document.createElement('div');
gameContainer.id = 'memoryCardGame';
gameContainer.style.cssText = `
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background: rgba(15, 12, 41, 0.85);
    backdrop-filter: blur(25px);
    padding: 35px;
    border-radius: 24px;
    border: 1px solid rgba(0, 255, 204, 0.15);
    box-shadow: 
        0 25px 80px rgba(0, 0, 0, 0.5),
        inset 0 0 50px rgba(0, 255, 204, 0.02);
    text-align: center;
    font-family: 'Poppins', sans-serif;
    z-index: 200;
    display: none;
    min-width: 650px;
    max-width: 90vw;
`;

gameContainer.innerHTML = `
    <h2 style="
        font-size: 2.2rem; 
        font-weight: 700; 
        margin-bottom: 20px; 
        background: linear-gradient(90deg, #00ffcc, #00ccff, #8a2be2);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        letter-spacing: 2px;
    ">🧠 MEMORY MATCH 🧠</h2>
    
    <div style="
        display: flex; 
        justify-content: center; 
        margin-bottom: 25px; 
        flex-wrap: wrap; 
        gap: 15px;
    ">
        <div style="
            background: rgba(0, 0, 0, 0.3);
            backdrop-filter: blur(10px);
            padding: 12px 25px;
            border-radius: 12px;
            border: 1px solid rgba(0, 255, 204, 0.15);
        ">
            <span style="color: rgba(255,255,255,0.6); font-weight: 500;">Level</span>
            <span id="levelDisplay" style="color: #fff; font-weight: 700; font-size: ; margin-left:1.3rem 8px;">1</span>
            <span style="color: rgba(255,255,255,0.4);">/10</span>
        </div>
        
        <div style="
            background: rgba(0, 0, 0, 0.3);
            backdrop-filter: blur(10px);
            padding: 12px 25px;
            border-radius: 12px;
            border: 1px solid rgba(255, 215, 0, 0.15);
        ">
            <span style="color: rgba(255,255,255,0.6); font-weight: 500;">Attempts</span>
            <span id="attemptsDisplay" style="color: #ffd700; font-weight: 700; font-size: 1.3rem; margin-left: 8px;">10</span>
        </div>
        
        <div style="
            background: rgba(0, 0, 0, 0.3);
            backdrop-filter: blur(10px);
            padding: 12px 25px;
            border-radius: 12px;
            border: 1px solid rgba(0, 255, 136, 0.15);
        ">
            <span style="color: rgba(255,255,255,0.6); font-weight: 500;">Pairs</span>
            <span id="pairsDisplay" style="color: #00ff88; font-weight: 700; font-size: 1.3rem; margin-left: 8px;">0</span>
            <span style="color: rgba(255,255,255,0.4);">/ <span id="totalPairs">2</span></span>
        </div>
        
        <div style="
            background: rgba(0, 0, 0, 0.3);
            backdrop-filter: blur(10px);
            padding: 12px 25px;
            border-radius: 12px;
            border: 1px solid rgba(138, 43, 226, 0.15);
        ">
            <span style="color: rgba(255,255,255,0.6); font-weight: 500;">Score</span>
            <span id="scoreDisplay" style="color: #a29bfe; font-weight: 700; font-size: 1.3rem; margin-left: 8px;">0</span>
        </div>
    </div>
    
    <div id="gameBoard" style="
        display: grid;
        gap: 12px;
        justify-content: center;
        margin: 0 auto;
        padding: 20px;
        background: rgba(0, 0, 0, 0.2);
        backdrop-filter: blur(10px);
        border-radius: 16px;
        border: 1px solid rgba(255, 255, 255, 0.05);
    "></div>
    
    <div id="levelComplete" style="display: none; margin-top: 25px;">
        <div style="
            background: rgba(0, 255, 136, 0.15);
            backdrop-filter: blur(10px);
            padding: 20px 40px;
            border-radius: 16px;
            display: inline-block;
            border: 1px solid rgba(0, 255, 136, 0.2);
            box-shadow: 0 10px 40px rgba(0, 255, 136, 0.15);
        ">
            <p style="color: #00ff88; font-size: 1.6rem; font-weight: 700; margin: 0;">🎉 Level Complete! 🎉</p>
        </div>
        <br>
        <button onclick="nextLevelMemoryCard()" 
            style="
                padding: 15px 40px; 
                font-size: 1.1rem; 
                background: linear-gradient(135deg, #00ffcc, #00cc99); 
                border: none; 
                border-radius: 12px; 
                cursor: pointer;
                color: #0f0c29; 
                font-weight: 600; 
                margin-top: 15px;
                box-shadow: 0 8px 25px rgba(0, 255, 204, 0.25);
                transition: all 0.3s;
            "
            onmouseover="this.style.transform='translateY(-3px)';this.style.boxShadow='0 12px 35px rgba(0,255,204,0.35)'"
            onmouseout="this.style.transform='translateY(0)';this.style.boxShadow='0 8px 25px rgba(0,255,204,0.25)'"
        >
            Next Level ➡️
        </button>
    </div>
    
    <div id="gameOver" style="display: none; margin-top: 25px;">
        <div style="
            background: rgba(255, 107, 107, 0.15);
            backdrop-filter: blur(10px);
            padding: 20px 40px;
            border-radius: 16px;
            display: inline-block;
            border: 1px solid rgba(255, 107, 107, 0.2);
        ">
            <p style="color: #ff6b6b; font-size: 1.6rem; font-weight: 700; margin: 0;">💥 Out of Attempts! 💥</p>
        </div>
        <br>
        <button onclick="restartMemoryCard()" 
            style="
                padding: 15px 40px; 
                font-size: 1.1rem; 
                background: linear-gradient(135deg, #ff6b6b, #ee5a5a); 
                border: none; 
                border-radius: 12px; 
                cursor: pointer;
                color: #fff; 
                font-weight: 600; 
                margin-top: 15px;
                box-shadow: 0 8px 25px rgba(255, 107, 107, 0.25);
            "
        >
            Try Again 🔄
        </button>
    </div>
    
    <div id="gameComplete" style="display: none; margin-top: 25px;">
        <div style="
            background: rgba(255, 215, 0, 0.15);
            backdrop-filter: blur(10px);
            padding: 25px 50px;
            border-radius: 20px;
            display: inline-block;
            border: 1px solid rgba(255, 215, 0, 0.2);
            box-shadow: 0 15px 50px rgba(255, 215, 0, 0.2);
        ">
            <p style="
                color: #ffd700; 
                font-size: 1.8rem; 
                font-weight: 800; 
                margin: 0;
                text-shadow: 0 0 30px rgba(255, 215, 0, 0.5);
            ">🏆 ALL LEVELS COMPLETE! 🏆</p>
        </div>
        <p style="color: rgba(255,255,255,0.7); font-size: 1.3rem; margin-top: 15px;">
            Final Score: <span id="finalScore" style="color: #a29bfe; font-weight: 700; font-size: 1.5rem;">0</span>
        </p>
        <button onclick="restartMemoryCard()" 
            style="
                padding: 15px 40px; 
                font-size: 1.1rem; 
                background: linear-gradient(135deg, #ffd700, #ffb700); 
                border: none; 
                border-radius: 12px; 
                cursor: pointer;
                color: #0f0c29; 
                font-weight: 600; 
                margin-top: 15px;
                box-shadow: 0 8px 25px rgba(255, 215, 0, 0.25);
            "
        >
            Play Again 🎮
        </button>
    </div>
`;

document.body.appendChild(gameContainer);

function initGame() {
    canvas.style.display = 'none';
    document.getElementById('backBtn').style.display = 'none';
    document.getElementById('gameUI').style.display = 'none';
    
    gameContainer.style.display = 'block';
    
    currentLevel = 1;
    score = 0;
    
    if (window.setGameScore) {
        window.setGameScore(0);
    }
    
    startLevel();
}

function startLevel() {
    const config = levelConfig[currentLevel];
    const numPairs = config.pairs;
    const numCards = numPairs * 2;
    const cols = getGridCols(numPairs);
    
    flippedCards = [];
    matchedPairs = 0;
    attempts = config.attempts;
    maxAttempts = config.attempts;
    canClick = true;
    gameOver = false;
    
    document.getElementById('levelDisplay').textContent = currentLevel;
    document.getElementById('attemptsDisplay').textContent = attempts;
    document.getElementById('pairsDisplay').textContent = '0';
    document.getElementById('totalPairs').textContent = numPairs;
    document.getElementById('scoreDisplay').textContent = score;
    document.getElementById('levelComplete').style.display = 'none';
    document.getElementById('gameOver').style.display = 'none';
    document.getElementById('gameComplete').style.display = 'none';
    
    const gameBoard = document.getElementById('gameBoard');
    gameBoard.style.gridTemplateColumns = `repeat(${cols}, 1fr)`;
    gameBoard.style.maxWidth = `${cols * 90}px`;
    
    const selectedSymbols = cardSymbols.slice(0, numPairs);
    const cardData = [...selectedSymbols, ...selectedSymbols];
    shuffleArray(cardData);
    
    cards = cardData.map((symbol, index) => ({
        id: index,
        symbol: symbol,
        flipped: false,
        matched: false
    }));
    
    renderCards();
}

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

function renderCards() {
    const gameBoard = document.getElementById('gameBoard');
    gameBoard.innerHTML = '';
    
    const config = levelConfig[currentLevel];
    const cols = getGridCols(config.pairs);
    const cardSize = cols <= 4 ? 80 : (cols <= 5 ? 70 : 60);
    
    cards.forEach((card, index) => {
        const cardEl = document.createElement('div');
        
        let cardStyle = `
            width: ${cardSize}px;
            height: ${cardSize * 1.15}px;
            border-radius: 14px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: ${cardSize * 0.5}px;
            cursor: ${card.matched || card.flipped || !canClick ? 'default' : 'pointer'};
            transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
            transform: perspective(500px) rotateY(${card.flipped || card.matched ? '0deg' : '180deg'});
        `;
        
        if (card.matched) {
            cardStyle += `
                background: linear-gradient(135deg, rgba(0, 255, 136, 0.25), rgba(0, 200, 100, 0.15));
                border: 2px solid rgba(0, 255, 136, 0.4);
                box-shadow: 0 8px 25px rgba(0, 255, 136, 0.2);
            `;
        } else if (card.flipped) {
            cardStyle += `
                background: linear-gradient(135deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.05));
                border: 2px solid rgba(255, 255, 255, 0.15);
                box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
            `;
        } else {
            cardStyle += `
                background: linear-gradient(135deg, rgba(138, 43, 226, 0.25), rgba(75, 0, 130, 0.15));
                border: 2px solid rgba(138, 43, 226, 0.3);
                box-shadow: 0 8px 25px rgba(138, 43, 226, 0.15);
            `;
        }
        
        cardEl.style.cssText = cardStyle;
        
        if (card.flipped || card.matched) {
            cardEl.textContent = card.symbol;
        } else {
            cardEl.innerHTML = `<span style="
                color: #fff; 
                font-size: 2rem; 
                font-weight: 700;
                text-shadow: 0 0 15px rgba(138, 43, 226, 0.8);
            ">?</span>`;
        }
        
        if (!card.matched && !card.flipped && canClick && !gameOver) {
            cardEl.onclick = () => flipCard(index);
            cardEl.onmouseover = () => {
                if (!gameOver) {
                    cardEl.style.transform = 'perspective(500px) rotateY(0deg) scale(1.08)';
                    cardEl.style.zIndex = '10';
                }
            };
            cardEl.onmouseout = () => {
                cardEl.style.transform = 'perspective(500px) rotateY(180deg) scale(1)';
                cardEl.style.zIndex = '1';
            };
        }
        
        gameBoard.appendChild(cardEl);
    });
}

function flipCard(index) {
    if (!canClick || cards[index].flipped || cards[index].matched || gameOver) return;
    
    cards[index].flipped = true;
    flippedCards.push(index);
    
    if (window.audioManager) window.audioManager.playBlip();
    
    renderCards();
    
    if (flippedCards.length === 2) {
        canClick = false;
        attempts--;
        document.getElementById('attemptsDisplay').textContent = attempts;
        
        const [firstIndex, secondIndex] = flippedCards;
        
        if (cards[firstIndex].symbol === cards[secondIndex].symbol) {
            setTimeout(() => {
                cards[firstIndex].matched = true;
                cards[secondIndex].matched = true;
                matchedPairs++;
                
                const config = levelConfig[currentLevel];
                const points = 50 + (currentLevel * 10);
                score += points;
                
                if (window.setGameScore) {
                    window.setGameScore(score);
                }
                
                document.getElementById('pairsDisplay').textContent = matchedPairs;
                document.getElementById('scoreDisplay').textContent = score;
                
                if (window.audioManager) window.audioManager.playWin();
                
                flippedCards = [];
                canClick = true;
                
                if (matchedPairs === config.pairs) {
                    setTimeout(() => {
                        if (currentLevel < maxLevels) {
                            document.getElementById('levelComplete').style.display = 'block';
                        } else {
                            score += 500;
                            if (window.setGameScore) {
                                window.setGameScore(score);
                            }
                            document.getElementById('finalScore').textContent = score;
                            document.getElementById('gameComplete').style.display = 'block';
                            
                            if (window.gameOver) {
                                window.gameOver(score);
                            }
                        }
                    }, 500);
                }
                
                renderCards();
            }, 500);
        } else {
            setTimeout(() => {
                cards[firstIndex].flipped = false;
                cards[secondIndex].flipped = false;
                flippedCards = [];
                
                if (attempts <= 0) {
                    gameOver = true;
                    document.getElementById('gameOver').style.display = 'block';
                    if (window.audioManager) window.audioManager.playGameOver();
                } else {
                    canClick = true;
                }
                renderCards();
            }, 1000);
        }
    }
}

window.nextLevelMemoryCard = function() {
    currentLevel++;
    startLevel();
};

window.restartMemoryCard = function() {
    currentLevel = 1;
    score = 0;
    
    if (window.setGameScore) {
        window.setGameScore(0);
    }
    
    startLevel();
};

function drawBackground() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}

drawBackground();

initGame();

const originalGoToMenu = window.goToMenu;
window.goToMenu = function() {
    gameContainer.style.display = 'none';
    if (originalGoToMenu) {
        originalGoToMenu();
    }
};
