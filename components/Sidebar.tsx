'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Settings, MoreVertical, Menu, X, LogOut, Loader2, Plus, Search, ChevronDown, UserCog, MessageSquare } from 'lucide-react';
import { Dropdown, Avatar } from 'antd';
import type { MenuProps } from 'antd';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

import SettingsModal from './Settings/SettingsModal';
import { useChat } from '@/hooks/chat/useChat';
const useAuth = () => ({
    user: {
        Nickname: 'Admin User',
        Email: 'admin@appdev.com',
        AccountName: 'Admin',
        GAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Admin'
    },
    isLoading: false
});
const useLogout = () => ({ mutate: () => console.log('Logout') });

function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export default function Sidebar() {
    const pathname = usePathname();
    const [isOpen, setIsOpen] = useState(false);
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);
    const { user, isLoading } = useAuth();
    const { mutate: logout } = useLogout();
    const { resetChat } = useChat();

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
            onClick: () => logout(),
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
                    <span className="text-[11px] text-gray-500 mt-1 pl-7">
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
                    <span className="text-[11px] text-gray-500 mt-1 pl-7">
                        Administer user roles, permissions, and accounts.
                    </span>
                </div>
            ),
        },
    ];

    const sidebarContent = (
        <div className="flex flex-col h-full bg-sidebar transition-colors duration-300">
            <div className="p-4 flex flex-col gap-4">
                <div className="flex items-center justify-between">
                    <Dropdown menu={{ items: workspaceMenuItems }} trigger={['click']} placement="bottomLeft">
                        <div className="flex items-center gap-2 px-2 py-1.5 hover:bg-neutral rounded-lg cursor-pointer transition-colors group">
                            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center shadow-sm">
                                <span className="text-white font-bold text-xs">AC</span>
                            </div>
                            <span className="text-[19px] font-bold text-foreground tracking-tight">
                                AppDev Central
                            </span>
                            <ChevronDown size={14} className="text-gray-400 group-hover:text-gray-600 transition-colors" />
                        </div>
                    </Dropdown>
                </div>

                <div className="flex flex-col gap-1">
                    <button
                        onClick={resetChat}
                        className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-foreground hover:bg-neutral transition-colors w-full"
                    >
                        <Plus size={18} />
                        <span>New chat</span>
                    </button>
                    <button className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-foreground hover:bg-neutral transition-colors">
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
                    <div className="flex flex-col gap-0.5 mt-4">
                        <p className="px-3 text-xs text-gray-400 italic">No recent chats</p>
                    </div>
                </div>
            </div>

            <div className="p-5">
                <Dropdown menu={{ items: userMenuItems }} placement="topRight" trigger={['click']}>
                    <div className="flex items-center justify-between pt-4 border-t border-border cursor-pointer group">
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
                                <span className="text-[14px] font-semibold text-foreground leading-none mb-1 truncate">
                                    {isLoading ? 'Loading...' : (user?.Nickname || user?.AccountName || 'Guest User')}
                                </span>
                                <span className="text-[12px] text-gray-500 truncate">
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
                        onClick={() => setIsOpen(true)}
                        className="p-2 hover:bg-neutral rounded-lg transition-colors"
                    >
                        <Menu size={24} />
                    </button>
                    <span className="font-bold text-foreground">AppDev Central</span>
                </div>
                <Avatar
                    src={user?.GAvatar}
                    size={32}
                    className="bg-accent-1 text-white font-bold shadow-sm"
                >
                    {user?.AccountName?.charAt(0) || 'U'}
                </Avatar>
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


            <aside className="hidden lg:flex w-64 flex-col h-screen border-r border-border sticky top-0 bg-sidebar">
                {sidebarContent}
            </aside>

            <SettingsModal
                visible={isSettingsOpen}
                onClose={() => setIsSettingsOpen(false)}
            />
        </>
    );
}
