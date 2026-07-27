"use client";

import { useState, useEffect, useRef } from "react";
import { useSearchParams } from "next/navigation";
import { Calendar, MapPin, Package, CheckCircle, Truck, User, Plus, Minus, X, Search, ChevronDown, LogIn } from "lucide-react";
import { preMadePackages } from "@/data/packages";
import { inventory } from "@/data/inventory";
import { useAuthStore } from "@/stores/authStore";

interface SelectedItem {
  id: string;
  name: string;
  price: number;
  type: 'package' | 'item';
  quantity: number;
}

export function BookingFlow() {
  const [step, setStep] = useState(1);
  const searchParams = useSearchParams();
  const { user, openAuthModal } = useAuthStore();
  
  // All available options
  const allOptions = [
    ...preMadePackages.map(pkg => ({ id: pkg.id, name: pkg.name, price: pkg.demoPricePerDay, type: 'package' as const })),
    ...inventory.map(item => ({ id: item.id, name: item.name, price: item.pricing.day, type: 'item' as const }))
  ];

  const [selectedItems, setSelectedItems] = useState<SelectedItem[]>([]);
  const [serviceCost, setServiceCost] = useState(2000);
  const [searchQuery, setSearchQuery] = useState('');
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  
  // Form State
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [location, setLocation] = useState('');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');

  // Pre-select item from URL params
  useEffect(() => {
    const pkgId = searchParams?.get('package');
    const itemId = searchParams?.get('item');
    const targetId = pkgId || itemId;
    
    if (targetId && selectedItems.length === 0) {
      const opt = allOptions.find(o => o.id === targetId);
      if (opt) {
        setSelectedItems([{ ...opt, quantity: 1 }]);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  // Auto-fill contact info from signed-in user
  useEffect(() => {
    if (user) {
      setFullName(user.fullName);
      setEmail(user.email);
      setPhone(user.phone);
    }
  }, [user]);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const addItem = (opt: typeof allOptions[0]) => {
    if (selectedItems.find(s => s.id === opt.id)) return; // already added
    setSelectedItems(prev => [...prev, { ...opt, quantity: 1 }]);
    setSearchQuery('');
    setDropdownOpen(false);
  };

  const removeItem = (id: string) => {
    setSelectedItems(prev => prev.filter(s => s.id !== id));
  };

  const updateQuantity = (id: string, delta: number) => {
    setSelectedItems(prev => prev.map(item =>
      item.id === id ? { ...item, quantity: Math.max(1, item.quantity + delta) } : item
    ));
  };

  const filteredOptions = allOptions.filter(opt =>
    !selectedItems.find(s => s.id === opt.id) &&
    opt.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const [validationError, setValidationError] = useState('');

  const nextStep = () => {
    setValidationError('');
    
    if (step === 1 && selectedItems.length === 0) {
      setValidationError("Please select at least one equipment item or package to proceed.");
      return;
    }
    
    if (step === 2) {
      if (!startDate || !endDate) {
        setValidationError("Please select both a start date and an end date.");
        return;
      }
      if (new Date(startDate) >= new Date(endDate)) {
        setValidationError("The end date must be after the start date.");
        return;
      }
    }
    
    if (step === 3) {
      if (!location.trim()) {
        setValidationError("Please provide your event location.");
        return;
      }
      if (!fullName.trim() || !email.trim() || !phone.trim()) {
        setValidationError("Please complete all contact information fields so we can reach you.");
        return;
      }
    }

    setStep((prev) => Math.min(prev + 1, 4));
  };
  const prevStep = () => setStep((prev) => Math.max(prev - 1, 1));
  
  const subtotal = selectedItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const total = subtotal + serviceCost;
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [submitMessage, setSubmitMessage] = useState('');

  const handleBookingSubmit = async () => {
    // Require sign-in before booking
    if (!user) {
      openAuthModal();
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus('idle');
    setSubmitMessage('');

    try {
      const res = await fetch('/api/bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          items: selectedItems.map(item => ({
            id: item.id,
            name: item.name,
            quantity: item.quantity,
            price: item.price,
          })),
          startDate,
          endDate,
          location,
          serviceCost,
          fullName,
          email,
          phone,
          total
        })
      });

      const data = await res.json();
      
      if (data.success) {
        setSubmitStatus('success');
        setSubmitMessage(`Booking ${data.bookingId || ''} confirmed! The confirmation details have been automatically logged to the owner.`);
      } else {
        setSubmitStatus('error');
        setSubmitMessage(data.error || 'Failed to complete booking. Please try again.');
      }
    } catch (e) {
      console.error("Failed to log booking to CSV database:", e);
      setSubmitStatus('error');
      setSubmitMessage('Network error. Please try again.');
    }
    
    setIsSubmitting(false);
  };

  // If success, show success screen
  if (submitStatus === 'success') {
    return (
      <div className="max-w-4xl mx-auto bg-[#0B132B] border border-green-500/50 rounded-2xl overflow-hidden shadow-2xl p-12 text-center animate-in zoom-in duration-500">
        <div className="w-20 h-20 bg-green-500/20 text-green-400 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="w-10 h-10" />
        </div>
        <h2 className="text-3xl font-bold text-white mb-4">Booking Confirmed!</h2>
        <p className="text-gray-300 text-lg mb-4 max-w-xl mx-auto">{submitMessage}</p>
        <div className="bg-[#050A17] border border-[#1C2541] rounded-lg p-4 mb-8 max-w-md mx-auto">
          <p className="text-sm text-gray-400 mb-2">Items booked:</p>
          {selectedItems.map(item => (
            <div key={item.id} className="flex justify-between text-sm py-1">
              <span className="text-white">{item.name} <span className="text-gray-500">×{item.quantity}</span></span>
              <span className="text-[#00F0FF]">₹{(item.price * item.quantity).toLocaleString()}</span>
            </div>
          ))}
        </div>
        <button 
          onClick={() => window.location.href = '/'}
          className="px-8 py-3 bg-[#00F0FF] text-[#0B132B] rounded-lg font-bold hover:bg-white transition-colors box-glow"
        >
          Return Home
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto bg-[#0B132B] border border-[#1C2541] rounded-2xl overflow-hidden shadow-2xl">
      {/* Progress Bar */}
      <div className="flex bg-[#1C2541]/50 border-b border-[#1C2541]">
        {["Items", "Schedule", "Location", "Review"].map((label, i) => (
          <div key={label} className={`flex-1 py-4 text-center text-sm font-bold ${step === i + 1 ? "text-[#00F0FF] border-b-2 border-[#00F0FF]" : "text-gray-500"}`}>
            {i + 1}. {label}
          </div>
        ))}
      </div>

      <div className="p-8">
        {submitStatus === 'error' && (
          <div className="bg-red-500/10 border border-red-500/50 text-red-400 p-4 rounded-lg mb-6 flex items-center animate-in slide-in-from-top-2">
            <span className="font-bold mr-2">Error:</span> {submitMessage}
          </div>
        )}

        {validationError && (
          <div className="bg-orange-500/10 border border-orange-500/50 text-orange-400 p-4 rounded-lg mb-6 flex items-center animate-in slide-in-from-top-2">
            <span className="font-bold mr-2">Please fix:</span> {validationError}
          </div>
        )}

        {step === 1 && (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
            <h2 className="text-2xl font-bold mb-4 flex items-center"><Package className="mr-3 text-[#00F0FF]" /> Select Equipment & Packages</h2>
            
            {/* Multi-select searchable dropdown */}
            <div ref={dropdownRef} className="relative">
              <label className="block text-sm font-medium text-gray-400 mb-2">Add equipment or packages to your quote</label>
              <div 
                className="w-full bg-[#050A17] border border-[#1C2541] rounded-lg px-4 py-3 text-white focus-within:border-[#00F0FF] transition-colors cursor-text flex items-center gap-2"
                onClick={() => setDropdownOpen(true)}
              >
                <Search className="w-4 h-4 text-gray-500 shrink-0" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => { setSearchQuery(e.target.value); setDropdownOpen(true); }}
                  onFocus={() => setDropdownOpen(true)}
                  placeholder={selectedItems.length > 0 ? "Add more items..." : "Search speakers, lights, packages..."}
                  className="bg-transparent outline-none flex-1 text-white placeholder-gray-500"
                />
                <ChevronDown className={`w-4 h-4 text-gray-500 shrink-0 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} />
              </div>

              {/* Dropdown list */}
              {dropdownOpen && (
                <div className="absolute z-50 w-full mt-2 bg-[#0B132B] border border-[#1C2541] rounded-lg shadow-2xl max-h-64 overflow-y-auto">
                  {/* Packages section */}
                  {filteredOptions.filter(o => o.type === 'package').length > 0 && (
                    <>
                      <div className="px-4 py-2 text-xs font-bold text-[#00F0FF] uppercase tracking-wider bg-[#1C2541]/30 sticky top-0">
                        Pre-made Packages
                      </div>
                      {filteredOptions.filter(o => o.type === 'package').map(opt => (
                        <button
                          key={opt.id}
                          onClick={() => addItem(opt)}
                          className="w-full text-left px-4 py-3 hover:bg-[#1C2541]/50 transition-colors flex justify-between items-center group"
                        >
                          <span className="text-gray-300 group-hover:text-white transition-colors">{opt.name}</span>
                          <span className="flex items-center gap-2">
                            <span className="text-[#00F0FF] text-sm font-medium">₹{opt.price.toLocaleString()}/day</span>
                            <Plus className="w-4 h-4 text-gray-600 group-hover:text-[#00F0FF] transition-colors" />
                          </span>
                        </button>
                      ))}
                    </>
                  )}

                  {/* Individual items section */}
                  {filteredOptions.filter(o => o.type === 'item').length > 0 && (
                    <>
                      <div className="px-4 py-2 text-xs font-bold text-[#00F0FF] uppercase tracking-wider bg-[#1C2541]/30 sticky top-0">
                        Individual Equipment
                      </div>
                      {filteredOptions.filter(o => o.type === 'item').map(opt => (
                        <button
                          key={opt.id}
                          onClick={() => addItem(opt)}
                          className="w-full text-left px-4 py-3 hover:bg-[#1C2541]/50 transition-colors flex justify-between items-center group"
                        >
                          <span className="text-gray-300 group-hover:text-white transition-colors">{opt.name}</span>
                          <span className="flex items-center gap-2">
                            <span className="text-[#00F0FF] text-sm font-medium">₹{opt.price.toLocaleString()}/day</span>
                            <Plus className="w-4 h-4 text-gray-600 group-hover:text-[#00F0FF] transition-colors" />
                          </span>
                        </button>
                      ))}
                    </>
                  )}

                  {filteredOptions.length === 0 && (
                    <div className="px-4 py-6 text-center text-gray-500 text-sm">
                      {searchQuery ? 'No matching items found' : 'All items have been selected'}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Selected items list */}
            {selectedItems.length > 0 ? (
              <div className="space-y-3">
                <p className="text-sm text-gray-400 font-medium">{selectedItems.length} item{selectedItems.length > 1 ? 's' : ''} selected</p>
                {selectedItems.map(item => (
                  <div
                    key={item.id}
                    className="bg-[#050A17] p-4 rounded-lg border border-[#1C2541] flex justify-between items-center gap-4 animate-in fade-in slide-in-from-top-2 duration-200"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${
                          item.type === 'package' 
                            ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30' 
                            : 'bg-[#00F0FF]/10 text-[#00F0FF] border border-[#00F0FF]/30'
                        }`}>
                          {item.type === 'package' ? 'Package' : 'Item'}
                        </span>
                        <p className="font-bold text-white truncate">{item.name}</p>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">₹{item.price.toLocaleString()}/day each</p>
                    </div>

                    <div className="flex items-center gap-3 shrink-0">
                      <div className="flex items-center">
                        <button 
                          onClick={() => updateQuantity(item.id, -1)}
                          className="p-1.5 bg-[#1C2541] rounded-l text-gray-300 hover:text-white hover:bg-[#00F0FF]/20 transition-colors"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="px-3 py-1 bg-[#1C2541]/50 font-semibold text-sm text-white min-w-[36px] text-center">{item.quantity}</span>
                        <button 
                          onClick={() => updateQuantity(item.id, 1)}
                          className="p-1.5 bg-[#1C2541] rounded-r text-gray-300 hover:text-white hover:bg-[#00F0FF]/20 transition-colors"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <span className="text-[#00F0FF] font-bold text-sm min-w-[80px] text-right">
                        ₹{(item.price * item.quantity).toLocaleString()}
                      </span>

                      <button 
                        onClick={() => removeItem(item.id)}
                        className="p-1.5 text-gray-600 hover:text-red-400 hover:bg-red-500/10 rounded transition-colors"
                        title="Remove"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}

                {/* Running subtotal */}
                <div className="flex justify-between items-center pt-4 border-t border-[#1C2541]">
                  <span className="text-gray-400 font-medium">Equipment Subtotal</span>
                  <span className="text-[#00F0FF] font-bold text-xl">₹{subtotal.toLocaleString()} <span className="text-sm font-normal text-gray-400">/ day</span></span>
                </div>
              </div>
            ) : (
              <div className="bg-[#050A17] p-8 rounded-lg border border-dashed border-[#1C2541] text-center">
                <Package className="w-10 h-10 text-gray-600 mx-auto mb-3" />
                <p className="text-gray-500 text-sm">No items selected yet. Use the search above to add equipment or packages to your quote.</p>
              </div>
            )}
          </div>
        )}

        {step === 2 && (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
            <h2 className="text-2xl font-bold mb-4 flex items-center"><Calendar className="mr-3 text-[#00F0FF]" /> Event Schedule</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Start Date & Time</label>
                <input 
                  type="datetime-local" 
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full bg-[#050A17] border border-[#1C2541] rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#00F0FF]" 
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">End Date & Time</label>
                <input 
                  type="datetime-local" 
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-full bg-[#050A17] border border-[#1C2541] rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#00F0FF]" 
                />
              </div>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
            <h2 className="text-2xl font-bold mb-4 flex items-center"><MapPin className="mr-3 text-[#00F0FF]" /> Logistics & Contact</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Event Location (Delhi NCR)</label>
                <div>
                  <input 
                    type="text" 
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="Search address..." 
                    autoComplete="street-address"
                    className="w-full bg-[#050A17] border border-[#1C2541] rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#00F0FF]" 
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Service Level</label>
                <select 
                  value={serviceCost}
                  onChange={(e) => setServiceCost(Number(e.target.value))}
                  className="w-full bg-[#050A17] border border-[#1C2541] rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#00F0FF] appearance-none"
                >
                  <option value={2000}>Delivery Only (₹2,000)</option>
                  <option value={5000}>Delivery + Setup (₹5,000)</option>
                  <option value={10000}>Full Service + Tech (₹10,000)</option>
                </select>
              </div>
            </div>
            <h3 className="text-lg font-bold mb-4 border-t border-[#1C2541] pt-6 flex items-center"><User className="mr-2 w-5 h-5 text-[#00F0FF]" /> Contact Info</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
               <input 
                 type="text" 
                 value={fullName}
                 onChange={(e) => setFullName(e.target.value)}
                 placeholder="Full Name" 
                 className="w-full bg-[#050A17] border border-[#1C2541] rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#00F0FF]" 
               />
               <input 
                 type="email" 
                 value={email}
                 onChange={(e) => setEmail(e.target.value)}
                 placeholder="Email Address" 
                 className="w-full bg-[#050A17] border border-[#1C2541] rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#00F0FF]" 
               />
               <input 
                 type="tel" 
                 value={phone}
                 onChange={(e) => setPhone(e.target.value)}
                 placeholder="Phone Number" 
                 className="w-full bg-[#050A17] border border-[#1C2541] rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#00F0FF]" 
               />
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
            <h2 className="text-2xl font-bold mb-4 flex items-center"><CheckCircle className="mr-3 text-[#00F0FF]" /> Review & Confirm</h2>
            <div className="bg-[#050A17] border border-[#1C2541] rounded-lg p-6 space-y-4">
              {/* Individual item breakdown */}
              <div className="space-y-2 pb-4 border-b border-[#1C2541]">
                <span className="text-gray-400 text-sm font-medium">Equipment & Packages</span>
                {selectedItems.map(item => (
                  <div key={item.id} className="flex justify-between items-center py-1">
                    <div>
                      <span className="text-white text-sm">{item.name}</span>
                      <span className="text-gray-500 text-xs ml-2">×{item.quantity}</span>
                    </div>
                    <span className="font-medium text-sm text-gray-300">₹{(item.price * item.quantity).toLocaleString()}</span>
                  </div>
                ))}
              </div>
              <div className="flex justify-between pb-4 border-b border-[#1C2541]">
                <span className="text-gray-400">Equipment Subtotal</span>
                <span className="font-bold">₹{subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between pb-4 border-b border-[#1C2541]">
                <span className="text-gray-400">Delivery & Setup</span>
                <span className="font-bold">₹{serviceCost.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-xl">
                <span className="font-bold text-white">Estimated Total</span>
                <span className="font-bold text-[#00F0FF]">₹{total.toLocaleString()}</span>
              </div>
              <p className="text-xs text-gray-500 text-right">Taxes applied at checkout</p>
            </div>

            {/* Contact summary */}
            <div className="bg-[#050A17] border border-[#1C2541] rounded-lg p-4 grid grid-cols-2 gap-3 text-sm">
              <div>
                <span className="text-gray-500 text-xs block">Name</span>
                <span className="text-white">{fullName}</span>
              </div>
              <div>
                <span className="text-gray-500 text-xs block">Email</span>
                <span className="text-white">{email}</span>
              </div>
              <div>
                <span className="text-gray-500 text-xs block">Phone</span>
                <span className="text-white">{phone}</span>
              </div>
              <div>
                <span className="text-gray-500 text-xs block">Location</span>
                <span className="text-white">{location}</span>
              </div>
              <div>
                <span className="text-gray-500 text-xs block">Event Dates</span>
                <span className="text-white text-xs">{startDate} → {endDate}</span>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="px-8 py-6 bg-[#050A17] border-t border-[#1C2541] flex justify-between items-center">
        <button 
          onClick={prevStep}
          disabled={step === 1 || isSubmitting}
          className={`px-6 py-3 rounded-lg font-bold transition-colors ${step === 1 ? 'opacity-0 cursor-default' : 'bg-[#1C2541] text-white hover:bg-white hover:text-[#0B132B]'}`}
        >
          Back
        </button>
        <button 
          onClick={step === 4 ? handleBookingSubmit : nextStep}
          disabled={isSubmitting}
          className={`px-8 py-3 bg-[#00F0FF] text-[#0B132B] rounded-lg font-bold transition-colors box-glow ${isSubmitting ? 'opacity-70 cursor-wait' : 'hover:bg-white'}`}
        >
          {step === 4 ? (
            isSubmitting ? "Processing..." : (
              user ? "Confirm Booking" : (
                <span className="flex items-center gap-2">
                  <LogIn className="w-4 h-4" />
                  Sign In to Book
                </span>
              )
            )
          ) : "Next Step"}
        </button>
      </div>
    </div>
  );
}
