'use client';
import useSWR from 'swr';
import useSWRMutation from 'swr/mutation';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import Loading from '@/components/Loading';
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
  const router = useRouter();

  const { trigger: deleteUser } = useSWRMutation(
    `/api/admin/users`,

    async (url, { arg }: { arg: { userId: string; }; }) => {
      const toastId = toast.loading('Deleting user...');
      const response = await fetch(`${url}/${arg.userId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const data = await response.json();
      response.ok
        ? toast.success(data.message, {
          id: toastId,
        })
        : toast.error(data.message, { id: toastId });
    }
  );
  if (error) return 'An error has occured!';
  if (!users) return <Loading />;

  return (
    <div>
      <h1 className="card-title my-4">Users</h1>
      <div className="my-3 overflow-hidden bg-base-300 bg-opacity-55 rounded-lg shadow_cyan">
        <div className="scrollbar-x">
          <table className="table">
            <thead>
              <tr>
                <th>Sr.</th>
                <th>ID</th>
                <th>NAME</th>
                <th>EMAIL</th>
                <th>ROLE</th>
                <th>ADMIN</th>
                <th>ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user: Users, index: number) => (
                <tr
                  key={user._id}
                  className="even:bg-base-100 odd:bg-base-300 even:bg-opacity-30 odd:bg-opacity-30 hover "
                >
                  <td>{index + 1}</td>
                  <td>{formatId(user._id)}</td>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td>{user.role}</td>
                  <td>
                    {user.isAdmin ? (
                      <span className="flex-center gap-1">
                        <HiMiniShieldCheck fill="cyan" /> Yes
                      </span>
                    ) : (
                      <span className="flex-center gap-1">
                        <HiMiniUserCircle /> No
                      </span>
                    )}
                  </td>
                  <td>
                    <span className="h-full flex-center gap-3">
                      <Link
                        href={`/admin/users/${user._id}`}
                        className="text-cyan-300 tooltip tooltip-top hover:text-cyan-500 active:text-cyan-600 hover:scale-110 transition-all"
                        data-tip="Edit"
                      >
                        <HiOutlinePencilSquare size={20} />
                      </Link>
                      <button
                        type="button"
                        onClick={() => deleteUser({ userId: user._id })}
                        className="text-red-500 tooltip tooltip-top hover:text-red-600 active:text-red-700 hover:scale-110 transition-all"
                        data-tip="Delete"
                      >
                        <HiMiniTrash size={20} />
                      </button>
                    </span>
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
