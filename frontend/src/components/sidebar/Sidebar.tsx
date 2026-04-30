import { useState } from 'react'
import { useAuth } from '@/providers/AuthProvider'
import { LogOut, Settings, ChevronLeft, House, MessageSquare } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/shared/ui/avatar'
import { Separator } from '@/components/shared/ui/separator'
import { motion, AnimatePresence } from 'framer-motion' // исправлено с motion/react
import { TooltipProvider } from '../shared/ui/tooltip'
import { NavItem } from './NavItem'

export default function Sidebar() {
	const { logout, user } = useAuth()
	const [isOpen, setIsOpen] = useState<boolean>(false)

	if (!user) return null

	return (
		<TooltipProvider>
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

				<div className='mb-6 flex items-center px-2 py-2'>
					<div className='flex size-8 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground'>
						<MessageSquare className='size-5' />
					</div>
					<AnimatePresence>
						{isOpen && (
							<motion.span
								initial={{ opacity: 0, x: -10 }}
								animate={{ opacity: 1, x: 0 }}
								exit={{ opacity: 0, x: -10 }}
								className='ml-3 truncate font-bold tracking-tight text-foreground'>
								Web-Chat
							</motion.span>
						)}
					</AnimatePresence>
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
							<div className='flex flex-col min-w-0'>
								<span className='truncate text-xs font-semibold text-foreground'>{user?.login}</span>
								<span className='truncate text-[10px] text-muted-foreground'>{user?.email}</span>
							</div>
						)}
					</div>
				</div>
			</motion.aside>
		</TooltipProvider>
	)
}
