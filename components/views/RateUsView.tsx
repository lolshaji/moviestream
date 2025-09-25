import React, { useState } from 'react';

interface StarIconProps {
    filled: boolean;
    onClick: () => void;
    onMouseEnter: () => void;
    onMouseLeave: () => void;
}

const StarIcon: React.FC<StarIconProps> = ({ filled, onClick, onMouseEnter, onMouseLeave }) => (
    <svg 
        className={`w-10 h-10 cursor-pointer ${filled ? 'text-yellow-400' : 'text-gray-600'} hover:text-yellow-300`}
        fill="currentColor" 
        viewBox="0 0 20 20" 
        xmlns="http://www.w3.org/2000/svg"
        onClick={onClick}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
    >
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
    </svg>
);

interface RateUsViewProps {
    onRateSubmit: () => void;
}

const RateUsView: React.FC<RateUsViewProps> = ({ onRateSubmit }) => {
    const [rating, setRating] = useState(0);
    const [hoverRating, setHoverRating] = useState(0);
    const [feedback, setFeedback] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (rating === 0) return;
        console.log({ rating, feedback });
        onRateSubmit();
    };

    return (
        <div className="container mx-auto px-6 py-8 flex justify-center">
            <div className="w-full max-w-2xl">
                <h1 className="text-4xl font-bold mb-4 text-center">Rate Your Experience</h1>
                <p className="text-zinc-400 mb-8 text-center">We'd love to hear what you think about Thelden.</p>

                <form onSubmit={handleSubmit} className="glass-card p-8 space-y-8">
                    <div className="flex justify-center star-rating space-x-2">
                        {[1, 2, 3, 4, 5].map((star) => (
                            <StarIcon 
                                key={star}
                                filled={star <= (hoverRating || rating)}
                                onClick={() => setRating(star)}
                                onMouseEnter={() => setHoverRating(star)}
                                onMouseLeave={() => setHoverRating(0)}
                            />
                        ))}
                    </div>

                    <div>
                        <label htmlFor="feedback" className="block text-sm font-medium text-zinc-300 mb-2">Share your feedback (optional)</label>
                        <textarea
                            id="feedback"
                            value={feedback}
                            onChange={(e) => setFeedback(e.target.value)}
                            rows={5}
                            className="w-full bg-zinc-800 border border-zinc-700 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-red-600"
                            placeholder="What did you like or dislike? Any suggestions?"
                        />
                    </div>
                    
                    <button
                        type="submit"
                        disabled={rating === 0}
                        className="w-full bg-red-600 text-white font-bold py-3 rounded-md hover:bg-red-700 transition-colors disabled:bg-zinc-700 disabled:cursor-not-allowed"
                    >
                        Submit Feedback
                    </button>
                </form>
            </div>
        </div>
    );
};

export default RateUsView;