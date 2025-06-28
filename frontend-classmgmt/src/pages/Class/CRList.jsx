import React, { useEffect, useState } from 'react';
import api from '../../utils/api';
import PropTypes from 'prop-types';
import { FaUserCircle, FaEnvelope, FaPhone, FaStar, FaCommentDots } from 'react-icons/fa';

const ProfileImage = ({ cr }) => {
  const [imageError, setImageError] = useState(false);

  return (
    <div className="relative w-20 h-20 rounded-full overflow-hidden border-4 border-blue-500 shadow-md bg-[#1E293B]">
      {!imageError && cr.photoUrl ? (
        <img
          src={cr.photoUrl}
          alt={cr.name}
          className="object-cover w-full h-full"
          onError={() => setImageError(true)}
        />
      ) : (
        <div className="w-full h-full flex items-center justify-center bg-[#334155] text-blue-200">
          <FaUserCircle className="w-10 h-10" />
        </div>
      )}
      <div className="absolute -top-1.5 -right-1.5 bg-yellow-400 p-1 rounded-full shadow-sm">
        <FaStar className="text-white text-xs" />
      </div>
    </div>
  );
};

ProfileImage.propTypes = {
  cr: PropTypes.shape({
    photoUrl: PropTypes.string,
    name: PropTypes.string.isRequired,
  }).isRequired,
};

const CRCard = ({ cr }) => (
  <div className="bg-[#0F172A] text-white rounded-xl shadow-lg p-6 flex flex-col md:flex-row items-center gap-6 border border-[#334155] hover:shadow-xl transition-all duration-300">
    <ProfileImage cr={cr} />

    <div className="flex-grow w-full">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">{cr.name}</h3>
        <span className="text-xs bg-blue-600 px-2 py-0.5 rounded-full">Class Rep</span>
      </div>

      <div className="mt-3 space-y-2 text-sm text-gray-300">
        <div className="flex items-center gap-2">
          <FaEnvelope className="text-blue-400" />
          <span className="truncate">{cr.email}</span>
        </div>
        {cr.phone && (
          <div className="flex items-center gap-2">
            <FaPhone className="text-blue-400" />
            <span>{cr.phone}</span>
          </div>
        )}
      </div>

      <button className="mt-4 w-full bg-blue-700 hover:bg-blue-600 text-white text-sm px-4 py-2 rounded flex items-center justify-center gap-2 transition-all duration-200">
        <FaCommentDots />
        Contact {cr.name.split(' ')[0]}
      </button>
    </div>
  </div>
);

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
        setError('Failed to load class representatives.');
      } finally {
        setLoading(false);
      }
    };

    fetchCRs();
  }, [classId]);

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-white">Class Representatives</h2>
        <p className="text-gray-400 text-sm">Trusted point of contact for all class affairs</p>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-24">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500" />
        </div>
      ) : error ? (
        <div className="bg-yellow-100 border border-yellow-300 text-yellow-800 p-4 rounded-md">
          {error}
        </div>
      ) : crs.length === 0 ? (
        <div className="bg-[#1E293B] text-gray-400 text-center p-6 border border-[#334155] rounded-lg">
          No class representatives found for this class.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {crs.map((cr) => (
            <CRCard key={cr._id} cr={cr} />
          ))}
        </div>
      )}
    </div>
  );
};

CRList.propTypes = {
  classId: PropTypes.string.isRequired,
};

export default CRList;
