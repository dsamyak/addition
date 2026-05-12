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
  (a, b, s) => ({ q: `Mei has ${a} stickers. Her friend gives her ${b} more. How many stickers does Mei have altogether?`, context: '🎀 Stickers' }),
  (a, b, s) => ({ q: `There are ${a} children on the MRT. ${b} more children get on. How many children are there now?`, context: '🚇 MRT' }),
  (a, b, s) => ({ q: `A hawker sells ${a} bowls of noodles in the morning and ${b} bowls in the afternoon. How many bowls altogether?`, context: '🍜 Hawker Centre' }),
  (a, b, s) => ({ q: `${a} birds are on a tree. ${b} more birds fly to the tree. How many birds are there in all?`, context: '🐦 Park' }),
  (a, b, s) => ({ q: `Sam has ${a} marbles. He wins ${b} more marbles at the playground. How many marbles does he have?`, context: '🎮 Playground' }),
]

const WP_PART2 = [
  (a, b) => ({ q: `A bakery made ${a} muffins in the morning and ${b} in the afternoon. How many muffins altogether?`, context: '🧁 Bakery' }),
  (a, b) => ({ q: `There are ${a} students in Class 1A and ${b} in Class 1B. How many students are there in total?`, context: '🏫 School' }),
  (a, b) => ({ q: `A zoo has ${a} penguins and ${b} flamingos. How many birds are there altogether?`, context: '🐧 Zoo' }),
  (a, b) => ({ q: `Lily collected ${a} shells on Monday and ${b} shells on Tuesday. How many shells did she collect in all?`, context: '🐚 Beach' }),
  (a, b) => ({ q: `A bus has ${a} passengers. ${b} more passengers get on. How many passengers are on the bus now?`, context: '🚌 Bus' }),
]

export function generatePart1Questions(seed = Date.now()) {
  const rng = seededRandom(seed)
  const questions = []

  // 1-digit + 1-digit (15 questions)
  for (let i = 0; i < 15; i++) {
    const a = randInt(1, 9, rng)
    const b = randInt(1, 9, rng)
    const ans = a + b
    if (i % 3 === 0) {
      questions.push({ type: 'mcq', text: `${a} + ${b} = ?`, a, b, answer: ans, options: distractors(ans, 2, 20, rng), sub: '1+1 digit' })
    } else if (i % 3 === 1) {
      questions.push({ type: 'fill', text: `${a} + ${b} = `, a, b, answer: ans, sub: '1+1 digit' })
    } else {
      questions.push({ type: 'missing', text: `${a} + ___ = ${ans}`, a, b, answer: b, options: distractors(b, 1, 9, rng), sub: '1+1 digit' })
    }
  }

  // 1-digit + 2-digit (15 questions)
  for (let i = 0; i < 15; i++) {
    const a = randInt(1, 9, rng)
    const b = randInt(10, 19, rng)
    const ans = a + b
    if (i % 2 === 0) {
      questions.push({ type: 'mcq', text: `${a} + ${b} = ?`, a, b, answer: ans, options: distractors(ans, 11, 20, rng), sub: '1+2 digit' })
    } else {
      questions.push({ type: 'fill', text: `${a} + ${b} = `, a, b, answer: ans, sub: '1+2 digit' })
    }
  }

  // Missing addend within 20 (10 questions)
  for (let i = 0; i < 10; i++) {
    const ans = randInt(9, 17, rng)
    const a = randInt(3, ans - 1, rng)
    const b = ans - a
    questions.push({ type: 'missing', text: `${a} + ___ = ${ans}`, a, b, answer: b, options: distractors(b, 1, 12, rng), sub: 'missing addend' })
  }

  // Word problems (10 questions)
  for (let i = 0; i < 10; i++) {
    const a = randInt(2, 9, rng)
    const b = randInt(2, 9, rng)
    const ans = a + b
    const wp = WP_PART1[i % WP_PART1.length](a, b)
    questions.push({ type: 'word', text: wp.q, context: wp.context, a, b, answer: ans, options: distractors(ans, 4, 20, rng), sub: 'word problem' })
  }

  return shuffle(questions, rng)
}

