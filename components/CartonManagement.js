'use client';

import { useState, useEffect } from 'react';

export default function CartonManagement() {
  const [cartons, setCartons] = useState([]);
  const [formData, setFormData] = useState({
    cartonId: '',
    dimensions: {
      length: '',
      width: '',
      height: '',
    },
    weight: '',
    isConveyable: true,
    placementAttestation: false,
  });
  const [errors, setErrors] = useState({});

  // Validation functions
  const validateNumeric = (value, fieldName, min = 0, max = Infinity) => {
    const num = parseFloat(value);
    if (isNaN(num) || num < min || num > max) {
      return `${fieldName} must be a number between ${min} and ${max}`;
    }
    return '';
  };

  const validateCartonId = (value) => {
    if (!value.trim()) {
      return 'Carton ID is required';
    }
    if (value.length < 3) {
      return 'Carton ID must be at least 3 characters';
    }
    return '';
  };

  const validateDimensions = (length, width, height) => {
    const lengthNum = parseFloat(length);
    const widthNum = parseFloat(width);
    const heightNum = parseFloat(height);

    if (isNaN(lengthNum) || lengthNum <= 0) {
      return 'Length must be a positive number';
    }
    if (isNaN(widthNum) || widthNum <= 0) {
      return 'Width must be a positive number';
    }
    if (isNaN(heightNum) || heightNum <= 0) {
      return 'Height must be a positive number';
    }
    if (lengthNum > 100 || widthNum > 100 || heightNum > 100) {
      return 'Dimensions cannot exceed 100 inches';
    }
    return '';
  };
  const [asnValid, setAsnValid] = useState(false);
  const [selectedCarton, setSelectedCarton] = useState(null);

  // Check ASN validity (this would typically come from your backend)
  useEffect(() => {
    // Simulate ASN check - in real app, this would check against your ASN system
    setAsnValid(true); // For demo purposes
  }, []);

  // Generate UCC-128 (SSCC-18) barcode
  const generateSSCC18 = () => {
    // SSCC-18 format: 00 + Company Prefix + Serial Reference + Check Digit
    // For demo, we'll generate a valid format
    const companyPrefix = '1234567'; // 7 digits
    const serialRef = Math.random().toString().substr(2, 8); // 8 digits
    const checkDigit = calculateCheckDigit('00' + companyPrefix + serialRef);
    return '00' + companyPrefix + serialRef + checkDigit;
  };

  // Calculate check digit for SSCC-18
  const calculateCheckDigit = (code) => {
    let sum = 0;
    for (let i = 0; i < code.length; i++) {
      const digit = parseInt(code[i]);
      sum += i % 2 === 0 ? digit * 3 : digit;
    }
    return ((10 - (sum % 10)) % 10).toString();
  };

  // Check if carton is conveyable based on dimensions
  const checkConveyability = (length, width, height, weight) => {
    const lengthNum = parseFloat(length) || 0;
    const widthNum = parseFloat(width) || 0;
    const heightNum = parseFloat(height) || 0;
    const weightNum = parseFloat(weight) || 0;

    // DSG conveyable limits
    const maxLength = 48; // inches
    const maxWidth = 30;
    const maxHeight = 30;
    const maxWeight = 50; // lbs
    const minWeight = 3; // lbs
    const minLength = 9; // inches
    const minWidth = 6; // inches
    const minHeight = 3; // inches

    const warnings = [];

    // Check dimensions
    if (lengthNum > maxLength || widthNum > maxWidth || heightNum > maxHeight) {
      warnings.push(
        `Exceeds conveyable dimensions (max: ${maxLength}"L × ${maxWidth}"W × ${maxHeight}"H)`
      );
    }
    if (lengthNum < minLength || widthNum < minWidth || heightNum < minHeight) {
      warnings.push(
        `Below minimum dimensions (min: ${minLength}"L × ${minWidth}"W × ${minHeight}"H)`
      );
    }

    // Check weight
    if (weightNum > maxWeight) {
      warnings.push(`Exceeds conveyable weight limit (max: ${maxWeight} lbs)`);
    }
    if (weightNum < minWeight && weightNum > 0) {
      warnings.push(`Below minimum weight (min: ${minWeight} lb)`);
    }

    return {
      isConveyable:
        lengthNum <= maxLength &&
        widthNum <= maxWidth &&
        heightNum <= maxHeight &&
        weightNum <= maxWeight &&
        lengthNum >= minLength &&
        widthNum >= minWidth &&
        heightNum >= minHeight,
      warnings,
    };
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (name.startsWith('dimensions.')) {
      const dimension = name.split('.')[1];
      setFormData((prev) => ({
        ...prev,
        dimensions: {
          ...prev.dimensions,
          [dimension]: value,
        },
      }));

      // Validate dimensions
      const newDimensions = {
        ...formData.dimensions,
        [dimension]: value,
      };
      const dimensionError = validateDimensions(
        newDimensions.length,
        newDimensions.width,
        newDimensions.height
      );
      setErrors((prev) => ({
        ...prev,
        [`dimensions.${dimension}`]: dimensionError,
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value,
      }));

      // Validate other fields
      let error = '';
      switch (name) {
        case 'cartonId':
          error = validateCartonId(value);
          break;
        case 'weight':
          error = validateNumeric(value, 'Weight', 0.1, 200);
          break;
        default:
          break;
      }

      setErrors((prev) => ({
        ...prev,
        [name]: error,
      }));
    }
  };

  const handleCreateCarton = () => {
    if (!asnValid) {
      setErrors({ asn: 'Valid 856 ASN is required to create cartons' });
      return;
    }

    if (!formData.cartonId) {
      setErrors({ cartonId: 'Carton ID is required' });
      return;
    }

    const conveyability = checkConveyability(
      formData.dimensions.length,
      formData.dimensions.width,
      formData.dimensions.height,
      formData.weight
    );

    const newCarton = {
      id: Date.now(),
      cartonId: formData.cartonId,
      sscc18: generateSSCC18(),
      dimensions: formData.dimensions,
      weight: formData.weight,
      isConveyable: conveyability.isConveyable,
      placementAttestation: formData.placementAttestation,
      status: 'created',
      createdAt: new Date().toISOString(),
      warnings: conveyability.warnings,
    };

    setCartons((prev) => [...prev, newCarton]);

    // Reset form
    setFormData({
      cartonId: '',
      dimensions: { length: '', width: '', height: '' },
      weight: '',
      isConveyable: true,
      placementAttestation: false,
    });
    setErrors({});
  };

  const handlePrintCarton = (cartonId) => {
    setCartons((prev) =>
      prev.map((carton) =>
        carton.id === cartonId
          ? {
              ...carton,
              status: 'printed',
              printedAt: new Date().toISOString(),
            }
          : carton
      )
    );
  };

  const handlePlaceCarton = (cartonId) => {
    setCartons((prev) =>
      prev.map((carton) =>
        carton.id === cartonId
          ? { ...carton, status: 'placed', placedAt: new Date().toISOString() }
          : carton
      )
    );
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'created':
        return 'bg-blue-100 text-blue-800';
      case 'printed':
        return 'bg-yellow-100 text-yellow-800';
      case 'placed':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Carton Management
        </h1>
        <p className="text-gray-600">
          Create, print, and place cartons with UCC-128/SSCC-18 compliance
        </p>
      </div>

      {/* ASN Status */}
      <div className="mb-6 p-4 rounded-lg border">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-gray-700">ASN Status:</span>
          <span
            className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
              asnValid
                ? 'bg-green-100 text-green-800'
                : 'bg-red-100 text-red-800'
            }`}
          >
            {asnValid ? '✓ Valid 856 ASN' : '✗ Invalid ASN'}
          </span>
        </div>
        <p className="text-xs text-gray-600 mt-1">
          UCC-128 (SSCC-18) labels require a valid 856 ASN to be generated
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Create Carton Form */}
        <div className="bg-white shadow-lg rounded-lg p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Create Carton
          </h2>

          <div className="space-y-4">
            <div>
              <label
                htmlFor="cartonId"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Carton ID *
              </label>
              <input
                type="text"
                id="cartonId"
                name="cartonId"
                value={formData.cartonId}
                onChange={handleInputChange}
                disabled={!asnValid}
                className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 ${
                  errors.cartonId ? 'border-red-500' : 'border-gray-300'
                } ${!asnValid ? 'bg-gray-100 cursor-not-allowed' : ''}`}
                placeholder="Enter carton ID"
              />
              {errors.cartonId && (
                <p className="mt-1 text-sm text-red-600">{errors.cartonId}</p>
              )}
            </div>

            {/* Dimensions */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Dimensions (inches) *
              </label>
              <div className="grid grid-cols-3 gap-2">
                <input
                  type="number"
                  name="dimensions.length"
                  value={formData.dimensions.length}
                  onChange={handleInputChange}
                  placeholder="Length"
                  className="px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                />
                <input
                  type="number"
                  name="dimensions.width"
                  value={formData.dimensions.width}
                  onChange={handleInputChange}
                  placeholder="Width"
                  className="px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                />
                <input
                  type="number"
                  name="dimensions.height"
                  value={formData.dimensions.height}
                  onChange={handleInputChange}
                  placeholder="Height"
                  className="px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="weight"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Weight (lbs)
              </label>
              <input
                type="number"
                id="weight"
                name="weight"
                value={formData.weight}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                placeholder="Enter weight"
              />
            </div>

            {/* Conveyability Check */}
            {formData.dimensions.length && (
              <div className="p-3 bg-gray-50 rounded-md">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-sm font-medium text-gray-700">
                    Conveyability:
                  </span>
                  <span
                    className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                      checkConveyability(
                        formData.dimensions.length,
                        formData.dimensions.width,
                        formData.dimensions.height,
                        formData.weight
                      ).isConveyable
                        ? 'bg-green-100 text-green-800'
                        : 'bg-orange-100 text-orange-800'
                    }`}
                  >
                    {checkConveyability(
                      formData.dimensions.length,
                      formData.dimensions.width,
                      formData.dimensions.height,
                      formData.weight
                    ).isConveyable
                      ? '✓ Conveyable'
                      : '⚠ Non-conveyable'}
                  </span>
                </div>
                <p className="text-xs text-gray-600 mb-2">
                  {checkConveyability(
                    formData.dimensions.length,
                    formData.dimensions.width,
                    formData.dimensions.height,
                    formData.weight
                  ).isConveyable
                    ? 'Placement: Right side, 2" from base and 2" from vertical edge (conveyable)'
                    : 'Placement: End of carton (parallel or perpendicular OK) - non-conveyable'}
                </p>

                {/* Show warnings if any */}
                {checkConveyability(
                  formData.dimensions.length,
                  formData.dimensions.width,
                  formData.dimensions.height,
                  formData.weight
                ).warnings.length > 0 && (
                  <div className="mt-2">
                    {checkConveyability(
                      formData.dimensions.length,
                      formData.dimensions.width,
                      formData.dimensions.height,
                      formData.weight
                    ).warnings.map((warning, index) => (
                      <p key={index} className="text-xs text-orange-600">
                        ⚠ {warning}
                      </p>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Sealing Specifications */}
            <div className="p-3 bg-blue-50 rounded-md">
              <h4 className="text-sm font-medium text-blue-900 mb-2">
                Sealing Requirements
              </h4>
              <div className="text-xs text-blue-800 space-y-1">
                <p>• No straps on conveyable cartons</p>
                <p>• Staples prohibited</p>
                <p>• Minimum 32 ECT up to 50 lb</p>
                <p>• Use proper sealing tape</p>
              </div>
            </div>

            {/* Placement Attestation */}
            <div className="flex items-center">
              <input
                type="checkbox"
                id="placementAttestation"
                name="placementAttestation"
                checked={formData.placementAttestation}
                onChange={handleInputChange}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label
                htmlFor="placementAttestation"
                className="ml-2 block text-sm text-gray-700"
              >
                I attest to proper label placement per DSG guidelines
              </label>
            </div>

            <button
              onClick={handleCreateCarton}
              disabled={
                !asnValid ||
                !formData.cartonId ||
                !formData.placementAttestation
              }
              className={`w-full px-4 py-2 rounded-md font-medium transition-colors ${
                !asnValid ||
                !formData.cartonId ||
                !formData.placementAttestation
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-blue-600 text-white hover:bg-blue-700'
              }`}
            >
              Create Carton with UCC-128
            </button>
          </div>
        </div>

        {/* Carton List */}
        <div className="bg-white shadow-lg rounded-lg p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Cartons</h2>

          {cartons.length === 0 ? (
            <p className="text-gray-600 text-center py-8">
              No cartons created yet
            </p>
          ) : (
            <div className="space-y-4">
              {cartons.map((carton) => (
                <div key={carton.id} className="border rounded-lg p-4">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="font-medium text-gray-900">
                        {carton.cartonId}
                      </h3>
                      <p className="text-sm text-gray-600">
                        SSCC-18: {carton.sscc18}
                      </p>
                    </div>
                    <span
                      className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(carton.status)}`}
                    >
                      {carton.status.charAt(0).toUpperCase() +
                        carton.status.slice(1)}
                    </span>
                  </div>

                  <div className="text-sm text-gray-600 mb-3">
                    <p>
                      Dimensions: {carton.dimensions.length}" ×{' '}
                      {carton.dimensions.width}" × {carton.dimensions.height}"
                    </p>
                    {carton.weight && <p>Weight: {carton.weight} lbs</p>}
                    <p>
                      Type:{' '}
                      {carton.isConveyable ? 'Conveyable' : 'Non-conveyable'}
                    </p>
                  </div>

                  <div className="flex gap-2">
                    {carton.status === 'created' && (
                      <button
                        onClick={() => handlePrintCarton(carton.id)}
                        className="px-3 py-1 text-sm bg-yellow-600 text-white rounded hover:bg-yellow-700 transition-colors"
                      >
                        Print Label
                      </button>
                    )}
                    {carton.status === 'printed' && (
                      <button
                        onClick={() => handlePlaceCarton(carton.id)}
                        className="px-3 py-1 text-sm bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
                      >
                        Mark Placed
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Print Specifications */}
      <div className="mt-8 bg-white shadow-lg rounded-lg p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          GS1 Print Specifications
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="font-medium text-gray-900 mb-2">
              Label Requirements
            </h3>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• 4×6 inch label size</li>
              <li>• Barcode height: ~1.25 inches</li>
              <li>• 2:1 ratio barcode</li>
              <li>• 0.25 inch quiet zones</li>
              <li>• ANSI A/B grade quality</li>
            </ul>
          </div>
          <div>
            <h3 className="font-medium text-gray-900 mb-2">
              Printer Requirements
            </h3>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Thermal printing only</li>
              <li>• Inkjet/laser not acceptable</li>
              <li>• High-resolution thermal printer</li>
              <li>• Proper label stock</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Placement Diagram */}
      <div className="mt-8 bg-white shadow-lg rounded-lg p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          Label Placement Guidelines
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="font-medium text-gray-900 mb-2">
              Conveyable Cartons (9-48&quot;L × 6-30&quot;W × 3-30&quot;H, 3-50
              lb)
            </h3>
            <div className="border-2 border-gray-300 p-4 rounded-lg bg-gray-50">
              <div className="flex justify-center">
                <img
                  src="/images/conveyable.png"
                  alt="Conveyable carton label placement diagram"
                  className="max-w-full h-auto"
                />
              </div>
            </div>
            <p className="text-sm text-gray-600 mt-2">
              Place on right side, 2" from base and 2" from vertical edge,
              upright barcode
            </p>
          </div>
          <div>
            <h3 className="font-medium text-gray-900 mb-2">
              Non-conveyable Cartons (Outside conveyable range)
            </h3>
            <div className="border-2 border-gray-300 p-4 rounded-lg bg-gray-50">
              <div className="flex justify-center">
                <img
                  src="/images/non-conveyable.png"
                  alt="Non-conveyable carton label placement diagram"
                  className="max-w-full h-auto"
                />
              </div>
            </div>
            <p className="text-sm text-gray-600 mt-2">
              Place label on the end of the carton, parallel or perpendicular
              orientation
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
