import React from 'react';
import { Product, User } from '../types';
import {
  Package,
  Search,
  Plus,
  AlertTriangle,
  Clock,
  Edit2,
  MapPin,
  Tag,
  DollarSign,
  Boxes,
} from 'lucide-react';

interface InventoryViewProps {
  products: Product[];
  currentUser: User;
  onOpenAddModal: () => void;
  onOpenEditModal: (product: Product) => void;
  onOpenStockLogs: () => void;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  categoryFilter: string;
  setCategoryFilter: (cat: string) => void;
  lowStockOnly: boolean;
  setLowStockOnly: (val: boolean) => void;
  categories: string[];
}

export const InventoryView: React.FC<InventoryViewProps> = ({
  products,
  currentUser,
  onOpenAddModal,
  onOpenEditModal,
  onOpenStockLogs,
  searchTerm,
  setSearchTerm,
  categoryFilter,
  setCategoryFilter,
  lowStockOnly,
  setLowStockOnly,
  categories,
}) => {
  return (
    <div className="space-y-6">
      {/* Header & Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-[#09090b] border border-[#27272a] p-6 rounded-2xl shadow-xl">
        <div>
          <h2 className="text-xl font-extrabold text-white flex items-center gap-2">
            <Package className="w-6 h-6 text-amber-400" />
            Product & Inventory Control
          </h2>
          <p className="text-xs text-zinc-400 mt-1">
            Real-time stock levels, SKU tracking, reorder alert limits, and bin locations
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={onOpenStockLogs}
            className="flex items-center gap-2 px-3.5 py-2 rounded-lg bg-[#18181b] hover:bg-[#27272a] text-zinc-300 text-xs font-semibold border border-[#27272a] transition-all"
          >
            <Clock className="w-3.5 h-3.5 text-amber-400" />
            View Stock Logs
          </button>

          {(currentUser.role === 'Admin' || currentUser.role === 'Warehouse') && (
            <button
              onClick={onOpenAddModal}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white text-black font-bold text-xs hover:bg-zinc-200 transition-all shadow-md"
            >
              <Plus className="w-3.5 h-3.5" />
              Add Product SKU
            </button>
          )}
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-4 gap-3 bg-[#09090b] border border-[#27272a] p-4 rounded-xl">
        {/* Search */}
        <div className="sm:col-span-2 relative">
          <Search className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            placeholder="Search by product name, SKU, or warehouse location..."
            className="w-full bg-[#18181b] border border-[#27272a] rounded-xl pl-10 pr-4 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-indigo-500"
          />
        </div>

        {/* Category Filter */}
        <div>
          <select
            value={categoryFilter}
            onChange={e => setCategoryFilter(e.target.value)}
            className="w-full bg-[#18181b] border border-[#27272a] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
          >
            <option value="ALL">All Categories</option>
            {categories.map(cat => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        {/* Low Stock Toggle Button */}
        <div>
          <button
            onClick={() => setLowStockOnly(!lowStockOnly)}
            className={`w-full py-2 px-3 rounded-xl border text-xs font-semibold transition-all flex items-center justify-center gap-2 ${
              lowStockOnly
                ? 'bg-amber-500/20 border-amber-500 text-amber-300 shadow-md shadow-amber-500/10'
                : 'bg-[#18181b] border-[#27272a] text-zinc-300 hover:text-white'
            }`}
          >
            <AlertTriangle className={`w-3.5 h-3.5 ${lowStockOnly ? 'text-amber-400' : 'text-zinc-500'}`} />
            {lowStockOnly ? 'Showing Low Stock Only' : 'Filter Low Stock Alerts'}
          </button>
        </div>
      </div>

      {/* Product List Table */}
      <div className="bg-[#09090b] border border-[#27272a] rounded-2xl shadow-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="bg-[#18181b] text-zinc-500 uppercase tracking-wider text-[10px] font-semibold border-b border-[#27272a]">
              <tr>
                <th className="p-4">SKU & Product Name</th>
                <th className="p-4">Category</th>
                <th className="p-4">Wholesale Price</th>
                <th className="p-4 text-center">On-Hand Stock</th>
                <th className="p-4">Warehouse Bin</th>
                <th className="p-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#27272a] text-zinc-300">
              {products.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center p-12 text-zinc-500">
                    No product SKUs found matching the filter criteria.
                  </td>
                </tr>
              ) : (
                products.map(prod => {
                  const isLowStock = prod.currentStock <= prod.minStockAlert;
                  return (
                    <tr key={prod.id} className="hover:bg-zinc-900/50 transition-colors">
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          {prod.imageUrl ? (
                            <img
                              src={prod.imageUrl}
                              alt={prod.name}
                              className="w-10 h-10 rounded-lg object-cover border border-[#27272a] shrink-0"
                            />
                          ) : (
                            <div className="w-10 h-10 rounded-lg bg-[#18181b] border border-[#27272a] flex items-center justify-center text-zinc-500 shrink-0">
                              <Package className="w-5 h-5" />
                            </div>
                          )}
                          <div>
                            <div className="font-bold text-white text-sm leading-snug">{prod.name}</div>
                            <div className="text-xs font-mono text-amber-400 mt-0.5">SKU: {prod.sku}</div>
                          </div>
                        </div>
                      </td>

                      <td className="p-4">
                        <span className="px-2.5 py-1 text-xs font-mono font-medium rounded-lg bg-[#18181b] text-zinc-300 border border-[#27272a] inline-flex items-center gap-1">
                          <Tag className="w-3 h-3 text-zinc-500" />
                          {prod.category}
                        </span>
                      </td>

                      <td className="p-4 font-mono font-bold text-emerald-400 text-sm">
                        ₹{prod.unitPrice.toLocaleString('en-IN')}
                      </td>

                      <td className="p-4 text-center">
                        <div className="inline-flex flex-col items-center">
                          <span
                            className={`px-2.5 py-0.5 text-xs font-mono font-bold rounded ${
                              isLowStock
                                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 animate-pulse'
                                : 'bg-[#18181b] text-zinc-200 border border-[#27272a]'
                            }`}
                          >
                            {prod.currentStock} pcs
                          </span>
                          <span className="text-[10px] text-zinc-500 font-mono mt-1">Min: {prod.minStockAlert}</span>
                        </div>
                      </td>

                      <td className="p-4 text-xs font-mono text-zinc-300">
                        <div className="flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                          {prod.location}
                        </div>
                      </td>

                      <td className="p-4">
                        <div className="flex items-center justify-center gap-2">
                          {(currentUser.role === 'Admin' || currentUser.role === 'Warehouse') && (
                            <button
                              onClick={() => onOpenEditModal(prod)}
                              className="px-3 py-1.5 rounded-lg bg-[#18181b] hover:bg-[#27272a] text-amber-300 border border-[#27272a] transition-colors flex items-center gap-1.5 text-xs font-semibold"
                              title="Edit Item or Adjust Stock"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                              Edit / Adjust
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
