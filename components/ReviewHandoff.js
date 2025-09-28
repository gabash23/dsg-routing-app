'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function ReviewHandoff() {
  const router = useRouter();
  const [handoffData, setHandoffData] = useState({
    // Stage tracking
    stages: {
      bolCopies: false,
      sealVerification: false,
      tmsVerification: false,
      photos: false,
      driverHandoff: false,
    },

    // Handoff details
    bolCopies: {
      copy1: false,
      copy2: false,
      sealNumberOnBol: false,
    },

    sealVerification: {
      sealNumber: '',
      bolSealMatch: false,
      sealIntact: false,
    },

    tmsVerification: {
      tmsId: '',
      driverVerified: false,
      correctFormat: false,
    },

    photos: {
      sealPhoto: null,
      bolPhoto: null,
      shipmentPhoto: null,
    },

    driverInfo: {
      name: '',
      license: '',
      company: '',
      phone: '',
    },

    handoffNotes: '',
  });

  const [errors, setErrors] = useState({});

  // Validation functions
  const validatePhone = (value) => {
    const phoneRegex = /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/;
    if (!phoneRegex.test(value)) {
      return 'Please enter a valid phone number (e.g., 123-456-7890)';
    }
    return '';
  };

  const validateName = (value) => {
    if (!value.trim()) {
      return 'Name is required';
    }
    if (value.length < 2) {
      return 'Name must be at least 2 characters';
    }
    return '';
  };

  const validateTMSId = (value) => {
    if (!value.startsWith('CS')) {
      return 'TMS ID must start with "CS"';
    }
    if (value.length < 3) {
      return 'TMS ID must be at least 3 characters';
    }
    return '';
  };

  const validateRequired = (value, fieldName) => {
    if (!value || value.toString().trim() === '') {
      return `${fieldName} is required`;
    }
    return '';
  };
  const [currentStage, setCurrentStage] = useState('bolCopies');

  // Calculate overall progress
  const calculateProgress = () => {
    const totalStages = Object.keys(handoffData.stages).length;
    const completedStages = Object.values(handoffData.stages).filter(
      Boolean
    ).length;
    return Math.round((completedStages / totalStages) * 100);
  };

  const progress = calculateProgress();

  const handleStageComplete = (stageName) => {
    setHandoffData((prev) => ({
      ...prev,
      stages: {
        ...prev.stages,
        [stageName]: true,
      },
    }));
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (name.includes('.')) {
      const [section, field] = name.split('.');
      setHandoffData((prev) => ({
        ...prev,
        [section]: {
          ...prev[section],
          [field]: type === 'checkbox' ? checked : value,
        },
      }));
    } else {
      setHandoffData((prev) => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value,
      }));
    }

    // Validate fields in real-time
    let error = '';
    if (name.includes('.')) {
      const [section, field] = name.split('.');
      if (section === 'driverInfo') {
        switch (field) {
          case 'name':
            error = validateName(value);
            break;
          case 'phone':
            error = validatePhone(value);
            break;
          case 'license':
          case 'company':
            error = validateRequired(value, field);
            break;
          default:
            break;
        }
      } else if (section === 'tmsVerification' && field === 'tmsId') {
        error = validateTMSId(value);
      }
    } else {
      switch (name) {
        case 'sealNumber':
          error = validateRequired(value, 'Seal Number');
          break;
        default:
          break;
      }
    }

    setErrors((prev) => ({
      ...prev,
      [name]: error,
    }));
  };

  const handlePhotoUpload = (photoType, file) => {
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setHandoffData((prev) => ({
          ...prev,
          photos: {
            ...prev.photos,
            [photoType]: e.target.result,
          },
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const validateStage = (stageName) => {
    const newErrors = {};

    switch (stageName) {
      case 'bolCopies':
        if (!handoffData.bolCopies.copy1)
          newErrors.copy1 = 'First BOL copy is required';
        if (!handoffData.bolCopies.copy2)
          newErrors.copy2 = 'Second BOL copy is required';
        if (!handoffData.bolCopies.sealNumberOnBol)
          newErrors.sealNumberOnBol = 'Seal number must be on BOL';
        break;
      case 'sealVerification':
        if (!handoffData.sealVerification.sealNumber)
          newErrors.sealNumber = 'Seal number is required';
        if (!handoffData.sealVerification.bolSealMatch)
          newErrors.bolSealMatch = 'BOL and seal numbers must match';
        if (!handoffData.sealVerification.sealIntact)
          newErrors.sealIntact = 'Seal must be intact';
        break;
      case 'tmsVerification':
        if (!handoffData.tmsVerification.tmsId)
          newErrors.tmsId = 'TMS ID is required';
        if (!handoffData.tmsVerification.driverVerified)
          newErrors.driverVerified = 'Driver verification is required';
        if (!handoffData.tmsVerification.correctFormat)
          newErrors.correctFormat = 'TMS ID format must be correct';
        break;
      case 'photos':
        if (!handoffData.photos.sealPhoto)
          newErrors.sealPhoto = 'Seal photo is required';
        if (!handoffData.photos.bolPhoto)
          newErrors.bolPhoto = 'BOL photo is required';
        if (!handoffData.photos.shipmentPhoto)
          newErrors.shipmentPhoto = 'Shipment photo is required';
        break;
      case 'driverHandoff':
        if (!handoffData.driverInfo.name)
          newErrors.driverName = 'Driver name is required';
        if (!handoffData.driverInfo.license)
          newErrors.driverLicense = 'Driver license is required';
        if (!handoffData.driverInfo.company)
          newErrors.driverCompany = 'Driver company is required';
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleStageSubmit = (stageName) => {
    if (validateStage(stageName)) {
      handleStageComplete(stageName);

      // Move to next stage
      const stages = [
        'bolCopies',
        'sealVerification',
        'tmsVerification',
        'photos',
        'driverHandoff',
      ];
      const currentIndex = stages.indexOf(stageName);
      if (currentIndex < stages.length - 1) {
        setCurrentStage(stages[currentIndex + 1]);
      }
    }
  };

  const handleFinalHandoff = () => {
    // Store handoff data immediately for the success page
    sessionStorage.setItem('handoffData', JSON.stringify(handoffData));

    // Mark handoff as completed in localStorage
    localStorage.setItem('dsg-handoff-completed', 'true');

    // Redirect to success page immediately
    router.push('/success');
  };

  const getStageStatus = (stageName) => {
    return handoffData.stages[stageName]
      ? 'completed'
      : currentStage === stageName
        ? 'current'
        : 'pending';
  };

  const getStageColor = (stageName) => {
    const status = getStageStatus(stageName);
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'current':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const stages = [
    {
      id: 'bolCopies',
      name: 'BOL Copies',
      description: 'Two copies + seal on BOL',
    },
    {
      id: 'sealVerification',
      name: 'Seal Verification',
      description: 'Seal number & integrity',
    },
    {
      id: 'tmsVerification',
      name: 'TMS Verification',
      description: 'TMS ID with driver',
    },
    { id: 'photos', name: 'Photos', description: 'Documentation photos' },
    {
      id: 'driverHandoff',
      name: 'Driver Handoff',
      description: 'Final handoff to driver',
    },
  ];

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Review & Handoff
        </h1>
        <p className="text-gray-600">
          Complete handoff process with stage verification per DSG routing
          guidelines
        </p>
      </div>

      {/* Progress Overview */}
      <div className="mb-8 bg-white shadow-lg rounded-lg p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-900">
            Handoff Progress
          </h2>
          <span className="text-2xl font-bold text-gray-900">{progress}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-4">
          <div
            className="h-4 bg-green-500 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
        <p className="text-sm text-gray-600 mt-2">
          Complete all stages for successful handoff
        </p>
      </div>

      {/* Stage Chips */}
      <div className="mb-8 bg-white shadow-lg rounded-lg p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          Handoff Stages
        </h2>
        <div className="flex flex-wrap gap-3">
          {stages.map((stage) => (
            <div
              key={stage.id}
              className={`px-4 py-2 rounded-full border-2 text-sm font-medium transition-colors ${getStageColor(stage.id)}`}
            >
              <div className="flex items-center gap-2">
                <span className="text-lg">
                  {getStageStatus(stage.id) === 'completed'
                    ? '✓'
                    : getStageStatus(stage.id) === 'current'
                      ? '⏳'
                      : '○'}
                </span>
                <div>
                  <div className="font-semibold">{stage.name}</div>
                  <div className="text-xs opacity-75">{stage.description}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Current Stage Content */}
      <div className="bg-white shadow-lg rounded-lg p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">
          {stages.find((s) => s.id === currentStage)?.name}
        </h2>

        {/* BOL Copies Stage */}
        {currentStage === 'bolCopies' && (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                BOL Copies Verification
              </h3>
              <div className="space-y-4">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="copy1"
                    name="bolCopies.copy1"
                    checked={handoffData.bolCopies.copy1}
                    onChange={handleInputChange}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label
                    htmlFor="copy1"
                    className="ml-2 block text-sm text-gray-700"
                  >
                    First BOL copy provided
                  </label>
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="copy2"
                    name="bolCopies.copy2"
                    checked={handoffData.bolCopies.copy2}
                    onChange={handleInputChange}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label
                    htmlFor="copy2"
                    className="ml-2 block text-sm text-gray-700"
                  >
                    Second BOL copy provided
                  </label>
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="sealNumberOnBol"
                    name="bolCopies.sealNumberOnBol"
                    checked={handoffData.bolCopies.sealNumberOnBol}
                    onChange={handleInputChange}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label
                    htmlFor="sealNumberOnBol"
                    className="ml-2 block text-sm text-gray-700"
                  >
                    Seal number is on the BOL
                  </label>
                </div>
              </div>
            </div>
            <button
              onClick={() => handleStageSubmit('bolCopies')}
              className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              Complete BOL Copies
            </button>
          </div>
        )}

        {/* Seal Verification Stage */}
        {currentStage === 'sealVerification' && (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Seal Verification
              </h3>
              <div className="space-y-4">
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
                    name="sealVerification.sealNumber"
                    value={handoffData.sealVerification.sealNumber}
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
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="bolSealMatch"
                    name="sealVerification.bolSealMatch"
                    checked={handoffData.sealVerification.bolSealMatch}
                    onChange={handleInputChange}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label
                    htmlFor="bolSealMatch"
                    className="ml-2 block text-sm text-gray-700"
                  >
                    BOL and seal numbers match
                  </label>
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="sealIntact"
                    name="sealVerification.sealIntact"
                    checked={handoffData.sealVerification.sealIntact}
                    onChange={handleInputChange}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label
                    htmlFor="sealIntact"
                    className="ml-2 block text-sm text-gray-700"
                  >
                    Seal is intact and secure
                  </label>
                </div>
              </div>
            </div>
            <button
              onClick={() => handleStageSubmit('sealVerification')}
              className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              Complete Seal Verification
            </button>
          </div>
        )}

        {/* TMS Verification Stage */}
        {currentStage === 'tmsVerification' && (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                TMS ID Verification with Driver
              </h3>
              <div className="space-y-4">
                <div>
                  <label
                    htmlFor="tmsId"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    TMS Shipment ID *
                  </label>
                  <input
                    type="text"
                    id="tmsId"
                    name="tmsVerification.tmsId"
                    value={handoffData.tmsVerification.tmsId}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 ${
                      errors.tmsId ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="CS..."
                  />
                  {errors.tmsId && (
                    <p className="mt-1 text-sm text-red-600">{errors.tmsId}</p>
                  )}
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="driverVerified"
                    name="tmsVerification.driverVerified"
                    checked={handoffData.tmsVerification.driverVerified}
                    onChange={handleInputChange}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label
                    htmlFor="driverVerified"
                    className="ml-2 block text-sm text-gray-700"
                  >
                    Driver has verified the correct TMS ID
                  </label>
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="correctFormat"
                    name="tmsVerification.correctFormat"
                    checked={handoffData.tmsVerification.correctFormat}
                    onChange={handleInputChange}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label
                    htmlFor="correctFormat"
                    className="ml-2 block text-sm text-gray-700"
                  >
                    TMS ID format is correct (CS...)
                  </label>
                </div>
              </div>
            </div>
            <button
              onClick={() => handleStageSubmit('tmsVerification')}
              className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              Complete TMS Verification
            </button>
          </div>
        )}

        {/* Photos Stage */}
        {currentStage === 'photos' && (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Documentation Photos
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Seal Photo *
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) =>
                      handlePhotoUpload('sealPhoto', e.target.files[0])
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                  />
                  {handoffData.photos.sealPhoto && (
                    <div className="mt-2">
                      <img
                        src={handoffData.photos.sealPhoto}
                        alt="Seal"
                        className="w-full h-32 object-cover rounded"
                      />
                    </div>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    BOL Photo *
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) =>
                      handlePhotoUpload('bolPhoto', e.target.files[0])
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                  />
                  {handoffData.photos.bolPhoto && (
                    <div className="mt-2">
                      <img
                        src={handoffData.photos.bolPhoto}
                        alt="BOL"
                        className="w-full h-32 object-cover rounded"
                      />
                    </div>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Shipment Photo *
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) =>
                      handlePhotoUpload('shipmentPhoto', e.target.files[0])
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                  />
                  {handoffData.photos.shipmentPhoto && (
                    <div className="mt-2">
                      <img
                        src={handoffData.photos.shipmentPhoto}
                        alt="Shipment"
                        className="w-full h-32 object-cover rounded"
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>
            <button
              onClick={() => handleStageSubmit('photos')}
              className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              Complete Photos
            </button>
          </div>
        )}

        {/* Driver Handoff Stage */}
        {currentStage === 'driverHandoff' && (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Driver Information & Final Handoff
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label
                    htmlFor="driverName"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Driver Name *
                  </label>
                  <input
                    type="text"
                    id="driverName"
                    name="driverInfo.name"
                    value={handoffData.driverInfo.name}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 ${
                      errors.driverName ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Enter driver name"
                  />
                  {errors.driverName && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.driverName}
                    </p>
                  )}
                </div>
                <div>
                  <label
                    htmlFor="driverLicense"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Driver License *
                  </label>
                  <input
                    type="text"
                    id="driverLicense"
                    name="driverInfo.license"
                    value={handoffData.driverInfo.license}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 ${
                      errors.driverLicense
                        ? 'border-red-500'
                        : 'border-gray-300'
                    }`}
                    placeholder="Enter driver license"
                  />
                  {errors.driverLicense && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.driverLicense}
                    </p>
                  )}
                </div>
                <div>
                  <label
                    htmlFor="driverCompany"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Driver Company *
                  </label>
                  <input
                    type="text"
                    id="driverCompany"
                    name="driverInfo.company"
                    value={handoffData.driverInfo.company}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 ${
                      errors.driverCompany
                        ? 'border-red-500'
                        : 'border-gray-300'
                    }`}
                    placeholder="Enter driver company"
                  />
                  {errors.driverCompany && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.driverCompany}
                    </p>
                  )}
                </div>
                <div>
                  <label
                    htmlFor="driverPhone"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Driver Phone
                  </label>
                  <input
                    type="tel"
                    id="driverPhone"
                    name="driverInfo.phone"
                    value={handoffData.driverInfo.phone}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                    placeholder="Enter driver phone"
                  />
                </div>
              </div>
              <div className="mt-6">
                <label
                  htmlFor="handoffNotes"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Handoff Notes
                </label>
                <textarea
                  id="handoffNotes"
                  name="handoffNotes"
                  value={handoffData.handoffNotes}
                  onChange={handleInputChange}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                  placeholder="Enter any additional notes for the handoff"
                />
              </div>
            </div>
            <button
              onClick={handleFinalHandoff}
              className="px-8 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-colors shadow-lg"
            >
              Complete Handoff
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
