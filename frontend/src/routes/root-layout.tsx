import { Outlet } from "react-router";
import { SiteNav } from "@/components/site-nav";

export default function RootLayout() {
  return (
    <div className="min-h-screen bg-background">
      <SiteNav />
      <main className="mx-auto max-w-5xl px-4 py-6">
        <Outlet />
      </main>
    </div>
  );
}
