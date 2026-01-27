'use client';

import React, { useEffect, useState } from 'react';
import { cn } from '@/lib/utils/cn';
import { Label } from '@/components/ui/Lable';
import { Input } from '@/components/ui/Input';
import { FaGithub, FaGoogle } from 'react-icons/fa6';
import { useRouter, useSearchParams } from 'next/navigation';
import { signIn, getProviders, useSession } from 'next-auth/react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useAppDispatch } from '@/lib/features/hooks';
import { setSession } from '@/lib/features/auth/authSlice';
import { setError } from '@/lib/features/project/projectSlice';
import { loginAction, oauthLogin } from '@/app/actions/authActions';
import toast from 'react-hot-toast';

interface Provider {
  id: string;
  name: string;
  type: string;
}

interface Providers {
  [key: string]: Provider;
}

type Inputs = {
  email: string;
  password: string;
};
const Form = () => {
  const { data: session } = useSession();
  const dispatch = useAppDispatch();
  const router = useRouter();
  const params = useSearchParams();
  const callbackUrl = params.get('callbackUrl') || '/';

  const [providers, setProviders] = useState<Providers | null>(null);
  const [localError, setLocalError] = useState<string | null>(null);

  // Fetch Providers
  useEffect(() => {
    (async () => {
      const res = await getProviders();
      setProviders(res as Providers);
    })();
  }, []);

  // React Hook Form Setup
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<Inputs>({
    defaultValues: { email: '', password: '' },
  });

  // Single Redirect Effect
  useEffect(() => {
    if (session?.user) {
      router.push(callbackUrl);
    }
  }, [session, callbackUrl, router]);

  // Primary Submit Handler
  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    const toastId = toast.loading('Authenticating...');
    setLocalError(null);

    const formData = new FormData();
    formData.append('email', data.email);
    formData.append('password', data.password);

    const result = await loginAction(formData);
    toast.success('Login successful!', { id: toastId });

    if (result?.error) {
      setLocalError(result.error);
      toast.error(result.error, { id: toastId });
    } else {

      toast.success('Login successful!', { id: toastId });
      // No manual dispatch needed here! router.push triggers the server-side Providers.tsx to update Redux.
      router.push(callbackUrl);
      router.refresh();
    }
  };

  return (
    <div className="dark:bg-black w-full h-full relative top-0">
      <div className="max-w-md my-10 w-full mx-auto rounded-xl md:rounded-2xl p-4 md:p-8 shadow-sm shadow-blue-500">
        <h2 className="font-bold text-xl text-neutral-800 dark:text-neutral-200 flex justify-center items-center">
          Welcome to Rajendra Pancholi
        </h2>

        {/* Display Errors */}
        {(localError || params.get('error')) && (
          <div className="bg-red-500/10 border border-red-500 text-red-500 p-3 rounded-md text-sm my-4 text-center">
            {localError || params.get('error') || "Authentication failed"}
          </div>
        )}
        {params.get('success') && (
          <div className="alert text-success">{params.get('success')}</div>
        )}

        <form className="pt-8" onSubmit={handleSubmit(onSubmit)}>
          <LabelInputContainer className="mb-4">
            <Label htmlFor="email">Email Address</Label>
            <Input
              id="email"
              {...register('email', {
                required: 'Email is required!',
                pattern: {
                  value: /[a-z0-9]+@[a-z]+\.[a-z]{2,3}/,
                  message: 'Email is invalid!',
                },
              })}
              placeholder="example@mail.com"
              type="text"
            />
            {errors.email?.message && (
              <div className="text-red-400 text-xs">{errors.email.message}</div>
            )}
          </LabelInputContainer>
          <LabelInputContainer className="mb-4">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              {...register('password', {
                required: 'Password is required!',
              })}
              placeholder="••••••••"
              type="password"
            />
            {errors.password?.message && (
              <div className="text-error text-xs">
                {errors.password.message}
              </div>
            )}
          </LabelInputContainer>

          <button
            className="bg-linear-to-br relative group/btn from-black dark:from-zinc-900 dark:to-zinc-900 to-neutral-600 block dark:bg-zinc-800 w-full text-white rounded-md h-10 font-medium shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset] dark:shadow-[0px_1px_0px_0px_var(--zinc-800)_inset,0px_-1px_0px_0px_var(--zinc-800)_inset]"
            type="submit"
            disabled={isSubmitting}
          >
            {isSubmitting && (
              <span className="cursor-not-allowed loading loading-spinner" />
            )}
            Sign In &rarr;
            <BottomGradient />
          </button>

          <div className="bg-linear-to-r from-transparent via-neutral-300 dark:via-neutral-700 to-transparent my-8 sm:h-px h-0.5 w-full" />

          <div className="flex flex-col space-y-4">
            {/* All login Providers */}
            {providers &&
              Object.values(providers).map((provider) => (
                <button
                  key={provider.name}
                  type="button"
                  onClick={async () => {
                    toast.loading(`Redirecting to ${provider.name}...`);
                    await oauthLogin(provider.id as any);
                  }}
                  className=" relative group/btn flex space-x-2 items-center justify-center px-4 w-full text-black rounded-md h-10 font-medium shadow-input bg-gray-50 dark:bg-zinc-900 dark:shadow-[0px_0px_1px_1px_var(--neutral-800)]"
                >
                  {provider.name == 'google' && (
                    <FaGoogle className="h-4 w-4 text-neutral-800 dark:text-neutral-300" />
                  )}
                  {provider.name == 'github' && (
                    <FaGithub className="h-4 w-4 text-neutral-800 dark:text-neutral-300" />
                  )}
                  <span className="text-neutral-700 dark:text-neutral-300 text-sm">
                    {provider.name}
                  </span>
                  <BottomGradient />
                </button>
              ))}
          </div>
        </form>
        <div className="bg-linear-to-r from-transparent via-neutral-300 dark:via-neutral-700 to-transparent my-8 sm:h-px h-0.5 w-full" />
        {/* <div>
          Need an account?{' '}
          <Link
            className="hover:underline text-center"
            href={`/register?callbackUrl=${callbackUrl}`}
          >
            Register
          </Link>
        </div> */}
      </div>
    </div>
  );
};

const BottomGradient = () => {
  return (
    <>
      <span className="group-hover/btn:opacity-100 block transition duration-500 opacity-0 absolute h-px w-full -bottom-px inset-x-0 bg-linear-to-r from-transparent via-blue-500 to-transparent" />
      <span className="group-hover/btn:opacity-100 blur-sm block transition duration-500 opacity-0 absolute h-px w-1/2 mx-auto -bottom-px inset-x-10 bg-linear-to-r from-transparent via-blue-500 to-transparent" />
    </>
  );
};

const LabelInputContainer = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <div className={cn('flex flex-col space-y-2 w-full', className)}>
      {children}
    </div>
  );
};

export default Form;
