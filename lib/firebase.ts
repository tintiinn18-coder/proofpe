import { getApp, getApps, initializeApp } from "firebase/app";
import type { FirebaseApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const requiredEnv = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID
};

const firebaseConfig = {
  ...requiredEnv,
  storageBucket: requiredEnv.storageBucket?.replace(/^gs:\/\//, "")
};

const missingEnv = Object.entries(requiredEnv)
  .filter(([, value]) => !value)
  .map(([key]) => `NEXT_PUBLIC_FIREBASE_${key.replace(/[A-Z]/g, (letter) => `_${letter}`).toUpperCase()}`);

export const isFirebaseConfigured = missingEnv.length === 0;

if (!isFirebaseConfigured) {
  console.error("[ProofPe Firebase] Missing env variables:", missingEnv.join(", "));
}

if (requiredEnv.storageBucket?.startsWith("gs://")) {
  console.error(
    '[ProofPe Firebase] NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET must use "proofpe-app.appspot.com", not a gs:// URL.'
  );
}

function createFirebaseApp(): FirebaseApp | null {
  if (!isFirebaseConfigured) return null;

  const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
  console.log("[ProofPe Firebase] Firebase init success", {
    projectId: firebaseConfig.projectId,
    storageBucket: firebaseConfig.storageBucket
  });

  return app;
}

const app = createFirebaseApp();

export const db = app ? getFirestore(app) : null;
export const storage = app ? getStorage(app) : null;
export const auth = app ? getAuth(app) : null;
export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({
  prompt: "select_account"
});
