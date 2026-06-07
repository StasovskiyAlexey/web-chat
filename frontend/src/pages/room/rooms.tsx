import { Users, Hash } from 'lucide-react'
import { Link } from '@tanstack/react-router'
import Loader from '@/shared/loader'
import { useRooms } from '@/entities/room/api/queries'
import { CreateRoomBtn } from '@/features/create-room'

export const Rooms = () => {
	const { data: rooms, isLoading } = useRooms()

	if (isLoading) {
		return <Loader message='Загрузка комнат' />
	}

	return (
		<>
			<div className='p-8 mx-auto'>
				<div className='flex justify-between items-center mb-8'>
					<div>
						<h1 className='text-3xl font-bold tracking-tight'>Ваши комнаты</h1>
						<p className='text-muted-foreground'>Управляйте своими чатами и обсуждениями.</p>
					</div>

					<CreateRoomBtn />
				</div>

				<div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-6'>
					{rooms?.map((room) => (
						<Link
							to={`/rooms/${room?.id}`}
							key={room?.id}
							className='group flex items-center gap-3 p-3 rounded-lg bg-accent/50 transition-colors cursor-pointer border border-border active:bg-accent'>
							{/* Аватар или Иконка типа */}
							<div
								className={`shrink-0 w-12 h-12 rounded-full flex items-center justify-center ${
									room?.type === 'group' ? 'bg-primary/10 text-primary' : 'bg-blue-100 text-blue-600'
								}`}>
								{room?.type === 'group' ? <Hash className='w-6 h-6' /> : <Users className='w-6 h-6' />}
							</div>

							{/* Контентная часть */}
							<div className='flex-1 min-w-0'>
								<div className='flex justify-between items-baseline mb-1'>
									<h3 className='font-semibold text-sm truncate leading-none'>{room?.name}</h3>
									<span className='text-[10px] text-muted-foreground uppercase tracking-wider font-medium'>
										{room?.type === 'group' ? 'Группа' : 'Личное'}
									</span>
								</div>

								<div className='flex items-center gap-2'>
									<div className='flex items-center text-xs text-muted-foreground'>
										<Users className='w-3 h-3 mr-1' />
										{room?.members.length}
									</div>
									{/* Здесь можно добавить последнее сообщение, если оно есть в сторе */}
									<span className='text-xs text-muted-foreground truncate italic'>Нажмите, чтобы войти</span>
								</div>
							</div>
						</Link>
					))}
				</div>
			</div>
		</>
	)
}

// делать доступ в комнату по коду
