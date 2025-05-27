import React, { useEffect, useState } from 'react';
import axios from 'axios';
import PropTypes from 'prop-types';

const CRList = ({ classId }) => {
  const [crs, setCrs] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchCRs = async () => {
      if (!classId) return;

      try {
        setLoading(true);
        setError('');
        const response = await axios.get(`http://localhost:3001/api/getUsersByType?role=CR&classId=${classId}`);
        setCrs(response.data);
      } catch (error) {
        console.error('Error fetching CRs:', error);
        if (error.response?.status === 404) {
          setError('No CRs assigned to this class');
        } else {
          setError('Failed to load class representatives');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchCRs();
  }, [classId]);

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto p-6 bg-white shadow-lg rounded-lg">
        <h2 className="text-2xl font-semibold mb-6 text-gray-800">Class Representatives</h2>
        <div className="flex justify-center items-center h-32">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white shadow-lg rounded-lg">
      <h2 className="text-2xl font-semibold mb-6 text-gray-800">Class Representatives</h2>
      
      {error ? (
        <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded relative">
          <p className="text-lg">{error}</p>
        </div>
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

CRList.propTypes = {
  classId: PropTypes.string.isRequired
};

export default CRList;
