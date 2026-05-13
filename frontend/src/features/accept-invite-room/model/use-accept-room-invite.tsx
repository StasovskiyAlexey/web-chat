import { queryClient } from '@/app/lib/query-client'
import { useInjection } from '@/app/providers/DIProvider'
import type { TNotification } from '@/entities/notification/model/types'

import type { TRoomService } from '@/entities/room/api/room.service'
import { TTypes } from '@/shared/di/types'
import { useMutation } from '@tanstack/react-query'
import type { AxiosError } from 'axios'
import { toast } from 'sonner'

export default function useAcceptRoomInvite() {
	const roomService = useInjection<TRoomService>(TTypes.RoomService)

	return useMutation({
		mutationFn: (data: { userId: string; notificationId: string; inviteId: string; status: string }) =>
			roomService.acceptInvite(data.userId, data.notificationId, data.inviteId, data.status),
		onSuccess: (res) => {
			queryClient.invalidateQueries({ queryKey: ['notifications'] })
			toast.success(res.message)
		},
		onError: (e: AxiosError<any>) => {
			toast.error(e.response?.data.detail)
		},
	})
}
