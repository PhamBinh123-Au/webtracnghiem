const TAB_KEY = "gdqpan_hp1_active_tab_v3";
const PROFILE_KEY = "gdqpan_hp1_profile_v1";
const GENERAL_STATE_KEY = "gdqpan_hp1_quiz_state_general_v3";
const LESSON_KEY_PREFIX = "gdqpan_hp1_quiz_state_lesson_v3_";

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
    // Ignore storage errors (quota or private mode)
  }
}

function safeRemove(key) {
  try {
    localStorage.removeItem(key);
  } catch {
    // Ignore
  }
}

export function isValidQuizState(state, expectedTotal) {
  if (!state || state.v !== 1) return false;
  const count = typeof expectedTotal === "number" ? expectedTotal : state.total;
  return Boolean(
    typeof count === "number" &&
      state.total === count &&
      Array.isArray(state.items) &&
      state.items.length === count &&
      typeof state.idx === "number" &&
      state.idx >= 0 &&
      state.idx < count &&
      Array.isArray(state.picks) &&
      typeof state.name === "string" &&
      typeof state.cls === "string" &&
      (state.screen === "quiz" || state.screen === "result")
  );
}

// Active Tab
export function loadActiveTab(defaultTab = "general") {
  const tab = safeGet(TAB_KEY);
  if (tab === "general" || tab === "lessons" || tab === "docs") {
    return tab;
  }
  return defaultTab;
}

export function saveActiveTab(tab) {
  safeSet(TAB_KEY, tab);
}

// Student Profile (shared)
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

// General Quiz State (386 questions)
export function loadGeneralQuizState(totalQuestions) {
  const saved = safeGet(GENERAL_STATE_KEY);
  if (isValidQuizState(saved, totalQuestions)) {
    return saved;
  }
  return null;
}

export function saveGeneralQuizState(state) {
  if (state) safeSet(GENERAL_STATE_KEY, state);
}

export function clearGeneralQuizState() {
  safeRemove(GENERAL_STATE_KEY);
}

// Lesson Quiz State
export function loadLessonQuizState(lessonId, expectedCount) {
  const key = `${LESSON_KEY_PREFIX}${lessonId}`;
  const saved = safeGet(key);
  if (isValidQuizState(saved, expectedCount)) {
    return saved;
  }
  return null;
}

export function saveLessonQuizState(lessonId, state) {
  if (lessonId && state) {
    safeSet(`${LESSON_KEY_PREFIX}${lessonId}`, state);
  }
}

export function clearLessonQuizState(lessonId) {
  if (lessonId) {
    safeRemove(`${LESSON_KEY_PREFIX}${lessonId}`);
  }
}

// Get overview status for all 11 lessons
export function loadAllLessonSummaries(lessons = []) {
  const summaries = {};
  for (const l of lessons) {
    const key = `${LESSON_KEY_PREFIX}${l.id}`;
    const saved = safeGet(key);
    if (isValidQuizState(saved, l.count)) {
      summaries[l.id] = {
        screen: saved.screen,
        idx: saved.idx,
        total: saved.total,
        correct: saved.correct,
        wrong: saved.wrong,
        completed: saved.screen === "result",
      };
    } else {
      summaries[l.id] = null;
    }
  }
  return summaries;
}

// Legacy aliases for backward compatibility
export const loadQuizState = loadGeneralQuizState;
export const saveQuizState = saveGeneralQuizState;
export const clearQuizState = clearGeneralQuizState;
