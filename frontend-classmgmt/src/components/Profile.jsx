import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { auth } from '../firebase';
import { getIdToken } from 'firebase/auth';
import { FaUserCircle } from 'react-icons/fa';

const Profile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const currentUser = auth.currentUser;
        if (!currentUser) return;

        const token = await getIdToken(currentUser);
        const res = await axios.get('http://localhost:3001/api/profile', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setUser(res.data.user);
      } catch (err) {
        console.error('Error fetching profile:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  if (loading) return <div className="p-4 text-center text-gray-600">Loading...</div>;
  if (!user) return <div className="p-4 text-center text-red-500">User not found</div>;

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white shadow-xl rounded-2xl border border-gray-200">
      <div className="flex items-center gap-4">
        {user.photoUrl ? (
          <img
            src={user.photoUrl}
            alt="Profile"
            className="w-20 h-20 rounded-full object-cover border border-gray-300"
          />
        ) : (
          <FaUserCircle className="w-20 h-20 text-gray-400" />
        )}
        <div>
          <h2 className="text-2xl font-semibold text-gray-800">{user.name}</h2>
          <p className="text-sm text-indigo-600 uppercase">{user.role}</p>
        </div>
      </div>

      <div className="mt-6 space-y-3 text-sm text-gray-700">
        <div>
          <span className="font-medium">Email:</span> {user.email || 'Not provided'}
        </div>
        <div>
          <span className="font-medium">Phone:</span> {user.phone || 'Not provided'}
        </div>
        <div>
          <span className="font-medium">ClassId:</span> {user.classId || 'N/A'}
        </div>
      </div>
    </div>
  );
};

export default Profile;

