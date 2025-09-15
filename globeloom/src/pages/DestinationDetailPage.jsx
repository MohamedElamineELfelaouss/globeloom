import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Link, useParams, useNavigate } from 'react-router-dom'
import {
  ArrowLeftIcon,
  MapPinIcon,
  StarIcon,
  CalendarIcon,
  CurrencyDollarIcon,
  ClockIcon,
  HeartIcon,
  ShareIcon,
  BookmarkIcon,
  SunIcon,
  CloudIcon,
  GlobeAltIcon,
  PhoneIcon,
  BuildingOfficeIcon,
  CreditCardIcon,
  ExclamationTriangleIcon,
  PlusIcon,
  CameraIcon,
  UserGroupIcon,
  MapIcon,
  InformationCircleIcon,
  BanknotesIcon,
  LanguageIcon,
  ShieldCheckIcon
} from '@heroicons/react/24/outline'
import { HeartIcon as HeartSolid, BookmarkIcon as BookmarkSolid } from '@heroicons/react/24/solid'

// Comprehensive destination data
const destinationsData = {
  1: {
    id: 1,
    name: 'Tokyo, Japan',
    country: 'Japan',
    continent: 'Asia',
    images: [
      'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=1200&h=800&fit=crop&auto=format&q=80',
      'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=1200&h=800&fit=crop&auto=format&q=80',
      'https://images.unsplash.com/photo-1513407030348-c983a97b98d8?w=1200&h=800&fit=crop&auto=format&q=80'
    ],
    rating: 4.8,
    reviews: 3250,
    price: '$1,200',
    duration: '7-10 days',
    description: 'Experience the perfect blend of traditional culture and modern innovation in Japan\'s vibrant capital city.',
    highlights: ['Cherry Blossoms', 'Modern Architecture', 'Authentic Cuisine', 'Rich Culture'],
    
    weather: {
      bestTime: 'March-May, September-November',
      summer: { temp: '26-30°C', condition: 'Hot & Humid', rainfall: 'High' },
      winter: { temp: '5-10°C', condition: 'Cool & Dry', rainfall: 'Low' },
      spring: { temp: '15-20°C', condition: 'Mild & Pleasant', rainfall: 'Moderate' },
      autumn: { temp: '18-23°C', condition: 'Cool & Comfortable', rainfall: 'Low' }
    },
    
    timezone: 'JST (UTC+9)',
    language: 'Japanese',
    currency: 'Japanese Yen (¥)',
    emergencyNumber: '110 (Police), 119 (Fire/Ambulance)',
    
    hotels: [
      {
        name: 'The Ritz-Carlton Tokyo',
        category: 'Luxury',
        priceRange: '$400-600/night',
        rating: 4.9,
        location: 'Roppongi',
        amenities: ['Spa', 'Fine Dining', 'City Views', 'Business Center']
      },
      {
        name: 'Park Hyatt Tokyo',
        category: 'Luxury',
        priceRange: '$350-500/night',
        rating: 4.8,
        location: 'Shinjuku',
        amenities: ['Pool', 'Spa', 'Premium Location', 'Michelin Restaurant']
      },
      {
        name: 'Hotel Gracery Shinjuku',
        category: 'Mid-Range',
        priceRange: '$100-150/night',
        rating: 4.5,
        location: 'Shinjuku',
        amenities: ['Central Location', 'Modern Rooms', 'Restaurant', 'WiFi']
      },
      {
        name: 'Capsule Hotel Anshin Oyado',
        category: 'Budget',
        priceRange: '$30-50/night',
        rating: 4.2,
        location: 'Shimbashi',
        amenities: ['Capsule Experience', 'Shared Facilities', 'Safe Storage', 'Central']
      }
    ],
    
    hospitals: [
      {
        name: 'Tokyo University Hospital',
        type: 'General Hospital',
        phone: '+81-3-3815-5411',
        address: '7-3-1 Hongo, Bunkyo-ku',
        services: ['Emergency Care', 'International Desk', 'English Speaking Staff']
      },
      {
        name: 'St. Luke\'s International Hospital',
        type: 'International Hospital',
        phone: '+81-3-3541-5151',
        address: '9-1 Akashi-cho, Chuo-ku',
        services: ['24/7 Emergency', 'English Service', 'Travel Medicine']
      }
    ],
    
    transportation: {
      airport: 'Narita (NRT) / Haneda (HND)',
      airportTransfer: '$10-15 (Train), $200-250 (Taxi)',
      publicTransport: 'JR Pass: $280 (7 days), Single ride: $2-4',
      taxi: 'Starting: $7, Per km: $3-4',
      rental: 'Car rental: $50-80/day'
    },
    
    dining: {
      streetFood: '$3-8 per meal',
      localRestaurant: '$10-20 per meal',
      midRange: '$25-50 per meal',
      fineDining: '$100-300 per meal',
      beverages: 'Coffee: $3-5, Beer: $4-6, Water: $1-2'
    },
    
    activities: [
      {
        name: 'Senso-ji Temple',
        price: 'Free',
        duration: '2-3 hours',
        description: 'Ancient Buddhist temple in Asakusa district'
      },
      {
        name: 'Tokyo Skytree',
        price: '$18-25',
        duration: '2-4 hours',
        description: 'Tallest structure in Japan with panoramic city views'
      },
      {
        name: 'Tsukiji Outer Market',
        price: '$20-40 (food)',
        duration: '3-4 hours',
        description: 'Famous fish market and street food paradise'
      },
      {
        name: 'Imperial Palace East Gardens',
        price: 'Free',
        duration: '2-3 hours',
        description: 'Beautiful traditional gardens in the heart of Tokyo'
      }
    ],
    
    safety: {
      level: 'Very Safe',
      commonIssues: ['Earthquakes', 'Typhoons (seasonal)', 'Getting lost due to language barrier'],
      tips: [
        'Learn basic Japanese phrases',
        'Carry cash (many places don\'t accept cards)',
        'Download translation apps',
        'Keep emergency contacts handy',
        'Respect local customs and etiquette'
      ]
    },
    
    budgetBreakdown: {
      budget: {
        accommodation: '$30-60/night',
        food: '$25-40/day',
        transport: '$15-25/day',
        activities: '$20-40/day',
        total: '$90-165/day'
      },
      midRange: {
        accommodation: '$100-200/night',
        food: '$50-80/day',
        transport: '$25-40/day',
        activities: '$40-80/day',
        total: '$215-400/day'
      },
      luxury: {
        accommodation: '$350-600/night',
        food: '$100-200/day',
        transport: '$50-100/day',
        activities: '$80-150/day',
        total: '$580-1050/day'
      }
    }
  },
  
  2: {
    id: 2,
    name: 'Santorini, Greece',
    country: 'Greece',
    continent: 'Europe',
    images: [
      'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=1200&h=800&fit=crop&auto=format&q=80',
      'https://images.unsplash.com/photo-1613395877344-13d4a8e0d49e?w=1200&h=800&fit=crop&auto=format&q=80',
      'https://images.unsplash.com/photo-1562997597-b1d3be0fb3b1?w=1200&h=800&fit=crop&auto=format&q=80'
    ],
    rating: 4.9,
    reviews: 2100,
    price: '$800',
    duration: '5-7 days',
    description: 'Discover the stunning white-washed buildings and crystal-clear waters of this Greek island paradise.',
    highlights: ['Sunset Views', 'Blue Domes', 'Wine Tasting', 'Ancient History'],
    
    weather: {
      bestTime: 'April-June, September-October',
      summer: { temp: '25-30°C', condition: 'Hot & Dry', rainfall: 'Very Low' },
      winter: { temp: '10-15°C', condition: 'Mild & Rainy', rainfall: 'Moderate' },
      spring: { temp: '18-23°C', condition: 'Pleasant', rainfall: 'Low' },
      autumn: { temp: '20-25°C', condition: 'Warm & Pleasant', rainfall: 'Low' }
    },
    
    timezone: 'EET (UTC+2)',
    language: 'Greek',
    currency: 'Euro (€)',
    emergencyNumber: '112 (General Emergency)',
    
    hotels: [
      {
        name: 'Canaves Oia Suites',
        category: 'Luxury',
        priceRange: '$400-800/night',
        rating: 4.9,
        location: 'Oia',
        amenities: ['Infinity Pool', 'Caldera Views', 'Spa', 'Private Terraces']
      },
      {
        name: 'Santorini Princess Spa Hotel',
        category: 'Mid-Range',
        priceRange: '$150-250/night',
        rating: 4.6,
        location: 'Imerovigli',
        amenities: ['Spa', 'Pool', 'Sea Views', 'Traditional Architecture']
      },
      {
        name: 'Villa Renos',
        category: 'Budget',
        priceRange: '$50-80/night',
        rating: 4.3,
        location: 'Fira',
        amenities: ['Central Location', 'Traditional Style', 'Terrace', 'Kitchen']
      }
    ],
    
    hospitals: [
      {
        name: 'Santorini General Hospital',
        type: 'General Hospital',
        phone: '+30 22860 35500',
        address: 'Fira, Santorini',
        services: ['Emergency Care', 'Basic Medical Services', 'Ambulance']
      }
    ],
    
    transportation: {
      airport: 'Santorini (JTR)',
      airportTransfer: '$20-30 (Bus), $35-50 (Taxi)',
      publicTransport: 'Bus: €2-3 per ride',
      taxi: 'Starting: €4, Per km: €1-2',
      rental: 'Car: €25-40/day, ATV: €20-30/day'
    },
    
    dining: {
      streetFood: '€5-10 per meal',
      localRestaurant: '€15-25 per meal',
      midRange: '€30-50 per meal',
      fineDining: '€80-150 per meal',
      beverages: 'Coffee: €3-5, Wine: €20-40/bottle, Water: €1-2'
    },
    
    activities: [
      {
        name: 'Oia Sunset Viewing',
        price: 'Free',
        duration: '2 hours',
        description: 'World-famous sunset views from Oia village'
      },
      {
        name: 'Wine Tasting Tour',
        price: '€40-60',
        duration: '4-5 hours',
        description: 'Visit traditional wineries and taste local varieties'
      },
      {
        name: 'Volcanic Islands Cruise',
        price: '€25-40',
        duration: '6-8 hours',
        description: 'Explore volcanic islands and hot springs'
      },
      {
        name: 'Akrotiri Archaeological Site',
        price: '€12',
        duration: '2-3 hours',
        description: 'Ancient Minoan city preserved by volcanic ash'
      }
    ],
    
    safety: {
      level: 'Very Safe',
      commonIssues: ['Strong sun exposure', 'Crowded tourist areas', 'Steep paths'],
      tips: [
        'Use high SPF sunscreen',
        'Wear comfortable walking shoes',
        'Book sunset viewing spots early',
        'Stay hydrated',
        'Respect local customs'
      ]
    },
    
    budgetBreakdown: {
      budget: {
        accommodation: '$50-80/night',
        food: '$30-45/day',
        transport: '$20-30/day',
        activities: '$25-40/day',
        total: '$125-195/day'
      },
      midRange: {
        accommodation: '$150-250/night',
        food: '$60-90/day',
        transport: '$30-50/day',
        activities: '$50-80/day',
        total: '$290-470/day'
      },
      luxury: {
        accommodation: '$400-800/night',
        food: '$120-200/day',
        transport: '$60-100/day',
        activities: '$100-150/day',
        total: '$680-1250/day'
      }
    }
  }
}

