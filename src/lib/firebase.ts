
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Your Firebase config - users will need to replace with their own
// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAJuAxnkE6z3dK7k9oD9z57LUWGuZc1rqg",
  authDomain: "mediqueue-admin.firebaseapp.com",
  projectId: "mediqueue-admin",
  storageBucket: "mediqueue-admin.firebasestorage.app",
  messagingSenderId: "717801261",
  appId: "1:717801261:web:4deb2c0a780404e46ab5a4"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);

// Initialize Cloud Firestore and get a reference to the service
export const db = getFirestore(app);

export default app;
