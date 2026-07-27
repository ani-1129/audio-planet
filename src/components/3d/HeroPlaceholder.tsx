import Link from "next/link";
import { Speaker, Zap } from "lucide-react";

export function HeroPlaceholder() {
  return (
    <div className="relative w-full min-h-[90vh] bg-[#0B132B] flex items-center justify-center overflow-hidden pt-20">
      {/* Background gradients */}
      <div className="absolute inset-0 bg-[#0B132B]" />
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#00F0FF] rounded-full mix-blend-screen filter blur-[128px] opacity-20 animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-[#1C2541] rounded-full mix-blend-screen filter blur-[128px] opacity-40" />
      
      {/* Grid Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1C2541_1px,transparent_1px),linear-gradient(to_bottom,#1C2541_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-30" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center flex flex-col items-center">
        <div className="inline-flex items-center space-x-2 bg-[#1C2541]/50 border border-[#1C2541] rounded-full px-4 py-1.5 mb-8 backdrop-blur-sm">
          <span className="flex h-2 w-2 rounded-full bg-[#00F0FF] animate-pulse"></span>
          <span className="text-xs font-medium text-gray-300 uppercase tracking-wider">Delhi NCR's Premier Rental</span>
        </div>
        
        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6">
          Elevate Your <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00F0FF] to-white text-glow">
            Event Experience
          </span>
        </h1>
        
        <p className="mt-4 text-xl md:text-2xl text-gray-400 max-w-3xl mx-auto mb-10 leading-relaxed">
          Full-system sound, dynamic lighting & robust trussing rentals. <br className="hidden md:block"/>
          We deliver, setup, and support. You focus on the show.
        </p>
        
        <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-6 justify-center">
          <Link href="/catalog" className="inline-flex justify-center items-center px-8 py-4 text-base font-bold text-[#0B132B] bg-[#00F0FF] rounded-lg hover:bg-white hover:scale-105 transition-all duration-200 box-glow">
            <Speaker className="w-5 h-5 mr-2" />
            Browse Equipment
          </Link>
          <Link href="/quote" className="inline-flex justify-center items-center px-8 py-4 text-base font-bold text-white bg-transparent border-2 border-[#1C2541] rounded-lg hover:border-[#00F0FF] hover:bg-[#1C2541]/30 transition-all duration-200">
            <Zap className="w-5 h-5 mr-2 text-[#00F0FF]" />
            Get a Quote / Book Now
          </Link>
        </div>
      </div>
    </div>
  );
}
