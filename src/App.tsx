import { ThemeProvider } from '@/components/theme-provider';
import { Toaster } from '@/components/ui/sonner';

import Dashboard from './pages/dashboard';

function App() {
	return (
		<ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
			<Dashboard />
			<Toaster />
		</ThemeProvider>
	);
}

export default App;
