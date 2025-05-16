import React, { useState } from 'react';
import axios from 'axios';

const AddClass = () => {
  const [formData, setFormData] = useState({
    name: '',
    classId: '',
    year: '',
    department: '',
    section: '',
  });

  const [photo, setPhoto] = useState(null);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const handlePhotoChange = (e) => {
    setPhoto(e.target.files[0]);
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = new FormData();
      Object.entries(formData).forEach(([key, value]) => data.append(key, value));
      if (photo) data.append('photo', photo);

      const response = await axios.post('http://localhost:3001/api/class/create', data, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      alert('Class created successfully!');
      setFormData({ name: '', classId: '', year: '', department: '', section: '' });
      setPhoto(null);
      setError('');
    } catch (error) {
      console.error('Error creating class:', error);
      setError('Failed to create class. Please try again.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto p-4 bg-white shadow-md rounded">
      <h2 className="text-2xl font-bold mb-4">Add New Class</h2>
      {error && <p className="text-red-500 mb-4">{error}</p>}

      {['name', 'classId', 'year', 'department', 'section'].map((field) => (
        <input
          key={field}
          type={field === 'year' ? 'number' : 'text'}
          name={field}
          placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
          value={formData[field]}
          onChange={handleChange}
          className="w-full mb-2 p-2 border border-gray-300 rounded"
          required
        />
      ))}

      <input
        type="file"
        name="photo"
        accept="image/*"
        onChange={handlePhotoChange}
        className="w-full mb-4"
      />

      <button
        type="submit"
        className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
      >
        Create Class
      </button>
    </form>
  );
};

export default AddClass;
