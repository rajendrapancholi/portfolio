'use client';

import React, { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { toast } from 'react-hot-toast';
import { PenTool, Send, Type, Sparkles, ImageIcon } from 'lucide-react';
import { createBlog } from '@/app/actions/blog';
import rehypeRaw from 'rehype-raw';
import { commands } from '@uiw/react-md-editor';
import Button from '@/components/ui/Button';
import Thumbnail from './Thumbnail';
import Image from 'next/image';
import remarkGfm from 'remark-gfm';
import rehypeSanitize from 'rehype-sanitize';
import rehypePrismPlus from 'rehype-prism-plus';
import { formatString } from '@/lib/utils/formatter';
import styles from './CreateBlogForm.module.css';

const MDEditor = dynamic(() => import('@uiw/react-md-editor'), { ssr: false });

export type BlogType = {
  title: string;
  content: string;
  thumbnail?: string;
  blogDocImgsLnk?: string[];
};

const CreateBlogForm = () => {
  const [blogData, setBlogData] = useState<Partial<BlogType>>({
    title: '',
    content: '## Start your story...',
    thumbnail: '',
  });
  const [isPending, setIsPending] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const currentTitle = blogData.title?.trim() ?? '';
    if (currentTitle.length > 0) {
      document.title = `• ${formatString(currentTitle, 18)} | Rajendra Pancholi`;
    } else {
      document.title = 'New Blog | Rajendra Pancholi';
    }
  }, [blogData.title]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setBlogData((prev) => ({ ...prev, [name]: value }));
  };

  async function handleSubmit(e: React.FormEvent) {
    const toastId = toast.loading('Posting blog...');
    e.preventDefault();

    if (!blogData.title || blogData.title.length === 0)
      return toast.error('Title is required!', { id: toastId });

    if (!blogData.content || blogData.content.length < 10)
      return toast.error('Content is too short!', { id: toastId });

    setIsPending(true);
    const formData = new FormData();
    formData.append('title', blogData.title);
    formData.append('content', blogData.content);
    formData.append(
      'thumbnail',
      blogData.thumbnail || '/default-blog-thumb.webp',
    );

    try {
      await createBlog(formData);
      toast.success('Blog published to the universe!', { id: toastId });
      setBlogData({
        title: '',
        content: '',
        thumbnail: '',
        blogDocImgsLnk: [],
      });
    } catch {
      toast.error('Failed to publish post.', { id: toastId });
    } finally {
      setIsPending(false);
    }
  }

  const imageUploadCommand = {
    name: 'image-upload',
    keyCommand: 'image-upload',
    buttonProps: {
      'aria-label': 'Upload Image',
      style: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2px 3px',
      },
    },
    icon: <ImageIcon size={13} />,
    execute: (_state: any, api: any) => {
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = 'image/*';
      input.onchange = async () => {
        const file = input.files?.[0];
        if (file) {
          toast.loading('Uploading image...', { id: 'img-up' });
          const url = file.name;
          setBlogData((prev) => ({
            ...prev,
            blogDocImgsLnk: [...(prev.blogDocImgsLnk || []), url],
          }));
          toast.success('Image ready!', { id: 'img-up' });
          api.replaceSelection(`![image](${url})`);
        }
      };
      input.click();
    },
  };

  return (
    <div className="relative w-full mx-auto min-h-screen animate-in-view">
      {isOpen && (
        <div className="absolute inset-0 z-50">
          <Thumbnail
            currentUrl={blogData.thumbnail || ''}
            blogTitle={blogData.title || ''}
            onUpload={(url) =>
              setBlogData((prev) => ({ ...prev, thumbnail: url }))
            }
            onClose={() => setIsOpen(false)}
            type="blog"
          />
        </div>
      )}

      <div className="bg-card rounded-2xl md:rounded-3xl shadow-xl overflow-hidden border border-border">
        <div className="h-1 w-full bg-linear-to-r from-primary via-primary to-purple-500" />

        <div className="p-4 md:p-6 space-y-8">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="bg-primary/10 p-3 rounded-2xl border border-primary/20">
                <Sparkles className="text-primary" size={24} />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-foreground tracking-tight">
                  Drafting Room
                </h1>
                <p className="text-muted-foreground text-xs uppercase tracking-widest">
                  Post Editor v{new Date().getFullYear()}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 text-xs font-mono text-muted-foreground bg-muted/60 px-3 py-1.5 rounded-full border border-border">
              <span className="h-2 w-2 rounded-full bg-success animate-pulse" />
              Editor Online
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Title */}
            <div className="relative group">
              <label className="absolute -top-2.5 left-4 bg-card px-2 text-xs font-medium text-primary z-10 border border-border rounded">
                Post Title
              </label>
              <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-3">
                <div className="flex flex-1 items-center bg-muted/50 border border-border rounded-xl focus-within:border-primary/50 focus-within:ring-4 focus-within:ring-primary/10 transition-all duration-300">
                  <div className="pl-4 text-muted-foreground">
                    <Type size={20} />
                  </div>
                  <input
                    name="title"
                    value={blogData.title}
                    onChange={handleChange}
                    placeholder="Enter a captivating headline..."
                    required
                    className="w-full bg-transparent p-4 outline-none text-foreground font-medium placeholder:text-muted-foreground"
                  />
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={() =>
                      setBlogData((prev) => ({ ...prev, content: '' }))
                    }
                    className="flex items-center gap-2 bg-muted hover:bg-muted/80 text-foreground font-semibold px-5 py-3.5 rounded-xl border border-border transition-all active:scale-95"
                  >
                    Clear Draft
                  </button>

                  <button
                    type="submit"
                    disabled={isPending}
                    className="flex items-center gap-2 bg-primary hover:brightness-110 text-primary-foreground font-bold px-6 sm:px-8 py-3.5 rounded-xl transition-all active:scale-95 disabled:opacity-50 shadow-md shadow-primary/20"
                  >
                    {isPending ? (
                      <span className="flex items-center gap-2">
                        <span className="h-4 w-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                        Syncing...
                      </span>
                    ) : (
                      <>
                        <span>Publish Post</span>
                        <Send size={18} />
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* Editor */}
            <div className="space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-3 px-1">
                <label className="text-sm font-semibold text-muted-foreground flex items-center gap-2">
                  <PenTool size={16} className="text-primary" /> Story Content
                </label>

                <div className="flex items-center gap-3">
                  <Button
                    title={
                      blogData.thumbnail ? 'Change Image' : 'Add Thumbnail'
                    }
                    position="left"
                    handleClick={(e) => {
                      e.preventDefault();
                      setIsOpen(true);
                    }}
                    otherClasses="!px-4"
                    icon={
                      <div className="relative overflow-hidden rounded-lg border border-border w-9 h-9 flex items-center justify-center bg-muted/50 shadow-inner transition-all duration-300 group-hover:border-primary/50 group-hover:ring-2 group-hover:ring-primary/20">
                        {blogData.thumbnail ? (
                          <Image
                            alt="blog-thumbnail"
                            src={
                              blogData.thumbnail || '/default-blog-thumb.webp'
                            }
                            sizes="36px"
                            fill
                            className="object-cover transition-transform duration-500 group-hover:scale-110"
                          />
                        ) : (
                          <ImageIcon
                            size={20}
                            className="text-muted-foreground transition-all duration-500 group-hover:text-primary group-hover:scale-110"
                          />
                        )}
                        <div className="absolute inset-0 bg-linear-to-tr from-white/5 to-transparent pointer-events-none" />
                      </div>
                    }
                  />
                  <span className="text-[10px] text-muted-foreground bg-muted/60 px-2 py-0.5 rounded border border-border uppercase">
                    Markdown Enabled
                  </span>
                </div>
              </div>

              <div className="rounded-2xl overflow-hidden border border-border focus-within:border-primary/50 transition-colors">
                <div
                  className={`${styles.editorGradientBorder} ${styles.glassEditor}`}
                >
                  <MDEditor
                    value={blogData.content}
                    onChange={(val) =>
                      setBlogData((prev) => ({ ...prev, content: val ?? '' }))
                    }
                    height={600}
                    preview="edit"
                    className="bg-transparent"
                    style={{ zIndex: 100 }}
                    textareaProps={{
                      placeholder: 'Start typing your masterpiece...',
                      className: 'line-numbered-input',
                    }}
                    previewOptions={{
                      remarkPlugins: [remarkGfm],
                      rehypePlugins: [
                        [rehypeRaw],
                        [rehypeSanitize],
                        [
                          rehypePrismPlus,
                          { ignoreMissing: true, showLineNumbers: true },
                        ],
                      ],
                    }}
                    commands={[...commands.getCommands(), imageUploadCommand]}
                  />
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>

      <div className="mt-6 text-center text-muted-foreground text-xs">
        Pro Tip: Use <code className="text-primary font-mono">###</code> for
        subheadings and <code className="text-primary font-mono">{`> `}</code>{' '}
        for quotes.
      </div>
    </div>
  );
};

export default CreateBlogForm;
