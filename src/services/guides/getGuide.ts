import { useQuery } from '@tanstack/react-query';
import { ApiRequest } from '@/services/instance';
import { guideApiResponseSchema, GuideApiResponseSchema } from '@/schemas/guide';

export const getGuideByUserId = async (userId: string) => {
    return new ApiRequest<GuideApiResponseSchema>(guideApiResponseSchema).get(`guides/user/${userId}`);
};

export const useGuideByUserId = (userId: string, enabled: boolean = true) => {
    return useQuery({
        queryKey: ['guide', 'user', userId],
        queryFn: () => getGuideByUserId(userId),
        enabled: !!userId && enabled,
    });
};
