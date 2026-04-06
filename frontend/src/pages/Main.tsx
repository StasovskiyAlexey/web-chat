import { motion } from 'framer-motion'
import { Loader2, Shield } from 'lucide-react'

export default function AuthLoading() {
	return (
		<div className='flex flex-col items-center justify-center min-h-screen bg-slate-50 dark:bg-slate-950'>
			<motion.div
				initial={{ scale: 0.8, opacity: 0 }}
				animate={{ scale: 1, opacity: 1 }}
				className='text-center'>
				{/* Твой логотип или красивая иконка */}
				<div className='mb-6 relative'>
					<div className='w-20 h-20 bg-indigo-600 rounded-2xl flex items-center justify-center shadow-2xl shadow-indigo-500/40 mx-auto'>
						<Shield
							size={40}
							color='white'
						/>
					</div>
				</div>

				<h2 className='text-xl font-semibold text-slate-800 dark:text-slate-200'>С возвращением!</h2>
				<p className='text-slate-500 mt-2 text-sm'>Синхронизируем ваши сообщения...</p>
			</motion.div>
		</div>
	)
}
