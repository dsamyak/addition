export default function WonderPhase({ part, onNext }) {
  const content = part === 1 ? {
    icon: '🤔',
    title: 'Have you ever wondered…',
    question: 'If you have 8 apples in one basket and 7 apples in another basket, how do you find out how many apples you have altogether — WITHOUT counting every single one?',
    facts: [
      { emoji: '🌏', text: 'Addition is used every day — at the hawker centre, the MRT, the playground!' },
      { emoji: '🧮', text: 'Ancient Egyptians used addition over 4,000 years ago!' },
      { emoji: '🔟', text: 'The Ten-Frame was invented to make adding within 20 super easy!' },
      { emoji: '🐸', text: 'A number line lets you hop your way to the answer like a frog!' },
    ],
    challenge: 'Can you find the answer to 8 + 7 in your head before we show you how?',
    color: 'var(--coral)',
  } : {
    icon: '🤯',
    title: 'Here's a big question…',
    question: 'If a bakery made 47 muffins in the morning and 36 in the afternoon — can you add those big numbers in your head? What happens when the ones digits add up to MORE than 9?',
    facts: [
      { emoji: '🏗️', text: 'Place value is the superpower behind adding big numbers!' },
      { emoji: '💥', text: '"Regrouping" means bundling 10 ones into 1 ten — like magic!' },
      { emoji: '🧠', text: 'Mental maths tricks can help you add 2-digit numbers in seconds!' },
      { emoji: '📦', text: 'Place value blocks make the invisible visible!' },
    ],
    challenge: 'What do you think 47 + 36 equals? Make a guess before we explore!',
    color: 'var(--sky)',
  }

  return (
    <div className="wonder-wrap">
      <div className="wonder-icon">{content.icon}</div>
      <h2 className="wonder-title" style={{ background: `linear-gradient(135deg, ${content.color}, var(--purple))`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
        {content.title}
      </h2>
      <p className="wonder-question">{content.question}</p>

      <div className="wonder-facts">
        {content.facts.map((f, i) => (
          <div key={i} className="wonder-fact" style={{ animationDelay: `${i * 0.1}s` }}>
            <div className="fact-emoji">{f.emoji}</div>
            <p>{f.text}</p>
          </div>
        ))}
      </div>

      <div style={{
        background: 'rgba(255,230,109,0.1)', border: '1px solid rgba(255,230,109,0.25)',
        borderRadius: '16px', padding: '20px', margin: '0 auto 32px', maxWidth: '560px'
      }}>
        <p style={{ fontSize: '1rem', color: 'var(--yellow)', fontWeight: 700, marginBottom: '4px' }}>🎯 Your challenge:</p>
        <p style={{ color: 'rgba(255,255,255,0.85)', fontSize: '0.95rem', lineHeight: 1.6 }}>{content.challenge}</p>
      </div>

      <button className="btn btn-primary btn-lg" onClick={onNext} id="wonder-next-btn">
        I'm Curious! Let's Explore →
      </button>
    </div>
  )
}
