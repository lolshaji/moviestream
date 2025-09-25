import React, { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import { Movie } from '../types';

// --- ICONS ---
const BackIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 inline" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
    </svg>
);

const PlayIcon: React.FC<{className?: string}> = ({className = "h-8 w-8"}) => ( <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z" /></svg> );
const PauseIcon: React.FC<{className?: string}> = ({className = "h-8 w-8"}) => ( <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="currentColor"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" /></svg> );

const MuteIcon = () => ( <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 24 24" fill="currentColor"><path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z" /></svg> );
const VolumeMediumIcon = () => ( <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 24 24" fill="currentColor"><path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02z" /></svg>);
const VolumeHighIcon = () => ( <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 24 24" fill="currentColor"><path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.87z" /></svg> );
const DynamicVolumeIcon: React.FC<{ level: number }> = ({ level }) => {
    if (level === 0) return <MuteIcon />;
    if (level < 0.5) return <VolumeMediumIcon />;
    return <VolumeHighIcon />;
};

const NextEpIcon = () => ( <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 24 24" fill="currentColor"><path d="M6 18h2V6H6v12zm3.5-6L18 6v12l-8.5-6z" /></svg> );
const EpisodesIcon = () => ( <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" /></svg>);
const FullscreenEnterIcon = () => ( <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 24 24" fill="currentColor"><path d="M7 14H5v5h5v-2H7v-3zm-2-4h2V7h3V5H5v5zm12 7h-3v2h5v-5h-2v3zM14 5v2h3v3h2V5h-5z" /></svg> );
const FullscreenExitIcon = () => ( <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 24 24" fill="currentColor"><path d="M5 16h3v3h2v-5H5v2zm3-8H5v2h5V5H8v3zm6 11h2v-3h3v-2h-5v5zm2-11V5h-2v5h5V8h-3z" /></svg> );
const SkipArrowIcon: React.FC<{ direction: 'forward' | 'backward' }> = ({ direction }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-10 h-10 text-white/90" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
        {direction === 'forward'
            ? <path strokeLinecap="round" strokeLinejoin="round" d="M13 5l7 7-7 7M5 5l7 7-7 7" />
            : <path strokeLinecap="round" strokeLinejoin="round" d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
        }
    </svg>
);
const SkipIcon: React.FC<{ seconds: number; className?: string }> = ({ seconds, className = "w-8 h-8" }) => (
    <div className={`relative flex items-center justify-center text-white ${className}`}>
        <svg xmlns="http://www.w3.org/2000/svg" className="w-full h-full absolute" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19.9 12a8 8 0 1 1-3.4-6.5" />
            {seconds > 0 ? <path d="m16 12 4-4-4-4" /> : <path d="m8 12-4-4 4-4" />}
        </svg>
        <span className="text-xs font-bold select-none">{Math.abs(seconds)}</span>
    </div>
);
const SubtitlesIcon = () => ( <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 24 24" fill="currentColor"><path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zM4 12h4v2H4v-2zm10 6H4v-2h10v2zm6 0h-4v-2h4v2zm0-4H10v-2h10v2z" /></svg> );
const AudioIcon = () => ( <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 24 24" fill="currentColor"><path d="M12 3v9.28c-.47-.17-.97-.28-1.5-.28C8.01 12 6 14.01 6 16.5S8.01 21 10.5 21c2.31 0 4.2-1.75 4.45-4H15V6h4V3h-7z" /></svg> );


interface VideoPlayerProps {
  movie: Movie;
  allMovies: Movie[];
  onClose: () => void;
  onSelectEpisode: (movie: Movie) => void;
}

const formatTime = (timeInSeconds: number): string => {
    if (isNaN(timeInSeconds) || timeInSeconds < 0) return '00:00';
    const totalSeconds = Math.floor(timeInSeconds);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    const formattedMinutes = String(minutes).padStart(2, '0');
    const formattedSeconds = String(seconds).padStart(2, '0');

    if (hours > 0) {
        return `${hours}:${formattedMinutes}:${formattedSeconds}`;
    }
    return `${formattedMinutes}:${formattedSeconds}`;
};

const VideoPlayer: React.FC<VideoPlayerProps> = ({ movie, allMovies, onClose, onSelectEpisode }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const playerContainerRef = useRef<HTMLDivElement>(null);
  const controlsTimeoutRef = useRef<number | null>(null);
  const tapTimeoutRef = useRef<number | null>(null);

  const [isPlaying, setIsPlaying] = useState(true);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isControlsVisible, setIsControlsVisible] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showEpisodes, setShowEpisodes] = useState(false);
  const [skipIndicator, setSkipIndicator] = useState<{ direction: 'forward' | 'backward'; key: number } | null>(null);

  // --- New State for Volume and Quality ---
  const [volume, setVolume] = useState(1); // 0 to 1 (0% to 100%)
  const [showVolumeControl, setShowVolumeControl] = useState(false);
  const [showQualityMenu, setShowQualityMenu] = useState(false);
  const [currentQuality, setCurrentQuality] = useState('1080p');
  const [showSubtitlesMenu, setShowSubtitlesMenu] = useState(false);
  const [currentSubtitle, setCurrentSubtitle] = useState('Off');
  const [showAudioMenu, setShowAudioMenu] = useState(false);
  const [currentAudio, setCurrentAudio] = useState('English');

  // --- Mock Data ---
  const qualities = ['1080p', '720p', '480p', '360p'];
  const subtitles = ['Off', 'English', 'Spanish', 'French'];
  const audioTracks = ['English', 'Spanish', 'Original'];

  const volumeControlContainerRef = useRef<HTMLDivElement>(null);
  const qualityMenuContainerRef = useRef<HTMLDivElement>(null);
  const subtitlesMenuRef = useRef<HTMLDivElement>(null);
  const audioMenuRef = useRef<HTMLDivElement>(null);
  
  const isEpisode = typeof movie.seasonNumber !== 'undefined' && typeof movie.episodeNumber !== 'undefined';
  
  const showData = useMemo(() => {
    if (!isEpisode) return null;
    const showTitle = movie.title;
    const episodesForShow = allMovies.filter(m => m.title === showTitle && m.seasonNumber);
    // Fix: Ensure only non-null numbers are sorted to fix type error.
    const availableSeasons = [...new Set(episodesForShow.map(ep => ep.seasonNumber))].filter((n): n is number => n != null).sort((a, b) => a - b);
    return { episodes: episodesForShow, seasons: availableSeasons }
  }, [allMovies, movie, isEpisode]);

  const [activeSeason, setActiveSeason] = useState(movie.seasonNumber || 1);
  useEffect(() => { setActiveSeason(movie.seasonNumber || 1); }, [movie]);

  const showControls = useCallback(() => {
    if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current);
    setIsControlsVisible(true);
    controlsTimeoutRef.current = window.setTimeout(() => {
        if (videoRef.current && !videoRef.current.paused && !showEpisodes && !showVolumeControl && !showQualityMenu && !showSubtitlesMenu && !showAudioMenu) {
            setIsControlsVisible(false);
        }
    }, 3000);
  }, [showEpisodes, showVolumeControl, showQualityMenu, showSubtitlesMenu, showAudioMenu]);

  useEffect(() => {
    const container = playerContainerRef.current;
    if (!container) return;
    const handleMouseMove = () => showControls();
    container.addEventListener('mousemove', handleMouseMove);
    showControls();
    return () => {
      container.removeEventListener('mousemove', handleMouseMove);
      if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current);
    };
  }, [showControls]);
  
  const togglePlayPause = useCallback(() => { if (videoRef.current) videoRef.current.paused ? videoRef.current.play() : videoRef.current.pause(); }, []);
  
  const handleSkip = useCallback((direction: 'forward' | 'backward') => {
      const seconds = direction === 'forward' ? 10 : -10;
      if(videoRef.current) videoRef.current.currentTime += seconds;
      setSkipIndicator({ direction, key: Date.now() });
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // Set initial volume
    video.volume = volume;

    const handleTimeUpdate = () => setProgress(video.currentTime);
    const handleDurationChange = () => setDuration(video.duration);
    const handlePlay = () => { 
      setIsPlaying(true); 
      showControls(); 
      // Unmute if browser policy muted it
      if (videoRef.current) videoRef.current.muted = false;
    };
    const handlePause = () => { setIsPlaying(false); showControls(); };
    const handleEnded = () => onClose();

    video.addEventListener('timeupdate', handleTimeUpdate);
    video.addEventListener('durationchange', handleDurationChange);
    video.addEventListener('play', handlePlay);
    video.addEventListener('pause', handlePause);
    video.addEventListener('ended', handleEnded);

    if (video.readyState > 0) handleDurationChange();

    return () => {
      video.removeEventListener('timeupdate', handleTimeUpdate);
      video.removeEventListener('durationchange', handleDurationChange);
      video.removeEventListener('play', handlePlay);
      video.removeEventListener('pause', handlePause);
      video.removeEventListener('ended', handleEnded);
    };
  }, [onClose, showControls]);

   useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
        if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
        if (e.key === 'ArrowRight') handleSkip('forward');
        else if (e.key === 'ArrowLeft') handleSkip('backward');
        else if (e.key === ' ') { e.preventDefault(); togglePlayPause(); }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [handleSkip, togglePlayPause]);

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!videoRef.current || !duration) return;
    const progressContainer = e.currentTarget;
    const clickPosition = e.nativeEvent.offsetX;
    const containerWidth = progressContainer.clientWidth;
    videoRef.current.currentTime = (clickPosition / containerWidth) * duration;
  };

  const handleVolumeChange = (newVolume: number) => {
    const clampedVolume = Math.max(0, Math.min(1, newVolume));
    setVolume(clampedVolume);
    if (videoRef.current) {
        videoRef.current.volume = clampedVolume;
        videoRef.current.muted = clampedVolume === 0;
    }
  };

  const handleQualityChange = (quality: string) => {
    setCurrentQuality(quality);
    setShowQualityMenu(false);
    // In a real app, you would change video source and sync time here.
    console.log(`Quality set to ${quality}`);
  };

  const toggleFullscreen = () => {
    const container = playerContainerRef.current;
    if (!container) return;
    if (!document.fullscreenElement) container.requestFullscreen().catch(err => console.error(`Fullscreen Error: ${err.message}`));
    else document.exitFullscreen();
  };
  
  useEffect(() => {
      const onFullscreenChange = () => setIsFullscreen(!!document.fullscreenElement);
      document.addEventListener('fullscreenchange', onFullscreenChange);
      return () => document.removeEventListener('fullscreenchange', onFullscreenChange);
  }, []);

  const handleVideoAreaClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (tapTimeoutRef.current) {
        clearTimeout(tapTimeoutRef.current);
        tapTimeoutRef.current = null;
        const rect = e.currentTarget.getBoundingClientRect();
        const clickX = e.clientX - rect.left;
        handleSkip(clickX > rect.width / 2 ? 'forward' : 'backward');
    } else {
        tapTimeoutRef.current = window.setTimeout(() => {
            togglePlayPause();
            tapTimeoutRef.current = null;
        }, 250);
    }
  };

  // Close popups on outside click
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (showVolumeControl && volumeControlContainerRef.current && !volumeControlContainerRef.current.contains(event.target as Node)) setShowVolumeControl(false);
            if (showQualityMenu && qualityMenuContainerRef.current && !qualityMenuContainerRef.current.contains(event.target as Node)) setShowQualityMenu(false);
            if (showSubtitlesMenu && subtitlesMenuRef.current && !subtitlesMenuRef.current.contains(event.target as Node)) setShowSubtitlesMenu(false);
            if (showAudioMenu && audioMenuRef.current && !audioMenuRef.current.contains(event.target as Node)) setShowAudioMenu(false);
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [showVolumeControl, showQualityMenu, showSubtitlesMenu, showAudioMenu]);

    const handleVolumeInteraction = (e: React.MouseEvent<HTMLDivElement>) => {
        const slider = e.currentTarget;
        const rect = slider.getBoundingClientRect();
        const offsetY = e.clientY - rect.top;
        const newVolume = (rect.height - offsetY) / rect.height;
        handleVolumeChange(newVolume);
    };

    const handleVolumeDragStart = (e: React.MouseEvent<HTMLDivElement>) => {
        handleVolumeInteraction(e);
        const slider = e.currentTarget;

        const handleDrag = (moveEvent: MouseEvent) => {
            const rect = slider.getBoundingClientRect();
            const offsetY = moveEvent.clientY - rect.top;
            const newVolume = (rect.height - offsetY) / rect.height;
            handleVolumeChange(newVolume);
        };

        const handleDragEnd = () => {
            window.removeEventListener('mousemove', handleDrag);
            window.removeEventListener('mouseup', handleDragEnd);
        };

        window.addEventListener('mousemove', handleDrag);
        window.addEventListener('mouseup', handleDragEnd);
    };


  return (
    <div ref={playerContainerRef} className="fixed inset-0 bg-black z-[100] flex items-center justify-center select-none">
      <video ref={videoRef} src={movie.videoUrl} className="w-full h-full object-contain" autoPlay>
        {movie.subtitleUrl && <track label="English" kind="subtitles" srcLang="en" src={movie.subtitleUrl} default />}
      </video>
      
      <div className="absolute inset-0 z-10" onClick={handleVideoAreaClick} onMouseMove={showControls}></div>

      {skipIndicator && (
          <div key={skipIndicator.key} className={`absolute top-1/2 -translate-y-1/2 ${skipIndicator.direction === 'forward' ? 'right-10 md:right-20' : 'left-10 md:left-20'} skip-indicator z-20`}>
              <div className="glass-skip-icon">
                 <SkipArrowIcon direction={skipIndicator.direction} />
              </div>
          </div>
      )}
      
      {showEpisodes && showData && (
        <div className="absolute inset-0 bg-black/30 z-30" onClick={() => setShowEpisodes(false)}>
            <div className="absolute top-0 right-0 bottom-0 w-full max-w-md bg-zinc-900/60 backdrop-blur-xl border-l border-white/10 p-6 flex flex-col" onClick={e => e.stopPropagation()}>
                <h3 className="text-2xl font-bold mb-4">{movie.title}</h3>
                <div className="flex items-center border-b border-zinc-700 mb-4">
                    {showData.seasons.map(seasonNum => ( <button key={seasonNum} onClick={() => setActiveSeason(seasonNum)} className={`py-2 px-4 text-sm font-semibold transition-colors ${activeSeason === seasonNum ? 'text-white border-b-2 border-red-500' : 'text-zinc-400 hover:text-white'}`}>Season {seasonNum}</button>))}
                </div>
                <div className="overflow-y-auto flex-grow -mr-4 pr-3 hide-scrollbar">
                    {showData.episodes.filter(ep => ep.seasonNumber === activeSeason).sort((a,b) => a.episodeNumber! - b.episodeNumber!).map(ep => (
                        <div key={ep.id} onClick={() => onSelectEpisode(ep)} className={`flex items-start space-x-4 p-3 rounded-lg cursor-pointer transition-colors ${movie.id === ep.id ? 'bg-red-600/30' : 'hover:bg-zinc-800/80'}`}>
                            <span className="font-bold text-zinc-400 mt-1">{ep.episodeNumber}</span>
                            <div className="flex-grow"> <p className="font-semibold text-white">{ep.episodeTitle}</p> <p className="text-xs text-zinc-400 line-clamp-2 mt-1">{ep.description}</p> </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
      )}
      
      <div className={`absolute inset-0 transition-opacity duration-300 pointer-events-none ${isControlsVisible ? 'opacity-100' : 'opacity-0'} z-20`}>
        <div className="absolute top-0 left-0 right-0 p-4 md:p-6 bg-gradient-to-b from-black/70 to-transparent flex items-center justify-between">
            <button onClick={onClose} className="text-white hover:opacity-80 transition-opacity flex items-center pointer-events-auto"><BackIcon /><span className="ml-2 font-semibold">Back</span></button>
             <div className="text-white text-right">
                <p className="text-sm text-gray-300">Now Playing</p>
                {isEpisode ? (<>
                    <h2 className="text-lg md:text-xl font-bold -mt-1 truncate max-w-xs md:max-w-md" title={movie.title}>{movie.title}</h2>
                    <p className="text-sm text-gray-300">S{String(movie.seasonNumber).padStart(2, '0')} E{String(movie.episodeNumber).padStart(2, '0')}: {movie.episodeTitle}</p>
                </>) : (
                    <h2 className="text-lg md:text-xl font-bold -mt-1 truncate max-w-xs md:max-w-md" title={movie.title}>{movie.title}</h2>
                )}
            </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 p-4 md:p-6 bg-gradient-to-t from-black/70 to-transparent pointer-events-auto">
          <div className="group w-full cursor-pointer mb-3" onClick={handleSeek}>
             <div className="h-2 bg-white/20 rounded-full"><div className="h-full progress-bar-gradient rounded-full relative" style={{ width: `${(progress / duration) * 100}%` }}><div className="absolute right-0 top-1/2 -translate-y-1/2 w-4 h-4 bg-white rounded-full transform scale-0 group-hover:scale-100 transition-transform duration-200"></div></div></div>
          </div>
          <div className="flex items-center justify-between text-white">
            <div className="flex items-center space-x-2 md:space-x-4">
              <button onClick={() => handleSkip('backward')} className="glass-control-button" aria-label="Skip backward 10 seconds">
                  <SkipIcon seconds={-10} className="w-7 h-7" />
              </button>
              <button onClick={togglePlayPause} className="glass-play-pause-button" aria-label={isPlaying ? 'Pause' : 'Play'}>
                  {isPlaying ? <PauseIcon className="h-10 w-10" /> : <PlayIcon className="h-10 w-10 ml-1" />}
              </button>
              <button onClick={() => handleSkip('forward')} className="glass-control-button" aria-label="Skip forward 10 seconds">
                  <SkipIcon seconds={10} className="w-7 h-7" />
              </button>
              <div className="pl-4 flex items-center space-x-2 md:space-x-4">
                <div ref={volumeControlContainerRef} className="relative flex items-center">
                    <button onClick={() => setShowVolumeControl(v => !v)} className="p-2 hover:bg-white/10 rounded-full transition-colors" aria-label="Adjust volume">
                        <DynamicVolumeIcon level={volume} />
                    </button>
                    {showVolumeControl && (
                        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 bg-zinc-800/80 backdrop-blur-sm rounded-xl p-2 pt-4 shadow-lg">
                             <div 
                                onMouseDown={handleVolumeDragStart} 
                                className="w-8 h-32 flex justify-center items-end cursor-pointer group"
                            >
                                <div className="w-2 h-full bg-white/20 rounded-full relative">
                                    <div 
                                        style={{ height: `${volume * 100}%` }} 
                                        className="absolute bottom-0 left-0 w-full rounded-full bg-white"
                                    >
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
                <span className="text-sm font-mono w-32 text-left">{formatTime(progress)} / {formatTime(duration)}</span>
              </div>
            </div>
            <div className="flex items-center space-x-2 md:space-x-4">
               {/* Audio Menu */}
              <div ref={audioMenuRef} className="relative">
                    <button onClick={() => setShowAudioMenu(a => !a)} className="p-2 hover:bg-white/10 rounded-full transition-colors" aria-label="Select audio track"><AudioIcon /></button>
                    {showAudioMenu && (
                        <div className="absolute bottom-full right-0 mb-2 bg-black/80 backdrop-blur-md rounded-lg p-1 w-32 shadow-lg">
                            {audioTracks.map(track => (
                                <button key={track} onClick={() => { setCurrentAudio(track); setShowAudioMenu(false); }} className={`w-full text-left px-3 py-1.5 rounded-md text-sm transition-colors ${track === currentAudio ? 'bg-red-600 font-bold' : 'hover:bg-zinc-700'}`}>
                                    {track}
                                </button>
                            ))}
                        </div>
                    )}
                </div>
              {/* Subtitles Menu */}
              <div ref={subtitlesMenuRef} className="relative">
                    <button onClick={() => setShowSubtitlesMenu(s => !s)} className="p-2 hover:bg-white/10 rounded-full transition-colors" aria-label="Select subtitles"><SubtitlesIcon /></button>
                    {showSubtitlesMenu && (
                        <div className="absolute bottom-full right-0 mb-2 bg-black/80 backdrop-blur-md rounded-lg p-1 w-32 shadow-lg">
                            {subtitles.map(sub => (
                                <button key={sub} onClick={() => { setCurrentSubtitle(sub); setShowSubtitlesMenu(false); }} className={`w-full text-left px-3 py-1.5 rounded-md text-sm transition-colors ${sub === currentSubtitle ? 'bg-red-600 font-bold' : 'hover:bg-zinc-700'}`}>
                                    {sub}
                                </button>
                            ))}
                        </div>
                    )}
                </div>
              {/* Quality Menu */}
              <div ref={qualityMenuContainerRef} className="relative">
                    <button onClick={() => setShowQualityMenu(q => !q)} className="text-sm font-semibold p-2 hover:bg-white/10 rounded-md transition-colors">{currentQuality}</button>
                    {showQualityMenu && (
                        <div className="absolute bottom-full right-0 mb-2 bg-black/80 backdrop-blur-md rounded-lg p-1 w-28 shadow-lg">
                            {qualities.map(q => (
                                <button key={q} onClick={() => handleQualityChange(q)} className={`w-full text-left px-3 py-1.5 rounded-md text-sm transition-colors ${q === currentQuality ? 'bg-red-600 font-bold' : 'hover:bg-zinc-700'}`}>
                                    {q}
                                </button>
                            ))}
                        </div>
                    )}
                </div>
              {isEpisode && <button className="flex items-center space-x-2 text-sm hover:opacity-80 transition-opacity"><NextEpIcon /> <span>Next Ep</span></button>}
              {isEpisode && <button className="glass-glow-button flex items-center space-x-2 text-sm" onClick={() => setShowEpisodes(true)}><EpisodesIcon /> <span>Episodes</span></button>}
              <button onClick={toggleFullscreen}>{isFullscreen ? <FullscreenExitIcon /> : <FullscreenEnterIcon />}</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoPlayer;
