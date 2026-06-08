import { useQuery, useMutation } from '@tanstack/react-query'
import { toast } from 'sonner'
import { AxiosError } from 'axios'
import { useInjection } from '@/app/providers/di-provider'
import { TTypes } from '@/shared/di/types'
import type { TRoomService } from '@/entities/room/api/room.service'
import type { TMessageCreate, TRoomCreate, TRoomUpdate } from '../model/types'
import { queryClient } from '@/app/lib/query-client'

export const useRooms = () => {
	const roomService = useInjection<TRoomService>(TTypes.RoomService)

	return useQuery({
		queryKey: ['rooms'],
		queryFn: () => roomService.getRooms().then((res) => res.data),
	})
}

export const useRoom = (roomId: string) => {
	const roomService = useInjection<TRoomService>(TTypes.RoomService)

	return useQuery({
		queryKey: ['rooms', roomId],
		queryFn: () => roomService.getRoom(roomId).then((res) => res.data),
		enabled: !!roomId,
	})
}

export const useRoomMutations = () => {
	const roomService = useInjection<TRoomService>(TTypes.RoomService)

	const createRoom = useMutation({
		mutationFn: (data: TRoomCreate) => roomService.createRoom(data),
		onSuccess: (res) => {
			queryClient.invalidateQueries({ queryKey: ['rooms'] })
			toast.success(res.message)
			return res.data
		},
		onError: (e: AxiosError<any>) => {
			toast.error(e.response?.data.detail || 'Помилка при створенні кімнати')
		},
	})

	const updateRoom = useMutation({
		mutationFn: (data: TRoomUpdate) => roomService.updateRoom(data),
		onSuccess: (res) => {
			queryClient.invalidateQueries({ queryKey: ['rooms'] })
			toast.success(res.message)
			return res.data
		},
		onError: (e: AxiosError<any>) => {
			toast.error(e.response?.data.detail)
		},
	})

	return {
		createRoom: createRoom.mutate,
		updateRoom: updateRoom.mutate,
	}
}
