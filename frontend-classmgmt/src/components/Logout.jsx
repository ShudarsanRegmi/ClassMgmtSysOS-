// src/components/Logout.js
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAuth, signOut } from 'firebase/auth';

const Logout = () => {
  const navigate = useNavigate();
  const auth = getAuth();

  useEffect(() => {
    signOut(auth)
      .then(() => {
        // Sign-out successful
        navigate('/login');
      })
      .catch((error) => {
        console.error("Error signing out: ", error);
      });
  }, [auth, navigate]);

  return <p>Logging out...</p>;
};

export default Logout;
