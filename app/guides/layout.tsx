import { SiteShell } from "@/components/site-shell";
import { SidebarNav } from "@/components/sidebar-nav";
import { getNav } from "@/lib/nav";

export default function GuidesLayout({ children }: { children: React.ReactNode }) {
  const guides = getNav();
  return (
    <SiteShell>
      <div className="mx-auto flex max-w-[88rem] px-4 sm:px-6">
        <aside className="sticky top-14 hidden h-[calc(100vh-3.5rem)] w-72 shrink-0 overflow-y-auto border-r border-border py-6 pr-4 lg:block print:hidden">
          <SidebarNav guides={guides} />
        </aside>
        <div id="content" className="min-w-0 flex-1">
          {children}
        </div>
      </div>
    </SiteShell>
  );
}
