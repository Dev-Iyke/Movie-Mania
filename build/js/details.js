//Retrieving params to search for individual movie
const urlParams = new URLSearchParams(window.location.search)
const movieId = urlParams.get('id')
console.log(movieId)

const API_KEY = 'd42d9be9750345383b43a7c5e51d1e2a';
const detailsUrl = `https://api.themoviedb.org/3/movie/${movieId}?api_key=${API_KEY}`;

//Updating watch list count
const watchList = JSON.parse(localStorage.getItem('watchList')) || [];
let watchListCount = watchList.length;
const watchCount = document.getElementById('watchlist-count')
watchCount.textContent = watchListCount

//Getting the movie details
const fetchMovieDetails = async () => {
  try {
    const response = await fetch(detailsUrl)
    const movie =  await response.json()
    console.log(movie)
    displayMoviesDetails(movie)
  } catch (error) {
    console.error('Error fetching details', error)
  }
}
fetchMovieDetails()

//Function to display the movie details
function displayMoviesDetails(movie) {
  const detailsContainer = document.getElementById('movie-details');
  const detailsTitle = document.getElementById('movie-title');
  const genresContainer = document.getElementById('genres-container');

  //Set the background image using inline styles
  const backgroundStyle = `
    background-image: url('https://image.tmdb.org/t/p/w500${movie.backdrop_path}');
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
    height: 90vh;
    border-radius: 12px;
    position: relative;
  `;
  const posterStyle = `
    background-image: url('https://image.tmdb.org/t/p/w500${movie.poster_path}');
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
    height: 220px;
    width: 170px;
    border-radius: 12px;
    position: absolute;
    bottom: -60px;
    left: 30px;
    z-index: 2;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
  `;

  //Getting genres as a comma-separated list
  const genreList = movie.genres.map((genre) => genre.name)
  const stringedGenre = genreList.join(', ')

  //dynamically rendering each movie title
  detailsTitle.innerHTML = movie.title;

  //displaying movies with styles
  detailsContainer.innerHTML = `
    <div style="${backgroundStyle}" class="movie w-full rounded-md mb-4">
      <div style="${posterStyle}" ></div>
    </div>
    <div class="p-4 text-white flex flex-col gap-4 mt-16 md:max-w-[70%] mx-auto">
      <h2 class="text-3xl text-yellow-500 font-bold mb-2">${movie.title} - ${movie.runtime}mins</h2>
      <p class="text-base">${movie.overview}</p>
      <p class="text-sm"><strong>Rating:</strong> ${movie.vote_average}/10</p>
      <p class="text-sm"><strong>Release Date:</strong> ${new Date(movie.release_date).toLocaleDateString()}</p>
      <p class="text-sm"><strong>Genres:</strong> ${stringedGenre}</p>
      <div class="flex gap-6 items-center">
        <button class="w-full bg-yellow-500 py-2 rounded-md cursor-pointer transition-transform transform hover:scale-105 hover:bg-green-700 duration-300" id="addToWatchList">Add to watch list <span class="text-xl font-bold">&plus;</span></button>

        <button class="w-full bg-red-700 py-2 rounded-md cursor-pointer transition-transform transform hover:scale-105 hover:bg-green-700 duration-300" ><i class="fa-solid fa-clock"></i> Watch Now <span class="text-xl font-bold"></span></button>
      </div>
    </div>  
  `;

  //Adding event listener to add movie to watch list when clicked on the button
  document.getElementById('addToWatchList').addEventListener('click', () => {
    const watchList = JSON.parse(localStorage.getItem('watchList')) || [];
    console.log(watchList)
    const movieExists = watchList.some(toWatch => toWatch.id === movie.id);
    console.log(movieExists)
    if (!movieExists) {
      watchList.push(movie)
      watchListCount += 1
      watchCount.textContent = watchListCount
      confirm(`${movie.title} added to watch list`)
      localStorage.setItem('watchList', JSON.stringify(watchList));
      console.log(watchList)
    }else {
      confirm(`${movie.title} already in watch list`)
      console.log('Movie already exists in watch list')
    }
    })
}