// Mock API service to replace external dependencies
export const mockTripData = {
  "hotel_options": [
    {
      "name": "The D Las Vegas",
      "address": "301 Fremont Street, Las Vegas, NV 89101",
      "price": "from $35/night",
      "image_url": "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=400&h=300&fit=crop",
      "geo_coordinates": "36.1696,-115.1420",
      "rating": "4.0 stars",
      "description": "Located in the heart of Downtown Las Vegas, The D is a budget-friendly option with a retro vibe."
    },
    {
      "name": "Circus Circus Hotel & Casino",
      "address": "2880 Las Vegas Blvd S, Las Vegas, NV 89109",
      "price": "from $40/night",
      "image_url": "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop",
      "geo_coordinates": "36.1183,-115.1694",
      "rating": "3.5 stars",
      "description": "Known for its circus-themed attractions, Circus Circus offers a family-friendly atmosphere."
    }
  ],
  "itinerary": [
    {
      "day": "Day 1",
      "plan": [
        {
          "time": "Morning (9:00 AM - 12:00 PM)",
          "place": "Fremont Street Experience",
          "details": "Explore the vibrant Fremont Street Experience, a pedestrian mall with live music, street performers.",
          "image_url": "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop",
          "geo_coordinates": "36.1696,-115.1420",
          "ticket_pricing": "Free",
          "rating": "4.5 stars"
        }
      ]
    }
  ]
};

export const generateTripPlan = async (destination, days, budget, travelers) => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  return {
    ...mockTripData,
    destination,
    days,
    budget,
    travelers,
    id: Math.random().toString(36).substr(2, 9)
  };
};

export const getPlaceDetails = async (placeName) => {
  // Mock place details
  return {
    photos: [
      { name: "photo1", url: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop" }
    ],
    displayName: placeName,
    id: Math.random().toString(36).substr(2, 9)
  };
};
