import { useEffect, useState } from 'react'

import {
  Menu,
  X,
  Moon,
  Sun,
  Bell,
  LogOut
} from 'lucide-react'

import { Link, useNavigate } from 'react-router-dom'

import { useTheme } from '../context/ThemeContext'

const getStoredUser = () => {
  try {
    return JSON.parse(localStorage.getItem('user') || 'null')
  } catch {
    return null
  }
}

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [user, setUser] = useState(getStoredUser())
  const [unreadCount, setUnreadCount] = useState(Number(localStorage.getItem('unreadNotifications') || '0'))
  const navigate = useNavigate()

  const { darkMode, toggleTheme } = useTheme()

  useEffect(() => {
    const syncUser = () => setUser(getStoredUser())
    window.addEventListener('storage', syncUser)
    const syncUnread = (e) => {
      if (e.key === 'unreadNotifications') setUnreadCount(Number(e.newValue || '0'))
    }
    window.addEventListener('storage', syncUnread)
    return () => {
      window.removeEventListener('storage', syncUser)
      window.removeEventListener('storage', syncUnread)
    }
  }, [])

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    setUser(null)
    navigate('/auth')
  }

  const isAdmin = ['ADMIN', 'SUPER_ADMIN'].includes(user?.role)
  const canCreateTrip = ['ADMIN', 'SUPER_ADMIN', 'OPERATOR'].includes(user?.role)
  const isOperator = ['ADMIN', 'SUPER_ADMIN', 'OPERATOR', 'DRIVER'].includes(user?.role)

  return (
    <nav className="bg-white dark:bg-gray-900 shadow sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="text-2xl font-bold dark:text-white">PASSO Express</Link>

          <div className="hidden md:flex items-center gap-6">
            <Link to="/" className="dark:text-white hover:text-blue-600 transition">Home</Link>
            <Link to="/fares" className="dark:text-white hover:text-blue-600 transition">Fares</Link>
            <Link to="/localities" className="dark:text-white hover:text-blue-600 transition">Localities</Link>

            {isAdmin && (
              <>
                <Link to="/create-fare" className="dark:text-white hover:text-blue-600 transition">Create Fare</Link>
                <Link to="/admin/dashboard" className="dark:text-white hover:text-blue-600 transition">Admin</Link>
              </>
            )}

            {canCreateTrip && (
              <>
                <Link to="/create-trip" className="dark:text-white hover:text-blue-600 transition">Create Trip</Link>
                <Link to="/manage-trips" className="dark:text-white hover:text-blue-600 transition">Manage Trips</Link>
              </>
            )}

            {isOperator && <Link to="/dashboard" className="dark:text-white hover:text-blue-600 transition">Dashboard</Link>}

            {user && (
              <>
                <Link to="/search-trips" className="dark:text-white hover:text-blue-600 transition">Book Trip</Link>
                <Link to="/my-bookings" className="dark:text-white hover:text-blue-600 transition">My Bookings</Link>
                <Link to="/notifications" className="dark:text-white hover:text-blue-600 transition relative">
                  <Bell size={18} />
                  {unreadCount > 0 && (
                    <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs rounded-full px-1.5 py-0.5">
                      {unreadCount}
                    </span>
                  )}
                </Link>
              </>
            )}

            {user ? (
              <button onClick={handleLogout} className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-200 hover:text-red-600">
                <LogOut size={18} /> Logout
              </button>
            ) : (
              <Link to="/auth" className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition">Sign In</Link>
            )}

            <button onClick={toggleTheme} className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800">
              {darkMode ? <Sun className="text-yellow-400" /> : <Moon />}
            </button>
          </div>

          <button onClick={() => setMobileOpen(!mobileOpen)} className="md:hidden dark:text-white">
            {mobileOpen ? <X /> : <Menu />}
          </button>
        </div>

        {mobileOpen && (
          <div className="md:hidden py-4 space-y-4">
            <Link to="/" className="block dark:text-white hover:text-blue-600 transition">Home</Link>
            <Link to="/fares" className="block dark:text-white hover:text-blue-600 transition">Fares</Link>
            <Link to="/localities" className="block dark:text-white hover:text-blue-600 transition">Localities</Link>

            {isAdmin && (
              <>
                <Link to="/create-fare" className="block dark:text-white hover:text-blue-600 transition">Create Fare</Link>
                <Link to="/admin/dashboard" className="block dark:text-white hover:text-blue-600 transition">Admin</Link>
              </>
            )}

            {canCreateTrip && (
              <>
                <Link to="/create-trip" className="block dark:text-white hover:text-blue-600 transition">Create Trip</Link>
                <Link to="/manage-trips" className="block dark:text-white hover:text-blue-600 transition">Manage Trips</Link>
              </>
            )}

            {isOperator && <Link to="/dashboard" className="block dark:text-white hover:text-blue-600 transition">Dashboard</Link>}

            {user ? (
              <>
                <Link to="/search-trips" className="block dark:text-white hover:text-blue-600 transition">Book Trip</Link>
                <Link to="/my-bookings" className="block dark:text-white hover:text-blue-600 transition">My Bookings</Link>
                <Link to="/notifications" className="block dark:text-white hover:text-blue-600 transition">Notifications {unreadCount > 0 && (<span className="ml-2 bg-red-600 text-white text-xs rounded-full px-2 py-0.5">{unreadCount}</span>)}</Link>
                <button onClick={handleLogout} className="block text-left dark:text-white hover:text-red-600 transition">Logout</button>
              </>
            ) : (
              <Link to="/auth" className="block dark:text-white hover:text-blue-600 transition">Sign In</Link>
            )}
          </div>
        )}
      </div>
    </nav>
  )
}

export default Navbar