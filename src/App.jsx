import { useState, useEffect } from 'react';
import { doc, onSnapshot, setDoc } from 'firebase/firestore';
import { db } from './lib/firebase';
import { useTeams } from './hooks/useTeams';
import { usePhotos } from './hooks/usePhotos';
import { useVotes } from './hooks/useVotes';
import { PhotoCard } from './components/PhotoCard';
import { UploadZone } from './components/UploadZone';
import { Scoreboard } from './components/Scoreboard';
import { DownloadAll } from './components/DownloadAll';
import { AdminPanel } from './components/AdminPanel';

function useSettings() {
  const [settings, setSettings] = useState(null);
  useEffect(() => {
    return onSnapshot(doc(db, 'settings', 'main'), (snap) => {
      setSettings(snap.exists() ? snap.data() : { votingOpen: false });
    });
  }, []);
  return settings;
}

async function toggleVoting(current) {
  await setDoc(doc(db, 'settings', 'main'), { votingOpen: !current });
}

export default function App() {
  const params = new URLSearchParams(window.location.search);
  const teamParam = params.get('team');
  const isAdmin = params.has('admin');
  const [tab, setTab] = useState('gallery');
  const [filter, setFilter] = useState('all');

  const { teams } = useTeams();
  const { photos } = usePhotos();
  const settings = useSettings();
  const currentTeam = teams.find(t => t.id === teamParam) ?? null;
  const { votesLeft, votedPhotoIds, vote } = useVotes(currentTeam?.id);

  const displayedPhotos = filter === 'all'
    ? photos
    : photos.filter(p => p.teamId === filter);

  if (isAdmin) {
    return (
      <AdminPanel
        settings={settings}
        onToggleVoting={() => toggleVoting(settings?.votingOpen)}
      />
    );
  }

  return (
    <div className="app">
      <header className="app-header">
        <div className="header-top">
          <h1>📸 Weekend Photo</h1>
          {settings?.votingOpen && currentTeam && (
            <div className="votes-badge">
              {votesLeft} vote{votesLeft !== 1 ? 's' : ''}
            </div>
          )}
        </div>
        {currentTeam && (
          <div className="team-tag">{currentTeam.name}</div>
        )}
      </header>

      {currentTeam && (
        <div className="upload-section">
          <UploadZone team={currentTeam} />
        </div>
      )}

      <nav className="tabs">
        <button
          className={tab === 'gallery' ? 'tab active' : 'tab'}
          onClick={() => setTab('gallery')}
        >
          Galerie
          <span className="tab-count">{photos.length}</span>
        </button>
        <button
          className={tab === 'scoreboard' ? 'tab active' : 'tab'}
          onClick={() => setTab('scoreboard')}
        >
          Classement
        </button>
      </nav>

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
                hasVoted={votedPhotoIds.includes(photo.id)}
                isOwnTeam={currentTeam?.id === photo.teamId}
                votingOpen={settings?.votingOpen ?? false}
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

      {tab === 'scoreboard' && (
        <div className="scoreboard-view">
          <Scoreboard photos={photos} teams={teams} />
        </div>
      )}
    </div>
  );
}
