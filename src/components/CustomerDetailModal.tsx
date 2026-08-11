import React, { useState } from 'react';
import { Customer, User } from '../types';
import {
  X,
  Building2,
  Phone,
  Mail,
  MapPin,
  Calendar,
  Plus,
  Clock,
  UserCheck,
  FileText,
  MessageSquare,
} from 'lucide-react';

interface CustomerDetailModalProps {
  customer: Customer | null;
  isOpen: boolean;
  onClose: () => void;
  onAddFollowUp: (customerId: string, note: string, nextFollowUpDate?: string) => Promise<void>;
  currentUser: User;
}

export const CustomerDetailModal: React.FC<CustomerDetailModalProps> = ({
  customer,
  isOpen,
  onClose,
  onAddFollowUp,
  currentUser,
}) => {
  const [newNote, setNewNote] = useState('');
  const [nextDate, setNextDate] = useState('');
  const [submitting, setSubmitting] = useState(false);

  if (!isOpen || !customer) return null;

  const handleFollowUpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNote.trim()) return;

    setSubmitting(true);
    try {
      await onAddFollowUp(customer.id, newNote.trim(), nextDate || undefined);
      setNewNote('');
      setNextDate('');
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto shadow-2xl text-slate-200">
        {/* Header */}
        <div className="sticky top-0 bg-slate-900/95 backdrop-blur-md p-6 border-b border-slate-800 flex items-start justify-between z-10">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white font-bold text-xl shadow-lg">
              {customer.businessName.charAt(0)}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-extrabold text-white">{customer.businessName}</h2>
                <span
                  className={`px-2.5 py-0.5 text-[10px] font-bold rounded-full ${
                    customer.status === 'Active'
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                      : customer.status === 'Lead'
                      ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                      : 'bg-slate-700 text-slate-300'
                  }`}
                >
                  {customer.status}
                </span>
                <span className="px-2 py-0.5 text-[10px] font-medium rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                  {customer.customerType}
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">Contact: {customer.name}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6 text-xs sm:text-sm">
          {/* Key Details Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 bg-slate-800/40 border border-slate-800 p-4 rounded-xl">
            <div className="space-y-1">
              <span className="text-slate-400 font-medium flex items-center gap-1">
                <Phone className="w-3.5 h-3.5 text-blue-400" /> Phone
              </span>
              <p className="font-semibold text-slate-200">{customer.mobile}</p>
            </div>

            <div className="space-y-1">
              <span className="text-slate-400 font-medium flex items-center gap-1">
                <Mail className="w-3.5 h-3.5 text-indigo-400" /> Email
              </span>
              <p className="font-semibold text-slate-200">{customer.email || 'N/A'}</p>
            </div>

            <div className="space-y-1">
              <span className="text-slate-400 font-medium flex items-center gap-1">
                <FileText className="w-3.5 h-3.5 text-emerald-400" /> GST Number
              </span>
              <p className="font-mono font-semibold text-emerald-300">{customer.gstNumber || 'Unregistered / Retail'}</p>
            </div>

            <div className="space-y-1 sm:col-span-2">
              <span className="text-slate-400 font-medium flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-amber-400" /> Address
              </span>
              <p className="text-slate-300 leading-snug">{customer.address}</p>
            </div>

            <div className="space-y-1">
              <span className="text-slate-400 font-medium flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-purple-400" /> Next Follow-Up
              </span>
              <p className="font-semibold text-purple-300">{customer.followUpDate || 'None scheduled'}</p>
            </div>
          </div>

          {/* Customer General Notes */}
          {customer.notes && (
            <div className="bg-slate-800/30 border border-slate-800 p-4 rounded-xl space-y-1">
              <span className="font-semibold text-slate-300">Account Background / Notes:</span>
              <p className="text-slate-400 leading-relaxed">{customer.notes}</p>
            </div>
          )}

          {/* CRM Follow-Up Timeline Section */}
          <div className="space-y-4 pt-2">
            <h3 className="text-base font-bold text-white flex items-center gap-2 border-b border-slate-800 pb-2">
              <MessageSquare className="w-5 h-5 text-indigo-400" />
              CRM Follow-up Activity & Call Logs
            </h3>

            {/* Add New Follow-Up Form */}
            <form onSubmit={handleFollowUpSubmit} className="bg-slate-800/60 border border-slate-700/80 p-4 rounded-xl space-y-3">
              <div className="space-y-1">
                <label className="block text-slate-300 font-medium">Log Follow-Up Note / Discussion Summary</label>
                <textarea
                  rows={2}
                  required
                  value={newNote}
                  onChange={e => setNewNote(e.target.value)}
                  placeholder="Record outcome of phone call, meeting details, or quote feedback..."
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-indigo-500 text-xs sm:text-sm resize-none"
                />
              </div>

              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-400 font-medium">Next Follow-Up Date:</span>
                  <input
                    type="date"
                    value={nextDate}
                    onChange={e => setNextDate(e.target.value)}
                    className="bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-white focus:outline-none focus:border-indigo-500 text-xs"
                  />
                </div>

                <button
                  type="submit"
                  disabled={submitting || !newNote.trim()}
                  className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs shadow-md shadow-indigo-600/30 transition-all disabled:opacity-50 flex items-center justify-center gap-1.5"
                >
                  <Plus className="w-4 h-4" />
                  {submitting ? 'Adding...' : 'Add Follow-Up Log'}
                </button>
              </div>
            </form>

            {/* Timeline List */}
            <div className="space-y-3">
              {customer.followUps.length === 0 ? (
                <p className="text-center py-6 text-slate-500 text-xs">No follow-up logs recorded yet.</p>
              ) : (
                customer.followUps.map(fup => (
                  <div key={fup.id} className="p-4 bg-slate-800/40 border border-slate-800 rounded-xl space-y-2 relative">
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-indigo-400" />
                        <span className="font-semibold text-slate-200">{fup.createdByName}</span>
                      </div>
                      <span className="text-[11px] text-slate-400">
                        {new Date(fup.createdAt).toLocaleDateString()} {new Date(fup.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                    <p className="text-slate-300 leading-relaxed text-xs">{fup.note}</p>
                    {fup.nextFollowUpDate && (
                      <div className="text-[10px] text-indigo-300 bg-indigo-500/10 inline-block px-2 py-0.5 rounded border border-indigo-500/20 font-medium">
                        Scheduled Next: {fup.nextFollowUpDate}
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
