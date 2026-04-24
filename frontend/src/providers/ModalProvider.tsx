import { createContext, type ReactNode, useContext, useState } from 'react'

export type TModalContext = {
	switcher: (modal: keyof TModals, isOpen: boolean, props?: unknown) => void
	modals: TModals
}

export type TModals = {
	addRoomModal: { modal: string; isOpen: boolean; props?: unknown }
}

export type TModalStore<T> = {
	modals: {
		[K in keyof TModals]: {
			isOpen: boolean
			data: T | null
		}
	}
	switcher: <K extends keyof TModals>(modal: K, isOpen: boolean, data?: TModals[K]) => void
}

const ModalContext = createContext<TModalContext | null>(null)

export const ModalProvider = ({ children }: { children?: ReactNode }) => {
	const modalsMap = {
		addRoomModal: {
			modal: 'addRoomModal',
			isOpen: false,
			props: null,
		},
	}

	const [modals, setModals] = useState<TModals>(modalsMap)

	function switcher(modal: string, isOpen: boolean, props?: unknown) {
		setModals((prev) => ({ ...prev, [modal]: { isOpen, props } }))
	}

	return <ModalContext.Provider value={{ switcher, modals }}>{children}</ModalContext.Provider>
}

export const useModal = () => {
	const context = useContext(ModalContext)

	if (!context) {
		throw new Error('Error')
	}

	return context
}
