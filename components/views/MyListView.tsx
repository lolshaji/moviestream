import React from 'react';
import { Movie, User } from '../../types';
import MovieCard from '../MovieCard';

const WatchedIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
    </svg>
);

const StarIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
    </svg>
);

interface MyListViewProps {
  myList: Movie[];
  watchedList: Movie[];
  onCardClick: (movie: Movie) => void;
  user: User | null;
  onToggleMyList: (movie: Movie) => void;
  onEditClick: (movie: Movie) => void;
  onDeleteClick: (movie: Movie) => void;
}

const MyListView: React.FC<MyListViewProps> = ({ myList, watchedList, onCardClick, user, onToggleMyList, onEditClick, onDeleteClick }) => {
  return (
    <div className="container mx-auto px-4 md:px-6 py-8">
      <div className="my-list-glass-card p-8 md:p-12">
        
        {/* New Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            {/* Movies Watched Card */}
            <div className="glass-card p-6 flex items-center space-x-6">
                <WatchedIcon />
                <div>
                    <p className="text-zinc-400 text-sm">Movies Watched</p>
                    <p className="text-4xl font-bold text-white">{watchedList.length}</p>
                </div>
            </div>

            {/* Rating Card */}
            <div className="glass-card p-6 flex items-center space-x-6">
                <StarIcon />
                <div>
                    <p className="text-zinc-400 text-sm">Your Rating</p>
                    <p className="text-2xl font-bold text-white">Not Rated</p>
                </div>
            </div>
        </div>
        
        {/* My List Section */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold mb-6">My List</h2>
          {myList.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
              {myList.map(movie => (
                <MovieCard 
                  key={movie.id} 
                  movie={movie} 
                  onCardClick={onCardClick}
                  user={user}
                  onEditClick={onEditClick}
                  onDeleteClick={onDeleteClick}
                  onToggleMyList={onToggleMyList}
                  isInMyList={true}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-8 bg-black/20 rounded-lg">
                <p className="text-zinc-400">You haven't added any movies to your list yet.</p>
            </div>
          )}
        </div>

        {/* Recently Watched Section */}
        <div>
          <h2 className="text-3xl font-bold mb-6">Recently Watched</h2>
          {watchedList.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
              {watchedList.map(movie => {
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
          ) : (
             <div className="text-center py-8 bg-black/20 rounded-lg">
                <p className="text-zinc-400">You haven't watched any movies recently.</p>
             </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MyListView;