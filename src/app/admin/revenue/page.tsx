'use client';

import { useMemo } from 'react';
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  CreditCard,
  Wallet,
  ArrowUpRight,
} from 'lucide-react';

const summary = [
  {
    label: 'Total Revenue',
    value: '₹4,82,450',
    change: '+12.4%',
    up: true,
    icon: DollarSign,
  },
  {
    label: 'This Month',
    value: '₹68,200',
    change: '+8.1%',
    up: true,
    icon: Wallet,
  },
  {
    label: 'Pending Payouts',
    value: '₹12,800',
    change: '-2.3%',
    up: false,
    icon: CreditCard,
  },
  {
    label: 'Avg. Order Value',
    value: '₹2,145',
    change: '+4.6%',
    up: true,
    icon: TrendingUp,
  },
];

const monthly = [
  { month: 'Jan', amount: 32000 },
  { month: 'Feb', amount: 28500 },
  { month: 'Mar', amount: 41000 },
  { month: 'Apr', amount: 37800 },
  { month: 'May', amount: 45200 },
  { month: 'Jun', amount: 52100 },
  { month: 'Jul', amount: 48900 },
  { month: 'Aug', amount: 61200 },
];

const transactions = [
  {
    id: 'TXN-9021',
    client: 'Acme Corp',
    amount: 18500,
    status: 'paid',
    date: '2026-08-01',
  },
  {
    id: 'TXN-9018',
    client: 'Nova Labs',
    amount: 9200,
    status: 'pending',
    date: '2026-07-28',
  },
  {
    id: 'TXN-9012',
    client: 'Pixel Studio',
    amount: 15400,
    status: 'paid',
    date: '2026-07-22',
  },
  {
    id: 'TXN-9007',
    client: 'Orbit AI',
    amount: 22100,
    status: 'paid',
    date: '2026-07-15',
  },
  {
    id: 'TXN-8999',
    client: 'Craftware',
    amount: 6800,
    status: 'failed',
    date: '2026-07-10',
  },
];

export default function RevenuePage() {
  const maxAmount = useMemo(
    () => Math.max(...monthly.map((m) => m.amount)),
    [],
  );

  return (
    <div className="animate-in fade-in duration-500 py-6 space-y-8">
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight text-foreground">
          Revenue
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Overview of earnings and recent transactions
        </p>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {summary.map((item) => (
          <div
            key={item.label}
            className="bg-card border border-border rounded-2xl p-5 shadow-sm"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                {item.label}
              </span>
              <div className="p-2 rounded-xl bg-primary/10 text-primary">
                <item.icon size={16} />
              </div>
            </div>
            <p className="text-2xl font-bold text-foreground">{item.value}</p>
            <p
              className={`mt-2 text-xs font-semibold flex items-center gap-1 ${
                item.up ? 'text-success' : 'text-destructive'
              }`}
            >
              {item.up ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
              {item.change} vs last period
            </p>
          </div>
        ))}
      </div>

      {/* Chart (simple bars) */}
      <div className="bg-card border border-border rounded-2xl p-6 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-bold text-foreground">Monthly Revenue</h2>
          <span className="text-xs text-muted-foreground">2026</span>
        </div>
        <div className="flex items-end gap-3 h-48">
          {monthly.map((m) => (
            <div
              key={m.month}
              className="flex-1 flex flex-col items-center gap-2"
            >
              <div
                className="w-full rounded-t-lg bg-primary/80 hover:bg-primary transition-colors min-h-2"
                style={{ height: `${(m.amount / maxAmount) * 100}%` }}
                title={`₹${m.amount.toLocaleString()}`}
              />
              <span className="text-[10px] text-muted-foreground font-medium">
                {m.month}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Transactions */}
      <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm">
        <div className="px-6 py-4 border-b border-border flex items-center justify-between">
          <h2 className="text-lg font-bold text-foreground">
            Recent Transactions
          </h2>
          <button className="text-xs font-semibold text-primary hover:underline flex items-center gap-1">
            View all <ArrowUpRight size={12} />
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="table w-full text-sm">
            <thead>
              <tr className="bg-muted/50 text-muted-foreground text-xs uppercase">
                <th className="px-6 py-3">ID</th>
                <th className="px-6 py-3">Client</th>
                <th className="px-6 py-3">Amount</th>
                <th className="px-6 py-3">Status</th>
                <th className="px-6 py-3">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {transactions.map((t) => (
                <tr key={t.id} className="hover:bg-primary/5 transition-colors">
                  <td className="px-6 py-3 font-mono text-xs text-muted-foreground">
                    {t.id}
                  </td>
                  <td className="px-6 py-3 font-medium text-foreground">
                    {t.client}
                  </td>
                  <td className="px-6 py-3 text-foreground">
                    ₹{t.amount.toLocaleString()}
                  </td>
                  <td className="px-6 py-3">
                    <span
                      className={`inline-flex px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                        t.status === 'paid'
                          ? 'bg-success/15 text-success'
                          : t.status === 'pending'
                            ? 'bg-warning/15 text-warning'
                            : 'bg-destructive/15 text-destructive'
                      }`}
                    >
                      {t.status}
                    </span>
                  </td>
                  <td className="px-6 py-3 text-muted-foreground text-xs">
                    {t.date}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
