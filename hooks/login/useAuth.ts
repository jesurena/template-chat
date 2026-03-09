import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { usePathname, useRouter } from 'next/navigation';
import api from '@/lib/api';

export interface AuthUser {
    AccountID: number;
    AccountIDNo: string;
    AONumber: string;
    AccountName: string;
    AccountGroup: string;
    AccountType: string;
    DomainAccount: string;
    Email: string;
    ValidTo: string | null;
    SignaturePath: string | null;
    SignatureImage: string | null;
    Nickname: string;
    isActive: boolean;
    GAvatar: string | null;
    TCDRole: string | null;
    ProcurementRole: string | null;
    AllowTCDAccess: boolean;
    AllowProcurementAccess: boolean;
}


async function fetchCurrentUser(): Promise<AuthUser> {
    try {
        const { data } = await api.get('/users/me');
        return data.data;
    } catch (err) {
        console.error("fetchCurrentUser error:", err);
        throw err;
    }
}

export function useAuth() {
    const pathname = usePathname();
    const isLoginPage = pathname === '/login';

    const query = useQuery<AuthUser>({
        queryKey: ['auth', 'me'],
        queryFn: fetchCurrentUser,
        enabled: !!pathname,
        retry: false,
        staleTime: 5 * 60 * 1000, // 5 minutes
        refetchOnWindowFocus: false,
    });

    return {
        user: query.data ?? null,
        isLoading: query.isLoading,
        isError: query.isError,
        error: query.error,
        refetch: query.refetch,
    };
}

export function useLogout() {
    const queryClient = useQueryClient();
    const router = useRouter();

    return useMutation({
        mutationFn: async () => {
            const { data } = await api.post('/auth/logout');
            return data;
        },
        onSuccess: () => {
            queryClient.removeQueries({ queryKey: ['auth'] });
            queryClient.clear();
            router.push('/login');
        },
    });
}
