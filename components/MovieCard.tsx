import React, { useState } from 'react';
import { Movie, User } from '../types';

interface MovieCardProps {
  movie: Movie;
  onCardClick: (movie: Movie) => void;
  layout?: 'carousel' | 'grid';
  user?: User | null;
  onEditClick?: (movie: Movie) => void;
  onDeleteClick?: (movie: Movie) => void;
  onToggleMyList?: (movie: Movie) => void;
  isInMyList?: boolean;
}

const LikeIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
    </svg>
);

const PlayIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="currentColor">
        <path d="M8 5v14l11-7z"/>
    </svg>
);

const PencilIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 20 20" fill="currentColor">
        <path d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z" />
        <path fillRule="evenodd" d="M2 6a2 2 0 012-2h4a1 1 0 010 2H4v10h10v-4a1 1 0 112 0v4a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" clipRule="evenodd" />
    </svg>
);

const TrashIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm4 0a1 1 0 012 0v6a1 1 0 11-2 0V8z" clipRule="evenodd" />
    </svg>
);


const MovieCard: React.FC<MovieCardProps> = ({ movie, onCardClick, layout = 'carousel', user, onEditClick, onDeleteClick, onToggleMyList, isInMyList = false }) => {
  const { hours, minutes, seconds } = movie.duration;
  const [isAnimating, setIsAnimating] = useState(false);

  const layoutClasses = layout === 'carousel'
    ? 'flex-shrink-0 w-48 md:w-64'
    : 'w-full aspect-[2/3]';
    
  const handleLikeClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onToggleMyList) {
        onToggleMyList(movie);
        if (!isInMyList) { // Animate only when liking
            setIsAnimating(true);
            setTimeout(() => setIsAnimating(false), 300);
        }
    }
  };

  const handleEditClick = (e: React.MouseEvent) => {
      e.stopPropagation();
      if (onEditClick) {
          onEditClick(movie);
      }
  };
  
  const handleDeleteClick = (e: React.MouseEvent) => {
      e.stopPropagation();
      if (onDeleteClick) {
          onDeleteClick(movie);
      }
  };

  return (
    <div
      className={`group relative h-auto rounded-lg overflow-hidden shadow-lg cursor-pointer transform transition-all duration-300 ease-in-out hover:scale-110 hover:z-10 ${layoutClasses}`}
      onClick={() => onCardClick(movie)}
    >
      <img src={movie.posterUrl} alt={movie.title} className="w-full h-full object-cover" />
      
      {user?.role === 'admin' && (onEditClick || onDeleteClick) && (
        <div className="absolute top-2 right-2 flex flex-col space-y-2 z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
             {onEditClick && (
                <button
                    onClick={handleEditClick}
                    className="w-8 h-8 bg-black/60 rounded-full flex items-center justify-center text-white hover:bg-blue-600 transition-colors"
                    aria-label="Edit Movie"
                >
                    <PencilIcon className="w-4 h-4" />
                </button>
            )}
            {onDeleteClick && (
                 <button
                    onClick={handleDeleteClick}
                    className="w-8 h-8 bg-black/60 rounded-full flex items-center justify-center text-white hover:bg-red-600 transition-colors"
                    aria-label="Delete Movie"
                >
                    <TrashIcon className="w-4 h-4" />
                </button>
            )}
        </div>
      )}

      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-between p-4">
        <div>
            <h3 className="text-white text-lg font-bold">{movie.title}</h3>
        </div>
        <div className="space-y-2">
            <div className="flex items-center justify-between">
                <button className="w-10 h-10 bg-white text-black rounded-full flex items-center justify-center hover:bg-gray-200 transition-colors">
                    <PlayIcon className="w-6 h-6" />
                </button>
                 <button 
                    onClick={handleLikeClick}
                    className={`w-10 h-10 border-2 rounded-full flex items-center justify-center transition-all duration-200 ${
                        isInMyList ? 'border-red-500 text-red-500' : 'border-white/50 text-white/70 hover:border-white hover:text-white'
                    } ${isAnimating ? 'transform scale-125' : ''}`}
                    aria-label="Toggle My List"
                 >
                    <LikeIcon className="w-5 h-5" />
                </button>
            </div>
            <div className="text-xs text-gray-300 space-y-1">
                <p>{`${hours}h ${minutes}m ${seconds}s`}</p>
            </div>
        </div>
      </div>
    </div>
  );
};

export default MovieCard;