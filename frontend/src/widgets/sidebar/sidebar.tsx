import { useState } from 'react'
import { useAuth } from '@/app/providers/AuthProvider'
import { LogOut, Settings, ChevronLeft, House, Bell } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from '@/shared/ui/avatar'
import { Separator } from '@/shared/ui/separator'
import { motion } from 'framer-motion'
import { NavItem } from './nav-item'
import { usePopup } from '@/app/providers/PopupProvider'
import { Popover, PopoverContent, PopoverTrigger } from '@/shared/ui/popover'
import { NotificationPopup } from '@/entities/notification/ui/notifications-popup'
import { websocketUrl } from '@/app/lib/envVariables'
import { observer } from 'mobx-react-lite'
import useWebsocket from '@/shared/hooks/useWebsocket'

export const Sidebar = observer(() => {
	const { logout, user } = useAuth()
	const [isOpen, setIsOpen] = useState<boolean>(true)
	const { switcher, popups } = usePopup()

	const { socket } = useWebsocket(`${websocketUrl}/get_notifications?user_id=${user?.id}`)
	console.log(socket)
	if (!user) return null

	return (
		<motion.aside
			initial={false}
			animate={{ width: isOpen ? 260 : 80 }}
			className='relative flex h-screen flex-col border-r bg-card p-3 shadow-sm transition-colors'>
			<button
				onClick={() => setIsOpen(!isOpen)}
				className='absolute -right-3 top-12 z-50 flex size-6 items-center justify-center rounded-full border bg-background shadow-md hover:bg-accent transition-transform'
				style={{ transform: isOpen ? 'rotate(0deg)' : 'rotate(180deg)' }}>
				<ChevronLeft className='size-4' />
			</button>

			<div className='flex flex-col justify-start items-start px-2 py-2'>
				{isOpen ? (
					<div className='flex items-center gap-2'>
						<span className='ml-3 truncate font-bold tracking-tight text-foreground'>Web-Chat</span>
						<img
							className='size-10'
							src='https://static.vecteezy.com/system/resources/thumbnails/008/508/754/small_2x/3d-chat-mail-message-notification-chatting-illustration-png.png'
						/>
					</div>
				) : (
					<img
						className='size-10'
						src='https://static.vecteezy.com/system/resources/thumbnails/008/508/754/small_2x/3d-chat-mail-message-notification-chatting-illustration-png.png'
					/>
				)}
			</div>

			<nav className='flex flex-col gap-2'>
				<NavItem
					to='/'
					icon={House}
					label='Главная'
					isOpen={isOpen}
				/>
			</nav>

			<div className='mt-auto flex flex-col gap-2'>
				<Separator className='my-2 opacity-50' />

				<Popover
					onOpenChange={(open) => switcher('userNotifications', open)}
					open={popups.userNotifications.isOpen}>
					<PopoverTrigger asChild>
						<NavItem
							onClick={() => switcher('userNotifications', true)}
							icon={Bell}
							label='Уведомления'
							isOpen={isOpen}
						/>
					</PopoverTrigger>

					<PopoverContent
						side='right'
						className='w-100'>
						<NotificationPopup socket={socket} />
					</PopoverContent>
				</Popover>

				<NavItem
					to='/settings'
					icon={Settings}
					label='Настройки'
					isOpen={isOpen}
				/>

				<NavItem
					to=''
					icon={LogOut}
					label='Выйти'
					isOpen={isOpen}
					variant='danger'
					onClick={logout}
				/>

				<Separator className='my-2 opacity-50' />

				<div
					className={`flex items-center gap-3 rounded-xl p-2 transition-colors ${isOpen ? 'hover:bg-accent/50' : 'justify-center'}`}>
					<Avatar className='size-9 border border-border shadow-sm'>
						<AvatarImage src={user.picture as string} />
						<AvatarFallback className='bg-primary/5 text-[10px] font-bold text-primary'>
							{user?.login?.slice(0, 2).toUpperCase()}
						</AvatarFallback>
					</Avatar>

					{isOpen && (
						<div className='flex flex-col gap-1 min-w-0'>
							<span className='truncate text-xs font-semibold text-foreground'>{user?.login}</span>
							<span className='truncate text-xs text-muted-foreground'>{user?.email}</span>
							<span className='truncate text-xs text-muted-foreground'>Код приглашения: {user?.user_code}</span>
							<span className='truncate text-xs text-muted-foreground'>ID пользователя: {user?.id}</span>
						</div>
					)}
				</div>
			</div>
		</motion.aside>
	)
})
