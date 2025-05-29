import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import {useAuth} from '../../context/AuthContext'

import api from '../../utils/api';
import { toast } from 'react-hot-toast';

const AddClass = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    classId: '',
    batchId: '',
    year: 1,
    department: '',
    section: '',
  });

  const [photo, setPhoto] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);

  const years = [1, 2, 3, 4];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'year' ? parseInt(value) :
              ['classId', 'department', 'section'].includes(name) ? value.toUpperCase() :
              value.trim()
    }));
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPhoto(file);
      const previewUrl = URL.createObjectURL(file);
      setPhotoPreview(previewUrl);
    }
  };

  const validateForm = () => {
    if (!formData.name.trim()) {
      toast.error('Class name is required');
      return false;
    }
    if (!formData.classId.trim()) {
      toast.error('Class ID is required');
      return false;
    }
    if (!formData.batchId.trim()) {
      toast.error('Batch ID is required');
      return false;
    }
    if (!formData.department.trim()) {
      toast.error('Department is required');
      return false;
    }
    if (!formData.section.trim()) {
      toast.error('Section is required');
      return false;
    }
    if (formData.year < 1 || formData.year > 4) {
      toast.error('Year must be between 1 and 4');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    try {
      // Create the request data object first to verify all fields
      const requestData = {
        name: formData.name.trim(),
        classId: formData.classId.trim().toUpperCase(),
        batchId: formData.batchId.trim(),  // Explicitly include batchId
        year: formData.year,
        department: formData.department.trim().toUpperCase(),
        section: formData.section.trim().toUpperCase()
      };

      // Create FormData from the verified data
      const data = new FormData();
      Object.entries(requestData).forEach(([key, value]) => {
        data.append(key, value);
      });
      
      if (photo) {
        data.append('photo', photo);
      }

      // Log the data being sent (for debugging)
      console.log('Sending data:', Object.fromEntries(data.entries()));

      const response = await api.post('/class/create', data, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      toast.success('Class created successfully!');
      navigate('/classes');
    } catch (error) {
      console.error('Error creating class:', error);
      toast.error(error.response?.data?.message || 'Failed to create class');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white shadow-lg rounded-lg p-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">
            Create New Class
          </h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Class Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Class Name*
                </label>
                <input
                  type="text"
                  name="name"
                  placeholder="e.g. Computer Science Year 1"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>

              {/* Class ID */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Class ID* (automatically uppercase)
                </label>
                <input
                  type="text"
                  name="classId"
                  placeholder="e.g. CS101"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent uppercase"
                  value={formData.classId}
                  onChange={handleChange}
                  required
                />
              </div>

              {/* Batch ID - New Field */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Batch ID*
                </label>
                <input
                  type="text"
                  name="batchId"
                  placeholder="e.g. 2023"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={formData.batchId}
                  onChange={handleChange}
                  required
                />
              </div>

              {/* Year */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Year*
                </label>
                <select
                  name="year"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={formData.year}
                  onChange={handleChange}
                  required
                >
                  {years.map(year => (
                    <option key={year} value={year}>Year {year}</option>
                  ))}
                </select>
              </div>

              {/* Department */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Department* (automatically uppercase)
                </label>
                <input
                  type="text"
                  name="department"
                  placeholder="e.g. Computer Science"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent uppercase"
                  value={formData.department}
                  onChange={handleChange}
                  required
                />
              </div>

              {/* Section */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Section* (automatically uppercase)
                </label>
                <input
                  type="text"
                  name="section"
                  placeholder="e.g. A"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent uppercase"
                  value={formData.section}
                  onChange={handleChange}
                  required
                />
              </div>

              {/* Photo Upload */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Class Photo (optional)
                </label>
                <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                  <div className="space-y-1 text-center">
                    {photoPreview ? (
                      <div className="mb-4">
                        <img
                          src={photoPreview}
                          alt="Preview"
                          className="mx-auto h-32 w-auto rounded-lg"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            setPhoto(null);
                            setPhotoPreview(null);
                          }}
                          className="mt-2 text-sm text-red-600 hover:text-red-800"
                        >
                          Remove photo
                        </button>
                      </div>
                    ) : (
                      <>
                        <svg
                          className="mx-auto h-12 w-12 text-gray-400"
                          stroke="currentColor"
                          fill="none"
                          viewBox="0 0 48 48"
                        >
                          <path
                            d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                            strokeWidth={2}
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                        <div className="flex text-sm text-gray-600">
                          <label className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500">
                            <span>Upload a photo</span>
                            <input
                              type="file"
                              name="photo"
                              accept="image/*"
                              onChange={handlePhotoChange}
                              className="sr-only"
                            />
                          </label>
                          <p className="pl-1">or drag and drop</p>
                        </div>
                        <p className="text-xs text-gray-500">
                          PNG, JPG, GIF up to 10MB
                        </p>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-4 mt-8">
              <button
                type="button"
                onClick={() => navigate('/classes')}
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
                {loading ? 'Creating...' : 'Create Class'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddClass;
