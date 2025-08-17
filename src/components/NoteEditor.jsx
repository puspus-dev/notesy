import React, { useState } from 'react'

export default function NoteEditor({ note, onCancel, onSave }) {
  const [title, setTitle] = useState(note.title)
  const [content, setContent] = useState(note.content)
  const [subject, setSubject] = useState(note.subject || 'Általános')
  const [color, setColor] = useState(note.color || '#2563eb')

  const save = () => onSave(note.id, { title, content, subject, color })

  return (
    <div className="card">
      <div className="grid">
        <input className="input" value={title} onChange={e=>setTitle(e.target.value)} />
        <textarea className="textarea" rows="10" value={content} onChange={e=>setContent(e.target.value)} placeholder="Jegyzet tartalma (HTML/egyszerű szöveg)..." />
        <div className="row">
          <input className="input" value={subject} onChange={e=>setSubject(e.target.value)} placeholder="Tantárgy" />
          <input className="input" type="color" value={color} onChange={e=>setColor(e.target.value)} title="Szín" />
        </div>
        <div className="row" style={{justifyContent:'space-between'}}>
          <button className="button" onClick={save}>Mentés</button>
          <button className="button" onClick={onCancel}>Mégse</button>
        </div>
      </div>
    </div>
  )
}
