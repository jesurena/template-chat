import api from '@/lib/api';
import { ChatMessage } from '@/interface/Chat';

export const chatService = {
    /**
     * Simulation: Fetches message history
     */
    getMessages: async (threadId?: string): Promise<ChatMessage[]> => {
        // Now using our global api instance with interceptors
        // const res = await api.get(`/chat/${threadId}`);
        // return res.data;

        return new Promise((resolve) => {
            setTimeout(() => {
                resolve([]); // Start with empty history
            }, 500);
        });
    },

    /**
     * Simulation: Sends a new message and returns AI response
     */
    sendMessage: async (text: string): Promise<ChatMessage> => {
        // Now using our global api instance with interceptors
        // const res = await api.post('/chat', { text });
        // return res.data;

        return new Promise((resolve) => {
            setTimeout(() => {
                resolve({
                    AccountID: 'ai-bot',
                    Nickname: 'AppDev Bot',
                    Text: "I've received your request. Let me look into that for you immediately.",
                    IsUser: false,
                    Timestamp: new Date().toISOString(),
                    Status: 'delivered'
                });
            }, 1500);
        });
    }
};
