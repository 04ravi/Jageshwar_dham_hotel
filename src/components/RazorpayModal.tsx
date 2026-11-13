'use client';

import React, { useState } from 'react';

interface RazorpayModalProps {
  amount: number;
  guestName: string;
  guestPhone: string;
  onSuccess: (paymentMethod: 'RAZORPAY_UPI' | 'RAZORPAY_CARD' | 'NETBANKING') => void;
  onClose: () => void;
}

export default function RazorpayModal({
  amount,
  guestName,
  guestPhone,
  onSuccess,
  onClose
}: RazorpayModalProps) {
  const [method, setMethod] = useState<'upi' | 'card' | 'netbanking'>('upi');
  const [upiApp, setUpiApp] = useState<'gpay' | 'phonepe' | 'paytm' | 'qr'>('qr');
  const [isProcessing, setIsProcessing] = useState(false);

  const handlePay = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      const selectedPayment = method === 'card' ? 'RAZORPAY_CARD' : method === 'netbanking' ? 'NETBANKING' : 'RAZORPAY_UPI';
      onSuccess(selectedPayment);
    }, 1500);
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-md overflow-hidden shadow-2xl border border-stone-200 animate-in fade-in zoom-in-95 duration-200">
        
        {/* RAZORPAY HEADER */}
        <div className="bg-[#0C2340] text-white p-5 flex justify-between items-center border-b border-blue-900">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-blue-500 flex items-center justify-center font-bold text-base text-white shadow-sm">
              ₹
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-sm tracking-tight text-white">Razorpay Secure</span>
                <span className="text-[10px] bg-blue-400/30 text-blue-200 px-1.5 py-0.2 rounded font-semibold">100% Encrypted</span>
              </div>
              <p className="text-xs text-blue-200 font-light mt-0.5">Jageshwar Dham Retreat & Resort</p>
            </div>
          </div>

          <div className="text-right">
            <span className="text-[10px] text-blue-200 block uppercase tracking-wider">Amount to Pay</span>
            <span className="text-xl font-black text-white">₹{amount.toLocaleString('en-IN')}</span>
          </div>
        </div>

        {/* CUSTOMER INFO STRIP */}
        <div className="bg-blue-50/60 px-5 py-2.5 border-b border-blue-100 flex justify-between items-center text-xs text-stone-700">
          <span>Paying for: <strong>{guestName || 'Guest'}</strong></span>
          <span className="text-stone-500">{guestPhone || '+91 98XXX XXXXX'}</span>
        </div>

        {/* PAYMENT TABS */}
        <div className="p-5 space-y-5">
          <div className="grid grid-cols-3 gap-2 p-1 bg-stone-100 rounded-xl text-xs font-bold text-center">
            <button
              onClick={() => setMethod('upi')}
              className={`py-2 rounded-lg transition ${method === 'upi' ? 'bg-white text-blue-900 shadow-sm' : 'text-stone-500 hover:text-stone-900'}`}
            >
              ⚡ UPI (Instant)
            </button>
            <button
              onClick={() => setMethod('card')}
              className={`py-2 rounded-lg transition ${method === 'card' ? 'bg-white text-blue-900 shadow-sm' : 'text-stone-500 hover:text-stone-900'}`}
            >
              💳 Cards
            </button>
            <button
              onClick={() => setMethod('netbanking')}
              className={`py-2 rounded-lg transition ${method === 'netbanking' ? 'bg-white text-blue-900 shadow-sm' : 'text-stone-500 hover:text-stone-900'}`}
            >
              🏦 NetBanking
            </button>
          </div>

          {/* METHOD 1: UPI */}
          {method === 'upi' && (
            <div className="space-y-4">
              <div className="grid grid-cols-4 gap-2 text-center text-xs">
                <button
                  onClick={() => setUpiApp('qr')}
                  className={`p-2.5 rounded-xl border transition ${upiApp === 'qr' ? 'border-blue-600 bg-blue-50 text-blue-900 font-bold' : 'border-stone-200 hover:bg-stone-50'}`}
                >
                  <span className="text-lg block">📱</span>
                  Scan QR
                </button>
                <button
                  onClick={() => setUpiApp('gpay')}
                  className={`p-2.5 rounded-xl border transition ${upiApp === 'gpay' ? 'border-blue-600 bg-blue-50 text-blue-900 font-bold' : 'border-stone-200 hover:bg-stone-50'}`}
                >
                  <span className="text-lg block">🟢</span>
                  GPay
                </button>
                <button
                  onClick={() => setUpiApp('phonepe')}
                  className={`p-2.5 rounded-xl border transition ${upiApp === 'phonepe' ? 'border-blue-600 bg-blue-50 text-blue-900 font-bold' : 'border-stone-200 hover:bg-stone-50'}`}
                >
                  <span className="text-lg block">🟣</span>
                  PhonePe
                </button>
                <button
                  onClick={() => setUpiApp('paytm')}
                  className={`p-2.5 rounded-xl border transition ${upiApp === 'paytm' ? 'border-blue-600 bg-blue-50 text-blue-900 font-bold' : 'border-stone-200 hover:bg-stone-50'}`}
                >
                  <span className="text-lg block">🔵</span>
                  Paytm
                </button>
              </div>

              {upiApp === 'qr' ? (
                <div className="bg-stone-50 p-4 rounded-xl border border-stone-200 text-center space-y-2">
                  <div className="w-32 h-32 mx-auto bg-white p-2 rounded-lg border flex flex-col items-center justify-center shadow-inner">
                    {/* Simulated QR Code */}
                    <div className="grid grid-cols-6 gap-1 w-full h-full p-1 bg-stone-900 rounded">
                      <div className="bg-white col-span-2 row-span-2"></div>
                      <div className="bg-stone-900 col-span-2"></div>
                      <div className="bg-white col-span-2 row-span-2"></div>
                      <div className="bg-white col-span-2"></div>
                      <div className="bg-white col-span-2"></div>
                      <div className="bg-white col-span-2"></div>
                      <div className="bg-white col-span-2 row-span-2"></div>
                      <div className="bg-white col-span-2"></div>
                      <div className="bg-white col-span-2 row-span-2"></div>
                    </div>
                  </div>
                  <p className="text-xs text-stone-600 font-medium">Scan with any UPI App (GPay, PhonePe, Paytm, BHIM)</p>
                </div>
              ) : (
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-stone-600 block">Enter UPI ID / VPA</label>
                  <input
                    type="text"
                    defaultValue={`${guestPhone.replace(/\D/g, '') || '9876543210'}@upi`}
                    className="w-full text-xs p-2.5 border rounded-lg bg-stone-50 focus:outline-blue-600 font-mono"
                  />
                </div>
              )}
            </div>
          )}

          {/* METHOD 2: CARDS */}
          {method === 'card' && (
            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-[11px] font-bold text-stone-600 mb-1">Card Number</label>
                <input
                  type="text"
                  placeholder="4123 •••• •••• 9801 (Visa / RuPay / MC)"
                  className="w-full p-2.5 border rounded-lg bg-stone-50 focus:outline-blue-600 font-mono"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-stone-600 mb-1">Expiry Date</label>
                  <input
                    type="text"
                    placeholder="MM / YY"
                    className="w-full p-2.5 border rounded-lg bg-stone-50 focus:outline-blue-600 font-mono"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-stone-600 mb-1">CVV / CVC</label>
                  <input
                    type="password"
                    placeholder="•••"
                    maxLength={4}
                    className="w-full p-2.5 border rounded-lg bg-stone-50 focus:outline-blue-600 font-mono"
                  />
                </div>
              </div>
            </div>
          )}

          {/* METHOD 3: NETBANKING */}
          {method === 'netbanking' && (
            <div className="space-y-2 text-xs">
              <label className="block text-[11px] font-bold text-stone-600">Popular Banks</label>
              <div className="grid grid-cols-2 gap-2">
                <button className="p-2 border rounded-lg text-left font-semibold hover:border-blue-600">🏦 State Bank of India</button>
                <button className="p-2 border rounded-lg text-left font-semibold hover:border-blue-600">🏦 HDFC Bank</button>
                <button className="p-2 border rounded-lg text-left font-semibold hover:border-blue-600">🏦 ICICI Bank</button>
                <button className="p-2 border rounded-lg text-left font-semibold hover:border-blue-600">🏦 Axis Bank</button>
              </div>
            </div>
          )}

          {/* ACTIONS */}
          <div className="pt-2 space-y-2">
            <button
              onClick={handlePay}
              disabled={isProcessing}
              className="w-full bg-[#1A56DB] hover:bg-[#1344B2] text-white font-bold py-3.5 px-4 rounded-xl shadow-lg transition flex items-center justify-center gap-2 disabled:opacity-75"
            >
              {isProcessing ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Verifying Payment with Bank...</span>
                </>
              ) : (
                <span>Pay ₹{amount.toLocaleString('en-IN')} via Razorpay</span>
              )}
            </button>

            <button
              onClick={onClose}
              disabled={isProcessing}
              className="w-full text-xs text-stone-500 hover:text-stone-800 font-semibold py-1.5 transition"
            >
              Cancel Transaction
            </button>
          </div>

          <div className="flex items-center justify-center gap-4 text-[10px] text-stone-400 border-t pt-3">
            <span>PCI-DSS Level 1 Certified</span>
            <span>•</span>
            <span>256-Bit SSL Encryption</span>
          </div>
        </div>
      </div>
    </div>
  );
}
