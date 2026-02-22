// Sound Manager - Uses Web Audio API for sounds (no audio files needed)

class SimpleSoundManager {
    constructor() {
        this.context = null;
        this.musicVolume = 0.5;
        this.sfxVolume = 1.0;
        this.muted = false;
    }

    init() {
        if (!this.context) {
            try {
                this.context = new (window.AudioContext || window.webkitAudioContext)();
            } catch (e) {
                console.warn('Web Audio API not supported');
            }
        }
        if (this.context && this.context.state === 'suspended') {
            this.context.resume();
        }
    }

    playTone(frequency, duration, type = 'square', volume = 0.1) {
        if (this.muted || !this.context) return;
        
        try {
            const osc = this.context.createOscillator();
            const gain = this.context.createGain();
            
            osc.connect(gain);
            gain.connect(this.context.destination);
            
            osc.type = type;
            osc.frequency.value = frequency;
            
            gain.gain.setValueAtTime(volume * this.sfxVolume, this.context.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.01, this.context.currentTime + duration);
            
            osc.start(this.context.currentTime);
            osc.stop(this.context.currentTime + duration);
        } catch (e) {}
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

    playWin() {
        this.playTone(400, 0.15, 'sine', 0.1);
        setTimeout(() => this.playTone(500, 0.15, 'sine', 0.1), 100);
        setTimeout(() => this.playTone(600, 0.15, 'sine', 0.1), 200);
        setTimeout(() => this.playTone(800, 0.3, 'sine', 0.1), 300);
    }

    playBlip() {
        this.playTone(500, 0.05, 'sine', 0.05);
    }

    playClick() {
        this.playTone(600, 0.05, 'sine', 0.05);
    }

    // Sound aliases for compatibility
    playSound(name) {
        switch(name) {
            case 'jump': this.playJump(); break;
            case 'shoot': this.playShoot(); break;
            case 'hit': this.playHit(); break;
            case 'gameover': this.playGameOver(); break;
            case 'win': this.playWin(); break;
            case 'click': this.playClick(); break;
        }
    }

    setMusicVolume(v) { this.musicVolume = v; }
    setSFXVolume(v) { this.sfxVolume = v; }
    
    toggleMute() {
        this.muted = !this.muted;
        return this.muted;
    }
}

// Create global instance
window.soundManager = new SimpleSoundManager();

// Initialize on user interaction
document.addEventListener('click', () => window.soundManager.init(), { once: true });
document.addEventListener('keydown', () => window.soundManager.init(), { once: true });
