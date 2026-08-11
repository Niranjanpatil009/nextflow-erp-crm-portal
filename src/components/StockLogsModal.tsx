import React from 'react';
import { StockMovementLog } from '../types';
import { X, Clock, ArrowDownRight, ArrowUpRight, ShieldCheck } from 'lucide-react';

interface StockLogsModalProps {
  isOpen: boolean;
  onClose: () => void;
  logs: StockMovementLog[];
}

export const StockLogsModal: React.FC<StockLogsModalProps> = ({ isOpen, onClose, logs }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-2xl text-slate-200">
        <div className="sticky top-0 bg-slate-900/95 backdrop-blur-md p-6 border-b border-slate-800 flex items-center justify-between z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                Stock Movement Audit Logs
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
              </h3>
              <p className="text-xs text-slate-400">Complete immutable record of all IN and OUT inventory movements</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6">
          <div className="overflow-x-auto rounded-xl border border-slate-800">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="bg-slate-800/80 text-slate-400 uppercase tracking-wider text-[11px] font-semibold border-b border-slate-800">
                <tr>
                  <th className="p-3.5">Type</th>
                  <th className="p-3.5">Product SKU & Name</th>
                  <th className="p-3.5 text-center">Qty Changed</th>
                  <th className="p-3.5">Reason / Source</th>
                  <th className="p-3.5">Logged By</th>
                  <th className="p-3.5">Timestamp</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-slate-300">
                {logs.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="text-center p-8 text-slate-500">
                      No stock movement logs recorded yet.
                    </td>
                  </tr>
                ) : (
                  logs.map(log => (
                    <tr key={log.id} className="hover:bg-slate-800/40 transition-colors">
                      <td className="p-3.5">
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-0.5 text-xs font-bold rounded-full ${
                            log.movementType === 'IN'
                              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                              : 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                          }`}
                        >
                          {log.movementType === 'IN' ? (
                            <ArrowDownRight className="w-3.5 h-3.5 text-emerald-400" />
                          ) : (
                            <ArrowUpRight className="w-3.5 h-3.5 text-rose-400" />
                          )}
                          {log.movementType}
                        </span>
                      </td>

                      <td className="p-3.5">
                        <div className="font-semibold text-white">{log.productName}</div>
                        <div className="text-[11px] font-mono text-indigo-300">SKU: {log.productSku}</div>
                      </td>

                      <td className="p-3.5 text-center font-bold text-sm">
                        <span className={log.movementType === 'IN' ? 'text-emerald-400' : 'text-rose-400'}>
                          {log.movementType === 'IN' ? `+${log.quantity}` : `-${log.quantity}`}
                        </span>
                      </td>

                      <td className="p-3.5 text-slate-300 text-xs leading-snug">{log.reason}</td>

                      <td className="p-3.5 text-slate-400 font-medium text-xs">{log.createdBy}</td>

                      <td className="p-3.5 text-slate-400 font-mono text-[11px]">
                        {new Date(log.createdAt).toLocaleDateString()} {new Date(log.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
