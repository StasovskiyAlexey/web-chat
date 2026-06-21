import Loader from '@/shared/loader'
import { useRooms } from '@/entities/room/api/queries'
import { CreateRoomBtn } from '@/features/create-room'
import RoomCard from '@/entities/room/ui/room-card'

export const Rooms = () => {
	const { data: rooms, isLoading } = useRooms()

	if (isLoading) {
		return <Loader message='Загрузка комнат' />
	}

	return (
		<section className='rooms-page'>
			<div className='rooms-container p-4 flex flex-col gap-6'>
				<div className='flex justify-between items-center'>
					<div>
						<h1 className='text-3xl font-bold tracking-tight'>Ваши комнаты</h1>
						<p className='text-muted-foreground'>Управляйте своими чатами и обсуждениями.</p>
					</div>

					<CreateRoomBtn />
				</div>

				<div className='flex flex-wrap gap-6'>
					{!rooms?.length ? (
						<p className='text-gray-600 text-sm'>
							Сейчас доступных комнат нет, создайте или найдите комнату по уникальному коду...
						</p>
					) : (
						rooms?.map((room) => (
							<RoomCard
								key={room?.id}
								room={room}
							/>
						))
					)}
				</div>
			</div>
		</section>
	)
}
