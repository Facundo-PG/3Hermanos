import { defineStore } from 'pinia'
import api from '@/api/axios'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,
    token: localStorage.getItem('token') || null,
  }),
  actions: {
    async login(payload: any) {
      try {
        const { data } = await api.post('/auth/login', payload)
        this.token = data.access_token
        this.user = data.user
        localStorage.setItem('token', data.access_token)
        return { success: true }
      } catch (error: any) {
        return { success: false, message: error.response?.data?.message }
      }
    }
  }
})