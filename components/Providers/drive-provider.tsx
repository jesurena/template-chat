'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';

interface DriveContextType {
    isConnectedToDrive: boolean;
    setIsConnectedToDrive: (connected: boolean) => void;
    isDriveModalOpen: boolean;
    setIsDriveModalOpen: (open: boolean) => void;
}

const DriveContext = createContext<DriveContextType | undefined>(undefined);

export function DriveProvider({ children }: { children: ReactNode }) {
    const [isConnectedToDrive, setIsConnectedToDrive] = useState(false);
    const [isDriveModalOpen, setIsDriveModalOpen] = useState(true);

    return (
        <DriveContext.Provider value={{
            isConnectedToDrive,
            setIsConnectedToDrive,
            isDriveModalOpen,
            setIsDriveModalOpen
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
