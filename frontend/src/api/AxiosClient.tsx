import axios, { type AxiosInstance } from 'axios'

let accessToken: string | null = null

export const AxiosClient: AxiosInstance = axios.create({
	baseURL: 'http://localhost:8000/api/v1/',
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
				const res = await axios.post('http://localhost:8000/api/v1/auth/refresh', {}, { withCredentials: true })
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
