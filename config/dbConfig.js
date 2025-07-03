import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const mongoURI = process.env.MONGO_URI;

// Check if the URI is provided
if (!mongoURI) {
  console.error("❌ MONGO_URI is missing in environment variables.");
  process.exit(1); // Exit the app
}

// Connect to MongoDB
mongoose.connect(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const connection = mongoose.connection;

// Successful connection
connection.on("connected", () => {
  console.log("✅ MongoDB is connected");
});

// Connection error
connection.on("error", (err) => {
  console.error("❌ Error connecting to MongoDB:", err.message);
  process.exit(1); // Optional: exit on DB connection failure
});

export default mongoose;
