import type { TRoom } from '../model/types'
import { Hash, Users, Copy, Lock, Globe } from 'lucide-react'
import { Link } from '@tanstack/react-router'
import useCopy from '@/shared/hooks/use-copy'

export default function RoomCard({ room }: { room: TRoom }) {
	const isGroup = room?.type === 'group'
	const { handleCopyText } = useCopy()

	return (
		<Link
			to={`/rooms/${room?.id}`}
			className='group relative flex flex-col p-4 rounded-md max-w-[300px] w-full bg-card border'>
			<div className='flex items-start justify-between mb-3'>
				<div
					className={`w-10 h-10 rounded-full flex items-center justify-center ${isGroup ? 'bg-indigo-100 text-indigo-600' : 'bg-emerald-100 text-emerald-600'}`}>
					{isGroup ? <Hash className='w-5 h-5' /> : <Users className='w-5 h-5' />}
				</div>

				{/* Индикатор типа */}
				<span
					className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider ${
						isGroup ? 'bg-indigo-50 text-indigo-600' : 'bg-emerald-50 text-emerald-600'
					}`}>
					{room?.type}
				</span>
			</div>

			<div className='mb-3'>
				<h3 className='font-bold text-foreground truncate'>{room?.name}</h3>
				<p className='text-xs text-muted-foreground flex items-center gap-1 mt-0.5'>
					<Users className='w-3 h-3' />
					{room?.members.length} участников
				</p>
			</div>

			{/* Инфо о коде комнаты */}
			<div className='mt-auto flex items-center justify-between pt-3 border-t border-border/50'>
				<div className='flex items-center gap-1.5 text-[11px] font-mono text-muted-foreground bg-muted/50 px-2 py-1 rounded-md'>
					{isGroup ? <Lock className='w-3 h-3' /> : <Globe className='w-3 h-3' />}
					{room?.room_code}
				</div>
				<button
					onClick={(e) => {
						e.preventDefault()
						handleCopyText(room?.room_code as string)
					}}
					className='p-1.5 hover:bg-muted rounded-md transition-colors'
					title='Скопировать код'>
					<Copy className='w-3.5 h-3.5 text-muted-foreground' />
				</button>
			</div>
		</Link>
	)
}
