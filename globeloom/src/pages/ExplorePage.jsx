import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { MapIcon, GlobeAmericasIcon, StarIcon, FunnelIcon } from '@heroicons/react/24/outline';
import OptimizedImage from '../components/OptimizedImage';

// Sample destination data with optimized CDN images
const sampleDestinations = [
  {
    id: 1,
    name: 'Tokyo, Japan',
    continent: 'Asia',
    country: 'Japan',
    image: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=400&h=300&fit=crop&crop=center&auto=format&q=80',
    rating: 4.8,
    price: '$1,200',
    description: 'Experience the perfect blend of traditional culture and modern innovation in Japan\'s vibrant capital.',
    highlights: ['Cherry Blossoms', 'Modern Architecture', 'Authentic Cuisine', 'Rich Culture']
  },
  {
    id: 2,
    name: 'Santorini, Greece',
    continent: 'Europe',
    country: 'Greece',
    image: 'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=400&h=300&fit=crop&crop=center&auto=format&q=80',
    rating: 4.9,
    price: '$800',
    description: 'Discover the stunning white-washed buildings and crystal-clear waters of this Greek island paradise.',
    highlights: ['Sunset Views', 'Blue Domes', 'Wine Tasting', 'Ancient History']
  },
  {
    id: 3,
    name: 'Machu Picchu, Peru',
    continent: 'South America',
    country: 'Peru',
    image: 'https://images.unsplash.com/photo-1587595431973-160d0d94add1?w=400&h=300&fit=crop&crop=center&auto=format&q=80',
    rating: 4.7,
    price: '$600',
    description: 'Explore the ancient Incan citadel high in the Andes mountains.',
    highlights: ['Ancient Ruins', 'Mountain Views', 'Hiking Trails', 'Historical Sites']
  },
  {
    id: 4,
    name: 'Serengeti, Tanzania',
    continent: 'Africa',
    country: 'Tanzania',
    image: 'https://images.unsplash.com/photo-1516426122078-c23e76319801?w=400&h=300&fit=crop&crop=center&auto=format&q=80',
    rating: 4.6,
    price: '$2,000',
    description: 'Witness the Great Migration and experience incredible wildlife in East Africa.',
    highlights: ['Wildlife Safari', 'Great Migration', 'Big Five', 'Cultural Tours']
  },
  {
    id: 5,
    name: 'Sydney, Australia',
    continent: 'Australia',
    country: 'Australia',
    image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop&crop=center&auto=format&q=80',
    rating: 4.5,
    price: '$1,500',
    description: 'Explore the iconic harbor city with its famous Opera House and stunning beaches.',
    highlights: ['Opera House', 'Harbor Bridge', 'Bondi Beach', 'City Skyline']
  },
  {
    id: 6,
    name: 'Banff, Canada',
    continent: 'North America',
    country: 'Canada',
    image: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400&h=300&fit=crop&crop=center&auto=format&q=80',
    rating: 4.8,
    price: '$900',
    description: 'Experience the breathtaking beauty of the Canadian Rockies.',
    highlights: ['Mountain Lakes', 'Hiking Trails', 'Wildlife', 'Natural Hot Springs']
  }
];

