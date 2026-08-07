'use client';
import React, { useEffect, useState } from 'react';

import { cn } from '@/lib/utils/cn';
import { Label } from '@/components/ui/Lable';
import { Input } from '@/components/ui/Input';
import { FaGithub, FaGoogle } from 'react-icons/fa6';
import { useRouter, useSearchParams } from 'next/navigation';
import { signIn, getProviders, useSession } from 'next-auth/react';
import { SubmitHandler, useForm } from 'react-hook-form';

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
  const [providers, setProviders] = useState<Providers | null>(null);

  useEffect(() => {
    (async () => {
      const res = await getProviders();
      setProviders(res as Providers);
    })();
  }, [setProviders]);

  const params = useSearchParams();
  let callbackUrl = params.get('callbackUrl') || '/';
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<Inputs>({
    defaultValues: {
      email: '',
      password: '',
    },
  });
  useEffect(() => {
    if (session && session.user) {
      router.push(callbackUrl);
    }
  }, [callbackUrl, params, router, session]);

  const formSubmit: SubmitHandler<Inputs> = async (form) => {
    const { email, password } = form;
    signIn('credentials', {
      email,
      password,
    });
  };

  return (
    <div className="dark:bg-black w-full h-full relative top-0">
      <div className="max-w-md my-10 w-full mx-auto rounded-xl md:rounded-2xl p-4 md:p-8 shadow-sm shadow-blue-500">
        <h2 className="font-bold text-xl text-neutral-800 dark:text-neutral-200 flex justify-center items-center">
          Welcome to Rajendra Pancholi
        </h2>

        {/* check if user succfully sing in */}
        {params.get('error') && (
          <div className="alert text-error">
            {params.get('error') === 'CredentialsSignin'
              ? 'Invalid email or password'
              : params.get('error')}
          </div>
        )}
        {params.get('success') && (
          <div className="alert text-success">{params.get('success')}</div>
        )}

        <form className="pt-8" onSubmit={handleSubmit(formSubmit)}>
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
            className="bg-gradient-to-br relative group/btn from-black dark:from-zinc-900 dark:to-zinc-900 to-neutral-600 block dark:bg-zinc-800 w-full text-white rounded-md h-10 font-medium shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset] dark:shadow-[0px_1px_0px_0px_var(--zinc-800)_inset,0px_-1px_0px_0px_var(--zinc-800)_inset]"
            type="submit"
            disabled={isSubmitting}
          >
            {isSubmitting && (
              <span className="cursor-not-allowed loading loading-spinner" />
            )}
            Sign In &rarr;
            <BottomGradient />
          </button>

          <div className="bg-gradient-to-r from-transparent via-neutral-300 dark:via-neutral-700 to-transparent my-8 sm:h-[1px] h-[2px] w-full" />

          <div className="flex flex-col space-y-4">
            {/* All login Providers */}
            {providers &&
              Object.values(providers).map((provider) => (
                <button
                  key={provider.name}
                  type="button"
                  onClick={() => {
                    signIn(provider.id);
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
        <div className="bg-gradient-to-r from-transparent via-neutral-300 dark:via-neutral-700 to-transparent my-8 sm:h-[1px] h-[2px] w-full" />
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
      <span className="group-hover/btn:opacity-100 block transition duration-500 opacity-0 absolute h-px w-full -bottom-px inset-x-0 bg-gradient-to-r from-transparent via-blue-500 to-transparent" />
      <span className="group-hover/btn:opacity-100 blur-sm block transition duration-500 opacity-0 absolute h-px w-1/2 mx-auto -bottom-px inset-x-10 bg-gradient-to-r from-transparent via-blue-500 to-transparent" />
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
