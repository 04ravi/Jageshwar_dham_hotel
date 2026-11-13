'use client';

import React, { useState } from 'react';
import { useHotel } from '@/context/HotelContext';

interface EnquiryModalProps {
  onClose: () => void;
}

export default function EnquiryModal({ onClose }: EnquiryModalProps) {
  const { addEnquiry } = useHotel();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [dates, setDates] = useState('');
  const [guests, setGuests] = useState('4-6 Guests');
  const [service, setService] = useState('Temple Darshan & Accommodation');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !phone) {
      alert('Please provide your name and phone number.');
      return;
    }

    addEnquiry({
      name,
      email,
      phone,
      dates,
      guests,
      serviceRequested: service,
      message
    });

    setSubmitted(true);
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl border border-stone-200">
        <div className="bg-[#0B2B20] text-white p-5 flex justify-between items-center">
          <div>
            <h3 className="font-serif font-bold text-lg">Send General Enquiry / Custom Request</h3>
            <p className="text-xs text-emerald-300">Temple Pujas • Large Spiritual Groups • Custom Treks</p>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-xs font-bold"
          >
            ✕
          </button>
        </div>

        {submitted ? (
          <div className="p-8 text-center space-y-4">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-800 text-3xl rounded-full flex items-center justify-center mx-auto">
              ✓
            </div>
            <h4 className="font-serif font-bold text-xl text-[#0B2B20]">Enquiry Received Successfully!</h4>
            <p className="text-xs text-stone-600 max-w-sm mx-auto leading-relaxed">
              Our front desk manager at Jageshwar Dham has received your request. We will contact you on WhatsApp / Phone (<strong>{phone}</strong>) within 2 hours.
            </p>
            <button
              onClick={onClose}
              className="mt-4 bg-[#0B2B20] text-white text-xs font-bold px-6 py-2.5 rounded-xl hover:bg-[#164E3D]"
            >
              Close Window
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-bold text-stone-700 mb-1">Your Full Name *</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Ramesh Chandra"
                  className="w-full p-2.5 border rounded-lg bg-stone-50 focus:outline-[#0B2B20]"
                />
              </div>

              <div>
                <label className="block font-bold text-stone-700 mb-1">WhatsApp / Phone *</label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+91 98765 XXXXX"
                  className="w-full p-2.5 border rounded-lg bg-stone-50 focus:outline-[#0B2B20]"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-bold text-stone-700 mb-1">Email Address</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="yourname@gmail.com"
                  className="w-full p-2.5 border rounded-lg bg-stone-50 focus:outline-[#0B2B20]"
                />
              </div>

              <div>
                <label className="block font-bold text-stone-700 mb-1">Tentative Dates</label>
                <input
                  type="text"
                  value={dates}
                  onChange={(e) => setDates(e.target.value)}
                  placeholder="e.g. 20-24 Dec"
                  className="w-full p-2.5 border rounded-lg bg-stone-50 focus:outline-[#0B2B20]"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-bold text-stone-700 mb-1">Number of People</label>
                <select
                  value={guests}
                  onChange={(e) => setGuests(e.target.value)}
                  className="w-full p-2.5 border rounded-lg bg-stone-50 focus:outline-[#0B2B20]"
                >
                  <option>1-2 Guests</option>
                  <option>3-5 Guests</option>
                  <option>6-10 Guests (Group)</option>
                  <option>10+ Guests (Tour / Pilgrimage Group)</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-stone-700 mb-1">Primary Interest</label>
                <select
                  value={service}
                  onChange={(e) => setService(e.target.value)}
                  className="w-full p-2.5 border rounded-lg bg-stone-50 focus:outline-[#0B2B20]"
                >
                  <option>Temple Darshan & Accommodation</option>
                  <option>Special Rudrabhishek / Mahamrityunjaya Puja</option>
                  <option>Kathgodam / Pantnagar Mountain Cab</option>
                  <option>Vridh Jageshwar Trekking Guide</option>
                  <option>Complete Customized Hill Package</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block font-bold text-stone-700 mb-1">Additional Requirements / Notes</label>
              <textarea
                rows={3}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Mention special meal preferences (pure satvik), elderly members requiring ground floor, or cab pickup timing..."
                className="w-full p-2.5 border rounded-lg bg-stone-50 focus:outline-[#0B2B20]"
              ></textarea>
            </div>

            <div className="pt-2 flex justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 border rounded-xl font-bold text-stone-600 hover:bg-stone-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2 bg-[#0B2B20] hover:bg-[#164E3D] text-white font-bold rounded-xl shadow-md transition"
              >
                Submit Enquiry
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
