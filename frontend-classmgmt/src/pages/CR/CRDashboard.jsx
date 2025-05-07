import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { getAuth } from 'firebase/auth';
import AssetCard from './compos/AssetCard';

const CRDashboard = () => {
  const [assets, setAssets] = useState([]);
  const [semesters, setSemesters] = useState([]);
  const [selectedSemester, setSelectedSemester] = useState('');
  const [assetUrl, setAssetUrl] = useState('');

  useEffect(() => {
    fetchAssets();
    fetchSemesters();
  }, []);

  const fetchAssets = async () => {
    try {
      const token = await getAuth().currentUser.getIdToken();
      const res = await axios.get('http://localhost:3001/api/cr/semester-assets', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setAssets(res.data);
    } catch (error) {
      console.error('Error fetching assets:', error);
    }
  };

  const fetchSemesters = async () => {
    try {
      const token = await getAuth().currentUser.getIdToken();
      const res = await axios.get('http://localhost:3001/api/semesters', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setSemesters(res.data);
    } catch (error) {
      console.error('Error fetching semesters:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedSemester || !assetUrl) return;

    try {
      const token = await getAuth().currentUser.getIdToken();
      await axios.post(
        'http://localhost:3001/api/cr/semester-assets',
        {
          semesterId: selectedSemester,
          assetUrl,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setAssetUrl('');
      setSelectedSemester('');
      fetchAssets();
    } catch (error) {
      console.error('Failed to upload asset:', error);
    }
  };

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-12">
      <h1 className="text-3xl font-bold text-center">📚 CR Dashboard</h1>

      {/* Upload Form */}
      <div className="bg-white p-6 rounded-md shadow-md border border-gray-200">
        <h2 className="text-2xl font-semibold mb-4">Upload Semester Asset</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block font-medium">Select Semester</label>
            <select
              value={selectedSemester}
              onChange={(e) => setSelectedSemester(e.target.value)}
              className="w-full border border-gray-300 rounded-md px-4 py-2"
              required
            >
              <option value="">-- Choose Semester --</option>
              {semesters.map((sem) => (
                <option key={sem._id} value={sem._id}>
                  {sem.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block font-medium">Asset URL (Image Link)</label>
            <input
              type="url"
              value={assetUrl}
              onChange={(e) => setAssetUrl(e.target.value)}
              className="w-full border border-gray-300 rounded-md px-4 py-2"
              placeholder="https://..."
              required
            />
          </div>
          <button
            type="submit"
            className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition"
          >
            Upload / Update
          </button>
        </form>
      </div>

      {/* Assets Display */}
      <div>
        <h2 className="text-2xl font-semibold mb-4">Uploaded Assets</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {assets.map((asset) => (
            <AssetCard key={asset._id} asset={asset} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default CRDashboard;
