import React from 'react';
import { Movie } from '../types';

interface ConfirmationModalProps {
  movie: Movie;
  onConfirm: () => void;
  onCancel: () => void;
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({ movie, onConfirm, onCancel }) => {
  return (
    <div className="fixed inset-0 bg-black/80 z-[100] flex items-center justify-center p-4 fade-in" onClick={onCancel}>
      <div 
        className="glass-card w-full max-w-md p-8 rounded-2xl text-center"
        onClick={(e) => e.stopPropagation()}
      >
        <img src={movie.posterUrl} alt={movie.title} className="w-24 h-36 object-cover rounded-lg shadow-lg mx-auto mb-6" />

        <h2 className="text-2xl font-bold text-white mb-2">Permanently delete this movie?</h2>
        <p className="text-lg text-white font-semibold mb-4">"{movie.title}"</p>
        <p className="text-zinc-400 mb-8">
            This action cannot be undone. All data associated with this movie will be removed.
        </p>

        <div className="flex justify-center space-x-4">
            <button
                onClick={onCancel}
                className="w-full bg-zinc-700 text-white font-bold py-3 rounded-lg hover:bg-zinc-600 transition-colors"
            >
                Cancel
            </button>
            <button
                onClick={onConfirm}
                className="w-full bg-red-600 text-white font-bold py-3 rounded-lg hover:bg-red-700 transition-colors"
            >
                Delete
            </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;
