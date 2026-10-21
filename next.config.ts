import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Drops the `X-Powered-By: Next.js` response header — minor info-
  // disclosure otherwise (tells a would-be attacker the exact framework
  // to target known CVEs for), free to turn off.
  poweredByHeader: false,

  images: {
    /**
     * Notion-hosted cover/file images (Movies/Anime/Books, see
     * `src/lib/notion/properties.ts`'s `getPageCoverUrl`/`getFirstFileUrl`)
     * come back as real, working URLs from the API — without an explicit
     * allowlist entry here, `next/image` (`ArtworkImage`) silently refuses
     * to render any hostname it doesn't recognize, which is why a real
     * Notion cover never showed up despite the mapper fetching it
     * correctly. `prod-files-secure.s3.us-west-2.amazonaws.com` is
     * Notion's actual upload bucket (what a "file" URL resolves to);
     * `secure.notion-static.com` covers older-style uploads. Both are
     * presigned/short-lived (re-signed fresh on every fetch per
     * docs/notion-integration.md), so no `pathname` restriction is added
     * — the query string changes every request.
     */
    remotePatterns: [
      { protocol: "https", hostname: "prod-files-secure.s3.us-west-2.amazonaws.com" },
      { protocol: "https", hostname: "s3.us-west-2.amazonaws.com" },
      { protocol: "https", hostname: "secure.notion-static.com" },
      { protocol: "https", hostname: "www.notion.so" },
      // Notion's built-in gallery covers (e.g. `/images/page-cover/webb4.jpg`)
      // and its cover picker's Unsplash tab — both are valid "Add cover"
      // choices on a Movies/Anime row and would otherwise be rejected too.
      { protocol: "https", hostname: "app.notion.com", pathname: "/images/**" },
      { protocol: "https", hostname: "images.unsplash.com" },
    ],
  },

  /**
   * Baseline security headers — the low-risk, well-established ones that
   * don't require auditing every script/style source the way a real CSP
   * would (deliberately not added here: this site's markup relies on
   * Next's own injected inline hydration scripts, and getting a CSP wrong
   * blind, with no way to verify it in a real deployed environment this
   * session, risks breaking the whole page rather than hardening it —
   * left as a documented follow-up, see the production-readiness report).
   */
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
        ],
      },
    ];
  },
};

export default nextConfig;
