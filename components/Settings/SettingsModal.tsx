'use client';

import React, { useState } from 'react';
import { Button, Modal, Select } from 'antd';
import { useTheme } from '@/components/Providers/theme-provider';
import { Settings, Sun, Moon, Monitor, X, Link as LinkIcon, CheckCircle2 } from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { useDrive } from '@/components/Providers/drive-provider';
import { message } from '@/components/Providers/theme-provider';
import { useTour } from '@/components/Providers/tour-provider';

function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

interface SettingsModalProps {
    visible: boolean;
    onClose: () => void;
}

const themeOptions = [
    {
        value: 'light',
        label: (
            <div className="flex items-center gap-2">
                <Sun size={14} />
                <span>Light</span>
            </div>
        ),
    },
    {
        value: 'dark',
        label: (
            <div className="flex items-center gap-2">
                <Moon size={14} />
                <span>Dark</span>
            </div>
        ),
    },
    {
        value: 'system',
        label: (
            <div className="flex items-center gap-2">
                <Monitor size={14} />
                <span>System</span>
            </div>
        ),
    },
];

export default function SettingsModal({ visible, onClose }: SettingsModalProps) {
    const { theme, setTheme } = useTheme();
    const [activeTab, setActiveTab] = useState<'general' | 'connections'>('general');
    const { isDriveConnected, setisDriveConnected, setIsDriveModalOpen } = useDrive();
    const { startTour } = useTour();

    return (
        <Modal
            open={visible}
            onCancel={onClose}
            footer={null}
            closeIcon={null}
            width={{
                xs: '80%',
                sm: '70%',
                md: '65%',
                lg: '60%',
                xl: '55%',
                xxl: '50%',
            }}
            mask={false}
            centered
        >
            <div className="flex flex-col md:flex-row h-[75vh] md:h-[520px] relative">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 p-2 rounded-full text-foreground/50 hover:text-foreground hover:bg-foreground/5 transition-all z-10"
                >
                    <X size={20} />
                </button>
                <div className="w-full md:w-[220px] bg-neutral border-b md:border-b-0 md:border-r border-border flex flex-col shrink-0">
                    <div className="px-4 md:px-5 pt-5 md:pt-6 pb-2 md:pb-4 pr-12">
                        <h2 className="text-base font-bold text-foreground tracking-tight">Settings</h2>
                    </div>

                    <nav className="flex flex-row md:flex-col gap-1 md:gap-1 px-3 pb-3 md:pb-0 md:flex-1 overflow-x-auto scrollbar-hide">
                        <button
                            onClick={() => setActiveTab('general')}
                            className={cn(
                                "flex items-center gap-2 md:gap-3 px-3 py-2 md:py-2.5 rounded-lg text-sm font-medium transition-all duration-150 cursor-pointer shrink-0 whitespace-nowrap",
                                activeTab === 'general'
                                    ? "bg-accent-1 text-white shadow-sm"
                                    : "text-foreground hover:bg-black/5 dark:hover:bg-white/5"
                            )}
                        >
                            <Settings size={18} />
                            <span>General</span>
                        </button>
                        <button
                            onClick={() => setActiveTab('connections')}
                            className={cn(
                                "flex items-center gap-2 md:gap-3 px-3 py-2 md:py-2.5 rounded-lg text-sm font-medium transition-all duration-150 cursor-pointer shrink-0 whitespace-nowrap",
                                activeTab === 'connections'
                                    ? "bg-accent-1 text-white shadow-sm"
                                    : "text-foreground hover:bg-black/5 dark:hover:bg-white/5"
                            )}
                        >
                            <LinkIcon size={18} />
                            <span>Connections</span>
                        </button>
                    </nav>
                </div>

                <div className="flex-1 overflow-y-auto p-5 md:p-8">
                    {activeTab === 'general' && (
                        <div className="flex flex-col gap-6 animate-in fade-in duration-300">
                            <div>
                                <h3 className="text-lg font-semibold text-foreground">General</h3>
                                <p className="text-sm text-foreground/50 mt-1">
                                    Manage your general preferences.
                                </p>
                            </div>

                            <div>
                                <label className="text-sm font-medium text-foreground block mb-2">
                                    Theme Appearance
                                </label>
                                <Select
                                    value={theme}
                                    onChange={(val) => setTheme(val)}
                                    options={themeOptions}
                                    className="w-full sm:w-64"
                                />
                                <p className="text-xs text-foreground/50 mt-2">
                                    Select how you'd like the UI to appear on your screen.
                                </p>
                            </div>

                            <div>
                                <h4 className="text-sm font-medium text-foreground block mb-3">
                                    Product Tour
                                </h4>
                                <Button
                                    onClick={() => {
                                        onClose();
                                        setTimeout(() => startTour(), 300);
                                    }}
                                >
                                    Replay Tour
                                </Button>
                                <p className="text-xs text-foreground/50 mt-2">
                                    Restart the interactive guide to learn about the app's features.
                                </p>
                            </div>
                        </div>
                    )}

                    {activeTab === 'connections' && (
                        <div className="flex flex-col gap-6 animate-in fade-in duration-300">
                            <div>
                                <h3 className="text-lg font-semibold text-foreground">Connections</h3>
                                <p className="text-sm text-foreground/50 mt-1">
                                    Manage third-party integrations and data sources.
                                </p>
                            </div>

                            <div className="flex flex-col xl:flex-row items-stretch xl:items-center justify-between p-4 rounded-xl border border-border bg-neutral/50 gap-4">
                                <div className="flex items-center gap-3 md:gap-4 min-w-0 flex-1">
                                    <img
                                        src="/gdrive.svg"
                                        alt="Google Drive"
                                        className={cn("w-10 h-10 shrink-0 transition-all", !isDriveConnected && "grayscale opacity-50")}
                                    />
                                    <div className="flex flex-col min-w-0">
                                        <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5">
                                            <span className="font-semibold text-foreground truncate">Google Drive</span>
                                            {isDriveConnected && (
                                                <span className="flex items-center gap-1 text-xs font-bold text-green-600 whitespace-nowrap">
                                                    <CheckCircle2 size={11} />
                                                    Connected
                                                </span>
                                            )}
                                        </div>
                                        <span className="text-sm text-gray-500 truncate">
                                            Sync documents and client context
                                        </span>
                                    </div>
                                </div>
                                <Button
                                    className="w-full xl:w-auto"
                                    onClick={() => {
                                        if (isDriveConnected) {
                                            message.error('This function is not yet implemented.');
                                            // setisDriveConnected(false);
                                        } else {
                                            setisDriveConnected(true);
                                        }
                                    }}
                                >
                                    {isDriveConnected ? "Disconnect" : "Connect"}
                                </Button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </Modal>
    );
}
