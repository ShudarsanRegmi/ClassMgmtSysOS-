import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { auth } from '../firebase'; // make sure this points to your firebase config
import { getIdToken } from 'firebase/auth';

const Profile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const currentUser = auth.currentUser;
        if (!currentUser) {
          console.warn("No user is logged in.");
          return;
        }

        //  Get Firebase ID token
        const token = await getIdToken(currentUser);

        const res = await axios.get('http://localhost:3001/api/profile', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        console.log(res);

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
    <div className="max-w-md mx-auto mt-10 p-6 bg-white shadow-lg rounded-2xl border border-gray-200">
      <div className="flex items-center gap-4">
        <img
          src={user.profilePhoto || '/default-profile.png'}
          alt="Profile"
          className="w-20 h-20 rounded-full border border-gray-300 object-cover"
        />
        <div>
          <h2 className="text-xl font-semibold text-gray-800">{user.name}</h2>
          <p className="text-sm text-gray-500">{user.role.toUpperCase()}</p>
        </div>
      </div>

      <div className="mt-6 space-y-2">
        <div className="text-sm">
          <span className="font-medium text-gray-700">Email:</span>{' '}
          <span className="text-gray-600">{user.email || 'Not provided'}</span>
        </div>
        <div className="text-sm">
          <span className="font-medium text-gray-700">Phone:</span>{' '}
          <span className="text-gray-600">{user.phone || 'Not provided'}</span>
        </div>
        <div className="text-sm">
          <span className="font-medium text-gray-700">Class ID:</span>{' '}
          <span className="text-gray-600">{user.classId || 'N/A'}</span>
        </div>
      </div>
    </div>
  );
};

export default Profile;
