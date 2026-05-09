import { Tooltip, TooltipContent, TooltipTrigger } from '../../shared/ui/tooltip'
import { Link, useLocation } from '@tanstack/react-router'
import { Button } from '../../shared/ui/button'
import { AnimatePresence, motion } from 'framer-motion'

interface NavItemProps {
	to?: string
	icon: React.ElementType
	label: string
	isOpen: boolean
	variant?: 'default' | 'danger'
	onClick?: () => void
}

export const NavItem = forwardRef<HTMLButtonElement, NavItemProps>(
	({ to, icon: Icon, label, isOpen, variant = 'default', onClick, ...props }, ref) => {
		const location = useLocation()
		const isActive = location.pathname === to

		const content = (
			<Button
				{...props}
				ref={ref}
				variant='ghost'
				onClick={onClick}
				className={`w-full gap-3 transition-all duration-200 ${isOpen ? 'justify-start px-3' : 'justify-center px-0'} ${
					isActive && variant === 'default'
						? 'bg-primary/10 text-primary hover:bg-primary/15'
						: 'text-muted-foreground hover:text-foreground'
				} ${variant === 'danger' ? 'text-red-500 hover:text-red-600 hover:bg-red-500/10' : ''}`}>
				<Icon className={`size-5 shrink-0 ${isActive && variant === 'default' ? 'text-primary' : ''}`} />
				<AnimatePresence>
					{isOpen && (
						<motion.span
							initial={{ opacity: 0, x: -10 }}
							animate={{ opacity: 1, x: 0 }}
							exit={{ opacity: 0, x: -10 }}
							className='truncate text-sm font-medium'>
							{label}
						</motion.span>
					)}
				</AnimatePresence>
			</Button>
		)

		if (isOpen) return to ? <Link to={to}>{content}</Link> : content

		return (
			<Tooltip delayDuration={0}>
				<TooltipTrigger asChild>{to ? <Link to={to}>{content}</Link> : content}</TooltipTrigger>
				<TooltipContent
					side='right'
					className='flex items-center gap-4'>
					{label}
				</TooltipContent>
			</Tooltip>
		)
	},
)
