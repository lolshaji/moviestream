import React, { useState, useEffect } from 'react';
import { supabase } from '../../supabaseClient';

interface Movie {
  id?: string;
  title: string;
  description: string;
  video_url: string;
  subtitle_url?: string;
  audio_url?: string;
  poster_url: string;
  backdrop_url: string;
  duration: string;
  category: string;
  season_number?: number;
  episode_number?: number;
  episode_title?: string;
}

interface AdminViewProps {
  allMovies: Movie[];
  initialMovieToEdit: Movie | null;
  onEditDone: () => void;
  categories: string[];
}

const AdminView: React.FC<AdminViewProps> = ({
  allMovies,
  initialMovieToEdit,
  onEditDone,
  categories,
}) => {
  // movie state
  const [movieTitle, setMovieTitle] = useState('');
  const [movieDescription, setMovieDescription] = useState('');
  const [movieVideoUrl, setMovieVideoUrl] = useState('');
  const [movieSubtitleUrl, setMovieSubtitleUrl] = useState('');
  const [movieAudioUrl, setMovieAudioUrl] = useState('');
  const [moviePosterUrl, setMoviePosterUrl] = useState('');
  const [movieBackdropUrl, setMovieBackdropUrl] = useState('');
  const [movieDuration, setMovieDuration] = useState('');
  const [movieCategory, setMovieCategory] = useState(categories[0] || '');
  const [newCategory, setNewCategory] = useState('');

  // season/episodes
  const [showTitle, setShowTitle] = useState('');
  const [seasonDescription, setSeasonDescription] = useState('');
  const [posterUrl, setPosterUrl] = useState('');
  const [backdropUrl, setBackdropUrl] = useState('');
  const [seasonNumber, setSeasonNumber] = useState(1);
  const [episodes, setEpisodes] = useState<
    {
      episodeNumber: number;
      title: string;
      description: string;
      videoUrl: string;
      subtitleUrl?: string;
      audioUrl?: string;
      duration: string;
    }[]
  >([]);

  const [editingMovie, setEditingMovie] = useState<Movie | null>(null);

  // preload values when editing
  useEffect(() => {
    if (initialMovieToEdit) {
      setEditingMovie(initialMovieToEdit);
      setMovieTitle(initialMovieToEdit.title);
      setMovieDescription(initialMovieToEdit.description);
      setMovieVideoUrl(initialMovieToEdit.video_url);
      setMovieSubtitleUrl(initialMovieToEdit.subtitle_url || '');
      setMovieAudioUrl(initialMovieToEdit.audio_url || '');
      setMoviePosterUrl(initialMovieToEdit.poster_url);
      setMovieBackdropUrl(initialMovieToEdit.backdrop_url);
      setMovieDuration(initialMovieToEdit.duration);
      setMovieCategory(initialMovieToEdit.category);
    }
  }, [initialMovieToEdit]);

  // 🎬 Add/Update Movie
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const finalCategory = newCategory || movieCategory;

    if (editingMovie) {
      const { error } = await supabase
        .from('movies')
        .update({
          title: movieTitle,
          description: movieDescription,
          video_url: movieVideoUrl,
          subtitle_url: movieSubtitleUrl,
          audio_url: movieAudioUrl,
          poster_url: moviePosterUrl,
          backdrop_url: movieBackdropUrl,
          duration: movieDuration,
          category: finalCategory,
        })
        .eq('id', editingMovie.id);

      if (error) {
        alert('❌ Error updating movie: ' + error.message);
      } else {
        alert('✅ Movie updated!');
        onEditDone();
      }
    } else {
      const { error } = await supabase.from('movies').insert([
        {
          title: movieTitle,
          description: movieDescription,
          video_url: movieVideoUrl,
          subtitle_url: movieSubtitleUrl,
          audio_url: movieAudioUrl,
          poster_url: moviePosterUrl,
          backdrop_url: movieBackdropUrl,
          duration: movieDuration,
          category: finalCategory,
        },
      ]);

      if (error) {
        alert('❌ Error adding movie: ' + error.message);
      } else {
        alert('✅ Movie added!');
      }
    }
  };

  // 📺 Add Season + Episodes
  const handleAddSeason = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!showTitle || episodes.length === 0) {
      alert('⚠️ Please fill all required fields');
      return;
    }

    for (const ep of episodes) {
      const { error } = await supabase.from('movies').insert([
        {
          title: showTitle,
          description: ep.description || seasonDescription,
          poster_url: posterUrl,
          backdrop_url: backdropUrl,
          video_url: ep.videoUrl,
          subtitle_url: ep.subtitleUrl,
          audio_url: ep.audioUrl,
          duration: ep.duration,
          season_number: seasonNumber,
          episode_number: ep.episodeNumber,
          episode_title: ep.title,
          category: 'TV Shows',
        },
      ]);

      if (error) {
        alert(`❌ Error adding episode ${ep.episodeNumber}: ${error.message}`);
        return;
      }
    }

    alert('✅ Season with episodes added!');
  };

  // UI
  return (
    <div>
      <h2>{editingMovie ? 'Edit Movie' : 'Add Movie'}</h2>
      <form onSubmit={handleSubmit}>
        <input placeholder="Title" value={movieTitle} onChange={(e) => setMovieTitle(e.target.value)} />
        <textarea placeholder="Description" value={movieDescription} onChange={(e) => setMovieDescription(e.target.value)} />
        <input placeholder="Video URL" value={movieVideoUrl} onChange={(e) => setMovieVideoUrl(e.target.value)} />
        <input placeholder="Subtitle URL" value={movieSubtitleUrl} onChange={(e) => setMovieSubtitleUrl(e.target.value)} />
        <input placeholder="Audio URL" value={movieAudioUrl} onChange={(e) => setMovieAudioUrl(e.target.value)} />
        <input placeholder="Poster URL" value={moviePosterUrl} onChange={(e) => setMoviePosterUrl(e.target.value)} />
        <input placeholder="Backdrop URL" value={movieBackdropUrl} onChange={(e) => setMovieBackdropUrl(e.target.value)} />
        <input placeholder="Duration" value={movieDuration} onChange={(e) => setMovieDuration(e.target.value)} />

        <select value={movieCategory} onChange={(e) => setMovieCategory(e.target.value)}>
          {categories.map((c) => (
            <option key={c}>{c}</option>
          ))}
        </select>
        <input placeholder="Or create new category" value={newCategory} onChange={(e) => setNewCategory(e.target.value)} />

        <button type="submit">{editingMovie ? 'Update Movie' : 'Add Movie'}</button>
      </form>

      <h2>Add Season</h2>
      <form onSubmit={handleAddSeason}>
        <input placeholder="Show Title" value={showTitle} onChange={(e) => setShowTitle(e.target.value)} />
        <textarea placeholder="Season Description" value={seasonDescription} onChange={(e) => setSeasonDescription(e.target.value)} />
        <input placeholder="Poster URL" value={posterUrl} onChange={(e) => setPosterUrl(e.target.value)} />
        <input placeholder="Backdrop URL" value={backdropUrl} onChange={(e) => setBackdropUrl(e.target.value)} />
        <input type="number" placeholder="Season Number" value={seasonNumber} onChange={(e) => setSeasonNumber(Number(e.target.value))} />

        <button type="button" onClick={() => setEpisodes([...episodes, { episodeNumber: episodes.length + 1, title: '', description: '', videoUrl: '', duration: '' }])}>
          ➕ Add Episode
        </button>

        {episodes.map((ep, idx) => (
          <div key={idx}>
            <input placeholder="Episode Title" value={ep.title} onChange={(e) => { const newEps = [...episodes]; newEps[idx].title = e.target.value; setEpisodes(newEps); }} />
            <input placeholder="Video URL" value={ep.videoUrl} onChange={(e) => { const newEps = [...episodes]; newEps[idx].videoUrl = e.target.value; setEpisodes(newEps); }} />
            <input placeholder="Duration" value={ep.duration} onChange={(e) => { const newEps = [...episodes]; newEps[idx].duration = e.target.value; setEpisodes(newEps); }} />
          </div>
        ))}

        <button type="submit">Save Season</button>
      </form>
    </div>
  );
};

export default AdminView;

