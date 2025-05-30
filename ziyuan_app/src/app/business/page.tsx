import BCalendar from "@/components/BCalendar";

export default function BusinessPage() {
  return (
    <main>
      <h1 className="border border-[var(--border)] rounded-[var(--radius)] p-3 text-2xl font-semibold text-center bg-[#C2185B] text-white mb-5">Business Scheduler</h1>
      <BCalendar />
    </main>
  );
}