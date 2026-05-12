import { useState, useEffect, useRef } from 'react'
import { generatePart1Questions, generatePart2Questions, getHint } from '../data/questions'

const QUESTIONS_PER_SET = 10
const TOTAL_QUESTIONS = 50

function Confetti() {
  const pieces = Array.from({ length: 40 }, (_, i) => ({
    id: i,
    left: Math.random() * 100,
    color: ['var(--coral)', 'var(--yellow)', 'var(--sky)', 'var(--purple)', 'var(--mint)'][i % 5],
    delay: Math.random() * 1.5,
    duration: Math.random() * 2 + 1.5,
    size: Math.random() * 10 + 6,
    shape: i % 3 === 0 ? '50%' : i % 3 === 1 ? '0' : '2px',
  }))
  return (
    <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 50 }}>
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

function StarDisplay({ count, max = 3 }) {
  return (
    <div className="stars-earned">
      {Array.from({ length: max }, (_, i) => (
        <span key={i} className={`star-earn ${i < count ? 'lit' : ''}`}
          style={{ opacity: i < count ? 1 : 0.2 }}>⭐</span>
      ))}
    </div>
  )
}

function MCQQuestion({ question, onAnswer, answered, selectedIdx }) {
  return (
    <div>
      <div className="question-type-badge">Multiple Choice</div>
      {question.context && (
        <p className="question-context">{question.context}</p>
      )}
      <p className="question-text">{question.text}</p>
      <div className="mcq-options">
        {question.options.map((opt, i) => {
          let cls = 'mcq-btn'
          if (answered) {
            if (opt === question.answer) cls += ' correct'
            else if (i === selectedIdx && opt !== question.answer) cls += ' wrong'
          }
          return (
            <button key={i} className={cls} disabled={answered}
              onClick={() => onAnswer(opt, i)}
              id={`mcq-opt-${i}`}>
              {opt}
            </button>
          )
        })}
      </div>
    </div>
  )
}

function FillQuestion({ question, onAnswer, answered }) {
  const [val, setVal] = useState('')
  const [submitted, setSubmitted] = useState(false)

  function submit() {
    if (!val) return
    setSubmitted(true)
    onAnswer(parseInt(val))
  }

  return (
    <div>
      <div className="question-type-badge">Fill in the Blank</div>
      {question.context && <p className="question-context">{question.context}</p>}
      <div className="fib-wrap">
        <span className="fib-num">{question.text.replace('= ', '= ').split('= ')[0] + '='}</span>
        <input
          className={`fib-input ${submitted && parseInt(val) === question.answer ? 'correct' : submitted ? 'wrong' : ''}`}
          type="number" value={val}
          onChange={e => setVal(e.target.value)}
          disabled={submitted || answered}
          onKeyDown={e => e.key === 'Enter' && !submitted && submit()}
          id="fib-input" aria-label="Enter your answer"
          min="0" max="200"
        />
      </div>
      <div className="digit-pad">
        {[1,2,3,4,5,6,7,8,9,0,'⌫'].map(d => (
          <button key={d} className="digit-btn"
            disabled={submitted || answered}
            onClick={() => {
              if (d === '⌫') setVal(v => v.slice(0, -1))
              else setVal(v => v.length < 3 ? v + d : v)
            }}
            aria-label={d === '⌫' ? 'Backspace' : String(d)}>
            {d}
          </button>
        ))}
        <button className="btn btn-sky btn-sm" disabled={!val || submitted || answered} onClick={submit} id="fib-submit-btn">
          Check ✓
        </button>
      </div>
    </div>
  )
}

