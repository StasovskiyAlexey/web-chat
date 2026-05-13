import { Button } from '@/shared/ui/button'
import useDeleteRoom from '../model/use-delete-room'
import type { TRoom } from '@/entities/room/model/types'
import { Trash } from 'lucide-react'

export default function DeleteRoomBtn({ room }: { room: TRoom }) {
	const { mutate } = useDeleteRoom()
	return (
		<Button
			className='w-full'
			variant='outline'
			onClick={() => mutate(room?.id as string)}>
			<Trash />
			Удалить комнату
		</Button>
	)
}
