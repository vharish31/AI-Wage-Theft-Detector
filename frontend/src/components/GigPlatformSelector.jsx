import React from 'react';
import { SUPPORTED_PLATFORMS } from '../utils/gigDetector';
import { CheckCircle2, Truck, Package, Bike, Car, ShoppingBag, PlusCircle, Building } from 'lucide-react';

export default function GigPlatformSelector({ selectedPlatform, setSelectedPlatform, customPlatform, setCustomPlatform }) {

  const getPlatformIcon = (id) => {
    switch (id) {
      case 'swiggy':
      case 'zomato':
      case 'zepto':
        return <ShoppingBag className="w-5 h-5" />;
      case 'blinkit':
      case 'dunzo':
        return <Package className="w-5 h-5" />;
      case 'uber':
      case 'ola':
      case 'rapido':
        return <Car className="w-5 h-5" />;
      case 'amazon flex':
      case 'ekart':
      case 'shadowfax':
        return <Truck className="w-5 h-5" />;
      case 'porter':
        return <Bike className="w-5 h-5" />;
      default:
        return <Building className="w-5 h-5" />;
    }
  };

  return (
    <div className="space-y-4 bg-slate-900/60 p-5 rounded-2xl border border-slate-800 backdrop-blur-md">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-cyan-400" />
            Select Gig Platform
          </h3>
          <p className="text-xs text-slate-400">Choose your delivery, logistics, or ride-hailing app</p>
        </div>
        <span className="text-[10px] uppercase font-bold tracking-wider px-2.5 py-1 rounded-full bg-cyan-950 text-cyan-400 border border-cyan-800">
          Per-Task Mode
        </span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5">
        {SUPPORTED_PLATFORMS.map((plat) => {
          const isSelected = selectedPlatform === plat.name;
          return (
            <button
              key={plat.id}
              type="button"
              onClick={() => setSelectedPlatform(plat.name)}
              className={`p-3 rounded-xl border text-left flex items-center gap-3 transition-all cursor-pointer ${
                isSelected
                  ? 'bg-gradient-to-r from-cyan-950/80 to-blue-950/80 border-cyan-500/70 text-white shadow-lg shadow-cyan-950/50 ring-1 ring-cyan-500/50'
                  : 'bg-slate-950/50 border-slate-800 text-slate-300 hover:border-slate-700 hover:bg-slate-800/40'
              }`}
            >
              <div className={`p-2 rounded-lg ${isSelected ? 'bg-cyan-500/20 text-cyan-300' : 'bg-slate-800 text-slate-400'}`}>
                {getPlatformIcon(plat.id)}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold truncate">{plat.name}</p>
                <p className="text-[10px] text-slate-400 truncate">{plat.taskType}</p>
              </div>
              {isSelected && <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" />}
            </button>
          );
        })}
      </div>

      {selectedPlatform === 'Other' && (
        <div className="pt-2 border-t border-slate-800 animate-fadeIn">
          <label className="block text-xs font-medium text-slate-300 mb-1.5 flex items-center gap-1.5">
            <PlusCircle className="w-3.5 h-3.5 text-cyan-400" />
            Enter Platform Name Manually
          </label>
          <input
            type="text"
            value={customPlatform}
            onChange={(e) => setCustomPlatform(e.target.value)}
            placeholder="e.g. Dunzo Partner, Local Logistics App"
            className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs placeholder:text-slate-500 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500"
          />
        </div>
      )}
    </div>
  );
}
