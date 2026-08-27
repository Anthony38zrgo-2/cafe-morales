/**
 * useStorage — helper localStorage v1 (solo DEV)
 * Keys: dev:siteConfig, dev:catalog, dev:sidebar_w
 */
const PREFIX = "dev:";

function key(name) {
  return `${PREFIX}${name}`;
}

export function storageGet(name, fallback = null) {
  try {
    const raw = localStorage.getItem(key(name));
    if (raw == null) return fallback;
    return JSON.parse(raw);
  } catch {
    return fallback;
  }
}

export function storageSet(name, value) {
  try {
    localStorage.setItem(key(name), JSON.stringify(value));
  } catch (_e) {
    // quota exceeded — ignore
    void _e;
  }
}

export function storageRemove(name) {
  try {
    localStorage.removeItem(key(name));
  } catch (_e) {
    void _e;
  }
}

export function storageClearDev() {
  ["siteConfig", "catalog", "sidebar_w", "sidebar_open", "sidebar_tab"].forEach(storageRemove);
}
