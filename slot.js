class GameSlotMachine {
    constructor(container, games) {
        this.games = games;
        this.selectedGames = new Set();
        this.isSpinning = false;
        
        // Container erstellen
        this.container = container;
        this.setupUI();
    }

    setupUI() {
        // Slot Machine Container
        const slotContainer = document.createElement('div');
        slotContainer.className = 'slot-container';
        
        // Display für die Animation
        this.display = document.createElement('div');
        this.display.className = 'slot-display';
        
        // Spin Button
        this.spinButton = document.createElement('button');
        this.spinButton.textContent = 'Zufälliges Spiel!';
        this.spinButton.className = 'spin-button';
        this.spinButton.onclick = () => this.spin();
        
        // Game Selection Container
        const selectionContainer = document.createElement('div');
        selectionContainer.className = 'game-selection';
        
        // Checkboxen für jedes Spiel
        this.games.forEach(game => {
            const label = document.createElement('label');
            label.className = 'game-checkbox';
            
            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.checked = true;
            checkbox.onchange = () => {
                if (checkbox.checked) {
                    this.selectedGames.add(game);
                } else {
                    this.selectedGames.delete(game);
                }
            };
            
            const gameName = game.type === 'custom' ? game.name : game.id.replace(/-/g, ' ');
            label.appendChild(checkbox);
            label.appendChild(document.createTextNode(gameName));
            
            selectionContainer.appendChild(label);
            this.selectedGames.add(game); // Standardmäßig alle ausgewählt
        });
        
        // Alles zusammenfügen
        slotContainer.appendChild(this.display);
        slotContainer.appendChild(this.spinButton);
        this.container.appendChild(slotContainer);
        this.container.appendChild(selectionContainer);
    }

    async spin() {
        if (this.isSpinning || this.selectedGames.size === 0) return;
        
        this.isSpinning = true;
        this.spinButton.disabled = true;
        
        // Array aus ausgewählten Spielen
        const availableGames = Array.from(this.selectedGames);
        
        // Animation
        const duration = 2000; // 2 Sekunden
        const fps = 30;
        const frames = duration / (1000 / fps);
        let frame = 0;
        
        const animate = () => {
            if (frame < frames) {
                const randomGame = availableGames[Math.floor(Math.random() * availableGames.length)];
                const gameName = randomGame.type === 'custom' ? randomGame.name : randomGame.id.replace(/-/g, ' ');
                this.display.textContent = gameName;
                
                frame++;
                setTimeout(animate, 1000 / fps);
            } else {
                // Finales Spiel auswählen
                const winner = availableGames[Math.floor(Math.random() * availableGames.length)];
                const winnerName = winner.type === 'custom' ? winner.name : winner.id.replace(/-/g, ' ');
                this.display.textContent = winnerName;
                
                this.isSpinning = false;
                this.spinButton.disabled = false;
            
            }
        };
        
        animate();
    }
} 