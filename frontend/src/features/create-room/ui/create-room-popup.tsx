import { useState } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/ui/tabs'
import { Search } from 'lucide-react'
import { Input } from '@/shared/ui/input'
import { Button } from '@/shared/ui/button'
import { useAuth } from '@/app/providers/AuthProvider'
import { usePopup } from '@/app/providers/PopupProvider'
import { useCreateRoom } from '../model/use-create-room'

export const CreateRoomPopup = () => {
	const { switcher } = usePopup()
	const { user } = useAuth()
	const { mutate } = useCreateRoom()

	const [room, setRoom] = useState({
		name: '',
		type: 'direct',
	})

	async function handleCreateRoom() {
		mutate({
			userId: user?.id as string,
			role: 'owner',
			name: room.name,
			type: 'direct',
		})
		switcher('addRoom', false)
	}

	return (
		<>
			<div className='space-y-2 mb-4'>
				<h4 className='font-medium leading-none'>Поиск или создание комнаты</h4>
				<p className='text-sm text-muted-foreground'>Найдите существующую комнату или создайте свою</p>
			</div>

			<Tabs
				defaultValue='search'
				className='w-full'>
				<TabsList className='grid w-full grid-cols-2'>
					<TabsTrigger
						disabled
						value='search'>
						Поиск
					</TabsTrigger>
					<TabsTrigger value='create'>Создание</TabsTrigger>
				</TabsList>

				<TabsContent
					value='search'
					className='space-y-4 pt-4'>
					<div className='relative'>
						<Search className='absolute left-2 top-2.5 h-4 w-4 text-muted-foreground' />
						<Input
							placeholder='Введіть назву...'
							className='pl-8'
						/>
					</div>
					<Button className='w-full'>Найти</Button>
				</TabsContent>

				<TabsContent
					value='create'
					className='space-y-4 pt-4'>
					<Input
						onChange={(e) => setRoom((prev) => ({ ...prev, name: e.target.value }))}
						placeholder='Название новой комнаты'
					/>
					<Button
						onClick={handleCreateRoom}
						disabled={!room.name}
						className='w-full'>
						Создать комнату
					</Button>
				</TabsContent>
			</Tabs>
		</>
	)
}
