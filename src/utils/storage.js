const STATE_KEY = "gdqpan_hp1_quiz_state_v2";
const PROFILE_KEY = "gdqpan_hp1_profile_v1";

function safeGet(key) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function safeSet(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Ignore storage errors (private browsing or quota exceeded)
  }
}

function safeRemove(key) {
  try {
    localStorage.removeItem(key);
  } catch {
    // Ignore
  }
}

export function isValidQuizState(state, totalQuestions) {
  return Boolean(
    state &&
      state.v === 1 &&
      state.total === totalQuestions &&
      Array.isArray(state.items) &&
      state.items.length === totalQuestions &&
      typeof state.idx === "number" &&
      state.idx >= 0 &&
      state.idx < totalQuestions &&
      Array.isArray(state.picks) &&
      typeof state.name === "string" &&
      typeof state.cls === "string" &&
      (state.screen === "quiz" || state.screen === "result")
  );
}

export function loadQuizState(totalQuestions) {
  const saved = safeGet(STATE_KEY);
  if (isValidQuizState(saved, totalQuestions)) {
    return saved;
  }
  safeRemove(STATE_KEY);
  return null;
}

export function saveQuizState(state) {
  if (state) safeSet(STATE_KEY, state);
}

export function clearQuizState() {
  safeRemove(STATE_KEY);
}

export function loadProfile() {
  const profile = safeGet(PROFILE_KEY);
  if (profile && typeof profile.name === "string" && typeof profile.cls === "string") {
    return profile;
  }
  return { name: "", cls: "" };
}

export function saveProfile(name, cls) {
  safeSet(PROFILE_KEY, { name, cls });
}

export function clearProfile() {
  safeRemove(PROFILE_KEY);
}
