const mongoose = require("mongoose");
const User = require("../models/User");
require("dotenv").config();

const initializeGamification = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Connected to MongoDB");

    // Find all users without gamification data
    const usersWithoutGamification = await User.find({
      $or: [
        { gamification: { $exists: false } },
        { gamification: null },
        { "gamification.totalPoints": { $exists: false } },
      ],
    });

    console.log(
      `Found ${usersWithoutGamification.length} users without gamification data`
    );

    if (usersWithoutGamification.length === 0) {
      console.log("All users already have gamification data!");
      return;
    }

    // Initialize gamification for each user
    const updateOperations = usersWithoutGamification.map((user) => ({
      updateOne: {
        filter: { _id: user._id },
        update: {
          $set: {
            gamification: {
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
            },
          },
        },
      },
    }));

    // Execute bulk update
    const result = await User.bulkWrite(updateOperations);

    console.log(
      `Successfully initialized gamification for ${result.modifiedCount} users`
    );
    console.log("Migration completed successfully!");
  } catch (error) {
    console.error("Migration failed:", error);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
    console.log("Disconnected from MongoDB");
    process.exit(0);
  }
};

// Only run if called directly
if (require.main === module) {
  initializeGamification();
}

module.exports = initializeGamification;
