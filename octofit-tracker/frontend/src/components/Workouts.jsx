import { useEffect, useState } from 'react'
import { getItems } from '../api.js'

const codespaceName = import.meta.env.VITE_CODESPACE_NAME?.trim()
const workoutsApiUrl = codespaceName
  ? `https://${codespaceName}-8000.app.github.dev/api/workouts/`
  : 'http://localhost:8000/api/workouts/'

function fetchWorkouts(signal) {
  return fetch(workoutsApiUrl, { signal }).then((response) => {
    if (!response.ok) throw new Error(`Unable to load workouts (${response.status})`)
    return response.json()
  }).then(getItems)
}

function Workouts() {
  const [workouts, setWorkouts] = useState([])
  const [status, setStatus] = useState('loading')
  const [error, setError] = useState('')

  useEffect(() => {
    const controller = new AbortController()
    fetchWorkouts(controller.signal)
      .then(setWorkouts)
      .then(() => setStatus('ready'))
      .catch((requestError) => {
        if (requestError.name !== 'AbortError') { setError(requestError.message); setStatus('error') }
      })
    return () => controller.abort()
  }, [])

  return (
    <section className="resource-page" aria-labelledby="workouts-title">
      <div className="page-heading"><p className="eyebrow">Built for today</p><h1 id="workouts-title">Workouts</h1><p>Focused sessions with just enough challenge to keep you coming back.</p></div>
      {status === 'loading' && <p className="state-message">Loading workouts...</p>}
      {status === 'error' && <p className="state-message error-message">{error}</p>}
      {status === 'ready' && workouts.length === 0 && <p className="state-message">No workouts are available yet.</p>}
      {workouts.length > 0 && <div className="workout-grid">{workouts.map((workout) => <article className="workout-card" key={workout._id || workout.id}><span className="workout-type">{workout.difficulty || 'Training'}</span><h2>{workout.name || 'Untitled workout'}</h2><p>{workout.description || 'A purposeful session for your next training block.'}</p><footer><span>{workout.duration ? `${workout.duration} min` : 'Flexible length'}</span><span>{workout.exerciseCount ? `${workout.exerciseCount} exercises` : 'Full body'}</span></footer></article>)}</div>}
    </section>
  )
}

export default Workouts
