import { Button } from '@/shared/ui/button'
import { Popover, PopoverContent, PopoverTrigger } from '@/shared/ui/popover'
import { Separator } from '@/shared/ui/separator'
import { usePopup } from '@/app/providers/PopupProvider'
import { UserPlus } from 'lucide-react'
import InviteUserToRoom from './InviteUserToRoom'
import type { TRoom } from '@/entities/room/model/types'

export default function RoomSettings() {
	const { switcher, popups } = usePopup()
	const room: TRoom = popups.roomSettings.props

	return (
		<div className='flex w-full max-w-4xl rounded-xl bg-white'>
			{/* Бокове меню (Sidebar) */}
			<aside className='flex flex-col gap-4 w-full'>
				<h2 className='text-md font-bold text-gray-800'>Настройки комнаты</h2>
				<div className='flex items-center gap-2 bg-gray-100 rounded-sm p-2'>
					<p className='text-sm'>Код для приглашения:</p>
					<span className='text-red-500 uppercase text-xs'>{room?.room_code}</span>
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
								<UserPlus /> Добавить участника
							</Button>
						</PopoverTrigger>

						<PopoverContent className='w-80'>
							<InviteUserToRoom room={room} />
						</PopoverContent>
					</Popover>
				</nav>
			</aside>
		</div>
	)
}
