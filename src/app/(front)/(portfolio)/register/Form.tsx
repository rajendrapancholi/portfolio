'use client';

import React, { useEffect, useState } from 'react';
import { cn } from '@/lib/utils/cn';
import { Label } from '@/components/ui/Lable';
import { Input } from '@/components/ui/Input';
import { FaGithub, FaGoogle } from 'react-icons/fa6';
import { useRouter, useSearchParams } from 'next/navigation';
import { getProviders, useSession } from 'next-auth/react';
import { SubmitHandler, useForm } from 'react-hook-form';
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
  const router = useRouter();
  const params = useSearchParams();
  const callbackUrl = params.get('callbackUrl') || '/';
  const [providers, setProviders] = useState<Providers | null>(null);
  const [localError, setLocalError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      const res = await getProviders();
      setProviders(res as Providers);
    })();
  }, []);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<Inputs>({
    defaultValues: { email: '', password: '' },
  });

  useEffect(() => {
    if (session?.user) {
      router.push(callbackUrl);
    }
  }, [session, callbackUrl, router]);

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    const toastId = toast.loading('Authenticating...');
    setLocalError(null);

    const formData = new FormData();
    formData.append('email', data.email);
    formData.append('password', data.password);

    const result = await loginAction(formData);

    if (result?.error) {
      setLocalError(result.error);
      toast.error(result.error, { id: toastId });
    } else {
      toast.success('Login successful!', { id: toastId });
      router.push(callbackUrl);
      router.refresh();
    }
  };

  return (
    <div className="w-full h-full relative top-0 bg-main-bg">
      <div className="max-w-md my-10 w-full mx-auto rounded-xl md:rounded-2xl p-4 md:p-8 bg-card border border-border shadow-lg shadow-primary/5">
        <h2 className="font-bold text-xl text-foreground flex justify-center items-center">
          Welcome to Rajendra Pancholi
        </h2>

        {(localError || params.get('error')) && (
          <div className="bg-destructive/10 border border-destructive/40 text-destructive p-3 rounded-md text-sm my-4 text-center">
            {localError || params.get('error') || 'Authentication failed'}
          </div>
        )}

        {params.get('success') && (
          <div className="alert text-success my-4">{params.get('success')}</div>
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
              <div className="text-destructive text-xs">
                {errors.email.message}
              </div>
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
              <div className="text-destructive text-xs">
                {errors.password.message}
              </div>
            )}
          </LabelInputContainer>

          <button
            className="relative group/btn bg-primary text-primary-foreground w-full rounded-md h-10 font-medium shadow-md shadow-primary/20 hover:brightness-110 transition-all disabled:opacity-50"
            type="submit"
            disabled={isSubmitting}
          >
            {isSubmitting && <span className="loading loading-spinner mr-2" />}
            Sign In &rarr;
            <BottomGradient />
          </button>

          <div className="bg-linear-to-r from-transparent via-border to-transparent my-8 h-px w-full" />

          <div className="flex flex-col space-y-3">
            {providers &&
              Object.values(providers).map((provider) => (
                <button
                  key={provider.name}
                  type="button"
                  onClick={async () => {
                    toast.loading(`Redirecting to ${provider.name}...`);
                    await oauthLogin(provider.id as any);
                  }}
                  className="relative group/btn flex space-x-2 items-center justify-center px-4 w-full text-foreground rounded-md h-10 font-medium border border-border bg-muted/50 hover:bg-muted transition-colors"
                >
                  {provider.name === 'google' && (
                    <FaGoogle className="h-4 w-4 text-muted-foreground" />
                  )}
                  {provider.name === 'github' && (
                    <FaGithub className="h-4 w-4 text-muted-foreground" />
                  )}
                  <span className="text-muted-foreground text-sm capitalize">
                    {provider.name}
                  </span>
                  <BottomGradient />
                </button>
              ))}
          </div>
        </form>

        <div className="bg-linear-to-r from-transparent via-border to-transparent my-8 h-px w-full" />
      </div>
    </div>
  );
};

const BottomGradient = () => {
  return (
    <>
      <span className="group-hover/btn:opacity-100 block transition duration-500 opacity-0 absolute h-px w-full -bottom-px inset-x-0 bg-linear-to-r from-transparent via-primary to-transparent" />
      <span className="group-hover/btn:opacity-100 blur-sm block transition duration-500 opacity-0 absolute h-px w-1/2 mx-auto -bottom-px inset-x-10 bg-linear-to-r from-transparent via-primary to-transparent" />
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
