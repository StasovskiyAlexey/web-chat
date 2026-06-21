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

	function handleInviteToRoom(e: React.FormEvent<HTMLFormElement>) {
		e.preventDefault()
		mutate({ userCode: user?.user_code as string, roomCode, title })
		setCode('')
	}

	return (
		<>
			<form
				className='flex relative flex-col gap-2'
				onSubmit={(e) => handleInviteToRoom(e)}>
				<Hash className='absolute left-2 top-2.5 h-4 w-4 text-muted-foreground' />
				<Input
					value={roomCode}
					onChange={(e) => setCode(e.target.value)}
					placeholder='Введите код комнаты'
					className='pl-8'
				/>

				<Button
					disabled={!roomCode}
					type='submit'
					className='w-full'>
					Отправить приглашение в комнату
				</Button>
			</form>
		</>
	)
}
