import { type ReactNode } from 'react'
import { AuthProvider } from './auth-provider'
import { DIProvider } from './di-provider'
import { TooltipProvider } from '../../shared/ui/tooltip'
import { Toaster } from 'sonner'
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClient } from '../lib/query-client'
import { ModalProvider } from './modal-provider'
import { PopupProvider } from './popup-provider'

export default function AppProvider({ children }: { children: ReactNode }) {
	return (
		<QueryClientProvider client={queryClient}>
			<PopupProvider>
				<ModalProvider>
					<AuthProvider>
						<Toaster />
						<DIProvider>
							<TooltipProvider>{children}</TooltipProvider>
						</DIProvider>
					</AuthProvider>
				</ModalProvider>
			</PopupProvider>
		</QueryClientProvider>
	)
}
