'use client';

import React, { useState, useRef, useEffect } from 'react';
import { ChatIntro } from './components/ChatIntro';
import { ChatInput } from './components/ChatInput';
import { ChatMessages } from './components/ChatMessages';
import { QuickQuestions, QuickQuestion } from './components/ChatQuickQuestions';
import { GeneratedQuestionsModal, getGeneratedQuestions } from './components/GeneratedQuestionsModal';
import { DriveConnectModal } from './components/DriveConnectModal';
import { useChat } from '@/hooks/chat/useChat';
import { Company } from '@/interface/Chat';
import { useDrive } from '@/components/Providers/drive-provider';
import { Navbar } from './components/Navbar';
import { cn } from '@/utils/cn';

export default function ChatPage() {
    const [inputValue, setInputValue] = useState('');
    const { messages, isTyping, sendMessage, stopTyping } = useChat();
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const [mounted, setMounted] = useState(false);

    // Google Drive connection state (shared via context)
    const { isConnectedToDrive, isDriveModalOpen, setIsDriveModalOpen } = useDrive();

    const [isCompanyModalOpen, setIsCompanyModalOpen] = useState(false);
    const [selectedCompanies, setSelectedCompanies] = useState<Company[]>([]);

    const [isGeneratedQuestionsModalOpen, setIsGeneratedQuestionsModalOpen] = useState(false);

    const [customQuickQuestions, setCustomQuickQuestions] = useState<QuickQuestion[]>([]);

    useEffect(() => {
        if (selectedCompanies.length > 0) {
            const generated = getGeneratedQuestions(selectedCompanies).slice(0, 6);
            const mapped = generated.map(q => ({
                label: q.category,
                prompt: q.question
            }));
            setCustomQuickQuestions(mapped);
        } else {
            setCustomQuickQuestions([]);
        }
    }, [selectedCompanies]);

    const toggleCompanySelect = (company: Company) => {
        setSelectedCompanies(prev => {
            const isSelected = prev.some(c => c.company_name === company.company_name);
            if (isSelected) {
                return prev.filter(c => c.company_name !== company.company_name);
            }
            return [...prev, company];
        });
    };

    const removeCompany = (companyName: string) => {
        setSelectedCompanies(prev => prev.filter(c => c.company_name !== companyName));
    };

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isTyping]);

    useEffect(() => {
        setMounted(true);
    }, []);

    const handleSendMessage = (text: string) => {
        if (!text.trim()) return;
        sendMessage(text);
        setInputValue('');
    };

    // Actions
    const handleGenerateQuestions = () => {
        if (selectedCompanies.length === 0) return;
        setIsCompanyModalOpen(false);
        setIsGeneratedQuestionsModalOpen(true);
    };

    const handleUseGeneratedQuestion = (prompt: string) => {
        setIsGeneratedQuestionsModalOpen(false);
        setInputValue(prompt);
        setTimeout(() => {
            const textarea = document.querySelector('textarea');
            textarea?.focus();
        }, 100);
    };

    const handleInsertQuestion = (prompt: string) => {
        setInputValue(prompt);
        setTimeout(() => {
            const textarea = document.querySelector('textarea');
            textarea?.focus();
        }, 100);
    };

    const handleCloseGeneratedQuestions = () => {
        setIsGeneratedQuestionsModalOpen(false);
    };

    const handleSkip = () => {
        setIsCompanyModalOpen(false);
        const textarea = document.querySelector('textarea');
        textarea?.focus();
    };

    return (
        <div className="flex flex-col h-full bg-chat-bg transition-colors duration-300 relative overflow-hidden">
            {/* Header Navbar with integrated actions */}
            <Navbar 
                isConnectedToDrive={isConnectedToDrive} 
                onDriveClick={() => setIsDriveModalOpen(true)}
                isDownloadable={messages.length > 0}
                onDownloadClick={() => {/* Implement download functionality when needed */}}
            />

            <div className="flex-1 overflow-y-auto bg-chat-bg scrollbar-hide">
                <div className="max-w-4xl mx-auto min-h-full flex flex-col pl-16 pr-4 md:px-0">
                    {messages.length === 0 ? (
                        <ChatIntro
                            selectedCompanies={selectedCompanies}
                            toggleCompanySelect={toggleCompanySelect}
                            onMoreClick={() => setIsCompanyModalOpen(true)}
                            onGenerateQuestions={handleGenerateQuestions}
                            onSkip={handleSkip}
                            isConnectedToDrive={isConnectedToDrive}
                            onSuggestionClick={handleInsertQuestion}
                        />
                    ) : (
                        <ChatMessages messages={messages} isTyping={isTyping} />
                    )}
                    <div ref={messagesEndRef} className="h-4" />
                </div>
            </div>

            {/* Quick Questions & Input Area */}
            <div className="w-full bg-chat-bg">
                {/* Only show Quick Questions after intro and when not typing */}
                {!isTyping && messages.length > 0 && (
                    <div className="max-w-4xl mx-auto px-4">
                        <QuickQuestions
                            onQuestionClick={handleInsertQuestion}
                            questions={customQuickQuestions}
                        />
                    </div>
                )}

                <ChatInput
                    inputValue={inputValue}
                    setInputValue={setInputValue}
                    onSendMessage={handleSendMessage}
                    selectedCompanies={selectedCompanies}
                    toggleCompanySelect={toggleCompanySelect}
                    removeCompany={removeCompany}
                    isCompanyModalOpen={isCompanyModalOpen}
                    setIsCompanyModalOpen={setIsCompanyModalOpen}
                    onGenerateQuestions={handleGenerateQuestions}
                    onSkip={handleSkip}
                    isConnectedToDrive={isConnectedToDrive}
                    isTyping={isTyping}
                    onStop={stopTyping}
                />
            </div>

            {/* Google Drive Connect Modal */}
            {mounted && (
                <DriveConnectModal
                    onDisconnect={() => setSelectedCompanies([])}
                />
            )}

            {mounted && (
                <GeneratedQuestionsModal
                    isOpen={isGeneratedQuestionsModalOpen}
                    onClose={handleCloseGeneratedQuestions}
                    onUseQuestion={handleUseGeneratedQuestion}
                    selectedCompanies={selectedCompanies}
                />
            )}
        </div>
    );
}