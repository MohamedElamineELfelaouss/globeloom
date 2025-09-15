import React from 'react';
import { motion } from 'framer-motion';

const LandingSections = () => {
  const sections = [
    {
      id: 'discover',
      title: 'Discover Amazing Destinations',
      description: 'Let our AI help you find the perfect travel destinations tailored to your preferences.',
      icon: '🌍'
    },
    {
      id: 'plan',
      title: 'Plan Your Perfect Trip',
      description: 'Create detailed itineraries with our intelligent planning tools and recommendations.',
      icon: '📋'
    },
    {
      id: 'share',
      title: 'Share & Connect',
      description: 'Share your experiences and connect with fellow travelers around the world.',
      icon: '🤝'
    },
    {
      id: 'earn',
      title: 'Earn Rewards',
      description: 'Gain points, badges, and exclusive perks as you explore and share your adventures.',
      icon: '🏆'
    }
  ];

  return (
    <div className="space-y-24 py-24">
      {sections.map((section, index) => (
        <motion.section
          key={section.id}
          initial={{ opacity: 0, y: 60 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: index * 0.1 }}
          viewport={{ once: true }}
          className="container mx-auto px-4"
        >
          <div className="flex flex-col lg:flex-row items-center gap-12">
            <div className="flex-1 space-y-6">
              <div className="text-6xl mb-4">{section.icon}</div>
              <h2 className="text-4xl font-bold text-platinum-100">
                {section.title}
              </h2>
              <p className="text-xl text-platinum-300 leading-relaxed">
                {section.description}
              </p>
            </div>
            <div className="flex-1">
              <div className="bg-gradient-to-br from-aurora-500/20 to-coral-500/20 rounded-2xl p-8 border border-aurora-500/20">
                <div className="h-64 bg-midnight-800 rounded-lg flex items-center justify-center">
                  <span className="text-platinum-400">Feature Preview</span>
                </div>
              </div>
            </div>
          </div>
        </motion.section>
      ))}
    </div>
  );
};

export default LandingSections;