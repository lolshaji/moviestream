import React from 'react';
import { Movie, User } from '../../types';
import MovieCard from '../MovieCard';

interface StorageDeviceCardProps {
    title: string;
    spaceUsed: string;
    totalSpace: string;
    isSelected: boolean;
    isSelectable: boolean;
    onClick?: () => void;
}

const StorageDeviceCard: React.FC<StorageDeviceCardProps> = ({ title, spaceUsed, totalSpace, isSelected, isSelectable, onClick }) => {
    return (
        <div 
            onClick={onClick}
            className={`relative glass-card p-6 rounded-2xl border-2 transition-all duration-300 ${isSelected ? 'border-orange-500 shadow-[0_0_25px_rgba(234,88,12,0.3)]' : 'border-transparent'} ${isSelectable ? 'cursor-pointer hover:border-zinc-700' : ''}`}
        >
            <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-zinc-800 rounded-lg flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 19a2 2 0 01-2-2V7a2 2 0 012-2h4l2 2h4a2 2 0 012 2v1M5 19h14a2 2 0 002-2v-5a2 2 0 00-2-2H9a2 2 0 00-2 2v5a2 2 0 01-2 2z" />
                    </svg>
                </div>
                <div>
                    <h3 className="font-bold text-lg text-white">{title}</h3>
                    <p className="text-sm text-zinc-400">{spaceUsed} / {totalSpace} GB</p>
                </div>
            </div>
            {isSelectable && (
                <div className="absolute top-4 right-4 w-4 h-4 rounded-full bg-zinc-800 border-2 border-zinc-600 flex items-center justify-center">
                    {isSelected && <div className="w-2 h-2 rounded-full bg-orange-500 shadow-[0_0_8px_theme(colors.orange.500)]"></div>}
                </div>
            )}
        </div>
    );
};

interface OngoingDownloadItemProps {
    item: {
        movie: Movie;
        progress: number;
    }
}

const OngoingDownloadItem: React.FC<OngoingDownloadItemProps> = ({ item }) => (
    <div className="flex items-center space-x-4 glass-card p-3 rounded-lg">
        <img src={item.movie.posterUrl} alt={item.movie.title} className="w-12 h-16 object-cover rounded" />
        <div className="flex-grow">
            <p className="font-semibold text-white truncate">{item.movie.title}</p>
            <div className="w-full bg-zinc-700 rounded-full h-1.5 mt-2">
                <div className="bg-blue-500 h-1.5 rounded-full" style={{ width: `${item.progress}%` }}></div>
            </div>
            <p className="text-xs text-zinc-400 mt-1">{Math.round(item.progress)}% complete</p>
        </div>
    </div>
);


interface DownloadsViewProps {
  downloadingMovies: { movie: Movie; progress: number }[];
  downloadedMovies: Movie[];
  downloadStorage: 'internal' | 'sdCard';
  onSetDownloadStorage: (storage: 'internal' | 'sdCard') => void;
  isMobile: boolean;
  hasSdCard: boolean;
  onCardClick: (movie: Movie) => void;
  user: User | null;
  myList: Movie[];
  onToggleMyList: (movie: Movie) => void;
  onEditClick: (movie: Movie) => void;
  onDeleteClick: (movie: Movie) => void;
}

const DownloadsView: React.FC<DownloadsViewProps> = (props) => {
  const { downloadingMovies, downloadedMovies, downloadStorage, onSetDownloadStorage, isMobile, hasSdCard, ...cardProps } = props;

  return (
    <div className="container mx-auto px-4 md:px-6 py-8 space-y-12">
      <div>
        <h1 className="text-4xl font-black mb-2 text-center md:text-left">Downloads</h1>
        <p className="text-zinc-400 text-center md:text-left">Manage your offline content and storage.</p>
      </div>
      
      {/* Storage Manager */}
      <div>
        <h2 className="text-2xl font-bold mb-4">Download Location</h2>
        {isMobile ? (
            <div className={`grid gap-6 ${hasSdCard ? 'grid-cols-1 md:grid-cols-2' : 'grid-cols-1'}`}>
                <StorageDeviceCard 
                    title="Internal Storage" 
                    spaceUsed="45.2" 
                    totalSpace="128" 
                    isSelected={downloadStorage === 'internal'} 
                    isSelectable={true}
                    onClick={() => onSetDownloadStorage('internal')}
                />
                {hasSdCard && (
                     <StorageDeviceCard 
                        title="SD Card" 
                        spaceUsed="12.1" 
                        totalSpace="64" 
                        isSelected={downloadStorage === 'sdCard'} 
                        isSelectable={true}
                        onClick={() => onSetDownloadStorage('sdCard')}
                    />
                )}
            </div>
        ) : (
             <StorageDeviceCard 
                title="Computer Storage" 
                spaceUsed="78.5" 
                totalSpace="512" 
                isSelected={true} 
                isSelectable={false}
            />
        )}
      </div>

      {/* Ongoing Downloads */}
      {downloadingMovies.length > 0 && (
          <div>
              <h2 className="text-2xl font-bold mb-4">Ongoing Downloads</h2>
              <div className="space-y-4">
                  {downloadingMovies.map(item => <OngoingDownloadItem key={item.movie.id} item={item}/>)}
              </div>
          </div>
      )}

      {/* Completed Downloads */}
      <div>
        <h2 className="text-2xl font-bold mb-6">Downloaded Movies</h2>
          {downloadedMovies.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
              {downloadedMovies.map(movie => {
                const isInMyList = !!props.myList.find(m => m.id === movie.id);
                return (
                  <MovieCard 
                    key={movie.id} 
                    movie={movie} 
                    isInMyList={isInMyList}
                    {...cardProps}
                  />
                );
              })}
            </div>
          ) : (
            <div className="text-center py-16 bg-black/20 rounded-lg">
                <p className="text-zinc-400 text-lg">Your downloaded movies will appear here.</p>
                <p className="text-zinc-500 mt-2">Find a movie and tap the download icon to get started.</p>
            </div>
          )}
      </div>
    </div>
  );
};

export default DownloadsView;