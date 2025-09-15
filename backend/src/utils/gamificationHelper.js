// Helper functions for gamification management

/**
 * Ensures a user has gamification data initialized
 * @param {Object} user - User document
 * @returns {Object} User with initialized gamification
 */
const ensureGamification = (user) => {
  if (!user.gamification) {
    user.gamification = {
      totalPoints: 0,
      level: 1,
      achievements: [],
      badges: [],
      streak: {
        current: 0,
        longest: 0,
        lastActive: null,
      },
      stats: {
        postsCreated: 0,
        likesReceived: 0,
        commentsReceived: 0,
        sharesReceived: 0,
        followersGained: 0,
        tripsCompleted: 0,
        countriesVisited: 0,
      },
    };
  }
  return user;
};

/**
 * Safely adds points to a user's gamification total
 * @param {Object} user - User document
 * @param {number} points - Points to add
 * @returns {Object} Updated user
 */
const addPoints = (user, points) => {
  ensureGamification(user);
  user.gamification.totalPoints += points;

  // Calculate level based on points (every 100 points = 1 level)
  const newLevel = Math.floor(user.gamification.totalPoints / 100) + 1;
  if (newLevel > user.gamification.level) {
    user.gamification.level = newLevel;
  }

  return user;
};

/**
 * Safely gets total points from a user
 * @param {Object} user - User document
 * @returns {number} Total points
 */
const getTotalPoints = (user) => {
  ensureGamification(user);
  return user.gamification.totalPoints || 0;
};

/**
 * Updates gamification stats for specific actions
 * @param {Object} user - User document
 * @param {string} action - The action performed
 * @param {number} count - How many to add (default 1)
 */
const updateStats = (user, action, count = 1) => {
  ensureGamification(user);

  const statMap = {
    post_created: "postsCreated",
    like_received: "likesReceived",
    comment_received: "commentsReceived",
    share_received: "sharesReceived",
    follower_gained: "followersGained",
    trip_completed: "tripsCompleted",
    country_visited: "countriesVisited",
  };

  const statKey = statMap[action];
  if (statKey && user.gamification.stats[statKey] !== undefined) {
    user.gamification.stats[statKey] += count;
  }
};

module.exports = {
  ensureGamification,
  addPoints,
  getTotalPoints,
  updateStats,
};
