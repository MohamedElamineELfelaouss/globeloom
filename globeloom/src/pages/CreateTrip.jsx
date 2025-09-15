import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { Button } from '../components/ui/button'
import { useAuth } from '../contexts/AuthContext'
import apiService from '../services/apiService'
import { 
  SparklesIcon, 
  MapIcon, 
  CalendarIcon,
  UserGroupIcon,
  CurrencyDollarIcon,
  GlobeAltIcon,
  CheckIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/solid'

function CreateTrip() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [tripData, setTripData] = useState({
    title: '',
    description: '',
    destination: '',
    startDate: '',
    endDate: '',
    budget: '',
    currency: 'USD',
    travelers: 1,
    interests: [],
    travelStyle: '',
    visibility: 'private'
  })

  const interests = [
    { id: 'culture', label: 'Culture & History', icon: '🏛️' },
    { id: 'adventure', label: 'Adventure Sports', icon: '🏔️' },
    { id: 'food', label: 'Food & Cuisine', icon: '🍜' },
    { id: 'nature', label: 'Nature & Wildlife', icon: '🌿' },
    { id: 'beaches', label: 'Beaches & Islands', icon: '🏝️' },
    { id: 'nightlife', label: 'Nightlife & Entertainment', icon: '🎭' },
    { id: 'wellness', label: 'Wellness & Spa', icon: '🧘' },
    { id: 'photography', label: 'Photography', icon: '📸' }
  ]

  const travelStyles = [
    { id: 'luxury', label: 'Luxury', desc: 'Premium accommodations and experiences' },
    { id: 'mid-range', label: 'Mid-Range', desc: 'Comfortable balance of quality and value' },
    { id: 'budget', label: 'Budget', desc: 'Cost-effective options and local experiences' },
    { id: 'backpacking', label: 'Backpacking', desc: 'Adventure-focused with minimal planning' }
  ]

  const toggleInterest = (interestId) => {
    setTripData(prev => ({
      ...prev,
      interests: prev.interests.includes(interestId)
        ? prev.interests.filter(id => id !== interestId)
        : [...prev.interests, interestId]
    }))
  }

  const nextStep = () => {
    if (step < 4) setStep(step + 1)
  }

  const prevStep = () => {
    if (step > 1) setStep(step - 1)
  }

  const createTrip = async () => {
    if (!user) {
      setError('You must be logged in to create a trip')
      return
    }

  if (!tripData.title || !tripData.destination) {
      setError('Please fill in at least the trip title and destination');
      return;
    }
    
    setLoading(true);
    setError(null);
    try {
      const tripPayload = {
        title: tripData.title,
        description: tripData.description,
        destinations: [{
          name: tripData.destination,
          country: tripData.destination.split(',').length > 1 ? tripData.destination.split(',')[1].trim() : '',
          city: tripData.destination.split(',')[0].trim()
        }],
        startDate: tripData.startDate,
        endDate: tripData.endDate,
        budget: {
          total: tripData.budget ? parseFloat(tripData.budget) : 0,
          currency: tripData.currency
        },
        travelers: tripData.travelers,
        interests: tripData.interests,
        travelStyle: tripData.travelStyle,
        visibility: tripData.visibility,
        status: 'planning'
      }

      const response = await apiService.createTrip(tripPayload)
      console.log('Trip created successfully:', response)
      
      // Navigate to the created trip or trips list
      navigate('/my-trips')
    } catch (error) {
      console.error('Error creating trip:', error)
      setError(error.response?.data?.message || 'Failed to create trip. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-midnight-900 via-midnight-800 to-ocean-900 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-r from-aurora-500/10 via-transparent to-coral-500/10"></div>
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-72 h-72 bg-aurora-500/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-coral-500/20 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 container mx-auto px-6 py-12">
        {/* Progress Bar */}
        <div className="mb-12">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-4xl font-bold text-white">Create Your Trip</h1>
            <span className="text-white/70">Step {step} of 4</span>
          </div>
          <div className="w-full bg-white/10 rounded-full h-3">
            <motion.div 
              className="bg-gradient-to-r from-aurora-500 to-coral-500 h-3 rounded-full"
              initial={{ width: "25%" }}
              animate={{ width: `${(step / 4) * 100}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-red-500/20 border border-red-500/50 rounded-xl p-4 mb-6 flex items-center"
          >
            <ExclamationTriangleIcon className="w-5 h-5 text-red-400 mr-3" />
            <span className="text-red-300">{error}</span>
          </motion.div>
        )}

        <motion.div
          key={step}
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -50 }}
          transition={{ duration: 0.3 }}
          className="bg-white/10 backdrop-blur-xl rounded-2xl p-8 border border-white/20"
        >
          {/* Step 1: Basic Information */}
          {step === 1 && (
            <div className="space-y-8">
              <div className="text-center">
                <h2 className="text-3xl font-bold text-white mb-4">Tell us about your trip</h2>
                <p className="text-white/70">Let's start with the basics of your adventure</p>
              </div>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-white font-medium mb-3">
                    <SparklesIcon className="w-5 h-5 inline mr-2" />
                    Trip Title *
                  </label>
                  <input
                    type="text"
                    value={tripData.title}
                    onChange={(e) => setTripData(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="My Amazing Adventure"
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-aurora-500 backdrop-blur-sm"
                  />
                </div>
                
                <div>
                  <label className="block text-white font-medium mb-3">
                    <MapIcon className="w-5 h-5 inline mr-2" />
                    Destination *
                  </label>
                  <input
                    type="text"
                    value={tripData.destination}
                    onChange={(e) => setTripData(prev => ({ ...prev, destination: e.target.value }))}
                    placeholder="Paris, France"
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-aurora-500 backdrop-blur-sm"
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-white font-medium mb-3">
                    <CalendarIcon className="w-5 h-5 inline mr-2" />
                    Start Date
                  </label>
                  <input
                    type="date"
                    value={tripData.startDate}
                    onChange={(e) => setTripData(prev => ({ ...prev, startDate: e.target.value }))}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-aurora-500 backdrop-blur-sm"
                  />
                </div>
                
                <div>
                  <label className="block text-white font-medium mb-3">
                    <CalendarIcon className="w-5 h-5 inline mr-2" />
                    End Date
                  </label>
                  <input
                    type="date"
                    value={tripData.endDate}
                    onChange={(e) => setTripData(prev => ({ ...prev, endDate: e.target.value }))}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-aurora-500 backdrop-blur-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-white font-medium mb-3">
                  Description (Optional)
                </label>
                <textarea
                  value={tripData.description}
                  onChange={(e) => setTripData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Tell us about your dream trip..."
                  rows={4}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-aurora-500 backdrop-blur-sm resize-none"
                />
              </div>
            </div>
          )}

          {/* Step 2: Budget & Travelers */}
          {step === 2 && (
            <div className="space-y-8">
              <div className="text-center">
                <h2 className="text-3xl font-bold text-white mb-4">Budget & Travel Details</h2>
                <p className="text-white/70">Help us tailor suggestions to your budget and group size</p>
              </div>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-white font-medium mb-3">
                    <CurrencyDollarIcon className="w-5 h-5 inline mr-2" />
                    Budget (Optional)
                  </label>
                  <div className="flex gap-3">
                    <input
                      type="number"
                      value={tripData.budget}
                      onChange={(e) => setTripData(prev => ({ ...prev, budget: e.target.value }))}
                      placeholder="0"
                      min="0"
                      className="flex-1 px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-aurora-500 backdrop-blur-sm"
                    />
                    <select
                      value={tripData.currency}
                      onChange={(e) => setTripData(prev => ({ ...prev, currency: e.target.value }))}
                      className="px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-aurora-500 backdrop-blur-sm"
                    >
                      <option value="USD">USD</option>
                      <option value="EUR">EUR</option>
                      <option value="GBP">GBP</option>
                      <option value="JPY">JPY</option>
                      <option value="CAD">CAD</option>
                      <option value="AUD">AUD</option>
                    </select>
                  </div>
                </div>
                
                <div>
                  <label className="block text-white font-medium mb-3">
                    <UserGroupIcon className="w-5 h-5 inline mr-2" />
                    Number of Travelers
                  </label>
                  <select
                    value={tripData.travelers}
                    onChange={(e) => setTripData(prev => ({ ...prev, travelers: parseInt(e.target.value) }))}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-aurora-500 backdrop-blur-sm"
                  >
                    {[1,2,3,4,5,6,7,8,9,10].map(num => (
                      <option key={num} value={num}>{num} {num === 1 ? 'Person' : 'People'}</option>
                    ))}
                    <option value={11}>More than 10</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-white font-medium mb-3">
                  <GlobeAltIcon className="w-5 h-5 inline mr-2" />
                  Trip Visibility
                </label>
                <div className="grid md:grid-cols-2 gap-4">
                  {[
                    { id: 'private', label: 'Private', desc: 'Only you can see this trip' },
                    { id: 'friends', label: 'Friends', desc: 'Your friends can see this trip' },
                    { id: 'public', label: 'Public', desc: 'Anyone can see this trip' },
                    { id: 'collaborators', label: 'Collaborators Only', desc: 'Only invited collaborators can see' }
                  ].map((visibility) => (
                    <motion.div
                      key={visibility.id}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setTripData(prev => ({ ...prev, visibility: visibility.id }))}
                      className={`
                        p-4 rounded-xl cursor-pointer transition-all duration-200 border-2
                        ${tripData.visibility === visibility.id
                          ? 'bg-aurora-500/20 border-aurora-500 text-white'
                          : 'bg-white/10 border-white/20 text-white/80 hover:bg-white/15'
                        }
                      `}
                    >
                      <div className="font-semibold mb-1">{visibility.label}</div>
                      <div className="text-sm text-white/60">{visibility.desc}</div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Interests */}
          {step === 3 && (
            <div className="space-y-8">
              <div className="text-center">
                <h2 className="text-3xl font-bold text-white mb-4">What are you interested in?</h2>
                <p className="text-white/70">Select all that apply to personalize your trip</p>
              </div>
              
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                {interests.map((interest) => (
                  <motion.div
                    key={interest.id}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => toggleInterest(interest.id)}
                    className={`
                      p-4 rounded-xl cursor-pointer transition-all duration-200 border-2
                      ${tripData.interests.includes(interest.id)
                        ? 'bg-aurora-500/20 border-aurora-500 text-white'
                        : 'bg-white/10 border-white/20 text-white/80 hover:bg-white/15'
                      }
                    `}
                  >
                    <div className="text-3xl mb-2 text-center">{interest.icon}</div>
                    <div className="text-sm font-medium text-center">{interest.label}</div>
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          {/* Step 4: Travel Style & Review */}
          {step === 4 && (
            <div className="space-y-8">
              <div className="text-center">
                <h2 className="text-3xl font-bold text-white mb-4">Choose Your Travel Style</h2>
                <p className="text-white/70">Pick the style that matches your preferences</p>
              </div>
              
              <div className="grid md:grid-cols-2 gap-4 mb-8">
                {travelStyles.map((style) => (
                  <motion.div
                    key={style.id}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setTripData(prev => ({ ...prev, travelStyle: style.id }))}
                    className={`
                      p-6 rounded-xl cursor-pointer transition-all duration-200 border-2
                      ${tripData.travelStyle === style.id
                        ? 'bg-coral-500/20 border-coral-500 text-white'
                        : 'bg-white/10 border-white/20 text-white/80 hover:bg-white/15'
                      }
                    `}
                  >
                    <div className="text-lg font-semibold mb-2">{style.label}</div>
                    <div className="text-sm text-white/70">{style.desc}</div>
                  </motion.div>
                ))}
              </div>

              <div className="bg-white/10 rounded-xl p-6 space-y-4">
                <h3 className="text-xl font-semibold text-white mb-4">Trip Summary</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-white/70">Title:</span>
                      <span className="text-white font-medium">{tripData.title || 'Not specified'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-white/70">Destination:</span>
                      <span className="text-white font-medium">{tripData.destination || 'Not specified'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-white/70">Start Date:</span>
                      <span className="text-white font-medium">{tripData.startDate || 'Not specified'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-white/70">End Date:</span>
                      <span className="text-white font-medium">{tripData.endDate || 'Not specified'}</span>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-white/70">Travelers:</span>
                      <span className="text-white font-medium">{tripData.travelers} {tripData.travelers === 1 ? 'person' : 'people'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-white/70">Budget:</span>
                      <span className="text-white font-medium">{tripData.budget ? `${tripData.budget} ${tripData.currency}` : 'Not specified'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-white/70">Visibility:</span>
                      <span className="text-white font-medium capitalize">{tripData.visibility}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-white/70">Travel Style:</span>
                      <span className="text-white font-medium capitalize">{tripData.travelStyle || 'Not specified'}</span>
                    </div>
                  </div>
                </div>
                {tripData.interests.length > 0 && (
                  <div>
                    <span className="text-white/70">Interests:</span>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {tripData.interests.map(interestId => {
                        const interest = interests.find(i => i.id === interestId)
                        return (
                          <span key={interestId} className="px-3 py-1 bg-aurora-500/20 text-aurora-300 rounded-full text-sm">
                            {interest?.label}
                          </span>
                        )
                      })}
                    </div>
                  </div>
                )}
                {tripData.description && (
                  <div>
                    <span className="text-white/70">Description:</span>
                    <p className="text-white mt-1">{tripData.description}</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-8">
            <Button
              onClick={prevStep}
              disabled={step === 1}
              variant="outline"
              className="bg-white/10 border-white/20 text-white hover:bg-white/20 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </Button>
            
            {step < 4 ? (
              <Button
                onClick={nextStep}
                className="bg-gradient-to-r from-aurora-500 to-coral-500 hover:from-aurora-600 hover:to-coral-600 text-white"
              >
                Next Step
              </Button>
            ) : (
              <Button
                onClick={createTrip}
                disabled={loading}
                className="bg-gradient-to-r from-aurora-500 to-coral-500 hover:from-aurora-600 hover:to-coral-600 text-white px-8 py-3 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full mr-2"
                    />
                    Creating Trip...
                  </>
                ) : (
                  <>
                    <CheckIcon className="w-5 h-5 mr-2" />
                    Create Trip
                  </>
                )}
              </Button>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default CreateTrip
