import { Settings, Shield, Bell, Globe, Database, Save, Palette } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function SettingsPage() {
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-4xl">
      <div>
        <h2 className="text-2xl font-bold text-white">System Settings</h2>
        <p className="text-slate-400 text-sm">Configure your store's global parameters and preferences</p>
      </div>

      <div className="grid grid-cols-1 gap-6">
        <section className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-6 shadow-xl">
          <div className="flex items-center gap-3 border-b border-slate-800 pb-4">
            <Globe className="w-5 h-5 text-indigo-400" />
            <h3 className="font-semibold text-lg text-white">General Store Settings</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-400">Store Name</label>
              <input 
                type="text" 
                defaultValue="SteamRush Digital Store"
                className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-white"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-400">Store URL</label>
              <input 
                type="text" 
                defaultValue="https://steamrush.com"
                className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-white"
              />
            </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-400">Default Currency</label>
                <select className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-white">
                  <option value="INR">INR (₹)</option>
                  <option value="USD">USD ($)</option>
                  <option value="EUR">EUR (€)</option>
                </select>
              </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-400">Support Email</label>
              <input 
                type="email" 
                defaultValue="support@steamrush.com"
                className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-white"
              />
            </div>
          </div>
        </section>

        <section className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-6 shadow-xl">
          <div className="flex items-center gap-3 border-b border-slate-800 pb-4">
            <Shield className="w-5 h-5 text-indigo-400" />
            <h3 className="font-semibold text-lg text-white">Security & Auth</h3>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 rounded-xl bg-slate-800/50">
              <div>
                <p className="font-medium text-white text-sm">Two-Factor Authentication</p>
                <p className="text-xs text-slate-500">Enable 2FA for all admin accounts</p>
              </div>
              <div className="w-12 h-6 rounded-full bg-slate-700 relative cursor-pointer">
                <div className="absolute left-1 top-1 w-4 h-4 rounded-full bg-slate-400" />
              </div>
            </div>
            <div className="flex items-center justify-between p-4 rounded-xl bg-slate-800/50">
              <div>
                <p className="font-medium text-white text-sm">IP Whitelisting</p>
                <p className="text-xs text-slate-500">Only allow admin access from specific IPs</p>
              </div>
              <div className="w-12 h-6 rounded-full bg-indigo-600 relative cursor-pointer">
                <div className="absolute right-1 top-1 w-4 h-4 rounded-full bg-white" />
              </div>
            </div>
          </div>
        </section>

        <section className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-6 shadow-xl">
          <div className="flex items-center gap-3 border-b border-slate-800 pb-4">
            <Palette className="w-5 h-5 text-indigo-400" />
            <h3 className="font-semibold text-lg text-white">Appearance Settings</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-400">Primary Color</label>
              <div className="flex gap-2">
                <div className="w-10 h-10 rounded-lg bg-indigo-600 border border-slate-700" />
                <input 
                  type="text" 
                  defaultValue="#6366f1"
                  className="flex-1 px-4 py-2 bg-slate-800 border border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-white font-mono"
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-400">Dark Mode</label>
              <select className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-white">
                <option value="always">Always Dark</option>
                <option value="system">System Default</option>
                <option value="light">Always Light</option>
              </select>
            </div>
          </div>
        </section>

        <div className="flex justify-end gap-3 pt-4">
          <Button variant="ghost" className="px-8 rounded-xl">Discard Changes</Button>
          <Button className="bg-indigo-600 hover:bg-indigo-500 px-8 rounded-xl font-bold flex items-center gap-2">
            <Save className="w-4 h-4" />
            Save Settings
          </Button>
        </div>
      </div>
    </div>
  );
}
