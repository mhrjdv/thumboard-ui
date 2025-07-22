"use client"

import { useEffect, useState, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ArrowRight } from 'lucide-react'
import { LogoCompact } from '@/components/ui/logo'

function AuthCallbackContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [emailConfirmed, setEmailConfirmed] = useState(false)
  const [inviteAccepted, setInviteAccepted] = useState(false)
  const [countdown, setCountdown] = useState(5)

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        // Check URL parameters to determine the type of callback
        const type = searchParams.get('type')
        const accessToken = searchParams.get('access_token')
        const refreshToken = searchParams.get('refresh_token')
        const inviteToken = searchParams.get('invite_token')

        // Handle invitation callback
        if (type === 'invite' || inviteToken) {
          // This is an invitation callback

          // In demo mode or when we have demo tokens, simulate successful invitation
          if (inviteToken === 'demo_invite_token' || accessToken === 'demo_access_token') {
            // Demo mode - simulate successful invitation acceptance
            setInviteAccepted(true)
            setLoading(false)

            // Start countdown timer
            const timer = setInterval(() => {
              setCountdown((prev) => {
                if (prev <= 1) {
                  clearInterval(timer)
                  // Use setTimeout to avoid state update during render
                  setTimeout(() => {
                    const redirectTo = searchParams.get('redirectTo') || '/dashboard'
                    router.push(redirectTo)
                  }, 0)
                  return 0
                }
                return prev - 1
              })
            }, 1000)

            return () => clearInterval(timer)
          } else {
            // Real Supabase invitation
            const { data, error } = await supabase.auth.getSession()

            if (error) {
              console.error('Error during invitation acceptance:', error)
              setError(error.message)
              setTimeout(() => {
                router.push('/login?error=invitation_error')
              }, 3000)
              return
            }

            if (data.session) {
              // Invitation accepted successfully
              setInviteAccepted(true)
              setLoading(false)

              // Start countdown timer
              const timer = setInterval(() => {
                setCountdown((prev) => {
                  if (prev <= 1) {
                    clearInterval(timer)
                    // Use setTimeout to avoid state update during render
                    setTimeout(() => {
                      const redirectTo = searchParams.get('redirectTo') || '/dashboard'
                      router.push(redirectTo)
                    }, 0)
                    return 0
                  }
                  return prev - 1
                })
              }, 1000)

              return () => clearInterval(timer)
            } else {
              // No session after invitation attempt
              setError('Invitation acceptance failed')
              setTimeout(() => {
                router.push('/login?error=invitation_failed')
              }, 3000)
            }
          }
        }
        // Handle email confirmation callback
        else if (type === 'signup' || (accessToken && refreshToken)) {
          // This is likely an email confirmation callback

          // In demo mode or when we have demo tokens, simulate successful confirmation
          if (accessToken === 'demo_access_token' || refreshToken === 'demo_refresh_token') {
            // Demo mode - simulate successful email confirmation
            setEmailConfirmed(true)
            setLoading(false)

            // Start countdown timer
            const timer = setInterval(() => {
              setCountdown((prev) => {
                if (prev <= 1) {
                  clearInterval(timer)
                  // Use setTimeout to avoid state update during render
                  setTimeout(() => {
                    const redirectTo = searchParams.get('redirectTo') || '/'
                    router.push(redirectTo)
                  }, 0)
                  return 0
                }
                return prev - 1
              })
            }, 1000)

            return () => clearInterval(timer)
          } else {
            // Real Supabase confirmation
            const { data, error } = await supabase.auth.getSession()

            if (error) {
              console.error('Error during email confirmation:', error)
              setError(error.message)
              setTimeout(() => {
                router.push('/login?error=email_confirmation_error')
              }, 3000)
              return
            }

            if (data.session) {
              // Email confirmed successfully
              setEmailConfirmed(true)
              setLoading(false)

              // Start countdown timer
              const timer = setInterval(() => {
                setCountdown((prev) => {
                  if (prev <= 1) {
                    clearInterval(timer)
                    // Use setTimeout to avoid state update during render
                    setTimeout(() => {
                      const redirectTo = searchParams.get('redirectTo') || '/'
                      router.push(redirectTo)
                    }, 0)
                    return 0
                  }
                  return prev - 1
                })
              }, 1000)

              return () => clearInterval(timer)
            } else {
              // No session after confirmation attempt
              setError('Email confirmation failed')
              setTimeout(() => {
                router.push('/login?error=confirmation_failed')
              }, 3000)
            }
          }
        } else {
          // Handle regular OAuth callback
          const { data, error } = await supabase.auth.getSession()

          if (error) {
            console.error('Error during auth callback:', error)
            setError(error.message)
            setTimeout(() => {
              router.push('/login?error=auth_callback_error')
            }, 3000)
            return
          }

          if (data.session) {
            // User is authenticated, redirect immediately for OAuth
            const redirectTo = searchParams.get('redirectTo') || '/'
            router.push(redirectTo)
          } else {
            // No session, redirect to login
            router.push('/login')
          }
        }
      } catch (err) {
        console.error('Unexpected error during auth callback:', err)
        setError('An unexpected error occurred')
        setTimeout(() => {
          router.push('/login?error=unexpected_error')
        }, 3000)
      } finally {
        if (!emailConfirmed) {
          setLoading(false)
        }
      }
    }

    handleAuthCallback()
  }, [router, searchParams, emailConfirmed, inviteAccepted])

  // Invitation acceptance success page
  if (inviteAccepted) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Card className="w-full max-w-sm rounded-4xl px-6 py-10">
          <CardContent>
            <div className="flex flex-col items-center space-y-6">
              <div className="flex items-center justify-center">
                <LogoCompact width={120} height={36} priority />
              </div>

              <div className="text-center space-y-2">
                <h1 className="text-xl font-semibold">Invitation Accepted!</h1>
                <p className="text-muted-foreground text-sm">
                  Welcome to Thumboard! Your account has been activated.
                </p>
              </div>

              <div className="w-full space-y-4">
                <div className="text-center p-4 bg-muted rounded-lg">
                  <p className="text-sm text-muted-foreground mb-2">
                    Redirecting to dashboard in:
                  </p>
                  <div className="text-2xl font-bold">
                    {countdown}s
                  </div>
                </div>

                <Button
                  onClick={() => router.push('/dashboard')}
                  className="w-full rounded-xl"
                  size="lg"
                >
                  Go to Dashboard Now
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>

              <div className="text-xs text-muted-foreground text-center">
                You can now access all features of your account.
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Email confirmation success page
  if (emailConfirmed) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Card className="w-full max-w-sm rounded-4xl px-6 py-10">
          <CardContent>
            <div className="flex flex-col items-center space-y-6">
              <div className="flex items-center justify-center">
                <LogoCompact width={120} height={36} priority />
              </div>

              <div className="text-center space-y-2">
                <h1 className="text-xl font-semibold">Email Confirmed!</h1>
                <p className="text-muted-foreground text-sm">
                  Your email has been successfully verified. Welcome to Thumboard!
                </p>
              </div>

              <div className="w-full space-y-4">
                <div className="text-center p-4 bg-muted rounded-lg">
                  <p className="text-sm text-muted-foreground mb-2">
                    Redirecting to home page in:
                  </p>
                  <div className="text-2xl font-bold">
                    {countdown}s
                  </div>
                </div>

                <Button
                  onClick={() => router.push('/')}
                  className="w-full rounded-xl"
                  size="lg"
                >
                  Go to Home Now
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>

              <div className="text-xs text-muted-foreground text-center">
                You can now access all features of your account.
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Card className="w-full max-w-sm rounded-4xl px-6 py-10">
          <CardContent>
            <div className="flex flex-col items-center space-y-4">
              <div className="flex items-center justify-center">
                <LogoCompact width={120} height={36} priority />
              </div>
              <div className="text-center">
                <h2 className="text-xl font-semibold">Completing sign in...</h2>
                <p className="text-muted-foreground text-sm mt-2">
                  Please wait while we complete your authentication.
                </p>
              </div>
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-primary rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Card className="w-full max-w-sm rounded-4xl px-6 py-10">
          <CardContent>
            <div className="flex flex-col items-center space-y-4">
              <div className="flex items-center justify-center">
                <LogoCompact width={120} height={36} priority />
              </div>
              <div className="text-center">
                <h2 className="text-xl font-semibold text-red-600">Authentication Error</h2>
                <p className="text-muted-foreground text-sm mt-2">
                  {error}
                </p>
                <p className="text-muted-foreground text-xs mt-2">
                  Redirecting to login page...
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return null
}

export default function AuthCallback() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-screen">
        <Card className="w-full max-w-sm rounded-4xl px-6 py-10">
          <CardContent>
            <div className="flex flex-col items-center space-y-6">
              <LogoCompact width={120} height={36} priority />
              <div className="text-center">
                <p className="text-muted-foreground">Processing authentication...</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    }>
      <AuthCallbackContent />
    </Suspense>
  );
}