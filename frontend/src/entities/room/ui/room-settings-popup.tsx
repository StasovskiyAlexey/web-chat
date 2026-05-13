import { Separator } from '@/shared/ui/separator'
import { usePopup } from '@/app/providers/PopupProvider'
import type { TRoom } from '@/entities/room/model/types'
import { InviteToRoomBtn } from '@/features/invite-to-room'
import DeleteRoomBtn from '@/features/delete-room/ui/delete-room-btn'
import { useAuth } from '@/app/providers/AuthProvider'

export default function RoomSettings() {
	const { popups } = usePopup()
	const { user } = useAuth()
	const room: TRoom = popups.roomSettings.props

	const isOwnerRoom = room?.members.find((el) => el.user_id == user?.id)?.role === 'owner'

	return (
		<div className='flex w-full max-w-4xl rounded-xl bg-white'>
			{/* Бокове меню (Sidebar) */}
			<aside className='flex flex-col gap-4 w-full'>
				<h2 className='text-md font-bold text-gray-800'>Настройки комнаты</h2>
				<div className='flex items-center gap-2 bg-gray-100 rounded-sm p-2'>
					<p className='text-sm'>Код для приглашения:</p>
					<span className='text-red-500 uppercase text-xs'>{room?.room_code}</span>
				</div>
				<div className='flex gap-2'>
					<p className='text-sm'>ID:</p>
					<span className='text-red-500 uppercase text-xs'>{room?.id}</span>
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
