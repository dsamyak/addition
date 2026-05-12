// Seeded random for reproducible sessions
function seededRandom(seed) {
  let s = seed
  return function () {
    s = (s * 1664525 + 1013904223) & 0xffffffff
    return (s >>> 0) / 0xffffffff
  }
}

function shuffle(arr, rng) {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

function randInt(min, max, rng) {
  return Math.floor(rng() * (max - min + 1)) + min
}

function distractors(correct, min, max, rng) {
  const opts = new Set([correct])
  const candidates = [correct - 2, correct - 1, correct + 1, correct + 2, correct + 3, correct - 3]
  for (const c of shuffle(candidates, rng)) {
    if (c >= min && c <= max && c !== correct) opts.add(c)
    if (opts.size === 4) break
  }
  while (opts.size < 4) {
    const v = randInt(min, max, rng)
    if (v !== correct) opts.add(v)
  }
  return shuffle([...opts], rng)
}

const WP_PART1 = [
  (a, b) => ({ q: `Mei has ${a} stickers. Her friend gives her ${b} more. How many stickers does Mei have altogether?`, context: '🎀 Stickers' }),
  (a, b) => ({ q: `There are ${a} children on the MRT. ${b} more children get on. How many children are there now?`, context: '🚇 MRT' }),
  (a, b) => ({ q: `A hawker sells ${a} bowls of noodles in the morning and ${b} bowls in the afternoon. How many bowls altogether?`, context: '🍜 Hawker Centre' }),
  (a, b) => ({ q: `${a} birds are on a tree. ${b} more birds fly to the tree. How many birds are there in all?`, context: '🐦 Park' }),
  (a, b) => ({ q: `Sam has ${a} marbles. He wins ${b} more marbles at the playground. How many marbles does he have?`, context: '🎮 Playground' }),
  (a, b) => ({ q: `A library has ${a} storybooks on the top shelf and ${b} on the bottom. How many storybooks in total?`, context: '📚 Library' }),
  (a, b) => ({ q: `${a} red balloons and ${b} blue balloons are at a party. How many balloons altogether?`, context: '🎈 Party' }),
  (a, b) => ({ q: `Aisha picked ${a} flowers in the morning and ${b} in the evening. How many flowers did she pick?`, context: '🌸 Garden' }),
  (a, b) => ({ q: `There are ${a} ducks in the pond. ${b} more ducks swim over. How many ducks are there now?`, context: '🦆 Pond' }),
  (a, b) => ({ q: `Ravi ate ${a} cookies and then ${b} more. How many cookies did Ravi eat altogether?`, context: '🍪 Snack Time' }),
]

const WP_PART2 = [
  (a, b) => ({ q: `A bakery made ${a} muffins in the morning and ${b} in the afternoon. How many muffins altogether?`, context: '🧁 Bakery' }),
  (a, b) => ({ q: `There are ${a} students in Class 1A and ${b} in Class 1B. How many students are there in total?`, context: '🏫 School' }),
  (a, b) => ({ q: `A zoo has ${a} penguins and ${b} flamingos. How many birds are there altogether?`, context: '🐧 Zoo' }),
  (a, b) => ({ q: `Lily collected ${a} shells on Monday and ${b} shells on Tuesday. How many shells did she collect in all?`, context: '🐚 Beach' }),
  (a, b) => ({ q: `A bus has ${a} passengers. ${b} more passengers get on. How many passengers are on the bus now?`, context: '🚌 Bus' }),
  (a, b) => ({ q: `A farmer has ${a} chickens and ${b} ducks. How many birds does the farmer have altogether?`, context: '🐔 Farm' }),
  (a, b) => ({ q: `${a} red cars and ${b} blue cars are parked. How many cars in total?`, context: '🚗 Car Park' }),
  (a, b) => ({ q: `A shop sold ${a} toys on Saturday and ${b} on Sunday. How many toys were sold in total?`, context: '🧸 Toy Shop' }),
  (a, b) => ({ q: `There are ${a} boys and ${b} girls in a swimming class. How many children altogether?`, context: '🏊 Swimming' }),
  (a, b) => ({ q: `A bookshop has ${a} English books and ${b} Maths books. How many books in total?`, context: '📖 Bookshop' }),
]

/**
 * Generate questions grouped by world (5 worlds × 10 questions).
 * Returns an array of 5 arrays.
 */
export function generateGroupedQuestions(part, seed = Date.now()) {
  const rng = seededRandom(seed)
  return part === 1 ? groupedPart1(rng) : groupedPart2(rng)
}

function groupedPart1(rng) {
  const worlds = [[], [], [], [], []]

  // World 0 — Number Basics: 1-digit + 1-digit
  for (let i = 0; i < 10; i++) {
    const a = randInt(1, 9, rng), b = randInt(1, 9, rng), ans = a + b
    if (i % 3 === 0) {
      worlds[0].push({ type: 'mcq', text: `${a} + ${b} = ?`, a, b, answer: ans, options: distractors(ans, 2, 20, rng) })
    } else if (i % 3 === 1) {
      worlds[0].push({ type: 'fill', text: `${a} + ${b} = `, a, b, answer: ans })
    } else {
      worlds[0].push({ type: 'mcq', text: `${a} + ${b} = ?`, a, b, answer: ans, options: distractors(ans, 2, 20, rng) })
    }
  }

  // World 1 — Ten-Frame Valley: fill-the-frame style
  for (let i = 0; i < 10; i++) {
    const a = randInt(3, 9, rng)
    const b = randInt(1, Math.min(9, 20 - a), rng)
    const ans = a + b
    if (i % 2 === 0) {
      worlds[1].push({ type: 'mcq', text: `Use a ten-frame: ${a} + ${b} = ?`, a, b, answer: ans, options: distractors(ans, 2, 20, rng) })
    } else {
      worlds[1].push({ type: 'fill', text: `Ten-frame: ${a} + ${b} = `, a, b, answer: ans })
    }
  }

  // World 2 — Number Line Park: hop forward
  for (let i = 0; i < 10; i++) {
    const a = randInt(2, 14, rng)
    const b = randInt(1, Math.min(8, 20 - a), rng)
    const ans = a + b
    if (i % 2 === 0) {
      worlds[2].push({ type: 'mcq', text: `Start at ${a}, hop ${b} forward: ${a} + ${b} = ?`, a, b, answer: ans, options: distractors(ans, 3, 20, rng) })
    } else {
      worlds[2].push({ type: 'fill', text: `Hop from ${a}, count on ${b}: ${a} + ${b} = `, a, b, answer: ans })
    }
  }

  // World 3 — Missing Numbers
  for (let i = 0; i < 10; i++) {
    const total = randInt(8, 18, rng)
    const a = randInt(2, total - 2, rng)
    const b = total - a
    worlds[3].push({ type: 'missing', text: `${a} + ___ = ${total}`, a, b, answer: b, options: distractors(b, 1, 15, rng) })
  }

  // World 4 — Story Land: word problems
  for (let i = 0; i < 10; i++) {
    const a = randInt(2, 9, rng), b = randInt(2, 9, rng), ans = a + b
    const wp = WP_PART1[i % WP_PART1.length](a, b)
    worlds[4].push({ type: 'word', text: wp.q, context: wp.context, a, b, answer: ans, options: distractors(ans, 4, 20, rng) })
  }

  return worlds.map(w => shuffle(w, rng))
}

function groupedPart2(rng) {
  const worlds = [[], [], [], [], []]

  // World 0 — Place Value Plains: 2-digit + 1-digit (no regroup)
  for (let i = 0; i < 10; i++) {
    const tens = randInt(1, 8, rng)
    const ones = randInt(0, 5, rng)
    const a = tens * 10 + ones
    const b = randInt(1, Math.max(1, 9 - ones), rng)
    const ans = a + b
    if (i % 2 === 0) {
      worlds[0].push({ type: 'mcq', text: `${a} + ${b} = ?`, a, b, answer: ans, options: distractors(ans, 10, 99, rng), regroup: false })
    } else {
      worlds[0].push({ type: 'fill', text: `${a} + ${b} = `, a, b, answer: ans, regroup: false })
    }
  }

  // World 1 — No-Regroup Road: 2-digit + 2-digit (no regroup)
  for (let i = 0; i < 10; i++) {
    const a1 = randInt(1, 5, rng), a0 = randInt(0, 4, rng)
    const b1 = randInt(1, Math.max(1, 9 - a1), rng), b0 = randInt(0, Math.max(0, 9 - a0), rng)
    const a = a1 * 10 + a0, b = b1 * 10 + b0
    const ans = a + b
    if (i % 2 === 0) {
      worlds[1].push({ type: 'mcq', text: `${a} + ${b} = ?`, a, b, answer: ans, options: distractors(ans, 20, 99, rng), regroup: false })
    } else {
      worlds[1].push({ type: 'fill', text: `${a} + ${b} = `, a, b, answer: ans, regroup: false })
    }
  }

  // World 2 — Regroup Rapids: with regrouping
  for (let i = 0; i < 10; i++) {
    let a1 = randInt(1, 5, rng), a0 = randInt(5, 9, rng)
    let b1 = randInt(1, Math.max(1, 8 - a1), rng), b0 = randInt(1, 9, rng)
    let a = a1 * 10 + a0, b = b1 * 10 + b0
    if (a + b > 99) { b0 = 1; b = b1 * 10 + b0 }
    const ans = a + b
    if (i % 2 === 0) {
      worlds[2].push({ type: 'mcq', text: `${a} + ${b} = ?`, a, b, answer: ans, options: distractors(ans, 20, 99, rng), regroup: true })
    } else {
      worlds[2].push({ type: 'fill', text: `${a} + ${b} = `, a, b, answer: ans, regroup: true })
    }
  }

  // World 3 — Missing Numbers: 2-digit missing addend
  for (let i = 0; i < 10; i++) {
    const total = randInt(40, 95, rng)
    const a = randInt(15, total - 10, rng)
    const b = total - a
    worlds[3].push({ type: 'missing', text: `${a} + ___ = ${total}`, a, b, answer: b, options: distractors(b, 5, 60, rng) })
  }

  // World 4 — Story Town: word problems
  for (let i = 0; i < 10; i++) {
    let a = randInt(20, 50, rng), b = randInt(10, 35, rng)
    if (a + b > 99) b = 99 - a
    const ans = a + b
    const wp = WP_PART2[i % WP_PART2.length](a, b)
    worlds[4].push({ type: 'word', text: wp.q, context: wp.context, a, b, answer: ans, options: distractors(ans, 30, 99, rng) })
  }

  return worlds.map(w => shuffle(w, rng))
}

export function getHint(question) {
  if (question.type === 'word') return `💡 Read carefully: What are the two numbers you are adding? They are ${question.a} and ${question.b}. Add them together!`
  if (question.type === 'missing') {
    return `💡 Think: the missing number + something = total. Try counting up from ${question.a} to reach the total.`
  }
  if (question.regroup) return `💡 Ones: ${question.a % 10} + ${question.b % 10} = ${(question.a % 10) + (question.b % 10)} — regroup 10 ones as 1 ten! Then add the tens.`
  return `💡 Use a number line or count on from the bigger number: start at ${Math.max(question.a, question.b)}, count on ${Math.min(question.a, question.b)} more.`
}

// Legacy flat generators (kept for backwards compat)
export function generatePart1Questions(seed) { return groupedPart1(seededRandom(seed)).flat() }
export function generatePart2Questions(seed) { return groupedPart2(seededRandom(seed)).flat() }
