import { 
    signInWithEmailAndPassword, 
    createUserWithEmailAndPassword, 
    signInWithPopup, 
    GoogleAuthProvider,
    signOut,
    onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";
import { auth } from "./firebase-config.js";

const googleProvider = new GoogleAuthProvider();

// Sign Up
export async function signUp(email, password) {
    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        return { user: userCredential.user, error: null };
    } catch (error) {
        return { user: null, error: error.message };
    }
}

// Sign In
export async function signIn(email, password) {
    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        return { user: userCredential.user, error: null };
    } catch (error) {
        return { user: null, error: error.message };
    }
}

// Google Sign In
export async function signInWithGoogle() {
    try {
        const result = await signInWithPopup(auth, googleProvider);
        return { user: result.user, error: null };
    } catch (error) {
        return { user: null, error: error.message };
    }
}

// Sign Out
export async function logOut() {
    try {
        await signOut(auth);
        return { success: true, error: null };
    } catch (error) {
        return { success: false, error: error.message };
    }
}

// Observe Auth State
export function observeAuth(callback) {
    onAuthStateChanged(auth, callback);
}
