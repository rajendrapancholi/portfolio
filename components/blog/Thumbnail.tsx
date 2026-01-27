import { handleCloudinaryDelete, handleCloudinaryUpload } from '@/lib/cloudinary';
import { CheckCircle2, CloudUpload, ImageIcon, Loader2, Sparkles, Trash2, X } from 'lucide-react';
import React, { useRef, useState } from 'react';
import toast from 'react-hot-toast';

interface ThumbnailProps {
    currentUrl: string;
    onUpload?: (url: string) => void;
    onClose: () => void;
    blogTitle: string;
}

const Thumbnail = ({ currentUrl, onUpload, onClose, blogTitle }: ThumbnailProps) => {
    const [isUploading, setIsUploading] = useState<boolean>(false);
    const [isDeleting, setIsDeleting] = useState<boolean>(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const onFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        let toastId = toast.loading("Uploading...");
        const file = e.target.files?.[0];
        if (!file) {
            toast.error("File is empty!", { id: toastId });
            return;
        };

        setIsUploading(true);
        const uploadedUrl = await handleCloudinaryUpload(file, currentUrl);

        if (uploadedUrl && onUpload) {
            toast.success("Successfully uploaded!", { id: toastId });
            onUpload(uploadedUrl);
        } else {
            toast.caller("Failed to upload thumbnail!", { id: toastId });
        }
        setIsUploading(false);
        if (fileInputRef.current) fileInputRef.current.value = "";

    };
    const onDelete = async () => {
        let toastId = toast.loading("Deleting image...");
        if (!currentUrl) {
            toast.error("File is impty!", { id: toastId });
            return;
        };

        setIsDeleting(true);
        const success = await handleCloudinaryDelete(currentUrl);
        toast.success("Successfully deleted!", { id: toastId });
        if (success && onUpload) {
            onUpload("");
        }

        setIsDeleting(false);
    };
    return (
        <div className="fixed inset-0 z-110 flex items-center justify-center p-4 sm:p-6">
            <div className="absolute inset-0 bg-black/80 backdrop-blur-md" onClick={onClose} />

            <div className="relative w-full max-w-4xl bg-[#0f172a] border border-white/10 rounded-[2.5rem] shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300">
                <div className="absolute top-6 right-6 z-10">
                    <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors text-gray-400 hover:text-white">
                        <X size={24} />
                    </button>
                </div>

                <div className="grid md:grid-cols-2 gap-0">
                    {/* Left: Upload Section */}
                    <div className="p-8 md:p-12 border-b md:border-b-0 md:border-r border-white/5">
                        <div className="flex items-center gap-3 mb-8">
                            <div className="p-2 bg-cyan-500/20 rounded-lg">
                                <Sparkles className="text-cyan-400" size={20} />
                            </div>
                            <h2 className="text-xl font-bold text-white">Cover Image</h2>
                        </div>

                        <label className="group relative flex flex-col items-center justify-center w-full h-64 border-2 border-dashed border-white/10 hover:border-cyan-500/50 bg-white/2 hover:bg-cyan-500/2 rounded-3xl transition-all cursor-pointer overflow-hidden">
                            {isUploading ? (
                                <div className="flex flex-col items-center gap-3">
                                    <Loader2 className="animate-spin text-cyan-400" size={40} />
                                    <p className="text-cyan-400 font-medium animate-pulse">Uploading to Cloudinary...</p>
                                </div>
                            ) : (
                                <div className="text-center p-6">
                                    <CloudUpload className="mx-auto text-gray-500 group-hover:text-cyan-400 transition-colors mb-4" size={48} />
                                    <p className="text-white font-semibold">Click or Drop Image</p>
                                    <p className="text-gray-500 text-xs mt-2">WebP, PNG, JPG accepted</p>
                                </div>
                            )}
                            <input
                                type="file"
                                ref={fileInputRef}
                                className="hidden"
                                accept="image/*"
                                onChange={onFileChange}
                                disabled={isUploading}
                            />
                        </label>

                        {/* Explicit Delete Action */}

                        {currentUrl && (
                            <button
                                onClick={onDelete}
                                disabled={isDeleting}
                                className="w-full mt-4 flex items-center justify-center gap-2 py-3 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-2xl transition-all border border-red-500/10"
                            >
                                {isDeleting ? <Loader2 className="animate-spin" size={18} /> : <Trash2 size={18} />}
                                <span className="font-semibold text-sm">Remove Current Image</span>
                            </button>
                        )}
                        <button
                            onClick={onClose}
                            className="w-full mt-8 py-4 bg-white/5 hover:bg-white/10 text-white font-bold rounded-2xl transition-all border border-white/10"
                        >
                            Save and Close
                        </button>
                    </div>

                    {/* Right: Social/Card Preview */}
                    <div className="p-8 md:p-12 bg-black/20 flex flex-col justify-center">
                        <span className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] mb-6">Live Card Preview</span>

                        <div className="group/preview relative w-full bg-[#1e293b] rounded-3xl overflow-hidden border border-white/10 shadow-2xl transition-all duration-500 hover:-translate-y-2">
                            <div className="aspect-video w-full bg-white/5 overflow-hidden relative">
                                {currentUrl ? (
                                    <>
                                        <img
                                            src={currentUrl}
                                            alt="Preview"
                                            className="w-full h-full object-cover transition-transform duration-700 group-hover/preview:scale-105"
                                        />

                                        {/* Floating Delete Button */}
                                        <button
                                            onClick={(e) => { e.stopPropagation(); onDelete(); }}
                                            disabled={isDeleting}
                                            className="absolute top-4 right-4 z-120 p-2.5  bg-black/40 backdrop-blur-xl border border-white/10  text-white/70 hover:text-red-400 hover:bg-red-500/20 rounded-full shadow-2xl opacity-0 group-hover/preview:opacity-100  translate-y-2 group-hover/preview:translate-y-0 transition-all duration-300 ease-out"
                                            title="Quick Remove"
                                        >
                                            {isDeleting ? (
                                                <Loader2 size={16} className="animate-spin" />
                                            ) : (
                                                <X size={16} strokeWidth={3} />
                                            )}
                                        </button>

                                        {/* Gradient overlay for better button contrast */}
                                        <div className="absolute inset-0 bg-linear-to-t from-black/40 via-transparent to-black/20 opacity-0 group-hover/preview:opacity-100 transition-opacity duration-300 pointer-events-none" />
                                    </>
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center bg-linear-to-br from-gray-800 to-gray-900">
                                        <ImageIcon className="text-white/10" size={60} />
                                    </div>
                                )}
                            </div>
                            <div className="p-6 space-y-3">
                                <div className="flex gap-2">
                                    <span className="h-2 w-12 bg-cyan-500 rounded-full" />
                                    <span className="h-2 w-8 bg-purple-500 rounded-full" />
                                </div>
                                <h3 className="text-lg font-bold text-white line-clamp-2">
                                    {blogTitle || "Your Awesome Blog Title..."}
                                </h3>
                                <div className="flex items-center gap-2 pt-2">
                                    <div className="h-6 w-6 rounded-full bg-white/10" />
                                    <div className="h-3 w-20 bg-white/10 rounded-full" />
                                </div>
                            </div>
                        </div>

                        <div className="mt-8 flex items-start gap-3 p-4 bg-cyan-500/5 border border-cyan-500/10 rounded-2xl">
                            <CheckCircle2 className="text-cyan-400 shrink-0" size={18} />
                            <p className="text-xs text-gray-400 leading-relaxed">
                                Content curated and optimized for the <b>Rajendra Pancholi</b> ecosystem for premium web delivery.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Thumbnail;
