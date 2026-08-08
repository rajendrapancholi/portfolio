'use client';

import {
  Mail,
  MoreHorizontal,
  UserPlus,
  Shield,
  Code,
  PenLine,
} from 'lucide-react';

const members = [
  {
    id: 1,
    name: 'Rajendra Pancholi',
    email: 'rajendra@example.com',
    role: 'Admin',
    status: 'active',
    avatar: 'RP',
    joined: 'Jan 2024',
  },
  {
    id: 2,
    name: 'Aisha Khan',
    email: 'aisha@example.com',
    role: 'Author',
    status: 'active',
    avatar: 'AK',
    joined: 'Mar 2025',
  },
  {
    id: 3,
    name: 'Dev Sharma',
    email: 'dev@example.com',
    role: 'Developer',
    status: 'active',
    avatar: 'DS',
    joined: 'Jun 2025',
  },
  {
    id: 4,
    name: 'Meera Patel',
    email: 'meera@example.com',
    role: 'Viewer',
    status: 'invited',
    avatar: 'MP',
    joined: 'Aug 2026',
  },
  {
    id: 5,
    name: 'Arjun Mehta',
    email: 'arjun@example.com',
    role: 'Author',
    status: 'inactive',
    avatar: 'AM',
    joined: 'Nov 2024',
  },
];

const roleStyle: Record<string, string> = {
  Admin: 'bg-primary/15 text-primary',
  Author: 'bg-info/15 text-info',
  Developer: 'bg-success/15 text-success',
  Viewer: 'bg-muted text-muted-foreground',
};

const statusStyle: Record<string, string> = {
  active: 'bg-success/15 text-success',
  invited: 'bg-warning/15 text-warning',
  inactive: 'bg-muted text-muted-foreground',
};

export default function TeamsPage() {
  return (
    <div className="animate-in fade-in duration-500 py-6 space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-foreground">
            Teams
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Manage members and roles
          </p>
        </div>
        <button className="inline-flex items-center gap-2 bg-primary text-primary-foreground font-semibold px-4 py-2.5 rounded-xl hover:brightness-110 transition-all shadow-sm shadow-primary/20">
          <UserPlus size={16} />
          Invite Member
        </button>
      </div>

      {/* Role summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { label: 'Admins', count: 1, icon: Shield },
          { label: 'Authors', count: 2, icon: PenLine },
          { label: 'Developers', count: 1, icon: Code },
        ].map((r) => (
          <div
            key={r.label}
            className="bg-card border border-border rounded-2xl p-5 flex items-center gap-4 shadow-sm"
          >
            <div className="p-3 rounded-xl bg-primary/10 text-primary">
              <r.icon size={20} />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{r.count}</p>
              <p className="text-xs text-muted-foreground uppercase tracking-wider">
                {r.label}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Members table */}
      <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="table w-full text-sm">
            <thead>
              <tr className="bg-muted/50 text-muted-foreground text-xs uppercase">
                <th className="px-6 py-3 text-left">Member</th>
                <th className="px-6 py-3 text-left">Role</th>
                <th className="px-6 py-3 text-left">Status</th>
                <th className="px-6 py-3 text-left">Joined</th>
                <th className="px-6 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {members.map((m) => (
                <tr key={m.id} className="hover:bg-primary/5 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-primary/15 text-primary flex items-center justify-center text-xs font-bold">
                        {m.avatar}
                      </div>
                      <div>
                        <p className="font-semibold text-foreground">
                          {m.name}
                        </p>
                        <p className="text-xs text-muted-foreground flex items-center gap-1">
                          <Mail size={10} /> {m.email}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                        roleStyle[m.role] || 'bg-muted text-muted-foreground'
                      }`}
                    >
                      {m.role}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                        statusStyle[m.status]
                      }`}
                    >
                      {m.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-muted-foreground text-xs">
                    {m.joined}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="p-2 rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground transition-colors">
                      <MoreHorizontal size={16} />
                    </button>
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
