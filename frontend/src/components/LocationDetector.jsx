import React, { useState } from 'react';
import { Navigation, MapPin, AlertCircle, Compass, Sparkles } from 'lucide-react';
import { reverseGeocodeCoords } from '../utils/locationHelper';

export default function LocationDetector({ onLocationDetected, onSelectManually }) {
  const [isDetecting, setIsDetecting] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);

  const handleDetectGPSLocation = () => {
    if (!navigator.geolocation) {
      setErrorMessage("Geolocation is not supported by your browser. Please select location manually.");
      return;
    }

    setIsDetecting(true);
    setErrorMessage(null);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords;
          const resolved = await reverseGeocodeCoords(latitude, longitude);
          setIsDetecting(false);
          if (onLocationDetected) {
            onLocationDetected(resolved);
          }
        } catch (err) {
          console.error("GPS Reverse Geocoding Error:", err);
          setIsDetecting(false);
          setErrorMessage("Failed to resolve GPS coordinates. Please select your location manually.");
        }
      },
      (error) => {
        setIsDetecting(false);
        let msg = "GPS location access denied or unavailable.";
        if (error.code === error.PERMISSION_DENIED) {
          msg = "GPS Permission denied. Please select your location manually.";
        }
        setErrorMessage(msg);
      },
      { timeout: 10000, enableHighAccuracy: true }
    );
  };

  return (
    <div className="glass-card rounded-2xl p-6 sm:p-8 border border-amber-500/40 relative overflow-hidden shadow-2xl animate-fade-in space-y-6">
      
      {/* Header */}
      <div className="flex items-center gap-3 pb-4 border-b border-slate-700/60">
        <div className="p-2.5 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30">
          <MapPin className="w-6 h-6 animate-bounce" />
        </div>
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-amber-400 block">
            Layer 2: GPS Location Detection
          </span>
          <h3 className="text-xl font-extrabold text-white tracking-tight">
            Location Not Detected
          </h3>
        </div>
      </div>

      {/* Main Prompt */}
      <div className="bg-slate-900/90 border border-slate-700/80 rounded-xl p-5 space-y-2">
        <p className="text-base font-bold text-slate-200 flex items-center gap-2">
          <Compass className="w-5 h-5 text-cyan-400" />
          Use your current device location?
        </p>
        <p className="text-xs text-slate-400">
          Minimum wage standards vary significantly across Indian states and municipal zones. Precise location is required for accurate legal rate matching.
        </p>
      </div>

      {/* Warning Message if Permission Denied or Failed */}
      {errorMessage && (
        <div className="bg-rose-950/80 border border-rose-500/50 rounded-xl p-4 flex items-start gap-3 text-rose-200 text-sm">
          <AlertCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
          <div>
            <p className="font-bold text-rose-300">GPS Warning</p>
            <p>{errorMessage}</p>
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
        <button
          type="button"
          onClick={handleDetectGPSLocation}
          disabled={isDetecting}
          className="w-full sm:flex-1 py-4 px-6 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-extrabold text-sm sm:text-base shadow-lg shadow-cyan-500/20 flex items-center justify-center gap-2 transition-all hover:scale-[1.01] active:scale-95 disabled:opacity-50"
        >
          {isDetecting ? (
            <>
              <Sparkles className="w-5 h-5 animate-spin" />
              Detecting GPS Location...
            </>
          ) : (
            <>
              <Navigation className="w-5 h-5" />
              Detect My Location
            </>
          )}
        </button>

        <button
          type="button"
          onClick={onSelectManually}
          className="w-full sm:w-auto py-4 px-6 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 font-bold text-sm flex items-center justify-center gap-2 transition-all"
        >
          Select Manually
        </button>
      </div>

    </div>
  );
}
