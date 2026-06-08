import { Input } from '@/shared/ui/input'
import { Send } from 'lucide-react'
import { useSendMessage } from '../model/use-send-message'
import { useAuth } from '@/app/providers/auth-provider'
import type { TRoom } from '@/entities/room/model/types'
import { Button } from '@/shared/ui/button'

export default function AddMessageForm({ room }: { room: TRoom }) {
	const { addMessage } = useSendMessage()
	const { user } = useAuth()

	const [message, setMessage] = useState('')

	function handleAddMessage() {
		addMessage({
			content: message,
			room_id: room?.id as string,
			user_id: user?.id as string,
			member_id: room?.members.find((el) => el.user_id === user?.id)?.id as string,
		})

		setMessage('')
	}

	return (
		<form
			className='flex gap-2'
			onSubmit={(e) => e.preventDefault()}>
			<Input
				placeholder='Написать сообщение...'
				value={message}
				onChange={(e) => setMessage(e.target.value)}
				className='flex-1 bg-muted/50 border-none focus-visible:ring-1'
			/>
			<Button
				onClick={() => handleAddMessage()}
				type='submit'
				size='icon'
				disabled={!message}>
				<Send className='w-4 h-4' />
			</Button>
		</form>
	)
}
