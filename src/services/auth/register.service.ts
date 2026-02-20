import api from '@/api/axios';

export interface RegisterPayload {
    email: string;
    password: string;
    nombre: string;
    telefono: string;
    direccion: string;
}

export const registerUser = async (payload: RegisterPayload) => {
    const { data } = await api.post('/auth/register', payload);
    return data;
};