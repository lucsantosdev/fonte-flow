import { Link, useLocation, useNavigate } from 'react-router-dom';
import { type ReactNode } from 'react';
import { LayoutDashboard, ShoppingCart, Users, BarChart3, LogOut, Droplets } from 'lucide-react';

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const navItems = [
    { path: '/dashboard', label: 'Dashboard', Icon: LayoutDashboard },
    { path: '/vendas', label: 'Vendas', Icon: ShoppingCart },
    { path: '/clientes', label: 'Clientes', Icon: Users },
    { path: '/relatorio', label: 'Relatório', Icon: BarChart3 },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-100/30 via-white to-secondary-100/20">
      {/* Navbar */}
      <nav className="bg-white shadow-md border-b border-primary-100 sticky top-0 z-50 backdrop-blur-sm bg-white/95">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16 sm:h-18">
            {/* Logo */}
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="p-2 sm:p-2.5 bg-gradient-to-br from-primary-300 to-secondary-200 rounded-xl shadow-lg">
                <Droplets className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </div>
              <h1 className="text-lg sm:text-xl lg:text-2xl font-bold bg-gradient-to-r from-primary-300 to-secondary-200 bg-clip-text text-transparent">
                Fonte Flow
              </h1>
            </div>

            {/* Navigation Tabs - Desktop */}
            <div className="hidden md:flex items-center gap-2">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium transition-all duration-200 ${
                    isActive(item.path)
                      ? 'bg-gradient-to-r from-primary-300 to-secondary-200 text-white shadow-md shadow-primary-200'
                      : 'text-gray-700 hover:bg-primary-100/50 hover:text-primary-400'
                  }`}
                >
                  <item.Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </Link>
              ))}
            </div>

            {/* User Menu */}
            <div className="flex items-center">
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-3 sm:px-4 py-2 sm:py-2.5 text-sm text-gray-700 hover:bg-red-50 hover:text-red-600 rounded-xl transition-all duration-200"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline">Sair</span>
              </button>
            </div>
          </div>

          {/* Mobile Navigation */}
          <div className="md:hidden pb-4 flex gap-2 overflow-x-auto scrollbar-hide">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium text-sm whitespace-nowrap transition-all duration-200 ${
                  isActive(item.path)
                    ? 'bg-gradient-to-r from-primary-300 to-secondary-200 text-white shadow-md'
                    : 'text-gray-700 bg-primary-100/30 hover:bg-primary-100/60'
                }`}
              >
                <item.Icon className="w-4 h-4" />
                <span>{item.label}</span>
              </Link>
            ))}
          </div>
        </div>
      </nav>

      {/* Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-10">
        {children}
      </main>
    </div>
  );
}
