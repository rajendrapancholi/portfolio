"use client";

import MDEditor from "@uiw/react-md-editor";
import rehypeRaw from "rehype-raw";
import remarkGfm from "remark-gfm";
import { ComponentProps, memo, useEffect, useState } from "react";
import { useTheme } from "next-themes";
import Loading from "@/components/Loading";

import "@uiw/react-markdown-preview/markdown.css";
import "@uiw/react-md-editor/markdown-editor.css";

type CodeProps = ComponentProps<"code"> & {
    inline?: boolean;
    node?: unknown;
};

const CodeBlock = memo(function CodeBlock({
    inline,
    className,
    children,
    ...props
}: CodeProps) {
    if (inline || !className) { // prevent inline code element
        return (
            <code className={className} {...props}>
                {children}
            </code>
        );
    }
    return (
        <div className={`${className} overflow-x-auto`}>
            <code {...props}>{children}</code>
        </div>
    );
});

const MarkdownRenderer = ({ content }: { content: string; }) => {
    const { theme, resolvedTheme } = useTheme();
    const [mounted, setMounted] = useState(false);
    useEffect(() => {
        setMounted(true);
    }, []);
    const currentTheme = mounted ? (resolvedTheme || theme) : 'light';

    if (!mounted) {
        return <Loading />;
    }
    return (
        <div className="markdown-render-blue-topaz w-full px-2 bg-canvas"
            data-color-mode={currentTheme}>
            <MDEditor.Markdown // used in admin 
                source={content}
                remarkPlugins={[remarkGfm]}
                rehypePlugins={[rehypeRaw]}
                components={{
                    code: CodeBlock,
                }}

            />
        </div>
    );
};

export default MarkdownRenderer;


/* 
Use <MarkdownPreview /> for Read-Only Pages: If you are building a blog, a documentation site, or a comment section where the user is just reading, use this standalone package. It keeps your bundle size smaller because it doesn't include the editor's toolbar icons, textarea handling, and command logic.
Use <MDEditor.Markdown /> for Admin/Editor Views: If you are already importing @uiw/react-md-editor to let users write content, it is more convenient to use the re-exported .Markdown component since you've already paid the "cost" of the larger package. 

*/