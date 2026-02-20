import { defineStore } from 'pinia';
import api from '@/api/axios';

interface User {
    id: number;
    nombre: string;
    email: string;
    rol: 'admin' | 'cliente';
}

export const useAuthStore = defineStore('auth', {
    state: () => ({
        user: JSON.parse(localStorage.getItem('user') || 'null') as User | null,
        token: localStorage.getItem('token') || null,
        loading: false,
    }),
    getters: {
        isAdmin: (state) => state.user?.rol === 'admin',
        isAuthenticated: (state) => !!state.token,
    },
    actions: {
        async login(credentials: any) {
            this.loading = true;
            try {
                const { data } = await api.post('/auth/login', credentials);

                if (data?.user && (data.user.verificado === false || data.user.verified === false)) {
                    return {
                        success: false,
                        message: 'Tu cuenta aún no está verificada. Revisá tu correo y confirmá el link para ingresar.',
                    };
                }

                this.token = data.access_token;
                this.user = data.user;
                localStorage.setItem('token', data.access_token);
                localStorage.setItem('user', JSON.stringify(data.user));
                return { success: true, message: 'Login exitoso' };
            } catch (error: any) {
                console.error('Error en login', error);
                const message = error.response?.data?.message || 'Error al iniciar sesión';
                return { success: false, message };
            } finally {
                this.loading = false;
            }
        },
        logout() {
            this.user = null;
            this.token = null;
            localStorage.removeItem('token');
            localStorage.removeItem('user');
        }
    },
});