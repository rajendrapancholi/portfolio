'use client';
import useSWRMutation from 'swr/mutation';
import useSWR from 'swr';
import toast from 'react-hot-toast';
import Link from 'next/link';
import { ValidationRule, useForm } from 'react-hook-form';
import { useEffect } from 'react';
import { formatId } from '@/lib/utils/formatter';
import { useRouter } from 'next/navigation';
import { Project } from '@/lib/models/ProjectModel';
import Loading from '@/components/Loading';

import { iconList } from '@/data';
import Image from 'next/image';
import Button from '@/components/ui/Button';
import { HiClipboardDocumentCheck } from 'react-icons/hi2';
import { Label } from '@/components/ui/Lable';
import { Input } from '@/components/ui/Input';
import { ENV } from '@/config/env';

export default function ProjectEditForm({ projectId }: { projectId: string; }) {
  const { data, error } = useSWR(`/api/admin/projects/${projectId}`);
  const router = useRouter();
  const { trigger: updateProject, isMutating: isUpdating } = useSWRMutation(
    `/api/admin/projects/${projectId}`,
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

      toast.success('Project updated successfully');
      router.push('/admin/projects');
    }
  );

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<Project>({
    defaultValues: {
      title: '',
      des: '',
      link: '/link',
      img: '/img',
      iconLists: [],
    },
  });
  useEffect(() => {
    if (!data) return;
    setValue('title', data.title);
    setValue('des', data.des);
    setValue('link', data.link);
    setValue('img', data.img);
    setValue('iconLists', data.iconLists);
  }, [data, setValue]);

  const formSubmit = async (formData: any) => {
    await updateProject(formData);
  };

  const uploadHandler = async (e: any) => {
    const toastId = toast.loading('Uploading image...');
    try {
      const resSign = await fetch('/api/cloudinary/porject-sign', {
        method: 'POST',
      });
      const { signature, timestamp } = await resSign.json();
      const file = e.target.files[0];
      const formData = new FormData();
      formData.append('file', file);
      formData.append('signature', signature);
      formData.append('timestamp', timestamp);
      formData.append('api_key', ENV.NEXT_PUBLIC_CLOUDINARY_API_KEY!);
      const res = await fetch(
        `https://api.cloudinary.com/v1_1/${ENV.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/upload`,
        {
          method: 'POST',
          body: formData,
        }
      );
      const data = await res.json();
      setValue('img', data.secure_url);
      toast.success('File uploaded successfully', {
        id: toastId,
      });
    } catch (err: any) {
      toast.error(err.message, {
        id: toastId,
      });
    }
  };

  if (error) return error.message;
  if (!data) return <Loading />;

  return (
    <div>
      <h1 className="text-2xl py-4">Edit Project {formatId(projectId)}</h1>
      <div>
        <form
          onSubmit={handleSubmit(formSubmit)}
          className="m-2 rounded-md shadow-sm shadow-blue-400 p-2"
        >
          <div className="md:flex mb-6">
            <label className="label md:w-1/5" htmlFor="imageFile">
              Upload Image
            </label>
            <div className="md:w-4/5">
              <input
                type="file"
                className="file-input w-full max-w-md"
                id="imageFile"
                onChange={uploadHandler}
              />
            </div>
          </div>
          {/* title input */}
          <LabelInputContainer className="mb-4">
            <Label className="label md:w-1/5" htmlFor="title">
              Title
            </Label>
            <div className="max-w-md md:max-w-xl">
              <Input
                type="text"
                id="title"
                {...register('title', {
                  required: 'Title is required!',
                })}
                className="h-14"
              />
              {errors.title?.message && (
                <div className="text-error">{errors.title.message}</div>
              )}
            </div>
          </LabelInputContainer>
          {/* des input */}

          <LabelInputContainer className="mb-4">
            <Label className="label md:w-1/5" htmlFor="des">
              Description
            </Label>
            <div className="max-w-md md:max-w-xl">
              <Input
                type="text"
                id="des"
                {...register('des', {
                  required: 'Description is required!',
                })}
                className="h-14"
              />
              {errors.des?.message && (
                <div className="text-error">{errors.des.message}</div>
              )}
            </div>
          </LabelInputContainer>

          {/* link input */}
          <LabelInputContainer className="mb-4">
            <Label className="label md:w-1/5" htmlFor="link">
              Link
            </Label>
            <div className="max-w-md md:max-w-xl">
              <Input
                type="text"
                id="link"
                {...register('link', {
                  required: 'Link is required!',
                })}
                className="h-14 "
              />
              {errors.link?.message && (
                <div className="text-error">{errors.link.message}</div>
              )}
            </div>
          </LabelInputContainer>
          {/* img input */}
          {/* <LabelInputContainer className="mb-4">
            <Label className="label md:w-1/5" htmlFor="img">
              Image
            </Label>
            <div className="max-w-md md:max-w-xl">
              <Input
                type="text"
                id="img"
                {...register('img', {
                  required: 'Image is required!',
                })}
                className="h-14 "
              />
              {errors.img?.message && (
                <div className="text-error">{errors.img.message}</div>
              )}
            </div>
          </LabelInputContainer> */}

          {/* icon lists input */}
          <div className="md:flex my-6">
            <label className=" md:w-1/5 my-2" htmlFor="iconLists">
              <span className="text-md">Select Icons</span>
              <span className="text-xs"> (any 5 icons select)</span>
            </label>

            <div className="md:w-4/5 flex justify-start items-center gap-1">
              {iconList.map((icon: any, i: number) => (
                <div key={i} className="m-1 md:m-2 ">
                  <Image
                    width={25}
                    height={25}
                    src={icon.img}
                    alt="icon"
                    className="w-8 h-8 bg-white/30 rounded-full p-0.5"
                  />
                  <input
                    type="checkbox"
                    id="iconLists"
                    value={icon.img}
                    {...register('iconLists', {})}
                    className="m-1 md:m-2 checkbox my-2 checkbox-success"
                  />
                </div>
              ))}
            </div>
          </div>
          <Button
            title="Update"
            btnType='submit'
            disabled={isSubmitting}
            icon={<HiClipboardDocumentCheck />}
            position="left"
            otherClasses='max-sm:w-28'
          />
          {isSubmitting && <span className="loading loading-spinner" />}
          <Link className="btn ml-4 " href="/admin/projects">
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
