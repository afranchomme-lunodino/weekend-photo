import { useState } from 'react';
import { doc, deleteDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Lightbox } from './Lightbox';
import { REACTIONS } from '../hooks/useVotes';

export function PhotoCard({ photo, onVote, canVote, myReaction, isOwnTeam, votingOpen }) {
  const [deleting, setDeleting]   = useState(false);
  const [lightbox, setLightbox]   = useState(false);

  async function handleDelete(e) {
    e.stopPropagation();
    if (!window.confirm('Supprimer cette photo ?')) return;
    setDeleting(true);
    try { await deleteDoc(doc(db, 'photos', photo.id)); }
    catch { setDeleting(false); }
  }

  // Réaction choisie par cet utilisateur
  const chosen = REACTIONS.find(r => r.key === myReaction);

  // Top réaction sur la photo
  const rxCounts = photo.reactions ?? {};
  const topRx = REACTIONS
    .filter(r => rxCounts[r.key] > 0)
    .sort((a, b) => (rxCounts[b.key] || 0) - (rxCounts[a.key] || 0))[0];

  return (
    <>
      <div className={`photo-card ${deleting ? 'deleting' : ''}`}>
        <div
          className="photo-img-wrap"
          onClick={() => setLightbox(true)}
          style={{ cursor: 'zoom-in' }}
        >
          {/* Placeholder shimmer */}
          <div className="img-placeholder" style={{ position: 'absolute', inset: 0 }} />
          <img
            src={photo.url}
            alt={`Photo ${photo.teamName}`}
            loading="lazy"
            onLoad={e => {
              e.target.style.opacity = 1;
              e.target.previousSibling.style.display = 'none';
            }}
            style={{ opacity: 0, transition: 'opacity 0.3s' }}
          />
          <span className="team-badge">{photo.teamName}</span>
          <span className="lb-hint">🔍</span>

          {isOwnTeam && (
            <button className="delete-photo-btn" onClick={handleDelete} disabled={deleting}>
              {deleting ? '…' : '🗑'}
            </button>
          )}
        </div>

        <div className="photo-footer">
          <div className="vote-info">
            <span className="vote-count">
              {topRx ? topRx.emoji : '♥'} {photo.votes || 0}
            </span>
          </div>

          {chosen ? (
            <span className="my-reaction-badge">{chosen.emoji} Voté</span>
          ) : votingOpen && !isOwnTeam ? (
            <button className="react-hint-btn" onClick={() => setLightbox(true)}>
              Réagir
            </button>
          ) : null}
        </div>
      </div>

      {lightbox && (
        <Lightbox
          photo={photo}
          onClose={() => setLightbox(false)}
          onVote={onVote}
          canVote={canVote}
          myReaction={myReaction}
          isOwnTeam={isOwnTeam}
          votingOpen={votingOpen}
        />
      )}
    </>
  );
}
