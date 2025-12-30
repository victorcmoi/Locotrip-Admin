import { useQuery } from '@tanstack/react-query';
import { ApiRequest } from '@/services/instance';
import { userApiResponseSchema, UserApiResponseSchema } from '@/schemas/user';

export const getUser = async (id: string) => {
    return new ApiRequest<UserApiResponseSchema>(userApiResponseSchema).get(`users/${id}`);
};

export const useUser = (id: string) => {
    return useQuery({
        queryKey: ['user', id],
        queryFn: () => getUser(id),
        enabled: !!id,
    });
};
