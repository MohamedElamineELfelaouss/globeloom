import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { Button } from '../components/ui/button'
import apiService from '../services/apiService'
import { 
  PlusIcon,
  MapIcon,
  CalendarIcon,
  UserGroupIcon,
  CurrencyDollarIcon,
  StarIcon,
  EllipsisVerticalIcon,
  PencilIcon,
  TrashIcon,
  ShareIcon,
  EyeIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/solid'

function MyTrips() {
  const [activeTab, setActiveTab] = useState('active')
  const [showMenu, setShowMenu] = useState(null)
  const [trips, setTrips] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Fetch user trips
  useEffect(() => {
    fetchTrips()
  }, [])

  const fetchTrips = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await apiService.getTrips()
      
      if (response.success) {
        const tripsData = Array.isArray(response.data) ? response.data : []
        setTrips(tripsData)
      } else {
        setError('Failed to load trips')
      }
    } catch (error) {
      console.error('Error fetching trips:', error)
      setError('Failed to load trips')
    } finally {
      setLoading(false)
    }
  }

  const deleteTrip = async (tripId) => {
    if (!confirm('Are you sure you want to delete this trip?')) return
    
    try {
      const response = await apiService.deleteTrip(tripId)
      
      if (response.success) {
        setTrips(prev => prev.filter(trip => trip._id !== tripId))
        setShowMenu(null)
      } else {
        alert('Failed to delete trip')
      }
    } catch (error) {
      console.error('Error deleting trip:', error)
      alert('Failed to delete trip')
    }
  }

  // Filter trips by status
  const getFilteredTrips = () => {
    if (!Array.isArray(trips)) return []
    
    switch (activeTab) {
      case 'active':
        return trips.filter(trip => trip.status === 'planning' || trip.status === 'upcoming')
      case 'completed':
        return trips.filter(trip => trip.status === 'completed')
      case 'all':
      default:
        return trips
    }
  }

  const formatDate = (date) => {
    if (!date) return 'TBD'
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    })
  }

  const formatDateRange = (startDate, endDate) => {
    if (!startDate || !endDate) return 'Planning...'
    return `${formatDate(startDate)} - ${formatDate(endDate)}`
  }

  // Get destination emoji based on location
  const getDestinationEmoji = (destination) => {
    if (!destination) return '✈️'
    const lower = destination.toLowerCase()
    if (lower.includes('bali') || lower.includes('indonesia')) return '🏝️'
    if (lower.includes('tokyo') || lower.includes('japan')) return '🏙️'
    if (lower.includes('paris') || lower.includes('france')) return '🗼'
    if (lower.includes('iceland')) return '🌌'
    if (lower.includes('africa') || lower.includes('kenya') || lower.includes('safari')) return '🦁'
    if (lower.includes('beach') || lower.includes('ocean')) return '🏖️'
    if (lower.includes('mountain') || lower.includes('hill')) return '⛰️'
    if (lower.includes('city')) return '🏙️'
    return '✈️'
  }

  // Get gradient based on destination or random
  const getGradient = (destination, index) => {
    const gradients = [
      'from-orange-400 to-pink-500',
      'from-indigo-500 to-purple-500',
      'from-purple-500 to-blue-500',
      'from-blue-600 to-teal-500',
      'from-yellow-500 to-orange-500',
      'from-green-500 to-blue-500',
      'from-pink-500 to-red-500',
      'from-teal-500 to-green-500'
    ]
    return gradients[index % gradients.length]
  }

  // Calculate trip duration in days
  const getTripDuration = (startDate, endDate) => {
    if (!startDate || !endDate) return 0
    const start = new Date(startDate)
    const end = new Date(endDate)
    const diffTime = Math.abs(end - start)
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  }

  // Calculate statistics
  const getStats = () => {
    const totalTrips = trips.length
    const completedTrips = trips.filter(t => t.status === 'completed')
    const totalDays = completedTrips.reduce((total, trip) => {
      return total + getTripDuration(trip.startDate, trip.endDate)
    }, 0)
    
    // Count unique countries (simplified - just count destinations)
    const uniqueDestinations = new Set(completedTrips.map(t => t.destination?.split(',')[0]?.trim()))
    
    return {
      totalTrips,
      completedTrips: completedTrips.length,
      totalDays,
      countriesVisited: uniqueDestinations.size
    }
  }

  const stats = getStats()
  
  const tabs = [
    { id: 'active', label: 'Active Trips', count: getFilteredTrips().length },
    { id: 'completed', label: 'Completed', count: trips.filter(t => t.status === 'completed').length },
    { id: 'all', label: 'All Trips', count: trips.length }
  ]

  const getStatusBadge = (status) => {
    const styles = {
      upcoming: 'bg-aurora-500/20 text-aurora-300 border-aurora-500/30',
      planning: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30',
      completed: 'bg-green-500/20 text-green-300 border-green-500/30',
      draft: 'bg-gray-500/20 text-gray-300 border-gray-500/30'
    }
    
    return (
      <span className={`px-2 py-1 text-xs rounded-full border ${styles[status] || styles.draft} capitalize`}>
        {status}
      </span>
    )
  }

  const TripCard = ({ trip, index }) => {
    const gradient = getGradient(trip.destination, index)
    const emoji = getDestinationEmoji(trip.destination)
    const dateRange = formatDateRange(trip.startDate, trip.endDate)
    const budget = trip.budget ? `$${trip.budget}` : 'TBD'
    const travelers = trip.travelers || 1

    return (
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: index * 0.1 }}
        whileHover={{ y: -5 }}
        className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm rounded-3xl overflow-hidden border border-white/20 group"
      >
        {/* Trip Header */}
        <div className={`relative h-32 bg-gradient-to-br ${gradient} flex items-center justify-center`}>
          <div className="text-4xl">{emoji}</div>
          <div className="absolute top-4 right-4">
            <div className="relative">
              <button
                onClick={() => setShowMenu(showMenu === trip._id ? null : trip._id)}
                className="p-2 bg-white/20 text-white rounded-full backdrop-blur-sm hover:bg-white/30 transition-colors duration-200"
              >
                <EllipsisVerticalIcon className="w-4 h-4" />
              </button>
              
              {showMenu === trip._id && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="absolute right-0 top-12 bg-white/10 backdrop-blur-md rounded-xl border border-white/20 py-2 min-w-[150px] z-10"
                >
                  <Link 
                    to={`/trip/${trip._id}`}
                    className="w-full px-4 py-2 text-left text-white hover:bg-white/10 flex items-center gap-2"
                  >
                    <EyeIcon className="w-4 h-4" />
                    View Details
                  </Link>
                  <Link 
                    to={`/trip/${trip._id}/edit`}
                    className="w-full px-4 py-2 text-left text-white hover:bg-white/10 flex items-center gap-2"
                  >
                    <PencilIcon className="w-4 h-4" />
                    Edit Trip
                  </Link>
                  <button className="w-full px-4 py-2 text-left text-white hover:bg-white/10 flex items-center gap-2">
                    <ShareIcon className="w-4 h-4" />
                    Share Trip
                  </button>
                  <button 
                    onClick={() => deleteTrip(trip._id)}
                    className="w-full px-4 py-2 text-left text-red-300 hover:bg-white/10 flex items-center gap-2"
                  >
                    <TrashIcon className="w-4 h-4" />
                    Delete
                  </button>
                </motion.div>
              )}
            </div>
          </div>
          
          <div className="absolute top-4 left-4">
            {getStatusBadge(trip.status)}
          </div>
        </div>

        {/* Trip Content */}
        <div className="p-6">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-xl font-bold text-white group-hover:text-aurora-300 transition-colors duration-200">
              {trip.title}
            </h3>
            {trip.rating && (
              <div className="flex items-center gap-1">
                <StarIcon className="w-4 h-4 text-yellow-400" />
                <span className="text-white/80 text-sm">{trip.rating}</span>
              </div>
            )}
          </div>

          <div className="space-y-3 mb-4">
            <div className="flex items-center gap-2 text-sm text-white/70">
              <MapIcon className="w-4 h-4" />
              <span>{trip.destination || 'Destination TBD'}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-white/70">
              <CalendarIcon className="w-4 h-4" />
              <span>{dateRange}</span>
            </div>
            <div className="flex items-center justify-between text-sm text-white/70">
              <div className="flex items-center gap-2">
                <UserGroupIcon className="w-4 h-4" />
                <span>{travelers} {travelers === 1 ? 'traveler' : 'travelers'}</span>
              </div>
              <div className="flex items-center gap-2">
                <CurrencyDollarIcon className="w-4 h-4" />
                <span className="text-coral-300 font-semibold">{budget}</span>
              </div>
            </div>
          </div>

          {/* Progress Bar for Active Trips - simplified to show completion status */}
          {(trip.status === 'planning' || trip.status === 'upcoming') && (
            <div className="mb-4">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-white/70">Planning Progress</span>
                <span className="text-sm text-aurora-300 font-semibold">
                  {trip.status === 'planning' ? '50%' : '90%'}
                </span>
              </div>
              <div className="w-full bg-white/20 rounded-full h-2">
                <div 
                  className="bg-gradient-to-r from-aurora-500 to-coral-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: trip.status === 'planning' ? '50%' : '90%' }}
                />
              </div>
            </div>
          )}

          <div className="flex gap-2">
            <Link 
              to={`/trip/${trip._id}`}
              className="flex-1"
            >
              <Button className="w-full bg-gradient-to-r from-aurora-500/20 to-coral-500/20 hover:from-aurora-500/30 hover:to-coral-500/30 text-white border border-aurora-500/30 rounded-xl">
                {trip.status === 'completed' ? 'View Trip' : 'Continue Planning'}
              </Button>
            </Link>
          </div>
        </div>
      </motion.div>
    )
  }

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen pt-24 pb-16 px-4 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-aurora-500/30 border-t-aurora-500 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white/70">Loading your trips...</p>
        </div>
      </div>
    )
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen pt-24 pb-16 px-4 flex items-center justify-center">
        <div className="text-center">
          <ExclamationTriangleIcon className="w-16 h-16 text-red-400 mx-auto mb-4" />
          <h3 className="text-2xl font-bold text-white mb-2">Failed to load trips</h3>
          <p className="text-white/70 mb-6">{error}</p>
          <Button 
            onClick={fetchTrips}
            className="bg-gradient-to-r from-aurora-500 to-coral-500 hover:from-aurora-600 hover:to-coral-600 text-white px-6 py-3 rounded-xl"
          >
            Try Again
          </Button>
        </div>
      </div>
    )
  }

  const filteredTrips = getFilteredTrips()

  return (
    <div className="min-h-screen pt-24 pb-16 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <div className="flex items-center justify-center gap-4 mb-6">
            <div className="p-3 bg-gradient-to-r from-aurora-500 to-coral-500 rounded-2xl">
              <MapIcon className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-5xl font-bold bg-gradient-to-r from-white to-aurora-300 bg-clip-text text-transparent">
              My Trips
            </h1>
          </div>
          
          <p className="text-xl text-white/70 max-w-2xl mx-auto">
            Manage your travel adventures, track planning progress, and relive your memories
          </p>
        </motion.div>

        {/* Stats Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="grid md:grid-cols-4 gap-6 mb-12"
        >
          <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
            <div className="text-3xl font-bold text-aurora-300 mb-2">
              {stats.totalTrips}
            </div>
            <div className="text-white/70">Total Trips</div>
          </div>
          <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
            <div className="text-3xl font-bold text-green-300 mb-2">{stats.completedTrips}</div>
            <div className="text-white/70">Completed</div>
          </div>
          <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
            <div className="text-3xl font-bold text-coral-300 mb-2">
              {stats.totalDays}
            </div>
            <div className="text-white/70">Days Traveled</div>
          </div>
          <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
            <div className="text-3xl font-bold text-yellow-300 mb-2">{stats.countriesVisited}</div>
            <div className="text-white/70">Countries Visited</div>
          </div>
        </motion.div>

        {/* Action Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex flex-col md:flex-row justify-between items-center gap-4 mb-8"
        >
          {/* Tabs */}
          <div className="flex bg-white/10 rounded-xl p-1 backdrop-blur-sm border border-white/20">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`
                  px-4 py-2 rounded-lg transition-all duration-200 flex items-center gap-2
                  ${activeTab === tab.id
                    ? 'bg-gradient-to-r from-aurora-500 to-coral-500 text-white'
                    : 'text-white/70 hover:text-white'
                  }
                `}
              >
                {tab.label}
                <span className="bg-white/20 px-2 py-0.5 rounded-full text-xs">
                  {tab.count}
                </span>
              </button>
            ))}
          </div>

          {/* Create Trip Button */}
          <Link to="/create-trip">
            <Button className="bg-gradient-to-r from-aurora-500 to-coral-500 hover:from-aurora-600 hover:to-coral-600 text-white px-6 py-3 rounded-xl font-semibold">
              <PlusIcon className="w-5 h-5 mr-2" />
              Create New Trip
            </Button>
          </Link>
        </motion.div>

        {/* Trips Grid */}
        {filteredTrips.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredTrips.map((trip, index) => (
              <TripCard key={trip._id} trip={trip} index={index} />
            ))}
          </div>
        ) : (
          /* Empty State */
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16"
          >
            <div className="text-6xl mb-4">✈️</div>
            <h3 className="text-2xl font-bold text-white mb-2">
              {activeTab === 'completed' ? 'No completed trips yet' : 
               activeTab === 'active' ? 'No active trips' : 'No trips found'}
            </h3>
            <p className="text-white/70 mb-6">
              {activeTab === 'completed' 
                ? 'Complete your first trip to see it here!' 
                : 'Start planning your next adventure!'
              }
            </p>
            <Link to="/create-trip">
              <Button className="bg-gradient-to-r from-aurora-500 to-coral-500 hover:from-aurora-600 hover:to-coral-600 text-white px-6 py-3 rounded-xl">
                <PlusIcon className="w-5 h-5 mr-2" />
                {trips.length === 0 ? 'Create Your First Trip' : 'Create New Trip'}
              </Button>
            </Link>
          </motion.div>
        )}
      </div>
    </div>
  )
}

export default MyTrips
