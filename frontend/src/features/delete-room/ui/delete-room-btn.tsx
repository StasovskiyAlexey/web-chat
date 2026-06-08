import { Button } from '@/shared/ui/button'
import useDeleteRoom from '../model/queries'
import type { TRoom } from '@/entities/room/model/types'
import { Trash } from 'lucide-react'

export default function DeleteRoomBtn({ room, onSuccess }: { room: TRoom; onSuccess?: () => void }) {
	const { mutate } = useDeleteRoom()
	return (
		<Button
			className='w-full'
			variant='outline'
			onClick={() => {
				mutate(room?.id as string)
				onSuccess
			}}>
			<Trash />
			Удалить комнату
		</Button>
	)
}
