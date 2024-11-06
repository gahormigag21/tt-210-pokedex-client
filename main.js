const pokemonList = document.getElementById("pokemon-list")
const pokemonDetail = document.getElementById("pokemon-detail")
const pokemonInfo = document.getElementById("pokemon-info")
const backButton = document.getElementById("back-button")

const searchInput = document.getElementById("search-input")
const searchButton = document.getElementById("search-button")

const prevButton = document.getElementById("prev-button")
const nextButton = document.getElementById("next-button")

let currentPage = 1
const itemsPerPage=20
const totalPokemons=1025

// Mapeo de tipos de Pokémon a colores
const typeColors = {
    normal: '#A8A77A',
    fire: '#EE8130',
    water: '#6390F0',
    electric: '#F7D02C',
    grass: '#7AC74C',
    ice: '#96D9D6',
    fighting: '#C22E28',
    poison: '#A33EA1',
    ground: '#E2BF65',
    flying: '#A98FF3',
    psychic: '#F95587',
    bug: '#A6B91A',
    rock: '#B6A136',
    ghost: '#735797',
    dragon: '#6F35FC',
    dark: '#705746',
    steel: '#B7B7CE',
    fairy: '#D685AD'
};

// Función para obtener el color según el tipo de Pokémon
function getTypeColor(types) {
    // Divide la cadena en una lista de tipos y toma el primer tipo como el tipo principal
    const primaryType = types.split(", ")[0].trim(); // Obtiene el primer tipo
    return typeColors[primaryType] || '#777'; // Si no se encuentra el tipo, usa un color por defecto
}


async function fetchPokemonData(pokemonId) {
    const response = await fetch(`http://127.0.0.1:3000/api/pokemon/${pokemonId}`);
    const pokemon = await response.json();
    return pokemon;
}
async function viewStatusPokemon(pokemon_id) {
    try {
        const response = await fetch("http://127.0.0.1:3000/api/pokemon/",{
            method:"POST",
            headers:{
                "Content-type":"application/json"
            },
            body: JSON.stringify({
                pokemon_id:pokemon_id,
                view:true,
                catch:false,
                in_team:false
            })
        })
        console.log(response)
        const pokemonView = await response.json()
        return pokemonView
    } catch (error) {
        console.error(error)
    }
    
}
async function catchStatusPokemon(pokemon_id,viewStatus) {
    try {
        const response = await fetch(`http://127.0.0.1:3000/api/pokemon/catch/${pokemon_id}`,{
            method:"PUT",
            headers:{
                "Content-type":"application/json"
            },
            body: JSON.stringify({
                pokemon_id:pokemon_id,
                view:viewStatus,
                catch:false,
                in_team:false
            })
        })
        console.log(response)
        const pokemonView = await response.json()
        return pokemonView
    } catch (error) {
        console.error(error)
    }
    
}
async function inTeamStatusPokemon(pokemon_id,viewStatus,catchStatus,in_teamStatus) {
    try {
        const response = await fetch(`http://127.0.0.1:3000/api/pokemon/inTeam/${pokemon_id}`,{
            method:"PUT",
            headers:{
                "Content-type":"application/json"
            },
            body: JSON.stringify({
                pokemon_id:pokemon_id,
                view:viewStatus,
                catch:catchStatus,
                in_team:in_teamStatus
            })
        })
        console.log(response)
        const pokemonView = await response.json()
        return pokemonView
    } catch (error) {
        console.error(error)
    }
    
}

function getShinyChance() {
    return Math.random() < 0.3; // 30% de probabilidad de shiny
}

function displayPokemon(pokemon) {
    const isShiny = getShinyChance();
    const pokemonCard = document.createElement("div");
    pokemonCard.classList.add("pokemon-card");

    const sprite = isShiny ? pokemon.imageS : pokemon.image;

    // Si es shiny, el color de fondo será dorado, si no, dependerá del tipo de Pokémon
    const bgColor = isShiny ? 'gold' : getTypeColor(pokemon.types);

    // Aplicar un filtro al sprite si pokemon.view es false
    const spriteStyle = pokemon.view ? '' : 'filter: grayscale(100%) brightness(0.4);';
    
    pokemonCard.style.backgroundColor = bgColor; // Aplica el color de fondo dinámicamente

    pokemonCard.innerHTML = `
        <img src="${sprite}" alt="${pokemon.name}"style="${spriteStyle}">
        <h3>${pokemon.name.toUpperCase()} ${isShiny ? "(Shiny)" : ""}</h3>
        <p>ID: ${pokemon.pokemon_id}</p>
    `;
    
    // Evento para mostrar detalles
    pokemonCard.addEventListener("click", () => showPokemonDetail(pokemon, isShiny, sprite));
    pokemonList.appendChild(pokemonCard);
    return;
}

