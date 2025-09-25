import React, { useState, useEffect } from 'react';
import { Movie, User } from '../../types';
import MovieCarousel from '../MovieCarousel';

interface HomeViewProps {
  carousels: { title: string; movies: Movie[] }[];
  recentlyViewed: Movie[];
  onCardClick: (movie: Movie) => void;
  user: User | null;
  myList: Movie[];
  onToggleMyList: (movie: Movie) => void;
  onEditClick: (movie: Movie) => void;
  onDeleteClick: (movie: Movie) => void;
}

const HomeView: React.FC<HomeViewProps> = ({ carousels, recentlyViewed, onCardClick, user, myList, onToggleMyList, onEditClick, onDeleteClick }) => {
  const [heroIndex, setHeroIndex] = useState(0);
  const [outgoingIndex, setOutgoingIndex] = useState<number | null>(null);
  const popularMovies = carousels.find(c => c.title === 'Popular on Thelden')?.movies || [];

  useEffect(() => {
    if (popularMovies.length > 1) {
      const timer = setInterval(() => {
        setOutgoingIndex(heroIndex);
        const nextIndex = (heroIndex + 1) % popularMovies.length;
        setHeroIndex(nextIndex);
        setTimeout(() => setOutgoingIndex(null), 1000); // Duration of fade-out
      }, 10000); // Change movie every 10 seconds
      return () => clearInterval(timer);
    }
  }, [popularMovies.length, heroIndex]);

  const getOpacity = (index: number) => {
    if (index === heroIndex) return 'opacity-100';
    if (index === outgoingIndex) return 'opacity-0';
    return 'opacity-0';
  }

  return (
    <div className="space-y-16">
      {popularMovies.length > 0 && (
        <div className="relative h-[80vh] -mt-24">
          {popularMovies.map((movie, index) => (
            <div
              key={movie.id}
              className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${getOpacity(index)}`}
            >
              <img src={movie.backdropUrl} alt={movie.title} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent"></div>
              <div className={`absolute bottom-1/4 left-8 md:left-16 text-white max-w-2xl transition-all duration-1000 ${index === heroIndex ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'}`}>
                  <h1
                    data-text={movie.title}
                    className="text-4xl md:text-6xl font-black text-draw-animation mb-4 hero-title-font"
                  >
                    {movie.title}
                  </h1>
                  <p className="text-base md:text-lg mb-6 line-clamp-3">{movie.description}</p>
                  <div className="flex space-x-4">
                    <button
                      onClick={() => onCardClick(movie)}
                      className="bg-white text-black font-bold py-2 px-6 rounded flex items-center space-x-2 hover:bg-gray-200 transition-transform hover:scale-105"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>
                      <span>Play</span>
                    </button>
                    <button
                      onClick={() => onCardClick(movie)}
                      className="bg-gray-500/70 text-white font-bold py-2 px-6 rounded flex items-center space-x-2 hover:bg-gray-500 transition-transform hover:scale-105"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span>More Info</span>
                    </button>
                  </div>
              </div>
            </div>
          ))}
        </div>
      )}
      <div className="px-8 md:px-16 space-y-12 pb-16">
        {recentlyViewed.length > 0 && (
          <MovieCarousel
            title="Recently Viewed"
            movies={recentlyViewed}
            onCardClick={onCardClick}
            user={user}
            myList={myList}
            onToggleMyList={onToggleMyList}
            onEditClick={onEditClick}
            onDeleteClick={onDeleteClick}
          />
        )}
        {carousels.map((carousel) => (
          <MovieCarousel
            key={carousel.title}
            title={carousel.title}
            movies={carousel.movies}
            onCardClick={onCardClick}
            user={user}
            myList={myList}
            onToggleMyList={onToggleMyList}
            onEditClick={onEditClick}
            onDeleteClick={onDeleteClick}
          />
        ))}
      </div>
    </div>
  );
};

export default HomeView;