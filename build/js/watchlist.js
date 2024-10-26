//Retrieving latest watch list
let watchList = JSON.parse(localStorage.getItem('watchList')) || [];
let watchListCount = watchList.length;

const watchListDiv = document.getElementById('watch-list')
const clearBtn = document.getElementById('clearWatchList')
const watchCount = document.getElementById('watchlist-count')
watchCount.textContent = watchListCount

if (watchList.length < 1){
  clearBtn.style.display = 'none';
}

//Clearing the watch list
clearBtn.addEventListener('click', () => {
  localStorage.removeItem('watchList');
  watchListCount = 0;
  watchCount.textContent = watchListCount;
  displayMovies([], watchListDiv)
  if (watchListCount === 0){
    clearBtn.style.display = 'none';
  }
})

//Displaying the watch list with styles
function displayMovies(movies, moviesContainer) {
  //Empty watch list
  if (movies.length === 0) {
    moviesContainer.innerHTML = `<p class="text-center">No movies found.</p>`
    return;
  }

  moviesContainer.innerHTML = movies.map(movie => {
    return `
    <div class="bg-[#3A3F47] p-4 rounded-lg shadow-lg transition-transform transform hover:scale-105 duration-300">
      <a href="movie-details.html?id=${movie.id}">
        <div class="">
          <img class="w-full h-[150px] object-cover rounded-md mb-4" src="https://image.tmdb.org/t/p/w500${movie.poster_path}" alt="${movie.title}">
        </div>
        <div>
          <h2 class="text-lg font-semibold mb-2 line-clamp-1">${movie.title}</h2>
          
          <h4 class="text-sm my-2">${movie.vote_average < 1 ? 'No Ratings Yet' : `Rating: ${movie.vote_average}/10`}</h4>
        </div>
      </a>
      <button
        onclick="removeFromWatchList(${movie.id})"
        class="bg-yellow-500 py-2 rounded-md cursor-pointer transition-transform transform hover:scale-90 hover:bg-red-700 duration-300 w-full"
        id="removeFromWatchList"
      >
        Remove <i class="fa-solid fa-trash"></i>
      </button>
    </div>
    `;
    
  }).join('')
}

//removing an item from watch list
window.removeFromWatchList = function(id) {
  watchList = watchList.filter(movie => movie.id !== id)
  watchListCount -= 1;
  watchCount.textContent = watchListCount;
  localStorage.setItem('watchList', JSON.stringify(watchList))
  if (watchList.length < 1){
    clearBtn.style.display = 'none';
  }
  displayMovies(watchList, watchListDiv)
}

displayMovies(watchList, watchListDiv)