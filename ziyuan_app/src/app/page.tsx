"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button"; 

export default function Home() {
  const router = useRouter();

  return (
    <main className="flex flex-col items-center justify-center h-screen gap-6 bg-background text-foreground">
      <h1 className="text-3xl font-bold">Welcome to ServiHub - Booking Engine</h1>
      <div className="flex gap-4">
        <Button onClick={() => router.push("/business")}>Business View</Button>
        <Button onClick={() => router.push("/customer")}>Customer View</Button>
      </div>
    </main>
  );
}
