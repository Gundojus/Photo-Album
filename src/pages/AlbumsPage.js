// src/pages/AlbumsPage.js
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { subscribeAlbums, createAlbum } from "../firebase";
import PolaroidCard from "../components/PolaroidCard";
import AddAlbumModal from "../components/AddAlbumModal";
import { Camera } from "lucide-react";

const AlbumsPage = () => {
  const [albums, setAlbums] = useState([]);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    // Subscribe to albums list
    const unsubscribe = subscribeAlbums((list) => {
      setAlbums(list);
      console.log(albums);
    });
    return () => unsubscribe();
  }, []);

  const handleCreate = async (name, coverFile) => {
    try {
      await createAlbum(name, coverFile);
    } catch (error) {
      console.error("Failed to create album:", error);
    } finally {
      setShowModal(false);
    }
  };

  return (
    <div className="albums-page">
      <header className="album-header">
        <h1>Photo Album</h1>
      </header>
      <div className="grid">
        {albums.map((album) => (
          <Link
            key={album.name}
            to={`/album/${encodeURIComponent(album.name)}`}
          >
            <div className="item">
              <PolaroidCard url={album.coverUrl} caption={album.name} type="image/" />
            </div>
          </Link>
        ))}
      </div>

      {/* Floating Add Album button */}
      <div className="plus-btn" onClick={() => setShowModal(true)}>
        <Camera size={32} color="#fff" />
      </div>

      {/* Add Album Modal */}
      {showModal && (
        <AddAlbumModal
          onCancel={() => setShowModal(false)}
          onCreate={handleCreate}
        />
      )}
    </div>
  );
};

export default AlbumsPage;
