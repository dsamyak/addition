import { useState, useCallback } from 'react'
import { generatePart1Questions, generatePart2Questions, getHint } from '../data/questions'
import { playSound } from '../utils/audio'

const WORLDS_P1 = [
  { id: 'w1', icon: '🔢', name: 'Number Basics', desc: '1-digit + 1-digit', color: '#6366f1' },
  { id: 'w2', icon: '🔟', name: 'Ten-Frame Valley', desc: 'Fill the frames!', color: '#8b5cf6' },
  { id: 'w3', icon: '🐸', name: 'Number Line Park', desc: 'Hop to answers', color: '#4ecdc4' },
  { id: 'w4', icon: '❓', name: 'Missing Numbers', desc: 'Find the blank', color: '#f59e0b' },
  { id: 'w5', icon: '📖', name: 'Story Land', desc: 'Word problems', color: '#ef4444' },
]
const WORLDS_P2 = [
  { id: 'w1', icon: '📦', name: 'Place Value Plains', desc: '2-digit + 1-digit', color: '#6366f1' },
  { id: 'w2', icon: '🛤️', name: 'No-Regroup Road', desc: '2-digit + 2-digit', color: '#8b5cf6' },
  { id: 'w3', icon: '🌊', name: 'Regroup Rapids', desc: 'Carry the ten!', color: '#ef4444' },
  { id: 'w4', icon: '❓', name: 'Missing Numbers', desc: 'Find the blank', color: '#f59e0b' },
  { id: 'w5', icon: '📖', name: 'Story Town', desc: 'Word problems', color: '#4ecdc4' },
]

function Confetti() {
  const pieces = Array.from({ length: 50 }, (_, i) => ({
    id: i, left: Math.random() * 100,
    color: ['#ffc107','#4caf50','#6366f1','#ef5350','#4ecdc4'][i % 5],
    delay: Math.random() * 1.5, duration: Math.random() * 2 + 1.5,
    size: Math.random() * 10 + 6,
  }))
  return (
    <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 300 }}>
      {pieces.map(p => (
        <div key={p.id} className="confetti-piece" style={{
          left: `${p.left}%`, width: p.size, height: p.size,
          background: p.color, borderRadius: p.id % 2 ? '50%' : '2px',
          animationDuration: `${p.duration}s`, animationDelay: `${p.delay}s`,
        }} />
      ))}
    </div>
  )
}

