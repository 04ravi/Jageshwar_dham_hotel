export default function CheckTestReceipt() {
  return (
    <details className="my-4 rounded-xl border border-stone-200 bg-white p-4 text-sm">
      <summary className="cursor-pointer font-bold">
        Verify a Stripe test booking
      </summary>
      <form action="/booking-result" className="mt-3 grid gap-2">
        <label htmlFor="receipt-session">
          Paste the session ID (cs_test_…) from the guest’s test receipt URL
        </label>
        <input
          id="receipt-session"
          name="session"
          required
          pattern="cs_test_[a-zA-Z0-9]+"
          className="rounded border p-2"
        />
        <button className="rounded bg-emerald-950 p-2 text-white">
          Verify payment and check email status
        </button>
      </form>
    </details>
  );
}
