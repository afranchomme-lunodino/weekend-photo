import { useState } from 'react';
import { Lightbox } from './Lightbox';

export function PhotoCard({ photo, onVote, canVote, hasVoted, isOwnTeam, votingOpen }) {
  const [loading, setLoading] = useState(false);
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

  let btnLabel = '♥ Voter';
  let btnClass = 'vote-btn';
  if (hasVoted) { btnLabel = '✓ Voté'; btnClass += ' voted'; }
  else if (isOwnTeam) { btnLabel = 'Ma team'; btnClass += ' own-team'; }
  else if (!canVote) { btnLabel = 'Max votes'; btnClass += ' maxed'; }

  return (
    <>
      <div className="photo-card">
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
