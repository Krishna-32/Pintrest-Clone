import mongoose from "mongoose";

const connectToDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI)
    console.log("Connected to MongoDB")
  } catch (error) {
   console.log("Something went wrong connecting to MongoDB", error)
  }
}

export default connectToDB;
