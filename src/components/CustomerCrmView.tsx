import React, { useState } from 'react';
import { Customer, User } from '../types';
import {
  Users,
  Search,
  Plus,
  Filter,
  Eye,
  Edit2,
  Phone,
  Building2,
  MessageSquare,
  Calendar,
  FileCheck,
} from 'lucide-react';

interface CustomerCrmViewProps {
  customers: Customer[];
  currentUser: User;
  onOpenAddModal: () => void;
  onOpenEditModal: (customer: Customer) => void;
  onOpenDetailModal: (customer: Customer) => void;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  statusFilter: string;
  setStatusFilter: (status: string) => void;
  typeFilter: string;
  setTypeFilter: (type: string) => void;
}

export const CustomerCrmView: React.FC<CustomerCrmViewProps> = ({
  customers,
  currentUser,
  onOpenAddModal,
  onOpenEditModal,
  onOpenDetailModal,
  searchTerm,
  setSearchTerm,
  statusFilter,
  setStatusFilter,
  typeFilter,
  setTypeFilter,
}) => {
  return (
    <div className="space-y-6">
      {/* Header & Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-[#09090b] border border-[#27272a] p-6 rounded-2xl shadow-xl">
        <div>
          <h2 className="text-xl font-extrabold text-white flex items-center gap-2">
            <Users className="w-6 h-6 text-indigo-400" />
            Customer CRM Portal
          </h2>
          <p className="text-xs text-zinc-400 mt-1">
            Manage wholesale clients, leads, contact history, and follow-up schedules
          </p>
        </div>

        {(currentUser.role === 'Admin' || currentUser.role === 'Sales') && (
          <button
            onClick={onOpenAddModal}
            className="flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-white text-black font-bold text-xs hover:bg-zinc-200 transition-all shadow-md"
          >
            <Plus className="w-4 h-4" />
            Add New Customer
          </button>
        )}
      </div>

      {/* Filter & Search Bar */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-3 bg-[#09090b] border border-[#27272a] p-4 rounded-xl">
        {/* Search Input */}
        <div className="md:col-span-2 relative">
          <Search className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            placeholder="Search by customer name, business, phone, email, or GST..."
            className="w-full bg-[#18181b] border border-[#27272a] rounded-xl pl-10 pr-4 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-indigo-500"
          />
        </div>

        {/* Status Filter */}
        <div>
          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
            className="w-full bg-[#18181b] border border-[#27272a] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
          >
            <option value="ALL">All CRM Statuses</option>
            <option value="Lead">Lead</option>
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </select>
        </div>

        {/* Type Filter */}
        <div>
          <select
            value={typeFilter}
            onChange={e => setTypeFilter(e.target.value)}
            className="w-full bg-[#18181b] border border-[#27272a] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
          >
            <option value="ALL">All Customer Types</option>
            <option value="Wholesale">Wholesale</option>
            <option value="Distributor">Distributor</option>
            <option value="Retail">Retail</option>
          </select>
        </div>
      </div>

      {/* Customers Table */}
      <div className="bg-[#09090b] border border-[#27272a] rounded-2xl shadow-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="bg-[#18181b] text-zinc-500 uppercase tracking-wider text-[10px] font-semibold border-b border-[#27272a]">
              <tr>
                <th className="p-4">Customer & Business</th>
                <th className="p-4">Contact & GST</th>
                <th className="p-4">Type</th>
                <th className="p-4">Status</th>
                <th className="p-4">Next Follow-Up</th>
                <th className="p-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#27272a] text-zinc-300">
              {customers.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center p-12 text-zinc-500">
                    No customers found matching the search criteria.
                  </td>
                </tr>
              ) : (
                customers.map(cust => (
                  <tr key={cust.id} className="hover:bg-zinc-900/50 transition-colors">
                    <td className="p-4">
                      <div className="font-bold text-white text-sm flex items-center gap-2">
                        <Building2 className="w-4 h-4 text-indigo-400 shrink-0" />
                        {cust.businessName}
                      </div>
                      <div className="text-xs text-zinc-400 mt-0.5">{cust.name}</div>
                    </td>

                    <td className="p-4 space-y-0.5">
                      <div className="flex items-center gap-1.5 text-zinc-200 font-mono text-xs">
                        <Phone className="w-3.5 h-3.5 text-indigo-400" />
                        {cust.mobile}
                      </div>
                      {cust.gstNumber && (
                        <div className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded w-fit border border-emerald-500/20">
                          GST: {cust.gstNumber}
                        </div>
                      )}
                    </td>

                    <td className="p-4">
                      <span className="px-2.5 py-1 text-xs font-mono font-medium rounded-lg bg-[#18181b] text-zinc-300 border border-[#27272a]">
                        {cust.customerType}
                      </span>
                    </td>

                    <td className="p-4">
                      <span
                        className={`px-2 py-0.5 text-[10px] font-mono font-bold rounded uppercase ${
                          cust.status === 'Active'
                            ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                            : cust.status === 'Lead'
                            ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                            : 'bg-zinc-800 text-zinc-400'
                        }`}
                      >
                        {cust.status}
                      </span>
                    </td>

                    <td className="p-4">
                      {cust.followUpDate ? (
                        <div className="flex items-center gap-1.5 text-purple-300 font-mono font-medium text-xs">
                          <Calendar className="w-3.5 h-3.5" />
                          {cust.followUpDate}
                        </div>
                      ) : (
                        <span className="text-zinc-600 text-xs font-mono">Not set</span>
                      )}
                    </td>

                    <td className="p-4">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => onOpenDetailModal(cust)}
                          className="p-2 rounded-lg bg-[#18181b] hover:bg-[#27272a] text-indigo-300 hover:text-indigo-200 border border-[#27272a] transition-colors flex items-center gap-1 text-xs font-semibold"
                          title="View Detail & Log Follow-ups"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          Detail
                        </button>

                        {(currentUser.role === 'Admin' || currentUser.role === 'Sales') && (
                          <button
                            onClick={() => onOpenEditModal(cust)}
                            className="p-2 rounded-lg bg-[#18181b] hover:bg-[#27272a] text-zinc-400 hover:text-white border border-[#27272a] transition-colors"
                            title="Edit Record"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
