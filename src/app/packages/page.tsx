"use client";

import Link from "next/link";
import Image from "next/image";
import { Check } from "lucide-react";
import { preMadePackages } from "@/data/packages";

export default function PackagesPage() {
  return (
    <div className="min-h-screen bg-[#050A17] pt-24 pb-12 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-4">Curated Event Packages</h1>
          <p className="text-xl max-w-2xl mx-auto">Hand-picked combinations of top-tier equipment designed to seamlessly cover your event needs at a discounted bundle rate.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8 mb-16">
          {preMadePackages.map((pkg) => (
            <div key={pkg.id} className="relative bg-[#0B132B] rounded-2xl border border-[#1C2541] overflow-hidden flex flex-col hover:border-[#00F0FF] transition-colors duration-300 group">
              <div className="h-64 w-full relative">
                <Image 
                  src={pkg.image} 
                  alt={pkg.name} 
                  fill 
                  style={{ objectFit: 'cover' }}
                  className="opacity-80 group-hover:opacity-100 transition-opacity"
                  onError={(e) => { e.currentTarget.src = "/images/packages/wedding.jpg"; }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0B132B] to-transparent" />
              </div>
              <div className="p-8 flex flex-col flex-1 relative z-10 -mt-16">
                <h2 className="text-2xl font-bold text-white mb-2 drop-shadow-md">{pkg.name}</h2>
                <div className="mb-6">
                  <span className="text-3xl font-extrabold text-[#00F0FF]">₹{pkg.demoPricePerDay.toLocaleString()}</span>
                  <span className="text-gray-400 font-medium"> / day</span>
                </div>
                
                <ul className="space-y-3 mb-8 flex-1 bg-[#1C2541]/30 p-5 rounded-xl border border-[#1C2541]">
                  {pkg.items.map((item, idx) => (
                    <li key={idx} className="flex items-start">
                      <Check className="w-5 h-5 text-[#00F0FF] shrink-0 mr-3 mt-0.5" />
                      <span className="text-sm font-medium text-gray-300">{item}</span>
                    </li>
                  ))}
                </ul>
                
                <Link href={`/quote?package=${pkg.id}`} className="w-full text-center py-4 rounded-lg font-bold transition-all bg-[#1C2541] text-white hover:bg-[#00F0FF] hover:text-[#0B132B]">
                  Book This Package
                </Link>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-[#1C2541]/30 border border-[#1C2541] rounded-2xl p-8 text-center backdrop-blur-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 -mt-10 -mr-10 w-40 h-40 bg-[#00F0FF] rounded-full blur-[80px] opacity-20 pointer-events-none"></div>
          <h3 className="text-2xl font-bold text-white mb-2 relative z-10">Need a Custom Setup?</h3>
          <p className="text-gray-400 mb-6 max-w-2xl mx-auto relative z-10">Don't see exactly what you need? We can tailor a bespoke equipment list specifically for your venue and requirements.</p>
          <Link href="/catalog" className="inline-flex items-center text-[#00F0FF] font-bold hover:text-white transition-colors relative z-10 border-b border-transparent hover:border-white pb-1">
            Browse All Equipment &rarr;
          </Link>
        </div>

      </div>
    </div>
  );
}
