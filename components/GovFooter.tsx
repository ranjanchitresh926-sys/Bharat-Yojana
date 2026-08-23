"use client";

import React from 'react';
import { Mail, Shield } from 'lucide-react';

export default function GovFooter() {
  return (
    <footer className="w-full bg-white border-t border-gray-200 mt-16 font-sans">
      {/* Quick Links Section */}
      <div className="max-w-[1400px] mx-auto px-4 lg:px-8 py-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div>
            <h4 className="font-bold text-gray-800 text-sm uppercase tracking-wider mb-4 border-b-2 border-orange-400 pb-2 inline-block">Students</h4>
            <ul className="space-y-2.5 text-sm text-gray-500">
              <li>Apply For Scholarship</li>
              <li>Scholarship Eligibility</li>
              <li>Application Status</li>
              <li>Track Your Payment</li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-gray-800 text-sm uppercase tracking-wider mb-4 border-b-2 border-green-500 pb-2 inline-block">Farmers</h4>
            <ul className="space-y-2.5 text-sm text-gray-500">
              <li>PM-KISAN Status</li>
              <li>Fasal Bima Yojana</li>
              <li>Soil Health Card</li>
              <li>Kisan Credit Card</li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-gray-800 text-sm uppercase tracking-wider mb-4 border-b-2 border-blue-500 pb-2 inline-block">Citizens</h4>
            <ul className="space-y-2.5 text-sm text-gray-500">
              <li>Aadhaar Services</li>
              <li>Ration Card Status</li>
              <li>Jan Dhan Yojana</li>
              <li>Check UDID Details</li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-gray-800 text-sm uppercase tracking-wider mb-4 border-b-2 border-purple-500 pb-2 inline-block">Institutes</h4>
            <ul className="space-y-2.5 text-sm text-gray-500">
              <li>Registration Form</li>
              <li>Verify Institute</li>
              <li>Upload Documents</li>
              <li>Institute Dashboard</li>
            </ul>
          </div>
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
        <p className="text-gray-300 text-xs mt-1">The original text is in English. Translation into other languages is powered by the Bhashini service.</p>
      </div>
    </footer>
  );
}
