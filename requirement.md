# System Requirement Specification (SRS) & Architecture Plan
## Project: Jageshwar Dham Hotel & Experience Management Platform

---

## 1. Executive Summary & Context

### 1.1 Business Context
The client operates a hospitality business in **Jageshwar Dham (Almora, Uttarakhand)**—a revered sacred valley surrounded by towering Himalayan Deodar cedar forests, home to a 125-temple complex dedicated to Lord Shiva (dated between the 7th and 12th century). 

Visitors travel to Jageshwar for:
1. **Spiritual Tourism & Pilgrimage** (Darshan at Jyotirlinga/Dham, Mahashivratri, Shravan Mela).
2. **Eco & Mountain Tourism** (Forest walks, meditation, high-altitude bird watching).
3. **Trekking & Adventure** (Vridh Jageshwar trek offering panoramic views of Trishul & Nanda Devi peaks, Jhanker Sam temple trail, Dandeshwar temple circuit).

### 1.2 Core Problem Statement
Currently, guests either book through aggregators (paying 15–25% commission) or struggle with coordinating fragmented local services (finding reliable mountain cabs from Kathgodam/Pantnagar, getting home-cooked Kumaoni food, and hiring certified local trekking guides).

### 1.3 Solution Vision
A custom **Direct Booking & Integrated Hospitality Platform (Website + PMS Admin)** that:
- Enables guests to book rooms directly with advance token or full payment.
- Sells bundled hill experiences: **Airport/Railway Taxi transfers**, **Authentic Pahadi & Satvik Food**, and **Guided Himalayan Treks**.
- Gives hotel staff an intuitive, cloud-based dashboard to manage room inventory, check-ins, billing, and third-party local service coordination (drivers and guides).

---

## 2. User Roles & Access Control

| Role | Description | Key Capabilities |
| :--- | :--- | :--- |
| **Guest / Traveler** | Customer visiting the website | Search rooms by dates & guests, customize stay with add-on services (Taxi, Food, Trek), make online payments, receive WhatsApp/Email booking slips. |
| **Front Desk Staff** | Hotel receptionist | Check-in/Check-out guests, process walk-ins, create offline reservations, mark room clean/dirty, view daily arrivals/departures. |
| **Service Coordinator** | Operations manager | Assign booked taxi rides to drivers, notify kitchen staff of meal orders, allocate certified local guides for trekking. |
| **Hotel Owner / Admin** | Business owner | Full access: room pricing, discounts, occupancy reports, revenue analytics, staff accounts, payment gateway configurations. |

---

## 3. Detailed Functional Requirements

### 3.1 Module 1: Room Inventory & Direct Booking Engine
- **Date & Guest Selector:** Check-in, check-out dates, number of adults and children.
- **Real-Time Room Availability:** Live check against existing reservations to avoid double booking.
- **Room Showcases:**
  - Room categories (e.g., *Deodar Forest View Deluxe*, *Himalayan Heritage Suite*, *Family Cottage*, *Budget Backpacker Room*).
  - High-resolution image galleries, bed types, view type, amenities (Heater, Geyser/24x7 hot water, High-speed Wi-Fi, Mountain balcony).
  - Dynamic pricing (Weekday vs. Weekend, Peak Pilgrimage Season e.g. May–June & Shravan vs. Off-season).
- **Flexible Booking Policies:**
  - Option to pay 100% upfront or 30% advance deposit to secure booking.
  - Transparent cancellation policy and check-in/out guidelines (Standard: 12:00 PM Check-in / 10:00 AM Check-out).

### 3.2 Module 2: Add-On Mountain Services

#### A. Taxi & Transit Service
- **Popular Routes Pre-configured:**
  - *Kathgodam Railway Station ⇄ Jageshwar Dham* (~120 km / 4 hrs)
  - *Pantnagar Airport ⇄ Jageshwar Dham* (~150 km / 5 hrs)
  - *Almora Town ⇄ Jageshwar* (~36 km / 1.5 hrs)
  - *Local Day Excursions:* Kasar Devi, Binsar Wildlife Sanctuary, Chitai Golu Devta Temple, Patal Bhuvaneshwar.
- **Vehicle Selection:** Hatchback (Alto/WagonR for budget couples), Sedan (Dzire), SUV (Bolero/Innova for mountain roads).
- **Booking Fields:** Pick-up date, time, flight/train number, number of luggage bags.

#### B. Food & Dining (Kumaoni & Satvik Kitchen)
- **Pre-Bookable Meal Plans:**
  - European Plan (Room Only)
  - Continental Plan (Room + Breakfast)
  - Modified American Plan (Room + Breakfast + Dinner)
