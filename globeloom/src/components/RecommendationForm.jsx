import React, { useState } from 'react';
import { motion } from 'framer-motion';

const RecommendationForm = ({ onSubmit, loading }) => {
  const [formData, setFormData] = useState({
    tripTitle: '',
    destination: '',
    startDate: '',
    endDate: '',
    participants: 1,
    budget: '',
    description: '',
    plannedActivities: ''
  });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.tripTitle.trim()) {
      newErrors.tripTitle = 'Trip title is required';
    }
    
    if (!formData.destination.trim()) {
      newErrors.destination = 'Destination is required';
    }
    
    if (!formData.startDate) {
      newErrors.startDate = 'Start date is required';
    }
    
    if (!formData.endDate) {
      newErrors.endDate = 'End date is required';
    }
    
    if (!formData.participants || formData.participants <= 0) {
      newErrors.participants = 'Number of participants must be greater than 0';
    }
    
    if (!formData.budget || formData.budget <= 0) {
      newErrors.budget = 'Budget must be greater than 0';
    }

    // Date validation
    if (formData.startDate && formData.endDate) {
      const startDate = new Date(formData.startDate);
      const endDate = new Date(formData.endDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      if (startDate < today) {
        newErrors.startDate = 'Start date cannot be in the past';
      }
      
      if (endDate <= startDate) {
        newErrors.endDate = 'End date must be after start date';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  // Get minimum date for date inputs (today)
  const today = new Date().toISOString().split('T')[0];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="max-w-4xl mx-auto"
    >
      {/* Header */}
      <div className="text-center mb-8">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-4xl font-bold text-white mb-4"
        >
          🤖 AI Trip Planner
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-xl text-gray-300"
        >
          Let our AI create a personalized trip recommendation for you!
        </motion.p>
      </div>

      {/* Form */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20"
      >
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Trip Title */}
          <div className="space-y-2">
            <label htmlFor="tripTitle" className="block text-sm font-medium text-white">
              Trip Title <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              id="tripTitle"
              name="tripTitle"
              value={formData.tripTitle}
              onChange={handleChange}
              className={`w-full px-4 py-3 bg-white/10 border rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.tripTitle ? 'border-red-500' : 'border-white/20'
              }`}
              placeholder="e.g., Summer Adventure in Paris"
              disabled={loading}
            />
            {errors.tripTitle && (
              <p className="text-red-400 text-sm">{errors.tripTitle}</p>
            )}
          </div>

          {/* Destination */}
          <div className="space-y-2">
            <label htmlFor="destination" className="block text-sm font-medium text-white">
              Destination <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              id="destination"
              name="destination"
              value={formData.destination}
              onChange={handleChange}
              className={`w-full px-4 py-3 bg-white/10 border rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.destination ? 'border-red-500' : 'border-white/20'
              }`}
              placeholder="e.g., Paris, France"
              disabled={loading}
            />
            {errors.destination && (
              <p className="text-red-400 text-sm">{errors.destination}</p>
            )}
          </div>

          {/* Date Range */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label htmlFor="startDate" className="block text-sm font-medium text-white">
                Start Date <span className="text-red-400">*</span>
              </label>
              <input
                type="date"
                id="startDate"
                name="startDate"
                value={formData.startDate}
                onChange={handleChange}
                min={today}
                className={`w-full px-4 py-3 bg-white/10 border rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.startDate ? 'border-red-500' : 'border-white/20'
                }`}
                disabled={loading}
              />
              {errors.startDate && (
                <p className="text-red-400 text-sm">{errors.startDate}</p>
              )}
            </div>

            <div className="space-y-2">
              <label htmlFor="endDate" className="block text-sm font-medium text-white">
                End Date <span className="text-red-400">*</span>
              </label>
              <input
                type="date"
                id="endDate"
                name="endDate"
                value={formData.endDate}
                onChange={handleChange}
                min={formData.startDate || today}
                className={`w-full px-4 py-3 bg-white/10 border rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.endDate ? 'border-red-500' : 'border-white/20'
                }`}
                disabled={loading}
              />
              {errors.endDate && (
                <p className="text-red-400 text-sm">{errors.endDate}</p>
              )}
            </div>
          </div>

          {/* Participants and Budget */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label htmlFor="participants" className="block text-sm font-medium text-white">
                Participants <span className="text-red-400">*</span>
              </label>
              <input
                type="number"
                id="participants"
                name="participants"
                value={formData.participants}
                onChange={handleChange}
                min="1"
                max="20"
                className={`w-full px-4 py-3 bg-white/10 border rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.participants ? 'border-red-500' : 'border-white/20'
                }`}
                disabled={loading}
              />
              {errors.participants && (
                <p className="text-red-400 text-sm">{errors.participants}</p>
              )}
            </div>

            <div className="space-y-2">
              <label htmlFor="budget" className="block text-sm font-medium text-white">
                Budget (USD) <span className="text-red-400">*</span>
              </label>
              <input
                type="number"
                id="budget"
                name="budget"
                value={formData.budget}
                onChange={handleChange}
                min="1"
                step="1"
                className={`w-full px-4 py-3 bg-white/10 border rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.budget ? 'border-red-500' : 'border-white/20'
                }`}
                placeholder="e.g., 2000"
                disabled={loading}
              />
              {errors.budget && (
                <p className="text-red-400 text-sm">{errors.budget}</p>
              )}
            </div>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <label htmlFor="description" className="block text-sm font-medium text-white">
              Description
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Tell us about your ideal trip, preferences, or any special requirements..."
              rows="3"
              disabled={loading}
            />
          </div>

          {/* Planned Activities */}
          <div className="space-y-2">
            <label htmlFor="plannedActivities" className="block text-sm font-medium text-white">
              Planned Activities
            </label>
            <textarea
              id="plannedActivities"
              name="plannedActivities"
              value={formData.plannedActivities}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Any specific activities you'd like to include? (museums, adventure sports, nightlife, etc.)"
              rows="3"
              disabled={loading}
            />
          </div>

          {/* Submit Button */}
          <motion.button
            type="submit"
            disabled={loading}
            whileHover={{ scale: loading ? 1 : 1.02 }}
            whileTap={{ scale: loading ? 1 : 0.98 }}
            className={`w-full px-6 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-lg shadow-lg transition-all duration-300 ${
              loading 
                ? 'opacity-70 cursor-not-allowed' 
                : 'hover:from-blue-700 hover:to-purple-700 hover:shadow-xl'
            }`}
          >
            {loading ? (
              <div className="flex items-center justify-center space-x-2">
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Generating Recommendation...</span>
              </div>
            ) : (
              <span>✨ Generate Trip Recommendation</span>
            )}
          </motion.button>
        </form>
      </motion.div>
    </motion.div>
  );
};

export default RecommendationForm;
