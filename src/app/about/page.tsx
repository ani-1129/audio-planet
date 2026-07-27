import Link from "next/link";
import { Users, Zap, Shield, Speaker, CheckCircle } from "lucide-react";
import { companyInfo } from "@/data/companyInfo";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[#050A17] pt-24 pb-12 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Section */}
        <div className="text-center mb-16 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <h1 className="text-4xl md:text-6xl font-extrabold text-white mb-6">
            The Sound of <span className="text-[#00F0FF] text-glow">Perfection</span>
          </h1>
          <p className="text-xl max-w-3xl mx-auto leading-relaxed">
            {companyInfo.tagline} We don't just rent equipment; we engineer experiences.
          </p>
        </div>

        {/* Story Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-24">
          <div className="bg-[#1C2541]/30 p-8 rounded-2xl border border-[#1C2541]">
            <h2 className="text-3xl font-bold text-white mb-4">Our Mission</h2>
            <p className="mb-6">
              To democratize access to world-class event technology. Whether you're hosting an intimate 
              corporate gathering or a massive outdoor festival, you deserve the same flawless execution 
              and premium gear used by touring professionals.
            </p>
            <p>
              We pride ourselves on our meticulous maintenance schedule. Every piece of equipment is tested 
              before it leaves our warehouse and after it returns, ensuring 0% failure rate at your event.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-6">
            {[
              { icon: <Speaker className="w-8 h-8 text-[#00F0FF]" />, title: "Premium Gear", desc: "Top-tier brands only" },
              { icon: <Shield className="w-8 h-8 text-[#00F0FF]" />, title: "Reliability", desc: "Tested & certified" },
              { icon: <Users className="w-8 h-8 text-[#00F0FF]" />, title: "Expert Crew", desc: "Trained technicians" },
              { icon: <Zap className="w-8 h-8 text-[#00F0FF]" />, title: "Fast Setup", desc: "On-time delivery" }
            ].map((feature, i) => (
              <div key={i} className="bg-[#0B132B] p-6 rounded-xl border border-[#1C2541] text-center hover:border-[#00F0FF] transition-colors group">
                <div className="flex justify-center mb-4 group-hover:scale-110 transition-transform">{feature.icon}</div>
                <h3 className="text-white font-bold mb-2">{feature.title}</h3>
                <p className="text-sm text-gray-400">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Logistics & Booking Rules */}
        <div className="mb-24">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white">Logistics & Booking Rules</h2>
            <p className="text-gray-400 mt-4">Transparent pricing and clear expectations for every event.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-[#0B132B] p-8 rounded-2xl border border-[#1C2541]">
              <h3 className="text-2xl font-bold text-white mb-6 flex items-center">
                <Zap className="mr-3 text-[#00F0FF]" /> Operational Logistics
              </h3>
              <ul className="space-y-4 text-sm text-gray-300">
                <li><strong className="text-white">Service Area:</strong> {companyInfo.logistics.serviceArea}</li>
                <li><strong className="text-white">Delivery Fee:</strong> ₹{companyInfo.logistics.deliveryFee.within15km} (within 15km) / ₹{companyInfo.logistics.deliveryFee.within30km} (within 30km). {companyInfo.logistics.deliveryFee.beyond} beyond that.</li>
                <li><strong className="text-white">Setup Fee:</strong> ₹{companyInfo.logistics.setupFee.smallEvents} (small), ₹{companyInfo.logistics.setupFee.mediumEvents} (medium), ₹{companyInfo.logistics.setupFee.largeEvents} (large events).</li>
                <li><strong className="text-white">Sound Engineer:</strong> ₹{companyInfo.logistics.staffing.basicEngineer}/day (basic) / ₹{companyInfo.logistics.staffing.seniorFOHEngineer}/day (Senior FOH).</li>
              </ul>
              
              <h4 className="font-bold text-white mt-8 mb-4">Financials & Taxes</h4>
              <ul className="space-y-2 text-sm text-gray-300">
                <li><strong className="text-white">GST:</strong> {companyInfo.financials.taxes.demoGSTRate}% applied on all invoices.</li>
                <li><strong className="text-white">Invoice Format:</strong> {companyInfo.financials.invoiceFormat}</li>
                <li><strong className="text-white">Payment Flow:</strong> {companyInfo.financials.paymentFlow.bookingAdvance}. {companyInfo.financials.paymentFlow.remainingBalance}.</li>
              </ul>
            </div>
            
            <div className="bg-[#0B132B] p-8 rounded-2xl border border-[#1C2541]">
              <h3 className="text-2xl font-bold text-white mb-6 flex items-center">
                <CheckCircle className="mr-3 text-[#00F0FF]" /> Booking Rules
              </h3>
              <ul className="space-y-4 text-sm text-gray-300 mb-8">
                <li><strong className="text-white">Lead Time:</strong> {companyInfo.bookingRules.minLeadTime}</li>
                <li><strong className="text-white">Same-day Booking:</strong> {companyInfo.bookingRules.sameDayBooking}</li>
                <li><strong className="text-white">Inventory:</strong> {companyInfo.bookingRules.inventoryPolicy}</li>
                <li><strong className="text-white">Quotes:</strong> {companyInfo.bookingRules.quoteRequests}</li>
              </ul>

              <h4 className="font-bold text-white mb-4">Cancellation Policy</h4>
              <ul className="space-y-2 text-sm text-gray-300">
                {companyInfo.cancellationPolicy.map((policy, idx) => (
                  <li key={idx} className="flex justify-between border-b border-[#1C2541] pb-2 last:border-0">
                    <span>{policy.period}</span>
                    <strong className="text-white ml-4 text-right">{policy.refund}</strong>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="bg-gradient-to-r from-[#0B132B] to-[#1C2541] rounded-2xl p-12 text-center border border-[#1C2541]">
          <h2 className="text-3xl font-bold text-white mb-4">Ready to elevate your event?</h2>
          <p className="mb-8 max-w-2xl mx-auto">Browse our curated packages or get in touch with our audio engineers for a custom quote.</p>
          <div className="flex justify-center gap-4">
            <Link href="/packages" className="bg-[#00F0FF] text-[#0B132B] px-8 py-3 rounded-lg font-bold hover:bg-white transition-all box-glow">
              View Packages
            </Link>
            <Link href="/contact" className="bg-transparent border-2 border-[#00F0FF] text-[#00F0FF] px-8 py-3 rounded-lg font-bold hover:bg-[#00F0FF] hover:text-[#0B132B] transition-all">
              Contact Us
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}
