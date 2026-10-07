import { SITE } from "@/lib/guides";
import { getNav } from "@/lib/nav";
import { SiteHeader } from "./site-header";

/** Header plus page body. Used by the home page and every guide page. */
export function SiteShell({ children }: { children: React.ReactNode }) {
  const guides = getNav();
  return (
    <>
      <a
        href="#content"
        className="sr-only z-50 rounded-md bg-accent px-3 py-2 text-accent-fg focus:not-sr-only focus:fixed focus:left-3 focus:top-3"
      >
        Skip to content
      </a>
      <SiteHeader guides={guides} repo={SITE.repo} />
      {children}
    </>
  );
}
