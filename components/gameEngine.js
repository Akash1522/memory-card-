// Game Engine - Base class for game loops

export class GameEngine {
    constructor(update, draw, options = {}) {
        this.update = update;
        this.draw = draw;
        this.running = false;
        this.paused = false;
        this.lastTime = 0;
        this.deltaTime = 0;
        this.fps = options.fps || 60;
        this.frameCount = 0;
        this.fpsDisplay = options.showFPS || false;
        
        // Timing
        this.fixedTimeStep = 1000 / this.fps;
        this.accumulator = 0;
    }

    start() {
        if (!this.running) {
            this.running = true;
            this.lastTime = performance.now();
            this.loop(this.lastTime);
        }
    }

    stop() {
        this.running = false;
    }

    pause() {
        this.paused = true;
    }

    resume() {
        if (this.paused) {
            this.paused = false;
            this.lastTime = performance.now();
            this.loop(performance.now());
        }
    }

    togglePause() {
        if (this.paused) {
            this.resume();
        } else {
            this.pause();
        }
    }

    loop(currentTime) {
        if (!this.running) return;

        if (this.paused) {
            requestAnimationFrame((t) => this.loop(t));
            return;
        }

        // Calculate delta time
        this.deltaTime = currentTime - this.lastTime;
        this.lastTime = currentTime;

        // Cap delta time to prevent spiral of death
        if (this.deltaTime > 100) {
            this.deltaTime = 100;
        }

        this.accumulator += this.deltaTime;

        // Fixed timestep updates
        while (this.accumulator >= this.fixedTimeStep) {
            this.update(this.fixedTimeStep / 1000);
            this.accumulator -= this.fixedTimeStep;
        }

        // Draw
        this.draw();

        // FPS counter
        this.frameCount++;
        
        // Continue loop
        requestAnimationFrame((t) => this.loop(t));
    }

    // Get current FPS
    getFPS() {
        return Math.round(1000 / this.deltaTime);
    }
}

// Simple game engine with variable timestep
export class SimpleGameEngine {
    constructor(update, draw) {
        this.update = update;
        this.draw = draw;
        this.running = false;
        this.animationId = null;
    }

    start() {
        this.running = true;
        this.loop();
    }

    stop() {
        this.running = false;
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
        }
    }

    loop = () => {
        if (!this.running) return;

        this.update();
        this.draw();

        this.animationId = requestAnimationFrame(this.loop);
    }
}
