import { type ReactNode } from 'react'
import { AuthProvider } from './AuthProvider'
import { DIProvider } from './DIProvider'
import { TooltipProvider } from '../../shared/ui/tooltip'
import { ToastContainer } from 'react-toastify'
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClient } from '../lib/query-client'
import { ModalProvider } from './ModalProvider'
import { PopupProvider } from './PopupProvider'

export default function AppProvider({ children }: { children: ReactNode }) {
	return (
		<QueryClientProvider client={queryClient}>
			<PopupProvider>
				<ModalProvider>
					<AuthProvider>
						<ToastContainer />
						<DIProvider>
							<TooltipProvider>{children}</TooltipProvider>
						</DIProvider>
					</AuthProvider>
				</ModalProvider>
			</PopupProvider>
		</QueryClientProvider>
	)
}
