import React, { useState, useEffect } from "react";
import { db, auth } from "../firebase";
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

interface Movie {
  id?: string;
  title: string;
  poster: string;
  backdrop: string;
  video: string;
  description: string;
  category: string;
}

// ✅ Your admin emails
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
    </div>
  );
};

export default AdminView;

