'use client';

import React from 'react';
import { ExportOutlined } from '@ant-design/icons';
import type { MenuProps } from 'antd';
import { Dropdown } from 'antd';
import Image from 'next/image';
import { cn } from '@/utils/cn';

interface NavbarProps {
    isDriveConnected: boolean;
    onDriveClick: () => void;
    isDownloadable?: boolean;
    onDownloadClick?: (format: 'pdf' | 'txt') => void;
}

/**
 * Navbar component for the chat interface.
 * Houses the GDrive connection status and optional download/export actions.
 */
export function Navbar({
    isDriveConnected,
    onDriveClick,
    isDownloadable = false,
    onDownloadClick
}: NavbarProps) {
    const downloadItems: MenuProps['items'] = [
        {
            key: 'pdf',
            label: 'Download as PDF',
            onClick: () => onDownloadClick?.('pdf'),
        },
        {
            key: 'txt',
            label: 'Download as TXT',
            onClick: () => onDownloadClick?.('txt'),
        },
    ];

    return (
        <div className="flex items-center justify-between px-8 py-2 z-40">
            <div className="flex-1" /> {/* Spacer */}
            <div className="flex items-center gap-1">
                {/* Download/Share action - only visible if isDownloadable is true */}
                {isDownloadable && (
                    <Dropdown menu={{ items: downloadItems }} trigger={['click']} placement="bottomRight">
                        <button
                            className="flex items-center gap-2.5 h-10 px-4 rounded-full hover:bg-neutral transition-all text-[14px] font-semibold text-foreground/80 cursor-pointer group"
                        >
                            <ExportOutlined className="text-[18px] group-hover:text-accent-1 transition-colors" />
                            <span>Download</span>
                        </button>
                    </Dropdown>
                )}

                {/* Google Drive Status Pill */}
                <button
                    onClick={onDriveClick}
                    className={cn(
                        "flex items-center h-10 pl-1 pr-5 rounded-full border border-border bg-background backdrop-blur-sm transition-all hover:border-accent-1/50 cursor-pointer group"
                    )}
                >
                    <div className={cn(
                        "flex items-center justify-center w-8 h-8 mr-1.5 rounded-full transition-all",
                        !isDriveConnected && "opacity-60 grayscale bg-neutral-200"
                    )}>
                        <Image src="/gdrive.svg" className="w-5 h-5" alt="GDrive" width={20} height={20} />
                    </div>
                    <span className="text-[14px] font-semibold text-foreground/80">
                        {isDriveConnected ? "Connected" : "Connect GDrive"}
                    </span>
                </button>
            </div>
        </div>
    );
}
