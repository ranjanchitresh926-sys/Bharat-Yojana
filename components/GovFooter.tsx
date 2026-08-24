"use client";

import React from 'react';
import { ExternalLink } from 'lucide-react';

interface ExternalService {
  label: string;
  url: string;
}

const EXTERNAL_LINKS: Record<string, ExternalService[]> = {
  Students: [
    { label: 'National Scholarship Portal', url: 'https://scholarships.gov.in/' },
    { label: 'Scholarship Eligibility', url: 'https://scholarships.gov.in/fresh/schemeEligibility' },
    { label: 'Application Status', url: 'https://scholarships.gov.in/fresh/trackApplicationStatus' },
  ],
  Farmers: [
    { label: 'PM-KISAN Status', url: 'https://pmkisan.gov.in/BeneficiaryStatus.aspx' },
    { label: 'Fasal Bima Yojana', url: 'https://pmfby.gov.in/' },
    { label: 'Soil Health Card', url: 'https://soilhealth.dac.gov.in/' },
    { label: 'Kisan Credit Card', url: 'https://www.pmkisan.gov.in/KCCForm' },
  ],
  Citizens: [
    { label: 'Aadhaar Services', url: 'https://uidai.gov.in/' },
    { label: 'Ration Card Status', url: 'https://nfsa.gov.in/portal/ration_card_state_portals_aa' },
    { label: 'Jan Dhan Yojana', url: 'https://pmjdy.gov.in/' },
    { label: 'UDID Portal', url: 'https://www.swavlambancard.gov.in/' },
  ],
  Institutes: [
    { label: 'AISHE Portal', url: 'https://aishe.gov.in/' },
    { label: 'UGC Portal', url: 'https://www.ugc.gov.in/' },
    { label: 'AICTE Portal', url: 'https://www.aicte-india.org/' },
  ],
};

export default function GovFooter() {
  return (
    <footer className="w-full bg-white border-t border-gray-200 mt-16 font-sans">
      {/* Related Government Services */}
      <div className="max-w-[1400px] mx-auto px-4 lg:px-8 py-10">
        <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-6">Related Government Services (external)</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {Object.entries(EXTERNAL_LINKS).map(([category, links]) => (
            <div key={category}>
              <h4 className="font-bold text-gray-800 text-sm uppercase tracking-wider mb-4 border-b border-gray-200 pb-2 inline-block">{category}</h4>
              <ul className="space-y-2.5 text-sm">
                {links.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-500 hover:text-blue-700 transition-colors inline-flex items-center gap-1.5 focus:outline-2 focus:outline-offset-2 focus:outline-blue-600"
                    >
                      {link.label}
                      <ExternalLink size={12} className="text-gray-400 shrink-0" />
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Honest Disclaimer */}
      <div className="border-t border-gray-200 bg-gray-50">
        <div className="max-w-[1400px] mx-auto px-4 lg:px-8 py-5">
          <p className="text-center text-sm text-gray-500">
            A student project built for Smart India Hackathon — not affiliated with the Government of India.
          </p>
        </div>
      </div>

      {/* Policy Row */}
      <div className="border-t border-gray-200">
        <div className="max-w-[1400px] mx-auto px-4 lg:px-8 py-4">
          <div className="flex flex-wrap items-center justify-center gap-2 text-sm text-gray-500 font-medium">
            <span>Copyright Policy</span>
            <span className="text-gray-300">|</span>
            <span>Privacy Policy</span>
            <span className="text-gray-300">|</span>
            <span>Terms and Conditions</span>
            <span className="text-gray-300">|</span>
            <span>Disclaimer</span>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="bg-[#4a4a4a] text-center py-3 px-4">
        <p className="text-orange-300 text-xs font-bold tracking-wide">Last update on August 2026</p>
        <p className="text-gray-300 text-xs mt-1">Available in 6 Indian languages via a curated translation dictionary.</p>
      </div>
    </footer>
  );
}
