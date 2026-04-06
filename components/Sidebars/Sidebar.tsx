'use client';

import React, { useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { Settings, MoreVertical, Menu, LogOut, Loader2, Plus, Search, ChevronDown, UserCog, MessageSquare } from 'lucide-react';
import { Dropdown, Avatar } from 'antd';
import type { MenuProps } from 'antd';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

import SettingsModal from '../Settings/SettingsModal';
import SearchChatsModal from './SearchChatsModal';
import { useChat, useChatHistory, useLoadChatHistory } from '@/hooks/chat/useChat';
import { useGoogle } from '@/hooks/auth/useGoogle';
import { User } from '@/interface/User';
import { ChatHistoryItem } from '@/interface/Chat';

const useLocalAuth = () => {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    React.useEffect(() => {
        const uName = localStorage.getItem('uName') || 'Guest User';
        const uEmail = localStorage.getItem('uEmail') || 'Not Set';

        setUser({
            Nickname: uName,
            Email: uEmail,
            AccountName: uName,
            GAvatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(uName)}`
        });
        setIsLoading(false);
    }, []);

    return { user, isLoading };
};

function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export default function Sidebar() {
    const pathname = usePathname();
    const router = useRouter();
    const [isOpen, setIsOpen] = useState(false);
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);
    const { user, isLoading } = useLocalAuth();
    const { logout } = useGoogle();
    const { resetChat, loadChat } = useChat();

    const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
    const [isClientReady, setIsClientReady] = useState(false);
    const accountId = typeof window !== 'undefined' ? localStorage.getItem("AoId") : null;
    const { data: chatHistory = [], isLoading: isChatsLoading } = useChatHistory(accountId);
    const loadChatMutation = useLoadChatHistory();

    React.useEffect(() => {
        setIsClientReady(true);
    }, []);

    const handleLogout = () => {
        logout();
    };



    const userMenuItems: MenuProps['items'] = [
        {
            key: 'settings',
            label: (
                <div className="flex items-center gap-2 py-1">
                    <Settings size={16} />
                    <span>Settings</span>
                </div>
            ),
            onClick: () => setIsSettingsOpen(true)
        },
        {
            key: 'logout',
            label: (
                <div className="flex items-center gap-2 py-1 text-red-500">
                    <LogOut size={16} />
                    <span>Logout</span>
                </div>
            ),
            onClick: handleLogout,
        },
    ];

    const workspaceMenuItems: MenuProps['items'] = [
        {
            key: 'chat',
            label: (
                <div className="flex flex-col py-1">
                    <div className="flex items-center gap-2">
                        <div className="w-5 h-5 bg-primary rounded flex items-center justify-center">
                            <MessageSquare size={12} className="text-white" />
                        </div>
                        <span className="font-bold text-foreground">AppDev Chat</span>
                    </div>
                    <span className="text-xs text-gray-500 mt-1 pl-7">
                        AI-powered project assistance and code guidance.
                    </span>
                </div>
            ),
        },
        {
            key: 'users',
            label: (
                <div className="flex flex-col py-1">
                    <div className="flex items-center gap-2">
                        <div className="w-5 h-5 bg-accent-1 rounded flex items-center justify-center">
                            <UserCog size={12} className="text-white" />
                        </div>
                        <span className="font-bold text-foreground">User Management</span>
                    </div>
                    <span className="text-xs text-gray-500 mt-1 pl-7">
                        Administer user roles, permissions, and accounts.
                    </span>
                </div>
            ),
        },
    ];

    const sidebarContent = (
        <div id="tour-user-settings" className="flex flex-col h-full bg-sidebar transition-colors duration-300">
            <div className="p-4 flex flex-col gap-4">
                <div className="flex items-center justify-between">
                    <Dropdown menu={{ items: workspaceMenuItems }} trigger={['click']} placement="bottomLeft">
                        <div className="flex items-center gap-2 px-2 py-1.5 hover:bg-neutral rounded-lg cursor-pointer transition-colors group">
                            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center shadow-sm">
                                <span className="text-white font-bold text-xs">AC</span>
                            </div>
                            <span className="text-lg font-bold text-foreground tracking-tight">
                                AppDev Central
                            </span>
                            <ChevronDown size={14} className="text-gray-400 group-hover:text-gray-600 transition-colors" />
                        </div>
                    </Dropdown>
                </div>

                <div className="flex flex-col gap-1">
                    <button
                        onClick={() => {
                            resetChat();
                            if (pathname !== '/chat') {
                                router.push('/chat');
                            }
                            setIsOpen(false);
                        }}
                        className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-foreground hover:bg-neutral transition-colors w-full"
                    >
                        <Plus size={18} />
                        <span>New chat</span>
                    </button>
                    <button
                        onClick={() => setIsSearchModalOpen(true)}
                        className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-foreground hover:bg-neutral transition-colors w-full"
                    >
                        <Search size={18} />
                        <span>Search chats</span>
                    </button>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto px-2 py-2">
                <div className="mb-6 px-4">
                    <h3 className="text-xs font-bold text-gray-400 tracking-wider mb-2">
                        Your chats
                    </h3>
                    <div className="flex flex-col gap-0.5 mt-2">
                        {isClientReady && isChatsLoading ? (
                            <div className="flex justify-center p-2 mt-2">
                                <Loader2 className="w-4 h-4 text-gray-400 animate-spin" />
                            </div>
                        ) : isClientReady && chatHistory.length > 0 ? (
                            chatHistory.map((chat, idx) => (
                                <button
                                    key={chat.chat_id || idx}
                                    disabled={loadChatMutation.isPending}
                                    onClick={async () => {
                                        try {
                                            const chat_id = chat.chat_id || chat.id || chat.ThreadID;
                                            if (!chat_id) {
                                                console.error("No chat ID found for", chat);
                                                return;
                                            }
                                            const data = await loadChatMutation.mutateAsync(chat_id);
                                            loadChat(data.messages, data.chatId, data.sessionId);

                                            router.push(`/chat/${chat_id}`);
                                            setIsOpen(false);
                                        } catch (error) {
                                            console.error("Failed to load past chat", error);
                                        }
                                    }}
                                    className="flex items-center gap-2.5 px-3 py-2 text-sm text-text hover:bg-neutral rounded-lg transition-colors text-left w-full group"
                                >
                                    {loadChatMutation.isPending && loadChatMutation.variables === chat.chat_id ? (
                                        <Loader2 size={14} className="shrink-0 text-gray-400 animate-spin" />
                                    ) : (
                                        <MessageSquare size={14} className="shrink-0 text-gray-400 group-hover:text-accent-1 transition-colors" />
                                    )}
                                    <span className="truncate flex-1 font-medium">{chat.content || 'Chat ' + (idx + 1)}</span>
                                </button>
                            ))
                        ) : isClientReady ? (
                            <div className="px-3 py-2 text-xs text-gray-500 text-center">No recent chats found</div>
                        ) : null}
                    </div>
                </div>
            </div>

            <div className="p-5">
                <Dropdown menu={{ items: userMenuItems }} placement="topRight" trigger={['click']}>
                    <div id="tour-user-profile" className="flex items-center justify-between pt-4 border-t border-border cursor-pointer group">
                        <div className="flex items-center gap-3 overflow-hidden">
                            {isLoading ? (
                                <div className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center">
                                    <Loader2 className="w-4 h-4 text-gray-400 animate-spin" />
                                </div>
                            ) : (
                                <Avatar
                                    src={user?.GAvatar}
                                    size={36}
                                    className="bg-accent-1 text-white font-bold shadow-sm group-hover:scale-105 transition-transform shrink-0"
                                >
                                    {user?.AccountName?.charAt(0) || 'U'}
                                </Avatar>
                            )}
                            <div className="flex flex-col text-left overflow-hidden">
                                <span className="text-sm font-semibold text-foreground leading-none mb-1 truncate">
                                    {isLoading ? 'Loading...' : (user?.Nickname || user?.AccountName || 'Guest User')}
                                </span>
                                <span className="text-xs text-gray-500 truncate">
                                    {isLoading ? 'Please wait' : (user?.Email || 'Not logged in')}
                                </span>
                            </div>
                        </div>
                        <MoreVertical className="w-5 h-5 text-gray-400 group-hover:text-gray-700 transition-colors flex-shrink-0" />
                    </div>
                </Dropdown>
            </div>
        </div>
    );

    return (
        <>
            <header className="lg:hidden sticky top-0 left-0 w-full z-40 bg-background backdrop-blur-md border-b border-border px-4 h-16 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <button
                        id="tour-mobile-menu"
                        onClick={() => setIsOpen(true)}
                        className="p-2 hover:bg-neutral rounded-lg transition-colors"
                    >
                        <Menu size={24} />
                    </button>
                    <span className="font-bold text-foreground">AppDev Central</span>
                </div>
            </header>

            <div
                className={cn(
                    "fixed inset-0 z-[60] transform transition-transform duration-300 ease-in-out lg:hidden",
                    isOpen ? "translate-x-0" : "-translate-x-full"
                )}
            >
                <div
                    className="absolute inset-0 bg-black/40 backdrop-blur-sm"
                    onClick={() => setIsOpen(false)}
                ></div>
                <div className="absolute left-0 top-0 h-full w-[280px] bg-white shadow-2xl overflow-hidden">
                    {sidebarContent}
                </div>
            </div>


            <aside id="tour-chat-history" className="hidden lg:flex w-64 flex-col h-screen border-r border-border sticky top-0 bg-sidebar">
                {sidebarContent}
            </aside>

            <SettingsModal
                visible={isSettingsOpen}
                onClose={() => setIsSettingsOpen(false)}
            />

            <SearchChatsModal
                open={isSearchModalOpen}
                onClose={() => setIsSearchModalOpen(false)}
                onSelectChat={async (chat: ChatHistoryItem) => {
                    try {
                        const chat_id = chat.chat_id || chat.id || chat.ThreadID;
                        if (!chat_id) {
                            console.error("No chat ID found for", chat);
                            return;
                        }
                        const data = await loadChatMutation.mutateAsync(chat_id);
                        loadChat(data.messages, data.chatId, data.sessionId);

                        router.push(`/chat/${chat_id}`);
                        setIsSearchModalOpen(false);
                        setIsOpen(false);
                    } catch (error) {
                        console.error("Failed to load past chat", error);
                    }
                }}
            />
        </>
    );
}
