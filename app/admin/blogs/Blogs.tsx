'use client';
import { useEffect, useState } from 'react';
import { formatId } from '@/lib/utils/formatter';
import Link from 'next/link';
import { HiMiniTrash, HiOutlinePencilSquare, HiChevronLeft, HiChevronRight } from 'react-icons/hi2';
import Image from 'next/image';
import Button from '@/components/ui/Button';
import { FaLocationArrow, FaPen } from 'react-icons/fa6';
import { Blog } from '@/lib/models/BlogModel';
import ModalWrapper from '@/components/ui/ModalWrapper';
import DeleteActionForm from '@/components/admin/DeleteActionForm';

export default function Blogs({ blogs }: { blogs: Blog[]; }) {
    // --- Pagination State ---
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 8;

    // --- Pagination Logic ---
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentBlogs = blogs.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(blogs.length / itemsPerPage);

    const [mounted, setMounted] = useState(false);
    const [isDelOpen, setIsDelOpen] = useState(false);
    const [id, setId] = useState('');

    useEffect(() => {
        setMounted(true);
    }, []);

    const today = new Date().toLocaleDateString('en-IN', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric'
    });

    return (
        <div className="animate-in fade-in duration-500">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-base-content/5 pb-2">
                <div>
                    <h1 className="flex text-3xl text-gray-700 font-extrabold tracking-tight dark:text-white">
                        Blogs
                    </h1>
                    <p className="text-sm font-medium opacity-60 mt-1 uppercase tracking-widest text-primary">
                        {mounted ? today : null}
                    </p>
                </div>
                <Link href="/admin/blogs/create" className="flex items-center gap-3">
                    <Button
                        title="New Blog"
                        icon={<FaPen />}
                        position="left"
                        otherClasses="shadow-lg hover:shadow-blue-500/20 transition-all active:scale-95"
                    />
                </Link>
            </div>

            {/* Main Table Container */}
            <div className="md:h-[90vh] h-full overflow-auto flex flex-col justify-between  border border-base-content/10 bg-gray-200 dark:bg-base-300 dark:bg-opacity-55 rounded-2xl transition-all duration-300 shadow_cyan">
                <div>
                    <table className="table text-gray-700 dark:text-gray-200 overflow-auto h-fit w-full border-separate border-spacing-0">
                        <thead>
                            <tr className="bg-base-200/50 dark:bg-base-100/20 text-base-content/70 **:uppercase">
                                <th className="rounded-tl-2xl">#</th>
                                <th>id</th>
                                <th>Image</th>
                                <th>title</th>
                                <th>description</th>
                                <th>live view</th>
                                <th className="rounded-tr-2xl text-center">action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-base-content/5 text-gray-700 dark:text-gray-200">
                            {currentBlogs.map((blog: Blog, index: number) => (
                                <tr
                                    key={blog._id}
                                    className="group hover:bg-blue-50/50 dark:hover:bg-blue-900/10 transition-colors cursor-default"
                                >
                                    <td className="font-mono text-xs opacity-50">{indexOfFirstItem + index + 1}</td>
                                    <td className="font-mono text-xs">{formatId(blog._id!)}</td>
                                    <td>
                                        <div className="avatar group/img relative">
                                            <div className="mask mask-squircle w-10 h-10 ring-2 ring-base-content/5 group-hover/img:ring-primary group-hover/img:scale-105 transition-all duration-300 cursor-zoom-in">
                                                <Image
                                                    src={blog.thumbnail || '/default-blog-thumb.webp'}
                                                    alt="thumb"
                                                    width={40}
                                                    height={40}
                                                    className="object-cover"
                                                />
                                            </div>

                                            {/* --- Image Preview Hover --- */}
                                            <div className="invisible  opacity-0 group-hover/img:visible group-hover/img:opacity-100 absolute z-50 left-12 top-0 transition-all duration-300 transform scale-95 group-hover/img:scale-100">
                                                <div className="p-1 bg-white dark:bg-neutral overflow-hidden rounded-xl shadow-md border border-base-content/10">
                                                    <div className="relative w-48 h-32 rounded-lg">
                                                        <Image
                                                            src={blog.thumbnail || '/default-blog-thumb.webp'}
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
                                                            <p className="text-[10px] font-bold uppercase tracking-wider opacity-50 dark:text-white">Blog Preview</p>
                                                            <Link href={`/blogs/b/${blog.source}/${blog.slug}`} className="text-cyan-400 transition-all duration-300 ease-out group-hover:translate-x-1 group-hover/prv:translate-x-2 group-hover/prv:scale-110 custom-tooltip tooltip-top" data-tip="View Live">
                                                                <FaLocationArrow />
                                                            </Link>
                                                        </div>
                                                        <p className="text-xs font-semibold truncate w-40 dark:text-blue-400">{blog.title}</p>
                                                    </div>
                                                </div>

                                            </div>
                                        </div>
                                    </td>
                                    <td className="font-bold text-gray-700 dark:text-gray-200">{blog.title}</td>
                                    <td className="max-w-50 truncate text-gray-700 dark:text-gray-200 text-sm opacity-80">{blog.description}</td>
                                    <td>
                                        <Link
                                            href={`/blogs/b/${blog.source}/${blog.slug}`}
                                            className="btn btn-ghost btn-xs text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/30 capitalize"
                                        >
                                            View Blog
                                        </Link>
                                    </td>
                                    <td>
                                        <div className="flex justify-center gap-2">
                                            <Link
                                                href={`/admin/blogs/${blog._id}`}
                                                className="btn btn-square btn-ghost btn-sm text-cyan-500 hover:bg-cyan-50 dark:hover:bg-cyan-900/20 tooltip tooltip-top tooltip-info"
                                                data-tip="Edit">
                                                <HiOutlinePencilSquare size={18} />
                                            </Link>
                                            <button
                                                // href={`/admin/blogs/${blog._id}/delete`}
                                                onClick={() => { setIsDelOpen(true); setId(blog._id); }}
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
                {isDelOpen &&
                    <ModalWrapper type='delete' isInterceptedRoute={false} setIsOpen={setIsDelOpen}>
                        <DeleteActionForm id={id} setIsOpen={setIsDelOpen} />
                    </ModalWrapper>
                }
                {/* Pagination Footer */}
                <div className="flex flex-col sm:flex-row items-center justify-between px-6 py-5 bg-base-200/30 dark:bg-base-100/10 border-t border-base-content/5">
                    <div className="flex items-center gap-2 text-sm text-base-content/60">
                        <span>Showing</span>
                        <span className="badge badge-outline badge-sm font-bold">{indexOfFirstItem + 1} - {Math.min(indexOfLastItem, blogs.length)}</span>
                        <span>of {blogs.length} entries</span>
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
