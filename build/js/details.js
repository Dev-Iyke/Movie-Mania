const urlParams = new URLSearchParams(window.location.search)
const movieId = urlParams.get('id')

const API_KEY = 'd42d9be9750345383b43a7c5e51d1e2a';
const detailsUrl = `https://api.themoviedb.org/3/movie/${movieId}?api_key=${API_KEY}`;
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
    z-index: 10;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
  `;

  const genreList = movie.genres.map((genre) => genre.name)
  const stringedGenre = genreList.join(', ')

  detailsTitle.innerHTML = movie.title;

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
      <button class="bg-yellow-500 py-2 rounded-md cursor-pointer" id="addToWatchList">Add to watch list</button>
    </div>  
  `;

  document.getElementById('addToWatchList').addEventListener('click', () => {
    const watchList = JSON.parse(localStorage.getItem('watchList')) || [];
    if (!watchList.includes(movie.id)) {
      watchList.push(movie)
    }
    localStorage.setItem('watchList', JSON.stringify(watchList));
    console.log(watchList)
    })
}

