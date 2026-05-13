import { Input } from '@/shared/ui/input'
import { Hash } from 'lucide-react'
import { Button } from '@/shared/ui/button'
import useJoinToRoom from '../model/use-join-to-room'
import type { TNotificationCreate } from '@/entities/notification/model/types'

export default function JoinRoomInput({
	setCode,
	code,
	inviterId,
	notificationData,
}: {
	setCode: (code: string) => void
	code: string
	inviterId: string
	notificationData: TNotificationCreate
}) {
	const { mutate } = useJoinToRoom()

	function handleJoinToRoom() {
		mutate({ code, inviterId, notificationData })
		setCode('')
	}

	return (
		<>
			<div className='relative'>
				<Hash className='absolute left-2 top-2.5 h-4 w-4 text-muted-foreground' />
				<Input
					value={code}
					onChange={(e) => setCode(e.target.value)}
					placeholder='Введите код комнаты'
					className='pl-8'
				/>
			</div>
			<Button
				disabled={!code}
				onClick={() => handleJoinToRoom()}
				className='w-full'>
				Отправить приглашение в комнату
			</Button>
		</>
	)
}
