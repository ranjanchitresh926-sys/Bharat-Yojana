"use client";

import React from 'react';
import { Landmark, Shield, Globe, Monitor, Smartphone } from 'lucide-react';

export default function GovFooter() {
  return (
    <footer className="w-full bg-white border-t border-gray-200 mt-16 font-sans">
      {/* Quick Links Section */}
      <div className="max-w-[1400px] mx-auto px-4 lg:px-8 py-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div>
            <h4 className="font-bold text-gray-800 text-sm uppercase tracking-wider mb-4 border-b-2 border-orange-400 pb-2 inline-block">Students</h4>
            <ul className="space-y-2.5 text-sm text-gray-600">
              <li><a href="#" className="hover:text-blue-700 transition-colors">Apply For Scholarship</a></li>
              <li><a href="#" className="hover:text-blue-700 transition-colors">Scholarship Eligibility</a></li>
              <li><a href="#" className="hover:text-blue-700 transition-colors">Application Status</a></li>
              <li><a href="#" className="hover:text-blue-700 transition-colors">Track Your Payment</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-gray-800 text-sm uppercase tracking-wider mb-4 border-b-2 border-green-500 pb-2 inline-block">Farmers</h4>
            <ul className="space-y-2.5 text-sm text-gray-600">
              <li><a href="#" className="hover:text-blue-700 transition-colors">PM-KISAN Status</a></li>
              <li><a href="#" className="hover:text-blue-700 transition-colors">Fasal Bima Yojana</a></li>
              <li><a href="#" className="hover:text-blue-700 transition-colors">Soil Health Card</a></li>
              <li><a href="#" className="hover:text-blue-700 transition-colors">Kisan Credit Card</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-gray-800 text-sm uppercase tracking-wider mb-4 border-b-2 border-blue-500 pb-2 inline-block">Citizens</h4>
            <ul className="space-y-2.5 text-sm text-gray-600">
              <li><a href="#" className="hover:text-blue-700 transition-colors">Aadhaar Services</a></li>
              <li><a href="#" className="hover:text-blue-700 transition-colors">Ration Card Status</a></li>
              <li><a href="#" className="hover:text-blue-700 transition-colors">Jan Dhan Yojana</a></li>
              <li><a href="#" className="hover:text-blue-700 transition-colors">Check UDID Details</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-gray-800 text-sm uppercase tracking-wider mb-4 border-b-2 border-purple-500 pb-2 inline-block">Institutes</h4>
            <ul className="space-y-2.5 text-sm text-gray-600">
              <li><a href="#" className="hover:text-blue-700 transition-colors">Registration Form</a></li>
              <li><a href="#" className="hover:text-blue-700 transition-colors">Verify Institute</a></li>
              <li><a href="#" className="hover:text-blue-700 transition-colors">Upload Documents</a></li>
              <li><a href="#" className="hover:text-blue-700 transition-colors">Institute Dashboard</a></li>
            </ul>
          </div>
        </div>
      </div>

      {/* Government Logos Row */}
      <div className="border-t border-gray-200 bg-gray-50">
        <div className="max-w-[1400px] mx-auto px-4 lg:px-8 py-6">
          <div className="flex flex-wrap items-center justify-center gap-8 md:gap-12 opacity-60">
            <div className="flex items-center gap-2 text-gray-600">
              <Monitor size={22} />
              <span className="text-xs font-bold uppercase tracking-wider">MeitY</span>
            </div>
            <div className="flex items-center gap-2 text-gray-600">
              <Shield size={22} />
              <span className="text-xs font-bold uppercase tracking-wider">NIC</span>
            </div>
            <div className="flex items-center gap-2 text-gray-600">
              <Globe size={22} />
              <span className="text-xs font-bold uppercase tracking-wider">myGov</span>
            </div>
            <div className="flex items-center gap-2 text-gray-600">
              <Landmark size={22} />
              <span className="text-xs font-bold uppercase tracking-wider">india.gov.in</span>
            </div>
            <div className="flex items-center gap-2 text-gray-600">
              <Smartphone size={22} />
              <span className="text-xs font-bold uppercase tracking-wider">Digital India</span>
            </div>
          </div>
        </div>
      </div>

      {/* Policy Links Row */}
      <div className="border-t border-gray-200">
        <div className="max-w-[1400px] mx-auto px-4 lg:px-8 py-4">
          <div className="flex flex-wrap items-center justify-center gap-2 text-sm text-blue-700 font-medium">
            <a href="#" className="hover:underline">Copyright Policy</a>
            <span className="text-gray-300">|</span>
            <a href="#" className="hover:underline">Privacy Policy</a>
            <span className="text-gray-300">|</span>
            <a href="#" className="hover:underline">Terms and Conditions</a>
            <span className="text-gray-300">|</span>
            <a href="#" className="hover:underline">Disclaimer</a>
            <span className="text-gray-300">|</span>
            <a href="#" className="hover:underline">Hyperlink</a>
            <span className="text-gray-300">|</span>
            <a href="#" className="hover:underline">Site Map</a>
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
