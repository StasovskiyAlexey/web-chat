import { TTypes } from '@/shared/di/types'
import { useInjection } from '@/app/providers/DIProvider'
import type { TUserUpdateSchema } from '@/entities/user/model/schemas'
import { useMutation } from '@tanstack/react-query'
import { AxiosError } from 'axios'
import { toast } from 'sonner'
import type { TUserService } from './user.service'

export const useUserMutations = () => {
	const userService = useInjection<TUserService>(TTypes.UserService)

	const updateUser = useMutation({
		mutationFn: (data: TUserUpdateSchema) => userService.updateUser(data),
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
