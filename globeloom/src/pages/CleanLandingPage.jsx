// Clean, Minimal, and Professional Landing Page for GlobeLoom
import React, { useRef, useState } from 'react'
import { motion, useInView, useScroll, useTransform } from 'framer-motion'
import { Link } from 'react-router-dom'
import { 
  MapIcon, 
  GlobeAltIcon,
  UserGroupIcon,
  PaperAirplaneIcon,
  StarIcon,
  ArrowRightIcon,
  CheckIcon,
  CalendarIcon,
  ShieldCheckIcon,
  PlayIcon,
  ChevronLeftIcon,
  ChevronRightIcon
} from '@heroicons/react/24/solid'
import Aurora from '../Backgrounds/Aurora/Aurora'
import Particles from '../Backgrounds/Particles/Particles'

// Trusted Partners logos with high-quality, clear logos from CDN
const trustedPartners = [
  { 
    name: 'Booking.com', 
    logo: 'https://static.cdnlogo.com/logos/b/46/booking-com.svg'
  },
  { 
    name: 'Airbnb', 
    logo: 'https://cdn.worldvectorlogo.com/logos/airbnb-2.svg'
  },
  { 
    name: 'Expedia', 
    logo: 'https://static.cdnlogo.com/logos/e/33/expedia.svg'
  },
  { 
    name: 'TripAdvisor', 
    logo: 'https://static.cdnlogo.com/logos/t/24/tripadvisor-circle-green-vertical-lockup-registered-rgb.svg'
  },
  { 
    name: 'Skyscanner', 
    logo: 'https://static.cdnlogo.com/logos/s/11/skyscanner-lockuphorizontal-skyblue-rgb.svg'
  }
]

