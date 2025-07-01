// Game state
let gameState = {
    cards: [],
    flippedCards: [],
    matchedPairs: 0,
    totalPairs: 8,
    moves: 0,
    score: 0,
    gameStarted: false,
    gameCompleted: false,
    timer: null,
    startTime: null,
    elapsedTime: 0
};

// Sound effects (using Web Audio API)
const audioContext = new (window.AudioContext || window.webkitAudioContext)();

function playSound(frequency, duration, type = 'sine') {
    if (audioContext.state === 'suspended') {
        audioContext.resume();
    }
    
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.frequency.setValueAtTime(frequency, audioContext.currentTime);
    oscillator.type = type;
    
    gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration);
    
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + duration);
}

// Card symbols for the game - unique pairs
const cardSymbols = [
    '🎮', '🎲', '🎯', '🎪', '🎨', '🎭', '🧩', '🕹️'
];

// Create pairs by duplicating the array
const cardPairs = [...cardSymbols, ...cardSymbols];

// Alternative: Use images for more visual appeal
const cardImages = [
    { symbol: '🎮', name: 'Game Controller' },
    { symbol: '🎲', name: 'Dice' },
    { symbol: '🎯', name: 'Target' },
    { symbol: '🎪', name: 'Circus' },
    { symbol: '🎨', name: 'Art' },
    { symbol: '🎭', name: 'Theater' },
    { symbol: '🧩', name: 'Puzzle' },
    { symbol: '🕹️', name: 'Joystick' }
];

// Create image pairs
const imagePairs = [...cardImages, ...cardImages];

// DOM elements
const gameBoard = document.getElementById('gameBoard');
const timerElement = document.getElementById('timer');
const scoreElement = document.getElementById('score');
const movesElement = document.getElementById('moves');
const newGameBtn = document.getElementById('newGameBtn');
const leaderboardBtn = document.getElementById('leaderboardBtn');
const themeToggle = document.getElementById('themeToggle');
const gameOverModal = document.getElementById('gameOverModal');
const leaderboardModal = document.getElementById('leaderboardModal');

// Theme management
function initTheme() {
    const savedTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);
    updateThemeIcon(savedTheme);
}

function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    updateThemeIcon(newTheme);
    
    // Play theme change sound
    playSound(800, 0.2, 'square');
}

function updateThemeIcon(theme) {
    const icon = themeToggle.querySelector('i');
    icon.className = theme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
}

// Game initialization
function initGame() {
    initTheme();
    createCards();
    setupEventListeners();
    updateDisplay();
}

function createCards() {
    gameBoard.innerHTML = '';
    gameState.cards = [];
    
    // Shuffle image pairs
    const shuffledPairs = [...imagePairs].sort(() => Math.random() - 0.5);
    
    shuffledPairs.forEach((cardData, index) => {
        const card = document.createElement('div');
        card.className = 'card';
        card.dataset.index = index;
        card.dataset.symbol = cardData.symbol;
        
        const cardInner = document.createElement('div');
        cardInner.className = 'card-inner';
        
        const cardFront = document.createElement('div');
        cardFront.className = 'card-front';
        cardFront.innerHTML = `<span class="card-symbol">${cardData.symbol}</span>`;
        
        const cardBack = document.createElement('div');
        cardBack.className = 'card-back';
        cardBack.innerHTML = '<i class="fas fa-question"></i>';
        
        cardInner.appendChild(cardFront);
        cardInner.appendChild(cardBack);
        card.appendChild(cardInner);
        
        card.addEventListener('click', () => handleCardClick(card));
        
        gameBoard.appendChild(card);
        gameState.cards.push(card);
    });
}

function setupEventListeners() {
    newGameBtn.addEventListener('click', startNewGame);
    leaderboardBtn.addEventListener('click', showLeaderboard);
    themeToggle.addEventListener('click', toggleTheme);
    
    // Modal event listeners
    document.getElementById('playAgainBtn').addEventListener('click', () => {
        hideModal(gameOverModal);
        startNewGame();
    });
    document.getElementById('closeLeaderboardBtn').addEventListener('click', () => {
        hideModal(leaderboardModal);
    });
    
    // Close modals when clicking outside
    gameOverModal.addEventListener('click', (e) => {
        if (e.target === gameOverModal) hideModal(gameOverModal);
    });
    leaderboardModal.addEventListener('click', (e) => {
        if (e.target === leaderboardModal) hideModal(leaderboardModal);
    });
    
    // Handle form submission for saving score
    document.getElementById('scoreForm').addEventListener('submit', function(e) {
        e.preventDefault();
        saveScore();
    });
}

