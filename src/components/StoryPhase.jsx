import { useState, useEffect } from 'react'
import { STORY_PART1, STORY_PART2 } from '../data/storyContent'
import { playSound, speakText, stopSpeech } from '../utils/audio'

export default function StoryPhase({ part, onNext, onBack, audioEnabled }) {
  const slides = part === 1 ? STORY_PART1 : STORY_PART2
  const [current, setCurrent] = useState(0)
  const slide = slides[current]
  const isLast = current === slides.length - 1
  const progress = ((current + 1) / slides.length) * 100

  // Speak the story slide text aloud
  useEffect(() => {
    const timer = setTimeout(() => {
      speakText(slide.text, audioEnabled)
    }, 500)
    return () => { clearTimeout(timer); stopSpeech() }
  }, [current, audioEnabled])

  function highlightText(text, word) {
    if (!word) return text
    const parts = text.split(new RegExp(`(${word})`, 'gi'))
    return parts.map((p, i) =>
      p.toLowerCase() === word.toLowerCase()
        ? <strong key={i} className="highlight">{p}</strong>
        : p
    )
  }

  function goNext() {
    playSound('cardFlip', audioEnabled)
    if (isLast) onNext()
    else setCurrent(c => c + 1)
  }

  function goBack() {
    if (current === 0) onBack()
    else setCurrent(c => c - 1)
  }

  return (
    <div className="story-phase" style={{ padding: '24px' }}>
      {/* Progress bar */}
      <div className="story-progress">
        <div className="story-progress-bar">
          <div className="story-progress-fill" style={{ width: `${progress}%` }} />
        </div>
        <span className="story-progress-label">{current + 1}/{slides.length}</span>
      </div>

      {/* Story card with image */}
      <div className="story-card-enhanced" key={current}>
        {slide.image && (
          <div className="story-image-section">
            <img src={slide.image} alt={slide.title} className="story-image" />
            <div className="story-image-overlay" />
          </div>
        )}
        {!slide.image && (
          <div className="story-image-section" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ fontSize: '6rem' }}>{slide.emoji}</span>
          </div>
        )}
        <div className="story-text-section">
          <h3 className="story-title-enhanced">{slide.title}</h3>
          <p className="story-text-enhanced">
            {highlightText(slide.text, slide.highlight)}
          </p>
        </div>
      </div>

      {/* Navigation dots */}
      <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
        {slides.map((_, i) => (
          <div key={i} onClick={() => setCurrent(i)} role="button" tabIndex={0}
            style={{
              width: i === current ? '24px' : '10px', height: '10px', borderRadius: '5px',
              background: i < current ? 'var(--green)' : i === current ? 'var(--gold)' : 'rgba(255,255,255,0.2)',
              boxShadow: i === current ? '0 0 8px rgba(255,193,7,0.4)' : 'none',
              cursor: 'pointer', transition: 'all 0.3s ease',
            }}
            aria-label={`Go to slide ${i + 1}`}
          />
        ))}
      </div>

      {/* Nav buttons */}
      <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'center' }}>
        <button className="btn btn-outline btn-sm" onClick={goBack}>← Back</button>
        <button className={`btn ${isLast ? 'btn-primary' : 'btn-outline'}`} onClick={goNext} id="story-next-btn">
          {isLast ? 'Try It Yourself! 🧪' : 'Next →'}
        </button>
      </div>
    </div>
  )
}
