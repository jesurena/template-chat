'use client';

import { useMutation } from '@tanstack/react-query';
import { useState } from 'react';
import api from '@/lib/api';
import { ChatMessage } from '@/interface/Chat';

export function useChat() {
    const [messages, setMessages] = useState<ChatMessage[]>([]);

    const sendMessage = useMutation({
        mutationFn: async (prompt: string) => {
            const { data } = await api.post('/chat_stream', { prompt });
            return data;
        },
        onSuccess: (aiText, prompt) => {
            const userMsg: ChatMessage = {
                AccountID: 'user-01',
                Nickname: 'Admin User',
                Text: prompt,
                IsUser: true,
                Timestamp: new Date().toISOString(),
                Status: 'delivered'
            };

            const aiMsg: ChatMessage = {
                AccountID: 'ai-bot',
                Nickname: 'AppDev Bot',
                Text: aiText,
                IsUser: false,
                Timestamp: new Date().toISOString(),
                Status: 'delivered'
            };

            setMessages(prev => [...prev, userMsg, aiMsg]);
        },
    });

    return {
        messages,
        isTyping: sendMessage.isPending,
        sendMessage: (prompt: string) => sendMessage.mutate(prompt),
        resetChat: () => setMessages([]),
        loadChat: (msgs: ChatMessage[]) => setMessages(msgs)
    };
}
