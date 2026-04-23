import { useEffect } from 'react';

export function Lightbox({ photo, onClose }) {
  // Ferme avec la touche Escape
  useEffect(() => {
    function onKey(e) { if (e.key === 'Escape') onClose(); }
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [onClose]);

  if (!photo) return null;

  return (
    <div className="lb-overlay" onClick={onClose}>
      <button className="lb-close" onClick={onClose}>✕</button>

      <div className="lb-img-wrap" onClick={e => e.stopPropagation()}>
        <img src={photo.url} alt={photo.teamName} />
      </div>

      <div className="lb-caption" onClick={e => e.stopPropagation()}>
        <span className="lb-team">{photo.teamName}</span>
        <span className="lb-votes">♥ {photo.votes || 0}</span>
      </div>
    </div>
  );
}
