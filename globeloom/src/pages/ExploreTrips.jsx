import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import apiService from '../services/apiService'
import {
  MagnifyingGlassIcon,
  MapPinIcon,
  CalendarDaysIcon,
  HeartIcon,
  ShareIcon,
  BookmarkIcon,
  EyeIcon,
  UserIcon,
  CurrencyDollarIcon,
  FunnelIcon,
  SparklesIcon,
  GlobeAltIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline'
import {
  HeartIcon as HeartSolid,
  BookmarkIcon as BookmarkSolid
} from '@heroicons/react/24/solid'

const ExploreTrips = () => {
  const { user } = useAuth()
  const [trips, setTrips] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedFilter, setSelectedFilter] = useState('all')
  const [showFilters, setShowFilters] = useState(false)
  const [likedTrips, setLikedTrips] = useState(new Set())
  const [savedTrips, setSavedTrips] = useState(new Set())

  const filters = [
    { id: 'all', label: 'All Trips', icon: GlobeAltIcon },
    { id: 'popular', label: 'Popular', icon: SparklesIcon },
    { id: 'recent', label: 'Recent', icon: CalendarDaysIcon },
    { id: 'budget', label: 'Budget Friendly', icon: CurrencyDollarIcon },
    { id: 'luxury', label: 'Luxury', icon: SparklesIcon }
  ]

  useEffect(() => {
    fetchPublicTrips()
  }, [])

  const fetchPublicTrips = async () => {
    try {
      setLoading(true)
      setError(null)
      
      // For now, we'll use the same trips endpoint but filter for public trips
      const response = await apiService.getTrips()
      
      if (response.success) {
        const publicTrips = Array.isArray(response.data) 
          ? response.data.filter(trip => trip.visibility === 'public') 
          : []
        setTrips(publicTrips)
      } else {
        setTrips([])
      }
    } catch (error) {
      console.error('Error fetching public trips:', error)
      setError('Failed to load trips')
      setTrips([])
    } finally {
      setLoading(false)
    }
  }

  const handleLike = async (tripId) => {
    if (!user) return
    
    try {
      const response = await apiService.likeTrip(tripId)
      if (response.success) {
        setLikedTrips(prev => {
          const newLiked = new Set(prev)
          if (newLiked.has(tripId)) {
            newLiked.delete(tripId)
          } else {
            newLiked.add(tripId)
          }
          return newLiked
        })
        
        // Update trip likes count
        setTrips(prev => prev.map(trip => 
          trip._id === tripId 
            ? { 
                ...trip, 
                likesCount: likedTrips.has(tripId) 
                  ? (trip.likesCount || 0) - 1 
                  : (trip.likesCount || 0) + 1 
              }
            : trip
        ))
      }
    } catch (error) {
      console.error('Error liking trip:', error)
    }
  }

  const handleSave = async (tripId) => {
    if (!user) return
    
    try {
      const response = await apiService.saveTrip(tripId)
      if (response.success) {
        setSavedTrips(prev => {
          const newSaved = new Set(prev)
          if (newSaved.has(tripId)) {
            newSaved.delete(tripId)
          } else {
            newSaved.add(tripId)
          }
          return newSaved
        })
      }
    } catch (error) {
      console.error('Error saving trip:', error)
    }
  }

  const handleShare = async (trip) => {
    const shareUrl = `${window.location.origin}/trip/${trip._id}`
    const shareText = `Check out this amazing trip: ${trip.title} to ${trip.destination}`
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: trip.title,
          text: shareText,
          url: shareUrl
        })
      } catch (error) {
        console.log('Error sharing:', error)
      }
    } else {
      // Fallback to clipboard
      try {
        await navigator.clipboard.writeText(shareUrl)
        // You could show a toast notification here
        alert('Link copied to clipboard!')
      } catch (error) {
        console.log('Error copying to clipboard:', error)
      }
    }
  }

  const getFilteredTrips = () => {
    let filteredTrips = Array.isArray(trips) ? [...trips] : []
    
    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      filteredTrips = filteredTrips.filter(trip => 
        trip.title?.toLowerCase().includes(query) ||
        trip.destination?.toLowerCase().includes(query) ||
        trip.description?.toLowerCase().includes(query)
      )
    }
    
    // Apply category filter
    switch (selectedFilter) {
      case 'popular':
        filteredTrips.sort((a, b) => (b.likesCount || 0) - (a.likesCount || 0))
        break
      case 'recent':
        filteredTrips.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0))
        break
      case 'budget':
        filteredTrips = filteredTrips.filter(trip => {
          const budget = parseFloat(trip.budget || 0)
          return budget < 1000 || !trip.budget
        })
        break
      case 'luxury':
        filteredTrips = filteredTrips.filter(trip => {
          const budget = parseFloat(trip.budget || 0)
          return budget >= 2000
        })
        break
      default:
        // 'all' - no additional filtering
        break
    }
    
    return filteredTrips
  }

  const formatDate = (date) => {
    if (!date) return 'TBD'
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    })
  }

  const getDuration = (startDate, endDate) => {
    if (!startDate || !endDate) return 0
    const start = new Date(startDate)
    const end = new Date(endDate)
    const diffTime = Math.abs(end - start)
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  }

  const getDestinationEmoji = (destination) => {
    if (!destination) return '✈️'
    const lower = destination.toLowerCase()
    if (lower.includes('paris')) return '🗼'
    if (lower.includes('tokyo')) return '🏮'
    if (lower.includes('bali')) return '🏝️'
    if (lower.includes('new york')) return '🗽'
    if (lower.includes('london')) return '🎡'
    if (lower.includes('dubai')) return '🏗️'
    if (lower.includes('sydney')) return '🏙️'
    if (lower.includes('beach')) return '🏖️'
    if (lower.includes('mountain')) return '⛰️'
    return '✈️'
  }

  const TripCard = ({ trip, index }) => {
    const isLiked = likedTrips.has(trip._id)
    const isSaved = savedTrips.has(trip._id)
    const duration = getDuration(trip.startDate, trip.endDate)
    const emoji = getDestinationEmoji(trip.destination)

    return (
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: index * 0.1 }}
        className="bg-white/10 backdrop-blur-sm rounded-2xl overflow-hidden border border-white/20 group hover:bg-white/15 transition-all duration-300"
      >
        {/* Trip Image/Header */}
        <div className="relative h-48 bg-gradient-to-br from-aurora-500 via-coral-500 to-sunset-500 flex items-center justify-center">
          <div className="text-6xl">{emoji}</div>
          
          {/* Action Buttons */}
          <div className="absolute top-4 right-4 flex space-x-2">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => handleLike(trip._id)}
              className={`p-2 rounded-full backdrop-blur-sm transition-all duration-200 ${
                isLiked 
                  ? 'bg-red-500/30 text-red-300' 
                  : 'bg-white/20 text-white hover:bg-white/30'
              }`}
            >
              {isLiked ? <HeartSolid className="w-4 h-4" /> : <HeartIcon className="w-4 h-4" />}
            </motion.button>
            
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => handleSave(trip._id)}
              className={`p-2 rounded-full backdrop-blur-sm transition-all duration-200 ${
                isSaved 
                  ? 'bg-aurora-500/30 text-aurora-300' 
                  : 'bg-white/20 text-white hover:bg-white/30'
              }`}
            >
              {isSaved ? <BookmarkSolid className="w-4 h-4" /> : <BookmarkIcon className="w-4 h-4" />}
            </motion.button>
            
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => handleShare(trip)}
              className="p-2 rounded-full bg-white/20 text-white hover:bg-white/30 backdrop-blur-sm transition-all duration-200"
            >
              <ShareIcon className="w-4 h-4" />
            </motion.button>
          </div>

          {/* Trip Stats */}
          <div className="absolute bottom-4 left-4 right-4">
            <div className="flex items-center justify-between text-white/90 text-sm">
              <div className="flex items-center space-x-3">
                <div className="flex items-center space-x-1">
                  <HeartIcon className="w-4 h-4" />
                  <span>{trip.likesCount || 0}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <EyeIcon className="w-4 h-4" />
                  <span>{trip.viewsCount || 0}</span>
                </div>
              </div>
              {duration > 0 && (
                <span className="bg-white/20 px-2 py-1 rounded-full text-xs">
                  {duration} days
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Trip Content */}
        <div className="p-6">
          <div className="flex items-start justify-between mb-3">
            <h3 className="text-xl font-bold text-white group-hover:text-aurora-300 transition-colors">
              {trip.title}
            </h3>
            {trip.budget && (
              <span className="text-coral-300 font-semibold text-sm">
                ${trip.budget}
              </span>
            )}
          </div>

          <div className="space-y-2 mb-4">
            <div className="flex items-center gap-2 text-sm text-white/70">
              <MapPinIcon className="w-4 h-4" />
              <span>{trip.destination}</span>
            </div>
            
            {trip.startDate && (
              <div className="flex items-center gap-2 text-sm text-white/70">
                <CalendarDaysIcon className="w-4 h-4" />
                <span>{formatDate(trip.startDate)}</span>
              </div>
            )}

            <div className="flex items-center gap-2 text-sm text-white/70">
              <UserIcon className="w-4 h-4" />
              <span>By {trip.createdBy?.displayName || 'Anonymous'}</span>
            </div>
          </div>

          {trip.description && (
            <p className="text-white/60 text-sm mb-4 line-clamp-2">
              {trip.description}
            </p>
          )}

          {trip.interests && trip.interests.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {trip.interests.slice(0, 3).map((interest, idx) => (
                <span 
                  key={idx}
                  className="px-2 py-1 bg-aurora-500/20 text-aurora-300 rounded-full text-xs"
                >
                  {interest}
                </span>
              ))}
              {trip.interests.length > 3 && (
                <span className="px-2 py-1 bg-white/10 text-white/60 rounded-full text-xs">
                  +{trip.interests.length - 3} more
                </span>
              )}
            </div>
          )}

          <Link 
            to={`/trip/${trip._id}`}
            className="block w-full"
          >
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full py-3 bg-gradient-to-r from-aurora-500/20 to-coral-500/20 hover:from-aurora-500/30 hover:to-coral-500/30 text-white border border-aurora-500/30 rounded-xl transition-all duration-200"
            >
              View Trip Details
            </motion.button>
          </Link>
        </div>
      </motion.div>
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-midnight-900 via-midnight-800 to-ocean-900 flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-12 h-12 border-4 border-aurora-500/30 border-t-aurora-500 rounded-full"
        />
      </div>
    )
  }

  const filteredTrips = getFilteredTrips()

  return (
    <div className="min-h-screen bg-gradient-to-br from-midnight-900 via-midnight-800 to-ocean-900 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-r from-aurora-500/10 via-transparent to-coral-500/10"></div>
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-72 h-72 bg-aurora-500/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-coral-500/20 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 container mx-auto px-6 py-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <div className="flex items-center justify-center gap-4 mb-6">
            <div className="p-3 bg-gradient-to-r from-aurora-500 to-coral-500 rounded-2xl">
              <GlobeAltIcon className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-5xl font-bold bg-gradient-to-r from-white to-aurora-300 bg-clip-text text-transparent">
              Explore Trips
            </h1>
          </div>
          
          <p className="text-xl text-white/70 max-w-2xl mx-auto">
            Discover amazing adventures shared by our travel community
          </p>
        </motion.div>

        {/* Search and Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-8"
        >
          {/* Search Bar */}
          <div className="relative mb-6">
            <MagnifyingGlassIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/50" />
            <input
              type="text"
              placeholder="Search destinations, trip titles, or descriptions..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-4 bg-white/10 border border-white/20 rounded-2xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-aurora-500 backdrop-blur-sm"
            />
          </div>

          {/* Filter Tabs */}
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex bg-white/10 rounded-xl p-1 backdrop-blur-sm border border-white/20 overflow-x-auto">
              {filters.map((filter) => (
                <button
                  key={filter.id}
                  onClick={() => setSelectedFilter(filter.id)}
                  className={`
                    flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200 whitespace-nowrap
                    ${selectedFilter === filter.id
                      ? 'bg-gradient-to-r from-aurora-500 to-coral-500 text-white'
                      : 'text-white/70 hover:text-white hover:bg-white/10'
                    }
                  `}
                >
                  <filter.icon className="w-4 h-4" />
                  <span className="text-sm">{filter.label}</span>
                </button>
              ))}
            </div>

            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center space-x-2 px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-all duration-200"
            >
              <FunnelIcon className="w-4 h-4" />
              <span>Filters</span>
            </button>
          </div>
        </motion.div>

        {/* Error State */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-red-500/20 border border-red-500/50 rounded-xl p-4 mb-8 flex items-center"
          >
            <ExclamationTriangleIcon className="w-5 h-5 text-red-400 mr-3" />
            <span className="text-red-300">{error}</span>
          </motion.div>
        )}

        {/* Results Header */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="flex items-center justify-between mb-8"
        >
          <h2 className="text-2xl font-bold text-white">
            {searchQuery || selectedFilter !== 'all' 
              ? `${filteredTrips.length} trips found`
              : `${filteredTrips.length} amazing trips`
            }
          </h2>
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
            <div className="text-6xl mb-4">🌍</div>
            <h3 className="text-2xl font-bold text-white mb-2">
              {searchQuery ? 'No trips found' : 'No public trips yet'}
            </h3>
            <p className="text-white/70 mb-6">
              {searchQuery 
                ? 'Try adjusting your search terms or filters'
                : 'Be the first to share your amazing travel experience!'
              }
            </p>
            <Link to="/create-trip">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-6 py-3 bg-gradient-to-r from-aurora-500 to-coral-500 hover:from-aurora-600 hover:to-coral-600 text-white rounded-xl font-semibold transition-all duration-200"
              >
                Share Your Trip
              </motion.button>
            </Link>
          </motion.div>
        )}
      </div>
    </div>
  )
}

export default ExploreTrips
