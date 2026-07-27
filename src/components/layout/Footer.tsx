import Link from "next/link";
import { Mail, Phone, MapPin } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-[#050A17] border-t border-[#1C2541] pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          <div className="col-span-1 md:col-span-2">
            <Link href="/" className="text-2xl font-bold tracking-tighter text-white mb-4 block">
              Audio<span className="text-[#00F0FF]">Planet</span>
            </Link>
            <p className="text-gray-400 mb-6 max-w-sm">
              Full-system sound, light & trussing rentals for every event — Delhi. Professional gear, seamless setup.
            </p>
            <div className="flex space-x-4">
              <a href="https://instagram.com/audioplanet_2014" target="_blank" rel="noreferrer" className="text-gray-400 hover:text-[#00F0FF] transition-colors">
                <span className="font-semibold">@audioplanet_2014</span>
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4 text-white">Rentals</h3>
            <ul className="space-y-2">
              <li><Link href="/catalog?category=audio" className="text-gray-400 hover:text-[#00F0FF]">Audio</Link></li>
              <li><Link href="/catalog?category=lighting" className="text-gray-400 hover:text-[#00F0FF]">Lighting</Link></li>
              <li><Link href="/catalog?category=trussing" className="text-gray-400 hover:text-[#00F0FF]">Trussing</Link></li>
              <li><Link href="/packages" className="text-gray-400 hover:text-[#00F0FF]">Packages</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4 text-white">Contact</h3>
            <ul className="space-y-4">
              <li className="flex items-start">
                <MapPin className="h-5 w-5 text-[#00F0FF] mr-2 shrink-0" />
                <span className="text-gray-400 text-sm">Delhi NCR, India<br />(Warehouse pickups by appointment)</span>
              </li>
              <li className="flex items-center">
                <Phone className="h-5 w-5 text-[#00F0FF] mr-2 shrink-0" />
                <span className="text-gray-400 text-sm">+91 XXXXX XXXXX</span>
              </li>
              <li className="flex items-center">
                <Mail className="h-5 w-5 text-[#00F0FF] mr-2 shrink-0" />
                <span className="text-gray-400 text-sm">bookings@audioplanet.in</span>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-[#1C2541] pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-500 text-sm">
            &copy; {new Date().getFullYear()} AudioPlanet. All rights reserved. @audioplanet_2014
          </p>
          <div className="flex space-x-4 mt-4 md:mt-0 text-sm text-gray-500">
            <Link href="/terms" className="hover:text-white">Terms of Service</Link>
            <Link href="/privacy" className="hover:text-white">Privacy Policy</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
