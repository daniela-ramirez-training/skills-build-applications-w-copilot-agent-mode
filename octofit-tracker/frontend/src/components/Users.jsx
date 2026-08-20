import { useEffect, useState } from 'react'
import { getItems } from '../api.js'

const codespaceName = import.meta.env.VITE_CODESPACE_NAME?.trim()
const usersApiUrl = codespaceName
  ? `https://${codespaceName}-8000.app.github.dev/api/users/`
  : 'http://localhost:8000/api/users/'

function fetchUsers(signal) {
  return fetch(usersApiUrl, { signal }).then((response) => {
    if (!response.ok) throw new Error(`Unable to load users (${response.status})`)
    return response.json()
  }).then(getItems)
}

function Users() {
  const [users, setUsers] = useState([])
  const [status, setStatus] = useState('loading')
  const [error, setError] = useState('')

  useEffect(() => {
    const controller = new AbortController()
    fetchUsers(controller.signal)
      .then(setUsers)
      .then(() => setStatus('ready'))
      .catch((requestError) => {
        if (requestError.name !== 'AbortError') { setError(requestError.message); setStatus('error') }
      })
    return () => controller.abort()
  }, [])

  return (
    <section className="resource-page" aria-labelledby="users-title">
      <div className="page-heading"><p className="eyebrow">Your circle</p><h1 id="users-title">Users</h1><p>Meet the athletes building better habits with you.</p></div>
      {status === 'loading' && <p className="state-message">Loading users...</p>}
      {status === 'error' && <p className="state-message error-message">{error}</p>}
      {status === 'ready' && users.length === 0 && <p className="state-message">No users found.</p>}
      {users.length > 0 && <div className="user-grid">{users.map((user) => <article className="user-card" key={user._id || user.id}><span className="avatar large">{(user.displayName || user.username || '?').slice(0, 1).toUpperCase()}</span><div><h2>{user.displayName || user.username || 'Unnamed user'}</h2><p>@{user.username || 'member'}</p></div></article>)}</div>}
    </section>
  )
}

export default Users
