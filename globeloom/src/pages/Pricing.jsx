import React, { useState } from 'react'
 
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import {
  CheckIcon,
  XMarkIcon,
  StarIcon,
  GlobeAltIcon,
  MapPinIcon,
  CameraIcon,
  TrophyIcon,
  SparklesIcon,
  HeartIcon,
  UsersIcon,
  LightBulbIcon,
  ShieldCheckIcon
} from '@heroicons/react/24/outline'

const Pricing = () => {
  const [isYearly, setIsYearly] = useState(false)

  const [plans] = useState([
    {
      id: 'free',
      name: 'Explorer',
      description: 'Perfect for occasional travelers and first-time adventurers',
      monthlyPrice: 0,
      yearlyPrice: 0,
      popular: false,
      color: 'from-ocean-500 to-ocean-600',
      features: [
        { name: 'Up to 3 trips per month', included: true },
        { name: 'Basic AI recommendations', included: true },
        { name: 'Community access', included: true },
        { name: 'Photo sharing', included: true },
        { name: 'Basic trip templates', included: true },
        { name: 'Mobile app access', included: true },
        { name: 'Advanced AI planning', included: false },
        { name: 'Unlimited trips', included: false },
        { name: 'Premium destinations', included: false },
        { name: 'Priority support', included: false },
        { name: 'Custom branding', included: false },
        { name: 'Team collaboration', included: false }
      ],
      cta: 'Get Started Free',
      badge: null
    },
    {
      id: 'pro',
      name: 'Adventurer',
      description: 'For passionate travelers who want the full experience',
      monthlyPrice: 19,
      yearlyPrice: 190,
      popular: true,
      color: 'from-coral-500 to-sunset-500',
      features: [
        { name: 'Unlimited trips', included: true },
        { name: 'Advanced AI recommendations', included: true },
        { name: 'Premium destinations database', included: true },
        { name: 'Offline access', included: true },
        { name: 'Advanced analytics', included: true },
        { name: 'Priority customer support', included: true },
        { name: 'Custom trip sharing', included: true },
        { name: 'Weather integration', included: true },
        { name: 'Budget tracking', included: true },
        { name: 'Group trip planning', included: true },
        { name: 'Custom branding', included: false },
        { name: 'Team collaboration', included: false }
      ],
      cta: 'Start Adventure',
      badge: 'Most Popular'
    },
    {
      id: 'business',
      name: 'Navigator',
      description: 'Perfect for travel agencies and frequent business travelers',
      monthlyPrice: 49,
      yearlyPrice: 490,
      popular: false,
      color: 'from-aurora-500 to-tropical-500',
      features: [
        { name: 'Everything in Adventurer', included: true },
        { name: 'Team collaboration tools', included: true },
        { name: 'Custom branding', included: true },
        { name: 'API access', included: true },
        { name: 'Advanced reporting', included: true },
        { name: 'Dedicated account manager', included: true },
        { name: 'White-label solution', included: true },
        { name: 'Custom integrations', included: true },
        { name: 'Enterprise security', included: true },
        { name: 'SLA guarantee', included: true },
        { name: 'Training sessions', included: true },
        { name: '24/7 phone support', included: true }
      ],
      cta: 'Contact Sales',
      badge: 'Enterprise'
    }
  ])

  const [features] = useState([
    {
      title: 'AI-Powered Planning',
      description: 'Our advanced AI creates personalized itineraries based on your preferences, budget, and travel style.',
      icon: LightBulbIcon,
      gradient: 'from-coral-500 to-sunset-500'
    },
    {
      title: 'Global Community',
      description: 'Connect with travelers worldwide, share experiences, and get insider tips from locals.',
      icon: UsersIcon,
      gradient: 'from-aurora-500 to-ocean-500'
    },
    {
      title: 'Smart Recommendations',
      description: 'Discover hidden gems and popular attractions with our intelligent recommendation engine.',
      icon: SparklesIcon,
      gradient: 'from-tropical-500 to-emerald-500'
    },
    {
      title: 'Secure & Reliable',
      description: 'Your data is protected with enterprise-grade security and backed by 99.9% uptime guarantee.',
      icon: ShieldCheckIcon,
      gradient: 'from-purple-500 to-pink-500'
    }
  ])

  const [testimonials] = useState([
    {
      name: 'Sarah Chen',
      role: 'Digital Nomad',
      avatar: '👩‍💻',
      quote: 'GlobeLoom has revolutionized how I plan my travels. The AI recommendations are spot-on and have led me to some incredible hidden gems!',
      rating: 5,
      plan: 'Adventurer'
    },
    {
      name: 'Marcus Rodriguez',
      role: 'Travel Blogger',
      avatar: '📸',
      quote: 'The community features and photo sharing capabilities have helped me grow my travel blog exponentially. Best investment ever!',
      rating: 5,
      plan: 'Adventurer'
    },
    {
      name: 'Lisa Thompson',
      role: 'Travel Agency Owner',
      avatar: '✈️',
      quote: 'The Navigator plan has streamlined our entire business. Custom branding and team collaboration tools are game-changers.',
      rating: 5,
      plan: 'Navigator'
    }
  ])

  const [faqs] = useState([
    {
      question: 'Can I change my plan anytime?',
      answer: 'Yes! You can upgrade or downgrade your plan at any time. Changes take effect immediately, and we\'ll prorate any billing differences.'
    },
    {
      question: 'Is there a free trial available?',
      answer: 'We offer a generous free plan that you can use indefinitely. You can also try any paid plan free for 14 days.'
    },
    {
      question: 'What payment methods do you accept?',
      answer: 'We accept all major credit cards, PayPal, and bank transfers for annual plans. All payments are processed securely.'
    },
    {
      question: 'Can I get a refund?',
      answer: 'We offer a 30-day money-back guarantee for all paid plans. If you\'re not satisfied, we\'ll provide a full refund.'
    },
    {
      question: 'Is my data secure?',
      answer: 'Absolutely! We use enterprise-grade encryption and follow industry best practices to keep your data safe and secure.'
    },
    {
      question: 'Do you offer discounts for students or nonprofits?',
      answer: 'Yes! We offer 50% discounts for students and verified nonprofits. Contact our support team to learn more.'
    }
  ])

  const [openFaq, setOpenFaq] = useState(null)

  const getPrice = (plan) => {
    return isYearly ? plan.yearlyPrice : plan.monthlyPrice
  }

  const getSavings = (plan) => {
    const monthlyCost = plan.monthlyPrice * 12
    const yearlyCost = plan.yearlyPrice
    return monthlyCost - yearlyCost
  }

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <motion.div
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="mx-auto h-20 w-20 bg-gradient-to-r from-coral-500 to-sunset-500 rounded-full flex items-center justify-center mb-8"
          >
            <TrophyIcon className="w-10 h-10 text-white" />
          </motion.div>
          
          <h1 className="text-5xl font-bold bg-gradient-to-r from-white to-coral-300 bg-clip-text text-transparent mb-4">
            Choose Your Adventure
          </h1>
          <p className="text-xl text-ocean-300 mb-8 max-w-3xl mx-auto">
            Select the perfect plan for your travel style. Start free and upgrade anytime as your wanderlust grows.
          </p>

          {/* Billing Toggle */}
          <div className="flex items-center justify-center gap-4 mb-12">
            <span className={`text-lg font-medium transition-colors ${!isYearly ? 'text-white' : 'text-ocean-400'}`}>
              Monthly
            </span>
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsYearly(!isYearly)}
              className={`relative w-16 h-8 rounded-full p-1 transition-colors duration-300 ${
                isYearly ? 'bg-gradient-to-r from-coral-500 to-sunset-500' : 'bg-white/20'
              }`}
            >
              <motion.div
                layout
                className="w-6 h-6 bg-white rounded-full"
                animate={{ x: isYearly ? 32 : 0 }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
              />
            </motion.button>
            <span className={`text-lg font-medium transition-colors ${isYearly ? 'text-white' : 'text-ocean-400'}`}>
              Yearly
            </span>
            {isYearly && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-gradient-to-r from-emerald-500 to-tropical-500 text-white px-3 py-1 rounded-full text-sm font-medium"
              >
                Save up to 20%
              </motion.div>
            )}
          </div>
        </motion.div>

        {/* Pricing Cards */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20"
        >
          {plans.map((plan, index) => (
            <motion.div
              key={plan.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * index, duration: 0.5 }}
              whileHover={{ y: -8, scale: 1.02 }}
              className={`relative bg-white/10 backdrop-blur-lg rounded-2xl p-8 border transition-all duration-300 ${
                plan.popular 
                  ? 'border-coral-400 ring-2 ring-coral-400/20 scale-105' 
                  : 'border-white/20 hover:border-white/40'
              }`}
            >
              {plan.badge && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <div className="bg-gradient-to-r from-coral-500 to-sunset-500 text-white px-4 py-1 rounded-full text-sm font-medium">
                    {plan.badge}
                  </div>
                </div>
              )}

              <div className="text-center mb-8">
                <div className={`inline-flex p-3 rounded-xl bg-gradient-to-r ${plan.color} mb-4`}>
                  {plan.id === 'free' && <MapPinIcon className="w-6 h-6 text-white" />}
                  {plan.id === 'pro' && <TrophyIcon className="w-6 h-6 text-white" />}
                  {plan.id === 'business' && <TrophyIcon className="w-6 h-6 text-white" />}
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">{plan.name}</h3>
                <p className="text-ocean-300 text-sm mb-6">{plan.description}</p>
                
                <div className="mb-6">
                  <div className="flex items-baseline justify-center">
                    <span className="text-4xl font-bold text-white">
                      ${getPrice(plan)}
                    </span>
                    {plan.monthlyPrice > 0 && (
                      <span className="text-ocean-400 ml-2">
                        /{isYearly ? 'year' : 'month'}
                      </span>
                    )}
                  </div>
                  {isYearly && plan.monthlyPrice > 0 && getSavings(plan) > 0 && (
                    <div className="text-emerald-400 text-sm mt-2">
                      Save ${getSavings(plan)} per year
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-4 mb-8">
                {plan.features.map((feature, featureIndex) => (
                  <div key={featureIndex} className="flex items-center space-x-3">
                    <div className={`flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center ${
                      feature.included 
                        ? 'bg-emerald-500/20 text-emerald-400' 
                        : 'bg-red-500/20 text-red-400'
                    }`}>
                      {feature.included ? (
                        <CheckIcon className="w-3 h-3" />
                      ) : (
                        <XMarkIcon className="w-3 h-3" />
                      )}
                    </div>
                    <span className={`text-sm ${
                      feature.included ? 'text-white' : 'text-ocean-400'
                    }`}>
                      {feature.name}
                    </span>
                  </div>
                ))}
              </div>              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`w-full py-3 px-6 rounded-xl font-semibold transition-all duration-300 ${
                  plan.popular
                    ? 'bg-gradient-to-r from-coral-500 to-sunset-500 text-white hover:from-coral-600 hover:to-sunset-600'
                    : 'bg-white/10 text-white border border-white/20 hover:bg-white/20'
                }`}
              >
                {plan.cta}
              </motion.button>
            </motion.div>
          ))}
        </motion.div>

        {/* Features Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.6 }}
          className="mb-20"
        >
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-4">Why Choose GlobeLoom?</h2>
            <p className="text-ocean-300 text-lg">Powerful features that make travel planning effortless and exciting</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1 * index, duration: 0.5 }}
                whileHover={{ y: -5 }}
                className="text-center p-6 bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 hover:bg-white/10 transition-all duration-300"
              >
                <div className={`inline-flex p-3 rounded-xl bg-gradient-to-r ${feature.gradient} mb-4`}>
                  <feature.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">{feature.title}</h3>
                <p className="text-ocean-300 text-sm">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Testimonials Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.6 }}
          className="mb-20"
        >
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-4">Loved by Travelers Worldwide</h2>
            <p className="text-ocean-300 text-lg">See what our community has to say about their GlobeLoom experience</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={testimonial.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index, duration: 0.5 }}
                className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20"
              >
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-coral-500 to-sunset-500 rounded-full flex items-center justify-center text-white text-xl mr-4">
                    {testimonial.avatar}
                  </div>
                  <div>
                    <h4 className="font-bold text-white">{testimonial.name}</h4>
                    <p className="text-ocean-300 text-sm">{testimonial.role}</p>
                  </div>
                </div>
                
                <div className="flex mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <StarIcon key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                  ))}
                </div>
                
                <p className="text-ocean-200 mb-4">"{testimonial.quote}"</p>
                
                <div className="text-coral-400 text-sm font-medium">
                  {testimonial.plan} Plan
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* FAQ Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.0, duration: 0.6 }}
          className="mb-20"
        >
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-4">Frequently Asked Questions</h2>
            <p className="text-ocean-300 text-lg">Everything you need to know about GlobeLoom</p>
          </div>
          
          <div className="max-w-3xl mx-auto space-y-4">
            {faqs.map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.1 * index, duration: 0.3 }}
                className="bg-white/10 backdrop-blur-lg rounded-xl border border-white/20 overflow-hidden"
              >
                <motion.button
                  onClick={() => setOpenFaq(openFaq === index ? null : index)}
                  className="w-full p-6 text-left flex items-center justify-between hover:bg-white/5 transition-colors"
                >
                  <h3 className="font-semibold text-white">{faq.question}</h3>
                  <motion.div
                    animate={{ rotate: openFaq === index ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <svg className="w-5 h-5 text-ocean-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </motion.div>
                </motion.button>
                
                <motion.div
                  initial={false}
                  animate={{ height: openFaq === index ? "auto" : 0 }}
                  transition={{ duration: 0.3 }}
                  className="overflow-hidden"
                >
                  <div className="px-6 pb-6">
                    <p className="text-ocean-300">{faq.answer}</p>
                  </div>
                </motion.div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2, duration: 0.6 }}
          className="text-center bg-gradient-to-r from-coral-500/20 to-sunset-500/20 backdrop-blur-lg rounded-2xl p-12 border border-coral-400/30"
        >
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to Start Your Journey?
          </h2>
          <p className="text-ocean-300 text-lg mb-8 max-w-2xl mx-auto">
            Join thousands of travelers who have transformed their adventures with GlobeLoom. 
            Start your free account today and begin planning your next unforgettable trip.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/sign-up">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-3 bg-gradient-to-r from-coral-500 to-sunset-500 text-white rounded-xl font-semibold hover:from-coral-600 hover:to-sunset-600 transition-all duration-300"
              >
                Start Free Today
              </motion.button>
            </Link>
            <Link to="/contact">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-3 bg-transparent border-2 border-white/20 text-white rounded-xl font-semibold hover:bg-white/10 transition-all duration-300"
              >
                Contact Sales
              </motion.button>
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default Pricing
