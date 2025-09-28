'use client';

export default function OnboardingStep3({ onNext, onPrevious }) {
  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      <div className="grid lg:grid-cols-2 gap-12 items-center">
        {/* Left Side - Content */}
        <div>
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold">3</span>
              </div>
              <h1 className="text-3xl font-bold text-gray-900">
                Pallet Assembly
              </h1>
            </div>
            <p className="text-lg text-gray-600 leading-relaxed">
              Build pallets from your cartons and perform comprehensive QA
              checks. Ensure proper stacking, no overhang, and follow trailer
              loading guidelines for safe transport.
            </p>
          </div>

          <div className="space-y-6">
            <div className="flex items-start gap-4">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                <svg
                  className="w-4 h-4 text-green-600"
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
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">
                  Carton Selection & Assembly
                </h3>
                <p className="text-gray-600">
                  Drag and drop cartons to build pallets with weight
                  distribution tracking
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                <svg
                  className="w-4 h-4 text-green-600"
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
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">
                  QA Checklist Compliance
                </h3>
                <p className="text-gray-600">
                  No overhang &gt;1&quot;, brick-layer stacking, proper
                  shrink-wrap, labels facing out
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                <svg
                  className="w-4 h-4 text-green-600"
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
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">
                  Trailer Loading Guidance
                </h3>
                <p className="text-gray-600">
                  Heavy on bottom, brick-layer pattern, &gt;50 lb not above 5 ft
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                <svg
                  className="w-4 h-4 text-green-600"
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
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">
                  DC Placard Placement
                </h3>
                <p className="text-gray-600">
                  Automatic placement outside shrink-wrap for easy
                  identification
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Visual */}
        <div className="bg-white rounded-xl shadow-sm p-8">
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-8 h-8 text-blue-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Pallet Builder
            </h3>
            <p className="text-gray-600">Interactive pallet assembly</p>
          </div>

          <div className="space-y-4">
            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="font-medium text-gray-900 mb-2">
                Available Cartons
              </h4>
              <div className="space-y-2">
                <div className="flex justify-between items-center bg-white p-2 rounded border">
                  <span className="text-sm text-gray-900">C001 (25 lbs)</span>
                  <button className="text-blue-600 text-sm" disabled>
                    Add
                  </button>
                </div>
                <div className="flex justify-between items-center bg-white p-2 rounded border">
                  <span className="text-sm text-gray-900">C002 (30 lbs)</span>
                  <button className="text-blue-600 text-sm" disabled>
                    Add
                  </button>
                </div>
                <div className="flex justify-between items-center bg-white p-2 rounded border">
                  <span className="text-sm text-gray-900">C003 (20 lbs)</span>
                  <button className="text-blue-600 text-sm" disabled>
                    Add
                  </button>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="font-medium text-gray-900 mb-2">Current Pallet</h4>
              <div className="text-center py-4">
                <div className="w-24 h-24 mx-auto mb-2 flex items-center justify-center">
                  <img
                    src="/images/pallet.png"
                    alt="Pallet"
                    className="w-24 h-24 object-contain"
                  />
                </div>
                <p className="text-sm text-gray-900">0 cartons • 0 lbs</p>
              </div>
            </div>

            <div className="pt-2">
              <div className="flex items-center gap-2 text-sm text-green-600">
                <svg
                  className="w-4 h-4"
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
                <span>QA checks will validate compliance</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-between mt-12">
        <button
          onClick={onPrevious}
          className="px-6 py-3 text-gray-600 hover:text-gray-800 font-medium transition-colors"
        >
          ← Previous
        </button>
        <button
          onClick={onNext}
          className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
        >
          Next: Paperwork →
        </button>
      </div>
    </div>
  );
}
