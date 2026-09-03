import type { DiaryLink } from "@/types/content";

/**
 * The Journal's whole reason to exist: point visitors at real social
 * spaces, not host posts of its own (see components/JournalDiary). A
 * small, deliberately editable list — add/remove an entry here and the
 * diary page picks it up, no other file to touch. Instagram has no real
 * URL on file yet, so it renders honestly as "not linked yet" rather than
 * a fabricated handle (same convention as `data/contactExperience.ts`).
 */
export const diaryLinks: DiaryLink[] = [
  {
    id: "instagram",
    label: "Instagram",
  },
  {
    id: "telegram",
    label: "Telegram",
    value: "@myworld_mypeople — My World, My People",
    href: "https://t.me/myworld_mypeople",
  },
];
