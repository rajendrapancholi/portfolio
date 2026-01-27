"use client";

import { FileCode, Terminal, Brackets } from "lucide-react";
import { CopyButton } from "../ui/CopyButton";

const getLanguageIcon = (lang: string) => {
    switch (lang.toLowerCase()) {
        case 'js': case 'jsx': case 'ts': case 'tsx': return <Brackets className="w-4 h-4 text-yellow-400" />;
        case 'bash': case 'sh': case 'shell': return <Terminal className="w-4 h-4 text-green-400" />;
        default: return <FileCode className="w-4 h-4 text-blue-400" />;
    }
};

export const CodeBlock = ({ children, className }: { children: string, className?: string; }) => {
    // Correctly extract language string from the match array
    const match = /language-(\w+)/.exec(className || "");
    const lang = match ? match[1] : "code";

    return (
        <div className="relative group my-6 overflow-hidden rounded-xl border border-slate-800 bg-[#0d1117] shadow-sm">
            <div className="flex items-center justify-between px-4 py-2 bg-slate-900/50 border-b border-slate-800">
                <div className="flex items-center gap-2">
                    {getLanguageIcon(lang)}
                    <span className="text-xs font-mono text-slate-400 uppercase tracking-wider">
                        {lang}
                    </span>
                </div>
                <CopyButton text={children} />
            </div>
            <div className="overflow-x-auto p-4 text-sm font-mono text-slate-300">
                {/* 
                   Using a <pre> here is correct. 
                   Note: MDEditor already provides some syntax highlighting styles, 
                   but since you are using a custom block, this will show the raw text 
                   with your custom colors.
                */}
                <pre className="scrollbar-hide">
                    <code>{children}</code>
                </pre>
            </div>
        </div>
    );
};
