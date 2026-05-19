import { useState } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/ui/tabs'
import { JoinRoomInput } from '@/features/invite-to-room'
import { CreateRoomInput } from '@/features/create-room'

export const AddRoomPopup = () => {
	const [data, setData] = useState({
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
						type={data.type}
						name={data.name}
						setRoom={(name) => setData((prev) => ({ ...prev, name }))}
					/>
				</TabsContent>

				<TabsContent
					value='search'
					className='space-y-4 pt-4'>
					<JoinRoomInput
						setCode={(code) => setData((prev) => ({ ...prev, code: code }))}
						roomCode={data.code}
						title='Запрос на добавление в комнату'
					/>
				</TabsContent>
			</Tabs>
		</>
	)
}
