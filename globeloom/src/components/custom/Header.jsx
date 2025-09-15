import React, { useState, useEffect } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { Button } from '../ui/button'
import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import { 
  GlobeAltIcon, 
  PlusIcon, 
  MapIcon, 
  UserIcon,
  ArrowRightOnRectangleIcon,
  Bars3Icon,
  XMarkIcon,
  SparklesIcon
} from '@heroicons/react/24/solid'

function Header() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const location = useLocation()
  const { scrollY } = useScroll()
  const { isAuthenticated, user, logout } = useAuth()
  
  const headerOpacity = useTransform(scrollY, [0, 100], [0.95, 1])
  const headerBlur = useTransform(scrollY, [0, 100], [0, 20])
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }
    
    const handleClickOutside = (event) => {
      if (mobileMenuOpen && !event.target.closest('header')) {
        setMobileMenuOpen(false)
      }
    }
    
    window.addEventListener('scroll', handleScroll)
    document.addEventListener('click', handleClickOutside)
    
    return () => {
      window.removeEventListener('scroll', handleScroll)
      document.removeEventListener('click', handleClickOutside)
    }
  }, [mobileMenuOpen])
  const navigationItems = [
    { name: 'Explore', href: '/explore', icon: MapIcon },
    { name: 'AI Planner', href: '/ai-recommendations', icon: SparklesIcon },
    { name: 'Countries', href: '/countries', icon: GlobeAltIcon },
    { name: 'Community', href: '/community', icon: UserIcon },
    { name: 'Pricing', href: '/pricing', icon: PlusIcon },
  ]

  return (
    <>
      <motion.header
        style={{ 
          opacity: headerOpacity,
          backdropFilter: `blur(${headerBlur}px)`,
        }}
        className={`
          fixed top-0 left-0 right-0 z-50 transition-all duration-500 ease-premium
          ${scrolled 
            ? 'bg-midnight-950/90 border-b border-platinum-800/20 shadow-platinum' 
            : 'bg-midnight-950/60'
          }
        `}
      >        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-14 sm:h-16 lg:h-18">            {/* Logo */}
            <Link to="/" className="flex items-center gap-2 lg:gap-3 group">
              <motion.div
                whileHover={{ scale: 1.1, rotate: 5 }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: "spring", stiffness: 400, damping: 17 }}
                className="relative"
              >
                <GlobeAltIcon className="w-6 h-6 sm:w-7 sm:h-7 lg:w-10 lg:h-10 text-aurora-400 group-hover:text-gold-400 transition-all duration-300" />
                <motion.div 
                  className="absolute inset-0 bg-aurora-400/20 rounded-full blur-md group-hover:bg-gold-400/30 transition-all duration-300"
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                />
              </motion.div>
              <div className="hidden sm:block">
                <h1 className="text-base sm:text-lg lg:text-2xl font-bold bg-gradient-to-r from-white via-platinum-200 to-aurora-300 bg-clip-text text-transparent">
                  GlobeLoom
                </h1>
                <p className="text-xs text-platinum-400 -mt-1 font-medium">Elite Travel</p>
              </div>
              <div className="sm:hidden">
                <h1 className="text-base font-bold bg-gradient-to-r from-white via-platinum-200 to-aurora-300 bg-clip-text text-transparent">
                  GL
                </h1>
              </div>
            </Link>{/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-1">
              {navigationItems.map((item, index) => {
                const isActive = location.pathname === item.href
                return (
                  <motion.div
                    key={item.name}
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1, duration: 0.4 }}
                  >
                    <Link 
                      to={item.href}
                      className={`
                        relative px-3 xl:px-4 py-2 rounded-xl font-medium text-sm transition-all duration-300 group
                        ${isActive 
                          ? 'text-aurora-300 bg-aurora-500/10' 
                          : 'text-platinum-300 hover:text-white hover:bg-white/5'
                        }
                      `}
                    >
                      <span className="relative z-10">{item.name}</span>
                      {isActive && (
                        <motion.div
                          layoutId="activeNavItem"
                          className="absolute inset-0 bg-gradient-to-r from-aurora-500/20 to-gold-500/20 rounded-xl border border-aurora-400/30"
                          transition={{ type: "spring", stiffness: 380, damping: 30 }}
                        />
                      )}
                    </Link>
                  </motion.div>
                )
              })}
            </nav>

            {/* Auth Buttons */}
            <div className="flex items-center gap-2 lg:gap-3">
              {!isAuthenticated ? (
                <>
                  <Link to="/sign-in" className="hidden md:block">
                    <Button 
                      variant="ghost" 
                      size="sm"
                      className="text-platinum-300 hover:text-white hover:bg-white/10 transition-all duration-300"
                    >
                      Sign In
                    </Button>
                  </Link>
                  <Link to="/sign-up" className="hidden sm:block">
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      transition={{ type: "spring", stiffness: 400, damping: 17 }}
                    >
                      <Button 
                        size="sm"
                        className="bg-gradient-to-r from-aurora-500 to-gold-500 hover:from-aurora-400 hover:to-gold-400 text-white font-semibold px-4 lg:px-6 py-2 rounded-xl shadow-aurora hover:shadow-gold-glow transition-all duration-300 text-sm"
                      >
                        <PlusIcon className="w-4 h-4 mr-1 lg:mr-2" />
                        <span className="hidden lg:inline">Get </span>Started
                      </Button>
                    </motion.div>
                  </Link>
                </>
              ) : (
                <div className="flex items-center gap-1 lg:gap-3">
                  {user && (
                    <span className="hidden xl:block text-sm text-platinum-300 mr-2 max-w-24 truncate">
                      Welcome, {user.name?.split(' ')[0] || 'User'}
                    </span>
                  )}
                  <Link to="/dashboard" className="hidden md:block">
                    <Button 
                      variant="ghost" 
                      size="sm"
                      className="text-platinum-300 hover:text-white hover:bg-white/10 transition-all duration-300"
                    >
                      <MapIcon className="w-4 h-4 lg:mr-2" />
                      <span className="hidden lg:inline">Dashboard</span>
                    </Button>
                  </Link>
                  <Link to="/create-trip">
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      transition={{ type: "spring", stiffness: 400, damping: 17 }}
                    >
                      <Button 
                        size="sm"
                        className="bg-gradient-to-r from-aurora-500 to-gold-500 hover:from-aurora-400 hover:to-gold-400 text-white font-semibold px-3 lg:px-4 py-2 rounded-xl shadow-aurora hover:shadow-gold-glow transition-all duration-300 text-sm"
                      >
                        <PlusIcon className="w-4 h-4 lg:mr-1" />
                        <span className="hidden lg:inline">Trip</span>
                      </Button>
                    </motion.div>
                  </Link>
                  <Link to="/profile" className="hidden sm:block">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="text-platinum-300 hover:text-white hover:bg-white/10 transition-all duration-300"
                    >
                      <UserIcon className="w-4 h-4" />
                    </Button>
                  </Link>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={logout}
                    className="hidden sm:block text-platinum-300 hover:text-white hover:bg-white/10 transition-all duration-300"
                    title="Sign out"
                  >
                    <ArrowRightOnRectangleIcon className="w-4 h-4" />
                  </Button>
                </div>
              )}

              {/* Mobile Menu Button */}
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden p-2 rounded-xl text-platinum-300 hover:text-white hover:bg-white/10 transition-all duration-300"
              >
                {mobileMenuOpen ? (
                  <XMarkIcon className="w-6 h-6" />
                ) : (
                  <Bars3Icon className="w-6 h-6" />
                )}
              </motion.button>
            </div>
          </div>
        </div>
      </motion.header>      {/* Mobile Menu */}
      <motion.div
        initial={{ opacity: 0, height: 0 }}
        animate={{ 
          opacity: mobileMenuOpen ? 1 : 0, 
          height: mobileMenuOpen ? 'auto' : 0 
        }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className="fixed top-14 sm:top-16 lg:top-18 left-0 right-0 z-40 lg:hidden bg-midnight-950/98 backdrop-blur-xl border-b border-platinum-800/20 overflow-hidden shadow-2xl"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
          <nav className="space-y-2">
            {navigationItems.map((item) => {
              const isActive = location.pathname === item.href
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`
                    flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300
                    ${isActive 
                      ? 'text-aurora-300 bg-aurora-500/10 border border-aurora-400/30' 
                      : 'text-platinum-300 hover:text-white hover:bg-white/10'
                    }
                  `}
                >
                  <item.icon className="w-5 h-5" />
                  {item.name}
                </Link>
              )
            })}

            {/* Mobile Auth Section */}
            <div className="pt-4 border-t border-platinum-800/20 space-y-2">
              {!isAuthenticated ? (
                <>
                  <Link
                    to="/sign-in"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 rounded-xl text-platinum-300 hover:text-white hover:bg-white/10 transition-all duration-300"
                  >
                    <ArrowRightOnRectangleIcon className="w-5 h-5" />
                    Sign In
                  </Link>
                  <Link
                    to="/sign-up"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 rounded-xl bg-gradient-to-r from-aurora-500 to-gold-500 text-white font-semibold shadow-aurora transition-all duration-300"
                  >
                    <PlusIcon className="w-5 h-5" />
                    Get Started
                  </Link>
                </>
              ) : (
                <>
                  {user && (
                    <div className="px-4 py-2 text-sm text-platinum-400 font-medium">
                      Welcome, {user.name?.split(' ')[0] || 'User'}!
                    </div>
                  )}
                  <Link
                    to="/dashboard"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 rounded-xl text-platinum-300 hover:text-white hover:bg-white/10 transition-all duration-300"
                  >
                    <MapIcon className="w-5 h-5" />
                    Dashboard
                  </Link>
                  <Link
                    to="/create-trip"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 rounded-xl bg-gradient-to-r from-aurora-500 to-gold-500 text-white font-semibold shadow-aurora transition-all duration-300"
                  >
                    <PlusIcon className="w-5 h-5" />
                    Create Trip
                  </Link>
                  <Link
                    to="/profile"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 rounded-xl text-platinum-300 hover:text-white hover:bg-white/10 transition-all duration-300"
                  >
                    <UserIcon className="w-5 h-5" />
                    Profile
                  </Link>
                  <button
                    onClick={() => {
                      logout()
                      setMobileMenuOpen(false)
                    }}
                    className="flex items-center gap-3 px-4 py-3 rounded-xl text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-all duration-300 w-full text-left"
                  >
                    <ArrowRightOnRectangleIcon className="w-5 h-5" />
                    Sign Out
                  </button>
                </>
              )}
            </div>
          </nav>
        </div>
      </motion.div>
    </>
  )
}

export default Header
