import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from '../utils/api';

const ProfileForm = () => {
  const { currentUser, userProfile, userEmail } = useAuth();
  const navigate = useNavigate();
  
  // Form state
  const [formData, setFormData] = useState({
    name: userProfile?.name || "",
    role: userProfile?.role || "STUDENT",
    phone: userProfile?.phone || "",
    classId: userProfile?.classId || "",
  });
  const [profilePhoto, setProfilePhoto] = useState(null);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Update form if userProfile changes
  useEffect(() => {
    if (userProfile) {
      setFormData({
        name: userProfile.name || "",
        role: userProfile.role || "STUDENT",
        phone: userProfile.phone || "",
        classId: userProfile.classId || "",
      });
    }
  }, [userProfile]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      if (!currentUser) throw new Error("User not authenticated");

      // Create form data
      const submitData = new FormData();
      submitData.append("name", formData.name);
      submitData.append("email", userEmail);
      submitData.append("role", formData.role);
      submitData.append("phone", formData.phone);
      
      // Only append classId if the role is not 'FACULTY'
      if (formData.role !== "FACULTY" && formData.classId) {
        submitData.append("classId", formData.classId);
      }

      // Only append photo if one was selected
      if (profilePhoto) {
        submitData.append("profilePhoto", profilePhoto);
      }

      const response = await api.post('/complete-profile', submitData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      console.log("Profile completed successfully:", response.data);
      navigate("/");
    } catch (err) {
      console.error("Profile completion error:", err);
      setError(
        err.response?.data?.message || 
        "Failed to complete profile. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!currentUser) {
    return (
      <div className="max-w-md mx-auto mt-10 p-6 bg-red-50 rounded-lg text-center">
        <h2 className="text-red-600 text-lg font-semibold">Authentication Required</h2>
        <p className="text-red-500 mt-2">Please log in to complete your profile.</p>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white shadow-md rounded-md">
      <h2 className="text-2xl font-bold mb-6 text-gray-700 text-center">
        Complete Your Profile
      </h2>
      
      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
          <p className="text-red-600 text-sm">{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Name Input */}
        <div className="space-y-1">
          <label htmlFor="name" className="text-sm font-medium text-gray-700">Full Name</label>
          <input
            id="name"
            name="name"
            type="text"
            placeholder="Enter your full name"
            className="w-full border border-gray-300 rounded-md p-3"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>

        {/* Email Input (Disabled) */}
        <div className="space-y-1">
          <label htmlFor="email" className="text-sm font-medium text-gray-700">Email</label>
          <input
            id="email"
            type="email"
            className="w-full border border-gray-300 rounded-md p-3 bg-gray-50"
            value={userEmail}
            disabled
          />
          <p className="text-xs text-gray-500 mt-1">Email cannot be changed as it's linked to your account</p>
        </div>

        {/* Role Select */}
        <div className="space-y-1">
          <label htmlFor="role" className="text-sm font-medium text-gray-700">Role</label>
          <select
            id="role"
            name="role"
            className="w-full border border-gray-300 rounded-md p-3"
            value={formData.role}
            onChange={handleChange}
          >
            <option value="STUDENT">Student</option>
            <option value="FACULTY">Teacher</option>
            <option value="CR">Class Representative (CR)</option>
            <option value="CA">Class Advisor (CA)</option>
          </select>
        </div>

        {/* Phone Input */}
        <div className="space-y-1">
          <label htmlFor="phone" className="text-sm font-medium text-gray-700">Phone Number</label>
          <input
            id="phone"
            name="phone"
            type="tel"
            placeholder="Enter your phone number"
            className="w-full border border-gray-300 rounded-md p-3"
            value={formData.phone}
            onChange={handleChange}
            required
          />
        </div>

        {/* Class ID Input (Conditional) */}
        {formData.role !== "FACULTY" && (
          <div className="space-y-1">
            <label htmlFor="classId" className="text-sm font-medium text-gray-700">Class ID</label>
            <input
              id="classId"
              name="classId"
              type="text"
              placeholder="Enter your class ID"
              className="w-full border border-gray-300 rounded-md p-3"
              value={formData.classId}
              onChange={handleChange}
              required
            />
          </div>
        )}

        {/* Profile Photo Input */}
        <div className="space-y-1">
          <label htmlFor="profilePhoto" className="text-sm font-medium text-gray-700">Profile Photo</label>
          <input
            id="profilePhoto"
            type="file"
            accept="image/*"
            className="w-full border border-gray-300 rounded-md p-3"
            onChange={(e) => setProfilePhoto(e.target.files[0])}
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isSubmitting}
          className={`w-full py-3 px-4 rounded-md text-white font-medium transition
            ${isSubmitting 
              ? 'bg-blue-400 cursor-not-allowed' 
              : 'bg-blue-600 hover:bg-blue-700'
            }`}
        >
          {isSubmitting ? 'Saving...' : 'Save Profile'}
        </button>
      </form>
    </div>
  );
};

export default ProfileForm;
