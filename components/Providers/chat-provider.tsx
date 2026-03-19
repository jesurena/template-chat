'use client';

import React, { createContext, useContext, useState, useRef, ReactNode } from 'react';
import { ChatMessage } from '@/interface/Chat';
import { createMessage } from '@/utils/chat';
import { useStreamMessage } from '@/hooks/chat/useChat';

interface ChatContextType {
    messages: ChatMessage[];
    isTyping: boolean;
    streamingText: string;
    sendMessage: (prompt: string) => Promise<void>;
    stopTyping: () => void;
    resetChat: () => void;
    loadChat: (msgs: ChatMessage[]) => void;
}

export const ChatContext = createContext<ChatContextType | undefined>(undefined);

export function ChatProvider({ children }: { children: ReactNode }) {
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [isTyping, setIsTyping] = useState(false);
    const [streamingText, setStreamingText] = useState("");
    const abortControllerRef = useRef<AbortController | null>(null);

    const streamMutation = useStreamMessage(
        (chunk) => setStreamingText(chunk),
        (completeText) => {
            setMessages(prev => {
                const updated = [...prev];
                for (let i = updated.length - 1; i >= 0; i--) {
                    if (updated[i].role === 'user') {
                        updated[i].Status = 'delivered';
                        break;
                    }
                }
                return [...updated, createMessage(completeText, 'assistant')];
            });
            setIsTyping(false);
            setStreamingText("");
        },
        (error) => {
            console.error('Streaming error:', error);
            setMessages(prev => [...prev, createMessage('⚠️ Error: Failed to get response.', 'assistant')]);
            setIsTyping(false);
            setStreamingText("");
        }
    );

    const stopTyping = () => {
        if (abortControllerRef.current) {
            abortControllerRef.current.abort();
            abortControllerRef.current = null;
        }
        setIsTyping(false);
        setStreamingText("");
    };

    const sendMessage = async (prompt: string) => {
        if (!prompt.trim() || isTyping) return;

        stopTyping();
        const controller = new AbortController();
        abortControllerRef.current = controller;

        const userMsg = createMessage(prompt, 'user');
        const updatedMessages = [...messages, userMsg];
        setMessages(updatedMessages);
        setIsTyping(true);
        setStreamingText("");

        streamMutation.mutate({
            prompt,
            history: updatedMessages,
            controller
        });
    };

    return (
        <ChatContext.Provider value={{
            messages,
            isTyping,
            streamingText,
            sendMessage,
            stopTyping,
            resetChat: () => {
                setMessages([]);
                setStreamingText("");
                setIsTyping(false);
            },
            loadChat: (msgs: ChatMessage[]) => setMessages(msgs)
        }}>
            {children}
        </ChatContext.Provider>
    );
}

export function useChat() {
    const context = useContext(ChatContext);
    if (context === undefined) {
        throw new Error('useChat must be used within a ChatProvider');
    }
    return context;
}
