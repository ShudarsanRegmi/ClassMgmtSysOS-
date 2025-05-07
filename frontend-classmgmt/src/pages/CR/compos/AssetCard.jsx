import React from 'react';

const AssetCard = ({ asset }) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-4 border border-gray-200 hover:shadow-xl transition">
      <h2 className="text-xl font-semibold mb-2">{asset.semester.name}</h2>
      <img src={asset.assetUrl} alt="Asset" className="w-full h-48 object-contain rounded-md mb-2" />
      <p className="text-sm text-gray-500">Last updated: {new Date(asset.lastUpdated).toLocaleString()}</p>
    </div>
  );
};

export default AssetCard;
