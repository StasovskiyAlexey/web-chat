import { usePopup } from '@/app/providers/popup-provider'
import { Popover, PopoverContent, PopoverTrigger } from '@/shared/ui/popover'
import { Plus } from 'lucide-react'
import { AddRoomPopup } from '@/widgets/add-room-popup/ui/add-room-popup'
import { Button } from '@/shared/ui/button'

export default function CreateRoomBtn({ message = 'Создать или найти' }: { message?: string }) {
	const { switcher, popups } = usePopup()

	return (
		<Popover
			onOpenChange={(open) => switcher('addRoom', open)}
			open={popups.addRoom.isOpen}>
			<PopoverTrigger asChild>
				<Button
					onClick={() => switcher('addRoom', true)}
					className='gap-2'>
					<Plus className='w-4 h-4' />
					{message}
				</Button>
			</PopoverTrigger>

			<PopoverContent className='w-80'>
				<AddRoomPopup />
			</PopoverContent>
		</Popover>
	)
}
