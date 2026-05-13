import { useState, useCallback } from 'react'
import LandingScreen from './components/LandingScreen'
import WonderPhase from './components/WonderPhase'
import StoryPhase from './components/StoryPhase'
import SimulatePhase from './components/SimulatePhase'
import PlayPhase from './components/PlayPhase'
import ReflectPhase from './components/ReflectPhase'
import FloatingNumbers from './components/FloatingNumbers'
import { playSound, stopSpeech } from './utils/audio'

const PHASES = [
  { id: 'wonder', label: 'Wonder', icon: '🔍', num: '01' },
  { id: 'story', label: 'Story', icon: '📖', num: '02' },
  { id: 'simulate', label: 'Simulate', icon: '🧪', num: '03' },
  { id: 'play', label: 'Play', icon: '🎮', num: '04' },
  { id: 'reflect', label: 'Reflect', icon: '📓', num: '05' },
]

const STORAGE_KEY = 'intellia_addition_v2'

function saveProgress(state) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...state, timestamp: Date.now() }))
  } catch {}
}

function loadProgress() {
  try {
    const d = localStorage.getItem(STORAGE_KEY)
    return d ? JSON.parse(d) : null
  } catch { return null }
}

export default function App() {
  const [phase, setPhase] = useState('landing')
  const [part, setPart] = useState(null)
  const [audioEnabled, setAudioEnabled] = useState(true)
  const [playStats, setPlayStats] = useState(null)
  const saved = loadProgress()

  const goHome = useCallback(() => {
    stopSpeech()
    setPhase('landing')
    setPart(null)
    setPlayStats(null)
  }, [])

  function startPart(p) {
    stopSpeech()
    setPart(p)
    setPhase('wonder')
    playSound('click', audioEnabled)
  }

  const currentPhaseIndex = PHASES.findIndex(p => p.id === phase)

  function handlePlayComplete(stats) {
    setPlayStats(stats)
    saveProgress({ part, stats, phase: 'reflect' })
    setPhase('reflect')
  }

  const isJourney = phase !== 'landing'

  return (
    <>
      <FloatingNumbers />
      <div className="app-container" style={{ position: 'relative', zIndex: 1, width: '100%', minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', overflowY: 'auto' }}>

        {/* Audio toggle */}
        <button onClick={() => setAudioEnabled(a => !a)} className="audio-toggle-btn" aria-label="Toggle audio">
          {audioEnabled ? '🔊' : '🔇'}
        </button>

        {/* Journey bar */}
        {isJourney && (
          <div className="journey-bar">
            {PHASES.map((p, i) => (
              <div key={p.id} className={`journey-step ${p.id === phase ? 'active' : i < currentPhaseIndex ? 'completed' : ''}`}>
                <div className="journey-step-dot">
                  {i < currentPhaseIndex ? '✓' : p.num}
                </div>
                <span className="journey-step-label">{p.icon} {p.label}</span>
                {i < PHASES.length - 1 && (
                  <div className={`journey-connector ${i < currentPhaseIndex ? 'filled' : ''}`} />
                )}
              </div>
            ))}
          </div>
        )}

        {/* Home button */}
        {isJourney && (
          <button className="home-btn" onClick={goHome} aria-label="Go home">🏠 Home</button>
        )}

        {/* Phases */}
        {phase === 'landing' && (
          <LandingScreen onSelectPart={startPart} saved={saved} audioEnabled={audioEnabled} />
        )}

        {phase === 'wonder' && (
          <div className="content-area">
            <div className="content-card" style={{ marginTop: '60px' }}>
              <WonderPhase part={part} onNext={() => { stopSpeech(); setPhase('story'); playSound('click', audioEnabled) }} audioEnabled={audioEnabled} />
            </div>
          </div>
        )}

        {phase === 'story' && (
          <div className="content-area">
            <div className="content-card" style={{ marginTop: '60px', padding: 0, overflow: 'hidden' }}>
              <StoryPhase part={part} onNext={() => { stopSpeech(); setPhase('simulate'); playSound('click', audioEnabled) }} onBack={() => { stopSpeech(); setPhase('wonder') }} audioEnabled={audioEnabled} />
            </div>
          </div>
        )}

        {phase === 'simulate' && (
          <div className="content-area">
            <div className="content-card" style={{ marginTop: '60px' }}>
              <SimulatePhase part={part} onNext={() => { stopSpeech(); setPhase('play'); playSound('click', audioEnabled) }} onBack={() => { stopSpeech(); setPhase('story') }} audioEnabled={audioEnabled} />
            </div>
          </div>
        )}

        {phase === 'play' && (
          <div className="content-area" style={{ marginTop: '60px' }}>
            <PlayPhase part={part} onComplete={handlePlayComplete} audioEnabled={audioEnabled} />
          </div>
        )}

        {phase === 'reflect' && (
          <div className="content-area" style={{ marginTop: '60px' }}>
            <ReflectPhase
              part={part}
              stats={playStats}
              onRestart={() => { setPhase('wonder') }}
              onGoHome={goHome}
              onNextPart={() => { setPart(2); setPhase('wonder') }}
              audioEnabled={audioEnabled}
            />
          </div>
        )}
      </div>
    </>
  )
}
