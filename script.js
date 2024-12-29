// Slot Machine Klasse
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
        const duration = 2000;
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
                
                alert(`Das nächste Spiel ist: ${winnerName}!`);
            }
        };
        
        animate();
    }
}

// Liste der Spiele
const games = [
    // RAWG Spiele
    { id: 'mario-kart-8', type: 'rawg' },
    { id: 'counter-strike-2-2', type: 'rawg' },
    { id: 'fall-guys', type: 'rawg' },
    { id: 'golf-it', type: 'rawg' },
    { id: 'cube-racer-2', type: 'rawg' },
    { id: 'kniffel-2-jetzt-wird-abgekniffelt', type: 'rawg' },
    // Custom Spiele
    {
        id: 'OpenGuessr',
        type: 'custom',
        name: 'OpenGuessr',
        background_image: 'https://iogames.lv/thumbs/openguessr-io_1.jpg',
        url: 'https://openguessr.com/'
    },
    {
        id: 'codenames',
        type: 'custom',
        name: 'Codenames Online',
        background_image: 'https://www.reich-der-spiele.de/wp-content/uploads/codenames.jpg',
        url: 'https://codenames.game/'
    },
    {
        id: 'hedgewars',
        type: 'custom',
        name: 'Hedgewars',
        background_image: 'https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/2223810/capsule_616x353.jpg?t=1700249227',
        url: 'https://www.hedgewars.org/'
    }
];

const API_KEY = '591001a77570441f95710e2ea2717870';

async function fetchGameDetails(game) {
    if (game.type === 'custom') {
        return game;
    }
    
    try {
        const response = await fetch(`https://api.rawg.io/api/games/${game.id}?key=${API_KEY}`);
        const data = await response.json();
        return {
            ...data,
            url: data.website || null
        };
    } catch (error) {
        console.error(`Fehler beim Laden von ${game.id}:`, error);
        return null;
    }
}

async function displayGames() {
    const gamesGrid = document.getElementById('games-grid');
    gamesGrid.innerHTML = '';
    
    for (const game of games) {
        try {
            const gameData = await fetchGameDetails(game);
            if (!gameData) continue;
            
            const gameCard = document.createElement('div');
            gameCard.className = 'game-card';
            
            if (gameData.url) {
                gameCard.style.cursor = 'pointer';
                gameCard.onclick = () => window.open(gameData.url, '_blank');
            }
            
            gameCard.innerHTML = `
                <img src="${gameData.background_image}" alt="${gameData.name}">
                <div class="game-info">
                    <h3>${gameData.name}</h3>
                </div>
            `;
            
            gamesGrid.appendChild(gameCard);
        } catch (error) {
            console.error(`Fehler beim Anzeigen von ${game.id}:`, error);
        }
    }
}

// Initialisierung
document.addEventListener('DOMContentLoaded', async () => {
    await displayGames();
    const slotContainer = document.getElementById('slotMachine');
    const slotMachine = new GameSlotMachine(slotContainer, games);
}); 