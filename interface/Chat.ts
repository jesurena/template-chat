export type MessageStatus = 'sending' | 'sent' | 'delivered';

export interface ChatMessage {
    AccountID: string;
    Nickname: string;
    Text: string;
    IsUser: boolean;
    Timestamp: string;
    Status?: MessageStatus;
}

export interface ChatThread {
    ThreadID: string;
    Title: string;
    LastMessage: string;
    UpdatedAt: string;
}

export interface Company {
    company_name: string;
    company_background: string;
    company_size?: string;
    competitor_strengths_and_weakness?: string;
    competitors?: string;
    current_challenges?: string;
    current_it_providers?: string;
    customernumber?: number;
    decision_making_process?: string;
    existing_solutions_providers?: string;
    gaps_or_limitations?: string;
    ics_deployments?: string;
    industry?: string;
    it_budget?: string;
    key_objectives?: string;
    potentials_solutions?: string;
}
