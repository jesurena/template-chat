'use client';

import React, { useState, useRef, useEffect } from 'react';
import { QuickQuestions } from './components/ChatComponents';
import { ChatIntro } from './components/ChatIntro';
import { ChatInput } from './components/ChatInput';
import { ChatMessages } from './components/ChatMessages';
import { useChat } from '@/hooks/chat/useChat';

export default function ChatPage() {
    const [inputValue, setInputValue] = useState('');
    const { messages, isTyping, sendMessage } = useChat();
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isTyping]);

    const handleSendMessage = (text: string) => {
        if (!text.trim()) return;
        sendMessage(text);
        setInputValue('');
    };

    return (
        <div className="flex flex-col h-full bg-chat-bg transition-colors duration-300 relative">
            <div className="flex-1 overflow-y-auto bg-chat-bg scrollbar-hide">
                <div className="max-w-4xl mx-auto min-h-full flex flex-col">
                    {messages.length === 0 ? (
                        <ChatIntro onSuggestionClick={handleSendMessage} />
                    ) : (
                        <ChatMessages messages={messages} isTyping={isTyping} />
                    )}
                    <div ref={messagesEndRef} className="h-4" />
                </div>
            </div>

            <ChatInput
                inputValue={inputValue}
                setInputValue={setInputValue}
                onSendMessage={handleSendMessage}
                showQuickQuestions={messages.length > 0 && !isTyping}
            />
        </div>
    );
}