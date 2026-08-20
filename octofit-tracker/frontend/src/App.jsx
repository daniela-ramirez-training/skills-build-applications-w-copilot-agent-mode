import { NavLink, Navigate, Route, Routes } from 'react-router-dom'
import './App.css'
import Activities from './components/Activities.jsx'
import Leaderboard from './components/Leaderboard.jsx'
import Teams from './components/Teams.jsx'
import Users from './components/Users.jsx'
import Workouts from './components/Workouts.jsx'

function App() {
  return (
    <div className="app-shell">
      <header className="app-header">
        <NavLink className="brand" to="/workouts"><span className="brand-mark">O</span><span>OctoFit <em>Tracker</em></span></NavLink>
        <span className="header-note">Train with intention</span>
      </header>
      <div className="app-layout">
        <nav className="side-nav" aria-label="Main navigation">
          <p className="nav-label">Explore</p>
          <NavLink to="/workouts">Workouts</NavLink>
          <NavLink to="/activities">Activities</NavLink>
          <NavLink to="/leaderboard">Leaderboard</NavLink>
          <p className="nav-label nav-label-spaced">Community</p>
          <NavLink to="/teams">Teams</NavLink>
          <NavLink to="/users">Users</NavLink>
        </nav>
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Navigate to="/workouts" replace />} />
            <Route path="/activities" element={<Activities />} />
            <Route path="/leaderboard" element={<Leaderboard />} />
            <Route path="/teams" element={<Teams />} />
            <Route path="/users" element={<Users />} />
            <Route path="/workouts" element={<Workouts />} />
            <Route path="*" element={<Navigate to="/workouts" replace />} />
          </Routes>
        </main>
      </div>
    </div>
  )
}

export default App
