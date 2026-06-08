import { toast } from 'sonner'

export default function useCopy() {
	async function handleCopyText(text: string) {
		try {
			await navigator.clipboard.writeText(text)
			toast.success(`Текст успешно скопирован`)
		} catch (e) {
			toast.success(`Ошибка при копировании текста`)
		}
	}
	return {
		handleCopyText,
	}
}
