import React from 'react';
import { SalesChallan } from '../types';
import { X, Printer, Building2, CheckCircle2, ShieldAlert } from 'lucide-react';

interface ChallanPrintModalProps {
  challan: SalesChallan | null;
  isOpen: boolean;
  onClose: () => void;
}

export const ChallanPrintModal: React.FC<ChallanPrintModalProps> = ({ challan, isOpen, onClose }) => {
  if (!isOpen || !challan) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-sm animate-fadeIn">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-4xl max-h-[92vh] overflow-y-auto shadow-2xl text-slate-200">
        {/* Controls Header */}
        <div className="sticky top-0 bg-slate-900/95 backdrop-blur-md p-4 border-b border-slate-800 flex items-center justify-between z-10 print:hidden">
          <div className="flex items-center gap-2">
            <span className="font-mono font-bold text-indigo-400 text-sm">{challan.challanNumber}</span>
            <span
              className={`px-2.5 py-0.5 text-[10px] font-bold rounded-full ${
                challan.status === 'Confirmed'
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                  : challan.status === 'Draft'
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                  : 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
              }`}
            >
              {challan.status}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handlePrint}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs shadow-md shadow-indigo-600/30 transition-all"
            >
              <Printer className="w-4 h-4" /> Print Delivery Challan / Invoice
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Document Sheet (Styled for Screen and Browser Printing) */}
        <div className="p-8 bg-white text-slate-900 print:p-0 print:m-0 print:bg-white print:text-black">
          {/* Company Branding & Header */}
          <div className="flex justify-between items-start border-b-2 border-slate-800 pb-6">
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-indigo-900 font-extrabold text-2xl tracking-tight">
                <Building2 className="w-7 h-7 text-indigo-600" />
                NEXFLOW OPERATIONS LTD
              </div>
              <p className="text-xs text-slate-600 font-medium">Wholesale & Industrial Distribution Services</p>
              <p className="text-xs text-slate-500">Plot 102, MIDC Logistics Hub, Mumbai, MH - 400093</p>
              <p className="text-xs font-mono text-slate-600">GSTIN: 27AAACN998811Z2 • Phone: +91 22 6600 1122</p>
            </div>

            <div className="text-right space-y-1">
              <div className="inline-block px-3 py-1 bg-slate-900 text-white font-bold text-sm tracking-wider uppercase rounded">
                SALES DELIVERY CHALLAN
              </div>
              <div className="font-mono text-lg font-extrabold text-indigo-900 pt-1">{challan.challanNumber}</div>
              <div className="text-xs text-slate-600">
                Date: {new Date(challan.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
              </div>
              {challan.confirmedAt && (
                <div className="text-[11px] text-emerald-700 font-semibold">
                  Confirmed: {new Date(challan.confirmedAt).toLocaleDateString()}
                </div>
              )}
            </div>
          </div>

          {/* Customer & Consignee Details */}
          <div className="grid grid-cols-2 gap-6 my-6 p-4 bg-slate-50 rounded-xl border border-slate-200">
            <div>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Consignee / Billed To:</p>
              <div className="font-bold text-slate-900 text-sm">{challan.customerBusiness}</div>
              <div className="text-xs text-slate-700">Attn: {challan.customerName}</div>
              <div className="text-xs font-mono text-slate-700 mt-0.5">
                GSTIN: <span className="font-bold">{challan.customerGst || 'Unregistered'}</span>
              </div>
              <div className="text-xs text-slate-600 mt-1">{challan.customerAddress}</div>
            </div>

            <div>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Dispatch Details:</p>
              <div className="text-xs text-slate-700 space-y-0.5">
                <div>Created By: <span className="font-semibold text-slate-900">{challan.createdByName}</span></div>
                <div>Transport Mode: <span className="font-semibold text-slate-900">Road Transport / Logistics</span></div>
                <div>Status: <span className="font-bold text-indigo-800 uppercase">{challan.status}</span></div>
                {challan.notes && (
                  <div className="text-slate-600 italic pt-1 border-t border-slate-200">
                    Remarks: {challan.notes}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Line Items Table */}
          <div className="overflow-hidden border border-slate-300 rounded-lg mb-6">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-100 text-slate-800 uppercase font-bold border-b border-slate-300">
                <tr>
                  <th className="p-3">#</th>
                  <th className="p-3">Product Description & SKU</th>
                  <th className="p-3 text-center">Qty</th>
                  <th className="p-3 text-right">Unit Price (₹)</th>
                  <th className="p-3 text-right">Total Price (₹)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 text-slate-800">
                {challan.items.map((item, idx) => (
                  <tr key={idx}>
                    <td className="p-3 text-slate-500">{idx + 1}</td>
                    <td className="p-3">
                      <div className="font-bold text-slate-900">{item.productName}</div>
                      <div className="font-mono text-[11px] text-slate-500">SKU: {item.productSku}</div>
                    </td>
                    <td className="p-3 text-center font-bold">{item.quantity} pcs</td>
                    <td className="p-3 text-right font-mono">₹{item.unitPrice.toLocaleString('en-IN')}</td>
                    <td className="p-3 text-right font-bold font-mono">₹{item.totalPrice.toLocaleString('en-IN')}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot className="bg-slate-50 font-bold border-t border-slate-300 text-slate-900">
                <tr>
                  <td colSpan={2} className="p-3 text-right uppercase text-slate-600">Total Quantity:</td>
                  <td className="p-3 text-center">{challan.totalQuantity} pcs</td>
                  <td className="p-3 text-right uppercase text-slate-600">Grand Total:</td>
                  <td className="p-3 text-right text-sm text-indigo-950 font-extrabold font-mono">
                    ₹{challan.totalAmount.toLocaleString('en-IN')}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>

          {/* Terms & Signatures Block */}
          <div className="grid grid-cols-2 gap-8 pt-6 border-t border-slate-300 text-xs">
            <div className="space-y-1 text-slate-600">
              <p className="font-bold text-slate-800">Terms & Declarations:</p>
              <p>1. Goods once dispatched as per confirmed sales challan are non-returnable.</p>
              <p>2. Subject to Mumbai Jurisdiction.</p>
              <p>3. This is an officially generated ERP Sales Delivery Challan.</p>
            </div>

            <div className="flex flex-col justify-between h-28 text-right">
              <p className="font-bold text-slate-800">For NEXFLOW OPERATIONS LTD</p>
              <div className="border-b border-slate-400 w-48 ml-auto"></div>
              <p className="text-[11px] text-slate-500">Authorized Signatory / Warehouse Supervisor</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
