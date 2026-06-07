import { useAuth } from '@/app/providers/auth-provider'
import { useInjection } from '@/app/providers/di-provider'
import { TTypes } from '@/shared/di/types'
import { type TAuthService } from '@/features/auth/api/auth.service'
import { MessageSquare, LogOut, Settings, Menu } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from '@/shared/ui/avatar'
import { Button } from '@/shared/ui/button'
import { Separator } from '@/shared/ui/separator'
import { Sheet, SheetContent, SheetTrigger } from '@/shared/ui/sheet'

export default function MobileMenu() {
	const { user } = useAuth()
	const authService = useInjection<TAuthService>(TTypes.AuthService)

	if (!user) return null

	return (
		<div className='lg:hidden bg-gray-100 lg:px-8 px-4 flex justify-start items-center min-h-16 z-50'>
			<Sheet>
				{/* Кнопка открытия (Бургер) */}
				<SheetTrigger asChild>
					<Button
						variant='outline'
						size='icon'
						className='rounded-full shadow-md'>
						<Menu className='size-5' />
					</Button>
				</SheetTrigger>

				<SheetContent
					side='left'
					className='w-full flex flex-col p-6'>
					<Separator className='my-4' />

					{/* Навигация */}
					<div className='flex-1 space-y-2'>
						<Button
							variant='ghost'
							className='w-full justify-start gap-4 h-12 text-base'>
							<MessageSquare className='size-6 text-muted-foreground' />
							Чаты
						</Button>
					</div>

					{/* User Section */}
					<div className='mt-auto space-y-6'>
						<div className='flex items-center gap-4 px-2'>
							<Avatar className='size-12 border-2 border-primary/10'>
								<AvatarImage
									src={user.picture as string}
									alt={user?.login}
								/>
								<AvatarFallback className='bg-primary/5 text-primary text-lg'>
									{user?.login?.slice(0, 2).toUpperCase()}
								</AvatarFallback>
							</Avatar>
							<div className='flex flex-col overflow-hidden text-left'>
								<span className='truncate text-base font-semibold leading-tight'>{user?.login}</span>
								<span className='truncate text-xs text-muted-foreground'>{user?.email}</span>
							</div>
						</div>

						<div className='flex flex-col gap-2'>
							<Button
								variant='ghost'
								className='w-full justify-start gap-4 text-muted-foreground h-11'>
								<Settings className='size-6' />
								Настройки
							</Button>

							<Button
								onClick={() => authService.logout()}
								variant='ghost'
								className='w-full justify-start gap-4 text-red-500 hover:text-red-600 hover:bg-red-50/10 h-11'>
								<LogOut className='size-6' />
								Выйти из аккаунта
							</Button>
						</div>
					</div>
				</SheetContent>
			</Sheet>
		</div>
	)
}
