import { useEffect, useState } from 'react'
import { getItems } from '../api.js'

const codespaceName = import.meta.env.VITE_CODESPACE_NAME?.trim()
const leaderboardApiUrl = codespaceName
  ? `https://${codespaceName}-8000.app.github.dev/api/leaderboard/`
  : 'http://localhost:8000/api/leaderboard/'

function fetchLeaderboard(signal) {
  return fetch(leaderboardApiUrl, { signal }).then((response) => {
    if (!response.ok) throw new Error(`Unable to load leaderboard (${response.status})`)
    return response.json()
  }).then(getItems)
}

function Leaderboard() {
  const [entries, setEntries] = useState([])
  const [status, setStatus] = useState('loading')
  const [error, setError] = useState('')

  useEffect(() => {
    const controller = new AbortController()
    fetchLeaderboard(controller.signal)
      .then(setEntries)
      .then(() => setStatus('ready'))
      .catch((requestError) => {
        if (requestError.name !== 'AbortError') { setError(requestError.message); setStatus('error') }
      })
    return () => controller.abort()
  }, [])

  return (
    <section className="resource-page" aria-labelledby="leaderboard-title">
      <div className="page-heading"><p className="eyebrow">Team pulse</p><h1 id="leaderboard-title">Leaderboard</h1><p>See who is turning consistency into momentum.</p></div>
      {status === 'loading' && <p className="state-message">Loading leaderboard...</p>}
      {status === 'error' && <p className="state-message error-message">{error}</p>}
      {status === 'ready' && entries.length === 0 && <p className="state-message">The leaderboard is waiting for its first scores.</p>}
      {entries.length > 0 && <ol className="leaderboard-list">{entries.map((entry, index) => <li key={entry._id || entry.id}><span className="rank">{String(index + 1).padStart(2, '0')}</span><span className="avatar">{(entry.userId?.displayName || entry.userId?.username || '?').slice(0, 1).toUpperCase()}</span><span className="leader-name"><strong>{entry.userId?.displayName || entry.userId?.username || entry.username || 'Community member'}</strong><small>{entry.streak ? `${entry.streak} day streak` : 'Keep moving'}</small></span><strong className="points">{entry.points ?? 0}<small> pts</small></strong></li>)}</ol>}
    </section>
  )
}

export default Leaderboard
