import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI!;
let cached = (global as any).mongoose;

if(!cached) {
  cached = (global as any).mongoose = {conn: null, promise:null};
}

export async function connectMongoose() {
  if(cached.conn) return cached.conn;
  cached.promise = mongoose.connect(MONGODB_URI);
  cached.conn = await cached.promise;
  return cached.conn;
}