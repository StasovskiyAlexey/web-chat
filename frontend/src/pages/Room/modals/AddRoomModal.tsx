import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/shared/ui/tabs'
import { Search } from 'lucide-react'
import { Input } from '@/components/shared/ui/input'
import { useModal } from '@/providers/ModalProvider'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/shared/ui/dialog'
import { Button } from '@/components/shared/ui/button'
import { observer } from 'mobx-react-lite'
import { useInjection } from '@/providers/DIProvider'
import type { TChatStore } from '@/store/chat.store'
import { TTypes } from '@/di/types'
import { RadioGroup, RadioGroupItem } from '@/components/shared/ui/radio-group'
import { Label } from '@/components/shared/ui/label'
import { useAuth } from '@/providers/AuthProvider'

export const AddRoomModal = observer(() => {
	const { modals, switcher } = useModal()
	const { user } = useAuth()
	const chatStore = useInjection<TChatStore>(TTypes.ChatStore)

	const [room, setRoom] = useState({
		name: '',
		type: 'direct',
	})

	async function handleCreateRoom() {
		await chatStore.createRoom({ user_id: user?.id, role: 'owner', name: room.name, type: room.type })
		switcher('addRoomModal', false)
	}

	return (
		<Dialog
			open={modals.addRoomModal.isOpen}
			onOpenChange={() => switcher('addRoomModal', !modals.addRoomModal.isOpen)}>
			<DialogContent className='sm:max-w-[425px]'>
				<DialogHeader>
					<DialogTitle>Комнаты</DialogTitle>
					<DialogDescription>Найдите существующую комнату или создайте свою собственную.</DialogDescription>
				</DialogHeader>

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
						className='space-y-4 py-4'>
						<div className='relative'>
							<Search className='absolute left-2 top-2.5 h-4 w-4 text-muted-foreground' />
							<Input
								placeholder='Введите название...'
								className='pl-8'
							/>
						</div>
						<Button className='w-full'>Найти</Button>
					</TabsContent>

					<TabsContent
						value='create'
						className='space-y-4 py-4'>
						<Input
							onChange={(e) => setRoom((prev) => ({ ...prev, name: e.target.value }))}
							placeholder='Название новой комнаты'
						/>
						<RadioGroup
							onValueChange={(e) => setRoom((prev) => ({ ...prev, type: e }))}
							defaultValue={room.type}>
							<div className='flex items-center gap-3'>
								<RadioGroupItem
									value='direct'
									id='direct'
								/>
								<Label htmlFor='direct'>Директ</Label>
							</div>
							<div className='flex items-center gap-3'>
								<RadioGroupItem
									value='group'
									id='group'
								/>
								<Label htmlFor='group'>Группа</Label>
							</div>
						</RadioGroup>
						<Button
							onClick={() => handleCreateRoom()}
							disabled={!room.name}
							className='w-full'
							variant='default'>
							Создать комнату
						</Button>
					</TabsContent>
				</Tabs>
			</DialogContent>
		</Dialog>
	)
})
