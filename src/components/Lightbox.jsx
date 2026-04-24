import { useEffect, useState } from 'react';
import { REACTIONS } from '../hooks/useVotes';

export function Lightbox({ photo, onClose, onVote, canVote, myReaction, isOwnTeam, votingOpen }) {
  const [floating, setFloating] = useState(null); // emoji flottant après vote

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

  async function handleReact(reactionKey) {
    if (!canVote || myReaction || isOwnTeam || !votingOpen) return;
    const result = await onVote(photo, reactionKey);
    if (result?.success) {
      const r = REACTIONS.find(r => r.key === reactionKey);
      setFloating(r.emoji);
      setTimeout(() => setFloating(null), 900);
    }
  }

  // Total réactions par type
  const rxCounts = photo.reactions ?? {};
  const hasReactions = Object.values(rxCounts).some(v => v > 0);

  return (
    <div className="lb-overlay" onClick={onClose}>
      <button className="lb-close" onClick={onClose}>✕</button>

      <div className="lb-img-wrap" onClick={e => e.stopPropagation()}>
        <img src={photo.url} alt={photo.teamName} />
        {floating && <div className="lb-float">{floating}</div>}
      </div>

      {/* Infos + réactions */}
      <div className="lb-bottom" onClick={e => e.stopPropagation()}>
        <div className="lb-caption">
          <span className="lb-team">{photo.teamName}</span>
          <span className="lb-votes">♥ {photo.votes || 0}</span>
        </div>

        {/* Breakdown des réactions */}
        {hasReactions && (
          <div className="lb-rx-breakdown">
            {REACTIONS.map(r => rxCounts[r.key] > 0 && (
              <span key={r.key} className="lb-rx-count">
                {r.emoji} {rxCounts[r.key]}
              </span>
            ))}
          </div>
        )}

        {/* Boutons de réaction */}
        {votingOpen && !isOwnTeam && (
          <div className="lb-rx-btns">
            {REACTIONS.map(r => (
              <button
                key={r.key}
                className={`lb-rx-btn ${myReaction === r.key ? 'selected' : ''} ${myReaction && myReaction !== r.key ? 'faded' : ''}`}
                onClick={() => handleReact(r.key)}
                disabled={!!myReaction || !canVote}
                title={r.label}
              >
                {r.emoji}
                <span className="lb-rx-label">{r.label}</span>
              </button>
            ))}
          </div>
        )}

        {votingOpen && isOwnTeam && (
          <p className="lb-own-hint">Tes propres photos ne comptent pas dans le vote</p>
        )}

        {votingOpen && !isOwnTeam && !myReaction && !canVote && (
          <p className="lb-own-hint">Tu as utilisé tous tes votes</p>
        )}
      </div>
    </div>
  );
}
