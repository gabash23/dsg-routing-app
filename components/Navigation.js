'use client';

import { useState } from 'react';

export default function Navigation({
  currentView,
  onViewChange,
  onRestartOnboarding,
}) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const views = [
    {
      id: 'shipment',
      name: 'Shipment Setup',
      shortName: 'Setup',
      description: 'PO/DC • Depart Time • TMS ID • Send ASN',
      icon: '📦',
    },
    {
      id: 'cartons',
      name: 'Cartons',
      shortName: 'Cartons',
      description: 'Create → Print → Place',
      icon: '📋',
    },
    {
      id: 'pallets',
      name: 'Pallets',
      shortName: 'Pallets',
      description: 'Assemble → QA',
      icon: '🏗️',
    },
    {
      id: 'paperwork',
      name: 'Paperwork',
      shortName: 'BOL',
      description: 'BOL First-Page + TMS placement',
      icon: '📄',
    },
    {
      id: 'handoff',
      name: 'Review & Handoff',
      shortName: 'Handoff',
      description: 'Stage chips • Seal • Photos',
      icon: '🚛',
    },
  ];

  const currentViewData = views.find((view) => view.id === currentView);

  return (
    <nav className="bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Mobile Navigation */}
        <div className="md:hidden">
          <div className="flex items-center justify-between py-3">
            <div className="flex items-center gap-2">
              <span className="text-lg">{currentViewData?.icon}</span>
              <div>
                <div className="font-semibold text-sm text-gray-900">
                  {currentViewData?.name}
                </div>
                <div className="text-xs text-gray-600">
                  {currentViewData?.description}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={onRestartOnboarding}
                className="p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                title="Restart Tutorial"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </button>
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              </button>
            </div>
          </div>

          {/* Mobile Menu Dropdown */}
          {isMenuOpen && (
            <div className="border-t border-gray-200 py-2">
              <div className="space-y-1">
                {views.map((view) => (
                  <button
                    key={view.id}
                    onClick={() => {
                      onViewChange(view.id);
                      setIsMenuOpen(false);
                    }}
                    className={`w-full flex items-center gap-3 px-3 py-2 text-left rounded-md transition-colors ${
                      currentView === view.id
                        ? 'bg-blue-50 text-blue-700'
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <span className="text-lg">{view.icon}</span>
                    <div>
                      <div className="font-medium text-sm">{view.name}</div>
                      <div className="text-xs text-gray-500">
                        {view.description}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Desktop Navigation */}
        <div className="hidden md:block">
          <div className="flex justify-between items-center">
            <div className="flex space-x-8">
              {views.map((view) => (
                <button
                  key={view.id}
                  onClick={() => onViewChange(view.id)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                    currentView === view.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <div className="text-left">
                    <div className="font-semibold">{view.name}</div>
                    <div className="text-xs text-gray-600">
                      {view.description}
                    </div>
                  </div>
                </button>
              ))}
            </div>
            <button
              onClick={onRestartOnboarding}
              className="p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100"
              title="Restart Tutorial"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
