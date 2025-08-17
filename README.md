
# Notesy – React + Firebase (GitHub Pages + Firebase backend)

Ez egy **éles** webapp alap, ami tartalmazza:
- Bejelentkezés: **Google + Email/jelszó** (Firebase Auth)
- Jegyzetek: **CRUD Firestore**-ral (felhasználónként)
- **Sötét mód** (rendszerhez igazodva + kézi váltó, localStorage)
- **Számológép** (alap + tudományos funkciók)
- **Órarend** modul (heti nézet alap, jegyzetek hozzárendelése)
- **2FA** (TOTP, Google/Microsoft Authenticator) – **Firebase Cloud Functions**-szal

## 1) Telepítés

```bash
npm install
```

Majd töltsd ki a `src/firebase.js` fájlban a saját Firebase adataidat.

Fejlesztői mód:
```bash
npm run dev
```

## 2) GitHub Pages deploy

1. `package.json`-ban állítsd a `homepage`-et és a `vite.config.js` `base` értékét:
   - `homepage`: `https://FELHASZNALONEV.github.io/REPO_NEV`
   - `vite.config.js` -> `base: '/REPO_NEV/'`
2. Telepítés és build:
   ```bash
   npm run build
   npm run deploy
   ```
3. A Firebase Console-ban engedélyezd az `authDomain` alatt a `FELHASZNALONEV.github.io` domaint.

## 3) Firebase beállítás

Firebase Console:
- Authentication -> Email/Password + Google engedélyezése
- Firestore -> adatbázis létrehozása
- Storage -> (ha képeket is szeretnél jegyzetekhez)
- Functions -> a `functions` mappát deploy-olhatod a TOTP 2FA-hoz

### Functions (TOTP 2FA)
Lépések:
```bash
cd functions
npm install
firebase login
firebase init functions # ha még nem tetted meg
firebase deploy --only functions
```
A frontend a callable function-ön keresztül:
- `totpGenerateSecret` -> titok generálás + QR adat
- `totpVerifyAndEnable` -> ellenőrzés és bekapcsolás
- `totpChallenge` -> bejelentkezés utáni TOTP ellenőrzés

> **Megjegyzés:** A TOTP titkot a Firestore-ban (user privát doc) tároljuk, és a felhasználói `customClaims`-ben jelöljük, hogy 2FA aktív-e.

## 4) Biztonság
- Firestore Security Rules: csak a saját jegyzeteit olvashassa/írhassa a user.
- A TOTP ellenőrzést Functions végzi; a frontend csak a kódot küldi.

## 5) Struktúra

```
src/
  components/
    Calculator.jsx
    Login.jsx
    Nav.jsx
    NoteEditor.jsx
    Notes.jsx
    Settings.jsx
    Timetable.jsx
    TwoFASetup.jsx
    TwoFAVerify.jsx
  App.jsx
  firebase.js
  main.jsx
  styles.css
functions/
  index.js
  package.json
firebase.json (példa a README alján)
```

## 6) Példa `firebase.json`

```json
{
  "functions": {
    "runtime": "nodejs20",
    "source": "functions"
  }
}
```

Sok sikert! 🚀
