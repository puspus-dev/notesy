import React, { useEffect, useState } from 'react'
import { collection, addDoc, onSnapshot, query, where, orderBy, serverTimestamp } from 'firebase/firestore'
import { db, auth } from '../firebase'

export default function Timetable() {
  const [items, setItems] = useState([])
  const [form, setForm] = useState({ subject:'', day:'Hétfő', start:'08:00', end:'08:45', color:'#10b981' })

  useEffect(() => {
    const uid = auth.currentUser?.uid
    if (!uid) return
    const q = query(collection(db, 'timetable'), where('uid','==', uid), orderBy('dayIndex'), orderBy('start'))
    const unsub = onSnapshot(q, snap => setItems(snap.docs.map(d => ({id:d.id, ...d.data()}))))
    return () => unsub()
  }, [])

  const add = async (e) => {
    e.preventDefault()
    const uid = auth.currentUser?.uid
    const days = ['Hétfő','Kedd','Szerda','Csütörtök','Péntek','Szombat','Vasárnap']
    const dayIndex = days.indexOf(form.day)
    await addDoc(collection(db, 'timetable'), { uid, ...form, dayIndex, createdAt: serverTimestamp() })
  }

  const days = ['Hétfő','Kedd','Szerda','Csütörtök','Péntek']

  return (
    <div className="grid">
      <form onSubmit={add} className="card grid">
        <div className="row">
          <input className="input" placeholder="Tantárgy" value={form.subject} onChange={e=>setForm({...form, subject:e.target.value})} />
          <select className="select" value={form.day} onChange={e=>setForm({...form, day:e.target.value})}>
            {days.map(d => <option key={d}>{d}</option>)}
          </select>
          <input className="input" type="time" value={form.start} onChange={e=>setForm({...form, start:e.target.value})} />
          <input className="input" type="time" value={form.end} onChange={e=>setForm({...form, end:e.target.value})} />
          <input className="input" type="color" value={form.color} onChange={e=>setForm({...form, color:e.target.value})} />
          <button className="button">+ Hozzáadás</button>
        </div>
      </form>

      <div className="card">
        <h3>Heti órarend</h3>
        <div className="grid" style={{gridTemplateColumns:'repeat(5, 1fr)'}}>
          {days.map(d => (
            <div key={d} className="card">
              <strong>{d}</strong>
              {items.filter(i => i.day === d).map(i => (
                <div key={i.id} className="card" style={{background:i.color, color:'#fff', marginTop:8}}>
                  <div><strong>{i.subject}</strong></div>
                  <small>{i.start}–{i.end}</small>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
