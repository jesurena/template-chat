'use client';

import React from 'react';
import { LayoutGrid, Sparkles, Box } from 'lucide-react';

interface Suggestion {
    title: string;
    description: string;
    icon: React.ElementType;
    prompt: string;
}

interface ChatIntroProps {
    onSuggestionClick: (prompt: string) => void;
}

export function ChatIntro({ onSuggestionClick }: ChatIntroProps) {
    const suggestions: Suggestion[] = [
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
