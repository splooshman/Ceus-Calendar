import CCalendar from "@/components/CCalendar";

export default function CustomerPage() {
  return (
    <main>
      <h1 className="border border-[var(--border)] rounded-[var(--radius)] p-3 text-2xl font-bold text-center bg-[#2563EB] text-white mb-5">Customer Booking Requests</h1>
      <CCalendar />
    </main>
  );
}