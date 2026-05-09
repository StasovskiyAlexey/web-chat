import type { TUser, TUserLogin, TUserRegister } from '@/entities/auth/model/types'
import { useNavigate } from '@tanstack/react-router'
import { AxiosError } from 'axios'
import React, { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import { toast } from 'react-toastify'
import { useInjection } from './DIProvider'
import { TTypes } from '@/shared/di/types'
import { type TAuthService } from '@/entities/auth/api/auth.service'

export type TAuthContext = {
	me: () => Promise<TUser | undefined>
	logout: () => Promise<TUser>
	isLoading: boolean
	user: TUser | null
	setUser: React.Dispatch<React.SetStateAction<TUser | null>>
	login: (data: TUserLogin) => Promise<TUser>
	register: (data: TUserRegister) => Promise<TUser>
}

const AuthContext = createContext<TAuthContext | null>(null)

export const AuthProvider = ({ children }: { children?: ReactNode }) => {
	const [user, setUser] = useState<TUser | null>(null)
	const navigate = useNavigate()

	const [isLoading, setIsLoading] = useState<boolean>(false)
	const authService = useInjection<TAuthService>(TTypes.AuthService)

	async function me() {
		try {
			const res = await authService.me()
			if (res?.data) {
				setUser(res.data)
			}
			return res?.data
		} catch (e) {
			setUser(null)
			console.log(e)
		}
	}

	async function login(data: TUserLogin) {
		setIsLoading(true)
		try {
			const res = await authService.login(data)
			toast.success(res?.message)
			setUser(res?.data)
			navigate({ to: '/', replace: true })
			return res?.data
		} catch (e) {
			if (e instanceof AxiosError) {
				toast.error(e.response?.data.detail)
			}
			console.log(e)
		} finally {
			setIsLoading(false)
		}
	}

	async function register(data: TUserRegister) {
		setIsLoading(true)
		try {
			const res = await authService.register(data)
			toast.success(res?.message)
			navigate({ to: '/' })
			setUser(res.data)
			return res?.data
		} catch (e) {
			if (e instanceof AxiosError) {
				toast.error(e.response?.data.detail)
			}
			console.log(e)
		} finally {
			setIsLoading(false)
		}
	}

	async function logout() {
		setIsLoading(true)
		try {
			const res = await authService.logout()
			toast.success('Успішний вихід з аккаунту')
			navigate({ to: '/auth', replace: true })
			setUser(null)
			return res.data
		} catch (e) {
			if (e instanceof AxiosError) {
				toast.error(e.response?.data.detail)
			}
		} finally {
			setIsLoading(false)
		}
	}

	useEffect(() => {
		me()
	}, [])

	return (
		<AuthContext.Provider
			value={{
				login,
				register,
				me,
				logout,
				isLoading,
				user,
				setUser,
			}}>
			{children}
		</AuthContext.Provider>
	)
}

export const useAuth = () => {
	const context = useContext(AuthContext)

	if (!context) {
		throw new Error('Error')
	}

	return context
}
