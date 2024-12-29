// Liste deiner Spiele mit den RAWG API IDs und custom Spiele
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
    gamesGrid.innerHTML = ''; // Leere das Grid zuerst
    
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

// NUR EIN Event Listener
document.addEventListener('DOMContentLoaded', async () => {
    await displayGames();
    const slotContainer = document.getElementById('slotMachine');
    const slotMachine = new GameSlotMachine(slotContainer, games);
}); 