import { ShoppingCart, Package, Clock, CheckCircle2 } from "lucide-react";

export default function OrdersPage() {
  const orders = [
    { id: "ORD-7291", customer: "John Doe", game: "Cyberpunk 2077", amount: 29.99, status: "Completed", date: "2024-02-20" },
    { id: "ORD-7292", customer: "Alice Smith", game: "GTA V Premium", amount: 19.99, status: "Pending", date: "2024-02-21" },
    { id: "ORD-7293", customer: "Michael Brown", game: "Elden Ring", amount: 49.99, status: "Completed", date: "2024-02-21" },
    { id: "ORD-7294", customer: "Sarah Wilson", game: "Hogwarts Legacy", amount: 35.50, status: "Processing", date: "2024-02-21" },
  ];

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white">Orders Management</h2>
          <p className="text-slate-400 text-sm">Monitor and process customer game orders</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-indigo-500/10 flex items-center justify-center text-indigo-500">
            <Package className="w-6 h-6" />
          </div>
          <div>
            <p className="text-slate-500 text-sm">Total Orders</p>
            <h4 className="text-xl font-bold text-white">1,842</h4>
          </div>
        </div>
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-500">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <p className="text-slate-500 text-sm">Pending</p>
            <h4 className="text-xl font-bold text-white">12</h4>
          </div>
        </div>
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-500">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <p className="text-slate-500 text-sm">Completed</p>
            <h4 className="text-xl font-bold text-white">1,798</h4>
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-slate-800 bg-slate-900 overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-800/50">
                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-400">Order ID</th>
                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-400">Customer</th>
                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-400">Game</th>
                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-400">Amount</th>
                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-400">Status</th>
                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-400">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {orders.map((order) => (
                <tr key={order.id} className="hover:bg-slate-800/30 transition-colors">
                  <td className="px-6 py-4 font-mono text-sm text-indigo-400">{order.id}</td>
                  <td className="px-6 py-4 text-sm text-white font-medium">{order.customer}</td>
                  <td className="px-6 py-4 text-sm text-slate-300">{order.game}</td>
                  <td className="px-6 py-4 text-sm font-mono text-white">${order.amount.toFixed(2)}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                      order.status === 'Completed' ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20' :
                      order.status === 'Pending' ? 'bg-amber-500/10 text-amber-500 border border-amber-500/20' :
                      'bg-indigo-500/10 text-indigo-500 border border-indigo-500/20'
                    }`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-500">{order.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
