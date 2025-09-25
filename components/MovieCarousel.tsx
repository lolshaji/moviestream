import React from 'react';
import { Movie, User } from '../types';
import MovieCard from './MovieCard';

interface MovieCarouselProps {
  title: string;
  movies: Movie[];
  onCardClick: (movie: Movie) => void;
  user: User | null;
  myList: Movie[];
  onToggleMyList: (movie: Movie) => void;
  onEditClick: (movie: Movie) => void;
  onDeleteClick: (movie: Movie) => void;
}

const MovieCarousel: React.FC<MovieCarouselProps> = ({ title, movies, onCardClick, user, myList, onToggleMyList, onEditClick, onDeleteClick }) => {
  return (
    <div>
      <h2 className="text-xl md:text-2xl font-bold mb-4 text-white">{title}</h2>
      {/* Use a negative margin wrapper to break out of the parent's padding constraints.
          This allows the scrollable area to extend into the padded area, providing room for the
          first and last cards to scale on hover without being clipped horizontally. */}
      <div className="-mx-8 md:-mx-16">
        {/* The scrollable container itself has padding to align the content correctly
            and provide the needed space for the hover effect at the edges.
            Increased vertical padding (py-8) ensures cards don't get clipped top/bottom. */}
        <div className="flex overflow-x-scroll py-8 space-x-4 hide-scrollbar px-8 md:px-16">
          {movies.map((movie) => {
            const isInMyList = !!myList.find(m => m.id === movie.id);
            return (
              <MovieCard 
                key={movie.id} 
                movie={movie} 
                onCardClick={onCardClick}
                user={user}
                onEditClick={onEditClick}
                onDeleteClick={onDeleteClick}
                onToggleMyList={onToggleMyList}
                isInMyList={isInMyList}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default MovieCarousel;