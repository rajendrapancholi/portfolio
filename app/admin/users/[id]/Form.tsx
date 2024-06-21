'use client';
import useSWRMutation from 'swr/mutation';
import useSWR from 'swr';
import toast from 'react-hot-toast';
import Link from 'next/link';
import { ValidationRule, useForm } from 'react-hook-form';
import { useEffect } from 'react';
import { User } from '@/lib/models/UserModel';
import { formatId } from '@/lib/utils';
import { useRouter } from 'next/navigation';
import Loading from '@/components/Loading';

import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Lable';

export default function UserEditForm({ userId }: { userId: string }) {
  const { data, error } = useSWR(`/api/admin/users/${userId}`);
  const router = useRouter();
  const { trigger: updateUser, isMutating: isUpdating } = useSWRMutation(
    `/api/admin/users/${userId}`,
    async (url, { arg }) => {
      const res = await fetch(`${url}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(arg),
      });
      const data = await res.json();
      if (!res.ok) return toast.error(data.message);

      toast.success('User updated successfully');
      router.push('/admin/users');
    }
  );

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<User>();

  useEffect(() => {
    if (!data) return;
    setValue('name', data.name);
    setValue('email', data.email);
    setValue('isAdmin', data.isAdmin);
  }, [data, setValue]);

  const formSubmit = async (formData: any) => {
    await updateUser(formData);
  };

  if (error) return error.message;
  if (!data) return <Loading />;

  const FormInput = ({
    id,
    name,
    required,
    pattern,
  }: {
    id: keyof User;
    name: string;
    required?: boolean;
    pattern?: ValidationRule<RegExp>;
  }) => (
    <LabelInputContainer className="mb-4">
      <Label className="label md:w-1/5" htmlFor={id}>
        {name}
      </Label>
      <div className="max-w-md md:max-w-xl">
        <Input
          type="text"
          id={id}
          {...register(id, {
            required: required && `${name} is required`,
            pattern,
          })}
          className="h-14"
        />
        {errors[id]?.message && (
          <div className="text-error">{errors[id]?.message}</div>
        )}
      </div>
    </LabelInputContainer>
  );

  return (
    <div className="my-6">
      <h1 className="text-2xl py-4">Edit User {formatId(userId)}</h1>
      <div className="shadow-md shadow-blue-400 p-2 my-3 rounded-md">
        <form onSubmit={handleSubmit(formSubmit)}>
          <FormInput name="Name" id="name" required />
          <FormInput name="Email Address" id="email" required />

          <div className="md:flex my-3">
            <label className="label md:w-1/5" htmlFor="isAdmin">
              Admin
            </label>
            <div className="md:w-4/5">
              <input
                id="isAdmin"
                type="checkbox"
                className="toggle toggle-primary"
                {...register('isAdmin')}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isUpdating}
            className="btn btn-primary"
          >
            {isUpdating && <span className="loading loading-spinner"></span>}
            Update
          </button>
          <Link className="btn ml-4" href="/admin/users">
            Cancel
          </Link>
        </form>
      </div>
    </div>
  );
}
const LabelInputContainer = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return <div className="flex flex-col space-y-2 w-full">{children}</div>;
};
