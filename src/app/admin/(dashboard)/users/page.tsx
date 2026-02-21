import { Users, UserCheck, UserPlus, Mail } from "lucide-react";

export default function UsersPage() {
  const users = [
    { id: "USR-001", name: "John Doe", email: "john@example.com", role: "Admin", status: "Active", date: "2024-01-10" },
    { id: "USR-002", name: "Alice Smith", email: "alice@example.com", role: "Customer", status: "Active", date: "2024-01-15" },
    { id: "USR-003", name: "Michael Brown", email: "michael@example.com", role: "Customer", status: "Inactive", date: "2024-01-20" },
    { id: "USR-004", name: "Sarah Wilson", email: "sarah@example.com", role: "Customer", status: "Active", date: "2024-02-05" },
  ];

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white">Users Management</h2>
          <p className="text-slate-400 text-sm">Manage user roles and store account access</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-indigo-500/10 flex items-center justify-center text-indigo-500">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <p className="text-slate-500 text-sm">Total Users</p>
            <h4 className="text-xl font-bold text-white">4,120</h4>
          </div>
        </div>
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-500">
            <UserCheck className="w-6 h-6" />
          </div>
          <div>
            <p className="text-slate-500 text-sm">Active Now</p>
            <h4 className="text-xl font-bold text-white">842</h4>
          </div>
        </div>
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-500">
            <UserPlus className="w-6 h-6" />
          </div>
          <div>
            <p className="text-slate-500 text-sm">New This Month</p>
            <h4 className="text-xl font-bold text-white">325</h4>
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-slate-800 bg-slate-900 overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-800/50">
                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-400">User</th>
                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-400">Role</th>
                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-400">Status</th>
                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-400">Joined Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {users.map((user) => (
                <tr key={user.id} className="hover:bg-slate-800/30 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-xs font-bold text-indigo-400">
                        {user.name[0]}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-white">{user.name}</p>
                        <p className="text-xs text-slate-500">{user.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                      user.role === 'Admin' ? 'bg-indigo-500/10 text-indigo-500 border border-indigo-500/20' :
                      'bg-slate-800 text-slate-400 border border-slate-700'
                    }`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <span className={`flex items-center gap-1.5 ${
                      user.status === 'Active' ? 'text-emerald-500' : 'text-slate-500'
                    }`}>
                      <div className={`w-1.5 h-1.5 rounded-full ${
                        user.status === 'Active' ? 'bg-emerald-500' : 'bg-slate-500'
                      }`} />
                      {user.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-500 font-mono">{user.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
