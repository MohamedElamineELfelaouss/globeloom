// Country data service for GlobeLoom
import React from "react";

// Comprehensive countries data for the explorer
export const countries = [
  {
    id: 1,
    name: "Japan",
    code: "JP",
    flag: "🇯🇵",
    continent: "Asia",
    capital: "Tokyo",
    description:
      "Land of the Rising Sun, where ancient traditions meet cutting-edge technology",
    rating: 4.9,
    visitors: "31.9M",
    bestTime: "Mar-May, Sep-Nov",
    highlights: ["Mount Fuji", "Tokyo", "Kyoto", "Cherry Blossoms"],
    iconicQuery: "Mount Fuji cherry blossoms Japan",
    image:
      "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=800&h=600&fit=crop&crop=center&auto=format&q=80",
    weather: { temp: "22°C", condition: "Sunny", humidity: "65%" },
    tags: ["Culture", "Technology", "Nature", "Food"],
  },
  {
    id: 2,
    name: "France",
    code: "FR",
    flag: "🇫🇷",
    continent: "Europe",
    capital: "Paris",
    description: "The country of romance, art, and world-renowned cuisine",
    rating: 4.8,
    visitors: "89.4M",
    bestTime: "Apr-Jun, Sep-Nov",
    highlights: ["Eiffel Tower", "Louvre", "Provence", "French Riviera"],
    iconicQuery: "Eiffel Tower Paris France",
    image:
      "https://images.unsplash.com/photo-1502602898536-47ad22581b52?w=800&h=600&fit=crop&crop=center&auto=format&q=80",
    weather: { temp: "18°C", condition: "Partly Cloudy", humidity: "70%" },
    tags: ["Romance", "Art", "Food", "History"],
  },
  {
    id: 3,
    name: "Iceland",
    code: "IS",
    flag: "🇮🇸",
    continent: "Europe",
    capital: "Reykjavik",
    description: "Land of fire and ice with stunning natural phenomena",
    rating: 4.7,
    visitors: "2.3M",
    bestTime: "Jun-Aug, Nov-Mar",
    highlights: ["Northern Lights", "Blue Lagoon", "Geysir", "Waterfalls"],
    image:
      "https://images.unsplash.com/photo-1539650116574-75c0c6d73f6e?w=800&h=600&fit=crop&crop=center&auto=format&q=80",
    weather: {
      temp: "8°C",
      condition: "Clear",
      humidity: "75%",
    },
    tags: ["Nature", "Adventure", "Northern Lights", "Geothermal"],
  },
  {
    id: 4,
    name: "Thailand",
    code: "TH",
    flag: "🇹🇭",
    continent: "Asia",
    capital: "Bangkok",
    description: "Tropical paradise with rich culture and stunning beaches",
    rating: 4.6,
    visitors: "39.8M",
    bestTime: "Nov-Mar",
    highlights: ["Bangkok", "Phuket", "Chiang Mai", "Temples"],
    image:
      "https://images.unsplash.com/photo-1563492065-bf4e0bb2ba7e?w=800&h=600&fit=crop&crop=center&auto=format&q=80",
    weather: {
      temp: "32°C",
      condition: "Tropical",
      humidity: "80%",
    },
    tags: ["Beaches", "Culture", "Food", "Temples"],
  },
  {
    id: 5,
    name: "Norway",
    code: "NO",
    flag: "🇳🇴",
    continent: "Europe",
    capital: "Oslo",
    description:
      "Spectacular fjords and natural beauty in the land of the midnight sun",
    rating: 4.8,
    visitors: "6.1M",
    bestTime: "May-Sep",
    highlights: ["Fjords", "Bergen", "Lofoten", "Midnight Sun"],
    image:
      "https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=800&h=600&fit=crop&crop=center&auto=format&q=80",
    weather: {
      temp: "15°C",
      condition: "Cool",
      humidity: "70%",
    },
    tags: ["Fjords", "Nature", "Adventure", "Midnight Sun"],
  },
  {
    id: 6,
    name: "New Zealand",
    code: "NZ",
    flag: "🇳🇿",
    continent: "Oceania",
    capital: "Wellington",
    description:
      "Adventure capital with breathtaking landscapes and Maori culture",
    rating: 4.9,
    visitors: "3.9M",
    bestTime: "Dec-Mar, Sep-Nov",
    highlights: ["Queenstown", "Milford Sound", "Hobbiton", "Abel Tasman"],
    image:
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop&crop=center&auto=format&q=80",
    weather: {
      temp: "20°C",
      condition: "Mild",
      humidity: "65%",
    },
    tags: ["Adventure", "Nature", "Culture", "Filming Locations"],
  },
  {
    id: 7,
    name: "Brazil",
    code: "BR",
    flag: "🇧🇷",
    continent: "South America",
    capital: "Brasília",
    description: "Vibrant culture, carnival spirit, and Amazon rainforest",
    rating: 4.5,
    visitors: "6.6M",
    bestTime: "Apr-Sep",
    highlights: ["Rio de Janeiro", "Amazon", "Iguazu Falls", "Carnival"],
    image:
      "https://images.unsplash.com/photo-1483729558449-99ef09a8c325?w=800&h=600&fit=crop&crop=center&auto=format&q=80",
    weather: {
      temp: "28°C",
      condition: "Tropical",
      humidity: "85%",
    },
    tags: ["Carnival", "Rainforest", "Beaches", "Culture"],
  },
  {
    id: 8,
    name: "Egypt",
    code: "EG",
    flag: "🇪🇬",
    continent: "Africa",
    capital: "Cairo",
    description: "Ancient wonders and mysteries of the pharaohs",
    rating: 4.4,
    visitors: "13.1M",
    bestTime: "Oct-Apr",
    highlights: ["Pyramids", "Sphinx", "Nile River", "Valley of Kings"],
    image:
      "https://images.unsplash.com/photo-1539650116574-75c0c6d73f6e?w=800&h=600&fit=crop&crop=center&auto=format&q=80",
    weather: {
      temp: "25°C",
      condition: "Dry",
      humidity: "45%",
    },
    tags: ["History", "Ancient", "Desert", "Culture"],
  },
  {
    id: 9,
    name: "Australia",
    code: "AU",
    flag: "🇦🇺",
    continent: "Oceania",
    capital: "Canberra",
    description: "Diverse landscapes from outback to coral reefs",
    rating: 4.7,
    visitors: "9.5M",
    bestTime: "Sep-Nov, Mar-May",
    highlights: [
      "Sydney Opera House",
      "Great Barrier Reef",
      "Uluru",
      "Melbourne",
    ],
    image:
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop&crop=center&auto=format&q=80",
    weather: {
      temp: "24°C",
      condition: "Sunny",
      humidity: "60%",
    },
    tags: ["Reef", "Wildlife", "Cities", "Outback"],
  },
  {
    id: 10,
    name: "Peru",
    code: "PE",
    flag: "🇵🇪",
    continent: "South America",
    capital: "Lima",
    description: "Ancient Incan heritage and dramatic Andean landscapes",
    rating: 4.6,
    visitors: "4.4M",
    bestTime: "May-Sep",
    highlights: ["Machu Picchu", "Cusco", "Sacred Valley", "Amazon"],
    image:
      "https://images.unsplash.com/photo-1587595431973-160d0d94add1?w=800&h=600&fit=crop&crop=center&auto=format&q=80",
    weather: {
      temp: "19°C",
      condition: "Mountain",
      humidity: "55%",
    },
    tags: ["History", "Mountains", "Culture", "Adventure"],
  },
];