// Game logic
function handleCardClick(card) {
    if (gameState.gameCompleted || card.classList.contains('flipped') || 
        card.classList.contains('matched') || gameState.flippedCards.length >= 2) {
        return;
    }
    
    if (!gameState.gameStarted) {
        startGame();
    }
    
    flipCard(card);
    playSound(600, 0.1, 'sine');
    
    gameState.flippedCards.push(card);
    
    if (gameState.flippedCards.length === 2) {
        gameState.moves++;
        checkForMatch();
    }
    
    updateDisplay();
}

function flipCard(card) {
    card.querySelector('.card-inner').classList.add('flipped');
}

function checkForMatch() {
    const [card1, card2] = gameState.flippedCards;
    const symbol1 = card1.dataset.symbol;
    const symbol2 = card2.dataset.symbol;
    
    if (symbol1 === symbol2) {
        // Match found
        setTimeout(() => {
            card1.classList.add('matched');
            card2.classList.add('matched');
            gameState.matchedPairs++;
            gameState.score += 100;
            
            // Bonus points for quick matches
            if (gameState.moves <= gameState.totalPairs * 2) {
                gameState.score += 50;
            }
            
            playSound(800, 0.3, 'sine');
            
            if (gameState.matchedPairs === gameState.totalPairs) {
                endGame();
            }
        }, 500);
    } else {
        // No match
        setTimeout(() => {
            card1.querySelector('.card-inner').classList.remove('flipped');
            card2.querySelector('.card-inner').classList.remove('flipped');
            playSound(200, 0.2, 'sawtooth');
        }, 1000);
    }
    
    gameState.flippedCards = [];
}

function startGame() {
    gameState.gameStarted = true;
    gameState.startTime = Date.now();
    gameState.timer = setInterval(updateTimer, 1000);
}

function startNewGame() {
    // Reset game state
    gameState = {
        cards: [],
        flippedCards: [],
        matchedPairs: 0,
        totalPairs: 8,
        moves: 0,
        score: 0,
        gameStarted: false,
        gameCompleted: false,
        timer: null,
        startTime: null,
        elapsedTime: 0
    };
    
    // Clear timer
    if (gameState.timer) {
        clearInterval(gameState.timer);
    }
    
    createCards();
    updateDisplay();
    hideModal(gameOverModal);
}

function endGame() {
    gameState.gameCompleted = true;
    clearInterval(gameState.timer);
    
    // Calculate final score based on time and moves
    const timeBonus = Math.max(0, 1000 - Math.floor(gameState.elapsedTime / 1000) * 10);
    const moveBonus = Math.max(0, 500 - gameState.moves * 5);
    gameState.score += timeBonus + moveBonus;
    
    setTimeout(() => {
        showGameOverModal();
    }, 1000);
}

