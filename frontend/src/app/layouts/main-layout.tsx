import { Sidebar } from '@/widgets/sidebar/sidebar'
import AppProvider from '../providers/app-provider'
import { type ReactNode } from 'react'
import useMobile from '@/shared/hooks/use-mobile'
import MobileMenu from '@/widgets/mobile-menu'

export default function MainLayout({ children }: { children?: ReactNode }) {
	const { width } = useMobile()
	const isMobile = width < 768

	return (
		<AppProvider>
			<div className={`flex h-screen w-full overflow-hidden`}>
				{!isMobile && <Sidebar />}

				<main className='flex-1 min-w-0 relative overflow-y-auto'>
					{isMobile && <MobileMenu />}
					<div className='p-4'>{children}</div>
				</main>
			</div>
		</AppProvider>
	)
}
