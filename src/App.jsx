import { lazy, Suspense } from 'react'
import './App.css'
import { Navigate, Route, Routes } from 'react-router-dom'
import MainLayout from './layouts/MainLayout'

const Dashboard = lazy(() => import('./pages/Dashboard'))
const Timer = lazy(() => import('./pages/Timer'))
const Statistics = lazy(() => import('./pages/Statistics'))
const Calendar = lazy(() => import('./pages/Calendar'))
const Technologies = lazy(() => import('./pages/Technologies'))
const History = lazy(() => import('./pages/History'))
const Achievements = lazy(() => import('./pages/Achievements'))
const Challenges = lazy(() => import('./pages/Challenges'))
const Notes = lazy(() => import('./pages/Notes'))
const Music = lazy(() => import('./pages/Music'))
const Settings = lazy(() => import('./pages/Settings'))

function App() {
  return (
    <MainLayout>
      <Suspense fallback={<div className="flex justify-center py-12 text-text-muted">Loading…</div>}>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/timer" element={<Timer />} />
          <Route path="/statistics" element={<Statistics />} />
          <Route path="/calendar" element={<Calendar />} />
          <Route path="/technologies" element={<Technologies />} />
          <Route path="/history" element={<History />} />
          <Route path="/achievements" element={<Achievements />} />
          <Route path="/challenges" element={<Challenges />} />
          <Route path="/notes" element={<Notes />} />
          <Route path="/music" element={<Music />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
    </MainLayout>
  )
}

export default App
