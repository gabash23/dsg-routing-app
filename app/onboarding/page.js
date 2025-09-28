'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import OnboardingWelcome from '../../components/onboarding/OnboardingWelcome';
import OnboardingStep1 from '../../components/onboarding/OnboardingStep1';
import OnboardingStep2 from '../../components/onboarding/OnboardingStep2';
import OnboardingStep3 from '../../components/onboarding/OnboardingStep3';
import OnboardingStep4 from '../../components/onboarding/OnboardingStep4';
import OnboardingStep5 from '../../components/onboarding/OnboardingStep5';
import OnboardingComplete from '../../components/onboarding/OnboardingComplete';

export default function OnboardingPage() {
  const [currentStep, setCurrentStep] = useState(0);
  const router = useRouter();

  const steps = [
    { component: OnboardingWelcome, title: 'Welcome' },
    { component: OnboardingStep1, title: 'Shipment Setup' },
    { component: OnboardingStep2, title: 'Carton Management' },
    { component: OnboardingStep3, title: 'Pallet Assembly' },
    { component: OnboardingStep4, title: 'Paperwork' },
    { component: OnboardingStep5, title: 'Review & Handoff' },
    { component: OnboardingComplete, title: 'Complete' },
  ];

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      // Complete onboarding
      localStorage.setItem('dsg-onboarding-completed', 'true');
      router.push('/');
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSkip = () => {
    localStorage.setItem('dsg-onboarding-completed', 'true');
    router.push('/');
  };

  const CurrentComponent = steps[currentStep].component;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <img
                src="/favicon.ico"
                alt="DSG Routing App"
                className="w-8 h-8"
              />
              <h1 className="text-xl font-semibold text-gray-900">
                DSG Routing App
              </h1>
            </div>
            <button
              onClick={handleSkip}
              className="text-gray-500 hover:text-gray-700 text-sm font-medium"
            >
              Skip Tour
            </button>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="bg-white border-b">
        <div className="max-w-4xl mx-auto px-6 py-3">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">
              Step {currentStep + 1} of {steps.length}
            </span>
            <span className="text-sm text-gray-500">
              {Math.round(((currentStep + 1) / steps.length) * 100)}% Complete
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all duration-500 ease-out"
              style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
            />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1">
        <CurrentComponent
          onNext={handleNext}
          onPrevious={handlePrevious}
          onSkip={handleSkip}
          currentStep={currentStep}
          totalSteps={steps.length}
        />
      </div>
    </div>
  );
}
