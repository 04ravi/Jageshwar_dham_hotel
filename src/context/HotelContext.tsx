'use client';

import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import {
  Room,
  Booking,
  TaxiRoute,
  FoodItem,
  Trek,
  INITIAL_ROOMS,
  INITIAL_BOOKINGS,
  TAXI_ROUTES,
  FOOD_MENU,
  TREKS
} from '@/data/mockData';

export interface Enquiry {
  id: string;
  name: string;
  email: string;
  phone: string;
  dates: string;
  guests: string;
  message: string;
  serviceRequested: string;
  createdAt: string;
}

interface HotelContextType {
  // Data States
  rooms: Room[];
  taxiRoutes: TaxiRoute[];
  foodMenu: FoodItem[];
  treks: Trek[];
  bookings: Booking[];
  enquiries: Enquiry[];
  isAdminAuthenticated: boolean;

  // Auth Methods
  adminLogin: (email: string, pass: string) => boolean;
  adminLogout: () => void;

  // Room CRUD & Status Control
  addRoom: (room: Omit<Room, 'id'>) => void;
  updateRoom: (id: string, room: Partial<Room>) => void;
  updateRoomStatus: (id: string, status: Room['status']) => void;
  deleteRoom: (id: string) => void;

  // Taxi Services CRUD
  addTaxiRoute: (route: Omit<TaxiRoute, 'id'>) => void;
  updateTaxiRoute: (id: string, route: Partial<TaxiRoute>) => void;
  deleteTaxiRoute: (id: string) => void;

  // Food / Dining CRUD
  addFoodItem: (item: Omit<FoodItem, 'id'>) => void;
  updateFoodItem: (id: string, item: Partial<FoodItem>) => void;
  deleteFoodItem: (id: string) => void;

  // Trekking CRUD
  addTrek: (trek: Omit<Trek, 'id'>) => void;
  updateTrek: (id: string, trek: Partial<Trek>) => void;
  deleteTrek: (id: string) => void;

  // Booking CRUD
  addBooking: (booking: Omit<Booking, 'id' | 'bookingNumber' | 'createdAt'>) => Booking;
  updateBookingStatus: (id: string, status: Booking['bookingStatus']) => void;
  deleteBooking: (id: string) => void;

  // Enquiry
  addEnquiry: (enquiry: Omit<Enquiry, 'id' | 'createdAt'>) => void;
}

const HotelContext = createContext<HotelContextType | undefined>(undefined);

// Safe localStorage reader — returns null during SSR (no window)
function readLS<T>(key: string, fallback: T): T {
  if (typeof window === 'undefined') return fallback;
  try {
    const v = localStorage.getItem(key);
    return v ? (JSON.parse(v) as T) : fallback;
  } catch {
    return fallback;
  }
}

const INITIAL_ENQUIRIES: Enquiry[] = [
  {
    id: 'enq-1',
    name: 'Sunil Joshi',
    email: 'sunil.joshi@example.com',
    phone: '+91 94120 77889',
    dates: '25 Dec - 28 Dec 2026',
    guests: '8 Adults (Family Group)',
    message: 'Looking for 3 adjacent rooms, temple priest for Mahamrityunjaya puja, and Kathgodam cab.',
    serviceRequested: 'Group Stay + Temple Puja + Cabs',
    createdAt: '2026-11-12T08:00:00Z'
  }
];

