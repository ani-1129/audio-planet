"use client";

import { Mail, Phone, MapPin, Clock } from "lucide-react";
import { companyInfo } from "@/data/companyInfo";
import { useState } from "react";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    eventType: 'Corporate Event',
    message: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Construct WhatsApp message
    const waText = `*New Contact Request*
*Name:* ${formData.firstName} ${formData.lastName}
*Email:* ${formData.email}
*Event Type:* ${formData.eventType}
*Message:*
${formData.message}`;
    
    const waUrl = `https://wa.me/918381951053?text=${encodeURIComponent(waText)}`;
    window.open(waUrl, '_blank');
  };

  return (
    <div className="min-h-screen bg-[#050A17] pt-24 pb-12 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-4">Get in Touch</h1>
          <p className="text-xl max-w-2xl mx-auto">Have a complex technical rider or just need advice on which PA to choose? We're here to help.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          
          {/* Contact Info */}
          <div className="space-y-8">
            <h2 className="text-3xl font-bold text-white mb-6">Contact Information</h2>
            
            <div className="flex items-start space-x-4">
              <div className="bg-[#1C2541] p-3 rounded-lg text-[#00F0FF]">
                <MapPin className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-white font-bold text-lg">Warehouse Location</h3>
                <p className="text-gray-400 mt-1">{companyInfo.contact.warehouseAddress}</p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="bg-[#1C2541] p-3 rounded-lg text-[#00F0FF]">
                <Phone className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-white font-bold text-lg">Phone</h3>
                <p className="text-gray-400 mt-1">{companyInfo.contact.phone}</p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="bg-[#1C2541] p-3 rounded-lg text-[#00F0FF]">
                <Mail className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-white font-bold text-lg">Email</h3>
                <p className="text-gray-400 mt-1">
                  <span className="block">Sales: {companyInfo.contact.salesEmail}</span>
                  <span className="block">Support: {companyInfo.contact.supportEmail}</span>
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="bg-[#1C2541] p-3 rounded-lg text-[#00F0FF]">
                <Clock className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-white font-bold text-lg">Business Hours</h3>
                <p className="text-gray-400 mt-1">Monday - Saturday: 9:00 AM - 8:00 PM<br/>Sunday: Emergency Support Only</p>
              </div>
            </div>

            <div className="pt-6 border-t border-[#1C2541]">
              <h3 className="text-white font-bold text-lg mb-4">Follow Us</h3>
              <div className="flex space-x-4">
                <a href={companyInfo.socialMedia.instagram} target="_blank" rel="noopener noreferrer" className="bg-[#1C2541] px-4 py-2 rounded-lg text-sm font-bold text-gray-300 hover:text-[#0B132B] hover:bg-[#00F0FF] transition-colors">
                  Instagram
                </a>
                <a href={companyInfo.socialMedia.facebook} target="_blank" rel="noopener noreferrer" className="bg-[#1C2541] px-4 py-2 rounded-lg text-sm font-bold text-gray-300 hover:text-[#0B132B] hover:bg-[#00F0FF] transition-colors">
                  Facebook
                </a>
                <a href={companyInfo.socialMedia.youtube} target="_blank" rel="noopener noreferrer" className="bg-[#1C2541] px-4 py-2 rounded-lg text-sm font-bold text-gray-300 hover:text-[#0B132B] hover:bg-[#00F0FF] transition-colors">
                  YouTube
                </a>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-[#0B132B] p-8 rounded-2xl border border-[#1C2541]">
            <h2 className="text-2xl font-bold text-white mb-6">Send us a message</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">First Name</label>
                  <input 
                    type="text" 
                    value={formData.firstName}
                    onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                    className="w-full bg-[#050A17] border border-[#1C2541] rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#00F0FF]" 
                    placeholder="John" 
                    required 
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Last Name</label>
                  <input 
                    type="text" 
                    value={formData.lastName}
                    onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                    className="w-full bg-[#050A17] border border-[#1C2541] rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#00F0FF]" 
                    placeholder="Doe" 
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Email Address</label>
                <input 
                  type="email" 
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  className="w-full bg-[#050A17] border border-[#1C2541] rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#00F0FF]" 
                  placeholder="john@example.com" 
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Event Type</label>
                <select 
                  value={formData.eventType}
                  onChange={(e) => setFormData({...formData, eventType: e.target.value})}
                  className="w-full bg-[#050A17] border border-[#1C2541] rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#00F0FF] appearance-none"
                >
                  <option>Corporate Event</option>
                  <option>Wedding</option>
                  <option>Live Concert / Festival</option>
                  <option>Private Party</option>
                  <option>Other</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Message</label>
                <textarea 
                  rows={4} 
                  value={formData.message}
                  onChange={(e) => setFormData({...formData, message: e.target.value})}
                  className="w-full bg-[#050A17] border border-[#1C2541] rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#00F0FF]" 
                  placeholder="Tell us about your requirements..."
                  required
                ></textarea>
              </div>
              
              <div className="flex items-start">
                <input type="checkbox" id="liability" className="mt-1 mr-3 rounded border-[#1C2541] bg-[#050A17] accent-[#00F0FF]" required />
                <label htmlFor="liability" className="text-xs text-gray-400">
                  I accept the liability waiver and understand that the customer is responsible for loss, theft, or damage during the rental period.
                </label>
              </div>

              <button type="submit" className="w-full bg-[#00F0FF] text-[#0B132B] px-8 py-4 rounded-lg font-bold hover:bg-white transition-all box-glow">
                Send Message
              </button>
            </form>
          </div>
        </div>

        {/* Legal Policies */}
        <div className="bg-[#1C2541]/30 p-8 rounded-2xl border border-[#1C2541]">
          <h2 className="text-2xl font-bold text-white mb-8">Policies & Legal</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-lg font-bold text-white mb-4 text-[#00F0FF]">Terms of Service</h3>
              <ul className="list-disc list-outside ml-4 space-y-2 text-sm text-gray-400">
                {companyInfo.legal.termsOfService.map((term, i) => (
                  <li key={i}>{term}</li>
                ))}
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-bold text-white mb-4 text-[#00F0FF]">Privacy Policy</h3>
              <ul className="list-disc list-outside ml-4 space-y-2 text-sm text-gray-400">
                {companyInfo.legal.privacyPolicy.map((policy, i) => (
                  <li key={i}>{policy}</li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-bold text-white mb-4 text-[#00F0FF]">Rental Agreement</h3>
              <ul className="list-disc list-outside ml-4 space-y-2 text-sm text-gray-400">
                {companyInfo.legal.rentalAgreement.map((agreement, i) => (
                  <li key={i}>{agreement}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
