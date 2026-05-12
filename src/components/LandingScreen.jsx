export default function LandingScreen({ onSelectPart, saved }) {
  const JOURNEY = [
    { icon: '🔍', label: 'Wonder', desc: 'Get curious' },
    { icon: '📖', label: 'Story', desc: 'Learn why' },
    { icon: '🧪', label: 'Simulate', desc: 'Try it' },
    { icon: '🎮', label: 'Play', desc: '10 × 5 worlds' },
    { icon: '📓', label: 'Reflect', desc: 'Review' },
  ]

  return (
    <div className="intro-screen">
      <div className="intro-badge">✨ Singapore Primary 1 Mathematics</div>
      <h1 className="intro-title">
        Let&apos;s{' '}<span style={{ color: 'var(--gold)' }}>Add!</span>
      </h1>
      <p className="intro-desc">
        Master addition within 20 and 100 through stories, simulations, and fun games!
      </p>

      {/* Part Selection Cards */}
      <div className="part-cards" style={{ marginTop: '24px' }}>
        <div className="part-card part1" onClick={() => onSelectPart(1)} role="button" tabIndex={0}
          onKeyDown={e => e.key === 'Enter' && onSelectPart(1)} aria-label="Start Part 1">
          <span className="part-emoji">🔢</span>
          <h2 style={{ color: 'var(--gold)' }}>Addition Within 20</h2>
          <p>Ten-frames, number lines &amp; counting strategies</p>
          <span className="part-badge" style={{ background: 'rgba(255,193,7,0.2)', color: 'var(--gold)' }}>Part 1 · 5 Worlds</span>
          {saved?.part === 1 && saved?.stats && (
            <div style={{ marginTop: '10px', fontSize: '0.82rem', color: 'var(--text-muted)' }}>
              ✅ Score: {saved.stats.score}% · ⭐ {saved.stats.totalStars}
            </div>
          )}
        </div>

        <div className="part-card part2" onClick={() => onSelectPart(2)} role="button" tabIndex={0}
          onKeyDown={e => e.key === 'Enter' && onSelectPart(2)} aria-label="Start Part 2">
          <span className="part-emoji">💯</span>
          <h2 style={{ color: 'var(--gold)' }}>Addition Within 100</h2>
          <p>Place value blocks &amp; regrouping mastery</p>
          <span className="part-badge" style={{ background: 'rgba(255,193,7,0.2)', color: 'var(--gold)' }}>Part 2 · 5 Worlds</span>
          {saved?.part === 2 && saved?.stats && (
            <div style={{ marginTop: '10px', fontSize: '0.82rem', color: 'var(--text-muted)' }}>
              ✅ Score: {saved.stats.score}% · ⭐ {saved.stats.totalStars}
            </div>
          )}
        </div>
      </div>

      {/* Journey Map */}
      <div className="intro-journey-map">
        <h3 className="intro-journey-title">Your Learning Journey</h3>
        <div className="intro-journey-steps">
          {JOURNEY.map((step, i) => (
            <div key={step.label} style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{ fontSize: '1.4rem', width: '36px', height: '36px', borderRadius: '50%', background: 'rgba(255,255,255,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {step.icon}
                </div>
                <div style={{ textAlign: 'left' }}>
                  <div style={{ fontFamily: 'var(--font-heading)', fontSize: '0.8rem', fontWeight: 600 }}>{step.label}</div>
                  <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>{step.desc}</div>
                </div>
              </div>
              {i < JOURNEY.length - 1 && (
                <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem', margin: '0 4px' }}>→</span>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
