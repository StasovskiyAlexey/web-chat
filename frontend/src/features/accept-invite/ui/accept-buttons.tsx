import { Check, X } from 'lucide-react'
import useAcceptRoomInvite from '../model/queries'
import { useAuth } from '@/app/providers/auth-provider'
import type { TNotification } from '@/entities/notification/model/types'

export default function AcceptButtons({ notification }: { notification: TNotification }) {
	const { mutate } = useAcceptRoomInvite()
	const { user } = useAuth()

	return (
		<div className='flex gap-2 ml-11'>
			<button
				onClick={() =>
					mutate({
						userId: user?.id as string,
						notificationId: notification.id,
						inviteId: notification.invite.id,
						status: 'accepted',
					})
				}
				className='flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-[11px] font-semibold rounded-md shadow-sm transition-all active:scale-95'>
				<Check size={14} />
				Принять
			</button>
			<button
				onClick={() =>
					mutate({
						userId: user?.id as string,
						notificationId: notification.id,
						inviteId: notification.invite.id,
						status: 'canceled',
					})
				}
				className='flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-slate-50 text-slate-600 text-[11px] font-semibold rounded-md border border-slate-200 transition-all active:scale-95'>
				<X size={14} />
				Отклонить
			</button>
		</div>
	)
}
