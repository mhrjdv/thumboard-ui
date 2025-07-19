# Security Guide

## 🔒 Credential Management

This project follows strict security practices to protect sensitive information like API keys and credentials.

### ✅ Security Measures Implemented

1. **No Hardcoded Credentials**: All credentials are stored in environment variables
2. **Centralized Configuration**: Single source of truth for all environment variables
3. **Validation**: Environment variables are validated at startup
4. **Documentation**: Clear examples without exposing real credentials
5. **Setup Script**: Automated environment setup without exposing secrets

### 🚫 What Was Removed

- ❌ Hardcoded MeiliSearch API key from 6 source files
- ❌ Hardcoded MeiliSearch URL from 5 source files  
- ❌ Credentials from `vercel.json` configuration
- ❌ Real credentials from documentation files

### 🔧 Environment Variables

The application requires these environment variables:

```bash
# Required
MEILISEARCH_URL=https://your-meilisearch-instance.com
MEILISEARCH_API_KEY=your_meilisearch_api_key_here

# Optional
NODE_ENV=development
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 📁 Files Updated

#### Source Code
- `src/lib/config.ts` - New centralized configuration
- `src/lib/meilisearch.ts` - Uses centralized config
- `src/app/api/search/route.ts` - Uses centralized config
- `src/app/api/suggestions/route.ts` - Uses centralized config
- `src/app/api/index-config/route.ts` - Uses centralized config
- `src/app/api/health/route.ts` - Uses centralized config

#### Configuration
- `vercel.json` - Removed hardcoded credentials
- `package.json` - Added setup script

#### Documentation
- `README.md` - Updated with security best practices
- `DEPLOYMENT.md` - Removed real credentials
- `MEILISEARCH_INTEGRATION_FIXES.md` - Removed real credentials

#### Setup
- `scripts/setup-env.js` - New automated setup script for .env and .env.production

### 🛡️ Security Best Practices

1. **Never commit credentials to version control**
2. **Use different API keys for development and production**
3. **Regularly rotate your API keys**
4. **Use environment variables for all sensitive data**
5. **Validate environment variables at startup**
6. **Use secure communication (HTTPS) for all API calls**

### 🚀 Setup Instructions

1. **Development Setup**:
   ```bash
   pnpm setup
   # Edit .env with your actual credentials
   ```

2. **Production Setup**:
   - Edit `.env.production` with your production credentials
   - Set environment variables in your hosting platform
   - Never use development credentials in production
   - Use secure environment variable management

### 🔍 Verification

To verify no hardcoded credentials remain:

```bash
# Search for the old API key (should return no results)
grep -r "UQtp0G7rendEVtVzssxbGOwqP030IhXh3040m5HQQsCQMvaMlGVJ91l3bKjf9FlQmRUCxD9nelf6yOZ3aHrNAgU0Jg37FsS4xJ4ljC6iz3S3Gijb88MODkgmbhFsAhxe" .

# Search for hardcoded URLs (should return no results)
grep -r "https://api.thumboard.in" .
```

### ⚠️ Important Notes

- The old API key has been exposed and should be rotated immediately
- Update your MeiliSearch instance with a new API key
- Update all environment variables with the new credentials
- Consider using a secrets management service for production

### 📞 Support

If you encounter any security issues or have questions about credential management, please:

1. Check the configuration in `src/lib/config.ts`
2. Verify your environment variables are set correctly
3. Ensure you're using the latest version of the codebase
4. Contact the development team for assistance 