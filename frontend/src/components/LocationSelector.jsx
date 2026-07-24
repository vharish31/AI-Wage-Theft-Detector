import React, { useState } from 'react';
import { MapPin, CheckCircle, X } from 'lucide-react';
import { INDIAN_STATES_CITIES_MAP, resolveLocationState } from '../utils/locationHelper';

export default function LocationSelector({ initialCity, initialState, onLocationSelected, onCancel }) {
  const [selectedState, setSelectedState] = useState(
    initialState || resolveLocationState(initialCity) || "Tamil Nadu"
  );
  const [selectedCity, setSelectedCity] = useState(
    initialCity || (INDIAN_STATES_CITIES_MAP[selectedState] ? INDIAN_STATES_CITIES_MAP[selectedState][0] : "Chennai")
  );

  const availableCities = INDIAN_STATES_CITIES_MAP[selectedState] || ["Chennai"];

  const handleStateChange = (e) => {
    const newState = e.target.value;
    setSelectedState(newState);
    const cities = INDIAN_STATES_CITIES_MAP[newState] || [];
    if (cities.length > 0) {
      setSelectedCity(cities[0]);
    }
  };

  const handleConfirm = (e) => {
    e.preventDefault();
    if (!selectedCity) return;
    
    // Clean display name if district is appended (e.g. "Tiruchirappalli (Trichy)" -> "Trichy")
    let cleanCity = selectedCity;
    if (cleanCity.includes('(')) {
      const match = cleanCity.match(/\(([^)]+)\)/);
      cleanCity = match ? match[1] : cleanCity.split(' ')[0];
    }

    if (onLocationSelected) {
      onLocationSelected({
        city: cleanCity,
        state: selectedState,
        formattedLocation: `${cleanCity}, ${selectedState}`
      });
    }
  };

  return (
    <div className="glass-card rounded-2xl p-6 sm:p-8 border border-cyan-500/40 relative overflow-hidden shadow-2xl animate-fade-in space-y-6">
      
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-700/60">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
            <MapPin className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-cyan-400 block">
              Layer 3: Manual Location Selection
            </span>
            <h3 className="text-xl font-extrabold text-white tracking-tight">
              Select State & City
            </h3>
          </div>
        </div>

        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-all"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      <form onSubmit={handleConfirm} className="space-y-4">
        
        {/* State Dropdown */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2">
            Select State
          </label>
          <select
            value={selectedState}
            onChange={handleStateChange}
            className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3.5 text-slate-100 text-sm font-semibold focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
          >
            {Object.keys(INDIAN_STATES_CITIES_MAP).map((state) => (
              <option key={state} value={state}>
                {state}
              </option>
            ))}
          </select>
        </div>

        {/* City/District Dropdown */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2">
            Select City / District
          </label>
          <select
            value={selectedCity}
            onChange={(e) => setSelectedCity(e.target.value)}
            className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3.5 text-slate-100 text-sm font-semibold focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
          >
            {availableCities.map((city) => (
              <option key={city} value={city}>
                {city}
              </option>
            ))}
          </select>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end pt-3">
          <button
            type="submit"
            className="w-full sm:w-auto py-3.5 px-8 rounded-xl bg-gradient-to-r from-cyan-500 to-teal-600 hover:from-cyan-400 hover:to-teal-500 text-slate-950 font-black text-sm shadow-lg shadow-cyan-500/20 flex items-center justify-center gap-2 transition-all hover:scale-[1.01] active:scale-95"
          >
            <CheckCircle className="w-5 h-5" />
            Set Location
          </button>
        </div>

      </form>

    </div>
  );
}
