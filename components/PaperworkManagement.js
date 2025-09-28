'use client';

import { useState } from 'react';

export default function PaperworkManagement() {
  const [bolData, setBolData] = useState({
    bolType: 'gs1',
    carrierFullName: '',
    vendorName: '',
    vendorNumber: '',
    bolNumber: '',
    shipTo: '',
    billTo: '',
    description: '',
    nmfcClass: '',
    totalCartons: '',
    totalPallets: '',
    totalWeight: '',
    tmsShipmentId: '',
    sealNumber: '',
    pos: [{ poNumber: '', cartonsPerPO: '' }],
  });

  const [errors, setErrors] = useState({});

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (name.startsWith('pos.')) {
      const [posIndex, field] = name.split('.');
      const index = parseInt(posIndex.split('[')[1].split(']')[0]);
      setBolData((prev) => ({
        ...prev,
        pos: prev.pos.map((po, i) =>
          i === index ? { ...po, [field]: value } : po
        ),
      }));
    } else {
      setBolData((prev) => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value,
      }));
    }

    // Clear errors when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const addPO = () => {
    setBolData((prev) => ({
      ...prev,
      pos: [...prev.pos, { poNumber: '', cartonsPerPO: '' }],
    }));
  };

  const removePO = (index) => {
    setBolData((prev) => ({
      ...prev,
      pos: prev.pos.filter((_, i) => i !== index),
    }));
  };

  const calculateCompleteness = () => {
    const requiredFields = [
      'carrierFullName',
      'vendorName',
      'vendorNumber',
      'bolNumber',
      'shipTo',
      'billTo',
      'description',
      'nmfcClass',
      'totalCartons',
      'totalPallets',
      'totalWeight',
      'tmsShipmentId',
      'sealNumber',
    ];

    const completedFields = requiredFields.filter((field) => {
      if (field === 'pos') {
        return bolData.pos.every((po) => po.poNumber && po.cartonsPerPO);
      }
      return bolData[field] && bolData[field].toString().trim() !== '';
    });

    const posCompleted = bolData.pos.every(
      (po) => po.poNumber && po.cartonsPerPO
    );
    const totalCompleted = completedFields.length + (posCompleted ? 1 : 0);
    const totalRequired = requiredFields.length + 1; // +1 for pos array

    return Math.round((totalCompleted / totalRequired) * 100);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = {};

    // Validate required fields
    const requiredFields = [
      'carrierFullName',
      'vendorName',
      'vendorNumber',
      'bolNumber',
      'shipTo',
      'billTo',
      'description',
      'nmfcClass',
      'totalCartons',
      'totalPallets',
      'totalWeight',
      'tmsShipmentId',
      'sealNumber',
    ];

    requiredFields.forEach((field) => {
      if (!bolData[field] || bolData[field].toString().trim() === '') {
        newErrors[field] =
          `${field.replace(/([A-Z])/g, ' $1').toLowerCase()} is required`;
      }
    });

    // Validate POs
    bolData.pos.forEach((po, index) => {
      if (!po.poNumber || !po.cartonsPerPO) {
        newErrors[`pos_${index}`] = 'PO number and cartons per PO are required';
      }
    });

    // Validate TMS ID format
    if (bolData.tmsShipmentId && !bolData.tmsShipmentId.startsWith('CS')) {
      newErrors.tmsShipmentId = 'TMS Shipment ID must start with "CS"';
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      console.log('BOL Data:', bolData);
      alert('BOL form submitted successfully!');
    }
  };

  const completeness = calculateCompleteness();

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="bg-white shadow-lg rounded-lg p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Paperwork Management
          </h1>
          <p className="text-gray-700">
            Complete BOL first-page requirements and TMS placement
          </p>
        </div>

        {/* Completeness Meter */}
        <div className="mb-6 p-4 bg-blue-50 rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-lg font-medium text-blue-900">
              BOL Completeness
            </h3>
            <span className="text-2xl font-bold text-blue-600">
              {completeness}%
            </span>
          </div>
          <div className="w-full bg-blue-200 rounded-full h-3">
            <div
              className="bg-blue-600 h-3 rounded-full transition-all duration-300"
              style={{ width: `${completeness}%` }}
            ></div>
          </div>
          <p className="text-sm text-blue-700 mt-2">
            {completeness === 100
              ? 'All required fields completed!'
              : `${100 - completeness} fields remaining`}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* BOL Type Selection */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="text-lg font-medium text-gray-900 mb-3">BOL Type</h3>
            <div className="flex space-x-4">
              <label className="flex items-center">
                <input
                  type="radio"
                  name="bolType"
                  value="gs1"
                  checked={bolData.bolType === 'gs1'}
                  onChange={handleInputChange}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                />
                <span className="ml-2 text-sm text-gray-700">GS1 BOL</span>
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="bolType"
                  value="non-gs1"
                  checked={bolData.bolType === 'non-gs1'}
                  onChange={handleInputChange}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                />
                <span className="ml-2 text-sm text-gray-700">Non-GS1 BOL</span>
              </label>
            </div>
            <p className="text-xs text-gray-600 mt-2">
              TMS Shipment ID placement depends on BOL type
            </p>
          </div>

          {/* Required BOL Fields */}
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Required BOL Fields
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label
                  htmlFor="carrierFullName"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Carrier Full Name *
                </label>
                <input
                  type="text"
                  id="carrierFullName"
                  name="carrierFullName"
                  value={bolData.carrierFullName}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 ${
                    errors.carrierFullName
                      ? 'border-red-500'
                      : 'border-gray-300'
                  }`}
                  placeholder="Enter carrier full name"
                />
                {errors.carrierFullName && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.carrierFullName}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="vendorName"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Vendor Name *
                </label>
                <input
                  type="text"
                  id="vendorName"
                  name="vendorName"
                  value={bolData.vendorName}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 ${
                    errors.vendorName ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Enter vendor name"
                />
                {errors.vendorName && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.vendorName}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="vendorNumber"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Vendor Number *
                </label>
                <input
                  type="text"
                  id="vendorNumber"
                  name="vendorNumber"
                  value={bolData.vendorNumber}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 ${
                    errors.vendorNumber ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Enter vendor number"
                />
                {errors.vendorNumber && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.vendorNumber}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="bolNumber"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  BOL Number *
                </label>
                <input
                  type="text"
                  id="bolNumber"
                  name="bolNumber"
                  value={bolData.bolNumber}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 ${
                    errors.bolNumber ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Enter BOL number"
                />
                {errors.bolNumber && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.bolNumber}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="shipTo"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Ship-To Address *
                </label>
                <textarea
                  id="shipTo"
                  name="shipTo"
                  value={bolData.shipTo}
                  onChange={handleInputChange}
                  rows={3}
                  className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 ${
                    errors.shipTo ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Enter ship-to address"
                />
                {errors.shipTo && (
                  <p className="mt-1 text-sm text-red-600">{errors.shipTo}</p>
                )}
              </div>

              <div>
                <label
                  htmlFor="billTo"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Bill-To Address (3rd Party) *
                </label>
                <textarea
                  id="billTo"
                  name="billTo"
                  value={bolData.billTo}
                  onChange={handleInputChange}
                  rows={3}
                  className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 ${
                    errors.billTo ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Enter bill-to address"
                />
                {errors.billTo && (
                  <p className="mt-1 text-sm text-red-600">{errors.billTo}</p>
                )}
              </div>
            </div>

            {/* POs Section */}
            <div className="mt-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900">
                  Purchase Orders
                </h3>
                <button
                  type="button"
                  onClick={addPO}
                  className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                >
                  Add PO
                </button>
              </div>

              <div className="space-y-4">
                {bolData.pos.map((po, index) => (
                  <div
                    key={index}
                    className="flex items-center space-x-4 p-4 border rounded-lg"
                  >
                    <div className="flex-1">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        PO Number
                      </label>
                      <input
                        type="text"
                        name={`pos.${index}.poNumber`}
                        value={po.poNumber}
                        onChange={handleInputChange}
                        className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 ${
                          errors[`pos_${index}`]
                            ? 'border-red-500'
                            : 'border-gray-300'
                        }`}
                        placeholder="Enter PO number"
                      />
                    </div>
                    <div className="flex-1">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Cartons per PO
                      </label>
                      <input
                        type="number"
                        name={`pos.${index}.cartonsPerPO`}
                        value={po.cartonsPerPO}
                        onChange={handleInputChange}
                        className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 ${
                          errors[`pos_${index}`]
                            ? 'border-red-500'
                            : 'border-gray-300'
                        }`}
                        placeholder="Enter carton count"
                      />
                    </div>
                    {bolData.pos.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removePO(index)}
                        className="px-3 py-2 text-sm bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
                      >
                        Remove
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Totals Section */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
              <div>
                <label
                  htmlFor="totalCartons"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Total Cartons *
                </label>
                <input
                  type="number"
                  id="totalCartons"
                  name="totalCartons"
                  value={bolData.totalCartons}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 ${
                    errors.totalCartons ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Enter total cartons"
                />
                {errors.totalCartons && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.totalCartons}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="totalPallets"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Total Pallets *
                </label>
                <input
                  type="number"
                  id="totalPallets"
                  name="totalPallets"
                  value={bolData.totalPallets}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 ${
                    errors.totalPallets ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Enter total pallets"
                />
                {errors.totalPallets && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.totalPallets}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="totalWeight"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Total Weight (lbs) *
                </label>
                <input
                  type="number"
                  id="totalWeight"
                  name="totalWeight"
                  value={bolData.totalWeight}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 ${
                    errors.totalWeight ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Enter total weight"
                />
                {errors.totalWeight && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.totalWeight}
                  </p>
                )}
              </div>
            </div>

            {/* Additional Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
              <div>
                <label
                  htmlFor="description"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Description *
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={bolData.description}
                  onChange={handleInputChange}
                  rows={3}
                  className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 ${
                    errors.description ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Enter shipment description"
                />
                {errors.description && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.description}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="nmfcClass"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  NMFC Class *
                </label>
                <input
                  type="text"
                  id="nmfcClass"
                  name="nmfcClass"
                  value={bolData.nmfcClass}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 ${
                    errors.nmfcClass ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Enter NMFC class"
                />
                {errors.nmfcClass && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.nmfcClass}
                  </p>
                )}
              </div>
            </div>

            {/* TMS and Seal Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
              <div>
                <label
                  htmlFor="tmsShipmentId"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  TMS Shipment ID (CS...) *
                </label>
                <input
                  type="text"
                  id="tmsShipmentId"
                  name="tmsShipmentId"
                  value={bolData.tmsShipmentId}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 ${
                    errors.tmsShipmentId ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="CS..."
                />
                {errors.tmsShipmentId && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.tmsShipmentId}
                  </p>
                )}
                <p className="mt-1 text-xs text-gray-600">
                  Must start with "CS" • Exact format • One ID • Not reused
                </p>
              </div>

              <div>
                <label
                  htmlFor="sealNumber"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Seal Number *
                </label>
                <input
                  type="text"
                  id="sealNumber"
                  name="sealNumber"
                  value={bolData.sealNumber}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 ${
                    errors.sealNumber ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Enter seal number"
                />
                {errors.sealNumber && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.sealNumber}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* TMS Placement Rules */}
          <div className="bg-yellow-50 p-4 rounded-lg">
            <h3 className="text-lg font-medium text-yellow-900 mb-2">
              TMS Shipment ID Placement Rules
            </h3>
            <div className="text-sm text-yellow-800">
              <p className="mb-2">
                <strong>GS1 BOL:</strong> Place TMS ID in the "CID" field
              </p>
              <p>
                <strong>Non-GS1 BOL:</strong> Place TMS ID in the top-right
                corner
              </p>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={completeness < 100}
              className={`px-6 py-3 rounded-md font-medium transition-colors ${
                completeness < 100
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-blue-600 text-white hover:bg-blue-700'
              }`}
            >
              Submit BOL
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
