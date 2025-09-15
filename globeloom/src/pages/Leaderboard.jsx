import React, { useState, useEffect } from 'react';
import { TrophyIcon, MapPinIcon, CalendarIcon } from '@heroicons/react/24/outline';
import { TrophyIcon as TrophyIconSolid } from '@heroicons/react/24/solid';

// Sample leaderboard data
const sampleData = [
  {
    id: 1,
    rank: 1,
    name: 'Alex Thompson',
    avatar: '/api/placeholder/80/80',
    score: 2840,
    countriesVisited: 28,
    tripsCompleted: 15,
    totalDistance: '125,000 km',
    achievements: ['Global Explorer', 'Distance Champion', 'Cultural Ambassador']
  },
  {
    id: 2,
    rank: 2,
    name: 'Sarah Chen',
    avatar: '/api/placeholder/80/80',
    score: 2650,
    countriesVisited: 25,
    tripsCompleted: 18,
    totalDistance: '98,500 km',
    achievements: ['Adventure Seeker', 'Photo Master', 'Local Expert']
  },
  {
    id: 3,
    rank: 3,
    name: 'Marco Rodriguez',
    avatar: '/api/placeholder/80/80',
    score: 2420,
    countriesVisited: 22,
    tripsCompleted: 12,
    totalDistance: '87,200 km',
    achievements: ['Mountain Climber', 'Ocean Explorer', 'City Navigator']
  },
  {
    id: 4,
    rank: 4,
    name: 'Emily Johnson',
    avatar: '/api/placeholder/80/80',
    score: 2180,
    countriesVisited: 20,
    tripsCompleted: 14,
    totalDistance: '76,800 km',
    achievements: ['Solo Traveler', 'Budget Master', 'Wildlife Photographer']
  }
];

