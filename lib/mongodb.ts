import { MongoClient, MongoClientOptions } from 'mongodb';

const options: MongoClientOptions = {
  appName: "devrel.vercel.integration",
  maxIdleTimeMS: 5000
};

if (!process.env.MONGODB_URI) {
  throw new Error('Missing MONGODB_URI environment variable');
}

const client = new MongoClient(process.env.MONGODB_URI, options);

// Keep a module-scoped MongoClient so it can be reused across function invocations.
// The previous attachDatabasePool import is removed because @vercel/functions is not available.
export default client;