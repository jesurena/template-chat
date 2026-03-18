'use client';

import React, { useState } from 'react';
import { Plus, Mic, ArrowUp, X, Paperclip, Lightbulb, Telescope, ShoppingBag, MoreHorizontal, Building2, ChevronRight } from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { Company } from '@/interface/Chat';
import { CompanySelectModal } from './CompanySelectModal';
import { Popover } from 'antd';
import { useTheme } from '@/components/Providers/theme-provider';

function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

interface ChatInputProps {
    inputValue: string;
    setInputValue: (val: string) => void;
    onSendMessage: (text: string) => void;
    selectedCompanies: Company[];
    toggleCompanySelect: (company: Company) => void;
    removeCompany: (companyName: string) => void;
    isCompanyModalOpen: boolean;
    setIsCompanyModalOpen: (open: boolean) => void;
    onGenerateQuestions: () => void;
    onSkip: () => void;
    isConnectedToDrive: boolean;
}

export function ChatInput({
    inputValue,
    setInputValue,
    onSendMessage,
    selectedCompanies,
    toggleCompanySelect,
    removeCompany,
    isCompanyModalOpen,
    setIsCompanyModalOpen,
    onGenerateQuestions,
    onSkip,
    isConnectedToDrive
}: ChatInputProps) {
    const { theme } = useTheme();
    const [isPopoverOpen, setIsPopoverOpen] = useState(false);
    const [mounted, setMounted] = useState(false);

    React.useEffect(() => {
        setMounted(true);
    }, []);

    const menuItems = [
        {
            icon: <Paperclip size={18} />,
            label: 'Add photos & files',
            disabled: true,
            hasDivider: true
        },
        {
            icon: <Lightbulb size={18} />,
            label: 'Thinking',
            disabled: true
        },
        {
            icon: <Telescope size={18} />,
            label: 'Deep research',
            disabled: true
        },
        {
            icon: <ShoppingBag size={18} />,
            label: 'Shopping research',
            disabled: true
        },
        {
            icon: <Building2 size={18} />,
            label: 'Select Client Context',
            disabled: false,
            onClick: () => setIsCompanyModalOpen(true)
        },
        {
            icon: <MoreHorizontal size={18} />,
            label: 'More',
            disabled: true,
            hasArrow: true
        }
    ];

    const popoverContent = (
        <div className="flex flex-col w-[260px] py-1">
            {menuItems.map((item, idx) => (
                <React.Fragment key={idx}>
                    <button
                        onClick={() => {
                            if (!item.disabled && item.onClick) {
                                item.onClick();
                            }
                            setIsPopoverOpen(false);
                        }}
                        className={cn(
                            "flex items-center gap-3 px-3 py-2.5 rounded-lg text-[14px] font-medium transition-all mx-1",
                            item.disabled
                                ? "opacity-50 cursor-not-allowed text-foreground/40"
                                : "text-foreground hover:bg-foreground/5 cursor-pointer active:scale-[0.98]"
                        )}
                        disabled={item.disabled}
                    >
                        <span className={cn(
                            "shrink-0",
                            !item.disabled && "text-foreground"
                        )}>
                            {item.icon}
                        </span>
                        <span className="flex-1 text-left">{item.label}</span>
                        {item.hasArrow && <ChevronRight size={14} className="ml-auto opacity-50" />}
                    </button>
                    {item.hasDivider && <div className="h-[1px] bg-border my-1 mx-3" />}
                </React.Fragment>
            ))}
        </div>
    );

    return (
        <div className="w-full bg-chat-bg transition-colors duration-300 pb-6 pt-2">
            <div className="max-w-3xl mx-auto px-4 relative flex flex-col items-center">

                <div className="relative flex flex-col w-full min-h-[52px] bg-neutral border border-border rounded-[26px] p-2 focus-within:border-accent-1 focus-within:ring-1 focus-within:ring-accent-1/20 transition-all shadow-sm">
                    {/* Selected Companies Preview Area */}
                    {selectedCompanies.length > 0 && (
                        <div className="flex flex-wrap gap-2 px-3 pt-2 pb-1">
                            {selectedCompanies.map(c => (
                                <div key={c.company_name} className="flex items-center gap-1 bg-accent-1 text-white px-2.5 py-1 rounded-full text-[13px] font-medium shadow-sm transition-all">
                                    <span className="truncate max-w-[150px]">{c.company_name}</span>
                                    <button
                                        onClick={(e) => { e.preventDefault(); removeCompany(c.company_name); }}
                                        className="hover:bg-white/20 p-0.5 rounded-full transition-colors flex shrink-0"
                                    >
                                        <X size={12} />
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Input Row */}
                    <div className="flex items-end w-full">
                        {mounted ? (
                            <Popover
                                content={popoverContent}
                                trigger="click"
                                open={isPopoverOpen}
                                onOpenChange={setIsPopoverOpen}
                                placement="topLeft"
                                overlayClassName="chat-plus-popover"
                                arrow={false}
                                rootClassName="custom-popover-root"
                            >
                                <button
                                    className={cn(
                                        "p-2.5 rounded-full transition-colors mb-0.5 ml-0.5 shrink-0",
                                        isConnectedToDrive
                                            ? "text-gray-500 hover:bg-gray-200"
                                            : "text-gray-300 cursor-not-allowed"
                                    )}
                                    title={isConnectedToDrive ? "More options" : "Connect Google Drive to select clients"}
                                    disabled={!isConnectedToDrive}
                                >
                                    <Plus size={20} />
                                </button>
                            </Popover>
                        ) : (
                            <button
                                className="p-2.5 rounded-full text-gray-300 mb-0.5 ml-0.5 shrink-0 cursor-not-allowed"
                                disabled
                            >
                                <Plus size={20} />
                            </button>
                        )}

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

                        <div className="flex items-center gap-1 mb-0.5 mr-0.5 shrink-0">
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
                                        <div className="w-[3px] h-2 bg-white rounded-full animate-pulse" />
                                        <div className="w-[3px] h-5 bg-white rounded-full animate-pulse delay-75" />
                                        <div className="w-[3px] h-3 bg-white rounded-full animate-pulse delay-150" />
                                        <div className="w-[2px] h-2 bg-white rounded-full animate-pulse delay-225" />
                                    </div>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {mounted && (
                <CompanySelectModal
                    isOpen={isCompanyModalOpen}
                    onClose={() => setIsCompanyModalOpen(false)}
                    selectedCompanies={selectedCompanies}
                    toggleCompanySelect={toggleCompanySelect}
                    onSkip={onSkip}
                    onGenerateQuestions={onGenerateQuestions}
                />
            )}
        </div>
    );
}
