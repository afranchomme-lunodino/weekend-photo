import { useState, useEffect, useRef } from 'react';
import { usePhotos } from '../hooks/usePhotos';

const PHOTO_DURATION = 4000;   // 4 sec par photo
const PODIUM_EVERY   = 8;      // podium toutes les 8 photos
const PODIUM_DURATION = 7000;  // podium affiché 7 sec

const MEDALS = ['🥇', '🥈', '🥉'];

export function Slideshow() {
  const { photos } = usePhotos();
  const [index, setIndex]         = useState(0);
  const [fade, setFade]           = useState(true);
  const [showPodium, setShowPodium] = useState(false);
  const [podiumFade, setPodiumFade] = useState(false);
  const countRef = useRef(0);
  const timerRef = useRef(null);

  const topPhotos = [...photos]
    .sort((a, b) => (b.votes || 0) - (a.votes || 0))
    .slice(0, 3);

  function nextPhoto() {
    setFade(false);
    setTimeout(() => {
      setIndex(prev => (prev + 1) % Math.max(photos.length, 1));
      countRef.current += 1;
      setFade(true);

      if (countRef.current % PODIUM_EVERY === 0 && photos.length >= 3) {
        // Déclenche le podium après un court délai
        setTimeout(() => {
          setPodiumFade(false);
          setShowPodium(true);
          setTimeout(() => setPodiumFade(true), 100);
          setTimeout(() => {
            setPodiumFade(false);
            setTimeout(() => setShowPodium(false), 600);
          }, PODIUM_DURATION - 600);
        }, 500);
      }
    }, 400);
  }

  useEffect(() => {
    if (!photos.length || showPodium) return;
    timerRef.current = setInterval(nextPhoto, PHOTO_DURATION);
    return () => clearInterval(timerRef.current);
  }, [photos.length, showPodium]);

  // Garder l'index valide si les photos changent
  useEffect(() => {
    if (photos.length && index >= photos.length) setIndex(0);
  }, [photos.length]);

  const current = photos[index];

  if (!photos.length) {
    return (
      <div className="sl-empty">
        <div className="sl-empty-inner">
          <span>📭</span>
          <p>En attente des premières photos…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="sl-root">

      {/* ── Photo principale ───────────────────────── */}
      {current && (
        <div className={`sl-photo ${fade ? 'sl-visible' : 'sl-hidden'}`}>
          <img src={current.url} alt="" />
          <div className="sl-caption">
            <span className="sl-team">{current.teamName}</span>
            {(current.votes || 0) > 0 && (
              <span className="sl-votes">♥ {current.votes}</span>
            )}
          </div>
        </div>
      )}

      {/* ── Barre de progression ───────────────────── */}
      <div className="sl-bar-wrap">
        <div
          key={`${index}-${showPodium}`}
          className={`sl-bar ${showPodium ? '' : 'sl-bar-anim'}`}
          style={{ animationDuration: `${PHOTO_DURATION}ms` }}
        />
      </div>

      {/* ── Compteur discret ──────────────────────── */}
      <div className="sl-counter">{index + 1} / {photos.length}</div>

      {/* ── Podium overlay ────────────────────────── */}
      {showPodium && (
        <div className={`sl-podium ${podiumFade ? 'sl-visible' : 'sl-hidden'}`}>
          <div className="sl-podium-inner">
            <h2 className="sl-podium-title">🏆 Top photos du moment</h2>
            <div className="sl-podium-grid">
              {topPhotos.map((p, i) => (
                <div key={p.id} className={`sl-podium-card sl-podium-${i + 1}`}>
                  <div className="sl-podium-img-wrap">
                    <img src={p.url} alt="" />
                  </div>
                  <div className="sl-podium-info">
                    <span className="sl-podium-medal">{MEDALS[i]}</span>
                    <span className="sl-podium-name">{p.teamName}</span>
                    <span className="sl-podium-v">♥ {p.votes || 0} vote{p.votes !== 1 ? 's' : ''}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
