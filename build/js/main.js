const API_KEY = 'd42d9be9750345383b43a7c5e51d1e2a';
const TRENDING_URL = `https://api.themoviedb.org/3/trending/movie/day?api_key=${API_KEY}`;
const genreAPI = `https://api.themoviedb.org/3/genre/movie/list?api_key=${API_KEY}`;

const moviesDiv = document.getElementById('movies-cont')
const heading = document.getElementById('heading')
const searchInput = document.getElementById('search')
const genreSelect = document.getElementById('genre-select')

//Updating watch list count
const watchList = JSON.parse(localStorage.getItem('watchList')) || [];
let watchListCount = watchList.length;
const watchCount = document.getElementById('watchlist-count')
watchCount.textContent = watchListCount

//Fetching all available genres
let genres = []
async function fetchGenres() {
  try {
    const response = await fetch(genreAPI)
    const data = await response.json()
    genres = data.genres
    genreSelect.innerHTML += genres.map((genre) => {
      return `
      <option value="${genre.id}">${genre.name}</option>
      `
    }).join('');
  } catch (error) {
    console.error('Error fetching genres', error)
  }
}

//Applying a delaying to avoid too frequent fetching
let debounceTimeout;
function debounce(func, delay) {
  return (...args) => {
    clearTimeout(debounceTimeout);
    debounceTimeout = setTimeout(() => func(...args), delay);
  };
}

//Fetching all trending movies to show up by default
async function fetchTrendingMovies() {
  const totalPages = 3
  let allMovies = []

  for (let page = 1; page <= totalPages; page++) {
    const trendingUrl = `${TRENDING_URL}&page=${page}`
    try {
      const response = await fetch(trendingUrl)
      const data = await response.json()
      const movies = data.results
      allMovies = [...allMovies, ...movies]
    } catch (error) {
      console.error('Error fetching trending movies', error)
    }
  }

  heading.textContent = 'Trending Movies'
  displayMovies(allMovies, moviesDiv)
}

//Fetching movies once there is a change in the search input field by title
//Also checks if a genre is selected at that point
searchInput.addEventListener('input', debounce(async (e) => {
  const query = e.target.value.trim()
  const genreId = genreSelect.value

  if (query.length >= 1) {
    const totalPages = 3
    let allMovies = []

    for (let page = 1; page <= totalPages; page++) {
      let searchUrl = `https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}&query=${query}&page=${page}`;
      try {
        const response = await fetch(searchUrl)
        const data = await response.json()
        let searchedMovies = data.results
        if (genreId) {
          searchedMovies = searchedMovies.filter(movie => movie.genre_ids.includes(parseInt(genreId)));
        }

        allMovies = [...allMovies, ...searchedMovies];
      } catch (error) {
        console.error('Error fetching search result', error)
      }
    }

    heading.textContent = 'Search Results...'
    displayMovies(allMovies, moviesDiv)
  } else{
    if (genreId) {
      fetchMoviesByGenre(genreId);
    } else {
      fetchTrendingMovies();
    }
  }
}), 300)

//Fetching movies once there is a change in the genre select field by genreId
//Also checks if a search query is entered at that point
genreSelect.addEventListener('change', async (e) => {
  const genreId = e.target.value;
  const query = searchInput.value.trim()
  if (genreId !== '' && query.length >= 1){
    const totalPages = 3
    let allMovies = []

    for (let page = 1; page <= totalPages; page++) {
      let searchUrl = `https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}&query=${query}&page=${page}`;
      try {
        const response = await fetch(searchUrl)
        const data = await response.json()
        let genreMovies = data.results
        genreMovies = genreMovies.filter(movie => movie.genre_ids.includes(parseInt(genreId)));

        allMovies = [...allMovies, ...genreMovies]
      } catch (error) {
        console.log('Error fetching movies with selected genre', error)
      }
    }
    const selectedGenre = genres.find(genre => genre.id === parseInt(genreId))
    if (selectedGenre){
      heading.textContent = `${selectedGenre.name} Movies`
    }else{
      heading.textContent = `Searched Movies...`
    }
    
    displayMovies(allMovies, moviesDiv)
  }else if(genreId === '' && query.length >= 1){
    fetchMoviesBySearch(query)
  }else if (genreId !== '' && query.length < 1){
    fetchMoviesByGenre(genreId)
  }else {
    fetchTrendingMovies()
  }
})

// function to fetch movies by genres alone using genre id
async function fetchMoviesByGenre(genreId) {
  const totalPages = 3;
  let allMovies = [];

  for (let page = 1; page <= totalPages; page++) {
    const genreUrl = `https://api.themoviedb.org/3/discover/movie?api_key=${API_KEY}&with_genres=${genreId}&page=${page}`;
    try {
      const response = await fetch(genreUrl);
      const data = await response.json();
      const genreMovies = data.results;
      
      allMovies = [...allMovies, ...genreMovies];
    } catch (error) {
      console.error('Error fetching movies with selected genre', error);
    }
  }

  const selectedGenre = genres.find(genre => genre.id === parseInt(genreId));
  heading.textContent = `${selectedGenre.name} Movies`;
  displayMovies(allMovies, moviesDiv);
}

// function to fetch movies by search alone using title
async function fetchMoviesBySearch(query) {
  const totalPages = 3;
  let allMovies = [];

  for (let page = 1; page <= totalPages; page++) {
    let searchUrl = `https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}&query=${query}&page=${page}`;
    try {
      const response = await fetch(searchUrl);
      const data = await response.json();
      const searchMovies = data.results;
      
      allMovies = [...allMovies, ...searchMovies];
    } catch (error) {
      console.error('Error fetching movies with selected genre', error);
    }
  }
  displayMovies(allMovies, moviesDiv);
}

//utility function to display movies
function displayMovies(movies, moviesContainer) {
  if (movies.length === 0) {
    moviesContainer.innerHTML = `<p class="text-center">No movies found.</p>`
    return;
  }
  moviesContainer.innerHTML = movies.map(movie => {
    return `
    <div class="bg-[#3A3F47] p-4 rounded-lg shadow-lg transition-transform transform hover:scale-105 duration-300">
      <a href="movie-details.html?id=${movie.id}">
        <img class="w-full h-[350px] object-cover rounded-md mb-4" src="https://image.tmdb.org/t/p/w500${movie.poster_path}" alt="${movie.title}">
        <h2 class="text-lg font-semibold mb-2 line-clamp-1">${movie.title}</h2>
        <p class="text-sm text-gray-400 line-clamp-3">${movie.overview}</p>
        <h4 class="text-lg font-semibold mt-2">Rating: ${movie.vote_average}/10</h4>
      </a>
    </div>
    `;
  }).join('')
}

fetchGenres()
fetchTrendingMovies()