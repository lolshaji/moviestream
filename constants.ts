import { Movie } from './types';

export const generateMovies = (category: string, count: number): Movie[] => {
  return Array.from({ length: count }, (_, i) => ({
    id: `${category}-${i}-${Math.random().toString(36).substring(2, 9)}`,
    title: `${category} Movie ${i + 1}`,
    description: `This is a compelling description for ${category} Movie ${i + 1}. It involves drama, action, and a hint of romance, keeping viewers on the edge of their seats.`,
    posterUrl: `https://picsum.photos/seed/${category}${i}/400/600`,
    backdropUrl: `https://picsum.photos/seed/${category}${i}bg/1200/675`,
    duration: {
      hours: Math.floor(Math.random() * 2) + 1,
      minutes: Math.floor(Math.random() * 60),
      seconds: Math.floor(Math.random() * 60),
    },
    watchPercentage: 0, // Default to 0, will be updated for recently viewed
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    category: category,
  }));
};