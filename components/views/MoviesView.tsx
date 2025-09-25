import React from 'react';
import { Movie, User } from '../../types';
import MovieCard from '../MovieCard';

interface MoviesViewProps {
  allMovies: Movie[];
  onCardClick: (movie: Movie) => void;
  user: User | null;
  myList: Movie[];
  onToggleMyList: (movie: Movie) => void;
  onEditClick: (movie: Movie) => void;
  onDeleteClick: (movie: Movie) => void;
}

const MoviesView: React.FC<MoviesViewProps> = ({ allMovies, onCardClick, user, myList, onToggleMyList, onEditClick, onDeleteClick }) => {
  return (
    <div className="px-8 md:px-16 py-8">
      <h1 className="text-4xl md:text-5xl font-black text-center mb-12">All Movies</h1>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-x-8 gap-y-12">
        {allMovies.map(movie => {
          const isInMyList = !!myList.find(m => m.id === movie.id);
          return (
            <MovieCard 
              key={movie.id} 
              movie={movie} 
              onCardClick={onCardClick} 
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
    </div>
  );
};

export default MoviesView;