import { createFileRoute } from '@tanstack/react-router'
import AuthLoading from '@/pages/AuthLoading'

export const Route = createFileRoute('/auth/$provider')({
	validateSearch: (search: Record<string, unknown>) => {
		return { code: search.code }
	},
	component: AuthLoading,
})
