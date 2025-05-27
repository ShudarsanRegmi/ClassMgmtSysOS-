import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { getAuth } from "firebase/auth";
import { useAuth } from "../context/AuthContext";

const ProfileForm = () => {
  const { currentUser } = useAuth();
  const [email, setEmail] = useState(currentUser?.email || "");
  const [name, setName] = useState("");
  const [role, setRole] = useState("STUDENT");
  const [phone, setPhone] = useState("");
  const [classId, setClassId] = useState("");
  const [profilePhoto, setProfilePhoto] = useState(null);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const auth = getAuth();
      const user = auth.currentUser;

      if (!user) throw new Error("User not authenticated");

      const token = await user.getIdToken();
      
      // Create form data
      const formData = new FormData();
      formData.append("name", name);
      formData.append("email", user.email);
      formData.append("role", role);
      formData.append("phone", phone);
      
      // Only append classId if the role is not 'FACULTY'
      if (role !== "FACULTY" && classId) {
        formData.append("classId", classId);
      }

      // Only append photo if one was selected
      if (profilePhoto) {
        formData.append("profilePhoto", profilePhoto);
      }

      // Log the form data to verify
      for (let [key, value] of formData.entries()) {
        console.log(`${key}: ${value}`);
      }

      const response = await axios.post("http://localhost:3001/api/complete-profile", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      console.log("Profile completed successfully:", response.data);
      navigate("/");
    } catch (err) {
      console.error("Profile completion error:", err);
      setError(err.response?.data?.message || "Failed to complete profile. Please try again.");
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white shadow-md rounded-md">
      <h2 className="text-2xl font-bold mb-6 text-gray-700 text-center">
        Complete Your Profile
      </h2>
      {error && <p className="text-red-600 mb-4 text-sm">{error}</p>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          placeholder="Full Name"
          className="w-full border border-gray-300 rounded-md p-3"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <input
          type="email"
          placeholder="Email"
          className="w-full border border-gray-300 rounded-md p-3 bg-gray-100 cursor-not-allowed"
          value={email}
          disabled
        />
        <select
          className="w-full border border-gray-300 rounded-md p-3"
          value={role}
          onChange={(e) => setRole(e.target.value)}
        >
          <option value="STUDENT">Student</option>
          <option value="FACULTY">Teacher</option>
          <option value="CR">Class Representative (CR)</option>
          <option value="CA">Class Advisor (CA)</option>
        </select>
        <input
          type="tel"
          placeholder="Phone Number"
          className="w-full border border-gray-300 rounded-md p-3"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          required
        />

        {role !== "FACULTY" && (
          <input
            type="text"
            placeholder="Class Id"
            className="w-full border border-gray-300 rounded-md p-3"
            value={classId}
            onChange={(e) => setClassId(e.target.value)}
            required
          />
        )}

        <input
          type="file"
          accept="image/*"
          className="w-full border border-gray-300 rounded-md p-3"
          onChange={(e) => setProfilePhoto(e.target.files[0])}
        />
        <button
          type="submit"
          className="bg-blue-600 text-white w-full py-2 rounded-md hover:bg-blue-700 transition"
        >
          Save Profile
        </button>
      </form>
    </div>
  );
};

export default ProfileForm;
