// Liste deiner Spiele mit den RAWG API IDs und custom Spiele
const games = [
    // RAWG Spiele
    { id: 'grand-theft-auto-v', type: 'rawg' },
    { id: 'the-witcher-3-wild-hunt', type: 'rawg' },
    { id: 'portal-2', type: 'rawg' },
    // Custom Spiele
    {
        id: 'geoguessr',
        type: 'custom',
        name: 'GeoGuessr',
        background_image: 'https://iogames.lv/thumbs/openguessr-io_1.jpg',
        url: 'https://openguessr.com/'
    },
    {
        id: 'codenames',
        type: 'custom',
        name: 'Codenames Online',
        background_image: 'https://czechgames.com/files/rules/codenames-rules-en.jpg',
        url: 'https://codenames.game'
    }
];

// RAWG API Key - Du musst dir einen kostenlosen API Key holen von https://rawg.io/apidocs
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
    
    for (const game of games) {
        try {
            const gameData = await fetchGameDetails(game);
            if (!gameData) continue;
            
            const gameCard = document.createElement('div');
            gameCard.className = 'game-card';
            
            // Mache die ganze Karte klickbar, wenn eine URL vorhanden ist
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

// Lade die Spiele, wenn die Seite geladen ist
document.addEventListener('DOMContentLoaded', displayGames); 