'use client';

import React, { useState } from 'react';
import { Modal, Input } from 'antd';
import { Search, Building2, CheckCircle2, ArrowRight, Sparkles } from 'lucide-react';
import { Company } from '@/interface/Chat';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

interface CompanySelectModalProps {
    isOpen: boolean;
    onClose: () => void;
    selectedCompanies: Company[];
    toggleCompanySelect: (company: Company) => void;
    onSkip: () => void;
    onGenerateQuestions: () => void;
    companies: Company[];
}

export function CompanySelectModal({
    isOpen,
    onClose,
    selectedCompanies,
    toggleCompanySelect,
    onSkip,
    onGenerateQuestions,
    companies = []
}: CompanySelectModalProps) {
    const [searchTerm, setSearchTerm] = useState('');

    const dataSource = companies;
    
    const filteredCompanies = dataSource.filter(c =>
        c.company_name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <Modal
            open={isOpen}
            onCancel={onClose}
            footer={null}
            width={700}
            centered
            className="company-select-modal"
            title={
                <div className="flex flex-col gap-1 pb-4 mr-8">
                    <h3 className="text-xl font-bold text-foreground">Select Client Context</h3>
                    <p className="text-xs font-normal text-gray-500">Choosing a client provides automated context for our conversation.</p>
                </div>
            }
        >
            <div className="flex flex-col gap-6 py-4">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <Input
                        placeholder="Search for a company..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 h-11 rounded-xl border-border bg-neutral/50 focus:bg-white dark:focus:bg-black transition-all"
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                    {filteredCompanies.map((company) => {
                        const isSelected = selectedCompanies.some(c => c.company_name === company.company_name);
                        return (
                            <div
                                key={company.company_name}
                                onClick={() => toggleCompanySelect(company)}
                                className={cn(
                                    "p-4 rounded-xl border-2 transition-all cursor-pointer group flex items-start gap-3",
                                    isSelected
                                        ? "border-accent-1 bg-accent-1/5 shadow-sm"
                                        : "border-border bg-background hover:border-accent-1/30 hover:bg-neutral/30"
                                )}
                            >
                                <div className={cn(
                                    "p-2 rounded-lg shrink-0",
                                    isSelected ? "bg-accent-1 text-white" : "bg-neutral text-gray-500 group-hover:text-accent-1"
                                )}>
                                    <Building2 size={20} />
                                </div>
                                <div className="flex flex-col gap-1 flex-1 min-w-0">
                                    <div className="flex items-center justify-between gap-2">
                                        <span className={cn(
                                            "font-bold text-sm truncate",
                                            isSelected ? "text-accent-1" : "text-foreground"
                                        )}>
                                            {company.company_name}
                                        </span>
                                        {isSelected && <CheckCircle2 size={16} className="text-accent-1 shrink-0" />}
                                    </div>
                                    <p className="text-[11px] text-gray-500 line-clamp-2 leading-relaxed">
                                        {company.company_background || 'No background information available.'}
                                    </p>
                                </div>
                            </div>
                        );
                    })}
                </div>

                <div className="flex items-center justify-end gap-2 pt-4">
                    <button
                        onClick={onSkip}
                        className="px-6 py-2.5 rounded-full text-sm font-semibold text-gray-500 hover:bg-neutral hover:text-foreground transition-all"
                    >
                        Skip
                    </button>
                    <button
                        onClick={() => {
                            if (selectedCompanies.length > 0) {
                                onGenerateQuestions();
                            } else {
                                onClose();
                            }
                        }}
                        disabled={selectedCompanies.length === 0}
                        className={cn(
                            "px-8 py-2.5 rounded-full text-sm font-bold transition-all shadow-md flex items-center gap-2",
                            selectedCompanies.length > 0
                                ? "bg-accent-1 text-white hover:opacity-90"
                                : "bg-gray-200 text-gray-400 cursor-not-allowed shadow-none"
                        )}
                    >
                        {selectedCompanies.length > 0 ? (
                            <>
                                <Sparkles size={16} />
                                Generate Questions
                            </>
                        ) : (
                            <>
                                Continue
                                <ArrowRight size={16} />
                            </>
                        )}
                    </button>
                </div>
            </div>
        </Modal>
    );
}
