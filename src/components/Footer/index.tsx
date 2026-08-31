import { ArrowUp } from "lucide-react";
import { siteInfo } from "@/data/site";

export function Footer() {
  return (
    <footer className="border-t border-border py-12">
      <div className="mx-auto flex max-w-[1280px] items-center justify-between px-6 sm:px-10 md:px-20">
        <p className="font-serif text-[1.0625rem] text-ink">{siteInfo.name}</p>
        <p className="hidden text-center text-[0.8125rem] text-ink-3 md:block">
          © {siteInfo.copyrightYear}. Designed & developed with care.
        </p>
        <a
          href="#home"
          aria-label="Back to top"
          className="flex items-center gap-2 text-[0.8125rem] text-ink-3 transition-colors duration-150 hover:text-ink"
        >
          <ArrowUp size={16} strokeWidth={1.5} />
          Top
        </a>
      </div>
    </footer>
  );
}
