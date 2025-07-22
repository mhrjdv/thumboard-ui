# Supabase Authentication Setup

This guide will help you set up Supabase authentication for the Thumboard UI project.

## Prerequisites

- A Supabase account (sign up at [supabase.com](https://supabase.com))
- Node.js and pnpm installed

## Setup Steps

### 1. Create a Supabase Project

1. Go to [supabase.com](https://supabase.com) and sign in
2. Click "New Project"
3. Choose your organization
4. Enter project details:
   - Name: `thumboard-ui`
   - Database Password: Generate a strong password
   - Region: Choose closest to your users
5. Click "Create new project"

### 2. Get Your Project Credentials

1. In your Supabase dashboard, go to **Settings** > **API**
2. Copy the following values:
   - **Project URL** (under "Project URL")
   - **anon public** key (under "Project API keys")

### 3. Configure Environment Variables

1. Copy `.env.example` to `.env.local`:
   ```bash
   cp .env.example .env.local
   ```

2. Update the Supabase variables in `.env.local`:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here
   ```

### 4. Configure Authentication Settings

1. In your Supabase dashboard, go to **Authentication** > **Settings**
2. Under **Site URL**, add your development URL:
   ```
   http://localhost:3001
   ```
3. Under **Redirect URLs**, add:
   ```
   http://localhost:3001/auth/callback
   ```

### 5. Enable Email Authentication

1. Go to **Authentication** > **Providers**
2. Make sure **Email** is enabled
3. Configure email templates if needed under **Authentication** > **Email Templates**

### 6. Enable Social Providers (Google OAuth)

#### Google OAuth Setup:
1. Go to **Authentication** > **Providers**
2. Enable **Google** provider
3. Go to [Google Cloud Console](https://console.cloud.google.com/)
4. Create a new project or select existing one
5. Enable Google+ API
6. Go to **Credentials** > **Create Credentials** > **OAuth 2.0 Client IDs**
7. Set **Authorized redirect URIs** to: `https://your-project-ref.supabase.co/auth/v1/callback`
8. Copy **Client ID** and **Client Secret** to Supabase



### 7. Configure Site URL and Redirect URLs

1. Go to **Authentication** > **URL Configuration**
2. Set **Site URL** to your production domain (e.g., `https://yourdomain.com`)
3. Add **Redirect URLs**:
   - `http://localhost:3001/auth/callback` (development)
   - `https://yourdomain.com/auth/callback` (production)
   - `http://localhost:3001/auth/reset-password` (development)
   - `https://yourdomain.com/auth/reset-password` (production)

## Features Implemented

- ✅ Email/Password authentication
- ✅ Magic link authentication
- ✅ Email OTP authentication
- ✅ Google OAuth authentication
- ✅ User registration
- ✅ Password reset functionality
- ✅ Authentication state management
- ✅ Protected routes with middleware
- ✅ Enhanced auth callback handling
- ✅ Custom authentication hooks
- ✅ Comprehensive error handling
- ✅ Loading states and UI feedback

## Usage

### Authentication Methods Available

#### 1. Email/Password Authentication
- Navigate to `/login` or `/signup`
- Select "Continue with Email & Password"
- Enter email, password, and full name (for signup)
- Click "Sign In" or "Sign Up"

#### 2. Magic Link Authentication
- Navigate to `/login` or `/signup`
- Select "Continue with Magic Link"
- Enter email address
- Check email for magic link
- Click link to authenticate

#### 3. Email OTP Authentication
- Navigate to `/login` or `/signup`
- Select "Continue with Email OTP"
- Enter email address
- Check email for 6-digit verification code
- Enter code to authenticate

#### 4. Google OAuth
- Navigate to `/login` or `/signup`
- Click "Continue with Google"
- Redirected to Google for authentication
- Automatically redirected back after approval



### Password Reset
1. Go to login page
2. Click "Forgot your password?"
3. Enter email address
4. Check email for reset link
5. Click link and enter new password

## Troubleshooting

### Common Issues

1. **"Invalid API key"**
   - Check that your environment variables are correct
   - Ensure `.env.local` is in the project root
   - Restart the development server

2. **Magic link not working**
   - Check redirect URLs in Supabase dashboard
   - Ensure site URL is configured correctly
   - Check spam folder for emails

3. **Authentication not persisting**
   - Check that AuthProvider is wrapping your app
   - Verify Supabase client configuration

### Development Tips

- Use the Supabase dashboard to view users and authentication logs
- Check the browser's Network tab for API calls
- Use the browser's Application tab to inspect localStorage for session data

## Security Notes

- Never commit `.env.local` to version control
- Use Row Level Security (RLS) policies in Supabase for data protection
- Configure proper CORS settings for production
- Use HTTPS in production

## Next Steps

1. Set up user profiles table
2. Implement role-based access control
3. Add password reset functionality
4. Configure email templates
5. Set up social authentication providers