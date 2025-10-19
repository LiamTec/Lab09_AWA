import ClientMovieSearch from './ClientMovieSearch';
import axios from 'axios';

interface Movie {
  imdbID: string;
  Title: string;
  Year: string;
  Poster: string;
  Type: string;
}

async function getPopularMovies(): Promise<Movie[]> {
  // Usamos "marvel" como ejemplo de búsqueda popular
  const response = await axios.get('https://www.omdbapi.com/?apikey=72bc46e6&s=marvel');
  if (response.data && response.data.Search) {
    return response.data.Search;
  }
  return [];
}

export default async function GalleryPage() {
  const movies = await getPopularMovies();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-700 p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-white text-center mb-8 drop-shadow-lg">
          🎬 Galería de Películas y Series
        </h1>
        <div className="mb-8">
          <ClientMovieSearch />
        </div>
        <h2 className="text-2xl font-bold text-white mb-4">Populares (SSR)</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {movies.map((movie) => (
            <div key={movie.imdbID} className="bg-white/90 rounded-xl shadow-lg p-4 flex flex-col items-center border-4 border-white">
              <img src={movie.Poster !== 'N/A' ? movie.Poster : '/file.svg'} alt={movie.Title} className="w-32 h-48 object-cover rounded mb-2" />
              <div className="text-center">
                <h3 className="text-lg font-bold text-gray-800">{movie.Title}</h3>
                <p className="text-gray-600 text-sm">{movie.Year} - {movie.Type.toUpperCase()}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-8 p-4 bg-gray-100 rounded-lg border-2 border-gray-300">
          <p className="text-sm text-gray-800">
            <strong>SSR:</strong> Esta sección se renderiza en el servidor para mejor SEO y velocidad inicial.
          </p>
        </div>
      </div>
    </div>
  );
}