- **Speciality Add-ons:**
  - *Traditional Kumaoni Thali* (Bhatt ki Churkani, Aloo ke Gutke, Madua Roti, Pahadi Raita, Singori dessert).
  - *Pure Satvik / Jain Meal* (No onion, no garlic for temple pilgrims).
  - *Bonfire & Barbecue Evening Pack*.
- **In-Stay Digital QR Menu:** Diners in rooms scan a QR code to view live menu and place orders to the kitchen desk.

#### C. Trekking & Mountain Activities
- **Curated Trails:**
  - *Vridh Jageshwar Trek:* 3-4 km uphill hike through ancient cedar trees with 360° Himalayan vista.
  - *Dandeshwar & Jageshwar Heritage Temple Walk:* Led by a local historian/priest.
  - *Jhanker Sam Temple & Forest Trail:* Nature walk for peace, meditation, and bird watching.
- **Trek Configurations:**
  - Difficulty tag (Easy, Moderate, Challenging), duration, altitude.
  - Inclusion of trekking pole, packed lunch, guide fee, and forest permits if needed.
  - Per-person or group booking option.

### 3.3 Module 3: Checkout, Payments & Compliance
- **Unified Cart System:** Customer adds 1 Room + 1 Taxi pickup + 1 Trek package into a single seamless checkout.
- **Indian Payment Gateway Support:**
  - **Razorpay / PhonePe Payment Gateway:** UPI (GPay, PhonePe, Paytm, BHIM), Credit/Debit Cards, Net Banking.
  - International Card support (Stripe or Razorpay International) for foreign spiritual seekers.
- **Automated Invoicing & GST Calculation:**
  - GST breakup (e.g., 12% on rooms above ₹1,000 threshold, 5% on restaurant food, 5% on transport).
  - Instant PDF invoice generation.
- **WhatsApp & SMS Notifications:**
  - Instant confirmation message with booking ID, Google Maps location pin, hotel emergency phone numbers, and driver details.

### 3.4 Module 4: Hotel Management Backend (PMS / Admin Portal)
- **Visual Room Tape Chart (Interactive Grid):**
  - Columns = Dates, Rows = Room Numbers.
  - Drag-and-drop or click to block, assign, or edit reservations.
- **Service Dispatch Dashboard:**
  - List of upcoming taxi pickups with assigned driver phone numbers.
  - List of daily guided treks with assigned mountain guides.
  - Kitchen meal counts for lunch and dinner forecasting.
- **Guest CRM:**
  - Guest directory, ID proof upload (Aadhaar / Passport for Indian police compliance / Form C for foreigners).
  - Past booking history and special requests (e.g., extra heater, ground-floor room for elderly).
- **Reports & Analytics:**
  - Occupancy rate, Average Daily Rate (ADR), RevPAR, total add-on revenue split (Rooms vs. Taxi vs. Food vs. Treks).

---

## 4. UI/UX & Page Layout Specifications

```
                              [ SITE MAP ]
                                   │
   ┌─────────────────┬─────────────┴───────────┬──────────────────┐
   ▼                 ▼                         ▼                  ▼
[Home]          [Rooms & Suites]          [Experiences]     [Admin PMS Portal]
   │                 │                         │             - Tape Chart
   │                 ├─ Room Detail            ├─ Taxi       - Bookings
   │                 └─ Availability Engine    ├─ Food       - Dispatcher
   │                                           └─ Treks      - Reports
   └───────► [Unified Booking Checkout] ◄──────┘
                     │
                     ▼
             [Payment Gateway]
                     │
                     ▼
          [Confirmation / Slip]
```

### 4.1 Page 1: Homepage (`/`)
- **Hero Section:**
  - Full-width immersive background (misty morning over Jageshwar Deodar forest and ancient stone temples).
  - Clear value proposition: *"Sacred Stays & Himalayan Trails at Jageshwar Dham"*.
  - **Floating Booking Widget:** [Check-In Date] | [Check-Out Date] | [Guests] | [Check Availability Button].
- **About the Property & Spiritual Setting:**
  - Distance highlight: *"Just 3 minutes walking distance from Jageshwar Temple Complex"*.
- **Featured Rooms Carousel:**
  - Cards displaying room picture, starting price/night, key tags (*Balcony View, Free Breakfast, Heated*).
- **Curated Experiences Grid (3 Core Pillars):**
  - **Mountain Transfers:** Safe pickup from Kathgodam/Pantnagar with experienced hill drivers.
  - **Pahadi Organic Cuisine:** Fresh local harvest, wood-fired taste, pure satvik options.
  - **Sacred Treks & Forest Walks:** Guided trails to Vridh Jageshwar and hidden waterfalls.
