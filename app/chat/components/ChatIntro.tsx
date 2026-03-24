'use client';

import React from 'react';
import { Building2, Sparkles, ArrowRight, LayoutGrid, Box } from 'lucide-react';
import { Company } from '@/interface/Chat';
import { getLineClamp } from '@/utils/style';
import { cn } from '@/utils/cn';

interface ChatIntroProps {
    selectedCompanies: Company[];
    toggleCompanySelect: (company: Company) => void;
    onMoreClick: () => void;
    onGenerateQuestions: () => void;
    onSkip: () => void;
    isDriveConnected: boolean;
    onSuggestionClick: (prompt: string) => void;
    driveFiles?: any[];
    companies: Company[];
}

export function ChatIntro({
    selectedCompanies,
    toggleCompanySelect,
    onMoreClick,
    onGenerateQuestions,
    onSkip,
    isDriveConnected,
    onSuggestionClick,
    driveFiles = [],
    companies = []
}: ChatIntroProps) {
    const dataSource = companies;
    const initialCompanies = dataSource.slice(0, 3);

    if (!isDriveConnected) {
        const suggestions = [
            {
                title: 'Project Setup',
                description: "Guidelines and best practices for starting a new repository.",
                icon: LayoutGrid,
                prompt: "How do I set up a new project following AppDev Central patterns?"
            },
            {
                title: 'Component Library',
                description: 'Explore available reusable UI components and patterns.',
                icon: Box,
                prompt: 'Show me the available common components in this project'
            },
            {
                title: 'Code Refactoring',
                description: 'Tips for maintaining clean code and architectural standards.',
                icon: Sparkles,
                prompt: 'What are the main implementation guidelines for this codebase?'
            }
        ];

        return (
            <div className="flex-1 flex flex-col items-center justify-center px-4 py-12">
                <div className="text-center mb-12">
                    <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4 tracking-tight">
                        Where should we begin?
                    </h1>
                    <p className="text-gray-600 text-sm md:text-lg max-w-lg mx-auto leading-relaxed">
                        I'm your assistant for project standards, component guidelines, and architectural best practices. How can I help you today?
                    </p>
                </div>

                <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-3 gap-4">
                    {suggestions.map((suggestion) => (
                        <div
                            key={suggestion.title}
                            onClick={() => onSuggestionClick(suggestion.prompt)}
                            className="bg-background cursor-pointer hover:shadow-md transition-all duration-200 hover:border-accent-1/30 shadow-sm rounded-xl border border-border overflow-hidden p-5 group"
                        >
                            <div className="flex items-center gap-2 text-sm md:text-base text-foreground font-bold mb-2 group-hover:text-accent-1 transition-colors">
                                <suggestion.icon size={18} className="shrink-0" />
                                <span>{suggestion.title}</span>
                            </div>
                            <p className="text-xs md:text-sm leading-relaxed text-gray-500 line-clamp-2">
                                {suggestion.description}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="flex-1 flex flex-col items-center justify-center px-4 py-8">
            <div className="text-center mb-10">
                <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-4 tracking-tight">
                    Select Context
                </h1>
                <p className="text-gray-600 text-sm md:text-md max-w-lg mx-auto leading-relaxed">
                    Select a company or client to set the context for our conversation.
                </p>
            </div>

            <div className="w-full max-w-4xl flex flex-wrap gap-4 mb-6">
                {initialCompanies.map((company) => {
                    const isSelected = selectedCompanies.some(c => c.company_name === company.company_name);

                    let shortDesc = company.company_background || '';
                    const limit = initialCompanies.length <= 1 ? 500 : 150;
                    if (shortDesc.length > limit) {
                        shortDesc = shortDesc.substring(0, limit) + '...';
                    }

                    return (
                        <div
                            key={company.company_name}
                            onClick={() => toggleCompanySelect(company)}
                            className={cn(
                                "cursor-pointer rounded-xl border transition-all duration-200 overflow-hidden p-5 flex flex-col items-start gap-2 shadow-sm hover:shadow-md flex-1 min-w-[280px]",
                                isSelected
                                    ? "bg-accent-1/5 border-accent-1 ring-1 ring-accent-1"
                                    : "bg-background border-border hover:border-accent-1/30"
                            )}
                        >
                            <div className="flex items-center gap-2 text-sm md:text-base font-bold transition-colors w-full">
                                <Building2 size={18} className={cn("shrink-0", isSelected ? "text-accent-1" : "text-gray-500")} />
                                <span className={cn("truncate", isSelected ? "text-accent-1" : "text-foreground")}>{company.company_name}</span>
                            </div>
                            <p className={cn("text-xs md:text-sm leading-relaxed text-gray-500", getLineClamp(initialCompanies.length))}>
                                {shortDesc}
                            </p>
                        </div>
                    );
                })}
            </div>


            {dataSource.length > 3 && (
                <button
                    onClick={onMoreClick}
                    className="text-accent-1 hover:text-accent-1/80 font-semibold mb-8 flex items-center gap-1 hover:gap-2 transition-all px-4 py-2"
                >
                    View {dataSource.length > 3 ? `${dataSource.length - 3} more` : 'all'} companies <ArrowRight size={16} />
                </button>
            )}

            {/* Action buttons appear if anything is selected */}
            <div className={cn(
                "flex flex-col items-center gap-3 transition-opacity duration-300",
                selectedCompanies.length > 0 ? "opacity-100" : "opacity-0 pointer-events-none"
            )}>
                <p className="text-sm font-medium text-foreground">
                    Do you want to get pre-existing questions or skip?
                </p>
                <div className="flex items-center gap-2">
                    <button
                        onClick={onGenerateQuestions}
                        className="bg-accent-1 hover:opacity-90 text-white px-6 py-2.5 rounded-full font-semibold shadow-sm transition-all text-sm flex items-center gap-2"
                    >
                        <Sparkles size={16} />
                        Generate Questions
                    </button>
                    <button
                        onClick={onSkip}
                        className="bg-neutral hover:bg-neutral/80 text-foreground border border-border px-8 py-2.5 rounded-full font-semibold shadow-sm transition-all text-sm"
                    >
                        Skip
                    </button>
                </div>
            </div>
        </div>
    );
}
