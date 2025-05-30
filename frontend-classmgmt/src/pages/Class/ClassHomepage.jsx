import React, { useEffect, useState } from 'react';
import api from '../../utils/api';
import StudentList from './StudentList';
import CRList from './CRList';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const ClassHomepage = () => {
  const { classId } = useAuth();
  const navigate = useNavigate();
  const [photoUrl, setPhotoUrl] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (!classId) {
      setError('No class ID found. Please complete your profile first.');
      return;
    }

    const fetchClassDetails = async () => {
      try {
        const response = await api.get(`/class/${classId}/details`);
        setPhotoUrl(response.data.photoUrl);
        setError('');
      } catch (error) {
        console.error('Error fetching class details:', error);
        setError('Failed to load class details. Please try again later.');
      }
    };

    fetchClassDetails();
  }, [classId]);

  if (!classId) {
    return (
      <div className="p-4 text-center">
        <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded relative" role="alert">
          <p className="font-bold">No Class Found</p>
          <p className="text-sm">Please complete your profile with a valid class ID first.</p>
          <button
            onClick={() => navigate('/profile-form')}
            className="mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            Go to Profile Form
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4">
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
          <p>{error}</p>
        </div>
      )}
      {photoUrl && (
        <img src={photoUrl} alt="Class Cover" className="w-full h-64 object-cover mb-4" />
      )}
      <CRList classId={classId} />
      <StudentList classId={classId} />
      <footer className="mt-8 text-center text-gray-500">
        &copy; {new Date().getFullYear()} Class Management System
      </footer>
    </div>
  );
};

export default ClassHomepage;