- **Interactive Map & How to Reach Guide:**
  - Route guidance from Delhi, Dehradun, Kathgodam, and Pantnagar.
- **Guest Testimonials & Live Weather Widget:**
  - Real-time temperature of Jageshwar.
- **Footer:** Direct WhatsApp click-to-chat button, emergency reception phone, Google reviews badge.

### 4.2 Page 2: Room Listing & Detail (`/rooms` & `/rooms/[slug]`)
- **Filter Bar:** Price range, Bed count, Amenities (Heater, Valley View, Geyser, Wi-Fi).
- **Room Detail View:**
  - Photo gallery with thumbnail carousel.
  - Room specs (Square footage, max occupancy, bed configuration).
  - House rules (Check-in time, alcohol/smoking policy in sacred Dham area, pet policy).
  - Interactive "Select Room" button that locks the room for 10 minutes during checkout.

### 4.3 Page 3: Add-on Services Hub (`/services` or in-checkout)
- **Taxi Tab (`/services/taxi`):**
  - Route dropdown selector.
  - Car type comparison table (Luggage capacity, seats).
  - Fare estimator with fixed transparent pricing.
- **Dining Tab (`/services/dining`):**
  - Visual menu with photos of Kumaoni Thalis, Continental breakfasts, and beverages.
  - Add meal coupons to booking.
- **Trekking Tab (`/services/treks`):**
  - Elevation profile, difficulty badge, trail length in km, inclusions.
  - Guide selector and safety disclaimer checkbox.

### 4.4 Page 4: Unified Booking & Checkout (`/checkout`)
- **Step 1 - Summary:** Selected room + chosen add-on services itemized.
- **Step 2 - Guest Information:** Primary guest name, email, phone number (with WhatsApp flag), expected arrival time, special requests.
- **Step 3 - Payment Choice:**
  - *Option A:* Pay 100% (Instant confirmation).
  - *Option B:* Pay 30% advance token (Balance payable upon arrival).
- **Step 4 - Payment Gateway Modal:** Razorpay/PhonePe popup.
- **Step 5 - Success Page:** Download PDF voucher, QR Code for instant check-in, button to add to Google Calendar.

