// Color theme: system by default, user can override.
//
// The *preference* ('light' | 'dark' | 'system') lives in localStorage.
// The *resolved theme* ('light' | 'dark') is written to
// <html data-theme="..."> and drives the token values in app/ui/themes/.

export type ThemePreference = 'light' | 'dark' | 'system';
export type ResolvedTheme = 'light' | 'dark';

export const THEME_STORAGE_KEY = 'theme';
export const THEME_CHANGE_EVENT = 'themechange';

const DARK_QUERY = '(prefers-color-scheme: dark)';

// Inlined into <head> by app/layout.tsx so it runs before the first paint.
// The server cannot know the user's choice, so without this the page would
// render light and then flash to dark once React loads. Plain ES5 on
// purpose: it is not bundled or transpiled.
//
// It also keeps following the OS while the preference is 'system', and
// syncs other tabs when the preference changes.
export const themeInitScript = `(function () {
  var key = '${THEME_STORAGE_KEY}';
  var mq = window.matchMedia('${DARK_QUERY}');
  function apply() {
    var pref;
    try { pref = localStorage.getItem(key); } catch (e) {}
    var theme = pref === 'light' || pref === 'dark' ? pref : (mq.matches ? 'dark' : 'light');
    document.documentElement.setAttribute('data-theme', theme);
  }
  apply();
  mq.addEventListener('change', apply);
  window.addEventListener('storage', function (e) { if (e.key === key) apply(); });
})();`;

// ---- Client helpers (used by the theme switcher) ----

// Fallback when storage is blocked (private mode, disabled site data), so
// the switcher still reflects the choice for the current page.
let memoryPreference: ThemePreference = 'system';

function isPreference(value: unknown): value is ThemePreference {
  return value === 'light' || value === 'dark' || value === 'system';
}

export function readThemePreference(): ThemePreference {
  try {
    const stored = localStorage.getItem(THEME_STORAGE_KEY);
    return isPreference(stored) ? stored : 'system';
  } catch {
    return memoryPreference;
  }
}

export function resolveTheme(preference: ThemePreference): ResolvedTheme {
  if (preference !== 'system') return preference;
  return window.matchMedia(DARK_QUERY).matches ? 'dark' : 'light';
}

export function setThemePreference(preference: ThemePreference) {
  memoryPreference = preference;
  try {
    if (preference === 'system') localStorage.removeItem(THEME_STORAGE_KEY);
    else localStorage.setItem(THEME_STORAGE_KEY, preference);
  } catch {
    // Storage unavailable: the choice lasts for this page only.
  }
  document.documentElement.setAttribute('data-theme', resolveTheme(preference));
  window.dispatchEvent(new Event(THEME_CHANGE_EVENT));
}

// For useSyncExternalStore: re-read the preference when it changes here
// or in another tab.
export function subscribeToThemePreference(onChange: () => void) {
  const onStorage = (e: StorageEvent) => {
    if (e.key === THEME_STORAGE_KEY) onChange();
  };
  window.addEventListener(THEME_CHANGE_EVENT, onChange);
  window.addEventListener('storage', onStorage);
  return () => {
    window.removeEventListener(THEME_CHANGE_EVENT, onChange);
    window.removeEventListener('storage', onStorage);
  };
}
