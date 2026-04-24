import { useState, useEffect, useRef } from 'react';
import { usePhotos } from '../hooks/usePhotos';
import { useTeams } from '../hooks/useTeams';

const MEDALS  = ['🥇', '🥈', '🥉'];
const COLORS  = ['#f5a623', '#a8a8b3', '#c96e3a'];
const RANKS   = ['1er', '2ème', '3ème'];

// Confetti canvas
function Confetti({ active }) {
  const ref = useRef();
  useEffect(() => {
    if (!active) return;
    const canvas = ref.current;
    const ctx = canvas.getContext('2d');
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;
    const pieces  = Array.from({ length: 120 }, () => ({
      x:   Math.random() * canvas.width,
      y:   -20 - Math.random() * 200,
      r:   4 + Math.random() * 6,
      color: ['#ff6b35','#ffd700','#27ae60','#3498db','#e74c3c','#fff'][Math.floor(Math.random()*6)],
      vx:  (Math.random() - 0.5) * 4,
      vy:  3 + Math.random() * 4,
      rot: Math.random() * 360,
      rsp: (Math.random() - 0.5) * 8,
    }));
    let frame;
    function draw() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      pieces.forEach(p => {
        p.x  += p.vx; p.y += p.vy; p.rot += p.rsp;
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rot * Math.PI / 180);
        ctx.fillStyle = p.color;
        ctx.fillRect(-p.r, -p.r, p.r * 2, p.r * 2);
        ctx.restore();
      });
      if (pieces.some(p => p.y < canvas.height + 50)) frame = requestAnimationFrame(draw);
    }
    draw();
    return () => cancelAnimationFrame(frame);
  }, [active]);
  return <canvas ref={ref} className="confetti-canvas" />;
}

export function PodiumReveal() {
  const { photos } = usePhotos();
  const { teams }  = useTeams();
  const [step, setStep] = useState(-1); // -1 = écran d'accueil, 0=3e, 1=2e, 2=1er
  const [showConfetti, setShowConfetti] = useState(false);

  const scores = teams
    .map(team => ({
      ...team,
      votes:      photos.filter(p => p.teamId === team.id).reduce((s, p) => s + (p.votes||0), 0),
      topPhoto:   photos.filter(p => p.teamId === team.id).sort((a,b) => (b.votes||0)-(a.votes||0))[0],
    }))
    .sort((a, b) => b.votes - a.votes);

  // On affiche dans l'ordre dramatique : 3e → 2e → 1er
  const reveals = [scores[2], scores[1], scores[0]].filter(Boolean);

  function next() {
    const nextStep = step + 1;
    setStep(nextStep);
    if (nextStep === 2) {
      setTimeout(() => setShowConfetti(true), 600);
    }
  }

  const current = step >= 0 ? reveals[step] : null;
  const rank    = step >= 0 ? 2 - step : null; // 2→3e, 1→2e, 0→1er

  return (
    <div className="podium-root" onClick={step < 2 ? next : undefined}>
      {showConfetti && <Confetti active />}

      {step === -1 && (
        <div className="podium-start">
          <div className="podium-logo">🏆</div>
          <h1>Révélation du classement</h1>
          <p>Appuie n'importe où pour commencer</p>
          <div className="podium-start-hint">▼</div>
        </div>
      )}

      {step >= 0 && current && (
        <div className={`podium-reveal rank-${rank + 1} ${step >= 0 ? 'show' : ''}`} key={step}>
          <div className="podium-rank-label">
            <span className="podium-rank-num">{RANKS[rank]}</span>
            <span className="podium-medal-big">{MEDALS[rank]}</span>
          </div>

          <div className="podium-team-name">{current.name}</div>

          {current.topPhoto && (
            <div className="podium-photo-wrap">
              <img src={current.topPhoto.url} alt="" />
            </div>
          )}

          <div className="podium-score">{current.votes} vote{current.votes !== 1 ? 's' : ''}</div>

          {step < 2 && (
            <div className="podium-next-hint">
              {step === 0 ? 'Appuie pour la 2ème place →' : 'Appuie pour le vainqueur →'}
            </div>
          )}
          {step === 2 && (
            <div className="podium-winner-msg">🎉 Félicitations ! 🎉</div>
          )}
        </div>
      )}

      {/* Retour admin */}
      <a
        href="/?admin"
        className="podium-back"
        onClick={e => e.stopPropagation()}
      >
        ← Admin
      </a>
    </div>
  );
}
