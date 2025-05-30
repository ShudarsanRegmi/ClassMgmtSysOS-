import React, { useEffect, useState } from 'react';
import api from '../../utils/api';
import PropTypes from 'prop-types';
import { FaUserCircle, FaEnvelope, FaPhone, FaStar, FaComments } from 'react-icons/fa';

const ProfileImage = ({ cr }) => {
  const [imageError, setImageError] = useState(false);

  if (!cr.photoUrl || imageError) {
    return (
      <div className="w-16 h-16 rounded-full bg-blue-50 flex items-center justify-center">
        <FaUserCircle className="h-8 w-8 text-blue-300" />
      </div>
    );
  }

  return (
    <img
      src={cr.photoUrl}
      alt={cr.name}
      className="w-16 h-16 rounded-full object-cover border-2 border-blue-100"
      onError={() => setImageError(true)}
    />
  );
};

ProfileImage.propTypes = {
  cr: PropTypes.shape({
    photoUrl: PropTypes.string,
    name: PropTypes.string.isRequired,
  }).isRequired,
};

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
        const response = await api.get(`/getUsersByType?role=CR&classId=${classId}`);
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
      <div className="max-w-3xl mx-auto p-4">
        <div className="flex justify-center items-center h-32">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        </div>
      </div>
    );
  }

  const renderCRCard = (cr) => (
    <div key={cr._id} className="bg-gradient-to-br from-blue-50 to-white rounded-lg shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden">
      <div className="p-4">
        <div className="flex items-start space-x-4">
          <div className="flex-shrink-0">
            <div className="relative">
              <ProfileImage cr={cr} />
              <div className="absolute -top-1 -right-1">
                <div className="bg-yellow-400 rounded-full p-1" title="Class Representative">
                  <FaStar className="h-3 w-3 text-white" />
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex-grow">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-800">{cr.name}</h3>
              <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full font-medium">CR</span>
            </div>
            
            <div className="mt-2 space-y-1.5">
              <div className="flex items-center text-sm text-gray-600">
                <FaEnvelope className="h-3.5 w-3.5 mr-2 text-gray-400" />
                <span className="truncate">{cr.email}</span>
              </div>
              {cr.phone && (
                <div className="flex items-center text-sm text-gray-600">
                  <FaPhone className="h-3.5 w-3.5 mr-2 text-gray-400" />
                  <span>{cr.phone}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      
      <div className="border-t border-blue-50 bg-gradient-to-r from-blue-50 to-transparent">
        <button className="w-full py-2 px-4 text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center justify-center transition-colors duration-200">
          <FaComments className="h-4 w-4 mr-2" />
          Contact CR
        </button>
      </div>
    </div>
  );

  return (
    <div className="max-w-3xl mx-auto p-4 bg-white rounded-xl shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-semibold text-gray-800">Class Representatives</h2>
          <p className="text-sm text-gray-500 mt-1">Your point of contact for class-related matters</p>
        </div>
        <div className="flex items-center text-sm text-gray-500">
          <FaStar className="h-4 w-4 mr-1.5 text-yellow-400" />
          Total CRs: {crs.length}
        </div>
      </div>
      
      {error ? (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <p className="text-sm text-yellow-700">{error}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {crs.map(renderCRCard)}
        </div>
      )}
    </div>
  );
};

CRList.propTypes = {
  classId: PropTypes.string.isRequired
};

export default CRList;
