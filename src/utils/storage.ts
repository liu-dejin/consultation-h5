/**
 * 本地存储工具
 * 对 localStorage 的简单封装
 */

export function getStorage<T>(key: string, defaultValue: T | null = null): T | null {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : defaultValue;
  } catch {
    return defaultValue;
  }
}

export function setStorage(key: string, value: unknown) {
  localStorage.setItem(key, JSON.stringify(value));
}

export function removeStorage(key: string) {
  localStorage.removeItem(key);
}

export function clearStorage() {
  localStorage.clear();
}
