import { useState, useEffect, useMemo, useRef } from 'react';
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

// Palette par équipe (ordre alphabétique des équipes)
const TEAM_COLORS = [
  { accent: '#e74c3c', dark: '#c0392b', light: '#fdeaea', bg: '#fdf6f6', headerText: '#fff' }, // 1 Rouge
  { accent: '#2980b9', dark: '#1a5276', light: '#d6eaf8', bg: '#f0f6fc', headerText: '#fff' }, // 2 Bleu
  { accent: '#27ae60', dark: '#1e8449', light: '#d5f5e3', bg: '#f0fdf6', headerText: '#fff' }, // 3 Vert
  { accent: '#e67e22', dark: '#ca6f1e', light: '#fdebd0', bg: '#fdf6ee', headerText: '#fff' }, // 4 Orange
  { accent: '#e91e8c', dark: '#c2186e', light: '#fce4f2', bg: '#fdf3f9', headerText: '#fff' }, // 5 Fuschia
  { accent: '#f1c40f', dark: '#d4ac0d', light: '#fef9e7', bg: '#fffef5', headerText: '#5a3e00', logoFilter: 'brightness(0) saturate(0) opacity(0.6)' }, // 6 Jaune
  { accent: '#8e44ad', dark: '#6c3483', light: '#f4ecf7', bg: '#fdf8ff', headerText: '#fff', rainbow: true }, // 7 Arc-en-ciel
];

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

  // Applique la couleur de l'équipe sur tout le thème CSS
  useEffect(() => {
    if (!currentTeam || teams.length === 0) return;
    const idx   = teams.findIndex(t => t.id === currentTeam.id);
    const color = TEAM_COLORS[idx % TEAM_COLORS.length];
    const root  = document.documentElement;
    root.style.setProperty('--accent',       color.accent);
    root.style.setProperty('--accent-dark',  color.dark);
    root.style.setProperty('--accent-light', color.light);
    root.style.setProperty('--bg',           color.bg);
    root.style.setProperty('--header-text',  color.headerText);
    if (color.logoFilter) root.style.setProperty('--logo-filter', color.logoFilter);
    else root.style.removeProperty('--logo-filter');
    // Arc-en-ciel : classe spéciale sur le body
    if (color.rainbow) document.body.classList.add('rainbow-team');
    else document.body.classList.remove('rainbow-team');
    // Barre navigateur (Android Chrome / Safari)
    document.querySelector('meta[name="theme-color"]')
      ?.setAttribute('content', color.accent);
    return () => {
      root.style.removeProperty('--accent');
      root.style.removeProperty('--accent-dark');
      root.style.removeProperty('--accent-light');
      root.style.removeProperty('--bg');
      root.style.removeProperty('--header-text');
      root.style.removeProperty('--logo-filter');
      document.body.classList.remove('rainbow-team');
      document.querySelector('meta[name="theme-color"]')
        ?.setAttribute('content', '#ff6b35');
    };
  }, [currentTeam, teams]);

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
