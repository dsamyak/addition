import { useEffect, useState } from 'react'
import { speakText } from '../utils/audio'

function Confetti() {
  const pieces = Array.from({ length: 60 }, (_, i) => ({
    id: i,
    left: Math.random() * 100,
    color: ['#ff6b6b', '#ffe66d', '#4ecdc4', '#6c63ff', '#a8edea'][i % 5],
    delay: Math.random() * 2,
    duration: Math.random() * 2 + 2,
    size: Math.random() * 12 + 6,
    shape: i % 3 === 0 ? '50%' : '0',
  }))
  return (
    <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 100 }}>
      {pieces.map(p => (
        <div key={p.id} className="confetti-piece" style={{
          left: `${p.left}%`,
          width: p.size, height: p.size,
          background: p.color,
          borderRadius: p.shape,
          animationDuration: `${p.duration}s`,
          animationDelay: `${p.delay}s`,
        }} />
      ))}
    </div>
  )
}

export default function ReflectPhase({ part, stats, onRestart, onGoHome, onNextPart, audioEnabled }) {
  const [showConfetti, setShowConfetti] = useState(true)

  // Use stats object from PlayPhase → App
  const score = stats?.score ?? 0
  const totalCorrect = stats?.totalCorrect ?? 0
  const totalStars = stats?.totalStars ?? 0
  const totalQuestions = stats?.totalQuestions ?? 50

  useEffect(() => {
    const t = setTimeout(() => setShowConfetti(false), 4000)
    return () => clearTimeout(t)
  }, [])

  // Speak the result on mount
  useEffect(() => {
    const msg = score >= 90
      ? `Amazing! You scored ${score} percent! You are an Addition Champion!`
      : score >= 75
      ? `Great job! You scored ${score} percent! You are a Super Adder!`
      : score >= 60
      ? `Good effort! You scored ${score} percent! Keep going!`
      : `You scored ${score} percent. Don't worry, practice makes perfect!`
    const timer = setTimeout(() => speakText(msg, audioEnabled), 600)
    return () => clearTimeout(timer)
  }, [score, audioEnabled])

  const badge = score >= 90
    ? { emoji: '🏆', label: 'Addition Champion!', color: '#ffd700', bg: 'rgba(255,215,0,0.15)' }
    : score >= 75
    ? { emoji: '🥈', label: 'Super Adder!', color: '#c0c0c0', bg: 'rgba(192,192,192,0.15)' }
    : score >= 60
    ? { emoji: '🥉', label: 'Great Effort!', color: '#cd7f32', bg: 'rgba(205,127,50,0.15)' }
    : { emoji: '💪', label: 'Keep Practising!', color: 'var(--sky)', bg: 'rgba(78,205,196,0.15)' }

  const masteryItems = part === 1
    ? ['1-digit + 1-digit', '1-digit + 2-digit', 'Missing Addend', 'Word Problems']
    : ['Without Regrouping (2+1)', 'Without Regrouping (2+2)', 'With Regrouping', 'Missing Addend', 'Word Problems']

  // Calculate per-world scores if available
  const worldData = stats?.worlds || []

  return (
    <div className="reflect-hero">
      {showConfetti && <Confetti />}

      <span className="badge-display">{badge.emoji}</span>

      <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: 'clamp(1.8rem, 4vw, 2.5rem)', marginBottom: '8px' }}>
        {badge.label}
      </h2>
      <p style={{ color: 'rgba(255,255,255,0.65)', fontSize: '1rem', marginBottom: '32px' }}>
        Part {part}: Addition Within {part === 1 ? '20' : '100'} — Complete!
      </p>

      <div className="score-stats">
        <div className="stat-card">
          <div className="stat-val" style={{ color: badge.color }}>{score}%</div>
          <div className="stat-label">Score</div>
        </div>
        <div className="stat-card">
          <div className="stat-val" style={{ color: 'var(--yellow)' }}>⭐ {totalStars}</div>
          <div className="stat-label">Stars Earned</div>
        </div>
        <div className="stat-card">
          <div className="stat-val" style={{ color: 'var(--sky)' }}>{totalCorrect}/{totalQuestions}</div>
          <div className="stat-label">Correct</div>
        </div>
      </div>

      {/* Mastery section */}
      <div style={{ marginBottom: '28px', textAlign: 'left' }}>
        <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.2rem', marginBottom: '16px', textAlign: 'center' }}>
          📊 Skills Covered
        </h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {masteryItems.map((item, i) => {
            // Use actual world data if available, otherwise estimate
            const worldRes = worldData[i]
            const pct = worldRes ? Math.round((worldRes.score / 10) * 100) : Math.min(100, Math.max(20, score - i * 5))
            return (
              <div key={item}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '4px' }}>
                  <span style={{ color: 'rgba(255,255,255,0.8)' }}>{item}</span>
                  <span style={{ color: 'var(--yellow)', fontWeight: 700 }}>{pct}%</span>
                </div>
                <div className="progress-bar-wrap">
                  <div className="progress-bar-fill" style={{ width: `${pct}%`, transition: 'width 1s ease' }} />
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Badge card */}
      <div style={{
        background: badge.bg, border: `2px solid ${badge.color}33`,
        borderRadius: '20px', padding: '24px', marginBottom: '28px',
        display: 'inline-block', minWidth: '240px'
      }}>
        <div style={{ fontSize: '3rem', marginBottom: '8px' }}>{badge.emoji}</div>
        <div style={{ fontFamily: 'var(--font-heading)', fontSize: '1.3rem', color: badge.color }}>{badge.label}</div>
        <div style={{ fontSize: '0.82rem', color: 'rgba(255,255,255,0.5)', marginTop: '4px' }}>
          Addition Within {part === 1 ? '20' : '100'} · {score}%
        </div>
      </div>

      <div className="reflect-actions">
        <button className="btn btn-ghost" onClick={onGoHome} id="reflect-home-btn">
          🏠 Home
        </button>
        {onRestart && (
          <button className="btn btn-outline" onClick={onRestart} id="reflect-retry-btn">
            🔄 Try Again
          </button>
        )}
        {part === 1 && onNextPart && (
          <button className="btn btn-sky" onClick={onNextPart} id="reflect-part2-btn">
            Go to Part 2 →
          </button>
        )}
        <button className="btn btn-primary btn-lg" onClick={onGoHome} id="reflect-finish-btn">
          🎉 Finish
        </button>
      </div>

      <p style={{ fontSize: '0.82rem', color: 'rgba(255,255,255,0.35)', marginTop: '24px' }}>
        Your progress is saved automatically. Return anytime to beat your score!
      </p>
    </div>
  )
}
