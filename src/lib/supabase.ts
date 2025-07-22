import { createClient, AuthError } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co'
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-key'

// Check if we have valid Supabase credentials
const hasValidCredentials =
  supabaseUrl !== 'https://placeholder.supabase.co' &&
  supabaseAnonKey !== 'placeholder-key' &&
  supabaseUrl.includes('.supabase.co')

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
    flowType: 'pkce'
  }
})

// Helper to check if Supabase is properly configured
export const isSupabaseConfigured = () => hasValidCredentials

// Demo mode flag - set to true to enable demo mode when Supabase is not available
const DEMO_MODE = process.env.NEXT_PUBLIC_DEMO_MODE === 'true' || !hasValidCredentials

// Demo user data for testing
const createDemoUser = (email: string, fullName?: string) => ({
  id: 'demo-user-' + Math.random().toString(36).substring(2, 11),
  email,
  email_confirmed_at: new Date().toISOString(),
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
  last_sign_in_at: new Date().toISOString(),
  user_metadata: {
    full_name: fullName || 'Demo User',
    display_name: fullName || 'Demo User',
  },
  app_metadata: {
    provider: 'email',
  }
})

// Demo session data
const createDemoSession = (user: Record<string, unknown>) => ({
  access_token: 'demo-access-token',
  refresh_token: 'demo-refresh-token',
  expires_in: 3600,
  token_type: 'bearer',
  user
})

// Test Supabase connection
export const testSupabaseConnection = async () => {
  if (!isSupabaseConfigured()) {
    return {
      success: false,
      error: 'Supabase is not configured. Please check your environment variables.'
    }
  }

  try {
    // Try to get the current session (this is a simple API call)
    const { data, error } = await supabase.auth.getSession()

    if (error) {
      return {
        success: false,
        error: `Supabase connection failed: ${error.message}`
      }
    }

    return {
      success: true,
      message: 'Supabase connection successful',
      hasSession: !!data.session
    }
  } catch (err) {
    return {
      success: false,
      error: `Network error: Unable to connect to Supabase. ${err instanceof Error ? err.message : 'Unknown error'}`
    }
  }
}

// Types for better type safety
export interface AuthResult {
  data: unknown
  error: AuthError | null
}

export interface SignUpData {
  email: string
  password: string
  fullName?: string
  phone?: string
}

// Enhanced Auth helper functions
export const signUp = async (signUpData: SignUpData): Promise<AuthResult> => {
  const { email, password, fullName } = signUpData

  // Demo mode - simulate successful signup
  if (DEMO_MODE) {
    console.log('Demo mode: Simulating signup for', email)
    await new Promise(resolve => setTimeout(resolve, 1000)) // Simulate network delay

    const user = createDemoUser(email, fullName)
    const session = createDemoSession(user)

    return {
      data: { user, session },
      error: null
    }
  }

  if (!isSupabaseConfigured()) {
    return {
      data: null,
      error: { message: 'Supabase is not configured. Please check your environment variables.' } as AuthError
    }
  }

  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
          display_name: fullName,
        },
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    })
    return { data, error }
  } catch (err) {
    console.error('Network error in signUp:', err)
    return {
      data: null,
      error: {
        message: 'Network error: Unable to connect to authentication service. Please check your internet connection and try again.'
      } as AuthError
    }
  }
}

export const signIn = async (email: string, password: string): Promise<AuthResult> => {
  // Demo mode - simulate successful signin
  if (DEMO_MODE) {
    console.log('Demo mode: Simulating signin for', email)
    await new Promise(resolve => setTimeout(resolve, 1000)) // Simulate network delay

    // Simulate password validation
    if (password.length < 6) {
      return {
        data: null,
        error: { message: 'Invalid login credentials' } as AuthError
      }
    }

    // Simulate unverified email scenario for demo
    if (email.includes('unverified')) {
      return {
        data: null,
        error: { message: 'Email not confirmed. Please check your email and click the verification link, or request a new verification email.' } as AuthError
      }
    }

    const user = createDemoUser(email)
    const session = createDemoSession(user)

    return {
      data: { user, session },
      error: null
    }
  }

  if (!isSupabaseConfigured()) {
    return {
      data: null,
      error: { message: 'Supabase is not configured. Please check your environment variables.' } as AuthError
    }
  }

  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    // Enhanced error handling for unverified emails
    if (error) {
      // Check for email not confirmed error
      if (error.message.includes('email_not_confirmed') ||
          error.message.includes('Email not confirmed') ||
          error.message.includes('signup_disabled')) {
        return {
          data: null,
          error: {
            message: 'Email not confirmed. Please check your email and click the verification link, or request a new verification email.',
            __isEmailNotConfirmed: true
          } as AuthError & { __isEmailNotConfirmed?: boolean }
        }
      }

      // Check for invalid credentials but provide more helpful message
      if (error.message.includes('Invalid login credentials')) {
        return {
          data: null,
          error: {
            message: 'Invalid email or password. Please check your credentials and try again.',
            __isInvalidCredentials: true
          } as AuthError & { __isInvalidCredentials?: boolean }
        }
      }
    }

    return { data, error }
  } catch (err) {
    console.error('Network error in signIn:', err)
    return {
      data: null,
      error: {
        message: 'Network error: Unable to connect to authentication service. Please check your internet connection and try again.'
      } as AuthError
    }
  }
}

