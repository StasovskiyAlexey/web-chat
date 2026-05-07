import type { TNotification } from '@/types/chat'
import dayjs from 'dayjs'
import { Bell, UserPlus } from 'lucide-react'

export const NotificationItem = ({ notification }: { notification: TNotification }) => {
	const isInvite = notification.type === 'invite'

	return (
		<div className='notification-wrapper'>
			<div className='notification-header'>
				{isInvite ? <UserPlus className='text-blue-500' /> : <Bell />}
				<span>{notification.title}</span>
			</div>

			<div className='notification-body'>
				{isInvite && (
					<InviteActions
						invitationId={notification.invitation_id}
						status={notification.status} // якщо прокинув статус в схему
					/>
				)}
			</div>

			<span className='time'>{dayjs(notification.created_at).format('HH:mm DD.MM')}</span>
		</div>
	)
}
