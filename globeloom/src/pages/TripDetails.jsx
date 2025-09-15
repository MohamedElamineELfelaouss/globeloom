import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Link, useParams } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import apiService from '../services/apiService'
import {
  ArrowLeftIcon,
  MapPinIcon,
  CalendarDaysIcon,
  ClockIcon,
  PhotoIcon,
  HeartIcon,
  ShareIcon,
  StarIcon,
  CheckCircleIcon,
  PencilIcon,
  UsersIcon,
  CurrencyDollarIcon,
  SunIcon,
  EllipsisHorizontalIcon,
  DocumentArrowDownIcon,
  EyeIcon,
  BookmarkIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline'
import { HeartIcon as HeartSolid, StarIcon as StarSolid, BookmarkIcon as BookmarkSolid } from '@heroicons/react/24/solid'

const TripDetails = () => {
  const { tripId } = useParams()
  const { user } = useAuth()
  
  const [trip, setTrip] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [isLiked, setIsLiked] = useState(false)
  const [isSaved, setIsSaved] = useState(false)

  const fetchTripDetails = React.useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await apiService.getTripById(tripId)
      
      if (response.success) {
        setTrip(response.data)
        setIsLiked(response.data.likes?.includes(user?.uid) || false)
        setIsSaved(response.data.saves?.includes(user?.uid) || false)
      } else {
        setError('Trip not found')
      }
    } catch (error) {
      console.error('Error fetching trip details:', error)
      setError('Failed to load trip details')
    } finally {      setLoading(false)
    }
  }, [tripId, user])

  useEffect(() => {
    if (tripId) {
      fetchTripDetails()
    }
  }, [tripId, fetchTripDetails])

  const handleLike = async () => {
    if (!user) return
    
    try {
      const response = await apiService.likeTrip(tripId)
      if (response.success) {
        setIsLiked(!isLiked)
        setTrip(prev => ({
          ...prev,
          likesCount: isLiked ? prev.likesCount - 1 : prev.likesCount + 1
        }))
      }
    } catch (error) {
      console.error('Error liking trip:', error)
    }
  }

  const handleSave = async () => {
    if (!user) return
    
    try {
      const response = await apiService.saveTrip(tripId)
      if (response.success) {
        setIsSaved(!isSaved)
      }
    } catch (error) {
      console.error('Error saving trip:', error)
    }
  }

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    })
  }

  const formatDateRange = (startDate, endDate) => {
    if (!startDate || !endDate) return 'Dates not specified'
    return `${formatDate(startDate)} - ${formatDate(endDate)}`
  }

  const getDuration = (startDate, endDate) => {
    if (!startDate || !endDate) return 0
    const start = new Date(startDate)
    const end = new Date(endDate)
    const diffTime = Math.abs(end - start)
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24))
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

  if (error || !trip) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-midnight-900 via-midnight-800 to-ocean-900 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <ExclamationTriangleIcon className="w-16 h-16 text-red-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-2">Trip Not Found</h2>
          <p className="text-white/70 mb-6">{error || 'The trip you are looking for does not exist.'}</p>
          <Link
            to="/my-trips"
            className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-aurora-500 to-coral-500 text-white rounded-xl font-semibold hover:from-aurora-600 hover:to-coral-600 transition-all duration-200"
          >
            <ArrowLeftIcon className="w-5 h-5 mr-2" />
            Back to My Trips
          </Link>
        </motion.div>
      </div>
    )
  }

  const duration = getDuration(trip.startDate, trip.endDate)

  return (
    <div className="min-h-screen bg-gradient-to-br from-midnight-900 via-midnight-800 to-ocean-900">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-r from-aurora-500/10 via-transparent to-coral-500/10"></div>
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-72 h-72 bg-aurora-500/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-coral-500/20 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10">
        {/* Header */}
        <div className="sticky top-0 z-50 bg-midnight-900/80 backdrop-blur-xl border-b border-white/10">
          <div className="container mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              <Link
                to="/my-trips"
                className="flex items-center text-white/70 hover:text-white transition-colors"
              >
                <ArrowLeftIcon className="w-5 h-5 mr-2" />
                Back to My Trips
              </Link>
              
              <div className="flex items-center space-x-3">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleLike}
                  className={`p-2 rounded-xl transition-all duration-200 ${
                    isLiked 
                      ? 'bg-red-500/20 text-red-400' 
                      : 'bg-white/10 text-white/70 hover:text-white hover:bg-white/20'
                  }`}
                >
                  {isLiked ? <HeartSolid className="w-5 h-5" /> : <HeartIcon className="w-5 h-5" />}
                </motion.button>
                
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleSave}
                  className={`p-2 rounded-xl transition-all duration-200 ${
                    isSaved 
                      ? 'bg-aurora-500/20 text-aurora-400' 
                      : 'bg-white/10 text-white/70 hover:text-white hover:bg-white/20'
                  }`}
                >
                  {isSaved ? <BookmarkSolid className="w-5 h-5" /> : <BookmarkIcon className="w-5 h-5" />}
                </motion.button>
                
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="p-2 rounded-xl bg-white/10 text-white/70 hover:text-white hover:bg-white/20 transition-all duration-200"
                >
                  <ShareIcon className="w-5 h-5" />
                </motion.button>
                
                {trip.createdBy === user?.uid && (
                  <Link
                    to={`/edit-trip/${tripId}`}
                    className="p-2 rounded-xl bg-white/10 text-white/70 hover:text-white hover:bg-white/20 transition-all duration-200"
                  >
                    <PencilIcon className="w-5 h-5" />
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-6 py-12">
          {/* Trip Header */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h1 className="text-5xl font-bold bg-gradient-to-r from-white to-aurora-300 bg-clip-text text-transparent mb-4">
              {trip.title}
            </h1>
            
            <div className="flex items-center justify-center space-x-6 text-white/70 mb-6">
              <div className="flex items-center space-x-2">
                <MapPinIcon className="w-5 h-5" />
                <span>{trip.destination}</span>
              </div>
              <div className="flex items-center space-x-2">
                <CalendarDaysIcon className="w-5 h-5" />
                <span>{formatDateRange(trip.startDate, trip.endDate)}</span>
              </div>
              <div className="flex items-center space-x-2">
                <ClockIcon className="w-5 h-5" />
                <span>{duration} days</span>
              </div>
            </div>

            {trip.description && (
              <p className="text-xl text-white/70 max-w-4xl mx-auto">
                {trip.description}
              </p>
            )}
          </motion.div>

          {/* Trip Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="grid md:grid-cols-4 gap-6 mb-12"
          >
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 text-center">
              <UsersIcon className="w-8 h-8 text-aurora-400 mx-auto mb-3" />
              <div className="text-2xl font-bold text-white mb-1">{trip.travelers || 1}</div>
              <div className="text-white/70 text-sm">Travelers</div>
            </div>
            
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 text-center">
              <CurrencyDollarIcon className="w-8 h-8 text-coral-400 mx-auto mb-3" />
              <div className="text-2xl font-bold text-white mb-1">
                {trip.budget ? `${trip.budget} ${trip.currency || 'USD'}` : 'No budget'}
              </div>
              <div className="text-white/70 text-sm">Budget</div>
            </div>
            
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 text-center">
              <EyeIcon className="w-8 h-8 text-green-400 mx-auto mb-3" />
              <div className="text-2xl font-bold text-white mb-1 capitalize">{trip.visibility || 'private'}</div>
              <div className="text-white/70 text-sm">Visibility</div>
            </div>
            
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 text-center">
              <HeartIcon className="w-8 h-8 text-red-400 mx-auto mb-3" />
              <div className="text-2xl font-bold text-white mb-1">{trip.likesCount || 0}</div>
              <div className="text-white/70 text-sm">Likes</div>
            </div>
          </motion.div>

          {/* Trip Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="bg-white/10 backdrop-blur-xl rounded-2xl p-8 border border-white/20"
          >
            {trip.interests && trip.interests.length > 0 && (
              <div className="mb-8">
                <h3 className="text-xl font-semibold text-white mb-4">Interests</h3>
                <div className="flex flex-wrap gap-3">
                  {trip.interests.map((interest, index) => (
                    <span
                      key={index}
                      className="px-4 py-2 bg-aurora-500/20 text-aurora-300 rounded-full text-sm border border-aurora-500/30"
                    >
                      {interest}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {trip.travelStyle && (
              <div className="mb-8">
                <h3 className="text-xl font-semibold text-white mb-4">Travel Style</h3>
                <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                  <span className="text-coral-300 font-medium capitalize">{trip.travelStyle}</span>
                </div>
              </div>
            )}

            <div className="text-center py-12">
              <PhotoIcon className="w-16 h-16 text-white/30 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">Trip Planning in Progress</h3>
              <p className="text-white/60">
                This trip is being planned. More details will be available soon!
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}

export default TripDetails
