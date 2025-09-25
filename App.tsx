import React, { useState, useEffect, useMemo } from 'react';
import { Movie, Tab, User, Message } from './types';
import { generateMovies } from './constants';
import SplashScreen from './components/SplashScreen';
import MovieModal from './components/MovieModal';
import VideoPlayer from './components/VideoPlayer';
import SearchOverlay from './components/SearchOverlay';
import AuthView from './components/AuthView';
import BottomNavBar from './components/BottomNavBar';
import Header from './components/Header';
import ConfirmationModal from './components/ConfirmationModal';

// Import View Components
import HomeView from './components/views/HomeView';
import MoviesView from './components/views/MoviesView';
import MyListView from './components/views/MyListView';
import RequestMovieView from './components/views/RequestMovieView';
import RateUsView from './components/views/RateUsView';
import AdminView from './components/views/AdminView';
import UploadProgressView from './components/views/UploadProgressView';
import ProfileView from './components/views/ProfileView';
import ChatView from './components/views/ChatView';
import DownloadsView from './components/views/DownloadsView';

type AppState = 'initialSplash' | 'auth' | 'mainApp';
type UploadStatus = 'idle' | 'uploading' | 'processing' | 'finalizing' | 'complete';

interface UploadProgress {
  status: UploadStatus;
  percentage: number;
  movie: Movie | null;
  category: string;
}

const ADMIN_EMAILS = ['ayahakuttyv@gmail.com', 'ktmuhammedrayyan@gmail.com'];
const INITIAL_CHAT_MESSAGES: Message[] = [
    { id: 1, text: "Welcome to Thelden! How can I help you today?", sender: 'them', timestamp: '10:30 AM' },
    { id: 2, text: "You can ask me about movies, your account, or report any issues.", sender: 'them', timestamp: '10:31 AM' },
];

