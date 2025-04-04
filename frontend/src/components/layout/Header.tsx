import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Bell, Search, User, LogOut, Shield } from 'lucide-react';
import { Button } from '../ui/Button';
import { useUserStore } from '../../stores/userStore';
import { useSearchStore } from '../../stores/searchStore';
import { useNotificationStore } from '../../stores/notificationStore';

export function Header() {
  const { user, signOut, hasPermission } = useUserStore();
  const navigate = useNavigate();
  const location = useLocation();
  const { query, setQuery, setIsSearching } = useSearchStore();
  const { unreadCount } = useNotificationStore();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    if (!location.pathname.startsWith('/marketplace')) {
      navigate(`/marketplace?search=${encodeURIComponent(query.trim())}`);
    }
    
    setIsSearching(true);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
    if (location.pathname.startsWith('/marketplace')) {
      setIsSearching(true);
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link to="/" className="text-2xl font-bold text-blue-600">
          BidWise
        </Link>
        
        <div className="flex items-center space-x-8">
          <form 
            onSubmit={handleSearch}
            className="relative hidden md:block"
          >
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input
              type="search"
              value={query}
              onChange={handleSearchChange}
              placeholder="Search auctions..."
              className="h-10 w-[300px] rounded-full border pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </form>
          
          <nav className="flex items-center space-x-4">
            <Link 
              to="/marketplace" 
              className="text-gray-600 hover:text-gray-900"
            >
              Marketplace
            </Link>
            {!user && (
              <Link 
                to="/get-started" 
                className="text-gray-600 hover:text-gray-900"
              >
                Get Started
              </Link>
            )}
            {hasPermission('create:listing') && (
              <Link 
                to="/sell" 
                className="text-gray-600 hover:text-gray-900"
              >
                Sell
              </Link>
            )}
          </nav>
          
          <div className="flex items-center space-x-4">
            {user ? (
              <>
                <Link
                  to="/notifications"
                  className="relative p-2 text-gray-400 hover:text-gray-500"
                >
                  <Bell className="h-5 w-5" />
                  {unreadCount > 0 && (
                    <span className="absolute top-0 right-0 -mt-1 -mr-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                      {unreadCount}
                    </span>
                  )}
                </Link>
                {user.role === 'admin' && (
                  <Link to="/admin">
                    <Button variant="ghost" size="sm">
                      <Shield className="h-5 w-5" />
                    </Button>
                  </Link>
                )}
                <Link to="/profile">
                  <Button variant="ghost" size="sm">
                    <User className="h-5 w-5" />
                  </Button>
                </Link>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    signOut();
                    navigate('/');
                  }}
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Sign Out
                </Button>
              </>
            ) : (
              <Button
                variant="primary"
                size="sm"
                onClick={() => navigate('/auth', { state: { from: location } })}
              >
                Sign In
              </Button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}