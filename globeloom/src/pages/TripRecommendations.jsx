import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import RecommendationForm from '../components/RecommendationForm';
import RecommendationResult from '../components/RecommendationResult';

const TripRecommendations = () => {
  const [loading, setLoading] = useState(false);
  const [recommendation, setRecommendation] = useState(null);
  const [error, setError] = useState(null);
  const handleFormSubmit = async (formData) => {
    setLoading(true);
    setError(null);
    
    try {
      // Get token from localStorage
      const token = localStorage.getItem('authToken') || localStorage.getItem('token');
      
      // Log the data being sent to help debugging
      console.log('Sending recommendation request with data:', formData);
      
      // Ensure all required fields are present and properly formatted
      const processedFormData = {
        ...formData,
        // Ensure dates are in YYYY-MM-DD format
        startDate: formData.startDate ? new Date(formData.startDate).toISOString().split('T')[0] : '',
        endDate: formData.endDate ? new Date(formData.endDate).toISOString().split('T')[0] : '',
        // Ensure numeric fields are numbers
        participants: Number(formData.participants),
        budget: Number(formData.budget)
      };

      const response = await fetch(`${import.meta.env.VITE_API_URL}/recommendations/generate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token && { 'Authorization': `Bearer ${token}` })
        },
        body: JSON.stringify(processedFormData)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || data.errors?.join(', ') || 'Failed to generate recommendation');
      }

      setRecommendation(data.data);
    } catch (err) {
      console.error('Error generating recommendation:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleNewRecommendation = () => {
    setRecommendation(null);
    setError(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 pt-20">
      <div className="container mx-auto px-4 py-8">
        <AnimatePresence mode="wait">
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="mb-6 bg-red-500/10 border border-red-500/20 rounded-lg p-4"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <span className="text-2xl">⚠️</span>
                  <span className="text-red-400">{error}</span>
                </div>
                <button 
                  className="text-red-400 hover:text-red-300"
                  onClick={() => setError(null)}
                >
                  ×
                </button>
              </div>
            </motion.div>
          )}

          {!recommendation ? (
            <motion.div
              key="form"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.5 }}
            >
              <RecommendationForm 
                onSubmit={handleFormSubmit}
                loading={loading}
              />
            </motion.div>
          ) : (
            <motion.div
              key="result"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.5 }}
            >
              <RecommendationResult
                recommendation={recommendation}
                onNewRecommendation={handleNewRecommendation}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default TripRecommendations;
