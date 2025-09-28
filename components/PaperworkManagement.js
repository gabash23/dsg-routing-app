'use client';

import { useState, useEffect } from 'react';

export default function PaperworkManagement() {
  const [bolData, setBolData] = useState({
    // Required fields for first page
    carrierFullName: '',
    shipTo: '',
    collectThirdPartyBillTo: '',
    vendorName: '',
    vendorNumber: '',
    pos: [{ poNumber: '', cartonsPerPO: '' }],
    totalCartons: '',
    totalPallets: '',
    totalWeight: '',
    description: '',
    nmfcClass: '',
    bolNumber: '',
    tmsShipmentId: '',
    sealNumber: '',

    // BOL type and TMS placement
    bolType: 'gs1', // 'gs1' or 'non-gs1'
    tmsPlacement: 'cid', // 'cid' for GS1, 'top-right' for non-GS1
  });

  const [errors, setErrors] = useState({});
  const [completeness, setCompleteness] = useState(0);

  // Calculate completeness percentage
  useEffect(() => {
    const requiredFields = [
      'carrierFullName',
      'shipTo',
      'collectThirdPartyBillTo',
      'vendorName',
      'vendorNumber',
      'totalCartons',
      'totalPallets',
      'totalWeight',
      'description',
      'nmfcClass',
      'bolNumber',
      'tmsShipmentId',
      'sealNumber',
    ];

    // Check PO fields
    const poFieldsComplete = bolData.pos.every(
      (po) => po.poNumber && po.cartonsPerPO
    );
    const hasPos = bolData.pos.length > 0 && poFieldsComplete;

    const completedFields = requiredFields.filter((field) => {
      if (field === 'pos') return hasPos;
      return bolData[field] && bolData[field].toString().trim() !== '';
    }).length;

    const totalFields = requiredFields.length;
    const completenessPercentage = Math.round(
      (completedFields / totalFields) * 100
    );
    setCompleteness(completenessPercentage);
  }, [bolData]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (name.startsWith('pos.')) {
      const [_, index, field] = name.split('.');
      const newPos = [...bolData.pos];
      newPos[index][field] = value;
      setBolData((prev) => ({
        ...prev,
        pos: newPos,
      }));
    } else {
      setBolData((prev) => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value,
      }));
    }

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  const handleBolTypeChange = (type) => {
    setBolData((prev) => ({
      ...prev,
      bolType: type,
      tmsPlacement: type === 'gs1' ? 'cid' : 'top-right',
    }));
  };

  const addPO = () => {
    setBolData((prev) => ({
      ...prev,
      pos: [...prev.pos, { poNumber: '', cartonsPerPO: '' }],
    }));
  };

  const removePO = (index) => {
    if (bolData.pos.length > 1) {
      setBolData((prev) => ({
        ...prev,
        pos: prev.pos.filter((_, i) => i !== index),
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    // Required field validation
    if (!bolData.carrierFullName)
      newErrors.carrierFullName = 'Carrier full name is required';
    if (!bolData.shipTo) newErrors.shipTo = 'Ship-to address is required';
    if (!bolData.collectThirdPartyBillTo)
      newErrors.collectThirdPartyBillTo =
        'Collect 3rd-party bill-to is required';
    if (!bolData.vendorName) newErrors.vendorName = 'Vendor name is required';
    if (!bolData.vendorNumber)
      newErrors.vendorNumber = 'Vendor number is required';
    if (!bolData.totalCartons)
      newErrors.totalCartons = 'Total cartons is required';
    if (!bolData.totalPallets)
      newErrors.totalPallets = 'Total pallets is required';
    if (!bolData.totalWeight)
      newErrors.totalWeight = 'Total weight is required';
    if (!bolData.description) newErrors.description = 'Description is required';
    if (!bolData.nmfcClass) newErrors.nmfcClass = 'NMFC class is required';
    if (!bolData.bolNumber) newErrors.bolNumber = 'BOL number is required';
    if (!bolData.tmsShipmentId)
      newErrors.tmsShipmentId = 'TMS Shipment ID is required';
    if (!bolData.sealNumber) newErrors.sealNumber = 'Seal number is required';

    // PO validation
    bolData.pos.forEach((po, index) => {
      if (!po.poNumber)
        newErrors[`pos.${index}.poNumber`] = 'PO number is required';
      if (!po.cartonsPerPO)
        newErrors[`pos.${index}.cartonsPerPO`] = 'Cartons per PO is required';
    });

    // TMS ID format validation
    if (bolData.tmsShipmentId && !bolData.tmsShipmentId.startsWith('CS')) {
      newErrors.tmsShipmentId = 'TMS Shipment ID must start with "CS"';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (validateForm()) {
      console.log('BOL Data:', bolData);
      alert('BOL paperwork completed successfully!');
    }
  };

  const getCompletenessColor = () => {
    if (completeness < 50) return 'bg-red-500';
    if (completeness < 80) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Paperwork Management
        </h1>
        <p className="text-gray-600">
          Complete BOL first-page with TMS placement per DSG routing guidelines
        </p>
      </div>

      {/* Completeness Meter */}
      <div className="mb-8 bg-white shadow-lg rounded-lg p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-900">
            BOL Completeness
          </h2>
          <span className="text-2xl font-bold text-gray-900">
            {completeness}%
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-4">
          <div
            className={`h-4 rounded-full transition-all duration-300 ${getCompletenessColor()}`}
            style={{ width: `${completeness}%` }}
          ></div>
        </div>
        <p className="text-sm text-gray-600 mt-2">
          All required fields must be completed for BOL processing
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* BOL Type Selection */}
        <div className="bg-white shadow-lg rounded-lg p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            BOL Type & TMS Placement
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                BOL Type *
              </label>
              <div className="space-y-2">
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="bolType"
                    value="gs1"
                    checked={bolData.bolType === 'gs1'}
                    onChange={(e) => handleBolTypeChange(e.target.value)}
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
                    onChange={(e) => handleBolTypeChange(e.target.value)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                  />
                  <span className="ml-2 text-sm text-gray-700">
                    Non-GS1 BOL
                  </span>
                </label>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                TMS Placement Rule
              </label>
              <div className="p-3 bg-blue-50 rounded-lg">
                <p className="text-sm text-blue-800 font-medium">
                  {bolData.bolType === 'gs1'
                    ? 'GS1 BOL → "CID" field'
                    : 'Non-GS1 BOL → top-right'}
                </p>
                <p className="text-xs text-blue-600 mt-1">
                  Exact CS format • One ID • Not reused
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Required Fields */}
        <div className="bg-white shadow-lg rounded-lg p-6">
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
                className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.carrierFullName ? 'border-red-500' : 'border-gray-300'
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
                className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.vendorName ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Enter vendor name"
              />
              {errors.vendorName && (
                <p className="mt-1 text-sm text-red-600">{errors.vendorName}</p>
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
                className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
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
                className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.bolNumber ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Enter BOL number"
              />
              {errors.bolNumber && (
                <p className="mt-1 text-sm text-red-600">{errors.bolNumber}</p>
              )}
            </div>
          </div>

          <div className="mt-6">
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
              className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.shipTo ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Enter ship-to address"
            />
            {errors.shipTo && (
              <p className="mt-1 text-sm text-red-600">{errors.shipTo}</p>
            )}
          </div>

          <div className="mt-6">
            <label
              htmlFor="collectThirdPartyBillTo"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Collect 3rd-Party Bill-To *
            </label>
            <textarea
              id="collectThirdPartyBillTo"
              name="collectThirdPartyBillTo"
              value={bolData.collectThirdPartyBillTo}
              onChange={handleInputChange}
              rows={3}
              className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.collectThirdPartyBillTo
                  ? 'border-red-500'
                  : 'border-gray-300'
              }`}
              placeholder="Enter collect 3rd-party bill-to address"
            />
            {errors.collectThirdPartyBillTo && (
              <p className="mt-1 text-sm text-red-600">
                {errors.collectThirdPartyBillTo}
              </p>
            )}
          </div>
        </div>

        {/* PO and Carton Information */}
        <div className="bg-white shadow-lg rounded-lg p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-900">
              PO & Carton Information
            </h2>
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
              <div key={index} className="border rounded-lg p-4">
                <div className="flex justify-between items-center mb-3">
                  <h3 className="font-medium text-gray-900">PO #{index + 1}</h3>
                  {bolData.pos.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removePO(index)}
                      className="text-red-600 hover:text-red-800 text-sm"
                    >
                      Remove
                    </button>
                  )}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      PO Number *
                    </label>
                    <input
                      type="text"
                      name={`pos.${index}.poNumber`}
                      value={po.poNumber}
                      onChange={handleInputChange}
                      className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        errors[`pos.${index}.poNumber`]
                          ? 'border-red-500'
                          : 'border-gray-300'
                      }`}
                      placeholder="Enter PO number"
                    />
                    {errors[`pos.${index}.poNumber`] && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors[`pos.${index}.poNumber`]}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Cartons per PO *
                    </label>
                    <input
                      type="number"
                      name={`pos.${index}.cartonsPerPO`}
                      value={po.cartonsPerPO}
                      onChange={handleInputChange}
                      className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        errors[`pos.${index}.cartonsPerPO`]
                          ? 'border-red-500'
                          : 'border-gray-300'
                      }`}
                      placeholder="Enter cartons per PO"
                    />
                    {errors[`pos.${index}.cartonsPerPO`] && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors[`pos.${index}.cartonsPerPO`]}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

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
                className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
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
                className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
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
                className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
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
        </div>

        {/* Additional Information */}
        <div className="bg-white shadow-lg rounded-lg p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Additional Information
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
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

            <div className="space-y-4">
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
                  className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
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
                  className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.tmsShipmentId ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="CS..."
                />
                {errors.tmsShipmentId && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.tmsShipmentId}
                  </p>
                )}
                <p className="mt-1 text-xs text-gray-500">
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
                  className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
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
        </div>

        {/* Submit Button */}
        <div className="flex justify-end space-x-4">
          <button
            type="button"
            className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Save Draft
          </button>
          <button
            type="submit"
            disabled={completeness < 100}
            className={`px-6 py-2 rounded-md font-medium transition-colors ${
              completeness < 100
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-green-600 text-white hover:bg-green-700'
            }`}
          >
            Complete BOL
          </button>
        </div>
      </form>
    </div>
  );
}
