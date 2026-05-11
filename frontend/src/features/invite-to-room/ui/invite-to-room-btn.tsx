import useInviteToRoom from '../model/use-invite-to-room'
import { useAuth } from '@/app/providers/AuthProvider'
import type { TRoom } from '@/entities/room/model/types'
import { Button } from '@/shared/ui/button'

export default function InviteToRoomBtn({ code, room }: { code: string; room: TRoom }) {
	const { mutate } = useInviteToRoom()
	const { user } = useAuth()
	return (
		<Button
			disabled={!code}
			onClick={() =>
				mutate({
					code: code,
					inviterId: user?.id as string,
					notificationData: { title: 'Приглашение в комнату', type: 'invite' },
					inviteData: { roomId: room?.id as string },
				})
			}
			className='flex items-center text-xs justify-center bg-blue-600 text-white hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors'>
			Добавить
		</Button>
	)
}
