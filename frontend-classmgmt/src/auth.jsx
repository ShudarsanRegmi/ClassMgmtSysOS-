import { auth } from "./firebase";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";

// Register User
const handleRegister = async (email, password) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    console.log("🎉 Registered:", userCredential.user);
  } catch (err) {
    console.error("⚠️ Error registering:", err.message);
  }
};

// Login User
const handleLogin = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    console.log("✅ Logged in:", userCredential.user);
    const token = await userCredential.user.getIdToken();
    // send token to backend!
  } catch (err) {
    console.error("❌ Login failed:", err.message);
  }
};
