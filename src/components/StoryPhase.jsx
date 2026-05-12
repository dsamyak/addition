import { useState } from 'react'
import { STORY_PART1, STORY_PART2 } from '../data/storyContent'

export default function StoryPhase({ part, onNext, onBack }) {
  const slides = part === 1 ? STORY_PART1 : STORY_PART2
  const [current, setCurrent] = useState(0)

  const slide = slides[current]
  const isLast = current === slides.length - 1

  function highlightText(text, word) {
    if (!word) return text
    const parts = text.split(new RegExp(`(${word})`, 'gi'))
    return parts.map((p, i) =>
      p.toLowerCase() === word.toLowerCase()
        ? <strong key={i} className="highlight">{p}</strong>
        : p
    )
  }

  return (
    <div>
      <div style={{ textAlign: 'center', marginBottom: '24px' }}>
        <span style={{
          background: part === 1 ? 'rgba(255,107,107,0.2)' : 'rgba(78,205,196,0.2)',
          color: part === 1 ? 'var(--coral)' : 'var(--sky)',
          padding: '4px 16px', borderRadius: '50px', fontSize: '0.82rem', fontWeight: 700
        }}>
          📖 Story Time — Part {part}
        </span>
      </div>

      <div className="story-slides">
        <div className="story-slide" key={current}>
          <div className="story-slide-img">{slide.emoji}</div>
          <h3 className="story-slide h3" style={{
            fontFamily: 'var(--font-heading)', fontSize: '1.8rem', marginBottom: '12px'
          }}>{slide.title}</h3>
          <p style={{ fontSize: '1.05rem', lineHeight: 1.8, color: 'rgba(255,255,255,0.9)' }}>
            {highlightText(slide.text, slide.highlight)}
          </p>
        </div>
      </div>

      <div className="slide-dots">
        {slides.map((_, i) => (
          <div
            key={i}
            className={`slide-dot ${i === current ? 'active' : ''}`}
            onClick={() => setCurrent(i)}
            role="button"
            aria-label={`Go to slide ${i + 1}`}
          />
        ))}
      </div>

      <div className="story-nav">
        <button
          className="btn btn-ghost"
          onClick={() => current === 0 ? onBack() : setCurrent(c => c - 1)}
          id="story-back-btn"
        >
          ← Back
        </button>

        <span style={{ fontSize: '0.9rem', color: 'rgba(255,255,255,0.5)' }}>
          {current + 1} / {slides.length}
        </span>

        <button
          className={`btn ${isLast ? 'btn-primary' : 'btn-secondary'}`}
          onClick={() => isLast ? onNext() : setCurrent(c => c + 1)}
          id="story-next-btn"
        >
          {isLast ? 'Try It Yourself! →' : 'Next →'}
        </button>
      </div>
    </div>
  )
}
