import React, { useState } from 'react';

const RequestMovieView: React.FC = () => {
  const [movieTitle, setMovieTitle] = useState('');
  const [notes, setNotes] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [response, setResponse] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!movieTitle) {
      setError('Please enter a movie title.');
      return;
    }
    
    setIsLoading(true);
    setError('');
    setResponse('');

    // Simulate API call and show a confirmation message
    setTimeout(() => {
      setResponse(`Thank you for requesting "${movieTitle}"! Our team has received your submission and will look into adding it to the Thelden library. Happy watching!`);
      setMovieTitle('');
      setNotes('');
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className="container mx-auto px-6 py-8 flex justify-center">
      <div className="w-full max-w-2xl">
        <h1 className="text-4xl font-bold mb-4 text-center">Request a Movie</h1>
        <p className="text-zinc-400 mb-8 text-center">Can't find what you're looking for? Let us know!</p>
        
        <form onSubmit={handleSubmit} className="glass-card p-8 space-y-6">
          <div>
            <label htmlFor="movieTitle" className="block text-sm font-medium text-zinc-300 mb-2">Movie Title</label>
            <input
              type="text"
              id="movieTitle"
              value={movieTitle}
              onChange={(e) => setMovieTitle(e.target.value)}
              className="w-full bg-zinc-800 border border-zinc-700 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-red-600"
              required
            />
          </div>
          <div>
            <label htmlFor="notes" className="block text-sm font-medium text-zinc-300 mb-2">Additional Notes (optional)</label>
            <textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={4}
              className="w-full bg-zinc-800 border border-zinc-700 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-red-600"
              placeholder="e.g., specific director, year, or version"
            />
          </div>
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-red-600 text-white font-bold py-3 rounded-md hover:bg-red-700 transition-colors disabled:bg-red-900 disabled:cursor-not-allowed flex items-center justify-center"
          >
            {isLoading ? (
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            ) : 'Send Request'}
          </button>
        </form>

        {error && <p className="text-red-500 mt-4 text-center">{error}</p>}
        {response && (
            <div className="mt-8 p-6 bg-zinc-800/50 border border-zinc-700 rounded-lg text-center fade-in">
                <p className="text-lg">{response}</p>
            </div>
        )}
      </div>
    </div>
  );
};

export default RequestMovieView;