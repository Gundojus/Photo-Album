import React, { useState } from 'react';
import '../App.css';  // for .modal, .modal-backdrop, inputs, buttons

const AddAlbumModal = ({ onCancel, onCreate }) => {
  const [name, setName] = useState('');
  const [coverFile, setCoverFile] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (name && coverFile) {
      onCreate(name, coverFile);
    }
  };

  return (
    <div className="modal-backdrop">
      <div className="modal">
        <h2>Create New Album</h2>
        <form onSubmit={handleSubmit}>
          <label>Album Name:</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <label>Cover Photo:</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setCoverFile(e.target.files[0])}
            required
          />
          <div style={{ marginTop: '1rem', textAlign: 'right' }}>
            <button type="button" onClick={onCancel} style={{ marginRight: '0.5rem', background: '#ccc' }}>
              Cancel
            </button>
            <button type="submit">Create</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddAlbumModal;
