import { useState } from 'react';
import {
  collection, doc, setDoc, deleteDoc, serverTimestamp,
  addDoc, getDocs, writeBatch,
} from 'firebase/firestore';
import { db } from '../lib/firebase';

const TEST_PHOTOS = [
  { seed: 10, teamKey: 0 }, { seed: 20, teamKey: 1 }, { seed: 30, teamKey: 2 },
  { seed: 40, teamKey: 3 }, { seed: 50, teamKey: 4 }, { seed: 60, teamKey: 5 },
  { seed: 70, teamKey: 6 }, { seed: 11, teamKey: 0 }, { seed: 21, teamKey: 1 },
  { seed: 31, teamKey: 2 }, { seed: 41, teamKey: 3 }, { seed: 51, teamKey: 4 },
  { seed: 61, teamKey: 5 }, { seed: 71, teamKey: 6 }, { seed: 12, teamKey: 0 },
  { seed: 22, teamKey: 1 }, { seed: 32, teamKey: 2 }, { seed: 42, teamKey: 3 },
];
import { useTeams } from '../hooks/useTeams';
import { usePhotos } from '../hooks/usePhotos';

const DEFAULT_TEAMS = [
  'Les Aigles', 'Les Loups', 'Les Renards', 'Les Lynx',
  'Les Faucons', 'Les Ours', 'Les Panthers',
];

function slugify(str) {
  return str
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '');
}

