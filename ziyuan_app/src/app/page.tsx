"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button"; 
import { Smile } from "lucide-react"

export default function Home() {
  const router = useRouter();

  return (
    <main className="flex flex-col items-center justify-center h-screen gap-6 bg-background text-foreground">
      <Smile className="w-16 h-16 text-primary animate-bounce" />

      <h1 className="text-3xl font-bold text-center">
        Welcome to ServiHub - Booking Engine
      </h1>

      <div className="flex gap-4">
        <Button size='lg' onClick={() => router.push("/business")}>Business View</Button>
        <Button size = 'lg' onClick={() => router.push("/customer")}>Customer View</Button>
      </div>
    </main>
  );
}