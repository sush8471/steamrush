import Link from "next/link";
import { 
  LayoutDashboard, 
  Gamepad2, 
  Settings, 
  LogOut,
  Package,
  ShoppingCart,
  Users
} from "lucide-react";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen bg-slate-950 text-white">
      {/* Sidebar */}
      <aside className="w-64 border-r border-slate-800 bg-slate-900/50 backdrop-blur-xl">
        <div className="flex h-16 items-center border-b border-slate-800 px-6">
          <Link href="/admin" className="flex items-center gap-2 font-bold text-xl">
            <Gamepad2 className="w-6 h-6 text-indigo-500" />
            <span>SteamRush <span className="text-indigo-500">Admin</span></span>
          </Link>
        </div>
        
        <nav className="p-4 space-y-2">
          <Link 
            href="/admin" 
            className="flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-slate-800 transition-colors"
          >
            <LayoutDashboard className="w-5 h-5 text-slate-400" />
            <span>Dashboard</span>
          </Link>
          
          <Link 
            href="/admin/games" 
            className="flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-slate-800 transition-colors bg-slate-800/50"
          >
            <Package className="w-5 h-5 text-indigo-400" />
            <span>Games Manager</span>
          </Link>
          
          <Link 
            href="/admin/orders" 
            className="flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-slate-800 transition-colors"
          >
            <ShoppingCart className="w-5 h-5 text-slate-400" />
            <span>Orders</span>
          </Link>
          
          <Link 
            href="/admin/users" 
            className="flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-slate-800 transition-colors"
          >
            <Users className="w-5 h-5 text-slate-400" />
            <span>Users</span>
          </Link>
          
          <div className="pt-4 mt-4 border-t border-slate-800">
            <Link 
              href="/admin/settings" 
              className="flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-slate-800 transition-colors"
            >
              <Settings className="w-5 h-5 text-slate-400" />
              <span>Settings</span>
            </Link>
            
            <button 
              className="flex w-full items-center gap-3 px-4 py-2 rounded-lg hover:bg-red-900/20 hover:text-red-400 transition-colors"
            >
              <LogOut className="w-5 h-5" />
              <span>Sign Out</span>
            </button>
          </div>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        <header className="h-16 border-b border-slate-800 flex items-center justify-between px-8 bg-slate-900/50 sticky top-0 z-10">
          <h1 className="text-lg font-medium">Dashboard</h1>
          <div className="flex items-center gap-4">
            <div className="text-sm text-slate-400 italic">Welcome, Admin</div>
            <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center text-xs font-bold">AD</div>
          </div>
        </header>
        
        <div className="p-8">
          {children}
        </div>
      </main>
    </div>
  );
}
