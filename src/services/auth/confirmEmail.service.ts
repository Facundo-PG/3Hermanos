import api from '@/api/axios';

export const confirmEmail = async (token: string) => {
    const { data } = await api.post('/auth/confirm-email', { token });
    return data;
};