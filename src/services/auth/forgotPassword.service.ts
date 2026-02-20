import api from '@/api/axios';

export const requestPasswordReset = async (email: string) => {
    const payload = { email };
    const { data } = await api.post('/auth/forgot-password', payload);
    return data;
};

export const confirmPasswordReset = async (token: string, password: string) => {
    const payload = {
        token,
        password,
    };

    const { data } = await api.post('/auth/reset-password', payload);
    return data;
};