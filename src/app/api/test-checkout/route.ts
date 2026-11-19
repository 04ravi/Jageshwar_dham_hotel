import { startTestBooking, BookingInputError } from "@/lib/test-bookings";
export async function POST(request: Request) {
  const origin = request.headers.get("origin");
  const host =
    request.headers.get("x-forwarded-host") || request.headers.get("host");
  if (!origin || new URL(origin).host !== host)
    return new Response(null, { status: 403 });
  try {
    const body = await request.text();
    if (body.length > 12000) return new Response(null, { status: 413 });
    const url = await startTestBooking(JSON.parse(body), origin);
    return Response.json({ url });
  } catch (e) {
    const invalid = e instanceof BookingInputError || e instanceof SyntaxError;
    return Response.json(
      {
        error: invalid
          ? e.message
          : "Test checkout is unavailable. No payment was taken. Please retry.",
      },
      { status: invalid ? 400 : 503 },
    );
  }
}
