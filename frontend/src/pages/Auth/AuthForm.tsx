import { Input } from '@/components/shared/ui/input'
import { Label } from '@/components/shared/ui/label'
import { type FieldErrors, type UseFormRegister } from 'react-hook-form'
import { Button } from '@/components/shared/ui/button'

export default function AuthForm({
	tab,
	onSubmit,
	register,
	errors,
	inputs,
}: {
	tab: string
	onSubmit: (e?: React.BaseSyntheticEvent) => void
	register: UseFormRegister<{
		login: string
		email?: string
		password: string
	}>
	errors: FieldErrors<{
		login: string
		email: string
		password: string
	}>
	inputs: {
		label: string
		type: string
		name: 'login' | 'email' | 'password'
		placeholder: string
	}[]
}) {
	return (
		<form
			onSubmit={onSubmit}
			className='grid gap-4'>
			{inputs.map((el, i) => (
				<div
					key={i}
					className='grid gap-2'>
					<Label htmlFor={el.label}>{el.label}</Label>
					<div>
						<Input
							{...register(el.name, {
								required: true,
							})}
							id={el.label}
							type={el.type}
							placeholder={el.placeholder}
						/>
						{errors[el.type as keyof typeof errors]?.message && (
							<p className='text-red-500 text-xs'>{errors[el.type as keyof typeof errors]?.message}</p>
						)}
					</div>
				</div>
			))}
			<Button
				type='submit'
				className='w-full h-11 text-white font-semibold rounded-lg shadow-lg transition-all'>
				{tab === 'login' ? 'Увійти до аккаунту' : 'Створити профіль'}
			</Button>
		</form>
	)
}
