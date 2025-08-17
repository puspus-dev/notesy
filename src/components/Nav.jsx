import React from 'react'

export default function Nav({ view, setView, onLogout }) {
  return (
    <div className="nav">
      <button className="button" onClick={() => setView('notes')}>Jegyzetek</button>
      <button className="button" onClick={() => setView('calc')}>Számológép</button>
      <button className="button" onClick={() => setView('timetable')}>Órarend</button>
      <button className="button" onClick={() => setView('settings')}>Beállítások</button>
      <div style={{flex:1}} />
      <button className="button" onClick={onLogout}>Kijelentkezés</button>
    </div>
  )
}
