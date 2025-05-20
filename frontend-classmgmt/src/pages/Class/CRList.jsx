import React, { useEffect, useState } from 'react';
import axios from 'axios';

const CRList = () => {
  const [crs, setCrs] = useState([]);
  const [error, setError] = useState('');

  const classId = 'cys233';

  useEffect(() => {
    const fetchCRs = async () => {
      try {
        const response = await axios.get(`http://localhost:3001/api/getUsersByType?role=CR&classId=${classId}`);
        console.log(response.data);
        setCrs(response.data);
        setError('');
      } catch (error) {
        if (error.response && error.response.status === 404) {
          setError('CRs not assigned');
        } else {
          setError('Error fetching CRs');
        }
      }
    };

    fetchCRs();
  }, [classId]);

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white shadow-lg rounded-lg">
      <h2 className="text-2xl font-semibold mb-6 text-gray-800">Class Representatives</h2>
      
      {error ? (
        <p className="text-red-500 text-lg">{error}</p>
      ) : (
        <ul className="space-y-4">
          {crs.map((cr) => (
            <li key={cr._id} className="flex items-center justify-between p-4 border rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 ease-in-out">
              <div className="flex flex-col">
                <span className="font-semibold text-gray-800">{cr.name}</span>
                <span className="text-sm text-gray-600">{cr.email}</span>
                <span className="text-sm text-gray-600">{cr.phone}</span>
              </div>
              <button className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors duration-300">
                Contact
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default CRList;
