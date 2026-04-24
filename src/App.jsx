import { useState, useMemo, useRef } from 'react';
import { useTeams } from './hooks/useTeams';
import { usePhotos } from './hooks/usePhotos';
import { useVotes } from './hooks/useVotes';
import { useSettings } from './hooks/useSettings';
import { PhotoCard } from './components/PhotoCard';
import { UploadZone } from './components/UploadZone';
import { Scoreboard } from './components/Scoreboard';
import { DownloadAll } from './components/DownloadAll';
import { AdminPanel } from './components/AdminPanel';
import { Slideshow } from './components/Slideshow';
import { QRPage } from './components/QRPage';
import { PodiumReveal } from './components/PodiumReveal';

const params     = new URLSearchParams(window.location.search);
const isSlideshow = params.has('slideshow');
const isAdmin    = params.has('admin');
const isQR       = params.has('qrcodes');
const isPodium   = params.has('podium');
const teamParam  = params.get('team');

/* ── Main App ───────────────────────────────────────────────────── */
function MainApp() {
  const [tab,    setTab]    = useState('gallery');
  const [filter, setFilter] = useState('all');

  const { teams }                         = useTeams();
  const { photos }                        = usePhotos();
  const { votingOpen } = useSettings();
  const currentTeam = teams.find(t => t.id === teamParam) ?? null;
  const { votesLeft, votedPhotos, vote }  = useVotes(currentTeam?.id);

  // Stable shuffle — each photo gets a random key the first time it's seen
  const shuffleOrder = useRef({});
  const galleryPhotos = useMemo(() => {
    photos.forEach(p => {
      if (!(p.id in shuffleOrder.current)) {
        shuffleOrder.current[p.id] = Math.random();
      }
    });
    return [...photos].sort(
      (a, b) => shuffleOrder.current[a.id] - shuffleOrder.current[b.id]
    );
  }, [photos]);

  // "Mes photos" tab — own team only
  const myPhotos = currentTeam
    ? photos.filter(p => p.teamId === currentTeam.id)
    : [];

  // Filtered gallery
  const displayedPhotos = filter === 'all'
    ? galleryPhotos
    : galleryPhotos.filter(p => p.teamId === filter);

  if (isAdmin) return <AdminPanel />;

  return (
    <div className="app">
      {/* ── Header ─────────────────────────────────────────────── */}
      <header className="app-header">
        <div className="header-top">
          <div className="header-brand">
            <img src="/logo.svg" alt="LPTR Family" className="header-logo" />
            <h1>Weekend Photo</h1>
          </div>
          {votingOpen && currentTeam && (
            <div className="votes-badge">
              {votesLeft} vote{votesLeft !== 1 ? 's' : ''}
            </div>
          )}
        </div>

        {currentTeam && (
          <div className="team-tag">{currentTeam.name}</div>
        )}

      </header>

      {/* ── Upload zone — toujours disponible ──────────────────── */}
      {currentTeam && (
        <div className="upload-section">
          <UploadZone
            team={currentTeam}
            teamPhotoCount={photos.filter(p => p.teamId === currentTeam.id).length}
          />
        </div>
      )}

      {/* ── Tabs ───────────────────────────────────────────────── */}
      <nav className="tabs">
        <button
          className={tab === 'gallery' ? 'tab active' : 'tab'}
          onClick={() => setTab('gallery')}
        >
          Galerie
          <span className="tab-count">{photos.length}</span>
        </button>

        {currentTeam && (
          <button
            className={tab === 'mine' ? 'tab active' : 'tab'}
            onClick={() => setTab('mine')}
          >
            Mes photos
            <span className="tab-count">{myPhotos.length}</span>
          </button>
        )}

        <button
          className={tab === 'scoreboard' ? 'tab active' : 'tab'}
          onClick={() => setTab('scoreboard')}
        >
          Classement
        </button>
      </nav>

      {/* ── Gallery ────────────────────────────────────────────── */}
      {tab === 'gallery' && (
        <div className="gallery-view">
          {teams.length > 1 && (
            <div className="filter-row">
              <select
                className="team-filter"
                value={filter}
                onChange={e => setFilter(e.target.value)}
              >
                <option value="all">Toutes les équipes</option>
                {teams.map(t => (
                  <option key={t.id} value={t.id}>{t.name}</option>
                ))}
              </select>
            </div>
          )}

          <div className="gallery-grid">
            {displayedPhotos.map(photo => (
              <PhotoCard
                key={photo.id}
                photo={photo}
                onVote={vote}
                canVote={votesLeft > 0}
                myReaction={votedPhotos[photo.id]}
                isOwnTeam={currentTeam?.id === photo.teamId}
                votingOpen={votingOpen}
              />
            ))}
            {displayedPhotos.length === 0 && (
              <div className="empty-gallery">
                <span>📭</span>
                <p>Aucune photo pour l'instant</p>
              </div>
            )}
          </div>

          <DownloadAll photos={photos} />
        </div>
      )}

      {/* ── Mes photos ─────────────────────────────────────────── */}
      {tab === 'mine' && currentTeam && (
        <div className="gallery-view">
          <div className="gallery-grid">
            {myPhotos.map(photo => (
              <PhotoCard
                key={photo.id}
                photo={photo}
                onVote={vote}
                canVote={false}
                myReaction={votedPhotos[photo.id]}
                isOwnTeam={true}
                votingOpen={false}
              />
            ))}
            {myPhotos.length === 0 && (
              <div className="empty-gallery">
                <span>📷</span>
                <p>Pas encore de photos pour votre équipe</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── Scoreboard ─────────────────────────────────────────── */}
      {tab === 'scoreboard' && (
        <div className="scoreboard-view">
          <Scoreboard photos={photos} teams={teams} />
        </div>
      )}
    </div>
  );
}

/* ── Router ─────────────────────────────────────────────────────── */
export default function App() {
  if (isSlideshow) return <Slideshow />;
  if (isQR)        return <QRPage />;
  if (isPodium)    return <PodiumReveal />;
  return <MainApp />;
}
