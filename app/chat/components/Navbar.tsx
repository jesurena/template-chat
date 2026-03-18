'use client';

import React from 'react';
import { ExportOutlined } from '@ant-design/icons';
import { cn } from '@/utils/cn';

interface NavbarProps {
    isConnectedToDrive: boolean;
    onDriveClick: () => void;
    isDownloadable?: boolean;
    onDownloadClick?: () => void;
}

/**
 * Navbar component for the chat interface.
 * Houses the GDrive connection status and optional download/export actions.
 */
export function Navbar({ 
    isConnectedToDrive, 
    onDriveClick, 
    isDownloadable = false, 
    onDownloadClick 
}: NavbarProps) {
    return (
        <div className="flex items-center justify-between px-8 py-2 z-40">
            <div className="flex-1" /> {/* Spacer */}
            <div className="flex items-center gap-1">
                {/* Download/Share action - only visible if isDownloadable is true */}
                {isDownloadable && (
                    <button 
                        onClick={onDownloadClick}
                        className="flex items-center gap-2.5 h-10 px-4 rounded-full hover:bg-foreground/5 transition-all text-[14px] font-semibold text-foreground/80 cursor-pointer group"
                    >
                        <ExportOutlined className="text-[18px] group-hover:text-accent-1 transition-colors" />
                        <span>Download</span>
                    </button>
                )}

                {/* Google Drive Status Pill */}
                <button
                    onClick={onDriveClick}
                    className={cn(
                        "flex items-center h-10 pl-1 pr-5 rounded-full border border-border bg-background backdrop-blur-sm transition-all hover:border-accent-1/50 cursor-pointer group"
                    )}
                >
                    <div className={cn(
                        "flex items-center justify-center w-8 h-8 mr-1.5 rounded-full transition-all bg-black shadow-sm",
                        !isConnectedToDrive && "opacity-60 grayscale bg-neutral-200"
                    )}>
                        <img src="/gdrive.svg" className="w-5 h-5" alt="GDrive" />
                    </div>
                    <span className="text-[14px] font-semibold text-foreground/80">
                        {isConnectedToDrive ? "Connected" : "Connect GDrive"}
                    </span>
                </button>
            </div>
        </div>
    );
}
