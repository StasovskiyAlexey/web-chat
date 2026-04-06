import MainLayout from '@/layouts/MainLayout'
import type { TUser } from '@/types/user'
import { createRootRouteWithContext, Outlet } from '@tanstack/react-router'
import { type TAuthService } from '@/services/auth.service'

export interface MyRouterContext {
	user: TUser
	service: TAuthService
}

export const Route = createRootRouteWithContext<MyRouterContext>()({
	pendingComponent: FullScreenLoader,
	component: () => (
		<MainLayout>
			<Outlet />
		</MainLayout>
	),
})
