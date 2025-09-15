import React, { useState, useEffect, useRef, useCallback } from 'react'
import { motion } from 'framer-motion'
import { useAuth } from '../contexts/AuthContext'
import apiService from '../services/apiService'
import {
  UserIcon,
  MapPinIcon,
  CalendarDaysIcon,
  GlobeAltIcon,
  CameraIcon,
  TrophyIcon,
  PencilIcon,
  StarIcon,
  CheckBadgeIcon,
  FireIcon,
  ExclamationTriangleIcon,
  UsersIcon,
  UserPlusIcon,
  PhotoIcon,
  XMarkIcon,
  CheckIcon
} from '@heroicons/react/24/outline'

const Profile = () => {
  const { user, updateUser } = useAuth()
  const [activeTab, setActiveTab] = useState('overview')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [trips, setTrips] = useState([])
  const [followers, setFollowers] = useState([])
  const [following, setFollowing] = useState([])
  const [isEditingProfile, setIsEditingProfile] = useState(false)
  const [profileData, setProfileData] = useState({
    displayName: '',
    bio: '',
    location: ''
  })
  const [uploadingAvatar, setUploadingAvatar] = useState(false)
  const [uploadingBanner, setUploadingBanner] = useState(false)
  const avatarInputRef = useRef(null)
  const bannerInputRef = useRef(null)

  const fetchUserData = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
        const [tripsResponse, followersResponse, followingResponse] = await Promise.all([
        apiService.getTrips(),
        apiService.getFollowers(user._id),
        apiService.getFollowing(user._id)
      ])
      
      if (tripsResponse.success) {
        const tripsData = Array.isArray(tripsResponse.data) ? tripsResponse.data : []
        setTrips(tripsData)
      } else {
        setTrips([])
      }
        if (followersResponse.success) {
        const followersData = followersResponse.data?.followers || followersResponse.data || []
        setFollowers(Array.isArray(followersData) ? followersData : [])
      } else {
        setFollowers([])
      }
      
      if (followingResponse.success) {
        const followingData = followingResponse.data?.following || followingResponse.data || []
        setFollowing(Array.isArray(followingData) ? followingData : [])
      } else {
        setFollowing([])
      }
      
    } catch (error) {
      console.error('Error fetching user data:', error)
      setError('Failed to load profile data')
      setTrips([])
      setFollowers([])
      setFollowing([])
    } finally {
      setLoading(false)
    }
  }, [user])

  useEffect(() => {
    if (user) {
      fetchUserData()
      // Initialize profile data with user data
      setProfileData({
        displayName: user.displayName || '',
        bio: user.bio || '',
        location: user.location || ''
      })
    }
  }, [user, fetchUserData])
  const calculateStats = () => {
    // Ensure trips is an array before using array methods
    const tripsArray = Array.isArray(trips) ? trips : []
    const completedTrips = tripsArray.filter(trip => trip.status === 'completed')
    const totalDays = completedTrips.reduce((total, trip) => {
      if (trip.startDate && trip.endDate) {
        const start = new Date(trip.startDate)
        const end = new Date(trip.endDate)
        const diffTime = Math.abs(end - start)
        return total + Math.ceil(diffTime / (1000 * 60 * 60 * 24))
      }
      return total
    }, 0)
    
    const uniqueDestinations = new Set(
      completedTrips.map(trip => trip.destination?.split(',')[0]?.trim()).filter(Boolean)
    )
    
    return {
      totalTrips: tripsArray.length,
      completedTrips: completedTrips.length,
      countries: uniqueDestinations.size,
      totalDays
    }
  }

  const stats = calculateStats()

  const badges = [
    {
      id: 1,
      name: 'Explorer',
      description: `Completed ${stats.completedTrips} trips`,
      icon: MapPinIcon,
      rarity: stats.completedTrips >= 10 ? 'rare' : 'common',
      earned: stats.completedTrips > 0
    },
    {
      id: 2,
      name: 'Globe Trotter',
      description: `Visited ${stats.countries} destinations`,
      icon: GlobeAltIcon,
      rarity: stats.countries >= 5 ? 'epic' : 'common',
      earned: stats.countries > 0
    },
    {
      id: 3,
      name: 'Verified Traveler',
      description: 'Profile verified',
      icon: CheckBadgeIcon,
      rarity: 'legendary',
      earned: user?.verified || false
    }
  ]

  const earnedBadges = badges.filter(badge => badge.earned)
  const getBadgeRarityColor = (rarity) => {
    switch (rarity) {
      case 'common': return 'from-gray-500 to-gray-600'
      case 'rare': return 'from-blue-500 to-blue-600'
      case 'epic': return 'from-purple-500 to-purple-600'
      case 'legendary': return 'from-yellow-500 to-orange-500'
      default: return 'from-gray-500 to-gray-600'
    }
  };

  const tabs = [
    { id: 'overview', name: 'Overview', icon: UserIcon },
    { id: 'trips', name: 'Trips', icon: MapPinIcon },
    { id: 'badges', name: 'Achievements', icon: TrophyIcon },
    { id: 'followers', name: `Followers (${followers.length})`, icon: UsersIcon },
    { id: 'following', name: `Following (${following.length})`, icon: UserPlusIcon }
  ]

  const handleProfileUpdate = async () => {
    try {
      setLoading(true)
      const response = await apiService.updateUserProfile(profileData)
      
      if (response.success) {
        // Update user context with the full updated user object
        updateUser(response.data.user)
        setIsEditingProfile(false)
        setError(null)
      } else {
        setError('Failed to update profile')
      }
    } catch (error) {
      console.error('Error updating profile:', error)
      setError('Failed to update profile')    } finally {
      setLoading(false)
    }  }

  const handleAvatarUpload = async (event) => {
    const file = event.target.files[0]
    if (!file) return

    // Validate file size (5MB limit)
    if (file.size > 5 * 1024 * 1024) {
      setError('File size too large. Maximum size is 5MB.')
      return
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setError('Please select a valid image file.')
      return
    }

    try {
      setUploadingAvatar(true)
      const response = await apiService.uploadAvatar(file)
      
      if (response.success) {
        // Update user with new avatar - response now contains the full user object
        updateUser(response.data.user)
        setError(null)
      } else {
        setError('Failed to upload avatar')
      }
    } catch (error) {
      console.error('Error uploading avatar:', error)
      setError('Failed to upload avatar')
    } finally {
      setUploadingAvatar(false)
    }
  }

  const handleBannerUpload = async (event) => {
    const file = event.target.files[0]
    if (!file) return

    // Validate file size (5MB limit)
    if (file.size > 5 * 1024 * 1024) {
      setError('File size too large. Maximum size is 5MB.')
      return
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setError('Please select a valid image file.')
      return
    }

    try {
      setUploadingBanner(true)
      const response = await apiService.uploadBanner(file)
      
      if (response.success) {
        // Update user with new banner - response now contains the full user object
        updateUser(response.data.user)
        setError(null)
      } else {
        setError('Failed to upload banner')
      }
    } catch (error) {
      console.error('Error uploading banner:', error)
      setError('Failed to upload banner')
    } finally {
      setUploadingBanner(false)
    }
  }

  const handleFollowUser = async (userId) => {
    try {
      const response = await apiService.followUser(userId)
      if (response.success) {
        // Refresh followers/following data
        fetchUserData()
      }
    } catch (error) {
      console.error('Error following user:', error)
      setError('Failed to follow user')
    }
  }

  const handleUnfollowUser = async (userId) => {
    try {
      const response = await apiService.unfollowUser(userId)
      if (response.success) {
        // Refresh followers/following data
        fetchUserData()
      }
    } catch (error) {
      console.error('Error unfollowing user:', error)
      setError('Failed to unfollow user')
    }
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

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-midnight-900 via-midnight-800 to-ocean-900 flex items-center justify-center">
        <div className="text-white text-xl">Please log in to view your profile</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-midnight-900 via-midnight-800 to-ocean-900 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-aurora-500/10 via-transparent to-coral-500/10"></div>
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-72 h-72 bg-aurora-500/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-coral-500/20 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 container mx-auto px-6 py-12">
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-red-500/20 border border-red-500/50 rounded-xl p-4 mb-6 flex items-center"
          >
            <ExclamationTriangleIcon className="w-5 h-5 text-red-400 mr-3" />
            <span className="text-red-300">{error}</span>
          </motion.div>
        )}        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-white/10 backdrop-blur-lg rounded-2xl overflow-hidden border border-white/20 mb-8"
        >
          {/* Banner Section */}
          <div className="relative h-48 bg-gradient-to-r from-coral-500 via-sunset-500 to-aurora-500">
            {user.banner && (
              <img 
                src={user.banner} 
                alt="Profile Banner" 
                className="w-full h-full object-cover"
              />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
            
            {/* Banner Upload Button */}
            <button
              onClick={() => bannerInputRef.current?.click()}
              disabled={uploadingBanner}
              className="absolute top-4 right-4 bg-black/50 backdrop-blur-sm rounded-lg p-2 text-white hover:bg-black/70 transition-all duration-300"
            >
              {uploadingBanner ? (
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
                />
              ) : (
                <PhotoIcon className="w-5 h-5" />
              )}
            </button>
            <input
              ref={bannerInputRef}
              type="file"
              accept="image/*"
              onChange={handleBannerUpload}
              className="hidden"
            />
          </div>

          <div className="relative px-8 pb-8">
            <div className="flex items-end justify-between -mt-16 mb-6">
              <div className="flex items-end space-x-6">
                {/* Avatar Section */}
                <div className="relative">
                  <div className="w-32 h-32 rounded-full bg-gradient-to-r from-coral-500 to-sunset-500 p-1">
                    <div className="w-full h-full rounded-full bg-white/10 backdrop-blur-lg flex items-center justify-center text-4xl text-white overflow-hidden">
                      {user.avatar ? (
                        <img 
                          src={user.avatar} 
                          alt="Profile Avatar" 
                          className="w-full h-full object-cover rounded-full"
                        />
                      ) : (
                        user.displayName ? user.displayName.charAt(0).toUpperCase() : user?.email?.charAt(0).toUpperCase() || 'U'
                      )}
                    </div>
                  </div>
                  
                  {/* Avatar Upload Button */}
                  <button
                    onClick={() => avatarInputRef.current?.click()}
                    disabled={uploadingAvatar}
                    className="absolute -bottom-2 -right-2 w-10 h-10 bg-gradient-to-r from-coral-500 to-sunset-500 rounded-full flex items-center justify-center text-white hover:scale-110 transition-all duration-300"
                  >
                    {uploadingAvatar ? (
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
                      />
                    ) : (
                      <CameraIcon className="w-5 h-5" />
                    )}
                  </button>
                  <input
                    ref={avatarInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleAvatarUpload}
                    className="hidden"
                  />
                  
                  {user.verified && (
                    <div className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-r from-coral-500 to-sunset-500 rounded-full flex items-center justify-center">
                      <CheckBadgeIcon className="w-5 h-5 text-white" />
                    </div>
                  )}
                </div>
                
                {/* Profile Info */}
                <div className="pb-4">
                  <div className="flex items-center space-x-3 mb-2">
                    {isEditingProfile ? (
                      <div className="flex items-center space-x-2">
                        <input
                          type="text"
                          value={profileData.displayName}
                          onChange={(e) => setProfileData({...profileData, displayName: e.target.value})}
                          className="bg-white/10 border border-white/20 rounded-lg px-3 py-1 text-white text-2xl font-bold focus:outline-none focus:border-aurora-500"
                          placeholder="Your Name"
                        />
                        <button
                          onClick={handleProfileUpdate}
                          className="p-2 bg-green-500 rounded-lg hover:bg-green-600 transition-colors"
                        >
                          <CheckIcon className="w-4 h-4 text-white" />
                        </button>
                        <button
                          onClick={() => setIsEditingProfile(false)}
                          className="p-2 bg-red-500 rounded-lg hover:bg-red-600 transition-colors"
                        >
                          <XMarkIcon className="w-4 h-4 text-white" />
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center space-x-2">
                        <h1 className="text-3xl font-bold text-white">
                          {user.displayName || user?.email?.split('@')[0] || 'User'}
                        </h1>
                        <button
                          onClick={() => setIsEditingProfile(true)}
                          className="p-2 bg-white/10 rounded-lg hover:bg-white/20 transition-colors"
                        >
                          <PencilIcon className="w-4 h-4 text-white" />
                        </button>
                      </div>
                    )}
                  </div>
                  
                  {/* Bio Section */}
                  {isEditingProfile ? (
                    <div className="space-y-2">
                      <textarea
                        value={profileData.bio}
                        onChange={(e) => setProfileData({...profileData, bio: e.target.value})}
                        className="bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white text-sm w-full focus:outline-none focus:border-aurora-500"
                        placeholder="Tell us about yourself..."
                        rows="2"
                      />
                      <input
                        type="text"
                        value={profileData.location}
                        onChange={(e) => setProfileData({...profileData, location: e.target.value})}
                        className="bg-white/10 border border-white/20 rounded-lg px-3 py-1 text-white text-sm focus:outline-none focus:border-aurora-500"
                        placeholder="Location"
                      />
                    </div>
                  ) : (
                    <div className="space-y-1">
                      {user.bio && (
                        <p className="text-sm text-ocean-300">{user.bio}</p>
                      )}
                      <div className="flex items-center space-x-4 text-sm text-ocean-400">
                        {user.location && (
                          <div className="flex items-center space-x-1">
                            <MapPinIcon className="w-4 h-4" />
                            <span>{user.location}</span>
                          </div>
                        )}
                        <div className="flex items-center space-x-1">
                          <CalendarDaysIcon className="w-4 h-4" />
                          <span>Joined {new Date(user.createdAt || Date.now()).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-8">
              <div className="text-center">
                <p className="text-2xl font-bold text-white">{stats.totalTrips}</p>
                <p className="text-ocean-300 text-sm">Total Trips</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-white">{stats.completedTrips}</p>
                <p className="text-ocean-300 text-sm">Completed</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-coral-400">{stats.countries}</p>
                <p className="text-ocean-300 text-sm">Countries</p>
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="bg-white/10 backdrop-blur-lg rounded-xl p-2 border border-white/20 mb-8"
        >
          <div className="flex space-x-1">
            {tabs.map((tab) => (
              <motion.button
                key={tab.id}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 px-6 py-3 rounded-lg font-medium transition-all duration-300 ${
                  activeTab === tab.id
                    ? 'bg-gradient-to-r from-coral-500 to-sunset-500 text-white'
                    : 'text-ocean-300 hover:text-white hover:bg-white/10'
                }`}
              >
                <tab.icon className="w-5 h-5" />
                <span>{tab.name}</span>
              </motion.button>
            ))}
          </div>
        </motion.div>

        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {activeTab === 'overview' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
                <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                  <MapPinIcon className="w-6 h-6" />
                  Recent Trips
                </h3>                {Array.isArray(trips) && trips.length > 0 ? (
                  <div className="space-y-4">
                    {trips.slice(0, 3).map((trip, index) => (
                      <motion.div
                        key={trip._id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 * index, duration: 0.6 }}
                        className="bg-white/5 rounded-xl p-4 border border-white/10 hover:bg-white/10 transition-all duration-300"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-semibold text-white">{trip.title}</h4>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            trip.status === 'completed' ? 'bg-green-500/20 text-green-300' :
                            trip.status === 'upcoming' ? 'bg-aurora-500/20 text-aurora-300' :
                            'bg-yellow-500/20 text-yellow-300'
                          }`}>
                            {trip.status}
                          </span>
                        </div>
                        <div className="text-sm text-white/70">
                          <div className="flex items-center space-x-1">
                            <MapPinIcon className="w-4 h-4" />
                            <span>{trip.destination}</span>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <MapPinIcon className="w-12 h-12 text-white/30 mx-auto mb-4" />
                    <p className="text-white/60">No trips yet. Start planning your first adventure!</p>
                  </div>
                )}
              </div>

              <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
                <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                  <TrophyIcon className="w-6 h-6" />
                  Achievements
                </h3>
                {earnedBadges.length > 0 ? (
                  <div className="grid grid-cols-1 gap-4">
                    {earnedBadges.map((badge, index) => (
                      <motion.div
                        key={badge.id}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.1 * index, duration: 0.6 }}
                        className={`bg-gradient-to-br ${getBadgeRarityColor(badge.rarity)} p-4 rounded-xl flex items-center space-x-3`}
                      >
                        <badge.icon className="w-8 h-8 text-white" />
                        <div>
                          <h4 className="font-semibold text-white">{badge.name}</h4>
                          <p className="text-white/80 text-sm">{badge.description}</p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <TrophyIcon className="w-12 h-12 text-white/30 mx-auto mb-4" />
                    <p className="text-white/60">Complete trips to earn achievements!</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'trips' && (
            <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
              <h3 className="text-xl font-bold text-white mb-6">All Trips</h3>              {Array.isArray(trips) && trips.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {trips.map((trip, index) => (
                    <motion.div
                      key={trip._id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 * index, duration: 0.6 }}
                      className="bg-white/5 rounded-xl p-4 border border-white/10 hover:bg-white/10 transition-all duration-300"
                    >
                      <h4 className="font-semibold text-white mb-2">{trip.title}</h4>
                      <div className="space-y-2 text-sm text-white/70">
                        <div className="flex items-center space-x-2">
                          <MapPinIcon className="w-4 h-4" />
                          <span>{trip.destination}</span>
                        </div>
                        <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                          trip.status === 'completed' ? 'bg-green-500/20 text-green-300' :
                          trip.status === 'upcoming' ? 'bg-aurora-500/20 text-aurora-300' :
                          'bg-yellow-500/20 text-yellow-300'
                        }`}>
                          {trip.status}
                        </span>
                      </div>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <MapPinIcon className="w-16 h-16 text-white/30 mx-auto mb-4" />
                  <h4 className="text-xl font-semibold text-white mb-2">No trips yet</h4>
                  <p className="text-white/60 mb-6">Start planning your first adventure!</p>
                </div>
              )}
            </div>
          )}          {activeTab === 'badges' && (
            <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
              <h3 className="text-xl font-bold text-white mb-6">Achievements & Badges</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {badges.map((badge, index) => (
                  <motion.div
                    key={badge.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.1 * index, duration: 0.6 }}
                    className={`${
                      badge.earned 
                        ? `bg-gradient-to-br ${getBadgeRarityColor(badge.rarity)}` 
                        : 'bg-white/5 border border-white/10'
                    } p-6 rounded-xl text-center ${!badge.earned && 'opacity-50'}`}
                  >
                    <badge.icon className={`w-12 h-12 mx-auto mb-4 ${badge.earned ? 'text-white' : 'text-white/50'}`} />
                    <h4 className={`font-semibold mb-2 ${badge.earned ? 'text-white' : 'text-white/50'}`}>
                      {badge.name}
                    </h4>
                    <p className={`text-sm ${badge.earned ? 'text-white/80' : 'text-white/40'}`}>
                      {badge.description}
                    </p>
                    {!badge.earned && (
                      <p className="text-xs text-white/40 mt-2">Not earned yet</p>
                    )}
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'followers' && (
            <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
              <h3 className="text-xl font-bold text-white mb-6">Followers ({followers.length})</h3>
              {Array.isArray(followers) && followers.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {followers.map((follower, index) => (
                    <motion.div
                      key={follower._id || follower.uid}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 * index, duration: 0.6 }}
                      className="bg-white/5 rounded-xl p-4 border border-white/10 hover:bg-white/10 transition-all duration-300"
                    >
                      <div className="flex items-center space-x-3 mb-3">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-r from-coral-500 to-sunset-500 flex items-center justify-center text-white font-semibold overflow-hidden">
                          {follower.avatar ? (
                            <img src={follower.avatar} alt={follower.displayName} className="w-full h-full object-cover rounded-full" />
                          ) : (
                            follower.displayName?.charAt(0).toUpperCase() || 'U'
                          )}
                        </div>
                        <div className="flex-1">
                          <h4 className="font-semibold text-white">{follower.displayName || 'User'}</h4>
                          <p className="text-sm text-white/60">{follower.tripsCount || 0} trips</p>
                        </div>                      </div>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleFollowUser(follower._id || follower.uid)}
                          className="flex-1 bg-gradient-to-r from-coral-500 to-sunset-500 text-white px-3 py-2 rounded-lg text-sm font-medium hover:shadow-lg transition-all duration-300"
                        >
                          Follow Back
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <UsersIcon className="w-16 h-16 text-white/30 mx-auto mb-4" />
                  <h4 className="text-xl font-semibold text-white mb-2">No followers yet</h4>
                  <p className="text-white/60">Share your amazing trips to gain followers!</p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'following' && (
            <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
              <h3 className="text-xl font-bold text-white mb-6">Following ({following.length})</h3>
              {Array.isArray(following) && following.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {following.map((followedUser, index) => (
                    <motion.div
                      key={followedUser._id || followedUser.uid}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 * index, duration: 0.6 }}
                      className="bg-white/5 rounded-xl p-4 border border-white/10 hover:bg-white/10 transition-all duration-300"
                    >
                      <div className="flex items-center space-x-3 mb-3">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-r from-coral-500 to-sunset-500 flex items-center justify-center text-white font-semibold overflow-hidden">
                          {followedUser.avatar ? (
                            <img src={followedUser.avatar} alt={followedUser.displayName} className="w-full h-full object-cover rounded-full" />
                          ) : (
                            followedUser.displayName?.charAt(0).toUpperCase() || 'U'
                          )}
                        </div>
                        <div className="flex-1">
                          <h4 className="font-semibold text-white">{followedUser.displayName || 'User'}</h4>
                          <p className="text-sm text-white/60">{followedUser.tripsCount || 0} trips</p>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleUnfollowUser(followedUser._id || followedUser.uid)}
                          className="flex-1 bg-white/10 border border-white/20 text-white px-3 py-2 rounded-lg text-sm font-medium hover:bg-white/20 transition-all duration-300"
                        >
                          Unfollow
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <UserPlusIcon className="w-16 h-16 text-white/30 mx-auto mb-4" />
                  <h4 className="text-xl font-semibold text-white mb-2">Not following anyone yet</h4>
                  <p className="text-white/60">Discover amazing travelers and follow them for inspiration!</p>
                </div>
              )}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  )
}

export default Profile
