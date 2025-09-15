import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const RecommendationResult = ({ recommendation, onNewRecommendation }) => {
  const [activeTab, setActiveTab] = useState('overview');

  if (!recommendation || !recommendation.recommendation) {
    return null;
  }

  const { recommendation: rec, userInput } = recommendation;

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const TabButton = ({ id, label, icon, isActive, onClick }) => (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className={`flex items-center space-x-2 px-4 py-3 rounded-lg font-medium transition-all duration-300 ${
        isActive 
          ? 'bg-blue-600 text-white shadow-lg' 
          : 'bg-white/10 text-gray-300 hover:bg-white/20 hover:text-white'
      }`}
      onClick={onClick}
    >
      <span className="text-lg">{icon}</span>
      <span>{label}</span>
    </motion.button>
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="max-w-6xl mx-auto"
    >
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h1 className="text-3xl font-bold text-white mb-2">
            🎯 Your Personalized Trip Plan
          </h1>
          <p className="text-xl text-gray-300">
            {rec.tripOverview?.title || userInput.tripTitle}
          </p>
        </motion.div>
        
        <motion.button
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="mt-4 md:mt-0 px-6 py-3 bg-gradient-to-r from-green-600 to-blue-600 text-white font-semibold rounded-lg shadow-lg hover:from-green-700 hover:to-blue-700 transition-all duration-300"
          onClick={onNewRecommendation}
        >
          ✨ Create New Plan
        </motion.button>
      </div>

      {/* Quick Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8"
      >
        <div className="bg-white/10 backdrop-blur-lg rounded-lg p-4 border border-white/20">
          <div className="flex items-center space-x-3">
            <span className="text-2xl">📍</span>
            <div>
              <div className="text-lg font-semibold text-white">
                {rec.tripOverview?.destination || userInput.destination}
              </div>
              <div className="text-sm text-gray-400">Destination</div>
            </div>
          </div>
        </div>

        <div className="bg-white/10 backdrop-blur-lg rounded-lg p-4 border border-white/20">
          <div className="flex items-center space-x-3">
            <span className="text-2xl">📅</span>
            <div>
              <div className="text-lg font-semibold text-white">
                {rec.tripOverview?.duration || 0} days
              </div>
              <div className="text-sm text-gray-400">Duration</div>
            </div>
          </div>
        </div>

        <div className="bg-white/10 backdrop-blur-lg rounded-lg p-4 border border-white/20">
          <div className="flex items-center space-x-3">
            <span className="text-2xl">👥</span>
            <div>
              <div className="text-lg font-semibold text-white">
                {userInput.participants} people
              </div>
              <div className="text-sm text-gray-400">Travelers</div>
            </div>
          </div>
        </div>

        <div className="bg-white/10 backdrop-blur-lg rounded-lg p-4 border border-white/20">
          <div className="flex items-center space-x-3">
            <span className="text-2xl">💰</span>
            <div>
              <div className="text-lg font-semibold text-white">
                {formatCurrency(rec.tripOverview?.budgetPerPerson || userInput.budget / userInput.participants)}
              </div>
              <div className="text-sm text-gray-400">Per Person</div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Tab Navigation */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="flex flex-wrap gap-2 mb-6"
      >
        <TabButton
          id="overview"
          label="Overview"
          icon="🎯"
          isActive={activeTab === 'overview'}
          onClick={() => setActiveTab('overview')}
        />
        <TabButton
          id="itinerary"
          label="Itinerary"
          icon="📋"
          isActive={activeTab === 'itinerary'}
          onClick={() => setActiveTab('itinerary')}
        />
        <TabButton
          id="budget"
          label="Budget"
          icon="💰"
          isActive={activeTab === 'budget'}
          onClick={() => setActiveTab('budget')}
        />
        <TabButton
          id="recommendations"
          label="Recommendations"
          icon="⭐"
          isActive={activeTab === 'recommendations'}
          onClick={() => setActiveTab('recommendations')}
        />
        <TabButton
          id="tips"
          label="Tips & Packing"
          icon="🎒"
          isActive={activeTab === 'tips'}
          onClick={() => setActiveTab('tips')}
        />
      </motion.div>

      {/* Tab Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
          className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20"
        >
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-white mb-4">Trip Overview</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">Summary</h3>
                  <p className="text-gray-300">
                    {rec.tripOverview?.summary || 'A wonderful trip awaits you!'}
                  </p>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">Best Time to Visit</h3>
                  <p className="text-gray-300">
                    {rec.tripOverview?.bestTimeToVisit || 'Perfect timing for your trip!'}
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'itinerary' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-white mb-4">Daily Itinerary</h2>
              
              {rec.dailyItinerary && rec.dailyItinerary.length > 0 ? (
                <div className="space-y-4">
                  {rec.dailyItinerary.map((day, index) => (
                    <motion.div
                      key={day.day}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="bg-white/5 rounded-lg p-4 border border-white/10"
                    >
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="text-lg font-semibold text-white">
                          Day {day.day}: {day.theme}
                        </h3>
                        <span className="text-sm text-gray-400">
                          {formatCurrency(day.totalDayCost)}
                        </span>
                      </div>
                      
                      <div className="space-y-2">
                        {day.activities && day.activities.map((activity, actIndex) => (
                          <div key={actIndex} className="flex items-start space-x-3 p-3 bg-white/5 rounded">
                            <span className="text-blue-400 font-semibold text-sm">
                              {activity.time}
                            </span>
                            <div className="flex-1">
                              <div className="text-white font-medium">{activity.activity}</div>
                              <div className="text-gray-400 text-sm">{activity.location}</div>
                              <div className="text-gray-300 text-sm">{activity.description}</div>
                              <div className="text-green-400 text-sm">
                                {formatCurrency(activity.estimatedCost)} • {activity.duration}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-300">No itinerary available.</p>
              )}
            </div>
          )}

          {activeTab === 'budget' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-white mb-4">Budget Breakdown</h2>
              
              {rec.budgetBreakdown ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    {Object.entries(rec.budgetBreakdown).filter(([key]) => key !== 'total').map(([category, amount]) => (
                      <div key={category} className="flex justify-between items-center p-3 bg-white/5 rounded">
                        <span className="text-white capitalize">{category}</span>
                        <span className="text-green-400 font-semibold">{formatCurrency(amount)}</span>
                      </div>
                    ))}
                  </div>
                  
                  <div className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 rounded-lg p-6 border border-blue-500/30">
                    <h3 className="text-xl font-semibold text-white mb-2">Total Budget</h3>
                    <div className="text-3xl font-bold text-green-400">
                      {formatCurrency(rec.budgetBreakdown.total)}
                    </div>
                    <div className="text-gray-300 text-sm mt-2">
                      {formatCurrency(rec.budgetBreakdown.total / userInput.participants)} per person
                    </div>
                  </div>
                </div>
              ) : (
                <p className="text-gray-300">No budget breakdown available.</p>
              )}
            </div>
          )}

          {activeTab === 'recommendations' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-white mb-4">Recommendations</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Accommodation */}
                {rec.recommendations?.accommodation && (
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-3">🏨 Accommodation</h3>
                    <div className="space-y-2">
                      {rec.recommendations.accommodation.map((place, index) => (
                        <div key={index} className="p-3 bg-white/5 rounded border border-white/10">
                          <div className="text-white font-medium">{place.name}</div>
                          <div className="text-gray-400 text-sm">{place.type} • {place.priceRange}</div>
                          <div className="text-gray-300 text-sm">{place.description}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Restaurants */}
                {rec.recommendations?.restaurants && (
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-3">🍽️ Restaurants</h3>
                    <div className="space-y-2">
                      {rec.recommendations.restaurants.map((restaurant, index) => (
                        <div key={index} className="p-3 bg-white/5 rounded border border-white/10">
                          <div className="text-white font-medium">{restaurant.name}</div>
                          <div className="text-gray-400 text-sm">{restaurant.cuisine} • {restaurant.priceRange}</div>
                          <div className="text-gray-300 text-sm">{restaurant.specialty}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Transportation */}
              {rec.recommendations?.transportation && (
                <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                  <h3 className="text-lg font-semibold text-white mb-3">🚗 Transportation</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <div className="text-sm text-gray-400 mb-1">Getting There</div>
                      <div className="text-white">{rec.recommendations.transportation.gettingThere}</div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-400 mb-1">Local Transport</div>
                      <div className="text-white">{rec.recommendations.transportation.localTransport}</div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'tips' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-white mb-4">Travel Tips & Packing</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Travel Tips */}
                {rec.travelTips && rec.travelTips.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-3">💡 Travel Tips</h3>
                    <div className="space-y-2">
                      {rec.travelTips.map((tip, index) => (
                        <div key={index} className="flex items-start space-x-2 p-3 bg-white/5 rounded">
                          <span className="text-yellow-400 mt-1">💡</span>
                          <span className="text-gray-300 text-sm">{tip}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Packing List */}
                {rec.packingList && rec.packingList.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-3">🎒 Packing List</h3>
                    <div className="space-y-1">
                      {rec.packingList.map((item, index) => (
                        <div key={index} className="flex items-center space-x-2 p-2 bg-white/5 rounded">
                          <span className="text-green-400">✓</span>
                          <span className="text-gray-300 text-sm">{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </motion.div>
  );
};

export default RecommendationResult;
