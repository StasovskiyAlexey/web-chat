import { createContext, type ReactNode, useContext, useState } from 'react'

export type TPopupContext = {
	switcher: (popup: keyof TPopups, isOpen: boolean, props?: unknown) => void
	popups: TPopups
}

export type TPopups = {
	addRoom: { popup: string; isOpen: boolean; props?: any }
	userNotifications: { popup: string; isOpen: boolean; props?: any }
	roomSettings: { popup: string; isOpen: boolean; props?: any }
	inviteUserToRoom: { popup: string; isOpen: boolean; props?: any }
}

const PopupContext = createContext<TPopupContext | null>(null)

export const PopupProvider = ({ children }: { children?: ReactNode }) => {
	const popupsMap = {
		addRoom: { popup: 'addRoom', isOpen: false, props: null },
		userNotifications: { popup: 'userNotifications', isOpen: false, props: null },
		roomSettings: { popup: 'roomSettings', isOpen: false, props: null },
		inviteUserToRoom: { popup: 'roomSettings', isOpen: false, props: null },
	}

	const [popups, setPopups] = useState<TPopups>(popupsMap)

	function switcher(popup: string, isOpen: boolean, props?: unknown) {
		setPopups((prev) => ({ ...prev, [popup]: { isOpen, props } }))
	}

	return <PopupContext.Provider value={{ switcher, popups }}>{children}</PopupContext.Provider>
}

export const usePopup = () => {
	const context = useContext(PopupContext)

	if (!context) {
		throw new Error('Error')
	}

	return context
}
