import Link from "next/link";
import { verifyTestBooking } from "@/lib/test-bookings";
export const dynamic = "force-dynamic";
export const metadata = {
  title: "Test booking receipt | Jageshwar Dham",
  robots: { index: false, follow: false },
  referrer: "no-referrer" as const,
};
export default async function Result({
  searchParams,
}: {
  searchParams: Promise<{ session?: string; cancelled?: string }>;
}) {
  const { session, cancelled } = await searchParams;
  const receipt = session
    ? await verifyTestBooking(session).catch(() => null)
    : null;
  return (
    <main className="mx-auto max-w-lg px-6 py-20">
      <p className="text-xs font-bold uppercase tracking-widest text-emerald-800">
        Jageshwar Dham · Test checkout
      </p>
      <h1 className="mt-3 font-serif text-3xl font-bold">
        {receipt
          ? "Test payment verified"
          : cancelled
            ? "Checkout cancelled"
            : "Payment not verified"}
      </h1>
      <p className="my-4">
        No real money is charged and no room is reserved in test mode.
      </p>
      {receipt ? (
        <dl className="space-y-2 rounded-xl bg-white p-5">
          <dt>Booking reference</dt>
          <dd className="break-all font-mono">{receipt.ref}</dd>
          <dt>Verified test advance</dt>
          <dd>₹{receipt.advance.toLocaleString("en-IN")}</dd>
          <dt>Booking details</dt>
          <dd className="whitespace-pre-line break-words">{receipt.details}</dd>
          <dt>Admin email</dt>
          <dd>
            {receipt.notified
              ? "Accepted by email provider"
              : "Not sent. Refresh this receipt to retry after email setup."}
          </dd>
        </dl>
      ) : (
        !cancelled && (
          <p>
            Check that you completed the test payment, then refresh this
            receipt.
          </p>
        )
      )}
      <Link
        href="/"
        className="mt-6 inline-block font-bold text-emerald-800 underline"
      >
        Return to hotel
      </Link>
    </main>
  );
}
