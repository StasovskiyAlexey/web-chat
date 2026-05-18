export default function useWebsocket(url: string) {
	const [socket, setSocket] = useState<null | WebSocket>(null)

	useEffect(() => {
		const ws = new WebSocket(url)
		console.log(socket)
		ws.onopen = () => {
			console.log('Соединение открыто')
			setSocket(ws)
		}

		ws.onerror = (err) => {
			console.error('⚠️ Ошибка сокета:', err)
		}

		ws.onclose = () => {
			console.log('Соединение закрыто')
		}

		return () => ws.close()
	}, [url])

	return { socket }
}
