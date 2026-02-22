// Local storage utilities for game data

const STORAGE_PREFIX = 'indieverse_';

// Save high score for a game
export function saveHighScore(game, score) {
    const key = STORAGE_PREFIX + game;
    const currentBest = getHighScore(game);
    if (score > currentBest) {
        localStorage.setItem(key, score.toString());
        return true; // New high score
    }
    return false;
}

// Get high score for a game
export function getHighScore(game) {
    const key = STORAGE_PREFIX + game;
    const stored = localStorage.getItem(key);
    return stored ? parseInt(stored, 10) : 0;
}

// Get all high scores
export function getAllHighScores() {
    const games = ['cyberRunner', 'codeBreaker', 'gravityFlip', 'arenaBattle', 'zombieShooter', 'shadowEscape'];
    const scores = {};
    games.forEach(game => {
        scores[game] = getHighScore(game);
    });
    return scores;
}

// Clear all game data
export function clearAllData() {
    const games = ['cyberRunner', 'codeBreaker', 'gravityFlip', 'arenaBattle', 'zombieShooter', 'shadowEscape'];
    games.forEach(game => {
        localStorage.removeItem(STORAGE_PREFIX + game);
    });
    localStorage.removeItem(STORAGE_PREFIX + 'settings');
}

// Save game settings
export function saveSettings(settings) {
    localStorage.setItem(STORAGE_PREFIX + 'settings', JSON.stringify(settings));
}

// Get game settings
export function getSettings() {
    const stored = localStorage.getItem(STORAGE_PREFIX + 'settings');
    return stored ? JSON.parse(stored) : getDefaultSettings();
}

// Default settings
function getDefaultSettings() {
    return {
        soundEnabled: true,
        musicEnabled: true,
        difficulty: 'normal'
    };
}

// Save game progress
export function saveProgress(game, progress) {
    const key = STORAGE_PREFIX + game + '_progress';
    localStorage.setItem(key, JSON.stringify(progress));
}

// Get game progress
export function getProgress(game) {
    const key = STORAGE_PREFIX + game + '_progress';
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : null;
}
