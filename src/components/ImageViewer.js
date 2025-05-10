// src/components/ImageViewer.js
import React from 'react';
import { Download, Trash2, X } from 'lucide-react';
import '../App.css';

const ImageViewer = ({ photo, onClose, onDelete }) => {
  return (
    <div className="viewer-backdrop" onClick={onClose}>
      <div className="viewer-content" onClick={(e) => e.stopPropagation()}>
        <img src={photo.url} alt={photo.title} />
        <div className="viewer-actions">
          <br></br>
          <a
            href={photo.url}
            download={photo.title}
            target="_blank"
            rel="noopener noreferrer"
          >
            <button>
              <Download size={16} /> Download
            </button>
          </a>
          <button onClick={() => onDelete(photo)}>
            <Trash2 size={16} /> Delete
          </button>
          <button onClick={onClose} style={{ marginLeft: '1rem' }}>
            <X size={16} /> Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default ImageViewer;
