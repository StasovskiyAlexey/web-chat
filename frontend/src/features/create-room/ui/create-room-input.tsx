import { Input } from '@/shared/ui/input'
import { useCreateRoom } from '../model/queries'
import { useAuth } from '@/app/providers/auth-provider'
import { usePopup } from '@/app/providers/popup-provider'
import { Button } from '@/shared/ui/button'
import type React from 'react'

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

	async function handleCreateRoom(e: React.FormEvent<HTMLFormElement>) {
		e.preventDefault()
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
			<form
				className='flex flex-col gap-2'
				onSubmit={(e) => handleCreateRoom(e)}>
				<Input
					onChange={(e) => setRoom(e.target.value)}
					placeholder='Название новой комнаты'
				/>
				<Button
					type='submit'
					disabled={!name}
					className='w-full'>
					Создать комнату
				</Button>
			</form>
		</>
	)
}
