import { queryClient } from '@/app/lib/query-client'
import { useInjection } from '@/app/providers/DIProvider'
import type { TNotificationService } from '@/entities/notification/api/notifications.service'
import { TTypes } from '@/shared/di/types'
import { useMutation } from '@tanstack/react-query'
import type { AxiosError } from 'axios'
import { toast } from 'sonner'

export default function useAcceptRoomInvite() {
	const notificationService = useInjection<TNotificationService>(TTypes.NotificationService)

	return useMutation({
		mutationFn: (data: {
			userId: string
			notificationId: string
			inviteId: string
			status: string
			inviteType: 'invite_from_room' | 'invite_to_room'
		}) =>
			notificationService.acceptInvite(data.userId, data.notificationId, data.inviteId, data.status, data.inviteType),
		onSuccess: (res) => {
			queryClient.invalidateQueries({ queryKey: ['notifications'] })
			toast.success(res.message)
		},
		onError: (e: AxiosError<any>) => {
			toast.error(e.response?.data.detail)
		},
	})
}
