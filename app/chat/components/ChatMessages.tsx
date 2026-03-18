'use client';

import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkBreaks from 'remark-breaks';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { CheckOutlined, RobotOutlined, CopyOutlined } from '@ant-design/icons';
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
                                                    <ReactMarkdown remarkPlugins={[remarkGfm, remarkBreaks]}>{msg.Text}</ReactMarkdown>
                                                </div>
                                                {msg.Text && !isTyping && (
                                                    <div className="absolute top-0 right-[-8px]">
                                                        <Tooltip title="Copy message">
                                                            <button
                                                                onClick={() => copyToClipboard(msg.Text)}
                                                                className="flex items-center justify-center w-7 h-7 rounded-lg text-text-info hover:text-text-info/80 transition-all cursor-pointer"
                                                            >
                                                                <CopyOutlined className="text-[14px]" />
                                                            </button>
                                                        </Tooltip>
                                                    </div>
                                                )}
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
                        <div className="flex items-center gap-1.5 px-1 mt-1 ml-10">
                            <span className="text-[12px] text-gray-400 font-medium">
                                {mounted && new Date(msg.Timestamp).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })}
                            </span>
                        </div>
                    )}
                </div>
            ))}

        </div>
    );
}
