import { Suspense } from "react";
import { BookingFlow } from "@/components/booking/BookingFlow";

export default function QuotePage() {
  return (
    <div className="min-h-screen bg-[#050A17] pt-32 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Request a Quote</h1>
          <p className="text-gray-400 max-w-2xl mx-auto">Fill out the details below to check availability and get an instant estimate for your event.</p>
        </div>
        
        <Suspense fallback={<div className="text-center text-white">Loading...</div>}>
          <BookingFlow />
        </Suspense>
      </div>
    </div>
  );
}
