import { useMemo } from 'react';

const SYMBOLS = ['+', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '=', '+', '20', '15', '12'];

export default function FloatingNumbers() {
  const items = useMemo(() =>
    Array.from({ length: 14 }, (_, i) => ({
      id: i,
      symbol: SYMBOLS[i % SYMBOLS.length],
      left: (i * 7.3 + 3) % 95,
      size: 1.5 + Math.random() * 2,
      duration: 15 + Math.random() * 20,
      delay: Math.random() * 15,
    })), []);

  return (
    <div className="floating-numbers">
      {items.map(n => (
        <div key={n.id} className="floating-number" style={{
          left: `${n.left}%`,
          fontSize: `${n.size}rem`,
          animationDuration: `${n.duration}s`,
          animationDelay: `${n.delay}s`,
        }}>{n.symbol}</div>
      ))}
    </div>
  );
}
