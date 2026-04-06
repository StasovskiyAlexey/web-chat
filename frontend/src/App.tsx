import { createRouter, RouterProvider } from '@tanstack/react-router'
import { routeTree } from './routeTree.gen' // Дерево роутов(генерируется самостоятельно)
import { useAuth } from './providers/AuthProvider'
import { useService } from './providers/DIProvider'
import { AuthService } from './services/auth.service'
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
	const authService = useService<AuthService>(TTypes.AuthService)

	return (
		<RouterProvider
			router={router}
			context={{ user, service: authService }}
		/>
	)
}

export default App
