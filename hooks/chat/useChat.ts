'use client';

import { useState, useRef } from 'react';
import { ChatMessage } from '@/interface/Chat';

export function useChat() {
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [isTyping, setIsTyping] = useState(false);
    const abortControllerRef = useRef<AbortController | null>(null);

    const stopTyping = () => {
        if (abortControllerRef.current) {
            abortControllerRef.current.abort();
            abortControllerRef.current = null;
        }
    };

    const sendMessage = async (prompt: string) => {
        if (!prompt.trim()) return;

        // Abort any existing request
        stopTyping();
        
        const controller = new AbortController();
        abortControllerRef.current = controller;

        const userMsg: ChatMessage = {
            AccountID: 'user-01',
            Nickname: 'Admin User',
            Text: prompt,
            IsUser: true,
            Timestamp: new Date().toISOString(),
            Status: 'sent'
        };

        const aiMsg: ChatMessage = {
            AccountID: 'ai-bot',
            Nickname: 'AppDev Bot',
            Text: '',
            IsUser: false,
            Timestamp: new Date().toISOString(),
            Status: 'sending'
        };

        // Add user message and a placeholder for AI response
        setMessages(prev => [...prev, userMsg, aiMsg]);
        setIsTyping(true);

        try {
            const baseUrl = process.env.NEXT_PUBLIC_API_URL?.endsWith('/') 
                ? process.env.NEXT_PUBLIC_API_URL 
                : `${process.env.NEXT_PUBLIC_API_URL}/`;
            
            const response = await fetch(`${baseUrl}chat_stream`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
                body: JSON.stringify({ prompt }),
                credentials: 'include',
                signal: controller.signal
            });

            if (!response.ok) {
                throw new Error('Failed to connect to the chat stream');
            }

            if (!response.body) {
                throw new Error('No response body available');
            }

            const reader = response.body.getReader();
            const decoder = new TextDecoder();
            let accumulatedText = '';

            while (true) {
                const { done, value } = await reader.read();
                if (done) break;

                const chunk = decoder.decode(value, { stream: true });
                
                // Simple SSE parsing if it detects the "data: " prefix
                if (chunk.includes('data: ')) {
                    const lines = chunk.split('\n');
                    for (const line of lines) {
                        const trimmed = line.trim();
                        if (trimmed.startsWith('data: ')) {
                            const data = trimmed.slice(6);
                            if (data === '[DONE]') continue;
                            try {
                                const parsed = JSON.parse(data);
                                accumulatedText += parsed.text || parsed.content || parsed.message || data;
                            } catch (e) {
                                accumulatedText += data;
                            }
                        }
                    }
                } else {
                    // Raw text streaming
                    accumulatedText += chunk;
                }

                // Update the last message (the AI's response) with the accumulated text
                setMessages(prev => {
                    const updated = [...prev];
                    const lastIndex = updated.length - 1;
                    if (lastIndex >= 0 && !updated[lastIndex].IsUser) {
                        updated[lastIndex] = {
                            ...updated[lastIndex],
                            Text: accumulatedText,
                            Status: 'delivered'
                        };
                    }
                    return updated;
                });
            }
        } catch (error: any) {
            if (error.name === 'AbortError') {
                console.log('Typing stopped by user');
                return;
            }
            console.error('Streaming error:', error);
            setMessages(prev => {
                const updated = [...prev];
                const lastIndex = updated.length - 1;
                if (lastIndex >= 0 && !updated[lastIndex].IsUser) {
                    updated[lastIndex] = {
                        ...updated[lastIndex],
                        Text: 'Error: Failed to get response from AI. Please try again.',
                        Status: 'delivered'
                    };
                }
                return updated;
            });
        } finally {
            setMessages(prev => {
                const updated = [...prev];

                for (let index = updated.length - 1; index >= 0; index--) {
                    if (updated[index].IsUser) {
                        updated[index] = {
                            ...updated[index],
                            Status: 'delivered'
                        };
                        break;
                    }
                }

                return updated;
            });

            setIsTyping(false);
            abortControllerRef.current = null;
        }
    };

    return {
        messages,
        isTyping,
        sendMessage,
        stopTyping,
        resetChat: () => setMessages([]),
        loadChat: (msgs: ChatMessage[]) => setMessages(msgs)
    };
}
