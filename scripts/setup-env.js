#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🔧 Setting up environment variables for Thumboard UI...\n');

const envPath = path.join(process.cwd(), '.env');
const envProductionPath = path.join(process.cwd(), '.env.production');
const envExamplePath = path.join(process.cwd(), '.env.example');

// Check if .env already exists
if (fs.existsSync(envPath)) {
  console.log('⚠️  .env already exists. Skipping setup.');
  console.log('   If you need to update your environment variables, edit .env manually.\n');
  process.exit(0);
}

// Create .env.example if it doesn't exist
const envExampleContent = `# =============================================================================
# THUMBOARD UI - Environment Configuration Template
# =============================================================================
# Copy this file to .env and .env.production, then replace with your actual values

# =============================================================================
# MEILISEARCH CONFIGURATION (REQUIRED)
# =============================================================================
MEILISEARCH_URL=https://your-meilisearch-instance.com
MEILISEARCH_API_KEY=your_meilisearch_api_key_here

# =============================================================================
# NODE ENVIRONMENT
# =============================================================================
NODE_ENV=development
`;

if (!fs.existsSync(envExamplePath)) {
  fs.writeFileSync(envExamplePath, envExampleContent);
  console.log('✅ Created .env.example file');
}

// Create .env
const envContent = `# =============================================================================
# THUMBOARD UI - Development Environment Configuration
# =============================================================================
# This file contains environment variables for the application
# DO NOT commit this file to version control

# =============================================================================
# MEILISEARCH CONFIGURATION (REQUIRED)
# =============================================================================
MEILISEARCH_URL=https://your-meilisearch-instance.com
MEILISEARCH_API_KEY=your_meilisearch_api_key_here

# =============================================================================
# NODE ENVIRONMENT
# =============================================================================
NODE_ENV=development
`;

fs.writeFileSync(envPath, envContent);
console.log('✅ Created .env file');

// Create .env.production if it doesn't exist
if (!fs.existsSync(envProductionPath)) {
  const envProductionContent = `# =============================================================================
# THUMBOARD UI - Production Environment Configuration
# =============================================================================
# This file contains production environment variables
# DO NOT commit this file to version control

# =============================================================================
# MEILISEARCH CONFIGURATION (REQUIRED)
# =============================================================================
MEILISEARCH_URL=https://your-production-meilisearch-instance.com
MEILISEARCH_API_KEY=your_production_meilisearch_api_key_here

# =============================================================================
# NODE ENVIRONMENT
# =============================================================================
NODE_ENV=production
`;
  
  fs.writeFileSync(envProductionPath, envProductionContent);
  console.log('✅ Created .env.production file');
}

console.log('\n📝 Next steps:');
console.log('1. Edit .env and replace the placeholder values with your actual credentials');
console.log('2. Edit .env.production with your production credentials');
console.log('3. Make sure to never commit .env or .env.production to version control');
console.log('4. For production deployment, set these environment variables in your hosting platform\n');

console.log('🔒 Security reminder:');
console.log('- Never commit API keys or secrets to version control');
console.log('- Use different API keys for development and production');
console.log('- Regularly rotate your API keys\n'); 