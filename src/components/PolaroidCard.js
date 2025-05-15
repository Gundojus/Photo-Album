// src/components/MediaCard.js
import React, { useRef } from "react";
import "../App.css";

export default function PolaroidCard({ url, caption, type }) {
  
  const isVideo = type.startsWith("video/");
  const videoRef = useRef();

  const handleClick = () => {
    if (!isVideo) return;
    const vid = videoRef.current;
    if (vid.muted) {
      vid.muted = false;
      vid.controls = true;
      vid.play();
    }
  };

  return (
    <div className="polaroid" onClick={handleClick}>
      {isVideo ? (
        <video
          ref={videoRef}
          src={url}
          muted
          autoPlay
          loop
          playsInline
          loading="lazy"
          style={{ width: "100%", height: "auto", borderRadius: "2px" }}
        />
      ) : (
        <img src={url} alt={caption} loading="lazy"/>
      )}
      {caption && <div className="caption">{caption}</div>}
    </div>
  );
}
