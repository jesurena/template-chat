'use client';

import React from 'react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { CheckOutlined, RobotOutlined } from '@ant-design/icons';
import { Avatar } from 'antd';
import { ChatMessage } from '@/interface/Chat';

function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

interface ChatMessagesProps {
    messages: ChatMessage[];
    isTyping?: boolean;
}

export function ChatMessages({ messages, isTyping }: ChatMessagesProps) {
    return (
        <div className="py-10 space-y-10 px-4 md:px-0">
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
                        <div className={cn(
                            "px-5 py-3 text-[15px] leading-relaxed shadow-sm transition-all duration-300",
                            msg.IsUser
                                ? "bg-primary text-white rounded-[24px] rounded-br-none"
                                : "bg-neutral text-foreground rounded-[24px] rounded-bl-none"
                        )}>
                            {msg.Text}
                        </div>
                    </div>

                    {msg.IsUser ? (
                        <div className="flex items-center gap-1.5 px-1 mt-1">
                            <span className="text-[12px] text-gray-400 font-medium">
                                {new Date(msg.Timestamp).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })}
                            </span>
                            <div className="flex items-center -space-x-1.5">
                                <CheckOutlined className="text-[11px] text-accent-1 font-bold" />
                                {msg.Status === 'delivered' && (
                                    <CheckOutlined className="text-[11px] text-accent-1 font-bold" />
                                )}
                            </div>
                        </div>
                    ) : (
                        <div className="flex items-center gap-1.5 px-1 mt-1 ml-10">
                            <span className="text-[12px] text-gray-400 font-medium">
                                {new Date(msg.Timestamp).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })}
                            </span>
                        </div>
                    )}
                </div>
            ))}

            {isTyping && (
                <div className="flex flex-col items-start gap-1 pb-4">
                    <div className="flex items-end gap-2">
                        <Avatar
                            size={32}
                            icon={<RobotOutlined />}
                            className="bg-primary shadow-sm shrink-0 mb-0.5"
                        />
                        <div className="bg-neutral px-5 py-4 rounded-[24px] rounded-bl-none flex items-center gap-2 h-[42px]">
                            <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce [animation-duration:0.8s] [animation-delay:-0.32s]" />
                            <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce [animation-duration:0.8s] [animation-delay:-0.16s]" />
                            <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce [animation-duration:0.8s]" />
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
