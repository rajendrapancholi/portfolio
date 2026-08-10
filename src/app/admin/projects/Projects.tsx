'use client';

import { useState } from 'react';
import { toast } from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import useSWR from 'swr';
import useSWRMutation from 'swr/mutation';
import { Loading } from '@/components/Loading';
import { formatId } from '@/lib/utils/formatter';
import Link from 'next/link';
import {
  HiMiniTrash,
  HiOutlinePencilSquare,
  HiChevronLeft,
  HiChevronRight,
} from 'react-icons/hi2';
import { Project } from '@/lib/models/ProjectModel';
import Image from 'next/image';
import { FaLocationArrow, FaPen } from 'react-icons/fa6';
import { handleCloudinaryAdminDelete } from '@/app/actions/adminCloudinary';

const Projects = () => {
  const { data: projects, error } = useSWR(`/api/admin/projects`);
  const router = useRouter();

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  const { trigger: deleteProject } = useSWRMutation(
    `/api/admin/projects`,
    async (url, { arg }: { arg: { projectId: string | any; img: string } }) => {
      const toastId = toast.loading('Deleting project...');
      const response = await fetch(`${url}/${arg.projectId}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
      });
      const data = await response.json();
      if (response.ok) {
        const succ = await handleCloudinaryAdminDelete(arg.img);
        toast.success('Project deleted successfully.', { id: toastId });
        if (succ) toast.success('Image deleted!');
        else toast.error(`Image deletion failed!`);
      } else {
        toast.error(data.message, { id: toastId });
      }
    },
  );

  const { trigger: createProject, isMutating: isCreating } = useSWRMutation(
    `/api/admin/projects`,
    async (url) => {
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });
      const data = await response.json();
      if (!response.ok) return toast.error(data.message);
      toast.success('Project created successfully.');
      router.push(`/admin/projects/${data.project._id}`);
    },
  );

  if (error) {
    return (
      <div className="flex items-center justify-center p-16 text-destructive font-medium">
        An error has occurred.
      </div>
    );
  }

  if (!projects) return <Loading />;

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentProjects = projects.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(projects.length / itemsPerPage);

  const today = new Date().toLocaleDateString('en-IN', {
    timeZone: 'Asia/Kolkata',
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-col gap-4 border-b border-border pb-5 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
            Welcome, Admin
          </h1>
          <p className="mt-1 text-xs font-medium uppercase tracking-widest text-primary">
            {today}
          </p>
        </div>

        <button
          onClick={() => createProject()}
          disabled={isCreating}
          className="btn btn-primary gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold disabled:opacity-60"
        >
          {isCreating ? (
            <span className="loading-spinner size-4" />
          ) : (
            <FaPen size={14} />
          )}
          New Project
        </button>
      </div>

      {/* Table Card */}
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="table w-full">
            <thead>
              <tr className="border-b border-border bg-muted/40">
                <th className="w-12">#</th>
                <th>ID</th>
                <th>Image</th>
                <th>Title</th>
                <th>Description</th>
                <th>Live</th>
                <th>Stack</th>
                <th className="text-center">Actions</th>
              </tr>
            </thead>

            <tbody>
              {currentProjects.map((project: Project, index: number) => (
                <tr
                  key={project._id}
                  className="border-b border-border/50 transition-colors hover:bg-muted/40"
                >
                  <td className="font-mono text-xs text-muted-foreground">
                    {indexOfFirstItem + index + 1}
                  </td>

                  <td className="font-mono text-xs text-muted-foreground">
                    {formatId(project._id!)}
                  </td>

                  {/* Image + Hover Preview */}
                  <td>
                    <div className="group/img relative">
                      <div className="avatar size-10 overflow-hidden rounded-xl ring-1 ring-border transition-all group-hover/img:ring-primary group-hover/img:scale-105">
                        <Image
                          src={project.img}
                          alt={project.title}
                          width={40}
                          height={40}
                          className="object-cover"
                        />
                      </div>

                      {/* Hover Preview */}
                      <div className="invisible absolute left-12 top-0 z-50 scale-95 opacity-0 transition-all duration-200 group-hover/img:visible group-hover/img:scale-100 group-hover/img:opacity-100">
                        <div className="card overflow-hidden shadow-xl">
                          <div className="relative h-32 w-48">
                            <Image
                              src={project.img}
                              alt="Preview"
                              fill
                              className="object-cover"
                              sizes="192px"
                            />
                          </div>
                          <div className="flex items-center justify-between gap-2 px-3 py-2">
                            <div className="min-w-0">
                              <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                                Preview
                              </p>
                              <p className="truncate text-xs font-semibold">
                                {project.title}
                              </p>
                            </div>
                            <Link
                              href={project.link}
                              target="_blank"
                              className="text-primary transition-transform hover:scale-110"
                            >
                              <FaLocationArrow size={12} />
                            </Link>
                          </div>
                        </div>
                      </div>
                    </div>
                  </td>

                  <td className="max-w-35 font-medium">
                    <span className="line-clamp-1">{project.title}</span>
                  </td>

                  <td className="max-w-45">
                    <span className="line-clamp-1 text-sm text-muted-foreground">
                      {project.des}
                    </span>
                  </td>

                  <td>
                    <Link
                      href={project.link}
                      target="_blank"
                      className="btn btn-ghost btn-xs text-primary"
                    >
                      Visit
                    </Link>
                  </td>

                  <td>
                    <div className="flex -space-x-1.5">
                      {project.iconLists.map((icon: any, i: number) => (
                        <div
                          key={i}
                          className="size-7 overflow-hidden rounded-full border-2 border-card bg-muted"
                        >
                          <Image
                            width={28}
                            height={28}
                            src={icon}
                            alt="tech"
                            className="object-contain p-0.5"
                          />
                        </div>
                      ))}
                    </div>
                  </td>

                  <td>
                    <div className="flex items-center justify-center gap-1">
                      <Link
                        href={`/admin/projects/${project._id}`}
                        className="btn btn-icon btn-sm text-primary tooltip tooltip-top"
                        data-tip="Edit"
                      >
                        <HiOutlinePencilSquare size={17} />
                      </Link>
                      <button
                        onClick={() =>
                          deleteProject({
                            projectId: project._id,
                            img: project.img,
                          })
                        }
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

        {/* Pagination */}
        <div className="flex flex-col items-center justify-between gap-4 border-t border-border bg-muted/30 px-5 py-4 sm:flex-row">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span>Showing</span>
            <span className="badge badge-outline badge-sm font-semibold">
              {indexOfFirstItem + 1} –{' '}
              {Math.min(indexOfLastItem, projects.length)}
            </span>
            <span>of {projects.length}</span>
          </div>

          <div className="join">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => p - 1)}
              className="btn btn-sm join-item btn-ghost disabled:opacity-40"
            >
              <HiChevronLeft size={18} />
            </button>

            {[...Array(totalPages)].map((_, i) => (
              <button
                key={i + 1}
                onClick={() => setCurrentPage(i + 1)}
                className={`btn btn-sm join-item min-w-9 ${
                  currentPage === i + 1 ? 'btn-primary' : 'btn-ghost'
                }`}
              >
                {i + 1}
              </button>
            ))}

            <button
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((p) => p + 1)}
              className="btn btn-sm join-item btn-ghost disabled:opacity-40"
            >
              <HiChevronRight size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Projects;
