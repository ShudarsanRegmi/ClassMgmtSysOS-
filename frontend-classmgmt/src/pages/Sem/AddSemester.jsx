import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
// import { api } from '../../api/api';
import api from '../../utils/api';
import { Snackbar, Alert } from '@mui/material';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";

const AddSemester = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState({
    open: false,
    message: '',
    severity: 'success' // 'error', 'warning', 'info', 'success'
  });

  const [formData, setFormData] = useState({
    name: '',
    semcode: 'SEM1',
    year: 1,
    startDate: new Date(),
    endDate: new Date(new Date().setMonth(new Date().getMonth() + 6)),
    classId: ''
  });

  const semesterCodes = ['SEM1', 'SEM2', 'SEM3', 'SEM4', 'SEM5', 'SEM6', 'SEM7', 'SEM8'];
  const years = [1, 2, 3, 4];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleDateChange = (date, field) => {
    setFormData(prev => ({
      ...prev,
      [field]: date
    }));
  };

  const handleCloseNotification = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setNotification({ ...notification, open: false });
  };

  const showNotification = (message, severity) => {
    setNotification({
      open: true,
      message,
      severity
    });
  };

  const validateForm = () => {
    if (!formData.name.match(/^Semester [1-8]$/)) {
      showNotification('Semester name must be in format "Semester X" where X is 1-8', 'error');
      return false;
    }
    if (!formData.classId) {
      showNotification('Class ID is required', 'error');
      return false;
    }
    if (formData.startDate >= formData.endDate) {
      showNotification('End date must be after start date', 'error');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    try {
      const response = await api.post('/sem/create', formData);
      showNotification('Semester created successfully!', 'success');
      // Reset form after successful creation
      setFormData({
        name: '',
        semcode: 'SEM1',
        year: 1,
        startDate: new Date(),
        endDate: new Date(new Date().setMonth(new Date().getMonth() + 6)),
        classId: ''
      });
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Error creating semester';
      const validationErrors = error.response?.data?.errors;
      
      if (validationErrors) {
        Object.values(validationErrors).forEach(error => {
          showNotification(error.message || error, 'error');
        });
      } else {
        showNotification(errorMessage, 'error');
      }
      console.error('Create semester error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto bg-white shadow-lg rounded-lg p-8">
        <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">
          Create New Semester
        </h2>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Semester Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Semester Name
              </label>
              <input
                type="text"
                name="name"
                placeholder="e.g. Semester 1"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>

            {/* Semester Code */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Semester Code
              </label>
              <select
                name="semcode"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={formData.semcode}
                onChange={handleChange}
                required
              >
                {semesterCodes.map(code => (
                  <option key={code} value={code}>{code}</option>
                ))}
              </select>
            </div>

            {/* Academic Year */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Academic Year
              </label>
              <select
                name="year"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={formData.year}
                onChange={handleChange}
                required
              >
                {years.map(year => (
                  <option key={year} value={year}>{year}</option>
                ))}
              </select>
            </div>

            {/* Class ID */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Class ID
              </label>
              <input
                type="text"
                name="classId"
                placeholder="Enter class ID"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={formData.classId}
                onChange={handleChange}
                required
              />
            </div>

            {/* Start Date */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Start Date
              </label>
              <DatePicker
                selected={formData.startDate}
                onChange={(date) => handleDateChange(date, 'startDate')}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                dateFormat="MMMM d, yyyy"
                required
              />
            </div>

            {/* End Date */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                End Date
              </label>
              <DatePicker
                selected={formData.endDate}
                onChange={(date) => handleDateChange(date, 'endDate')}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                dateFormat="MMMM d, yyyy"
                minDate={formData.startDate}
                required
              />
            </div>
          </div>

          <div className="flex justify-end space-x-4 mt-8">
            <button
              type="button"
              onClick={() => navigate('/semesters')}
              className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className={`px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                loading ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              {loading ? 'Creating...' : 'Create Semester'}
            </button>
          </div>
        </form>

        <Snackbar 
          open={notification.open} 
          autoHideDuration={6000} 
          onClose={handleCloseNotification}
          anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        >
          <Alert 
            onClose={handleCloseNotification} 
            severity={notification.severity}
            variant="filled"
            sx={{ width: '100%' }}
          >
            {notification.message}
          </Alert>
        </Snackbar>
      </div>
    </div>
  );
};

export default AddSemester;
