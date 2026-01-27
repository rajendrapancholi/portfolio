'use client';
import { useState } from 'react';
import { toast } from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import useSWR from 'swr';
import useSWRMutation from 'swr/mutation';
import Loading from '@/components/Loading';
import { formatId } from '@/lib/utils/formatter';
import Link from 'next/link';
import { HiMiniTrash, HiOutlinePencilSquare, HiChevronLeft, HiChevronRight } from 'react-icons/hi2';
import { Project } from '@/lib/models/ProjectModel';
import Image from 'next/image';
import Button from '@/components/ui/Button';
import { FaLocationArrow, FaPen } from 'react-icons/fa6';

const Projects = () => {
  const { data: projects, error } = useSWR(`/api/admin/projects`);
  const router = useRouter();

  // --- Pagination State ---
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  const { trigger: deleteProject } = useSWRMutation(
    `/api/admin/projects`,
    async (url, { arg }: { arg: { projectId: string | any; }; }) => {
      const toastId = toast.loading('Deleting project...');
      const response = await fetch(`${url}/${arg.projectId}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
      });
      const data = await response.json();
      if (response.ok) {
        toast.success('Project deleted successfully.', { id: toastId });
      } else {
        toast.error(data.message, { id: toastId });
      }
    }
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
    }
  );

  if (error) return 'An error has occurred.';
  if (!projects) return <Loading />;

  // --- Pagination Logic ---
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
    <div className="animate-in fade-in duration-500">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-base-content/5 pb-2">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-base-content dark:text-white">
            Welcome, Admin
          </h1>
          <p className="text-sm font-medium opacity-60 mt-1 uppercase tracking-widest text-primary">
            {today}
          </p>
        </div>
        <div className="flex items-center gap-3">
          {isCreating && <span className="loading loading-spinner text-primary" />}
          <Button
            title="New Project"
            icon={<FaPen />}
            handleClick={() => createProject()}
            position="left"
            otherClasses="shadow-lg hover:shadow-blue-500/20 transition-all active:scale-95"
          />
        </div>
      </div>

      {/* Main Table Container */}
      <div className="md:h-[90vh] h-full overflow-auto flex flex-col justify-between  border border-base-content/10 bg-white dark:bg-base-300 dark:bg-opacity-55 rounded-2xl shadow-xl dark:shadow-blue-900/20 transition-all duration-300">
        <div>
          <table className="table overflow-auto h-fit w-full border-separate border-spacing-0">
            <thead>
              <tr className="bg-base-200/50 dark:bg-base-100/20 text-base-content/70 **:uppercase">
                <th className="rounded-tl-2xl">#</th>
                <th>id</th>
                <th>Image</th>
                <th>title</th>
                <th>description</th>
                <th>live view</th>
                <th>tech stack</th>
                <th className="rounded-tr-2xl text-center">ACTION</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-base-content/5">
              {currentProjects.map((project: Project, index: number) => (
                <tr
                  key={project._id}
                  className="group hover:bg-blue-50/50 dark:hover:bg-blue-900/10 transition-colors cursor-default"
                >
                  <td className="font-mono text-xs opacity-50">{indexOfFirstItem + index + 1}</td>
                  <td className="font-mono text-xs">{formatId(project._id!)}</td>
                  <td>
                    <div className="avatar group/img relative">
                      <div className="mask mask-squircle w-10 h-10 ring-2 ring-base-content/5 group-hover/img:ring-primary group-hover/img:scale-105 transition-all duration-300 cursor-zoom-in">
                        <Image
                          src={project.img}
                          alt="thumb"
                          width={40}
                          height={40}
                          className="object-cover"
                        />
                      </div>

                      {/* --- Image Preview Hover --- */}
                      <div className="invisible opacity-0 group-hover/img:visible group-hover/img:opacity-100 absolute z-50 left-12 top-0 transition-all duration-300 transform scale-95 group-hover/img:scale-100">
                        <div className="p-1 bg-white dark:bg-neutral overflow-hidden rounded-xl shadow-2xl border border-base-content/10">
                          <div className="relative w-48 h-32 rounded-lg">
                            <Image
                              src={project.img}
                              alt="Preview"
                              fill
                              className="object-cover"
                              sizes="192px"
                            />
                            {/* Subtle overlay for light mode contrast */}
                            <div className="absolute inset-0 bg-black/5 dark:bg-transparent pointer-events-none" />
                          </div>
                          <div className="px-2 py-1.5 group/prv">
                            <div className='flex items-center' >
                              <p className="text-[10px] font-bold uppercase tracking-wider opacity-50 dark:text-white">Project Preview</p>
                              <Link href={project.link} target='_blank' className="text-cyan-400 transition-all duration-300 ease-out group-hover:translate-x-1 group-hover/prv:translate-x-2 group-hover/prv:scale-110 custom-tooltip tooltip-top" data-tip="View Live">
                                <FaLocationArrow />
                              </Link>
                            </div>
                            <p className="text-xs font-semibold truncate w-40 dark:text-blue-400">{project.title}</p>
                          </div>
                        </div>

                      </div>
                    </div>
                  </td>
                  <td className="font-bold text-base-content">{project.title}</td>
                  <td className="max-w-50 truncate text-sm opacity-80">{project.des}</td>
                  <td>
                    <Link
                      href={project.link}
                      target='_blank'
                      className="btn btn-ghost btn-xs text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/30"
                    >
                      Visit Site
                    </Link>
                  </td>
                  <td>
                    <div className="flex -space-x-2">
                      {project.iconLists.map((icon: any, i: number) => (
                        <div key={i} className="avatar border-2 border-white dark:border-base-300 rounded-full bg-blend-color-burn">
                          <div className="w-6 h-6 p-0.5">
                            <Image width={20} height={20} src={icon} alt="icon" />
                          </div>
                        </div>
                      ))}
                    </div>
                  </td>
                  <td>
                    <div className="flex justify-center gap-2">
                      <Link
                        href={`/admin/projects/${project._id}`}
                        className="btn btn-square btn-ghost btn-sm text-cyan-500 hover:bg-cyan-50 dark:hover:bg-cyan-900/20 tooltip tooltip-top tooltip-info"
                        data-tip="Edit">
                        <HiOutlinePencilSquare size={18} />
                      </Link>
                      <button
                        onClick={() => deleteProject({ projectId: project._id })}
                        className="btn btn-square btn-ghost btn-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 tooltip tooltip-top tooltip-error"
                        data-tip="Delete">
                        <HiMiniTrash size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        <div className="flex flex-col sm:flex-row items-center justify-between px-6 py-5 bg-base-200/30 dark:bg-base-100/10 border-t border-base-content/5">
          <div className="flex items-center gap-2 text-sm text-base-content/60">
            <span>Showing</span>
            <span className="badge badge-outline badge-sm font-bold">{indexOfFirstItem + 1} - {Math.min(indexOfLastItem, projects.length)}</span>
            <span>of {projects.length} entries</span>
          </div>

          <div className="join bg-base-100 dark:bg-base-200 border border-base-content/10 shadow-sm mt-4 sm:mt-0">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(prev => prev - 1)}
              className="join-item btn btn-sm hover:btn-primary border-none disabled:bg-transparent"
            >
              <HiChevronLeft size={18} />
            </button>

            {[...Array(totalPages)].map((_, i) => (
              <button
                key={i + 1}
                onClick={() => setCurrentPage(i + 1)}
                className={`join-item btn btn-sm border-none min-w-10 ${currentPage === i + 1
                  ? 'btn-primary shadow-md shadow-blue-500/40'
                  : 'bg-transparent hover:bg-base-content/10'
                  }`}
              >
                {i + 1}
              </button>
            ))}

            <button
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(prev => prev + 1)}
              className="join-item btn btn-sm hover:btn-primary border-none disabled:bg-transparent"
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
