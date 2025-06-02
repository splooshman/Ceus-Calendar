"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import BCalendar from "@/components/BCalendar";

export default function BusinessPage() {
  const router = useRouter();

  return (
    <main>
      <div className="border border-[var(--border)] rounded-[var(--radius)] p-3 mb-5 bg-[#C2185B] text-white flex justify-between items-center">
        <h1 className="text-2xl font-bold text-center w-full">Business Schedule</h1>
        <div className="absolute left-6">
          <Button
            size = 'md' 
            className="bg-[#FFFFFF] text-black hover:bg-[#E57399]"
            onClick={() => router.push("/")}
          >
            ← Back to Home
          </Button>
        </div>
      </div>
      <BCalendar />
    </main>
  );
}