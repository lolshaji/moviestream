import React from 'react';
import { Movie } from '../../types';

type UploadStatus = 'idle' | 'uploading' | 'processing' | 'finalizing' | 'complete';

interface UploadProgressViewProps {
  status: UploadStatus;
  percentage: number;
  movie: Movie;
  onComplete: () => void;
  onCancel: () => void;
}

// --- ICONS ---
const UploadIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M12 15l-4-4m0 0l4-4m-4 4h12" /></svg>;
const ProcessingIcon = () => <svg className="animate-spin h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>;
const CompleteIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>;


const StatusIndicator: React.FC<{ title: string; status: 'active' | 'pending' | 'complete' }> = ({ title, status }) => {
    const statusClasses = {
        active: 'text-white border-red-500',
        pending: 'text-zinc-500 border-zinc-700',
        complete: 'text-green-400 border-green-500',
    };

    const iconMap = {
        'Uploading': <UploadIcon />,
        'Processing': <ProcessingIcon />,
        'Complete': <CompleteIcon />,
    };

    const getIcon = () => {
        if (status === 'complete') return <CompleteIcon />;
        if (status === 'active' && title === 'Processing') return <ProcessingIcon />;
        if (status === 'active' && title === 'Uploading') return <UploadIcon />;
        return iconMap[title as keyof typeof iconMap] ?? null;
    }
    
    return (
        <div className="flex flex-col items-center space-y-2">
            <div className={`w-12 h-12 rounded-full border-2 flex items-center justify-center transition-all duration-300 ${statusClasses[status]}`}>
               {getIcon()}
            </div>
            <p className={`text-xs font-semibold transition-colors duration-300 ${status === 'pending' ? 'text-zinc-500' : 'text-white'}`}>{title}</p>
        </div>
    );
};

const UploadProgressView: React.FC<UploadProgressViewProps> = ({ status, percentage, movie, onComplete, onCancel }) => {
    
    const getStatusText = () => {
        switch (status) {
            case 'uploading':
                return `Uploading to your drive... ${Math.round(percentage)}%`;
            case 'processing':
                return 'Processing video, optimizing for streaming...';
            case 'finalizing':
                return 'Almost there, finalizing details...';
            case 'complete':
                return 'Upload complete! Your movie is now available.';
            default:
                return 'Preparing to upload...';
        }
    };
    
    const isUploading = status === 'uploading';
    const isProcessing = status === 'processing';
    const isFinalizing = status === 'finalizing';
    const isComplete = status === 'complete';

    return (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-[100] flex items-center justify-center p-4 fade-in">
            <div className="w-full max-w-2xl glass-card p-8 rounded-2xl">
                <div className="flex items-start space-x-6 mb-8">
                    <img src={movie.posterUrl} alt={movie.title} className="w-24 h-36 object-cover rounded-lg shadow-lg" />
                    <div>
                        <p className="text-zinc-400 text-sm">Now adding to Thelden</p>
                        <h1 className="text-3xl font-bold text-white mt-1">{movie.title}</h1>
                    </div>
                </div>

                <div className="flex justify-between items-center mb-8 px-4">
                    <StatusIndicator title="Uploading" status={isUploading ? 'active' : 'complete'} />
                    <div className={`flex-grow h-0.5 mx-4 ${isProcessing || isFinalizing || isComplete ? 'bg-green-500' : 'bg-zinc-700'}`}></div>
                    <StatusIndicator title="Processing" status={isProcessing || isFinalizing ? 'active' : isComplete ? 'complete' : 'pending'} />
                    <div className={`flex-grow h-0.5 mx-4 ${isComplete ? 'bg-green-500' : 'bg-zinc-700'}`}></div>
                    <StatusIndicator title="Complete" status={isComplete ? 'complete' : 'pending'} />
                </div>
                
                <div className="space-y-4">
                     <p className="text-center text-zinc-300 h-6">{getStatusText()}</p>
                     <div className="w-full bg-zinc-700 rounded-full h-2.5">
                        <div 
                            className={`rounded-full h-2.5 transition-all duration-300 ${isComplete ? 'bg-green-500' : 'bg-red-600'}`} 
                            style={{ width: `${isComplete ? 100 : percentage}%` }}>
                        </div>
                    </div>
                </div>

                <div className="mt-8 flex justify-end space-x-4">
                    {!isComplete && (
                        <button onClick={onCancel} className="bg-zinc-700 text-white font-bold py-2 px-6 rounded-md hover:bg-zinc-600 transition-colors">
                            Cancel
                        </button>
                    )}
                    {isComplete && (
                         <button onClick={onComplete} className="bg-red-600 text-white font-bold py-2 px-6 rounded-md hover:bg-red-700 transition-colors">
                            Finish
                        </button>
                    )}
                </div>

            </div>
        </div>
    );
};

export default UploadProgressView;
