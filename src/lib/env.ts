/**
 * Environment utilities for the application
 */

/**
 * Check if the application is running in development mode
 */
export const isDevelopment = () => {
  return process.env.NODE_ENV === 'development'
}

/**
 * Check if the application is running in production mode
 */
export const isProduction = () => {
  return process.env.NODE_ENV === 'production'
}

/**
 * Check if test pages should be visible
 * Test pages are only visible in development mode
 */
export const shouldShowTestPages = () => {
  return isDevelopment()
}

/**
 * Get the current environment
 */
export const getEnvironment = () => {
  return process.env.NODE_ENV || 'development'
}
