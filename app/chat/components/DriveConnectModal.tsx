'use client';

import Image from 'next/image';

import React, { useState } from 'react';
import { Modal } from 'antd';
import { useDrive } from '@/components/Providers/drive-provider';
import { Loader2, Box, ChevronDown, ChevronUp } from 'lucide-react';
import { message } from '@/components/Providers/theme-provider';

interface DriveConnectModalProps {
    onDisconnect: () => void;
}

export function DriveConnectModal({ onDisconnect }: DriveConnectModalProps) {
    const { isDriveConnected, setisDriveConnected, isDriveModalOpen, setIsDriveModalOpen, driveFiles } = useDrive();
    const [isConnecting, setIsConnecting] = useState(false);
    const [showAllFiles, setShowAllFiles] = useState(false);

    return (
        <Modal
            open={isDriveModalOpen}
            onCancel={() => setIsDriveModalOpen(false)}
            footer={null}
            centered
            classNames={{
                body: 'custom-modal-body p-4 pt-8 text-center'
            }}
        >
            <Image
                src="/gdrive.svg"
                alt="Google Drive"
                width={64}
                height={64}
                className={`mx-auto mb-5 transition-all duration-300 ${!isDriveConnected ? "opacity-40 grayscale" : ""}`}
            />

            {isDriveConnected ? (
                <>
                    <h3 className="text-xl font-bold text-foreground mb-3">Google Drive is Connected</h3>
                    <p className="text-sm text-gray-500 mb-6 max-w-sm mx-auto">
                        Your client documents and resources are synced. We pull automated, hyper-specific chat context directly from your drive.
                    </p>

                    {isDriveConnected && driveFiles.length > 0 && (
                        <div className="mb-8 text-left animate-in fade-in slide-in-from-bottom-2 duration-300">
                            <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3 px-1 flex items-center gap-2">
                                <Box size={14} className="text-accent-1" />
                                Connected Files ({driveFiles.length})
                            </h4>
                            <div className="flex flex-wrap gap-2 max-h-[220px] overflow-y-auto pr-1 custom-scrollbar">
                                {driveFiles.slice(0, showAllFiles ? undefined : 6).map((file: any) => (
                                    <div
                                        key={file.id}
                                        className="flex items-center gap-2 px-3 py-1.5 bg-neutral/40 border border-border rounded-lg text-[11px] font-medium text-foreground/70 hover:border-accent-1/30 hover:bg-neutral transition-all cursor-default group"
                                    >
                                        <Image src="/gdrive.svg" alt="" width={12} height={12} className="grayscale group-hover:grayscale-0 transition-all" />
                                        <span className="truncate max-w-[120px]">{file.name}</span>
                                    </div>
                                ))}
                                
                                {driveFiles.length > 6 && (
                                    <button 
                                        onClick={() => setShowAllFiles(!showAllFiles)}
                                        className="flex items-center gap-1.5 px-3 py-1.5 text-[11px] font-bold text-accent-1 hover:bg-accent-1/5 rounded-lg transition-all"
                                    >
                                        {showAllFiles ? (
                                            <>Show Less <ChevronUp size={12} /></>
                                        ) : (
                                            <>+{driveFiles.length - 6} More <ChevronDown size={12} /></>
                                        )}
                                    </button>
                                )}
                            </div>
                        </div>
                    )}
                    <div className="px-6 pb-2 flex flex-col gap-4">
                        <button
                            onClick={() => setIsDriveModalOpen(false)}
                            className="w-full bg-neutral hover:bg-neutral/80 text-foreground border border-border py-3 rounded-full font-bold shadow-sm transition-all text-[15px]"
                        >
                            Continue Chatting
                        </button>
                        <button
                            onClick={() => {
                                message.error('This function is not yet implemented.');
                                setIsDriveModalOpen(false);
                                onDisconnect();
                            }}
                            className="text-gray-500 hover:text-red-500 font-medium transition-colors text-sm"
                        >
                            Disconnect Drive
                        </button>
                    </div>
                </>
            ) : (
                <>
                    <h3 className="text-xl font-bold text-foreground mb-3">Connect Google Drive</h3>
                    <p className="text-sm text-gray-500 mb-6 max-w-sm mx-auto">
                        Sync your client documents and resources to provide automated, hyper-specific chat context directly from the source.
                    </p>
                    <div className="px-6 pb-2 flex flex-col items-center gap-4">
                        <button
                            disabled={isConnecting}
                            onClick={() => {
                                setIsConnecting(true);
                                setTimeout(() => {
                                    setisDriveConnected(true);
                                    setIsConnecting(false);
                                    setIsDriveModalOpen(false);
                                }, 3000);
                            }}
                            className={`w-full bg-accent-1 hover:opacity-90 text-white py-3 rounded-full font-bold shadow-md transition-all text-[15px] flex items-center justify-center gap-2 ${isConnecting ? 'opacity-70 cursor-not-allowed' : ''}`}
                        >
                            {isConnecting ? (
                                <>
                                    <Loader2 className="animate-spin" size={18} />
                                    Connecting...
                                </>
                            ) : (
                                "Connect Drive"
                            )}
                        </button>
                        <button
                            onClick={() => setIsDriveModalOpen(false)}
                            className="text-gray-500 hover:text-gray-700 font-medium transition-colors text-sm"
                        >
                            Skip for now
                        </button>
                    </div>
                </>
            )}
        </Modal>
    );
}
