'use client';

import React, { useState } from 'react';
import { Modal, Input } from 'antd';
import { Search, History, MessageSquare } from 'lucide-react';
import { mockChats } from '@/app/chat/components/mockChats';

interface SearchChatsModalProps {
    open: boolean;
    onClose: () => void;
    onSelectChat: (messages: typeof mockChats[0]['messages']) => void;
}

export default function SearchChatsModal({ open, onClose, onSelectChat }: SearchChatsModalProps) {
    const [searchQuery, setSearchQuery] = useState('');

    const filteredChats = mockChats.filter(c =>
        c.title.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const groupedChats = filteredChats.reduce((acc, chat) => {
        if (!acc[chat.date]) acc[chat.date] = [];
        acc[chat.date].push(chat);
        return acc;
    }, {} as Record<string, typeof mockChats>);

    const handleSelectChat = (messages: typeof mockChats[0]['messages']) => {
        onSelectChat(messages);
        setSearchQuery('');
    };

    return (
        <Modal
            title={
                <div className="flex items-center gap-2 text-lg font-bold pb-2">
                    <History size={20} className="text-accent-1" />
                    <span>Search Past Chats</span>
                </div>
            }
            open={open}
            onCancel={onClose}
            footer={null}
            width={540}
            centered
            classNames={{
                body: 'p-2'
            }}
        >
            <div className="relative mb-6 mt-4">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <Input
                    placeholder="Search for previous conversations..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 h-11 rounded-xl bg-neutral/50 border-border hover:bg-white focus:bg-white transition-all text-md"
                    autoFocus
                />
            </div>

            <div className="flex flex-col gap-6 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                {Object.entries(groupedChats).length > 0 ? (
                    Object.entries(groupedChats).map(([dateLabel, chats]) => (
                        <div key={dateLabel} className="flex flex-col gap-2">
                            <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider pl-1">{dateLabel}</h4>
                            <div className="flex flex-col gap-1">
                                {chats.map(chat => (
                                    <button
                                        key={chat.id}
                                        onClick={() => handleSelectChat(chat.messages)}
                                        className="flex items-start justify-between p-3 rounded-xl border border-transparent hover:border-border hover:bg-neutral/50 transition-all text-left group"
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-full bg-accent-1/10 flex items-center justify-center shrink-0 group-hover:bg-accent-1/20 transition-colors">
                                                <MessageSquare size={14} className="text-accent-1" />
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="text-md font-semibold text-foreground group-hover:text-accent-1 transition-colors">
                                                    {chat.title}
                                                </span>
                                                <span className="text-xs text-gray-500">
                                                    AppDev Central context
                                                </span>
                                            </div>
                                        </div>
                                        <span className="text-xs font-medium text-gray-400 whitespace-nowrap pt-1">
                                            {chat.time}
                                        </span>
                                    </button>
                                ))}
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="py-12 flex flex-col items-center justify-center text-gray-400">
                        <Search size={32} className="mb-3 opacity-20" />
                        <p className="text-sm">No chats found for "{searchQuery}"</p>
                    </div>
                )}
            </div>
        </Modal>
    );
}
