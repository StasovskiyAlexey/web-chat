import { createRouter, RouterProvider } from '@tanstack/react-router'
import { routeTree } from './routeTree.gen' // Дерево роутов(генерируется самостоятельно)
import { useAuth } from './app/providers/AuthProvider'
import { useInjection } from './app/providers/DIProvider'
import { type TAuthService } from './entities/auth/api/auth.service'
import { TTypes } from './shared/di/types'

const router = createRouter({
	routeTree,
	context: {
		user: null,
		service: undefined!,
	},
})

function App() {
	const { user } = useAuth()
	const authService = useInjection<TAuthService>(TTypes.AuthService)

	return (
		<RouterProvider
			router={router}
			context={{ user, service: authService }}
		/>
	)
}

export default App
