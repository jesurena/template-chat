'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { ChatInput } from '../components/ChatInput';
import { ChatMessages } from '../components/ChatMessages';
import { QuickQuestions, QuickQuestion } from '../components/ChatQuickQuestions';
import { GeneratedQuestionsModal, getGeneratedQuestions } from '../components/GeneratedQuestionsModal';
import { DriveConnectModal } from '../components/DriveConnectModal';
import { useChat, useLoadChatHistory, useGenerateKeywords } from '@/hooks/chat/useChat';
import { Company } from '@/interface/Chat';
import { useDrive } from '@/components/Providers/drive-provider';
import { Navbar } from '../components/Navbar';
import { useCompanies } from '@/hooks/chat/useCompanies';

export default function ChatHistoryPage() {
    const params = useParams();
    const chatId = params.chatId as string;

    const [inputValue, setInputValue] = useState('');
    const { messages, isTyping, sendMessage, stopTyping, streamingText, loadChat, chatId: currentChatId } = useChat();
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const [mounted, setMounted] = useState(false);
    const { mutateAsync: fetchHistory } = useLoadChatHistory();
    const { isDriveConnected, setIsDriveModalOpen } = useDrive();

    const [isCompanyModalOpen, setIsCompanyModalOpen] = useState(false);
    const [selectedCompanies, setSelectedCompanies] = useState<Company[]>([]);
    const { data: companies = [] } = useCompanies();

    const [isGeneratedQuestionsModalOpen, setIsGeneratedQuestionsModalOpen] = useState(false);
    const [customQuickQuestions, setCustomQuickQuestions] = useState<QuickQuestion[]>([]);

    useEffect(() => {
        const loadInitialHistory = async () => {
            if (!chatId || (chatId === currentChatId && messages.length > 0)) {
                return;
            }

            try {
                const data = await fetchHistory(chatId);
                loadChat(data.messages, data.chatId, data.sessionId);
            } catch (error) {
                console.error("Failed to load chat history:", error);
            }
        };

        loadInitialHistory();
    }, [chatId, fetchHistory, loadChat, currentChatId, messages.length]);

    useEffect(() => {
        const timer = setTimeout(() => {
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
        }, 0);
        return () => clearTimeout(timer);
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
        const timer = setTimeout(() => {
            setMounted(true);
        }, 0);
        return () => clearTimeout(timer);
    }, []);

    const handleSendMessage = (text: string) => {
        if (!text.trim()) return;
        const companyName = selectedCompanies.length > 0 ? selectedCompanies[0].company_name : null;
        sendMessage(text, companyName);
        setInputValue('');
    };

    const [generatedKeywords, setGeneratedKeywords] = useState<Record<string, unknown> | undefined>(undefined);
    const generateKeywordsMutation = useGenerateKeywords();

    const handleGenerateQuestions = async () => {
        if (selectedCompanies.length === 0) return;

        setIsCompanyModalOpen(false);
        setIsGeneratedQuestionsModalOpen(true);

        try {
            const companiesPayload = selectedCompanies as unknown as Record<string, unknown>[];
            const data = await generateKeywordsMutation.mutateAsync(companiesPayload);
            setGeneratedKeywords(data as Record<string, unknown>);
        } catch (error) {
            console.error("Failed to generate keywords:", error);
        }
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
            <Navbar
                isDriveConnected={isDriveConnected}
                onDriveClick={() => setIsDriveModalOpen(true)}
                isDownloadable={messages.length > 0}
                onDownloadClick={() => { }}
            />

            <div className="flex-1 overflow-y-auto bg-chat-bg scrollbar-hide">
                <div className="max-w-4xl mx-auto min-h-full flex flex-col px-0 md:px-2">
                    <ChatMessages
                        messages={messages}
                        isTyping={isTyping}
                        streamingText={streamingText}
                    />
                    <div ref={messagesEndRef} className="h-4" />
                </div>
            </div>

            <div className="w-full bg-chat-bg">
                {!isTyping && messages.length > 0 && (
                    <div className="max-w-4xl mx-auto px-4">
                        <QuickQuestions
                            onQuestionClick={handleInsertQuestion}
                            questions={customQuickQuestions}
                        />
                    </div>
                )}

                <ChatInput
                    companies={companies}
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
                    isDriveConnected={isDriveConnected}
                    isTyping={isTyping}
                    onStop={stopTyping}
                />
            </div>

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
                    keywords={generatedKeywords}
                    isLoadingKeywords={generateKeywordsMutation.isPending}
                />
            )}
        </div>
    );
}
