import React, { useState } from 'react'

export default function Calculator() {
  const [expr, setExpr] = useState('')
  const [result, setResult] = useState('')

  const append = (v) => setExpr(e => e + v)
  const clear = () => { setExpr(''); setResult('') }
  const back = () => setExpr(e => e.slice(0, -1))

  const evaluate = () => {
    try {
      // Egyszerű, tudományos funkciók támogatása
      const scope = {
        sin: Math.sin,
        cos: Math.cos,
        tan: Math.tan,
        log: Math.log10,
        ln: Math.log,
        sqrt: Math.sqrt,
        pi: Math.PI,
        e: Math.E,
        pow: Math.pow
      }
      // biztonságos evaluate helyett minimál: Function + whitelist
      const code = expr.replace(/[^0-9+\-*/()., a-zA-Z]/g, '')
      // eslint-disable-next-line no-new-func
      const fn = new Function(...Object.keys(scope), `return (${code})`)
      const val = fn(...Object.values(scope))
      setResult(String(val))
    } catch (e) {
      setResult('Hiba')
    }
  }

  const keys = [
    '7','8','9','/','sin(','cos(','tan(',
    '4','5','6','*','log(','ln(','sqrt(',
    '1','2','3','-','^','pi','e',
    '0','.','=','+','(',')','pow('
  ]

  return (
    <div className="grid">
      <div className="card">
        <div className="row">
          <input className="input" value={expr} onChange={e=>setExpr(e.target.value)} placeholder="Kifejezés pl. sqrt(2^2 + 3^2)" />
          <button className="button" onClick={clear}>C</button>
          <button className="button" onClick={back}>⌫</button>
        </div>
        <div style={{marginTop:8}}><strong>Eredmény:</strong> {result}</div>
      </div>
      <div className="card grid" style={{gridTemplateColumns:'repeat(7, 1fr)'}}>
        {keys.map(k => (
          <button key={k} className="button" onClick={() => k==='=' ? evaluate() : append(k)}>{k}</button>
        ))}
      </div>
    </div>
  )
}
