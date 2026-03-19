import { useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import { handleLoginSuccess, handleLogout } from '@/utils/googleLogin';

export const useGoogle = () => {
    const queryClient = useQueryClient();

    const loginMutation = useMutation({
        mutationFn: async (token: string) => {
            const { data } = await api.post('/auth/google', { token });
            return data;
        },
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ['auth', 'me'] });
            handleLoginSuccess(data);
        },
    });

    const logout = () => {
        handleLogout();
        queryClient.clear(); // Clear all cached query data
    };

    return {
        login: async (credentialResponse: any) => {
            const token = credentialResponse.credential;
            if (!token) throw new Error('No credential token received');
            return loginMutation.mutateAsync(token);
        },
        logout,
        isLoginPending: loginMutation.isPending,
        isLoginError: loginMutation.isError,
        loginData: loginMutation.data,
    };
};
