<<<<<<< HEAD
import React, { useState, useEffect } from 'react';
import { supabase } from '../../supabaseClient';
=======
import React, { useState, useEffect } from "react";
import { db, auth } from "@/firebase"; // ✅ Use alias instead of ../firebase
import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  onSnapshot,
  serverTimestamp,
} from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
>>>>>>> 9ee50d98492dc7e9af71d91c905fca21b2bb45bf

interface Movie {
  id?: string;
  title: string;
<<<<<<< HEAD
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
=======
  poster: string;
  backdrop: string;
  video: string;
  description: string;
  category: string;
}

// ✅ List of admin emails allowed
const ADMIN_EMAILS = ["ayahakuttyv@gmail.com", "ktmuhammedrayyan@gmail.com"];

const AdminView: React.FC = () => {
  const [title, setTitle] = useState("");
  const [poster, setPoster] = useState("");
  const [backdrop, setBackdrop] = useState("");
  const [video, setVideo] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [movies, setMovies] = useState<Movie[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [userEmail, setUserEmail] = useState<string | null>(null);

  // 🔥 Track login state
  useEffect(() => {
    const unsubAuth = onAuthStateChanged(auth, (user) => {
      setUserEmail(user?.email ?? null);
    });
    return () => unsubAuth();
  }, []);

  // 🔥 Fetch movies live from Firestore
  useEffect(() => {
    const unsub = onSnapshot(collection(db, "movie"), (snapshot) => {
      const list: Movie[] = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Movie[];
      setMovies(list);
    });
    return () => unsub();
  }, []);

  // 🔥 Save new movie
  const saveMovie = async () => {
    if (!title || !video) {
      alert("Title and Video link are required!");
      return;
    }
    try {
      await addDoc(collection(db, "movie"), {
        title,
        poster,
        backdrop,
        video,
        description,
        category,
        createdAt: serverTimestamp(),
      });
      resetForm();
    } catch (error) {
      console.error("Error saving movie: ", error);
    }
  };

  // 🔥 Update existing movie
  const updateMovie = async () => {
    if (!editingId) return;
    try {
      const movieDoc = doc(db, "movie", editingId);
      await updateDoc(movieDoc, {
        title,
        poster,
        backdrop,
        video,
        description,
        category,
        updatedAt: serverTimestamp(),
      });
      resetForm();
    } catch (error) {
      console.error("Error updating movie: ", error);
    }
  };

  // 🔥 Delete movie
  const deleteMovie = async (id: string) => {
    try {
      await deleteDoc(doc(db, "movie", id));
    } catch (error) {
      console.error("Error deleting movie: ", error);
    }
  };

  // Reset form
  const resetForm = () => {
    setTitle("");
    setPoster("");
    setBackdrop("");
    setVideo("");
    setDescription("");
    setCategory("");
    setEditingId(null);
  };

  // Fill form for editing
  const editMovie = (movie: Movie) => {
    setEditingId(movie.id || null);
    setTitle(movie.title);
    setPoster(movie.poster);
    setBackdrop(movie.backdrop);
    setVideo(movie.video);
    setDescription(movie.description);
    setCategory(movie.category);
  };

  // 🚫 Not logged in or not admin
  if (!userEmail) return <p>🔒 Please sign in to access Admin Panel</p>;
  if (!ADMIN_EMAILS.includes(userEmail.toLowerCase()))
    return <p>🚫 You are not authorized to access Admin Panel</p>;

  // ✅ Admin UI
  return (
    <div style={{ padding: "20px" }}>
      <h1>🎬 Admin Panel</h1>

      {/* Form */}
      <div style={{ marginBottom: "20px" }}>
        <input placeholder="Movie Title" value={title} onChange={(e) => setTitle(e.target.value)} />
        <input placeholder="Poster URL" value={poster} onChange={(e) => setPoster(e.target.value)} />
        <input placeholder="Backdrop URL" value={backdrop} onChange={(e) => setBackdrop(e.target.value)} />
        <input placeholder="Video URL" value={video} onChange={(e) => setVideo(e.target.value)} />
        <input placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} />
        <input placeholder="Category" value={category} onChange={(e) => setCategory(e.target.value)} />

        {editingId ? (
          <button onClick={updateMovie}>💾 Update Movie</button>
        ) : (
          <button onClick={saveMovie}>➕ Add Movie</button>
        )}
        {editingId && <button onClick={resetForm}>❌ Cancel</button>}
      </div>

      {/* Movie List */}
      <h2>📂 Movie List</h2>
      <ul>
        {movies.map((movie) => (
          <li key={movie.id} style={{ marginBottom: "10px" }}>
            <strong>{movie.title}</strong> ({movie.category})
            <button onClick={() => editMovie(movie)}>✏️ Edit</button>
            <button onClick={() => deleteMovie(movie.id!)}>🗑️ Delete</button>
          </li>
        ))}
      </ul>
>>>>>>> 9ee50d98492dc7e9af71d91c905fca21b2bb45bf
    </div>
  );
};

export default AdminView;

