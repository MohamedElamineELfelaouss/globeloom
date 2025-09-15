import React, { useState } from 'react'
import { motion } from 'framer-motion'
import {
  GlobeAltIcon,
  UserGroupIcon,
  LightBulbIcon,
  HeartIcon,
  StarIcon,
  MapPinIcon,
  CameraIcon,
  TrophyIcon,
  CodeBracketIcon,
  AcademicCapIcon
} from '@heroicons/react/24/outline'

const About = () => {
  const [stats] = useState([
    { label: 'Destinations Featured', value: '6', icon: MapPinIcon },
    { label: 'Technologies Used', value: '8+', icon: CodeBracketIcon },
    { label: 'Project Duration', value: '3 Months', icon: TrophyIcon },
    { label: 'Learning Experience', value: 'Immense', icon: AcademicCapIcon }
  ])
  const [values] = useState([
    {
      title: 'Innovation',
      description: 'Building modern, responsive web applications with cutting-edge technologies and user-centric design.',
      icon: LightBulbIcon,
      color: 'from-coral-500 to-sunset-500'
    },
    {
      title: 'User Experience',
      description: 'Creating intuitive and engaging interfaces that make travel planning enjoyable and effortless.',
      icon: HeartIcon,
      color: 'from-aurora-500 to-ocean-500'
    },
    {
      title: 'Discovery',
      description: 'Showcasing beautiful destinations and inspiring wanderlust through immersive digital experiences.',
      icon: MapPinIcon,
      color: 'from-tropical-500 to-emerald-500'
    },
    {
      title: 'Learning',
      description: 'Continuously improving development skills and exploring new technologies in web development.',
      icon: AcademicCapIcon,
      color: 'from-purple-500 to-pink-500'
    }
  ])
  const [creator] = useState({
    name: 'Mohammed Elamine El Felaouss',
    role: 'Full-Stack Developer & Creator',
    bio: 'Passionate developer creating beautiful web applications with React, modern JavaScript, and innovative design. Dedicated to crafting exceptional user experiences.',
    avatar: '/placeholder.jpg',
    skills: ['React', 'JavaScript', 'Node.js', 'Web Development', 'UI/UX Design']
  })

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Hero Section */}
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
            <GlobeAltIcon className="w-10 h-10 text-white" />
          </motion.div>          <h1 className="text-5xl font-bold text-white mb-6">About GlobeLoom</h1>
          <p className="text-xl text-ocean-300 max-w-3xl mx-auto leading-relaxed">
            A modern travel inspiration platform designed to showcase the world's most beautiful destinations. 
            Built with passion for web development and love for travel exploration.
          </p>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16"
        >
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 * index, duration: 0.5 }}
              className="text-center p-6 bg-white/10 backdrop-blur-lg rounded-xl border border-white/20"
            >
              <div className="w-12 h-12 mx-auto mb-4 bg-gradient-to-r from-coral-500 to-sunset-500 rounded-lg flex items-center justify-center">
                <stat.icon className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-1">{stat.value}</h3>
              <p className="text-ocean-300 text-sm">{stat.label}</p>
            </motion.div>
          ))}
        </motion.div>        {/* Story Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.6 }}
          className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 md:p-12 border border-white/20 mb-16"
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-white mb-6">The Project Story</h2>
              <div className="space-y-4 text-ocean-200 leading-relaxed">
                <p>
                  GlobeLoom is a personal project born from a passion for both web development and travel. 
                  As a developer fascinated by creating beautiful, interactive user experiences, I wanted 
                  to combine my technical skills with my love for exploring new destinations.
                </p>
                <p>
                  This platform represents a journey in modern web development, utilizing React, JavaScript, 
                  and contemporary design principles to create an immersive travel inspiration experience. 
                  Every component was carefully crafted to showcase stunning destinations around the world.
                </p>
                <p>
                  From the interactive destination cards to the smooth animations and responsive design, 
                  GlobeLoom demonstrates the power of modern web technologies in creating engaging 
                  digital experiences that inspire wanderlust and showcase the beauty of our world.
                </p>
              </div>
            </div>
            <div className="relative">
              <div className="aspect-square rounded-2xl overflow-hidden">
                <img
                  src="/placeholder.jpg"
                  alt="Project development"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-gradient-to-r from-coral-500 to-sunset-500 rounded-full flex items-center justify-center">
                <CodeBracketIcon className="w-8 h-8 text-white" />
              </div>
            </div>
          </div>
        </motion.div>        {/* Values */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.6 }}
          className="mb-16"
        >
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-4">Development Values</h2>
            <p className="text-ocean-300 text-lg">The principles that guide this project</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {values.map((value, index) => (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index, duration: 0.5 }}
                className="p-6 bg-white/10 backdrop-blur-lg rounded-xl border border-white/20 hover:bg-white/20 transition-all duration-300"
              >
                <div className={`w-12 h-12 mb-4 bg-gradient-to-r ${value.color} rounded-lg flex items-center justify-center`}>
                  <value.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-bold text-white mb-3">{value.title}</h3>
                <p className="text-ocean-200 leading-relaxed">{value.description}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>        {/* Creator */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9, duration: 0.6 }}
          className="mb-16"
        >
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-4">About the Creator</h2>
            <p className="text-ocean-300 text-lg">The developer behind GlobeLoom</p>
          </div>
          
          <div className="max-w-2xl mx-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1, duration: 0.5 }}
              className="text-center p-8 bg-white/10 backdrop-blur-lg rounded-xl border border-white/20 hover:bg-white/20 transition-all duration-300"
            >
              <div className="w-32 h-32 mx-auto mb-6 rounded-full overflow-hidden bg-gradient-to-r from-coral-500 to-sunset-500 p-1">
                <img
                  src={creator.avatar}
                  alt={creator.name}
                  className="w-full h-full rounded-full object-cover bg-white"
                />
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">{creator.name}</h3>
              <p className="text-coral-400 text-lg font-medium mb-4">{creator.role}</p>
              <p className="text-ocean-200 leading-relaxed mb-6 max-w-xl mx-auto">{creator.bio}</p>
              
              <div className="mb-6">
                <h4 className="text-white font-semibold mb-3">Tech Stack & Skills</h4>
                <div className="flex flex-wrap gap-2 justify-center">
                  {creator.skills.map((skill) => (
                    <span
                      key={skill}
                      className="px-3 py-1 bg-gradient-to-r from-coral-500 to-sunset-500 text-white text-sm rounded-full"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
              
              <div className="flex justify-center">
                <div className="w-12 h-12 bg-gradient-to-r from-aurora-500 to-ocean-500 rounded-lg flex items-center justify-center">
                  <CodeBracketIcon className="w-6 h-6 text-white" />
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.1, duration: 0.6 }}
          className="bg-gradient-to-r from-coral-500 via-sunset-500 to-aurora-500 rounded-2xl p-8 md:p-12 text-center"
        >
          <TrophyIcon className="w-16 h-16 mx-auto mb-6 text-white" />
          <h2 className="text-3xl font-bold text-white mb-4">Explore the World Through GlobeLoom</h2>
          <p className="text-white/90 text-lg mb-8 max-w-2xl mx-auto">
            Discover stunning destinations, get inspired for your next adventure, and experience 
            the beauty of modern web development combined with wanderlust.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-3 bg-white text-coral-600 rounded-lg font-semibold hover:bg-gray-100 transition-all duration-300"
            >
              Explore Destinations
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-3 bg-transparent border-2 border-white text-white rounded-lg font-semibold hover:bg-white hover:text-coral-600 transition-all duration-300"
            >
              View Project Details
            </motion.button>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default About
