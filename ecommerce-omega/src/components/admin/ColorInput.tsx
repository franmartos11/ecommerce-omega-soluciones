import React from "react";

interface ColorInputProps {
  label: string;
  subtitle: string;
  value: string;
  onChange: (val: string) => void;
}

export function ColorInput({ label, subtitle, value, onChange }: ColorInputProps) {
  return (
    <div className="p-4 rounded-xl border border-gray-200 bg-white hover:border-gray-300 transition-colors shadow-sm">
      <div className="flex justify-between items-start gap-4 mb-4">
        <div>
          <label className="block text-sm font-bold text-gray-900">{label}</label>
          <p className="text-xs text-gray-500 mt-0.5">{subtitle}</p>
        </div>
        <div 
          className="w-10 h-10 rounded-full border-2 border-gray-100 shadow-inner flex-shrink-0"
          style={{ backgroundColor: value }}
        />
      </div>
      
      <div className="flex relative">
        <input 
          type="color" 
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="absolute opacity-0 w-full h-full cursor-pointer inset-0"
        />
        <div className="w-full flex items-center gap-2 border border-gray-300 rounded-lg px-3 py-2 bg-gray-50">
          <span className="text-gray-400 font-mono text-xs">HEX</span>
          <span className="font-mono text-sm tracking-wide text-gray-800 uppercase flex-1 text-center">{value}</span>
        </div>
      </div>
    </div>
  );
}
