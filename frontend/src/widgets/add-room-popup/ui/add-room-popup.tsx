import { useState } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/ui/tabs'
import { useAuth } from '@/app/providers/AuthProvider'
import { JoinRoomInput } from '@/features/join-room-by-code'
import { CreateRoomInput } from '@/features/create-room'

export const AddRoomPopup = () => {
	const { user } = useAuth()

	const [room, setRoom] = useState({
		name: '',
		code: '',
		type: 'direct',
	})

	return (
		<>
			<div className='space-y-2 mb-4'>
				<h4 className='font-medium leading-none'>Поиск или создание комнаты</h4>
				<p className='text-sm text-muted-foreground'>Найдите существующую комнату или создайте свою</p>
			</div>

			<Tabs
				defaultValue='create'
				className='w-full'>
				<TabsList className='grid w-full grid-cols-2'>
					<TabsTrigger value='create'>Создание</TabsTrigger>
					<TabsTrigger value='search'>Поиск</TabsTrigger>
				</TabsList>

				<TabsContent
					value='create'
					className='space-y-4 pt-4'>
					<CreateRoomInput
						type={room.type}
						name={room.name}
						setRoom={(name) => setRoom((prev) => ({ ...prev, name }))}
					/>
				</TabsContent>

				<TabsContent
					value='search'
					className='space-y-4 pt-4'>
					<JoinRoomInput
						setCode={(code) => setRoom((prev) => ({ ...prev, code: code }))}
						code={room.code}
						notificationData={{ title: 'Запрос на приглашение в комнату', type: 'invite' }}
					/>
				</TabsContent>
			</Tabs>
		</>
	)
}
