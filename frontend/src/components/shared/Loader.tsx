import { Spinner } from './ui/spinner'

export default function Loader({ message }: { message?: string }) {
	return (
		<div className='fixed inset-0 z-100 flex bg-white/50 flex-col items-center justify-center'>
			<Spinner />
			<p className='text-black font-medium animate-pulse'>{message}</p>
		</div>
	)
}
