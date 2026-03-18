'use client';

import React, { useState } from 'react';
import { LayoutGrid, Sparkles, Box, ChevronDown } from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}


import { Tooltip } from 'antd';

export interface QuickQuestion {
    label: string;
    prompt: string;
}

const defaultQuestions: QuickQuestion[] = [
    { label: 'Theme Colors', prompt: 'What is the color palette for AppDev Central?' },
    { label: 'Naming Rules', prompt: 'What are the naming conventions for components and hooks?' },
    { label: 'Directory Rules', prompt: 'Explain the directory structure for this project' },
    { label: 'Ant Design', prompt: 'How do we use Ant Design components here?' },
    { label: 'TanStack Query', prompt: 'What is the standard for data fetching?' },
    { label: 'StatusChip', prompt: 'How do I implement the StatusChip component?' }
];

export function QuickQuestions({
    onQuestionClick,
    questions
}: {
    onQuestionClick: (prompt: string) => void,
    questions: QuickQuestion[]
}) {
    const [show, setShow] = useState(true);

    if (!questions || questions.length === 0) return null;

    return (
        <div className="w-full px-6 my-2 mb-3 flex flex-col items-center">
            <button
                onClick={() => setShow(!show)}
                className="text-[10px] tracking-wider font-bold text-gray-400 hover:text-gray-500 flex items-center gap-1.5 transition-colors duration-200 mb-3"
            >
                {show ? 'Hide' : 'Show'} Quick Questions
                <ChevronDown
                    size={12}
                    className={cn("transition-transform duration-300", show ? "rotate-0" : "rotate-180")}
                />
            </button>

            <div className={cn(
                "overflow-hidden transition-all duration-300 ease-out flex flex-wrap justify-center gap-2",
                show ? "max-h-40 opacity-100" : "max-h-0 opacity-0"
            )}>
                {questions.map((q, idx) => (
                    <Tooltip key={`${q.label}-${idx}`} title={q.prompt} placement="top">
                        <button
                            onClick={() => onQuestionClick(q.prompt)}
                            className="py-1.5 px-3 text-[11px] rounded-full font-semibold bg-neutral text-foreground hover:bg-neutral/80 transition-all active:scale-95 border border-border"
                        >
                            {q.label}
                        </button>
                    </Tooltip>
                ))}
            </div>
        </div>
    );
}
