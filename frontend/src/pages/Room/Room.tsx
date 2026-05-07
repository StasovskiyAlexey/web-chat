import { useState } from 'react'
import { Send, Users, MoreVertical, ShieldCheck } from 'lucide-react'
import { Button } from '@/components/shared/ui/button'
import { Input } from '@/components/shared/ui/input'
import { ScrollArea } from '@/components/shared/ui/scroll-area'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/shared/ui/avatar'
import { useParams } from '@tanstack/react-router'
import { useAuth } from '@/providers/AuthProvider'
import Loader from '@/components/shared/Loader'
import ErrorFallback from '@/components/shared/ErrorFallback'
import useWebsocket from '@/hooks/useWebsocket'
import { websocketUrl } from '@/lib/envVariables'
import { useChatMutations, useRoom } from '@/hooks/queries/useChat'
import dayjs from 'dayjs'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/shared/ui/popover'
import { usePopup } from '@/providers/PopupProvider'
import RoomSettings from './Popovers/RoomSettings'

export const Room = () => {
	const roomId = useParams({ from: '/rooms/$roomId' }).roomId
	const chatArea = useRef<null | HTMLDivElement>(null)

	const [message, setMessage] = useState('')
	const { popups, switcher } = usePopup()

	const { addMessage } = useChatMutations()
	const { data: room, isLoading, isError } = useRoom(roomId)

	const { user } = useAuth()
	const { socket } = useWebsocket(`${websocketUrl}/room_connection?room_id=${roomId}`)

	useEffect(() => {
		if (!socket) return

		// Тут делаем onMessage только делаем функцию хендлер для создания события
		const handleMessage = (event: MessageEvent) => {
			try {
				const data = JSON.parse(event.data)
				const payload = data.payload
				room?.messages.push(payload)
			} catch (e) {
				console.error(e)
			}
		}

		socket.addEventListener('message', handleMessage)
		return () => socket.removeEventListener('message', handleMessage)
	}, [socket, roomId])

	function handleAddMessage() {
		addMessage({
			content: message,
			room_id: roomId,
			user_id: user?.id as string,
			member_id: room?.members.find((el) => el.user_id === user?.id)?.id as string,
		})

		setMessage('')
	}

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

							<PopoverContent className='w-80'>
								<RoomSettings />
							</PopoverContent>
						</Popover>
					</div>
				</header>

				<ScrollArea
					ref={chatArea}
					className='flex-1 p-4 overflow-auto'>
					<div className='space-y-6 '>
						{room?.messages.map((msg, i) => (
							<div
								key={i}
								className={`flex ${msg.user_id === user?.id ? 'justify-end' : 'justify-start'}`}>
								<div className={`flex gap-3 max-w-[70%] ${msg.user_id === user?.id ? 'flex-row-reverse' : ''}`}>
									<Avatar className='size-10 shrink-0'>
										<AvatarImage src={msg.user.picture || `https://cdn-icons-png.freepik.com/512/6596/6596121.png`} />
										<AvatarFallback>{user?.login.slice(0, 2)}</AvatarFallback>
									</Avatar>
									<div>
										{msg.user_id !== user?.id && <p className='text-xs font-medium mb-1 ml-1'>{msg.user.login}</p>}
										<div
											className={`p-2 rounded-sm text-sm ${
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
					<form
						className='flex gap-2'
						onSubmit={(e) => e.preventDefault()}>
						<Input
							placeholder='Написать сообщение...'
							value={message}
							onChange={(e) => setMessage(e.target.value)}
							className='flex-1 bg-muted/50 border-none focus-visible:ring-1'
						/>
						<Button
							onClick={() => handleAddMessage()}
							type='submit'
							size='icon'
							disabled={!message}>
							<Send className='w-4 h-4' />
						</Button>
					</form>
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
						{room?.members.map((user) => (
							<div
								key={user.user_id}
								className='flex items-center justify-between group'>
								<div className='flex items-center gap-3'>
									<div className='relative'>
										<Avatar className='size-9'>
											<AvatarImage src={user.user.picture || ''} />
											<AvatarFallback>{user.user.login.slice(0, 2)}</AvatarFallback>
										</Avatar>
									</div>
									<div>
										<p className='text-sm font-medium leading-none'>{user.user.login}</p>
										<p className='text-xs text-muted-foreground'>{user.role === 'owner' ? 'Создатель' : 'Участник'}</p>
									</div>
								</div>
								{user.role === 'owner' && <ShieldCheck className='w-4 h-4 text-amber-500' />}
							</div>
						))}
					</div>
				</ScrollArea>
			</aside>
		</div>
	)
}
