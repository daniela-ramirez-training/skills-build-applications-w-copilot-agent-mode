import { useEffect, useState } from 'react'
import { getItems } from '../api.js'

const codespaceName = import.meta.env.VITE_CODESPACE_NAME?.trim()
const activitiesApiUrl = codespaceName
  ? `https://${codespaceName}-8000.app.github.dev/api/activities/`
  : 'http://localhost:8000/api/activities/'

function fetchActivities(signal) {
  return fetch(activitiesApiUrl, { signal }).then((response) => {
    if (!response.ok) throw new Error(`Unable to load activities (${response.status})`)
    return response.json()
  }).then(getItems)
}

function Activities() {
  const [activities, setActivities] = useState([])
  const [status, setStatus] = useState('loading')
  const [error, setError] = useState('')

  useEffect(() => {
    const controller = new AbortController()
    fetchActivities(controller.signal)
      .then(setActivities)
      .then(() => setStatus('ready'))
      .catch((requestError) => {
        if (requestError.name !== 'AbortError') {
          setError(requestError.message)
          setStatus('error')
        }
      })
    return () => controller.abort()
  }, [])

  return (
    <section className="resource-page" aria-labelledby="activities-title">
      <div className="page-heading">
        <p className="eyebrow">Movement log</p>
        <h1 id="activities-title">Activities</h1>
        <p>Recent training sessions across your OctoFit community.</p>
      </div>
      {status === 'loading' && <p className="state-message">Loading activities...</p>}
      {status === 'error' && <p className="state-message error-message">{error}</p>}
      {status === 'ready' && activities.length === 0 && <p className="state-message">No activities logged yet.</p>}
      {activities.length > 0 && (
        <div className="table-wrap">
          <table className="table resource-table">
            <thead><tr><th>Activity</th><th>Athlete</th><th>Duration</th><th>Completed</th></tr></thead>
            <tbody>
              {activities.map((activity) => (
                <tr key={activity._id || activity.id}>
                  <td><strong>{activity.type || activity.name || 'Training session'}</strong><small>{activity.notes || activity.description || 'Logged activity'}</small></td>
                  <td>{activity.userId?.displayName || activity.userId?.username || activity.username || 'Community member'}</td>
                  <td>{activity.duration ? `${activity.duration} min` : '—'}</td>
                  <td>{activity.completedAt ? new Date(activity.completedAt).toLocaleDateString() : '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  )
}

export default Activities
