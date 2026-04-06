import axios, { type AxiosInstance } from 'axios'

export const AxiosClient: AxiosInstance = axios.create({
	baseURL: 'http://localhost:8000/api/v1/',
	timeout: 5000,
	withCredentials: true,
})

// Обработка запроса отправки данных, с конфигом и прочим
AxiosClient.interceptors.request.use(
	(config) => {
		// Место в котором мы пишем код который выполнится при успешном запросе
		return config
	},
	(error) => {
		// Место в котором мы пишем код который выполнится при неудачном запросе
		return Promise.reject(error)
	},
)

// Обработка запроса получения данных, ответа
AxiosClient.interceptors.response.use(
	(response) => {
		// Место в котором мы пишем код который выполнится при успешном ответе, своего рода мидлвейр который отслеживает ответы и отталкиваются от этого
		return response
	},
	(error) => {
		// Место в котором выполнится код при ошибке, выход из аккаунта, удаление токена и т.д.
		return Promise.reject(error)
	},
)
