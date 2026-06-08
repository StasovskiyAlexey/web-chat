import { useAuth } from '@/app/providers/auth-provider'
import { MessageSquare, LogOut, Settings, Menu, Bell } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from '@/shared/ui/avatar'
import { Button } from '@/shared/ui/button'
import { Badge } from '@/shared/ui/badge'
import { useNotifications } from '@/entities/notification/api/queries'
import { Link } from '@tanstack/react-router'
import { usePopup } from '@/app/providers/popup-provider'

import { Drawer, DrawerContent, DrawerTrigger, DrawerClose, DrawerHeader, DrawerTitle } from '@/shared/ui/drawer'

export default function MobileMenu() {
	const { user, logout } = useAuth()
	const { switcher } = usePopup()

	const { data: notifications } = useNotifications(user?.id as string)

	const hasUnreadNotifications = notifications?.some((el) => !el.is_read)

	if (!user) return null

	return (
		<div className='lg:hidden bg-background border-b border-border/40 px-4 flex justify-between items-center min-h-16 z-50 w-full'>
			{/* Логотип приложения в мобильной шапке */}
			<div className='flex items-center gap-2'>
				<img
					className='size-7 object-contain'
					src='https://static.vecteezy.com/system/resources/thumbnails/028/754/648/small/3d-purple-online-chatting-bubble-icon-for-ui-ux-web-mobile-apps-social-media-ads-designs-png.png'
					alt='Logo'
				/>
				<span className='uppercase font-black text-sm tracking-tight text-foreground'>Web-chat</span>
			</div>

			<Drawer>
				{/* Кнопка открытия (Бургер) */}
				<DrawerTrigger asChild>
					<Button
						variant='ghost'
						size='icon'
						className='relative size-9 text-muted-foreground hover:text-foreground hover:bg-accent/50 rounded-xl'>
						<Menu className='size-5' />
						{hasUnreadNotifications && (
							<span className='absolute top-2.5 right-2.5 size-2 bg-primary rounded-full ring-2 ring-background' />
						)}
					</Button>
				</DrawerTrigger>

				{/* Контент нижней панели */}
				<DrawerContent className='max-h-[85vh] bg-card border-t border-border/40 px-4 pb-6'>
					{/* Маленький "нотч" (индикатор перетаскивания) Shadcn делает сам, но мы оформим заголовок для доступности (Accessibility) */}
					<DrawerHeader className='text-left px-2 pt-4 pb-2 border-b border-border/40 mb-2'>
						<DrawerTitle className='uppercase font-black text-sm tracking-tight text-foreground flex items-center gap-2'>
							<img
								className='size-6 object-contain'
								src='https://static.vecteezy.com/system/resources/thumbnails/028/754/648/small/3d-purple-online-chatting-bubble-icon-for-ui-ux-web-mobile-apps-social-media-ads-designs-png.png'
								alt='Logo'
							/>
							Навигация
						</DrawerTitle>
					</DrawerHeader>

					{/* НАВИГАЦИЯ: Основные ссылки */}
					<nav className='space-y-1 py-2'>
						<DrawerClose asChild>
							<Link to='/'>
								<Button
									variant='ghost'
									className='w-full justify-start gap-3 h-11 px-3 text-sm font-medium rounded-xl hover:bg-accent/50'>
									<MessageSquare className='size-4 text-muted-foreground' />
									<span>Комнаты</span>
								</Button>
							</Link>
						</DrawerClose>

						<Button
							onClick={() => switcher('userNotifications', true)}
							variant='ghost'
							className='w-full justify-between h-11 px-3 text-sm font-medium rounded-xl hover:bg-accent/50'>
							<div className='flex items-center gap-3'>
								<Bell className='size-4 text-muted-foreground' />
								<span>Уведомления</span>
							</div>
							{hasUnreadNotifications && (
								<Badge
									variant='default'
									className='h-5 px-1.5 text-[10px] font-bold rounded-full'>
									NEW
								</Badge>
							)}
						</Button>

						{/* Настройки */}
						<DrawerClose asChild>
							<Link to='/settings'>
								<Button
									variant='ghost'
									className='w-full justify-start gap-3 text-muted-foreground hover:text-foreground h-11 px-3 text-sm font-medium rounded-xl hover:bg-accent/50'>
									<Settings className='size-4' />
									<span>Настройки</span>
								</Button>
							</Link>
						</DrawerClose>
					</nav>

					{/* ПОДВАЛ: Профиль и Выход */}
					<div className='mt-auto pt-4 space-y-4 border-t border-border/40'>
						{/* КОМПАКТНЫЙ ПРОФИЛЬ ПОЛЬЗОВАТЕЛЯ */}
						<div className='flex items-center gap-3 rounded-xl p-3 bg-muted/40 border border-border/20 shadow-sm'>
							<Avatar className='size-10 border border-border/60 shrink-0'>
								<AvatarImage
									src={user.picture as string}
									alt={user?.login}
								/>
								<AvatarFallback className='bg-primary/5 text-xs font-bold text-primary'>
									{user?.login?.slice(0, 2).toUpperCase()}
								</AvatarFallback>
							</Avatar>
							<div className='flex flex-col min-w-0 flex-1 text-left'>
								<span className='truncate text-sm font-semibold text-foreground leading-tight'>{user?.login}</span>
								<span className='truncate text-xs text-muted-foreground mt-0.5'>{user?.email}</span>
							</div>
						</div>

						{/* Кнопка выхода */}
						<DrawerClose asChild>
							<Button
								onClick={logout}
								variant='ghost'
								className='w-full justify-start gap-3 text-destructive hover:text-destructive hover:bg-destructive/10 h-11 px-3 text-sm font-medium rounded-xl'>
								<LogOut className='size-4' />
								<span>Выйти из аккаунта</span>
							</Button>
						</DrawerClose>
					</div>
				</DrawerContent>
			</Drawer>
		</div>
	)
}
