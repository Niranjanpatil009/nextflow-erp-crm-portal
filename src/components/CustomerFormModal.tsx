import React, { useState, useEffect } from 'react';
import { Customer, CustomerType, CustomerStatus } from '../types';
import { X, Building2, Phone, Mail, MapPin, FileCheck, Calendar } from 'lucide-react';

interface CustomerFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => Promise<void>;
  initialData?: Customer | null;
}

export const CustomerFormModal: React.FC<CustomerFormModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  initialData,
}) => {
  const [formData, setFormData] = useState({
    name: '',
    mobile: '',
    email: '',
    businessName: '',
    gstNumber: '',
    customerType: 'Wholesale' as CustomerType,
    address: '',
    status: 'Lead' as CustomerStatus,
    followUpDate: '',
    notes: '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name || '',
        mobile: initialData.mobile || '',
        email: initialData.email || '',
        businessName: initialData.businessName || '',
        gstNumber: initialData.gstNumber || '',
        customerType: initialData.customerType || 'Wholesale',
        address: initialData.address || '',
        status: initialData.status || 'Lead',
        followUpDate: initialData.followUpDate || '',
        notes: initialData.notes || '',
      });
    } else {
      setFormData({
        name: '',
        mobile: '',
        email: '',
        businessName: '',
        gstNumber: '',
        customerType: 'Wholesale',
        address: '',
        status: 'Lead',
        followUpDate: new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0],
        notes: '',
      });
    }
    setError('');
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.mobile || !formData.businessName || !formData.address) {
      setError('Please fill in all required fields (Name, Mobile, Business Name, Address)');
      return;
    }

    setLoading(true);
    setError('');
    try {
      await onSubmit(formData);
      onClose();
    } catch (err: any) {
      setError(err.message || 'Failed to save customer details');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl text-slate-200">
        <div className="sticky top-0 bg-slate-900/95 backdrop-blur-md p-5 border-b border-slate-800 flex items-center justify-between z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">
                {initialData ? 'Edit Customer CRM Record' : 'Register New Customer'}
              </h3>
              <p className="text-xs text-slate-400">Enter customer business information and CRM details</p>
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
            <div>
              <label className="block text-slate-400 font-medium mb-1">
                Contact Person Name <span className="text-rose-400">*</span>
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={e => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g. Rajesh Agarwal"
                className="w-full bg-slate-800/80 border border-slate-700 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-indigo-500 text-xs sm:text-sm"
              />
            </div>

            <div>
              <label className="block text-slate-400 font-medium mb-1">
                Business / Enterprise Name <span className="text-rose-400">*</span>
              </label>
              <input
                type="text"
                required
                value={formData.businessName}
                onChange={e => setFormData({ ...formData, businessName: e.target.value })}
                placeholder="e.g. Apex Distributors Pvt Ltd"
                className="w-full bg-slate-800/80 border border-slate-700 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-indigo-500 text-xs sm:text-sm"
              />
            </div>

            <div>
              <label className="block text-slate-400 font-medium mb-1">
                Mobile Number <span className="text-rose-400">*</span>
              </label>
              <input
                type="text"
                required
                value={formData.mobile}
                onChange={e => setFormData({ ...formData, mobile: e.target.value })}
                placeholder="e.g. +91 98200 12345"
                className="w-full bg-slate-800/80 border border-slate-700 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-indigo-500 text-xs sm:text-sm"
              />
            </div>

            <div>
              <label className="block text-slate-400 font-medium mb-1">Email Address</label>
              <input
                type="email"
                value={formData.email}
                onChange={e => setFormData({ ...formData, email: e.target.value })}
                placeholder="e.g. rajesh@apex.com"
                className="w-full bg-slate-800/80 border border-slate-700 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-indigo-500 text-xs sm:text-sm"
              />
            </div>

            <div>
              <label className="block text-slate-400 font-medium mb-1">GST Identification Number (Optional)</label>
              <input
                type="text"
                value={formData.gstNumber}
                onChange={e => setFormData({ ...formData, gstNumber: e.target.value.toUpperCase() })}
                placeholder="e.g. 27AAACA123411Z5"
                className="w-full bg-slate-800/80 border border-slate-700 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-indigo-500 text-xs sm:text-sm font-mono"
              />
            </div>

            <div>
              <label className="block text-slate-400 font-medium mb-1">Customer Category / Type</label>
              <select
                value={formData.customerType}
                onChange={e => setFormData({ ...formData, customerType: e.target.value as CustomerType })}
                className="w-full bg-slate-800/80 border border-slate-700 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-indigo-500 text-xs sm:text-sm"
              >
                <option value="Wholesale">Wholesale</option>
                <option value="Distributor">Distributor</option>
                <option value="Retail">Retail</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-400 font-medium mb-1">CRM Lead Status</label>
              <select
                value={formData.status}
                onChange={e => setFormData({ ...formData, status: e.target.value as CustomerStatus })}
                className="w-full bg-slate-800/80 border border-slate-700 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-indigo-500 text-xs sm:text-sm"
              >
                <option value="Lead">Lead</option>
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-400 font-medium mb-1">Next Follow-Up Date</label>
              <input
                type="date"
                value={formData.followUpDate}
                onChange={e => setFormData({ ...formData, followUpDate: e.target.value })}
                className="w-full bg-slate-800/80 border border-slate-700 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-indigo-500 text-xs sm:text-sm"
              />
            </div>
          </div>

          <div>
            <label className="block text-slate-400 font-medium mb-1">
              Billing & Dispatch Address <span className="text-rose-400">*</span>
            </label>
            <textarea
              required
              rows={2}
              value={formData.address}
              onChange={e => setFormData({ ...formData, address: e.target.value })}
              placeholder="Full street address, city, state, pin code"
              className="w-full bg-slate-800/80 border border-slate-700 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-indigo-500 text-xs sm:text-sm resize-none"
            />
          </div>

          <div>
            <label className="block text-slate-400 font-medium mb-1">Initial CRM Notes / Remarks</label>
            <textarea
              rows={2}
              value={formData.notes}
              onChange={e => setFormData({ ...formData, notes: e.target.value })}
              placeholder="Additional client details, credit limits, or sales preferences"
              className="w-full bg-slate-800/80 border border-slate-700 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-indigo-500 text-xs sm:text-sm resize-none"
            />
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
              className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs sm:text-sm shadow-lg shadow-indigo-600/30 transition-all disabled:opacity-50"
            >
              {loading ? 'Saving...' : initialData ? 'Update Customer' : 'Save Customer'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
