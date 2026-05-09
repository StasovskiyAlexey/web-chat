import { TTypes } from '@/shared/di/types'
import { useInjection } from '@/app/providers/DIProvider'
import { AuthService } from '@/entities/auth/api/auth.service'
import type { TUserUpdateSchema } from '@/entities/auth/model/schemas'
import { useMutation } from '@tanstack/react-query'
import { AxiosError } from 'axios'
import { toast } from 'react-toastify'

export const useUserMutations = () => {
	const authService = useInjection<AuthService>(TTypes.AuthService)

	const updateUser = useMutation({
		mutationFn: (data: TUserUpdateSchema) => authService.updateUser(data),
		onSuccess: (data) => {
			toast.success(data.message)
		},
		onError: (e) => {
			if (e instanceof AxiosError) {
				toast.error(e.response?.data.detail)
			}
		},
	})

	return {
		updateUser: updateUser.mutate,
		isUpdateUserPending: updateUser.isPending,
	}
}
