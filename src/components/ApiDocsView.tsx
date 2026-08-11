import React, { useState } from 'react';
import { api } from '../lib/api';
import {
  Code2,
  Download,
  Server,
  Database,
  Key,
  Terminal,
  Layers,
  Check,
  Copy,
  BookOpen,
  Boxes,
} from 'lucide-react';

export const ApiDocsView: React.FC = () => {
  const [copied, setCopied] = useState(false);
  const [activeSubTab, setActiveSubTab] = useState<'endpoints' | 'postman' | 'architecture' | 'deployment'>('endpoints');

  const handleDownloadPostman = async () => {
    try {
      const collection = await api.getPostmanCollection();
      const blob = new Blob([JSON.stringify(collection, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'NexFlow_Mini_ERP_Postman_Collection.json';
      a.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      alert('Failed to download Postman collection');
    }
  };

  const copyCredentials = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-[#09090b] border border-[#27272a] p-6 rounded-2xl shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-white flex items-center gap-2">
            <Code2 className="w-6 h-6 text-indigo-400" />
            Developer Hub & System Architecture
          </h2>
          <p className="text-xs text-zinc-400 mt-1">
            API Documentation, Postman Export, Database Schema Blueprint, and Deployment Instructions
          </p>
        </div>

        <button
          onClick={handleDownloadPostman}
          className="flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-white text-black font-bold text-xs hover:bg-zinc-200 transition-all shadow-md shrink-0"
        >
          <Download className="w-4 h-4" />
          Download Postman Collection (.json)
        </button>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex items-center gap-2 border-b border-[#27272a] pb-2 text-xs sm:text-sm">
        <button
          onClick={() => setActiveSubTab('endpoints')}
          className={`px-3 py-1.5 rounded-lg font-mono text-xs font-semibold transition-all ${
            activeSubTab === 'endpoints'
              ? 'bg-[#18181b] text-white border border-[#27272a] shadow-sm'
              : 'text-zinc-500 hover:text-white'
          }`}
        >
          REST API Endpoints
        </button>
        <button
          onClick={() => setActiveSubTab('postman')}
          className={`px-3 py-1.5 rounded-lg font-mono text-xs font-semibold transition-all ${
            activeSubTab === 'postman'
              ? 'bg-[#18181b] text-white border border-[#27272a] shadow-sm'
              : 'text-zinc-500 hover:text-white'
          }`}
        >
          Postman & Credentials
        </button>
        <button
          onClick={() => setActiveSubTab('architecture')}
          className={`px-3 py-1.5 rounded-lg font-mono text-xs font-semibold transition-all ${
            activeSubTab === 'architecture'
              ? 'bg-[#18181b] text-white border border-[#27272a] shadow-sm'
              : 'text-zinc-500 hover:text-white'
          }`}
        >
          Architecture & RBAC
        </button>
        <button
          onClick={() => setActiveSubTab('deployment')}
          className={`px-3 py-1.5 rounded-lg font-mono text-xs font-semibold transition-all ${
            activeSubTab === 'deployment'
              ? 'bg-[#18181b] text-white border border-[#27272a] shadow-sm'
              : 'text-zinc-500 hover:text-white'
          }`}
        >
          Setup & Deployment
        </button>
      </div>

      {/* Sub-Tab 1: REST API Endpoints */}
      {activeSubTab === 'endpoints' && (
        <div className="space-y-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Server className="w-5 h-5 text-indigo-400" />
              REST API Endpoint Reference
            </h3>

            <div className="space-y-3 text-xs">
              {/* Auth */}
              <div className="p-4 bg-slate-800/40 border border-slate-800 rounded-xl space-y-2">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 bg-blue-500/20 text-blue-300 font-bold rounded font-mono">POST</span>
                  <span className="font-mono text-slate-200 font-semibold">/api/auth/login</span>
                  <span className="text-slate-400 text-[11px] ml-auto">Public</span>
                </div>
                <p className="text-slate-400">Authenticate user credentials and obtain JWT Bearer Token.</p>
                <pre className="bg-slate-950 p-3 rounded-lg text-indigo-300 font-mono text-[11px] overflow-x-auto">
{`// Body Request
{ "email": "admin@nexflow.com", "password": "admin123" }

// 200 OK Response
{ "token": "eyJhbGciOiJIUzI1Ni...", "user": { "id": "usr-1", "name": "Alexandra Vance", "role": "Admin" } }`}
                </pre>
              </div>

              {/* Customers */}
              <div className="p-4 bg-slate-800/40 border border-slate-800 rounded-xl space-y-2">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-300 font-bold rounded font-mono">GET</span>
                  <span className="font-mono text-slate-200 font-semibold">/api/customers?status=Active&search=Apex</span>
                  <span className="text-slate-400 text-[11px] ml-auto">Bearer Auth</span>
                </div>
                <p className="text-slate-400">List and filter CRM customer accounts and active leads.</p>
              </div>

              <div className="p-4 bg-slate-800/40 border border-slate-800 rounded-xl space-y-2">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 bg-blue-500/20 text-blue-300 font-bold rounded font-mono">POST</span>
                  <span className="font-mono text-slate-200 font-semibold">/api/customers/:id/follow-ups</span>
                  <span className="text-slate-400 text-[11px] ml-auto">Bearer Auth</span>
                </div>
                <p className="text-slate-400">Add a timestamped CRM follow-up call note to customer history.</p>
              </div>

              {/* Products */}
              <div className="p-4 bg-slate-800/40 border border-slate-800 rounded-xl space-y-2">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-300 font-bold rounded font-mono">GET</span>
                  <span className="font-mono text-slate-200 font-semibold">/api/products?lowStock=true</span>
                  <span className="text-slate-400 text-[11px] ml-auto">Bearer Auth</span>
                </div>
                <p className="text-slate-400">Retrieve product inventory SKUs with stock alert filters.</p>
              </div>

              {/* Sales Challans */}
              <div className="p-4 bg-slate-800/40 border border-slate-800 rounded-xl space-y-2">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 bg-blue-500/20 text-blue-300 font-bold rounded font-mono">POST</span>
                  <span className="font-mono text-slate-200 font-semibold">/api/challans</span>
                  <span className="text-slate-400 text-[11px] ml-auto">Bearer Auth</span>
                </div>
                <p className="text-slate-400">
                  Generate Sales Challan. Checks stock availability and automatically reduces stock if status is Confirmed.
                </p>
                <pre className="bg-slate-950 p-3 rounded-lg text-emerald-300 font-mono text-[11px] overflow-x-auto">
{`// Body Request
{
  "customerId": "cust-101",
  "items": [{ "productId": "prod-201", "quantity": 2 }],
  "status": "Confirmed",
  "notes": "Urgent warehouse dispatch"
}`}
                </pre>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Sub-Tab 2: Postman & Test Credentials */}
      {activeSubTab === 'postman' && (
        <div className="space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Key className="w-5 h-5 text-amber-400" />
              Role-Based Test Login Credentials
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="p-4 bg-purple-500/10 border border-purple-500/20 rounded-xl space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-purple-300 uppercase">Admin Role</span>
                  <span className="text-[10px] text-purple-400">Full Access</span>
                </div>
                <p className="text-slate-300">Email: <span className="font-mono text-white">admin@nexflow.com</span></p>
                <p className="text-slate-300">Password: <span className="font-mono text-white">admin123</span></p>
              </div>

              <div className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-xl space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-blue-300 uppercase">Sales Role</span>
                  <span className="text-[10px] text-blue-400">CRM & Sales Challan Creation</span>
                </div>
                <p className="text-slate-300">Email: <span className="font-mono text-white">sales@nexflow.com</span></p>
                <p className="text-slate-300">Password: <span className="font-mono text-white">sales123</span></p>
              </div>

              <div className="p-4 bg-amber-500/10 border border-amber-500/20 rounded-xl space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-amber-300 uppercase">Warehouse Role</span>
                  <span className="text-[10px] text-amber-400">Stock & Inventory Adjustments</span>
                </div>
                <p className="text-slate-300">Email: <span className="font-mono text-white">warehouse@nexflow.com</span></p>
                <p className="text-slate-300">Password: <span className="font-mono text-white">warehouse123</span></p>
              </div>

              <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-xl space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-emerald-300 uppercase">Accounts Role</span>
                  <span className="text-[10px] text-emerald-400">Invoice Authorization & Billing</span>
                </div>
                <p className="text-slate-300">Email: <span className="font-mono text-white">accounts@nexflow.com</span></p>
                <p className="text-slate-300">Password: <span className="font-mono text-white">accounts123</span></p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Sub-Tab 3: Architecture & Permissions */}
      {activeSubTab === 'architecture' && (
        <div className="space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Layers className="w-5 h-5 text-indigo-400" />
              System Architecture & RBAC Permissions Matrix
            </h3>

            <div className="overflow-x-auto rounded-xl border border-slate-800 text-xs">
              <table className="w-full text-left">
                <thead className="bg-slate-800/80 text-slate-300 font-bold uppercase">
                  <tr>
                    <th className="p-3">Feature / Action</th>
                    <th className="p-3 text-center text-purple-300">Admin</th>
                    <th className="p-3 text-center text-blue-300">Sales</th>
                    <th className="p-3 text-center text-amber-300">Warehouse</th>
                    <th className="p-3 text-center text-emerald-300">Accounts</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800 text-slate-300">
                  <tr>
                    <td className="p-3 font-semibold">View Dashboard & KPIs</td>
                    <td className="p-3 text-center text-emerald-400 font-bold">✓</td>
                    <td className="p-3 text-center text-emerald-400 font-bold">✓</td>
                    <td className="p-3 text-center text-emerald-400 font-bold">✓</td>
                    <td className="p-3 text-center text-emerald-400 font-bold">✓</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-semibold">Customer CRM Add/Edit & Follow-ups</td>
                    <td className="p-3 text-center text-emerald-400 font-bold">✓</td>
                    <td className="p-3 text-center text-emerald-400 font-bold">✓</td>
                    <td className="p-3 text-center text-slate-500">Read-Only</td>
                    <td className="p-3 text-center text-slate-500">Read-Only</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-semibold">Add SKU / Stock Adjustments</td>
                    <td className="p-3 text-center text-emerald-400 font-bold">✓</td>
                    <td className="p-3 text-center text-slate-500">Read-Only</td>
                    <td className="p-3 text-center text-emerald-400 font-bold">✓</td>
                    <td className="p-3 text-center text-slate-500">Read-Only</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-semibold">Generate Sales Challans (Draft/Confirmed)</td>
                    <td className="p-3 text-center text-emerald-400 font-bold">✓</td>
                    <td className="p-3 text-center text-emerald-400 font-bold">✓</td>
                    <td className="p-3 text-center text-slate-500">Read-Only</td>
                    <td className="p-3 text-center text-emerald-400 font-bold">✓</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Sub-Tab 4: Setup & Deployment Guide */}
      {activeSubTab === 'deployment' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4 text-xs text-slate-300">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Terminal className="w-5 h-5 text-emerald-400" />
            Deployment & Production Guide
          </h3>

          <div className="space-y-4">
            <div className="p-4 bg-slate-800/40 border border-slate-800 rounded-xl space-y-2">
              <h4 className="font-bold text-indigo-300">1. Local Setup Instructions</h4>
              <p>Clone the repository and launch the unified Express server + Vite frontend:</p>
              <pre className="bg-slate-950 p-3 rounded-lg text-slate-200 font-mono text-[11px]">
{`# Install dependencies
npm install

# Run full-stack dev server (Port 3000)
npm run dev

# Build single CommonJS backend bundle & Vite frontend
npm run build

# Start production server
npm start`}
              </pre>
            </div>

            <div className="p-4 bg-slate-800/40 border border-slate-800 rounded-xl space-y-2">
              <h4 className="font-bold text-emerald-300">2. Free Cloud Hosting Deployment</h4>
              <p>
                • <strong>Frontend / Full-Stack:</strong> Deploy to Render / Railway / Fly.io by specifying Node 20 runtime and build command <code className="text-indigo-300 font-mono">npm run build</code>.
              </p>
              <p>
                • <strong>Database Upgrade:</strong> Plug in Neon or Supabase PostgreSQL URI into environment variable <code className="text-indigo-300 font-mono">DATABASE_URL</code>.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
