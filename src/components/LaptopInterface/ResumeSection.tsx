import { Download, FileText } from "lucide-react";

interface ResumeSectionProps {
  href: string;
}

/** The Resume folder's content — the existing CV file (`data/contact.ts`'s
 * `resumeCta.href`, already used by the linear page's Contact section),
 * viewable inline and downloadable, not just a bare link. */
export function ResumeSection({ href }: ResumeSectionProps) {
  return (
    <div className="flex flex-col items-center gap-5 py-2 text-center">
      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[var(--room-lamp-glow)]/15 text-[var(--room-lamp-glow)]">
        <FileText size={26} strokeWidth={1.5} aria-hidden />
      </div>
      <p className="max-w-xs text-sm text-[var(--color-cream)]/70">My CV, up to date — view it here or take a copy with you.</p>
      <div className="flex flex-wrap justify-center gap-3">
        <a
          href={href}
          target="_blank"
          rel="noreferrer"
          className="rounded-full border border-white/15 px-4 py-2 text-sm text-[var(--color-cream)] transition-colors duration-[var(--duration-fast)] hover:bg-white/10"
        >
          View CV
        </a>
        <a
          href={href}
          download
          className="flex items-center gap-1.5 rounded-full bg-[var(--room-lamp-glow)] px-4 py-2 text-sm font-medium text-[#1c1712] transition-opacity duration-[var(--duration-fast)] hover:opacity-90"
        >
          <Download size={14} strokeWidth={2} aria-hidden />
          Download
        </a>
      </div>
      <embed src={href} type="application/pdf" className="h-64 w-full rounded-[var(--radius-md)] border border-white/10 bg-black/30" />
    </div>
  );
}
