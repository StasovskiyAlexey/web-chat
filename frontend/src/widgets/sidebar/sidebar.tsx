import { useState } from 'react'
import { useAuth } from '@/app/providers/auth-provider'
import { LogOut, Settings, ChevronLeft, House, Bell } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from '@/shared/ui/avatar'
import { Separator } from '@/shared/ui/separator'
import { motion } from 'framer-motion'
import { NavItem } from './nav-item'
import { usePopup } from '@/app/providers/popup-provider'
import { Popover, PopoverContent, PopoverTrigger } from '@/shared/ui/popover'
import { NotificationPopup } from '@/entities/notification/ui/notifications-popup'
import { websocketUrl } from '@/app/lib/env-variables'
import useWebsocket from '@/shared/hooks/use-websocket'
import { useNotifications } from '@/entities/notification/api/queries'
import { queryClient } from '@/app/lib/query-client'
import { Button } from '@/shared/ui/button'

export const Sidebar = () => {
	const { logout, user } = useAuth()
	const { switcher, popups } = usePopup()

	const { data: notifications } = useNotifications(user?.id as string)
	const [isOpen, setIsOpen] = useState<boolean>(localStorage.getItem('sidebarIsOpen') === 'true' ? true : false)

	const { socket } = useWebsocket(`${websocketUrl}/get_notifications?user_id=${user?.id}`)

	useEffect(() => {
		if (!socket) return

		const handleMessage = (event: MessageEvent) => {
			try {
				const data = JSON.parse(event.data)
				const payload = data.payload

				queryClient.setQueryData(['notifications', user?.id], (oldData: any) => {
					if (!oldData) return oldData
					return [payload, ...oldData]
				})
			} catch (e) {
				console.error(e)
			}
		}

		socket.addEventListener('message', handleMessage)
		return () => socket.removeEventListener('message', handleMessage)
	}, [socket, queryClient, user?.id])

	if (!user) return null

	return (
		<motion.aside
			initial={false}
			animate={{ width: isOpen ? 280 : 76 }}
			transition={{ type: 'spring', stiffness: 300, damping: 30 }}
			className='relative flex flex-col border-r bg-card shadow-sm'>
			{/* HEADER: Логотип + Кнопка свертывания */}
			<div
				className={`flex h-16 items-center ${isOpen ? 'justify-between' : 'justify-center'} px-4 border-b border-border/40`}>
				{isOpen && (
					<div className='flex items-center gap-2'>
						<img
							className='size-8 shrink-0 object-contain'
							src='https://static.vecteezy.com/system/resources/thumbnails/028/754/648/small/3d-purple-online-chatting-bubble-icon-for-ui-ux-web-mobile-apps-social-media-ads-designs-png.png'
							alt='Logo'
						/>

						<motion.span
							initial={{ opacity: 0, x: -10 }}
							animate={{ opacity: 1, x: 0 }}
							exit={{ opacity: 0, x: -10 }}
							className='uppercase font-black text-base tracking-tight text-foreground whitespace-nowrap'>
							Web-chat
						</motion.span>
					</div>
				)}

				<Button
					variant='ghost'
					size='icon'
					onClick={() => {
						localStorage.setItem('sidebarIsOpen', !isOpen ? 'true' : 'false')
						setIsOpen(!isOpen)
					}}
					className=' text-muted-foreground hover:text-foreground'>
					<motion.div
						animate={{ rotate: isOpen ? 0 : 180 }}
						transition={{ duration: 0.2 }}>
						<ChevronLeft className='size-4' />
					</motion.div>
				</Button>
			</div>

			<nav className='flex-1 p-3 space-y-1'>
				<NavItem
					to='/'
					icon={House}
					label='Главная'
					isOpen={isOpen}
				/>
			</nav>

			<div className='p-3 border-t border-border/40'>
				<div className='flex flex-col gap-2'>
					<Popover
						onOpenChange={(open) => switcher('userNotifications', open)}
						open={popups.userNotifications.isOpen}>
						<PopoverTrigger asChild>
							<NavItem
								onClick={() => switcher('userNotifications', true)}
								icon={Bell}
								label='Уведомления'
								isOpen={isOpen}
								isMarked={notifications?.some((el) => !el.is_read)}
							/>
						</PopoverTrigger>

						<PopoverContent
							side='right'
							sideOffset={12}
							className='w-80 p-0 overflow-hidden'>
							<NotificationPopup notifications={notifications} />
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
				</div>

				<Separator className='my-3 opacity-40' />

				{/* КОМПАКТНЫЙ ПРОФИЛЬ ПОЛЬЗОВАТЕЛЯ */}
				<div className={`flex items-center gap-3 rounded-xl p-2 bg-muted/40 ${!isOpen && 'justify-center'}`}>
					<Avatar className='size-9 border border-border/60 shrink-0 shadow-sm'>
						<AvatarImage src={user.picture as string} />
						<AvatarFallback className='bg-primary/5 text-[10px] font-bold text-primary'>
							{user?.login?.slice(0, 2).toUpperCase()}
						</AvatarFallback>
					</Avatar>

					{isOpen && (
						<div className='flex flex-col min-w-0 flex-1'>
							<span className='truncate text-xs font-semibold text-foreground leading-tight'>{user?.login}</span>
							<span className='truncate text-[10px] text-muted-foreground mt-0.5'>{user?.email}</span>
						</div>
					)}
				</div>
			</div>
		</motion.aside>
	)
}
