import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
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

export const useFetchProfile = () => {
    return useQuery({
        queryKey: ['auth', 'me'],
        queryFn: async () => {
            // Prevent attempting to fetch if not logged in
            if (typeof window !== 'undefined') {
                const token = localStorage.getItem('jwt_token');
                if (!token) return null;
            }

            const { data } = await api.get('/auth/me');
            return data;
        },
    });
};

export const useUpdateTheme = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (theme: 'light' | 'dark' | 'system') => {
            const { data } = await api.put('/auth/theme', { theme });
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['auth', 'me'] });
        },
    });
};

export const useUpdateFirstTime = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (isFirstTime: boolean) => {
            const { data } = await api.put('/auth/first_time', { isFirstTime });
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['auth', 'me'] });
        },
    });
};
