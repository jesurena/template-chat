'use client';

import React, { createContext, useContext, useState, useRef, ReactNode } from 'react';
import { ChatMessage } from '@/interface/Chat';
import { createMessage } from '@/utils/chat';
import { useStreamMessage } from '@/hooks/chat/useChat';

interface ChatContextType {
    messages: ChatMessage[];
    isTyping: boolean;
    streamingText: string;
    chatId: string;
    sessionId: string;
    sendMessage: (prompt: string, companyName?: string | null) => Promise<void>;
    stopTyping: () => void;
    resetChat: () => void;
    loadChat: (msgs: ChatMessage[], newChatId?: string, newSessionId?: string) => void;
}

export const ChatContext = createContext<ChatContextType | undefined>(undefined);

function generateUUID() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
        const r = Math.random() * 16 | 0;
        const v = c === 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

export function ChatProvider({ children }: { children: ReactNode }) {
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [isTyping, setIsTyping] = useState(false);
    const [streamingText, setStreamingText] = useState("");
    const abortControllerRef = useRef<AbortController | null>(null);

    const [chatId, setChatId] = useState(() => {
        if (typeof window === 'undefined') return '';
        const saved = localStorage.getItem("chat_id");
        if (saved) return saved;
        const id = generateUUID();
        localStorage.setItem("chat_id", id);
        return id;
    });

    const [sessionId, setSessionId] = useState(() => {
        if (typeof window === 'undefined') return '';
        const saved = localStorage.getItem("session_id");
        if (saved) return saved;
        const id = generateUUID();
        localStorage.setItem("session_id", id);
        return id;
    });

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

    const stopTyping = React.useCallback(() => {
        if (abortControllerRef.current) {
            abortControllerRef.current.abort();
            abortControllerRef.current = null;
        }
        setIsTyping(false);
        setStreamingText("");
    }, []);

    const sendMessage = React.useCallback(async (prompt: string, companyName: string | null = null) => {
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
            history: messages,
            controller,
            chatId,
            sessionId,
            companyName
        });
    }, [messages, isTyping, stopTyping, streamMutation, chatId, sessionId]);

    const resetChat = React.useCallback(() => {
        setMessages([]);
        setStreamingText("");
        setIsTyping(false);
        
        const newChat = generateUUID();
        setChatId(newChat);
        localStorage.setItem("chat_id", newChat);
    }, []);

    const loadChat = React.useCallback((msgs: ChatMessage[], newChatId?: string, newSessionId?: string) => {
        setMessages(msgs);
        if (newChatId) {
            setChatId(newChatId);
            localStorage.setItem("chat_id", newChatId);
        }
        if (newSessionId) {
            setSessionId(newSessionId);
            localStorage.setItem("session_id", newSessionId);
        }
    }, []);

    return (
        <ChatContext.Provider value={{
            messages,
            isTyping,
            streamingText,
            chatId,
            sessionId,
            sendMessage,
            stopTyping,
            resetChat,
            loadChat
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
