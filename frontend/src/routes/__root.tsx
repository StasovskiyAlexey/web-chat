import MainLayout from '@/layouts/MainLayout'
import type { TUser } from '@/types/user'
import { createRootRouteWithContext, Outlet } from '@tanstack/react-router'
import { type TAuthService } from '@/services/auth.service'
import Loader from '@/components/shared/Loader'
export interface MyRouterContext {
	user: TUser
	service: TAuthService
}

export const Route = createRootRouteWithContext<MyRouterContext>()({
	pendingComponent: Loader,
	component: () => (
		<MainLayout>
			<Outlet />
		</MainLayout>
	),
})
