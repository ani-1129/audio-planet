"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { Menu, X, ShoppingCart, UserCircle, LogOut } from "lucide-react";
import { useAuthStore } from "@/stores/authStore";

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { user, isLoading, openAuthModal, signOut } = useAuthStore();
  const [showUserMenu, setShowUserMenu] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    // Check immediately on mount in case of page reload while scrolled
    handleScroll();
    
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close user menu when clicking outside
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest('[data-user-menu]')) {
        setShowUserMenu(false);
      }
    };
    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, []);

  return (
    <nav className={`fixed w-full z-50 transition-all duration-300 ${scrolled ? 'bg-[#0B132B]/90 backdrop-blur-md border-b border-[#1C2541]' : 'bg-transparent'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <div className="flex items-center relative">
            {/* Animated glow behind the company name */}
            <div className="absolute inset-0 bg-[#00F0FF] rounded-full blur-[20px] opacity-20 animate-pulse pointer-events-none" />
            <Link href="/" className="relative z-10 text-2xl font-bold tracking-tighter text-white drop-shadow-md">
              Audio<span className="text-[#00F0FF] text-glow">Planet</span>
            </Link>
          </div>
          
          <div className="hidden md:flex items-center">
            <div className="flex items-baseline space-x-8">
              <Link href="/catalog" className="hover:text-[#00F0FF] px-3 py-2 rounded-md text-sm font-medium transition-colors">Equipment</Link>
              <Link href="/packages" className="hover:text-[#00F0FF] px-3 py-2 rounded-md text-sm font-medium transition-colors">Packages</Link>
              <Link href="/about" className="hover:text-[#00F0FF] px-3 py-2 rounded-md text-sm font-medium transition-colors">About</Link>
              <Link href="/contact" className="hover:text-[#00F0FF] px-3 py-2 rounded-md text-sm font-medium transition-colors">Contact</Link>
              <Link href="/quote" className="bg-[#00F0FF] text-[#0B132B] px-5 py-2.5 rounded-md text-sm font-bold hover:bg-white transition-colors flex items-center">
                <ShoppingCart className="w-4 h-4 mr-2" />
                Quote
              </Link>
            </div>

            {/* Auth section */}
            <div className="ml-6 pl-6 border-l border-[#1C2541]" data-user-menu>
              {isLoading ? (
                <div className="w-8 h-8 rounded-full bg-[#1C2541] animate-pulse" />
              ) : user ? (
                <div className="relative">
                  <button
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-[#1C2541] transition-colors group"
                  >
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#00F0FF] to-[#7B61FF] flex items-center justify-center text-[#0B132B] font-bold text-sm">
                      {user.fullName.charAt(0).toUpperCase()}
                    </div>
                    <span className="text-sm font-medium text-gray-300 group-hover:text-white hidden lg:inline max-w-[100px] truncate">
                      {user.fullName.split(' ')[0]}
                    </span>
                  </button>

                  {showUserMenu && (
                    <div className="absolute right-0 mt-2 w-56 bg-[#0B132B] border border-[#1C2541] rounded-xl shadow-2xl overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                      <div className="px-4 py-3 border-b border-[#1C2541]">
                        <p className="text-sm font-bold text-white truncate">{user.fullName}</p>
                        <p className="text-xs text-gray-500 truncate">{user.email}</p>
                      </div>
                      <button
                        onClick={() => { signOut(); setShowUserMenu(false); }}
                        className="w-full text-left px-4 py-3 text-sm text-gray-400 hover:text-red-400 hover:bg-red-500/10 transition-colors flex items-center gap-2"
                      >
                        <LogOut className="w-4 h-4" />
                        Sign Out
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <button
                  onClick={() => openAuthModal()}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg border border-[#1C2541] text-sm font-medium text-gray-300 hover:text-[#00F0FF] hover:border-[#00F0FF]/50 transition-all"
                >
                  <UserCircle className="w-4 h-4" />
                  Sign In
                </button>
              )}
            </div>
          </div>
          
          <div className="md:hidden flex items-center gap-3">
            {/* Mobile auth button */}
            {!isLoading && (
              user ? (
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#00F0FF] to-[#7B61FF] flex items-center justify-center text-[#0B132B] font-bold text-sm">
                  {user.fullName.charAt(0).toUpperCase()}
                </div>
              ) : (
                <button
                  onClick={() => openAuthModal()}
                  className="text-gray-300 hover:text-[#00F0FF] transition-colors"
                >
                  <UserCircle className="w-6 h-6" />
                </button>
              )
            )}
            <button onClick={() => setIsOpen(!isOpen)} className="text-gray-300 hover:text-white focus:outline-none">
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>
      
      {isOpen && (
        <div className="md:hidden bg-[#0B132B] border-b border-[#1C2541] animate-in slide-in-from-top-5 fade-in duration-300">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <Link href="/catalog" onClick={() => setIsOpen(false)} className="block hover:bg-[#1C2541] px-3 py-2 rounded-md text-base font-medium transition-colors">Equipment</Link>
            <Link href="/packages" onClick={() => setIsOpen(false)} className="block hover:bg-[#1C2541] px-3 py-2 rounded-md text-base font-medium transition-colors">Packages</Link>
            <Link href="/about" onClick={() => setIsOpen(false)} className="block hover:bg-[#1C2541] px-3 py-2 rounded-md text-base font-medium transition-colors">About</Link>
            <Link href="/contact" onClick={() => setIsOpen(false)} className="block hover:bg-[#1C2541] px-3 py-2 rounded-md text-base font-medium transition-colors">Contact</Link>
            
            {/* Mobile auth section */}
            <div className="border-t border-[#1C2541] pt-3 mt-3">
              {user ? (
                <>
                  <div className="px-3 py-2 text-sm text-gray-400">
                    Signed in as <span className="text-white font-medium">{user.fullName}</span>
                  </div>
                  <button
                    onClick={() => { signOut(); setIsOpen(false); }}
                    className="w-full text-left hover:bg-red-500/10 px-3 py-2 rounded-md text-base font-medium text-red-400 transition-colors flex items-center gap-2"
                  >
                    <LogOut className="w-4 h-4" />
                    Sign Out
                  </button>
                </>
              ) : (
                <button
                  onClick={() => { openAuthModal(); setIsOpen(false); }}
                  className="w-full text-left hover:bg-[#1C2541] px-3 py-2 rounded-md text-base font-medium text-[#00F0FF] transition-colors flex items-center gap-2"
                >
                  <UserCircle className="w-5 h-5" />
                  Sign In / Sign Up
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
