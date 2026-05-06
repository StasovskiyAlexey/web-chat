import { Bell, UserPlus } from 'lucide-react'
import { Button } from '@/components/shared/ui/button'
import { ScrollArea } from '@/components/shared/ui/scroll-area'
import { useNotifications } from '@/hooks/queries/useNotifications'
import { useAuth } from '@/providers/AuthProvider'
import { Separator } from '../shared/ui/separator'
import dayjs from 'dayjs'

export const NotificationPopup = ({ socket }: { socket: WebSocket | null }) => {
	const { user } = useAuth()

	if (!user) {
		return null
	}

	const { data: notifications } = useNotifications(user?.id)
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
		<div className='flex flex-col max-h-[300px] w-full gap-4'>
			<div className='flex items-center justify-between'>
				<h4 className='font-semibold text-sm'>Оповещения</h4>
				<Button
					disabled={notifications?.some((n) => !n.is_read)}
					variant='ghost'
					size='sm'
					className='h-8 text-xs'>
					Прочитать все
				</Button>
			</div>

			<Separator />

			<ScrollArea className='flex-1 overflow-auto'>
				{notifications && notifications?.length > 0 ? (
					notifications?.map((item) => (
						<div
							key={item.id}
							className={`flex gap-3 p-3 justify-between items-start border-b hover:bg-accent transition-colors cursor-pointer ${!item.is_read ? 'bg-accent/30' : ''}`}>
							<div className='flex gap-4 items-center'>
								<div>
									{item.type === 'invite' && (
										<UserPlus
											size={20}
											className=' text-blue-500'
										/>
									)}
								</div>
								<div>
									<span className='text-sm font-semibold truncate'>{item.title}</span>
									<p className='text-sm text-muted-foreground line-clamp-2'>{item.title}</p>
									<span>{item.invitation_id}</span>
								</div>
							</div>
							<span className='text-[10px] text-muted-foreground shrink-0'>
								{dayjs(item.created_at).format(`DD.MM.YYYY HH:mm`)}
							</span>
						</div>
					))
				) : (
					<div className='flex flex-col items-center justify-center h-full text-muted-foreground p-4'>
						<Bell className='w-8 h-8 mb-2 opacity-20' />
						<p className='text-sm'>Немає нових сповіщень</p>
					</div>
				)}
			</ScrollArea>
		</div>
	)
}
