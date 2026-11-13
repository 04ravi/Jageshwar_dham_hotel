export interface Room {
  id: string;
  name: string;
  category: 'Deluxe' | 'Suite' | 'Cottage' | 'Standard';
  description: string;
  pricePerNight: number;
  capacityAdults: number;
  capacityChildren: number;
  distanceFromTemple: string; // e.g. "150m (2 mins walk)"
  distanceMeters: number;     // for sorting / filtering
  view: string;
  image: string;
  amenities: string[];
  status: 'Vacant' | 'Booked' | 'Engaged' | 'Maintenance';
}

export interface TaxiRoute {
  id: string;
  from: string;
  to: string;
  distance: string;
  duration: string;
  priceSedan: number;
  priceSUV: number;
  description: string;
}

export interface FoodItem {
  id: string;
  name: string;
  category: 'Kumaoni Special' | 'Satvik' | 'Breakfast' | 'Beverages';
  description: string;
  price: number;
  isVeg: boolean;
  image: string;
}

export interface Trek {
  id: string;
  title: string;
  duration: string;
  difficulty: 'Easy' | 'Moderate' | 'Challenging';
  altitude: string;
  pricePerPerson: number;
  image: string;
  description: string;
  includes: string[];
}

export interface Booking {
  id: string;
  bookingNumber: string;
  createdAt: string;
  source: 'ONLINE_GUEST' | 'FRONT_DESK_ADMIN';
  guestName: string;
  guestEmail: string;
  guestPhone: string;
  idProofName?: string;
  checkIn: string;
  checkOut: string;
  nights: number;
  adults: number;
  children: number;
  room: Room;
  taxi?: {
    route: TaxiRoute;
    vehicle: 'Sedan' | 'SUV';
    pickupTime?: string;
  };
  foodItems?: { item: FoodItem; quantity: number }[];
  treks?: { trek: Trek; participants: number }[];
  roomAmount: number;
  taxiAmount: number;
  foodAmount: number;
  trekAmount: number;
  subtotal: number;
  gstAmount: number;
  totalAmount: number;
  advancePaid: number;
  balanceDue: number;
  paymentStatus: 'PAID_FULL' | 'ADVANCE_30_PAID' | 'PAY_AT_CHECKIN';
  paymentMethod: 'RAZORPAY_UPI' | 'RAZORPAY_CARD' | 'CASH' | 'NETBANKING';
  bookingStatus: 'CONFIRMED' | 'CHECKED_IN' | 'CHECKED_OUT' | 'CANCELLED';
  acceptedRefundPolicy: boolean;
  specialRequests?: string;
}

