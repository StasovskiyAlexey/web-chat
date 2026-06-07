import { Bell, Check, CheckCheck, UserPlus } from 'lucide-react'
import { ScrollArea } from '@/shared/ui/scroll-area'
import { useAuth } from '@/app/providers/auth-provider'
import { Separator } from '@/shared/ui/separator'
import { AcceptButtons } from '@/features/accept-invite'
import { type TNotification } from '../model/types'
import dayjs from 'dayjs'

export const NotificationPopup = ({ notifications }: { notifications?: TNotification[] }) => {
	const { user } = useAuth()

	if (!user) {
		return null
	}

	return (
		<div className='flex flex-col w-full max-h-[400px] max-w-[380px] bg-white rounded-md'>
			{/* Header */}
			<div className='flex items-center justify-between'>
				<div className='flex items-center gap-2'>
					<h4 className='font-bold text-base text-slate-800'>Уведомления</h4>{' '}
				</div>
			</div>

			<Separator className='opacity-50 my-4' />

			<ScrollArea className='flex-1 overflow-auto'>
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
													ID: {item.invite.id}
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

								{item.type === 'invite' && !item.is_read && <AcceptButtons notification={item} />}

								<div className='absolute bottom-0 left-4 right-4 h-px bg-slate-100 group-last:hidden' />
							</div>
						))}
					</div>
				) : (
					<div className='flex flex-col items-center justify-center py-4 text-slate-400'>
						<div className='p-4 bg-slate-50 rounded-full mb-4'>
							<Bell className='w-8 h-8 opacity-20' />
						</div>
						<p className='text-sm font-medium'>Новых уведомлений нет</p>
						<p className='text-xs opacity-70'>Тут появляется приглашение в комнату</p>
					</div>
				)}
			</ScrollArea>
		</div>
	)
}
