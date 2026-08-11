import React, { useState, useEffect } from 'react';
import { Product } from '../types';
import { X, Package, DollarSign, Layers, MapPin, AlertTriangle, Image as ImageIcon } from 'lucide-react';

interface ProductFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => Promise<void>;
  initialData?: Product | null;
}

export const ProductFormModal: React.FC<ProductFormModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  initialData,
}) => {
  const [formData, setFormData] = useState({
    name: '',
    sku: '',
    category: 'Power Tools',
    unitPrice: 1000,
    currentStock: 10,
    minStockAlert: 10,
    location: 'Warehouse A',
    imageUrl: '',
    reason: 'Product Master Registration',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name || '',
        sku: initialData.sku || '',
        category: initialData.category || 'Power Tools',
        unitPrice: initialData.unitPrice || 0,
        currentStock: initialData.currentStock || 0,
        minStockAlert: initialData.minStockAlert || 10,
        location: initialData.location || 'Warehouse A',
        imageUrl: initialData.imageUrl || '',
        reason: 'Manual Inventory Adjustment',
      });
    } else {
      setFormData({
        name: '',
        sku: '',
        category: 'Power Tools',
        unitPrice: 1500,
        currentStock: 25,
        minStockAlert: 10,
        location: 'Warehouse A - Bin 01',
        imageUrl: '',
        reason: 'Initial Product Registration Stock',
      });
    }
    setError('');
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.sku || !formData.category || formData.unitPrice < 0) {
      setError('Please provide valid product name, SKU, category, and positive unit price');
      return;
    }

    setLoading(true);
    setError('');
    try {
      await onSubmit(formData);
      onClose();
    } catch (err: any) {
      setError(err.message || 'Failed to save product');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl text-slate-200">
        <div className="sticky top-0 bg-slate-900/95 backdrop-blur-md p-5 border-b border-slate-800 flex items-center justify-between z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
              <Package className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">
                {initialData ? 'Edit Product & Adjust Inventory' : 'Add New Inventory SKU'}
              </h3>
              <p className="text-xs text-slate-400">Manage item pricing, stock levels, and warehouse bin location</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs sm:text-sm">
          {error && (
            <div className="p-3 bg-rose-500/10 border border-rose-500/30 text-rose-300 rounded-xl text-xs font-medium">
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-slate-400 font-medium mb-1">
                Product Name <span className="text-rose-400">*</span>
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={e => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g. Industrial Heavy-Duty Power Drill 850W"
                className="w-full bg-slate-800/80 border border-slate-700 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-amber-500 text-xs sm:text-sm"
              />
            </div>

            <div>
              <label className="block text-slate-400 font-medium mb-1">
                SKU / Item Code <span className="text-rose-400">*</span>
              </label>
              <input
                type="text"
                required
                value={formData.sku}
                onChange={e => setFormData({ ...formData, sku: e.target.value.toUpperCase() })}
                placeholder="e.g. PWR-DRL-850"
                className="w-full bg-slate-800/80 border border-slate-700 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-amber-500 text-xs sm:text-sm font-mono"
              />
            </div>

            <div>
              <label className="block text-slate-400 font-medium mb-1">Category</label>
              <input
                type="text"
                required
                value={formData.category}
                onChange={e => setFormData({ ...formData, category: e.target.value })}
                placeholder="e.g. Power Tools, Electrical Wiring"
                className="w-full bg-slate-800/80 border border-slate-700 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-amber-500 text-xs sm:text-sm"
              />
            </div>

            <div>
              <label className="block text-slate-400 font-medium mb-1">
                Unit Wholesale Price (₹) <span className="text-rose-400">*</span>
              </label>
              <input
                type="number"
                min="0"
                step="0.01"
                required
                value={formData.unitPrice}
                onChange={e => setFormData({ ...formData, unitPrice: parseFloat(e.target.value) || 0 })}
                className="w-full bg-slate-800/80 border border-slate-700 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-amber-500 text-xs sm:text-sm font-semibold text-emerald-400"
              />
            </div>

            <div>
              <label className="block text-slate-400 font-medium mb-1">Current On-Hand Stock</label>
              <input
                type="number"
                min="0"
                required
                value={formData.currentStock}
                onChange={e => setFormData({ ...formData, currentStock: parseInt(e.target.value) || 0 })}
                className="w-full bg-slate-800/80 border border-slate-700 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-amber-500 text-xs sm:text-sm font-bold"
              />
            </div>

            <div>
              <label className="block text-slate-400 font-medium mb-1">Min Stock Alert Threshold</label>
              <input
                type="number"
                min="0"
                required
                value={formData.minStockAlert}
                onChange={e => setFormData({ ...formData, minStockAlert: parseInt(e.target.value) || 0 })}
                className="w-full bg-slate-800/80 border border-slate-700 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-amber-500 text-xs sm:text-sm"
              />
            </div>

            <div>
              <label className="block text-slate-400 font-medium mb-1">Warehouse / Storage Bin Location</label>
              <input
                type="text"
                value={formData.location}
                onChange={e => setFormData({ ...formData, location: e.target.value })}
                placeholder="e.g. Warehouse A - Rack 04"
                className="w-full bg-slate-800/80 border border-slate-700 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-amber-500 text-xs sm:text-sm"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-slate-400 font-medium mb-1">Product Image URL (Optional)</label>
              <input
                type="url"
                value={formData.imageUrl}
                onChange={e => setFormData({ ...formData, imageUrl: e.target.value })}
                placeholder="https://images.unsplash.com/..."
                className="w-full bg-slate-800/80 border border-slate-700 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-amber-500 text-xs sm:text-sm"
              />
            </div>

            {initialData && (
              <div className="sm:col-span-2">
                <label className="block text-amber-400 font-medium mb-1">Stock Adjustment Reason (Logged for Audit)</label>
                <input
                  type="text"
                  value={formData.reason}
                  onChange={e => setFormData({ ...formData, reason: e.target.value })}
                  placeholder="e.g. Physical inventory count correction, supplier shipment received"
                  className="w-full bg-slate-800/80 border border-amber-500/40 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-amber-500 text-xs sm:text-sm"
                />
              </div>
            )}
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium text-xs sm:text-sm transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-semibold text-xs sm:text-sm shadow-lg shadow-amber-600/30 transition-all disabled:opacity-50"
            >
              {loading ? 'Saving...' : initialData ? 'Update Stock & Item' : 'Register Product SKU'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