export const signInWithMagicLink = async (email: string): Promise<AuthResult> => {
  // Demo mode - simulate magic link sent
  if (DEMO_MODE) {
    console.log('Demo mode: Simulating magic link sent to', email)
    await new Promise(resolve => setTimeout(resolve, 1000)) // Simulate network delay

    return {
      data: { user: null, session: null },
      error: null
    }
  }

  if (!isSupabaseConfigured()) {
    return {
      data: null,
      error: { message: 'Supabase is not configured. Please check your environment variables.' } as AuthError
    }
  }

  try {
    const { data, error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    })
    return { data, error }
  } catch (err) {
    console.error('Network error in signInWithMagicLink:', err)
    return {
      data: null,
      error: {
        message: 'Network error: Unable to connect to authentication service. Please check your internet connection and try again.'
      } as AuthError
    }
  }
}





// New: Google OAuth authentication
export const signInWithGoogle = async () => {
  if (!isSupabaseConfigured()) {
    return {
      data: null,
      error: { message: 'Supabase is not configured. Please check your environment variables.' } as AuthError
    }
  }

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${window.location.origin}/auth/callback`,
      queryParams: {
        access_type: 'offline',
        prompt: 'consent',
      },
    },
  })
  return { data, error }
}



// Check user's authentication provider
export const checkUserProvider = async (email: string) => {
  if (DEMO_MODE) {
    // In demo mode, simulate checking provider
    console.log('Demo mode: Checking provider for', email)
    await new Promise(resolve => setTimeout(resolve, 500))

    // Simulate that some emails are OAuth users
    const isOAuthUser = email.includes('gmail') || email.includes('google')
    return {
      success: true,
      provider: isOAuthUser ? 'google' : 'email',
      hasPassword: !isOAuthUser
    }
  }

  if (!isSupabaseConfigured()) {
    return {
      success: false,
      error: 'Supabase is not configured. Please check your environment variables.'
    }
  }

  try {
    // Try to get user information by email
    // Note: This is a workaround since Supabase doesn't have a direct API to check provider by email
    // In a real implementation, you might need to store this information in your database

    // For now, we'll attempt a password reset and check the error
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/reset-password`,
    })

    if (error) {
      // Check if error indicates OAuth user
      if (error.message.includes('signup_disabled') ||
          error.message.includes('email_not_confirmed') ||
          error.message.includes('user_not_found')) {
        return {
          success: true,
          provider: 'unknown',
          hasPassword: false,
          error: error.message
        }
      }
      return {
        success: false,
        error: error.message
      }
    }

    return {
      success: true,
      provider: 'email',
      hasPassword: true
    }
  } catch (err) {
    return {
      success: false,
      error: err instanceof Error ? err.message : 'Unknown error'
    }
  }
}

