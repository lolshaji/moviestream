export interface Movie {
  id: string;
  title: string; // For episodes, this will be the Show Title
  description: string;
  posterUrl: string;
  backdropUrl: string;
  duration: {
    hours: number;
    minutes: number;
    seconds: number;
  };
  watchPercentage: number;
  videoUrl: string;
  subtitleUrl?: string;
  audioUrl?: string;
  category?: string;

  // TV Show Episode specific properties
  seasonNumber?: number;
  episodeNumber?: number;
  episodeTitle?: string;
}

export interface User {
  email: string;
  role: 'user' | 'admin';
  name: string;
  profilePicUrl: string;
}

export type Tab = 'Home' | 'Movies' | 'My List' | 'Chat' | 'Request Movie' | 'Rate Us' | 'Admin' | 'Profile' | 'Downloads';

export interface Message {
    id: number;
    text?: string;
    imageUrl?: string;
    sender: 'me' | 'them';
    timestamp: string;
}