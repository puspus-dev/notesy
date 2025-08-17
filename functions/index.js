import * as functions from 'firebase-functions'
import * as admin from 'firebase-admin'
import speakeasy from 'speakeasy'

try { admin.initializeApp() } catch {}

const db = admin.firestore()

// Callable: TOTP secret generálás + otpauth URL
export const totpGenerateSecret = functions.https.onCall(async (data, context) => {
  if (!context.auth) throw new functions.https.HttpsError('unauthenticated', 'Belépés szükséges')
  const user = context.auth
  const secret = speakeasy.generateSecret({ name: `StudentNotes (${user.token.email || user.uid})` })
  return { secret: secret.base32, otpauth: secret.otpauth_url }
})

// Callable: Ellenőrzés és 2FA bekapcsolása a felhasználónál
export const totpVerifyAndEnable = functions.https.onCall(async (data, context) => {
  if (!context.auth) throw new functions.https.HttpsError('unauthenticated', 'Belépés szükséges')
  const { secret, token } = data || {}
  const verified = speakeasy.totp.verify({ secret, encoding: 'base32', token, window: 1 })
  if (!verified) return { ok: false }

  const uid = context.auth.uid
  await db.collection('user_secrets').doc(uid).set({ secret }, { merge: true })
  await admin.auth().setCustomUserClaims(uid, { has2fa: true })
  return { ok: true }
})

// Callable: Belépés utáni TOTP challenge
export const totpChallenge = functions.https.onCall(async (data, context) => {
  if (!context.auth) throw new functions.https.HttpsError('unauthenticated', 'Belépés szükséges')
  const uid = context.auth.uid
  const snap = await db.collection('user_secrets').doc(uid).get()
  const doc = snap.data()
  if (!doc?.secret) return { ok: true } // nincs bekapcsolva 2FA

  const { token } = data || {}
  const verified = speakeasy.totp.verify({ secret: doc.secret, encoding: 'base32', token, window: 1 })
  return { ok: !!verified }
})
