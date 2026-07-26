import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check } from 'lucide-react';

export default function ModernDropdown({
  options = [],
  value,
  onChange,
  placeholder = 'Select Option',
  icon: HeaderIcon,
  className = ''
}) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const selectedOption = options.find((opt) => opt.value === value) || options[0];

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      {/* TRIGGER BUTTON */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full px-3.5 py-2.5 rounded-2xl bg-slate-950 border transition-all duration-200 flex items-center justify-between gap-3 text-xs font-bold cursor-pointer ${
          isOpen
            ? 'border-cyan-500 shadow-lg shadow-cyan-500/10 text-white ring-2 ring-cyan-500/20'
            : 'border-slate-800/90 hover:border-slate-700 text-slate-200 hover:text-white'
        }`}
      >
        <div className="flex items-center gap-2.5 truncate">
          {HeaderIcon && <HeaderIcon className="w-4 h-4 text-cyan-400 shrink-0" />}
          {selectedOption?.icon && (
            <span className="text-cyan-400 shrink-0">{selectedOption.icon}</span>
          )}
          <span className="truncate">{selectedOption?.label || placeholder}</span>
        </div>
        <ChevronDown
          className={`w-4 h-4 text-slate-400 transition-transform duration-200 shrink-0 ${
            isOpen ? 'rotate-180 text-cyan-400' : ''
          }`}
        />
      </button>

      {/* FLOATING DROPDOWN MENU */}
      {isOpen && (
        <div className="absolute left-0 right-0 top-full mt-2 z-50 p-1.5 rounded-2xl bg-slate-900/95 backdrop-blur-xl border border-slate-800 shadow-2xl shadow-slate-950/80 animate-fadeIn space-y-1 min-w-[200px]">
          {options.map((option) => {
            const isSelected = option.value === value;
            return (
              <button
                key={option.value}
                type="button"
                onClick={() => {
                  onChange(option.value);
                  setIsOpen(false);
                }}
                className={`w-full px-3 py-2.5 rounded-xl text-xs font-bold flex items-center justify-between gap-3 transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-gradient-to-r from-cyan-500/20 to-blue-500/20 text-cyan-300 border border-cyan-500/30'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/80 border border-transparent'
                }`}
              >
                <div className="flex items-center gap-2.5 truncate">
                  {option.icon && (
                    <span className={isSelected ? 'text-cyan-400' : 'text-slate-400'}>
                      {option.icon}
                    </span>
                  )}
                  <span className="truncate">{option.label}</span>
                </div>
                {isSelected && <Check className="w-4 h-4 text-cyan-400 shrink-0" />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

