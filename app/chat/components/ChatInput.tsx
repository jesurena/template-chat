'use client';

import React from 'react';
import { Plus, Mic, ArrowUp } from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { QuickQuestions } from './ChatComponents';

function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

interface ChatInputProps {
    inputValue: string;
    setInputValue: (val: string) => void;
    onSendMessage: (text: string) => void;
    showQuickQuestions: boolean;
}

export function ChatInput({
    inputValue,
    setInputValue,
    onSendMessage,
    showQuickQuestions
}: ChatInputProps) {
    return (
        <div className="w-full bg-chat-bg transition-colors duration-300 pb-6 pt-2">
            <div className="max-w-3xl mx-auto px-4 relative flex flex-col items-center">

                {showQuickQuestions && (
                    <QuickQuestions onQuestionClick={onSendMessage} />
                )}

                <div className="relative flex items-end w-full min-h-[52px] bg-neutral border border-border rounded-[26px] p-2 focus-within:border-accent-1 focus-within:ring-1 focus-within:ring-accent-1/20 transition-all shadow-sm">
                    <button className="p-2.5 text-gray-500 hover:bg-gray-200 rounded-full transition-colors mb-0.5 ml-0.5">
                        <Plus size={20} />
                    </button>

                    <textarea
                        rows={1}
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter' && !e.shiftKey) {
                                e.preventDefault();
                                onSendMessage(inputValue);
                            }
                        }}
                        placeholder="Ask about project standards..."
                        className="flex-1 bg-transparent border-none focus:ring-0 text-[15px] text-foreground py-3 px-2 resize-none max-h-48 overflow-y-auto outline-none placeholder:text-gray-400"
                        onInput={(e) => {
                            const target = e.target as HTMLTextAreaElement;
                            target.style.height = 'auto';
                            target.style.height = `${target.scrollHeight}px`;
                        }}
                    />

                    <div className="flex items-center gap-1 mb-0.5 mr-0.5">
                        <button className="p-2.5 text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-800 rounded-full transition-colors">
                            <Mic size={20} />
                        </button>
                        <button
                            onClick={() => onSendMessage(inputValue)}
                            className={cn(
                                "w-10 h-10 rounded-full transition-all flex items-center justify-center shrink-0",
                                inputValue.trim()
                                    ? "bg-accent-1 text-white hover:opacity-90 shadow-md"
                                    : "bg-gray-900 text-white"
                            )}
                            disabled={!inputValue.trim()}
                        >
                            {inputValue.trim() ? <ArrowUp size={20} /> : (
                                <div className="flex items-center gap-[2px]">
                                    <div className="w-[3px] h-3 bg-white rounded-full animate-pulse" />
                                    <div className="w-[3px] h-5 bg-white rounded-full animate-pulse delay-75" />
                                    <div className="w-[3px] h-3 bg-white rounded-full animate-pulse delay-150" />
                                </div>
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
