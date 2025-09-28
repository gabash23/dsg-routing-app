'use client';

import { useState, useEffect } from 'react';

export default function Onboarding({
  isOpen,
  onClose,
  currentView,
  onViewChange,
}) {
  const [currentStep, setCurrentStep] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  const onboardingSteps = [
    {
      id: 'welcome',
      title: 'Welcome to DSG Routing App! 🚛',
      content:
        "This app helps you manage shipments according to DSG routing guidelines. Let's take a quick tour to get you started.",
      action: null,
      highlight: null,
    },
    {
      id: 'shipment-setup',
      title: 'Step 1: Shipment Setup 📦',
      content:
        "Start here to configure your shipment details. You'll need PO numbers, TMS ID, departure time, and destination. The app will help you send ASN notifications and check parcel eligibility.",
      action: () => onViewChange('shipment'),
      highlight: 'shipment',
      features: [
        'PO/DC configuration',
        'TMS ID management',
        'ASN timing & notifications',
        'Parcel eligibility checks',
      ],
    },
    {
      id: 'carton-management',
      title: 'Step 2: Carton Management 📋',
      content:
        'Create and manage cartons with UCC-128/SSCC-18 compliance. Generate labels, check conveyability, and ensure proper placement according to DSG guidelines.',
      action: () => onViewChange('cartons'),
      highlight: 'cartons',
      features: [
        'UCC-128 label generation',
        'Conveyability checking',
        'Label placement guidelines',
        'Print specifications',
      ],
    },
    {
      id: 'pallet-assembly',
      title: 'Step 3: Pallet Assembly 🏗️',
      content:
        'Build pallets from your cartons and perform QA checks. Ensure proper stacking, no overhang, and follow trailer loading guidelines.',
      action: () => onViewChange('pallets'),
      highlight: 'pallets',
      features: [
        'Carton selection & assembly',
        'QA checklist compliance',
        'Trailer loading guidance',
        'Weight distribution rules',
      ],
    },
    {
      id: 'paperwork',
      title: 'Step 4: Paperwork 📄',
      content:
        'Complete your BOL (Bill of Lading) with all required fields. The app ensures you have everything needed for DSG compliance.',
      action: () => onViewChange('paperwork'),
      highlight: 'paperwork',
      features: [
        'BOL first-page requirements',
        'TMS ID placement rules',
        'Completeness tracking',
        'Address validation',
      ],
    },
    {
      id: 'handoff',
      title: 'Step 5: Review & Handoff 🚛',
      content:
        'Final review before driver handoff. Verify seals, take photos, and ensure all documentation is complete.',
      action: () => onViewChange('handoff'),
      highlight: 'handoff',
      features: [
        'Final compliance check',
        'Seal verification',
        'Photo documentation',
        'Driver handoff process',
      ],
    },
    {
      id: 'complete',
      title: "You're All Set! 🎉",
      content:
        'You now know the basics of the DSG Routing App. Remember: each step builds on the previous one, and the app will guide you through compliance requirements.',
      action: null,
      highlight: null,
      tips: [
        'Always start with Shipment Setup',
        'Check conveyability before printing labels',
        'Complete QA checks before finalizing pallets',
        'Verify all BOL information before handoff',
      ],
    },
  ];

  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  }, [isOpen]);

  const handleNext = () => {
    if (currentStep < onboardingSteps.length - 1) {
      setCurrentStep(currentStep + 1);
      const nextStep = onboardingSteps[currentStep + 1];
      if (nextStep.action) {
        nextStep.action();
      }
    } else {
      // Complete onboarding
      // For testing: don't save to localStorage
      // TODO: Uncomment for production
      // localStorage.setItem('dsg-onboarding-completed', 'true');
      onClose();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
      const prevStep = onboardingSteps[currentStep - 1];
      if (prevStep.action) {
        prevStep.action();
      }
    }
  };

  const handleSkip = () => {
    // For testing: don't save to localStorage
    // TODO: Uncomment for production
    // localStorage.setItem('dsg-onboarding-completed', 'true');
    onClose();
  };

  if (!isVisible) return null;

  const currentStepData = onboardingSteps[currentStep];
  const isLastStep = currentStep === onboardingSteps.length - 1;
  const isFirstStep = currentStep === 0;

  return (
    <div className="fixed inset-0 z-[9999] overflow-y-auto">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black bg-opacity-50 transition-opacity" />

      {/* Modal */}
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          {/* Header */}
          <div className="bg-blue-600 text-white p-6 rounded-t-lg">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">{currentStepData.title}</h2>
              <button
                onClick={handleSkip}
                className="text-blue-200 hover:text-white text-sm underline"
              >
                Skip Tour
              </button>
            </div>
            <div className="mt-2">
              <div className="flex items-center gap-2">
                <span className="text-sm text-blue-200">
                  Step {currentStep + 1} of {onboardingSteps.length}
                </span>
                <div className="flex-1 bg-blue-500 rounded-full h-2">
                  <div
                    className="bg-white h-2 rounded-full transition-all duration-300"
                    style={{
                      width: `${((currentStep + 1) / onboardingSteps.length) * 100}%`,
                    }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-6">
            <p className="text-gray-700 text-lg leading-relaxed mb-6">
              {currentStepData.content}
            </p>

            {/* Features or Tips */}
            {(currentStepData.features || currentStepData.tips) && (
              <div className="mb-6">
                <h3 className="font-semibold text-gray-900 mb-3">
                  {currentStepData.features ? 'Key Features:' : 'Pro Tips:'}
                </h3>
                <ul className="space-y-2">
                  {(currentStepData.features || currentStepData.tips).map(
                    (item, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <span className="text-blue-600 mt-1">•</span>
                        <span className="text-gray-700">{item}</span>
                      </li>
                    )
                  )}
                </ul>
              </div>
            )}

            {/* Visual Guide */}
            {currentStepData.highlight && (
              <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-blue-600">💡</span>
                  <span className="font-medium text-blue-900">Try it now!</span>
                </div>
                <p className="text-blue-800 text-sm">
                  The {currentStepData.highlight} section is now highlighted.
                  {currentStepData.highlight === 'shipment' &&
                    ' Start by entering your PO number and TMS ID.'}
                  {currentStepData.highlight === 'cartons' &&
                    ' Create your first carton and see the conveyability check in action.'}
                  {currentStepData.highlight === 'pallets' &&
                    ' Add cartons to build your first pallet and run QA checks.'}
                  {currentStepData.highlight === 'paperwork' &&
                    ' Fill out the BOL form and watch the completeness meter.'}
                  {currentStepData.highlight === 'handoff' &&
                    ' Review everything and prepare for driver handoff.'}
                </p>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="bg-gray-50 px-6 py-4 rounded-b-lg flex justify-between items-center">
            <button
              onClick={handlePrevious}
              disabled={isFirstStep}
              className={`px-4 py-2 rounded-md font-medium transition-colors ${
                isFirstStep
                  ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  : 'bg-gray-300 text-gray-700 hover:bg-gray-400'
              }`}
            >
              Previous
            </button>

            <div className="flex gap-2">
              {!isLastStep && (
                <button
                  onClick={handleSkip}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800 font-medium"
                >
                  Skip Tour
                </button>
              )}
              <button
                onClick={handleNext}
                className="px-6 py-2 bg-blue-600 text-white rounded-md font-medium hover:bg-blue-700 transition-colors"
              >
                {isLastStep ? 'Get Started!' : 'Next'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
