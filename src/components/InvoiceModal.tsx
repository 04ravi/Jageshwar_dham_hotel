'use client';

import React from 'react';
import { Booking } from '@/data/mockData';

interface InvoiceModalProps {
  booking: Booking;
  onClose: () => void;
}

export default function InvoiceModal({ booking, onClose }: InvoiceModalProps) {
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl border border-[#EAE5DE] my-8 flex flex-col max-h-[90vh]">
        {/* MODAL ACTION BAR */}
        <div className="bg-[#0B2B20] text-white px-6 py-3 flex justify-between items-center print:hidden">
          <div className="flex items-center gap-2">
            <span className="text-amber-300 text-lg">📄</span>
            <span className="font-bold text-sm">Official Tax Invoice & Guest Folio</span>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handlePrint}
              className="bg-[#C59B27] hover:bg-[#d6a933] text-stone-950 font-bold text-xs px-3.5 py-1.5 rounded-lg shadow-sm transition flex items-center gap-1.5"
            >
              <span>🖨️ Print / Download PDF</span>
            </button>
            <button
              onClick={onClose}
              className="w-7 h-7 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-xs font-bold transition"
            >
              ✕
            </button>
          </div>
        </div>

        {/* PRINTABLE INVOICE CONTENT */}
        <div id="printable-invoice" className="p-8 overflow-y-auto space-y-6 text-stone-900 bg-white">
          {/* HEADER */}
          <div className="flex justify-between items-start border-b border-stone-200 pb-6">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-2xl">🌲</span>
                <span className="font-serif text-2xl font-bold text-[#0B2B20]">Jageshwar Dham Retreat</span>
              </div>
              <p className="text-xs text-stone-500 mt-1 max-w-xs leading-relaxed">
                Main Temple Road, Near Dandeshwar Shrine, Jageshwar Dham, Almora, Uttarakhand 263623
              </p>
              <p className="text-xs text-stone-500 mt-0.5">GSTIN: 05AAACH8821K1ZZ • Phone: +91 98765 43210</p>
            </div>

            <div className="text-right">
              <span className="text-xs uppercase tracking-widest font-bold text-[#C59B27] block">TAX INVOICE</span>
              <span className="text-lg font-black text-[#0B2B20] block mt-0.5">{booking.bookingNumber}</span>
              <span className="text-xs text-stone-500 block mt-1">
                Date: {new Date(booking.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
              </span>
              <span className="inline-block mt-2 text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-900 border border-emerald-300">
                Status: {booking.bookingStatus}
              </span>
            </div>
          </div>

          {/* GUEST & STAY METADATA */}
          <div className="grid grid-cols-2 gap-4 bg-[#FAF8F5] p-4 rounded-xl border border-[#EAE5DE] text-xs">
            <div className="space-y-1">
              <span className="text-[10px] font-bold uppercase text-stone-400 tracking-wider block">Billed To (Primary Guest)</span>
              <p className="font-bold text-stone-900 text-sm">{booking.guestName}</p>
              <p className="text-stone-600">📱 {booking.guestPhone}</p>
              <p className="text-stone-600">✉️ {booking.guestEmail}</p>
              {booking.idProofName && (
                <p className="text-stone-500 text-[11px] mt-1">🪪 ID Proof Verified: {booking.idProofName}</p>
              )}
            </div>

            <div className="space-y-1 text-right">
              <span className="text-[10px] font-bold uppercase text-stone-400 tracking-wider block">Stay Details</span>
              <p className="text-stone-800 font-semibold">Check-In: <strong>{booking.checkIn}</strong> (12:00 PM)</p>
              <p className="text-stone-800 font-semibold">Check-Out: <strong>{booking.checkOut}</strong> (10:00 AM)</p>
              <p className="text-stone-600">Total Duration: <strong>{booking.nights} Night(s)</strong></p>
              <p className="text-stone-600">Occupancy: {booking.adults} Adults, {booking.children} Children</p>
            </div>
          </div>

          {/* ITEMIZED SERVICES TABLE */}
          <div className="space-y-2">
            <span className="text-xs font-bold text-[#0B2B20] uppercase tracking-wider block">Charges Breakdown</span>
            <table className="w-full text-left text-xs border border-stone-200 rounded-lg overflow-hidden">
              <thead className="bg-stone-100 text-stone-600 font-bold uppercase text-[10px]">
                <tr>
                  <th className="p-3">Item / Service Description</th>
                  <th className="p-3 text-center">Qty / Nights</th>
                  <th className="p-3 text-right">Unit Rate</th>
                  <th className="p-3 text-right">Total (₹)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100 text-stone-700">
                {/* Room */}
                <tr>
                  <td className="p-3">
                    <strong className="text-stone-900 block">{booking.room.name}</strong>
                    <span className="text-[11px] text-stone-500">
                      Category: {booking.room.category} • Temple Distance: {booking.room.distanceFromTemple}
                    </span>
                  </td>
                  <td className="p-3 text-center">{booking.nights} Night(s)</td>
                  <td className="p-3 text-right">₹{booking.room.pricePerNight}</td>
                  <td className="p-3 text-right font-bold text-stone-900">₹{booking.roomAmount.toLocaleString('en-IN')}</td>
                </tr>

                {/* Taxi */}
                {booking.taxi && (
                  <tr>
                    <td className="p-3">
                      <strong className="text-stone-900 block">
                        Mountain Cab Transfer ({booking.taxi.vehicle})
                      </strong>
                      <span className="text-[11px] text-stone-500">
                        Route: {booking.taxi.route.from} ➔ {booking.taxi.route.to} ({booking.taxi.route.distance})
                      </span>
                    </td>
                    <td className="p-3 text-center">1 Trip</td>
                    <td className="p-3 text-right">₹{booking.taxiAmount}</td>
                    <td className="p-3 text-right font-bold text-stone-900">₹{booking.taxiAmount.toLocaleString('en-IN')}</td>
                  </tr>
                )}

                {/* Food Items */}
                {booking.foodItems && booking.foodItems.map((fi, idx) => (
                  <tr key={idx}>
                    <td className="p-3">
                      <strong className="text-stone-900 block">{fi.item.name}</strong>
                      <span className="text-[11px] text-stone-500">{fi.item.category} • 100% Satvik Veg</span>
                    </td>
                    <td className="p-3 text-center">{fi.quantity} Portions</td>
                    <td className="p-3 text-right">₹{fi.item.price}</td>
                    <td className="p-3 text-right font-bold text-stone-900">₹{(fi.item.price * fi.quantity).toLocaleString('en-IN')}</td>
                  </tr>
                ))}

                {/* Treks */}
                {booking.treks && booking.treks.map((tr, idx) => (
                  <tr key={idx}>
                    <td className="p-3">
                      <strong className="text-stone-900 block">{tr.trek.title}</strong>
                      <span className="text-[11px] text-stone-500">Certified Local Guide, Altitude: {tr.trek.altitude}</span>
                    </td>
                    <td className="p-3 text-center">{tr.participants} Person</td>
                    <td className="p-3 text-right">₹{tr.trek.pricePerPerson}</td>
                    <td className="p-3 text-right font-bold text-stone-900">₹{(tr.trek.pricePerPerson * tr.participants).toLocaleString('en-IN')}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* FINANCIAL SUMMARY */}
          <div className="flex justify-end pt-2">
            <div className="w-64 space-y-2 text-xs">
              <div className="flex justify-between text-stone-600">
                <span>Subtotal Amount:</span>
                <span className="font-semibold text-stone-900">₹{booking.subtotal.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between text-stone-600">
                <span>SGST (6%) + CGST (6%):</span>
                <span className="font-semibold text-stone-900">₹{booking.gstAmount.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between text-stone-900 font-bold text-sm pt-2 border-t border-stone-200">
                <span>Grand Total:</span>
                <span className="text-[#0B2B20]">₹{booking.totalAmount.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between text-emerald-800 font-bold bg-emerald-50 p-2 rounded-lg border border-emerald-200">
                <span>Advance Paid ({booking.paymentMethod}):</span>
                <span>₹{booking.advancePaid.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between text-stone-800 font-bold bg-stone-100 p-2 rounded-lg border border-stone-200">
                <span>Balance Due at Check-In:</span>
                <span>₹{booking.balanceDue.toLocaleString('en-IN')}</span>
              </div>
            </div>
          </div>

          {/* TERMS & SIGNATURE */}
          <div className="border-t border-stone-200 pt-6 flex justify-between items-end text-[11px] text-stone-500">
            <div className="space-y-1 max-w-sm">
              <span className="font-bold text-stone-700 block">Hotel Policies & Guidelines:</span>
              <p>• Standard Check-in 12:00 PM | Check-out 10:00 AM.</p>
              <p>• Alcohol and non-vegetarian food are strictly prohibited in the sacred temple zone.</p>
              <p>• 100% refund on room booking cancelled 48 hours prior to check-in.</p>
            </div>
            <div className="text-center space-y-8">
              <div className="w-36 border-b border-stone-400"></div>
              <span className="font-bold text-stone-700 block">Authorized Signatory</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
