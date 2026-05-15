import { Avatar, AvatarFallback, AvatarImage } from '@/shared/ui/avatar'
import { Separator } from '@/shared/ui/separator'
import type { TMember } from '@/entities/room/model/types'
import { MemberDeleteBtn } from '@/features/delete-member-from-room'

export default function MemberSettingsPopup({
	member,
	roomId,
	userId,
}: {
	member?: TMember
	roomId: string
	userId: string
}) {
	return (
		<div className='flex flex-col gap-4 w-full p-1'>
			<div className='flex items-center gap-4 px-1'>
				<Avatar className='size-12 border'>
					<AvatarImage src={member?.user.picture || ''} />
					<AvatarFallback className='bg-primary/5 text-primary font-bold'>
						{member?.user.login?.slice(0, 2).toUpperCase() || '??'}
					</AvatarFallback>
				</Avatar>
				<div className='flex flex-col min-w-0'>
					<h2 className='text-sm font-semibold text-foreground truncate'>{member?.user.login || 'Пользователь'}</h2>
					<p className='text-xs text-muted-foreground truncate'>{member?.user.email || 'email@example.com'}</p>
				</div>
			</div>

			{member?.role === 'member' && (
				<>
					<Separator className='opacity-50' />

					<div className='flex flex-col gap-3'>
						<MemberDeleteBtn
							userId={userId}
							memberId={member.id}
							roomId={roomId}
						/>
					</div>
				</>
			)}
		</div>
	)
}
