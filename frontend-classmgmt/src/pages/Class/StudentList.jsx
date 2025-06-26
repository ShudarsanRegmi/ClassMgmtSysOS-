import React, { useEffect, useState, useRef } from 'react';
import PropTypes from 'prop-types';
import api from '../../utils/api';
import { FaUserCircle, FaEnvelope, FaPhone, FaGraduationCap } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';

const StudentList = ({ classId }) => {
  const [students, setStudents] = useState([]);
  const [error, setError] = useState('');
  const [hoveredStudent, setHoveredStudent] = useState(null);
  const [hoverPos, setHoverPos] = useState({ x: 0, y: 0 });
  const [popupHovered, setPopupHovered] = useState(false);
  const studentPositions = useRef({});

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const res = await api.get(`/class/${classId}/students`);
        const fetchedStudents = res.data.students || [];
        // Generate and store random positions for each student only once
        fetchedStudents.forEach((student) => {
          if (!studentPositions.current[student._id]) {
            studentPositions.current[student._id] = {
              top: `${Math.random() * 85 + 5}%`,
              left: `${Math.random() * 85 + 5}%`,
            };
          }
        });
        setStudents(fetchedStudents);
      } catch (err) {
        console.error(err);
        setError('Failed to fetch students');
      }
    };
    if (classId) fetchStudents();
  }, [classId]);

  const floatStyles = {
    animation: 'float 60s ease-in-out infinite alternate',
  };

  return (
    <div
      className="relative w-full h-[90vh] overflow-hidden rounded-lg border border-gray-700 shadow-inner"
      style={{
        backgroundImage: `url('https://images.unsplash.com/photo-1604079628046-943e02b67b07?auto=format&fit=crop&q=80')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      {/* Starry background overlay */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <svg width="100%" height="100%" className="w-full h-full" style={{ position: 'absolute', top: 0, left: 0 }}>
          {Array.from({ length: 120 }).map((_, i) => (
            <circle
              key={i}
              cx={Math.random() * 100 + '%'}
              cy={Math.random() * 100 + '%'}
              r={Math.random() * 1.2 + 0.3}
              fill="#fff"
              opacity={Math.random() * 0.7 + 0.2}
            />
          ))}
        </svg>
      </div>

      {/* Floating animation */}
      <style>{`
        @keyframes float {
          0%   { transform: translateY(0px) translateX(0px); }
          25%  { transform: translateY(-10px) translateX(10px); }
          50%  { transform: translateY(-20px) translateX(20px); }
          75%  { transform: translateY(-10px) translateX(10px); }
          100% { transform: translateY(0px) translateX(0px); }
        }
      `}</style>

      {error && <div className="text-red-500 text-center p-4">{error}</div>}

      {/* Student stars */}
      {students.map((student) => {
        const position = studentPositions.current[student._id] || { top: '50%', left: '50%' };
        const isActive = hoveredStudent && hoveredStudent._id === student._id;
        return (
          <div
            key={student._id}
            className="absolute transition-transform duration-500 z-10"
            style={{ ...position, ...floatStyles }}
            onMouseEnter={(e) => {
              const rect = e.currentTarget.getBoundingClientRect();
              setHoveredStudent(student);
              setHoverPos({ x: rect.left + rect.width / 2, y: rect.top });
            }}
            onMouseLeave={() => {
              // Only hide if not hovering popup
              setTimeout(() => {
                if (!popupHovered) setHoveredStudent(null);
              }, 50);
            }}
          >
            <motion.div
              className="w-12 h-12 rounded-full border-2 border-white shadow-md overflow-hidden bg-gray-200 cursor-pointer"
              whileHover={{ scale: 1.3 }}
              transition={{ type: 'spring', stiffness: 200 }}
            >
              {student.profile?.photoUrl?.url ? (
                <img
                  src={student.profile.photoUrl.url}
                  alt={student.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <FaUserCircle className="text-gray-400 text-xl" />
                </div>
              )}
            </motion.div>
          </div>
        );
      })}

      {/* Hover Popup */}
      <AnimatePresence>
        {hoveredStudent && (
          <motion.div
            key={hoveredStudent._id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.3 }}
            className="fixed z-50 bg-white text-gray-800 rounded-xl shadow-2xl p-4 w-72 pointer-events-auto flex flex-col items-center"
            style={{
              top: `${hoverPos.y + 40}px`,
              left: `${hoverPos.x}px`,
              transform: 'translateX(-50%)',
            }}
            onMouseEnter={() => setPopupHovered(true)}
            onMouseLeave={() => {
              setPopupHovered(false);
              setTimeout(() => {
                setHoveredStudent(null);
              }, 50);
            }}
          >
            {hoveredStudent.profile?.photoUrl?.url ? (
              <img
                src={hoveredStudent.profile.photoUrl.url}
                alt={hoveredStudent.name}
                className="w-20 h-20 rounded-full object-cover border-2 border-blue-400 mb-2 shadow"
              />
            ) : (
              <div className="w-20 h-20 rounded-full bg-gray-200 flex items-center justify-center mb-2">
                <FaUserCircle className="text-4xl text-gray-400" />
              </div>
            )}
            <h3 className="font-bold text-lg mb-1">{hoveredStudent.name}</h3>
            <div className="text-sm mt-1 space-y-1 w-full">
              <div className="flex items-center gap-2 text-gray-600">
                <FaEnvelope className="w-4 h-4" />
                <span className="truncate">{hoveredStudent.email}</span>
              </div>
              {hoveredStudent.phone && (
                <div className="flex items-center gap-2 text-gray-600">
                  <FaPhone className="w-4 h-4" />
                  <span>{hoveredStudent.phone}</span>
                </div>
              )}
              <div className="flex items-center gap-2 text-gray-600">
                <FaGraduationCap className="w-4 h-4" />
                <span>Roll: {hoveredStudent.rollNumber || 'N/A'}</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

StudentList.propTypes = {
  classId: PropTypes.string.isRequired,
};

export default StudentList;
