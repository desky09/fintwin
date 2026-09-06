import React from 'react';
import { useApp } from '../../context/AppContext';
import { Scan } from 'lucide-react';

export const PersistentFAB: React.FC = () => {
  const { setIsScannerOpen } = useApp();

  return (
    <div className="hidden md:block fixed bottom-6 right-6 z-40">
      <button
        onClick={() => setIsScannerOpen(true)}
        className="flex items-center gap-2.5 px-5 py-3.5 bg-[#EEFC57] hover:bg-[#E0EE45] text-[#0B0F17] font-black text-sm rounded-full shadow-2xl shadow-[#EEFC57]/30 hover:shadow-yellow-glow active:scale-95 transition-all duration-200 border border-white/20 group"
        aria-label="Scan receipt or bill with OCR"
      >
        <div className="p-1 rounded-full bg-black/10 group-hover:rotate-12 transition-transform">
          <Scan className="w-5 h-5 text-[#0B0F17]" />
        </div>
        <span className="tracking-tight">Scan Bill (OCR)</span>
        <span className="text-[10px] bg-black text-[#EEFC57] px-1.5 py-0.5 rounded font-mono font-bold">
          Guard
        </span>
      </button>
    </div>
  );
};