// Clean Hero Section
function CleanHero() {
  const ref = useRef(null)
  const { scrollY } = useScroll()
  const y = useTransform(scrollY, [0, 1000], [0, -100])
  const isInView = useInView(ref, { once: true })

  return (
    <motion.section 
      ref={ref}
      style={{ y }}
      className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900"
    >
      {/* Simple background */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900/80 via-slate-800/80 to-slate-900/80" />
      
      {/* Subtle grid */}
      <div className="absolute inset-0 opacity-5">
        <div className="h-full w-full bg-grid-white/[0.02] bg-[size:60px_60px]" />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          {/* Badge */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={isInView ? { scale: 1, opacity: 1 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500/10 border border-blue-500/20 rounded-full text-blue-400 text-sm mb-8"
          >
            <GlobeAltIcon className="w-4 h-4" />
            Your Travel Companion
          </motion.div>

          {/* Main Headline */}
          <motion.h1 
            className="text-5xl md:text-7xl font-bold text-white mb-8 leading-tight"
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            Plan Your Perfect
            <span className="bg-gradient-to-r from-blue-400 to-emerald-400 bg-clip-text text-transparent block">
              Adventure
            </span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p 
            className="text-xl text-slate-300 mb-12 max-w-3xl mx-auto leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            Discover amazing destinations, plan unforgettable trips, and connect with trusted travel partners worldwide.
          </motion.p>

          {/* CTA Buttons */}          <motion.div 
            className="flex flex-col sm:flex-row gap-4 justify-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.5 }}
          >
            <Link to="/ai-recommendations">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-300 flex items-center gap-2"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423L16.5 15.75l.394 1.183a2.25 2.25 0 001.423 1.423L19.5 18.75l-1.183.394a2.25 2.25 0 00-1.423 1.423z"/>
                </svg>
                AI Trip Planner
              </motion.button>
            </Link>
            <Link to="/create-trip">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-gradient-to-r from-blue-500 to-emerald-500 hover:from-blue-600 hover:to-emerald-600 text-white px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-300 flex items-center gap-2"
              >
                <PaperAirplaneIcon className="w-5 h-5" />
                Start Planning
              </motion.button>
            </Link>
            <Link to="/explore">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="border border-slate-600 hover:border-slate-500 text-white px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-300 flex items-center gap-2"
              >
                <PlayIcon className="w-5 h-5" />
                Explore
              </motion.button>
            </Link>
          </motion.div>

          {/* Simple Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="grid grid-cols-3 gap-8 max-w-2xl mx-auto"
          >
            <div className="text-center">
              <div className="text-3xl font-bold text-white">50K+</div>
              <div className="text-slate-400 text-sm">Happy Travelers</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-white">195</div>
              <div className="text-slate-400 text-sm">Countries</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-white">4.9</div>
              <div className="text-slate-400 text-sm">Rating</div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </motion.section>
  )
}

// Platform Abilities Section
function PlatformAbilities() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, threshold: 0.2 })

  const abilities = [
    {
      icon: MapIcon,
      title: "Smart Planning",
      description: "AI-powered itinerary creation that adapts to your preferences and budget.",
    },
    {
      icon: UserGroupIcon,
      title: "Group Collaboration",
      description: "Plan trips together with friends and family in real-time.",
    },
    {
      icon: ShieldCheckIcon,
      title: "Safe & Secure",
      description: "Travel with confidence using our verified partners and safety features.",
    },
    {
      icon: CalendarIcon,
      title: "Flexible Booking",
      description: "Book flights, hotels, and activities with flexible cancellation policies.",
    }  ]

  return (
    <section ref={ref} className="py-24 bg-transparent">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Why Choose GlobeLoom?
          </h2>
          <p className="text-xl text-slate-300 max-w-3xl mx-auto">
            Our platform combines cutting-edge technology with trusted partnerships to deliver exceptional travel experiences.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {abilities.map((ability, index) => (
            <motion.div
              key={ability.title}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: index * 0.1 }}
              className="text-center group"
            >
              <motion.div
                whileHover={{ scale: 1.1 }}
                className="w-16 h-16 mx-auto mb-6 bg-gradient-to-r from-blue-500 to-emerald-500 rounded-xl flex items-center justify-center"
              >
                <ability.icon className="w-8 h-8 text-white" />
              </motion.div>
              <h3 className="text-xl font-semibold text-white mb-4">{ability.title}</h3>
              <p className="text-slate-300 leading-relaxed">{ability.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

// Brand Logo Slider - Seamless infinite sliding
function TrustedPartnersSlider() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, threshold: 0.2 })
  const [isPaused, setIsPaused] = useState(false)

  // Create multiple copies for perfectly seamless infinite scroll
  const extendedPartners = [...trustedPartners, ...trustedPartners]

  return (
    <section ref={ref} className="py-24 bg-transparent border-t border-slate-800/20">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Trusted by Global Partners
          </h2>
          <p className="text-xl text-slate-300 max-w-3xl mx-auto">
            We collaborate with the world's leading travel brands to bring you exceptional experiences and unbeatable deals.
          </p>
        </motion.div>

        {/* Seamless Logo Slider */}
        <div className="relative overflow-hidden">
          <motion.div
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="flex gap-8 py-8"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
            style={{
              animation: 'slideLogosSeamless 20s linear infinite',
              animationPlayState: isPaused ? 'paused' : 'running',
              width: 'fit-content'
            }}
          >
            {extendedPartners.map((partner, index) => (
              <motion.div
                key={`${partner.name}-${index}`}
                className="flex-shrink-0 group cursor-pointer"
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.3 }}
              >
                <div className="flex flex-col items-center justify-center w-[180px] h-[140px] p-3 bg-slate-800/20 rounded-xl backdrop-blur-sm border border-slate-700/30 hover:border-blue-500/50 transition-all duration-300">
                  {/* Logo Container - grows on hover */}
                  <div className="flex items-center justify-center mb-3 h-12 group-hover:scale-125 transition-transform duration-300">
                    <img
                      src={partner.logo}
                      alt={`${partner.name} logo`}
                      className="max-h-10 max-w-[80px] w-auto h-auto object-contain"
                      style={{ 
                        filter: 'brightness(1.1) contrast(1.1)',
                        opacity: 1
                      }}
                      onError={(e) => {
                        // Fallback if image fails to load
                        e.target.style.display = 'none'
                        e.target.nextElementSibling.style.display = 'flex'
                      }}
                    />
                    {/* Fallback logo */}
                    <div className="hidden w-10 h-10 bg-gradient-to-br from-blue-500 to-emerald-500 rounded-xl items-center justify-center">
                      <span className="text-white font-bold text-sm">{partner.name[0]}</span>
                    </div>
                  </div>

                  {/* Partner Name */}
                  <div className="text-center mb-2">
                    <h3 className="text-xs font-medium text-white/90 group-hover:text-blue-400 transition-colors duration-300">
                      {partner.name}
                    </h3>
                  </div>

                  {/* 5 Stars Rating */}
                  <div className="flex items-center gap-0.5 mb-2">
                    {[...Array(5)].map((_, i) => (
                      <StarIcon key={i} className="w-3 h-3 text-yellow-400 fill-current" />
                    ))}
                  </div>

                  {/* Verified indicator */}
                  <div className="flex items-center justify-center gap-1">
                    <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full"></div>
                    <span className="text-slate-400 text-xs">Verified</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>          {/* Gradient overlays for smooth edges */}
          <div className="absolute top-0 left-0 w-24 h-full bg-gradient-to-r from-slate-900/10 via-slate-900/5 to-transparent pointer-events-none z-10" />
          <div className="absolute top-0 right-0 w-24 h-full bg-gradient-to-l from-slate-900/10 via-slate-900/5 to-transparent pointer-events-none z-10" />
        </div>

        {/* Trust indicators below */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="text-center mt-12"
        >
          <div className="flex items-center justify-center gap-8 text-slate-400">
            <div className="flex items-center gap-2">
              <ShieldCheckIcon className="w-5 h-5 text-emerald-400" />
              <span className="text-sm">Secure Partnerships</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckIcon className="w-5 h-5 text-blue-400" />
              <span className="text-sm">Verified Partners</span>
            </div>
            <div className="flex items-center gap-2">
              <StarIcon className="w-5 h-5 text-yellow-400" />
              <span className="text-sm">5-Star Rated</span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

// Storytelling Features Section
function StorytellingFeatures() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, threshold: 0.2 })

  const stories = [
    {
      title: "Discover Hidden Gems",
      description: "Our AI analyzes millions of travel data points to uncover unique destinations that match your interests perfectly.",
      image: "https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=600&h=400&fit=crop",
      features: ["AI-powered recommendations", "Local insider tips", "Off-the-beaten-path locations"]
    },
    {
      title: "Plan Like a Pro",
      description: "Create detailed itineraries with smart routing, budget optimization, and real-time updates from our trusted partners.",
      image: "https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=600&h=400&fit=crop",
      features: ["Smart itinerary builder", "Budget optimization", "Real-time updates"]
    },
    {
      title: "Travel with Confidence",
      description: "Book through our verified partners and enjoy 24/7 support, flexible cancellations, and comprehensive travel insurance.",
      image: "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=600&h=400&fit=crop",
      features: ["Verified bookings", "24/7 support", "Travel insurance"]
    }  ]

  return (
    <section ref={ref} className="py-24 bg-transparent">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Your Journey, Simplified
          </h2>
          <p className="text-xl text-slate-300 max-w-3xl mx-auto">
            From inspiration to memories, we're with you every step of the way.
          </p>
        </motion.div>

        <div className="space-y-24">
          {stories.map((story, index) => (
            <motion.div
              key={story.title}
              initial={{ opacity: 0, y: 50 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: index * 0.2 }}
              className={`grid grid-cols-1 lg:grid-cols-2 gap-12 items-center ${
                index % 2 === 1 ? 'lg:grid-flow-row-dense' : ''
              }`}
            >
              <div className={index % 2 === 1 ? 'lg:col-start-2' : ''}>
                <h3 className="text-3xl font-bold text-white mb-6">{story.title}</h3>
                <p className="text-lg text-slate-300 mb-8 leading-relaxed">{story.description}</p>
                <ul className="space-y-3">
                  {story.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center gap-3">
                      <CheckIcon className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                      <span className="text-slate-300">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className={index % 2 === 1 ? 'lg:col-start-1' : ''}>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.3 }}
                  className="relative"
                >
                  <img
                    src={story.image}
                    alt={story.title}
                    className="w-full h-80 object-cover rounded-2xl shadow-2xl"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/20 to-transparent rounded-2xl" />
                </motion.div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

// Professional Footer
function ProfessionalFooter() {
  const currentYear = new Date().getFullYear()

  const footerLinks = {
    Product: [
      { name: 'Features', href: '/features' },
      { name: 'Pricing', href: '/pricing' },
      { name: 'API', href: '/api' },
      { name: 'Integrations', href: '/integrations' }
    ],
    Company: [
      { name: 'About', href: '/about' },
      { name: 'Blog', href: '/blog' },
      { name: 'Careers', href: '/careers' },
      { name: 'Contact', href: '/contact' }
    ],
    Support: [
      { name: 'Help Center', href: '/help' },
      { name: 'Community', href: '/community' },
      { name: 'Status', href: '/status' },
      { name: 'Security', href: '/security' }
    ],
    Legal: [
      { name: 'Privacy', href: '/privacy' },
      { name: 'Terms', href: '/terms' },
      { name: 'Cookies', href: '/cookies' },
      { name: 'Licenses', href: '/licenses' }
    ]
  }

  return (
    <footer className="bg-slate-900 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8">
          {/* Brand */}
          <div className="lg:col-span-2">
            <Link to="/" className="flex items-center gap-3 mb-6">
              <GlobeAltIcon className="w-10 h-10 text-blue-500" />
              <span className="text-2xl font-bold text-white">GlobeLoom</span>
            </Link>
            <p className="text-slate-400 mb-6 max-w-sm">
              Your trusted travel companion for discovering amazing destinations and creating unforgettable experiences worldwide.
            </p>
            <div className="flex gap-4">
              <a href="#" className="w-10 h-10 bg-slate-800 hover:bg-slate-700 rounded-lg flex items-center justify-center transition-colors">
                <span className="text-white text-sm">f</span>
              </a>
              <a href="#" className="w-10 h-10 bg-slate-800 hover:bg-slate-700 rounded-lg flex items-center justify-center transition-colors">
                <span className="text-white text-sm">t</span>
              </a>
              <a href="#" className="w-10 h-10 bg-slate-800 hover:bg-slate-700 rounded-lg flex items-center justify-center transition-colors">
                <span className="text-white text-sm">in</span>
              </a>
            </div>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h3 className="text-white font-semibold mb-4">{category}</h3>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link.name}>
                    <Link
                      to={link.href}
                      className="text-slate-400 hover:text-white transition-colors"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom */}
        <div className="border-t border-slate-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-slate-400 text-sm">
            © {currentYear} GlobeLoom. All rights reserved.
          </p>
          <p className="text-slate-400 text-sm mt-4 md:mt-0">
            Made with ❤️ for travelers worldwide
          </p>
        </div>
      </div>
    </footer>
  )
}

// Final CTA Section
function FinalCTA() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, threshold: 0.2 })
  return (
    <section ref={ref} className="py-24 bg-gradient-to-br from-blue-600/30 to-emerald-600/30 backdrop-blur-sm">
      <div className="max-w-4xl mx-auto px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Ready to Start Your Adventure?
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Join thousands of travelers who trust GlobeLoom to create their perfect journeys.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/create-trip">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-white text-blue-600 px-8 py-4 rounded-xl font-semibold text-lg hover:bg-gray-100 transition-all duration-300 flex items-center gap-2"
              >
                <PaperAirplaneIcon className="w-5 h-5" />
                Plan Your Trip
              </motion.button>
            </Link>
            <Link to="/pricing">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="border-2 border-white text-white px-8 py-4 rounded-xl font-semibold text-lg hover:bg-white/10 transition-all duration-300 flex items-center gap-2"
              >
                View Pricing
                <ArrowRightIcon className="w-5 h-5" />
              </motion.button>
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

// Main Clean Landing Page Component
function CleanLandingPage() {
  return (
    <div className="relative min-h-screen bg-slate-900 overflow-hidden">
      {/* Vibey Background Layers */}
      <div className="fixed inset-0 z-0">
        {/* Aurora Background with Travel Colors */}
        <Aurora 
          colorStops={[
            "#1e293b", // Deep slate for depth
            "#0f172a", // Darker slate
            "#0c4a6e"  // Ocean blue for travel theme
          ]}
          amplitude={0.3}
          className="opacity-40"
        />
        
        {/* Particle System representing travel routes */}
        <div className="absolute inset-0 opacity-20">
          <Particles 
            colors={["#3b82f6", "#10b981", "#8b5cf6"]} // Blue, emerald, purple for travel magic
            count={150}
            size={1.5}
            speed={0.5}
          />
        </div>
        
        {/* Gradient Overlay for content readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-slate-900/20 via-transparent to-slate-900/40"></div>
        
        {/* Travel-themed floating elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {/* Floating travel icons */}
          <motion.div
            className="absolute top-20 left-10 opacity-5"
            animate={{ 
              y: [0, -20, 0],
              rotate: [0, 5, 0] 
            }}
            transition={{ 
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut" 
            }}
          >
            <GlobeAltIcon className="w-32 h-32 text-blue-400" />
          </motion.div>
          
          <motion.div
            className="absolute top-40 right-20 opacity-5"
            animate={{ 
              y: [0, 15, 0],
              rotate: [0, -3, 0] 
            }}
            transition={{ 
              duration: 6,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 2 
            }}
          >
            <PaperAirplaneIcon className="w-24 h-24 text-emerald-400" />
          </motion.div>
          
          <motion.div
            className="absolute bottom-32 left-1/4 opacity-5"
            animate={{ 
              y: [0, -25, 0],
              rotate: [0, 8, 0] 
            }}
            transition={{ 
              duration: 10,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 4 
            }}
          >
            <MapIcon className="w-28 h-28 text-purple-400" />
          </motion.div>
        </div>
      </div>
      
      {/* Content Layer */}
      <div className="relative z-10">
        <CleanHero />
        <PlatformAbilities />
        <StorytellingFeatures />
        <TrustedPartnersSlider />
        <FinalCTA />
      </div>
    </div>
  )
}

export default CleanLandingPage
