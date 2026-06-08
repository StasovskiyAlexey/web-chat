import { Users, MoreVertical } from 'lucide-react'
import { Button } from '@/shared/ui/button'
import { ScrollArea } from '@/shared/ui/scroll-area'
import { Avatar, AvatarFallback, AvatarImage } from '@/shared/ui/avatar'
import { useParams } from '@tanstack/react-router'
import { useAuth } from '@/app/providers/auth-provider'
import Loader from '@/shared/loader'
import ErrorFallback from '@/shared/error-fallback'
import { websocketUrl } from '@/app/lib/env-variables'
import { useRoom } from '@/entities/room/api/queries'
import dayjs from 'dayjs'
import { Popover, PopoverContent, PopoverTrigger } from '@/shared/ui/popover'
import { usePopup } from '@/app/providers/popup-provider'
import RoomSettings from '@/entities/room/ui/room-settings-popup'
import useWebsocket from '@/shared/hooks/use-websocket'
import { queryClient } from '@/app/lib/query-client'
import MemberSettingsPopup from '@/widgets/member-settings-popup/ui/member-settings-popup'
import { AddMessageForm } from '@/features/add-message'

export const Room = () => {
	const roomId = useParams({ from: '/rooms/$roomId' }).roomId
	const { popups, switcher, add } = usePopup()

	const { data: room, isLoading, isError } = useRoom(roomId)

	const { user } = useAuth()
	const { socket } = useWebsocket(`${websocketUrl}/room_connection?room_id=${roomId}`)

	useEffect(() => {
		if (!socket) return

		const handleMessage = (event: MessageEvent) => {
			try {
				const data = JSON.parse(event.data)
				const payload = data.payload

				queryClient.setQueryData(['rooms', roomId], (oldData: any) => {
					if (!oldData) return oldData
					return { ...oldData, messages: [...oldData.messages, payload] }
				})
			} catch (e) {
				console.error(e)
			}
		}

		socket.addEventListener('message', handleMessage)
		return () => socket.removeEventListener('message', handleMessage)
	}, [socket, roomId])

	if (isLoading) {
		return <Loader message='Загрузка комнаты' />
	}

	if (isError) {
		return <ErrorFallback title='Ошибка при загрузке комнаты' />
	}

	return (
		<div className='flex h-screen bg-background overflow-hidden'>
			<main className='flex-1 flex flex-col min-w-0 border-r'>
				<header className='h-16 border-b flex items-center justify-between px-4 shrink-0'>
					<div className='flex items-center gap-3'>
						<div>
							<h2 className='font-bold leading-tight'>{room?.name}</h2>
							<p className='text-xs text-muted-foreground'>{room?.members.length} участников</p>
						</div>
					</div>
					<div className='flex items-center gap-2'>
						<Popover
							open={popups.roomSettings.isOpen}
							onOpenChange={(open) => switcher('roomSettings', open, room)}>
							<PopoverTrigger asChild>
								<Button
									variant='ghost'
									size='icon'>
									<MoreVertical className='w-4 h-4' />
								</Button>
							</PopoverTrigger>

							{/* При захода в другую руму попап остается открытым и со старыми пропсами */}
							<PopoverContent className='w-70'>
								<RoomSettings />
							</PopoverContent>
						</Popover>
					</div>
				</header>

				<ScrollArea className='flex-1 p-4 overflow-auto'>
					<div className='space-y-6 '>
						{room?.messages.map((msg, i) => (
							<div
								key={i}
								className={`flex ${msg.user_id === user?.id ? 'justify-end' : 'justify-start'}`}>
								<div className={`flex gap-3 max-w-[70%] ${msg.user_id === user?.id ? 'flex-row-reverse' : ''}`}>
									<Avatar className='size-10 shrink-0'>
										<AvatarImage src={msg.user?.picture || `https://cdn-icons-png.freepik.com/512/6596/6596121.png`} />
										<AvatarFallback>{user?.login.slice(0, 2)}</AvatarFallback>
									</Avatar>
									<div>
										{msg.user_id !== user?.id && <p className='text-xs font-medium mb-1 ml-1'>{msg.user.login}</p>}
										<div
											className={`p-2 rounded-sm flex justify-center text-sm ${
												msg.user_id === user?.id ? 'bg-black text-primary-foreground' : 'bg-muted'
											}`}>
											{msg.content}
										</div>
										<p
											className={`text-[10px] mt-1 text-muted-foreground ${msg.user_id === user?.id ? 'text-right' : ''}`}>
											{dayjs(msg.created_at).format(`DD.MM.YYYY HH:mm`)}
										</p>
									</div>
								</div>
							</div>
						))}
					</div>
				</ScrollArea>

				<footer className='p-4 border-t bg-background'>
					<AddMessageForm room={room} />
				</footer>
			</main>

			<aside className='w-64 hidden lg:flex flex-col shrink-0 bg-muted/30'>
				<header className='h-16 border-b flex items-center px-4 shrink-0'>
					<h3 className='font-semibold flex items-center gap-2'>
						<Users className='w-4 h-4' /> Участники
					</h3>
				</header>

				<ScrollArea className='flex-1 overflow-auto'>
					<div className='p-4 space-y-4'>
						{room?.members.map((member) => (
							<div
								key={member.id}
								className='flex items-center justify-between group'>
								<div className='flex items-center w-full justify-between gap-3'>
									<div className='flex items-center gap-2'>
										<div className='relative'>
											<Avatar className='size-9'>
												<AvatarImage src={member.user.picture || ''} />
												<AvatarFallback>{member.user.login.slice(0, 2)}</AvatarFallback>
											</Avatar>
										</div>
										<div>
											<p className='text-sm font-medium leading-none'>{member.user.login}</p>
											<p className='text-xs text-muted-foreground'>
												{member.role === 'owner'
													? `${user?.id === member.user_id ? 'Создатель(Вы)' : 'Создатель'}`
													: `${user?.id === member.user_id ? 'Участник(Вы)' : 'Участник'}`}
											</p>
										</div>
									</div>
									<Popover
										onOpenChange={(open) => add(`member-settings-popup-${member.id}`, open, room)}
										open={popups[`member-settings-popup-${member.id}`]?.isOpen}>
										<PopoverTrigger asChild>
											<Button
												variant='ghost'
												size='icon'>
												<MoreVertical className='w-4 h-4' />
											</Button>
										</PopoverTrigger>
										<PopoverContent
											align='end'
											className='w-80'>
											<MemberSettingsPopup
												roomId={room.id}
												userId={user?.id as string}
												member={member}
											/>
										</PopoverContent>
									</Popover>
								</div>
							</div>
						))}
					</div>
				</ScrollArea>
			</aside>
		</div>
	)
}
