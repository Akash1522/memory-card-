// Audio Manager - Simple sound effects using Web Audio API
// This creates sounds programmatically without needing audio files

class AudioManager {
    constructor() {
        this.context = null;
        this.enabled = true;
    }

    init() {
        if (!this.context) {
            try {
                this.context = new (window.AudioContext || window.webkitAudioContext)();
                console.log('Audio context initialized');
            } catch (e) {
                console.warn('Web Audio API not supported');
            }
        }
        // Resume context if suspended
        if (this.context && this.context.state === 'suspended') {
            this.context.resume();
        }
    }

    playTone(frequency, duration, type = 'square', volume = 0.1) {
        if (!this.enabled || !this.context) {
            // Try to init if context not ready
            this.init();
            if (!this.context) return;
        }
        
        try {
            const oscillator = this.context.createOscillator();
            const gainNode = this.context.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(this.context.destination);
            
            oscillator.type = type;
            oscillator.frequency.value = frequency;
            
            gainNode.gain.setValueAtTime(volume, this.context.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, this.context.currentTime + duration);
            
            oscillator.start(this.context.currentTime);
            oscillator.stop(this.context.currentTime + duration);
        } catch (e) {
            console.warn('Audio play error:', e);
        }
    }

    playJump() {
        this.playTone(400, 0.15, 'square', 0.08);
        setTimeout(() => this.playTone(600, 0.1, 'square', 0.06), 50);
    }

    playShoot() {
        this.playTone(800, 0.08, 'sawtooth', 0.05);
        this.playTone(400, 0.05, 'square', 0.03);
    }

    playHit() {
        this.playTone(200, 0.2, 'sawtooth', 0.1);
        this.playTone(150, 0.15, 'square', 0.08);
    }

    playGameOver() {
        this.playTone(300, 0.3, 'sawtooth', 0.1);
        setTimeout(() => this.playTone(250, 0.3, 'sawtooth', 0.1), 150);
        setTimeout(() => this.playTone(200, 0.4, 'sawtooth', 0.1), 300);
    }

    playScore() {
        this.playTone(600, 0.1, 'sine', 0.08);
        setTimeout(() => this.playTone(800, 0.1, 'sine', 0.08), 50);
    }

    playWin() {
        this.playTone(400, 0.15, 'sine', 0.1);
        setTimeout(() => this.playTone(500, 0.15, 'sine', 0.1), 100);
        setTimeout(() => this.playTone(600, 0.15, 'sine', 0.1), 200);
        setTimeout(() => this.playTone(800, 0.3, 'sine', 0.1), 300);
    }

    playBlip() {
        this.playTone(500, 0.05, 'sine', 0.05);
    }

    toggle() {
        this.enabled = !this.enabled;
        return this.enabled;
    }
}

// Global audio manager
window.audioManager = new AudioManager();

// Initialize on first user interaction
document.addEventListener('click', () => window.audioManager.init(), { once: true });
document.addEventListener('keydown', () => window.audioManager.init(), { once: true });
