import { Sidebar } from '@/components/sidebar/Sidebar'
import AppProvider from '@/providers/AppProvider'
import { type ReactNode } from 'react'

export default function MainLayout({ children }: { children?: ReactNode }) {
	const { width } = useMobile()
	const isMobile = width < 768

	return (
		<AppProvider>
			<div className={`flex h-screen w-full overflow-hidden`}>
				{!isMobile && <Sidebar />}

				<main className='flex-1 min-w-0 relative overflow-y-auto'>
					{isMobile && <MobileMenu />}
					{children}
				</main>
			</div>
		</AppProvider>
	)
}
