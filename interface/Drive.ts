export interface DriveFile {
    id: string;
    name: string;
    webViewLink?: string;
    iconLink?: string;
    hasThumbnail?: boolean;
    thumbnailLink?: string;
    createdTime?: string;
    modifiedTime?: string;
}

export interface DriveStatusResponse {
    status: 'connected' | 'disconnected';
    message: string;
    file_count?: number;
}