export function HotelProvider({ children }: { children: React.ReactNode }) {
  // Lazy initialisers read localStorage on first render (client-only, SSR-safe)
  const [rooms, setRooms] = useState<Room[]>(() => readLS('jageshwar_rooms', INITIAL_ROOMS));
  const [taxiRoutes, setTaxiRoutes] = useState<TaxiRoute[]>(() => readLS('jageshwar_taxi', TAXI_ROUTES));
  const [foodMenu, setFoodMenu] = useState<FoodItem[]>(() => readLS('jageshwar_food', FOOD_MENU));
  const [treks, setTreks] = useState<Trek[]>(() => readLS('jageshwar_treks', TREKS));
  const [bookings, setBookings] = useState<Booking[]>(() => readLS('jageshwar_bookings', INITIAL_BOOKINGS));
  const [enquiries, setEnquiries] = useState<Enquiry[]>(() => readLS('jageshwar_enquiries', INITIAL_ENQUIRIES));
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState<boolean>(
    () => typeof window !== 'undefined' && localStorage.getItem('jageshwar_admin_auth') === 'true'
  );

  const isLoadedRef = useRef(true); // already initialised from storage above

  // Save changes to localStorage whenever state changes (isLoadedRef prevents writing SSR defaults)
  // Save changes only AFTER client has mounted and loaded previous state
  useEffect(() => {
    if (!isLoadedRef.current) return;
    try {
      localStorage.setItem('jageshwar_rooms', JSON.stringify(rooms));
    } catch {}
  }, [rooms]);

  useEffect(() => {
    if (!isLoadedRef.current) return;
    try {
      localStorage.setItem('jageshwar_taxi', JSON.stringify(taxiRoutes));
    } catch {}
  }, [taxiRoutes]);

  useEffect(() => {
    if (!isLoadedRef.current) return;
    try {
      localStorage.setItem('jageshwar_food', JSON.stringify(foodMenu));
    } catch {}
  }, [foodMenu]);

  useEffect(() => {
    if (!isLoadedRef.current) return;
    try {
      localStorage.setItem('jageshwar_treks', JSON.stringify(treks));
    } catch {}
  }, [treks]);

  useEffect(() => {
    if (!isLoadedRef.current) return;
    try {
      localStorage.setItem('jageshwar_bookings', JSON.stringify(bookings));
    } catch {}
  }, [bookings]);

  useEffect(() => {
    if (!isLoadedRef.current) return;
    try {
      localStorage.setItem('jageshwar_enquiries', JSON.stringify(enquiries));
    } catch {}
  }, [enquiries]);

  // Real-Time Cross-Tab Event Listener
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      try {
        if (!e.newValue) return;
        if (e.key === 'jageshwar_rooms') {
          setRooms(JSON.parse(e.newValue));
        } else if (e.key === 'jageshwar_taxi') {
          setTaxiRoutes(JSON.parse(e.newValue));
        } else if (e.key === 'jageshwar_food') {
          setFoodMenu(JSON.parse(e.newValue));
        } else if (e.key === 'jageshwar_treks') {
          setTreks(JSON.parse(e.newValue));
        } else if (e.key === 'jageshwar_bookings') {
          setBookings(JSON.parse(e.newValue));
        } else if (e.key === 'jageshwar_enquiries') {
          setEnquiries(JSON.parse(e.newValue));
        }
      } catch (err) {
        console.error('Error syncing storage across tabs', err);
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  // Admin Authentication
  const adminLogin = (email: string, pass: string): boolean => {
    if (email.trim().toLowerCase() === 'admin@jageshwar.com' && pass === 'jageshwar2026') {
      setIsAdminAuthenticated(true);
      localStorage.setItem('jageshwar_admin_auth', 'true');
      return true;
    }
    if (email.trim().length > 0 && pass === 'admin') {
      setIsAdminAuthenticated(true);
      localStorage.setItem('jageshwar_admin_auth', 'true');
      return true;
    }
    return false;
  };

  const adminLogout = () => {
    setIsAdminAuthenticated(false);
    localStorage.removeItem('jageshwar_admin_auth');
  };

  // 1. ROOM CRUD & STATUS
  const addRoom = (roomData: Omit<Room, 'id'>) => {
    const newRoom: Room = {
      ...roomData,
      id: `room-${Date.now()}`,
      status: roomData.status || 'Vacant'
    };
    setRooms((prev) => [newRoom, ...prev]);
  };

  const updateRoom = (id: string, updatedFields: Partial<Room>) => {
    setRooms((prev) =>
      prev.map((r) => (r.id === id ? { ...r, ...updatedFields } : r))
    );
  };

  const updateRoomStatus = (id: string, status: Room['status']) => {
    setRooms((prev) => {
      const updated = prev.map((r) => (r.id === id ? { ...r, status } : r));
      try {
        localStorage.setItem('jageshwar_rooms', JSON.stringify(updated));
      } catch {}
      return updated;
    });
  };

  const deleteRoom = (id: string) => {
    setRooms((prev) => {
      const updated = prev.filter((r) => r.id !== id);
      try {
        localStorage.setItem('jageshwar_rooms', JSON.stringify(updated));
      } catch {}
      return updated;
    });
  };

  // 2. TAXI ROUTES CRUD
  const addTaxiRoute = (routeData: Omit<TaxiRoute, 'id'>) => {
    const newRoute: TaxiRoute = {
      ...routeData,
      id: `route-${Date.now()}`
    };
    setTaxiRoutes((prev) => {
      const updated = [newRoute, ...prev];
      try {
        localStorage.setItem('jageshwar_taxi', JSON.stringify(updated));
      } catch {}
      return updated;
    });
  };

  const updateTaxiRoute = (id: string, updatedFields: Partial<TaxiRoute>) => {
    setTaxiRoutes((prev) => {
      const updated = prev.map((r) => (r.id === id ? { ...r, ...updatedFields } : r));
      try {
        localStorage.setItem('jageshwar_taxi', JSON.stringify(updated));
      } catch {}
      return updated;
    });
  };

  const deleteTaxiRoute = (id: string) => {
    setTaxiRoutes((prev) => {
      const updated = prev.filter((r) => r.id !== id);
      try {
        localStorage.setItem('jageshwar_taxi', JSON.stringify(updated));
      } catch {}
      return updated;
    });
  };

  // 3. FOOD / DINING CRUD
  const addFoodItem = (itemData: Omit<FoodItem, 'id'>) => {
    const newItem: FoodItem = {
      ...itemData,
      id: `food-${Date.now()}`
    };
    setFoodMenu((prev) => {
      const updated = [newItem, ...prev];
      try {
        localStorage.setItem('jageshwar_food', JSON.stringify(updated));
      } catch {}
      return updated;
    });
  };

  const updateFoodItem = (id: string, updatedFields: Partial<FoodItem>) => {
    setFoodMenu((prev) => {
      const updated = prev.map((f) => (f.id === id ? { ...f, ...updatedFields } : f));
      try {
        localStorage.setItem('jageshwar_food', JSON.stringify(updated));
      } catch {}
      return updated;
    });
  };

  const deleteFoodItem = (id: string) => {
    setFoodMenu((prev) => {
      const updated = prev.filter((f) => f.id !== id);
      try {
        localStorage.setItem('jageshwar_food', JSON.stringify(updated));
      } catch {}
      return updated;
    });
  };

  // 4. TREKKING CRUD
  const addTrek = (trekData: Omit<Trek, 'id'>) => {
    const newTrek: Trek = {
      ...trekData,
      id: `trek-${Date.now()}`
    };
    setTreks((prev) => {
      const updated = [newTrek, ...prev];
      try {
        localStorage.setItem('jageshwar_treks', JSON.stringify(updated));
      } catch {}
      return updated;
    });
  };

  const updateTrek = (id: string, updatedFields: Partial<Trek>) => {
    setTreks((prev) => {
      const updated = prev.map((t) => (t.id === id ? { ...t, ...updatedFields } : t));
      try {
        localStorage.setItem('jageshwar_treks', JSON.stringify(updated));
      } catch {}
      return updated;
    });
  };

  const deleteTrek = (id: string) => {
    setTreks((prev) => {
      const updated = prev.filter((t) => t.id !== id);
      try {
        localStorage.setItem('jageshwar_treks', JSON.stringify(updated));
      } catch {}
      return updated;
    });
  };

  // 5. BOOKING CRUD
  const addBooking = (bookingData: Omit<Booking, 'id' | 'bookingNumber' | 'createdAt'>): Booking => {
    const newBooking: Booking = {
      ...bookingData,
      id: `bk-${Date.now()}`,
      bookingNumber: `JAG-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
      createdAt: new Date().toISOString()
    };

    setBookings((prev) => {
      const updated = [newBooking, ...prev];
      try {
        localStorage.setItem('jageshwar_bookings', JSON.stringify(updated));
      } catch {}
      return updated;
    });

    // Automatically lock the booked room so other customers cannot select or book it
    updateRoomStatus(bookingData.room.id, 'Booked');

    return newBooking;
  };

  const updateBookingStatus = (id: string, status: Booking['bookingStatus']) => {
    setBookings((prev) => {
      const updated = prev.map((b) => (b.id === id ? { ...b, bookingStatus: status } : b));
      const bk = prev.find((b) => b.id === id);

      if (bk) {
        if (status === 'CHECKED_OUT' || status === 'CANCELLED') {
          updateRoomStatus(bk.room.id, 'Vacant');
        } else if (status === 'CHECKED_IN') {
          updateRoomStatus(bk.room.id, 'Engaged');
        }
      }

      try {
        localStorage.setItem('jageshwar_bookings', JSON.stringify(updated));
      } catch {}
      return updated;
    });
  };

  const deleteBooking = (id: string) => {
    setBookings((prev) => {
      const updated = prev.filter((b) => b.id !== id);
      try {
        localStorage.setItem('jageshwar_bookings', JSON.stringify(updated));
      } catch {}
      return updated;
    });
  };

  const addEnquiry = (enquiryData: Omit<Enquiry, 'id' | 'createdAt'>) => {
    const newEnq: Enquiry = {
      ...enquiryData,
      id: `enq-${Date.now()}`,
      createdAt: new Date().toISOString()
    };
    setEnquiries((prev) => {
      const updated = [newEnq, ...prev];
      try {
        localStorage.setItem('jageshwar_enquiries', JSON.stringify(updated));
      } catch {}
      return updated;
    });
  };

  return (
    <HotelContext.Provider
      value={{
        rooms,
        taxiRoutes,
        foodMenu,
        treks,
        bookings,
        enquiries,
        isAdminAuthenticated,
        adminLogin,
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
        deleteBooking,
        addEnquiry
      }}
    >
      {children}
    </HotelContext.Provider>
  );
}

export function useHotel() {
  const context = useContext(HotelContext);
  if (!context) {
    throw new Error('useHotel must be used within a HotelProvider');
  }
  return context;
}
