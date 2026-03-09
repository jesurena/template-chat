'use client';

import React, { useEffect } from 'react';
import { Modal, Select } from 'antd';
import { useTheme, type Theme } from '@/components/Providers/theme-provider';
import { Settings, Sun, Moon, Monitor, X } from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

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

    return (
        <Modal
            open={visible}
            onCancel={onClose}
            footer={null}
            closeIcon={null}
            width={{
                xs: '90%',
                sm: '80%',
                md: '70%',
                lg: '60%',
                xl: '50%',
                xxl: '40%',
            }}
            mask={false}
            centered
        >
            <div className="flex h-[520px] relative">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 p-2 rounded-full text-foreground/50 hover:text-foreground hover:bg-foreground/5 transition-all z-10"
                >
                    <X size={20} />
                </button>
                <div className="w-[220px] bg-neutral border-r border-border flex flex-col shrink-0">
                    <div className="px-5 pt-6 pb-4">
                        <h2 className="text-base font-bold text-foreground tracking-tight">Settings</h2>
                    </div>

                    <nav className="flex flex-col gap-1 px-3 flex-1">
                        <button
                            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 cursor-pointer bg-accent-1 text-white shadow-sm"
                        >
                            <Settings size={18} />
                            <span>General</span>
                        </button>
                    </nav>
                </div>

                <div className="flex-1 overflow-y-auto p-8">
                    <div className="flex flex-col gap-6">
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
                    </div>
                </div>
            </div>
        </Modal>
    );
}
