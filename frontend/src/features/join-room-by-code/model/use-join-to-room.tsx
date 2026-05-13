import { queryClient } from '@/app/lib/query-client'
import { useInjection } from '@/app/providers/DIProvider'
import type { TNotificationCreate } from '@/entities/notification/model/types'

import type { TRoomService } from '@/entities/room/api/room.service'
import { TTypes } from '@/shared/di/types'
import { useMutation } from '@tanstack/react-query'
import type { AxiosError } from 'axios'
import { toast } from 'sonner'

export default function useJoinToRoom() {
	const roomService = useInjection<TRoomService>(TTypes.RoomService)

	return useMutation({
		mutationFn: (data: { code: string; inviterId: string; notificationData: TNotificationCreate }) =>
			roomService.joinToRoomByCode(data.code, data.inviterId, {
				title: data.notificationData.title,
				type: data.notificationData.type,
			}),
		onSuccess: (res) => {
			queryClient.invalidateQueries({ queryKey: ['notifications', 'rooms'] })
			toast.success(res.message)
		},
		onError: (e: AxiosError<any>) => {
			toast.error(e.response?.data.detail)
		},
	})
}
