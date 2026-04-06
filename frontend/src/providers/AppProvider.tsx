import { type ReactNode } from 'react'
import { AuthProvider } from './AuthProvider'
import { DIProvider } from './DIProvider'
import { TooltipProvider } from '@/components/ui/tooltip'
import { ToastContainer } from 'react-toastify'
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClient } from '@/lib/query-client'

export default function AppProvider({ children }: { children: ReactNode }) {
	return (
		<QueryClientProvider client={queryClient}>
			<AuthProvider>
				<ToastContainer />
				<DIProvider>
					<TooltipProvider>{children}</TooltipProvider>
				</DIProvider>
			</AuthProvider>
		</QueryClientProvider>
	)
}
