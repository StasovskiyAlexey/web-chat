import { Input } from '@/shared/ui/input'
import { useCreateRoom } from '../model/queries'
import { useAuth } from '@/app/providers/AuthProvider'
import { usePopup } from '@/app/providers/PopupProvider'
import { Button } from '@/shared/ui/button'

export default function CreateRoomInput({
	setRoom,
	name,
	type,
}: {
	setRoom: (name: string) => void
	name: string
	type: string
}) {
	const { switcher } = usePopup()
	const { user } = useAuth()
	const { mutate } = useCreateRoom()

	async function handleCreateRoom() {
		mutate({
			userId: user?.id as string,
			role: 'owner',
			name,
			type,
		})
		switcher('addRoom', false)
	}

	return (
		<>
			<Input
				onChange={(e) => setRoom(e.target.value)}
				placeholder='Название новой комнаты'
			/>
			<Button
				onClick={handleCreateRoom}
				disabled={!name}
				className='w-full'>
				Создать комнату
			</Button>
		</>
	)
}
