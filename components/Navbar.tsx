import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ShoppingBag, User as UserIcon, LogOut, Menu, X, ShieldCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

const Navbar: React.FC = () => {
  const { user, logout, isAdmin } = useAuth();
  const { itemCount } = useCart();
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = async () => {
    // Add logout animation
    document.body.classList.add('logout-animation');

    // Wait for animation
    await new Promise(resolve => setTimeout(resolve, 300));

    await logout();
    navigate('/');
    setIsOpen(false);

    // Remove animation class
    document.body.classList.remove('logout-animation');
  };

  // Different menu for admin vs regular users
  const navLinks = isAdmin
    ? [] // Admin gets no regular navigation, only Admin Dashboard link
    : [
      { name: 'Home', path: '/' },
      { name: 'Products', path: '/products' },
    ];

  if (user && !isAdmin) {
    navLinks.push({ name: 'Wishlist', path: '/wishlist' });
    navLinks.push({ name: 'My Downloads', path: '/downloads' });
  }

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="sticky top-0 z-50 bg-slate-950/80 backdrop-blur-md border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 group">
            <div className="w-8 h-8 rounded bg-gradient-to-tr from-brand-600 to-neon-blue flex items-center justify-center transform group-hover:rotate-12 transition-transform">
              <span className="text-white font-bold text-lg">7</span>
            </div>
            <span className="text-xl font-bold tracking-tight text-white group-hover:text-brand-300 transition-colors">
              ARTINFINITY7
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`text-sm font-medium transition-colors hover:text-brand-400 ${isActive(link.path) ? 'text-brand-400' : 'text-slate-300'
                  }`}
              >
                {link.name}
              </Link>
            ))}

            {isAdmin && (
              <Link
                to="/admin"
                className="flex items-center space-x-1 px-3 py-1 rounded-full bg-slate-800 text-brand-400 border border-brand-900/50 hover:bg-slate-700 transition"
              >
                <ShieldCheck size={14} />
                <span className="text-xs font-bold uppercase tracking-wider">Admin Dashboard</span>
              </Link>
            )}
          </div>

          {/* Actions */}
          <div className="hidden md:flex items-center space-x-6">
            {/* Only show cart if NOT admin */}
            {!isAdmin && (
              <Link to="/cart" className="relative text-slate-300 hover:text-white transition-colors">
                <ShoppingBag size={24} />
                {itemCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-neon-pink text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                    {itemCount}
                  </span>
                )}
              </Link>
            )}

            {user ? (
              <div className="flex items-center space-x-4">
                <span className="text-sm text-slate-400 hidden lg:block">Hi, {user.name}</span>
                <button
                  onClick={handleLogout}
                  className="text-slate-300 hover:text-white transition-colors"
                  title="Logout"
                >
                  <LogOut size={20} />
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link to="/login" className="text-sm font-medium text-slate-300 hover:text-white">
                  Log in
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 text-sm font-medium text-white bg-brand-600 rounded-full hover:bg-brand-700 transition-colors shadow-lg shadow-brand-900/20"
                >
                  Sign up
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center space-x-4">
            {/* Only show cart if NOT admin */}
            {!isAdmin && (
              <Link to="/cart" className="relative text-slate-300">
                <ShoppingBag size={24} />
                {itemCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-neon-pink text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                    {itemCount}
                  </span>
                )}
              </Link>
            )}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-slate-300 hover:text-white focus:outline-none"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-slate-900 border-b border-slate-800">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setIsOpen(false)}
                className={`block px-3 py-2 rounded-md text-base font-medium ${isActive(link.path)
                  ? 'text-white bg-slate-800'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800'
                  }`}
              >
                {link.name}
              </Link>
            ))}
            {isAdmin && (
              <Link
                to="/admin"
                onClick={() => setIsOpen(false)}
                className="block px-3 py-2 rounded-md text-base font-medium text-brand-400 hover:text-white hover:bg-slate-800"
              >
                Admin Dashboard
              </Link>
            )}
            {!user ? (
              <div className="mt-4 pt-4 border-t border-slate-800 flex flex-col space-y-2 px-3">
                <Link
                  to="/login"
                  onClick={() => setIsOpen(false)}
                  className="block text-center w-full py-2 text-slate-300 hover:text-white border border-slate-700 rounded-md"
                >
                  Log in
                </Link>
                <Link
                  to="/register"
                  onClick={() => setIsOpen(false)}
                  className="block text-center w-full py-2 bg-brand-600 text-white rounded-md hover:bg-brand-700"
                >
                  Sign up
                </Link>
              </div>
            ) : (
              <div className="mt-4 pt-4 border-t border-slate-800 px-3">
                <button
                  onClick={handleLogout}
                  className="flex items-center w-full text-left text-red-400 hover:text-red-300"
                >
                  <LogOut size={18} className="mr-2" /> Logout
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;