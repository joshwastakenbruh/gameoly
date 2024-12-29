// Liste deiner Spiele mit den RAWG API IDs
const gameIds = [
    'grand-theft-auto-v',  // GTA V
    'the-witcher-3-wild-hunt',  // The Witcher 3
    'portal-2',
    'blobby-volley-2',
    // Füge hier weitere Spiele hinzu
];

// RAWG API Key - Du musst dir einen kostenlosen API Key holen von https://rawg.io/apidocs
const API_KEY = '591001a77570441f95710e2ea2717870';

async function fetchGameDetails(gameId) {
    const response = await fetch(`https://api.rawg.io/api/games/${gameId}?key=${API_KEY}`);
    const data = await response.json();
    return data;
}

async function displayGames() {
    const gamesGrid = document.getElementById('games-grid');
    
    for (const gameId of gameIds) {
        try {
            const game = await fetchGameDetails(gameId);
            
            const gameCard = document.createElement('div');
            gameCard.className = 'game-card';
            
            gameCard.innerHTML = `
                <img src="${game.background_image}" alt="${game.name}">
                <div class="game-info">
                    <h3>${game.name}</h3>
                </div>
            `;
            
            gamesGrid.appendChild(gameCard);
        } catch (error) {
            console.error(`Fehler beim Laden von ${gameId}:`, error);
        }
    }
}

// Lade die Spiele, wenn die Seite geladen ist
document.addEventListener('DOMContentLoaded', displayGames); 