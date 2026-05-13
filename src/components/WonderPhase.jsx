import { useState, useEffect } from 'react'
import { playSound, speakText, speakPhaseIntro, stopSpeech } from '../utils/audio'

const CONTENT = {
  1: {
    emoji: '🍎',
    question: "If you have 8 apples in one basket and 7 in another, how do you find the total WITHOUT counting every single one?",
    subtext: "Addition is the secret superpower that lets you combine numbers instantly!",
    facts: [
      { emoji: '🌏', text: 'Addition is used every day \u2014 at the hawker centre, the MRT, the playground!' },
      { emoji: '🧮', text: 'Ancient Egyptians used addition over 4,000 years ago!' },
      { emoji: '🔟', text: 'The Ten-Frame makes adding within 20 super easy!' },
      { emoji: '🐸', text: 'A number line lets you hop your way to the answer like a frog!' },
    ],
  },
  2: {
    emoji: '🧁',
    question: "A bakery made 47 muffins in the morning and 36 in the afternoon \u2014 can you add those BIG numbers? What happens when ones add up to MORE than 9?",
    subtext: "Place value is the superpower behind adding big numbers!",
    facts: [
      { emoji: '🏗\uFE0F', text: 'Place value blocks make the invisible visible!' },
      { emoji: '💥', text: 'Regrouping means bundling 10 ones into 1 ten \u2014 like magic!' },
      { emoji: '🧠', text: 'Mental maths tricks help you add 2-digit numbers in seconds!' },
      { emoji: '📦', text: 'Column addition is how grown-ups add big numbers too!' },
    ],
  }
}

export default function WonderPhase({ part, onNext, audioEnabled }) {
  const c = CONTENT[part] || CONTENT[1]
  const [revealed, setRevealed] = useState(false)
  const [showCard, setShowCard] = useState(false)
  const [showBtn, setShowBtn] = useState(false)

  useEffect(() => {
    // Speak the phase intro narration first
    speakPhaseIntro('wonder', part, audioEnabled)

    const t1 = setTimeout(() => { setRevealed(true); playSound('pop', audioEnabled) }, 400)
    const t2 = setTimeout(() => {
      setShowCard(true)
      // After the intro has had time to play, read the question
      speakText(c.question, audioEnabled)
    }, 5000)
    const t3 = setTimeout(() => setShowBtn(true), 5500)
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); stopSpeech() }
  }, [audioEnabled, part])

  return (
    <div className="wonder-phase">
      {/* Animated question mark */}
      <div style={{ position: 'relative' }}>
        <div className="wonder-qmark" style={{ transform: revealed ? 'scale(1)' : 'scale(0)', transition: 'transform 0.6s cubic-bezier(0.34,1.56,0.64,1)' }}>
          <span className="wonder-qmark-icon">?</span>
        </div>
        {revealed && <div className="wonder-qmark-glow" style={{ position: 'absolute', inset: '-10px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(99,102,241,0.3), transparent 70%)', animation: 'pulse 2s infinite' }} />}
      </div>

      {/* Question card */}
      {showCard && (
        <div className="wonder-question-card" style={{ maxWidth: '560px' }}>
          <div style={{ fontSize: '3rem', marginBottom: '12px' }}>{c.emoji}</div>
          <p className="wonder-question-text">{c.question}</p>
          <p className="wonder-subtext">{c.subtext}</p>
        </div>
      )}

      {/* Fun facts */}
      {showCard && (
        <div className="wonder-facts" style={{ maxWidth: '560px', width: '100%' }}>
          {c.facts.map((f, i) => (
            <div key={i} className="wonder-fact" style={{ animationDelay: `${i * 0.1}s` }}>
              <div className="fact-emoji">{f.emoji}</div>
              <p>{f.text}</p>
            </div>
          ))}
        </div>
      )}

      {/* CTA */}
      {showBtn && (
        <button className="btn btn-wonder btn-lg" onClick={onNext} id="wonder-next-btn"
          style={{ animation: 'slideUp 0.5s ease' }}>
          ✨ Let&apos;s Find Out!
        </button>
      )}
    </div>
  )
}
