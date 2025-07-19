# Environment Variables Setup Guide

This guide explains how to set up environment variables for the Thumboard UI project across different environments.

## 📁 Environment Files Overview

The project includes the following environment files:

- **`.env.example`** - Template with all available environment variables and examples
- **`.env.local`** - Development environment (local development)
- **`.env.staging`** - Staging environment (pre-production testing)
- **`.env.production`** - Production environment (live deployment)
- **`.env.test`** - Test environment (Jest, Playwright, CI/CD)

## 🚀 Quick Setup

### For Development

1. Copy the example file:
   ```bash
   cp .env.example .env.local
   ```

2. Update the values in `.env.local` with your actual credentials:
   ```bash
   # Edit the file with your preferred editor
   nano .env.local
   # or
   code .env.local
   ```

### For Production (Vercel)

1. Go to your [Vercel Dashboard](https://vercel.com/dashboard)
2. Select your project
3. Go to **Settings** > **Environment Variables**
4. Add the variables from `.env.production`

### For Production (Other Platforms)

- **Netlify**: Site Settings > Environment Variables
- **AWS/Docker**: Use container environment variables or AWS Secrets Manager
- **Railway**: Project Settings > Variables

## 🔧 Environment Variables Reference

### Required Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `MEILISEARCH_URL` | MeiliSearch server endpoint | `https://api.thumboard.in` |
| `MEILISEARCH_API_KEY` | MeiliSearch master key | `your_master_key_here` |
| `NEXT_PUBLIC_APP_URL` | Application base URL | `http://localhost:3000` |

### Email Configuration

| Variable | Description | Example |
|----------|-------------|---------|
| `SMTP_HOST` | SMTP server hostname | `smtp.gmail.com` |
| `SMTP_PORT` | SMTP server port | `587` |
| `SMTP_USER` | SMTP username | `thumboard@gmail.com` |
| `SMTP_PASS` | SMTP password/app password | `your_app_password` |
| `EMAIL_FROM` | From email address | `thumboard@gmail.com` |
| `EMAIL_TO` | Contact form recipient | `connect@thumboard.in` |

### Cloudflare Turnstile (CAPTCHA)

| Variable | Description | Example |
|----------|-------------|---------|
| `NEXT_PUBLIC_TURNSTILE_SITE_KEY` | Public site key | `0x4AAAAAABlqWd4TLACHhY2U` |
| `TURNSTILE_SECRET_KEY` | Private secret key | `your_secret_key_here` |

### Optional Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `NODE_ENV` | Node environment | `development` |
| `DEBUG` | Enable debug mode | `false` |
| `LOG_LEVEL` | Logging level | `info` |
| `ALLOWED_ORIGINS` | CORS allowed origins | `http://localhost:3000` |

## 🌍 Environment-Specific Configurations

### Development (`.env.local`)
- Uses production MeiliSearch instance
- Debug mode enabled
- Detailed logging
- Local CORS settings

### Staging (`.env.staging`)
- Separate staging MeiliSearch instance (recommended)
- Test Turnstile keys
- Staging email configuration
- Performance monitoring enabled

### Production (`.env.production`)
- Production MeiliSearch instance
- Real Turnstile keys
- Production email configuration
- Error-level logging only
- Performance monitoring enabled

### Test (`.env.test`)
- Local/mock MeiliSearch instance
- Test Turnstile keys (always pass)
- Mock email configuration
- Debug logging
- External API mocking enabled

## 🔒 Security Best Practices

### DO NOT commit sensitive files
Add these to your `.gitignore`:
```
.env.local
.env.production
.env.staging
.env.test
```

### Use different keys for different environments
- **Development**: Can use production keys for testing
- **Staging**: Use separate staging keys when possible
- **Production**: Use production keys only
- **Test**: Use test/mock keys only

### Rotate keys regularly
- Change MeiliSearch API keys periodically
- Update email passwords when needed
- Regenerate Turnstile keys if compromised

## 🛠️ Troubleshooting

### Common Issues

1. **MeiliSearch connection failed**
   - Check `MEILISEARCH_URL` is correct
   - Verify `MEILISEARCH_API_KEY` is valid
   - Ensure MeiliSearch server is running

2. **Email not sending**
   - Verify SMTP credentials
   - Check if Gmail app password is correct
   - Ensure less secure app access is enabled (if using Gmail)

3. **Turnstile verification failed**
   - Check site key matches domain
   - Verify secret key is correct
   - Ensure Turnstile is properly loaded

4. **Environment variables not loading**
   - Restart development server after changes
   - Check file naming (`.env.local` not `.env.development`)
   - Verify variables are not commented out

### Debugging

Enable debug mode to see detailed logs:
```bash
DEBUG=true
LOG_LEVEL=debug
```

## 📚 Additional Resources

- [Next.js Environment Variables](https://nextjs.org/docs/basic-features/environment-variables)
- [MeiliSearch Documentation](https://docs.meilisearch.com/)
- [Cloudflare Turnstile](https://developers.cloudflare.com/turnstile/)
- [Vercel Environment Variables](https://vercel.com/docs/concepts/projects/environment-variables)