const ExplorePage = () => {
  const [destinations, setDestinations] = useState([]);
  const [filteredDestinations, setFilteredDestinations] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedContinent, setSelectedContinent] = useState('');
  const [loading, setLoading] = useState(true);

  const continents = ['All', 'Asia', 'Europe', 'North America', 'South America', 'Africa', 'Australia'];

  useEffect(() => {
    // Simulate loading data
    setTimeout(() => {
      setDestinations(sampleDestinations);
      setFilteredDestinations(sampleDestinations);
      setLoading(false);
    }, 1000);
  }, []);

  useEffect(() => {
    let filtered = destinations;

    if (searchTerm) {
      filtered = filtered.filter(destination =>
        destination.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        destination.country.toLowerCase().includes(searchTerm.toLowerCase()) ||
        destination.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedContinent && selectedContinent !== 'All') {
      filtered = filtered.filter(destination => destination.continent === selectedContinent);
    }

    setFilteredDestinations(filtered);
  }, [searchTerm, selectedContinent, destinations]);
  const DestinationCard = ({ destination }) => (
    <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-xl shadow-xl overflow-hidden hover:shadow-2xl hover:scale-105 transition-all duration-300 border border-slate-700/50">      <div className="relative">
        <OptimizedImage
          src={destination.image}
          alt={destination.name}
          className="w-full h-48 object-cover transition-transform duration-300 hover:scale-110"
        />
        <div className="absolute top-4 right-4 bg-slate-900/80 backdrop-blur-sm rounded-full px-3 py-1 flex items-center border border-slate-600/50">
          <StarIcon className="w-4 h-4 text-yellow-400 mr-1" />
          <span className="text-sm font-semibold text-white">{destination.rating}</span>
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/20 to-transparent"></div>
      </div>
      <div className="p-6">
        <div className="flex justify-between items-start mb-3">
          <h3 className="text-xl font-bold text-white">{destination.name}</h3>
          <span className="text-lg font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">{destination.price}</span>
        </div>
        <p className="text-slate-300 mb-4 leading-relaxed">{destination.description}</p>
        <div className="flex flex-wrap gap-2 mb-6">
          {destination.highlights.map((highlight, index) => (
            <span
              key={index}
              className="px-3 py-1 bg-gradient-to-r from-purple-600/20 to-pink-600/20 text-purple-300 rounded-full text-xs font-medium border border-purple-500/30 backdrop-blur-sm"
            >
              {highlight}
            </span>
          ))}
        </div>        <Link to={`/destination/${destination.id}`}>
          <button className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5">
            Explore Destination
          </button>
        </Link>
      </div>
    </div>
  );
  const LoadingCard = () => (
    <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-xl shadow-xl overflow-hidden animate-pulse border border-slate-700/50">
      <div className="w-full h-48 bg-slate-700/50"></div>
      <div className="p-6">
        <div className="h-6 bg-slate-700/50 rounded mb-3"></div>
        <div className="h-4 bg-slate-700/50 rounded mb-4"></div>
        <div className="flex gap-2 mb-6">
          <div className="h-6 bg-slate-700/50 rounded-full w-16"></div>
          <div className="h-6 bg-slate-700/50 rounded-full w-20"></div>
        </div>
        <div className="h-12 bg-slate-700/50 rounded"></div>
      </div>
    </div>
  );
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Hero Section with Midnight Theme */}
      <div className="bg-gradient-to-br from-slate-900 via-purple-900/20 to-slate-900 text-white py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-600/10 to-pink-600/10"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center">
            <GlobeAmericasIcon className="w-20 h-20 mx-auto mb-6 text-purple-400" />
            <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 bg-clip-text text-transparent">
              Explore the World
            </h1>
            <p className="text-xl md:text-2xl mb-8 max-w-4xl mx-auto text-slate-300 leading-relaxed">
              Discover amazing destinations, plan your perfect trip, and create memories that last a lifetime
            </p>
          </div>
        </div>
      </div>

      {/* Search and Filter Section with Enhanced Visibility */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl shadow-2xl p-8 mb-8 border border-slate-700/50 backdrop-blur-sm">
          <div className="flex flex-col md:flex-row gap-6">
            <div className="flex-1">
              <div className="relative">
                <MapIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 w-6 h-6 text-purple-400" />
                <input
                  type="text"
                  placeholder="Search destinations, countries, or experiences..."
                  className="w-full pl-12 pr-6 py-4 bg-slate-900/50 border border-slate-600/50 rounded-xl text-white placeholder-slate-400 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200 backdrop-blur-sm"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            <div className="md:w-72">
              <div className="relative">
                <FunnelIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 w-6 h-6 text-purple-400" />
                <select
                  className="w-full pl-12 pr-6 py-4 bg-slate-900/50 border border-slate-600/50 rounded-xl text-white focus:ring-2 focus:ring-purple-500 focus:border-purple-500 appearance-none transition-all duration-200 backdrop-blur-sm cursor-pointer"
                  value={selectedContinent}
                  onChange={(e) => setSelectedContinent(e.target.value)}
                >
                  {continents.map(continent => (
                    <option key={continent} value={continent === 'All' ? '' : continent} className="bg-slate-800 text-white">
                      {continent}
                    </option>
                  ))}
                </select>
                <div className="absolute right-4 top-1/2 transform -translate-y-1/2 pointer-events-none">
                  <svg className="w-5 h-5 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Results Summary with Enhanced Styling */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-white mb-3 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            {loading ? 'Loading destinations...' : `${filteredDestinations.length} destinations found`}
          </h2>
          {searchTerm && (
            <p className="text-slate-300 text-lg">
              Showing results for <span className="text-purple-400 font-semibold">"{searchTerm}"</span>
              {selectedContinent && <span> in <span className="text-pink-400 font-semibold">{selectedContinent}</span></span>}
            </p>
          )}
        </div>

        {/* Destinations Grid with Enhanced Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
          {loading
            ? Array(6).fill(0).map((_, index) => <LoadingCard key={index} />)
            : filteredDestinations.map(destination => (
                <DestinationCard key={destination.id} destination={destination} />
              ))
          }
        </div>

        {/* Enhanced No Results Section */}
        {!loading && filteredDestinations.length === 0 && (
          <div className="text-center py-16">
            <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-12 border border-slate-700/50 max-w-lg mx-auto">
              <GlobeAmericasIcon className="w-20 h-20 mx-auto text-purple-400 mb-6" />
              <h3 className="text-2xl font-bold text-white mb-4">No destinations found</h3>
              <p className="text-slate-300 mb-8 leading-relaxed">
                Try adjusting your search criteria or explore all destinations to discover amazing places to visit.
              </p>
              <button
                onClick={() => {
                  setSearchTerm('');
                  setSelectedContinent('');
                }}
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold py-3 px-8 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
              >
                Clear Filters
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Enhanced Statistics Section */}
      <div className="bg-gradient-to-br from-slate-800 to-slate-900 py-20 border-t border-slate-700/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div className="group">
              <div className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-3 group-hover:scale-110 transition-transform duration-200">150+</div>
              <div className="text-slate-300 text-lg font-medium">Countries</div>
            </div>
            <div className="group">
              <div className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-3 group-hover:scale-110 transition-transform duration-200">1000+</div>
              <div className="text-slate-300 text-lg font-medium">Destinations</div>
            </div>
            <div className="group">
              <div className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-3 group-hover:scale-110 transition-transform duration-200">50K+</div>
              <div className="text-slate-300 text-lg font-medium">Happy Travelers</div>
            </div>
            <div className="group">
              <div className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-3 group-hover:scale-110 transition-transform duration-200">4.8★</div>
              <div className="text-slate-300 text-lg font-medium">Average Rating</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExplorePage;