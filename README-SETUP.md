# ArcFunmi Supabase Setup Guide

This guide will help you complete the Supabase integration for the ArcFunmi application.

## Prerequisites

1. A Supabase project created at [supabase.com](https://supabase.com)
2. Environment variables set in `.env.local`:
   ```
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

## Database Setup

### Step 1: Create Tables and Functions

1. Go to your Supabase Dashboard
2. Navigate to **SQL Editor**
3. Copy and run the contents of `database/schema.sql`

This will create:
- All necessary tables (users, articles, comments, likes, bookmarks, settings)
- Database functions for incrementing/decrementing counters
- Triggers for automatic timestamp updates
- Indexes for better performance
- A trigger to automatically create user profiles on signup

### Step 2: Set Up Row Level Security

1. In the SQL Editor, copy and run the contents of `database/rls-policies.sql`

This will:
- Enable Row Level Security on all tables
- Create policies for secure data access
- Ensure users can only access appropriate data

### Step 3: Configure Storage

1. In the SQL Editor, copy and run the contents of `database/storage-policies.sql`

This will:
- Create a storage bucket for article images
- Set up policies for secure file uploads and access

### Step 4: Enable Authentication Providers (Optional)

1. Go to **Authentication** > **Providers**
2. Enable Google OAuth if you want Google sign-in functionality
3. Configure the OAuth redirect URL: `your-domain.com/auth/callback`

## Features Implemented

### ✅ Authentication System
- User registration and login
- Password reset functionality
- Google OAuth integration
- Protected routes and user sessions

### ✅ Article Management
- Create, read, update, delete articles
- Article categories (Architecture, Engineering, Construction)
- Image upload for articles
- Article likes and bookmarks
- View counters

### ✅ User Profiles
- User profile management
- Avatar uploads
- Professional information (qualification, profession)
- Privacy settings

### ✅ Comments System
- Nested comments and replies
- Comment likes
- Real-time comment management

### ✅ User Interface
- Responsive design
- Real-time authentication state
- Loading states and error handling
- Form validation

## Testing the Integration

1. **Start the development server:**
   ```bash
   npm run dev
   ```

2. **Test authentication:**
   - Visit `/signup` to create a new account
   - Check your email for verification
   - Login at `/login`

3. **Test article creation:**
   - Once logged in, visit `/write-article`
   - Create a test article with an image
   - Verify it appears in the articles list

4. **Test user interactions:**
   - Like articles
   - Add comments
   - Bookmark articles
   - Update your profile

## Database Schema Overview

### Core Tables

1. **users** - Extends Supabase auth.users with profile information
2. **articles** - Blog posts/articles with metadata
3. **comments** - Comments and replies on articles
4. **article_likes** - User likes on articles
5. **comment_likes** - User likes on comments
6. **bookmarks** - User bookmarked articles
7. **user_settings** - User preferences and privacy settings

### Key Features

- **Automatic user profile creation** on signup
- **Soft delete protection** with CASCADE relationships
- **Counter fields** automatically updated via database functions
- **Row Level Security** ensuring data privacy
- **Full-text search** capabilities on articles
- **Tag-based filtering** with GIN indexes

## API Endpoints Created

The following services are available in the `/lib` directory:

- `auth.ts` - Authentication operations
- `articles.ts` - Article CRUD operations
- `comments.ts` - Comment management
- `types.ts` - TypeScript type definitions

## Troubleshooting

### Common Issues

1. **"relation does not exist" errors**
   - Ensure all SQL scripts from `database/` folder have been run
   - Check that RLS policies are properly set

2. **Authentication not working**
   - Verify environment variables are correct
   - Check Supabase project URL and keys
   - Ensure site URL is configured in Supabase auth settings

3. **Image uploads failing**
   - Verify storage bucket exists
   - Check storage policies are applied
   - Ensure file size is within limits

4. **RLS policy errors**
   - Check that RLS is enabled on all tables
   - Verify user is authenticated when accessing protected resources

## Next Steps

Your ArcFunmi application is now fully integrated with Supabase! You can:

1. Deploy to production (Vercel, Netlify, etc.)
2. Configure custom domain and email templates in Supabase
3. Set up analytics and monitoring
4. Add more features like search, notifications, etc.

## Support

If you encounter any issues:
1. Check the Supabase logs in your dashboard
2. Review the browser console for client-side errors
3. Verify all SQL scripts have been executed successfully
4. Check that environment variables are properly set 