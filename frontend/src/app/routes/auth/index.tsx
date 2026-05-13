import Auth from '@/pages/auth'
import { createFileRoute, redirect } from '@tanstack/react-router'

export const Route = createFileRoute('/auth/')({
	beforeLoad: async ({ context }) => {
		const user = await context.service.me()
		if (user) {
			throw redirect({
				to: '/',
				replace: true,
			})
		}
	},
	component: Auth,
})
