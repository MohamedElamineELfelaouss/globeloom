// File: services/api-node/src/routes/recommendations.js

import express from 'express';
import { GoogleGenerativeAI } from '@google/generative-ai';
// You'll need to adjust this import path based on your project structure
// import authMiddleware from '../middleware/auth.js'; // Adjust path as needed

const router = express.Router();

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI("AIzaSyDmWioIMPEg_HY1CrVTFWa5qPrRkUulnzU");

// Validation middleware
const validateRecommendationRequest = (req, res, next) => {
  const { tripTitle, destination, startDate, endDate, participants, budget } = req.body;
  
  const errors = [];
  
  if (!tripTitle || tripTitle.trim().length === 0) {
    errors.push('Trip title is required');
  }
  
  if (!destination || destination.trim().length === 0) {
    errors.push('Destination is required');
  }
  
  if (!startDate) {
    errors.push('Start date is required');
  }
  
  if (!endDate) {
    errors.push('End date is required');
  }
  
  if (!participants || participants <= 0) {
    errors.push('Number of participants must be greater than 0');
  }
  
  if (!budget || budget <= 0) {
    errors.push('Budget must be greater than 0');
  }
  
  // Validate dates
  if (startDate && endDate) {
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    if (start >= end) {
      errors.push('End date must be after start date');
    }
    
    if (start < new Date()) {
      errors.push('Start date cannot be in the past');
    }
  }
  
  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      errors
    });
  }
  
  next();
};

// Simple test endpoint (no auth required)
router.get('/test', (req, res) => {
  res.json({
    success: true,
    message: 'Recommendations route is working!',
    timestamp: new Date().toISOString()
  });
});

// Generate trip recommendations
// NOTE: Temporarily removing authMiddleware for testing
router.post('/generate', validateRecommendationRequest, async (req, res) => {
  try {
    const { 
      tripTitle, 
      destination, 
      startDate, 
      endDate, 
      participants, 
      budget, 
      description = '', 
      plannedActivities = '' 
    } = req.body;
    
    // Check if Gemini API key is available
    if (!process.env.GEMINI_API_KEY) {
      return res.status(500).json({
        success: false,
        message: 'Gemini API key not configured',
        error: 'GEMINI_API_KEY environment variable is missing'
      });
    }
    
    // Calculate trip duration
    const start = new Date(startDate);
    const end = new Date(endDate);
    const duration = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
    
    // Create detailed prompt for Gemini
    const prompt = `
You are a professional travel planner. Create a detailed trip recommendation based on the following requirements:

**Trip Details:**
- Title: ${tripTitle}
- Destination: ${destination}
- Duration: ${duration} days (${startDate} to ${endDate})
- Number of participants: ${participants}
- Budget: ${budget} USD total
- Description: ${description || 'No specific description provided'}
- Planned activities: ${plannedActivities || 'Open to suggestions'}

**Please provide a comprehensive trip plan in the following JSON format:**

{
  "tripOverview": {
    "title": "string",
    "destination": "string",
    "duration": "number",
    "budgetPerPerson": "number",
    "bestTimeToVisit": "string",
    "summary": "string"
  },
  "dailyItinerary": [
    {
      "day": 1,
      "date": "YYYY-MM-DD",
      "theme": "string",
      "activities": [
        {
          "time": "HH:MM",
          "activity": "string",
          "location": "string",
          "estimatedCost": "number",
          "duration": "string",
          "description": "string"
        }
      ],
      "totalDayCost": "number"
    }
  ],
  "budgetBreakdown": {
    "accommodation": "number",
    "food": "number",
    "transportation": "number",
    "activities": "number",
    "miscellaneous": "number",
    "total": "number"
  },
  "recommendations": {
    "accommodation": [
      {
        "name": "string",
        "type": "string",
        "priceRange": "string",
        "location": "string",
        "description": "string"
      }
    ],
    "restaurants": [
      {
        "name": "string",
        "cuisine": "string",
        "priceRange": "string",
        "specialty": "string"
      }
    ],
    "transportation": {
      "gettingThere": "string",
      "localTransport": "string",
      "estimatedCost": "number"
    }
  },
  "travelTips": [
    "string"
  ],
  "packingList": [
    "string"
  ]
}

Make sure the recommendations are:
1. Within the specified budget
2. Appropriate for ${participants} people
3. Realistic and achievable
4. Include specific locations and venues when possible
5. Consider local culture and customs
6. Include cost estimates for all activities

Respond ONLY with valid JSON, no additional text.
`;

    // Get recommendation from Gemini
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    // Parse JSON response
    let recommendation;
    try {
      // Clean the response to ensure it's valid JSON
      const cleanedText = text.replace(/```json\n?|\n?```/g, '').trim();
      recommendation = JSON.parse(cleanedText);
    } catch (parseError) {
      console.error('Failed to parse Gemini response:', parseError);
      console.error('Raw response:', text);
      
      return res.status(500).json({
        success: false,
        message: 'Failed to parse AI recommendation',
        error: 'Invalid response format from AI service'
      });
    }
    
    // Validate the response has required fields
    if (!recommendation.tripOverview || !recommendation.dailyItinerary) {
      return res.status(500).json({
        success: false,
        message: 'Incomplete recommendation received',
        error: 'AI response missing required fields'
      });
    }
    
    // Save the recommendation request to database (optional)
    // You could save this to your MongoDB for user history
    
    res.json({
      success: true,
      data: {
        requestId: Date.now().toString(), // Simple ID generation
        userInput: {
          tripTitle,
          destination,
          startDate,
          endDate,
          participants,
          budget,
          description,
          plannedActivities
        },
        recommendation,
        generatedAt: new Date().toISOString()
      }
    });
    
  } catch (error) {
    console.error('Error generating recommendation:', error);
    
    res.status(500).json({
      success: false,
      message: 'Failed to generate trip recommendation',
      error: error.message
    });
  }
});

