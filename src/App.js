import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import AlbumsPage from "./pages/AlbumsPage";
import AlbumPage from "./pages/AlbumPage";

function App() {
  return (
    <div className="app">
      <Routes>
        <Route path="/" element={<AlbumsPage />} />
        <Route path="/albums" element={<AlbumsPage />} />
        <Route path="/album/:name" element={<AlbumPage />} />
        <Route path="*" element={<Navigate to="/albums" replace />} />
      </Routes>
    </div>
  );
}

export default App;
