/**
 * useFileSystem — File System Access API + IndexedDB para handles (solo DEV)
 * Guarda en disco directo (sin cross-device, sin token). Live en src/data/catalog.live.json etc.
 * Persiste handle en IndexedDB (no serializable en localStorage).
 */

const DB_NAME = "dev-fs-handles";
const STORE_NAME = "handles";

function openDB() {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, 1);
    req.onupgradeneeded = () => {
      req.result.createObjectStore(STORE_NAME);
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
    req.onblocked = () => reject(new Error("IDB blocked"));
  });
}

export async function idbGet(key) {
  try {
    const db = await openDB();
    return await new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, "readonly");
      const req = tx.objectStore(STORE_NAME).get(key);
      req.onsuccess = () => resolve(req.result);
      req.onerror = () => reject(req.error);
    });
  } catch (_e) {
    void _e;
    return undefined;
  }
}

export async function idbSet(key, val) {
  try {
    const db = await openDB();
    await new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, "readwrite");
      const req = tx.objectStore(STORE_NAME).put(val, key);
      req.onsuccess = () => resolve(undefined);
      req.onerror = () => reject(req.error);
    });
  } catch (_e) {
    void _e;
  }
}

export async function idbDel(key) {
  try {
    const db = await openDB();
    await new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, "readwrite");
      const req = tx.objectStore(STORE_NAME).delete(key);
      req.onsuccess = () => resolve(undefined);
      req.onerror = () => reject(req.error);
    });
  } catch (_e) {
    void _e;
  }
}

export function canUseFS() {
  return typeof window !== "undefined" && window.isSecureContext && "showOpenFilePicker" in window && "showSaveFilePicker" in window;
}

export async function verifyPermission(handle, mode = "readwrite") {
  if (!handle || !handle.queryPermission) return true;
  try {
    let p = await handle.queryPermission({ mode });
    if (p === "granted") return true;
    if (p === "prompt") {
      p = await handle.requestPermission({ mode });
      return p === "granted";
    }
    return false;
  } catch (_e) {
    void _e;
    return false;
  }
}

export async function pickOpen(opts) {
  const [h] = await window.showOpenFilePicker(opts);
  return h;
}

export async function pickSave(opts) {
  return await window.showSaveFilePicker(opts);
}

export async function readJSON(handle) {
  if (!(await verifyPermission(handle, "read"))) throw new Error("permiso denegado");
  const file = await handle.getFile();
  const text = await file.text();
  // soporta tanto JSON puro como JS con export const siteConfig = {...}
  const trimmed = text.trim();
  if (trimmed.startsWith("export")) {
    const m = trimmed.match(/export\s+const\s+siteConfig\s*=\s*([\s\S]*?);?\s*$/);
    if (m) return JSON.parse(m[1]);
  }
  return JSON.parse(text);
}

export async function writeJSON(handle, data, asJs = false) {
  if (!(await verifyPermission(handle, "readwrite"))) throw new Error("permiso denegado");
  const w = await handle.createWritable();
  const content = asJs ? `export const siteConfig = ${JSON.stringify(data, null, 2)};\n` : JSON.stringify(data, null, 2);
  await w.write(content);
  await w.close();
}
