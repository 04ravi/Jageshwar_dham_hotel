import Stripe from "stripe";
import { verifyTestBooking } from "@/lib/test-bookings";

export async function POST(request: Request) {
  const key = process.env.STRIPE_SECRET_KEY;
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!key?.startsWith("sk_test_") || !secret)
    return new Response(null, { status: 503 });
  const signature = request.headers.get("stripe-signature");
  if (!signature) return new Response(null, { status: 400 });
  let event: Stripe.Event;
  try {
    event = new Stripe(key).webhooks.constructEvent(
      await request.text(),
      signature,
      secret,
    );
  } catch {
    return new Response(null, { status: 400 });
  }
  if (
    !event.livemode &&
    (event.type === "checkout.session.completed" ||
      event.type === "checkout.session.async_payment_succeeded")
  ) {
    const s = event.data.object;
    if (
      s.metadata?.kind === "hotel_test_advance" &&
      s.payment_status === "paid"
    ) {
      const receipt = await verifyTestBooking(s.id);
      if (!receipt?.notified) return new Response(null, { status: 503 });
    }
  }
  return new Response(null, { status: 204 });
}
