"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Landmark, Search, LogOut } from "lucide-react";
import { Role } from "../types/scheme";
import { getSession, signOut } from "next-auth/react";

interface GovHeaderProps {
  searchQuery?: string;
  onSearchChange?: (val: string) => void;
}

const FONT_SIZES: Record<string, string> = {
  small: "14px",
  normal: "16px",
  large: "18px",
};

export default function GovHeader({ searchQuery = "", onSearchChange }: GovHeaderProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [fontSize, setFontSize] = useState("normal");
  const [role, setRole] = useState<Role>("citizen");
  const [mounted, setMounted] = useState(false);
  const [localSearch, setLocalSearch] = useState(searchQuery);
  const [sessionUser, setSessionUser] = useState<any>(null);

  useEffect(() => {
    setLocalSearch(searchQuery);
  }, [searchQuery]);

  useEffect(() => {
    const storedFont = localStorage.getItem("bharat_yojana_font_size");
    if (storedFont && FONT_SIZES[storedFont]) {
      setFontSize(storedFont);
      document.documentElement.style.setProperty("--font-size-base", FONT_SIZES[storedFont]);
    }

    getSession().then((session) => {
      if (session?.user) {
        setSessionUser(session.user);
        setRole(session.user.role as Role);
      } else {
        setSessionUser(null);
        setRole("citizen");
      }
      setMounted(true);
    });
  }, []);

  const changeFontSize = (size: string) => {
    setFontSize(size);
    localStorage.setItem("bharat_yojana_font_size", size);
    document.documentElement.style.setProperty("--font-size-base", FONT_SIZES[size]);
  };

  const openLanguageModal = () => {
    window.dispatchEvent(new Event("openLanguageModal"));
  };

  const handleSearchSubmit = () => {
    if (localSearch.trim()) {
      if (pathname === "/") {
        if (onSearchChange) onSearchChange(localSearch);
        window.dispatchEvent(new CustomEvent("triggerSearch", { detail: localSearch }));
      } else {
        router.push(`/?q=${encodeURIComponent(localSearch)}`);
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSearchSubmit();
    }
  };

  const handleSignOut = async () => {
    await signOut({ redirect: false });
    setSessionUser(null);
    setRole("citizen");
    router.push("/");
    router.refresh();
  };

  const NAV_ITEMS = [
    { label: "Home", href: "/" },
    { label: "Offerings / Schemes", href: "/schemes" },
  ];

  if (role === "citizen" || role === "admin") {
    NAV_ITEMS.push({ label: "My Dashboard", href: "/dashboard" });
  }

  NAV_ITEMS.push({ label: "Connect", href: "/connect" });

  if (role === "officer" || role === "admin") {
    NAV_ITEMS.push({ label: "Verify Reports", href: "/verify" });
  }

  if (role === "admin") {
    NAV_ITEMS.push({ label: "Admin Analytics", href: "/admin/analytics" });
  }

  const isActive = (item: typeof NAV_ITEMS[number]) => {
    return pathname === item.href;
  };

  return (
    <>
      <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:z-[9999] focus:p-4 focus:bg-white focus:text-blue-900 focus:font-bold focus:shadow-lg top-0 left-0">Skip to main content</a>
      <header className="print:hidden w-full bg-[#0B3D91] relative z-40 font-sans border-b border-[#093075]">
        {/* Utility Bar */}
        <div className="border-b border-[#1a4fa0]">
          <div className="max-w-[1400px] mx-auto px-4 lg:px-8 py-2 flex flex-col lg:flex-row items-center justify-between gap-4">

            {/* Left: Branding */}
            <Link href="/" className="flex items-center gap-3 shrink-0 hover:opacity-90 transition-opacity">
              <div className="h-11 w-11 rounded-lg bg-gradient-to-br from-orange-500 via-white to-green-600 flex items-center justify-center shadow-sm">
                <Landmark size={22} className="text-[#0B3D91]" strokeWidth={2.5} />
              </div>
              <div className="flex flex-col">
                <span className="text-lg font-extrabold text-white tracking-tight leading-none">Bharat Yojana</span>
                <span className="text-[10px] font-semibold text-blue-200 uppercase tracking-widest mt-0.5">Student Project — Smart India Hackathon</span>
              </div>
            </Link>

            {/* Center: Search Bar */}
            <div className="flex-1 max-w-lg w-full relative group mx-4">
              <input
                type="text"
                value={localSearch}
                onChange={(e) => {
                  setLocalSearch(e.target.value);
                  if (onSearchChange) onSearchChange(e.target.value);
                }}
                onKeyDown={handleKeyDown}
                placeholder="Search schemes by name, category, or code... (Press Enter)"
                className="w-full pl-11 pr-4 py-2 border border-blue-300/40 rounded-md focus:outline-2 focus:outline-offset-2 focus:outline-white bg-[#0a3580] text-white placeholder-blue-300/60 text-sm transition-all"
              />
              <Search className="absolute left-4 top-2.5 text-blue-300/60 group-focus-within:text-white transition-colors" size={16} />
            </div>

            {/* Far-Right: Accessibility & Language & Role */}
            <div className="flex items-center gap-2 shrink-0">
              
              {/* Auth Controls */}
              {mounted && (
                <div className="flex items-center gap-3 mr-2 border-r border-blue-300/30 pr-4">
                  {sessionUser ? (
                    <div className="flex items-center gap-3">
                      <div className="flex flex-col text-right">
                        <span className="text-xs text-white font-semibold">{sessionUser.email}</span>
                        <span className="text-[10px] text-blue-300 uppercase tracking-wider font-bold">{sessionUser.role}</span>
                      </div>
                      <button 
                        onClick={handleSignOut}
                        className="p-1.5 bg-blue-900/50 hover:bg-red-500/80 rounded border border-blue-300/30 text-white transition-colors"
                        title="Sign Out"
                      >
                        <LogOut size={14} />
                      </button>
                    </div>
                  ) : (
                    <Link href="/login" className="text-xs font-bold text-white bg-blue-600/50 hover:bg-blue-600 border border-blue-400/50 px-3 py-1.5 rounded transition-colors">
                      Sign In
                    </Link>
                  )}
                </div>
              )}

              {/* Font Size Controls */}
              <div className="flex bg-[#0a3580] rounded border border-blue-300/30 p-0.5">
                <button
                  onClick={() => changeFontSize("small")}
                  className={`px-2 rounded text-[10px] font-bold h-6 flex items-center justify-center text-blue-200 hover:bg-[#1a4fa0] hover:text-white focus:outline-2 focus:outline-offset-2 focus:outline-white ${fontSize === "small" ? "bg-[#1a4fa0] text-white" : ""}`}
                  title="Decrease Text Size"
                  aria-label="Decrease text size"
                >A-</button>
                <button
                  onClick={() => changeFontSize("normal")}
                  className={`px-2 rounded text-xs font-bold h-6 flex items-center justify-center text-blue-200 hover:bg-[#1a4fa0] hover:text-white border-l border-r border-blue-300/30 focus:outline-2 focus:outline-offset-2 focus:outline-white ${fontSize === "normal" ? "bg-[#1a4fa0] text-white" : ""}`}
                  title="Normal Text Size"
                  aria-label="Normal text size"
                >A</button>
                <button
                  onClick={() => changeFontSize("large")}
                  className={`px-2 rounded text-sm font-bold h-6 flex items-center justify-center text-blue-200 hover:bg-[#1a4fa0] hover:text-white focus:outline-2 focus:outline-offset-2 focus:outline-white ${fontSize === "large" ? "bg-[#1a4fa0] text-white" : ""}`}
                  title="Increase Text Size"
                  aria-label="Increase text size"
                >A+</button>
              </div>

              <div className="h-6 w-px bg-blue-300/30 mx-1"></div>

              <button
                onClick={openLanguageModal}
                className="flex items-center justify-center px-3 py-1 ml-1 bg-[#0a3580] hover:bg-[#1a4fa0] text-white rounded border border-blue-300/30 transition focus:outline-2 focus:outline-offset-2 focus:outline-white"
                title="Change Language"
                aria-label="Change language"
              >
                <span className="text-lg font-bold leading-none mb-0.5">अ</span>
                <span className="text-xs text-blue-300 mx-1 font-black">/</span>
                <span className="text-sm font-bold">A</span>
              </button>
            </div>
          </div>
        </div>

        {/* Navigation Menu Bar */}
        <div className="border-t border-[#1a4fa0]">
          <div className="max-w-[1400px] mx-auto px-4 lg:px-8 flex gap-0 overflow-x-auto text-sm font-medium text-blue-200">
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className={`py-3 px-5 whitespace-nowrap transition-colors focus:outline-2 focus:outline-offset-[-2px] focus:outline-white ${
                  isActive(item)
                    ? "border-b-[3px] border-white text-white font-bold"
                    : "border-b-[3px] border-transparent hover:text-white hover:border-blue-300/50"
                }`}
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      </header>
    </>
  );
}

