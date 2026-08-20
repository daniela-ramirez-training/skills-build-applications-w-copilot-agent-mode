const codespaceName = import.meta.env.VITE_CODESPACE_NAME?.trim()

export const apiBaseUrl = codespaceName
  ? `https://${codespaceName}-8000.app.github.dev`
  : 'http://localhost:8000'

export function getApiUrl(resource) {
  return `${apiBaseUrl}/api/${resource}/`
}

export function getItems(payload) {
  if (Array.isArray(payload)) return payload
  if (Array.isArray(payload?.data)) return payload.data
  if (Array.isArray(payload?.items)) return payload.items
  if (Array.isArray(payload?.results)) return payload.results
  return []
}

export async function fetchItems(resource, signal) {
  const response = await fetch(getApiUrl(resource), { signal })
  if (!response.ok) {
    throw new Error(`Unable to load ${resource} (${response.status})`)
  }
  return getItems(await response.json())
}
