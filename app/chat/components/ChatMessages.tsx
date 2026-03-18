'use client';

import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkBreaks from 'remark-breaks';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import {
    CheckOutlined,
    RobotOutlined,
    CopyOutlined,
    LikeOutlined,
    DislikeOutlined,
    ExportOutlined,
    ReloadOutlined,
    EllipsisOutlined
} from '@ant-design/icons';
import { Loader2 } from 'lucide-react';
import { Avatar, Tooltip } from 'antd';
import { ChatMessage } from '@/interface/Chat';
import { copyToClipboard } from '@/utils/clipboard';

function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

interface ChatMessagesProps {
    messages: ChatMessage[];
    isTyping?: boolean;
}

import { normalizeMarkdown } from '@/utils/markdown';

function PreBlock({ children, ...props }: React.HTMLAttributes<HTMLPreElement>) {
    const preRef = React.useRef<HTMLPreElement>(null);
    const [language, setLanguage] = React.useState<string | null>(null);

    React.useEffect(() => {
        if (preRef.current) {
            const codeElement = preRef.current.querySelector('code');
            const className = codeElement?.className || '';
            const match = /language-(\w+)/.exec(className);
            if (match) {
                const lang = match[1];
                // Map common initials to full names or just capitalize
                const langMap: Record<string, string> = {
                    'js': 'JavaScript',
                    'ts': 'TypeScript',
                    'tsx': 'TypeScript React',
                    'jsx': 'JavaScript React',
                    'py': 'Python',
                    'cpp': 'C++',
                    'csharp': 'C#',
                    'md': 'Markdown',
                    'html': 'HTML',
                    'css': 'CSS',
                    'sh': 'Bash',
                    'bash': 'Bash',
                    'zsh': 'Zsh'
                };
                setLanguage(langMap[lang.toLowerCase()] || lang.charAt(0).toUpperCase() + lang.slice(1));
            } else {
                setLanguage(null);
            }
        }
    }, [children]);

    const handleCopy = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (!preRef.current) return;

        const codeElement = preRef.current.querySelector('code');
        const codeText = codeElement ? codeElement.textContent : preRef.current.textContent;

        copyToClipboard(codeText || '', 'Code');
    };

    return (
        <div className="flex flex-col my-6 overflow-hidden rounded-xl border border-border dark:border-white/5 shadow-sm bg-white dark:bg-[#0b0d11]">
            {/* Header bar that adjusts to light/dark themes */}
            <div className="flex items-center justify-between px-5 py-2.5 bg-neutral-50 dark:bg-[#1a1c22] border-b border-border dark:border-white/5">
                <span className="text-[12px] font-semibold text-neutral-500 dark:text-gray-300 tracking-wide uppercase font-sans">
                    {language || 'Code Snippet'}
                </span>
                <Tooltip title="Copy code">
                    <button
                        onClick={handleCopy}
                        className="flex items-center justify-center p-1.5 rounded-md text-neutral-400 hover:text-accent-1 dark:text-gray-400 dark:hover:text-accent-1 hover:bg-neutral-100 dark:hover:bg-white/5 transition-all cursor-pointer"
                    >
                        <CopyOutlined className="text-[15px]" />
                    </button>
                </Tooltip>
            </div>

            {/* Code Body */}
            <div className="relative overflow-hidden">
                <pre
                    ref={preRef}
                    {...props}
                    className={cn(
                        "p-5 overflow-x-auto text-[14px] leading-relaxed text-neutral-700 dark:text-[#e6edf3] font-mono selection:bg-accent-1/30 selection:text-white",
                        props.className
                    )}
                >
                    {children}
                </pre>
            </div>
        </div>
    );
}

export function ChatMessages({ messages, isTyping }: ChatMessagesProps) {
    const [mounted, setMounted] = React.useState(false);

    React.useEffect(() => {
        setMounted(true);
    }, []);

    return (
        <div className="py-6 space-y-6 px-4 md:px-0">
            {messages.map((msg, i) => (
                <div key={i} className={cn("flex flex-col gap-1", msg.IsUser ? "items-end" : "items-start")}>
                    <div className="flex items-end gap-2 max-w-[90%]">
                        {!msg.IsUser && (
                            <Avatar
                                size={32}
                                icon={<RobotOutlined />}
                                className="bg-primary shadow-sm shrink-0 mb-0.5"
                            />
                        )}
                        {(msg.Text || (!msg.IsUser && isTyping && i === messages.length - 1)) && (
                            <div className={cn(
                                "px-5 py-3 text-[15px] leading-relaxed shadow-sm transition-all duration-300",
                                msg.IsUser
                                    ? "bg-primary text-white rounded-[24px] rounded-br-none whitespace-pre-wrap"
                                    : "bg-neutral text-foreground rounded-[24px] rounded-bl-none"
                            )}>
                                {msg.IsUser ? (
                                    msg.Text
                                ) : (
                                    <div className="relative group/bubble">
                                        {!msg.Text && isTyping ? (
                                            <div className="flex items-center gap-2 text-gray-400 italic">
                                                <Loader2 className="w-4 h-4 animate-spin text-accent-1" />
                                                <span>Thinking...</span>
                                            </div>
                                        ) : (
                                            <>
                                                <div className="chat-markdown pr-6">
                                                    <ReactMarkdown
                                                        remarkPlugins={[remarkGfm, remarkBreaks]}
                                                        components={{
                                                            pre: PreBlock
                                                        }}
                                                    >
                                                        {normalizeMarkdown(msg.Text)}
                                                    </ReactMarkdown>
                                                </div>

                                            </>
                                        )}
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    {msg.IsUser ? (
                        <div className="flex items-center gap-1.5 px-1 mt-1">
                            <span className="text-[12px] text-gray-400 font-medium">
                                {mounted && new Date(msg.Timestamp).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })}
                            </span>
                            <div className="flex items-center -space-x-1.5">
                                {msg.Status === 'sending' ? (
                                    <Loader2 className="text-[11px] text-accent-1 animate-spin" />
                                ) : (
                                    <>
                                        <CheckOutlined className="text-[11px] text-accent-1 font-bold" />
                                        {msg.Status === 'delivered' && (
                                            <CheckOutlined className="text-[11px] text-accent-1 font-bold" />
                                        )}
                                    </>
                                )}
                            </div>
                        </div>
                    ) : (
                        <div className="flex items-center gap-3 mt-1.5 ml-10 text-gray-400">
                            <span className="text-[12px] font-medium leading-none">
                                {mounted && new Date(msg.Timestamp).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })}
                            </span>
                            {msg.Text && !isTyping && i !== messages.length && (
                                <Tooltip title="Copy">
                                    <button
                                        onClick={() => copyToClipboard(msg.Text)}
                                        className="hover:text-accent-1 transition-colors cursor-pointer leading-none flex items-center"
                                    >
                                        <CopyOutlined className="text-[14px]" />
                                    </button>
                                </Tooltip>
                            )}
                        </div>
                    )}
                </div>
            ))}

        </div>
    );
}