backButton.addEventListener("click",()=>{
    pokemonDetail.style.display = "none"
    pokemonList.style.display = "grid"
})

function showPokemonDetail(pokemon, isShiny, sprite) {
    pokemonList.style.display = "none";
    pokemonDetail.style.display = "block";
    
    // Aplicar un filtro al sprite si pokemon.view es false
    const spriteStyle = pokemon.view ? '' : 'filter: grayscale(100%) brightness(0.4);';

    // Actualizar el contenido de pokemonInfo
    pokemonInfo.innerHTML = `
        <h2>${pokemon.name.toUpperCase()} ${isShiny ? "(Shiny)" : ""}</h2>
        <img src="${sprite}" alt="${pokemon.name}" style="${spriteStyle}">
        <p>ID: ${pokemon.pokemon_id}</p>
        <p>Altura: ${pokemon.height / 10} m</p>
        <p>Peso: ${pokemon.weight / 10} kg</p>
        <p>Tipos: ${pokemon.types}</p>
    `;

    // Crear botones de estado con estilos
    const viewStatusButton = document.createElement("button");
    viewStatusButton.innerHTML = `<span class="icon">👁️</span><span class="label">Visto</span>`;
    viewStatusButton.className = pokemon.view ? "status-button viewed" : "status-button not-viewed";
    viewStatusButton.addEventListener("click", () => viewStatusPokemon(pokemon.pokemon_id));
    pokemonInfo.appendChild(viewStatusButton);

    const catchStatusButton = document.createElement("button");
    catchStatusButton.innerHTML = `<span class="icon">🟠</span><span class="label">Capturado</span>`;
    catchStatusButton.className = pokemon.catch ? "status-button caught" : "status-button not-caught";
    catchStatusButton.addEventListener("click", () => catchStatusPokemon(pokemon.pokemon_id, pokemon.view));
    pokemonInfo.appendChild(catchStatusButton);

    const inTeamStatusButton = document.createElement("button");
    inTeamStatusButton.innerHTML = `<span class="icon">🔵</span><span class="label">En Equipo</span>`;
    inTeamStatusButton.className = pokemon.inTeam ? "status-button in-team" : "status-button not-in-team";
    inTeamStatusButton.addEventListener("click", () => inTeamStatusPokemon(pokemon.pokemon_id, pokemon.view, pokemon.catch, pokemon.inTeam));
    pokemonInfo.appendChild(inTeamStatusButton);

    return;
}


async function loadPokedex(page) {
    pokemonList.innerHTML=""
    const start = (page-1)*itemsPerPage +1
    const end = (page*itemsPerPage)
    for (let i = start; i <= end; i++) {
        const pokemon = await fetchPokemonData(i);
        displayPokemon(pokemon);
    }
    updatePaginationButtons(page)
    return
}

async function searchPokemon() {
    const query = searchInput.value.toLowerCase().trim()
    if (query) {
        try {
            const pokemon = await fetchPokemonData(query)
            pokemonList.style.display = "none"
            showPokemonDetail(pokemon,false,pokemon.sprites.front_default)
        } catch (error) {
            alert("Pokémon no encontrado, intentelo de nuevo")
        }
    }else{
        alert("Ingresar un nombre o un id de pokemon")
    }
}

searchButton.addEventListener("click",searchPokemon)

function updatePaginationButtons(page) {
    prevButton.disabled = page == 1
    nextButton.disabled = page == Math.floor(totalPokemons/itemsPerPage)
    
}


nextButton.addEventListener("click", ()=>{
    currentPage++
    loadPokedex(currentPage);
})
prevButton.addEventListener("click", ()=>{
    if (currentPage>1) {
        currentPage--
        loadPokedex(currentPage);
    }
})
loadPokedex(currentPage);