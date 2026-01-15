import { initializeApp } from "firebase/app"
import { getAuth, connectAuthEmulator, GoogleAuthProvider } from "firebase/auth"
import { getAnalytics } from "firebase/analytics"
import { getFirestore, connectFirestoreEmulator } from "firebase/firestore"

const firebaseConfig = {
  apiKey: "AIzaSyCy7LxLopqPiLOJanKC-CITSmyzHOv8UKw",
  authDomain: "garbage-afb5b.firebaseapp.com",
  projectId: "garbage-afb5b",
  storageBucket: "garbage-afb5b.firebasestorage.app",
  messagingSenderId: "348174846253",
  appId: "1:348174846253:web:0961673134ef879d6c2ba4",
  measurementId: "G-VXMN9WWNDV"
}

const app = initializeApp(firebaseConfig)
export const analytics = typeof window !== "undefined" ? getAnalytics(app) : null
export const auth = getAuth(app)
export const db = getFirestore(app)

export const googleProvider = new GoogleAuthProvider()
googleProvider.addScope("profile")
googleProvider.addScope("email")

// Emulator block disabled – using live Firebase services
// if (process.env.NODE_ENV === "development" && typeof window !== "undefined") {
//   try {
//     connectAuthEmulator(auth, "http://localhost:9099", { disableWarnings: true })
//     connectFirestoreEmulator(db, "localhost", 8080)
//   } catch (err) {
//     // Emulator already connected
//   }
// }
