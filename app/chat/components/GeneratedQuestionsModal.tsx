'use client';

import React, { useState, useEffect } from 'react';
import { Modal, Tag, Steps } from 'antd';
import { Sparkles, ArrowRight, Check, Hash, Loader2, Target, Send } from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { Company } from '@/interface/Chat';
import { useGenerateQuestions } from '@/hooks/chat/useChat';

function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export interface GeneratedQuestion {
    id: string;
    category: 'Risk Analysis' | 'Implementation' | 'Standardization' | 'Infrastructure' | 'Regulatory';
    targetCompany: string;
    question: string;
}

interface GeneratedQuestionsModalProps {
    isOpen: boolean;
    onClose: () => void;
    onUseQuestion: (prompt: string) => void;
    selectedCompanies: Company[];
    keywords?: any; // The new structure { "0": { company_name, keywords } }
    isLoadingKeywords?: boolean;
}

const categoryColors: Record<string, string> = {
    'Risk Analysis': 'magenta',
    'Implementation': 'volcano',
    'Standardization': 'cyan',
    'Infrastructure': 'geekblue',
    'Regulatory': 'purple',
};

// Default keywords if API fails
export const DEFAULT_KEYWORDS = [
    'Risk Analysis',
    'Implementation',
    'Standardization',
    'Infrastructure',
    'Regulatory',
    'Market Trends',
    'SLA Compliance'
];

export const getGeneratedQuestions = (companies: Company[], keywords: string[] = []): GeneratedQuestion[] => {
    if (!companies || companies.length === 0) return [];

    const comp1 = companies[0].company_name;
    const comp2 = companies.length > 1 ? companies[1].company_name : comp1;

    let allQuestions: GeneratedQuestion[] = [];

    // Base mock questions
    if (companies.length === 1) {
        allQuestions = [
            {
                id: '1',
                category: 'Risk Analysis',
                targetCompany: comp1,
                question: `How do current market trends and external risks specifically impact the operational margins of ${comp1}?`
            },
            {
                id: '2',
                category: 'Implementation',
                targetCompany: comp1,
                question: `What is the deployment timeline for integrating AI-powered analytics systems within ${comp1} over the next 3 years?`
            },
            {
                id: '3',
                category: 'Standardization',
                targetCompany: comp1,
                question: `How can workflow protocols be standardized across all departments in ${comp1} to reduce bottlenecks by a targeted percentage?`
            },
            {
                id: '4',
                category: 'Infrastructure',
                targetCompany: comp1,
                question: `Considering local scale limitations, how will ${comp1} ensure 100% SLA compliance for high-value client operations?`
            },
            {
                id: '5',
                category: 'Regulatory',
                targetCompany: comp1,
                question: `In light of evolving compliance policies, what proactive measures is ${comp1} taking to automate reporting documentation?`
            }
        ];
    } else {
        allQuestions = [
            {
                id: '1',
                category: 'Risk Analysis',
                targetCompany: 'Cross-Company',
                question: `How do rising integration costs specifically impact the operational margins of ${comp1} while simultaneously affecting infrastructure budgets for ${comp2}?`
            },
            {
                id: '2',
                category: 'Regulatory',
                targetCompany: 'Cross-Company',
                question: `Considering the different regulatory policies for ${comp1} and ${comp2}, how can we automate cross-border compliance logistics?`
            },
            {
                id: '3',
                category: 'Implementation',
                targetCompany: comp1,
                question: `What is the deployment timeline for the real-time API integrations within ${comp1}, and how can ${comp2}'s connectivity enhance this rollout?`
            },
            {
                id: '4',
                category: 'Standardization',
                targetCompany: comp2,
                question: `How can ${comp2} internal vendor systems be standardized to ensure seamless data exchange and reduce clearance delays with ${comp1} by 40%?`
            },
            {
                id: '5',
                category: 'Infrastructure',
                targetCompany: 'Cross-Company',
                question: `How will the strategic partnership ensure 100% SLA compliance for high-value services shared between ${comp1} and ${comp2}?`
            },
            {
                id: '6',
                category: 'Implementation',
                targetCompany: comp2,
                question: `What are the specific operational milestones for ${comp2} adapting its internal reporting to match the expectations of ${comp1}'s dashboard?`
            }
        ];
    }

    // Add unique custom question if keywords are provided
    if (keywords.length > 0) {
        const keywordStr = keywords.join(', ');
        allQuestions.unshift({
            id: 'custom-1',
            category: 'Standardization',
            targetCompany: companies.length > 1 ? 'Cross-Company' : comp1,
            question: companies.length > 1
                ? `How can ${comp1} and ${comp2} align their strategies regarding ${keywordStr} to maximize shared value?`
                : `What strategic initiatives can ${comp1} launch focusing on ${keywordStr} to drive sustained growth?`
        });
    }

    return allQuestions;
};

