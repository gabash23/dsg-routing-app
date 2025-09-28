'use client';

export default function Navigation({ currentView, onViewChange }) {
  const views = [
    {
      id: 'shipment',
      name: 'Shipment Setup',
      description: 'PO/DC • Depart Time • TMS ID • Send ASN',
    },
    { id: 'cartons', name: 'Cartons', description: 'Create → Print → Place' },
    { id: 'pallets', name: 'Pallets', description: 'Assemble → QA' },
    {
      id: 'paperwork',
      name: 'Paperwork',
      description: 'BOL First-Page + TMS placement',
    },
    {
      id: 'handoff',
      name: 'Review & Handoff',
      description: 'Stage chips • Seal • Photos',
    },
  ];

  return (
    <nav className="bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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
                <div className="text-xs text-gray-400">{view.description}</div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </nav>
  );
}
