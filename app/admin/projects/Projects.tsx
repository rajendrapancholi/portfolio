'use client';
import { toast } from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import useSWR from 'swr';
import useSWRMutation from 'swr/mutation';
import Loading from '@/components/Loading';
import { formatDes, formatId } from '@/lib/utils';
import Link from 'next/link';
import { HiMiniTrash, HiOutlinePencilSquare } from 'react-icons/hi2';
import { Project } from '@/lib/models/ProjectModel';
import Image from 'next/image';
import Button from '@/components/ui/Button';
import { FaPen } from 'react-icons/fa6';

const Projects = () => {
  const { data: projects, error } = useSWR(`/api/admin/projects`);
  const router = useRouter();

  const { trigger: deleteProject } = useSWRMutation(
    `/api/admin/projects`,
    async (url, { arg }: { arg: { projectId: string | any } }) => {
      const toastId = toast.loading('Deleting project...');
      const response = await fetch(`${url}/${arg.projectId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const data = await response.json();
      if (response.ok) {
        toast.success('Project deleted successfully.', {
          id: toastId,
        });
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
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const data = await response.json();
      if (!response.ok) return toast.error(data.message);

      toast.success('Project created successfully.');
      router.push(`/admin/projects/${data.project._id}`);
    }
  );

  if (error) return 'An error has occurred.';
  if (!projects) return <Loading />;

  return (
    <div className="my-4">
      <div className="flex justify-between items-center">
        <h1 className="card-title py-4">Projects</h1>
        <div className="max-sm:w-28 p-2">
          {isCreating && <span className="loading loading-spinner"></span>}
          <Button
            title="Create"
            icon={<FaPen />}
            handleClick={() => createProject()}
            position="left"
          />
        </div>
      </div>
      <div className="overflow-hidden bg-base-300 bg-opacity-55 rounded-lg shadow-sm shadow-blue-500">
        <div className="overflow-x-auto">
          <table className="table">
            <thead>
              <tr>
                <th></th>
                <th>ID</th>
                <th>IMAGE</th>
                <th>TITLE</th>
                <th>DESCRIPTION</th>
                <th>LINK</th>
                <th>LIVE VIEW</th>
                <th>TECHNOLOLY</th>
                <th>ACTION</th>
              </tr>
            </thead>
            <tbody>
              {projects.map((project: Project, index: number) => (
                <tr key={project._id} className="even:bg-base-100 hover">
                  <td>{index + 1}</td>
                  <td>{formatId(project._id!)}</td>
                  <td>
                    <Image
                      src={project.img}
                      alt="project_image"
                      width={50}
                      height={50}
                      className="mask mask-square w-12 h-12"
                    />
                  </td>
                  <td>{project.title}</td>
                  <td>{formatDes(project.des)}</td>
                  <td>{project.link}</td>
                  <td>
                    <Link href={project.link} className="hover:underline">
                      Click here
                    </Link>
                  </td>

                  <td>
                    <div className="flex">
                      {project.iconLists.map((icon: any, i: number) => (
                        <div
                          key={i}
                          className="border border-white/[.2] rounded-full bg-black lg:w-6 lg:h-6 w-5 h-5 flex justify-center items-center"
                          style={{
                            transform: `translateX(-${5 * i + 2}px)`,
                          }}
                        >
                          <Image
                            width={25}
                            height={25}
                            src={icon}
                            alt={`icon${i + 1}`}
                            className="p-0.5 bg-white/30 rounded-full"
                          />
                        </div>
                      ))}
                    </div>
                  </td>
                  <td>
                    <span className="h-full flex-center gap-3">
                      <Link
                        href={`/admin/projects/${project._id}`}
                        className="text-cyan-300 tooltip tooltip-top hover:text-cyan-500 active:text-cyan-600 hover:scale-110 transition-all"
                        data-tip="Edit"
                      >
                        <HiOutlinePencilSquare size={20} />
                      </Link>
                      <button
                        type="button"
                        onClick={() =>
                          deleteProject({ projectId: project._id })
                        }
                        className="text-red-500 tooltip tooltip-top hover:text-red-600 active:text-red-700 hover:scale-110 transition-all"
                        data-tip="Delete"
                      >
                        <HiMiniTrash size={20} />
                      </button>
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Projects;
