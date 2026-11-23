export const OPTION_LETTERS = ["A", "B", "C", "D"];

/**
 * Generates a cryptographically unbiased random integer in [0, max).
 * Falls back to Math.random when Web Crypto is unavailable.
 */
function randomInt(max) {
  const cryptoApi = typeof window !== "undefined" ? window.crypto || window.msCrypto : null;
  if (cryptoApi && typeof cryptoApi.getRandomValues === "function") {
    const buf = new Uint32Array(1);
    const limit = Math.floor(4294967296 / max) * max;
    let value;
    do {
      cryptoApi.getRandomValues(buf);
      value = buf[0];
    } while (value >= limit);
    return value % max;
  }
  return Math.floor(Math.random() * max);
}

/**
 * Returns a new array shuffled using the Fisher-Yates algorithm.
 */
export function fisherYatesShuffle(items) {
  const copy = items.slice();
  for (let i = copy.length - 1; i > 0; i--) {
    const j = randomInt(i + 1);
    const tmp = copy[i];
    copy[i] = copy[j];
    copy[j] = tmp;
  }
  return copy;
}

/**
 * Builds a fresh randomized quiz order:
 * - Shuffles question order (from total count or specific array of question bank indices)
 * - Shuffles option indices [0, 1, 2, 3] for each question
 */
export function buildQuizItems(target) {
  let indices;
  if (Array.isArray(target)) {
    indices = target.slice();
  } else {
    indices = Array.from({ length: target }, (_, idx) => idx);
  }
  return fisherYatesShuffle(indices).map((questionIndex) => ({
    q: questionIndex,
    p: fisherYatesShuffle([0, 1, 2, 3]),
  }));
}
