'use client';

import { useState, useEffect } from 'react';

export default function ShipmentSetup() {
  const [formData, setFormData] = useState({
    poNumber: '',
    dcCode: '',
    departTime: '',
    tmsId: '',
    destination: '',
    asnSent: false,
    asnSentTime: null,
    shippingMode: 'ltl', // 'ltl' or 'parcel'
    totalCartons: '',
    totalWeight: '',
  });

  const [asnTimer, setAsnTimer] = useState(null);
  const [asnTimeRemaining, setAsnTimeRemaining] = useState(null);
  const [errors, setErrors] = useState({});

  // ASN Timer Logic - 1 hour requirement
  useEffect(() => {
    if (formData.departTime && !formData.asnSent) {
      const departTime = new Date(formData.departTime);
      const oneHourLater = new Date(departTime.getTime() + 60 * 60 * 1000);

      const timer = setInterval(() => {
        const now = new Date();
        const timeRemaining = oneHourLater.getTime() - now.getTime();

        if (timeRemaining <= 0) {
          setAsnTimeRemaining(0);
          clearInterval(timer);
        } else {
          setAsnTimeRemaining(timeRemaining);
        }
      }, 1000);

      setAsnTimer(timer);
      return () => clearInterval(timer);
    }
  }, [formData.departTime, formData.asnSent]);

  const formatTimeRemaining = (milliseconds) => {
    if (milliseconds <= 0) return '00:00:00';

    const hours = Math.floor(milliseconds / (1000 * 60 * 60));
    const minutes = Math.floor((milliseconds % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((milliseconds % (1000 * 60)) / 1000);

    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  const handleSendASN = () => {
    if (
      !formData.poNumber ||
      !formData.dcCode ||
      !formData.departTime ||
      !formData.tmsId
    ) {
      setErrors({
        poNumber: !formData.poNumber ? 'PO Number is required' : '',
        dcCode: !formData.dcCode ? 'DC Code is required' : '',
        departTime: !formData.departTime ? 'Depart Time is required' : '',
        tmsId: !formData.tmsId ? 'TMS ID is required' : '',
      });
      return;
    }

    setFormData((prev) => ({
      ...prev,
      asnSent: true,
      asnSentTime: new Date().toISOString(),
    }));

    if (asnTimer) {
      clearInterval(asnTimer);
      setAsnTimer(null);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validate required fields
    const newErrors = {};
    if (!formData.poNumber) newErrors.poNumber = 'PO Number is required';
    if (!formData.dcCode) newErrors.dcCode = 'DC Code is required';
    if (!formData.departTime) newErrors.departTime = 'Depart Time is required';
    if (!formData.tmsId) newErrors.tmsId = 'TMS ID is required';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // Here you would typically send the data to your backend
    console.log('Shipment Setup Data:', formData);
    alert('Shipment setup completed successfully!');
  };

  const isASNOverdue = asnTimeRemaining === 0 && !formData.asnSent;

  // Check parcel eligibility
  const checkParcelEligibility = () => {
    if (formData.shippingMode !== 'parcel') return null;

    const cartons = parseInt(formData.totalCartons) || 0;
    const weight = parseFloat(formData.totalWeight) || 0;

    const maxCartons = 16;
    const maxWeight = 110; // billable lbs

    const isEligible = cartons <= maxCartons && weight <= maxWeight;

    return {
      isEligible,
      cartons,
      weight,
      maxCartons,
      maxWeight,
      warnings: [
        cartons > maxCartons
          ? `Exceeds carton limit (${cartons} > ${maxCartons})`
          : null,
        weight > maxWeight
          ? `Exceeds weight limit (${weight} > ${maxWeight} lbs)`
          : null,
      ].filter(Boolean),
    };
  };

  const parcelEligibility = checkParcelEligibility();

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white shadow-lg rounded-lg p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Shipment Setup
          </h1>
          <p className="text-gray-600">
            Configure shipment details and manage ASN requirements
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Shipping Mode Selection */}
          <div className="bg-blue-50 p-4 rounded-lg">
            <h3 className="text-lg font-medium text-blue-900 mb-3">
              Shipping Mode
            </h3>
            <div className="flex space-x-4">
              <label className="flex items-center">
                <input
                  type="radio"
                  name="shippingMode"
                  value="ltl"
                  checked={formData.shippingMode === 'ltl'}
                  onChange={handleInputChange}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                />
                <span className="ml-2 text-sm text-blue-800">
                  LTL (Less Than Truckload)
                </span>
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="shippingMode"
                  value="parcel"
                  checked={formData.shippingMode === 'parcel'}
                  onChange={handleInputChange}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                />
                <span className="ml-2 text-sm text-blue-800">Parcel</span>
              </label>
            </div>
          </div>

          {/* Parcel Eligibility Warning */}
          {parcelEligibility && (
            <div
              className={`p-4 rounded-lg ${
                parcelEligibility.isEligible
                  ? 'bg-green-50 border border-green-200'
                  : 'bg-orange-50 border border-orange-200'
              }`}
            >
              <div className="flex items-center gap-2 mb-2">
                <span
                  className={`text-lg ${
                    parcelEligibility.isEligible
                      ? 'text-green-600'
                      : 'text-orange-600'
                  }`}
                >
                  {parcelEligibility.isEligible ? '✓' : '⚠'}
                </span>
                <h3
                  className={`text-lg font-medium ${
                    parcelEligibility.isEligible
                      ? 'text-green-900'
                      : 'text-orange-900'
                  }`}
                >
                  Parcel Eligibility Check
                </h3>
              </div>
              <div
                className={`text-sm ${
                  parcelEligibility.isEligible
                    ? 'text-green-800'
                    : 'text-orange-800'
                }`}
              >
                <p className="mb-2">
                  {parcelEligibility.isEligible
                    ? 'Shipment meets parcel requirements'
                    : 'Shipment may not meet parcel requirements'}
                </p>
                <div className="space-y-1">
                  <p>
                    • Cartons: {parcelEligibility.cartons} /{' '}
                    {parcelEligibility.maxCartons} (≤
                    {parcelEligibility.maxCartons} per destination per week)
                  </p>
                  <p>
                    • Weight: {parcelEligibility.weight} /{' '}
                    {parcelEligibility.maxWeight} lbs (≤
                    {parcelEligibility.maxWeight} billable lbs)
                  </p>
                  <p>• Dim weight = L×W×H/350 (calculate for each carton)</p>
                </div>
                {parcelEligibility.warnings.length > 0 && (
                  <div className="mt-2">
                    {parcelEligibility.warnings.map((warning, index) => (
                      <p key={index} className="text-orange-600">
                        ⚠ {warning}
                      </p>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* PO/DC Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label
                htmlFor="poNumber"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                PO Number *
              </label>
              <input
                type="text"
                id="poNumber"
                name="poNumber"
                value={formData.poNumber}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 ${
                  errors.poNumber ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Enter PO Number"
              />
              {errors.poNumber && (
                <p className="mt-1 text-sm text-red-600">{errors.poNumber}</p>
              )}
            </div>

            <div>
              <label
                htmlFor="dcCode"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                DC Code *
              </label>
              <input
                type="text"
                id="dcCode"
                name="dcCode"
                value={formData.dcCode}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 ${
                  errors.dcCode ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Enter DC Code"
              />
              {errors.dcCode && (
                <p className="mt-1 text-sm text-red-600">{errors.dcCode}</p>
              )}
            </div>
          </div>

          {/* Depart Time and TMS ID */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label
                htmlFor="departTime"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Depart Time *
              </label>
              <input
                type="datetime-local"
                id="departTime"
                name="departTime"
                value={formData.departTime}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 ${
                  errors.departTime ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.departTime && (
                <p className="mt-1 text-sm text-red-600">{errors.departTime}</p>
              )}
            </div>

            <div>
              <label
                htmlFor="tmsId"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                TMS Shipment ID (CS...) *
              </label>
              <input
                type="text"
                id="tmsId"
                name="tmsId"
                value={formData.tmsId}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 ${
                  errors.tmsId ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="CS..."
              />
              {errors.tmsId && (
                <p className="mt-1 text-sm text-red-600">{errors.tmsId}</p>
              )}
              <p className="mt-1 text-xs text-gray-600">
                Must appear exactly as assigned for appointments/yard
                access/invoicing
              </p>
            </div>
          </div>

          {/* Destination */}
          <div>
            <label
              htmlFor="destination"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Destination
            </label>
            <input
              type="text"
              id="destination"
              name="destination"
              value={formData.destination}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
              placeholder="Enter destination address"
            />
            <p className="mt-1 text-xs text-gray-600">
              Combine POs to the same destination for efficiency
            </p>
          </div>

          {/* Total Cartons and Weight */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label
                htmlFor="totalCartons"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Total Cartons
              </label>
              <input
                type="number"
                id="totalCartons"
                name="totalCartons"
                value={formData.totalCartons}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                placeholder="Enter total cartons"
              />
            </div>
            <div>
              <label
                htmlFor="totalWeight"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Total Weight (lbs)
              </label>
              <input
                type="number"
                id="totalWeight"
                name="totalWeight"
                value={formData.totalWeight}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                placeholder="Enter total weight"
              />
            </div>
          </div>

          {/* ASN Section */}
          <div className="bg-gray-50 p-6 rounded-lg">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Send ASN</h3>
              {formData.asnSent ? (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                  ✓ ASN Sent
                </span>
              ) : (
                <span
                  className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                    isASNOverdue
                      ? 'bg-red-100 text-red-800'
                      : 'bg-yellow-100 text-yellow-800'
                  }`}
                >
                  {isASNOverdue ? '⚠ Overdue' : '⏱ Pending'}
                </span>
              )}
            </div>

            {formData.departTime && !formData.asnSent && (
              <div className="mb-4">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-sm font-medium text-gray-700">
                    Time Remaining:
                  </span>
                  <span
                    className={`text-lg font-mono font-bold ${
                      isASNOverdue ? 'text-red-600' : 'text-blue-600'
                    }`}
                  >
                    {formatTimeRemaining(asnTimeRemaining)}
                  </span>
                </div>
                <p className="text-xs text-gray-600">
                  ASN must be sent within 1 hour after shipment departure
                </p>
              </div>
            )}

            {formData.asnSent && formData.asnSentTime && (
              <div className="mb-4">
                <p className="text-sm text-gray-600">
                  ASN sent at: {new Date(formData.asnSentTime).toLocaleString()}
                </p>
              </div>
            )}

            <button
              type="button"
              onClick={handleSendASN}
              disabled={
                formData.asnSent ||
                !formData.poNumber ||
                !formData.dcCode ||
                !formData.departTime ||
                !formData.tmsId
              }
              className={`px-4 py-2 rounded-md font-medium transition-colors ${
                formData.asnSent ||
                !formData.poNumber ||
                !formData.dcCode ||
                !formData.departTime ||
                !formData.tmsId
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-blue-600 text-white hover:bg-blue-700'
              }`}
            >
              {formData.asnSent ? 'ASN Already Sent' : 'Send ASN'}
            </button>
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
              className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
            >
              Complete Setup
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
