import React from 'react';
import { MapPin, CheckCircle, Edit3, ShieldCheck } from 'lucide-react';
import { resolveLocationState } from '../utils/locationHelper';

export default function LocationReview({ locationData, onConfirmLocation, onChangeLocation }) {
  const city = locationData?.city || locationData?.location || "Chennai";
  const state = locationData?.state || resolveLocationState(city);

  return (
    <div className="glass-card rounded-2xl p-6 sm:p-8 border border-emerald-500/40 relative overflow-hidden shadow-2xl animate-fade-in space-y-6">
      
      {/* Header */}
      <div className="flex items-center gap-3 pb-4 border-b border-slate-700/60">
        <div className="p-2.5 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
          <ShieldCheck className="w-6 h-6" />
        </div>
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 block">
            Layer 4: Location Confirmation Screen
          </span>
          <h3 className="text-xl font-extrabold text-white tracking-tight">
            Detected Location
          </h3>
        </div>
      </div>

      {/* Location Details Card */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-slate-900/90 border border-slate-700/80 rounded-xl p-5">
        
        <div className="space-y-1">
          <span className="text-xs font-semibold text-slate-400 block">
            City / District
          </span>
          <p className="text-xl font-black text-white flex items-center gap-2">
            <MapPin className="w-5 h-5 text-emerald-400" />
            {city}
          </p>
        </div>

        <div className="space-y-1">
          <span className="text-xs font-semibold text-slate-400 block">
            State Jurisdiction
          </span>
          <p className="text-xl font-black text-cyan-300">
            {state}
          </p>
        </div>

      </div>

      {/* Buttons */}
      <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
        <button
          type="button"
          onClick={() => onConfirmLocation && onConfirmLocation({ city, state, locationStr: `${city}, ${state}` })}
          className="w-full sm:flex-1 py-4 px-6 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white font-extrabold text-sm sm:text-base shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2 transition-all hover:scale-[1.01] active:scale-95"
        >
          <CheckCircle className="w-5 h-5" />
          Confirm Location
        </button>

        <button
          type="button"
          onClick={onChangeLocation}
          className="w-full sm:w-auto py-4 px-5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 font-bold text-sm flex items-center justify-center gap-2 transition-all"
        >
          <Edit3 className="w-4 h-4" />
          Change Location
        </button>
      </div>

    </div>
  );
}
