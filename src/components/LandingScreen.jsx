export default function LandingScreen({ onSelectPart, partProgress, totalStars }) {
  const p1 = partProgress[1]
  const p2 = partProgress[2]

  return (
    <div className="content-area">
      <div className="landing-hero" style={{ width: '100%', maxWidth: '900px' }}>
        <div style={{ fontSize: '5rem', marginBottom: '16px', animation: 'bounce 2s ease infinite' }}>➕</div>
        <h1 className="landing-title">Let's Add!</h1>
        <p className="landing-subtitle">Singapore Primary 1 Mathematics · Addition Within 20 &amp; 100</p>

        {totalStars > 0 && (
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: '8px',
            background: 'rgba(255,230,109,0.15)', border: '1px solid rgba(255,230,109,0.3)',
            borderRadius: '50px', padding: '8px 20px', marginBottom: '32px',
            fontSize: '0.95rem', fontWeight: 700
          }}>
            ⭐ You have {totalStars} stars! Keep going!
          </div>
        )}

        <div className="part-cards">
          <div className="part-card part1" onClick={() => onSelectPart(1)} role="button" tabIndex={0}
            onKeyDown={e => e.key === 'Enter' && onSelectPart(1)} aria-label="Start Part 1: Addition Within 20">
            <span className="part-emoji">🔢</span>
            <h2 style={{ color: '#ff6b6b' }}>Addition Within 20</h2>
            <p>Learn to add numbers up to 20 using ten-frames, number lines &amp; counting strategies.</p>
            <span className="part-badge">Part 1 · 50 Questions</span>
            {p1 && (
              <div style={{ marginTop: '12px', fontSize: '0.82rem', color: 'rgba(255,255,255,0.5)' }}>
                ✅ Last score: {p1.score}% · ⭐ {p1.stars} stars
              </div>
            )}
          </div>

          <div className="part-card part2" onClick={() => onSelectPart(2)} role="button" tabIndex={0}
            onKeyDown={e => e.key === 'Enter' && onSelectPart(2)} aria-label="Start Part 2: Addition Within 100">
            <span className="part-emoji">💯</span>
            <h2 style={{ color: '#4ecdc4' }}>Addition Within 100</h2>
            <p>Master adding 2-digit numbers with and without regrouping using place value blocks.</p>
            <span className="part-badge">Part 2 · 50 Questions</span>
            {p2 && (
              <div style={{ marginTop: '12px', fontSize: '0.82rem', color: 'rgba(255,255,255,0.5)' }}>
                ✅ Last score: {p2.score}% · ⭐ {p2.stars} stars
              </div>
            )}
          </div>
        </div>

        <div style={{ marginTop: '48px', display: 'flex', gap: '32px', justifyContent: 'center', flexWrap: 'wrap' }}>
          {[
            { icon: '🌟', label: 'Wonder', desc: 'Get curious!' },
            { icon: '📖', label: 'Story', desc: 'Learn through story' },
            { icon: '🧪', label: 'Simulate', desc: 'Hands-on fun' },
            { icon: '🎮', label: 'Play', desc: '50 questions' },
            { icon: '🏆', label: 'Reflect', desc: 'Earn your badge' },
          ].map(ph => (
            <div key={ph.label} style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '2rem' }}>{ph.icon}</div>
              <div style={{ fontWeight: 800, fontSize: '0.9rem', marginTop: '4px' }}>{ph.label}</div>
              <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.5)' }}>{ph.desc}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
