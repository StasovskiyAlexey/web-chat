import { TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Tabs } from '@/components/ui/tabs'

import { useForm, type FieldValues, type SubmitHandler } from 'react-hook-form'
import AuthForm from './AuthForm'
import { inputs } from '@/lib/constants'
import { useAuth } from '@/providers/AuthProvider'
import { zodResolver } from '@hookform/resolvers/zod'
import { userLoginSchema, userRegisterSchema } from '@/types/schemas'

export default function Auth() {
	const [activeTab, setActiveTab] = useState<string>('login')
	const { login, register: registration } = useAuth()

	const {
		reset,
		register,
		handleSubmit,
		formState: { errors },
	} = useForm({
		resolver: zodResolver(activeTab === 'login' ? userLoginSchema : userRegisterSchema),
	})

	useEffect(() => {
		reset()
	}, [activeTab])

	const handleLogin: SubmitHandler<FieldValues> = (data) => {
		login({ login: data.login, password: data.password })
		console.log(data)
		reset()
	}

	const handleRegister: SubmitHandler<FieldValues> = (data) => {
		registration({ login: data.login, email: data.email, password: data.password })
		reset()
	}

	return (
		<div className='flex min-h-screen items-center justify-center bg-slate-50'>
			<div className='w-full max-w-[400px] p-6 shadow-lg'>
				<h1 className='text-xl'>{activeTab === 'login' && 'Логин'}</h1>
				<h1 className='text-xl'>{activeTab === 'register' && 'Регистрация'}</h1>
				<Tabs
					onValueChange={(e) => setActiveTab(e)}
					defaultValue='login'
					className='mt-4'>
					<TabsList className='flex gap-3 justify-center w-full'>
						<TabsTrigger value='login'>Логин</TabsTrigger>
						<TabsTrigger value='register'>Регистрация</TabsTrigger>
					</TabsList>
					{['login', 'register'].map((el, i) => (
						<TabsContent
							key={i}
							value={el}>
							<AuthForm
								errors={errors}
								register={register}
								onSubmit={handleSubmit(el === 'login' ? handleLogin : handleRegister)}
								key={i}
								tab='login'
								inputs={el === 'login' ? inputs.filter((el) => el.name !== 'email') : inputs}
							/>
						</TabsContent>
					))}
				</Tabs>
			</div>
		</div>
	)
}
