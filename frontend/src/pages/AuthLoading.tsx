import { Link, useNavigate, useParams, useSearch } from '@tanstack/react-router'
import { ArrowLeft, ShieldCheck, XCircle } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '@/providers/AuthProvider'

export default function AuthLoading() {
	const navigate = useNavigate()
	const { provider } = useParams({ from: '/auth/$provider' })
	const { code } = useSearch({ from: '/auth/$provider' })

	const { githubLogin, googleLogin, discordLogin } = useAuth()

	useEffect(() => {
		const performLogin = async () => {
			try {
				switch (provider) {
					case 'google':
						await googleLogin(code)
						break
					case 'github':
						await githubLogin(code)
						break
					case 'discord':
						await discordLogin(code)
						break
				}

				navigate({ to: '/', replace: true })
			} catch (e) {
				console.error(e)
			}
		}

		performLogin()
	}, [code, provider, navigate])

	return (
		<div className='relative flex flex-col items-center justify-center min-h-screen bg-background overflow-hidden'>
			{/* Фоновые декоративные элементы */}
			<div className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[120px] -z-10 animate-pulse' />

			<div className='w-full max-w-[400px] px-8 py-12 flex flex-col items-center'>
				<AnimatePresence>
					{code ? (
						<motion.div
							key='loading'
							initial={{ opacity: 0, y: 10 }}
							animate={{ opacity: 1, y: 0 }}
							exit={{ opacity: 0, scale: 0.95 }}
							className='flex flex-col items-center space-y-8 w-full'>
							{/* Иконка с анимированным кольцом */}
							<div className='relative'>
								<motion.div
									animate={{ rotate: 360 }}
									transition={{ repeat: Infinity, duration: 2, ease: 'linear' }}
									className='rounded-full border-t-2 border-r-2 border-primary h-20 w-20'
								/>
								<div className='absolute inset-0 flex items-center justify-center'>
									<ShieldCheck className='h-8 w-8 text-primary/80' />
								</div>
							</div>

							<div className='space-y-4 text-center w-full'>
								<h2 className='text-2xl font-bold tracking-tight bg-linear-to-b from-foreground to-foreground/60 bg-clip-text text-transparent'>
									Авторизация {provider}
								</h2>

								{/* Прогресс-бар (фейковый, но приятный) */}
								<div className='w-full bg-secondary h-1 rounded-full overflow-hidden'>
									<motion.div
										initial={{ width: '0%' }}
										animate={{ width: '100%' }}
										transition={{ duration: 6 }}
										className='bg-primary h-full shadow-[0_0_10px_rgba(var(--primary),0.5)]'
									/>
								</div>
							</div>
						</motion.div>
					) : (
						<motion.div
							key='error'
							initial={{ opacity: 0, scale: 0.9 }}
							animate={{ opacity: 1, scale: 1 }}
							className='flex flex-col items-center space-y-6 text-center'>
							<div className='bg-destructive/10 p-4 rounded-full'>
								<XCircle className='h-12 w-12 text-destructive' />
							</div>

							<div className='space-y-2'>
								<h2 className='text-2xl font-bold'>Ошибка входа</h2>
								<p className='text-muted-foreground'>
									Мы не смогли получить данные для авторизации. Пожалуйста, попробуйте еще раз.
								</p>
							</div>

							<Link to='/auth'>
								<Button
									variant='outline'
									className='gap-2'>
									<ArrowLeft className='h-4 w-4' />
									Назад к регистрации
								</Button>
							</Link>
						</motion.div>
					)}
				</AnimatePresence>
			</div>

			{/* Нижняя надпись */}
			<p className='absolute bottom-8 text-[10px] uppercase tracking-[0.2em] text-muted-foreground/50 font-medium'>
				Secure Auth Protocol v2.0
			</p>
		</div>
	)
}
