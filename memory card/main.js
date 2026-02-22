// Wait for DOM to be ready
window.onload = function() {
    try {
        // Custom Cursor - Star Passing Effect
        const customCursor = document.getElementById('customCursor');
        const cursorTrail = document.getElementById('cursorTrail');
        const cursorSparkle = document.getElementById('cursorSparkle');
        let cursorX = 0, cursorY = 0;
        let targetX = 0, targetY = 0;
        let lastX = 0, lastY = 0;
        
        // Cursor movement with trail effect
        document.addEventListener('mousemove', (e) => {
            if (customCursor) {
                targetX = e.clientX;
                targetY = e.clientY;
                
                // Create trail stars when moving
                const distance = Math.sqrt(Math.pow(targetX - lastX, 2) + Math.pow(targetY - lastY, 2));
                if (distance > 15 && cursorTrail) {
                    createTrailStar(lastX, lastY, targetX, targetY);
                    lastX = targetX;
                    lastY = targetY;
                }
            }
        });
        
        // Create trailing star
        function createTrailStar(fromX, fromY, toX, toY) {
            if (!cursorTrail) return;
            
            const trail = document.createElement('div');
            trail.className = 'trail-star';
            trail.textContent = '★';
            
            // Calculate direction
            const dx = toX - fromX;
            const dy = toY - fromY;
            const angle = Math.atan2(dy, dx) * 180 / Math.PI;
            
            // Position the trail star
            trail.style.left = fromX + 'px';
            trail.style.top = fromY + 'px';
            trail.style.setProperty('--trail-x', (dx * -0.5) + 'px');
            trail.style.setProperty('--trail-y', (dy * -0.5) + 'px');
            trail.style.transform = `rotate(${angle}deg)`;
            
            // Random size variation
            const size = 8 + Math.random() * 8;
            trail.style.fontSize = size + 'px';
            
            cursorTrail.appendChild(trail);
            
            // Remove after animation
            setTimeout(() => trail.remove(), 600);
        }
        
        // Create sparkle effect periodically
        let sparkleInterval;
        function startSparkles() {
            sparkleInterval = setInterval(() => {
                if (customCursor && cursorSparkle) {
                    createSparkle();
                }
            }, 150);
        }
        
        function createSparkle() {
            if (!cursorSparkle) return;
            
            const sparkle = document.createElement('div');
            sparkle.className = 'sparkle';
            
            // Position around cursor
            const offsetX = (Math.random() - 0.5) * 40;
            const offsetY = (Math.random() - 0.5) * 40;
            sparkle.style.left = cursorX + offsetX + 'px';
            sparkle.style.top = cursorY + offsetY + 'px';
            sparkle.style.setProperty('--sparkle-x', (Math.random() - 0.5) * 30 + 'px');
            sparkle.style.setProperty('--sparkle-y', (Math.random() - 0.5) * 30 + 'px');
            
            cursorSparkle.appendChild(sparkle);
            
            setTimeout(() => sparkle.remove(), 500);
        }
        
        // Smooth cursor animation
        function animateCursor() {
            if (customCursor) {
                cursorX += (targetX - cursorX) * 0.2;
                cursorY += (targetY - cursorY) * 0.2;
                customCursor.style.left = cursorX + 'px';
                customCursor.style.top = cursorY + 'px';
            }
            requestAnimationFrame(animateCursor);
        }
        animateCursor();
        startSparkles();
        
        // Cursor hover effects for interactive elements
        const hoverElements = document.querySelectorAll('button, .game-btn, a, [role="button"]');
        hoverElements.forEach(el => {
            el.addEventListener('mouseenter', () => {
                if (customCursor) customCursor.classList.add('cursor-hover');
            });
            el.addEventListener('mouseleave', () => {
                if (customCursor) customCursor.classList.remove('cursor-hover');
            });
        });
        
        const canvas = document.getElementById("gameCanvas");
        const ctx = canvas.getContext("2d");

        canvas.width = 800;
        canvas.height = 500;

        let currentScript = null;
        let currentGameName = null;
        let gameLoopId = null;
        let gameScore = 0;
        let gameHighScore = 0;

        // Update high score list in menu
        function updateHighScoreDisplay() {
            const highScoreList = document.getElementById('highScoreList');
            if (!highScoreList) return;
            
            const games = ['memoryCard'];
            const gameNames = {
                'memoryCard': 'Memory Match'
            };
            
            highScoreList.innerHTML = games.map(game => {
                const score = localStorage.getItem(game) || 0;
                return `<div>${gameNames[game]}: <span>${score}</span></div>`;
            }).join('');
        }

        // Set canvas size
        function setCanvasSize() {
            canvas.width = 800;
            canvas.height = 500;
        }

        // Start game
        window.startGame = function(gameName) {
            // Initialize sound
            if (window.soundManager) window.soundManager.init();
            if (window.audioManager) window.audioManager.init();
            
            // Hide any game-specific containers
            const memoryCardGame = document.getElementById('memoryCardGame');
            if (memoryCardGame) memoryCardGame.style.display = 'none';
            
            // Show game elements
            document.getElementById("mainMenu").style.display = "none";
            document.getElementById("backBtn").style.display = "block";
            canvas.style.display = "block";
            canvas.style.margin = "80px auto";
            document.getElementById("gameUI").style.display = "flex";
            document.getElementById("gameOverModal").style.display = "none";
            
            // Set canvas size
            setCanvasSize();
            
            // Clear previous game
            if (currentScript) currentScript.remove();
            if (gameLoopId) cancelAnimationFrame(gameLoopId);
            
            // Reset score
            gameScore = 0;
            currentGameName = gameName;
            gameHighScore = parseInt(localStorage.getItem(gameName)) || 0;
            updateScoreDisplay();
            
            // Load game script
            const script = document.createElement("script");
            script.src = `games/${gameName}.js`;
            script.onload = () => console.log('Loaded:', gameName);
            script.onerror = () => console.error('Failed:', gameName);
            document.body.appendChild(script);
            currentScript = script;
        };

        // Go back to menu
        window.goToMenu = function() {
            document.getElementById("mainMenu").style.display = "block";
            canvas.style.display = "none";
            document.getElementById("backBtn").style.display = "none";
            document.getElementById("gameUI").style.display = "none";
            document.getElementById("gameOverModal").style.display = "none";
            
            if (gameLoopId) cancelAnimationFrame(gameLoopId);
            if (currentScript) { currentScript.remove(); currentScript = null; }
            
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            updateHighScoreDisplay();
            currentGameName = null;
        };

        // Restart game
        window.restartGame = function() {
            if (currentGameName) {
                document.getElementById("gameOverModal").style.display = "none";
                if (currentGameName === 'memoryCard' && typeof window.restartMemoryCard === 'function') {
                    window.restartMemoryCard();
                } else {
                    startGame(currentGameName);
                }
            }
        };

        // Update score display
        function updateScoreDisplay() {
            const scoreEl = document.getElementById("currentScore");
            const highScoreEl = document.getElementById("highScoreDisplay");
            if (scoreEl) scoreEl.textContent = `Score: ${gameScore}`;
            if (highScoreEl) highScoreEl.textContent = `Best: ${gameHighScore}`;
        }

        // Set score
        window.setGameScore = function(score) {
            gameScore = score;
            updateScoreDisplay();
        };

        window.incrementScore = function(amount) {
            gameScore += amount;
            updateScoreDisplay();
        };

        window.getGameScore = function() { return gameScore; };

        // Game over handler
        window.gameOver = function(finalScore) {
            const modal = document.getElementById("gameOverModal");
            const finalScoreEl = document.getElementById("finalScore");
            const newHighScoreEl = document.getElementById("newHighScore");
            
            finalScoreEl.textContent = `Score: ${finalScore}`;
            
            if (finalScore > gameHighScore) {
                gameHighScore = finalScore;
                localStorage.setItem(currentGameName, finalScore);
                newHighScoreEl.style.display = "block";
            } else {
                newHighScoreEl.style.display = "none";
            }
            
            modal.style.display = "flex";
        };

        window.isGameRunning = function() { return currentGameName !== null; };
        window.setGameLoop = function(id) { gameLoopId = id; };
        
        // Update hover elements (for dynamically created elements)
        function updateCursorHoverElements() {
            const hoverElements = document.querySelectorAll('button, .game-btn, a, [role="button"]');
            hoverElements.forEach(el => {
                el.removeEventListener('mouseenter', handleMouseEnter);
                el.removeEventListener('mouseleave', handleMouseLeave);
                el.addEventListener('mouseenter', handleMouseEnter);
                el.addEventListener('mouseleave', handleMouseLeave);
            });
        }
        
        function handleMouseEnter() {
            if (customCursor) customCursor.classList.add('cursor-hover');
        }
        
        function handleMouseLeave() {
            if (customCursor) customCursor.classList.remove('cursor-hover');
        }
        
        // Initial hover elements
        updateCursorHoverElements();
        
        // Expose function for dynamic elements
        window.updateCursorHoverElements = updateCursorHoverElements;
        
        // Initial load
        updateHighScoreDisplay();
        console.log('IndieVerse loaded successfully');
    } catch (e) {
        console.error('Error:', e);
    }
};