export const INITIAL_ROOMS: Room[] = [
  {
    id: 'room-1',
    name: 'Deodar Forest View Deluxe',
    category: 'Deluxe',
    status: 'Vacant',
    description: 'Immerse in tranquility overlooking towering pine trees with private balcony and heated wooden floors.',
    pricePerNight: 2800,
    capacityAdults: 2,
    capacityChildren: 1,
    distanceFromTemple: '150 meters (2 mins walk)',
    distanceMeters: 150,
    view: 'Dense Deodar Pine Forest',
    image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1000&q=80',
    amenities: [
      'Free High-Speed Wi-Fi',
      '24/7 Hot Water Geyser',
      'Electric Kettle with Kumaoni Teas',
      'Heavy Room Heater',
      'Private Forest Balcony',
      'Electric Blanket'
    ]
  },
  {
    id: 'room-2',
    name: 'Himalayan Heritage Suite',
    category: 'Suite',
    status: 'Engaged',
    description: 'Traditional Kumaoni hand-chiseled stone architecture with luxury cedar woodwork and temple bell views.',
    pricePerNight: 4200,
    capacityAdults: 3,
    capacityChildren: 2,
    distanceFromTemple: '250 meters (3 mins walk)',
    distanceMeters: 250,
    view: 'Temple Valley & Jata Ganga Stream',
    image: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1000&q=80',
    amenities: [
      'Free High-Speed Wi-Fi',
      '24/7 Hot Water Geyser',
      'Electric Kettle with Kumaoni Teas',
      'Traditional Wood Heater',
      'Living Lounge Area',
      'Electric Blanket',
      'Organic Herbal Toiletries'
    ]
  },
  {
    id: 'room-3',
    name: 'Pahadi Family Cottage',
    category: 'Cottage',
    status: 'Vacant',
    description: 'Interconnected twin bedrooms with pine ceilings, private kitchen counter, and panoramic ridge views.',
    pricePerNight: 5800,
    capacityAdults: 5,
    capacityChildren: 3,
    distanceFromTemple: '450 meters (6 mins walk)',
    distanceMeters: 450,
    view: 'Trishul Peak Panoramic View',
    image: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1000&q=80',
    amenities: [
      'Free High-Speed Wi-Fi',
      '24/7 Hot Water Geyser',
      'Electric Kettle with Kumaoni Teas',
      '2 Heavy Room Heaters',
      'Two Bathrooms with Geysers',
      'Dining Table Nook',
      'Valley Balcony'
    ]
  },
  {
    id: 'room-4',
    name: 'Pilgrim & Backpacker Nest',
    category: 'Standard',
    status: 'Vacant',
    description: 'Serene, compact, and budget-friendly sanctuary designed for pilgrims visiting Jageshwar for temple darshan.',
    pricePerNight: 1600,
    capacityAdults: 2,
    capacityChildren: 1,
    distanceFromTemple: '100 meters (1.5 mins walk)',
    distanceMeters: 100,
    view: 'Ancient Temple Pathway',
    image: 'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=1000&q=80',
    amenities: [
      'Free High-Speed Wi-Fi',
      '24/7 Hot Water Geyser',
      'Electric Kettle with Kumaoni Teas',
      'Room Heater',
      'Warm Himalayan Quilts'
    ]
  }
];

export const TAXI_ROUTES: TaxiRoute[] = [
  {
    id: 'route-1',
    from: 'Kathgodam Railway Station',
    to: 'Jageshwar Dham',
    distance: '120 km',
    duration: '4 hours',
    priceSedan: 3200,
    priceSUV: 4500,
    description: 'Direct railway pickup for New Delhi/Lucknow trains via Bhimtal & Almora.'
  },
  {
    id: 'route-2',
    from: 'Pantnagar Airport',
    to: 'Jageshwar Dham',
    distance: '150 km',
    duration: '5 hours',
    priceSedan: 3800,
    priceSUV: 5200,
    description: 'Chauffeured airport transfer with luggage assistance and scenic mountain route.'
  },
  {
    id: 'route-3',
    from: 'Almora Mall Road',
    to: 'Jageshwar Dham',
    distance: '36 km',
    duration: '1.2 hours',
    priceSedan: 1400,
    priceSUV: 2000,
    description: 'Local connection from Almora town or Kasar Devi ridge.'
  },
  {
    id: 'route-4',
    from: 'Jageshwar Circuit',
    to: 'Binsar & Kasar Devi Day Excursion',
    distance: '85 km round-trip',
    duration: 'Full Day (8 hrs)',
    priceSedan: 2900,
    priceSUV: 3900,
    description: 'Visit Kasar Devi meditation caves, Chitai Golu Devta, and Binsar Zero Point.'
  }
];

export const FOOD_MENU: FoodItem[] = [
  {
    id: 'food-1',
    name: 'Traditional Kumaoni Thali',
    category: 'Kumaoni Special',
    description: 'Bhatt ki Churkani (organic black soybean curry), Aloo ke Gutke, Madua (finger millet) Roti, Pahadi Raita & Singori sweet.',
    price: 350,
    isVeg: true,
    image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'food-2',
    name: 'Pure Satvik Pilgrim Meal',
    category: 'Satvik',
    description: 'Prepared without onion or garlic strictly for temple devotees. Yellow moong dal, seasonal hill subzi, phulkas, rice & kheer.',
    price: 280,
    isVeg: true,
    image: 'https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'food-3',
    name: 'Pahadi Chai & Hot Pakora Basket',
    category: 'Beverages',
    description: 'Fresh ginger-cardamom mountain brew served with crispy mountain potato and onion fritters.',
    price: 150,
    isVeg: true,
    image: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=600&q=80'
  }
];

