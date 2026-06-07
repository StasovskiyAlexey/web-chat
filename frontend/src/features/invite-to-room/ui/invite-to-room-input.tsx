import { Input } from '@/shared/ui/input'
import { Hash } from 'lucide-react'
import { Button } from '@/shared/ui/button'
import { useAuth } from '@/app/providers/auth-provider'
import useInviteToRoom from '../model/queries'

export default function InviteToRoomInput({
	setCode,
	roomCode,
	title,
}: {
	setCode: (code: string) => void
	roomCode: string
	title: string
}) {
	const { mutate } = useInviteToRoom()
	const { user } = useAuth()

	function handleInviteToRoom() {
		mutate({ userCode: user?.user_code as string, roomCode, title })
		setCode('')
	}

	return (
		<>
			<div className='relative'>
				<Hash className='absolute left-2 top-2.5 h-4 w-4 text-muted-foreground' />
				<Input
					value={roomCode}
					onChange={(e) => setCode(e.target.value)}
					placeholder='Введите код комнаты'
					className='pl-8'
				/>
			</div>
			<Button
				disabled={!roomCode}
				onClick={() => handleInviteToRoom()}
				className='w-full'>
				Отправить приглашение в комнату
			</Button>
		</>
	)
}
