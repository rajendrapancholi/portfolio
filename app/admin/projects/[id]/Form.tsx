"use client";
import useSWRMutation from "swr/mutation";
import useSWR, { mutate } from "swr";
import toast from "react-hot-toast";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import { formatId } from "@/lib/utils/formatter";
import { useRouter } from "next/navigation";
import { Project } from "@/lib/models/ProjectModel";
import Loading from "@/components/Loading";

import { iconList } from "@/data";
import Image from "next/image";
import Button from "@/components/ui/Button";
import {
  HiClipboardDocumentCheck,
  HiOutlineLink,
  HiOutlinePencil,
  HiOutlinePhoto,
} from "react-icons/hi2";
import { Label } from "@/components/ui/Lable";
import { Input } from "@/components/ui/Input";
import Thumbnail from "@/components/blog/Thumbnail";

export default function ProjectEditForm({ projectId }: { projectId: string }) {
  const [showThumbnailModal, setShowThumbnailModal] = useState(false);
  const [previewImg, setPreviewImg] = useState<string>("");

  const { data, error } = useSWR(`/api/admin/projects/${projectId}`);
  const router = useRouter();

  const { trigger: updateProject, isMutating: _isUpdating } = useSWRMutation(
    `/api/admin/projects/${projectId}`,
    async (url, { arg }) => {
      const res = await fetch(`${url}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(arg),
      });
      const resdata = await res.json();
      if (!res.ok) return toast.error(resdata.message);

      toast.success("Project updated successfully");
      router.push("/admin/projects");
    },
  );

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<Project>({
    defaultValues: {
      title: "",
      des: "",
      link: "/link",
      img: "/img",
      iconLists: [],
    },
  });

  useEffect(() => {
    if (!data) return;
    setValue("title", data.title);
    setValue("des", data.des);
    setValue("link", data.link);
    setValue("iconLists", data.iconLists);

    if (!previewImg) {
      setValue("img", data.img);
      setPreviewImg(data.img !== "/img" ? data.img : "");
    }
  }, [data]);

  const formSubmit = async (formData: any) => {
    console.log("Submitting with image:", formData.img);
    console.log("Debug formdata: ", formData);
    await updateProject(formData);
  };
  if (error) return error.message;
  if (!data) return <Loading />;
  return (
    <div className="max-w-5xl mx-auto p-4 md:p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8 border-b border-white/10 pb-6">
        <div>
          <h1 className="text-3xl font-bold bg-linear-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
            Edit Project
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            ID: {formatId(projectId)}
          </p>
        </div>
        <Link
          href="/admin/projects"
          className="text-gray-400 hover:text-white transition-colors text-sm"
        >
          &larr; Back to Projects
        </Link>
      </div>

      <form
        onSubmit={handleSubmit(formSubmit)}
        className="grid grid-cols-1 lg:grid-cols-3 gap-8"
      >
        {/* Left Column: Media & Tech Stack */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-[#101012] border border-white/10 rounded-2xl p-6 shadow-xl">
            <Label className="text-gray-300 mb-4 block font-semibold">
              Project Thumbnail
            </Label>
            <div className="relative group overflow-hidden rounded-xl bg-black/40 border border-white/5 aspect-video flex items-center justify-center">
              {previewImg ? (
                <img
                  src={previewImg}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  alt="project"
                />
              ) : (
                <div className="text-center p-4">
                  <HiOutlinePhoto className="mx-auto text-4xl text-gray-600 mb-2" />
                  <p className="text-xs text-gray-500">No image uploaded</p>
                </div>
              )}
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <button
                  type="button"
                  onClick={() => setShowThumbnailModal(true)}
                  className="bg-blue-600 hover:bg-blue-500 text-white text-xs px-4 py-2 rounded-full transition-all transform translate-y-4 group-hover:translate-y-0"
                >
                  Change Image
                </button>
              </div>
            </div>
            <input type="hidden" {...register("img")} />
          </div>

          <div className="bg-[#101012] border border-white/10 rounded-2xl p-6 shadow-xl">
            <Label className="text-gray-300 mb-2 block font-semibold">
              Tech Stack
            </Label>
            <p className="text-[10px] text-gray-500 uppercase tracking-widest mb-4">
              Select up to 5 icons
            </p>
            <div className="grid grid-cols-4 gap-3">
              {iconList.map((icon: any, i: number) => (
                <label key={i} className="relative cursor-pointer group">
                  <input
                    type="checkbox"
                    value={icon.img}
                    {...register("iconLists")}
                    className="peer hidden"
                  />
                  <div
                    className="w-full aspect-square rounded-lg bg-white/5 border border-white/5 flex items-center justify-center transition-all peer-checked:border-blue-500 peer-checked:bg-blue-500/20 group-hover:bg-white/10  custom-tooltip tooltip-top"
                    data-tip={icon.title}
                  >
                    <Image
                      width={24}
                      height={24}
                      src={icon.img}
                      alt="icon"
                      className="w-6 h-6 object-contain tooltip tooltip-left"
                    />
                  </div>
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Form Inputs */}
        <div className="lg:col-span-2 bg-[#101012] border border-white/10 rounded-2xl p-6 md:p-8 shadow-xl">
          <div className="space-y-6">
            <LabelInputContainer>
              <div className="flex items-center gap-2 text-gray-300 mb-1">
                <HiOutlinePencil className="text-blue-400" />
                <Label htmlFor="title" className="font-medium">
                  Project Title
                </Label>
              </div>
              <Input
                id="title"
                {...register("title", { required: "Title is required!" })}
                className="bg-black/20 border-white/10 focus:border-blue-500 h-12 transition-all"
                placeholder="Enter project name..."
              />
              {errors.title && (
                <span className="text-red-500 text-xs mt-1">
                  {errors.title.message}
                </span>
              )}
            </LabelInputContainer>

            <LabelInputContainer>
              <div className="flex items-center gap-2 text-gray-300 mb-1">
                <HiOutlinePencil className="text-purple-400" />
                <Label htmlFor="des" className="font-medium">
                  Description
                </Label>
              </div>
              <textarea
                id="des"
                {...register("des", { required: "Description is required!" })}
                rows={4}
                className="w-full bg-black/20 border border-white/10 rounded-lg p-3 text-sm focus:outline-none focus:border-purple-500 transition-all text-white"
                placeholder="What does this project do?"
              />
              {errors.des && (
                <span className="text-red-500 text-xs mt-1">
                  {errors.des.message}
                </span>
              )}
            </LabelInputContainer>

            <LabelInputContainer>
              <div className="flex items-center gap-2 text-gray-300 mb-1">
                <HiOutlineLink className="text-green-400" />
                <Label htmlFor="link" className="font-medium">
                  Live Demo / Repo Link
                </Label>
              </div>
              <Input
                id="link"
                {...register("link", { required: "Link is required!" })}
                className="bg-black/20 border-white/10 focus:border-green-500 h-12"
                placeholder="https://..."
              />
              {errors.link && (
                <span className="text-red-500 text-xs mt-1">
                  {errors.link.message}
                </span>
              )}
            </LabelInputContainer>
          </div>

          <div className="mt-10 flex items-center gap-4">
            <Button
              title={isSubmitting ? "Saving..." : "Update Project"}
              btnType="submit"
              disabled={isSubmitting}
              icon={<HiClipboardDocumentCheck />}
              position="left"
              otherClasses="w-full md:w-auto py-3 px-8 rounded-xl font-bold shadow-lg shadow-blue-900/20"
            />
            {isSubmitting && (
              <span className="loading loading-spinner text-blue-500" />
            )}
          </div>
        </div>
      </form>

      {showThumbnailModal && (
        <Thumbnail
          currentUrl={previewImg}
          onUpload={(url) => {
            setValue("img", url, { shouldDirty: true });
            setPreviewImg(url);
            mutate(
              `/api/admin/projects/${projectId}`,
              { ...data, img: url },
              false,
            );
          }}
          onClose={() => setShowThumbnailModal(false)}
          blogTitle={data.title}
          type="project"
        />
      )}
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
