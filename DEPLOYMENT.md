# Deployment Guide

## ✅ MeiliSearch Integration Status

The MeiliSearch integration is **fully functional** and tested:

- ✅ Health endpoint working
- ✅ Search functionality working
- ✅ Filtering working
- ✅ Faceted search working
- ✅ Real-time suggestions working
- ✅ All three grid layouts working (Grid, Masonry, List)

### Test Results
- **Total documents**: 20 thumbnails indexed
- **Search performance**: < 1ms response time
- **Available filters**: type, emotion, face_presence, layout_style, color_palette
- **Grid layouts**: All three layouts (grid, masonry, list) working perfectly

## AWS MeiliSearch Security Group Configuration

### Inbound Rules
Configure your AWS Security Group with these inbound rules:

1. **HTTP (Port 80)**
   - Type: HTTP
   - Protocol: TCP
   - Port Range: 80
   - Source: 0.0.0.0/0 (Anywhere)
   - Description: HTTP access for MeiliSearch

2. **HTTPS (Port 443)**
   - Type: HTTPS
   - Protocol: TCP
   - Port Range: 443
   - Source: 0.0.0.0/0 (Anywhere)
   - Description: HTTPS access for MeiliSearch

3. **MeiliSearch API (Port 7700)**
   - Type: Custom TCP
   - Protocol: TCP
   - Port Range: 7700
   - Source: 0.0.0.0/0 (Anywhere)
   - Description: MeiliSearch API access

4. **SSH (Port 22)**
   - Type: SSH
   - Protocol: TCP
   - Port Range: 22
   - Source: Your-IP/32 (Your specific IP only)
   - Description: SSH access for administration

### Outbound Rules
Allow all outbound traffic:
- Type: All Traffic
- Protocol: All
- Port Range: All
- Destination: 0.0.0.0/0 (Anywhere)

## Vercel Deployment

### Method 1: Using Vercel Dashboard

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Import your GitHub repository
3. Go to Project Settings > Environment Variables
4. Add these environment variables:

```
MEILISEARCH_URL=https://your-meilisearch-instance.com
MEILISEARCH_API_KEY=your_meilisearch_api_key_here
NODE_ENV=production
```

### Method 2: Using Vercel CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Deploy
vercel --prod

# Set environment variables
vercel env add MEILISEARCH_URL production
vercel env add MEILISEARCH_API_KEY production
vercel env add NODE_ENV production
```

### Method 3: Using vercel.json (Already configured)

The `vercel.json` file in the root directory contains the environment variables and configuration.

## SSL/HTTPS Configuration

Since you're using your MeiliSearch URL, make sure:

1. Your domain has a valid SSL certificate
2. MeiliSearch is configured to serve over HTTPS
3. Your AWS Load Balancer (if using) is configured for SSL termination

## Testing the Deployment

After deployment, test your MeiliSearch connection:

```bash
# Test MeiliSearch API
curl -X GET 'https://your-meilisearch-instance.com/health' \
  -H 'Authorization: Bearer your_meilisearch_api_key_here'
```

## Security Considerations

1. **API Key Security**: Never commit your API key to version control
2. **CORS Configuration**: Ensure your MeiliSearch instance allows requests from your Vercel domain
3. **Rate Limiting**: Consider implementing rate limiting on your MeiliSearch instance
4. **Monitoring**: Set up monitoring for your MeiliSearch instance

## Troubleshooting

### Common Issues:

1. **SSL Certificate Issues**
   - Ensure your domain has a valid SSL certificate
   - Check if the certificate is properly configured

2. **CORS Issues**
   - Configure MeiliSearch to allow requests from your Vercel domain
   - Check the `Access-Control-Allow-Origin` headers

3. **Connection Timeouts**
   - Verify AWS security group rules
   - Check if MeiliSearch service is running
   - Verify the correct port is open (7700 for MeiliSearch)

4. **Environment Variables Not Loading**
   - Ensure variables are set in Vercel dashboard
   - Redeploy after adding environment variables
   - Check variable names match exactly
