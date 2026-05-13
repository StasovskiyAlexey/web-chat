import { Room } from '@/pages/room/room'
import { createFileRoute, redirect } from '@tanstack/react-router'
import Loader from '@/shared/Loader'

export const Route = createFileRoute('/rooms/$roomId')({
	pendingComponent: Loader,
	beforeLoad: async ({ context }) => {
		const user = await context.service.me()
		if (!user) {
			throw redirect({
				to: '/',
				replace: true,
			})
		}
	},
	component: Room,
})
