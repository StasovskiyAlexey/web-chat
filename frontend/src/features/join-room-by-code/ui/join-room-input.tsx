import { Input } from '@/shared/ui/input'
import { Hash } from 'lucide-react'
import { Button } from '@/shared/ui/button'
import useJoinToRoom from '../model/use-join-to-room'
import type { TNotificationCreate } from '@/entities/notification/model/types'
import { useAuth } from '@/app/providers/AuthProvider'

export default function JoinRoomInput({
	setCode,
	code,
	notificationData,
}: {
	setCode: (code: string) => void
	code: string
	notificationData: TNotificationCreate
}) {
	const { mutate } = useJoinToRoom()
	const { user } = useAuth()

	function handleJoinToRoom() {
		mutate({ code, inviterId: user?.id as string, notificationData })
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
