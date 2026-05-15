import { Button } from '@/shared/ui/button'
import { UserMinus } from 'lucide-react'
import { useDeleteMember } from '../model/use-delete-member'

export default function MemberDeleteBtn(data: { roomId: string; userId: string; memberId: string }) {
	const { mutate } = useDeleteMember()
	return (
		<Button
			onClick={() => mutate({ roomId: data.roomId, userId: data.userId, memberId: data.memberId })}
			variant='ghost'
			size='sm'
			className='w-full justify-start gap-2 text-red-500 hover:text-red-600 hover:bg-red-500/10 h-9'>
			<UserMinus className='size-4' />
			Удалить из комнаты
		</Button>
	)
}
