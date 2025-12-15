
// src/lib/firebase.ts
import { initializeApp, getApps, type FirebaseApp } from 'firebase/app';
import { getAuth, type Auth } from 'firebase/auth';
import { getFirestore, type Firestore, connectFirestoreEmulator } from 'firebase/firestore';
import { getDatabase, type Database as RealtimeDatabase, connectDatabaseEmulator } from 'firebase/database';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
  databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL, // Ensure this is in your .env for RTDB
};

let app: FirebaseApp;
let auth: Auth;
let db: Firestore;
let rtdb: RealtimeDatabase | undefined; // Can be undefined

// Initialize Firebase App
if (!getApps().length) {
  app = initializeApp(firebaseConfig);
} else {
  app = getApps()[0];
}

// Initialize services
auth = getAuth(app);
db = getFirestore(app);


// Conditionally initialize RTDB only if the databaseURL is provided and valid
try {
  if (firebaseConfig.databaseURL && new URL(firebaseConfig.databaseURL)) {
    rtdb = getDatabase(app);
  }
} catch (e) {
    console.warn("Firebase Realtime Database URL is invalid, skipping initialization.");
    rtdb = undefined;
}


export { app, auth, db, rtdb };
