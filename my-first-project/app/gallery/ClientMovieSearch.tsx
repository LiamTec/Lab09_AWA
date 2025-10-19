'use client'

import { useState, useEffect } from 'react';
import axios from 'axios';

interface Movie {
  imdbID: string;
  Title: string;
  Year: string;
  Poster: string;
  Type: string;
}

interface MovieDetail extends Movie {
  Plot: string;
  Genre: string;
  Director: string;
  Actors: string;
  Runtime: string;
  Language: string;
  imdbRating: string;
}

export default function ClientMovieSearch() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState<MovieDetail | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    if (query.length < 3) {
      setResults([]);
      return;
    }
    setLoading(true);
    const timeout = setTimeout(() => {
      axios.get(`https://www.omdbapi.com/?apikey=72bc46e6&s=${encodeURIComponent(query)}`)
        .then(res => {
          setResults(res.data.Search || []);
          setLoading(false);
        });
    }, 500);
    return () => clearTimeout(timeout);
  }, [query]);

  const fetchDetail = async (id: string) => {
    setLoading(true);
    const res = await axios.get(`https://www.omdbapi.com/?apikey=72bc46e6&i=${id}`);
    setSelected(res.data);
    setModalOpen(true);
    setLoading(false);
  };

  return (
    <div className="bg-white/90 rounded-xl shadow-lg p-6 border-4 border-white mb-8">
      <h2 className="text-xl font-bold text-gray-800 mb-2">Búsqueda (CSR)</h2>
      <input
        type="text"
        value={query}
        onChange={e => setQuery(e.target.value)}
        placeholder="Buscar película o serie..."
        className="w-full p-3 border-2 border-gray-300 rounded-lg mb-4 focus:outline-none focus:border-blue-500"
      />
      {loading && <div className="text-blue-600">Cargando...</div>}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {results.map(movie => (
          <div
            key={movie.imdbID}
            className="bg-gray-100 rounded-lg p-2 flex flex-col items-center cursor-pointer hover:bg-blue-100 border border-gray-200"
            onClick={() => fetchDetail(movie.imdbID)}
          >
            <img
              src={movie.Poster !== 'N/A' ? movie.Poster : '/file.svg'}
              alt={movie.Title}
              className="w-24 h-36 object-cover rounded mb-1"
              onError={e => {
                const target = e.currentTarget;
                if (target.src !== window.location.origin + '/file.svg') {
                  target.src = '/file.svg';
                }
              }}
            />
            <div className="text-center">
              <h3 className="text-base font-bold text-gray-700">{movie.Title}</h3>
              <p className="text-gray-500 text-xs">{movie.Year} - {movie.Type.toUpperCase()}</p>
            </div>
          </div>
        ))}
      </div>
      {modalOpen && selected && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-lg w-full relative border-4 border-blue-400">
            <button
              className="absolute top-2 right-2 text-gray-500 hover:text-red-500 text-2xl font-bold"
              onClick={() => setModalOpen(false)}
            >
              ×
            </button>
            <div className="flex gap-4">
              <img
                src={selected.Poster !== 'N/A' ? selected.Poster : '/file.svg'}
                alt={selected.Title}
                className="w-32 h-48 object-cover rounded"
                onError={e => {
                  const target = e.currentTarget;
                  if (target.src !== window.location.origin + '/file.svg') {
                    target.src = '/file.svg';
                  }
                }}
              />
              <div>
                <h2 className="text-2xl font-bold mb-1">{selected.Title}</h2>
                <p className="text-gray-600 mb-1">{selected.Year} • {selected.Type.toUpperCase()}</p>
                <p className="text-gray-700 mb-2">{selected.Plot}</p>
                <p className="text-xs text-gray-500 mb-1">🎬 {selected.Genre}</p>
                <p className="text-xs text-gray-500 mb-1">🎥 Director: {selected.Director}</p>
                <p className="text-xs text-gray-500 mb-1">⭐ IMDB: {selected.imdbRating}</p>
                <p className="text-xs text-gray-500 mb-1">⏱️ {selected.Runtime}</p>
                <p className="text-xs text-gray-500 mb-1">🗣️ {selected.Language}</p>
                <p className="text-xs text-gray-500 mb-1">👥 {selected.Actors}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
