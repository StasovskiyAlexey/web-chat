import { useState } from 'react'
import { Hash, Send, Users, MoreVertical, Phone, Video, Search, ShieldCheck } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { useInjection } from '@/providers/DIProvider'
import type { TChatStore } from '@/store/chat.store'
import { TTypes } from '@/di/types'
import { useParams } from '@tanstack/react-router'

// --- Mock Data ---
const MOCK_ROOM = {
	id: '1',
	name: 'Backend Developers',
	type: 'group',
	members: [
		{ id: '1', name: 'Dmitry', role: 'owner', avatar: '', online: true },
		{ id: '2', name: 'Alex', role: 'member', avatar: '', online: false },
		{ id: '3', name: 'Maria', role: 'member', avatar: '', online: true },
	],
}

// const MOCK_MESSAGES = [
// 	{ id: 1, sender: 'Dmitry', text: 'Привет! Как там успехи с миграцией на SQLAlchemy 2.0?', time: '10:05', isMe: true },
// 	{ id: 2, sender: 'Alex', text: 'Почти закончил, воюю с асинхронными сессиями.', time: '10:12', isMe: false },
// 	{
// 		id: 3,
// 		sender: 'Dmitry',
// 		text: 'О, MissingGreenlet словил? Добавь selectinload в запросы.',
// 		time: '10:15',
// 		isMe: true,
// 	},
// ]

export default function Room() {
	const id = useParams({ from: '/rooms/$roomId' }).roomId

	const [message, setMessage] = useState('')
	const chatStore = useInjection<TChatStore>(TTypes.ChatStore)
	console.log(chatStore.rooms)
	useEffect(() => {
		if (id) {
			chatStore.fetchRoomById(id)
		}
	}, [])

	return (
		<div className='flex h-screen bg-background overflow-hidden'>
			{/* --- Основная область чата --- */}
			<main className='flex-1 flex flex-col min-w-0 border-r'>
				{/* Header чата */}
				<header className='h-16 border-b flex items-center justify-between px-4 shrink-0'>
					<div className='flex items-center gap-3'>
						<div className='w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary'>
							<Hash className='w-5 h-5' />
						</div>
						<div>
							<h2 className='font-bold leading-tight'>{MOCK_ROOM.name}</h2>
							<p className='text-xs text-muted-foreground'>{MOCK_ROOM.members.length} участников</p>
						</div>
					</div>
					<div className='flex items-center gap-2'>
						{/* <Button
							variant='ghost'
							size='icon'>
							<Phone className='w-4 h-4' />
						</Button>
						<Button
							variant='ghost'
							size='icon'>
							<Video className='w-4 h-4' />
						</Button>
						<Button
							variant='ghost'
							size='icon'>
							<Search className='w-4 h-4' />
						</Button> */}
						<Button
							variant='ghost'
							size='icon'>
							<MoreVertical className='w-4 h-4' />
						</Button>
					</div>
				</header>

				{/* Область сообщений */}
				<ScrollArea className='flex-1 p-4'>
					<div className='space-y-6'>
						{/* {chatStore.room?.messages.map((msg, i) => (
							<div
								key={i}
								className={`flex ${msg.member_id ? 'justify-end' : 'justify-start'}`}>
								<div className={`flex gap-3 max-w-[70%] ${msg.isMe ? 'flex-row-reverse' : ''}`}>
									<Avatar className='w-8 h-8 shrink-0'>
										<AvatarFallback>{msg.sender[0]}</AvatarFallback>
									</Avatar>
									<div>
										{!msg.isMe && <p className='text-xs font-medium mb-1 ml-1'>{msg.sender}</p>}
										<div
											className={`p-3 rounded-2xl text-sm ${
												msg.isMe ? 'bg-primary text-primary-foreground rounded-tr-none' : 'bg-muted rounded-tl-none'
											}`}>
											{msg.content}
										</div>
										<p className={`text-[10px] mt-1 text-muted-foreground ${msg.isMe ? 'text-right' : ''}`}>
											{msg.content}
										</p>
									</div>
								</div>
							</div>
						))} */}
					</div>
				</ScrollArea>

				{/* Input сообщений */}
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
							type='submit'
							size='icon'
							disabled={!message}>
							<Send className='w-4 h-4' />
						</Button>
					</form>
				</footer>
			</main>

			{/* --- Правая панель (Участники) --- */}
			<aside className='w-64 hidden lg:flex flex-col shrink-0 bg-muted/30'>
				<header className='h-16 border-b flex items-center px-4 shrink-0'>
					<h3 className='font-semibold flex items-center gap-2'>
						<Users className='w-4 h-4' /> Участники
					</h3>
				</header>

				<ScrollArea className='flex-1'>
					<div className='p-4 space-y-4'>
						{chatStore.room?.members.map((user) => (
							<div
								key={user.user_id}
								className='flex items-center justify-between group'>
								<div className='flex items-center gap-3'>
									<div className='relative'>
										<Avatar className='w-9 h-9'>
											{/* <AvatarImage src={user.user.picture || ''} /> */}
											<AvatarFallback>{user.user.login}</AvatarFallback>
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
