import { useState, useEffect } from 'react'
import LandingScreen from './components/LandingScreen'
import WonderPhase from './components/WonderPhase'
import StoryPhase from './components/StoryPhase'
import SimulatePhase from './components/SimulatePhase'
import PlayPhase from './components/PlayPhase'
import ReflectPhase from './components/ReflectPhase'
import Header from './components/Header'

const PHASES = ['wonder', 'story', 'simulate', 'play', 'reflect']
const PHASE_LABELS = { wonder: '🌟', story: '📖', simulate: '🧪', play: '🎮', reflect: '🏆' }

function Bubbles() {
  const bubbles = Array.from({ length: 12 }, (_, i) => ({
    id: i,
    size: Math.random() * 60 + 20,
    left: Math.random() * 100,
    duration: Math.random() * 15 + 10,
    delay: Math.random() * 10,
  }))
  return (
    <div className="bubbles">
      {bubbles.map(b => (
        <div key={b.id} className="bubble" style={{
          width: b.size, height: b.size,
          left: `${b.left}%`,
          animationDuration: `${b.duration}s`,
          animationDelay: `${b.delay}s`,
        }} />
      ))}
    </div>
  )
}

export default function App() {
  const [screen, setScreen] = useState('landing') // 'landing' | 'journey'
  const [part, setPart] = useState(null) // 1 | 2
  const [phase, setPhase] = useState(0) // 0-4 index into PHASES
  const [totalStars, setTotalStars] = useState(() => {
    try { return parseInt(localStorage.getItem('addition_total_stars') || '0') } catch { return 0 }
  })
  const [partProgress, setPartProgress] = useState(() => {
    try { return JSON.parse(localStorage.getItem('addition_progress') || '{}') } catch { return {} }
  })
  const [soundOn, setSoundOn] = useState(true)

  useEffect(() => {
    try { localStorage.setItem('addition_total_stars', String(totalStars)) } catch {}
  }, [totalStars])

  useEffect(() => {
    try { localStorage.setItem('addition_progress', JSON.stringify(partProgress)) } catch {}
  }, [partProgress])

  function startPart(partNum) {
    setPart(partNum)
    setPhase(0)
    setScreen('journey')
  }

  function nextPhase() {
    if (phase < PHASES.length - 1) setPhase(p => p + 1)
  }

  function prevPhase() {
    if (phase > 0) setPhase(p => p - 1)
  }

  function goHome() {
    setScreen('landing')
    setPart(null)
    setPhase(0)
  }

  function addStars(n) {
    setTotalStars(s => s + n)
  }

  function savePartResult(partNum, score, stars) {
    setPartProgress(prev => ({
      ...prev,
      [partNum]: { score, stars, date: Date.now() }
    }))
  }

  const currentPhase = PHASES[phase]

  return (
    <>
      <div className="stars-bg" />
      <Bubbles />
      <Header
        screen={screen}
        part={part}
        phase={phase}
        phases={PHASES}
        phaseLabels={PHASE_LABELS}
        totalStars={totalStars}
        soundOn={soundOn}
        setSoundOn={setSoundOn}
        goHome={goHome}
      />

      {screen === 'landing' && (
        <LandingScreen
          onSelectPart={startPart}
          partProgress={partProgress}
          totalStars={totalStars}
        />
      )}

      {screen === 'journey' && (
        <div className="content-area">
          <div className="content-card">
            {currentPhase === 'wonder' && (
              <WonderPhase part={part} onNext={nextPhase} soundOn={soundOn} />
            )}
            {currentPhase === 'story' && (
              <StoryPhase part={part} onNext={nextPhase} onBack={prevPhase} soundOn={soundOn} />
            )}
            {currentPhase === 'simulate' && (
              <SimulatePhase part={part} onNext={nextPhase} onBack={prevPhase} soundOn={soundOn} />
            )}
            {currentPhase === 'play' && (
              <PlayPhase
                part={part}
                onNext={nextPhase}
                onBack={prevPhase}
                addStars={addStars}
                savePartResult={savePartResult}
                soundOn={soundOn}
              />
            )}
            {currentPhase === 'reflect' && (
              <ReflectPhase
                part={part}
                partProgress={partProgress}
                totalStars={totalStars}
                onGoHome={goHome}
                onNextPart={() => { setPart(2); setPhase(0) }}
                soundOn={soundOn}
              />
            )}
          </div>
        </div>
      )}
    </>
  )
}
