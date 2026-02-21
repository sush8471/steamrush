import { 
  TrendingUp, 
  Package, 
  ShoppingCart, 
  Users, 
  DollarSign,
  Gamepad2,
  Settings as SettingsIcon,
  LogOut
} from "lucide-react";
import Link from "next/link";

export default function AdminDashboardPage() {
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 flex items-start justify-between">
          <div className="space-y-2">
            <p className="text-slate-400 text-sm">Total Revenue</p>
            <h3 className="text-2xl font-bold font-mono">$12,450.80</h3>
            <div className="flex items-center gap-1 text-emerald-400 text-xs font-medium">
              <TrendingUp className="w-3 h-3" />
              <span>+14.5% from last month</span>
            </div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-500">
            <DollarSign className="w-6 h-6" />
          </div>
        </div>
        
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 flex items-start justify-between">
          <div className="space-y-2">
            <p className="text-slate-400 text-sm">Total Games</p>
            <h3 className="text-2xl font-bold font-mono">236</h3>
            <div className="flex items-center gap-1 text-indigo-400 text-xs font-medium">
              <Gamepad2 className="w-3 h-3" />
              <span>Synced with Steam API</span>
            </div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-indigo-500/10 flex items-center justify-center text-indigo-500">
            <Package className="w-6 h-6" />
          </div>
        </div>
        
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 flex items-start justify-between">
          <div className="space-y-2">
            <p className="text-slate-400 text-sm">Total Orders</p>
            <h3 className="text-2xl font-bold font-mono">1,842</h3>
            <div className="flex items-center gap-1 text-emerald-400 text-xs font-medium">
              <TrendingUp className="w-3 h-3" />
              <span>+24.1% this week</span>
            </div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-500">
            <ShoppingCart className="w-6 h-6" />
          </div>
        </div>
        
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 flex items-start justify-between">
          <div className="space-y-2">
            <p className="text-slate-400 text-sm">Total Customers</p>
            <h3 className="text-2xl font-bold font-mono">4,120</h3>
            <div className="flex items-center gap-1 text-indigo-400 text-xs font-medium">
              <TrendingUp className="w-3 h-3" />
              <span>+8.2% conversion rate</span>
            </div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-500">
            <Users className="w-6 h-6" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="rounded-2xl bg-slate-900 border border-slate-800 overflow-hidden">
          <div className="p-6 border-b border-slate-800 flex items-center justify-between">
            <h4 className="font-semibold text-lg">Recent Orders</h4>
            <Link href="/admin/orders" className="text-sm text-indigo-400 hover:text-indigo-300 transition-colors">View all</Link>
          </div>
          <div className="p-0">
            <div className="w-full text-left">
              <div className="grid grid-cols-4 p-4 text-xs font-medium text-slate-500 border-b border-slate-800 uppercase tracking-wider">
                <span>Customer</span>
                <span>Game</span>
                <span>Amount</span>
                <span>Status</span>
              </div>
              <div className="space-y-px">
                <div className="grid grid-cols-4 p-4 text-sm hover:bg-slate-800/50 transition-colors border-b border-slate-800/50">
                  <span>John Doe</span>
                  <span className="truncate">Cyberpunk 2077</span>
                  <span className="font-mono">$29.99</span>
                  <span className="text-emerald-400">Completed</span>
                </div>
                <div className="grid grid-cols-4 p-4 text-sm hover:bg-slate-800/50 transition-colors border-b border-slate-800/50">
                  <span>Alice Smith</span>
                  <span className="truncate">GTA V Premium</span>
                  <span className="font-mono">$19.99</span>
                  <span className="text-amber-400">Pending</span>
                </div>
                <div className="grid grid-cols-4 p-4 text-sm hover:bg-slate-800/50 transition-colors border-b border-slate-800/50">
                  <span>Michael Brown</span>
                  <span className="truncate">Elden Ring</span>
                  <span className="font-mono">$49.99</span>
                  <span className="text-emerald-400">Completed</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-2xl bg-slate-900 border border-slate-800 overflow-hidden">
          <div className="p-6 border-b border-slate-800 flex items-center justify-between">
            <h4 className="font-semibold text-lg">Quick Actions</h4>
          </div>
          <div className="p-6 grid grid-cols-2 gap-4">
            <Link 
              href="/admin/games/new" 
              className="p-4 rounded-xl bg-slate-800 hover:bg-slate-700 transition-colors flex flex-col gap-2 items-center text-center group"
            >
              <div className="w-12 h-12 rounded-full bg-indigo-500/10 flex items-center justify-center text-indigo-500 group-hover:scale-110 transition-transform">
                <Package className="w-6 h-6" />
              </div>
              <span className="font-medium">Add New Game</span>
            </Link>
            
            <button 
              className="p-4 rounded-xl bg-slate-800 hover:bg-slate-700 transition-colors flex flex-col gap-2 items-center text-center group"
            >
              <div className="w-12 h-12 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-500 group-hover:scale-110 transition-transform">
                <TrendingUp className="w-6 h-6" />
              </div>
              <span className="font-medium">Run Promo Sync</span>
            </button>
            
            <Link 
              href="/admin/settings"
              className="p-4 rounded-xl bg-slate-800 hover:bg-slate-700 transition-colors flex flex-col gap-2 items-center text-center group"
            >
              <div className="w-12 h-12 rounded-full bg-amber-500/10 flex items-center justify-center text-amber-500 group-hover:scale-110 transition-transform">
                <SettingsIcon className="w-6 h-6" />
              </div>
              <span className="font-medium">Site Config</span>
            </Link>
            
            <button 
              className="p-4 rounded-xl bg-slate-800 hover:bg-slate-700 transition-colors flex flex-col gap-2 items-center text-center group"
            >
              <div className="w-12 h-12 rounded-full bg-red-500/10 flex items-center justify-center text-red-500 group-hover:scale-110 transition-transform">
                <LogOut className="w-6 h-6" />
              </div>
              <span className="font-medium">View Logs</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
