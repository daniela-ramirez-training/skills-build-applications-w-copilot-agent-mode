import { useEffect, useState } from 'react'
import { getItems } from '../api.js'

const codespaceName = import.meta.env.VITE_CODESPACE_NAME?.trim()
const teamsApiUrl = codespaceName
  ? `https://${codespaceName}-8000.app.github.dev/api/teams/`
  : 'http://localhost:8000/api/teams/'

function fetchTeams(signal) {
  return fetch(teamsApiUrl, { signal }).then((response) => {
    if (!response.ok) throw new Error(`Unable to load teams (${response.status})`)
    return response.json()
  }).then(getItems)
}

function Teams() {
  const [teams, setTeams] = useState([])
  const [status, setStatus] = useState('loading')
  const [error, setError] = useState('')

  useEffect(() => {
    const controller = new AbortController()
    fetchTeams(controller.signal)
      .then(setTeams)
      .then(() => setStatus('ready'))
      .catch((requestError) => {
        if (requestError.name !== 'AbortError') { setError(requestError.message); setStatus('error') }
      })
    return () => controller.abort()
  }, [])

  return (
    <section className="resource-page" aria-labelledby="teams-title">
      <div className="page-heading"><p className="eyebrow">Find your people</p><h1 id="teams-title">Teams</h1><p>Small circles make big goals easier to keep.</p></div>
      {status === 'loading' && <p className="state-message">Loading teams...</p>}
      {status === 'error' && <p className="state-message error-message">{error}</p>}
      {status === 'ready' && teams.length === 0 && <p className="state-message">No teams have been created yet.</p>}
      {teams.length > 0 && <div className="team-grid">{teams.map((team) => <article className="team-card" key={team._id || team.id}><div className="team-card-top"><span className="team-mark">{(team.name || 'T').slice(0, 1).toUpperCase()}</span><span className="member-count">{team.memberIds?.length ?? team.members?.length ?? 0} members</span></div><h2>{team.name || 'Unnamed team'}</h2><p>{team.description || 'A new space to train together.'}</p></article>)}</div>}
    </section>
  )
}

export default Teams
