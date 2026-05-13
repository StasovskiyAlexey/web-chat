import { useState } from 'react'
import type { TRoom } from '@/entities/room/model/types'
import useInviteToRoom from '../model/use-invite-to-room'
import { useAuth } from '@/app/providers/AuthProvider'
import { Button } from '@/shared/ui/button'

export default function InviteUserToRoom({ room }: { room: TRoom }) {
	const [code, setCode] = useState('')

	const { mutate } = useInviteToRoom()
	const { user } = useAuth()

	return (
		<div className='w-full p-1'>
			<div className='flex flex-col gap-4'>
				<div>
					<h3 className='text-sm font-semibold text-gray-900'>Пригласить участника</h3>
					<p className='text-xs text-gray-500 mt-1'>Введите уникальный код участника.</p>
				</div>

				<div className='relative gap-2 flex group'>
					<input
						type='text'
						value={code}
						onChange={(e) => setCode(e.target.value)}
						placeholder='Например l0JCuCB_'
						className='text-sm w-full pl-2 border-gray-200 rounded-md bg-gray-50 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none'
					/>

					<Button
						disabled={!code}
						onClick={() =>
							mutate({
								code: code,
								inviterId: user?.id as string,
								notificationData: { title: 'Приглашение в комнату', type: 'invite' },
								inviteData: { roomId: room?.id as string },
							})
						}
						className='flex items-center text-xs justify-center bg-blue-600 text-white hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors'>
						Добавить
					</Button>
				</div>
			</div>
		</div>
	)
}
