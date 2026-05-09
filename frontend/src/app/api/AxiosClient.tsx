import axios, { type AxiosInstance } from 'axios'

const baseUrl = import.meta.env.VITE_API_BASE_URL
// Не уверен что всё работает на 100%, так как токен действует какое-то время и затестить сложновато
let accessToken: string | null = null

export const AxiosClient: AxiosInstance = axios.create({
	baseURL: baseUrl,
	timeout: 5000,
	withCredentials: true,
})

// Обработка запроса отправки данных, с конфигом и прочим
AxiosClient.interceptors.request.use(
	(config) => {
		if (accessToken) {
			config.headers.Authorization = `Bearer ${accessToken}`
		}
		return config
	},
	(error) => {
		// Место в котором мы пишем код который выполнится при неудачном запросе
		return Promise.reject(error)
	},
)

// Обработка запроса получения данных, ответа
AxiosClient.interceptors.response.use(
	async (response) => {
		return response
	},
	async (error) => {
		const originalRequest = error.config

		// Проверяем проблема только в авторизации с помощью статуса 401
		if (error.response?.status === 401) {
			try {
				const res = await axios.post(`${baseUrl}auth/refresh`, {}, { withCredentials: true })
				const token = res.data.access_token
				accessToken = token

				originalRequest.headers.Authorization = `Bearer ${token}`
				return AxiosClient(originalRequest)
			} catch (e) {
				return Promise.reject(error)
			}
		}
		return Promise.reject(error)
	},
)
