"use client";

import * as React from "react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import {
  signUp,
  signIn,
  signInWithMagicLink,
  signInWithGoogle,
  resetPassword,
  resendVerificationEmail,
  isSupabaseConfigured
} from "@/lib/supabase";
import { Eye, EyeOff, ArrowLeft } from "lucide-react";
import { LogoCompact } from "@/components/ui/logo";

interface AuthFormProps {
  mode?: 'signin' | 'signup';
  onModeChange?: (mode: 'signin' | 'signup') => void;
}

type AuthMethod = 'password' | 'magic-link';
type AuthStep = 'credentials' | 'reset-password';

export default function AuthForm({ mode = 'signin', onModeChange }: AuthFormProps) {
  const router = useRouter();

  // Form state
  const [authMethod, setAuthMethod] = useState<AuthMethod>('password');
  const [authStep, setAuthStep] = useState<AuthStep>('credentials');
  const [isLogin, setIsLogin] = useState(mode === 'signin');

  // Check if we're in demo mode
  const isDemoMode = !isSupabaseConfigured();
  
  // Form data
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  
  // UI state
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showResendVerification, setShowResendVerification] = useState(false);
  const [resendingVerification, setResendingVerification] = useState(false);

  React.useEffect(() => {
    setIsLogin(mode === 'signin');
  }, [mode]);

  const resetForm = () => {
    setError("");
    setSuccess("");
    setEmail("");
    setPassword("");
    setFullName("");
    setAuthStep('credentials');
    setShowResendVerification(false);
  };

  const handleResendVerification = async () => {
    setResendingVerification(true);
    setError("");

    try {
      const { error } = await resendVerificationEmail(email);
      if (error) {
        setError(error.message);
      } else {
        setSuccess("Verification email sent! Please check your inbox and spam folder.");
        setShowResendVerification(false);
      }
    } catch (err) {
      console.error('Resend verification error:', err);
      setError("Failed to resend verification email. Please try again.");
    } finally {
      setResendingVerification(false);
    }
  };

  const handleModeToggle = () => {
    const newMode = isLogin ? 'signup' : 'signin';
    setIsLogin(!isLogin);
    onModeChange?.(newMode);
    resetForm();
  };



  const handleGoogleAuth = async () => {
    setLoading(true);
    setError("");

    try {
      const { data, error } = await signInWithGoogle();

      if (error) {
        setError(error.message);
      } else if (data?.url) {
        // Redirect to OAuth provider
        window.location.href = data.url;
      }
    } catch (err) {
      console.error('Google auth error:', err);
      if (err instanceof Error) {
        setError(`Network error: ${err.message}`);
      } else {
        setError("Network error: Unable to connect to authentication service. Please check your internet connection.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCredentialsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      if (authMethod === 'password') {
        if (isLogin) {
          const { error } = await signIn(email, password);
          if (error) {
            // Check if this is an email verification error
            const errorWithFlags = error as { __isEmailNotConfirmed?: boolean };
            if (errorWithFlags.__isEmailNotConfirmed) {
              setError(error.message);
              setShowResendVerification(true);
            } else {
              setError(error.message);
              setShowResendVerification(false);
            }
          } else {
            setSuccess("Successfully signed in!");
            router.push("/");
          }
        } else {
          const { error } = await signUp({ email, password, fullName });
          if (error) {
            setError(error.message);
          } else {
            setSuccess("Account created! Check your email to verify your account.");
          }
        }
      } else if (authMethod === 'magic-link') {
        const { error } = await signInWithMagicLink(email);
        if (error) {
          setError(error.message);
        } else {
          setSuccess("Check your email for the magic link!");
        }
      }
    } catch (err) {
      console.error('Credentials auth error:', err);
      if (err instanceof Error) {
        setError(`Network error: ${err.message}`);
      } else {
        setError("Network error: Unable to connect to authentication service. Please check your internet connection.");
      }
    } finally {
      setLoading(false);
    }
  };



  const handlePasswordReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const result = await resetPassword(email);
      if (result.error) {
        // Check if this is an OAuth user
        if (result.provider && result.provider !== 'email') {
          setError(result.error.message);
        } else {
          setError(result.error.message);
        }
      } else {
        setSuccess("Password reset email sent! Check your inbox.");
        setAuthStep('credentials');
      }
    } catch (err) {
      console.error('Password reset error:', err);
      if (err instanceof Error) {
        setError(`Network error: ${err.message}`);
      } else {
        setError("Network error: Unable to connect to authentication service. Please check your internet connection.");
      }
    } finally {
      setLoading(false);
    }
  };



  return (
    <div className="flex items-center justify-center min-h-screen">
      <Card className="w-full max-w-sm rounded-4xl px-6 py-10 pt-14">
        <CardContent>
          <div className="flex flex-col items-center space-y-8">
            {/* Thumboard Logo */}
            <div className="flex items-center justify-center">
              <LogoCompact width={120} height={36} priority />
            </div>

            {isDemoMode && (
              <div className="w-full p-3 text-sm text-blue-600 bg-blue-50 dark:bg-blue-900/20 dark:text-blue-400 rounded-lg">
                <div className="font-medium mb-1">🎭 Demo Mode Active</div>
                <div className="text-xs">
                  Supabase is not configured. Using demo authentication for testing.
                </div>
              </div>
            )}

            {error && (
              <div className="w-full p-3 text-sm text-red-600 bg-red-50 dark:bg-red-900/20 dark:text-red-400 rounded-lg">
                <div className="mb-2">{error}</div>

                {/* Email verification error - show resend option */}
                {showResendVerification && (
                  <div className="mt-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded border border-blue-200 dark:border-blue-800">
                    <p className="text-xs text-blue-700 dark:text-blue-300 mb-2">
                      <strong>Need a new verification email?</strong>
                    </p>
                    <Button
                      onClick={handleResendVerification}
                      disabled={resendingVerification}
                      size="sm"
                      variant="outline"
                      className="text-xs h-7"
                    >
                      {resendingVerification ? "Sending..." : "Resend Verification Email"}
                    </Button>
                  </div>
                )}

                {error.includes('Google login') && (
                  <div className="text-xs text-blue-600 dark:text-blue-400 mt-2 p-2 bg-blue-50 dark:bg-blue-900/20 rounded">
                    <strong>Solution:</strong> Click &ldquo;Continue with Google&rdquo; on the main login page instead.
                  </div>
                )}
                {error.includes('social login') && (
                  <div className="text-xs text-blue-600 dark:text-blue-400 mt-2 p-2 bg-blue-50 dark:bg-blue-900/20 rounded">
                    <strong>Solution:</strong> Use the social login button you originally signed up with.
                  </div>
                )}
                {error.includes('Network error') && (
                  <div className="text-xs text-red-500 dark:text-red-300">
                    <a href="/debug" className="underline hover:no-underline">
                      Visit debug page for troubleshooting →
                    </a>
                  </div>
                )}
              </div>
            )}

            {success && (
              <div className="w-full p-3 text-sm text-green-600 bg-green-50 dark:bg-green-900/20 dark:text-green-400 rounded-lg">
                {success}
              </div>
            )}



            {authStep === 'credentials' && (
              <div className="w-full space-y-4">
                <div className="text-center space-y-2">
                  <h1 className="text-3xl font-semibold text-foreground">
                    {isLogin ? "Welcome back!" : "Create your account"}
                  </h1>
                  <p className="text-muted-foreground text-sm">
                    {isLogin ? (
                      <>
                        First time here?{" "}
                        <button
                          onClick={handleModeToggle}
                          className="text-foreground hover:underline"
                        >
                          Sign up for free
                        </button>
                      </>
                    ) : (
                      <>
                        Already have an account?{" "}
                        <button
                          onClick={handleModeToggle}
                          className="text-foreground hover:underline"
                        >
                          Sign in
                        </button>
                      </>
                    )}
                  </p>
                </div>

                <form onSubmit={handleCredentialsSubmit} className="space-y-4">
                  {!isLogin && authMethod === 'password' && (
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name</Label>
                      <Input
                        id="name"
                        type="text"
                        placeholder="Your full name"
                        className="w-full rounded-xl"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        required
                      />
                    </div>
                  )}

                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="Your email"
                      className="w-full rounded-xl"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>

                  {authMethod === 'password' && (
                    <div className="space-y-2">
                      <Label htmlFor="password">Password</Label>
                      <div className="relative">
                        <Input
                          id="password"
                          type={showPassword ? "text" : "password"}
                          placeholder="Your password"
                          className="w-full rounded-xl pr-10"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          required
                          minLength={6}
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                    </div>
                  )}

                  <Button
                    type="submit"
                    className="w-full rounded-xl"
                    size="lg"
                    disabled={loading}
                  >
                    {loading ? "Loading..." :
                     authMethod === 'password' ? (isLogin ? "Sign In" : "Sign Up") :
                     "Send Magic Link"}
                  </Button>

                  {isLogin && authMethod === 'password' && (
                    <div className="text-center">
                      <Button
                        type="button"
                        variant="link"
                        className="text-sm text-muted-foreground"
                        onClick={() => setAuthStep('reset-password')}
                      >
                        Forgot password?
                      </Button>
                    </div>
                  )}

                  {authMethod === 'password' && (
                    <div className="text-center">
                      <Button
                        type="button"
                        variant="link"
                        className="text-sm text-muted-foreground"
                        onClick={() => setAuthMethod('magic-link')}
                      >
                        Send me a magic link instead
                      </Button>
                    </div>
                  )}

                  {authMethod === 'magic-link' && (
                    <div className="text-center">
                      <Button
                        type="button"
                        variant="link"
                        className="text-sm text-muted-foreground"
                        onClick={() => setAuthMethod('password')}
                      >
                        Sign in with password instead
                      </Button>
                    </div>
                  )}
                </form>
              </div>
            )}



            {authStep === 'reset-password' && (
              <div className="w-full space-y-4">
                <div className="flex items-center space-x-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setAuthStep('credentials')}
                  >
                    <ArrowLeft className="h-4 w-4" />
                  </Button>
                  <h2 className="text-xl font-semibold">Reset your password</h2>
                </div>

                <div className="space-y-3">
                  <p className="text-sm text-muted-foreground">
                    Enter your email address and we&apos;ll send you a link to reset your password.
                  </p>

                  <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                    <p className="text-xs text-blue-700 dark:text-blue-300">
                      <strong>Note:</strong> If you signed up using Google or another social provider,
                      you don&apos;t have a password to reset. Please sign in using your social account instead.
                    </p>
                  </div>
                </div>

                <form onSubmit={handlePasswordReset} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="reset-email">Email</Label>
                    <Input
                      id="reset-email"
                      type="email"
                      placeholder="Your email"
                      className="w-full rounded-xl"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>

                  <Button
                    type="submit"
                    className="w-full rounded-xl"
                    size="lg"
                    disabled={loading}
                  >
                    {loading ? "Sending..." : "Send Reset Link"}
                  </Button>
                </form>

                <div className="mt-4 pt-4 border-t">
                  <p className="text-xs text-muted-foreground mb-3 text-center">
                    Or sign in with your social account:
                  </p>
                  <Button
                    onClick={handleGoogleAuth}
                    variant="outline"
                    className="w-full rounded-xl"
                    size="lg"
                    disabled={loading}
                  >
                    Continue with Google
                  </Button>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
