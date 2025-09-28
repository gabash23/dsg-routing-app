'use client';

import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import ShipmentSetup from '../components/ShipmentSetup';
import CartonManagement from '../components/CartonManagement';
import PalletManagement from '../components/PalletManagement';
import PaperworkManagement from '../components/PaperworkManagement';
import ReviewHandoff from '../components/ReviewHandoff';
import Navigation from '../components/Navigation';
import PWAInstallPrompt from '../components/PWAInstallPrompt';

export default function Home() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [currentView, setCurrentView] = useState('shipment');
  const [onboardingLoaded, setOnboardingLoaded] = useState(false);

  const views = [
    { id: 'shipment', name: 'Shipment Setup' },
    { id: 'cartons', name: 'Carton Management' },
    { id: 'pallets', name: 'Pallet Assembly' },
    { id: 'paperwork', name: 'Paperwork' },
    { id: 'handoff', name: 'Review & Handoff' },
  ];

  const currentIndex = views.findIndex((view) => view.id === currentView);
  const canGoPrevious = currentIndex > 0;
  const canGoNext = currentIndex < views.length - 1;

  const handlePrevious = () => {
    if (canGoPrevious) {
      setCurrentView(views[currentIndex - 1].id);
    }
  };

  const handleNext = () => {
    if (canGoNext) {
      setCurrentView(views[currentIndex + 1].id);
    }
  };

  // Redirect to onboarding when user is authenticated (first time only)
  useEffect(() => {
    if (status === 'authenticated' && session && !onboardingLoaded) {
      const hasCompletedOnboarding = localStorage.getItem(
        'dsg-onboarding-completed'
      );
      if (!hasCompletedOnboarding) {
        router.push('/onboarding');
      }
      setOnboardingLoaded(true);
    }
  }, [status, session, onboardingLoaded, router]);

  const resetOnboarding = () => {
    // Clear the completion flag to allow onboarding to show again
    localStorage.removeItem('dsg-onboarding-completed');
    router.push('/onboarding');
  };

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin');
    }
  }, [status, router]);

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading DSG Routing App...</p>
        </div>
      </div>
    );
  }

  if (!session) {
    return null;
  }
  return (
    <div className="min-h-screen bg-gray-100">
      {/* User Profile Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-3 md:py-4">
            <div className="flex items-center gap-3">
              <img
                src="/favicon.ico"
                alt="DSG Routing App"
                className="w-8 h-8"
              />
              <div>
                <h1 className="text-lg md:text-2xl font-bold text-gray-900">
                  DSG Routing App
                </h1>
                <p className="text-xs md:text-sm text-gray-700">
                  Shipment Management System
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 md:gap-4">
              <div className="hidden sm:flex items-center gap-2">
                {session.user?.image && (
                  <img
                    src={session.user.image}
                    alt={session.user.name}
                    className="w-6 h-6 md:w-8 md:h-8 rounded-full"
                  />
                )}
                <span className="text-xs md:text-sm text-gray-700">
                  Welcome, {session.user?.name}
                </span>
              </div>
              <button
                onClick={() => signOut({ callbackUrl: '/auth/signin' })}
                className="px-2 py-1 md:px-3 text-xs md:text-sm bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <Navigation
        currentView={currentView}
        onViewChange={setCurrentView}
        onRestartOnboarding={resetOnboarding}
      />

      {/* Main Content */}
      <main className="py-4 md:py-8 pb-20 md:pb-8">
        {currentView === 'shipment' && <ShipmentSetup />}
        {currentView === 'cartons' && <CartonManagement />}
        {currentView === 'pallets' && <PalletManagement />}
        {currentView === 'paperwork' && <PaperworkManagement />}
        {currentView === 'handoff' && <ReviewHandoff />}
      </main>

      {/* Mobile Navigation Buttons */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4">
        <div className="flex justify-between items-center max-w-7xl mx-auto">
          <button
            onClick={handlePrevious}
            disabled={!canGoPrevious}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
              canGoPrevious
                ? 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                : 'bg-gray-50 text-gray-400 cursor-not-allowed'
            }`}
          >
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
                d="M15 19l-7-7 7-7"
              />
            </svg>
            Previous
          </button>

          <div className="text-center">
            <div className="text-sm font-medium text-gray-900">
              {views[currentIndex]?.name}
            </div>
            <div className="text-xs text-gray-500">
              {currentIndex + 1} of {views.length}
            </div>
          </div>

          <button
            onClick={handleNext}
            disabled={!canGoNext}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
              canGoNext
                ? 'bg-blue-600 text-white hover:bg-blue-700'
                : 'bg-gray-50 text-gray-400 cursor-not-allowed'
            }`}
          >
            Next
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
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button>
        </div>
      </div>

      {/* PWA Install Prompt */}
      <PWAInstallPrompt />
    </div>
  );
}
