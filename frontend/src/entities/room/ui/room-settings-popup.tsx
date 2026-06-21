import { Separator } from '@/shared/ui/separator'
import { usePopup } from '@/app/providers/popup-provider'
import type { TRoom } from '@/entities/room/model/types'
import { InviteToRoomBtn } from '@/features/invite-from-room'
import DeleteRoomBtn from '@/features/delete-room/ui/delete-room-btn'
import { useAuth } from '@/app/providers/auth-provider'
import useCopy from '@/shared/hooks/use-copy'
import { Copy } from 'lucide-react'

export default function RoomSettings() {
	const { popups } = usePopup()
	const { user } = useAuth()
	const { handleCopyText } = useCopy()

	const room: TRoom = popups.roomSettings.props

	if (!room) {
		return
	}

	const isOwnerRoom = room?.members.find((el) => el.user_id == user?.id)?.role === 'owner'

	return (
		<div className='flex w-full max-w-4xl rounded-xl bg-white'>
			{/* Бокове меню (Sidebar) */}
			<aside className='flex flex-col gap-4 w-full'>
				<h2 className='text-md text-gray-800'>Настройки комнаты</h2>
				<div className='flex items-center justify-between gap-2 bg-gray-100 rounded-sm p-2'>
					<p className='text-sm'>Код для приглашения:</p>
					<button
						onClick={(e) => {
							e.preventDefault()
							handleCopyText(room?.room_code as string)
						}}
						className='p-1.5 hover:bg-muted rounded-md transition-colors'
						title='Скопировать код'>
						<Copy className='w-3.5 h-3.5 text-muted-foreground' />
					</button>
				</div>

				{isOwnerRoom && (
					<>
						<Separator />
						<nav className='space-y-1 w-full'>
							<DeleteRoomBtn room={room} /> <InviteToRoomBtn room={room} />
						</nav>
					</>
				)}
			</aside>
		</div>
	)
}
