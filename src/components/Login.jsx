import React, { useState } from 'react'
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, signInWithPopup } from 'firebase/auth'
import { auth, googleProvider } from '../firebase'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isRegister, setIsRegister] = useState(false)
  const [error, setError] = useState('')

  const submit = async (e) => {
    e.preventDefault()
    setError('')
    try {
      if (isRegister) {
        await createUserWithEmailAndPassword(auth, email, password)
      } else {
        await signInWithEmailAndPassword(auth, email, password)
      }
    } catch (err) {
      setError(err.message)
    }
  }

  const signInGoogle = async () => {
    setError('')
    try {
      await signInWithPopup(auth, googleProvider)
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <div className="app">
      <div className="card" style={{maxWidth: 420, margin: '40px auto'}}>
        <h1>Student Notes</h1>
        <p>Jegyzetelés + számológép + órarend</p>
        <form onSubmit={submit} className="grid">
          <input className="input" placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} />
          <input className="input" placeholder="Jelszó" type="password" value={password} onChange={e=>setPassword(e.target.value)} />
          <button className="button" type="submit">{isRegister ? 'Regisztráció' : 'Bejelentkezés'}</button>
          <button className="button" type="button" onClick={signInGoogle}>Belépés Google-lel</button>
          {error && <small className="muted">{error}</small>}
        </form>
        <div style={{marginTop: 8}}>
          <button className="button" onClick={()=>setIsRegister(v=>!v)}>
            {isRegister ? 'Van fiókom' : 'Új fiók létrehozása'}
          </button>
        </div>
      </div>
    </div>
  )
}
