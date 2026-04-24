import { createRouter, RouterProvider } from '@tanstack/react-router'
import { routeTree } from './routeTree.gen' // Дерево роутов(генерируется самостоятельно)
import { useAuth } from './providers/AuthProvider'
import { useInjection } from './providers/DIProvider'
import { type TAuthService } from './services/auth.service'
import { TTypes } from './di/types'

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
