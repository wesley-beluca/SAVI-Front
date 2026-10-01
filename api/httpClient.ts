import axios from 'axios'
import { env } from '@/utils/env'
import { useAuthStore } from '@/store/auth.store'

export const httpClient = axios.create({
  baseURL: env.apiUrl,
})

httpClient.interceptors.request.use((config) => {
  const authStore = useAuthStore()

  if (authStore.token) {
    config.headers.Authorization = `Bearer ${authStore.token}`
  }

  return config
})

httpClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      useAuthStore().sair()
    }

    return Promise.reject(error)
  },
)
