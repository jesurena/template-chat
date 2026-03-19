'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import { ChatThread, ChatMessage } from '@/interface/Chat';
import { streamChatResponse } from '@/utils/chat';

export { useChat } from '@/components/Providers/chat-provider';

export const useChatHistory = (accountId: string | null) => {
    return useQuery<ChatThread[]>({
        queryKey: ['chat-history', accountId],
        queryFn: async () => {
            if (!accountId) return [];
            const { data } = await api.get(`/chat_list?accountId=${accountId}`);
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

    return useMutation({
        mutationFn: async ({ prompt, history, controller }: { prompt: string, history: ChatMessage[], controller: AbortController }) => {
            return await streamChatResponse(prompt, history, controller, onChunk);
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
