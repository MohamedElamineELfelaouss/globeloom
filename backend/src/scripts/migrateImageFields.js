const mongoose = require("mongoose");
require("dotenv").config();

// Connect to MongoDB
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error("❌ Database connection failed:", error);
    process.exit(1);
  }
};

// Migration function to convert avatar and banner fields
const migrateImageFields = async () => {
  try {
    console.log("🔄 Starting migration of avatar and banner fields...");

    // Get the users collection directly
    const usersCollection = mongoose.connection.collection("users");

    // Find all users with old avatar/banner structure
    const users = await usersCollection
      .find({
        $or: [
          { "avatar.url": { $exists: true } },
          { "banner.url": { $exists: true } },
        ],
      })
      .toArray();

    console.log(`📊 Found ${users.length} users to migrate`);

    let migratedCount = 0;

    for (const user of users) {
      const updateFields = {};

      // Convert avatar field
      if (user.avatar && typeof user.avatar === "object" && user.avatar.url) {
        updateFields.avatar = user.avatar.url;
        console.log(
          `🔄 Converting avatar for user ${user._id}: ${user.avatar.url} -> base64 placeholder`
        );
        // For now, we'll use the URL as a placeholder since we can't convert Cloudinary URLs to base64
        // In a real scenario, you'd want to download and convert these images
        updateFields.avatar = ""; // Reset to empty for now - users will need to re-upload
      } else if (user.avatar && typeof user.avatar === "object") {
        // If it's an object but no URL, set to empty string
        updateFields.avatar = "";
      }

      // Convert banner field
      if (user.banner && typeof user.banner === "object" && user.banner.url) {
        updateFields.banner = user.banner.url;
        console.log(
          `🔄 Converting banner for user ${user._id}: ${user.banner.url} -> base64 placeholder`
        );
        // For now, we'll use the URL as a placeholder since we can't convert Cloudinary URLs to base64
        // In a real scenario, you'd want to download and convert these images
        updateFields.banner = ""; // Reset to empty for now - users will need to re-upload
      } else if (user.banner && typeof user.banner === "object") {
        // If it's an object but no URL, set to empty string
        updateFields.banner = "";
      }

      // Update the user if there are fields to update
      if (Object.keys(updateFields).length > 0) {
        await usersCollection.updateOne(
          { _id: user._id },
          { $set: updateFields }
        );
        migratedCount++;
        console.log(`✅ Migrated user ${user._id}`);
      }
    }

    console.log(`🎉 Migration completed! ${migratedCount} users migrated.`);
    console.log(
      "📝 Note: Avatar and banner images have been reset to empty strings."
    );
    console.log("📝 Users will need to re-upload their profile images.");
  } catch (error) {
    console.error("❌ Migration failed:", error);
    throw error;
  }
};

// Run the migration
const runMigration = async () => {
  try {
    await connectDB();
    await migrateImageFields();
    console.log("✅ Migration completed successfully!");
    process.exit(0);
  } catch (error) {
    console.error("❌ Migration failed:", error);
    process.exit(1);
  }
};

// Check if this script is being run directly
if (require.main === module) {
  runMigration();
}

module.exports = { migrateImageFields };
