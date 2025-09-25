import React, { useState, useEffect, useRef } from 'react';
import { Movie, User } from '../types';
import MovieCard from './MovieCard';

interface SearchOverlayProps {
  allMovies: Movie[];
  onClose: () => void;
  onCardClick: (movie: Movie) => void;
  user: User | null;
  onEditClick: (movie: Movie) => void;
  onDeleteClick: (movie: Movie) => void;
  onToggleMyList: (movie: Movie) => void;
  myList: Movie[];
}

const SearchOverlay: React.FC<SearchOverlayProps> = ({ allMovies, onClose, onCardClick, user, onEditClick, onDeleteClick, onToggleMyList, myList }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Movie[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Focus the input when the component mounts
    inputRef.current?.focus();
    
    // Disable body scroll
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, []);

  useEffect(() => {
    if (query.trim() === '') {
      setResults([]);
      return;
    }

    const lowercasedQuery = query.toLowerCase();
    const filteredMovies = allMovies.filter(movie =>
      movie.title.toLowerCase().includes(lowercasedQuery)
    );
    setResults(filteredMovies);
  }, [query, allMovies]);

  const handleCardClick = (movie: Movie) => {
    onCardClick(movie);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 bg-black/80 backdrop-blur-md z-[60] flex flex-col items-center p-4 pt-16 md:pt-24 fade-in"
      onClick={onClose}
    >
      <div className="w-full max-w-4xl h-full" onClick={e => e.stopPropagation()}>
        <div className="relative mb-8">
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search for movies, TV shows..."
            className="w-full bg-zinc-800/50 border-2 border-zinc-700 text-white placeholder-zinc-500 rounded-full py-4 px-6 text-xl focus:outline-none focus:border-red-600 transition-colors"
          />
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 absolute right-6 top-1/2 -translate-y-1/2 text-zinc-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        <button onClick={onClose} className="absolute top-6 right-6 text-white/70 hover:text-white transition-colors">
           <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
        </button>

        <div className="overflow-y-auto max-h-[calc(100vh-150px)] hide-scrollbar pb-8">
          {results.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {results.map(movie => {
                const isInMyList = !!myList.find(m => m.id === movie.id);
                return (
                  <MovieCard 
                    key={movie.id} 
                    movie={movie} 
                    onCardClick={handleCardClick} 
                    layout="grid"
                    user={user}
                    onEditClick={onEditClick}
                    onDeleteClick={onDeleteClick}
                    onToggleMyList={onToggleMyList}
                    isInMyList={isInMyList}
                  />
                );
              })}
            </div>
          ) : (
            query.trim() !== '' && (
              <div className="text-center py-16">
                <p className="text-zinc-400 text-lg">No results found for "{query}"</p>
              </div>
            )
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchOverlay;