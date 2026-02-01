"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ModeToggle } from "./mode-toggle";
import { Scissors, Activity, ChevronRight } from "lucide-react";

export default function Header() {
  const links = [
    { to: "/", label: "Home" },
    { to: "/auth/login", label: "Login" },
  ] as const;

  return (
    <header className="w-full relative z-[100] bg-[#001D29] border-b border-white/5 shadow-2xl">
      <div className="max-w-screen-2xl mx-auto flex flex-row items-center justify-between px-6 py-4">
        
        {/* Left Section: Industrial Branding */}
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative">
              <div className="w-10 h-10 bg-[#00B4D8] rounded-lg flex items-center justify-center shadow-[0_0_20px_rgba(0,180,216,0.3)] group-hover:scale-110 transition-transform">
                <Scissors className="w-5 h-5 text-[#001D29]" />
              </div>
              {/* Kinetic Ping */}
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-[#48CAE4] rounded-full border-2 border-[#001D29] animate-pulse" />
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-black uppercase tracking-[0.2em] text-white leading-none">
                MSME <span className="text-[#00B4D8]">Center</span>
              </span>
              <span className="text-[8px] font-bold text-white/30 uppercase tracking-widest mt-1">
                Node: v.2026.0
              </span>
            </div>
          </Link>

          {/* Vertical Divider */}
          <div className="h-8 w-[1px] bg-white/10 hidden sm:block" />

          {/* Navigation Items */}
          <nav className="hidden sm:flex gap-8">
            {links.map(({ to, label }) => {
              return (
                <Link 
                  key={to} 
                  href={to}
                  className="group flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.3em] text-white/40 hover:text-[#48CAE4] transition-all"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-transparent border border-white/20 group-hover:bg-[#00B4D8] group-hover:border-[#00B4D8] transition-all" />
                  {label}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Right Section: System Controls */}
        <div className="flex items-center gap-6">
          <div className="hidden lg:flex items-center gap-3 px-4 py-2 bg-white/5 rounded-xl border border-white/5">
            <Activity className="w-3 h-3 text-[#00B4D8] animate-pulse" />
            <div className="flex flex-col">
              <span className="text-[8px] font-black text-white/60 uppercase tracking-widest">Latency</span>
              <span className="text-[8px] font-bold text-[#00B4D8]">24ms Optic</span>
            </div>
          </div>

          <div className="flex items-center gap-4 pl-4 border-l border-white/10">
            <ModeToggle />
            <Link 
              href="/auth/signup"
              className="px-4 py-2 bg-[#0077B6] hover:bg-[#0096C7] text-white text-[10px] font-black uppercase tracking-widest rounded-lg transition-all hover:scale-105"
            >
              Get Started
            </Link>
          </div>
        </div>
      </div>

      {/* Under-glow Decoration matching your blue scale */}
      <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-[#00B4D8] to-transparent opacity-30" />
    </header>
  );
}