import { initializeApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'

const firebaseConfig = {
  apiKey: 'AIzaSyDIpM2rlSc-JwQqNF3exa36HURU5SUUfQ8',
  authDomain: 'church-d325f.firebaseapp.com',
  projectId: 'church-d325f',
  storageBucket: 'church-d325f.firebasestorage.app',
  messagingSenderId: '257498545329',
  appId: '1:257498545329:web:c19a07c9e31199e20a7690',
}

const app = initializeApp(firebaseConfig)

export const db = getFirestore(app)

export default app