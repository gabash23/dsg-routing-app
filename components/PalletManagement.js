'use client';

import { useState, useEffect } from 'react';

export default function PalletManagement() {
  const [pallets, setPallets] = useState([]);
  const [availableCartons, setAvailableCartons] = useState([
    {
      id: 1,
      cartonId: 'C001',
      weight: 25,
      dimensions: { length: 24, width: 18, height: 12 },
      status: 'placed',
    },
    {
      id: 2,
      cartonId: 'C002',
      weight: 30,
      dimensions: { length: 20, width: 16, height: 14 },
      status: 'placed',
    },
    {
      id: 3,
      cartonId: 'C003',
      weight: 35,
      dimensions: { length: 22, width: 20, height: 10 },
      status: 'placed',
    },
    {
      id: 4,
      cartonId: 'C004',
      weight: 28,
      dimensions: { length: 26, width: 18, height: 8 },
      status: 'placed',
    },
    {
      id: 5,
      cartonId: 'C005',
      weight: 45,
      dimensions: { length: 30, width: 24, height: 16 },
      status: 'placed',
    },
  ]);
  const [currentPallet, setCurrentPallet] = useState({
    id: null,
    cartons: [],
    qaChecks: {
      overhangCheck: false,
      brickLayerCheck: false,
      shrinkWrapCheck: false,
      labelsFacingOut: false,
      dcPlacardOutside: false,
    },
    trailerGuidance: {
      heavyOnBottom: false,
      noColumnStacking: false,
      weightLimitCheck: false,
    },
    status: 'assembling', // assembling, qa_pending, qa_passed, qa_failed
  });
  const [showTrailerGuidance, setShowTrailerGuidance] = useState(false);

  const handleAddCartonToPallet = (carton) => {
    setCurrentPallet((prev) => ({
      ...prev,
      cartons: [...prev.cartons, carton],
    }));
  };

  const handleRemoveCartonFromPallet = (cartonId) => {
    setCurrentPallet((prev) => ({
      ...prev,
      cartons: prev.cartons.filter((c) => c.id !== cartonId),
    }));
  };

  const handleQACheckChange = (checkName, value) => {
    setCurrentPallet((prev) => ({
      ...prev,
      qaChecks: {
        ...prev.qaChecks,
        [checkName]: value,
      },
    }));
  };

  const handleTrailerGuidanceChange = (checkName, value) => {
    setCurrentPallet((prev) => ({
      ...prev,
      trailerGuidance: {
        ...prev.trailerGuidance,
        [checkName]: value,
      },
    }));
  };

  const calculatePalletStats = () => {
    const totalWeight = currentPallet.cartons.reduce(
      (sum, carton) => sum + carton.weight,
      0
    );
    const maxHeight = Math.max(
      ...currentPallet.cartons.map((c) => c.dimensions.height),
      0
    );
    const hasHeavyCartons = currentPallet.cartons.some((c) => c.weight > 50);

    return {
      totalWeight,
      maxHeight,
      hasHeavyCartons,
      cartonCount: currentPallet.cartons.length,
    };
  };

  const checkOverhang = () => {
    // Simulate overhang check - in real app, this would use actual measurements
    return currentPallet.cartons.every((carton) => {
      // Check if any carton extends more than 1" beyond pallet edge
      return carton.dimensions.length <= 48 && carton.dimensions.width <= 40; // Standard pallet size
    });
  };

  const checkBrickLayer = () => {
    // Check if cartons are arranged in brick-layer pattern (no column stacking)
    // This is a simplified check - in real app, you'd have more sophisticated logic
    return currentPallet.cartons.length > 0;
  };

  const handleAssemblePallet = () => {
    if (currentPallet.cartons.length === 0) {
      alert('Please add at least one carton to the pallet');
      return;
    }

    const newPallet = {
      id: Date.now(),
      cartons: [...currentPallet.cartons],
      qaChecks: { ...currentPallet.qaChecks },
      trailerGuidance: { ...currentPallet.trailerGuidance },
      status: 'qa_pending',
      assembledAt: new Date().toISOString(),
      stats: calculatePalletStats(),
    };

    setPallets((prev) => [...prev, newPallet]);

    // Reset current pallet
    setCurrentPallet({
      id: null,
      cartons: [],
      qaChecks: {
        overhangCheck: false,
        brickLayerCheck: false,
        shrinkWrapCheck: false,
        labelsFacingOut: false,
        dcPlacardOutside: false,
      },
      trailerGuidance: {
        heavyOnBottom: false,
        noColumnStacking: false,
        weightLimitCheck: false,
      },
      status: 'assembling',
    });
  };

  const handleQAComplete = (palletId, passed) => {
    setPallets((prev) =>
      prev.map((pallet) =>
        pallet.id === palletId
          ? {
              ...pallet,
              status: passed ? 'qa_passed' : 'qa_failed',
              qaCompletedAt: new Date().toISOString(),
            }
          : pallet
      )
    );
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'assembling':
        return 'bg-blue-100 text-blue-800';
      case 'qa_pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'qa_passed':
        return 'bg-green-100 text-green-800';
      case 'qa_failed':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const palletStats = calculatePalletStats();
  const allQAChecksPassed = Object.values(currentPallet.qaChecks).every(
    (check) => check
  );
  const allTrailerGuidancePassed = Object.values(
    currentPallet.trailerGuidance
  ).every((check) => check);

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Pallet Management
        </h1>
        <p className="text-gray-600">
          Assemble pallets and perform QA checks per DSG routing guidelines
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Available Cartons */}
        <div className="bg-white shadow-lg rounded-lg p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Available Cartons
          </h2>
          <div className="space-y-3">
            {availableCartons
              .filter((c) => c.status === 'placed')
              .map((carton) => (
                <div key={carton.id} className="border rounded-lg p-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-medium text-gray-900">
                        {carton.cartonId}
                      </h3>
                      <p className="text-sm text-gray-700">
                        {carton.dimensions.length}" × {carton.dimensions.width}"
                        × {carton.dimensions.height}"
                      </p>
                      <p className="text-sm text-gray-700">
                        Weight: {carton.weight} lbs
                      </p>
                    </div>
                    <button
                      onClick={() => handleAddCartonToPallet(carton)}
                      className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                    >
                      Add
                    </button>
                  </div>
                </div>
              ))}
          </div>
        </div>

        {/* Current Pallet Assembly */}
        <div className="bg-white shadow-lg rounded-lg p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Current Pallet
          </h2>

          {/* Pallet Stats */}
          <div className="mb-4 p-3 bg-gray-50 rounded-lg">
            <h3 className="font-medium text-gray-900 mb-2">
              Pallet Statistics
            </h3>
            <div className="grid grid-cols-2 gap-2 text-sm text-gray-900">
              <div>Cartons: {palletStats.cartonCount}</div>
              <div>Total Weight: {palletStats.totalWeight} lbs</div>
              <div>Max Height: {palletStats.maxHeight}"</div>
              <div>
                Heavy Cartons: {palletStats.hasHeavyCartons ? 'Yes' : 'No'}
              </div>
            </div>
          </div>

          {/* Selected Cartons */}
          <div className="mb-4">
            <h3 className="font-medium text-gray-900 mb-2">Selected Cartons</h3>
            {currentPallet.cartons.length === 0 ? (
              <p className="text-gray-700 text-sm">No cartons selected</p>
            ) : (
              <div className="space-y-2">
                {currentPallet.cartons.map((carton) => (
                  <div
                    key={carton.id}
                    className="flex justify-between items-center p-2 bg-gray-50 rounded"
                  >
                    <span className="text-sm text-gray-900">
                      {carton.cartonId} ({carton.weight} lbs)
                    </span>
                    <button
                      onClick={() => handleRemoveCartonFromPallet(carton.id)}
                      className="text-red-600 hover:text-red-800 text-sm"
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <button
            onClick={handleAssemblePallet}
            disabled={currentPallet.cartons.length === 0}
            className={`w-full px-4 py-2 rounded-md font-medium transition-colors ${
              currentPallet.cartons.length === 0
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-green-600 text-white hover:bg-green-700'
            }`}
          >
            Assemble Pallet
          </button>
        </div>

        {/* QA Checks */}
        <div className="bg-white shadow-lg rounded-lg p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            QA Checklist
          </h2>

          <div className="space-y-4">
            <div className="flex items-center">
              <input
                type="checkbox"
                id="overhangCheck"
                checked={currentPallet.qaChecks.overhangCheck}
                onChange={(e) =>
                  handleQACheckChange('overhangCheck', e.target.checked)
                }
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label
                htmlFor="overhangCheck"
                className="ml-2 block text-sm text-gray-700"
              >
                No overhang &gt; 1&quot;
              </label>
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="brickLayerCheck"
                checked={currentPallet.qaChecks.brickLayerCheck}
                onChange={(e) =>
                  handleQACheckChange('brickLayerCheck', e.target.checked)
                }
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label
                htmlFor="brickLayerCheck"
                className="ml-2 block text-sm text-gray-700"
              >
                Brick-layer pattern (no column)
              </label>
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="shrinkWrapCheck"
                checked={currentPallet.qaChecks.shrinkWrapCheck}
                onChange={(e) =>
                  handleQACheckChange('shrinkWrapCheck', e.target.checked)
                }
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label
                htmlFor="shrinkWrapCheck"
                className="ml-2 block text-sm text-gray-700"
              >
                Shrink-wrap sufficient
              </label>
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="labelsFacingOut"
                checked={currentPallet.qaChecks.labelsFacingOut}
                onChange={(e) =>
                  handleQACheckChange('labelsFacingOut', e.target.checked)
                }
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label
                htmlFor="labelsFacingOut"
                className="ml-2 block text-sm text-gray-700"
              >
                Labels facing out when possible
              </label>
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="dcPlacardOutside"
                checked={currentPallet.qaChecks.dcPlacardOutside}
                onChange={(e) =>
                  handleQACheckChange('dcPlacardOutside', e.target.checked)
                }
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label
                htmlFor="dcPlacardOutside"
                className="ml-2 block text-sm text-gray-700"
              >
                DC placard outside the wrap
              </label>
            </div>
          </div>

          {/* QA Status */}
          <div className="mt-4 p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-gray-700">
                QA Status:
              </span>
              <span
                className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                  allQAChecksPassed
                    ? 'bg-green-100 text-green-800'
                    : 'bg-yellow-100 text-yellow-800'
                }`}
              >
                {allQAChecksPassed
                  ? '✓ All Checks Passed'
                  : '⏱ Pending Checks'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Trailer Guidance */}
      <div className="mt-8 bg-white shadow-lg rounded-lg p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-900">
            Trailer Loading Guidance
          </h2>
          <button
            onClick={() => setShowTrailerGuidance(!showTrailerGuidance)}
            className="px-4 py-2 text-sm bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors"
          >
            {showTrailerGuidance ? 'Hide' : 'Show'} Guidance
          </button>
        </div>

        {showTrailerGuidance && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-3">
              <h3 className="font-medium text-gray-900">Loading Principles</h3>
              <div className="space-y-2">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="heavyOnBottom"
                    checked={currentPallet.trailerGuidance.heavyOnBottom}
                    onChange={(e) =>
                      handleTrailerGuidanceChange(
                        'heavyOnBottom',
                        e.target.checked
                      )
                    }
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label
                    htmlFor="heavyOnBottom"
                    className="ml-2 block text-sm text-gray-700"
                  >
                    Heavy items on bottom
                  </label>
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="noColumnStacking"
                    checked={currentPallet.trailerGuidance.noColumnStacking}
                    onChange={(e) =>
                      handleTrailerGuidanceChange(
                        'noColumnStacking',
                        e.target.checked
                      )
                    }
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label
                    htmlFor="noColumnStacking"
                    className="ml-2 block text-sm text-gray-700"
                  >
                    Brick-layer pattern
                  </label>
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="weightLimitCheck"
                    checked={currentPallet.trailerGuidance.weightLimitCheck}
                    onChange={(e) =>
                      handleTrailerGuidanceChange(
                        'weightLimitCheck',
                        e.target.checked
                      )
                    }
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label
                    htmlFor="weightLimitCheck"
                    className="ml-2 block text-sm text-gray-700"
                  >
                    &gt;50 lb not above 5 ft
                  </label>
                </div>
              </div>
            </div>

            <div>
              <h3 className="font-medium text-gray-900 mb-2">Visual Guide</h3>
              <div className="border-2 border-gray-300 p-4 rounded-lg bg-gray-50">
                <div className="relative w-full mx-auto">
                  <img
                    src="/images/trailer-loading.png"
                    alt="Trailer Loading Requirements - Weight distribution, height restrictions, carton orientation, and load restraints"
                    className="w-full h-auto rounded-lg shadow-sm"
                  />
                </div>
              </div>
            </div>

            <div>
              <h3 className="font-medium text-gray-900 mb-2">
                Guidance Status
              </h3>
              <div className="p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-sm font-medium text-gray-700">
                    Compliance:
                  </span>
                  <span
                    className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                      allTrailerGuidancePassed
                        ? 'bg-green-100 text-green-800'
                        : 'bg-yellow-100 text-yellow-800'
                    }`}
                  >
                    {allTrailerGuidancePassed
                      ? '✓ Compliant'
                      : '⚠ Review Needed'}
                  </span>
                </div>
                <p className="text-xs text-gray-700">
                  Follow DSG routing guidelines for safe and efficient trailer
                  loading
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Assembled Pallets */}
      <div className="mt-8 bg-white shadow-lg rounded-lg p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          Assembled Pallets
        </h2>

        {pallets.length === 0 ? (
          <p className="text-gray-700 text-center py-8">
            No pallets assembled yet
          </p>
        ) : (
          <div className="space-y-4">
            {pallets.map((pallet) => (
              <div key={pallet.id} className="border rounded-lg p-4">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="font-medium text-gray-900">
                      Pallet #{pallet.id}
                    </h3>
                    <p className="text-sm text-gray-700">
                      {pallet.cartons.length} cartons •{' '}
                      {pallet.stats.totalWeight} lbs • {pallet.stats.maxHeight}"
                      height
                    </p>
                    <p className="text-xs text-gray-700">
                      Assembled: {new Date(pallet.assembledAt).toLocaleString()}
                    </p>
                  </div>
                  <span
                    className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(pallet.status)}`}
                  >
                    {pallet.status.replace('_', ' ').toUpperCase()}
                  </span>
                </div>

                <div className="flex gap-2">
                  {pallet.status === 'qa_pending' && (
                    <>
                      <button
                        onClick={() => handleQAComplete(pallet.id, true)}
                        className="px-3 py-1 text-sm bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
                      >
                        QA Pass
                      </button>
                      <button
                        onClick={() => handleQAComplete(pallet.id, false)}
                        className="px-3 py-1 text-sm bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
                      >
                        QA Fail
                      </button>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
