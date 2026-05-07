import { useState } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/shared/ui/tabs'
import { Search } from 'lucide-react'
import { Input } from '@/components/shared/ui/input'
import { Button } from '@/components/shared/ui/button'
import { RadioGroup, RadioGroupItem } from '@/components/shared/ui/radio-group'
import { Label } from '@/components/shared/ui/label'
import { useAuth } from '@/providers/AuthProvider'
import { usePopup } from '@/providers/PopupProvider'
import { useChatMutations } from '@/hooks/queries/useChat'

export const AddRoomPopup = () => {
	const { switcher } = usePopup()
	const { user } = useAuth()
	const { addRoom } = useChatMutations()

	const [room, setRoom] = useState({
		name: '',
		type: 'direct',
	})

	async function handleCreateRoom() {
		addRoom({
			user_id: user?.id,
			role: 'owner',
			name: room.name,
			type: room.type,
		})
		switcher('addRoom', false)
	}

	return (
		<>
			<div className='space-y-2 mb-4'>
				<h4 className='font-medium leading-none'>Кімнати</h4>
				<p className='text-sm text-muted-foreground'>Знайдіть існуючу кімнату або створіть власну.</p>
			</div>

			<Tabs
				defaultValue='search'
				className='w-full'>
				<TabsList className='grid w-full grid-cols-2'>
					<TabsTrigger
						disabled
						value='search'>
						Пошук
					</TabsTrigger>
					<TabsTrigger value='create'>Створення</TabsTrigger>
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
					<Button className='w-full'>Знайти</Button>
				</TabsContent>

				<TabsContent
					value='create'
					className='space-y-4 pt-4'>
					<Input
						onChange={(e) => setRoom((prev) => ({ ...prev, name: e.target.value }))}
						placeholder='Назва нової кімнати'
					/>
					<RadioGroup
						onValueChange={(e) => setRoom((prev) => ({ ...prev, type: e }))}
						defaultValue={room.type}>
						<div className='flex items-center gap-3'>
							<RadioGroupItem
								value='direct'
								id='pop-direct'
							/>
							<Label htmlFor='pop-direct'>Директ</Label>
						</div>
						<div className='flex items-center gap-3'>
							<RadioGroupItem
								value='group'
								id='pop-group'
							/>
							<Label htmlFor='pop-group'>Група</Label>
						</div>
					</RadioGroup>
					<Button
						onClick={handleCreateRoom}
						disabled={!room.name}
						className='w-full'>
						Створити кімнату
					</Button>
				</TabsContent>
			</Tabs>
		</>
	)
}
