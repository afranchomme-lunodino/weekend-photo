import { useState, useRef } from 'react';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { getDeviceId } from '../lib/deviceId';

const CLOUDINARY_CLOUD = 'dl4k6rd3e';
const CLOUDINARY_PRESET = 'weekend-photo';

async function compressImage(file, maxWidth = 1600, quality = 0.82) {
  return new Promise((resolve) => {
    const img = new Image();
    const objectUrl = URL.createObjectURL(file);
    img.onload = () => {
      let { width, height } = img;
      if (width > maxWidth) {
        height = Math.round((height * maxWidth) / width);
        width = maxWidth;
      }
      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      canvas.getContext('2d').drawImage(img, 0, 0, width, height);
      URL.revokeObjectURL(objectUrl);
      canvas.toBlob((blob) => resolve(blob), 'image/jpeg', quality);
    };
    img.onerror = () => { URL.revokeObjectURL(objectUrl); resolve(file); };
    img.src = objectUrl;
  });
}

async function uploadToCloudinary(blob, teamId) {
  const formData = new FormData();
  formData.append('file', blob);
  formData.append('upload_preset', CLOUDINARY_PRESET);
  formData.append('folder', `weekend-photo/${teamId}`);

  const res = await fetch(
    `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD}/image/upload`,
    { method: 'POST', body: formData }
  );
  if (!res.ok) throw new Error('Cloudinary upload failed');
  const data = await res.json();
  return data.secure_url;
}

export function UploadZone({ team }) {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState({ current: 0, total: 0 });
  const [error, setError] = useState('');
  const inputRef = useRef();

  async function handleFiles(files) {
    if (!files.length) return;
    setUploading(true);
    setError('');
    const deviceId = getDeviceId();
    const total = files.length;

    for (let i = 0; i < total; i++) {
      setProgress({ current: i + 1, total });
      try {
        const blob = await compressImage(files[i]);
        const url = await uploadToCloudinary(blob, team.id);
        await addDoc(collection(db, 'photos'), {
          teamId: team.id,
          teamName: team.name,
          url,
          deviceId,
          votes: 0,
          uploadedAt: serverTimestamp(),
        });
      } catch (e) {
        console.error(e);
        setError('Erreur sur une photo, les autres ont été envoyées.');
      }
    }

    setUploading(false);
    setProgress({ current: 0, total: 0 });
    inputRef.current.value = '';
  }

  function handleDrop(e) {
    e.preventDefault();
    handleFiles(Array.from(e.dataTransfer.files).filter(f => f.type.startsWith('image/')));
  }

  return (
    <div
      className={`upload-zone ${uploading ? 'uploading' : ''}`}
      onClick={() => !uploading && inputRef.current.click()}
      onDragOver={e => e.preventDefault()}
      onDrop={handleDrop}
    >
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        style={{ display: 'none' }}
        onChange={e => handleFiles(Array.from(e.target.files))}
      />

      {uploading ? (
        <div className="upload-progress-wrap">
          <div className="spinner" />
          <span>Envoi {progress.current}/{progress.total}…</span>
          <div className="progress-bar-wrap">
            <div
              className="progress-bar"
              style={{ width: `${(progress.current / progress.total) * 100}%` }}
            />
          </div>
        </div>
      ) : (
        <div className="upload-prompt">
          <span className="upload-icon">📷</span>
          <strong>Ajouter des photos</strong>
          <small>Galerie ou appareil photo · plusieurs à la fois</small>
        </div>
      )}

      {error && <div className="upload-error">{error}</div>}
    </div>
  );
}
