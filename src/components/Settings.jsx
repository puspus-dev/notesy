import React, { useEffect, useState } from 'react'
import { totpGenerateSecret, totpVerifyAndEnable } from '../firebase'
import QRCode from 'qrcode'

export default function Settings() {
  const [dark, setDark] = useState(false)
  const [qrDataUrl, setQrDataUrl] = useState(null)
  const [tmpSecret, setTmpSecret] = useState(null)
  const [code, setCode] = useState('')
  const [message, setMessage] = useState('')

  useEffect(() => {
    const saved = localStorage.getItem('darkMode') === 'true'
    setDark(saved)
    document.documentElement.dataset.theme = saved ? 'dark' : 'light'
  }, [])

  const toggleDark = () => {
    const next = !dark
    setDark(next)
    localStorage.setItem('darkMode', String(next))
    document.documentElement.dataset.theme = next ? 'dark' : 'light'
  }

  const setup2FA = async () => {
    setMessage('')
    const res = await totpGenerateSecret()
    const { otpauth, secret } = res.data
    setTmpSecret(secret)
    const url = await QRCode.toDataURL(otpauth)
    setQrDataUrl(url)
  }

  const verify2FA = async () => {
    setMessage('')
    const res = await totpVerifyAndEnable({ secret: tmpSecret, token: code })
    if (res.data?.ok) setMessage('2FA aktiválva ✅')
    else setMessage('Sikertelen ellenőrzés ❌')
  }

  return (
    <div className="grid" style={{gap:16}}>
      <div className="card row" style={{justifyContent:'space-between'}}>
        <div className="toggle">
          <input type="checkbox" checked={dark} onChange={toggleDark} />
          <label>Sötét mód</label>
        </div>
        <small className="muted">A beállítás elmentésre kerül a böngésződben.</small>
      </div>

      <div className="card">
        <h3>Kétlépcsős azonosítás (TOTP)</h3>
        <div className="grid">
          <button className="button" onClick={setup2FA}>QR-kód generálása</button>
          {qrDataUrl && <img alt="2FA QR" src={qrDataUrl} style={{maxWidth:240}} />}
          <input className="input" placeholder="Kód az Authenticator-ból" value={code} onChange={e=>setCode(e.target.value)} />
          <button className="button" onClick={verify2FA}>Aktiválás</button>
          {message && <small>{message}</small>}
        </div>
      </div>
    </div>
  )
}
