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

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin');
    }
  }, [status, router]);

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
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
          <div className="flex justify-between items-center py-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                DSG Routing App
              </h1>
              <p className="text-sm text-gray-700">
                Shipment Management System
              </p>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                {session.user?.image && (
                  <img
                    src={session.user.image}
                    alt={session.user.name}
                    className="w-8 h-8 rounded-full"
                  />
                )}
                <span className="text-sm text-gray-700">
                  Welcome, {session.user?.name}
                </span>
              </div>
              <button
                onClick={() => signOut({ callbackUrl: '/auth/signin' })}
                className="px-3 py-1 text-sm bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <Navigation currentView={currentView} onViewChange={setCurrentView} />

      {/* Main Content */}
      <main className="py-8">
        {currentView === 'shipment' && <ShipmentSetup />}
        {currentView === 'cartons' && <CartonManagement />}
        {currentView === 'pallets' && <PalletManagement />}
        {currentView === 'paperwork' && <PaperworkManagement />}
        {currentView === 'handoff' && <ReviewHandoff />}
      </main>

      {/* PWA Install Prompt */}
      <PWAInstallPrompt />
    </div>
  );
}
