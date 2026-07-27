"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Filter, Search } from "lucide-react";
import { inventory } from "@/data/inventory";

export default function Catalog() {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredInventory = inventory.filter(item => {
    const matchesCategory = selectedCategory === "all" || item.category === selectedCategory;
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-[#050A17] pt-24 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-end mb-8 border-b border-[#1C2541] pb-6">
          <div>
            <h1 className="text-4xl font-bold mb-2">Equipment Catalog</h1>
            <p className="text-gray-400">Browse our inventory of professional audio, lighting, and trussing gear.</p>
          </div>
          
          <div className="mt-4 md:mt-0 flex space-x-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-4 h-4" />
              <input 
                type="text" 
                placeholder="Search equipment..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-[#0B132B] border border-[#1C2541] rounded-lg pl-10 pr-4 py-2 text-sm focus:outline-none focus:border-[#00F0FF] text-white placeholder-gray-500 w-full md:w-64"
              />
            </div>
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-8">
          {/* Sidebar */}
          <div className="w-full md:w-64 shrink-0 space-y-6">
            <div>
              <h3 className="font-semibold mb-3 text-white">Categories</h3>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li>
                  <label className="flex items-center hover:text-[#00F0FF] cursor-pointer">
                    <input type="radio" name="category" checked={selectedCategory === "all"} onChange={() => setSelectedCategory("all")} className="mr-2 rounded-full border-[#1C2541] bg-[#0B132B] accent-[#00F0FF]" /> All Equipment
                  </label>
                </li>
                <li>
                  <label className="flex items-center hover:text-[#00F0FF] cursor-pointer">
                    <input type="radio" name="category" checked={selectedCategory === "audio"} onChange={() => setSelectedCategory("audio")} className="mr-2 rounded-full border-[#1C2541] bg-[#0B132B] accent-[#00F0FF]" /> Audio (PA, Mixers)
                  </label>
                </li>
                <li>
                  <label className="flex items-center hover:text-[#00F0FF] cursor-pointer">
                    <input type="radio" name="category" checked={selectedCategory === "lighting"} onChange={() => setSelectedCategory("lighting")} className="mr-2 rounded-full border-[#1C2541] bg-[#0B132B] accent-[#00F0FF]" /> Lighting (Wash, Spots)
                  </label>
                </li>
                <li>
                  <label className="flex items-center hover:text-[#00F0FF] cursor-pointer">
                    <input type="radio" name="category" checked={selectedCategory === "trussing"} onChange={() => setSelectedCategory("trussing")} className="mr-2 rounded-full border-[#1C2541] bg-[#0B132B] accent-[#00F0FF]" /> Trussing & Staging
                  </label>
                </li>
              </ul>
            </div>
          </div>

          {/* Grid */}
          <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredInventory.length > 0 ? filteredInventory.map((product) => (
              <div key={product.id} className="bg-[#0B132B] border border-[#1C2541] rounded-xl overflow-hidden group hover:border-[#00F0FF] transition-colors flex flex-col">
                <div className="h-48 bg-[#1C2541]/30 relative flex items-center justify-center p-0">
                  <Image 
                    src={product.images[0]} 
                    alt={product.name} 
                    fill 
                    style={{ objectFit: 'cover' }} 
                    className="opacity-80 group-hover:opacity-100 transition-opacity"
                    onError={(e) => {
                      e.currentTarget.src = "/images/inventory/srx815p-1.jpg";
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0B132B] via-transparent to-transparent pointer-events-none" />
                  <span className="absolute top-2 right-2 bg-[#050A17]/80 backdrop-blur-sm text-xs font-bold px-2 py-1 rounded text-gray-300 border border-[#1C2541] z-10 pointer-events-none capitalize">
                    {product.category}
                  </span>
                </div>
                <div className="p-5 flex flex-col flex-1 relative z-10 bg-[#0B132B]">
                  <h3 className="font-bold text-lg mb-1 group-hover:text-[#00F0FF] transition-colors">{product.name}</h3>
                  <div className="text-xs text-gray-400 mb-4 flex space-x-3">
                    <span>Deposit: {product.depositPercentage}%</span>
                    <span>Status: <span className="text-green-400">Available</span></span>
                  </div>
                  <div className="mt-auto flex flex-col space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-400">Day Rate:</span>
                      <span className="font-bold text-[#00F0FF]">₹{product.pricing.day.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-400">Weekend:</span>
                      <span className="font-semibold text-white">₹{product.pricing.weekend.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center justify-between pt-2 border-t border-[#1C2541]">
                      <span className="text-sm text-gray-400">Month:</span>
                      <span className="font-semibold text-white">₹{product.pricing.month.toLocaleString()}</span>
                    </div>
                    <Link href={`/quote?item=${product.id}`} className="block text-center w-full mt-4 bg-[#1C2541] hover:bg-[#00F0FF] hover:text-[#0B132B] px-3 py-2 rounded text-sm font-semibold transition-colors">
                      Add to Quote
                    </Link>
                  </div>
                </div>
              </div>
            )) : (
              <div className="col-span-full py-12 text-center text-gray-500">
                No equipment found matching your criteria.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
