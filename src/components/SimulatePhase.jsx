import { useState, useEffect } from 'react'
import { speakPhaseIntro, stopSpeech } from '../utils/audio'

// ── Number Line Simulation ──────────────────────────────────────────────────
function NumberLineSim() {
  const MAX = 20
  const [start, setStart] = useState(7)
  const [hops, setHops] = useState(5)
  const [currentPos, setCurrentPos] = useState(null)
  const [done, setDone] = useState(false)
  const answer = start + hops

  function hop() {
    if (done) return
    setCurrentPos(answer)
    setDone(true)
  }
  function reset() { setCurrentPos(null); setDone(false) }

  return (
    <div>
      <div style={{ display: 'flex', gap: '24px', justifyContent: 'center', marginBottom: '20px', flexWrap: 'wrap' }}>
        <div style={{ textAlign: 'center' }}>
          <label style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.6)', display: 'block', marginBottom: '6px' }}>Start number</label>
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            <button className="btn btn-ghost btn-sm" onClick={() => { setStart(s => Math.max(0, s - 1)); reset() }}>−</button>
            <span style={{ fontFamily: 'var(--font-heading)', fontSize: '2rem', minWidth: '40px', textAlign: 'center', color: 'var(--coral)' }}>{start}</span>
            <button className="btn btn-ghost btn-sm" onClick={() => { setStart(s => Math.min(15, s + 1)); reset() }}>+</button>
          </div>
        </div>
        <div style={{ fontFamily: 'var(--font-heading)', fontSize: '3rem', display: 'flex', alignItems: 'center', color: 'rgba(255,255,255,0.4)' }}>+</div>
        <div style={{ textAlign: 'center' }}>
          <label style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.6)', display: 'block', marginBottom: '6px' }}>Hops</label>
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            <button className="btn btn-ghost btn-sm" onClick={() => { setHops(h => Math.max(1, h - 1)); reset() }}>−</button>
            <span style={{ fontFamily: 'var(--font-heading)', fontSize: '2rem', minWidth: '40px', textAlign: 'center', color: 'var(--sky)' }}>{hops}</span>
            <button className="btn btn-ghost btn-sm" onClick={() => { setHops(h => Math.min(10, h + 1)); reset() }}>+</button>
          </div>
        </div>
      </div>

      <div className="number-line-wrap">
        <div style={{ position: 'relative', display: 'flex', alignItems: 'flex-end', justifyContent: 'center', minWidth: '600px', paddingBottom: '36px', paddingTop: '60px', margin: '0 auto' }}>
          {/* baseline */}
          <div style={{ position: 'absolute', bottom: '28px', left: 0, right: 0, height: '3px', background: 'rgba(255,255,255,0.2)', borderRadius: '2px' }} />

          {/* arc */}
          {done && (
            <div style={{
              position: 'absolute',
              bottom: '31px',
              left: `${(start / MAX) * 100}%`,
              width: `${(hops / MAX) * 100}%`,
              height: '50px',
              borderTop: '3px solid var(--yellow)',
              borderRadius: '50% 50% 0 0',
              pointerEvents: 'none',
            }} />
          )}

          {/* frog */}
          <div style={{
            position: 'absolute',
            bottom: '36px',
            left: `${((currentPos ?? start) / MAX) * 100}%`,
            transform: 'translateX(-50%)',
            fontSize: '1.8rem',
            transition: 'left 0.8s cubic-bezier(0.175,0.885,0.32,1.275)',
            zIndex: 2,
          }}>🐸</div>

          {/* ticks */}
          {Array.from({ length: MAX + 1 }, (_, i) => (
            <div key={i} className="nl-tick" style={{ position: 'absolute', bottom: '0', left: `${(i / MAX) * 100}%`, transform: 'translateX(-50%)' }}>
              <div style={{
                width: '2px',
                height: i === start ? '24px' : i === answer && done ? '24px' : '14px',
                background: i === start ? 'var(--coral)' : i === answer && done ? 'var(--sky)' : 'rgba(255,255,255,0.3)',
                borderRadius: '1px',
              }} />
              <div style={{ fontSize: '0.75rem', fontWeight: 700, marginTop: '4px', color: i === start ? 'var(--coral)' : i === answer && done ? 'var(--sky)' : 'rgba(255,255,255,0.6)' }}>{i}</div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ textAlign: 'center', marginTop: '16px' }}>
        {!done ? (
          <button className="btn btn-primary" onClick={hop} id="nl-hop-btn">
            🐸 Hop! ({start} + {hops})
          </button>
        ) : (
          <div>
            <div style={{ fontFamily: 'var(--font-heading)', fontSize: '2rem', marginBottom: '12px', color: 'var(--yellow)' }}>
              {start} + {hops} = <span style={{ color: 'var(--sky)' }}>{answer}</span> 🎉
            </div>
            <button className="btn btn-ghost btn-sm" onClick={reset}>Try another →</button>
          </div>
        )}
      </div>
    </div>
  )
}

