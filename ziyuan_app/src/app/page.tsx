"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button"; 
import { Smile } from "lucide-react";

export default function Home() {
  const router = useRouter();

  return (
    <main className="flex flex-col items-center justify-center h-screen gap-6 bg-background text-foreground">
      <img
        src="https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExODV5azZ4czU0NmNwYTcyODJqdThtbHd0ZjRlMGV2d2s1OWUyY2tkaSZlcD12MV9naWZzX3NlYXJjaCZjdD1n/dijK6WYRdSoJEikGPS/giphy.gif"
        alt="Animated GIF"
        style={{ width: '50%', height: 'auto' }}
        className="rounded-lg border-4 border-gray-300"
      />

      <h1 className="text-3xl font-bold text-center">
        Welcome to ServiHub - Booking Engine
      </h1>

      <Smile className="w-16 h-16 text-primary animate-bounce" />

      <div className="flex gap-4">
        <Button 
          size="lg" 
          className="bg-[#C2185B] text-white hover:bg-[#E57399]"
          onClick={() => router.push("/business")}
        >
          Business View
        </Button>
        <Button 
          size="lg" 
          className="bg-[#2563EB] text-white hover:bg-[#7EA8F7]"
          onClick={() => router.push("/customer")}
        >
          Customer View
        </Button>
      </div>
    </main>
  );
}
