'use client';

import React, { useState } from 'react';
import { Modal } from 'antd';
import { useDrive } from '@/components/Providers/drive-provider';
import { Loader2 } from 'lucide-react';

interface DriveConnectModalProps {
    onDisconnect: () => void;
}

export function DriveConnectModal({ onDisconnect }: DriveConnectModalProps) {
    const { isConnectedToDrive, setIsConnectedToDrive, isDriveModalOpen, setIsDriveModalOpen } = useDrive();
    const [isConnecting, setIsConnecting] = useState(false);

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
            <img
                src="/gdrive.svg"
                alt="Google Drive"
                className={`w-16 h-16 mx-auto mb-5 transition-all duration-300 ${!isConnectedToDrive ? "opacity-40 grayscale" : ""}`}
            />

            {isConnectedToDrive ? (
                <>
                    <h3 className="text-xl font-bold text-foreground mb-3">Google Drive is Connected</h3>
                    <p className="text-sm text-gray-500 mb-8 max-w-sm mx-auto">
                        Your client documents and resources are synced. We pull automated, hyper-specific chat context directly from your drive.
                    </p>
                    <div className="px-6 pb-2 flex flex-col gap-4">
                        <button
                            onClick={() => setIsDriveModalOpen(false)}
                            className="w-full bg-neutral hover:bg-neutral/80 text-foreground border border-border py-3 rounded-full font-bold shadow-sm transition-all text-[15px]"
                        >
                            Continue Chatting
                        </button>
                        <button
                            onClick={() => {
                                setIsConnectedToDrive(false);
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
                                    setIsConnectedToDrive(true);
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