export function generatePart2Questions(seed = Date.now()) {
  const rng = seededRandom(seed)
  const questions = []

  // Without regrouping 2-digit + 1-digit (10)
  for (let i = 0; i < 10; i++) {
    const tens = randInt(1, 8, rng)
    const ones = randInt(0, 5, rng)
    const a = tens * 10 + ones
    const b = randInt(1, 9 - ones, rng) || 1
    const ans = a + b
    if (i % 2 === 0) {
      questions.push({ type: 'mcq', text: `${a} + ${b} = ?`, a, b, answer: ans, options: distractors(ans, 10, 99, rng), sub: 'no regroup 2+1', regroup: false })
    } else {
      questions.push({ type: 'fill', text: `${a} + ${b} = `, a, b, answer: ans, sub: 'no regroup 2+1', regroup: false })
    }
  }

  // Without regrouping 2-digit + 2-digit (15)
  for (let i = 0; i < 15; i++) {
    const a1 = randInt(1, 5, rng); const a0 = randInt(0, 4, rng)
    const b1 = randInt(1, 4, rng); const b0 = randInt(0, 9 - a0, rng)
    const a = a1 * 10 + a0; const b = b1 * 10 + b0
    const ans = a + b
    if (i % 2 === 0) {
      questions.push({ type: 'mcq', text: `${a} + ${b} = ?`, a, b, answer: ans, options: distractors(ans, 20, 99, rng), sub: 'no regroup 2+2', regroup: false })
    } else {
      questions.push({ type: 'fill', text: `${a} + ${b} = `, a, b, answer: ans, sub: 'no regroup 2+2', regroup: false })
    }
  }

  // With regrouping (15)
  for (let i = 0; i < 15; i++) {
    const a1 = randInt(2, 6, rng); const a0 = randInt(5, 9, rng)
    const b1 = randInt(1, 4, rng); const b0 = randInt(1, 9, rng)
    const a = a1 * 10 + a0; const b = b1 * 10 + b0
    if (a + b > 99) { b0 = 1 }
    const ans = a + b
    if (i % 2 === 0) {
      questions.push({ type: 'mcq', text: `${a} + ${b} = ?`, a, b, answer: ans, options: distractors(ans, 30, 99, rng), sub: 'with regroup', regroup: true })
    } else {
      questions.push({ type: 'fill', text: `${a} + ${b} = `, a, b, answer: ans, sub: 'with regroup', regroup: true })
    }
  }

  // Missing addend (5)
  for (let i = 0; i < 5; i++) {
    const ans = randInt(50, 90, rng)
    const a = randInt(20, ans - 10, rng)
    const b = ans - a
    questions.push({ type: 'missing', text: `${a} + ___ = ${ans}`, a, b, answer: b, options: distractors(b, 5, 60, rng), sub: 'missing 2-digit' })
  }

  // Word problems (5)
  for (let i = 0; i < 5; i++) {
    const a = randInt(20, 55, rng)
    const b = randInt(10, 40, rng)
    const ans = a + b
    if (ans > 99) { continue }
    const wp = WP_PART2[i % WP_PART2.length](a, b)
    questions.push({ type: 'word', text: wp.q, context: wp.context, a, b, answer: ans, options: distractors(ans, 30, 99, rng), sub: 'word problem' })
  }

  return shuffle(questions, rng)
}

export function getHint(question) {
  if (question.type === 'word') return `💡 Read carefully: What are the two numbers you are adding? They are ${question.a} and ${question.b}. Add them together!`
  if (question.type === 'missing') {
    const ans = question.answer
    return `💡 Think: the missing number + something = total. Try counting up from ${question.a} to reach the total.`
  }
  if (question.regroup) return `💡 Ones: ${question.a % 10} + ${question.b % 10} = ${(question.a % 10) + (question.b % 10)} — regroup 10 ones as 1 ten! Then add the tens.`
  return `💡 Use a number line or count on from the bigger number: start at ${Math.max(question.a, question.b)}, count on ${Math.min(question.a, question.b)} more.`
}
