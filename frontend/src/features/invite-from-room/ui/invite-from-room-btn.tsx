import { usePopup } from '@/app/providers/PopupProvider'
import type { TRoom } from '@/entities/room/model/types'
import { Button } from '@/shared/ui/button'
import { Popover, PopoverContent, PopoverTrigger } from '@/shared/ui/popover'
import { UserPlus } from 'lucide-react'
import useInviteFromRoom from '../model/queries'

export default function InviteFromRoomBtn({ room }: { room: TRoom }) {
	const { switcher, popups } = usePopup()

	const [data, setData] = useState({
		userCode: '',
	})

	const { mutate } = useInviteFromRoom()

	function handleInvite() {
		mutate({
			userCode: data.userCode,
			roomCode: room?.room_code as string,
			title: 'Приглашение пользователя в комнату',
		})
		setData((prev) => ({ ...prev, userCode: '' }))
	}

	return (
		<Popover
			open={popups.inviteUserToRoom.isOpen}
			onOpenChange={(open) => switcher('inviteUserToRoom', open)}>
			<PopoverTrigger asChild>
				<Button
					onClick={() => switcher('inviteUserToRoom', true)}
					className='w-full'
					variant='outline'>
					<UserPlus /> Пригласить участника
				</Button>
			</PopoverTrigger>

			<PopoverContent className='w-70'>
				<div className='flex flex-col gap-4'>
					<p className='text-xs text-gray-500 mt-1'>Введите уникальный код участника.</p>

					<div className='relative gap-2 flex group'>
						<input
							type='text'
							value={data.userCode}
							onChange={(e) => setData((prev) => ({ ...prev, userCode: e.target.value }))}
							placeholder='Например l0JCuCB_'
							className='text-sm w-full pl-2 border-gray-200 rounded-md bg-gray-50 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none'
						/>

						<Button
							disabled={!data.userCode}
							onClick={() => handleInvite()}
							className='flex items-center text-xs justify-center bg-blue-600 text-white hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors'>
							Добавить
						</Button>
					</div>
				</div>
			</PopoverContent>
		</Popover>
	)
}
