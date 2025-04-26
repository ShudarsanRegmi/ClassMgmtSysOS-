import React, { useState } from "react";
import { auth } from "../firebase";
import { signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider, GithubAuthProvider } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { FaGoogle, FaGithub, FaEnvelope, FaLock } from "react-icons/fa";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      console.log("User Logged In:", userCredential.user);
      navigate("/");
    } catch (error) {
      console.error("Login Error:", error.message);
      setError(error.message);
    }
  };

  const handleGoogleLogin = async () => {
    setError("");
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      console.log("Google Login Success:", result.user);
      navigate("/");
    } catch (error) {
      console.error("Google Login Error:", error.message);
      setError(error.message);
    }
  };

  const handleGithubLogin = async () => {
    setError("");
    const provider = new GithubAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      console.log("GitHub Login Success:", result.user);
      navigate("/");
    } catch (error) {
      console.error("GitHub Login Error:", error.message);
      setError(error.message);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-8 bg-white shadow-md rounded-lg">
      <h2 className="text-2xl font-semibold text-center mb-6 text-gray-700">Login</h2>

      {error && (
        <div className="bg-red-100 text-red-700 p-3 mb-6 rounded-md text-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleLogin} className="flex flex-col space-y-4">
        <div className="flex items-center border border-gray-300 rounded-md overflow-hidden">
          <div className="bg-gray-100 p-3">
            <FaEnvelope className="text-gray-500" />
          </div>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="flex-1 p-3 focus:outline-none"
          />
        </div>

        <div className="flex items-center border border-gray-300 rounded-md overflow-hidden">
          <div className="bg-gray-100 p-3">
            <FaLock className="text-gray-500" />
          </div>
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="flex-1 p-3 focus:outline-none"
          />
        </div>

        <button type="submit" className="bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition">
          Login
        </button>
      </form>

      <div className="flex items-center my-6">
        <div className="flex-grow border-t border-gray-300"></div>
        <span className="mx-4 text-gray-500 text-sm">OR</span>
        <div className="flex-grow border-t border-gray-300"></div>
      </div>

      <div className="flex flex-col space-y-4">
        <button
          onClick={handleGoogleLogin}
          className="flex items-center justify-center bg-red-500 text-white py-2 rounded-md hover:bg-red-600 transition"
        >
          <FaGoogle className="mr-2" /> Continue with Google
        </button>

        <button
          onClick={handleGithubLogin}
          className="flex items-center justify-center bg-gray-800 text-white py-2 rounded-md hover:bg-gray-900 transition"
        >
          <FaGithub className="mr-2" /> Continue with GitHub
        </button>
      </div>
    </div>
  );
};

export default Login;