export default function PlayPhase({ part, onNext, onBack, addStars, savePartResult }) {
  const seedRef = useRef(Date.now())
  const [questions] = useState(() => {
    const all = part === 1
      ? generatePart1Questions(seedRef.current)
      : generatePart2Questions(seedRef.current)
    return all.slice(0, TOTAL_QUESTIONS)
  })

  const [current, setCurrent] = useState(0)
  const [answered, setAnswered] = useState(false)
  const [selectedIdx, setSelectedIdx] = useState(null)
  const [isCorrect, setIsCorrect] = useState(null)
  const [hintsUsed, setHintsUsed] = useState(0)
  const [showHint, setShowHint] = useState(false)
  const [attempts, setAttempts] = useState(0)
  const [sessionStars, setSessionStars] = useState(0)
  const [streak, setStreak] = useState(0)
  const [results, setResults] = useState([]) // { correct, stars }
  const [showConfetti, setShowConfetti] = useState(false)
  const [setNum, setSetNum] = useState(0) // which set of 10 we're on
  const [done, setDone] = useState(false)

  const q = questions[current]
  const progress = ((current) / TOTAL_QUESTIONS) * 100
  const questionsInSet = QUESTIONS_PER_SET
  const setProgress = ((current % questionsInSet) / questionsInSet) * 100

  function handleAnswer(val, idx = null) {
    if (answered) return
    const correct = val === q.answer
    const att = attempts + 1
    setAttempts(att)
    setSelectedIdx(idx)

    if (correct) {
      const stars = hintsUsed > 0 ? 2 : att === 1 ? 3 : 1
      setIsCorrect(true)
      setAnswered(true)
      setSessionStars(s => s + stars)
      addStars(stars)
      const newStreak = streak + 1
      setStreak(newStreak)
      if (newStreak === 5) setShowConfetti(true)
      setResults(r => [...r, { correct: true, stars }])
    } else {
      if (att >= 2) {
        setIsCorrect(false)
        setAnswered(true)
        setStreak(0)
        setResults(r => [...r, { correct: false, stars: 0 }])
      } else {
        setIsCorrect(false)
        // Allow retry — don't lock
      }
    }
  }

  function useHint() {
    setHintsUsed(h => h + 1)
    setShowHint(true)
  }

  function nextQuestion() {
    setShowConfetti(false)
    const next = current + 1
    if (next >= TOTAL_QUESTIONS) {
      // Done!
      const correct = results.filter(r => r.correct).length + (isCorrect ? 1 : 0)
      const score = Math.round((correct / TOTAL_QUESTIONS) * 100)
      const totalStars = results.reduce((s, r) => s + r.stars, 0) + sessionStars
      savePartResult(part, score, totalStars)
      setDone(true)
    } else {
      setCurrent(next)
      setAnswered(false)
      setSelectedIdx(null)
      setIsCorrect(null)
      setHintsUsed(0)
      setShowHint(false)
      setAttempts(0)
      if (next % QUESTIONS_PER_SET === 0) setSetNum(s => s + 1)
    }
  }

  if (done) {
    const correct = results.filter(r => r.correct).length
    const score = Math.round((correct / TOTAL_QUESTIONS) * 100)
    return (
      <div style={{ textAlign: 'center', padding: '20px' }}>
        <div style={{ fontSize: '4rem', marginBottom: '12px' }}>
          {score >= 90 ? '🏆' : score >= 75 ? '🥈' : score >= 60 ? '🥉' : '💪'}
        </div>
        <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '2rem', marginBottom: '8px' }}>
          {score >= 90 ? 'Addition Champion!' : score >= 75 ? 'Super Adder!' : score >= 60 ? 'Great Effort!' : 'Keep Practising!'}
        </h2>
        <p style={{ color: 'rgba(255,255,255,0.7)', marginBottom: '24px' }}>You scored {score}% — {correct} out of {TOTAL_QUESTIONS} correct!</p>
        <button className="btn btn-primary btn-lg" onClick={onNext} id="play-done-btn">
          See Your Results 🏆 →
        </button>
      </div>
    )
  }

  return (
    <div>
      {showConfetti && <Confetti />}

      {/* Header */}
      <div className="play-header">
        <div>
          <div style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.5)', marginBottom: '4px' }}>
            Question {current + 1} of {TOTAL_QUESTIONS}
          </div>
          <div className="progress-bar-wrap" style={{ width: '180px' }}>
            <div className="progress-bar-fill" style={{ width: `${progress}%` }} />
          </div>
        </div>

        <div style={{ display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap' }}>
          {streak >= 3 && (
            <div className="streak-banner">🔥 {streak} in a row!</div>
          )}
          <div style={{ fontWeight: 800, fontSize: '1rem' }}>⭐ {sessionStars}</div>
        </div>
      </div>

      {/* Question */}
      <div className="play-question-box">
        {q.type === 'mcq' || q.type === 'missing' || q.type === 'word' ? (
          <MCQQuestion question={q} onAnswer={handleAnswer} answered={answered} selectedIdx={selectedIdx} />
        ) : (
          <FillQuestion question={q} onAnswer={handleAnswer} answered={answered} />
        )}
      </div>

      {/* Hint */}
      {!answered && (
        <div style={{ textAlign: 'center', marginTop: '12px' }}>
          <button className="btn btn-ghost btn-sm" onClick={useHint} disabled={showHint} id="hint-btn">
            💡 Hint {hintsUsed > 0 ? '(used)' : '(-1 ⭐)'}
          </button>
        </div>
      )}

      {showHint && !answered && (
        <div className="hint-box">
          <p>{getHint(q)}</p>
        </div>
      )}

      {/* Feedback */}
      {answered && (
        <div>
          <div className={`feedback-bar ${isCorrect ? 'correct' : 'wrong'}`}>
            {isCorrect
              ? `✅ Correct! ${hintsUsed > 0 ? 'With hint' : attempts === 1 ? 'First try!' : 'Second try!'}`
              : `❌ The answer is ${q.answer}. Don't worry, keep going!`}
          </div>
          <StarDisplay count={isCorrect ? (hintsUsed > 0 ? 2 : attempts === 1 ? 3 : 1) : 0} />
          <div style={{ textAlign: 'center', marginTop: '16px' }}>
            <button className="btn btn-primary" onClick={nextQuestion} id="next-question-btn">
              {current + 1 >= TOTAL_QUESTIONS ? 'See Results 🏆' : 'Next Question →'}
            </button>
          </div>
        </div>
      )}

      {/* Not answered yet, show wrong feedback without locking */}
      {!answered && isCorrect === false && (
        <div className="feedback-bar wrong">
          ❌ Not quite! Try again or use a hint.
        </div>
      )}
    </div>
  )
}
