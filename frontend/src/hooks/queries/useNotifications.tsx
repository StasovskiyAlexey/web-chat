import { TTypes } from '@/di/types'
import { queryClient } from '@/lib/query-client'
import { useInjection } from '@/providers/DIProvider'
import { type TNotificationService } from '@/services/notifications.service'
import type { TNotificationCreate, TNotificationUpdate } from '@/types/chat'
import { useMutation, useQuery } from '@tanstack/react-query'
import type { AxiosError } from 'axios'
import { toast } from 'react-toastify'

export const useNotifications = (userId: string) => {
	const notificationService = useInjection<TNotificationService>(TTypes.NotificationService)

	return useQuery({
		queryKey: ['notifications'],
		queryFn: () => notificationService.getNotifications(userId).then((res) => res.data),
	})
}

export const useNotificationMutations = () => {
	const notificationService = useInjection<TNotificationService>(TTypes.NotificationService)

	const addNotification = useMutation({
		mutationFn: (data: { userId: string; data: TNotificationCreate }) =>
			notificationService.addNotification(data.userId, data.data),
		onSuccess: (res) => {
			queryClient.invalidateQueries({ queryKey: ['notifications'] })
			toast.success(res.message)
			return res.data
		},
		onError: (e: AxiosError<any>) => {
			toast.error(e.response?.data.detail || 'Помилка при створенні кімнати')
		},
	})

	const updateNotification = useMutation({
		mutationFn: (data: { userId: string; notificationId: string; data: TNotificationUpdate }) =>
			notificationService.updateNotification(data.userId, data.notificationId, data.data),
		onSuccess: (res) => {
			queryClient.invalidateQueries({ queryKey: ['notifications'] })
			toast.success(res.message)
			return res.data
		},
		onError: (e: AxiosError<any>) => {
			toast.error(e.response?.data.detail || 'Помилка при створенні кімнати')
		},
	})

	return {
		addNotification: addNotification.mutate,
		updateNotification: updateNotification.mutate,
	}
}
