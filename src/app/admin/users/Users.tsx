'use client';

import useSWR from 'swr';
import useSWRMutation from 'swr/mutation';
import { toast } from 'react-hot-toast';
import { Loading } from '@/components/Loading';
import { formatId } from '@/lib/utils/formatter';
import Link from 'next/link';
import {
  HiMiniTrash,
  HiOutlinePencilSquare,
  HiMiniShieldCheck,
  HiMiniUserCircle,
} from 'react-icons/hi2';
import { User as Users } from '@/lib/models/UserModel';

export default function User() {
  const { data: users, error } = useSWR(`/api/admin/users`);

  const { trigger: deleteUser } = useSWRMutation(
    `/api/admin/users`,
    async (url, { arg }: { arg: { userId: string } }) => {
      const toastId = toast.loading('Deleting user...');
      const response = await fetch(`${url}/${arg.userId}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
      });
      const data = await response.json();
      response.ok
        ? toast.success(data.message, { id: toastId })
        : toast.error(data.message, { id: toastId });
    },
  );

  if (error) {
    return (
      <div className="flex items-center justify-center p-16 text-destructive font-medium">
        An error has occurred!
      </div>
    );
  }

  if (!users) return <Loading />;

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-border pb-5">
        <div>
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
            Users
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Manage all registered users
          </p>
        </div>
        <span className="badge badge-primary">{users.length} total</span>
      </div>

      {/* Table Card */}
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="table w-full">
            <thead>
              <tr className="border-b border-border bg-muted/40">
                <th className="w-12">#</th>
                <th>ID</th>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Admin</th>
                <th className="text-center">Actions</th>
              </tr>
            </thead>

            <tbody>
              {users.map((user: Users, index: number) => (
                <tr
                  key={user._id}
                  className="border-b border-border/50 transition-colors hover:bg-muted/40"
                >
                  <td className="font-mono text-xs text-muted-foreground">
                    {index + 1}
                  </td>

                  <td className="font-mono text-xs text-muted-foreground">
                    {formatId(user._id)}
                  </td>

                  <td className="font-medium">{user.name}</td>

                  <td className="text-sm text-muted-foreground">
                    {user.email}
                  </td>

                  <td>
                    <span className="badge badge-outline badge-sm capitalize">
                      {user.role}
                    </span>
                  </td>

                  <td>
                    {user.isAdmin ? (
                      <span className="inline-flex items-center gap-1.5 text-sm font-medium text-primary">
                        <HiMiniShieldCheck size={16} />
                        Yes
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 text-sm text-muted-foreground">
                        <HiMiniUserCircle size={16} />
                        No
                      </span>
                    )}
                  </td>

                  <td>
                    <div className="flex items-center justify-center gap-1">
                      <Link
                        href={`/admin/users/${user._id}`}
                        className="btn btn-icon btn-sm text-primary tooltip tooltip-top"
                        data-tip="Edit"
                      >
                        <HiOutlinePencilSquare size={17} />
                      </Link>
                      <button
                        type="button"
                        onClick={() => deleteUser({ userId: user._id })}
                        className="btn btn-icon btn-sm text-destructive tooltip tooltip-top tooltip-error"
                        data-tip="Delete"
                      >
                        <HiMiniTrash size={17} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="border-t border-border bg-muted/30 px-5 py-3 text-sm text-muted-foreground">
          Showing {users.length} user{users.length !== 1 ? 's' : ''}
        </div>
      </div>
    </div>
  );
}