// Enhanced password reset with provider checking
export const resetPassword = async (email: string): Promise<AuthResult & { provider?: string }> => {
  // First check the user's provider
  const providerCheck = await checkUserProvider(email)

  if (!providerCheck.success) {
    return {
      data: null,
      error: { message: providerCheck.error || 'Failed to check user provider' } as AuthError
    }
  }

  // If user doesn't have a password (OAuth user), return specific error
  if (!providerCheck.hasPassword) {
    return {
      data: null,
      error: {
        message: `This email is associated with ${providerCheck.provider === 'google' ? 'Google' : 'social'} login. Please sign in using your ${providerCheck.provider === 'google' ? 'Google' : 'social'} account instead of using a password.`
      } as AuthError,
      provider: providerCheck.provider
    }
  }

  if (DEMO_MODE) {
    console.log('Demo mode: Simulating password reset for', email)
    await new Promise(resolve => setTimeout(resolve, 1000))

    return {
      data: { user: null, session: null },
      error: null,
      provider: 'email'
    }
  }

  if (!isSupabaseConfigured()) {
    return {
      data: null,
      error: { message: 'Supabase is not configured. Please check your environment variables.' } as AuthError
    }
  }

  try {
    const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/reset-password`,
    })
    return { data, error, provider: 'email' }
  } catch (err) {
    console.error('Network error in resetPassword:', err)
    return {
      data: null,
      error: {
        message: 'Network error: Unable to connect to authentication service. Please check your internet connection and try again.'
      } as AuthError
    }
  }
}

// Update password
export const updatePassword = async (newPassword: string): Promise<AuthResult> => {
  if (!isSupabaseConfigured()) {
    return {
      data: null,
      error: { message: 'Supabase is not configured. Please check your environment variables.' } as AuthError
    }
  }

  const { data, error } = await supabase.auth.updateUser({
    password: newPassword
  })
  return { data, error }
}

export const signOut = async (): Promise<{ error: AuthError | null }> => {
  const { error } = await supabase.auth.signOut()
  return { error }
}

export const getCurrentUser = async () => {
  const { data: { user }, error } = await supabase.auth.getUser()
  return { user, error }
}

export const onAuthStateChange = (callback: (event: string, session: unknown) => void) => {
  return supabase.auth.onAuthStateChange(callback)
}

// Get current session
export const getCurrentSession = async () => {
  const { data: { session }, error } = await supabase.auth.getSession()
  return { session, error }
}

// Refresh session
export const refreshSession = async () => {
  const { data, error } = await supabase.auth.refreshSession()
  return { data, error }
}

// Update user metadata
export const updateUserMetadata = async (metadata: Record<string, unknown>): Promise<AuthResult> => {
  if (!isSupabaseConfigured()) {
    return {
      data: null,
      error: { message: 'Supabase is not configured. Please check your environment variables.' } as AuthError
    }
  }

  const { data, error } = await supabase.auth.updateUser({
    data: metadata
  })
  return { data, error }
}

// Invite user to organization
export const inviteUser = async (email: string, redirectTo?: string): Promise<AuthResult> => {
  // Demo mode - simulate sending invitation
  if (DEMO_MODE) {
    console.log('Demo mode: Simulating invitation for', email)
    await new Promise(resolve => setTimeout(resolve, 1000)) // Simulate network delay

    return {
      data: { user: null, session: null },
      error: null
    }
  }

  if (!isSupabaseConfigured()) {
    return {
      data: null,
      error: { message: 'Supabase is not configured. Please check your environment variables.' } as AuthError
    }
  }

  try {
    const { data, error } = await supabase.auth.admin.inviteUserByEmail(email, {
      redirectTo: redirectTo || `${window.location.origin}/auth/callback?type=invite`,
    })
    return { data, error }
  } catch (err) {
    console.error('Network error in inviteUser:', err)
    return {
      data: null,
      error: {
        message: 'Network error: Unable to connect to authentication service. Please check your internet connection and try again.'
      } as AuthError
    }
  }
}

// Accept invitation (for invited users)
export const acceptInvitation = async (token: string, password: string): Promise<AuthResult> => {
  // Demo mode - simulate accepting invitation
  if (DEMO_MODE) {
    console.log('Demo mode: Simulating invitation acceptance with token', token)
    await new Promise(resolve => setTimeout(resolve, 1000)) // Simulate network delay

    // Simulate token validation
    if (token === 'demo_invite_token') {
      const user = createDemoUser('invited@example.com', 'Invited User')
      const session = createDemoSession(user)

      return {
        data: { user, session },
        error: null
      }
    } else {
      return {
        data: null,
        error: { message: 'Invalid or expired invitation token' } as AuthError
      }
    }
  }

  if (!isSupabaseConfigured()) {
    return {
      data: null,
      error: { message: 'Supabase is not configured. Please check your environment variables.' } as AuthError
    }
  }

  try {
    const { data, error } = await supabase.auth.verifyOtp({
      token_hash: token,
      type: 'invite',
    })

    if (error) {
      return { data, error }
    }

    // If successful and password provided, update the user's password
    if (data.session && password) {
      const { error: updateError } = await supabase.auth.updateUser({
        password: password
      })

      if (updateError) {
        return { data, error: updateError }
      }
    }

    return { data, error }
  } catch (err) {
    console.error('Network error in acceptInvitation:', err)
    return {
      data: null,
      error: {
        message: 'Network error: Unable to connect to authentication service. Please check your internet connection and try again.'
      } as AuthError
    }
  }
}

// Resend verification email
export const resendVerificationEmail = async (email: string): Promise<AuthResult> => {
  // Demo mode - simulate resending verification
  if (DEMO_MODE) {
    console.log('Demo mode: Simulating resend verification for', email)
    await new Promise(resolve => setTimeout(resolve, 1000)) // Simulate network delay

    return {
      data: { user: null, session: null },
      error: null
    }
  }

  if (!isSupabaseConfigured()) {
    return {
      data: null,
      error: { message: 'Supabase is not configured. Please check your environment variables.' } as AuthError
    }
  }

  try {
    const { data, error } = await supabase.auth.resend({
      type: 'signup',
      email: email,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      }
    })
    return { data, error }
  } catch (err) {
    console.error('Network error in resendVerificationEmail:', err)
    return {
      data: null,
      error: {
        message: 'Network error: Unable to connect to authentication service. Please check your internet connection and try again.'
      } as AuthError
    }
  }
}