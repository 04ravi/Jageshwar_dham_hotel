import "server-only";
import { createHash } from "node:crypto";
import Stripe from "stripe";
import { Pool } from "pg";
import { drizzle } from "drizzle-orm/node-postgres";
import {
  boolean,
  integer,
  jsonb,
  pgTable,
  text,
  uuid,
} from "drizzle-orm/pg-core";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { INITIAL_ROOMS, TAXI_ROUTES, FOOD_MENU, TREKS } from "@/data/mockData";

const counts = z.record(z.string().max(80), z.number().int().min(1).max(20));
const input = z.object({
  id: z.uuid(),
  roomId: z.string(),
  checkIn: z.iso.date(),
  checkOut: z.iso.date(),
  adults: z.number().int().positive(),
  children: z.number().int().nonnegative(),
  name: z.string().trim().min(2).max(100),
  email: z.email().max(254),
  phone: z.string().regex(/^[+\d ()-]{7,20}$/),
  notes: z.string().max(600),
  taxi: z
    .object({ id: z.string(), vehicle: z.enum(["Sedan", "SUV"]) })
    .nullable(),
  food: counts,
  treks: counts,
  accepted: z.literal(true),
  displayedAdvance: z.number().int().positive(),
});
const orders = pgTable("hotel_test_checkouts", {
  id: uuid().primaryKey(),
  hash: text("request_hash").notNull(),
  details: jsonb().$type<string>().notNull(),
  advance: integer("advance_rupees").notNull(),
  paid: boolean().notNull().default(false),
  notified: boolean().notNull().default(false),
});
const db = drizzle(
  new Pool({ connectionString: process.env.DATABASE_URL, max: 3 }),
);
function stripe() {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key?.startsWith("sk_test_")) throw Error("Stripe test mode unavailable");
  return new Stripe(key);
}
export class BookingInputError extends Error {}
function invalid(message: string): never {
  throw new BookingInputError(message);
}
export async function startTestBooking(raw: unknown, origin: string) {
  const result = input.safeParse(raw);
  if (!result.success)
    invalid(
      "Check your contact details, dates, guest counts and policy acceptance.",
    );
  const b = result.data;
  const room = INITIAL_ROOMS.find(
    (r) => r.id === b.roomId && r.status === "Vacant",
  );
  const nights = (Date.parse(b.checkOut) - Date.parse(b.checkIn)) / 86400000;
  if (
    !room ||
    b.adults > room.capacityAdults ||
    b.children > room.capacityChildren ||
    b.checkIn <
      new Date().toLocaleDateString("en-CA", { timeZone: "Asia/Kolkata" }) ||
    nights < 1 ||
    nights > 30
  )
    invalid(
      "Choose an available room, valid guest count and a stay of 1–30 nights.",
    );
  let subtotal = room.pricePerNight * nights;
  const extras: string[] = [];
  if (b.taxi) {
    const route = TAXI_ROUTES.find((r) => r.id === b.taxi!.id);
    if (!route) invalid("Unknown taxi route.");
    subtotal += b.taxi.vehicle === "SUV" ? route.priceSUV : route.priceSedan;
    extras.push(`${route.from} to ${route.to} (${b.taxi.vehicle})`);
  }
  for (const [id, q] of Object.entries(b.food)) {
    const f = FOOD_MENU.find((x) => x.id === id);
    if (!f) invalid("Unknown food selection.");
    subtotal += f.price * q;
    extras.push(`${f.name} × ${q}`);
  }
  for (const [id, q] of Object.entries(b.treks)) {
    const t = TREKS.find((x) => x.id === id);
    if (!t) invalid("Unknown trek selection.");
    subtotal += t.pricePerPerson * q;
    extras.push(`${t.title} × ${q}`);
  }
  const total = subtotal + Math.round(subtotal * 0.12),
    advance = Math.round(total * 0.3);
  if (advance !== b.displayedAdvance)
    invalid(
      "The quoted price changed. Review your selections before continuing.",
    );
  const details = `Guest: ${b.name}\nEmail: ${b.email}\nPhone: ${b.phone}\nRoom: ${room.name}\nStay: ${b.checkIn} to ${b.checkOut} (${nights} nights)\nGuests: ${b.adults} adults, ${b.children} children\nExtras: ${extras.join(", ") || "None"}\nRequests: ${b.notes || "None"}\nTotal including GST: INR ${total}\nTest advance: INR ${advance}\nRemaining (simulated): INR ${total - advance}`;
  const hash = createHash("sha256").update(JSON.stringify(b)).digest("hex");
  await db
    .insert(orders)
    .values({ id: b.id, hash, details, advance })
    .onConflictDoNothing();
  const [order] = await db
    .select({ hash: orders.hash })
    .from(orders)
    .where(eq(orders.id, b.id));
  if (order.hash !== hash)
    invalid("Please start a new checkout for the changed booking.");
  const session = await stripe().checkout.sessions.create(
    {
      mode: "payment",
      client_reference_id: b.id,
      metadata: { kind: "hotel_test_advance" },
      line_items: [
        {
          price_data: {
            currency: "inr",
            unit_amount: advance * 100,
            product_data: { name: `TEST • ${room.name} • 30% advance` },
          },
          quantity: 1,
        },
      ],
      success_url: `${origin}/booking-result?session={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/booking-result?cancelled=1`,
    },
    { idempotencyKey: `hotel-test-${b.id}` },
  );
  return session.url;
}
export async function verifyTestBooking(id: string) {
  if (!/^cs_test_[a-zA-Z0-9]{10,180}$/.test(id)) return null;
  const s = await stripe().checkout.sessions.retrieve(id);
  const ref = s.client_reference_id;
  if (
    s.livemode ||
    s.metadata?.kind !== "hotel_test_advance" ||
    s.status !== "complete" ||
    s.payment_status !== "paid" ||
    s.currency !== "inr" ||
    !ref ||
    !z.uuid().safeParse(ref).success
  )
    return null;
  const [o] = await db.select().from(orders).where(eq(orders.id, ref));
  if (!o || s.amount_total !== o.advance * 100) return null;
  if (!o.paid)
    await db.update(orders).set({ paid: true }).where(eq(orders.id, ref));
  let notified = o.notified;
  if (!notified && process.env.RESEND_API_KEY) {
    try {
      const response = await fetch("https://api.resend.com/emails", {
        method: "POST",
        signal: AbortSignal.timeout(8000),
        headers: {
          Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
          "Content-Type": "application/json",
          "Idempotency-Key": `hotel-test-${ref}`,
        },
        body: JSON.stringify({
          from: process.env.BOOKING_FROM_EMAIL || "onboarding@resend.dev",
          to: [process.env.BOOKING_ADMIN_EMAIL || "bhattravi119@gmail.com"],
          subject: `Test booking ${ref} — Jageshwar Dham`,
          text: `TEST ONLY — no money charged or room reserved.\nReference: ${ref}\n\n${o.details}`,
        }),
      });
      if (response.ok) {
        await db
          .update(orders)
          .set({ notified: true })
          .where(eq(orders.id, ref));
        notified = true;
      }
    } catch {
      /* Payment stays verified; rechecking the receipt retries the alert. */
    }
  }
  return { ref, advance: o.advance, notified, details: o.details };
}
