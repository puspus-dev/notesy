
import { initializeApp } from 'firebase/app'
import { getAuth, GoogleAuthProvider } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'
import { getFunctions, httpsCallable } from 'firebase/functions'

const firebaseConfig = {
  apiKey: 'AIzaSyDq-NRQg1c2vV1cTuTl8F2K9IdZpR8qT2I',
  authDomain: 'notesy-1a1ae.firebaseapp.com',
  projectId: 'notesy-1a1ae',
  storageBucket: 'notesy-1a1ae.firebasestorage.app',
  messagingSenderId: '870185158908',
  appId: '1:870185158908:web:22cc9cdcce9f9a9165ef79'
}

const app = initializeApp(firebaseConfig)

export const auth = getAuth(app)
export const db = getFirestore(app)
export const functions = getFunctions(app)
export const googleProvider = new GoogleAuthProvider()

// Callable függvények a TOTP-hoz
export const totpGenerateSecret = httpsCallable(functions, 'totpGenerateSecret')
export const totpVerifyAndEnable = httpsCallable(functions, 'totpVerifyAndEnable')
export const totpChallenge = httpsCallable(functions, 'totpChallenge')
