import { TTypes } from '@/shared/di/types'
import { useInjection } from '@/app/providers/di-provider'
import { type TNotificationService } from './notifications.service'
import { useQuery } from '@tanstack/react-query'

export const useNotifications = (userId: string) => {
	const notificationService = useInjection<TNotificationService>(TTypes.NotificationService)

	return useQuery({
		queryKey: ['notifications', userId],
		queryFn: () => notificationService.getNotifications(userId).then((res) => res.data),
		enabled: !!userId,
	})
}
