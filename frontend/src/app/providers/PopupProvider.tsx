import { createContext, type ReactNode, useContext, useState } from 'react'

export type TPopupContext = {
	switcher: (popup: string, isOpen: boolean, props?: unknown) => void
	popups: TPopups
	add: (popup: string, isOpen: boolean, props?: unknown) => void
}

type TPopupNames = 'addRoom' | 'userNotifications' | 'roomSettings' | 'inviteUserToRoom'

export type TPopups = {
	[K in TPopupNames]: { isOpen: boolean; props: null }
}

const PopupContext = createContext<TPopupContext | null>(null)

export const PopupProvider = ({ children }: { children?: ReactNode }) => {
	const popupsMap = {
		addRoom: { isOpen: false, props: null },
		userNotifications: { isOpen: false, props: null },
		roomSettings: { isOpen: false, props: null },
		inviteUserToRoom: { isOpen: false, props: null },
	}

	const [popups, setPopups] = useState<TPopups>(popupsMap)

	function switcher(popup: string, isOpen: boolean, props?: unknown) {
		setPopups((prev) => ({ ...prev, [popup]: { isOpen, props } }))
	}

	// Динамичная функция для попапов в списке чтобы каждый был уникальным
	function add(popup: string, isOpen: boolean, props?: unknown) {
		const newPopup = { popup, isOpen, props }

		setPopups((prev) => {
			return { ...prev, [popup]: newPopup }
		})
	}

	return <PopupContext.Provider value={{ switcher, add, popups }}>{children}</PopupContext.Provider>
}

export const usePopup = () => {
	const context = useContext(PopupContext)

	if (!context) {
		throw new Error('Ошибка при использовании контекста')
	}

	return context
}
