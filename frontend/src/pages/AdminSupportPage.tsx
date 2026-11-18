import React, { useState, useEffect } from 'react';
import { api, ApiError } from '../services/api';
import { SupportTicket } from '../types';
import { formatDate } from '../lib/utils';
import { useToast } from '../contexts/ToastContext';
import { useAuth } from '../contexts/AuthContext';
import { Link } from 'react-router-dom';
import { Headphones, ArrowLeft, Mail, MessageSquare, CheckCircle2 } from 'lucide-react';

export const AdminSupportPage: React.FC = () => {
  const { isAdmin } = useAuth();
  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [statusFilter, setStatusFilter] = useState('all');
  const [isLoading, setIsLoading] = useState(true);
  const { success, error } = useToast();

  const fetchTickets = async () => {
    try {
      const url = statusFilter === 'all' ? '/admin/support' : `/admin/support?status_filter=${statusFilter}`;
      const data = await api.get<SupportTicket[]>(url);
      setTickets(data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isAdmin) {
      fetchTickets();
    }
  }, [isAdmin, statusFilter]);

  const handleStatusChange = async (id: number, nextStatus: string) => {
    try {
      await api.patch(`/admin/support/${id}/status`, { status: nextStatus });
      setTickets((prev) =>
        prev.map((t) => (t.id === id ? { ...t, status: nextStatus as any } : t))
      );
      success('Ticket Updated', `Ticket status set to '${nextStatus}'.`);
    } catch {
      error('Error', 'Failed to update ticket status.');
    }
  };

  if (!isAdmin) {
    return <div className="py-24 text-center">Admin credentials required.</div>;
  }

  return (
    <div className="py-8 space-y-8 max-w-5xl mx-auto px-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link to="/admin" className="p-2 text-neutral-400 hover:text-neutral-700 rounded-full hover:bg-neutral-100">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#1d1d1f]">
              Customer Support Requests
            </h1>
            <p className="text-xs text-neutral-500 mt-0.5">Manage customer inquiries, order tickets, and resolutions.</p>
          </div>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-2">
          {['all', 'open', 'in_progress', 'resolved'].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold capitalize transition-all ${
                statusFilter === st
                  ? 'bg-[#1d1d1f] text-white'
                  : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Tickets List */}
      <div className="space-y-4">
        {tickets.length === 0 && !isLoading ? (
          <div className="bg-white rounded-3xl p-16 text-center border border-neutral-200/60 text-xs text-neutral-400">
            No support requests found for the selected status.
          </div>
        ) : (
          tickets.map((t) => (
            <div
              key={t.id}
              className="bg-white rounded-3xl p-6 sm:p-8 border border-neutral-200/60 shadow-sm space-y-4"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-neutral-100">
                <div className="flex items-center gap-3">
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-800">
                    {t.category}
                  </span>
                  {t.order_id && (
                    <span className="text-xs font-mono font-semibold text-neutral-600">
                      Order: {t.order_id}
                    </span>
                  )}
                  <span className="text-xs text-neutral-400">• {formatDate(t.created_at)}</span>
                </div>

                <div className="flex items-center gap-2">
                  <select
                    value={t.status}
                    onChange={(e) => handleStatusChange(t.id, e.target.value)}
                    className="text-xs font-semibold px-3 py-1 rounded-lg border border-neutral-200 bg-neutral-50 text-neutral-800"
                  >
                    <option value="open">Open</option>
                    <option value="in_progress">In Progress</option>
                    <option value="resolved">Resolved</option>
                  </select>
                </div>
              </div>

              <div>
                <h3 className="text-base font-bold text-neutral-900">{t.subject}</h3>
                <p className="text-xs text-neutral-700 leading-relaxed mt-2 whitespace-pre-wrap bg-neutral-50 p-4 rounded-2xl border border-neutral-100">
                  {t.message}
                </p>
              </div>

              <div className="flex items-center justify-between pt-2 text-xs text-neutral-500">
                <div>
                  <span className="font-semibold text-neutral-900">{t.name}</span> &lt;{t.email}&gt;
                </div>
                <a
                  href={`mailto:${t.email}?subject=RE: ${encodeURIComponent(t.subject)} [MAPPLE Support]`}
                  className="text-blue-600 hover:underline font-semibold flex items-center gap-1"
                >
                  <Mail className="w-3.5 h-3.5" /> Reply to Customer
                </a>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
