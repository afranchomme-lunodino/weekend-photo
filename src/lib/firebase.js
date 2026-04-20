import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

// Remplace ces valeurs par ta configuration Firebase
// Firebase Console → Paramètres du projet → Tes applications → SDK de configuration
const firebaseConfig = {
  apiKey: "AIzaSyAIHTNuT7QCw9lFzXnTFIv5g55ktPiSVco",
  authDomain: "weekend-mamina-et-grand-pere.firebaseapp.com",
  projectId: "weekend-mamina-et-grand-pere",
  storageBucket: "weekend-mamina-et-grand-pere.firebasestorage.app",
  messagingSenderId: "546309333924",
  appId: "1:546309333924:web:a0e2a14c5af7350a115731",
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