export function AdminPanel({ settings, onToggleVoting }) {
  const { teams } = useTeams();
  const { photos } = usePhotos();
  const [newTeam, setNewTeam] = useState('');
  const [creating, setCreating] = useState(false);
  const [copied, setCopied] = useState('');
  const [testBusy, setTestBusy] = useState('');

  const baseUrl = window.location.origin + window.location.pathname;

  async function createTestData() {
    setTestBusy('Création des équipes…');
    const teamList = [];
    for (const name of DEFAULT_TEAMS) {
      const id = slugify(name);
      await setDoc(doc(db, 'teams', id), { name, createdAt: serverTimestamp() });
      teamList.push({ id, name });
    }
    setTestBusy('Ajout des photos de test…');
    for (const p of TEST_PHOTOS) {
      const team = teamList[p.teamKey];
      await addDoc(collection(db, 'photos'), {
        teamId:   team.id,
        teamName: team.name,
        url:      `https://picsum.photos/seed/${p.seed}/800/800`,
        deviceId: 'test-device',
        votes:    Math.floor(Math.random() * 6),
        uploadedAt: serverTimestamp(),
      });
    }
    setTestBusy('');
  }

  async function clearAllData() {
    if (!window.confirm('Effacer TOUTES les photos et tous les votes ? (Les équipes sont conservées)')) return;
    setTestBusy('Suppression…');
    const batch = writeBatch(db);
    const [photosSnap, votesSnap] = await Promise.all([
      getDocs(collection(db, 'photos')),
      getDocs(collection(db, 'votes')),
    ]);
    photosSnap.docs.forEach(d => batch.delete(d.ref));
    votesSnap.docs.forEach(d => batch.delete(d.ref));
    await batch.commit();
    setTestBusy('');
  }

  async function createTeam(name) {
    const trimmed = name.trim();
    if (!trimmed) return;
    setCreating(true);
    const id = slugify(trimmed);
    await setDoc(doc(db, 'teams', id), { name: trimmed, createdAt: serverTimestamp() });
    setNewTeam('');
    setCreating(false);
  }

  async function createDefaultTeams() {
    for (const name of DEFAULT_TEAMS) {
      await setDoc(doc(db, 'teams', slugify(name)), { name, createdAt: serverTimestamp() });
    }
  }

  async function deleteTeam(id) {
    if (!window.confirm('Supprimer cette équipe et ses données ?')) return;
    await deleteDoc(doc(db, 'teams', id));
  }

  function copyLink(teamId) {
    const url = `${baseUrl}?team=${teamId}`;
    navigator.clipboard.writeText(url).then(() => {
      setCopied(teamId);
      setTimeout(() => setCopied(''), 1500);
    });
  }

  const totalVotes = photos.reduce((s, p) => s + (p.votes || 0), 0);

  return (
    <div className="admin-panel">
      <h1>⚙️ Administration</h1>

      {/* Test data */}
      <section className="admin-section test-section">
        <h2>🧪 Mode test</h2>
        <p className="status-hint" style={{ marginBottom: 12 }}>
          Peuple l'app avec de fausses photos pour tester avant le jour J.
          Pense à tout effacer avant d'envoyer les vrais liens !
        </p>
        <div className="test-btn-row">
          <button
            className="test-create-btn"
            onClick={createTestData}
            disabled={!!testBusy}
          >
            {testBusy || '🎲 Créer données de test'}
          </button>
          <button
            className="test-clear-btn"
            onClick={clearAllData}
            disabled={!!testBusy}
          >
            🗑 Tout effacer
          </button>
        </div>
      </section>

      {/* Votes control */}
      <section className="admin-section">
        <h2>Votes</h2>
        <button
          className={`toggle-vote-btn ${settings?.votingOpen ? 'open' : 'closed'}`}
          onClick={onToggleVoting}
        >
          {settings?.votingOpen ? '🔴 Fermer les votes' : '🟢 Ouvrir les votes'}
        </button>
        <p className="status-hint">
          {settings?.votingOpen
            ? '✅ Les participants peuvent voter'
            : '⛔ Les votes sont désactivés'}
        </p>
      </section>

      {/* Teams */}
      <section className="admin-section">
        <h2>Équipes ({teams.length})</h2>

        {teams.length === 0 && (
          <button className="create-defaults-btn" onClick={createDefaultTeams}>
            Créer les 7 équipes par défaut
          </button>
        )}

        <div className="team-list">
          {teams.map(team => {
            const teamPhotos = photos.filter(p => p.teamId === team.id).length;
            const teamVotes = photos
              .filter(p => p.teamId === team.id)
              .reduce((s, p) => s + (p.votes || 0), 0);
            const link = `${baseUrl}?team=${team.id}`;
            return (
              <div key={team.id} className="admin-team-row">
                <div className="admin-team-info">
                  <strong>{team.name}</strong>
                  <div className="admin-team-stats">
                    {teamPhotos} photo{teamPhotos !== 1 ? 's' : ''} · {teamVotes} vote{teamVotes !== 1 ? 's' : ''}
                  </div>
                  <div className="admin-link-row">
                    <span className="admin-link-text">?team={team.id}</span>
                    <button
                      className="copy-btn"
                      onClick={() => copyLink(team.id)}
                    >
                      {copied === team.id ? '✓' : '📋'}
                    </button>
                    <a
                      href={link}
                      target="_blank"
                      rel="noreferrer"
                      className="open-btn"
                    >
                      ↗
                    </a>
                  </div>
                </div>
                <button
                  className="delete-team-btn"
                  onClick={() => deleteTeam(team.id)}
                  title="Supprimer"
                >
                  ✕
                </button>
              </div>
            );
          })}
        </div>

        <div className="add-team-row">
          <input
            className="add-team-input"
            value={newTeam}
            onChange={e => setNewTeam(e.target.value)}
            placeholder="Nom de l'équipe"
            onKeyDown={e => e.key === 'Enter' && createTeam(newTeam)}
          />
          <button
            className="add-team-btn"
            onClick={() => createTeam(newTeam)}
            disabled={creating || !newTeam.trim()}
          >
            Ajouter
          </button>
        </div>
      </section>

      {/* Stats */}
      <section className="admin-section">
        <h2>Stats globales</h2>
        <div className="admin-stats-grid">
          <div className="stat-card">
            <div className="stat-num">{photos.length}</div>
            <div className="stat-label">photos</div>
          </div>
          <div className="stat-card">
            <div className="stat-num">{totalVotes}</div>
            <div className="stat-label">votes</div>
          </div>
          <div className="stat-card">
            <div className="stat-num">{teams.length}</div>
            <div className="stat-label">équipes</div>
          </div>
        </div>
      </section>
    </div>
  );
}
