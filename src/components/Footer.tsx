import React from 'react';
import { AppRoute } from '../types';

interface FooterProps {
  onNavigate: (route: AppRoute) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  return (
    <footer className="mt-auto border-t border-[#EAE4D8] bg-[#F7F4EC] text-[#78736B] py-12 px-5 sm:px-8">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 text-[13px]">
        {/* Left: Brand quote */}
        <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4 text-center sm:text-left">
          <span className="font-editorial text-lg text-[#191817]">Titipesan</span>
          <span className="hidden sm:inline text-[#C4BEB2]">/</span>
          <span className="font-serif italic text-[#635F57]">“Leave something worth remembering.”</span>
        </div>

        {/* Links */}
        <div className="flex flex-wrap items-center justify-center gap-6 font-medium text-[#57524A]">
          <button
            onClick={() => onNavigate('/about')}
            className="hover:text-[#191817] transition-colors"
          >
            Tentang
          </button>
          <button
            onClick={() => onNavigate('/privacy')}
            className="hover:text-[#191817] transition-colors"
          >
            Privacy
          </button>
          <button
            onClick={() => onNavigate('/support')}
            className="hover:text-[#191817] transition-colors"
          >
            Support
          </button>
        </div>

        {/* Copyright */}
        <div className="text-xs text-[#8C877E] font-meta">
          © 2026 Titipesan. All rights reserved.
        </div>
      </div>
    </footer>
  );
};