### 4.5 Page 5: Admin PMS Dashboard (`/admin`)
- **Dashboard Overview:** Today's arrivals, departures, current occupancy %, today's revenue.
- **Calendar Tape Chart:** Interactive matrix of 10-30 rooms across 30 days.
- **Booking Management:** Search by Guest Name, Phone, or Booking ID; status badges (*Pending, Confirmed, Checked-in, Checked-out, Cancelled*).
- **Service Dispatch Board:**
  - Tab 1: Today's Cabs (Guest name, pickup location, train/flight time, assign driver name + phone).
  - Tab 2: Trekking Schedule (Date, trail, group size, assign guide name).
  - Tab 3: Meal Orders (Room #, special food requests).

---

## 5. Technical Architecture & Tech Stack

### 5.1 Recommended Modern Stack

| Layer | Recommended Choice | Justification |
| :--- | :--- | :--- |
| **Frontend Framework** | **Next.js 15 (App Router, React 19)** | Server-side rendering (SSR) for lightning-fast SEO (essential for ranking high on "Hotels in Jageshwar Dham"); rich interactive UI. |
| **Styling & Components** | **Tailwind CSS + shadcn/ui + Lucide Icons** | Clean, modern, accessible design system; fully responsive for mobile pilgrims on mountain 4G networks. |
| **Backend & API** | **Next.js Server Actions & Route Handlers** | Seamless full-stack architecture inside one codebase; minimal maintenance overhead. |
| **Database & ORM** | **PostgreSQL + Prisma ORM** (via **Supabase** or **Neon**) | Relational consistency is mandatory for room reservations to prevent race conditions / double bookings with transactional locks (`SELECT ... FOR UPDATE`). |
| **Authentication** | **NextAuth.js (Auth.js) / Supabase Auth** | Role-based authentication (Admin, Reception, Customer). |
| **Payment Gateway** | **Razorpay India / PhonePe Payment Gateway** | Best UPI conversion rates, domestic Indian debit/credit cards, automatic settlement, refund webhooks. |
| **Media & Asset Hosting** | **Cloudinary** | Automatic image compression and WebP conversion for fast loading on spotty mountain internet. |
| **Communication / Alerts** | **WhatsApp Cloud API (via Twilio or AiSensy) + Resend (Email)** | Guests traveling in Uttarakhand check WhatsApp far more frequently than email. |
| **Deployment & Hosting** | **Vercel** (Frontend/API) + **Supabase** (Database) | Zero-devops, edge caching across India (Mumbai/Delhi PoPs), free tier friendly to start. |

---

## 6. Database Schema Design (Entity-Relationship)

```
[User] 1 ────< [Booking] 1 ────< [Payment]
                   │
                   ├──── 1 ──< [BookingRoom] >── 1 ──── [Room]
                   │
                   └──── 1 ──< [ServiceBooking] >── 1 ── [Service]
                                                              │
                                            ┌─────────────────┴───────────────┐
                                            │                                 │
                                      [TaxiDetail]                     [TrekDetail]
```

### Key Data Tables:
1. `users` (id, name, email, phone, role: 'GUEST' | 'STAFF' | 'ADMIN')
2. `rooms` (id, room_number, category, title, description, base_price, capacity_adults, capacity_children, amenities, photos, is_active)
3. `room_pricing_rules` (id, room_id, start_date, end_date, price_multiplier, reason: 'SEASON' | 'WEEKEND')
4. `bookings` (id, booking_number, guest_id, check_in, check_out, total_amount, advance_paid, balance_due, status: 'CONFIRMED' | 'CHECKED_IN' | 'COMPLETED' | 'CANCELLED')
5. `booking_rooms` (id, booking_id, room_id, nightly_rate)
6. `services` (id, type: 'TAXI' | 'FOOD' | 'TREK', name, description, price, unit: 'PER_TRIP' | 'PER_PERSON' | 'PER_MEAL')
7. `service_bookings` (id, booking_id, service_id, scheduled_date, scheduled_time, quantity, unit_price, status, notes, assigned_vendor_name, assigned_vendor_phone)
8. `payments` (id, booking_id, transaction_ref, gateway: 'RAZORPAY', amount, currency: 'INR', status: 'SUCCESS' | 'FAILED' | 'REFUNDED')

---

## 7. Non-Functional & Regional Requirements

1. **Low-Bandwidth Optimization:**
   - Mountain cellular connectivity (Airtel/Jio) can fluctuate in remote stretches of Almora.
   - The site must load under 1.5s on 3G/4G connections by using optimized WebP/AVIF images and static generation (SSG).
2. **Offline-Tolerant Admin Workflow:**
   - The reception dashboard should cache room status locally (PWA support or local storage caching) so front desk staff can continue working if power/internet dips momentarily.
3. **Local SEO Strategy:**
   - Schema markup (`Hotel`, `LodgingBusiness`, `TouristAttraction`, `FAQPage`).
   - Targeted keywords: *"Homestay in Jageshwar Dham"*, *"Hotels near Jageshwar temple Almora"*, *"Taxi from Kathgodam to Jageshwar"*, *"Vridh Jageshwar trekking guide"*.
4. **Security & Data Privacy:**
   - HTTPS encryption everywhere.
   - Sensitive guest government IDs stored in private cloud storage buckets with pre-signed short-lived URLs.

---

## 8. Phased Implementation Roadmap

### Phase 1: Foundation & Brand Experience (Week 1–2)
- Set up Next.js 15 project, Tailwind CSS, shadcn/ui.
- Design responsive, culturally grounded UI (Himalayan earth tones, slate stone textures, deodar green accents).
- Build Homepage, Room Showcase, and Experience landing pages with rich photography.

### Phase 2: Booking Engine & Database Setup (Week 3)
- Configure PostgreSQL database & Prisma schemas.
- Build interactive date-availability engine with conflict resolution.
- Develop the unified cart (Room + Taxi + Food + Trek).

### Phase 3: Payment Integration & WhatsApp Automation (Week 4)
- Integrate Razorpay test/production environment (UPI, Netbanking, Cards).
- Implement webhook handlers for verified payment status updates.
- Connect WhatsApp messaging template for booking receipts and location sharing.

### Phase 4: PMS Admin Dashboard (Week 5)
- Build Reception Tape Chart (interactive calendar).
- Build Booking List, Check-in/Check-out modals, and Room Maintenance mode.
- Build Service Dispatch board for drivers and mountain guides.

### Phase 5: Testing, Content Seeding & Go-Live (Week 6)
- Test edge cases (double booking, payment dropouts, mobile responsiveness).
- Seed real property photos, room descriptions, taxi rates, and trek itineraries.
- Deploy to Vercel + Supabase, configure custom domain (e.g., `jageshwardhamresort.com`).

---

## 9. Next Steps for Immediate Execution
1. Initialize the codebase in this workspace (`next.js` with TypeScript and Tailwind).
2. Configure environment template (`.env.example`).
3. Set up mockup data for rooms, taxi routes, food items, and trekking trails so the client can review the interactive prototype immediately.
