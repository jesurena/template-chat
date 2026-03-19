import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';
import { Company } from '@/interface/Chat';

export const useCompanies = () => {
    return useQuery<Company[]>({
        queryKey: ['kyc-list'],
        queryFn: async () => {
            const { data } = await api.get('/kyc_list');
            return data?.data || [];
        },
        staleTime: 5 * 60 * 1000,
    });
};
