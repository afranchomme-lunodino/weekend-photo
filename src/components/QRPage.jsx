import { useTeams } from '../hooks/useTeams';

const BASE_URL = window.location.origin;

function QRCode({ url, size = 180 }) {
  const src = `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=${encodeURIComponent(url)}&margin=12&color=1a1a1a`;
  return <img src={src} alt="QR Code" width={size} height={size} />;
}

export function QRPage() {
  const { teams, loading } = useTeams();

  if (loading) return <div className="qr-loading">Chargement…</div>;

  return (
    <div className="qr-root">

      {/* Barre d'actions — masquée à l'impression */}
      <div className="qr-toolbar no-print">
        <h1>📱 QR Codes équipes</h1>
        <div className="qr-toolbar-actions">
          <button className="qr-print-btn" onClick={() => window.print()}>
            🖨 Imprimer
          </button>
          <a href="/?admin" className="qr-back-btn">← Retour admin</a>
        </div>
      </div>

      <p className="qr-hint no-print">
        Chaque équipe scanne son QR code avec l'iPhone pour accéder à son espace photo.
      </p>

      {/* Grille QR codes */}
      <div className="qr-grid">
        {teams.map(team => {
          const url = `${BASE_URL}/?team=${team.id}`;
          return (
            <div key={team.id} className="qr-card">
              <div className="qr-card-logo">📸 Weekend Photo</div>
              <div className="qr-team-name">{team.name}</div>
              <div className="qr-code-wrap">
                <QRCode url={url} size={200} />
              </div>
              <div className="qr-url">{url.replace('https://', '')}</div>
            </div>
          );
        })}
      </div>

      {teams.length === 0 && (
        <div className="qr-empty">
          Aucune équipe — crée-les d'abord depuis le panneau admin.
        </div>
      )}
    </div>
  );
}
