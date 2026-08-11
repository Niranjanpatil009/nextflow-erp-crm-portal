import React, { useState } from 'react';
import { Customer, Product, User } from '../types';
import { X, FileText, Plus, Trash2, AlertTriangle, CheckCircle, Building2, Package } from 'lucide-react';

interface CreateChallanModalProps {
  isOpen: boolean;
  onClose: () => void;
  customers: Customer[];
  products: Product[];
  onSubmit: (data: {
    customerId: string;
    items: { productId: string; quantity: number }[];
    status: 'Draft' | 'Confirmed';
    notes?: string;
  }) => Promise<void>;
  currentUser: User;
}

export const CreateChallanModal: React.FC<CreateChallanModalProps> = ({
  isOpen,
  onClose,
  customers,
  products,
  onSubmit,
  currentUser,
}) => {
  const [selectedCustomerId, setSelectedCustomerId] = useState('');
  const [items, setItems] = useState<{ productId: string; quantity: number }[]>([
    { productId: '', quantity: 1 },
  ]);
  const [notes, setNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const selectedCustomer = customers.find(c => c.id === selectedCustomerId);

  const handleAddItem = () => {
    setItems([...items, { productId: '', quantity: 1 }]);
  };

  const handleRemoveItem = (index: number) => {
    if (items.length <= 1) return;
    setItems(items.filter((_, i) => i !== index));
  };

  const handleItemChange = (index: number, field: 'productId' | 'quantity', value: any) => {
    const updated = [...items];
    if (field === 'quantity') {
      updated[index].quantity = Math.max(1, parseInt(value) || 1);
    } else {
      updated[index].productId = value;
    }
    setItems(updated);
  };

  // Calculate Subtotals & Validate Stock Availability
  let grandTotal = 0;
  let totalQty = 0;
  let hasStockError = false;

  const itemDetails = items.map(item => {
    const prod = products.find(p => p.id === item.productId);
    const unitPrice = prod ? prod.unitPrice : 0;
    const subtotal = unitPrice * item.quantity;
    const isInsufficient = prod ? prod.currentStock < item.quantity : false;

    if (isInsufficient) hasStockError = true;

    grandTotal += subtotal;
    totalQty += item.quantity;

    return {
      ...item,
      product: prod,
      unitPrice,
      subtotal,
      isInsufficient,
    };
  });

  const handleSubmit = async (targetStatus: 'Draft' | 'Confirmed') => {
    if (!selectedCustomerId) {
      setError('Please select a customer for this sales challan');
      return;
    }

    if (items.some(i => !i.productId)) {
      setError('Please select a valid product for all line items');
      return;
    }

    if (targetStatus === 'Confirmed' && hasStockError) {
      setError('Cannot confirm challan: One or more products have insufficient stock!');
      return;
    }

    setSubmitting(true);
    setError('');
    try {
      await onSubmit({
        customerId: selectedCustomerId,
        items,
        status: targetStatus,
        notes,
      });
      onClose();
    } catch (err: any) {
      setError(err.message || 'Failed to generate sales challan');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-3xl max-h-[92vh] overflow-y-auto shadow-2xl text-slate-200">
        {/* Header */}
        <div className="sticky top-0 bg-slate-900/95 backdrop-blur-md p-5 border-b border-slate-800 flex items-center justify-between z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Generate Sales Challan</h3>
              <p className="text-xs text-slate-400">Select customer, line items, and issue draft or confirmed dispatch</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-5 text-xs sm:text-sm">
          {error && (
            <div className="p-3 bg-rose-500/10 border border-rose-500/30 text-rose-300 rounded-xl text-xs font-medium flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 shrink-0 text-rose-400" />
              {error}
            </div>
          )}

          {/* Customer Selection */}
          <div className="bg-slate-800/40 border border-slate-800 p-4 rounded-xl space-y-3">
            <label className="block text-slate-300 font-bold flex items-center gap-1.5">
              <Building2 className="w-4 h-4 text-indigo-400" />
              Select Customer <span className="text-rose-400">*</span>
            </label>
            <select
              value={selectedCustomerId}
              onChange={e => setSelectedCustomerId(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-indigo-500 text-xs sm:text-sm"
            >
              <option value="">-- Choose Customer --</option>
              {customers.map(c => (
                <option key={c.id} value={c.id}>
                  {c.businessName} ({c.name}) - {c.customerType}
                </option>
              ))}
            </select>

            {selectedCustomer && (
              <div className="text-xs text-slate-400 pt-1 space-y-1 bg-slate-900/60 p-3 rounded-lg border border-slate-800">
                <div className="font-semibold text-slate-200">{selectedCustomer.businessName}</div>
                <div>GSTIN: {selectedCustomer.gstNumber || 'N/A'} • Phone: {selectedCustomer.mobile}</div>
                <div>Address: {selectedCustomer.address}</div>
              </div>
            )}
          </div>

          {/* Line Items Picker Table */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="font-bold text-white flex items-center gap-1.5">
                <Package className="w-4 h-4 text-amber-400" />
                Line Items
              </h4>
              <button
                type="button"
                onClick={handleAddItem}
                className="px-3 py-1.5 rounded-lg bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 border border-indigo-500/30 text-xs font-semibold flex items-center gap-1 transition-colors"
              >
                <Plus className="w-3.5 h-3.5" /> Add Item
              </button>
            </div>

            <div className="space-y-2">
              {itemDetails.map((item, idx) => (
                <div
                  key={idx}
                  className={`p-3 rounded-xl border flex flex-col sm:flex-row items-stretch sm:items-center gap-3 transition-colors ${
                    item.isInsufficient
                      ? 'bg-rose-500/10 border-rose-500/30'
                      : 'bg-slate-800/40 border-slate-800'
                  }`}
                >
                  {/* Product Picker */}
                  <div className="flex-1 space-y-1">
                    <label className="text-[11px] font-medium text-slate-400">Product SKU</label>
                    <select
                      value={item.productId}
                      onChange={e => handleItemChange(idx, 'productId', e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-white focus:outline-none focus:border-indigo-500 text-xs"
                    >
                      <option value="">-- Choose Product --</option>
                      {products.map(p => (
                        <option key={p.id} value={p.id}>
                          {p.name} (SKU: {p.sku}) - Stock: {p.currentStock} - ₹{p.unitPrice}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Quantity Input */}
                  <div className="w-24 space-y-1">
                    <label className="text-[11px] font-medium text-slate-400">Quantity</label>
                    <input
                      type="number"
                      min="1"
                      value={item.quantity}
                      onChange={e => handleItemChange(idx, 'quantity', e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-white focus:outline-none focus:border-indigo-500 text-xs font-bold text-center"
                    />
                  </div>

                  {/* Subtotal */}
                  <div className="w-28 space-y-1 sm:text-right">
                    <label className="text-[11px] font-medium text-slate-400">Subtotal</label>
                    <div className="font-bold text-emerald-400 text-xs pt-1">
                      ₹{item.subtotal.toLocaleString('en-IN')}
                    </div>
                  </div>

                  {/* Stock Warning Badge / Delete Button */}
                  <div className="flex items-center justify-end gap-2 pt-2 sm:pt-4">
                    {item.isInsufficient && (
                      <span className="text-[10px] text-rose-400 font-bold bg-rose-500/20 px-2 py-1 rounded border border-rose-500/30">
                        Insuff. Stock!
                      </span>
                    )}

                    <button
                      type="button"
                      onClick={() => handleRemoveItem(idx)}
                      disabled={items.length <= 1}
                      className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-slate-800 disabled:opacity-30 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-slate-400 font-medium mb-1">Challan Instructions / Delivery Notes</label>
            <textarea
              rows={2}
              value={notes}
              onChange={e => setNotes(e.target.value)}
              placeholder="e.g. Handle with care, deliver during business hours"
              className="w-full bg-slate-800/80 border border-slate-700 rounded-xl px-3.5 py-2 text-white focus:outline-none focus:border-indigo-500 text-xs sm:text-sm resize-none"
            />
          </div>

          {/* Total Summary Footer */}
          <div className="bg-slate-800/60 border border-slate-700 p-4 rounded-xl flex items-center justify-between text-xs sm:text-sm">
            <div>
              <span className="text-slate-400">Total Products: </span>
              <span className="font-bold text-white">{items.length} items ({totalQty} pcs)</span>
            </div>
            <div>
              <span className="text-slate-400">Grand Total Amount: </span>
              <span className="text-lg font-extrabold text-emerald-400">
                ₹{grandTotal.toLocaleString('en-IN')}
              </span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium text-xs sm:text-sm transition-colors"
            >
              Cancel
            </button>

            <button
              type="button"
              disabled={submitting}
              onClick={() => handleSubmit('Draft')}
              className="px-5 py-2.5 rounded-xl bg-amber-600/80 hover:bg-amber-600 text-white font-semibold text-xs sm:text-sm border border-amber-500/30 transition-all disabled:opacity-50"
            >
              Save as Draft
            </button>

            <button
              type="button"
              disabled={submitting || hasStockError}
              onClick={() => handleSubmit('Confirmed')}
              className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs sm:text-sm shadow-lg shadow-emerald-600/30 transition-all disabled:opacity-50 flex items-center gap-1.5"
            >
              <CheckCircle className="w-4 h-4" />
              Confirm & Reduce Stock
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