export default function PlayPhase({ part, onComplete, audioEnabled }) {
  const worlds = part === 1 ? WORLDS_P1 : WORLDS_P2
  const [allQuestions] = useState(() => {
    const qs = part === 1 ? generatePart1Questions(Date.now()) : generatePart2Questions(Date.now())
    return qs.slice(0, 50)
  })

  const [currentWorld, setCurrentWorld] = useState(0)
  const [worldResults, setWorldResults] = useState(Array(5).fill(null))
  const [playing, setPlaying] = useState(false)
  const [qIndex, setQIndex] = useState(0)
  const [answered, setAnswered] = useState(false)
  const [selectedIdx, setSelectedIdx] = useState(null)
  const [isCorrect, setIsCorrect] = useState(null)
  const [showFeedback, setShowFeedback] = useState(false)
  const [worldScore, setWorldScore] = useState(0)
  const [worldStars, setWorldStars] = useState(0)
  const [hintsUsed, setHintsUsed] = useState(0)
  const [showHint, setShowHint] = useState(false)
  const [attempts, setAttempts] = useState(0)
  const [showWorldComplete, setShowWorldComplete] = useState(false)
  const [showConfetti, setShowConfetti] = useState(false)
  const [done, setDone] = useState(false)
  const [val, setVal] = useState('')

  const worldQs = allQuestions.slice(currentWorld * 10, currentWorld * 10 + 10)
  const q = worldQs[qIndex]

  function startWorld(idx) {
    if (idx > 0 && !worldResults[idx - 1]) return
    setCurrentWorld(idx)
    setPlaying(true)
    setQIndex(0)
    resetQ()
    setWorldScore(0)
    setWorldStars(0)
    playSound('click', audioEnabled)
  }

  function resetQ() {
    setAnswered(false)
    setSelectedIdx(null)
    setIsCorrect(null)
    setShowFeedback(false)
    setHintsUsed(0)
    setShowHint(false)
    setAttempts(0)
    setVal('')
  }

  function handleAnswer(value, idx) {
    if (answered) return
    const correct = value === q.answer
    const att = attempts + 1
    setAttempts(att)
    setSelectedIdx(idx)

    if (correct) {
      const stars = hintsUsed > 0 ? 1 : att === 1 ? 3 : 2
      setIsCorrect(true)
      setAnswered(true)
      setWorldScore(s => s + 1)
      setWorldStars(s => s + stars)
      playSound('correct', audioEnabled)
      setTimeout(() => setShowFeedback(true), 300)
    } else {
      setIsCorrect(false)
      if (att >= 2) {
        setAnswered(true)
        playSound('wrong', audioEnabled)
        setTimeout(() => setShowFeedback(true), 300)
      } else {
        playSound('wrong', audioEnabled)
      }
    }
  }

  function handleFillSubmit() {
    if (!val) return
    handleAnswer(parseInt(val), null)
  }

  function nextQuestion() {
    setShowFeedback(false)
    if (qIndex + 1 >= 10) {
      const stars = Math.min(3, Math.round((worldScore / 10) * 3))
      const res = { score: worldScore, stars: worldStars, starsEarned: stars }
      const newResults = [...worldResults]
      newResults[currentWorld] = res
      setWorldResults(newResults)
      setShowWorldComplete(true)
      if (stars >= 2) { setShowConfetti(true); playSound('worldComplete', audioEnabled) }
      else playSound('star', audioEnabled)
    } else {
      setQIndex(i => i + 1)
      resetQ()
    }
  }

  function finishWorld() {
    setShowWorldComplete(false)
    setShowConfetti(false)
    setPlaying(false)
    if (currentWorld >= 4) {
      const totalScore = worldResults.filter(Boolean).reduce((s, r) => s + r.score, 0) + worldResults[currentWorld]?.score
      const totalStars = worldResults.filter(Boolean).reduce((s, r) => s + r.worldStars, 0)
      setDone(true)
    }
  }

  function finishAll() {
    const totalCorrect = worldResults.filter(Boolean).reduce((s, r) => s + r.score, 0)
    const totalStars = worldResults.filter(Boolean).reduce((s, r) => s + r.stars, 0)
    const score = Math.round((totalCorrect / 50) * 100)
    onComplete({ score, totalCorrect, totalStars, totalQuestions: 50, worlds: worldResults })
  }

  // World Complete overlay
  if (showWorldComplete) {
    const res = worldResults[currentWorld]
    const starCount = Math.min(3, Math.round((res?.score || 0) / 10 * 3))
    return (
      <div style={{ width: '100%', maxWidth: '900px' }}>
        {showConfetti && <Confetti />}
        <div className="world-complete-card">
          <div style={{ fontSize: '3rem', marginBottom: '12px' }}>{worlds[currentWorld].icon}</div>
          <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.6rem', marginBottom: '8px' }}>
            {starCount >= 2 ? 'World Complete!' : 'Keep Practising!'}
          </h2>
          <div style={{ fontFamily: 'var(--font-heading)', fontSize: '2rem', color: 'var(--gold)', margin: '12px 0' }}>
            {res?.score}/10 Correct
          </div>
          <div className="world-complete-stars">
            {[0,1,2].map(i => <span key={i} className={`world-star ${i < starCount ? 'earned' : ''}`}>⭐</span>)}
          </div>
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', marginTop: '20px', flexWrap: 'wrap' }}>
            {currentWorld < 4 ? (
              <button className="btn btn-primary" onClick={finishWorld}>Next World →</button>
            ) : (
              <button className="btn btn-primary" onClick={() => { finishWorld(); setTimeout(finishAll, 100) }}>See Results 🏆</button>
            )}
          </div>
        </div>
      </div>
    )
  }

  // World Map view
  if (!playing && !done) {
    return (
      <div style={{ width: '100%', maxWidth: '900px' }}>
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.6rem', marginBottom: '8px' }}>
            🎮 Addition {part === 1 ? 'Within 20' : 'Within 100'}
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>Complete all 5 worlds!</p>
          <div style={{ display: 'inline-block', marginTop: '8px', padding: '6px 16px', borderRadius: 'var(--radius-full)', background: 'rgba(255,193,7,0.15)', border: '1px solid rgba(255,193,7,0.3)', fontWeight: 700, color: 'var(--gold)' }}>
            ⭐ {worldResults.filter(Boolean).reduce((s, r) => s + r.stars, 0)} XP
          </div>
        </div>
        <div className="world-map">
          {worlds.map((w, i) => {
            const unlocked = i === 0 || worldResults[i - 1]
            const completed = !!worldResults[i]
            const res = worldResults[i]
            const starCount = res ? Math.min(3, Math.round(res.score / 10 * 3)) : 0
            return (
              <div key={w.id}>
                <div
                  className={`world-card ${unlocked ? 'unlocked' : 'locked'} ${completed ? 'completed' : ''} ${unlocked && !completed ? 'active' : ''}`}
                  onClick={() => unlocked && startWorld(i)}
                  style={{ borderColor: completed ? 'var(--green)' : unlocked && !completed ? w.color : undefined }}
                >
                  <div className="world-icon">{w.icon}</div>
                  <div className="world-info">
                    <div className="world-name">{w.name}</div>
                    <div className="world-desc">{w.desc}</div>
                    {completed && (
                      <div className="world-stars">
                        {[0,1,2].map(j => <span key={j} style={{ opacity: j < starCount ? 1 : 0.2 }}>⭐</span>)}
                        <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginLeft: '8px' }}>{res.score}/10</span>
                      </div>
                    )}
                  </div>
                  {!unlocked && <span className="world-lock">🔒</span>}
                  {unlocked && !completed && (
                    <span style={{ padding: '6px 16px', borderRadius: 'var(--radius-full)', background: w.color, color: 'white', fontFamily: 'var(--font-heading)', fontWeight: 600, fontSize: '0.85rem' }}>Play</span>
                  )}
                </div>
                {i < worlds.length - 1 && (
                  <div className={`world-connector ${completed ? 'active' : ''}`} />
                )}
              </div>
            )
          })}
        </div>
      </div>
    )
  }

  // Done — all worlds complete
  if (done) {
    return (
      <div style={{ width: '100%', maxWidth: '900px', textAlign: 'center' }}>
        <div style={{ fontSize: '4rem', marginBottom: '12px' }}>🎉</div>
        <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '2rem', marginBottom: '12px' }}>All Worlds Complete!</h2>
        <button className="btn btn-primary btn-lg" onClick={finishAll}>See Your Results 🏆</button>
      </div>
    )
  }

  // Question view
  if (!q) return null
  const isFill = q.type === 'fill'

  return (
    <div style={{ width: '100%', maxWidth: '700px' }}>
      {/* HUD */}
      <div className="hud">
        <div className="hud-item">❓ {qIndex + 1}/10</div>
        <div className="hud-item" style={{ color: 'var(--gold)' }}>⭐ {worldStars}</div>
        <div className="hud-item">✅ {worldScore}</div>
      </div>

      {/* Progress */}
      <div style={{ marginBottom: '16px' }}>
        <div style={{ height: '6px', background: 'rgba(255,255,255,0.1)', borderRadius: '9999px', overflow: 'hidden' }}>
          <div style={{ height: '100%', width: `${((qIndex + 1) / 10) * 100}%`, background: 'linear-gradient(90deg, var(--purple-light), var(--gold))', borderRadius: '9999px', transition: 'width 0.5s ease' }} />
        </div>
      </div>

      {/* Question card */}
      <div className="question-card">
        <div style={{ fontSize: '0.75rem', color: 'var(--gold)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '16px' }}>
          {worlds[currentWorld].icon} {worlds[currentWorld].name}
        </div>

        {q.context && <p style={{ color: 'var(--text-secondary)', marginBottom: '16px', lineHeight: 1.6 }}>{q.context}</p>}

        <p style={{ fontFamily: 'var(--font-heading)', fontSize: '1.3rem', fontWeight: 500, lineHeight: 1.6, margin: '16px 0 24px' }}>{q.text}</p>

        {/* MCQ */}
        {!isFill && q.options && (
          <div className="options-grid">
            {q.options.map((opt, i) => {
              let cls = 'option-btn'
              if (answered) {
                if (opt === q.answer) cls += ' correct'
                else if (i === selectedIdx) cls += ' wrong'
                cls += ' disabled'
              }
              return (
                <button key={i} className={cls} onClick={() => handleAnswer(opt, i)} id={`opt-${i}`}>
                  {opt}
                </button>
              )
            })}
          </div>
        )}

        {/* Fill-in */}
        {isFill && (
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', margin: '20px 0' }}>
              <input
                className={`fib-input ${answered && isCorrect ? 'correct' : answered ? 'wrong' : ''}`}
                type="number" value={val}
                onChange={e => setVal(e.target.value)}
                disabled={answered}
                onKeyDown={e => e.key === 'Enter' && !answered && handleFillSubmit()}
                aria-label="Enter your answer" min="0" max="200"
                style={{ width: '80px', height: '80px', fontSize: '2rem' }}
              />
            </div>
            {!answered && (
              <button className="btn btn-primary btn-sm" onClick={handleFillSubmit} disabled={!val}>Check ✓</button>
            )}
          </div>
        )}

        {/* Hint */}
        {!answered && (
          <div style={{ marginTop: '16px' }}>
            <button className="btn btn-outline btn-sm" onClick={() => { setHintsUsed(h => h + 1); setShowHint(true) }}
              disabled={showHint} style={{ fontSize: '0.85rem' }}>
              💡 {showHint ? 'Hint shown' : 'Use Hint (-1⭐)'}
            </button>
          </div>
        )}
        {showHint && !answered && (
          <div style={{ marginTop: '12px', padding: '12px 16px', background: 'rgba(255,193,7,0.1)', border: '1px solid rgba(255,193,7,0.2)', borderRadius: 'var(--radius-md)', fontSize: '0.9rem', color: 'var(--gold-light)', fontStyle: 'italic' }}>
            {getHint(q)}
          </div>
        )}

        {/* Wrong but retryable */}
        {!answered && isCorrect === false && (
          <div style={{ marginTop: '12px', padding: '10px', background: 'rgba(239,83,80,0.15)', border: '1px solid rgba(239,83,80,0.3)', borderRadius: 'var(--radius-md)', fontSize: '0.9rem', color: '#ef9a9a' }}>
            ❌ Not quite! Try again.
          </div>
        )}
      </div>

      {/* Feedback overlay */}
      {showFeedback && (
        <div className="feedback-overlay" onClick={nextQuestion}>
          <div className={`feedback-content ${isCorrect ? 'correct' : 'wrong'}`}>
            <div className="feedback-emoji">{isCorrect ? '🎉' : '😔'}</div>
            <div className="feedback-message">{isCorrect ? 'Correct!' : 'Not this time'}</div>
            <div className="feedback-sub">
              {isCorrect ? `+${hintsUsed > 0 ? 1 : attempts === 1 ? 3 : 2} ⭐` : `Answer: ${q.answer}`}
            </div>
            <button className="btn btn-sm" onClick={nextQuestion}
              style={{ marginTop: '16px', background: 'rgba(255,255,255,0.2)', color: 'white', border: 'none' }}>
              {qIndex + 1 >= 10 ? 'See World Score' : 'Next →'}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
