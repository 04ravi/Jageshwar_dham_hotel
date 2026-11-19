'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useHotel } from '@/context/HotelContext';
import { Room, TaxiRoute, FoodItem, Trek, Booking } from '@/data/mockData';
import InvoiceModal from '@/components/InvoiceModal';
import CheckTestReceipt from '@/components/CheckTestReceipt';

export default function AdminDashboard() {
  const router = useRouter();
  const {
    rooms,
    taxiRoutes,
    foodMenu,
    treks,
    bookings,
    enquiries,
    isAdminAuthenticated,
    adminLogout,
    addRoom,
    updateRoom,
    updateRoomStatus,
    deleteRoom,
    addTaxiRoute,
    updateTaxiRoute,
    deleteTaxiRoute,
    addFoodItem,
    updateFoodItem,
    deleteFoodItem,
    addTrek,
    updateTrek,
    deleteTrek,
    addBooking,
    updateBookingStatus,
    deleteBooking
  } = useHotel();

  // Auth Guard
  useEffect(() => {
    if (!isAdminAuthenticated) {
      router.push('/admin/login');
    }
  }, [isAdminAuthenticated, router]);

  // Tab State
  const [activeTab, setActiveTab] = useState<'rooms' | 'taxi' | 'food' | 'treks' | 'walkin' | 'bookings' | 'enquiries'>('rooms');

  // Search Filter for Bookings
  const [bookingSearch, setBookingSearch] = useState('');

  // Invoice Modal State
  const [selectedInvoiceBooking, setSelectedInvoiceBooking] = useState<Booking | null>(null);

  // 1. Room CRUD Modal States
  const [isAddRoomOpen, setIsAddRoomOpen] = useState(false);
  const [editingRoom, setEditingRoom] = useState<Room | null>(null);
  const [newRoomName, setNewRoomName] = useState('');
  const [newRoomCategory, setNewRoomCategory] = useState<'Deluxe' | 'Suite' | 'Cottage' | 'Standard'>('Deluxe');
  const [newRoomPrice, setNewRoomPrice] = useState(2500);
  const [newRoomAdults, setNewRoomAdults] = useState(2);
  const [newRoomChildren, setNewRoomChildren] = useState(1);
  const [newRoomDistance, setNewRoomDistance] = useState('200 meters (2.5 mins walk)');
  const [newRoomMeters, setNewRoomMeters] = useState(200);
  const [newRoomView, setNewRoomView] = useState('Dense Deodar Forest');
  const [newRoomImage, setNewRoomImage] = useState('https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1000&q=80');
  const [newRoomDesc, setNewRoomDesc] = useState('Peaceful mountain room with pine views, heavy heater, and 24x7 geyser hot water.');
  const [newRoomStatus, setNewRoomStatus] = useState<Room['status']>('Vacant');

  // 2. Taxi CRUD Modal States
  const [isTaxiModalOpen, setIsTaxiModalOpen] = useState(false);
  const [editingTaxi, setEditingTaxi] = useState<TaxiRoute | null>(null);
  const [taxiFrom, setTaxiFrom] = useState('');
  const [taxiTo, setTaxiTo] = useState('Jageshwar Dham');
  const [taxiDistance, setTaxiDistance] = useState('120 km');
  const [taxiDuration, setTaxiDuration] = useState('4 hours');
  const [taxiPriceSedan, setTaxiPriceSedan] = useState(3200);
  const [taxiPriceSUV, setTaxiPriceSUV] = useState(4500);
  const [taxiDesc, setTaxiDesc] = useState('Direct scenic mountain cab transfer with verified hill driver.');

  // 3. Food CRUD Modal States
  const [isFoodModalOpen, setIsFoodModalOpen] = useState(false);
  const [editingFood, setEditingFood] = useState<FoodItem | null>(null);
  const [foodName, setFoodName] = useState('');
  const [foodCategory, setFoodCategory] = useState<'Kumaoni Special' | 'Satvik' | 'Breakfast' | 'Beverages'>('Kumaoni Special');
  const [foodPrice, setFoodPrice] = useState(300);
  const [foodIsVeg, setFoodIsVeg] = useState(true);
  const [foodImage, setFoodImage] = useState('https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=600&q=80');
  const [foodDesc, setFoodDesc] = useState('Authentic pahadi preparation cooked with organic local ingredients.');

  // 4. Trek CRUD Modal States
  const [isTrekModalOpen, setIsTrekModalOpen] = useState(false);
  const [editingTrek, setEditingTrek] = useState<Trek | null>(null);
  const [trekTitle, setTrekTitle] = useState('');
  const [trekDuration, setTrekDuration] = useState('3.5 Hours');
  const [trekDifficulty, setTrekDifficulty] = useState<'Easy' | 'Moderate' | 'Challenging'>('Moderate');
  const [trekAltitude, setTrekAltitude] = useState('2,100m (6,900 ft)');
  const [trekPrice, setTrekPrice] = useState(700);
  const [trekImage, setTrekImage] = useState('https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1000&q=80');
  const [trekDesc, setTrekDesc] = useState('Scenic forest trail hike through deodar pine woods with panoramic Himalayan peak views.');
  const [trekIncludesText, setTrekIncludesText] = useState('Certified Mountain Guide, Trekking Poles, Mineral Water, Temple Briefing');

  // 5. Walk-In Booking Form State
  const [walkinRoomId, setWalkinRoomId] = useState(rooms[0]?.id || '');
  const [walkinName, setWalkinName] = useState('');
  const [walkinPhone, setWalkinPhone] = useState('');
  const [walkinEmail, setWalkinEmail] = useState('');
  const [walkinCheckIn, setWalkinCheckIn] = useState('2026-11-20');
  const [walkinCheckOut, setWalkinCheckOut] = useState('2026-11-22');
  const [walkinAdults, setWalkinAdults] = useState(2);
  const [walkinChildren, setWalkinChildren] = useState(0);
  const [walkinIdProof, setWalkinIdProof] = useState('Aadhaar Card Verified at Reception');
  const [walkinTaxiRouteId, setWalkinTaxiRouteId] = useState('');
  const [walkinTaxiVehicle, setWalkinTaxiVehicle] = useState<'Sedan' | 'SUV'>('Sedan');
  const [walkinFoodItemId, setWalkinFoodItemId] = useState('');
  const [walkinFoodQty, setWalkinFoodQty] = useState(0);
  const [walkinTrekId, setWalkinTrekId] = useState('');
  const [walkinTrekParticipants, setWalkinTrekParticipants] = useState(0);
  const [walkinPaymentMode, setWalkinPaymentMode] = useState<'CASH' | 'RAZORPAY_UPI' | 'RAZORPAY_CARD'>('CASH');
  const [walkinPaymentType, setWalkinPaymentType] = useState<'FULL' | 'ADVANCE_30'>('ADVANCE_30');
  const [walkinSuccessBooking, setWalkinSuccessBooking] = useState<Booking | null>(null);

  // ROOM SAVE
  const handleSaveRoom = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRoomName.trim()) return;

    if (editingRoom) {
      updateRoom(editingRoom.id, {
        name: newRoomName,
        category: newRoomCategory,
        pricePerNight: Number(newRoomPrice),
        capacityAdults: Number(newRoomAdults),
        capacityChildren: Number(newRoomChildren),
        distanceFromTemple: newRoomDistance,
        distanceMeters: Number(newRoomMeters),
        view: newRoomView,
        image: newRoomImage,
        description: newRoomDesc,
        status: newRoomStatus
      });
      setEditingRoom(null);
    } else {
      addRoom({
        name: newRoomName,
        category: newRoomCategory,
        pricePerNight: Number(newRoomPrice),
        capacityAdults: Number(newRoomAdults),
        capacityChildren: Number(newRoomChildren),
        distanceFromTemple: newRoomDistance,
        distanceMeters: Number(newRoomMeters),
        view: newRoomView,
        image: newRoomImage,
        description: newRoomDesc,
        status: newRoomStatus,
        amenities: [
          'Free High-Speed Wi-Fi',
          '24/7 Hot Water Geyser',
          'Electric Kettle with Kumaoni Teas',
          'Heavy Room Heater',
          'Mountain Balcony'
        ]
      });
    }

    setIsAddRoomOpen(false);
  };

  const openEditRoomModal = (room: Room) => {
    setEditingRoom(room);
    setNewRoomName(room.name);
    setNewRoomCategory(room.category);
    setNewRoomPrice(room.pricePerNight);
    setNewRoomAdults(room.capacityAdults);
    setNewRoomChildren(room.capacityChildren);
    setNewRoomDistance(room.distanceFromTemple);
    setNewRoomMeters(room.distanceMeters);
    setNewRoomView(room.view);
    setNewRoomImage(room.image);
    setNewRoomDesc(room.description);
    setNewRoomStatus(room.status);
    setIsAddRoomOpen(true);
  };

  // TAXI SAVE
  const handleSaveTaxi = (e: React.FormEvent) => {
    e.preventDefault();
    if (!taxiFrom.trim() || !taxiTo.trim()) return;

    if (editingTaxi) {
      updateTaxiRoute(editingTaxi.id, {
        from: taxiFrom,
        to: taxiTo,
        distance: taxiDistance,
        duration: taxiDuration,
        priceSedan: Number(taxiPriceSedan),
        priceSUV: Number(taxiPriceSUV),
        description: taxiDesc
      });
      setEditingTaxi(null);
    } else {
      addTaxiRoute({
        from: taxiFrom,
        to: taxiTo,
        distance: taxiDistance,
        duration: taxiDuration,
        priceSedan: Number(taxiPriceSedan),
        priceSUV: Number(taxiPriceSUV),
        description: taxiDesc
      });
    }

    setIsTaxiModalOpen(false);
  };

  const openEditTaxiModal = (route: TaxiRoute) => {
    setEditingTaxi(route);
    setTaxiFrom(route.from);
    setTaxiTo(route.to);
    setTaxiDistance(route.distance);
    setTaxiDuration(route.duration);
    setTaxiPriceSedan(route.priceSedan);
    setTaxiPriceSUV(route.priceSUV);
    setTaxiDesc(route.description);
    setIsTaxiModalOpen(true);
  };

  // FOOD SAVE
  const handleSaveFood = (e: React.FormEvent) => {
    e.preventDefault();
    if (!foodName.trim()) return;

    if (editingFood) {
      updateFoodItem(editingFood.id, {
        name: foodName,
        category: foodCategory,
        price: Number(foodPrice),
        isVeg: foodIsVeg,
        image: foodImage,
        description: foodDesc
      });
      setEditingFood(null);
    } else {
      addFoodItem({
        name: foodName,
        category: foodCategory,
        price: Number(foodPrice),
        isVeg: foodIsVeg,
        image: foodImage,
        description: foodDesc
      });
    }

    setIsFoodModalOpen(false);
  };

  const openEditFoodModal = (food: FoodItem) => {
    setEditingFood(food);
    setFoodName(food.name);
    setFoodCategory(food.category);
    setFoodPrice(food.price);
    setFoodIsVeg(food.isVeg);
    setFoodImage(food.image);
    setFoodDesc(food.description);
    setIsFoodModalOpen(true);
  };

  // TREK SAVE
  const handleSaveTrek = (e: React.FormEvent) => {
    e.preventDefault();
    if (!trekTitle.trim()) return;

    const includesArr = trekIncludesText.split(',').map((s) => s.trim()).filter(Boolean);

    if (editingTrek) {
      updateTrek(editingTrek.id, {
        title: trekTitle,
        duration: trekDuration,
        difficulty: trekDifficulty,
        altitude: trekAltitude,
        pricePerPerson: Number(trekPrice),
        image: trekImage,
        description: trekDesc,
        includes: includesArr
      });
      setEditingTrek(null);
    } else {
      addTrek({
        title: trekTitle,
        duration: trekDuration,
        difficulty: trekDifficulty,
        altitude: trekAltitude,
        pricePerPerson: Number(trekPrice),
        image: trekImage,
        description: trekDesc,
        includes: includesArr
      });
    }

    setIsTrekModalOpen(false);
  };

  const openEditTrekModal = (trek: Trek) => {
    setEditingTrek(trek);
    setTrekTitle(trek.title);
    setTrekDuration(trek.duration);
    setTrekDifficulty(trek.difficulty);
    setTrekAltitude(trek.altitude);
    setTrekPrice(trek.pricePerPerson);
    setTrekImage(trek.image);
    setTrekDesc(trek.description);
    setTrekIncludesText(trek.includes.join(', '));
    setIsTrekModalOpen(true);
  };

  // WALK-IN RESERVATION
  const handleCreateWalkinBooking = (e: React.FormEvent) => {
    e.preventDefault();
    const room = rooms.find((r) => r.id === walkinRoomId) || rooms[0];
    if (!room) {
      alert('Please select a valid room.');
      return;
    }
    if (!walkinName.trim() || !walkinPhone.trim()) {
      alert('Please enter guest name and phone number.');
      return;
    }

    const nights = Math.max(1, Math.round((new Date(walkinCheckOut).getTime() - new Date(walkinCheckIn).getTime()) / (1000 * 60 * 60 * 24))) || 1;
    const roomAmount = room.pricePerNight * nights;

    // Taxi
    let taxiAmount = 0;
    let taxiObj = undefined;
    if (walkinTaxiRouteId) {
      const route = taxiRoutes.find((r) => r.id === walkinTaxiRouteId);
      if (route) {
        taxiAmount = walkinTaxiVehicle === 'SUV' ? route.priceSUV : route.priceSedan;
        taxiObj = { route, vehicle: walkinTaxiVehicle };
      }
    }

    // Food
    let foodAmount = 0;
    let foodList = undefined;
    if (walkinFoodItemId && walkinFoodQty > 0) {
      const food = foodMenu.find((f) => f.id === walkinFoodItemId);
      if (food) {
        foodAmount = food.price * walkinFoodQty;
        foodList = [{ item: food, quantity: walkinFoodQty }];
      }
    }

    // Trek
    let trekAmount = 0;
    let trekList = undefined;
    if (walkinTrekId && walkinTrekParticipants > 0) {
      const trek = treks.find((t) => t.id === walkinTrekId);
      if (trek) {
        trekAmount = trek.pricePerPerson * walkinTrekParticipants;
        trekList = [{ trek, participants: walkinTrekParticipants }];
      }
    }

    const subtotal = roomAmount + taxiAmount + foodAmount + trekAmount;
    const gstAmount = Math.round(subtotal * 0.12);
    const totalAmount = subtotal + gstAmount;

    let advancePaid = totalAmount;
    if (walkinPaymentType === 'ADVANCE_30') {
      advancePaid = Math.round(totalAmount * 0.3);
    }

    const createdBooking = addBooking({
      source: 'FRONT_DESK_ADMIN',
      guestName: walkinName,
      guestEmail: walkinEmail || 'reception@jageshwardhamretreat.com',
      guestPhone: walkinPhone,
      idProofName: walkinIdProof,
      checkIn: walkinCheckIn,
      checkOut: walkinCheckOut,
      nights,
      adults: walkinAdults,
      children: walkinChildren,
      room,
      taxi: taxiObj,
      foodItems: foodList,
      treks: trekList,
      roomAmount,
      taxiAmount,
      foodAmount,
      trekAmount,
      subtotal,
      gstAmount,
      totalAmount,
      advancePaid,
      balanceDue: totalAmount - advancePaid,
      paymentStatus: walkinPaymentType === 'FULL' ? 'PAID_FULL' : 'ADVANCE_30_PAID',
      paymentMethod: walkinPaymentMode,
      bookingStatus: 'CHECKED_IN',
      acceptedRefundPolicy: true,
      specialRequests: 'Walk-in reservation confirmed at front desk.'
    });

    setWalkinSuccessBooking(createdBooking);
    setWalkinName('');
    setWalkinPhone('');
    setWalkinEmail('');
  };

  // Filter Bookings by Search
  const filteredBookings = bookings.filter((b) => {
    const q = bookingSearch.toLowerCase();
    return (
      b.guestName.toLowerCase().includes(q) ||
      b.guestPhone.toLowerCase().includes(q) ||
      b.bookingNumber.toLowerCase().includes(q) ||
      b.room.name.toLowerCase().includes(q)
    );
  });

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-stone-900 font-sans selection:bg-amber-100 selection:text-emerald-950">
      
      {/* 1. ADMIN TOP BAR */}
      <header className="bg-[#0B2B20] text-white px-6 py-4 flex flex-wrap justify-between items-center gap-4 border-b border-emerald-900 shadow-md">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#164E3D] flex items-center justify-center text-xl shadow-inner">
            🏨
          </div>
          <div>
            <h1 className="text-lg font-serif font-bold tracking-tight text-white flex items-center gap-2">
              <span>Jageshwar Dham Retreat — Management Control</span>
              <span className="text-[10px] bg-emerald-700/80 text-emerald-200 px-2 py-0.5 rounded-full font-sans font-bold">
                Admin Console
              </span>
            </h1>
            <p className="text-xs text-emerald-300/90 font-medium">
              Live Room Control • Taxi Services CRUD • Kumaoni Menu • Guided Treks
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4 text-xs">
          <Link
            href="/"
            className="bg-[#164E3D] hover:bg-[#1f6650] text-white font-bold px-3.5 py-2 rounded-xl border border-emerald-700/60 transition shadow-sm"
          >
            ← View Guest Website
          </Link>

          <button
            onClick={() => {
              adminLogout();
              router.push('/admin/login');
            }}
            className="bg-red-950/80 hover:bg-red-900 text-red-200 font-bold px-3.5 py-2 rounded-xl border border-red-800 transition"
          >
            Sign Out 🚪
          </button>
        </div>
      </header>
      {activeTab === 'bookings' && <CheckTestReceipt />}

      {/* 2. ADMIN MAIN WORKSPACE */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-8 space-y-8">
        
        {/* KPI METRICS */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="luxury-card p-5 rounded-2xl bg-white border border-[#EAE5DE]">
            <span className="text-[11px] font-bold text-stone-500 uppercase tracking-wider block">Rooms in System</span>
            <div className="flex items-baseline gap-2 mt-2">
              <span className="text-3xl font-black text-[#0B2B20]">{rooms.length}</span>
              <span className="text-xs text-emerald-800 font-bold bg-emerald-50 px-2 py-0.5 rounded">
                {rooms.filter((r) => r.status === 'Vacant').length} Vacant
              </span>
            </div>
          </div>

          <div className="luxury-card p-5 rounded-2xl bg-white border border-[#EAE5DE]">
            <span className="text-[11px] font-bold text-stone-500 uppercase tracking-wider block">Mountain Cab Routes</span>
            <div className="flex items-baseline gap-2 mt-2">
              <span className="text-3xl font-black text-[#0B2B20]">{taxiRoutes.length}</span>
              <span className="text-xs text-stone-500 font-medium">Active Transit Services</span>
            </div>
          </div>

          <div className="luxury-card p-5 rounded-2xl bg-white border border-[#EAE5DE]">
            <span className="text-[11px] font-bold text-stone-500 uppercase tracking-wider block">Menu & Treks Listed</span>
            <div className="flex items-baseline gap-2 mt-2">
              <span className="text-3xl font-black text-[#0B2B20]">{foodMenu.length + treks.length}</span>
              <span className="text-xs text-stone-500">({foodMenu.length} Dishes, {treks.length} Trails)</span>
            </div>
          </div>

          <div className="luxury-card p-5 rounded-2xl bg-white border border-[#EAE5DE]">
            <span className="text-[11px] font-bold text-stone-500 uppercase tracking-wider block">Total Booking Volume</span>
            <div className="flex items-baseline gap-2 mt-2">
              <span className="text-3xl font-black text-[#C59B27]">
                ₹{bookings.reduce((sum, b) => sum + b.totalAmount, 0).toLocaleString('en-IN')}
              </span>
            </div>
          </div>
        </div>

        {/* OPERATIONS TABS NAVIGATION */}
        <div className="luxury-card rounded-2xl overflow-hidden bg-white border border-[#EAE5DE]">
          <div className="border-b border-[#EAE5DE] px-6 pt-4 flex gap-3 overflow-x-auto text-sm font-bold bg-[#FAF8F5]">
            <button
              onClick={() => setActiveTab('rooms')}
              className={`pb-3.5 border-b-2 transition flex items-center gap-1.5 whitespace-nowrap ${activeTab === 'rooms' ? 'border-[#0B2B20] text-[#0B2B20] font-black' : 'border-transparent text-stone-500 hover:text-stone-900'}`}
            >
              <span>🛏️ Rooms CRUD ({rooms.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('taxi')}
              className={`pb-3.5 border-b-2 transition flex items-center gap-1.5 whitespace-nowrap ${activeTab === 'taxi' ? 'border-[#0B2B20] text-[#0B2B20] font-black' : 'border-transparent text-stone-500 hover:text-stone-900'}`}
            >
              <span>🚖 Taxi Services CRUD ({taxiRoutes.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('food')}
              className={`pb-3.5 border-b-2 transition flex items-center gap-1.5 whitespace-nowrap ${activeTab === 'food' ? 'border-[#0B2B20] text-[#0B2B20] font-black' : 'border-transparent text-stone-500 hover:text-stone-900'}`}
            >
              <span>🍲 Dishes / Dining CRUD ({foodMenu.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('treks')}
              className={`pb-3.5 border-b-2 transition flex items-center gap-1.5 whitespace-nowrap ${activeTab === 'treks' ? 'border-[#0B2B20] text-[#0B2B20] font-black' : 'border-transparent text-stone-500 hover:text-stone-900'}`}
            >
              <span>🥾 Trek Packages CRUD ({treks.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('walkin')}
              className={`pb-3.5 border-b-2 transition flex items-center gap-1.5 whitespace-nowrap ${activeTab === 'walkin' ? 'border-[#0B2B20] text-[#0B2B20] font-black' : 'border-transparent text-stone-500 hover:text-stone-900'}`}
            >
              <span>📝 Walk-In Booking</span>
            </button>

            <button
              onClick={() => setActiveTab('bookings')}
              className={`pb-3.5 border-b-2 transition flex items-center gap-1.5 whitespace-nowrap ${activeTab === 'bookings' ? 'border-[#0B2B20] text-[#0B2B20] font-black' : 'border-transparent text-stone-500 hover:text-stone-900'}`}
            >
              <span>📄 All Bookings & Invoices ({bookings.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('enquiries')}
              className={`pb-3.5 border-b-2 transition flex items-center gap-1.5 whitespace-nowrap ${activeTab === 'enquiries' ? 'border-[#0B2B20] text-[#0B2B20] font-black' : 'border-transparent text-stone-500 hover:text-stone-900'}`}
            >
              <span>✉️ Guest Inquiries ({enquiries.length})</span>
            </button>
          </div>

          <div className="p-6">
            
            {/* ===================== TAB 1: ROOMS CRUD ===================== */}
            {activeTab === 'rooms' && (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="font-serif font-bold text-[#0B2B20] text-xl">Room Inventory & Real-Time Status</h3>
                    <p className="text-xs text-stone-500">Changes made here reflect immediately on the customer booking portal</p>
                  </div>
                  <button
                    onClick={() => {
                      setEditingRoom(null);
                      setNewRoomName('');
                      setNewRoomPrice(2800);
                      setNewRoomDistance('200 meters (2.5 mins walk)');
                      setNewRoomStatus('Vacant');
                      setIsAddRoomOpen(true);
                    }}
                    className="bg-[#0B2B20] hover:bg-[#164E3D] text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-md transition flex items-center gap-2"
                  >
                    <span>+ Add New Room</span>
                  </button>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border border-stone-200 rounded-xl overflow-hidden">
                    <thead className="bg-[#FAF8F5] text-stone-600 font-bold uppercase text-[10px] border-b border-stone-200">
                      <tr>
                        <th className="p-3.5">Room & Image</th>
                        <th className="p-3.5">Category</th>
                        <th className="p-3.5">Price / Night</th>
                        <th className="p-3.5">Capacity</th>
                        <th className="p-3.5">Temple Distance</th>
                        <th className="p-3.5">Live Room Status</th>
                        <th className="p-3.5 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-stone-100 text-stone-700">
                      {rooms.map((room) => (
                        <tr key={room.id} className="hover:bg-[#FAF8F5] transition">
                          <td className="p-3.5 flex items-center gap-3">
                            <img src={room.image} alt={room.name} className="w-12 h-12 rounded-lg object-cover border" />
                            <div>
                              <strong className="text-stone-900 block font-serif text-sm">{room.name}</strong>
                              <span className="text-[11px] text-stone-500">{room.view}</span>
                            </div>
                          </td>
                          <td className="p-3.5">
                            <span className="bg-stone-100 text-stone-800 font-bold px-2 py-0.5 rounded text-[11px]">
                              {room.category}
                            </span>
                          </td>
                          <td className="p-3.5 font-black text-[#0B2B20] text-sm">
                            ₹{room.pricePerNight}
                          </td>
                          <td className="p-3.5 font-medium">
                            {room.capacityAdults} Adults
                          </td>
                          <td className="p-3.5 font-semibold text-emerald-900">
                            🛕 {room.distanceFromTemple}
                          </td>
                          <td className="p-3.5">
                            <select
                              value={room.status}
                              onChange={(e) => updateRoomStatus(room.id, e.target.value as Room['status'])}
                              className={`text-xs font-bold p-1.5 rounded-lg border focus:outline-none transition cursor-pointer shadow-xs ${
                                room.status === 'Vacant'
                                  ? 'bg-emerald-50 text-emerald-900 border-emerald-300'
                                  : room.status === 'Booked'
                                  ? 'bg-red-50 text-red-900 border-red-300'
                                  : room.status === 'Engaged'
                                  ? 'bg-amber-50 text-amber-900 border-amber-300'
                                  : 'bg-stone-100 text-stone-800 border-stone-300'
                              }`}
                            >
                              <option value="Vacant">🟢 Vacant (Open to Book)</option>
                              <option value="Booked">🔴 Booked (Sold Out)</option>
                              <option value="Engaged">🟠 Engaged (Occupied)</option>
                              <option value="Maintenance">🟡 Maintenance (Cleaning)</option>
                            </select>
                          </td>
                          <td className="p-3.5 text-right space-x-2">
                            <button
                              onClick={() => openEditRoomModal(room)}
                              className="text-blue-700 hover:text-blue-900 font-bold text-xs bg-blue-50 px-2.5 py-1 rounded-lg border border-blue-200"
                            >
                              Edit ✏️
                            </button>
                            <button
                              onClick={() => {
                                if (confirm(`Are you sure you want to delete ${room.name}?`)) {
                                  deleteRoom(room.id);
                                }
                              }}
                              className="text-red-700 hover:text-red-900 font-bold text-xs bg-red-50 px-2.5 py-1 rounded-lg border border-red-200"
                            >
                              Delete 🗑️
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* ===================== TAB 2: TAXI SERVICES CRUD ===================== */}
            {activeTab === 'taxi' && (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="font-serif font-bold text-[#0B2B20] text-xl">Manage Mountain Taxi & Cab Transfers</h3>
                    <p className="text-xs text-stone-500">Configure transfer routes, fixed hill fares for Sedans and SUVs</p>
                  </div>
                  <button
                    onClick={() => {
                      setEditingTaxi(null);
                      setTaxiFrom('');
                      setTaxiTo('Jageshwar Dham');
                      setTaxiDistance('120 km');
                      setTaxiDuration('4 hours');
                      setTaxiPriceSedan(3200);
                      setTaxiPriceSUV(4500);
                      setTaxiDesc('Direct hill cab transfer with safe mountain driver.');
                      setIsTaxiModalOpen(true);
                    }}
                    className="bg-[#0B2B20] hover:bg-[#164E3D] text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-md transition flex items-center gap-2"
                  >
                    <span>+ Add New Cab Route</span>
                  </button>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border border-stone-200 rounded-xl overflow-hidden">
                    <thead className="bg-[#FAF8F5] text-stone-600 font-bold uppercase text-[10px] border-b border-stone-200">
                      <tr>
                        <th className="p-3.5">Route</th>
                        <th className="p-3.5">Distance & Duration</th>
                        <th className="p-3.5">Sedan Rate (₹)</th>
                        <th className="p-3.5">SUV Rate (₹)</th>
                        <th className="p-3.5">Route Description</th>
                        <th className="p-3.5 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-stone-100 text-stone-700">
                      {taxiRoutes.map((route) => (
                        <tr key={route.id} className="hover:bg-[#FAF8F5] transition">
                          <td className="p-3.5 font-bold text-stone-900 text-sm">
                            {route.from} ➔ {route.to}
                          </td>
                          <td className="p-3.5">
                            <span className="bg-emerald-50 text-emerald-900 font-bold px-2 py-0.5 rounded text-[11px]">
                              {route.distance} • {route.duration}
                            </span>
                          </td>
                          <td className="p-3.5 font-black text-[#0B2B20] text-sm">
                            ₹{route.priceSedan}
                          </td>
                          <td className="p-3.5 font-black text-[#0B2B20] text-sm">
                            ₹{route.priceSUV}
                          </td>
                          <td className="p-3.5 text-stone-500 max-w-xs text-[11px]">
                            {route.description}
                          </td>
                          <td className="p-3.5 text-right space-x-2">
                            <button
                              onClick={() => openEditTaxiModal(route)}
                              className="text-blue-700 hover:text-blue-900 font-bold text-xs bg-blue-50 px-2.5 py-1 rounded-lg border border-blue-200"
                            >
                              Edit ✏️
                            </button>
                            <button
                              onClick={() => {
                                if (confirm(`Delete cab route: ${route.from} to ${route.to}?`)) {
                                  deleteTaxiRoute(route.id);
                                }
                              }}
                              className="text-red-700 hover:text-red-900 font-bold text-xs bg-red-50 px-2.5 py-1 rounded-lg border border-red-200"
                            >
                              Delete 🗑️
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* ===================== TAB 3: DISHES / FOOD CRUD ===================== */}
            {activeTab === 'food' && (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="font-serif font-bold text-[#0B2B20] text-xl">Manage Kitchen Menu & Satvik Dishes</h3>
                    <p className="text-xs text-stone-500">Add traditional Kumaoni delicacies, pure Satvik pilgrim meals, and pricing</p>
                  </div>
                  <button
                    onClick={() => {
                      setEditingFood(null);
                      setFoodName('');
                      setFoodCategory('Kumaoni Special');
                      setFoodPrice(280);
                      setFoodIsVeg(true);
                      setFoodImage('https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=600&q=80');
                      setFoodDesc('');
                      setIsFoodModalOpen(true);
                    }}
                    className="bg-[#0B2B20] hover:bg-[#164E3D] text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-md transition flex items-center gap-2"
                  >
                    <span>+ Add New Dish / Meal</span>
                  </button>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border border-stone-200 rounded-xl overflow-hidden">
                    <thead className="bg-[#FAF8F5] text-stone-600 font-bold uppercase text-[10px] border-b border-stone-200">
                      <tr>
                        <th className="p-3.5">Dish & Image</th>
                        <th className="p-3.5">Category</th>
                        <th className="p-3.5">Price (₹)</th>
                        <th className="p-3.5">Dietary Tag</th>
                        <th className="p-3.5">Description</th>
                        <th className="p-3.5 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-stone-100 text-stone-700">
                      {foodMenu.map((food) => (
                        <tr key={food.id} className="hover:bg-[#FAF8F5] transition">
                          <td className="p-3.5 flex items-center gap-3">
                            <img src={food.image} alt={food.name} className="w-12 h-12 rounded-lg object-cover border" />
                            <strong className="text-stone-900 block font-serif text-sm">{food.name}</strong>
                          </td>
                          <td className="p-3.5">
                            <span className="bg-amber-50 text-amber-900 font-bold px-2 py-0.5 rounded text-[11px]">
                              {food.category}
                            </span>
                          </td>
                          <td className="p-3.5 font-black text-[#0B2B20] text-sm">
                            ₹{food.price}
                          </td>
                          <td className="p-3.5">
                            <span className="bg-emerald-100 text-emerald-900 font-bold px-2 py-0.5 rounded text-[10px]">
                              🟢 100% Satvik Veg
                            </span>
                          </td>
                          <td className="p-3.5 text-stone-500 max-w-xs text-[11px]">
                            {food.description}
                          </td>
                          <td className="p-3.5 text-right space-x-2">
                            <button
                              onClick={() => openEditFoodModal(food)}
                              className="text-blue-700 hover:text-blue-900 font-bold text-xs bg-blue-50 px-2.5 py-1 rounded-lg border border-blue-200"
                            >
                              Edit ✏️
                            </button>
                            <button
                              onClick={() => {
                                if (confirm(`Delete food item: ${food.name}?`)) {
                                  deleteFoodItem(food.id);
                                }
                              }}
                              className="text-red-700 hover:text-red-900 font-bold text-xs bg-red-50 px-2.5 py-1 rounded-lg border border-red-200"
                            >
                              Delete 🗑️
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* ===================== TAB 4: TREKKING PACKAGES CRUD ===================== */}
            {activeTab === 'treks' && (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="font-serif font-bold text-[#0B2B20] text-xl">Manage Guided Himalayan Treks & Nature Trails</h3>
                    <p className="text-xs text-stone-500">Configure trail lengths, difficulty ratings, guide inclusions, and per-person rates</p>
                  </div>
                  <button
                    onClick={() => {
                      setEditingTrek(null);
                      setTrekTitle('');
                      setTrekDuration('3 Hours');
                      setTrekDifficulty('Moderate');
                      setTrekAltitude('2,000m (6,500 ft)');
                      setTrekPrice(650);
                      setTrekImage('https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1000&q=80');
                      setTrekDesc('');
                      setTrekIncludesText('Certified Mountain Guide, Trekking Poles, Herbal Tea, Spring Water');
                      setIsTrekModalOpen(true);
                    }}
                    className="bg-[#0B2B20] hover:bg-[#164E3D] text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-md transition flex items-center gap-2"
                  >
                    <span>+ Add New Trek Trail</span>
                  </button>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border border-stone-200 rounded-xl overflow-hidden">
                    <thead className="bg-[#FAF8F5] text-stone-600 font-bold uppercase text-[10px] border-b border-stone-200">
                      <tr>
                        <th className="p-3.5">Trek & Image</th>
                        <th className="p-3.5">Difficulty</th>
                        <th className="p-3.5">Altitude & Duration</th>
                        <th className="p-3.5">Price / Hiker</th>
                        <th className="p-3.5">Inclusions</th>
                        <th className="p-3.5 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-stone-100 text-stone-700">
                      {treks.map((trek) => (
                        <tr key={trek.id} className="hover:bg-[#FAF8F5] transition">
                          <td className="p-3.5 flex items-center gap-3">
                            <img src={trek.image} alt={trek.title} className="w-12 h-12 rounded-lg object-cover border" />
                            <div>
                              <strong className="text-stone-900 block font-serif text-sm">{trek.title}</strong>
                              <span className="text-[11px] text-stone-500">{trek.description.slice(0, 45)}...</span>
                            </div>
                          </td>
                          <td className="p-3.5">
                            <span className="bg-stone-100 text-stone-800 font-bold px-2 py-0.5 rounded text-[11px]">
                              {trek.difficulty}
                            </span>
                          </td>
                          <td className="p-3.5">
                            <span className="font-semibold text-emerald-950 block">{trek.altitude}</span>
                            <span className="text-stone-400 text-[11px]">⏱️ {trek.duration}</span>
                          </td>
                          <td className="p-3.5 font-black text-[#0B2B20] text-sm">
                            ₹{trek.pricePerPerson}
                          </td>
                          <td className="p-3.5 text-stone-500 max-w-xs text-[11px]">
                            {trek.includes.join(' • ')}
                          </td>
                          <td className="p-3.5 text-right space-x-2">
                            <button
                              onClick={() => openEditTrekModal(trek)}
                              className="text-blue-700 hover:text-blue-900 font-bold text-xs bg-blue-50 px-2.5 py-1 rounded-lg border border-blue-200"
                            >
                              Edit ✏️
                            </button>
                            <button
                              onClick={() => {
                                if (confirm(`Delete trek: ${trek.title}?`)) {
                                  deleteTrek(trek.id);
                                }
                              }}
                              className="text-red-700 hover:text-red-900 font-bold text-xs bg-red-50 px-2.5 py-1 rounded-lg border border-red-200"
                            >
                              Delete 🗑️
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* ===================== TAB 5: ADMIN WALK-IN RESERVATION ===================== */}
            {activeTab === 'walkin' && (
              <div className="max-w-3xl mx-auto space-y-6">
                <div>
                  <h3 className="font-serif font-bold text-[#0B2B20] text-xl">Create Direct Walk-In / Front Desk Reservation</h3>
                  <p className="text-xs text-stone-500">
                    Use this form when guests book over the phone or arrive directly at reception. Generates immediate bill and folio.
                  </p>
                </div>

                {walkinSuccessBooking && (
                  <div className="p-4 bg-emerald-50 border border-emerald-300 rounded-2xl flex items-center justify-between">
                    <div>
                      <span className="text-xs font-bold text-emerald-900 block">✓ Walk-In Reservation Saved!</span>
                      <p className="text-xs text-emerald-700">Booking #{walkinSuccessBooking.bookingNumber} created for {walkinSuccessBooking.guestName}.</p>
                    </div>
                    <button
                      onClick={() => setSelectedInvoiceBooking(walkinSuccessBooking)}
                      className="bg-[#0B2B20] text-white text-xs font-bold px-4 py-2 rounded-xl"
                    >
                      📄 View & Print Bill
                    </button>
                  </div>
                )}

                <form onSubmit={handleCreateWalkinBooking} className="bg-white p-6 rounded-2xl border border-[#EAE5DE] space-y-5 text-xs">
                  {/* ROOM & DATES */}
                  <div className="space-y-3">
                    <span className="text-xs font-bold text-[#0B2B20] uppercase tracking-wider block">1. Select Room & Stay Duration</span>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div>
                        <label className="block font-bold text-stone-700 mb-1">Select Room *</label>
                        <select
                          value={walkinRoomId}
                          onChange={(e) => setWalkinRoomId(e.target.value)}
                          className="w-full p-2.5 border rounded-xl bg-[#FAF8F5] focus:outline-[#0B2B20] font-semibold"
                        >
                          {rooms.map((r) => (
                            <option key={r.id} value={r.id}>
                              {r.name} — [{r.status.toUpperCase()}] (₹{r.pricePerNight}/night)
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block font-bold text-stone-700 mb-1">Check-In Date *</label>
                        <input
                          type="date"
                          required
                          value={walkinCheckIn}
                          onChange={(e) => setWalkinCheckIn(e.target.value)}
                          className="w-full p-2.5 border rounded-xl bg-[#FAF8F5] focus:outline-[#0B2B20]"
                        />
                      </div>

                      <div>
                        <label className="block font-bold text-stone-700 mb-1">Check-Out Date *</label>
                        <input
                          type="date"
                          required
                          value={walkinCheckOut}
                          onChange={(e) => setWalkinCheckOut(e.target.value)}
                          className="w-full p-2.5 border rounded-xl bg-[#FAF8F5] focus:outline-[#0B2B20]"
                        />
                      </div>
                    </div>
                  </div>

                  {/* GUEST DETAILS */}
                  <div className="space-y-3 pt-3 border-t border-[#EAE5DE]">
                    <span className="text-xs font-bold text-[#0B2B20] uppercase tracking-wider block">2. Primary Guest Information</span>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div>
                        <label className="block font-bold text-stone-700 mb-1">Guest Full Name *</label>
                        <input
                          type="text"
                          required
                          value={walkinName}
                          onChange={(e) => setWalkinName(e.target.value)}
                          placeholder="e.g. Alok Sharma"
                          className="w-full p-2.5 border rounded-xl bg-[#FAF8F5] focus:outline-[#0B2B20]"
                        />
                      </div>

                      <div>
                        <label className="block font-bold text-stone-700 mb-1">WhatsApp / Phone *</label>
                        <input
                          type="tel"
                          required
                          value={walkinPhone}
                          onChange={(e) => setWalkinPhone(e.target.value)}
                          placeholder="+91 98765 XXXXX"
                          className="w-full p-2.5 border rounded-xl bg-[#FAF8F5] focus:outline-[#0B2B20]"
                        />
                      </div>

                      <div>
                        <label className="block font-bold text-stone-700 mb-1">Email Address</label>
                        <input
                          type="email"
                          value={walkinEmail}
                          onChange={(e) => setWalkinEmail(e.target.value)}
                          placeholder="guest@example.com"
                          className="w-full p-2.5 border rounded-xl bg-[#FAF8F5] focus:outline-[#0B2B20]"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div>
                        <label className="block font-bold text-stone-700 mb-1">Adults Count</label>
                        <input
                          type="number"
                          min={1}
                          max={6}
                          value={walkinAdults}
                          onChange={(e) => setWalkinAdults(Number(e.target.value))}
                          className="w-full p-2.5 border rounded-xl bg-[#FAF8F5] focus:outline-[#0B2B20]"
                        />
                      </div>

                      <div>
                        <label className="block font-bold text-stone-700 mb-1">Children Count</label>
                        <input
                          type="number"
                          min={0}
                          max={4}
                          value={walkinChildren}
                          onChange={(e) => setWalkinChildren(Number(e.target.value))}
                          className="w-full p-2.5 border rounded-xl bg-[#FAF8F5] focus:outline-[#0B2B20]"
                        />
                      </div>

                      <div>
                        <label className="block font-bold text-stone-700 mb-1">Identity Proof Check *</label>
                        <input
                          type="text"
                          value={walkinIdProof}
                          onChange={(e) => setWalkinIdProof(e.target.value)}
                          placeholder="Aadhaar / Passport checked"
                          className="w-full p-2.5 border rounded-xl bg-[#FAF8F5] focus:outline-[#0B2B20]"
                        />
                      </div>
                    </div>
                  </div>

                  {/* ADDONS */}
                  <div className="space-y-3 pt-3 border-t border-[#EAE5DE]">
                    <span className="text-xs font-bold text-[#0B2B20] uppercase tracking-wider block">3. Add-on Services</span>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div>
                        <label className="block font-bold text-stone-700 mb-1">Cab Transfer</label>
                        <select
                          value={walkinTaxiRouteId}
                          onChange={(e) => setWalkinTaxiRouteId(e.target.value)}
                          className="w-full p-2.5 border rounded-xl bg-[#FAF8F5] focus:outline-[#0B2B20]"
                        >
                          <option value="">No Cab Needed</option>
                          {taxiRoutes.map((r) => (
                            <option key={r.id} value={r.id}>
                              {r.from} ➔ {r.to}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block font-bold text-stone-700 mb-1">Vehicle Type</label>
                        <select
                          value={walkinTaxiVehicle}
                          onChange={(e) => setWalkinTaxiVehicle(e.target.value as 'Sedan' | 'SUV')}
                          className="w-full p-2.5 border rounded-xl bg-[#FAF8F5] focus:outline-[#0B2B20]"
                          disabled={!walkinTaxiRouteId}
                        >
                          <option value="Sedan">🚗 Sedan</option>
                          <option value="SUV">🚙 SUV</option>
                        </select>
                      </div>

                      <div>
                        <label className="block font-bold text-stone-700 mb-1">Food / Thali Selection</label>
                        <select
                          value={walkinFoodItemId}
                          onChange={(e) => {
                            setWalkinFoodItemId(e.target.value);
                            if (e.target.value && walkinFoodQty === 0) setWalkinFoodQty(1);
                          }}
                          className="w-full p-2.5 border rounded-xl bg-[#FAF8F5] focus:outline-[#0B2B20]"
                        >
                          <option value="">No Meals Selected</option>
                          {foodMenu.map((f) => (
                            <option key={f.id} value={f.id}>
                              {f.name} (₹{f.price})
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block font-bold text-stone-700 mb-1">Himalayan Trek</label>
                        <select
                          value={walkinTrekId}
                          onChange={(e) => {
                            setWalkinTrekId(e.target.value);
                            if (e.target.value && walkinTrekParticipants === 0) setWalkinTrekParticipants(2);
                          }}
                          className="w-full p-2.5 border rounded-xl bg-[#FAF8F5] focus:outline-[#0B2B20]"
                        >
                          <option value="">No Trek</option>
                          {treks.map((t) => (
                            <option key={t.id} value={t.id}>
                              {t.title}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* PAYMENT RECORDING */}
                  <div className="space-y-3 pt-3 border-t border-[#EAE5DE]">
                    <span className="text-xs font-bold text-[#0B2B20] uppercase tracking-wider block">4. Payment & Billing Settlement</span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block font-bold text-stone-700 mb-1">Payment Method</label>
                        <select
                          value={walkinPaymentMode}
                          onChange={(e) => setWalkinPaymentMode(e.target.value as 'CASH' | 'RAZORPAY_UPI' | 'RAZORPAY_CARD')}
                          className="w-full p-2.5 border rounded-xl bg-[#FAF8F5] focus:outline-[#0B2B20] font-bold"
                        >
                          <option value="CASH">💵 Cash at Front Desk</option>
                          <option value="RAZORPAY_UPI">⚡ Razorpay UPI QR at Desk</option>
                          <option value="RAZORPAY_CARD">💳 Credit / Debit Card POS</option>
                        </select>
                      </div>

                      <div>
                        <label className="block font-bold text-stone-700 mb-1">Payment Collection</label>
                        <select
                          value={walkinPaymentType}
                          onChange={(e) => setWalkinPaymentType(e.target.value as 'FULL' | 'ADVANCE_30')}
                          className="w-full p-2.5 border rounded-xl bg-[#FAF8F5] focus:outline-[#0B2B20] font-bold"
                        >
                          <option value="FULL">100% Full Payment Collected</option>
                          <option value="ADVANCE_30">30% Advance Token Collected</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-[#EAE5DE] flex justify-end">
                    <button
                      type="submit"
                      className="bg-[#0B2B20] hover:bg-[#164E3D] text-white font-bold py-3 px-8 rounded-xl shadow-md transition flex items-center gap-2 text-sm"
                    >
                      <span>Create Walk-In Reservation & Check-In</span>
                      <span>→</span>
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* ===================== TAB 6: ALL BOOKINGS & BILLS ===================== */}
            {activeTab === 'bookings' && (
              <div className="space-y-6">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                  <div>
                    <h3 className="font-serif font-bold text-[#0B2B20] text-xl">All Hotel Reservations & Bills</h3>
                    <p className="text-xs text-stone-500">Track online bookings, advance deposits, and generate official GST invoices</p>
                  </div>

                  <div className="w-full sm:w-72">
                    <input
                      type="text"
                      placeholder="Search by Guest, Phone, or ID..."
                      value={bookingSearch}
                      onChange={(e) => setBookingSearch(e.target.value)}
                      className="w-full p-2.5 border rounded-xl text-xs bg-[#FAF8F5] focus:outline-[#0B2B20]"
                    />
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border border-stone-200 rounded-xl overflow-hidden">
                    <thead className="bg-[#FAF8F5] text-stone-600 font-bold uppercase text-[10px] border-b border-stone-200">
                      <tr>
                        <th className="p-3.5">Booking ID</th>
                        <th className="p-3.5">Primary Guest</th>
                        <th className="p-3.5">Room & Dates</th>
                        <th className="p-3.5">Addons</th>
                        <th className="p-3.5">Amount & Advance</th>
                        <th className="p-3.5">Status</th>
                        <th className="p-3.5 text-right">Invoice & Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-stone-100 text-stone-700">
                      {filteredBookings.map((b) => (
                        <tr key={b.id} className="hover:bg-[#FAF8F5] transition">
                          <td className="p-3.5 font-black text-stone-900">
                            {b.bookingNumber}
                            <span className="block text-[10px] text-stone-400 font-normal">
                              {b.source === 'ONLINE_GUEST' ? '🌐 Online' : '🏢 Reception'}
                            </span>
                          </td>
                          <td className="p-3.5">
                            <strong className="text-stone-900 block">{b.guestName}</strong>
                            <span className="text-stone-500 text-[11px]">{b.guestPhone}</span>
                          </td>
                          <td className="p-3.5">
                            <strong className="text-stone-800 block">{b.room.name}</strong>
                            <span className="text-[11px] text-stone-500">{b.checkIn} to {b.checkOut} ({b.nights}N)</span>
                          </td>
                          <td className="p-3.5 text-[11px]">
                            {b.taxi && <span className="block text-emerald-800 font-medium">🚖 Cab Booked</span>}
                            {b.foodItems && <span className="block text-stone-600">🍲 Meals</span>}
                            {b.treks && <span className="block text-stone-600">🥾 Trek</span>}
                            {!b.taxi && !b.foodItems && !b.treks && <span className="text-stone-400">None</span>}
                          </td>
                          <td className="p-3.5">
                            <strong className="text-[#0B2B20] block">₹{b.totalAmount.toLocaleString('en-IN')}</strong>
                            <span className="text-[11px] text-emerald-800 font-semibold">
                              Paid: ₹{b.advancePaid.toLocaleString('en-IN')}
                            </span>
                            {b.balanceDue > 0 && (
                              <span className="block text-[10px] text-amber-700">Due: ₹{b.balanceDue.toLocaleString('en-IN')}</span>
                            )}
                          </td>
                          <td className="p-3.5">
                            <select
                              value={b.bookingStatus}
                              onChange={(e) => updateBookingStatus(b.id, e.target.value as Booking['bookingStatus'])}
                              className="text-[11px] p-1 rounded font-bold border bg-white focus:outline-none"
                            >
                              <option value="CONFIRMED">CONFIRMED</option>
                              <option value="CHECKED_IN">CHECKED_IN</option>
                              <option value="CHECKED_OUT">CHECKED_OUT</option>
                              <option value="CANCELLED">CANCELLED</option>
                            </select>
                          </td>
                          <td className="p-3.5 text-right space-x-2">
                            <button
                              onClick={() => setSelectedInvoiceBooking(b)}
                              className="bg-[#C59B27] hover:bg-[#d6a933] text-stone-950 font-bold text-xs px-3 py-1.5 rounded-lg shadow-xs transition"
                            >
                              📄 Print Bill
                            </button>
                            <button
                              onClick={() => {
                                if (confirm(`Delete reservation ${b.bookingNumber}?`)) {
                                  deleteBooking(b.id);
                                }
                              }}
                              className="text-stone-400 hover:text-red-700 text-xs p-1"
                            >
                              ✕
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* ===================== TAB 7: ENQUIRIES INBOX ===================== */}
            {activeTab === 'enquiries' && (
              <div className="space-y-6">
                <div>
                  <h3 className="font-serif font-bold text-[#0B2B20] text-xl">Traveler Inquiries & Special Requests</h3>
                  <p className="text-xs text-stone-500">Inquiries submitted by guests from the public website</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {enquiries.map((enq) => (
                    <div key={enq.id} className="p-5 rounded-2xl border border-[#EAE5DE] bg-[#FAF8F5] space-y-3">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-serif font-bold text-stone-900 text-base">{enq.name}</h4>
                          <p className="text-xs text-stone-500">📱 {enq.phone} • ✉️ {enq.email}</p>
                        </div>
                        <span className="text-[10px] font-bold bg-amber-100 text-amber-900 px-2 py-0.5 rounded">
                          {enq.serviceRequested}
                        </span>
                      </div>

                      <div className="text-xs text-stone-600 bg-white p-3 rounded-xl border border-stone-200">
                        <p className="font-medium text-stone-800">Dates: {enq.dates} • Group: {enq.guests}</p>
                        <p className="mt-1.5 italic text-stone-600">&ldquo;{enq.message}&rdquo;</p>
                      </div>

                      <div className="flex justify-between items-center pt-1 text-xs">
                        <span className="text-[11px] text-stone-400">
                          {new Date(enq.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })}
                        </span>
                        <a
                          href={`https://wa.me/${enq.phone.replace(/\D/g, '')}?text=Hello%20${encodeURIComponent(enq.name)},%20greetings%20from%20Jageshwar%20Dham%20Retreat!`}
                          target="_blank"
                          rel="noreferrer"
                          className="bg-emerald-800 hover:bg-emerald-900 text-white font-bold px-3 py-1.5 rounded-lg flex items-center gap-1.5"
                        >
                          <span>💬 Reply on WhatsApp</span>
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* MODAL 1: ADD / EDIT ROOM */}
      {isAddRoomOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl w-full max-w-lg p-6 space-y-4 shadow-2xl border border-stone-200 my-8">
            <div className="flex justify-between items-center border-b pb-3">
              <h3 className="font-serif font-bold text-lg text-[#0B2B20]">
                {editingRoom ? 'Edit Room Configuration' : 'Add New Room to Hotel'}
              </h3>
              <button onClick={() => setIsAddRoomOpen(false)} className="text-stone-400 hover:text-black font-bold">✕</button>
            </div>

            <form onSubmit={handleSaveRoom} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-stone-700 mb-1">Room Name *</label>
                <input
                  type="text"
                  required
                  value={newRoomName}
                  onChange={(e) => setNewRoomName(e.target.value)}
                  placeholder="e.g. Pine Ridge Cottage"
                  className="w-full p-2.5 border rounded-lg bg-stone-50"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-stone-700 mb-1">Category</label>
                  <select
                    value={newRoomCategory}
                    onChange={(e) => setNewRoomCategory(e.target.value as Room['category'])}
                    className="w-full p-2.5 border rounded-lg bg-stone-50"
                  >
                    <option value="Deluxe">Deluxe</option>
                    <option value="Suite">Suite</option>
                    <option value="Cottage">Cottage</option>
                    <option value="Standard">Standard</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-stone-700 mb-1">Price Per Night (₹) *</label>
                  <input
                    type="number"
                    required
                    value={newRoomPrice}
                    onChange={(e) => setNewRoomPrice(Number(e.target.value))}
                    className="w-full p-2.5 border rounded-lg bg-stone-50"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-stone-700 mb-1">Max Adults Capacity</label>
                  <input
                    type="number"
                    min={1}
                    value={newRoomAdults}
                    onChange={(e) => setNewRoomAdults(Number(e.target.value))}
                    className="w-full p-2.5 border rounded-lg bg-stone-50"
                  />
                </div>

                <div>
                  <label className="block font-bold text-stone-700 mb-1">Distance to Temple (Text)</label>
                  <input
                    type="text"
                    value={newRoomDistance}
                    onChange={(e) => setNewRoomDistance(e.target.value)}
                    placeholder="e.g. 150 meters (2 mins walk)"
                    className="w-full p-2.5 border rounded-lg bg-stone-50"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-stone-700 mb-1">Initial Status</label>
                <select
                  value={newRoomStatus}
                  onChange={(e) => setNewRoomStatus(e.target.value as Room['status'])}
                  className="w-full p-2.5 border rounded-lg bg-stone-50 font-bold"
                >
                  <option value="Vacant">🟢 Vacant (Open for Online Bookings)</option>
                  <option value="Booked">🔴 Booked (Sold Out)</option>
                  <option value="Engaged">🟠 Engaged (In-House Guest)</option>
                  <option value="Maintenance">🟡 Maintenance (Cleaning / Repair)</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-stone-700 mb-1">Photo Image URL</label>
                <input
                  type="text"
                  value={newRoomImage}
                  onChange={(e) => setNewRoomImage(e.target.value)}
                  className="w-full p-2.5 border rounded-lg bg-stone-50"
                />
              </div>

              <div>
                <label className="block font-bold text-stone-700 mb-1">Description</label>
                <textarea
                  rows={2}
                  value={newRoomDesc}
                  onChange={(e) => setNewRoomDesc(e.target.value)}
                  className="w-full p-2.5 border rounded-lg bg-stone-50"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2 border-t">
                <button
                  type="button"
                  onClick={() => setIsAddRoomOpen(false)}
                  className="px-4 py-2 border rounded-xl font-bold text-stone-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-[#0B2B20] text-white font-bold rounded-xl shadow-md hover:bg-[#164E3D]"
                >
                  Save Room
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: ADD / EDIT TAXI */}
      {isTaxiModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl w-full max-w-lg p-6 space-y-4 shadow-2xl border border-stone-200 my-8">
            <div className="flex justify-between items-center border-b pb-3">
              <h3 className="font-serif font-bold text-lg text-[#0B2B20]">
                {editingTaxi ? 'Edit Mountain Cab Route' : 'Add New Cab Transfer Route'}
              </h3>
              <button onClick={() => setIsTaxiModalOpen(false)} className="text-stone-400 hover:text-black font-bold">✕</button>
            </div>

            <form onSubmit={handleSaveTaxi} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-stone-700 mb-1">Pickup Location (From) *</label>
                  <input
                    type="text"
                    required
                    value={taxiFrom}
                    onChange={(e) => setTaxiFrom(e.target.value)}
                    placeholder="e.g. Kathgodam Station"
                    className="w-full p-2.5 border rounded-lg bg-stone-50"
                  />
                </div>
                <div>
                  <label className="block font-bold text-stone-700 mb-1">Drop Location (To) *</label>
                  <input
                    type="text"
                    required
                    value={taxiTo}
                    onChange={(e) => setTaxiTo(e.target.value)}
                    placeholder="e.g. Jageshwar Dham"
                    className="w-full p-2.5 border rounded-lg bg-stone-50"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-stone-700 mb-1">Distance *</label>
                  <input
                    type="text"
                    required
                    value={taxiDistance}
                    onChange={(e) => setTaxiDistance(e.target.value)}
                    placeholder="e.g. 120 km"
                    className="w-full p-2.5 border rounded-lg bg-stone-50"
                  />
                </div>
                <div>
                  <label className="block font-bold text-stone-700 mb-1">Duration *</label>
                  <input
                    type="text"
                    required
                    value={taxiDuration}
                    onChange={(e) => setTaxiDuration(e.target.value)}
                    placeholder="e.g. 4 hours"
                    className="w-full p-2.5 border rounded-lg bg-stone-50"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-stone-700 mb-1">Sedan Fare (₹) *</label>
                  <input
                    type="number"
                    required
                    value={taxiPriceSedan}
                    onChange={(e) => setTaxiPriceSedan(Number(e.target.value))}
                    className="w-full p-2.5 border rounded-lg bg-stone-50"
                  />
                </div>
                <div>
                  <label className="block font-bold text-stone-700 mb-1">SUV Fare (₹) *</label>
                  <input
                    type="number"
                    required
                    value={taxiPriceSUV}
                    onChange={(e) => setTaxiPriceSUV(Number(e.target.value))}
                    className="w-full p-2.5 border rounded-lg bg-stone-50"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-stone-700 mb-1">Route Highlights / Notes</label>
                <textarea
                  rows={2}
                  value={taxiDesc}
                  onChange={(e) => setTaxiDesc(e.target.value)}
                  placeholder="e.g. Scenic drive via Bhimtal and Bhowali with photo stops..."
                  className="w-full p-2.5 border rounded-lg bg-stone-50"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2 border-t">
                <button
                  type="button"
                  onClick={() => setIsTaxiModalOpen(false)}
                  className="px-4 py-2 border rounded-xl font-bold text-stone-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-[#0B2B20] text-white font-bold rounded-xl shadow-md hover:bg-[#164E3D]"
                >
                  Save Route
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 3: ADD / EDIT FOOD */}
      {isFoodModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl w-full max-w-lg p-6 space-y-4 shadow-2xl border border-stone-200 my-8">
            <div className="flex justify-between items-center border-b pb-3">
              <h3 className="font-serif font-bold text-lg text-[#0B2B20]">
                {editingFood ? 'Edit Menu Item' : 'Add New Dish to Kitchen Menu'}
              </h3>
              <button onClick={() => setIsFoodModalOpen(false)} className="text-stone-400 hover:text-black font-bold">✕</button>
            </div>

            <form onSubmit={handleSaveFood} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-stone-700 mb-1">Dish Name *</label>
                <input
                  type="text"
                  required
                  value={foodName}
                  onChange={(e) => setFoodName(e.target.value)}
                  placeholder="e.g. Aloo ke Gutke with Pahadi Raita"
                  className="w-full p-2.5 border rounded-lg bg-stone-50"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-stone-700 mb-1">Category *</label>
                  <select
                    value={foodCategory}
                    onChange={(e) => setFoodCategory(e.target.value as FoodItem['category'])}
                    className="w-full p-2.5 border rounded-lg bg-stone-50"
                  >
                    <option value="Kumaoni Special">Kumaoni Special</option>
                    <option value="Satvik">Satvik (No Onion / Garlic)</option>
                    <option value="Breakfast">Breakfast</option>
                    <option value="Beverages">Beverages</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-stone-700 mb-1">Price (₹) *</label>
                  <input
                    type="number"
                    required
                    value={foodPrice}
                    onChange={(e) => setFoodPrice(Number(e.target.value))}
                    className="w-full p-2.5 border rounded-lg bg-stone-50"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-stone-700 mb-1">Food Image URL</label>
                <input
                  type="text"
                  value={foodImage}
                  onChange={(e) => setFoodImage(e.target.value)}
                  className="w-full p-2.5 border rounded-lg bg-stone-50"
                />
              </div>

              <div>
                <label className="block font-bold text-stone-700 mb-1">Description</label>
                <textarea
                  rows={2}
                  value={foodDesc}
                  onChange={(e) => setFoodDesc(e.target.value)}
                  placeholder="e.g. Organic black soybean dal tempered with mountain herbs..."
                  className="w-full p-2.5 border rounded-lg bg-stone-50"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2 border-t">
                <button
                  type="button"
                  onClick={() => setIsFoodModalOpen(false)}
                  className="px-4 py-2 border rounded-xl font-bold text-stone-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-[#0B2B20] text-white font-bold rounded-xl shadow-md hover:bg-[#164E3D]"
                >
                  Save Dish
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 4: ADD / EDIT TREK */}
      {isTrekModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl w-full max-w-lg p-6 space-y-4 shadow-2xl border border-stone-200 my-8">
            <div className="flex justify-between items-center border-b pb-3">
              <h3 className="font-serif font-bold text-lg text-[#0B2B20]">
                {editingTrek ? 'Edit Trekking Expedition' : 'Add New Guided Trek / Trail'}
              </h3>
              <button onClick={() => setIsTrekModalOpen(false)} className="text-stone-400 hover:text-black font-bold">✕</button>
            </div>

            <form onSubmit={handleSaveTrek} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-stone-700 mb-1">Trek / Walk Title *</label>
                <input
                  type="text"
                  required
                  value={trekTitle}
                  onChange={(e) => setTrekTitle(e.target.value)}
                  placeholder="e.g. Jhanker Sam Forest Meditation Trail"
                  className="w-full p-2.5 border rounded-lg bg-stone-50"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold text-stone-700 mb-1">Difficulty</label>
                  <select
                    value={trekDifficulty}
                    onChange={(e) => setTrekDifficulty(e.target.value as Trek['difficulty'])}
                    className="w-full p-2.5 border rounded-lg bg-stone-50"
                  >
                    <option value="Easy">Easy</option>
                    <option value="Moderate">Moderate</option>
                    <option value="Challenging">Challenging</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-stone-700 mb-1">Duration</label>
                  <input
                    type="text"
                    required
                    value={trekDuration}
                    onChange={(e) => setTrekDuration(e.target.value)}
                    placeholder="e.g. 4 Hours"
                    className="w-full p-2.5 border rounded-lg bg-stone-50"
                  />
                </div>

                <div>
                  <label className="block font-bold text-stone-700 mb-1">Price / Person (₹)</label>
                  <input
                    type="number"
                    required
                    value={trekPrice}
                    onChange={(e) => setTrekPrice(Number(e.target.value))}
                    className="w-full p-2.5 border rounded-lg bg-stone-50"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-stone-700 mb-1">Peak Altitude</label>
                <input
                  type="text"
                  value={trekAltitude}
                  onChange={(e) => setTrekAltitude(e.target.value)}
                  placeholder="e.g. 2,200m (7,200 ft)"
                  className="w-full p-2.5 border rounded-lg bg-stone-50"
                />
              </div>

              <div>
                <label className="block font-bold text-stone-700 mb-1">Inclusions (Comma separated)</label>
                <input
                  type="text"
                  value={trekIncludesText}
                  onChange={(e) => setTrekIncludesText(e.target.value)}
                  placeholder="e.g. Certified Guide, Trekking Poles, Packed Energy Snack"
                  className="w-full p-2.5 border rounded-lg bg-stone-50"
                />
              </div>

              <div>
                <label className="block font-bold text-stone-700 mb-1">Trail Photo Image URL</label>
                <input
                  type="text"
                  value={trekImage}
                  onChange={(e) => setTrekImage(e.target.value)}
                  className="w-full p-2.5 border rounded-lg bg-stone-50"
                />
              </div>

              <div>
                <label className="block font-bold text-stone-700 mb-1">Trail Description</label>
                <textarea
                  rows={2}
                  value={trekDesc}
                  onChange={(e) => setTrekDesc(e.target.value)}
                  placeholder="e.g. Gentle forest trek with majestic views of Nanda Devi..."
                  className="w-full p-2.5 border rounded-lg bg-stone-50"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2 border-t">
                <button
                  type="button"
                  onClick={() => setIsTrekModalOpen(false)}
                  className="px-4 py-2 border rounded-xl font-bold text-stone-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-[#0B2B20] text-white font-bold rounded-xl shadow-md hover:bg-[#164E3D]"
                >
                  Save Trek
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* INVOICE MODAL TRIGGER */}
      {selectedInvoiceBooking && (
        <InvoiceModal
          booking={selectedInvoiceBooking}
          onClose={() => setSelectedInvoiceBooking(null)}
        />
      )}
    </div>
  );
}
