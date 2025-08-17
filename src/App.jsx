import React, { useEffect, useState } from 'react'
import { onAuthStateChanged, signOut } from 'firebase/auth'
import { auth } from './firebase'
import Login from './components/Login'
import Notes from './components/Notes'
import Calculator from './components/Calculator'
import Timetable from './components/Timetable'
import Settings from './components/Settings'
import TwoFAVerify from './components/TwoFAVerify'
import Nav from './components/Nav'

export default function App() {
  const [user, setUser] = useState(null)
  const [view, setView] = useState('notes')
  const [needs2FA, setNeeds2FA] = useState(false)

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (u) => {
      setUser(u)
      if (u) {
        // Ellenőrzés: szükséges-e TOTP challenge (custom claims/metadata alapján).
        // Egyszerűsített: a TwoFAVerify komponens rákérdez a Functions-ön.
        setNeeds2FA(true)
      } else {
        setNeeds2FA(false)
      }
    })
    return () => unsub()
  }, [])

  if (!user) return <Login />

  return (
    <div className="app">
      <Nav view={view} setView={setView} onLogout={() => signOut(auth)} />
      {needs2FA ? (
        <TwoFAVerify onPassed={() => setNeeds2FA(false)} />
      ) : (
        <>
          {view === 'notes' && <Notes />}
          {view === 'calc' && <Calculator />}
          {view === 'timetable' && <Timetable />}
          {view === 'settings' && <Settings />}
        </>
      )}
    </div>
  )
}