// ── Ten Frame Simulation ────────────────────────────────────────────────────
function TenFrameSim() {
  const [a, setA] = useState(8)
  const [b, setB] = useState(7)

  const total = a + b
  const cells = Array.from({ length: 20 }, (_, i) => {
    if (i < a) return 'a'
    if (i < total && i < 20) return 'b'
    return 'empty'
  })
  const frame1 = cells.slice(0, 10)
  const frame2 = cells.slice(10, 20)

  return (
    <div>
      <div style={{ display: 'flex', gap: '24px', justifyContent: 'center', marginBottom: '24px', flexWrap: 'wrap' }}>
        {[{ label: 'First number', val: a, set: setA, color: 'var(--coral)', max: 10 },
          { label: 'Second number', val: b, set: setB, color: 'var(--sky)', max: 10 }].map(({ label, val, set, color, max }) => (
          <div key={label} style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.6)', marginBottom: '6px' }}>{label}</div>
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
              <button className="btn btn-ghost btn-sm" onClick={() => set(v => Math.max(1, v - 1))}>−</button>
              <span style={{ fontFamily: 'var(--font-heading)', fontSize: '2rem', minWidth: '40px', textAlign: 'center', color }}>{val}</span>
              <button className="btn btn-ghost btn-sm" onClick={() => set(v => Math.min(max, v + 1))}>+</button>
            </div>
          </div>
        ))}
      </div>

      <div style={{ fontFamily: 'var(--font-heading)', fontSize: '1.4rem', textAlign: 'center', marginBottom: '20px' }}>
        <span style={{ color: 'var(--coral)' }}>{a}</span> + <span style={{ color: 'var(--sky)' }}>{b}</span> = ?
      </div>

      <div className="ten-frames">
        {[frame1, frame2].map((frame, fi) => (
          <div key={fi}>
            <div style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.5)', textAlign: 'center', marginBottom: '6px' }}>Frame {fi + 1}</div>
            <div className="ten-frame">
              {frame.map((cell, ci) => (
                <div key={ci} className={`tf-cell ${cell === 'a' ? 'filled' : cell === 'b' ? 'filled-b' : ''}`}>
                  {cell === 'a' ? '🔴' : cell === 'b' ? '🔵' : ''}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div style={{ textAlign: 'center', marginTop: '20px', fontFamily: 'var(--font-heading)', fontSize: '2rem', color: 'var(--yellow)' }}>
        {a} + {b} = {total} ✨
      </div>
    </div>
  )
}

// ── Place Value Mat (Part 2) ────────────────────────────────────────────────
function PlaceValueSim() {
  const [tens1, setTens1] = useState(4)
  const [ones1, setOnes1] = useState(7)
  const [tens2, setTens2] = useState(3)
  const [ones2, setOnes2] = useState(6)
  const [regrouped, setRegrouped] = useState(false)

  const totalOnes = ones1 + ones2
  const needsRegroup = totalOnes >= 10
  const finalOnes = needsRegroup && regrouped ? totalOnes - 10 : totalOnes
  const carryTen = needsRegroup && regrouped ? 1 : 0
  const totalTens = tens1 + tens2 + carryTen
  const total = totalTens * 10 + (needsRegroup && regrouped ? finalOnes : totalOnes)

  const a = tens1 * 10 + ones1
  const b = tens2 * 10 + ones2

  function reset() { setRegrouped(false) }

  const Input = ({ val, set, max = 9 }) => (
    <div style={{ display: 'flex', gap: '6px', alignItems: 'center', justifyContent: 'center' }}>
      <button className="btn btn-ghost btn-sm" onClick={() => { set(v => Math.max(0, v - 1)); reset() }} style={{ padding: '4px 10px' }}>−</button>
      <span style={{ fontFamily: 'var(--font-heading)', fontSize: '1.8rem', minWidth: '32px', textAlign: 'center' }}>{val}</span>
      <button className="btn btn-ghost btn-sm" onClick={() => { set(v => Math.min(max, v + 1)); reset() }} style={{ padding: '4px 10px' }}>+</button>
    </div>
  )

  return (
    <div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr auto 1fr', gap: '16px', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.6)', marginBottom: '8px' }}>First Number</div>
          <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
            <div><div style={{ fontSize: '0.75rem', color: 'var(--sky)', marginBottom: '4px' }}>Tens</div><Input val={tens1} set={setTens1} max={9} /></div>
            <div><div style={{ fontSize: '0.75rem', color: 'var(--coral)', marginBottom: '4px' }}>Ones</div><Input val={ones1} set={setOnes1} max={9} /></div>
          </div>
          <div style={{ fontFamily: 'var(--font-heading)', fontSize: '2.5rem', color: 'var(--sky)', marginTop: '8px' }}>{a}</div>
        </div>
        <div style={{ fontFamily: 'var(--font-heading)', fontSize: '3rem', color: 'rgba(255,255,255,0.4)', textAlign: 'center' }}>+</div>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.6)', marginBottom: '8px' }}>Second Number</div>
          <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
            <div><div style={{ fontSize: '0.75rem', color: 'var(--sky)', marginBottom: '4px' }}>Tens</div><Input val={tens2} set={setTens2} max={9} /></div>
            <div><div style={{ fontSize: '0.75rem', color: 'var(--coral)', marginBottom: '4px' }}>Ones</div><Input val={ones2} set={setOnes2} max={9} /></div>
          </div>
          <div style={{ fontFamily: 'var(--font-heading)', fontSize: '2.5rem', color: 'var(--coral)', marginTop: '8px' }}>{b}</div>
        </div>
      </div>

      <div className="pv-mat">
        <div className="pv-col tens">
          <h4>Tens 🔵</h4>
          <div className="pv-blocks">
            {Array.from({ length: totalTens + (needsRegroup && !regrouped ? 0 : 0) }, (_, i) => <div key={i} className="block-ten" />)}
          </div>
          <div className="pv-count" style={{ color: 'var(--sky)' }}>{totalTens}</div>
        </div>
        <div className="pv-col ones">
          <h4>Ones 🔴</h4>
          <div className="pv-blocks">
            {Array.from({ length: needsRegroup && regrouped ? finalOnes : totalOnes }, (_, i) => <div key={i} className="block-one" />)}
          </div>
          <div className="pv-count" style={{ color: 'var(--coral)' }}>{needsRegroup && regrouped ? finalOnes : totalOnes}</div>
        </div>
      </div>

      {needsRegroup && !regrouped && (
        <div style={{ textAlign: 'center', marginTop: '16px' }}>
          <div style={{ background: 'rgba(255,107,107,0.15)', border: '1px solid rgba(255,107,107,0.3)', borderRadius: '12px', padding: '12px 20px', marginBottom: '12px', fontSize: '0.95rem' }}>
            ⚠️ The Ones column has {totalOnes} — that's 10 or more! Time to <strong>Regroup</strong>!
          </div>
          <button className="btn btn-primary" onClick={() => setRegrouped(true)} id="regroup-btn">
            💥 Regroup! (10 ones → 1 ten)
          </button>
        </div>
      )}

      {(!needsRegroup || regrouped) && (
        <div style={{ textAlign: 'center', marginTop: '20px', fontFamily: 'var(--font-heading)', fontSize: '2rem', color: 'var(--yellow)' }}>
          {a} + {b} = {total} ✨
          {regrouped && <div style={{ fontSize: '0.9rem', color: 'rgba(255,255,255,0.6)', fontFamily: 'var(--font-body)', marginTop: '4px' }}>Regrouped {totalOnes} ones → {carryTen} ten + {finalOnes} ones</div>}
        </div>
      )}
    </div>
  )
}

// ── Column Addition Sim (Part 2) ────────────────────────────────────────────
function ColumnAddSim() {
  const [a] = useState(46)
  const [b] = useState(38)
  const [step, setStep] = useState(0)

  const onesA = a % 10, tensA = Math.floor(a / 10)
  const onesB = b % 10, tensB = Math.floor(b / 10)
  const onesSum = onesA + onesB
  const carry = onesSum >= 10 ? 1 : 0
  const onesAns = onesSum % 10
  const tensAns = tensA + tensB + carry

  const steps = [
    { label: 'Look at the ones column first: ' + onesA + ' + ' + onesB + ' = ' + onesSum, highlight: 'ones' },
    carry ? { label: onesSum + ' is 10 or more — regroup! Write ' + onesAns + ' in the ones, carry 1 ten.', highlight: 'carry' }
           : { label: 'Write ' + onesAns + ' in the ones answer box.', highlight: 'ones-ans' },
    { label: 'Now add the tens: ' + tensA + ' + ' + tensB + (carry ? ' + 1 (carried)' : '') + ' = ' + tensAns, highlight: 'tens' },
    { label: 'Answer: ' + a + ' + ' + b + ' = ' + (tensAns * 10 + onesAns) + ' 🎉', highlight: 'done' },
  ]

  return (
    <div style={{ display: 'flex', gap: '32px', alignItems: 'flex-start', flexWrap: 'wrap', justifyContent: 'center' }}>
      <div style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '16px', padding: '24px 32px', fontFamily: 'var(--font-heading)', fontSize: '2.5rem', textAlign: 'right', minWidth: '180px' }}>
        {carry > 0 && step >= 2 && <div style={{ fontSize: '1.2rem', color: 'var(--yellow)', textAlign: 'right', paddingRight: '4px' }}>¹</div>}
        <div>{tensA}<span style={{ color: step >= 0 ? 'var(--sky)' : 'inherit' }}>{onesA}</span></div>
        <div style={{ borderBottom: '2px solid rgba(255,255,255,0.3)', paddingBottom: '8px', marginBottom: '8px' }}>+ {tensB}<span style={{ color: step >= 0 ? 'var(--coral)' : 'inherit' }}>{onesB}</span></div>
        <div>
          {step >= 3 ? <>{tensAns}<span style={{ color: 'var(--yellow)' }}>{onesAns}</span></> : <>
            <span style={{ color: step >= 2 ? 'var(--yellow)' : 'rgba(255,255,255,0.2)' }}>{step >= 2 ? tensAns : '_'}</span>
            <span style={{ color: step >= 1 ? 'var(--yellow)' : 'rgba(255,255,255,0.2)' }}>{step >= 1 ? onesAns : '_'}</span>
          </>}
        </div>
      </div>

      <div style={{ flex: 1, minWidth: '220px' }}>
        <div style={{ background: 'rgba(255,230,109,0.1)', border: '1px solid rgba(255,230,109,0.25)', borderRadius: '12px', padding: '16px', marginBottom: '20px', fontSize: '0.95rem', minHeight: '60px', display: 'flex', alignItems: 'center' }}>
          💡 {steps[Math.min(step, steps.length - 1)].label}
        </div>
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          {step < steps.length - 1 ? (
            <button className="btn btn-sky" onClick={() => setStep(s => Math.min(s + 1, steps.length - 1))} id="col-add-next-btn">
              Next Step →
            </button>
          ) : (
            <button className="btn btn-ghost" onClick={() => setStep(0)}>↩ Try Again</button>
          )}
        </div>
      </div>
    </div>
  )
}

