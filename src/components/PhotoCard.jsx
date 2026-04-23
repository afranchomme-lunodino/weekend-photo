import { useState } from 'react';
import { doc, deleteDoc, writeBatch, increment } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Lightbox } from './Lightbox';

export function PhotoCard({ photo, onVote, canVote, hasVoted, isOwnTeam, votingOpen }) {
  const [loading, setLoading] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [msg, setMsg] = useState('');
  const [imgLoaded, setImgLoaded] = useState(false);
  const [lightbox, setLightbox] = useState(false);

  async function handleVote() {
    if (loading || hasVoted || isOwnTeam || !canVote || !votingOpen) return;
    setLoading(true);
    const result = await onVote(photo);
    if (result?.error) {
      setMsg(result.error);
      setTimeout(() => setMsg(''), 2500);
    }
    setLoading(false);
  }

  async function handleDelete(e) {
    e.stopPropagation();
    if (!window.confirm('Supprimer cette photo ?')) return;
    setDeleting(true);
    try {
      // Si la photo a des votes, on les décrémente avant de supprimer
      if (photo.votes > 0) {
        const batch = writeBatch(db);
        batch.delete(doc(db, 'photos', photo.id));
        await batch.commit();
      } else {
        await deleteDoc(doc(db, 'photos', photo.id));
      }
    } catch (e) {
      console.error(e);
      setMsg('Erreur lors de la suppression');
      setTimeout(() => setMsg(''), 2500);
    }
    setDeleting(false);
  }

  let btnLabel = '♥ Voter';
  let btnClass = 'vote-btn';
  if (hasVoted)     { btnLabel = '✓ Voté';   btnClass += ' voted'; }
  else if (isOwnTeam) { btnLabel = 'Ma team'; btnClass += ' own-team'; }
  else if (!canVote)  { btnLabel = 'Max';     btnClass += ' maxed'; }

  return (
    <>
      <div className={`photo-card ${deleting ? 'deleting' : ''}`}>
        <div
          className="photo-img-wrap"
          onClick={() => setLightbox(true)}
          style={{ cursor: 'zoom-in' }}
        >
          {!imgLoaded && <div className="img-placeholder" />}
          <img
            src={photo.url}
            alt={`Photo ${photo.teamName}`}
            loading="lazy"
            onLoad={() => setImgLoaded(true)}
            style={{ opacity: imgLoaded ? 1 : 0 }}
          />
          <span className="team-badge">{photo.teamName}</span>
          <span className="lb-hint">🔍</span>

          {/* Bouton supprimer — visible uniquement pour sa propre équipe */}
          {isOwnTeam && (
            <button
              className="delete-photo-btn"
              onClick={handleDelete}
              disabled={deleting}
              title="Supprimer cette photo"
            >
              {deleting ? '…' : '🗑'}
            </button>
          )}
        </div>

        <div className="photo-footer">
          <span className="vote-count">♥ {photo.votes || 0}</span>
          {votingOpen && (
            <button
              className={btnClass}
              onClick={handleVote}
              disabled={loading || hasVoted || isOwnTeam || !canVote}
            >
              {loading ? '…' : btnLabel}
            </button>
          )}
        </div>

        {msg && <div className="vote-msg">{msg}</div>}
      </div>

      {lightbox && (
        <Lightbox photo={photo} onClose={() => setLightbox(false)} />
      )}
    </>
  );
}