const App: React.FC = () => {
  const [appState, setAppState] = useState<AppState>('initialSplash');
  const [user, setUser] = useState<User | null>(null);
  
  // State now uses local mock data
  const [allMovies, setAllMovies] = useState<Movie[]>([]);
  const [categories, setCategories] = useState<{ id: string; title: string; order: number }[]>([]);

  const movieCarousels = useMemo(() => {
    return categories.map(category => ({
      title: category.title,
      movies: allMovies.filter(movie => movie.category === category.title)
    })).filter(c => c.movies.length > 0);
  }, [categories, allMovies]);

  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [activeTab, setActiveTab] = useState<Tab>('Home');
  const [showSearch, setShowSearch] = useState(false);
  const [recentlyViewed, setRecentlyViewed] = useState<Movie[]>([]);
  const [myList, setMyList] = useState<Movie[]>([]);
  const [movieToEdit, setMovieToEdit] = useState<Movie | null>(null);
  const [chatHistories, setChatHistories] = useState<Record<string, Message[]>>({});
  const [movieToDelete, setMovieToDelete] = useState<Movie | null>(null);
  const [hasRated, setHasRated] = useState(false);

  // --- Downloads State ---
  const [downloadingMovies, setDownloadingMovies] = useState<Record<string, { movie: Movie; progress: number }>>({});
  const [downloadedMovies, setDownloadedMovies] = useState<Movie[]>([]);
  const [downloadStorage, setDownloadStorage] = useState<'internal' | 'sdCard'>('internal');
  const [isMobile, setIsMobile] = useState(false);
  const [hasSdCard, setHasSdCard] = useState(true); // Simulate user having an SD card

  const [uploadProgress, setUploadProgress] = useState<UploadProgress>({ status: 'idle', percentage: 0, movie: null, category: '' });

  useEffect(() => {
    // Detect if user is on a mobile device
    const isMobileDevice = /Mobi|Android|iPhone/i.test(navigator.userAgent);
    setIsMobile(isMobileDevice);

    // This effect runs once on mount to handle the initial splash screen and auth state.
    const splashTimer = setTimeout(() => {
      try {
        const storedUserJSON = localStorage.getItem('thelden-user');
        if (storedUserJSON) {
          const storedUser: User = JSON.parse(storedUserJSON);
          setUser(storedUser);

          // Initialize chat history for the user if it doesn't exist
          setChatHistories(prev => {
              if (prev[storedUser.email]) return prev;
              return { ...prev, [storedUser.email]: INITIAL_CHAT_MESSAGES };
          });
          
          setAppState('mainApp');
        } else {
          setAppState('auth');
        }
      } catch (error) {
        console.error("Failed to parse user from localStorage", error);
        // If parsing fails, clear it and default to auth state
        localStorage.removeItem('thelden-user');
        setAppState('auth');
      }
    }, 2000); // Display splash screen for 2 seconds

    return () => clearTimeout(splashTimer);
  }, []); // Empty dependency array ensures this runs only once on initial mount

  // --- Initialize with mock data ---
  useEffect(() => {
    const initialCategories = [
        { id: 'cat-1', title: 'Popular on Thelden', order: 1 },
        { id: 'cat-2', title: 'New Movies', order: 2 },
        { id: 'cat-3', title: 'TV Shows', order: 3 },
        { id: 'cat-4', title: 'Vintage', order: 4 },
    ];
    setCategories(initialCategories);

    const moviesFromAllCategories = initialCategories.flatMap(category => 
        generateMovies(category.title, 10)
    );
    setAllMovies(moviesFromAllCategories);
  }, []); // Runs once on mount


  // Effect to simulate the upload process
  useEffect(() => {
    let interval: number | undefined;
    let timer: number | undefined;

    if (uploadProgress.status === 'uploading') {
      interval = window.setInterval(() => {
        setUploadProgress(prev => {
          const newPercentage = prev.percentage + Math.random() * 5;
          if (newPercentage >= 100) {
            clearInterval(interval);
            timer = window.setTimeout(() => setUploadProgress(p => ({ ...p, status: 'processing', percentage: 100 })), 500);
            return { ...prev, percentage: 100 };
          }
          return { ...prev, percentage: newPercentage };
        });
      }, 80);
    } else if (uploadProgress.status === 'processing') {
      timer = window.setTimeout(() => {
        setUploadProgress(p => ({ ...p, status: 'finalizing' }));
      }, 2500); // Simulate processing time
    } else if (uploadProgress.status === 'finalizing') {
      timer = window.setTimeout(() => {
        setUploadProgress(p => ({ ...p, status: 'complete' }));
      }, 1500); // Simulate finalizing time
    }

    return () => {
      clearInterval(interval);
      clearTimeout(timer);
    };
  }, [uploadProgress.status]);
  
  const handleAuthSuccess = (email: string) => {
    const normalizedEmail = email.toLowerCase();
    const userRole = ADMIN_EMAILS.includes(normalizedEmail) ? 'admin' : 'user';
    const initialName = email.split('@')[0].replace(/[^a-zA-Z0-9]/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
    
    const newUser: User = {
      email,
      role: userRole,
      name: initialName,
      profilePicUrl: `https://picsum.photos/seed/${encodeURIComponent(email)}/128/128`,
    };
    
    setUser(newUser);
    localStorage.setItem('thelden-user', JSON.stringify(newUser));
    
    // Initialize chat history for the user if it doesn't exist
    setChatHistories(prev => {
      if (prev[email]) return prev;
      return { ...prev, [email]: INITIAL_CHAT_MESSAGES };
    });

    setAppState('mainApp');
  };
  
  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('thelden-user');
    setActiveTab('Home');
    setAppState('auth');
  }

  const handleSelectMovie = (movie: Movie) => {
    setSelectedMovie(movie);
  };

  const handleCloseModal = () => {
    setSelectedMovie(null);
  };
  
  const handleProfileUpdate = (updatedName: string, updatedPicUrl: string) => {
    if (!user) return;
    const updatedUser = {
        ...user,
        name: updatedName,
        profilePicUrl: updatedPicUrl,
    };
    setUser(updatedUser);
    localStorage.setItem('thelden-user', JSON.stringify(updatedUser));
    alert('Profile updated!');
  };

  const handlePlay = () => {
    if (selectedMovie) {
      setRecentlyViewed(prev => {
        const isAlreadyViewed = prev.find(m => m.id === selectedMovie.id);
        if (isAlreadyViewed) return prev;
        const movieWithProgress = { ...selectedMovie, watchPercentage: Math.floor(Math.random() * 80) + 10 };
        return [movieWithProgress, ...prev].slice(0, 10);
      });
      setIsPlaying(true);
    }
  };

  const handleClosePlayer = () => {
    setIsPlaying(false);
    setSelectedMovie(null);
  };

  const handleToggleMyList = (movie: Movie) => {
    setMyList(prev => {
      const isInList = prev.find(m => m.id === movie.id);
      if (isInList) {
        return prev.filter(m => m.id !== movie.id);
      } else {
        return [movie, ...prev];
      }
    });
  };
  
  const handleStartDownload = (movie: Movie) => {
    if (downloadingMovies[movie.id] || downloadedMovies.find(m => m.id === movie.id)) {
        console.log("Movie is already downloading or downloaded.");
        return;
    }

    setDownloadingMovies(prev => ({
        ...prev,
        [movie.id]: { movie, progress: 0 }
    }));

    const interval = setInterval(() => {
        setDownloadingMovies(prev => {
            const currentDownload = prev[movie.id];
            if (!currentDownload) {
                clearInterval(interval);
                return prev;
            }
            const newProgress = currentDownload.progress + Math.random() * 5 + 2;

            if (newProgress >= 100) {
                clearInterval(interval);
                
                // Move to downloaded
                setDownloadedMovies(downloaded => [movie, ...downloaded]);
                
                // Remove from downloading
                const { [movie.id]: _, ...remaining } = prev;
                return remaining;
            }

            return {
                ...prev,
                [movie.id]: { ...currentDownload, progress: newProgress }
            };
        });
    }, 200);
  };

  const handleEditClick = (movie: Movie) => {
    setMovieToEdit(movie);
    setActiveTab('Admin');
  };
  
  const handleRequestDelete = (movie: Movie) => {
    setMovieToDelete(movie);
  };

  const handleCancelDelete = () => {
    setMovieToDelete(null);
  };

  const handleConfirmDelete = async () => {
    if (!movieToDelete) return;
    setAllMovies(prev => prev.filter(m => m.id !== movieToDelete!.id));
    alert(`"${movieToDelete.title}" has been deleted.`);
    setMovieToDelete(null);
  };

  const handleAddMovie = (newMovie: Omit<Movie, 'id' | 'watchPercentage'>, category: string) => {
      const completeMovie: Movie = {
        ...newMovie,
        id: String(Date.now() + Math.random()), // Temporary ID for progress view
        watchPercentage: 0,
      };
      setUploadProgress({ status: 'uploading', percentage: 0, movie: completeMovie, category });
  };
  
  const handleUpdateMovie = async (updatedMovie: Movie) => {
    setAllMovies(prev => prev.map(m => m.id === updatedMovie.id ? updatedMovie : m));
    alert(`${updatedMovie.title} has been updated successfully!`);
  };

  const handleUploadComplete = async () => {
    if (uploadProgress.movie && uploadProgress.category) {
        const { id, ...movieToAdd } = uploadProgress.movie;
        const finalCategory = uploadProgress.category || (movieToAdd.seasonNumber ? 'TV Shows' : 'New Movies');
        
        const newMovie: Movie = {
            ...movieToAdd,
            id: `new-${Date.now()}`, // generate a new unique ID
            category: finalCategory,
        };
        
        setAllMovies(prev => [newMovie, ...prev]);

        // Also add new category if it was created
        if (!categories.some(c => c.title === finalCategory)) {
            const newCat = { id: `cat-${Date.now()}`, title: finalCategory, order: categories.length + 1 };
            setCategories(prev => [...prev, newCat]);
        }
    }
    setUploadProgress({ status: 'idle', percentage: 0, movie: null, category: '' });
    setActiveTab('Home');
  };

  const handleUploadCancel = () => {
      if (uploadProgress.movie) {
          if (uploadProgress.movie.posterUrl.startsWith('blob:')) {
            URL.revokeObjectURL(uploadProgress.movie.posterUrl);
          }
          if (uploadProgress.movie.backdropUrl.startsWith('blob:')) {
            URL.revokeObjectURL(uploadProgress.movie.backdropUrl);
          }
      }
      setUploadProgress({ status: 'idle', percentage: 0, movie: null, category: '' });
  };
  
  const handleSendChatMessage = (userEmail: string, text: string) => {
    const myMessage: Message = {
        id: Date.now(),
        text,
        sender: 'me',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setChatHistories(prev => ({
        ...prev,
        [userEmail]: [...(prev[userEmail] || []), myMessage]
    }));

    // Simulate reply
    setTimeout(() => {
        const replyMessage: Message = {
            id: Date.now() + 1,
            text: `Thanks for your message! Our team will look into "${text.substring(0, 20)}..." and get back to you shortly.`,
            sender: 'them',
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        };
        setChatHistories(prev => ({
            ...prev,
            [userEmail]: [...(prev[userEmail] || []), replyMessage]
        }));
    }, 1500);
  };
  
  const handleSendChatAttachment = (userEmail: string, imageUrl: string) => {
    const attachmentMessage: Message = {
        id: Date.now(),
        imageUrl,
        sender: 'me',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
    setChatHistories(prev => ({
        ...prev,
        [userEmail]: [...(prev[userEmail] || []), attachmentMessage]
    }));
  };


  const renderActiveTab = () => {
    if (!user) return null;
    switch (activeTab) {
      case 'Movies':
        return <MoviesView allMovies={allMovies} onCardClick={handleSelectMovie} user={user} onEditClick={handleEditClick} onDeleteClick={handleRequestDelete} onToggleMyList={handleToggleMyList} myList={myList} />;
      case 'My List':
        return <MyListView myList={myList} watchedList={recentlyViewed} onCardClick={handleSelectMovie} user={user} onEditClick={handleEditClick} onDeleteClick={handleRequestDelete} onToggleMyList={handleToggleMyList} />;
      case 'Downloads':
        return <DownloadsView 
                    downloadingMovies={Object.values(downloadingMovies)}
                    downloadedMovies={downloadedMovies}
                    downloadStorage={downloadStorage}
                    onSetDownloadStorage={setDownloadStorage}
                    isMobile={isMobile}
                    hasSdCard={hasSdCard}
                    onCardClick={handleSelectMovie}
                    user={user}
                    myList={myList}
                    onToggleMyList={handleToggleMyList}
                    onEditClick={handleEditClick}
                    onDeleteClick={handleRequestDelete}
                />;
      case 'Chat':
        return <ChatView 
                    currentUser={user} 
                    messages={chatHistories[user.email] || []} 
                    onSendMessage={(text) => handleSendChatMessage(user.email, text)}
                    onSendAttachment={(url) => handleSendChatAttachment(user.email, url)}
                />;
      case 'Request Movie':
        return <RequestMovieView />;
      case 'Rate Us':
        return hasRated ? (
            <div className="container mx-auto px-6 py-8 flex justify-center text-center">
                <div className="w-full max-w-2xl thank-you-animation">
                    <h1 className="text-5xl font-bold mb-4">Thank You!</h1>
                    <p className="text-zinc-300 text-lg">Your feedback helps us make Thelden even better.</p>
                </div>
            </div>
        ) : <RateUsView onRateSubmit={() => setHasRated(true)} />;
      case 'Admin':
        return user?.role === 'admin' ? <AdminView onAddMovie={handleAddMovie} onUpdateMovie={handleUpdateMovie} allMovies={allMovies} initialMovieToEdit={movieToEdit} onEditDone={() => setMovieToEdit(null)} categories={categories.map(c => c.title)} /> : <p>Access Denied</p>;
      case 'Profile':
        return (
          <ProfileView 
            user={user}
            onUpdateProfile={handleProfileUpdate}
            onLogout={handleLogout} 
            onRequestClick={() => setActiveTab('Request Movie')}
            onRateUsClick={() => setActiveTab('Rate Us')}
            onAdminClick={() => setActiveTab('Admin')}
            onChatClick={() => setActiveTab('Chat')}
          />
        );
      case 'Home':
      default:
        return (
          <HomeView
            carousels={movieCarousels}
            recentlyViewed={recentlyViewed}
            onCardClick={handleSelectMovie}
            user={user}
            onEditClick={handleEditClick}
            onDeleteClick={handleRequestDelete}
            onToggleMyList={handleToggleMyList}
            myList={myList}
          />
        );
    }
  };

  if (appState !== 'mainApp') {
    return (
        <>
            <SplashScreen 
                phase={appState as 'initialSplash' | 'auth'}
                user={user} 
            />
            {appState === 'auth' && <AuthView onAuthSuccess={handleAuthSuccess} />}
        </>
    );
  }
  
  if (!user) {
    // Fallback if state is inconsistent
    return <AuthView onAuthSuccess={handleAuthSuccess} />;
  }

  if (uploadProgress.status !== 'idle' && uploadProgress.movie) {
    return (
        <UploadProgressView 
            status={uploadProgress.status}
            percentage={uploadProgress.percentage}
            movie={uploadProgress.movie}
            onComplete={handleUploadComplete}
            onCancel={handleUploadCancel}
        />
    );
  }

  return (
    <div className="min-h-screen text-white selection:bg-red-700/50">
      <Header
        user={user}
        onSearchClick={() => setShowSearch(true)}
        onProfileClick={() => setActiveTab('Profile')}
      />
      <main className="pt-24 pb-32">
        {renderActiveTab()}
      </main>

      <BottomNavBar
        user={user}
        activeTab={activeTab}
        onTabClick={setActiveTab}
        onSearchClick={() => setShowSearch(true)}
      />

      {showSearch && <SearchOverlay allMovies={allMovies} onClose={() => setShowSearch(false)} onCardClick={handleSelectMovie} user={user} onEditClick={handleEditClick} onDeleteClick={handleRequestDelete} myList={myList} onToggleMyList={handleToggleMyList} />}

      {selectedMovie && !isPlaying && (
        <MovieModal
          movie={selectedMovie}
          onClose={handleCloseModal}
          onPlay={handlePlay}
          onToggleMyList={handleToggleMyList}
          isInMyList={!!myList.find(m => m.id === selectedMovie.id)}
          onDownload={handleStartDownload}
          downloadingMovies={downloadingMovies}
          downloadedMovies={downloadedMovies}
        />
      )}

      {isPlaying && selectedMovie && (
        <VideoPlayer 
          movie={selectedMovie} 
          allMovies={allMovies}
          onSelectEpisode={handleSelectMovie}
          onClose={handleClosePlayer} 
        />
      )}

      {movieToDelete && (
        <ConfirmationModal
          movie={movieToDelete}
          onConfirm={handleConfirmDelete}
          onCancel={handleCancelDelete}
        />
      )}
    </div>
  );
};

export default App;