import { queryClient } from '@/app/lib/query-client'
import { useInjection } from '@/app/providers/di-provider'
import type { TRoomService } from '@/entities/room/api/room.service'
import type { TMessageCreate } from '@/entities/room/model/types'
import { TTypes } from '@/shared/di/types'
import { useMutation } from '@tanstack/react-query'
import type { AxiosError } from 'axios'
import { toast } from 'react-toastify'

export const useSendMessage = () => {
	const roomService = useInjection<TRoomService>(TTypes.RoomService)

	const addMessage = useMutation({
		mutationFn: (data: TMessageCreate) => roomService.createMessage(data),
		onSuccess: (res) => {
			queryClient.invalidateQueries({ queryKey: ['room'] })
			return res.data
		},
		onError: (e: AxiosError<any>) => {
			toast.error(e.response?.data.detail)
		},
	})

	return {
		addMessage: addMessage.mutate,
	}
}
