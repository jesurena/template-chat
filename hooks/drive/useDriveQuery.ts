import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';
import { DriveFile, DriveStatusResponse } from '@/interface/Drive';

export const useDriveStatus = (enabled: boolean = true) => {
    return useQuery<DriveStatusResponse>({
        queryKey: ['drive-status'],
        queryFn: async () => {
            const { data } = await api.get('/check_drive_connection');
            return data;
        },
        staleTime: 5 * 60 * 1000,
        enabled: enabled,
    });
};

export const useDriveFiles = (enabled: boolean = true) => {
    return useQuery<DriveFile[]>({
        queryKey: ['drive-files'],
        queryFn: async () => {
            const { data } = await api.get('/list_drive_files');
            return data.files || [];
        },
        enabled: enabled,
        retry: false,
    });
};


