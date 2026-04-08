import { initializeApp } from "firebase/app";
import { 
  getAuth, 
  GoogleAuthProvider, 
  signInWithPopup, 
  sendSignInLinkToEmail 
} from "firebase/auth"; //

const firebaseConfig = {
  apiKey: "AIzaSyA9ej_eGG3zpMUEHRQcN6qJpxpKBK3Rg6A",
  authDomain: "vyaparai-ef3cf.firebaseapp.com",
  projectId: "vyaparai-ef3cf",
  storageBucket: "vyaparai-ef3cf.firebasestorage.app",
  messagingSenderId: "924542456046",
  appId: "1:924542456046:web:f830359ae4d55a92a123ff",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Industry Standard: Named Exports
export const auth = getAuth(app); 
export const googleProvider = new GoogleAuthProvider();

// FIX: This is the missing export causing your SyntaxError
export const actionCodeSettings = {
  // Ensure this URL exactly matches your Vite development port
  url: 'http://localhost:5173/verify', 
  handleCodeInApp: true,
};

// Professional Google Login Logic
export const signInWithGoogle = async () => {
  try {
    // Force Google to show the account picker every time
    googleProvider.setCustomParameters({ prompt: 'select_account' });
    const result = await signInWithPopup(auth, googleProvider);
    return result.user;
  } catch (error) {
    console.error("Google Auth Error:", error.code);
    throw error;
  }
};