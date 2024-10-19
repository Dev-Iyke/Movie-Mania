const watchList = JSON.parse(localStorage.getItem('watchList')) || [];
console.log(watchList);
const watchListDiv = document.getElementById('watch-list')

function displayMovies(movies, moviesContainer) {
  if (movies.length === 0) {
    moviesContainer.innerHTML = `<p class="text-center">No movies found.</p>`
    return;
  }
  moviesContainer.innerHTML = movies.map(movie => {
    return `
    <div class="bg-[#3A3F47] p-4 rounded-lg shadow-lg transition-transform transform hover:scale-105 duration-300">
      <a href="movie-details.html?id=${movie.id}">
        <img class="w-full h-[300px] object-cover rounded-md mb-4" src="https://image.tmdb.org/t/p/w500${movie.poster_path}" alt="${movie.title}">
        <h2 class="text-lg font-semibold mb-2">${movie.title}</h2>
        <p class="text-sm text-gray-400 line-clamp-3">${movie.overview}</p>
        <h4 class="text-lg font-semibold mt-2">Rating: ${movie.vote_average}/10</h4>
        <button
          class="bg-yellow-500 py-2 rounded-md cursor-pointer transition-transform transform scale-105 duration-300 w-full"
          id="addToWatchList"
        >
          Clear WatchList <i class="fa-solid fa-trash"></i>
        </button>
      </a>
    </div>
    `;
  }).join('')
}

displayMovies(watchList, watchListDiv)