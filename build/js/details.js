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
  const detailsContainer = document.getElementById('movie-details')
  const detailsTitle = document.getElementById('movie-title')
  detailsTitle.textContent = movie.title
  detailsContainer.innerHTML = 
    `<div class="movie">
      <h2>${movie.title}</h2>
    </div>`

}