// Get user's recommendation history (optional)
router.get('/history', async (req, res) => {
  try {
    // This would fetch from your database
    // For now, return empty array
    res.json({
      success: true,
      data: []
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch recommendation history',
      error: error.message
    });
  }
});

export default router;

// File: services/web-react/src/pages/TripRecommendations.js

import React, { useState } from 'react';
import RecommendationForm from '../components/RecommendationForm';
import RecommendationResult from '../components/RecommendationResult';
import './TripRecommendations.css';

const TripRecommendations = () => {
  const [loading, setLoading] = useState(false);
  const [recommendation, setRecommendation] = useState(null);
  const [error, setError] = useState(null);

  const handleFormSubmit = async (formData) => {
    setLoading(true);
    setError(null);

    try {
      // Get token from localStorage (adjust based on your auth implementation)
      const token = localStorage.getItem('authToken') || localStorage.getItem('token');
      
    //   if (!token) {
    //     throw new Error('Please log in to generate recommendations');
    //   }

      const response = await fetch('/api/v1/recommendations/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to generate recommendation');
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
    <div className="trip-recommendations-page">
      <div className="container">
        {error && (
          <div className="error-message">
            <div className="error-content">
              <span className="error-icon">⚠️</span>
              <span>{error}</span>
            </div>
            <button 
              className="error-close"
              onClick={() => setError(null)}
            >
              ×
            </button>
          </div>
        )}

        {!recommendation ? (
          <RecommendationForm 
            onSubmit={handleFormSubmit}
            loading={loading}
          />
        ) : (
          <RecommendationResult
            recommendation={recommendation}
            onNewRecommendation={handleNewRecommendation}
          />
        )}
      </div>
    </div>
  );
};

export default TripRecommendations;

    "@google/generative-ai": "^0.24.1",


// File: services/web-react/src/components/RecommendationForm.jsAdd commentMore actionsimport React, { useState } from 'react';// import './RecommendationForm.css';const RecommendationForm = ({ onSubmit, loading }) => {  const [formData, setFormData] = useState({    tripTitle: '',    destination: '',    startDate: '',    endDate: '',    participants: 1,    budget: '',    description: '',    plannedActivities: ''  });  const [errors, setErrors] = useState({});  const handleChange = (e) => {    const { name, value } = e.target;    setFormData(prev => ({      ...prev,      [name]: value    }));        // Clear error when user starts typing    if (errors[name]) {      setErrors(prev => ({        ...prev,        [name]: ''      }));    }  };  const validateForm = () => {    const newErrors = {};    if (!formData.tripTitle.trim()) {      newErrors.tripTitle = 'Trip title is required';    }    if (!formData.destination.trim()) {      newErrors.destination = 'Destination is required';    }    if (!formData.startDate) {      newErrors.startDate = 'Start date is required';    }    if (!formData.endDate) {      newErrors.endDate = 'End date is required';    }    if (!formData.participants || formData.participants <= 0) {      newErrors.participants = 'Number of participants must be greater than 0';    }    if (!formData.budget || formData.budget <= 0) {      newErrors.budget = 'Budget must be greater than 0';    }    // Date validation    if (formData.startDate && formData.endDate) {      const startDate = new Date(formData.startDate);      const endDate = new Date(formData.endDate);      const today = new Date();      today.setHours(0, 0, 0, 0);      if (startDate < today) {        newErrors.startDate = 'Start date cannot be in the past';      }      if (endDate <= startDate) {        newErrors.endDate = 'End date must be after start date';      }    }    setErrors(newErrors);    return Object.keys(newErrors).length === 0;  };  const handleSubmit = (e) => {    e.preventDefault();        if (validateForm()) {      onSubmit(formData);    }  };  // Get minimum date for date inputs (today)  const today = new Date().toISOString().split('T')[0];  return (    <div className="recommendation-form">      <div className="form-header">        <h2>🤖 AI Trip Planner</h2>        <p>Let our AI create a personalized trip recommendation for you!</p>      </div>      <form onSubmit={handleSubmit} className="form">        {/* Trip Title */}        <div className="form-group">          <label htmlFor="tripTitle" className="form-label">            Trip Title <span className="required">*</span>          </label>          <input            type="text"            id="tripTitle"            name="tripTitle"            value={formData.tripTitle}            onChange={handleChange}            className={`form-input ${errors.tripTitle ? 'error' : ''}`}            placeholder="e.g., Summer Adventure in Paris"            disabled={loading}          />          {errors.tripTitle && <span className="error-message">{errors.tripTitle}</span>}        </div>        {/* Destination */}        <div className="form-group">          <label htmlFor="destination" className="form-label">            Destination <span className="required">*</span>          </label>          <input            type="text"            id="destination"            name="destination"            value={formData.destination}            onChange={handleChange}            className={`form-input ${errors.destination ? 'error' : ''}`}            placeholder="e.g., Paris, France"            disabled={loading}          />          {errors.destination && <span className="error-message">{errors.destination}</span>}        </div>        {/* Date Range */}        <div className="form-row">          <div className="form-group">            <label htmlFor="startDate" className="form-label">              Start Date <span className="required">*</span>            </label>            <input              type="date"              id="startDate"              name="startDate"              value={formData.startDate}              onChange={handleChange}              min={today}              className={`form-input ${errors.startDate ? 'error' : ''}`}              disabled={loading}            />            {errors.startDate && <span className="error-message">{errors.startDate}</span>}          </div>          <div className="form-group">            <label htmlFor="endDate" className="form-label">              End Date <span className="required">*</span>            </label>            <input              type="date"              id="endDate"              name="endDate"              value={formData.endDate}              onChange={handleChange}              min={formData.startDate || today}              className={`form-input ${errors.endDate ? 'error' : ''}`}              disabled={loading}            />            {errors.endDate && <span className="error-message">{errors.endDate}</span>}          </div>        </div>        {/* Participants and Budget */}        <div className="form-row">          <div className="form-group">            <label htmlFor="participants" className="form-label">              Participants <span className="required">*</span>            </label>            <input              type="number"              id="participants"              name="participants"              value={formData.participants}              onChange={handleChange}              min="1"              max="20"              className={`form-input ${errors.participants ? 'error' : ''}`}              disabled={loading}            />            {errors.participants && <span className="error-message">{errors.participants}</span>}          </div>          <div className="form-group">            <label htmlFor="budget" className="form-label">              Budget (USD) <span className="required">*</span>            </label>            <input              type="number"              id="budget"              name="budget"              value={formData.budget}              onChange={handleChange}              min="1"              step="1"              className={`form-input ${errors.budget ? 'error' : ''}`}              placeholder="e.g., 2000"              disabled={loading}            />            {errors.budget && <span className="error-message">{errors.budget}</span>}          </div>        </div>        {/* Description */}        <div className="form-group">          <label htmlFor="description" className="form-label">            Description          </label>          <textarea            id="description"            name="description"            value={formData.description}            onChange={handleChange}            className="form-textarea"            placeholder="Tell us about your ideal trip, preferences, or any special requirements..."            rows="3"            disabled={loading}          />        </div>        {/* Planned Activities */}        <div className="form-group">          <label htmlFor="plannedActivities" className="form-label">            Planned Activities          </label>          <textarea            id="plannedActivities"            name="plannedActivities"            value={formData.plannedActivities}            onChange={handleChange}            className="form-textarea"            placeholder="Any specific activities you'd like to include? (museums, adventure sports, nightlife, etc.)"            rows="3"            disabled={loading}          />        </div>        {/* Submit Button */}        <button          type="submit"          className={`submit-button ${loading ? 'loading' : ''}`}          disabled={loading}        >          {loading ? (            <>              <span className="spinner"></span>              Generating Recommendation...            </>          ) : (            '✨ Generate Trip Recommendation'          )}        </button>      </form>    </div>  );};export default RecommendationForm;Add commentMore actions


// File: services/web-react/src/components/RecommendationResult.jsAdd commentMore actions

import React, { useState } from 'react';
// import './RecommendationResult.css';

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

  const TabButton = ({ id, label, icon }) => (
    <button
      className={`tab-button ${activeTab === id ? 'active' : ''}`}
      onClick={() => setActiveTab(id)}
    >
      <span className="tab-icon">{icon}</span>
      {label}
    </button>
  );

  return (
    <div className="recommendation-result">
      {/* Header */}
      <div className="result-header">
        <div className="result-title">
          <h2>🎯 Your Personalized Trip Plan</h2>
          <p>{rec.tripOverview?.title || userInput.tripTitle}</p>
        </div>
        <button
          className="new-recommendation-btn"
          onClick={onNewRecommendation}
        >
          ✨ Create New Plan
        </button>
      </div>

      {/* Quick Stats */}
      <div className="quick-stats">
        <div className="stat">
          <span className="stat-icon">📍</span>
          <div>
            <div className="stat-value">{rec.tripOverview?.destination || userInput.destination}</div>
            <div className="stat-label">Destination</div>
          </div>
        </div>
        <div className="stat">
          <span className="stat-icon">📅</span>
          <div>
            <div className="stat-value">{rec.tripOverview?.duration || 0} days</div>
            <div className="stat-label">Duration</div>
          </div>
        </div>
        <div className="stat">
          <span className="stat-icon">👥</span>
          <div>
            <div className="stat-value">{userInput.participants}</div>
            <div className="stat-label">Travelers</div>
          </div>
        </div>
        <div className="stat">
          <span className="stat-icon">💰</span>
          <div>
            <div className="stat-value">{formatCurrency(rec.budgetBreakdown?.total || userInput.budget)}</div>
            <div className="stat-label">Total Budget</div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="tab-navigation">
        <TabButton id="overview" label="Overview" icon="📋" />
        <TabButton id="itinerary" label="Itinerary" icon="🗓️" />
        <TabButton id="budget" label="Budget" icon="💰" />
        <TabButton id="recommendations" label="Places" icon="🏨" />
        <TabButton id="tips" label="Tips" icon="💡" />
      </div>

      {/* Tab Content */}
      <div className="tab-content">
        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="overview-tab">
            <div className="overview-card">
              <h3>Trip Summary</h3>
              <p>{rec.tripOverview?.summary}</p>
              
              {rec.tripOverview?.bestTimeToVisit && (
                <div className="info-item">
                  <strong>Best Time to Visit:</strong> {rec.tripOverview.bestTimeToVisit}
                </div>
              )}
              
              <div className="info-item">
                <strong>Budget per Person:</strong> {formatCurrency(rec.tripOverview?.budgetPerPerson || (userInput.budget / userInput.participants))}
              </div>
            </div>

            {rec.packingList && rec.packingList.length > 0 && (
              <div className="packing-card">
                <h3>📦 Packing List</h3>
                <div className="packing-grid">
                  {rec.packingList.map((item, index) => (
                    <div key={index} className="packing-item">
                      ✓ {item}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Itinerary Tab */}
        {activeTab === 'itinerary' && (
          <div className="itinerary-tab">
            {rec.dailyItinerary && rec.dailyItinerary.map((day) => (
              <div key={day.day} className="day-card">
                <div className="day-header">
                  <h3>Day {day.day}</h3>
                  <div className="day-info">
                    <span className="day-date">{formatDate(day.date)}</span>
                    <span className="day-theme">{day.theme}</span>
                    <span className="day-cost">{formatCurrency(day.totalDayCost || 0)}</span>
                  </div>
                </div>
                
                <div className="activities">
                  {day.activities && day.activities.map((activity, index) => (
                    <div key={index} className="activity">
                      <div className="activity-time">{activity.time}</div>
                      <div className="activity-content">
                        <h4>{activity.activity}</h4>
                        <p className="activity-location">📍 {activity.location}</p>
                        <p className="activity-description">{activity.description}</p>
                        <div className="activity-details">
                          <span className="activity-duration">⏱️ {activity.duration}</span>
                          <span className="activity-cost">{formatCurrency(activity.estimatedCost || 0)}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Budget Tab */}
        {activeTab === 'budget' && rec.budgetBreakdown && (
          <div className="budget-tab">
            <div className="budget-overview">
              <h3>Budget Breakdown</h3>
              <div className="budget-total">
                Total: {formatCurrency(rec.budgetBreakdown.total)}
              </div>
            </div>
            
            <div className="budget-categories">
              {Object.entries(rec.budgetBreakdown).map(([category, amount]) => {
                if (category === 'total') return null;
                const percentage = ((amount / rec.budgetBreakdown.total) * 100).toFixed(1);
                
                return (
                  <div key={category} className="budget-item">
                    <div className="budget-item-header">
                      <span className="budget-category">
                        {category.charAt(0).toUpperCase() + category.slice(1)}
                      </span>
                      <span className="budget-amount">{formatCurrency(amount)}</span>
                    </div>
                    <div className="budget-bar">
                      <div 
                        className="budget-fill" 
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                    <div className="budget-percentage">{percentage}%</div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Recommendations Tab */}
        {activeTab === 'recommendations' && rec.recommendations && (
          <div className="recommendations-tab">
            {/* Accommodation */}
            {rec.recommendations.accommodation && (
              <div className="recommendation-section">
                <h3>🏨 Recommended Accommodation</h3>
                <div className="recommendation-grid">
                  {rec.recommendations.accommodation.map((hotel, index) => (
                    <div key={index} className="recommendation-card">
                      <h4>{hotel.name}</h4>
                      <p className="rec-type">{hotel.type}</p>
                      <p className="rec-location">📍 {hotel.location}</p>
                      <p className="rec-price">{hotel.priceRange}</p>
                      <p className="rec-description">{hotel.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Restaurants */}
            {rec.recommendations.restaurants && (
              <div className="recommendation-section">
                <h3>🍽️ Recommended Restaurants</h3>
                <div className="recommendation-grid">
                  {rec.recommendations.restaurants.map((restaurant, index) => (
                    <div key={index} className="recommendation-card">
                      <h4>{restaurant.name}</h4>
                      <p className="rec-cuisine">{restaurant.cuisine}</p>
                      <p className="rec-price">{restaurant.priceRange}</p>
                      <p className="rec-specialty">⭐ {restaurant.specialty}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Transportation */}
            {rec.recommendations.transportation && (
              <div className="recommendation-section">
                <h3>🚗 Transportation</h3>
                <div className="transport-info">
                  <div className="transport-item">
                    <strong>Getting There:</strong> {rec.recommendations.transportation.gettingThere}
                  </div>
                  <div className="transport-item">
                    <strong>Local Transport:</strong> {rec.recommendations.transportation.localTransport}
                  </div>
                  <div className="transport-item">
                    <strong>Estimated Cost:</strong> {formatCurrency(rec.recommendations.transportation.estimatedCost || 0)}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Tips Tab */}
        {activeTab === 'tips' && rec.travelTips && (
          <div className="tips-tab">
            <h3>💡 Travel Tips</h3>
            <div className="tips-list">
              {rec.travelTips.map((tip, index) => (
                <div key={index} className="tip-item">
                  <span className="tip-icon">💡</span>
                  <p>{tip}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default RecommendationResult;Add comment

  🤖 AI Planner


// File: services/web-react/src/pages/TripRecommendations.jsAdd commentMore actions

import React, { useState } from 'react';
import RecommendationForm from '../components/RecommendationForm';
import RecommendationResult from '../components/RecommendationResult';
import './TripRecommendations.css';

const TripRecommendations = () => {
  const [loading, setLoading] = useState(false);
  const [recommendation, setRecommendation] = useState(null);
  const [error, setError] = useState(null);

  const handleFormSubmit = async (formData) => {
    setLoading(true);
    setError(null);

    try {
      // Get token from localStorage (adjust based on your auth implementation)
      const token = localStorage.getItem('authToken') || localStorage.getItem('token');
      
    //   if (!token) {
    //     throw new Error('Please log in to generate recommendations');
    //   }

      const response = await fetch('/api/v1/recommendations/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to generate recommendation');
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
    <div className="trip-recommendations-page">
      <div className="container">
        {error && (
          <div className="error-message">
            <div className="error-content">
              <span className="error-icon">⚠️</span>
              <span>{error}</span>
            </div>
            <button 
              className="error-close"
              onClick={() => setError(null)}
            >
              ×
            </button>
          </div>
        )}

        {!recommendation ? (
          <RecommendationForm 
            onSubmit={handleFormSubmit}
            loading={loading}
          />
        ) : (
          <RecommendationResult
            recommendation={recommendation}
            onNewRecommendation={handleNewRecommendation}
          />
        )}
      </div>
    </div>
  );
};

export default TripRecommendations;Add comment