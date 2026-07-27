"use client";

import { useState, useEffect } from "react";
import { Lock, LogOut, Calendar, Package, MapPin, Phone, Mail, User, Trash2 } from "lucide-react";

interface Booking {
  Timestamp: string;
  BookingId?: string;
  Item: string;
  Quantity: string;
  StartDate: string;
  EndDate: string;
  Location: string;
  ServiceTier: string;
  FullName: string;
  Email: string;
  Phone: string;
  TotalAmount: string;
}

export default function AdminDashboard() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(false);
  
  // Cancellation Modal State
  const [bookingToCancel, setBookingToCancel] = useState<Booking | null>(null);
  const [cancelPassword, setCancelPassword] = useState("");
  const [cancelError, setCancelError] = useState("");
  const [isCancelling, setIsCancelling] = useState(false);

  // Hardcoded password for MVP
  const ADMIN_PASSWORD = "planetadmin";

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      setIsAuthenticated(true);
      setError("");
      fetchBookings();
    } else {
      setError("Incorrect password");
    }
  };

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/bookings");
      const data = await res.json();
      if (data.success) {
        setBookings(data.data);
      }
    } catch (err) {
      console.error("Error fetching bookings:", err);
    }
    setLoading(false);
  };

  const handleCancel = (booking: Booking) => {
    setBookingToCancel(booking);
    setCancelPassword("");
    setCancelError("");
  };

  const confirmCancellation = async () => {
    if (!bookingToCancel) return;
    if (!cancelPassword) {
      setCancelError("Password is required.");
      return;
    }

    setIsCancelling(true);
    setCancelError("");

    try {
      const res = await fetch("/api/admin/bookings", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          bookingId: bookingToCancel.BookingId,
          timestamp: bookingToCancel.Timestamp,
          password: cancelPassword
        })
      });
      const data = await res.json();
      if (data.success) {
        setBookingToCancel(null);
        fetchBookings();
      } else {
        setCancelError(data.error || "Failed to cancel booking");
      }
    } catch (err) {
      console.error("Error cancelling booking:", err);
      setCancelError("Network error. Failed to cancel.");
    }
    
    setIsCancelling(false);
  };

  const formatDate = (isoString: string) => {
    if (!isoString) return "N/A";
    const date = new Date(isoString);
    return date.toLocaleString('en-IN', {
      day: '2-digit', month: 'short', year: 'numeric',
      hour: '2-digit', minute: '2-digit'
    });
  };

  const getEventStatus = (startDateStr: string, endDateStr: string) => {
    if (!startDateStr || !endDateStr) return { label: 'Unknown', color: 'bg-gray-500' };
    
    const now = new Date();
    const start = new Date(startDateStr);
    const end = new Date(endDateStr);
    
    if (now > end) {
      return { label: 'Completed', color: 'bg-green-500/20 text-green-400 border border-green-500/50' };
    } else if (now >= start && now <= end) {
      return { label: 'Ongoing', color: 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/50' };
    } else {
      return { label: 'Upcoming', color: 'bg-[#00F0FF]/20 text-[#00F0FF] border border-[#00F0FF]/50' };
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#050A17] flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-[#0B132B] p-8 rounded-2xl border border-[#1C2541] shadow-2xl">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#1C2541] text-[#00F0FF] mb-4">
              <Lock className="w-8 h-8" />
            </div>
            <h1 className="text-2xl font-bold text-white">Admin Access</h1>
            <p className="text-gray-400 mt-2">Enter the master password to view bookings</p>
          </div>
          
          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-[#050A17] border border-[#1C2541] rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#00F0FF] text-center tracking-widest"
                placeholder="••••••••"
                required
              />
              {error && <p className="text-red-400 text-sm mt-2 text-center">{error}</p>}
            </div>
            <button 
              type="submit" 
              className="w-full bg-[#00F0FF] text-[#0B132B] px-8 py-3 rounded-lg font-bold hover:bg-white transition-all box-glow"
            >
              Unlock Dashboard
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050A17] pt-24 pb-12 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-extrabold text-white">Booking Requests</h1>
            <p className="text-gray-400 mt-1">Live database feed from bookings_database.csv</p>
          </div>
          <button 
            onClick={() => setIsAuthenticated(false)}
            className="flex items-center px-4 py-2 bg-[#1C2541] text-gray-300 rounded-lg hover:bg-red-500/20 hover:text-red-400 transition-colors"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Lock System
          </button>
        </div>

        <div className="bg-[#0B132B] border border-[#1C2541] rounded-2xl overflow-hidden shadow-2xl">
          {loading ? (
            <div className="p-12 text-center text-[#00F0FF] animate-pulse">
              Loading Database...
            </div>
          ) : bookings.length === 0 ? (
            <div className="p-12 text-center text-gray-500">
              <Package className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>No bookings found in the database.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="text-xs text-gray-400 uppercase bg-[#1C2541]">
                  <tr>
                    <th className="px-6 py-4">Received On</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4">Client Details</th>
                    <th className="px-6 py-4">Request</th>
                    <th className="px-6 py-4">Event Dates</th>
                    <th className="px-6 py-4">Logistics</th>
                    <th className="px-6 py-4 text-right">Value</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#1C2541]">
                  {bookings.map((booking, idx) => {
                    const status = getEventStatus(booking.StartDate, booking.EndDate);
                    return (
                      <tr key={idx} className="hover:bg-[#1C2541]/50 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap text-gray-500 text-xs">
                          {formatDate(booking.Timestamp)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold ${status.color}`}>
                            {status.label}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="font-bold text-white flex items-center"><User className="w-3 h-3 mr-1 text-[#00F0FF]"/> {booking.FullName}</div>
                          <div className="text-gray-400 flex items-center mt-1"><Mail className="w-3 h-3 mr-1"/> {booking.Email}</div>
                          <div className="text-gray-400 flex items-center mt-1"><Phone className="w-3 h-3 mr-1"/> {booking.Phone}</div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="font-bold text-[#00F0FF]">{booking.Item}</div>
                          <div className="text-gray-400 text-xs mt-1">Qty: {booking.Quantity}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center"><Calendar className="w-3 h-3 mr-2 text-gray-500"/> {formatDate(booking.StartDate)}</div>
                          <div className="flex items-center mt-1"><Calendar className="w-3 h-3 mr-2 text-gray-500"/> {formatDate(booking.EndDate)}</div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center"><MapPin className="w-3 h-3 mr-1 text-gray-500"/> {booking.Location}</div>
                          <span className="inline-block mt-2 px-2 py-1 bg-[#1C2541] rounded text-xs">{booking.ServiceTier}</span>
                        </td>
                        <td className="px-6 py-4 text-right font-bold text-white text-lg">
                          ₹{Number(booking.TotalAmount).toLocaleString()}
                        </td>
                        <td className="px-6 py-4 text-right">
                          <button
                            onClick={() => handleCancel(booking)}
                            className="p-2 text-gray-500 hover:text-red-400 hover:bg-red-500/10 rounded transition-colors"
                            title="Cancel Booking"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Custom Cancellation Modal */}
      {bookingToCancel && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in">
          <div className="bg-[#0B132B] border border-[#1C2541] rounded-2xl p-8 max-w-md w-full shadow-2xl animate-in zoom-in-95">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-white text-red-500">Cancel Booking</h3>
              <button 
                onClick={() => setBookingToCancel(null)}
                className="text-gray-500 hover:text-white"
              >
                ✕
              </button>
            </div>
            
            <p className="text-gray-300 mb-6 text-sm">
              You are about to cancel the booking for <strong className="text-white">{bookingToCancel.Item}</strong> requested by <strong className="text-white">{bookingToCancel.FullName}</strong>. 
              Please enter the cancellation password to confirm.
            </p>

            {cancelError && (
              <div className="mb-4 p-3 bg-red-500/10 border border-red-500/30 text-red-400 text-sm rounded-lg">
                {cancelError}
              </div>
            )}

            <input
              type="password"
              placeholder="Cancellation Password"
              value={cancelPassword}
              onChange={(e) => setCancelPassword(e.target.value)}
              className="w-full bg-[#050A17] border border-[#1C2541] rounded-lg px-4 py-3 text-white focus:outline-none focus:border-red-500 mb-6"
            />

            <div className="flex gap-4">
              <button
                onClick={() => setBookingToCancel(null)}
                disabled={isCancelling}
                className="flex-1 py-3 bg-[#1C2541] text-white rounded-lg font-bold hover:bg-gray-700 transition-colors"
              >
                Keep Booking
              </button>
              <button
                onClick={confirmCancellation}
                disabled={isCancelling}
                className="flex-1 py-3 bg-red-500 text-white rounded-lg font-bold hover:bg-red-600 transition-colors"
              >
                {isCancelling ? "Processing..." : "Confirm Cancel"}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
