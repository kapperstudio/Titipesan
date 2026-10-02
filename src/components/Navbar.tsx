import React, { useState } from 'react';
import { AppRoute } from '../types';
import { Menu, X, Plus } from 'lucide-react';

interface NavbarProps {
  currentRoute: AppRoute;
  onNavigate: (route: AppRoute) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentRoute, onNavigate }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems: { label: string; route: AppRoute }[] = [
    { label: 'Beranda', route: '/' },
    { label: 'Search', route: '/search' },
    { label: 'History', route: '/history' },
    { label: 'Donate', route: '/donate' },
  ];

  const handleNavClick = (route: AppRoute) => {
    onNavigate(route);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-30 bg-[#FBF9F5]/90 backdrop-blur-md border-b border-[#EAE4D8]/80 transition-colors">
      <div className="max-w-6xl mx-auto px-5 sm:px-8 h-18 flex items-center justify-between">
        {/* Brand Zone */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => handleNavClick('/')}
            className="group text-left text-2xl sm:text-[26px] font-editorial tracking-tight text-[#191817] hover:opacity-85 transition-opacity"
            aria-label="Titipesan Beranda"
          >
            Titipesan
          </button>
        </div>

        {/* Desktop Nav Zone */}
        <nav className="hidden md:flex items-center gap-8 text-[14px] font-medium text-[#6B665E]">
          {navItems.map((item) => {
            const isActive = currentRoute === item.route;
            return (
              <button
                key={item.route}
                onClick={() => handleNavClick(item.route)}
                className={`transition-colors py-1 relative ${
                  isActive
                    ? 'text-[#191817] font-semibold'
                    : 'hover:text-[#191817]'
                }`}
              >
                {item.label}
                {isActive && (
                  <span className="absolute bottom-0 left-0 right-0 h-[1.5px] bg-[#191817]" />
                )}
              </button>
            );
          })}
        </nav>

        {/* Action Zone */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => handleNavClick('/create')}
            className="flex items-center gap-2 px-4 py-2 text-[13px] font-medium text-[#FBF9F5] bg-[#191817] hover:bg-[#322F2C] rounded-sm transition-colors shadow-xs active:scale-[0.98]"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Buat Pesan</span>
          </button>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-[#4A463F] hover:text-[#191817] transition-colors rounded-sm focus-visible:outline-2"
            aria-label="Menu Navigasi"
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#FAF6EE] border-b border-[#EAE4D8] px-6 py-5 animate-in fade-in slide-in-from-top-2 duration-150">
          <div className="flex flex-col gap-4 text-[15px]">
            {navItems.map((item) => {
              const isActive = currentRoute === item.route;
              return (
                <button
                  key={item.route}
                  onClick={() => handleNavClick(item.route)}
                  className={`text-left py-1 transition-colors ${
                    isActive ? 'font-semibold text-[#191817]' : 'text-[#6B665E]'
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </header>
  );
};