export function GeneratedQuestionsModal({ isOpen, onClose, onUseQuestion, selectedCompanies, keywords, isLoadingKeywords }: GeneratedQuestionsModalProps) {
    const [currentStep, setCurrentStep] = useState(0);
    const [selectedKeywords, setSelectedKeywords] = useState<string[]>([]);
    const [selectedId, setSelectedId] = useState<string | null>(null);
    const [isGenerating, setIsGenerating] = useState(false);

    const [generatedQuestions, setGeneratedQuestions] = useState<GeneratedQuestion[]>([]);

    const normalizedKeywords = React.useMemo(() => {
        if (!keywords) return DEFAULT_KEYWORDS;
        const all: string[] = [];
        Object.values(keywords).forEach((entry: any) => {
            if (entry.keywords && Array.isArray(entry.keywords)) {
                all.push(...entry.keywords);
            }
        });
        return all.length > 0 ? Array.from(new Set(all)) : DEFAULT_KEYWORDS;
    }, [keywords]);

    useEffect(() => {
        if (isOpen) {
            setCurrentStep(0);
            setSelectedKeywords([]);
            setSelectedId(null);
            setGeneratedQuestions([]);
            setIsGenerating(false);
        }
    }, [isOpen]);

    const toggleKeyword = (kw: string) => {
        setSelectedKeywords(prev =>
            prev.includes(kw) ? prev.filter(k => k !== kw) : [...prev, kw]
        );
    };

    const generateQuestionsMutation = useGenerateQuestions();

    const handleGenerate = async () => {
        if (selectedKeywords.length === 0) return;

        setIsGenerating(true);
        try {
            const result = await generateQuestionsMutation.mutateAsync({
                keywords: selectedKeywords,
                companiesPayload: selectedCompanies
            });

            // Map API response to GeneratedQuestion[]
            // API result is an array of companies, each with a 'questions' object grouped by keyword
            const flattenedQuestions: GeneratedQuestion[] = [];

            if (Array.isArray(result)) {
                result.forEach((compData: any) => {
                    if (compData.questions) {
                        Object.entries(compData.questions).forEach(([keyword, qList]: [string, any]) => {
                            if (Array.isArray(qList)) {
                                qList.forEach((q: any, idx: number) => {
                                    flattenedQuestions.push({
                                        id: `${compData.company_name}-${keyword}-${idx}`,
                                        category: q.tag || 'Standardization',
                                        targetCompany: compData.company_name,
                                        question: q.text
                                    });
                                });
                            }
                        });
                    }
                });
            }

            setGeneratedQuestions(flattenedQuestions);
            setCurrentStep(1);
        } catch (error) {
            console.error("Failed to generate questions:", error);
        } finally {
            setIsGenerating(false);
        }
    };

    const handleInsert = () => {
        const selected = generatedQuestions.find(q => q.id === selectedId);
        if (selected) {
            onUseQuestion(selected.question);
        }
    };

    const steps = [
        {
            title: 'Define Keywords',
            icon: <Target size={18} />,
        },
        {
            title: 'Select Question',
            icon: <Send size={18} />,
        },
    ];

    return (
        <Modal
            title={
                <div className="flex flex-col gap-4 pb-4">
                    <div className="flex items-center gap-2 mb-4 text-lg font-bold text-foreground">
                        <div className="w-8 h-8 rounded-full bg-accent-1/10 flex items-center justify-center">
                            <Sparkles size={18} className="text-accent-1" />
                        </div>
                        <span>Strategy Context Engine</span>
                    </div>

                    <div className="px-1">
                        <Steps
                            current={currentStep}
                            size="small"
                            items={steps}
                            className="custom-stepper"
                        />
                    </div>
                </div>
            }
            open={isOpen}
            onCancel={onClose}
            footer={
                <div className="flex items-center justify-between p-4 bg-neutral/30 rounded-b-2xl">
                    {currentStep === 0 ? (
                        <>
                            <div className="flex flex-col text-left">
                                <p className="text-xs text-gray-500 font-medium">
                                    {selectedKeywords.length === 0
                                        ? "Select keywords to frame questions."
                                        : `${selectedKeywords.length} focus area${selectedKeywords.length > 1 ? 's' : ''} selected.`
                                    }
                                </p>
                                {isLoadingKeywords && (
                                    <p className="text-[10px] text-accent-1">
                                        Refreshing keywords from context...
                                    </p>
                                )}
                            </div>
                            <button
                                onClick={handleGenerate}
                                disabled={selectedKeywords.length === 0 || isGenerating}
                                className="flex items-center gap-2 px-6 py-2.5 bg-accent-1 hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed text-white transition-all rounded-full text-sm font-bold shadow-lg active:scale-95"
                            >
                                {isGenerating ? (
                                    <>
                                        <Loader2 size={16} className="animate-spin" /> Analyzing...
                                    </>
                                ) : (
                                    <>
                                        Generate Questions <ArrowRight size={16} />
                                    </>
                                )}
                            </button>
                        </>
                    ) : (
                        <>
                            <button
                                onClick={() => setCurrentStep(0)}
                                className="text-sm font-bold text-gray-500 hover:text-foreground transition-colors px-4 py-2"
                            >
                                Back
                            </button>
                            <button
                                onClick={handleInsert}
                                disabled={!selectedId}
                                className="flex items-center gap-2 px-8 py-2.5 bg-accent-1 hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed text-white transition-all rounded-full text-sm font-bold shadow-lg active:scale-95"
                            >
                                Insert into Chat <ArrowRight size={16} />
                            </button>
                        </>
                    )}
                </div>
            }
            width={700}
            centered
            className="generated-questions-modal"
        >
            <div className={cn(
                "py-2 flex flex-col gap-4 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar transition-all duration-300",
                (isGenerating || (currentStep === 0 && isLoadingKeywords)) && "pointer-events-none"
            )}>
                {currentStep === 0 ? (
                    <div className="flex flex-col gap-4">
                        <div className="flex items-center justify-between px-1">
                            <p className="text-sm font-semibold text-gray-500">
                                Shaping context for: <span className="text-foreground">{selectedCompanies.map(c => c.company_name).join(' & ')}</span>
                            </p>
                            {isLoadingKeywords && <Loader2 size={14} className="text-accent-1" />}
                        </div>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                            {normalizedKeywords.map((kw) => {
                                const isSelected = selectedKeywords.includes(kw);
                                return (
                                    <button
                                        key={kw}
                                        onClick={() => toggleKeyword(kw)}
                                        className={cn(
                                            "flex items-center gap-2.5 p-3 rounded-xl border text-sm font-medium transition-all group",
                                            isSelected
                                                ? "bg-accent-1/10 border-accent-1 text-accent-1 shadow-sm"
                                                : "bg-background border-border text-foreground hover:border-accent-1/40 hover:bg-neutral"
                                        )}
                                    >
                                        <div className={cn(
                                            "w-5 h-5 rounded-md flex items-center justify-center transition-colors",
                                            isSelected ? "bg-accent-1 text-white" : "bg-neutral group-hover:bg-accent-1/10"
                                        )}>
                                            {isSelected ? <Check size={12} strokeWidth={3} /> : <Hash size={12} className="text-gray-400" />}
                                        </div>
                                        {kw}
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                ) : (
                    <div className="flex flex-col gap-3">
                        {generatedQuestions.map((q) => (
                            <div
                                key={q.id}
                                onClick={() => setSelectedId(q.id)}
                                className={cn(
                                    "cursor-pointer p-4 rounded-2xl border transition-all duration-200 flex flex-col gap-3 relative",
                                    selectedId === q.id
                                        ? "bg-accent-1/[0.04] border-accent-1 shadow-sm ring-1 ring-accent-1/20"
                                        : "border-border hover:border-accent-1/30 hover:bg-neutral shadow-sm"
                                )}
                            >
                                <div className="flex items-center justify-between flex-wrap gap-2">
                                    <div className="flex gap-2 items-center">
                                        <Tag
                                            color={categoryColors[q.category] || 'blue'}
                                            variant="solid"
                                            className="px-3 py-0.5 rounded-full text-xs font-semibold mr-0 border-none"
                                        >
                                            {q.category}
                                        </Tag>
                                        <Tag
                                            color={q.targetCompany === 'Cross-Company' ? 'gold' : 'default'}
                                            variant={q.targetCompany === 'Cross-Company' ? 'solid' : 'outlined'}
                                            className="px-2 py-0.5 rounded-full text-xs font-semibold mr-0 whitespace-nowrap"
                                        >
                                            {q.targetCompany}
                                        </Tag>
                                    </div>

                                    {selectedId === q.id && (
                                        <div className="flex items-center gap-1.5 text-accent-1">
                                            <div className="w-5 h-5 rounded-full bg-accent-1 text-white flex items-center justify-center">
                                                <Check size={12} strokeWidth={3} />
                                            </div>
                                        </div>
                                    )}
                                </div>

                                <p className="text-sm text-foreground leading-relaxed">
                                    {q.question}
                                </p>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </Modal>
    );
}

