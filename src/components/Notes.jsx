import React, { useEffect, useState } from 'react'
import { collection, addDoc, onSnapshot, query, where, orderBy, serverTimestamp, doc, deleteDoc, updateDoc } from 'firebase/firestore'
import { db, auth } from '../firebase'
import NoteEditor from './NoteEditor'

export default function Notes() {
  const [notes, setNotes] = useState([])
  const [editing, setEditing] = useState(null)
  const [filter, setFilter] = useState('')

  useEffect(() => {
    const uid = auth.currentUser?.uid
    if (!uid) return
    const q = query(
      collection(db, 'notes'),
      where('uid', '==', uid),
      orderBy('createdAt', 'desc')
    )
    const unsub = onSnapshot(q, snap => {
      setNotes(snap.docs.map(d => ({ id: d.id, ...d.data() })))
    })
    return () => unsub()
  }, [])

  const createNote = async () => {
    const uid = auth.currentUser?.uid
    const title = prompt('Jegyzet címe?') || 'Új jegyzet'
    await addDoc(collection(db, 'notes'), {
      uid, title, content: '', subject: 'Általános', color: '#2563eb',
      createdAt: serverTimestamp(), updatedAt: serverTimestamp()
    })
  }

  const remove = async (id) => {
    if (confirm('Biztos törlöd?')) {
      await deleteDoc(doc(db, 'notes', id))
    }
  }

  const save = async (id, data) => {
    await updateDoc(doc(db, 'notes', id), { ...data, updatedAt: serverTimestamp() })
    setEditing(null)
  }

  const filtered = notes.filter(n => n.title.toLowerCase().includes(filter.toLowerCase()) || n.subject.toLowerCase().includes(filter.toLowerCase()))

  return (
    <div className="grid" style={{gap:16}}>
      <div className="row">
        <button className="button" onClick={createNote}>+ Új jegyzet</button>
        <input className="input" placeholder="Keresés..." value={filter} onChange={e=>setFilter(e.target.value)} />
      </div>
      {editing ? (
        <NoteEditor note={editing} onCancel={()=>setEditing(null)} onSave={save} />
      ) : (
        <div className="grid notes">
          {filtered.map(n => (
            <div key={n.id} className="card">
              <div className="row" style={{justifyContent:'space-between'}}>
                <h3 style={{margin:0}}>{n.title}</h3>
                <span className="badge" style={{background:n.color}}>{n.subject}</span>
              </div>
              <div style={{height:80, overflow:'hidden', opacity:0.8}} dangerouslySetInnerHTML={{__html: n.content?.slice(0,200)}} />
              <div className="row" style={{justifyContent:'space-between'}}>
                <button className="button" onClick={()=>setEditing(n)}>Szerkesztés</button>
                <button className="button" onClick={()=>remove(n.id)}>Törlés</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
