import { useQuery, useMutation } from '@tanstack/react-query'
import { toast } from 'react-toastify'
import { AxiosError } from 'axios'
import { useInjection } from '@/providers/DIProvider'
import { TTypes } from '@/di/types'
import type { TChatService } from '@/services/chat.service'
import type { TMessageCreate, TRoomCreate, TRoomInvite, TRoomUpdate } from '@/types/chat'
import { queryClient } from '@/lib/query-client'

export const useRooms = () => {
	const chatService = useInjection<TChatService>(TTypes.ChatService)

	return useQuery({
		queryKey: ['rooms'],
		queryFn: () => chatService.getRooms().then((res) => res.data),
	})
}

export const useRoom = (roomId: string) => {
	const chatService = useInjection<TChatService>(TTypes.ChatService)

	return useQuery({
		queryKey: ['rooms', roomId],
		queryFn: () => chatService.getRoom(roomId).then((res) => res.data),
		enabled: !!roomId,
	})
}

export const useChatMutations = () => {
	const chatService = useInjection<TChatService>(TTypes.ChatService)

	const addRoom = useMutation({
		mutationFn: (data: TRoomCreate) => chatService.createRoom(data),
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
		mutationFn: (data: TRoomUpdate) => chatService.updateRoom(data),
		onSuccess: (res) => {
			queryClient.invalidateQueries({ queryKey: ['rooms'] })
			toast.success(res.message)
			return res.data
		},
		onError: (e: AxiosError<any>) => {
			toast.error(e.response?.data.detail)
		},
	})

	const addMessage = useMutation({
		mutationFn: (data: TMessageCreate) => chatService.createMessage(data),
		onSuccess: (res) => {
			queryClient.invalidateQueries({ queryKey: ['messages'] })
			toast.success(res.message)
			return res.data
		},
		onError: (e: AxiosError<any>) => {
			toast.error(e.response?.data.detail)
		},
	})

	const inviteToRoom = useMutation({
		mutationFn: (data: TRoomInvite) =>
			chatService.inviteToRoom(
				data.code,
				data.inviterId,
				{
					title: data.notificationData.title,
					type: data.notificationData.type,
				},
				{ roomId: data.inviteData.roomId },
			),
		onSuccess: (res) => {
			queryClient.invalidateQueries({ queryKey: ['notifications'] })
			toast.success(res.message)
			return res.data
		},
		onError: (e: AxiosError<any>) => {
			toast.error(e.response?.data.detail)
		},
	})

	const acceptInviteToRoom = useMutation({
		mutationFn: (data: { userId: string; notificationId: string; inviteId: string; status: string }) =>
			chatService.acceptInvite(data.userId, data.notificationId, data.inviteId, data.status),
		onSuccess: (res) => {
			queryClient.invalidateQueries({ queryKey: ['notifications'] })
			toast.success(res.message)
			console.log(res)
			return res.data
		},
		onError: (e: AxiosError<any>) => {
			toast.error(e.response?.data.detail)
		},
	})

	return {
		addRoom: addRoom.mutate,
		updateRoom: updateRoom.mutate,
		addMessage: addMessage.mutate,
		inviteToRoom: inviteToRoom.mutate,
		acceptInviteToRoom: acceptInviteToRoom.mutate,
	}
}
