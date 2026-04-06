import { useAuth } from '@/providers/AuthProvider'
import { MessageSquare, LogOut, Settings, ChevronRight, House } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { motion } from 'motion/react'
import { Tooltip, TooltipContent, TooltipTrigger } from './ui/tooltip'
import { Link } from '@tanstack/react-router'

export default function Sidebar() {
	const { logout, user } = useAuth()
	const [isOpen, setIsOpen] = useState<boolean>(true)
	const sidebarRef = useRef<null | HTMLElement>(null)

	if (!user) return null

	return (
		<motion.aside
			ref={sidebarRef}
			initial={false}
			animate={{
				width: isOpen ? 260 : 70,
			}}
			transition={{ type: 'spring', stiffness: 400, damping: 30 }}
			className={`flex transition-opacity duration-300 h-screen relative flex-col border-r bg-card p-4 text-card-foreground`}>
			{isOpen ? (
				<Link to='/'>
					<Button
						variant='ghost'
						className={`w-full justify-start hover:bg-accent group flex`}>
						<House className='size-6 text-muted-foreground group-hover:text-primary transition-colors' />
						Главная
					</Button>
				</Link>
			) : (
				<Tooltip>
					<TooltipTrigger asChild>
						<Link to='/'>
							<Button
								variant='ghost'
								className={`w-full hover:bg-accent group flex ${isOpen ? 'justify-start' : 'justify-center'}`}>
								<MessageSquare className='size-6 text-muted-foreground group-hover:text-primary transition-colors' />
								{isOpen && 'Чаты'}
							</Button>
						</Link>
					</TooltipTrigger>
					<TooltipContent>
						<p>Главная</p>
					</TooltipContent>
				</Tooltip>
			)}

			<button
				onClick={() => setIsOpen((state) => !state)}
				className='absolute py-4 right-0 translate-y-1/2 top-1/2 rounded-l-none border border-black'>
				<ChevronRight
					className={`${isOpen ? 'rotate-180' : 'rotate-0'}`}
					size={20}
				/>
			</button>

			{/* User Section */}
			<div className='mt-auto space-y-4'>
				<Separator className='bg-border/50' />

				<div className='flex items-center gap-3 py-1'>
					<Avatar className='size-10 border-2 border-primary/10'>
						<AvatarImage
							src={user.picture as string}
							alt={user?.login}
						/>
						<AvatarFallback className='bg-primary/5 text-primary'>
							{user?.login?.slice(0, 2).toUpperCase()}
						</AvatarFallback>
					</Avatar>
					{isOpen && (
						<div className='flex flex-col overflow-hidden'>
							<span className='truncate text-sm font-semibold leading-none'>{user?.login}</span>
							<span className='truncate text-[11px] text-muted-foreground mt-1'>{user?.email}</span>
						</div>
					)}
				</div>

				<div className='flex flex-col gap-4'>
					{isOpen ? (
						<Link to='/settings'>
							<Button
								variant='ghost'
								size='sm'
								className={`w-full justify-start gap-3 text-muted-foreground hover:text-foreground`}>
								<Settings className='size-6' />
								Настройки
							</Button>
						</Link>
					) : (
						<Tooltip>
							<TooltipTrigger asChild>
								<Link to='/settings'>
									<Button
										variant='ghost'
										size='sm'
										className={`w-full flex gap-3 text-muted-foreground hover:text-foreground ${isOpen ? 'justify-start' : 'justify-center'}`}>
										<Settings className='size-6' />
									</Button>
								</Link>
							</TooltipTrigger>
							<TooltipContent>
								<p>Настройки</p>
							</TooltipContent>
						</Tooltip>
					)}

					{isOpen ? (
						<Button
							onClick={logout}
							variant='ghost'
							size='sm'
							className={`w-full flex ${isOpen ? 'justify-start' : 'justify-center'} text-red-500 hover:text-red-600 hover:bg-red-50/10`}>
							<LogOut className='size-6' />
							{isOpen && 'Выйти из аккаунта'}
						</Button>
					) : (
						<Tooltip>
							<TooltipTrigger asChild>
								<Button
									onClick={logout}
									variant='ghost'
									size='sm'
									className={`w-full flex ${isOpen ? 'justify-start' : 'justify-center'} text-red-500 hover:text-red-600 hover:bg-red-50/10`}>
									<LogOut className='size-6' />
									{isOpen && 'Выйти из аккаунта'}
								</Button>
							</TooltipTrigger>
							<TooltipContent>
								<p>Выйти из аккаунта</p>
							</TooltipContent>
						</Tooltip>
					)}
				</div>
			</div>
		</motion.aside>
	)
}
