'use client';

import { useQuery, useMutation } from '@tanstack/react-query';
import api from '@/lib/api';
import { ChatMessage, ChatHistoryItem } from '@/interface/Chat';
import { streamChatResponse } from '@/utils/chat';

export { useChat } from '@/components/Providers/chat-provider';

export const useChatHistory = (accountId: string | null) => {
    return useQuery<ChatHistoryItem[]>({
        queryKey: ['chat-history', accountId],
        queryFn: async () => {
            if (!accountId) return [];
            const { data } = await api.get(`/chat_list?accountId=${accountId}`);
            return data?.chats || [];
        },
        enabled: !!accountId,
    });
};

export const useLoadChatHistory = () => {
    return useMutation({
        mutationFn: async (chatId: string) => {
            const accountId = localStorage.getItem("AoId");
            const { data } = await api.get(`/chat_history/${chatId}?accountId=${accountId}`);

            const messages = (data.messages || []).map((m: { role?: string; content?: string; message?: string }) => ({
                role: m.role || 'assistant',
                content: m.content || m.message || '',
            }));

            return {
                messages,
                sessionId: data.session_id,
                chatId: chatId
            };
        }
    });
};

export const useStreamMessage = (
    onChunk: (text: string) => void,
    onComplete: (text: string) => void,
    onError: (err: unknown) => void
) => {
    const streamUrl = `${process.env.NEXT_PUBLIC_API_URL}chat_stream`;

    return useMutation({
        mutationFn: async ({ prompt, history, controller, chatId, sessionId, companyName }: {
            prompt: string,
            history: ChatMessage[],
            controller: AbortController,
            chatId: string,
            sessionId: string,
            companyName: string | null
        }) => {
            return await streamChatResponse(
                streamUrl,
                prompt,
                history,
                controller,
                onChunk,
                chatId,
                sessionId,
                companyName
            );
        },
        onSuccess: (data) => {
            onComplete(data);
        },
        onError: (error) => {
            onError(error);
        }
    });
};

export const useGenerateKeywords = () => {
    return useMutation({
        mutationFn: async (companiesPayload: Record<string, unknown>[]) => {
            const { data } = await api.post('/generate_keywords_from_company', {
                companies: companiesPayload
            });
            return data.data || [];
        }
    });
};

export const useGenerateQuestions = () => {
    return useMutation({
        mutationFn: async ({ keywords, companiesPayload }: { keywords: string[]; companiesPayload: Record<string, unknown>[] }) => {
            const { data } = await api.post('/generate_questions', {
                company: companiesPayload[0],
                keywords: keywords
            });
            return data.data || [];
        }
    });
};
