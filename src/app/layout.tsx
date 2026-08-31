import type { Metadata } from "next";
import { Alex_Brush, Caveat, DM_Serif_Display, Inter } from "next/font/google";
import { CustomCursor } from "@/components/CustomCursor";
import "@/styles/globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
});

const dmSerifDisplay = DM_Serif_Display({
  variable: "--font-dm-serif",
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
});

/** Handwritten accent for the room's hover-label titles ("About Me", "My
 * Library", ...) — see --font-hand. A flowing brush-calligraphy face
 * (single weight — that's all Google ships for it), picked specifically to
 * read as "written with the same quill as the cursor" rather than a casual
 * notes-app scrawl. */
const alexBrush = Alex_Brush({
  variable: "--font-alex-brush",
  subsets: ["latin"],
  weight: "400",
});

/** Handwritten accent for longer in-panel notes (AboutExperience's section
 * tags, personal statement, "back to the room" link) — see --font-hand-note.
 * Deliberately a *different* face from --font-hand: Alex Brush read too
 * delicate/hard-to-scan for text that appears more than once per screen and
 * at smaller sizes — Caveat's plainer, bolder strokes work better there. */
const caveat = Caveat({
  variable: "--font-caveat",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Portfolio — Founder & Software Developer",
  description:
    "Personal portfolio of a young founder and software developer. Building thoughtful products with intention and craft.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${dmSerifDisplay.variable} ${alexBrush.variable} ${caveat.variable}`}>
      <body className="bg-bg text-ink">
        <CustomCursor />
        {children}
      </body>
    </html>
  );
}
