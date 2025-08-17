import React, { useState } from 'react'
import { totpChallenge } from '../firebase'

export default function TwoFAVerify({ onPassed }) {
  const [code, setCode] = useState('')
  const [msg, setMsg] = useState('')

  const verify = async () => {
    setMsg('')
    const res = await totpChallenge({ token: code })
    if (res.data?.ok) onPassed()
    else setMsg('Rossz kód, próbáld újra.')
  }

  return (
    <div className="card" style={{maxWidth: 420, margin:'24px auto'}}>
      <h2>2FA ellenőrzés</h2>
      <input className="input" placeholder="Authenticator kód" value={code} onChange={e=>setCode(e.target.value)} />
      <div style={{marginTop:8}}>
        <button className="button" onClick={verify}>Belépés</button>
      </div>
      {msg && <small>{msg}</small>}
    </div>
  )
}