const Leaderboard = () => {
  const [leaderboardData, setLeaderboardData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('overall');

  const categories = [
    { id: 'overall', name: 'Overall Score', icon: TrophyIcon },
    { id: 'countries', name: 'Countries Visited', icon: MapPinIcon },
    { id: 'distance', name: 'Total Distance', icon: CalendarIcon }
  ];

  useEffect(() => {
    // Simulate loading data
    setTimeout(() => {
      setLeaderboardData(sampleData);
      setLoading(false);
    }, 800);
  }, []);

  const getRankIcon = (rank) => {
    switch (rank) {
      case 1:
        return <TrophyIconSolid className="w-8 h-8 text-yellow-500" />;
      case 2:
        return <TrophyIconSolid className="w-7 h-7 text-gray-400" />;
      case 3:
        return <TrophyIconSolid className="w-6 h-6 text-amber-600" />;
      default:
        return (
          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
            <span className="text-blue-700 font-bold text-sm">{rank}</span>
          </div>
        );
    }
  };

  const getRankBadge = (rank) => {
    const baseClasses = "px-3 py-1 rounded-full text-sm font-bold";
    switch (rank) {
      case 1:
        return `${baseClasses} bg-gradient-to-r from-yellow-400 to-yellow-600 text-white`;
      case 2:
        return `${baseClasses} bg-gradient-to-r from-gray-300 to-gray-500 text-white`;
      case 3:
        return `${baseClasses} bg-gradient-to-r from-amber-500 to-amber-700 text-white`;
      default:
        return `${baseClasses} bg-blue-100 text-blue-700`;
    }
  };

  const LeaderboardItem = ({ user }) => (
    <div className={`flex items-center p-6 rounded-xl transition-all duration-200 hover:shadow-lg ${
      user.rank <= 3 ? 'bg-gradient-to-r from-white to-blue-50 border-2 border-blue-200' : 'bg-white border border-gray-200'
    }`}>
      <div className="flex items-center space-x-4 flex-1">
        <div className="flex items-center justify-center">
          {getRankIcon(user.rank)}
        </div>
        
        <img
          src={user.avatar}
          alt={user.name}
          className="w-16 h-16 rounded-full object-cover border-4 border-white shadow-md"
        />
        
        <div className="flex-1">
          <div className="flex items-center space-x-3 mb-2">
            <h3 className="text-xl font-bold text-gray-900">{user.name}</h3>
            <span className={getRankBadge(user.rank)}>
              #{user.rank}
            </span>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600">
            <div>
              <span className="font-semibold text-blue-600">{user.score.toLocaleString()}</span>
              <span className="block">Points</span>
            </div>
            <div>
              <span className="font-semibold text-green-600">{user.countriesVisited}</span>
              <span className="block">Countries</span>
            </div>
            <div>
              <span className="font-semibold text-purple-600">{user.tripsCompleted}</span>
              <span className="block">Trips</span>
            </div>
            <div>
              <span className="font-semibold text-orange-600">{user.totalDistance}</span>
              <span className="block">Distance</span>
            </div>
          </div>
          
          <div className="flex flex-wrap gap-2 mt-3">
            {user.achievements.slice(0, 3).map((achievement, i) => (
              <span
                key={i}
                className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium"
              >
                {achievement}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const LoadingItem = () => (
    <div className="flex items-center p-6 bg-white rounded-xl border border-gray-200 animate-pulse">
      <div className="w-8 h-8 bg-gray-300 rounded-full mr-4"></div>
      <div className="w-16 h-16 bg-gray-300 rounded-full mr-4"></div>
      <div className="flex-1">
        <div className="h-6 bg-gray-300 rounded mb-2 w-1/3"></div>
        <div className="grid grid-cols-4 gap-4 mb-3">
          <div className="h-4 bg-gray-300 rounded"></div>
          <div className="h-4 bg-gray-300 rounded"></div>
          <div className="h-4 bg-gray-300 rounded"></div>
          <div className="h-4 bg-gray-300 rounded"></div>
        </div>
        <div className="flex gap-2">
          <div className="h-6 bg-gray-300 rounded-full w-20"></div>
          <div className="h-6 bg-gray-300 rounded-full w-24"></div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-purple-600 to-blue-700 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <TrophyIconSolid className="w-16 h-16 mx-auto mb-4 text-yellow-400" />
            <h1 className="text-4xl md:text-6xl font-bold mb-4">
              Travel Leaderboard
            </h1>
            <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto">
              Compete with fellow travelers and climb the ranks by exploring the world
            </p>
          </div>
        </div>
      </div>

      {/* Category Selector */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Leaderboard Categories</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {categories.map(category => {
              const IconComponent = category.icon;
              return (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`p-4 rounded-lg border-2 transition-all duration-200 ${
                    selectedCategory === category.id
                      ? 'border-blue-500 bg-blue-50 text-blue-700'
                      : 'border-gray-200 hover:border-blue-300 text-gray-700'
                  }`}
                >
                  <IconComponent className="w-8 h-8 mx-auto mb-2" />
                  <span className="font-semibold">{category.name}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Leaderboard */}
        <div className="space-y-4">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-2xl font-bold text-gray-900">
              {categories.find(c => c.id === selectedCategory)?.name} Rankings
            </h3>
            <div className="text-sm text-gray-600">
              Updated: {new Date().toLocaleDateString()}
            </div>
          </div>

          {loading ? (
            Array(5).fill(0).map((_, index) => <LoadingItem key={index} />)
          ) : (
            leaderboardData.map((user) => (
              <LeaderboardItem key={user.id} user={user} />
            ))
          )}

          {!loading && leaderboardData.length === 0 && (
            <div className="text-center py-12 bg-white rounded-xl">
              <TrophyIcon className="w-16 h-16 mx-auto text-gray-400 mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No rankings available</h3>
              <p className="text-gray-600">
                Start traveling and earning points to appear on the leaderboard!
              </p>
            </div>
          )}
        </div>

        {/* Statistics Section */}
        <div className="bg-white rounded-xl shadow-lg p-8 mt-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">Community Stats</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-3xl font-bold text-blue-600 mb-2">1,247</div>
              <div className="text-gray-600">Active Travelers</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-green-600 mb-2">185</div>
              <div className="text-gray-600">Countries Explored</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-purple-600 mb-2">8,932</div>
              <div className="text-gray-600">Trips Completed</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-orange-600 mb-2">2.4M</div>
              <div className="text-gray-600">KM Traveled</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Leaderboard;

