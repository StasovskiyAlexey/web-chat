import { queryClient } from '@/app/lib/query-client'
import { useInjection } from '@/app/providers/DIProvider'
import type { TRoomService } from '@/entities/room/api/room.service'
import type { TRoomCreate } from '@/entities/room/model/types'
import { TTypes } from '@/shared/di/types'
import { useMutation } from '@tanstack/react-query'
import type { AxiosError } from 'axios'
import { toast } from 'sonner'

export const useCreateRoom = () => {
	const roomService = useInjection<TRoomService>(TTypes.RoomService)

	return useMutation({
		mutationFn: (data: TRoomCreate) => roomService.createRoom(data),
		onSuccess: (res) => {
			toast.success(res.message)
			queryClient.invalidateQueries({ queryKey: ['rooms'] })
		},
		onError: (e: AxiosError<any>) => {
			toast.error(e.response?.data.detail || 'Помилка при створенні кімнати')
		},
	})
}
