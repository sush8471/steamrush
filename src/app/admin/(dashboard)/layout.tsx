"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { 
  LayoutDashboard, 
  Gamepad2, 
  Settings as SettingsIcon, 
  LogOut,
  Package,
  ShoppingCart,
  Users,
  Loader2
} from "lucide-react";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    async function checkAuth() {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.push("/admin/login");
      } else {
        setUser(session.user);
        setIsLoading(false);
      }
    }
    checkAuth();
  }, [router]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push("/admin/login");
    router.refresh();
  };

  if (isLoading) {
    return (
      <div className="h-screen bg-slate-950 flex flex-col items-center justify-center text-white gap-4">
        <Loader2 className="w-10 h-10 animate-spin text-indigo-500" />
        <p className="text-slate-400 font-medium animate-pulse">Verifying Admin Access...</p>
      </div>
    );
  }

  const isActive = (path: string) => {
    if (path === '/admin') return pathname === '/admin';
    return pathname.startsWith(path);
  };

  return (
    <div className="flex h-screen bg-slate-950 text-white overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 border-r border-slate-800 bg-slate-900/50 backdrop-blur-xl flex flex-col">
        <div className="flex h-16 items-center border-b border-slate-800 px-6">
          <Link href="/admin" className="flex items-center gap-2 font-bold text-xl">
            <Gamepad2 className="w-6 h-6 text-indigo-500" />
            <span>SteamRush <span className="text-indigo-500">Admin</span></span>
          </Link>
        </div>
        
        <nav className="p-4 space-y-2 flex-1">
          <Link 
            href="/admin" 
            className={`flex items-center gap-3 px-4 py-2 rounded-lg transition-colors ${
              isActive('/admin') && pathname === '/admin' ? 'bg-indigo-600 text-white' : 'hover:bg-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            <LayoutDashboard className="w-5 h-5" />
            <span>Dashboard</span>
          </Link>
          
          <Link 
            href="/admin/games" 
            className={`flex items-center gap-3 px-4 py-2 rounded-lg transition-colors ${
              isActive('/admin/games') ? 'bg-indigo-600 text-white' : 'hover:bg-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            <Package className="w-5 h-5" />
            <span>Games Manager</span>
          </Link>
          
          <Link 
            href="/admin/orders" 
            className={`flex items-center gap-3 px-4 py-2 rounded-lg transition-colors ${
              isActive('/admin/orders') ? 'bg-indigo-600 text-white' : 'hover:bg-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            <ShoppingCart className="w-5 h-5" />
            <span>Orders</span>
          </Link>
          
          <Link 
            href="/admin/users" 
            className={`flex items-center gap-3 px-4 py-2 rounded-lg transition-colors ${
              isActive('/admin/users') ? 'bg-indigo-600 text-white' : 'hover:bg-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            <Users className="w-5 h-5" />
            <span>Users</span>
          </Link>
          
          <div className="pt-4 mt-4 border-t border-slate-800">
              <Link 
                href="/admin/settings" 
                className={`flex items-center gap-3 px-4 py-2 rounded-lg transition-colors ${
                  isActive('/admin/settings') ? 'bg-indigo-600 text-white' : 'hover:bg-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                <SettingsIcon className="w-5 h-5" />
                <span>Settings</span>
              </Link>
            
            <button 
              onClick={handleSignOut}
              className="flex w-full items-center gap-3 px-4 py-2 rounded-lg hover:bg-red-900/20 hover:text-red-400 transition-colors text-slate-400 mt-2"
            >
              <LogOut className="w-5 h-5" />
              <span>Sign Out</span>
            </button>
          </div>
        </nav>
        
        <div className="p-4 border-t border-slate-800 bg-slate-900/50">
          <div className="flex items-center gap-3 p-2 rounded-xl bg-slate-800/50">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-xs font-bold">
              {user?.email?.[0].toUpperCase() || "A"}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{user?.email?.split('@')[0]}</p>
              <p className="text-[10px] text-slate-500 truncate">Administrator</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        <header className="h-16 border-b border-slate-800 flex items-center justify-between px-8 bg-slate-900/50 sticky top-0 z-10 backdrop-blur-md">
          <h1 className="text-lg font-medium">
            {isActive('/admin/games') ? 'Games Management' : 
             isActive('/admin/orders') ? 'Orders Overview' :
             isActive('/admin/users') ? 'Users Management' :
             isActive('/admin/settings') ? 'System Settings' : 'Admin Dashboard'}
          </h1>
          <div className="flex items-center gap-4">
            <Link href="/" target="_blank" className="text-xs text-indigo-400 hover:text-indigo-300 font-medium px-3 py-1 rounded-full border border-indigo-500/20 bg-indigo-500/5 transition-all">
              View Website
            </Link>
          </div>
        </header>
        
        <div className="p-8">
          {children}
        </div>
      </main>
    </div>
  );
}
