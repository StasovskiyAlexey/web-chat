import SettingsPage from '@/pages/settings'
import { createFileRoute, redirect } from '@tanstack/react-router'

export const Route = createFileRoute('/settings')({
	beforeLoad: async ({ context }) => {
		const user = await context.service.me()
		if (!user) {
			throw redirect({
				to: '/',
				replace: true,
			})
		}
	},
	component: SettingsPage,
})
