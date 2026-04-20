const MEDALS = ['🥇', '🥈', '🥉'];

export function Scoreboard({ photos, teams }) {
  const scores = teams
    .map(team => ({
      ...team,
      votes: photos
        .filter(p => p.teamId === team.id)
        .reduce((sum, p) => sum + (p.votes || 0), 0),
      photoCount: photos.filter(p => p.teamId === team.id).length,
    }))
    .sort((a, b) => b.votes - a.votes || a.name.localeCompare(b.name));

  const max = scores[0]?.votes || 1;

  if (!teams.length) {
    return <div className="empty">Aucune équipe pour l'instant</div>;
  }

  return (
    <div className="scoreboard">
      {scores.map((team, i) => (
        <div key={team.id} className={`score-row ${i < 3 ? `podium-${i + 1}` : ''}`}>
          <div className="rank">{MEDALS[i] ?? i + 1}</div>
          <div className="score-info">
            <div className="score-name">{team.name}</div>
            <div className="score-bar-track">
              <div
                className="score-bar-fill"
                style={{ width: `${max > 0 ? (team.votes / max) * 100 : 0}%` }}
              />
            </div>
            <div className="score-sub">{team.photoCount} photo{team.photoCount !== 1 ? 's' : ''}</div>
          </div>
          <div className="score-votes">
            <strong>{team.votes}</strong>
            <small> vote{team.votes !== 1 ? 's' : ''}</small>
          </div>
        </div>
      ))}
    </div>
  );
}