// ── Main SimulatePhase ──────────────────────────────────────────────────────
export default function SimulatePhase({ part, onNext, onBack, audioEnabled }) {
  const tabs = part === 1
    ? [{ id: 'nl', label: '📏 Number Line' }, { id: 'tf', label: '🔟 Ten Frame' }]
    : [{ id: 'pv', label: '📦 Place Value Mat' }, { id: 'col', label: '📐 Column Addition' }]
  const [activeTab, setActiveTab] = useState(tabs[0].id)

  // Speak warm intro narration when phase starts
  useEffect(() => {
    speakPhaseIntro('simulate', part, audioEnabled)
    return () => stopSpeech()
  }, [part, audioEnabled])

  return (
    <div>
      <h2 className="sim-title">🧪 Try It Yourself!</h2>
      <p className="sim-subtitle">Use these interactive tools to explore addition.</p>

      <div className="sim-tabs">
        {tabs.map(t => (
          <button key={t.id} className={`sim-tab ${activeTab === t.id ? 'active' : ''}`} onClick={() => setActiveTab(t.id)}>
            {t.label}
          </button>
        ))}
      </div>

      <div style={{ minHeight: '320px' }}>
        {activeTab === 'nl' && <NumberLineSim />}
        {activeTab === 'tf' && <TenFrameSim />}
        {activeTab === 'pv' && <PlaceValueSim />}
        {activeTab === 'col' && <ColumnAddSim />}
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '32px', gap: '12px' }}>
        <button className="btn btn-ghost" onClick={onBack}>← Back</button>
        <button className="btn btn-primary" onClick={onNext} id="sim-next-btn">
          I'm Ready to Play! 🎮 →
        </button>
      </div>
    </div>
  )
}
