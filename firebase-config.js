// Firebase configuration and initialization for Chrome extension
import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js';
import { getAuth } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js';

const firebaseConfig = {
  apiKey: "AIzaSyCP541ax1bECwsauEVgChzmz2iCIWvrPjI",
  authDomain: "verify-ai-dev.firebaseapp.com",
  projectId: "verify-ai-dev",
  storageBucket: "verify-ai-dev.firebasestorage.app",
  messagingSenderId: "594154854837",
  appId: "1:594154854837:web:ec81de48c483e1b375a1fc",
  measurementId: "G-YTP0NQXVP2"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