const DestinationDetailPage = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [destination, setDestination] = useState(null)
  const [loading, setLoading] = useState(true)
  const [isLiked, setIsLiked] = useState(false)
  const [isSaved, setIsSaved] = useState(false)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [activeTab, setActiveTab] = useState('overview')

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      const foundDestination = destinationsData[parseInt(id)]
      setDestination(foundDestination)
      setLoading(false)
    }, 1000)
  }, [id])

  const handleLike = () => setIsLiked(!isLiked)
  const handleSave = () => setIsSaved(!isSaved)

  const nextImage = () => {
    if (destination?.images) {
      setCurrentImageIndex((prev) => 
        prev === destination.images.length - 1 ? 0 : prev + 1
      )
    }
  }

  const prevImage = () => {
    if (destination?.images) {
      setCurrentImageIndex((prev) => 
        prev === 0 ? destination.images.length - 1 : prev - 1
      )
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

  if (!destination) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-midnight-900 via-midnight-800 to-ocean-900 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white mb-4">Destination Not Found</h2>
          <p className="text-white/70 mb-6">The destination you're looking for doesn't exist.</p>
          <button
            onClick={() => navigate('/explore')}
            className="px-6 py-3 bg-gradient-to-r from-aurora-500 to-coral-500 text-white rounded-xl font-semibold hover:from-aurora-600 hover:to-coral-600 transition-all duration-200"
          >
            Back to Explore
          </button>
        </div>
      </div>
    )
  }

  const tabs = [
    { id: 'overview', label: 'Overview', icon: InformationCircleIcon },
    { id: 'accommodation', label: 'Hotels', icon: BuildingOfficeIcon },
    { id: 'activities', label: 'Activities', icon: MapIcon },
    { id: 'practical', label: 'Practical Info', icon: ExclamationTriangleIcon },
    { id: 'budget', label: 'Budget', icon: BanknotesIcon }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-midnight-900 via-midnight-800 to-ocean-900">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-midnight-900/80 backdrop-blur-xl border-b border-white/10">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => navigate('/explore')}
              className="flex items-center text-white/70 hover:text-white transition-colors"
            >
              <ArrowLeftIcon className="w-5 h-5 mr-2" />
              Back to Explore
            </button>
            
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
                    ? 'bg-yellow-500/20 text-yellow-400' 
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
            </div>
          </div>
        </div>
      </div>

      {/* Hero Image Gallery */}
      <div className="relative h-96 md:h-[500px] overflow-hidden">
        <motion.div
          key={currentImageIndex}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="absolute inset-0"
        >
          <img
            src={destination.images[currentImageIndex]}
            alt={destination.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-midnight-900/60 via-transparent to-transparent" />
        </motion.div>
        
        {/* Image Navigation */}
        {destination.images.length > 1 && (
          <>
            <button
              onClick={prevImage}
              className="absolute left-4 top-1/2 transform -translate-y-1/2 p-3 bg-black/50 text-white rounded-full hover:bg-black/70 transition-all duration-200"
            >
              ←
            </button>
            <button
              onClick={nextImage}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 p-3 bg-black/50 text-white rounded-full hover:bg-black/70 transition-all duration-200"
            >
              →
            </button>
          </>
        )}
        
        {/* Hero Content */}
        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-12">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
              {destination.name}
            </h1>
            <div className="flex items-center space-x-6 text-white/80 mb-4">
              <div className="flex items-center space-x-2">
                <MapPinIcon className="w-5 h-5" />
                <span>{destination.country}</span>
              </div>
              <div className="flex items-center space-x-2">
                <StarIcon className="w-5 h-5 text-yellow-400" />
                <span>{destination.rating}</span>
                <span className="text-white/60">({destination.reviews} reviews)</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="sticky top-16 z-40 bg-midnight-900/90 backdrop-blur-xl border-b border-white/10">
        <div className="container mx-auto px-6">
          <div className="flex space-x-8 overflow-x-auto py-4">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg whitespace-nowrap transition-all duration-200 ${
                  activeTab === tab.id
                    ? 'bg-aurora-500/20 text-aurora-300'
                    : 'text-white/70 hover:text-white hover:bg-white/10'
                }`}
              >
                <tab.icon className="w-5 h-5" />
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content Sections */}
      <div className="container mx-auto px-6 py-12">
        {activeTab === 'overview' && (
          <div className="grid lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2 space-y-8">
              {/* Description */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                <h2 className="text-3xl font-bold text-white mb-6">About {destination.name}</h2>
                <p className="text-lg text-white/70 leading-relaxed mb-6">
                  {destination.description}
                </p>
                
                <div className="mb-8">
                  <h3 className="text-xl font-semibold text-white mb-4">Highlights</h3>
                  <div className="flex flex-wrap gap-3">
                    {destination.highlights.map((highlight, index) => (
                      <span
                        key={index}
                        className="px-4 py-2 bg-aurora-500/20 text-aurora-300 rounded-full text-sm border border-aurora-500/30"
                      >
                        {highlight}
                      </span>
                    ))}
                  </div>
                </div>
              </motion.div>

              {/* Weather Information */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20"
              >
                <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
                  <SunIcon className="w-6 h-6 mr-2 text-yellow-400" />
                  Weather & Climate
                </h3>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="text-white font-medium mb-3">Best Time to Visit</h4>
                    <p className="text-aurora-300 font-semibold">{destination.weather.bestTime}</p>
                  </div>
                  <div className="space-y-3">
                    {Object.entries(destination.weather).filter(([key]) => key !== 'bestTime').map(([season, data]) => (
                      <div key={season} className="flex justify-between items-center">
                        <span className="text-white/70 capitalize">{season}:</span>
                        <span className="text-white">{data.temp} - {data.condition}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Sidebar */}
            <div className="space-y-8">
              {/* Quick Stats */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20"
              >
                <h3 className="text-xl font-semibold text-white mb-4">Quick Info</h3>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-white/70">Language:</span>
                    <span className="text-white">{destination.language}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/70">Currency:</span>
                    <span className="text-white">{destination.currency}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/70">Time Zone:</span>
                    <span className="text-white">{destination.timezone}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/70">Emergency:</span>
                    <span className="text-white">{destination.emergencyNumber}</span>
                  </div>
                </div>
              </motion.div>

              {/* Plan Trip CTA */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="bg-gradient-to-r from-aurora-500/20 to-coral-500/20 rounded-2xl p-6 border border-aurora-500/30 text-center"
              >
                <h3 className="text-xl font-semibold text-white mb-4">Ready to Visit?</h3>
                <p className="text-white/70 mb-6">Start planning your trip to {destination.name}</p>
                <Link
                  to="/create-trip"
                  state={{ destination: destination.name }}
                  className="inline-flex items-center justify-center w-full px-6 py-3 bg-gradient-to-r from-aurora-500 to-coral-500 text-white rounded-xl font-semibold hover:from-aurora-600 hover:to-coral-600 transition-all duration-200"
                >
                  <PlusIcon className="w-5 h-5 mr-2" />
                  Plan Your Trip
                </Link>
              </motion.div>
            </div>
          </div>
        )}

        {activeTab === 'accommodation' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl font-bold text-white mb-8">Accommodation Options</h2>
            <div className="grid md:grid-cols-2 gap-6">
              {destination.hotels.map((hotel, index) => (
                <div
                  key={index}
                  className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 hover:bg-white/15 transition-all duration-300"
                >
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-xl font-bold text-white">{hotel.name}</h3>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                      hotel.category === 'Luxury' ? 'bg-gold-500/20 text-gold-300' :
                      hotel.category === 'Mid-Range' ? 'bg-aurora-500/20 text-aurora-300' :
                      'bg-emerald-500/20 text-emerald-300'
                    }`}>
                      {hotel.category}
                    </span>
                  </div>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-white/70">Price Range:</span>
                      <span className="text-coral-400 font-semibold">{hotel.priceRange}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-white/70">Rating:</span>
                      <div className="flex items-center">
                        <StarIcon className="w-4 h-4 text-yellow-400 mr-1" />
                        <span className="text-white">{hotel.rating}</span>
                      </div>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-white/70">Location:</span>
                      <span className="text-white">{hotel.location}</span>
                    </div>
                    <div className="mt-4">
                      <h4 className="text-white font-medium mb-2">Amenities</h4>
                      <div className="flex flex-wrap gap-2">
                        {hotel.amenities.map((amenity, idx) => (
                          <span
                            key={idx}
                            className="px-2 py-1 bg-white/10 text-white/80 rounded-lg text-xs"
                          >
                            {amenity}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {activeTab === 'activities' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl font-bold text-white mb-8">Things to Do</h2>
            <div className="grid md:grid-cols-2 gap-6">
              {destination.activities.map((activity, index) => (
                <div
                  key={index}
                  className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 hover:bg-white/15 transition-all duration-300"
                >
                  <h3 className="text-xl font-bold text-white mb-3">{activity.name}</h3>
                  <p className="text-white/70 mb-4">{activity.description}</p>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center text-coral-400">
                        <CurrencyDollarIcon className="w-4 h-4 mr-1" />
                        <span className="font-semibold">{activity.price}</span>
                      </div>
                      <div className="flex items-center text-aurora-400">
                        <ClockIcon className="w-4 h-4 mr-1" />
                        <span>{activity.duration}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {activeTab === 'practical' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-8"
          >
            <h2 className="text-3xl font-bold text-white mb-8">Practical Information</h2>
            
            {/* Transportation */}
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
              <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
                <MapIcon className="w-6 h-6 mr-2 text-aurora-400" />
                Transportation
              </h3>
              <div className="grid md:grid-cols-2 gap-6">
                {Object.entries(destination.transportation).map(([key, value]) => (
                  <div key={key} className="flex justify-between">
                    <span className="text-white/70 capitalize">{key.replace(/([A-Z])/g, ' $1')}:</span>
                    <span className="text-white text-right">{value}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Hospitals */}
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
              <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
                <ShieldCheckIcon className="w-6 h-6 mr-2 text-red-400" />
                Medical Facilities
              </h3>
              <div className="space-y-4">
                {destination.hospitals.map((hospital, index) => (
                  <div key={index} className="border-l-4 border-red-400 pl-4">
                    <h4 className="text-white font-semibold">{hospital.name}</h4>
                    <p className="text-white/70 text-sm">{hospital.type}</p>
                    <p className="text-white/60 text-sm">{hospital.phone}</p>
                    <p className="text-white/60 text-sm">{hospital.address}</p>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {hospital.services.map((service, idx) => (
                        <span key={idx} className="px-2 py-1 bg-red-500/20 text-red-300 rounded text-xs">
                          {service}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Dining Prices */}
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
              <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
                <CurrencyDollarIcon className="w-6 h-6 mr-2 text-emerald-400" />
                Food & Dining Prices
              </h3>
              <div className="grid md:grid-cols-2 gap-6">
                {Object.entries(destination.dining).map(([key, value]) => (
                  <div key={key} className="flex justify-between">
                    <span className="text-white/70 capitalize">{key.replace(/([A-Z])/g, ' $1')}:</span>
                    <span className="text-emerald-400 font-semibold">{value}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Safety Information */}
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
              <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
                <ExclamationTriangleIcon className="w-6 h-6 mr-2 text-yellow-400" />
                Safety & Tips
              </h3>
              <div className="mb-4">
                <span className="text-white/70">Safety Level: </span>
                <span className="text-emerald-400 font-semibold">{destination.safety.level}</span>
              </div>
              <div className="space-y-4">
                <div>
                  <h4 className="text-white font-medium mb-2">Common Issues:</h4>
                  <ul className="list-disc list-inside text-white/70 space-y-1">
                    {destination.safety.commonIssues.map((issue, index) => (
                      <li key={index}>{issue}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h4 className="text-white font-medium mb-2">Safety Tips:</h4>
                  <ul className="list-disc list-inside text-white/70 space-y-1">
                    {destination.safety.tips.map((tip, index) => (
                      <li key={index}>{tip}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === 'budget' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl font-bold text-white mb-8">Budget Breakdown</h2>
            <div className="grid md:grid-cols-3 gap-6">
              {Object.entries(destination.budgetBreakdown).map(([category, budget]) => (
                <div
                  key={category}
                  className={`bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 ${
                    category === 'budget' ? 'border-emerald-500/30' :
                    category === 'midRange' ? 'border-aurora-500/30' :
                    'border-gold-500/30'
                  }`}
                >
                  <h3 className={`text-xl font-bold mb-4 capitalize ${
                    category === 'budget' ? 'text-emerald-400' :
                    category === 'midRange' ? 'text-aurora-400' :
                    'text-gold-400'
                  }`}>
                    {category === 'midRange' ? 'Mid-Range' : category}
                  </h3>
                  <div className="space-y-3">
                    {Object.entries(budget).map(([item, cost]) => (
                      <div key={item} className="flex justify-between">
                        <span className="text-white/70 capitalize">{item}:</span>
                        <span className={`font-semibold ${
                          item === 'total' ? 'text-white text-lg' : 'text-white/90'
                        }`}>
                          {cost}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  )
}

export default DestinationDetailPage
