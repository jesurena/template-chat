export type MessageStatus = 'sent' | 'delivered';

export interface ChatMessage {
    AccountID: string;
    Nickname: string;
    Text: string;
    IsUser: boolean;
    Timestamp: string;
    Status?: MessageStatus;
}

export interface ChatThread {
    ThreadID: string;
    Title: string;
    LastMessage: string;
    UpdatedAt: string;
}
