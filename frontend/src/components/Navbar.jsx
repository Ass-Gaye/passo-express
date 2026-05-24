import { useState } from 'react'

import {
  Menu,
  X,
  Moon,
  Sun
} from 'lucide-react'

import { Link } from 'react-router-dom'

import { useTheme } from '../context/ThemeContext'


const Navbar = () => {

  const [mobileOpen, setMobileOpen] = useState(false)

  const { darkMode, toggleTheme } = useTheme()


  return (

    <nav className="bg-white dark:bg-gray-900 shadow sticky top-0 z-50">

      <div className="max-w-7xl mx-auto px-6">

        <div className="flex items-center justify-between h-16">

          {/* LOGO */}

          <Link
            to="/"
            className="text-2xl font-bold dark:text-white"
          >
            PASSO Express
          </Link>


          {/* DESKTOP MENU */}

          <div className="hidden md:flex items-center gap-6">

            <Link
              to="/"
              className="
                dark:text-white
                hover:text-blue-600
                transition
              "
            >
              Home
            </Link>

            <Link
              to="/fares"
              className="
                dark:text-white
                hover:text-blue-600
                transition
              "
            >
              Fares
            </Link>

            <Link
              to="/localities"
              className="
                dark:text-white
                hover:text-blue-600
                transition
              "
            >
              Localities
            </Link>

            <Link
              to="/create-fare"
              className="
                dark:text-white
                hover:text-blue-600
                transition
              "
            >
              Create Fare
            </Link>

            <Link
                to="/dashboard"
                className="
                    dark:text-white
                    hover:text-blue-600
                    transition
                "
                >
                Dashboard
                </Link>


            {/* THEME BUTTON */}

            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800"
            >

              {darkMode
                ? <Sun className="text-yellow-400" />
                : <Moon />
              }

            </button>

          </div>


          {/* MOBILE BUTTON */}

          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden dark:text-white"
          >

            {mobileOpen
              ? <X />
              : <Menu />
            }

          </button>

        </div>


        {/* MOBILE MENU */}

        {mobileOpen && (

          <div className="md:hidden py-4 space-y-4">

            <Link
              to="/"
              className="
                block
                dark:text-white
                hover:text-blue-600
                transition
              "
            >
              Home
            </Link>

            <Link
              to="/fares"
              className="
                block
                dark:text-white
                hover:text-blue-600
                transition
              "
            >
              Fares
            </Link>

            <Link
              to="/localities"
              className="
                block
                dark:text-white
                hover:text-blue-600
                transition
              "
            >
              Localities
            </Link>

            <Link
              to="/create-fare"
              className="
                block
                dark:text-white
                hover:text-blue-600
                transition
              "
            >
              Create Fare
            </Link>

            <Link
            to="/dashboard"
            className="
                block
                dark:text-white
                hover:text-blue-600
                transition
                "
                >
                Dashboard
            </Link>

          </div>

        )}

      </div>

    </nav>
  )
}

export default Navbar