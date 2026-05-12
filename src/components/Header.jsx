export default function Header({ screen, part, phase, phases, phaseLabels, totalStars, soundOn, setSoundOn, goHome }) {
  return (
    <header className="app-header">
      <div className="logo" onClick={goHome} style={{ cursor: 'pointer' }}>
        ➕ <span>Intellia</span>
      </div>

      {screen === 'journey' && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap', justifyContent: 'center' }}>
          {phases.map((p, i) => (
            <div key={p} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <div className={`phase-dot ${i === phase ? 'active' : i < phase ? 'done' : ''}`}>
                {phaseLabels[p]}
              </div>
              {i < phases.length - 1 && (
                <div className={`phase-connector ${i < phase ? 'done' : ''}`} />
              )}
            </div>
          ))}
        </div>
      )}

      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <div className="stars-display">
          <span className="star-icon">⭐</span>
          <span>{totalStars}</span>
        </div>
        <button
          className="btn btn-ghost btn-sm"
          onClick={() => setSoundOn(s => !s)}
          aria-label={soundOn ? 'Mute sound' : 'Unmute sound'}
          style={{ fontSize: '1.2rem', padding: '8px 12px' }}
        >
          {soundOn ? '🔊' : '🔇'}
        </button>
        {screen === 'journey' && (
          <button className="btn btn-ghost btn-sm" onClick={goHome} aria-label="Go home">
            🏠
          </button>
        )}
      </div>
    </header>
  )
}
