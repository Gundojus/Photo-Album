// src/pages/AlbumPage.js
import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { subscribePhotos, addPhotos, deletePhoto } from "../firebase";
import PolaroidCard from "../components/PolaroidCard";
import AddPhotosModal from "../components/AddPhotosModal";
import { Camera, Download, Trash2, ArrowLeft } from "lucide-react";

const randomInRange = (min, max) => {
  return Math.random() * (max - min) + min;
};

// Fisher–Yates shuffle
const shuffleArray = (arr) => {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};

const AlbumPage = () => {
  const { name } = useParams();
  const navigate = useNavigate();
  const albumName = decodeURIComponent(name);
  const [photos, setPhotos] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [activePhoto, setActivePhoto] = useState(null);
  const [uploadProgress, setUploadProgress] = useState({
    current: 0,
    total: 0,
  });
  const touchStartX = useRef(null);
  useEffect(() => {
    const key = `cached_photos_${albumName}`;
    const cached = sessionStorage.getItem(key);
    if (cached) {
      try {
        const parsed = JSON.parse(cached);
        setPhotos(parsed);
      } catch (_) {
        sessionStorage.removeItem(key);
      }
    }
  }, [albumName]);
  useEffect(() => {
    const key = `cached_photos_${albumName}`;
  let intervalId;

  const unsubscribe = subscribePhotos(albumName, (list) => {
    if (intervalId) clearInterval(intervalId);
    const sortedList = shuffleArray(list);
    setPhotos([]);

    let i = 0;
    intervalId = setInterval(() => {
      if (i < sortedList.length) {
        const next = sortedList[i];
        if (next && next.url) {      // extra safety check
          setPhotos((prev) => [...prev, next]);
        }
        i++;
      } else {
        clearInterval(intervalId);
      }
    }, 50);
     try {
        sessionStorage.setItem(key, JSON.stringify(list));
      } catch (e) {
        console.warn("Failed to cache photos:", e);
      }
  });

  return () => {
    unsubscribe();
    if (intervalId) clearInterval(intervalId);
  };
}, [albumName]);




  const handleAdd = async (photoItems) => {
    setUploadProgress({ current: 0, total: photoItems.length });

    try {
      await addPhotos(albumName, photoItems, (current, total) => {
        setUploadProgress({ current, total });
      });
    } catch (err) {
      console.error("Error adding photos:", err);
    } finally {
      setShowAddModal(false);
      setUploadProgress({ current: 0, total: 0 });
    }
  };

  const handleViewerClose = () => setActivePhoto(null);

  const onTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
  };
  const onTouchEnd = (e) => {
    const dx = e.changedTouches[0].clientX - touchStartX.current;
    if (dx > 100) {
      // swiped right
      navigate("/albums");
    }
  };

  return (
    <div className="album-page" onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}>
      <header className="album-header">
        <button
          onClick={() => navigate("/albums")}
          className="back-btn"
          aria-label="Back to albums"
        >
          <ArrowLeft size={24} />
        </button>
        <h1 className="album-title">{albumName}</h1>
      </header>
      <div className="gridA">
        {photos.map((photo) => {
          // compute random transforms once per render
          const x = randomInRange(-15, 15);
          const y = randomInRange(-10, 10);
          const r = randomInRange(-5, 5);
          const s = randomInRange(0.9, 1.1);

          const style = {
            transform: `translate(${x}px, ${y}px) rotate(${r}deg) scale(${s})`,
          };

          return (
            // <div key={photo.id} className="item" style={style}>
            <div key={photo.id} className="item">
              <div onClick={() => setActivePhoto(photo)}>
                <PolaroidCard
                  url={photo.url}
                  caption={photo.title}
                  type={photo.contentType}
                />
              </div>
            </div>
          );
        })}
      </div>

      <div className="plus-btn" onClick={() => setShowAddModal(true)}>
        <Camera size={32} />
      </div>
      

      {showAddModal && (
        <AddPhotosModal
         onCancel={() => setShowAddModal(false)}
         onAdd={handleAdd}
         uploadProgress={uploadProgress}
       />
      )}

      {activePhoto && (
        <div className="viewer-backdrop" onClick={handleViewerClose}>
          <div className="viewer-content" onClick={(e) => e.stopPropagation()}>
            {activePhoto.contentType.startsWith("video/") ? (
              <video
                src={activePhoto.url}
                controls
                autoPlay
                style={{ maxHeight: "90vh", maxWidth: "90vw" }}
              />
            ) : (
              <img
                src={activePhoto.url}
                alt={activePhoto.title}
                style={{ maxHeight: "90vh", maxWidth: "90vw" }}
              />
            )}
            <div className="viewer-actions">
              <a
                href={activePhoto.url}
                download={activePhoto.title}
                target="_blank"
                rel="noopener noreferrer"
              >
                <button>
                  <Download size={16} /> Download
                </button>
              </a>
              <button
                onClick={async () => {
                  await deletePhoto(albumName, activePhoto);
                  handleViewerClose();
                }}
              >
                <Trash2 size={16} /> Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AlbumPage;
