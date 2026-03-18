'use client';

import React from 'react';
import { Modal, Tag } from 'antd';
import { Sparkles, ArrowRight } from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { Company } from '@/interface/Chat';

function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

interface GeneratedQuestion {
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
}

const categoryColors: Record<string, string> = {
    'Risk Analysis': 'magenta',
    'Implementation': 'volcano',
    'Standardization': 'cyan',
    'Infrastructure': 'geekblue',
    'Regulatory': 'purple',
};

export const getGeneratedQuestions = (companies: Company[]): GeneratedQuestion[] => {
    if (!companies || companies.length === 0) return [];

    const comp1 = companies[0].company_name;
    const comp2 = companies.length > 1 ? companies[1].company_name : comp1;

    if (companies.length === 1) {
        return [
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
        return [
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
};

export function GeneratedQuestionsModal({ isOpen, onClose, onUseQuestion, selectedCompanies }: GeneratedQuestionsModalProps) {
    const [selectedId, setSelectedId] = React.useState<string | null>(null);
    const generatedQuestions = getGeneratedQuestions(selectedCompanies);

    const handleAskNow = () => {
        const selected = generatedQuestions.find(q => q.id === selectedId);
        if (selected) {
            onUseQuestion(selected.question);
            setSelectedId(null);
        }
    };

    return (
        <Modal
            title={
                <div className="flex items-center gap-2 text-lg font-bold pb-4">
                    <div className="w-8 h-8 rounded-full bg-accent-1/10 flex items-center justify-center">
                        <Sparkles size={18} className="text-accent-1" />
                    </div>
                    <span>{selectedCompanies.length > 1 ? 'Multi-Company Strategy Context' : 'Strategy Context Questions'}</span>
                </div>
            }
            open={isOpen}
            onCancel={() => {
                onClose();
                setSelectedId(null);
            }}
            footer={
                <div className="flex items-center justify-between p-4 bg-neutral/30 rounded-b-2xl">
                    <p className="text-xs text-gray-500 font-medium">
                        {selectedId ? "Sending your question to AI for analysis." : "Select a strategic question to analyze."}
                    </p>
                    <button
                        onClick={handleAskNow}
                        disabled={!selectedId}
                        className="flex items-center gap-2 px-8 py-2.5 bg-accent-1 hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed text-white transition-all rounded-full text-sm font-bold shadow-md"
                    >
                        Ask Now <ArrowRight size={16} />
                    </button>
                </div>
            }
            width={700}
            centered
            className="generated-questions-modal"
        >
            <div className="py-4 flex flex-col gap-3 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar mt-2">
                {generatedQuestions.map((q, idx) => (
                    <div
                        key={q.id}
                        onClick={() => setSelectedId(q.id)}
                        className={cn(
                            "cursor-pointer p-5 rounded-2xl border transition-all duration-200 flex flex-col gap-3 relative",
                            selectedId === q.id
                                ? "bg-accent-1/[0.04] border-accent-1 shadow-sm"
                                : "border-border hover:border-accent-1/30 hover:bg-neutral/30 shadow-sm"
                        )}
                    >
                        <div className="flex items-center justify-between flex-wrap gap-2">
                            <div className="flex gap-2 items-center">
                                <Tag
                                    color={categoryColors[q.category] || 'blue'}
                                    variant="solid"
                                    className="px-3 py-0.5 rounded-full text-xs font-bold tracking-widest mr-0 border-none"
                                >
                                    {q.category}
                                </Tag>
                                <Tag
                                    color={q.targetCompany === 'Cross-Company' ? 'gold' : 'default'}
                                    variant={q.targetCompany === 'Cross-Company' ? 'solid' : 'outlined'}
                                    className="px-3 py-0.5 rounded-full text-xs font-bold tracking-widest mr-0 whitespace-nowrap"
                                >
                                    {q.targetCompany}
                                </Tag>
                            </div>

                            {selectedId === q.id && (
                                <Sparkles size={14} className="text-accent-1" fill="currentColor" />
                            )}
                        </div>

                        <p className="text-sm font-bold text-foreground leading-relaxed">
                            {q.question}
                        </p>
                    </div>
                ))}
            </div>
        </Modal>
    );
}
