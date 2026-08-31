import { Room } from "@/components/Room";

export default function Home() {
  return (
    <main className="h-screen w-screen overflow-hidden bg-[var(--room-wall-dark)]">
      <Room />
    </main>
  );
}
