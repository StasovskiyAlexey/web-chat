import { useAuth } from '@/app/providers/AuthProvider'
import { Input } from '@/shared/ui/input'
import { Label } from '@/shared/ui/label'
import { User, Mail, Settings } from 'lucide-react'
import { motion } from 'framer-motion'
import { Button } from '@/shared/ui/button'
import { useUserMutations } from '@/entities/auth/model/queries/useUser'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { type TUserUpdateSchema, userUpdateSchema } from '@/entities/auth/model/schemas'

export default function SettingsPage() {
	const { user } = useAuth()
	const { updateUser, isUpdateUserPending } = useUserMutations()

	const {
		register,
		formState: { errors, isDirty },
		handleSubmit,
		reset,
	} = useForm({
		resolver: zodResolver(userUpdateSchema),
	})

	useEffect(() => {
		if (user) {
			reset({
				login: user.login,
				email: user.email,
			})
		}
	}, [user])

	if (!user) return null

	function submitForm(data: TUserUpdateSchema) {
		try {
			updateUser(data)
			reset({ password: '', new_password: '' })
		} catch (e) {
			console.log(e)
		}
	}

	return (
		<motion.div
			initial={{ opacity: 0 }}
			animate={{ opacity: 1 }}
			transition={{ duration: 0.5 }}>
			<div className='border-none p-4 flex flex-col gap-8 backdrop-blur-sm'>
				<h1 className='text-2xl font-bold flex items-center gap-2'>
					<Settings className='size-6 text-primary' />
					Профиль пользователя
				</h1>

				<form
					className='grid gap-6'
					onSubmit={handleSubmit(submitForm)}>
					{/* Основные данные */}

					<div className='space-y-2 relative'>
						<Label className='text-muted-foreground flex items-center gap-2'>
							<User size={14} /> Имя пользователя
						</Label>
						<div className='relative'>
							<Input
								placeholder='Имя пользователя'
								{...register('login', { required: true })}
								className='border border-black font-medium text-foreground'
							/>
							{errors.login && <p className='text-red-500 text-xs'>{errors.login.message}</p>}
						</div>
					</div>

					<div className='space-y-2'>
						<Label className='text-muted-foreground flex items-center gap-2'>
							<Mail size={14} /> Email адрес
						</Label>
						<div className='relative'>
							<Input
								placeholder='Email пользователя'
								{...register('email', { required: true })}
								className='font-medium border border-black text-foreground pr-10'
							/>
							{errors.email && <p className='text-red-500 text-xs'>{errors.email.message}</p>}
						</div>
					</div>

					<div className='space-y-2'>
						<Label className='text-muted-foreground flex items-center gap-2'>Текущий пароль</Label>
						<div className='flex flex-col relative gap-2 items-start'>
							<Input
								{...register('password', { required: true })}
								placeholder='Введите текущий пароль'
								type='password'
								className='font-medium border border-black text-foreground'
							/>
						</div>
					</div>
					<div className='space-y-2'>
						<Label className='text-muted-foreground flex items-center gap-2'>Новый пароль</Label>
						<div className='flex flex-col relative gap-2 items-start'>
							<Input
								{...register('new_password', { required: true })}
								placeholder='Введите новый пароль'
								type='password'
								className='font-medium border border-black text-foreground'
							/>
						</div>
					</div>
					<Button
						disabled={!isDirty || isUpdateUserPending}
						type='submit'
						variant='outline'
						className='max-w-max'>
						Применить изменения
					</Button>
				</form>
			</div>
		</motion.div>
	)
}