export const TREKS: Trek[] = [
  {
    id: 'trek-1',
    title: 'Vridh Jageshwar 360° Himalayan Vista Hike',
    duration: '4 Hours',
    difficulty: 'Moderate',
    altitude: '2,200m (7,200 ft)',
    pricePerPerson: 750,
    image: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1000&q=80',
    description: 'Walk through sacred deodar groves to Vridh Jageshwar summit with views of Trishul and Nanda Devi peaks.',
    includes: ['Certified Mountain Guide', 'Trekking Poles', 'Packed Energy Snacks & Spring Water', 'Temple Legend Briefing']
  },
  {
    id: 'trek-2',
    title: 'Dandeshwar & Jageshwar Heritage Temple Walk',
    duration: '2.5 Hours',
    difficulty: 'Easy',
    altitude: '1,870m (6,135 ft)',
    pricePerPerson: 500,
    image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1000&q=80',
    description: 'Explore 8th-century monolithic stone sanctuaries and sacred water springs with an authentic native priest.',
    includes: ['Native Priest / Historian Guide', 'Special Darshan Assistance', 'Heritage Guidebook']
  }
];

export const INITIAL_BOOKINGS: Booking[] = [
  {
    id: 'bk-101',
    bookingNumber: 'JAG-2026-8801',
    createdAt: '2026-11-10T10:30:00Z',
    source: 'ONLINE_GUEST',
    guestName: 'Amit Verma',
    guestEmail: 'amit.verma@example.com',
    guestPhone: '+91 98111 22334',
    idProofName: 'aadhaar_amit_verma.pdf',
    checkIn: '2026-11-20',
    checkOut: '2026-11-22',
    nights: 2,
    adults: 2,
    children: 1,
    room: INITIAL_ROOMS[0],
    taxi: {
      route: TAXI_ROUTES[0],
      vehicle: 'SUV',
      pickupTime: '11:30 AM (Kathgodam Shatabdi)'
    },
    foodItems: [{ item: FOOD_MENU[0], quantity: 2 }],
    treks: [{ trek: TREKS[0], participants: 2 }],
    roomAmount: 5600,
    taxiAmount: 4500,
    foodAmount: 700,
    trekAmount: 1500,
    subtotal: 12300,
    gstAmount: 1476,
    totalAmount: 13776,
    advancePaid: 4133,
    balanceDue: 9643,
    paymentStatus: 'ADVANCE_30_PAID',
    paymentMethod: 'RAZORPAY_UPI',
    bookingStatus: 'CONFIRMED',
    acceptedRefundPolicy: true,
    specialRequests: 'Quiet room on upper floor. Extra heater if possible.'
  },
  {
    id: 'bk-102',
    bookingNumber: 'JAG-2026-8802',
    createdAt: '2026-11-11T14:15:00Z',
    source: 'FRONT_DESK_ADMIN',
    guestName: 'Pooja Sharma',
    guestEmail: 'pooja.sharma@example.com',
    guestPhone: '+91 99222 33445',
    idProofName: 'passport_pooja.jpg',
    checkIn: '2026-11-18',
    checkOut: '2026-11-21',
    nights: 3,
    adults: 3,
    children: 0,
    room: INITIAL_ROOMS[1],
    roomAmount: 12600,
    taxiAmount: 0,
    foodAmount: 840,
    trekAmount: 0,
    subtotal: 13440,
    gstAmount: 1613,
    totalAmount: 15053,
    advancePaid: 15053,
    balanceDue: 0,
    paymentStatus: 'PAID_FULL',
    paymentMethod: 'RAZORPAY_CARD',
    bookingStatus: 'CHECKED_IN',
    acceptedRefundPolicy: true,
    specialRequests: 'Temple puja timings coordination needed.'
  }
];
