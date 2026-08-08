'use client';

import {
  FileText,
  Download,
  Eye,
  BarChart3,
  Users,
  Globe,
  Clock,
} from 'lucide-react';

const stats = [
  { label: 'Page Views', value: '1,24,580', icon: Eye, sub: '+18% this month' },
  {
    label: 'Unique Visitors',
    value: '42,310',
    icon: Users,
    sub: '+9% this month',
  },
  { label: 'Avg. Session', value: '3m 42s', icon: Clock, sub: '+12s vs last' },
  { label: 'Bounce Rate', value: '34.2%', icon: Globe, sub: '-2.1% improved' },
];

const reports = [
  {
    id: 'RPT-001',
    title: 'Monthly Traffic Summary',
    type: 'Analytics',
    generated: '2026-08-01',
    size: '2.4 MB',
  },
  {
    id: 'RPT-002',
    title: 'Blog Engagement Report',
    type: 'Content',
    generated: '2026-07-28',
    size: '1.1 MB',
  },
  {
    id: 'RPT-003',
    title: 'User Growth Q2',
    type: 'Users',
    generated: '2026-07-15',
    size: '890 KB',
  },
  {
    id: 'RPT-004',
    title: 'Project Conversion Funnel',
    type: 'Sales',
    generated: '2026-07-10',
    size: '1.6 MB',
  },
  {
    id: 'RPT-005',
    title: 'SEO Performance Audit',
    type: 'SEO',
    generated: '2026-07-01',
    size: '3.2 MB',
  },
];

const topPages = [
  { path: '/blogs', views: 18420, share: 28 },
  { path: '/', views: 15200, share: 23 },
  { path: '/blogs/b/main/nextjs-tips', views: 9800, share: 15 },
  { path: '/#projects', views: 7200, share: 11 },
  { path: '/signin', views: 5100, share: 8 },
];

export default function ReportsPage() {
  return (
    <div className="animate-in fade-in duration-500 py-6 space-y-8">
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight text-foreground">
          Reports
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Analytics snapshots and downloadable reports
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {stats.map((s) => (
          <div
            key={s.label}
            className="bg-card border border-border rounded-2xl p-5 shadow-sm"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                {s.label}
              </span>
              <div className="p-2 rounded-xl bg-primary/10 text-primary">
                <s.icon size={16} />
              </div>
            </div>
            <p className="text-2xl font-bold text-foreground">{s.value}</p>
            <p className="mt-2 text-xs text-muted-foreground">{s.sub}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Report list */}
        <div className="lg:col-span-2 bg-card border border-border rounded-2xl overflow-hidden shadow-sm">
          <div className="px-6 py-4 border-b border-border flex items-center gap-2">
            <FileText size={18} className="text-primary" />
            <h2 className="text-lg font-bold text-foreground">
              Generated Reports
            </h2>
          </div>
          <div className="divide-y divide-border">
            {reports.map((r) => (
              <div
                key={r.id}
                className="px-6 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-primary/5 transition-colors"
              >
                <div>
                  <p className="font-semibold text-foreground">{r.title}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {r.id} · {r.type} · {r.generated} · {r.size}
                  </p>
                </div>
                <button className="inline-flex items-center gap-2 text-xs font-semibold px-3 py-2 rounded-lg border border-border bg-muted/50 hover:bg-muted text-foreground transition-colors">
                  <Download size={14} />
                  Download
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Top pages */}
        <div className="bg-card border border-border rounded-2xl p-6 shadow-sm">
          <div className="flex items-center gap-2 mb-5">
            <BarChart3 size={18} className="text-primary" />
            <h2 className="text-lg font-bold text-foreground">Top Pages</h2>
          </div>
          <div className="space-y-4">
            {topPages.map((p) => (
              <div key={p.path}>
                <div className="flex items-center justify-between text-sm mb-1">
                  <span className="font-medium text-foreground truncate max-w-[70%]">
                    {p.path}
                  </span>
                  <span className="text-muted-foreground text-xs">
                    {p.views.toLocaleString()}
                  </span>
                </div>
                <div className="h-2 rounded-full bg-muted overflow-hidden">
                  <div
                    className="h-full rounded-full bg-primary"
                    style={{ width: `${p.share}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
