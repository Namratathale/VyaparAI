import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";

const firebaseConfig = {

  apiKey: "AIzaSyA9ej_eGG3zpMUEHRQcN6qJpxpKBK3Rg6A",
  authDomain: "vyaparai-ef3cf.firebaseapp.com",
  projectId: "vyaparai-ef3cf",
  storageBucket: "vyaparai-ef3cf.firebasestorage.app",
  messagingSenderId: "924542456046",
  appId: "1:924542456046:web:f830359ae4d55a92a123ff",

};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
const provider = new GoogleAuthProvider();

export const signInWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, provider);
    return result.user;
  } catch (error) {
    console.error("Error signing in with Google", error);
    throw error;
  }
};