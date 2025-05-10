import {
  ref as storageRef,
  uploadBytes,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";
import {
  ref as dbRef,
  set,
  push,
  onValue,
  get,
  remove,
} from "firebase/database";
import { storage, database } from "./firebaseConfig";

// Albums
export const createAlbum = async (name, coverFile) => {
  const coverRef = storageRef(
    storage,
    `albums/${name}/cover_${coverFile.name}`
  );
  await uploadBytes(coverRef, coverFile);
  const coverUrl = await getDownloadURL(coverRef);
  const albumsRef = dbRef(database, `albums/${name}`);
  await set(albumsRef, { name, coverUrl, createdAt: Date.now() });
};

export const subscribeAlbums = (callback) => {
  const albumsRoot = dbRef(database, `albums`);
  return onValue(albumsRoot, (snapshot) => {
    const data = snapshot.val() || {};
    const list = Object.values(data);
    callback(list);
  });
};

// Photos
export const subscribePhotos = (albumName, callback) => {
  const photosRef = dbRef(database, `photos/${albumName}`);
  return onValue(photosRef, (snap) => {
    const data = snap.val() || {};
    const list = Object.entries(data).map(([id, val]) => ({ id, ...val }));
    callback(list);
  });
};

// src/firebase.js

export const addPhotos = async (albumName, items, onProgress) => {
  let completed = 0;
  const total = items.length;

  const uploads = items.map(async ({ file, title, backText }) => {
    const photoRef = storageRef(storage, `albums/${albumName}/${file.name}`);

    await uploadBytes(photoRef, file);
    const url = await getDownloadURL(photoRef);

    const meta = {
      url,
      title,
      backText,
      createdAt: Date.now(),
      storagePath: photoRef.fullPath,
      contentType: file.type || "image/jpeg",
    };

    const photosDbRef = dbRef(database, `photos/${albumName}`);
    const newEntry = push(photosDbRef);
    await set(newEntry, meta);

    // Update progress
    completed++;
    if (onProgress) {
      onProgress(completed, total);
    }
  });

  await Promise.all(uploads);
};


export const deletePhoto = async (albumName, photo) => {
  // photo: { id, storagePath }
  const fileRef = storageRef(storage, photo.storagePath);
  await deleteObject(fileRef);
  const dbNode = dbRef(database, `photos/${albumName}/${photo.id}`);
  await remove(dbNode);
};
