'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';
import { useDriveStatus, useDriveFiles } from '@/hooks/drive/useDriveQuery';
import { DriveFile } from '@/interface/Drive';

interface DriveContextType {
    isDriveConnected: boolean;
    setisDriveConnected: (connected: boolean) => void; 
    isDriveModalOpen: boolean;
    setIsDriveModalOpen: (open: boolean) => void;
    driveFiles: DriveFile[];
    isLoadingFiles: boolean;
}

const DriveContext = createContext<DriveContextType | undefined>(undefined);

export function DriveProvider({ children }: { children: ReactNode }) {
    const [isDriveModalOpen, setIsDriveModalOpen] = useState(false);
    const [manualConnected, setManualConnected] = useState<boolean | null>(null);

    const { data: driveStatusData } = useDriveStatus();
    const isDriveConnected = manualConnected ?? (driveStatusData?.status === "connected");

    const { data: filesData, isLoading: isLoadingFiles } = useDriveFiles(isDriveConnected);

    return (
        <DriveContext.Provider value={{
            isDriveConnected,
            setisDriveConnected: (connected: boolean) => setManualConnected(connected),
            isDriveModalOpen,
            setIsDriveModalOpen,
            driveFiles: filesData || [],
            isLoadingFiles,
        }}>
            {children}
        </DriveContext.Provider>
    );
}

export function useDrive() {
    const context = useContext(DriveContext);
    if (context === undefined) {
        throw new Error('useDrive must be used within a DriveProvider');
    }
    return context;
}
