import { container } from '@/shared/di/container.ts'
import { createContext, type ReactNode } from 'react'

const DIContext = createContext(container)

export const DIProvider = ({ children }: { children: ReactNode }) => {
	return <DIContext.Provider value={container}>{children}</DIContext.Provider>
}

export const useInjection = <T,>(identifier: symbol): T => {
	const container = useContext(DIContext)
	return container.get<T>(identifier)
}
