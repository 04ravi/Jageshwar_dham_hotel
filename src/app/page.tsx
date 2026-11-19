'use client';

import { useState, useMemo, useRef } from 'react';
import Link from 'next/link';
import { useHotel } from '@/context/HotelContext';
import { Room, TaxiRoute } from '@/data/mockData';
import EnquiryModal from '@/components/EnquiryModal';

export default function Home() {
  const { rooms, taxiRoutes, foodMenu, treks } = useHotel();

  // Tab State
  const [activeTab, setActiveTab] = useState<'rooms' | 'taxi' | 'food' | 'treks'>('rooms');

  // Room Filter States
  const [priceFilter, setPriceFilter] = useState<'ALL' | 'UNDER_2500' | '2500_TO_4500' | 'ABOVE_4500'>('ALL');
  const [distanceFilter, setDistanceFilter] = useState<'ALL' | 'UNDER_200M' | '200_TO_400M' | 'ABOVE_400M'>('ALL');

  // Date & Guest Selector State
  const [checkIn, setCheckIn] = useState(() => new Date(Date.now()+86400000).toLocaleDateString('en-CA',{timeZone:'Asia/Kolkata'}));
  const [checkOut, setCheckOut] = useState(() => new Date(Date.now()+3*86400000).toLocaleDateString('en-CA',{timeZone:'Asia/Kolkata'}));
  const [adults, setAdults] = useState(2);
  const [children, setChildren] = useState(0);

  // Cart / Booking State
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(rooms[0] || null);
  const [selectedTaxi, setSelectedTaxi] = useState<{ route: TaxiRoute; vehicle: 'Sedan' | 'SUV' } | null>(null);
  const [selectedFood, setSelectedFood] = useState<{ [id: string]: number }>({});
  const [selectedTreks, setSelectedTreks] = useState<{ [id: string]: number }>({});

  // Checkout Form Details
  const [guestName, setGuestName] = useState('');
  const [guestEmail, setGuestEmail] = useState('');
  const [guestPhone, setGuestPhone] = useState('');
  const [acceptedRefundPolicy, setAcceptedRefundPolicy] = useState(false);
  const [specialRequests, setSpecialRequests] = useState('');

  // Modals
  const [isCheckoutDrawerOpen, setIsCheckoutDrawerOpen] = useState(false);
  const [isEnquiryOpen, setIsEnquiryOpen] = useState(false);

  // Nights calculation
  const nights = useMemo(() => {
    const diff = Math.round((new Date(checkOut).getTime() - new Date(checkIn).getTime()) / (1000 * 60 * 60 * 24));
    return diff > 0 ? diff : 1;
  }, [checkIn, checkOut]);

  // Filtered Rooms
  const filteredRooms = useMemo(() => {
    return rooms.filter((room) => {
      // Price Filter
      if (priceFilter === 'UNDER_2500' && room.pricePerNight >= 2500) return false;
      if (priceFilter === '2500_TO_4500' && (room.pricePerNight < 2500 || room.pricePerNight > 4500)) return false;
      if (priceFilter === 'ABOVE_4500' && room.pricePerNight <= 4500) return false;

      // Distance Filter
      if (distanceFilter === 'UNDER_200M' && room.distanceMeters > 200) return false;
      if (distanceFilter === '200_TO_400M' && (room.distanceMeters <= 200 || room.distanceMeters > 400)) return false;
      if (distanceFilter === 'ABOVE_400M' && room.distanceMeters <= 400) return false;

      return true;
    });
  }, [rooms, priceFilter, distanceFilter]);

  // Pricing calculations
  const roomTotal = selectedRoom ? selectedRoom.pricePerNight * nights : 0;
  const taxiTotal = selectedTaxi ? (selectedTaxi.vehicle === 'SUV' ? selectedTaxi.route.priceSUV : selectedTaxi.route.priceSedan) : 0;
  
  const foodTotal = Object.entries(selectedFood).reduce((sum, [id, qty]) => {
    const item = foodMenu.find((f) => f.id === id);
    return sum + (item ? item.price * qty : 0);
  }, 0);

  const trekTotal = Object.entries(selectedTreks).reduce((sum, [id, qty]) => {
    const trek = treks.find((t) => t.id === id);
    return sum + (trek ? trek.pricePerPerson * qty : 0);
  }, 0);

  const subtotal = roomTotal + taxiTotal + foodTotal + trekTotal;
  const gstAmount = Math.round(subtotal * 0.12);
  const grandTotal = subtotal + gstAmount;
  const advanceToken = Math.round(grandTotal * 0.3); // 30% advance deposit

  // Capacity validation for selected room
  const isCapacityExceeded = selectedRoom ? adults > selectedRoom.capacityAdults : false;

  // Test checkout
  const [starting,setStarting]=useState(false);
  const [checkoutError,setCheckoutError]=useState('');
  const [checkoutUrl,setCheckoutUrl]=useState('');
  const attempt=useRef<{signature:string;id:string}|null>(null);
  const handleProceedToPayment = async () => {
    if (!selectedRoom) {
      alert('Please select a room first.');
      return;
    }
    // Real-time lock check
    if (selectedRoom.status !== 'Vacant') {
      alert(`Sorry, "${selectedRoom.name}" has already been marked as ${selectedRoom.status.toUpperCase()} and cannot be booked. Please select a vacant room.`);
      return;
    }
    if (!guestName.trim()) {
      alert('Please enter the primary guest full name.');
      return;
    }
    if (!guestPhone.trim()) {
      alert('Please enter your WhatsApp mobile number.');
      return;
    }
    if (!guestEmail.trim()) {
      alert('Please enter your email address for the booking receipt.');
      return;
    }
    if (!acceptedRefundPolicy) {
      alert('Please read and accept the Cancellation & Refund Policy to proceed.');
      return;
    }
    if (isCapacityExceeded) {
      alert(`The selected room allows a maximum of ${selectedRoom.capacityAdults} adults. Please adjust your guest count or select a family cottage.`);
      return;
    }

    setCheckoutError('');
    setStarting(true);
    const positive = (items: Record<string,number>) => Object.fromEntries(Object.entries(items).filter(([,q])=>q>0));
    const payload = {roomId:selectedRoom.id, checkIn, checkOut, adults, children, name:guestName,email:guestEmail,phone:guestPhone,notes:specialRequests,accepted:acceptedRefundPolicy,taxi:selectedTaxi?{id:selectedTaxi.route.id,vehicle:selectedTaxi.vehicle}:null,food:positive(selectedFood),treks:positive(selectedTreks),displayedAdvance:advanceToken};
    const signature=JSON.stringify(payload);
    if(attempt.current?.signature!==signature) attempt.current={signature,id:crypto.randomUUID()};
    try {const res=await fetch('/api/test-checkout',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({...payload,id:attempt.current.id})}); const result=await res.json();if(!res.ok||!result.url)throw Error(result.error||'Unable to start checkout.');setCheckoutUrl(result.url);}
    catch(error){setCheckoutError(error instanceof Error?error.message:'Could not start checkout. Please retry.');} finally{setStarting(false);}
  };

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-stone-900 font-sans selection:bg-amber-100 selection:text-emerald-950">
      
      {/* 1. TOP ANNOUNCEMENT BAR */}
      <div className="bg-[#0B2B20] text-emerald-200/90 text-xs py-2.5 px-4 sm:px-8 border-b border-emerald-900/60">
        <div className="max-w-7xl mx-auto flex flex-wrap justify-between items-center gap-2">
          <div className="flex items-center gap-2">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="font-medium text-emerald-100">Jageshwar Dham, Almora, Uttarakhand</span>
            <span className="hidden sm:inline text-emerald-500">•</span>
            <span className="hidden sm:inline text-stone-300">Walking Distance to 125 Ancient Shiva Temples</span>
          </div>
          <div className="flex items-center gap-4 text-stone-300">
            <button onClick={() => setIsEnquiryOpen(true)} className="text-amber-300 hover:underline font-semibold">
              ✉️ Send Custom Enquiry
            </button>
            <span>|</span>
            <a href="tel:+919876543210" className="hover:text-amber-300 transition font-medium">📞 +91 98765 43210</a>
            <span>|</span>
            <Link href="/admin/login" className="text-amber-300 hover:underline font-semibold">Staff PMS Login →</Link>
          </div>
        </div>
      </div>

      {/* 2. NAVBAR */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-[#EAE5DE] shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#0B2B20] to-[#184E38] text-white flex items-center justify-center text-xl shadow-md group-hover:scale-105 transition">
              🌲
            </div>
            <div>
              <span className="font-serif text-xl sm:text-2xl font-bold tracking-tight text-[#0B2B20] block">
                Jageshwar Dham Retreat
              </span>
              <span className="text-[11px] uppercase tracking-widest text-stone-500 font-semibold block">
                Heritage Stays • Cabs • Satvik Food • Treks
              </span>
            </div>
          </Link>

          {/* Desktop Nav Tabs */}
          <div className="hidden md:flex items-center gap-1 bg-[#F4EFEA] p-1.5 rounded-full border border-[#E5DFD5]">
            <button
              onClick={() => setActiveTab('rooms')}
              className={`px-4 py-1.5 rounded-full text-xs font-semibold transition ${activeTab === 'rooms' ? 'bg-[#0B2B20] text-white shadow-sm' : 'text-stone-600 hover:text-stone-900'}`}
            >
              🛏️ Rooms & Suites
            </button>
            <button
              onClick={() => setActiveTab('taxi')}
              className={`px-4 py-1.5 rounded-full text-xs font-semibold transition ${activeTab === 'taxi' ? 'bg-[#0B2B20] text-white shadow-sm' : 'text-stone-600 hover:text-stone-900'}`}
            >
              🚖 Taxi & Transfers
            </button>
            <button
              onClick={() => setActiveTab('food')}
              className={`px-4 py-1.5 rounded-full text-xs font-semibold transition ${activeTab === 'food' ? 'bg-[#0B2B20] text-white shadow-sm' : 'text-stone-600 hover:text-stone-900'}`}
            >
              🍲 Kumaoni & Satvik Dining
            </button>
            <button
              onClick={() => setActiveTab('treks')}
              className={`px-4 py-1.5 rounded-full text-xs font-semibold transition ${activeTab === 'treks' ? 'bg-[#0B2B20] text-white shadow-sm' : 'text-stone-600 hover:text-stone-900'}`}
            >
              🥾 Guided Himalayan Treks
            </button>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsCheckoutDrawerOpen(true)}
              className="flex items-center gap-2 bg-[#0B2B20] hover:bg-[#164E3D] text-white text-xs sm:text-sm font-semibold px-4 py-2.5 rounded-xl shadow-md transition hover:scale-102"
            >
              <span>🛒 Booking Summary</span>
              {grandTotal > 0 && (
                <span className="bg-[#C59B27] text-stone-950 font-bold px-2 py-0.5 rounded-md text-xs">
                  ₹{grandTotal.toLocaleString('en-IN')}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* 3. HERO BANNER WITH CINEMATIC JAGESHWAR TEMPLE ANIMATION */}
      <section className="relative min-h-[580px] text-white pt-24 pb-36 px-4 sm:px-8 overflow-hidden flex items-center justify-center">
        {/* Animated Temple Hero Image with Slow Ken Burns Scale & Pan */}
        <div className="absolute inset-0 w-full h-full overflow-hidden bg-[#071F17]">
          <img
            src="https://imgs.search.brave.com/YiCaapgdEIdNF2TBd_gd-NdQhQfvjZEu7Vjiyxd3UcU/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly90LmV1/Y2RuLmluL3RvdXJp/c20vbGcvamFnZXNo/d2FyLTQ2NzE1NjMu/d2VicA"
            alt="Jageshwar Dham Ancient Stone Temples and Deodar Forest"
            className="w-full h-full object-cover object-center animate-ken-burns transform-gpu filter brightness-[0.88] contrast-[1.05]"
          />
        </div>

        {/* Cinematic Gradient Overlays for High Contrast & Mystical Ambience */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0B2B20] via-[#0B2B20]/45 to-[#0B2B20]/80"></div>
        <div className="absolute inset-0 bg-radial from-transparent via-transparent to-[#051711]/90"></div>

        {/* Drifting Mountain Mist Animation Layer */}
        <div className="absolute inset-0 pointer-events-none opacity-40 mix-blend-screen animate-mist bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>

        <div className="relative max-w-5xl mx-auto text-center space-y-6 z-10">
          {/* Pulsing Sacred Temple Badge */}
          <div className="inline-flex items-center gap-2.5 bg-black/40 backdrop-blur-md px-5 py-2 rounded-full border border-amber-300/40 text-xs tracking-wider uppercase font-semibold text-amber-200 animate-shimmer shadow-lg">
            <span className="inline-block w-2 h-2 rounded-full bg-[#E5BA42] animate-ping"></span>
            <span>✨ Sacred 125 Ancient Temples • 8th Century Shiva Jyotirlinga</span>
          </div>

          {/* Majestic Heading */}
          <h1 className="text-4xl sm:text-6xl md:text-7xl font-serif font-bold tracking-tight text-white leading-tight drop-shadow-xl">
            Rest in the Sacred Pines of <br />
            <span className="text-[#E5BA42] italic drop-shadow-md">Jageshwar Dham</span>
          </h1>

          <p className="text-stone-100 text-base sm:text-xl max-w-2xl mx-auto font-light leading-relaxed drop-shadow-md">
            Directly reserve serene mountain-view rooms, hire verified Kathgodam cabs, savor authentic Kumaoni thalis, and hike to panoramic peaks.
          </p>

          {/* ESSENTIAL HILL AMENITIES STRIP WITH GENTLE FLOAT */}
          <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 text-xs text-stone-100 font-semibold pt-2">
            <span className="bg-black/35 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-white/20 shadow-sm flex items-center gap-1.5 hover:border-amber-300 transition">
              📶 Free High-Speed Wi-Fi
            </span>
            <span className="bg-black/35 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-white/20 shadow-sm flex items-center gap-1.5 hover:border-amber-300 transition">
              ♨️ 24/7 Hot Water Geyser
            </span>
            <span className="bg-black/35 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-white/20 shadow-sm flex items-center gap-1.5 hover:border-amber-300 transition">
              🫖 In-Room Electric Kettle
            </span>
            <span className="bg-black/35 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-white/20 shadow-sm flex items-center gap-1.5 hover:border-amber-300 transition">
              🔥 Heavy Room Heater
            </span>
          </div>
        </div>
      </section>

      {/* 4. FLOATING BOOKING BAR WITH GUEST SELECTOR */}
      <div className="relative -mt-16 max-w-5xl mx-auto px-4 sm:px-6 z-30">
        <div className="booking-floating-bar p-5 sm:p-6 rounded-2xl grid grid-cols-1 sm:grid-cols-4 gap-4 items-end">
          <div className="space-y-1.5">
            <label className="text-[11px] font-bold text-stone-600 uppercase tracking-wider block">
              📅 Check-In Date
            </label>
            <input
              type="date"
              value={checkIn}
              onChange={(e) => setCheckIn(e.target.value)}
              className="w-full bg-[#FAF8F5] border border-stone-300 rounded-xl px-3 py-2.5 text-sm font-semibold text-stone-900 focus:outline-none focus:ring-2 focus:ring-[#0B2B20]"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-[11px] font-bold text-stone-600 uppercase tracking-wider block">
              📅 Check-Out Date
            </label>
            <input
              type="date"
              value={checkOut}
              onChange={(e) => setCheckOut(e.target.value)}
              className="w-full bg-[#FAF8F5] border border-stone-300 rounded-xl px-3 py-2.5 text-sm font-semibold text-stone-900 focus:outline-none focus:ring-2 focus:ring-[#0B2B20]"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-[11px] font-bold text-stone-600 uppercase tracking-wider block">
              👥 Guests Breakdown
            </label>
            <div className="grid grid-cols-2 gap-2">
              <select
                value={adults}
                onChange={(e) => setAdults(Number(e.target.value))}
                className="w-full bg-[#FAF8F5] border border-stone-300 rounded-xl px-2 py-2.5 text-xs font-semibold text-stone-900 focus:outline-none"
              >
                <option value={1}>1 Adult</option>
                <option value={2}>2 Adults</option>
                <option value={3}>3 Adults</option>
                <option value={4}>4 Adults</option>
                <option value={5}>5 Adults</option>
              </select>
              <select
                value={children}
                onChange={(e) => setChildren(Number(e.target.value))}
                className="w-full bg-[#FAF8F5] border border-stone-300 rounded-xl px-2 py-2.5 text-xs font-semibold text-stone-900 focus:outline-none"
              >
                <option value={0}>0 Child</option>
                <option value={1}>1 Child</option>
                <option value={2}>2 Children</option>
              </select>
            </div>
          </div>

          <div>
            <button
              onClick={() => setActiveTab('rooms')}
              className="w-full bg-gradient-to-r from-[#0B2B20] to-[#184E38] hover:from-[#164E3D] hover:to-[#0B2B20] text-white font-bold py-3 px-5 rounded-xl text-sm shadow-md transition flex items-center justify-center gap-2 hover:shadow-lg"
            >
              <span>View Filtered Rooms</span>
              <span>→</span>
            </button>
          </div>
        </div>
      </div>

      {/* 5. SERVICE TABS NAVIGATION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-8 pt-16">
        <div className="flex justify-center border-b border-[#E5DFD5] pb-4">
          <div className="flex gap-2 sm:gap-4 overflow-x-auto p-1.5 bg-[#F4EFEA] rounded-2xl border border-[#E5DFD5]">
            <button
              onClick={() => setActiveTab('rooms')}
              className={`px-5 py-2.5 rounded-xl text-sm font-bold transition flex items-center gap-2 ${activeTab === 'rooms' ? 'bg-white text-[#0B2B20] shadow-md border border-[#E5DFD5]' : 'text-stone-600 hover:text-stone-900'}`}
            >
              <span>🛏️ Rooms & Suites</span>
              <span className="text-xs bg-emerald-100 text-[#0B2B20] font-black px-2 py-0.5 rounded-full">{filteredRooms.length}</span>
            </button>

            <button
              onClick={() => setActiveTab('taxi')}
              className={`px-5 py-2.5 rounded-xl text-sm font-bold transition flex items-center gap-2 ${activeTab === 'taxi' ? 'bg-white text-[#0B2B20] shadow-md border border-[#E5DFD5]' : 'text-stone-600 hover:text-stone-900'}`}
            >
              <span>🚖 Taxi & Transfers</span>
              <span className="text-xs bg-emerald-100 text-[#0B2B20] font-black px-2 py-0.5 rounded-full">{taxiRoutes.length}</span>
            </button>

            <button
              onClick={() => setActiveTab('food')}
              className={`px-5 py-2.5 rounded-xl text-sm font-bold transition flex items-center gap-2 ${activeTab === 'food' ? 'bg-white text-[#0B2B20] shadow-md border border-[#E5DFD5]' : 'text-stone-600 hover:text-stone-900'}`}
            >
              <span>🍲 Kumaoni Kitchen</span>
              <span className="text-xs bg-emerald-100 text-[#0B2B20] font-black px-2 py-0.5 rounded-full">{foodMenu.length}</span>
            </button>

            <button
              onClick={() => setActiveTab('treks')}
              className={`px-5 py-2.5 rounded-xl text-sm font-bold transition flex items-center gap-2 ${activeTab === 'treks' ? 'bg-white text-[#0B2B20] shadow-md border border-[#E5DFD5]' : 'text-stone-600 hover:text-stone-900'}`}
            >
              <span>🥾 Himalayan Treks</span>
              <span className="text-xs bg-emerald-100 text-[#0B2B20] font-black px-2 py-0.5 rounded-full">{treks.length}</span>
            </button>
          </div>
        </div>
      </section>

      {/* 6. MAIN CONTENT AREA */}
      <main className="max-w-7xl mx-auto px-4 sm:px-8 py-10">

        {/* ===================== TAB 1: ROOMS WITH FILTERS ===================== */}
        {activeTab === 'rooms' && (
          <div className="space-y-8">
            {/* FILTER BAR FOR PRICE & DISTANCE */}
            <div className="bg-white p-5 rounded-2xl border border-[#EAE5DE] shadow-xs flex flex-wrap items-center justify-between gap-4">
              <div className="flex flex-wrap items-center gap-4 text-xs">
                {/* Price Tag Filter */}
                <div className="flex items-center gap-2">
                  <span className="font-bold text-stone-700">💰 Price Tag:</span>
                  <select
                    value={priceFilter}
                    onChange={(e) => setPriceFilter(e.target.value as 'ALL' | 'UNDER_2500' | '2500_TO_4500' | 'ABOVE_4500')}
                    className="p-2 border rounded-xl bg-[#FAF8F5] font-semibold text-stone-800 focus:outline-[#0B2B20]"
                  >
                    <option value="ALL">All Price Ranges</option>
                    <option value="UNDER_2500">Budget (Under ₹2,500/night)</option>
                    <option value="2500_TO_4500">Deluxe (₹2,500 - ₹4,500/night)</option>
                    <option value="ABOVE_4500">Luxury / Cottage (Above ₹4,500/night)</option>
                  </select>
                </div>

                {/* Distance From Temple Filter */}
                <div className="flex items-center gap-2">
                  <span className="font-bold text-stone-700">🛕 Distance to Temple:</span>
                  <select
                    value={distanceFilter}
                    onChange={(e) => setDistanceFilter(e.target.value as 'ALL' | 'UNDER_200M' | '200_TO_400M' | 'ABOVE_400M')}
                    className="p-2 border rounded-xl bg-[#FAF8F5] font-semibold text-stone-800 focus:outline-[#0B2B20]"
                  >
                    <option value="ALL">All Distances</option>
                    <option value="UNDER_200M">Under 200m (≤2 mins walk to Dham)</option>
                    <option value="200_TO_400M">200m - 400m (3-5 mins walk)</option>
                    <option value="ABOVE_400M">Above 400m (Quiet Forest Ridge)</option>
                  </select>
                </div>
              </div>

              <div className="text-xs text-stone-500 font-medium">
                Showing <strong>{filteredRooms.length}</strong> of {rooms.length} Rooms
              </div>
            </div>

            {/* ROOMS GRID */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {filteredRooms.map((room) => {
                const isSelected = selectedRoom?.id === room.id;
                const isVacant = room.status === 'Vacant';

                return (
                  <div key={room.id} className={`luxury-card rounded-2xl overflow-hidden flex flex-col justify-between transition ${!isVacant ? 'opacity-90 bg-stone-50/80 border-stone-300' : isSelected ? 'ring-2 ring-[#0B2B20] border-[#0B2B20]' : ''}`}>
                    <div>
                      {/* Image Frame */}
                      <div className="relative h-64 overflow-hidden">
                        <img src={room.image} alt={room.name} className={`w-full h-full object-cover transition duration-500 hover:scale-105 ${!isVacant ? 'grayscale-[25%]' : ''}`} />
                        <span className="absolute top-4 left-4 bg-white/95 backdrop-blur text-[#0B2B20] text-xs font-bold px-3 py-1 rounded-full shadow-sm uppercase tracking-wider">
                          {room.category}
                        </span>
                        <span className="absolute top-4 right-4 bg-[#0B2B20]/90 backdrop-blur text-amber-200 text-xs font-semibold px-3 py-1 rounded-full shadow-sm flex items-center gap-1">
                          🛕 {room.distanceFromTemple}
                        </span>

                        {/* LIVE AVAILABILITY BADGE */}
                        <div className="absolute bottom-3 left-4">
                          <span className={`text-[11px] font-bold px-3 py-1 rounded-full shadow-md backdrop-blur-md flex items-center gap-1.5 ${
                            isVacant
                              ? 'bg-emerald-950/90 text-emerald-200 border border-emerald-500/80'
                              : room.status === 'Booked'
                              ? 'bg-red-950/90 text-red-200 border border-red-500/80'
                              : room.status === 'Engaged'
                              ? 'bg-amber-950/90 text-amber-200 border border-amber-500/80'
                              : 'bg-stone-900/90 text-stone-200 border border-stone-500/80'
                          }`}>
                            <span className={`w-2 h-2 rounded-full ${isVacant ? 'bg-emerald-400 animate-pulse' : 'bg-red-400'}`}></span>
                            <span>
                              {isVacant
                                ? '🟢 Vacant & Available'
                                : room.status === 'Booked'
                                ? '🔴 Booked / Sold Out'
                                : room.status === 'Engaged'
                                ? '🟠 Engaged (In-House Guest)'
                                : '🟡 Under Maintenance'}
                            </span>
                          </span>
                        </div>
                      </div>

                      {/* Content */}
                      <div className="p-6 space-y-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="text-xl font-serif font-bold text-[#0B2B20]">{room.name}</h3>
                            <span className="text-xs text-stone-500 font-medium block mt-0.5">
                              👥 Capacity: Max {room.capacityAdults} Adults, {room.capacityChildren} Children
                            </span>
                          </div>
                          <div className="text-right">
                            <span className="text-2xl font-black text-[#0B2B20]">₹{room.pricePerNight}</span>
                            <span className="text-xs text-stone-500 block">/ night</span>
                          </div>
                        </div>

                        <p className="text-sm text-stone-600 leading-relaxed">{room.description}</p>

                        {/* SPECIFIC REQUESTED AMENITIES */}
                        <div className="grid grid-cols-2 gap-2 pt-1 text-xs">
                          <span className="flex items-center gap-1.5 text-stone-700 bg-[#FAF8F5] p-1.5 rounded-lg border border-[#EAE5DE]">
                            📶 Free High-Speed Wi-Fi
                          </span>
                          <span className="flex items-center gap-1.5 text-stone-700 bg-[#FAF8F5] p-1.5 rounded-lg border border-[#EAE5DE]">
                            ♨️ 24/7 Hot Water Geyser
                          </span>
                          <span className="flex items-center gap-1.5 text-stone-700 bg-[#FAF8F5] p-1.5 rounded-lg border border-[#EAE5DE]">
                            🫖 Electric Kettle + Teas
                          </span>
                          <span className="flex items-center gap-1.5 text-stone-700 bg-[#FAF8F5] p-1.5 rounded-lg border border-[#EAE5DE]">
                            🔥 Heavy Room Heater
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Card Footer */}
                    <div className="px-6 py-4 bg-[#FAF8F5] border-t border-[#EAE5DE] flex items-center justify-between">
                      <div>
                        <span className="text-xs text-stone-500 block">Total for {nights} nights:</span>
                        <span className="text-base font-bold text-[#0B2B20]">₹{(room.pricePerNight * nights).toLocaleString('en-IN')}</span>
                      </div>
                      {isVacant ? (
                        <button
                          onClick={() => {
                            setSelectedRoom(room);
                            setIsCheckoutDrawerOpen(true);
                          }}
                          className={`text-xs font-bold px-5 py-2.5 rounded-xl transition ${isSelected ? 'bg-[#0B2B20] text-white shadow-md' : 'bg-white border border-stone-300 hover:border-[#0B2B20] text-stone-900'}`}
                        >
                          {isSelected ? '✓ Room Selected' : 'Book Room →'}
                        </button>
                      ) : (
                        <button
                          disabled
                          className="text-xs font-bold px-4 py-2.5 rounded-xl bg-stone-200 text-stone-500 cursor-not-allowed border border-stone-300 flex items-center gap-1.5"
                        >
                          <span>⛔</span>
                          <span>
                            {room.status === 'Booked'
                              ? 'Booked / Unavailable'
                              : room.status === 'Engaged'
                              ? 'Currently Occupied'
                              : 'Under Maintenance'}
                          </span>
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ===================== TAB 2: TAXI ===================== */}
        {activeTab === 'taxi' && (
          <div className="space-y-8">
            <div className="border-b border-[#E5DFD5] pb-4">
              <span className="text-xs font-bold uppercase tracking-wider text-[#C59B27]">Himalayan Mountain Cabs</span>
              <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#0B2B20]">Railway Station & Airport Transfers</h2>
              <p className="text-sm text-stone-600 mt-1">
                Verified hill drivers with commercial permits, clean heated cabs, and direct doorstep hotel drop.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {taxiRoutes.map((route) => {
                const isSelectedSedan = selectedTaxi?.route.id === route.id && selectedTaxi.vehicle === 'Sedan';
                const isSelectedSUV = selectedTaxi?.route.id === route.id && selectedTaxi.vehicle === 'SUV';

                return (
                  <div key={route.id} className="luxury-card p-6 rounded-2xl flex flex-col justify-between space-y-4">
                    <div className="space-y-3">
                      <span className="text-xs font-bold text-[#0B2B20] bg-emerald-100 px-2.5 py-1 rounded-md">
                        🛣️ {route.distance} • ⏱️ {route.duration}
                      </span>
                      <h3 className="text-lg font-serif font-bold text-[#0B2B20]">{route.from} ⇄ {route.to}</h3>
                      <p className="text-xs text-stone-600 leading-relaxed">{route.description}</p>
                    </div>

                    <div className="grid grid-cols-2 gap-3 pt-3">
                      <div className={`p-4 rounded-xl border text-center transition ${isSelectedSedan ? 'border-[#0B2B20] bg-emerald-50/70 ring-1 ring-[#0B2B20]' : 'border-[#EAE5DE] bg-[#FAF8F5]'}`}>
                        <span className="text-xs font-bold text-stone-700 block">Sedan (Dzire / Etios)</span>
                        <span className="text-xs text-stone-500 block mb-1">Max 4 Guests</span>
                        <span className="text-lg font-black text-[#0B2B20]">₹{route.priceSedan}</span>
                        <button
                          onClick={() => setSelectedTaxi({ route, vehicle: 'Sedan' })}
                          className={`mt-2 w-full text-xs font-bold py-2 rounded-lg transition ${isSelectedSedan ? 'bg-[#0B2B20] text-white shadow-sm' : 'bg-white border border-stone-300 text-stone-800 hover:bg-stone-100'}`}
                        >
                          {isSelectedSedan ? '✓ Added' : 'Book Sedan'}
                        </button>
                      </div>

                      <div className={`p-4 rounded-xl border text-center transition ${isSelectedSUV ? 'border-[#0B2B20] bg-emerald-50/70 ring-1 ring-[#0B2B20]' : 'border-[#EAE5DE] bg-[#FAF8F5]'}`}>
                        <span className="text-xs font-bold text-stone-700 block">SUV (Innova / Bolero)</span>
                        <span className="text-xs text-stone-500 block mb-1">Max 6-7 Guests</span>
                        <span className="text-lg font-black text-[#0B2B20]">₹{route.priceSUV}</span>
                        <button
                          onClick={() => setSelectedTaxi({ route, vehicle: 'SUV' })}
                          className={`mt-2 w-full text-xs font-bold py-2 rounded-lg transition ${isSelectedSUV ? 'bg-[#0B2B20] text-white shadow-sm' : 'bg-white border border-stone-300 text-stone-800 hover:bg-stone-100'}`}
                        >
                          {isSelectedSUV ? '✓ Added' : 'Book SUV'}
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ===================== TAB 3: FOOD ===================== */}
        {activeTab === 'food' && (
          <div className="space-y-8">
            <div className="border-b border-[#E5DFD5] pb-4">
              <span className="text-xs font-bold uppercase tracking-wider text-[#C59B27]">Fresh Mountain Bounty</span>
              <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#0B2B20]">Kumaoni & Pure Satvik Kitchen</h2>
              <p className="text-sm text-stone-600 mt-1">
                Cooked with spring water and local Kumaoni pulses. 100% vegetarian, with strictly no-onion no-garlic options for temple devotees.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {foodMenu.map((food) => {
                const count = selectedFood[food.id] || 0;
                return (
                  <div key={food.id} className="luxury-card rounded-2xl overflow-hidden flex flex-col justify-between">
                    <div>
                      <div className="h-48 overflow-hidden relative">
                        <img src={food.image} alt={food.name} className="w-full h-full object-cover transition duration-300 hover:scale-105" />
                        <span className="absolute top-3 right-3 bg-white/95 text-emerald-800 text-[11px] font-bold px-2 py-0.5 rounded-md shadow-sm">
                          🟢 100% Veg
                        </span>
                      </div>
                      <div className="p-5 space-y-2">
                        <span className="text-[10px] uppercase font-bold tracking-wider text-[#C59B27] bg-amber-50 px-2 py-0.5 rounded">
                          {food.category}
                        </span>
                        <h3 className="font-serif font-bold text-[#0B2B20] text-base">{food.name}</h3>
                        <p className="text-xs text-stone-600 leading-relaxed">{food.description}</p>
                      </div>
                    </div>

                    <div className="p-4 bg-[#FAF8F5] border-t border-[#EAE5DE] flex items-center justify-between">
                      <span className="text-lg font-black text-[#0B2B20]">₹{food.price}</span>
                      <div>
                        {count > 0 ? (
                          <div className="flex items-center gap-2 bg-white border border-[#0B2B20] rounded-xl px-2 py-1 shadow-xs">
                            <button
                              onClick={() => setSelectedFood({ ...selectedFood, [food.id]: count - 1 })}
                              className="text-stone-700 font-bold px-2 py-0.5"
                            >
                              -
                            </button>
                            <span className="text-xs font-bold text-[#0B2B20]">{count}</span>
                            <button
                              onClick={() => setSelectedFood({ ...selectedFood, [food.id]: count + 1 })}
                              className="text-stone-700 font-bold px-2 py-0.5"
                            >
                              +
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => setSelectedFood({ ...selectedFood, [food.id]: 1 })}
                            className="text-xs bg-[#0B2B20] hover:bg-[#164E3D] text-white font-bold px-4 py-2 rounded-xl transition shadow-sm"
                          >
                            + Add to Stay
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ===================== TAB 4: TREKKING ===================== */}
        {activeTab === 'treks' && (
          <div className="space-y-8">
            <div className="border-b border-[#E5DFD5] pb-4">
              <span className="text-xs font-bold uppercase tracking-wider text-[#C59B27]">Sacred Trails & Peaks</span>
              <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#0B2B20]">Guided Himalayan Treks & Walks</h2>
              <p className="text-sm text-stone-600 mt-1">
                Explore ancient deodar forests and 360-degree views of Nanda Devi and Trishul peaks with local licensed guides.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {treks.map((trek) => {
                const count = selectedTreks[trek.id] || 0;
                return (
                  <div key={trek.id} className="luxury-card rounded-2xl overflow-hidden flex flex-col justify-between">
                    <div>
                      <div className="h-48 overflow-hidden relative">
                        <img src={trek.image} alt={trek.title} className="w-full h-full object-cover transition duration-300 hover:scale-105" />
                        <span className="absolute top-3 left-3 bg-[#0B2B20]/90 backdrop-blur text-white text-[11px] font-bold px-2.5 py-1 rounded-md shadow-sm">
                          🏔️ {trek.altitude}
                        </span>
                        <span className="absolute top-3 right-3 bg-white/95 text-stone-800 text-[11px] font-bold px-2.5 py-1 rounded-md shadow-sm">
                          {trek.difficulty}
                        </span>
                      </div>

                      <div className="p-5 space-y-3">
                        <span className="text-xs text-stone-500 font-semibold block">⏱️ Duration: {trek.duration}</span>
                        <h3 className="font-serif font-bold text-[#0B2B20] text-base leading-snug">{trek.title}</h3>
                        <p className="text-xs text-stone-600 leading-relaxed">{trek.description}</p>
                        
                        <div className="pt-2 border-t border-stone-100 space-y-1">
                          <span className="text-[11px] font-bold text-stone-700 block">Includes:</span>
                          {trek.includes.map((inc, i) => (
                            <span key={i} className="text-[11px] text-stone-600 block">• {inc}</span>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="p-4 bg-[#FAF8F5] border-t border-[#EAE5DE] flex items-center justify-between">
                      <div>
                        <span className="text-lg font-black text-[#0B2B20]">₹{trek.pricePerPerson}</span>
                        <span className="text-[11px] text-stone-500 block">per hiker</span>
                      </div>
                      <div>
                        {count > 0 ? (
                          <div className="flex items-center gap-2 bg-white border border-[#0B2B20] rounded-xl px-2 py-1 shadow-xs">
                            <button
                              onClick={() => setSelectedTreks({ ...selectedTreks, [trek.id]: count - 1 })}
                              className="text-stone-700 font-bold px-2 py-0.5"
                            >
                              -
                            </button>
                            <span className="text-xs font-bold text-[#0B2B20]">{count} Hikers</span>
                            <button
                              onClick={() => setSelectedTreks({ ...selectedTreks, [trek.id]: count + 1 })}
                              className="text-stone-700 font-bold px-2 py-0.5"
                            >
                              +
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => setSelectedTreks({ ...selectedTreks, [trek.id]: 1 })}
                            className="text-xs bg-[#0B2B20] hover:bg-[#164E3D] text-white font-bold px-4 py-2 rounded-xl transition shadow-sm"
                          >
                            + Add Trek
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </main>

      {/* 7. DETAILED BOOKING & CHECKOUT DRAWER */}
      {isCheckoutDrawerOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex justify-end">
          <div className="bg-white w-full max-w-lg h-full overflow-y-auto p-6 sm:p-8 flex flex-col justify-between shadow-2xl border-l border-[#E5DFD5]">
            <div className="space-y-6">
              <div className="flex items-center justify-between border-b border-[#E5DFD5] pb-4">
                <div>
                  <span className="text-xs font-bold text-[#C59B27] uppercase tracking-wider block">Direct Reservation</span>
                  <h3 className="text-xl font-serif font-bold text-[#0B2B20]">Complete Guest Information</h3>
                  <p className="text-xs text-stone-500 mt-0.5">{checkIn} to {checkOut} • {nights} Night(s)</p>
                </div>
                <button
                  onClick={() => setIsCheckoutDrawerOpen(false)}
                  className="w-8 h-8 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-700 flex items-center justify-center font-bold text-sm transition"
                >
                  ✕
                </button>
              </div>

              {/* ROOM SUMMARY */}
              <div className="bg-[#FAF8F5] p-4 rounded-xl border border-[#EAE5DE] space-y-1">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-[10px] font-bold text-emerald-800 uppercase tracking-widest bg-emerald-50 px-2 py-0.5 rounded">
                      ROOM RESERVED
                    </span>
                    <h4 className="font-serif font-bold text-[#0B2B20] text-base mt-1">{selectedRoom?.name}</h4>
                    <p className="text-xs text-stone-500">₹{selectedRoom?.pricePerNight} × {nights} nights • {selectedRoom?.distanceFromTemple}</p>
                    {isCapacityExceeded && (
                      <p className="text-xs text-red-600 font-bold mt-1">
                        ⚠️ Selected {adults} adults exceeds room capacity of {selectedRoom?.capacityAdults}!
                      </p>
                    )}
                  </div>
                  <span className="font-black text-[#0B2B20] text-base">₹{roomTotal.toLocaleString('en-IN')}</span>
                </div>
              </div>

              {/* TAXI SUMMARY */}
              {selectedTaxi && (
                <div className="bg-[#FAF8F5] p-4 rounded-xl border border-[#EAE5DE] flex justify-between items-start">
                  <div>
                    <span className="text-[10px] font-bold text-emerald-800 uppercase tracking-widest bg-emerald-50 px-2 py-0.5 rounded">
                      MOUNTAIN CAB ({selectedTaxi.vehicle})
                    </span>
                    <h4 className="font-serif font-bold text-[#0B2B20] text-sm mt-1">{selectedTaxi.route.from} ➔ {selectedTaxi.route.to}</h4>
                    <p className="text-xs text-stone-500">{selectedTaxi.route.distance}</p>
                  </div>
                  <div className="text-right">
                    <span className="font-black text-[#0B2B20] text-sm">₹{taxiTotal.toLocaleString('en-IN')}</span>
                    <button onClick={() => setSelectedTaxi(null)} className="block text-xs text-red-600 hover:underline mt-1 font-semibold">
                      Remove
                    </button>
                  </div>
                </div>
              )}

              {/* FOOD SUMMARY */}
              {foodTotal > 0 && (
                <div className="bg-[#FAF8F5] p-4 rounded-xl border border-[#EAE5DE] space-y-2">
                  <span className="text-[10px] font-bold text-emerald-800 uppercase tracking-widest bg-emerald-50 px-2 py-0.5 rounded">
                    KUMAONI & SATVIK MEALS
                  </span>
                  {Object.entries(selectedFood).map(([id, qty]) => {
                    if (qty === 0) return null;
                    const item = foodMenu.find((f) => f.id === id);
                    return (
                      <div key={id} className="flex justify-between text-xs text-stone-700">
                        <span>{item?.name} (×{qty})</span>
                        <span className="font-bold text-[#0B2B20]">₹{(item ? item.price * qty : 0).toLocaleString('en-IN')}</span>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* TREKS SUMMARY */}
              {trekTotal > 0 && (
                <div className="bg-[#FAF8F5] p-4 rounded-xl border border-[#EAE5DE] space-y-2">
                  <span className="text-[10px] font-bold text-emerald-800 uppercase tracking-widest bg-emerald-50 px-2 py-0.5 rounded">
                    GUIDED HIMALAYAN EXPEDITIONS
                  </span>
                  {Object.entries(selectedTreks).map(([id, qty]) => {
                    if (qty === 0) return null;
                    const trek = treks.find((t) => t.id === id);
                    return (
                      <div key={id} className="flex justify-between text-xs text-stone-700">
                        <span>{trek?.title} ({qty} Hikers)</span>
                        <span className="font-bold text-[#0B2B20]">₹{(trek ? trek.pricePerPerson * qty : 0).toLocaleString('en-IN')}</span>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* MANDATORY GUEST DETAILS FORM */}
              <div className="space-y-4 pt-2 border-t border-[#E5DFD5]">
                <span className="text-xs font-bold text-[#0B2B20] uppercase tracking-wider block">
                  Mandatory Guest Details
                </span>

                <div>
                  <label className="block text-[11px] font-bold text-stone-700 mb-1">Primary Guest Full Name *</label>
                  <input
                    type="text"
                    required
                    value={guestName}
                    onChange={(e) => setGuestName(e.target.value)}
                    placeholder="e.g. Ravi Bhatt"
                    className="w-full text-xs p-3 border border-stone-300 rounded-xl bg-[#FAF8F5] focus:outline-[#0B2B20]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-stone-700 mb-1">WhatsApp Mobile *</label>
                    <input
                      type="tel"
                      required
                      value={guestPhone}
                      onChange={(e) => setGuestPhone(e.target.value)}
                      placeholder="+91 98765 XXXXX"
                      className="w-full text-xs p-3 border border-stone-300 rounded-xl bg-[#FAF8F5] focus:outline-[#0B2B20]"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-stone-700 mb-1">Email Address *</label>
                    <input
                      type="email"
                      required
                      value={guestEmail}
                      onChange={(e) => setGuestEmail(e.target.value)}
                      placeholder="ravi@example.com"
                      className="w-full text-xs p-3 border border-stone-300 rounded-xl bg-[#FAF8F5] focus:outline-[#0B2B20]"
                    />
                  </div>
                </div>

                {/* SPECIAL REQUESTS */}
                <div>
                  <label className="block text-[11px] font-bold text-stone-700 mb-1">Special Preferences / Requests</label>
                  <input
                    type="text"
                    value={specialRequests}
                    onChange={(e) => setSpecialRequests(e.target.value)}
                    placeholder="e.g. Ground floor for elderly, extra heater, pure satvik food..."
                    className="w-full text-xs p-3 border border-stone-300 rounded-xl bg-[#FAF8F5] focus:outline-[#0B2B20]"
                  />
                </div>

                {/* REFUND & CANCELLATION POLICY CHECKBOX */}
                <div className="p-3 bg-stone-50 border border-stone-200 rounded-xl space-y-2">
                  <label className="flex items-start gap-2.5 cursor-pointer text-xs">
                    <input
                      type="checkbox"
                      checked={acceptedRefundPolicy}
                      onChange={(e) => setAcceptedRefundPolicy(e.target.checked)}
                      className="mt-0.5 rounded text-[#0B2B20] focus:ring-[#0B2B20] w-4 h-4 cursor-pointer"
                    />
                    <span className="text-stone-700 leading-snug">
                      I have read and agree to the <strong>Cancellation & Refund Policy</strong>: 100% refund on room booking cancelled up to 48 hours prior to check-in (12:00 PM standard check-in).
                    </span>
                  </label>
                </div>
              </div>

              {/* DETAILED PRICE BREAKDOWN */}
              <div className="border-t border-[#E5DFD5] pt-4 space-y-2 text-xs">
                <div className="flex justify-between text-stone-600">
                  <span>Subtotal Amount:</span>
                  <span className="font-semibold text-stone-900">₹{subtotal.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between text-stone-600">
                  <span>Applicable GST (12%):</span>
                  <span className="font-semibold text-stone-900">₹{gstAmount.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between text-stone-900 font-bold text-lg pt-2 border-t border-[#E5DFD5]">
                  <span>Total Itinerary Amount:</span>
                  <span className="text-[#0B2B20]">₹{grandTotal.toLocaleString('en-IN')}</span>
                </div>

                <div className="p-3.5 bg-amber-50/90 border border-amber-200/80 rounded-xl space-y-1">
                  <div className="flex justify-between items-center text-amber-950 font-bold text-sm">
                    <span>💳 Advance Deposit to Lock (30%):</span>
                    <span className="text-base text-[#0B2B20]">₹{advanceToken.toLocaleString('en-IN')}</span>
                  </div>
                  <p className="text-[11px] text-amber-800 leading-snug">
                    Remaining balance of <strong>₹{(grandTotal - advanceToken).toLocaleString('en-IN')}</strong> is payable upon arrival at hotel check-in.
                  </p>
                </div>
              </div>
            </div>

            {/* CHECKOUT PROCEED BUTTON */}
            <div className="pt-6 border-t border-[#E5DFD5] mt-6 space-y-3">
              <button
                disabled={starting}
                onClick={handleProceedToPayment}
                className="w-full bg-gradient-to-r from-[#0B2B20] to-[#184E38] hover:from-[#164E3D] hover:to-[#0B2B20] text-white font-bold py-3.5 px-4 rounded-xl shadow-lg transition flex items-center justify-center gap-2 hover:shadow-xl"
              >
                <span>{starting ? 'Preparing secure checkout…' : `Test the ₹${advanceToken.toLocaleString('en-IN')} advance with Stripe`}</span>
              </button>
              <div className="text-[11px] text-center text-stone-500 space-y-0.5">
                <p>Test only. No real charge or room reservation.</p>
                {checkoutError && <p role="alert" className="text-red-700">{checkoutError}</p>}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Stripe test checkout */}
      {checkoutUrl && <div className="fixed inset-0 z-[100] grid place-items-center bg-black/60 p-4"><section role="dialog" aria-modal="true" aria-label="Test checkout" className="max-w-md space-y-4 rounded-2xl bg-white p-6"><h2 className="font-serif text-2xl font-bold">Your test checkout is ready</h2><p>Use test card <strong>4242 4242 4242 4242</strong>, a future expiry and any three-digit CVC. No money is charged or room reserved.</p><a autoFocus href={checkoutUrl} target="_blank" rel="noopener noreferrer" className="block rounded-lg bg-emerald-950 p-3 text-center font-bold text-white">Open Stripe test checkout in a new tab</a><button onClick={()=>setCheckoutUrl('')} className="underline">Back to booking</button></section></div>}

      {/* 11. GENERAL ENQUIRY MODAL */}
      {isEnquiryOpen && (
        <EnquiryModal onClose={() => setIsEnquiryOpen(false)} />
      )}

      {/* 12. FOOTER */}
      <footer className="bg-[#0B2B20] text-stone-300 py-16 px-4 sm:px-8 mt-20 border-t border-emerald-900">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-10">
          <div className="space-y-3">
            <h4 className="font-serif font-bold text-white text-xl">Jageshwar Dham Retreat</h4>
            <p className="text-xs text-stone-300 leading-relaxed">
              Nestled amidst century-old Deodar cedars, offering peaceful pilgrimage stays, verified Kathgodam mountain transfers, wholesome Kumaoni dining, and Himalayan trail treks.
            </p>
            <div className="pt-2 text-xs text-amber-300">
              📍 Near Dandeshwar Shrine, Main Temple Road, Jageshwar Dham, Almora, Uttarakhand 263623
            </div>
          </div>

          <div className="space-y-3">
            <h4 className="font-serif font-bold text-white text-base">Reaching Jageshwar Dham</h4>
            <ul className="text-xs text-stone-300 space-y-1.5 leading-relaxed">
              <li>• <strong>Kathgodam Railway Station:</strong> 120 km (Scenic 4-hour mountain drive)</li>
              <li>• <strong>Pantnagar Airport:</strong> 150 km (5-hour drive via Haldwani)</li>
              <li>• <strong>Almora Town:</strong> 36 km (1.2 hours via Artola)</li>
            </ul>
          </div>

          <div className="space-y-3">
            <h4 className="font-serif font-bold text-white text-base">Direct Reception & Hotel PMS</h4>
            <p className="text-xs text-stone-300">
              Front desk management, staff reservations, and cab dispatch terminal access.
            </p>
            <div className="bg-white/10 p-3 rounded-xl border border-white/20 space-y-2">
              <span className="text-xs text-amber-300 font-bold block">Front Desk (24x7): +91 98765 43210</span>
              <Link
                href="/admin/login"
                className="inline-block bg-[#C59B27] hover:bg-[#d6a933] text-stone-950 font-bold text-xs px-3 py-1.5 rounded-lg transition"
              >
                🔐 Staff & Admin Login →
              </Link>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto border-t border-emerald-900/80 mt-12 pt-8 text-center text-xs text-stone-400 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p>© {new Date().getFullYear()} Jageshwar Dham Retreat. All rights reserved.</p>
          <div className="flex gap-4">
            <Link href="/admin/login" className="text-amber-300 hover:underline">Hotel PMS Staff Login</Link>
            <span>•</span>
            <span className="text-stone-400">Direct Booking System v2.0</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