// Generate mock weather data
export const generateWeatherData = (_country) => {
  const weatherConditions = [
    "Sunny",
    "Partly Cloudy",
    "Cloudy",
    "Clear",
    "Tropical",
    "Cool",
    "Mountain",
    "Dry",
  ];
  const temps = ["15°C", "18°C", "22°C", "25°C", "28°C", "32°C", "8°C", "20°C"];
  const humidity = ["45%", "55%", "60%", "65%", "70%", "75%", "80%", "85%"];

  return {
    temp: temps[Math.floor(Math.random() * temps.length)],
    condition:
      weatherConditions[Math.floor(Math.random() * weatherConditions.length)],
    humidity: humidity[Math.floor(Math.random() * humidity.length)],
  };
};

// Generate mock reviews
export const generateReviews = (_country) => {
  const reviewTemplates = [
    {
      text: "Absolutely stunning destination! The culture and people are amazing.",
      rating: 5,
      author: "Sarah M.",
    },
    {
      text: "One of the most beautiful places I've ever visited. Highly recommended!",
      rating: 5,
      author: "Mike R.",
    },
    {
      text: "Great experience overall, would love to go back again soon.",
      rating: 4,
      author: "Emma L.",
    },
    {
      text: "Perfect for adventure seekers and culture enthusiasts alike.",
      rating: 5,
      author: "Alex K.",
    },
    {
      text: "Incredible landscapes and unforgettable memories made here.",
      rating: 5,
      author: "Lisa P.",
    },
    {
      text: "Amazing food, friendly locals, and breathtaking scenery.",
      rating: 4,
      author: "David C.",
    },
  ];

  return reviewTemplates.slice(0, Math.floor(Math.random() * 4) + 2);
};

// Get country by ID
export const getCountryById = (id) => {
  return countries.find((country) => country.id === parseInt(id));
};

// Search countries by name
export const searchCountries = (query) => {
  if (!query) return countries;
  return countries.filter(
    (country) =>
      country.name.toLowerCase().includes(query.toLowerCase()) ||
      country.continent.toLowerCase().includes(query.toLowerCase()) ||
      country.tags.some((tag) =>
        tag.toLowerCase().includes(query.toLowerCase())
      )
  );
};

// Get countries by continent
export const getCountriesByContinent = (continent) => {
  if (!continent || continent === "All") return countries;
  return countries.filter((country) => country.continent === continent);
};

// Get top rated countries
export const getTopRatedCountries = (limit = 5) => {
  return countries.sort((a, b) => b.rating - a.rating).slice(0, limit);
};

export default {
  countries,
  generateWeatherData,
  generateReviews,
  getCountryById,
  searchCountries,
  getCountriesByContinent,
  getTopRatedCountries,
};
