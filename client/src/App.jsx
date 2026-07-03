import { BrowserRouter, useLocation } from 'react-router-dom';
import { ThemeProvider, AuthProvider, useAuth } from './context/AppContext';
import Navbar    from './components/Navbar';
import Sidebar   from './components/Sidebar';
import Footer    from './components/Footer';
import AppRoutes from './routes/AppRoutes';

const PUBLIC = ['/', '/login'];

function Shell() {
  const { user } = useAuth();
  const { pathname } = useLocation();
  // Show bare layout on landing/login only when not logged in
  if (PUBLIC.includes(pathname) && !user) return <AppRoutes />;

  return (
    <div className="app-shell">
      <Sidebar />
      <Navbar />
      <main className="main-content">
        <AppRoutes />
      </main>
      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <BrowserRouter>
          <Shell />
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  );
}
