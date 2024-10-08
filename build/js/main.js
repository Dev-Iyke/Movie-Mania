const API_KEY = 'd42d9be9750345383b43a7c5e51d1e2a';
const API_URL = `https://api.themoviedb.org/3/trending/movie/day?api_key=${API_KEY}`;

async function fetchTrendingMovies() {
  try {
    const response = await fetch(API_URL)
    const data = await response.json()
    console.log(data.results)
    const movies = data.results
    displayMovies(movies)
  } catch (error) {
    console.error('Error fetching trending movies', error)
  }
}

fetchTrendingMovies()

function displayMovies(movies) {
  const moviesContainer = document.getElementById('movies-cont')
  moviesContainer.innerHTML = movies.map(movie => {
    return `
    <div class="bg-[#3A3F47] p-4 rounded-lg shadow-lg transition-transform transform hover:scale-105 duration-300">
      <a href="movie-details.html?id=${movie.id}">
        <img class="w-full h-[350] object-cover rounded-md mb-4" src="https://image.tmdb.org/t/p/w500${movie.poster_path}" alt="${movie.title}">
        <h2 class="text-lg font-semibold mb-2">${movie.title}</h2>
        <p class="text-sm text-gray-400 line-clamp-3">${movie.overview}</p>
      </a>
    </div>
    `;
  }).join('')
}




































































// fetch('https://api.themoviedb.org/3/trending/movie/day?api_key=YOUR_API_KEY')
//    .then(response => response.json())
//    .then(data => {
//       const movies = data.results;
//       displayMovies(movies);
//     })
//    .catch(error => console.error('Error:', error));