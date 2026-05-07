import { Bell, Check, CheckCheck, UserPlus, X } from 'lucide-react'
import { Button } from '@/components/shared/ui/button'
import { ScrollArea } from '@/components/shared/ui/scroll-area'
import { useNotifications } from '@/hooks/queries/useNotifications'
import { useAuth } from '@/providers/AuthProvider'
import { Separator } from '../shared/ui/separator'
import dayjs from 'dayjs'
import { useChatMutations } from '@/hooks/queries/useChat'

export const NotificationPopup = ({ socket }: { socket: WebSocket | null }) => {
	const { user } = useAuth()

	if (!user) {
		return null
	}

	const { data: notifications } = useNotifications(user?.id)

	const { acceptInviteToRoom } = useChatMutations()

	console.log(notifications)

	useEffect(() => {
		if (!socket) return

		// Тут делаем onMessage только делаем функцию хендлер для создания события
		const handleMessage = (event: MessageEvent) => {
			try {
				const data = JSON.parse(event.data)
				const payload = data.payload
				console.log(payload)
			} catch (e) {
				console.error(e)
			}
		}

		socket.addEventListener('message', handleMessage)
		return () => socket.removeEventListener('message', handleMessage)
	}, [socket, notifications])

	return (
		<div className='flex flex-col w-full max-h-[400px] max-w-[380px] bg-white rounded-md'>
			{/* Header */}
			<div className='flex items-center justify-between'>
				<div className='flex items-center gap-2'>
					<h4 className='font-bold text-base text-slate-800'>Сповіщення</h4>
					{notifications?.some((n) => !n.is_read) && <div className='h-2 w-2 bg-blue-500 rounded-full animate-pulse' />}
				</div>
				<Button
					variant='ghost'
					size='sm'
					disabled={!notifications?.some((n) => !n.is_read)}
					className='h-8 text-xs font-medium text-blue-600 hover:text-blue-700 hover:bg-blue-50'>
					Прочитати все
				</Button>
			</div>

			<Separator className='opacity-50 my-4' />

			<ScrollArea className='flex-1'>
				{notifications && notifications.length > 0 ? (
					<div className='flex flex-col'>
						{notifications.map((item) => (
							<div
								key={item.id}
								className={`group relative flex flex-col gap-3 p-4 transition-all duration-200 ${
									item.is_read ? 'opacity-70 grayscale-[0.3]' : 'bg-blue-50/30'
								}`}>
								{/* Статус-індикатор зліва */}
								{!item.is_read && <div className='absolute left-0 top-0 bottom-0 w-1 bg-blue-500 rounded-r-full' />}

								<div className='flex items-start justify-between gap-3'>
									<div className='flex gap-3'>
										{/* Icon Container */}
										<div
											className={`shrink-0 p-2 rounded-lg ${
												item.type === 'invite' ? 'bg-blue-100 text-blue-600' : 'bg-slate-100 text-slate-600'
											}`}>
											<UserPlus size={18} />
										</div>

										<div className='flex flex-col min-w-0'>
											<span
												className={`text-sm leading-tight truncate ${
													item.is_read ? 'font-medium text-slate-600' : 'font-bold text-slate-900'
												}`}>
												{item.title}
											</span>
											<div className='flex items-center gap-2 mt-1'>
												<span className='text-[10px] uppercase tracking-wider font-semibold text-slate-400'>
													Invite ID: {item.invitation_id.slice(0, 8)}...
												</span>
											</div>
										</div>
									</div>

									{/* Час та іконка прочитаного */}
									<div className='flex flex-col items-end gap-1 shrink-0'>
										<span className='text-[10px] font-medium text-slate-400'>
											{dayjs(item.created_at).format('HH:mm')}
										</span>
										{item.is_read ? (
											<CheckCheck
												size={14}
												className='text-blue-500'
											/>
										) : (
											<Check
												size={14}
												className='text-slate-300'
											/>
										)}
									</div>
								</div>

								{/* Блок дій (тільки для активних інвайтів) */}
								{item.type === 'invite' && !item.is_read && (
									<div className='flex gap-2 ml-11'>
										<button
											onClick={() =>
												acceptInviteToRoom({
													userId: user.id,
													notificationId: item.id,
													inviteId: item.invitation_id,
													status: 'accepted',
												})
											}
											className='flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-[11px] font-semibold rounded-md shadow-sm transition-all active:scale-95'>
											<Check size={14} />
											Принять
										</button>
										<button
											onClick={() =>
												acceptInviteToRoom({
													userId: user.id,
													notificationId: item.id,
													inviteId: item.invitation_id,
													status: 'canceled',
												})
											}
											className='flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-slate-50 text-slate-600 text-[11px] font-semibold rounded-md border border-slate-200 transition-all active:scale-95'>
											<X size={14} />
											Отклонить
										</button>
									</div>
								)}

								{/* Розділювач, крім останнього елемента */}
								<div className='absolute bottom-0 left-4 right-4 h-px bg-slate-100 group-last:hidden' />
							</div>
						))}
					</div>
				) : (
					<div className='flex flex-col items-center justify-center py-4 text-slate-400'>
						<div className='p-4 bg-slate-50 rounded-full mb-4'>
							<Bell className='w-8 h-8 opacity-20' />
						</div>
						<p className='text-sm font-medium'>Немає нових сповіщень</p>
						<p className='text-xs opacity-70'>Тут з'являтимуться запрошення</p>
					</div>
				)}
			</ScrollArea>
		</div>
	)
}
