"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { LayoutDashboard, Gamepad2, Home, LogOut, Loader2 } from "lucide-react";
import Link from "next/link";

export default function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [loading, setLoading] = useState(true);
  const [userEmail, setUserEmail] = useState<string | null>(null);

  useEffect(() => {
    async function checkAuth() {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        router.push("/admin/login");
      } else {
        setUserEmail(session.user.email || "Admin");
        setLoading(false);
      }
    }

    checkAuth();

    // Listen for auth state changes (e.g. logout elsewhere or session expiry)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (!session) {
        router.push("/admin/login");
      } else {
        setUserEmail(session.user.email || "Admin");
        setLoading(false);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [router]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/admin/login");
  };

  const navItems = [
    { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
    { href: "/admin/games", label: "Games Catalog", icon: Gamepad2 },
    { href: "/admin/homepage", label: "Homepage Sections", icon: Home },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-[#080A10] flex flex-col items-center justify-center text-white gap-3">
        <Loader2 className="w-10 h-10 animate-spin text-[#00D2FF]" />
        <p className="text-sm font-medium tracking-wide text-gray-400">Verifying session...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#080A10] text-white flex">
      {/* Sidebar */}
      <aside className="w-64 bg-[#121622] border-r border-[#202838] flex flex-col flex-shrink-0">
        <div className="p-6 border-b border-[#202838]">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-lg font-black tracking-wider uppercase bg-gradient-to-r from-[#00D2FF] to-[#00F0FF] bg-clip-text text-transparent">
              Gamer Bhidu
            </span>
            <span className="text-[10px] font-bold bg-[#00D2FF]/10 text-[#00D2FF] px-2 py-0.5 rounded-full border border-[#00D2FF]/20">
              Admin
            </span>
          </Link>
        </div>

        {/* Sidebar Nav */}
        <nav className="flex-1 p-4 space-y-1.5">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                  isActive
                    ? "bg-[#00D2FF]/10 text-[#00D2FF] border border-[#00D2FF]/20 shadow-[0_0_15px_rgba(0,210,255,0.05)]"
                    : "text-gray-400 hover:text-white hover:bg-white/5 border border-transparent"
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-[#202838] space-y-3">
          <div className="px-4 py-2 bg-black/25 rounded-lg border border-[#202838]/50">
            <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Logged in as</p>
            <p className="text-xs font-medium text-gray-300 truncate" title={userEmail || ""}>
              {userEmail}
            </p>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg text-sm font-semibold text-red-400 hover:text-red-300 hover:bg-red-500/10 border border-transparent hover:border-red-500/20 transition-all cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content Pane */}
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        <header className="h-16 border-b border-[#202838] bg-[#121622]/50 backdrop-blur-md flex items-center justify-between px-8 sticky top-0 z-30">
          <h2 className="text-lg font-bold text-white">
            {navItems.find((item) => pathname === item.href)?.label || "Admin Portal"}
          </h2>
          <div className="flex items-center gap-4">
            <Link
              href="/"
              className="text-xs font-semibold px-3.5 py-1.5 bg-[#202838] border border-[#202838] rounded-full hover:border-gray-500 text-gray-300 transition-colors"
            >
              View Storefront
            </Link>
          </div>
        </header>
        <main className="flex-1 p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
