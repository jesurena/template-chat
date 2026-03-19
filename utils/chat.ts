import { ChatMessage, MessageRole } from '@/interface/Chat';

/**
 * Creates a simple chat message object with role and content.
 */
export const createMessage = (content: string, role: MessageRole): ChatMessage => {
    return {
        role,
        content,
        Timestamp: new Date().toISOString(),
        Status: role === 'user' ? 'sent' : 'delivered'
    };
};

/**
 * Executes a streaming chat request to the backend.
 */
export const streamChatResponse = async (
    url: string,
    prompt: string, 
    history: ChatMessage[], 
    controller: AbortController,
    onChunk: (text: string) => void
) => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('jwt_token') : null;

    const response = await fetch(url, {
        method: 'POST',
        headers: { 
            'Content-Type': 'application/json',
            ...(token ? { 'Authorization': `Bearer ${token}` } : {})
        },
        body: JSON.stringify({ 
            prompt,
            chat_history: history
        }),
        credentials: 'include',
        signal: controller.signal
    });

    if (!response.ok) {
        const errorText = await response.text().catch(() => 'No error body');
        throw new Error(`Failed to connect to the chat stream (Status: ${response.status}). ${errorText}`);
    }
    if (!response.body) throw new Error('No response body available');

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let accumulatedText = '';

    while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        accumulatedText += chunk;
        onChunk(accumulatedText);
    }
    
    return accumulatedText;
};
