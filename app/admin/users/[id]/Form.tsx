'use client';

import { Loader2, Mail, Save, ShieldCheck, UserIcon, X } from 'lucide-react'; // Modern icons
import useSWRMutation from 'swr/mutation';
import useSWR from 'swr';
import toast from 'react-hot-toast';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Loading from '@/components/Loading';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Lable';

interface UserFormData {
  name: string;
  email: string;
  role: "user" | "viewer" | "author" | "admin";
  isAdmin: boolean;
}

export default function UserEditForm({ userId }: { userId: string; }) {
  const router = useRouter();
  const { data, error } = useSWR(`/api/admin/users/${userId}`);

  const { trigger: updateUser, isMutating: isUpdating } = useSWRMutation(
    `/api/admin/users/${userId}`,
    async (url, { arg }: { arg: UserFormData; }) => {
      const res = await fetch(url, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(arg),
      });
      if (!res.ok) throw new Error('Failed to update');
      return res.json();
    }
  );

  const { register, handleSubmit, formState: { errors }, setValue } = useForm<UserFormData>();

  useEffect(() => {
    if (data) {
      Object.keys(data).forEach((key) => setValue(key as any, data[key]));
    }
  }, [data, setValue]);

  const onSubmit = async (formData: UserFormData) => {
    try {
      await updateUser(formData);
      toast.success('User details synced');
      router.push('/admin/users');
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  if (error) return <div className="p-10 text-center text-red-400">User not found</div>;
  if (!data) return <Loading />;

  return (
    <div className="max-w-xl mx-auto my-12 p-8 bg-[#0f172a]/80 backdrop-blur-xl border border-white/10 rounded-3xl shadow-2xl animate-fade-in-up">
      {/* Header */}
      <div className="flex justify-between items-center mb-8 border-b border-white/5 pb-6">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-white">
            Edit <span className="text-blue-500">User</span>
          </h1>
          <p className="text-sm text-gray-400 mt-1">Update account details and permissions</p>
        </div>
        <div className="bg-blue-500/10 text-blue-400 px-3 py-1 rounded-full text-xs font-mono border border-blue-500/20">
          ID: {userId.slice(-6).toUpperCase()}
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Name Field */}
        <div className="space-y-2">
          <Label htmlFor="name" className="text-gray-300 flex items-center gap-2">
            <UserIcon size={14} /> Full Name
          </Label>
          <Input
            id="name"
            {...register('name', { required: 'Name is required' })}
            className="bg-white/5 border-white/10 focus:border-blue-500 glass-input-focus transition-all duration-300 h-12 text-white"
          />
          {errors.name && <span className="text-xs text-red-400">{(errors.name as any).message}</span>}
        </div>

        {/* Email Field */}
        <div className="space-y-2">
          <Label htmlFor="email" className="text-gray-300 flex items-center gap-2">
            <Mail size={14} /> Email Address
          </Label>
          <Input
            id="email"
            type="email"
            {...register('email', { required: 'Valid email required' })}
            className="bg-white/5 border-white/10 focus:border-blue-500 glass-input-focus transition-all duration-300 h-12 text-white"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Role Field */}
          <div className="space-y-2">
            <Label className="text-gray-300 flex items-center gap-2">
              <ShieldCheck size={14} /> Role
            </Label>
            <select
              {...register('role')}
              className="w-full bg-white/5 border border-white/10 rounded-lg h-12 px-3 text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all cursor-pointer"
            >
              <option className="bg-slate-900" value="user">User</option>
              <option className="bg-slate-900" value="viewer">Viewer</option>
              <option className="bg-slate-900" value="author">Author</option>
              <option className="bg-slate-900" value="admin">Admin</option>
            </select>
          </div>

          {/* Admin Toggle */}
          <div className="flex flex-col justify-end">
            <label className="group flex items-center justify-between p-3 rounded-xl border border-white/10 bg-white/5 cursor-pointer hover:bg-white/10 transition-all">
              <span className="text-sm font-medium text-gray-300">Admin Access</span>
              <div className="relative">
                <input type="checkbox" {...register('isAdmin')} className="sr-only peer" />
                <div className="w-10 h-5 bg-gray-700 rounded-full peer peer-checked:bg-blue-600 transition-colors after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-transform peer-checked:after:translate-x-5"></div>
              </div>
            </label>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 pt-4">
          <button
            type="submit"
            disabled={isUpdating}
            className="flex-1 flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 rounded-xl transition-all active:scale-[0.98] disabled:bg-gray-700 disabled:cursor-not-allowed"
          >
            {isUpdating ? <Loader2 className="animate-spin" /> : <Save size={18} />}
            {isUpdating ? 'Processing...' : 'Update Settings'}
          </button>

          <Link
            href="/admin/users"
            className="flex items-center justify-center gap-2 px-8 py-3 border border-white/10 rounded-xl text-gray-300 hover:bg-white/5 transition-all active:scale-[0.98]"
          >
            <X size={18} />
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}
