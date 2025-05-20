import React, { useEffect, useState } from 'react';
import axios from 'axios';
import StudentList from './StudentList';
import CRList from './CRList';

const ClassHomepage = () => {

  let classId = 'cys244';
  const [photoUrl, setPhotoUrl] = useState('');

  useEffect(() => {
    const fetchClassDetails = async () => {
      try {
        const response = await axios.get(`http://localhost:3001/api/class/${classId}/details`);
        setPhotoUrl(response.data.photoUrl);
        console.log("photourl: ", response.data.photoUrl);
        console.log(response.data)
      } catch (error) {
        console.error('Error fetching class details:', error);
      }
    };

    fetchClassDetails();
  }, [classId]);

  return (
    <div className="p-4">
      {photoUrl && (
        <img src={photoUrl} alt="Class Cover" className="w-full h-64 object-cover mb-4" />
      )}
      <StudentList classId={classId} />
      <CRList classId={classId} />
      <footer className="mt-8 text-center text-gray-500">
        &copy; {new Date().getFullYear()} Class Management System
      </footer>
    </div>
  );
};

export default ClassHomepage;
