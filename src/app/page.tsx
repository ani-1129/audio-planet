"use client";

import dynamic from 'next/dynamic';
import Link from 'next/link';
import { HeroPlaceholder } from "@/components/3d/HeroPlaceholder";
import { preMadePackages } from "@/data/packages";

const HeroScene = dynamic(() => import('@/components/3d/HeroScene'), {
  ssr: false,
  loading: () => <HeroPlaceholder />
});

export default function Home() {
  return (
    <>
      <HeroScene />
      
      {/* Featured Packages Section */}
      <section className="py-24 bg-[#050A17]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Popular Rental Packages</h2>
            <p className="text-gray-400 max-w-2xl mx-auto">Curated setups for events of all sizes, perfectly tuned for your venue.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {preMadePackages.map((pkg) => (
              <div key={pkg.id} className="bg-[#0B132B] border border-[#1C2541] rounded-xl p-6 hover:border-[#00F0FF] transition-colors group flex flex-col">
                <h3 className="text-xl font-bold mb-2 group-hover:text-[#00F0FF] transition-colors">{pkg.name}</h3>
                <p className="text-lg font-extrabold text-[#00F0FF] mb-4">₹{pkg.demoPricePerDay.toLocaleString()} <span className="text-sm font-normal text-gray-500">/ day</span></p>
                <p className="text-sm text-gray-400 mb-6 flex-1 line-clamp-3">{pkg.items.join(', ')}</p>
                <Link href="/packages" className="block text-center w-full py-3 bg-[#1C2541] hover:bg-[#00F0FF] hover:text-[#0B132B] rounded-lg font-bold transition-colors">
                  View Details
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
