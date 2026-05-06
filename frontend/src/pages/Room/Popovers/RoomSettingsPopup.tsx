import { Button } from '@/components/shared/ui/button'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/shared/ui/popover'
import { Separator } from '@/components/shared/ui/separator'
import { usePopup } from '@/providers/PopupProvider'
import { UserPlus } from 'lucide-react'
import InviteUserToRoom from './InviteUserToRoom'
import type { TRoom } from '@/types/chat'

export default function RoomSettings() {
	const { switcher, popups } = usePopup()
	const room: TRoom = popups.roomSettings.props
	console.log(room)
	return (
		<div className='flex w-full max-w-4xl rounded-xl bg-white'>
			{/* Бокове меню (Sidebar) */}
			<aside className='flex flex-col gap-4 w-full'>
				<h2 className='text-md font-bold text-gray-800'>Настройки комнаты</h2>
				<div className='flex items-center gap-2 bg-gray-100 rounded-sm p-2'>
					<p className='text-sm'>Код для приглашения:</p>
					<span className='text-red-500 uppercase text-xs'>{room?.room_code}</span>
				</div>
				<div className='flex items-center gap-2 bg-gray-100 rounded-sm p-2'>
					<p className='text-sm'>ID комнаты:</p>
					<span className='text-red-500 uppercase text-xs'>{room?.id}</span>
				</div>
				<Separator />
				<nav className='space-y-1 w-full'>
					<Popover
						open={popups.inviteUserToRoom.isOpen}
						onOpenChange={(open) => switcher('inviteUserToRoom', open)}>
						<PopoverTrigger asChild>
							<Button
								onClick={() => switcher('inviteUserToRoom', true)}
								className='w-full'
								variant='outline'>
								<UserPlus /> Добавить пользователя
							</Button>
						</PopoverTrigger>

						<PopoverContent>
							<InviteUserToRoom />
						</PopoverContent>
					</Popover>
				</nav>
			</aside>
		</div>
	)
}
