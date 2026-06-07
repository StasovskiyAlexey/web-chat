import { queryClient } from '@/app/lib/query-client'
import { useInjection } from '@/app/providers/di-provider'
import type { TRoomService } from '@/entities/room/api/room.service'
import { TTypes } from '@/shared/di/types'
import { useMutation } from '@tanstack/react-query'
import { useNavigate } from '@tanstack/react-router'
import type { AxiosError } from 'axios'
import { toast } from 'sonner'

export default function useDeleteRoom() {
	const roomService = useInjection<TRoomService>(TTypes.RoomService)
	const navigate = useNavigate()

	return useMutation({
		mutationFn: (roomId: string) => roomService.deleteRoom(roomId),
		onSuccess: (res) => {
			navigate({ to: '/', replace: true })
			toast.success(res.message)
			queryClient.invalidateQueries({ queryKey: ['rooms'] })
		},
		onError: (e: AxiosError<any>) => {
			toast.error(e.response?.data.detail)
		},
	})
}
