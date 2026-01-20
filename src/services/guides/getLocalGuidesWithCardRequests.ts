import { useQuery } from '@tanstack/react-query';
import { ApiRequest } from '@/services/instance';
import { guidesSchema, GuidesSchema } from '@/schemas/guide';

export const getLocalGuidesWithCardRequests = async () => {
    return new ApiRequest<GuidesSchema>(guidesSchema).get('guides/local');
};

export const useLocalGuidesWithCardRequests = () => {
    return useQuery({
        queryKey: ['guides', 'local'],
        queryFn: () => getLocalGuidesWithCardRequests(),
    });
};
