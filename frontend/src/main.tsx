import ReactDOM from 'react-dom/client'
import '../src/main.css'
import AppProvider from './app/providers/AppProvider'
import App from './App'

const rootElement = document.getElementById('root')!
if (!rootElement.innerHTML) {
	const root = ReactDOM.createRoot(rootElement)
	root.render(
		<AppProvider>
			<App />
		</AppProvider>,
	)
}
