import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { chatService } from '@/services/chatService';
import { ChatMessage } from '@/interface/Chat';

export function useChat() {
    const queryClient = useQueryClient();

    // 1. Fetching history
    const { data: messages = [], isLoading } = useQuery({
        queryKey: ['chat-messages'],
        queryFn: () => chatService.getMessages(),
        initialData: []
    });

    // 2. Sending messages mutation
    const mutation = useMutation({
        mutationFn: (text: string) => chatService.sendMessage(text),
        onMutate: async (newMsgText) => {
            // Cancel any outgoing refetches
            await queryClient.cancelQueries({ queryKey: ['chat-messages'] });

            // Optimistically add user message to internal state
            const userMsg: ChatMessage = {
                AccountID: 'user-01',
                Nickname: 'User', // In real use, from auth context
                Text: newMsgText,
                IsUser: true,
                Timestamp: new Date().toISOString(),
                Status: 'sent'
            };

            const previousMessages = queryClient.getQueryData<ChatMessage[]>(['chat-messages']);
            queryClient.setQueryData<ChatMessage[]>(['chat-messages'], (old) => [...(old || []), userMsg]);

            return { previousMessages };
        },
        onSuccess: (aiResponse) => {
            // Update the last user message to delivered and add AI response
            queryClient.setQueryData<ChatMessage[]>(['chat-messages'], (old) => {
                const list = [...(old || [])];
                // Find and update the user message status
                for (let i = list.length - 1; i >= 0; i--) {
                    if (list[i].IsUser) {
                        list[i] = { ...list[i], Status: 'delivered' };
                        break;
                    }
                }
                return [...list, aiResponse];
            });
        },
        onError: (err, newMsg, context) => {
            if (context?.previousMessages) {
                queryClient.setQueryData(['chat-messages'], context.previousMessages);
            }
        }
    });

    const resetChat = () => {
        // Clear both the query data and any local cache
        queryClient.setQueryData(['chat-messages'], []);
    };

    return {
        messages,
        isLoading,
        isTyping: mutation.isPending,
        sendMessage: mutation.mutate,
        resetChat
    };
}
