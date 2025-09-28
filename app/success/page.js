'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function SuccessPage() {
  const router = useRouter();
  const [handoffData, setHandoffData] = useState(null);

  useEffect(() => {
    // Get handoff data from sessionStorage or localStorage
    const storedData = sessionStorage.getItem('handoffData');
    if (storedData) {
      setHandoffData(JSON.parse(storedData));
    }
  }, []);

  const handleNewShipment = () => {
    // Clear any stored data and redirect to home
    sessionStorage.removeItem('handoffData');
    router.push('/');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        {/* Success Card */}
        <div className="bg-white rounded-2xl shadow-2xl p-8 text-center">
          {/* Success Icon */}
          <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg
              className="w-12 h-12 text-green-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>

          {/* Success Message */}
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Handoff Complete! 🎉
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Your shipment has been successfully handed off to the driver and is
            ready for transport.
          </p>

          {/* Handoff Summary */}
          {handoffData && (
            <div className="bg-gray-50 rounded-lg p-6 mb-8 text-left">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Handoff Summary
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-medium text-gray-700">Driver:</span>
                  <span className="ml-2 text-gray-900">
                    {handoffData.driverInfo?.name || 'N/A'}
                  </span>
                </div>
                <div>
                  <span className="font-medium text-gray-700">Company:</span>
                  <span className="ml-2 text-gray-900">
                    {handoffData.driverInfo?.company || 'N/A'}
                  </span>
                </div>
                <div>
                  <span className="font-medium text-gray-700">TMS ID:</span>
                  <span className="ml-2 text-gray-900">
                    {handoffData.tmsVerification?.tmsId || 'N/A'}
                  </span>
                </div>
                <div>
                  <span className="font-medium text-gray-700">
                    Seal Number:
                  </span>
                  <span className="ml-2 text-gray-900">
                    {handoffData.sealVerification?.sealNumber || 'N/A'}
                  </span>
                </div>
              </div>
              {handoffData.handoffNotes && (
                <div className="mt-4">
                  <span className="font-medium text-gray-700">Notes:</span>
                  <p className="mt-1 text-gray-900 text-sm">
                    {handoffData.handoffNotes}
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex justify-center">
            <button
              onClick={handleNewShipment}
              className="px-8 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors shadow-lg"
            >
              Start New Shipment
            </button>
          </div>

          {/* Additional Info */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <p className="text-sm text-gray-500">
              All documentation has been completed according to DSG routing
              guidelines. The shipment is now in transit.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-8">
          <p className="text-sm text-gray-500">
            DSG Routing App - Shipment Management System
          </p>
        </div>
      </div>
    </div>
  );
}
