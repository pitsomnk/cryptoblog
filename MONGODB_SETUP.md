# MongoDB Setup for CryptoBlog

This guide will help you set up MongoDB as the database provider for your CryptoBlog application.

## Prerequisites

- MongoDB installed locally, or a MongoDB Atlas cloud account
- Node.js and npm installed

## Local MongoDB Setup

### Option 1: MongoDB Atlas (Cloud - Recommended for Production)

1. **Create a MongoDB Atlas account**
   - Go to [https://www.mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
   - Sign up for a free account

2. **Create a new cluster**
   - Click "Build a Database"
   - Choose the free tier (M0)
   - Select your preferred cloud provider and region
   - Click "Create Cluster"

3. **Configure database access**
   - Go to "Database Access" in the left sidebar
   - Click "Add New Database User"
   - Create a username and password (save these!)
   - Grant "Read and write to any database" permissions

4. **Configure network access**
   - Go to "Network Access" in the left sidebar
   - Click "Add IP Address"
   - For development, click "Allow Access from Anywhere" (0.0.0.0/0)
   - For production, add your specific IP addresses

5. **Get your connection string**
   - Go to "Database" in the left sidebar
   - Click "Connect" on your cluster
   - Choose "Connect your application"
   - Copy the connection string
   - Replace `<password>` with your database user password

6. **Update .env.local**
   ```bash
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net
   MONGODB_DB=cryptoblog
   ```

### Option 2: Local MongoDB Installation

1. **Install MongoDB Community Server**
   - Download from [https://www.mongodb.com/try/download/community](https://www.mongodb.com/try/download/community)
   - Install following the installation wizard
   - MongoDB will run on `mongodb://localhost:27017` by default

2. **Start MongoDB**
   - On Windows: MongoDB should start automatically as a service
   - On Mac/Linux: Run `mongod` in terminal

3. **Update .env.local** (already configured for local)
   ```bash
   MONGODB_URI=mongodb://localhost:27017
   MONGODB_DB=cryptoblog
   ```

## Database Collections

The application uses a `posts` collection with the following schema:

```javascript
{
  slug: string,          // Unique identifier (URL-friendly)
  title: string,         // Post title
  excerpt: string,       // Short description
  author: string,        // Author name
  date: string,         // Publication date (formatted)
  category: string,     // Category (Markets, Analysis, Guides, etc.)
  contentPath: string,  // Path to MDX file
  image: string | null, // Featured image path
  featured: boolean,    // Whether post is featured
  createdAt: Date      // Timestamp of creation
}
```

## How It Works

The application uses a **fallback system**:

1. **If MongoDB is configured** (MONGODB_URI is set):
   - Reads posts from MongoDB
   - Writes new posts to both MongoDB and local files
   - Falls back to local files if MongoDB fails

2. **If MongoDB is not configured**:
   - Reads posts from `data/posts.ts`
   - Writes new posts only to local files

This ensures the application works even without MongoDB.

## Testing the Connection

1. **Start the development server**:
   ```bash
   npm run dev
   ```

2. **Check the console** for:
   - No MongoDB connection errors
   - Posts loading successfully

3. **Test creating a post**:
   - Go to [http://localhost:3000/admin](http://localhost:3000/admin)
   - Create a new post
   - Check that it appears on the homepage

## Viewing Your Data

### MongoDB Atlas
- Use the "Browse Collections" feature in the Atlas dashboard

### Local MongoDB
- Install MongoDB Compass (GUI): [https://www.mongodb.com/products/compass](https://www.mongodb.com/products/compass)
- Connect to `mongodb://localhost:27017`
- Navigate to the `cryptoblog` database and `posts` collection

### Command Line
```bash
# Connect to local MongoDB
mongosh

# Switch to cryptoblog database
use cryptoblog

# View all posts
db.posts.find().pretty()

# Count posts
db.posts.countDocuments()
```

## Troubleshooting

### Connection Errors

**Error: `MongooseServerSelectionError`**
- Check that MongoDB is running
- Verify your connection string is correct
- Check network access settings (for Atlas)

**Error: `Invalid/Missing environment variable: "MONGODB_URI"`**
- Make sure `.env.local` exists and contains MONGODB_URI
- Restart your development server after adding environment variables

### Posts Not Appearing

1. Check the browser console for errors
2. Check the server console for MongoDB errors
3. Verify posts exist in the database
4. The app will automatically fall back to local files if MongoDB fails

## Migrating Existing Data

To migrate your existing posts from `data/posts.ts` to MongoDB:

1. Ensure MongoDB is running and configured
2. Create a migration script (optional):

```javascript
// scripts/migrate-to-mongo.js
const { MongoClient } = require('mongodb');
const { posts } = require('./data/posts');

async function migrate() {
  const client = new MongoClient(process.env.MONGODB_URI);
  await client.connect();
  const db = client.db('cryptoblog');
  
  for (const post of posts) {
    await db.collection('posts').updateOne(
      { slug: post.slug },
      { $set: { ...post, createdAt: new Date() } },
      { upsert: true }
    );
  }
  
  console.log(`Migrated ${posts.length} posts`);
  await client.close();
}

migrate().catch(console.error);
```

3. Run the migration:
```bash
node scripts/migrate-to-mongo.js
```

## Production Deployment

For production:

1. Use MongoDB Atlas (more reliable than self-hosted)
2. Set environment variables in your hosting platform
3. Whitelist your production server's IP in MongoDB Atlas
4. Use a strong database user password
5. Consider enabling MongoDB backup features

## Additional Resources

- [MongoDB Documentation](https://docs.mongodb.com/)
- [MongoDB Atlas Getting Started](https://docs.atlas.mongodb.com/getting-started/)
- [MongoDB Node.js Driver Docs](https://docs.mongodb.com/drivers/node/)
