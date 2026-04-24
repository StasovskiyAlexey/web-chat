import { container } from '@/di/container'
import { createContext, type ReactNode } from 'react'

const DIContext = createContext(container)

export const DIProvider = ({ children }: { children: ReactNode }) => {
	return <DIContext.Provider value={container}>{children}</DIContext.Provider>
}

export const useInjection = <T,>(identifier: symbol) => {
	const container = useContext(DIContext)
	return container.get<T>(identifier)
}
