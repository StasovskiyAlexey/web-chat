import Room from '@/pages/Room/Room'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/rooms/$roomId')({
	component: Room,
})
