import React from 'react';
import { Recycle, Mail, MapPin, Phone, Shield } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const Footer: React.FC = () => {
  const { setActiveView, openAuthModal, resetDemoData } = useApp();

  return (
    <footer className="bg-[#F6F5EC] border-t border-[#E6E5DA] text-[#292D25] pt-12 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-10 border-b border-[#E6E5DA]">
          {/* Col 1: Brand & Purpose */}
          <div className="md:col-span-1 space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-[#687447] text-white flex items-center justify-center">
                <Recycle className="w-4 h-4 text-[#F6F5EC]" />
              </div>
              <span className="text-lg font-bold tracking-tight text-[#292D25]">
                Civic<span className="text-[#687447]">Clean</span>
              </span>
            </div>
            <p className="text-xs text-[#292D25]/75 leading-relaxed">
              Public Waste Collection Monitoring System. Empowering citizens and municipal
              sanitation teams to collaborate for cleaner, healthier neighborhoods.
            </p>
            <div className="text-xs font-semibold text-[#687447]">
              Report. Track. Verify. Together.
            </div>
          </div>

          {/* Col 2: Citizen Services */}
          <div>
            <h4 className="text-xs font-bold text-[#424D2B] tracking-wider uppercase mb-3">
              Citizen Services
            </h4>
            <ul className="space-y-2 text-xs text-[#292D25]/80">
              <li>
                <button
                  onClick={() => setActiveView('report')}
                  className="hover:text-[#687447] transition-colors"
                >
                  Report Uncollected Garbage
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveView('my-complaints')}
                  className="hover:text-[#687447] transition-colors"
                >
                  Track My Complaints
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveView('community')}
                  className="hover:text-[#687447] transition-colors"
                >
                  Community Verification Feed
                </button>
              </li>
              <li>
                <button
                  onClick={() => openAuthModal('citizen')}
                  className="hover:text-[#687447] transition-colors"
                >
                  Citizen Portal Access
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Municipal Authority */}
          <div>
            <h4 className="text-xs font-bold text-[#424D2B] tracking-wider uppercase mb-3">
              Municipal Portal
            </h4>
            <ul className="space-y-2 text-xs text-[#292D25]/80">
              <li>
                <button
                  onClick={() => setActiveView('admin-dashboard')}
                  className="hover:text-[#687447] transition-colors"
                >
                  Sanitation Officer Console
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    setActiveView('admin-dashboard');
                  }}
                  className="hover:text-[#687447] transition-colors"
                >
                  Fleet & Crew Dispatch
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    setActiveView('admin-dashboard');
                  }}
                  className="hover:text-[#687447] transition-colors"
                >
                  Hotspot Waste Analytics
                </button>
              </li>
              <li>
                <button
                  onClick={() => openAuthModal('admin')}
                  className="hover:text-[#687447] transition-colors"
                >
                  Admin Secure Sign In
                </button>
              </li>
            </ul>
          </div>

          {/* Col 4: Municipal Contact & Helpline */}
          <div>
            <h4 className="text-xs font-bold text-[#424D2B] tracking-wider uppercase mb-3">
              Sanitation Contact
            </h4>
            <div className="space-y-2 text-xs text-[#292D25]/80">
              <div className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-[#687447]" />
                <span>Municipal Sanitation HQ, 400 Civic Center Blvd</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-[#687447]" />
                <span>Helpline: 311 / (555) 012-3400</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-[#687447]" />
                <span>sanitation@citycivic.gov</span>
              </div>
              <div className="flex items-center gap-2 pt-1 text-[11px] text-slate-500">
                <Shield className="w-3.5 h-3.5 text-[#A8B89A]" />
                <span>Public Oversight & Transparency Protocol</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom copyright & demo reset action */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-[#71717A] gap-4">
          <div>
            &copy; 2026 CivicClean Municipal System. Built for urban cleanliness and community accountability.
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={resetDemoData}
              className="text-xs text-[#687447] hover:underline cursor-pointer"
              title="Reset complaints and notifications to default sample data"
            >
              Reset Demo Records
            </button>
            <span aria-hidden="true">·</span>
            <span>Privacy Policy</span>
            <span aria-hidden="true">·</span>
            <span>Terms of Service</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
