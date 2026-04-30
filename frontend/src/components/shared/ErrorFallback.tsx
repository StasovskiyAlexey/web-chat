import { AlertCircle, RefreshCcw, Home } from 'lucide-react'
import { Button } from '@/components/shared/ui/button'
import { Link } from '@tanstack/react-router'
import { motion } from 'framer-motion'

interface IErrorBlockProps {
	title?: string
	description?: string
	error?: Error | string
	reset?: () => void
}

export default function ErrorFallback({
	title = 'Что-то пошло не так',
	description = 'При попытке загрузки данных, произошла ошибка',
	error,
	reset,
}: IErrorBlockProps) {
	return (
		<div className='flex min-h-[400px] w-full flex-col items-center justify-center p-8 text-center'>
			<motion.div
				initial={{ scale: 0.9, opacity: 0 }}
				animate={{ scale: 1, opacity: 1 }}
				className='flex flex-col items-center max-w-md'>
				{/* Іконка з м'яким фоном */}
				<div className='mb-6 flex size-20 items-center justify-center rounded-full bg-red-50 text-red-500 dark:bg-red-950/30'>
					<AlertCircle className='size-10' />
				</div>

				{/* Текстовий блок */}
				<h2 className='mb-2 text-2xl font-bold tracking-tight text-foreground'>{title}</h2>
				<p className='mb-6 text-muted-foreground'>{description}</p>

				{/* Технічні деталі (опціонально, корисно для дебагу) */}
				{error && (
					<div className='mb-8 w-full overflow-hidden rounded-lg bg-muted p-3 text-left'>
						<p className='family-mono truncate text-xs text-muted-foreground'>
							{typeof error === 'string' ? error : error.message}
						</p>
					</div>
				)}

				{/* Кнопки дій */}
				<div className='flex flex-wrap items-center justify-center gap-3'>
					{reset && (
						<Button
							onClick={() => reset()}
							variant='default'
							className='gap-2'>
							<RefreshCcw className='size-4' />
							Повторити спробу
						</Button>
					)}

					<Button
						variant='outline'
						asChild>
						<Link to='/'>
							<Home className='size-4 mr-2' />
							На головну
						</Link>
					</Button>
				</div>
			</motion.div>
		</div>
	)
}
