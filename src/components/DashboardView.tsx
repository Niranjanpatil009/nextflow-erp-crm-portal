import React from 'react';
import { SystemStats, User, SalesChallan, Product } from '../types';
import {
  Users,
  Package,
  FileText,
  TrendingUp,
  AlertTriangle,
  Plus,
  ArrowRight,
  CheckCircle2,
  Clock,
  DollarSign,
  ShieldAlert,
  Boxes,
} from 'lucide-react';

interface DashboardViewProps {
  currentUser: User;
  stats: SystemStats | null;
  recentChallans: SalesChallan[];
  lowStockProducts: Product[];
  onNavigate: (tab: string) => void;
  onCreateChallan: () => void;
  onAddCustomer: () => void;
  onAddProduct: () => void;
  onOpenStockLogs: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  currentUser,
  stats,
  recentChallans,
  lowStockProducts,
  onNavigate,
  onCreateChallan,
  onAddCustomer,
  onAddProduct,
  onOpenStockLogs,
}) => {
  return (
    <div className="space-y-6">
      {/* Bento Header / Hero Banner */}
      <div className="bg-[#09090b] border border-[#27272a] rounded-2xl p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 hover:border-indigo-500/40 transition-colors">
        <div className="space-y-2 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 text-[10px] font-mono uppercase tracking-widest font-bold">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            OPERATIONAL NODE ACTIVE • {currentUser.role} PRIVILEGES
          </div>
          <h1 className="text-2xl sm:text-3xl font-medium tracking-tight text-white">
            Welcome back, <span className="font-bold text-indigo-400">{currentUser.name}</span>
          </h1>
          <p className="text-xs text-zinc-400 leading-relaxed">
            {currentUser.role === 'Admin' &&
              'System-wide operational overview: CRM leads pipeline, warehouse stock telemetry, and sales delivery challans.'}
            {currentUser.role === 'Sales' &&
              'Active CRM customer interactions, pipeline follow-ups, and sales delivery challan generation.'}
            {currentUser.role === 'Warehouse' &&
              'Live product SKU inventory levels, stock movement audit trails, and warehouse dispatches.'}
            {currentUser.role === 'Accounts' &&
              'Pending sales challan authorizations, GST billing verifications, and financial logs.'}
          </p>
        </div>

        {/* Quick Action Buttons */}
        <div className="flex flex-wrap items-center gap-2.5">
          {(currentUser.role === 'Admin' || currentUser.role === 'Sales') && (
            <button
              onClick={onAddCustomer}
              className="flex items-center gap-2 px-3.5 py-2 rounded-lg bg-[#18181b] hover:bg-[#27272a] text-zinc-200 font-semibold text-xs border border-[#27272a] transition-all"
            >
              <Plus className="w-3.5 h-3.5 text-blue-400" />
              Add Customer
            </button>
          )}

          {(currentUser.role === 'Admin' || currentUser.role === 'Sales') && (
            <button
              onClick={onCreateChallan}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white text-black font-bold text-xs hover:bg-zinc-200 transition-all shadow-md"
            >
              <FileText className="w-3.5 h-3.5" />
              + New Challan
            </button>
          )}

          {(currentUser.role === 'Admin' || currentUser.role === 'Warehouse') && (
            <button
              onClick={onAddProduct}
              className="flex items-center gap-2 px-3.5 py-2 rounded-lg bg-[#18181b] hover:bg-[#27272a] text-zinc-200 font-semibold text-xs border border-[#27272a] transition-all"
            >
              <Boxes className="w-3.5 h-3.5 text-emerald-400" />
              New SKU
            </button>
          )}

          <button
            onClick={onOpenStockLogs}
            className="flex items-center gap-2 px-3.5 py-2 rounded-lg bg-[#18181b] hover:bg-[#27272a] text-zinc-300 text-xs font-semibold border border-[#27272a] transition-all"
          >
            <Clock className="w-3.5 h-3.5 text-amber-400" />
            Stock Logs
          </button>
        </div>
      </div>

      {/* Bento Grid layout - 12 Column Architecture */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
        {/* Bento Box 1: Inventory Status */}
        <div
          onClick={() => onNavigate('inventory')}
          className="md:col-span-3 bg-[#09090b] border border-[#27272a] rounded-xl p-5 flex flex-col justify-between hover:border-indigo-500/50 transition-colors cursor-pointer group"
        >
          <div>
            <p className="text-[10px] uppercase tracking-widest text-zinc-500 font-bold mb-1">
              Inventory Telemetry
            </p>
            <h2 className="text-3xl sm:text-4xl font-light font-mono text-zinc-100 mt-2">
              {stats?.totalProducts || 0}
            </h2>
            <p className="text-xs text-zinc-400 mt-1">Total Active SKUs</p>
          </div>
          <div className="flex items-center gap-2 text-xs text-amber-400 mt-4">
            <span className="px-2 py-0.5 bg-amber-500/10 rounded font-mono text-[11px] border border-amber-500/20">
              {stats?.lowStockCount || 0} Low Stock Alerts
            </span>
          </div>
        </div>

        {/* Bento Box 2: CRM Pipeline */}
        <div
          onClick={() => onNavigate('customers')}
          className="md:col-span-3 bg-[#09090b] border border-[#27272a] rounded-xl p-5 flex flex-col justify-between hover:border-indigo-500/50 transition-colors cursor-pointer group"
        >
          <div>
            <p className="text-[10px] uppercase tracking-widest text-zinc-500 font-bold mb-1">
              CRM Pipeline
            </p>
            <h2 className="text-3xl sm:text-4xl font-light font-mono text-zinc-100 mt-2">
              {stats?.totalCustomers || 0}
            </h2>
            <p className="text-xs text-zinc-400 mt-1">Customer Accounts</p>
          </div>
          <div className="flex items-center gap-2 text-xs text-emerald-400 mt-4">
            <span className="px-2 py-0.5 bg-emerald-500/10 rounded font-mono text-[11px] border border-emerald-500/20">
              {stats?.activeLeads || 0} Active Leads
            </span>
          </div>
        </div>

        {/* Bento Box 3: Revenue & Confirmed Challans */}
        <div className="md:col-span-3 bg-[#09090b] border border-[#27272a] rounded-xl p-5 flex flex-col justify-between hover:border-indigo-500/50 transition-colors">
          <div>
            <p className="text-[10px] uppercase tracking-widest text-zinc-500 font-bold mb-1">
              Confirmed Sales Volume
            </p>
            <h2 className="text-2xl sm:text-3xl font-light font-mono text-indigo-400 mt-2 truncate">
              ₹{(stats?.totalSalesValue || 0).toLocaleString('en-IN')}
            </h2>
            <p className="text-xs text-zinc-400 mt-1">Confirmed Revenue</p>
          </div>
          <div className="flex items-center gap-2 text-xs text-indigo-300 mt-4">
            <span className="px-2 py-0.5 bg-indigo-500/10 rounded font-mono text-[11px] border border-indigo-500/20">
              {stats?.confirmedChallans || 0} Confirmed Challans
            </span>
          </div>
        </div>

        {/* Bento Box 4: Inventory Valuation */}
        <div className="md:col-span-3 bg-[#09090b] border border-[#27272a] rounded-xl p-5 flex flex-col justify-between hover:border-indigo-500/50 transition-colors">
          <div>
            <p className="text-[10px] uppercase tracking-widest text-zinc-500 font-bold mb-1">
              Warehouse Asset Valuation
            </p>
            <h2 className="text-2xl sm:text-3xl font-light font-mono text-emerald-400 mt-2 truncate">
              ₹{(stats?.inventoryValuation || 0).toLocaleString('en-IN')}
            </h2>
            <p className="text-xs text-zinc-400 mt-1">Total Stock Asset Value</p>
          </div>
          <div className="flex items-center gap-2 text-xs text-zinc-400 mt-4">
            <span className="px-2 py-0.5 bg-zinc-800 rounded font-mono text-[11px] text-zinc-300">
              Valuation Real-Time
            </span>
          </div>
        </div>

        {/* Bento Box 5: Active Sales Challans Table (8 Cols) */}
        <div className="md:col-span-8 bg-[#09090b] border border-[#27272a] rounded-xl overflow-hidden flex flex-col hover:border-indigo-500/30 transition-colors">
          <div className="p-4 border-b border-[#27272a] flex justify-between items-center bg-[#18181b]/40">
            <div className="flex items-center gap-2">
              <FileText className="w-4 h-4 text-indigo-400" />
              <span className="text-xs font-bold uppercase tracking-widest text-zinc-300">
                Active Sales Challans
              </span>
            </div>
            <button
              onClick={() => onNavigate('challans')}
              className="text-[10px] font-mono text-indigo-400 hover:text-indigo-300 uppercase tracking-wider flex items-center gap-1"
            >
              VIEW ALL <ArrowRight className="w-3 h-3" />
            </button>
          </div>

          <div className="flex-1 overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#18181b] text-zinc-500 uppercase text-[10px] tracking-wider font-semibold">
                <tr>
                  <th className="p-3.5 border-b border-[#27272a]">Challan No.</th>
                  <th className="p-3.5 border-b border-[#27272a]">Customer</th>
                  <th className="p-3.5 border-b border-[#27272a]">Quantity</th>
                  <th className="p-3.5 border-b border-[#27272a] text-right">Total (₹)</th>
                  <th className="p-3.5 border-b border-[#27272a] text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#27272a] text-zinc-300 font-sans">
                {recentChallans.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="text-center p-8 text-zinc-500 text-xs">
                      No sales challans recorded.
                    </td>
                  </tr>
                ) : (
                  recentChallans.slice(0, 5).map(ch => (
                    <tr key={ch.id} className="hover:bg-zinc-900/50 transition-colors">
                      <td className="p-3.5 font-mono text-indigo-400 font-semibold">{ch.challanNumber}</td>
                      <td className="p-3.5">
                        <div className="font-semibold text-zinc-200">{ch.customerBusiness}</div>
                        <div className="text-[10px] text-zinc-500">{ch.customerName}</div>
                      </td>
                      <td className="p-3.5 text-zinc-400 font-mono text-[11px]">
                        {ch.totalQuantity} pcs ({ch.items.length} items)
                      </td>
                      <td className="p-3.5 text-right font-mono font-bold text-emerald-400">
                        ₹{ch.totalAmount.toLocaleString('en-IN')}
                      </td>
                      <td className="p-3.5 text-center">
                        <span
                          className={`px-2 py-0.5 text-[10px] font-mono font-bold rounded uppercase ${
                            ch.status === 'Confirmed'
                              ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                              : ch.status === 'Draft'
                              ? 'bg-zinc-500/20 text-zinc-400 border border-zinc-500/30'
                              : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                          }`}
                        >
                          {ch.status}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Bento Box 6: Critical Stock Alerts Sidebar (4 Cols) */}
        <div className="md:col-span-4 bg-[#09090b] border border-[#27272a] rounded-xl p-5 flex flex-col justify-between hover:border-indigo-500/30 transition-colors">
          <div>
            <div className="flex items-center justify-between mb-3 border-b border-[#27272a] pb-2">
              <p className="text-[10px] uppercase tracking-widest text-zinc-500 font-bold flex items-center gap-1">
                <ShieldAlert className="w-3.5 h-3.5 text-amber-400" />
                Critical Stock Alerts
              </p>
              <span className="text-[10px] font-mono bg-amber-500/10 text-amber-400 px-2 py-0.5 rounded border border-amber-500/20">
                {lowStockProducts.length} Items
              </span>
            </div>

            <div className="space-y-2.5 max-h-[220px] overflow-y-auto pr-1">
              {lowStockProducts.length === 0 ? (
                <div className="text-center py-6 text-zinc-500 text-xs">
                  <CheckCircle2 className="w-6 h-6 text-emerald-500 mx-auto mb-1 opacity-70" />
                  All stock thresholds optimum
                </div>
              ) : (
                lowStockProducts.map(p => (
                  <div
                    key={p.id}
                    className="flex items-center justify-between p-2.5 bg-[#18181b]/60 border border-[#27272a] rounded-lg"
                  >
                    <div>
                      <p className="text-xs font-semibold text-zinc-200">{p.name}</p>
                      <p className="text-[10px] font-mono text-zinc-500">SKU: {p.sku}</p>
                    </div>
                    <p className="text-xs font-mono font-bold text-rose-400">
                      {p.currentStock} left
                    </p>
                  </div>
                ))
              )}
            </div>
          </div>

          <button
            onClick={() => onNavigate('inventory')}
            className="w-full mt-4 py-2 bg-[#18181b] hover:bg-[#27272a] border border-[#27272a] text-zinc-300 rounded-lg text-xs font-mono text-center transition-all"
          >
            MANAGE INVENTORY →
          </button>
        </div>

        {/* Bento Box 7: System Telemetry Visualization (4 Cols) */}
        <div className="md:col-span-4 bg-[#18181b]/50 border border-indigo-500/30 rounded-xl p-5 flex flex-col justify-between">
          <div>
            <p className="text-[10px] uppercase tracking-widest text-indigo-400 font-bold mb-2">
              System Telemetry & Operations Volume
            </p>
            <div className="h-20 flex items-end gap-1.5 pt-2">
              <div className="flex-1 bg-indigo-500/20 h-[50%] rounded-t-sm" />
              <div className="flex-1 bg-indigo-500/20 h-[75%] rounded-t-sm" />
              <div className="flex-1 bg-indigo-500/20 h-[40%] rounded-t-sm" />
              <div className="flex-1 bg-indigo-500/30 h-[85%] rounded-t-sm" />
              <div className="flex-1 bg-indigo-500/20 h-[65%] rounded-t-sm" />
              <div className="flex-1 bg-indigo-500 h-[95%] rounded-t-sm shadow-sm shadow-indigo-500" />
              <div className="flex-1 bg-indigo-500/20 h-[60%] rounded-t-sm" />
              <div className="flex-1 bg-indigo-500/20 h-[70%] rounded-t-sm" />
            </div>
            <p className="text-[10px] text-zinc-500 mt-2 text-center font-mono">
              7-Day ERP API Request Volume
            </p>
          </div>
        </div>

        {/* Bento Box 8: Recent Stock Audit Trail Console (8 Cols) */}
        <div className="md:col-span-8 bg-[#09090b] border border-[#27272a] rounded-xl p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2 pb-2 border-b border-[#27272a]">
            <span className="text-[10px] uppercase tracking-widest text-zinc-400 font-bold flex items-center gap-2">
              <Clock className="w-3.5 h-3.5 text-indigo-400" />
              Real-time Stock Movement Logs
            </span>
            <button
              onClick={onOpenStockLogs}
              className="text-[10px] text-zinc-400 font-mono hover:text-white uppercase tracking-wider"
            >
              LOG_VIEWER_v2.4 →
            </button>
          </div>

          <div className="font-mono text-[11px] leading-relaxed space-y-1.5 text-zinc-400 bg-[#000000]/60 p-3 rounded-lg border border-[#27272a]">
            <p>
              <span className="text-emerald-400">[IN]</span> +200 - Graphic Card RTX (SKU: GFX-3060) by WHSE_ADMIN
            </p>
            <p>
              <span className="text-rose-400">[OUT]</span> -15 - SSD 1TB NVMe (SKU: SSD-S1TB) for Challan SCH-2026-0001
            </p>
            <p>
              <span className="text-emerald-400">[IN]</span> +500 - RAM 16GB DDR5 (SKU: RAM-16D5) by ALEX_H
            </p>
            <p>
              <span className="text-indigo-400">[SYS]</span> Inventory Database Snapshot synchronized with Cloud Storage
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
