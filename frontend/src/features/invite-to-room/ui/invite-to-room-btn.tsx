import { usePopup } from '@/app/providers/PopupProvider'
import type { TRoom } from '@/entities/room/model/types'
import { Button } from '@/shared/ui/button'
import { Popover, PopoverContent, PopoverTrigger } from '@/shared/ui/popover'
import { UserPlus } from 'lucide-react'
import InviteUserToRoom from './invite-to-room-popup'

export default function InviteToRoomBtn({ room }: { room: TRoom }) {
	const { switcher, popups } = usePopup()
	return (
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
	)
}
