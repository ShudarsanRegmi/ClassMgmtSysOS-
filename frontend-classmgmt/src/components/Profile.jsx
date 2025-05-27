import React from 'react';
import { FaUserCircle, FaEnvelope, FaPhone, FaIdCard } from 'react-icons/fa';
import { MdClass } from 'react-icons/md';
import { useAuth } from '../context/AuthContext';

const ProfileField = ({ icon: Icon, label, value }) => (
  <div className="flex items-center space-x-3 text-sm text-gray-700">
    <Icon className="text-indigo-500 w-5 h-5" />
    <span className="font-medium">{label}:</span>
    <span className="text-gray-600">{value || 'Not provided'}</span>
  </div>
);

const Profile = () => {
  const { userProfile: user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[200px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="p-6 text-center bg-red-50 rounded-lg">
        <h2 className="text-red-500 text-lg font-semibold">Profile Not Found</h2>
        <p className="text-red-400 mt-2">Please complete your profile setup.</p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto mt-10">
      {/* Profile Card */}
      <div className="bg-white shadow-xl rounded-2xl border border-gray-200 overflow-hidden">
        {/* Header/Banner Section */}
        <div className="bg-gradient-to-r from-indigo-500 to-purple-600 px-6 py-4">
          <div className="flex items-center gap-6">
            {/* Profile Photo */}
            <div className="relative">
              {user.photoUrl ? (
                <img
                  src={user.photoUrl}
                  alt={user.name}
                  className="w-24 h-24 rounded-full border-4 border-white object-cover"
                />
              ) : (
                <div className="w-24 h-24 rounded-full border-4 border-white bg-gray-100 flex items-center justify-center">
                  <FaUserCircle className="w-16 h-16 text-gray-400" />
                </div>
              )}
            </div>
            {/* Basic Info */}
            <div className="text-white">
              <h1 className="text-2xl font-bold">{user.name}</h1>
              <p className="text-indigo-100 mt-1">
                <span className="inline-block px-3 py-1 bg-white/20 rounded-full text-sm">
                  {user.role?.toUpperCase()}
                </span>
              </p>
            </div>
          </div>
        </div>

        {/* Details Section */}
        <div className="p-6 space-y-4">
          <ProfileField 
            icon={FaEnvelope} 
            label="Email" 
            value={user.email} 
          />
          <ProfileField 
            icon={FaPhone} 
            label="Phone" 
            value={user.phone} 
          />
          <ProfileField 
            icon={MdClass} 
            label="Class ID" 
            value={user.classId} 
          />
          <ProfileField 
            icon={FaIdCard} 
            label="User ID" 
            value={user.uid} 
          />
        </div>

        {/* Additional Info Section */}
        {user.courses && user.courses.length > 0 && (
          <div className="border-t border-gray-100 p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-3">Enrolled Courses</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {user.courses.map((course, index) => (
                <div 
                  key={course._id || index}
                  className="p-3 bg-gray-50 rounded-lg text-sm text-gray-600"
                >
                  {course.name || course}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
