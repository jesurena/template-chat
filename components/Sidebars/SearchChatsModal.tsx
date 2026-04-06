'use client';

import React, { useState } from 'react';
import { Modal, Input } from 'antd';
import { Search, History, MessageSquare, Loader2 } from 'lucide-react';
import { useChatHistory } from '@/hooks/chat/useChat';
import { ChatHistoryItem } from '@/interface/Chat';

interface SearchChatsModalProps {
    open: boolean;
    onClose: () => void;
    onSelectChat: (chat: ChatHistoryItem) => void;
}

export default function SearchChatsModal({ open, onClose, onSelectChat }: SearchChatsModalProps) {
    const [searchQuery, setSearchQuery] = useState('');
    const accountId = typeof window !== 'undefined' ? localStorage.getItem("AoId") : null;
    const { data: chatHistory = [], isLoading } = useChatHistory(accountId);

    const filteredChats = chatHistory.filter((c: ChatHistoryItem) =>
        c.content?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleSelectChat = (chat: ChatHistoryItem) => {
        onSelectChat(chat);
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
                {isLoading ? (
                    <div className="py-12 flex flex-col items-center justify-center text-gray-400">
                        <Loader2 className="w-8 h-8 animate-spin mb-3 opacity-50" />
                        <p className="text-sm">Loading chats...</p>
                    </div>
                ) : filteredChats.length > 0 ? (
                    <div className="flex flex-col gap-1">
                        {filteredChats.map((chat: ChatHistoryItem) => (
                            <button
                                key={chat.chat_id}
                                onClick={() => handleSelectChat(chat)}
                                className="flex items-start justify-between p-3 rounded-xl border border-transparent hover:border-border hover:bg-neutral/50 transition-all text-left group"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full bg-accent-1/10 flex items-center justify-center shrink-0 group-hover:bg-accent-1/20 transition-colors">
                                        <MessageSquare size={14} className="text-accent-1" />
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-md font-semibold text-foreground group-hover:text-accent-1 transition-colors">
                                            {chat.content}
                                        </span>
                                        <span className="text-xs text-gray-500">
                                            AppDev Central context
                                        </span>
                                    </div>
                                </div>
                            </button>
                        ))}
                    </div>
                ) : (
                    <div className="py-12 flex flex-col items-center justify-center text-gray-400">
                        <Search size={32} className="mb-3 opacity-20" />
                        <p className="text-sm">No chats found for &quot;{searchQuery}&quot;</p>
                    </div>
                )}
            </div>
        </Modal>
    );
}
