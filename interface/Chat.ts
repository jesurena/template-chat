export type MessageStatus = 'sending' | 'sent' | 'delivered';
export type MessageRole = 'user' | 'assistant';

export interface ChatMessage {
    role: MessageRole;
    content: string;
    Timestamp?: string;
    Status?: MessageStatus;
}

export interface ChatThread {
    id?: string;
    session_id?: string;
    session_name?: string;
    ThreadID?: string;
    Title?: string;
    title?: string;
    messages?: ChatMessage[];
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
