import React, { useState } from "react";
import "../App.css";
import heic2any from "heic2any";

const AddPhotosModal = ({ onCancel, onAdd, uploadProgress }) => {
  const [items, setItems] = useState([]);

  const handleFileChange = async (e) => {
    const files = Array.from(e.target.files);
    console.log("Selected files:", files);

    const convertedFiles = await Promise.all(
      files.map(async (file, index) => {
        console.log(`Processing file ${index + 1}/${files.length}:`, file.name);

        const isHeic =
          file.type === "image/heic" ||
          file.name.toLowerCase().endsWith(".heic");

        if (isHeic) {
          console.log(`Converting HEIC file: ${file.name}`);
          try {
            const blob = await heic2any({ blob: file });
            console.log(`Conversion successful: ${file.name}`, blob);

            const convertedFile = new File(
              [blob],
              file.name.replace(/\.heic$/i, ".png"),
              { type: "image/png" }
            );
            console.log(`Created new File object for: ${convertedFile.name}`);
            return convertedFile;
          } catch (error) {
            console.error(`Error converting HEIC file ${file.name}:`, error);
            return null;
          }
        } else {
          console.log(`No conversion needed for: ${file.name}`);
          return file;
        }
      })
    );

    const validFiles = convertedFiles.filter((f) => f !== null);
    console.log("Final list of valid files:", validFiles);

    setItems(
      validFiles.map((file) => {
        console.log(`Prepared item for: ${file.name}`);
        return { file, title: "", backText: "" };
      })
    );
  };

  const updateField = (idx, field, value) => {
    setItems((prev) =>
      prev.map((item, i) => (i === idx ? { ...item, [field]: value } : item))
    );
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (items.length) {
      onAdd(items);
    }
  };

  return (
    <div className="modal-backdrop">
      <div className="modal">
        {uploadProgress.total > 0 && (
          <div style={{ marginBottom: "1rem" }}>
            <div
              style={{
                height: "8px",
                background: "#eee",
                borderRadius: "4px",
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  width: `${
                    (uploadProgress.current / uploadProgress.total) * 100
                  }%`,
                  height: "100%",
                  background: "#19b0a9",
                  transition: "width 0.3s ease",
                }}
              />
            </div>
            <small
              style={{
                display: "block",
                textAlign: "center",
                marginTop: "0.25rem",
              }}
            >
              {`Uploading ${uploadProgress.current ?? 0} / ${
                uploadProgress.total ?? 0
              }`}
            </small>
          </div>
        )}

        {uploadProgress.total === 0 && (
          <div>
            <h2>Add Photos</h2>
            <form onSubmit={handleSubmit}>
              <label>Select Images:</label>
              <input
                type="file"
                accept="image/*,video/*"
                multiple
                onChange={handleFileChange}
                required
              />

              {items.map((item, idx) => (
                <div key={idx} style={{ marginTop: "1rem" }}>
                  <label>Title:</label>
                  <input
                    type="text"
                    value=" "
                    onChange={(e) => updateField(idx, "title", e.target.value)}
                  />
                </div>
              ))}

              <div style={{ marginTop: "1.5rem", textAlign: "right" }}>
                <button
                  type="button"
                  onClick={onCancel}
                  style={{ marginRight: "0.5rem", background: "#ccc" }}
                >
                  Cancel
                </button>
                <button type="submit">Add</button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default AddPhotosModal;
