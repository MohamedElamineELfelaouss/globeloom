import React, { useState, useEffect, useMemo } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import apiService from '../services/apiService'
import {
  MapPinIcon,
  CalendarDaysIcon,
  GlobeAltIcon,
  CameraIcon,
  TrophyIcon,
  HeartIcon,
  ShareIcon,
  ClockIcon,
  PlusIcon,
  ArrowTrendingUpIcon,
  UsersIcon,
  StarIcon
} from '@heroicons/react/24/outline'

const Dashboard = () => {
  const { user } = useAuth()
  const [userTrips, setUserTrips] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Calculate user stats from real data
  const [stats, setStats] = useState([
    {
      label: 'Total Trips',
      value: 0,
      change: '+0',
      changeType: 'increase',
      icon: MapPinIcon,
      color: 'from-coral-500 to-sunset-500'
    },
    {
      label: 'Countries Visited',
      value: 0,
      change: '+0',
      changeType: 'increase',
      icon: GlobeAltIcon,
      color: 'from-aurora-500 to-ocean-500'
    },
    {
      label: 'Days Traveled',
      value: user.totalDays,
      change: '+12',
      changeType: 'increase',
      icon: CalendarDaysIcon,
      color: 'from-tropical-500 to-emerald-500'
    },
    {
      label: 'Travel Level',
      value: user.level,
      change: '+1',
      changeType: 'increase',
      icon: TrophyIcon,
      color: 'from-sunset-500 to-coral-600'
    }
  ])  // Recent trips from real data
  const recentTrips = useMemo(() => {
    if (!Array.isArray(userTrips)) {
      return []
    }
    return userTrips.slice(0, 3).map(trip => ({
      id: trip._id,
      title: trip.title,
      destination: trip.destination?.name || 'Unknown',
      startDate: trip.startDate,
      endDate: trip.endDate,
      status: trip.status || 'planning',
      image: trip.coverImage || '/placeholder.jpg',
      rating: trip.rating || 0,
      highlights: trip.activities?.slice(0, 3).map(activity => activity.title) || []
    }))
  }, [userTrips])

  const [recentActivity] = useState([
    {
      id: 1,
      type: 'trip_completed',
      message: 'completed Mediterranean Adventure',
      time: '2 hours ago',
      icon: TrophyIcon
    },
    {
      id: 2,
      type: 'photo_shared',
      message: 'shared 12 photos from Santorini',
      time: '1 day ago',
      icon: CameraIcon
    },
    {
      id: 3,
      type: 'badge_earned',
      message: 'earned "Island Explorer" badge',
      time: '2 days ago',
      icon: StarIcon
    },
    {
      id: 4,
      type: 'trip_started',
      message: 'started Northern Lights Quest',
      time: '3 days ago',
      icon: MapPinIcon
    }
  ])
  const [quickActions] = useState([
    {
      title: 'Plan New Trip',
      description: 'Start planning your next adventure',
      icon: PlusIcon,
      link: '/create-trip',
      color: 'from-coral-500 to-sunset-500'
    },
    {
      title: 'Explore Countries',
      description: 'Discover amazing countries to visit',
      icon: GlobeAltIcon,
      link: '/countries',
      color: 'from-aurora-500 to-ocean-500'
    },
    {
      title: 'Join Community',
      description: 'Connect with fellow travelers',
      icon: UsersIcon,
      link: '/community',
      color: 'from-tropical-500 to-emerald-500'
    }
  ])// Fetch user trips data
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true)
        
        // Fetch user trips from backend
        const response = await apiService.getTrips()
        console.log('Dashboard API response:', response)
        
        if (response.success) {
          const trips = Array.isArray(response.data) ? response.data : []
          console.log('Processed trips:', trips)
          setUserTrips(trips)
            // Calculate stats from real trip data
          const completedTrips = trips.filter(trip => trip.status === 'completed')
          const uniqueCountries = new Set(trips.map(trip => trip.destination?.country).filter(Boolean))
          const totalDays = trips.reduce((sum, trip) => {
            if (trip.startDate && trip.endDate) {
              const start = new Date(trip.startDate)
              const end = new Date(trip.endDate)
              const diffTime = Math.abs(end - start)
              const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
              return sum + diffDays
            }
            return sum
          }, 0)

          // Update stats with real data
          setStats([
            {
              label: 'Total Trips',
              value: trips.length,
              change: `+${Math.min(trips.length, 5)}`,
              changeType: 'increase',
              icon: MapPinIcon,
              color: 'from-coral-500 to-sunset-500'
            },
            {
              label: 'Countries Visited',
              value: uniqueCountries.size,
              change: `+${Math.min(uniqueCountries.size, 3)}`,
              changeType: 'increase',
              icon: GlobeAltIcon,
              color: 'from-aurora-500 to-ocean-500'
            },
            {
              label: 'Days Traveled',
              value: totalDays,
              change: `+${Math.min(totalDays, 20)}`,
              changeType: 'increase',
              icon: CalendarDaysIcon,
              color: 'from-tropical-500 to-emerald-500'
            },
            {
              label: 'Completed Trips',
              value: completedTrips.length,
              change: `+${Math.min(completedTrips.length, 3)}`,
              changeType: 'increase',
              icon: TrophyIcon,
              color: 'from-sunset-500 to-coral-600'
            }
          ])
        } else {
          setError('Failed to load trips')
        }
      } catch (error) {
        console.error('Error fetching user data:', error)
        setError('Failed to load dashboard data')
      } finally {
        setLoading(false)
      }
    }

    if (user) {
      fetchUserData()
    }
  }, [user])
  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {loading ? (
          <div className="min-h-screen flex items-center justify-center">
            <div className="text-center">
              <svg className="animate-spin h-12 w-12 text-coral-500 mx-auto mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <p className="text-ocean-300">Loading your dashboard...</p>
            </div>
          </div>
        ) : error ? (
          <div className="min-h-screen flex items-center justify-center">
            <div className="text-center">
              <p className="text-red-400 mb-4">{error}</p>
              <button 
                onClick={() => window.location.reload()} 
                className="px-4 py-2 bg-coral-500 text-white rounded-lg hover:bg-coral-600 transition-colors"
              >
                Retry
              </button>
            </div>
          </div>
        ) : (
        <>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">Welcome back, {user?.name || 'Traveler'}!</h1>
              <p className="text-ocean-300">Ready for your next adventure?</p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm text-ocean-300">Total Trips</p>
                <p className="text-2xl font-bold text-coral-400">{userTrips.length}</p>
              </div>
              <div className="w-16 h-16 rounded-full bg-gradient-to-r from-coral-500 to-sunset-500 p-0.5">
                <img
                  src={user?.avatar || '/placeholder.jpg'}
                  alt={user?.name || 'User'}
                  className="w-full h-full rounded-full object-cover"
                />
              </div>
            </div>
          </div>
        </motion.div>

        {/* Stats Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
        >
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 * index, duration: 0.5 }}
              className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20 hover:bg-white/20 transition-all duration-300"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-lg bg-gradient-to-r ${stat.color}`}>
                  <stat.icon className="w-6 h-6 text-white" />
                </div>
                <div className={`text-sm font-medium px-2 py-1 rounded-full ${
                  stat.changeType === 'increase' 
                    ? 'text-emerald-400 bg-emerald-400/20' 
                    : 'text-red-400 bg-red-400/20'
                }`}>
                  {stat.change}
                </div>
              </div>
              <h3 className="text-2xl font-bold text-white mb-1">{stat.value}</h3>
              <p className="text-ocean-300 text-sm">{stat.label}</p>
            </motion.div>
          ))}
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recent Trips */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="lg:col-span-2"
          >
            <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-white">Recent Trips</h2>
                <Link
                  to="/my-trips"
                  className="text-coral-400 hover:text-coral-300 text-sm font-medium transition-colors"
                >
                  View all
                </Link>
              </div>
              <div className="space-y-4">
                {recentTrips.map((trip, index) => (
                  <motion.div
                    key={trip.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 * index, duration: 0.5 }}
                    className="flex items-center space-x-4 p-4 bg-white/5 rounded-lg border border-white/10 hover:bg-white/10 transition-all duration-300"
                  >
                    <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
                      <img
                        src={trip.image}
                        alt={trip.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-white truncate">{trip.title}</h3>
                      <p className="text-ocean-300 text-sm">{trip.destination}</p>
                      <div className="flex items-center space-x-4 mt-2">
                        <div className="flex items-center space-x-1 text-xs text-ocean-400">
                          <CalendarDaysIcon className="w-4 h-4" />
                          <span>{new Date(trip.startDate).toLocaleDateString()}</span>
                        </div>
                        {trip.status === 'completed' && trip.rating && (
                          <div className="flex items-center space-x-1">
                            {[...Array(trip.rating)].map((_, i) => (
                              <StarIcon key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                            ))}
                          </div>
                        )}
                        {trip.status === 'active' && trip.progress && (
                          <div className="flex items-center space-x-2">
                            <div className="w-16 h-1.5 bg-white/20 rounded-full overflow-hidden">
                              <div
                                className="h-full bg-gradient-to-r from-coral-500 to-sunset-500 rounded-full transition-all duration-300"
                                style={{ width: `${trip.progress}%` }}
                              />
                            </div>
                            <span className="text-xs text-coral-400">{trip.progress}%</span>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                      trip.status === 'completed' 
                        ? 'bg-emerald-400/20 text-emerald-400'
                        : trip.status === 'active'
                        ? 'bg-coral-400/20 text-coral-400'
                        : 'bg-ocean-400/20 text-ocean-400'
                    }`}>
                      {trip.status}
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Sidebar */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6, duration: 0.6 }}
            className="space-y-6"
          >
            {/* Quick Actions */}
            <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
              <h2 className="text-lg font-bold text-white mb-4">Quick Actions</h2>              <div className="space-y-3">
                {quickActions.map((action) => (
                  <motion.div
                    key={action.title}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Link
                      to={action.link}
                      className="flex items-center space-x-3 p-3 bg-white/5 rounded-lg border border-white/10 hover:bg-white/10 transition-all duration-300"
                    >
                      <div className={`p-2 rounded-lg bg-gradient-to-r ${action.color}`}>
                        <action.icon className="w-5 h-5 text-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-white text-sm">{action.title}</h3>
                        <p className="text-ocean-300 text-xs truncate">{action.description}</p>
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
              <h2 className="text-lg font-bold text-white mb-4">Recent Activity</h2>
              <div className="space-y-3">
                {recentActivity.map((activity, index) => (
                  <motion.div
                    key={activity.id}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 * index, duration: 0.5 }}
                    className="flex items-start space-x-3"
                  >
                    <div className="p-2 rounded-lg bg-gradient-to-r from-coral-500/20 to-sunset-500/20 flex-shrink-0">
                      <activity.icon className="w-4 h-4 text-coral-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-white text-sm">
                        You <span className="text-coral-400">{activity.message}</span>
                      </p>
                      <p className="text-ocean-400 text-xs mt-1">{activity.time}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Achievement Progress */}
            <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
              <h2 className="text-lg font-bold text-white mb-4">Next Achievement</h2>
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r from-coral-500 to-sunset-500 flex items-center justify-center">
                  <TrophyIcon className="w-8 h-8 text-white" />
                </div>
                <h3 className="font-semibold text-white mb-2">Continental Explorer</h3>
                <p className="text-ocean-300 text-sm mb-3">Visit 5 different continents</p>
                <div className="w-full h-2 bg-white/20 rounded-full overflow-hidden mb-2">
                  <div className="h-full bg-gradient-to-r from-coral-500 to-sunset-500 rounded-full w-3/5" />
                </div>
                <p className="text-xs text-coral-400">3 of 5 continents</p>
              </div>            </div>
          </motion.div>
        </div>
        </>
        )}
      </div>
    </div>
  )
}

export default Dashboard
