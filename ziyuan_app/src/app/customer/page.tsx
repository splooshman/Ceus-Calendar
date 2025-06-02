"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import CCalendar from "@/components/CCalendar";

export default function CustomerPage() {
  const router = useRouter();

  return (
    <main>
      <div className="border border-[var(--border)] rounded-[var(--radius)] p-3 mb-5 bg-[#2563EB] text-white flex justify-between items-center">
        <h1 className="text-2xl font-bold text-center w-full">Customer Booking Requests</h1>
        <div className="absolute left-6">
          <Button
            size = 'md' 
            className="bg-[#FFFFFF] text-black hover:bg-[#7EA8F7]"
            onClick={() => router.push("/")}
          >
            ← Back to Home
          </Button>
        </div>
      </div>
      <CCalendar />
    </main>
  );
}
