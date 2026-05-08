export const getCachedData = (key) => {
  try {
    const raw = localStorage.getItem(key)
    if (!raw) return null
    return JSON.parse(raw)
  } catch {
    return null
  }
}

export const setCachedData = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch {
    // Ignore write errors in private mode/quota exceeded cases.
  }
}

export const isCacheFresh = (timestamp, maxAgeMs) => {
  if (!timestamp) return false
  return Date.now() - timestamp < maxAgeMs
}