function updateTimer() {
    if (gameState.startTime) {
        gameState.elapsedTime = Date.now() - gameState.startTime;
        const seconds = Math.floor(gameState.elapsedTime / 1000);
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        
        timerElement.textContent = `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
    }
}

function updateDisplay() {
    scoreElement.textContent = gameState.score;
    movesElement.textContent = gameState.moves;
}

// Modal management
function showModal(modal) {
    modal.classList.add('show');
    document.body.style.overflow = 'hidden';
}

function hideModal(modal) {
    modal.classList.remove('show');
    document.body.style.overflow = 'auto';
}

function showGameOverModal() {
    document.getElementById('finalTime').textContent = timerElement.textContent;
    document.getElementById('finalScore').textContent = gameState.score;
    document.getElementById('finalMoves').textContent = gameState.moves;
    document.getElementById('playerName').value = '';
    document.getElementById('playerName').focus();
    
    showModal(gameOverModal);
}

// --- Replace Leaderboard Management with Local Storage ---
const LEADERBOARD_KEY = 'memoryMatchLeaderboard';

function getLeaderboard() {
    try {
        const leaderboard = localStorage.getItem(LEADERBOARD_KEY);
        return leaderboard ? JSON.parse(leaderboard) : [];
    } catch (error) {
        console.error('Error reading leaderboard from localStorage:', error);
        return [];
    }
}

function saveScoreToLocalStorage(scoreObj) {
    try {
        let leaderboard = getLeaderboard();
        leaderboard.push(scoreObj);
        
        // Sort by score (highest first), then by time (fastest first)
        leaderboard.sort((a, b) => {
            if (b.score !== a.score) {
                return b.score - a.score;
            }
            // If scores are equal, sort by time (faster time first)
            return a.time.localeCompare(b.time);
        });
        
        // Keep only top 10 scores
        leaderboard = leaderboard.slice(0, 10);
        
        localStorage.setItem(LEADERBOARD_KEY, JSON.stringify(leaderboard));
        return { success: true };
    } catch (error) {
        console.error('Error saving score to localStorage:', error);
        return { error: 'Failed to save score' };
    }
}

// --- Update showLeaderboard to use local storage ---
function showLeaderboard() {
    const leaderboardList = document.getElementById('leaderboardList');
    const leaderboard = getLeaderboard();
    
    if (!leaderboard || leaderboard.length === 0) {
        leaderboardList.innerHTML = '<div class="leaderboard-itaem">No scores yet. Play a game to get started!</div>';
    } else {
        leaderboardList.innerHTML = leaderboard
            .map((entry, index) => `
                <div class="leaderboard-item">
                    <span class="leaderboard-rank">#${index + 1}</span>
                    <span class="leaderboard-name">${entry.name}</span>
                    <span class="leaderboard-score">${entry.score}</span>
                    <span class="leaderboard-time">${entry.time}</span>
                </div>
            `)
            .join('');
    }
    showModal(leaderboardModal);
}

// --- Update saveScore to use local storage ---
function saveScore() {
    const playerName = document.getElementById('playerName').value.trim();
    if (!playerName) {
        alert('Please enter your name!');
        return;
    }
    if (playerName.length < 1 || playerName.length > 20) {
        alert('Name must be 1-20 characters.');
        return;
    }
    
    const newScore = {
        name: playerName,
        score: gameState.score,
        time: timerElement.textContent,
        moves: gameState.moves,
        date: new Date().toISOString()
    };
    
    const result = saveScoreToLocalStorage(newScore);
    if (result.error) {
        alert('Failed to save score: ' + result.error);
        return;
    }
    
    playSound(1000, 0.5, 'sine');
    hideModal(gameOverModal);
    showLeaderboard();
}

// Keyboard shortcuts
// Only trigger if not typing in an input or textarea
document.addEventListener('keydown', (e) => {
    const active = document.activeElement;
    if (active && (active.tagName === 'INPUT' || active.tagName === 'TEXTAREA')) return;
    if (e.key === 'n' || e.key === 'N') {
        startNewGame();
    } else if (e.key === 'l' || e.key === 'L') {
        showLeaderboard();
    } else if (e.key === 't' || e.key === 'T') {
        toggleTheme();
    }
});

// Initialize the game when the page loads
document.addEventListener('DOMContentLoaded', initGame);

// Add some fun Easter eggs
let clickCount = 0;
let clickTimer = null;

document.querySelector('.title').addEventListener('click', () => {
    clickCount++;
    
    if (clickTimer) {
        clearTimeout(clickTimer);
    }
    
    clickTimer = setTimeout(() => {
        if (clickCount >= 5) {
            // Secret mode: all cards become the same symbol
            playSound(1200, 0.5, 'triangle');
            alert('🎉 Secret mode activated! All cards are now the same!');
            cardSymbols.fill('🎉');
            startNewGame();
        }
        clickCount = 0;
    }, 2000);
});

// Add touch support for mobile
let touchStartX = 0;
let touchStartY = 0;

document.addEventListener('touchstart', (e) => {
    touchStartX = e.touches[0].clientX;
    touchStartY = e.touches[0].clientY;
});

document.addEventListener('touchend', (e) => {
    if (!touchStartX || !touchStartY) return;
    
    const touchEndX = e.changedTouches[0].clientX;
    const touchEndY = e.changedTouches[0].clientY;
    
    const diffX = touchStartX - touchEndX;
    const diffY = touchStartY - touchEndY;
    
    // Swipe gestures
    if (Math.abs(diffX) > Math.abs(diffY)) {
        if (Math.abs(diffX) > 50) {
            if (diffX > 0) {
                // Swipe left - new game
                startNewGame();
            } else {
                // Swipe right - show leaderboard
                showLeaderboard();
            }
        }
    }
    
    touchStartX = 0;
    touchStartY = 0;
});

// Add some visual feedback for card interactions
function addCardHoverEffect() {
    const cards = document.querySelectorAll('.card');
    cards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            if (!card.classList.contains('flipped') && !card.classList.contains('matched')) {
                card.style.transform = 'scale(1.05) rotate(2deg)';
            }
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = '';
        });
    });
}

// Call this after creating cards
setTimeout(addCardHoverEffect, 100); 