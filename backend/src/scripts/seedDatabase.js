const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("../models/User");
const Trip = require("../models/Trip");
require("dotenv").config();

const connectDB = require("../config/database");

const sampleUsers = [
  {
    email: "john.doe@example.com",
    password: "password123",
    username: "johndoe",
    firstName: "John",
    lastName: "Doe",
    profile: {
      bio: "Travel enthusiast and photographer",
      location: "New York, USA",
      avatar:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
      preferences: {
        currency: "USD",
        language: "en",
      },
    },
  },
  {
    email: "jane.smith@example.com",
    password: "password123",
    username: "janesmith",
    firstName: "Jane",
    lastName: "Smith",
    profile: {
      bio: "Adventure seeker and digital nomad",
      location: "London, UK",
      avatar:
        "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face",
      preferences: {
        currency: "GBP",
        language: "en",
      },
    },
  },
  {
    email: "alex.chen@example.com",
    password: "password123",
    username: "alexchen",
    firstName: "Alex",
    lastName: "Chen",
    profile: {
      bio: "Food lover and culture explorer",
      location: "Tokyo, Japan",
      avatar:
        "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
      preferences: {
        currency: "JPY",
        language: "en",
      },
    },
  },
];

const sampleTrips = [
  {
    title: "European Adventure",
    description: "A 2-week journey through the most beautiful cities in Europe",
    destination: "Europe",
    startDate: new Date("2025-07-15"),
    endDate: new Date("2025-07-29"),
    budget: 3500,
    currency: "USD",
    status: "planning",
    privacy: "public",
    coverImage:
      "https://images.unsplash.com/photo-1471632007716-c4ec4f0ca6f5?w=800&h=400&fit=crop",
    activities: [
      {
        name: "Visit Eiffel Tower",
        description: "Iconic landmark in Paris",
        location: "Paris, France",
        date: new Date("2025-07-16"),
        type: "sightseeing",
        estimatedCost: 25,
        status: "planned",
      },
      {
        name: "Colosseum Tour",
        description: "Guided tour of ancient Roman amphitheater",
        location: "Rome, Italy",
        date: new Date("2025-07-20"),
        type: "cultural",
        estimatedCost: 40,
        status: "planned",
      },
    ],
  },
  {
    title: "Tokyo Food Tour",
    description: "Explore the incredible culinary scene of Tokyo",
    destination: "Tokyo, Japan",
    startDate: new Date("2025-08-10"),
    endDate: new Date("2025-08-17"),
    budget: 2500,
    currency: "USD",
    status: "planning",
    privacy: "public",
    coverImage:
      "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=800&h=400&fit=crop",
    activities: [
      {
        name: "Sushi Making Class",
        description: "Learn to make authentic sushi",
        location: "Shibuya, Tokyo",
        date: new Date("2025-08-12"),
        type: "culinary",
        estimatedCost: 80,
        status: "planned",
      },
      {
        name: "Tsukiji Fish Market",
        description: "Early morning fish market visit",
        location: "Tsukiji, Tokyo",
        date: new Date("2025-08-13"),
        type: "cultural",
        estimatedCost: 20,
        status: "planned",
      },
    ],
  },
];

async function seedDatabase() {
  try {
    // Connect to database
    await connectDB();

    console.log("🌱 Starting database seeding...");

    // Clear existing data
    await User.deleteMany({});
    await Trip.deleteMany({});
    console.log("📭 Cleared existing data");

    // Create users
    const users = [];
    for (const userData of sampleUsers) {
      const hashedPassword = await bcrypt.hash(userData.password, 12);
      const user = new User({
        ...userData,
        password: hashedPassword,
      });
      await user.save();
      users.push(user);
      console.log(`👤 Created user: ${user.username}`);
    }

    // Create trips
    for (let i = 0; i < sampleTrips.length; i++) {
      const tripData = {
        ...sampleTrips[i],
        creator: users[i % users.length]._id,
      };

      // Add activity creators
      tripData.activities = tripData.activities.map((activity) => ({
        ...activity,
        createdBy: users[i % users.length]._id,
      }));

      const trip = new Trip(tripData);
      await trip.save();
      console.log(`✈️ Created trip: ${trip.title}`);
    }

    // Add some social connections
    users[0].following.push(users[1]._id, users[2]._id);
    users[1].followers.push(users[0]._id);
    users[1].following.push(users[2]._id);
    users[2].followers.push(users[0]._id, users[1]._id);

    await Promise.all([users[0].save(), users[1].save(), users[2].save()]);

    console.log("👥 Added social connections");

    console.log("🎉 Database seeding completed successfully!");
    console.log("\n📊 Seeded data summary:");
    console.log(`   Users: ${users.length}`);
    console.log(`   Trips: ${sampleTrips.length}`);
    console.log("\n🔐 Login credentials:");
    console.log("   Email: john.doe@example.com | Password: password123");
    console.log("   Email: jane.smith@example.com | Password: password123");
    console.log("   Email: alex.chen@example.com | Password: password123");

    process.exit(0);
  } catch (error) {
    console.error("❌ Database seeding failed:", error);
    process.exit(1);
  }
}

// Run seeding if called directly
if (require.main === module) {
  seedDatabase();
}

module.exports = seedDatabase;
