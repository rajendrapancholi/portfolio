'use client';

import { Loader2, Mail, Save, ShieldCheck, UserIcon, X } from 'lucide-react';
import useSWRMutation from 'swr/mutation';
import useSWR from 'swr';
import toast from 'react-hot-toast';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Loading } from '@/components/Loading';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Lable';

interface UserFormData {
  name: string;
  email: string;
  role: 'user' | 'viewer' | 'author' | 'admin';
  isAdmin: boolean;
}

export default function UserEditForm({ userId }: { userId: string }) {
  const router = useRouter();
  const { data, error } = useSWR(`/api/admin/users/${userId}`);

  const { trigger: updateUser, isMutating: isUpdating } = useSWRMutation(
    `/api/admin/users/${userId}`,
    async (url, { arg }: { arg: UserFormData }) => {
      const res = await fetch(url, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(arg),
      });
      if (!res.ok) throw new Error('Failed to update');
      return res.json();
    },
  );

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<UserFormData>();

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

  if (error)
    return (
      <div className="p-10 text-center text-destructive">User not found</div>
    );
  if (!data) return <Loading />;

  return (
    <div className="max-w-xl mx-auto my-12 p-8 bg-card border border-border rounded-3xl shadow-xl animate-fade-in-up">
      {/* Header */}
      <div className="flex justify-between items-center mb-8 border-b border-border pb-6">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-foreground">
            Edit <span className="text-primary">User</span>
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Update account details and permissions
          </p>
        </div>
        <div className="bg-primary/10 text-primary px-3 py-1 rounded-full text-xs font-mono border border-primary/20">
          ID: {userId.slice(-6).toUpperCase()}
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Name */}
        <div className="space-y-2">
          <Label
            htmlFor="name"
            className="text-muted-foreground flex items-center gap-2"
          >
            <UserIcon size={14} /> Full Name
          </Label>
          <Input
            id="name"
            {...register('name', { required: 'Name is required' })}
            className="bg-muted/40 border-border focus:border-primary h-12 transition-all duration-300 text-foreground"
          />
          {errors.name && (
            <span className="text-xs text-destructive">
              {(errors.name as any).message}
            </span>
          )}
        </div>

        {/* Email */}
        <div className="space-y-2">
          <Label
            htmlFor="email"
            className="text-muted-foreground flex items-center gap-2"
          >
            <Mail size={14} /> Email Address
          </Label>
          <Input
            id="email"
            type="email"
            {...register('email', { required: 'Valid email required' })}
            className="bg-muted/40 border-border focus:border-primary h-12 transition-all duration-300 text-foreground"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Role */}
          <div className="space-y-2">
            <Label className="text-muted-foreground flex items-center gap-2">
              <ShieldCheck size={14} /> Role
            </Label>
            <select
              {...register('role')}
              className="w-full bg-muted/40 border border-border rounded-lg h-12 px-3 text-foreground focus:ring-2 focus:ring-primary/30 focus:border-primary outline-none transition-all cursor-pointer"
            >
              <option value="user">User</option>
              <option value="viewer">Viewer</option>
              <option value="author">Author</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          {/* Admin Toggle */}
          <div className="flex flex-col justify-end">
            <label className="group flex items-center justify-between p-3 rounded-xl border border-border bg-muted/40 cursor-pointer hover:bg-muted transition-all">
              <span className="text-sm font-medium text-foreground">
                Admin Access
              </span>
              <div className="relative">
                <input
                  type="checkbox"
                  {...register('isAdmin')}
                  className="sr-only peer"
                />
                <div className="w-10 h-5 bg-muted rounded-full peer peer-checked:bg-primary transition-colors after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-background after:rounded-full after:h-4 after:w-4 after:transition-transform peer-checked:after:translate-x-5 border border-border" />
              </div>
            </label>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 pt-4">
          <button
            type="submit"
            disabled={isUpdating}
            className="flex-1 flex items-center justify-center gap-2 bg-primary hover:brightness-110 text-primary-foreground font-bold py-3 rounded-xl transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed shadow-md shadow-primary/20"
          >
            {isUpdating ? (
              <Loader2 className="animate-spin" size={18} />
            ) : (
              <Save size={18} />
            )}
            {isUpdating ? 'Processing...' : 'Update Settings'}
          </button>
          <Link
            href="/admin/users"
            className="flex items-center justify-center gap-2 px-8 py-3 border border-border rounded-xl text-muted-foreground hover:bg-muted hover:text-foreground transition-all active:scale-[0.98]"
          >
            <X size={18} />
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}
