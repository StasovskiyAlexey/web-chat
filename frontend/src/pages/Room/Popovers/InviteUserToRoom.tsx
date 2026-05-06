import { UserIcon } from 'lucide-react'
import { useState } from 'react'

export default function InviteUserToRoom() {
	const [userCode, setUserCode] = useState('')

	const handleSend = () => {
		if (!userCode.trim()) return
	}

	return (
		<div className='w-full max-w-[320px] p-1'>
			<div className='flex flex-col gap-4'>
				<div>
					<h3 className='text-sm font-semibold text-gray-900'>Запросити учасника</h3>
					<p className='text-xs text-gray-500 mt-1'>
						Введіть унікальний код користувача, щоб надіслати йому запит на вхід.
					</p>
				</div>

				<div className='relative group'>
					<div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
						<UserIcon className='h-4 w-4 text-gray-400 group-focus-within:text-blue-500 transition-colors' />
					</div>
					<input
						type='text'
						value={userCode}
						onChange={(e) => setUserCode(e.target.value)}
						placeholder='Наприклад: #USER-1234'
						className='block w-full pl-10 pr-12 py-2.5 text-sm border-gray-200 rounded-lg bg-gray-50 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none'
					/>

					<button
						onClick={handleSend}
						className='absolute inset-y-1.5 right-1.5 flex items-center justify-center w-8 h-8 rounded-md bg-blue-600 text-white hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors'></button>
				</div>

				<div className='flex items-center gap-2 px-1'>
					<div className='w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse' />
					<span className='text-[10px] uppercase tracking-wider font-bold text-gray-400'>Очікування підтвердження</span>
				</div>
			</div>
		</div>
	)
}
