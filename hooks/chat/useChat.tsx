'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import { ChatThread, ChatMessage } from '@/interface/Chat';
import { streamChatResponse } from '@/utils/chat';

export { useChat } from '@/components/Providers/chat-provider';

/**
 * API Endpoints (Easier to adjust and debug here)
 */
const GET_CHAT_HISTORY_URL = '/chat_list';
const POST_STREAM_CHAT_URL = 'chat_stream';

export const useChatHistory = (accountId: string | null) => {
    return useQuery<ChatThread[]>({
        queryKey: ['chat-history', accountId],
        queryFn: async () => {
            if (!accountId) return [];
            const { data } = await api.get(`${GET_CHAT_HISTORY_URL}?accountId=${accountId}`);
            return data.chats || [];
        },
        enabled: !!accountId,
    });
};

export const useStreamMessage = (
    onChunk: (text: string) => void,
    onComplete: (text: string) => void,
    onError: (err: any) => void
) => {
    const queryClient = useQueryClient();

    const baseUrl = process.env.NEXT_PUBLIC_API_URL?.endsWith('/') 
        ? process.env.NEXT_PUBLIC_API_URL 
        : `${process.env.NEXT_PUBLIC_API_URL}/`;
    
    const streamUrl = `${baseUrl}${POST_STREAM_CHAT_URL}`;

    return useMutation({
        mutationFn: async ({ prompt, history, controller }: { prompt: string, history: ChatMessage[], controller: AbortController }) => {
            return await streamChatResponse(streamUrl, prompt, history, controller, onChunk);
        },
        onSuccess: (data) => {
            onComplete(data);
            queryClient.invalidateQueries({ queryKey: ['chat-history'] });
        },
        onError: (error) => {
            onError(error);
        }
    });
};
