import MainLayout from '@/app/layouts/MainLayout.tsx'
import type { TUser } from '@/entities/user/model/types'
import { createRootRouteWithContext, Outlet } from '@tanstack/react-router'
import type { TAuthService } from '@/features/auth/api/auth.service'
import Loader from '@/shared/Loader.tsx'

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
