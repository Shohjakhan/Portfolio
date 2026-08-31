import { Room } from "@/components/Room";

/**
 * Preview route for the illustrated room while it's still foundation-stage.
 * The homepage (`/`) keeps rendering the linear-scroll sections until the
 * room is ready to replace it — see CLAUDE.md §2 and §4.
 */
export default function RoomPreviewPage() {
  return (
    <main className="h-screen w-screen overflow-hidden bg-[var(--room-wall-dark)]">
      <Room />
    </main>
  );
}
