import mongoose from "mongoose"

const MONGODB_URI = process.env.MONGODB_URI

declare global {
  var mongoose: any
}

if (!MONGODB_URI) {
  throw new Error("Please define the MONGODB_URI environment variable inside .env.local")
}

let cached = global.mongoose

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null }
}

export async function connectDB() {
  if (cached.conn) {
    return cached.conn
  }

  if (!cached.promise) {
    // Determine if this is an Atlas connection (mongodb+srv://) or local
    const isAtlas = MONGODB_URI!.startsWith('mongodb+srv://')
    
    const opts: any = {
      bufferCommands: false,
      serverSelectionTimeoutMS: 5000, // 5 seconds timeout for faster feedback
      socketTimeoutMS: 45000,
    }

    // Only add SSL options for Atlas connections
    if (isAtlas) {
      opts.tls = true
      opts.retryWrites = true
    }

    cached.promise = mongoose.connect(MONGODB_URI!, opts).then((mongoose) => {
      return mongoose
    })
  }

  try {
    cached.conn = await cached.promise
  } catch (e) {
    cached.promise = null
    console.error('Database connection error:', e)
    throw e
  }

  return cached.conn
}
