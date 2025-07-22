"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SimpleLayout } from "@/components/layout/simple-layout";
import { signUp, signIn, resendVerificationEmail } from "@/lib/supabase";
import { AlertCircle, CheckCircle, Mail, Info } from "lucide-react";

export default function TestEmailVerificationPage() {
  const [email, setEmail] = useState("test.unverified@example.com");
  const [password, setPassword] = useState("password123");
  const [fullName, setFullName] = useState("Test User");
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const testSignUp = async () => {
    setLoading(true);
    try {
      const result = await signUp({ email, password, fullName });
      setResult({ type: 'signup', ...result });
    } catch (error) {
      setResult({ 
        type: 'signup', 
        error: error instanceof Error ? error.message : 'Unknown error' 
      });
    } finally {
      setLoading(false);
    }
  };

  const testSignInUnverified = async () => {
    setLoading(true);
    try {
      const result = await signIn(email, password);
      setResult({ type: 'signin-unverified', ...result });
    } catch (error) {
      setResult({ 
        type: 'signin-unverified', 
        error: error instanceof Error ? error.message : 'Unknown error' 
      });
    } finally {
      setLoading(false);
    }
  };

  const testResendVerification = async () => {
    setLoading(true);
    try {
      const result = await resendVerificationEmail(email);
      setResult({ type: 'resend-verification', ...result });
    } catch (error) {
      setResult({ 
        type: 'resend-verification', 
        error: error instanceof Error ? error.message : 'Unknown error' 
      });
    } finally {
      setLoading(false);
    }
  };

  const clearResult = () => {
    setResult(null);
  };

  return (
    <SimpleLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto space-y-6">
          <div>
            <h1 className="text-3xl font-bold">Email Verification Flow Test</h1>
            <p className="text-muted-foreground">
              Test the improved email verification and unverified account handling
            </p>
          </div>

          {/* Test Credentials */}
          <Card>
            <CardHeader>
              <CardTitle>Test Credentials</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="fullName">Full Name</Label>
                <Input
                  id="fullName"
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                />
              </div>
              
              <div className="text-xs text-muted-foreground space-y-1">
                <p><strong>Demo Mode Behavior:</strong></p>
                <p>• Emails with "unverified" will simulate unverified accounts</p>
                <p>• Other emails will work normally</p>
                <p>• All verification emails are simulated</p>
              </div>
            </CardContent>
          </Card>

          {/* Test Scenarios */}
          <Card>
            <CardHeader>
              <CardTitle>Test Scenarios</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid gap-2">
                  <h4 className="font-medium text-sm">1. Test Signup Flow</h4>
                  <Button 
                    onClick={testSignUp} 
                    disabled={loading}
                    variant="outline"
                    className="justify-start"
                  >
                    <Mail className="w-4 h-4 mr-2" />
                    Sign Up (Creates unverified account)
                  </Button>
                </div>

                <div className="grid gap-2">
                  <h4 className="font-medium text-sm">2. Test Login with Unverified Email</h4>
                  <Button 
                    onClick={testSignInUnverified} 
                    disabled={loading}
                    variant="outline"
                    className="justify-start"
                  >
                    <AlertCircle className="w-4 h-4 mr-2" />
                    Sign In (Should show verification error)
                  </Button>
                </div>

                <div className="grid gap-2">
                  <h4 className="font-medium text-sm">3. Test Resend Verification</h4>
                  <Button 
                    onClick={testResendVerification} 
                    disabled={loading}
                    variant="outline"
                    className="justify-start"
                  >
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Resend Verification Email
                  </Button>
                </div>

                <Button 
                  onClick={clearResult} 
                  disabled={loading}
                  variant="ghost"
                  size="sm"
                >
                  Clear Results
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Results */}
          {result && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  {result.error ? (
                    <AlertCircle className="w-5 h-5 text-red-500" />
                  ) : (
                    <CheckCircle className="w-5 h-5 text-green-500" />
                  )}
                  Test Result: {result.type}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Signup Results */}
                  {result.type === 'signup' && (
                    <div className="space-y-2">
                      {result.error ? (
                        <div className="p-3 bg-red-50 dark:bg-red-900/20 rounded-lg">
                          <p className="text-sm text-red-700 dark:text-red-300">
                            <strong>Signup Error:</strong> {result.error.message || result.error}
                          </p>
                        </div>
                      ) : (
                        <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                          <p className="text-sm text-green-700 dark:text-green-300">
                            <strong>Signup Success:</strong> Account created! Check email for verification link.
                          </p>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Signin Unverified Results */}
                  {result.type === 'signin-unverified' && (
                    <div className="space-y-2">
                      {result.error ? (
                        <div className="p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
                          <p className="text-sm text-orange-700 dark:text-orange-300">
                            <strong>Expected Behavior:</strong> {result.error.message || result.error}
                          </p>
                          <p className="text-xs text-orange-600 dark:text-orange-400 mt-2">
                            ✅ This is the correct behavior - showing verification error instead of "invalid credentials"
                          </p>
                        </div>
                      ) : (
                        <div className="p-3 bg-red-50 dark:bg-red-900/20 rounded-lg">
                          <p className="text-sm text-red-700 dark:text-red-300">
                            <strong>Unexpected:</strong> Login succeeded for unverified account
                          </p>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Resend Verification Results */}
                  {result.type === 'resend-verification' && (
                    <div className="space-y-2">
                      {result.error ? (
                        <div className="p-3 bg-red-50 dark:bg-red-900/20 rounded-lg">
                          <p className="text-sm text-red-700 dark:text-red-300">
                            <strong>Resend Error:</strong> {result.error.message || result.error}
                          </p>
                        </div>
                      ) : (
                        <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                          <p className="text-sm text-green-700 dark:text-green-300">
                            <strong>Resend Success:</strong> Verification email sent!
                          </p>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Raw Result */}
                  <details className="text-xs">
                    <summary className="cursor-pointer font-medium mb-2">
                      Raw Result Data
                    </summary>
                    <pre className="bg-muted p-3 rounded-lg overflow-auto">
                      {JSON.stringify(result, null, 2)}
                    </pre>
                  </details>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Info className="w-5 h-5 text-blue-500" />
                How the Fix Works
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm space-y-3">
              <div>
                <h4 className="font-medium">Problem:</h4>
                <p className="text-muted-foreground">
                  When users create an account but don't verify their email, attempting to login 
                  shows "Invalid credentials" instead of a helpful message about email verification.
                </p>
              </div>

              <div>
                <h4 className="font-medium">Solution:</h4>
                <ul className="list-disc list-inside text-muted-foreground space-y-1">
                  <li>Enhanced error detection in signIn function</li>
                  <li>Specific error messages for unverified emails</li>
                  <li>Resend verification email functionality</li>
                  <li>Clear user guidance and next steps</li>
                </ul>
              </div>

              <div>
                <h4 className="font-medium">User Experience:</h4>
                <ul className="list-disc list-inside text-muted-foreground space-y-1">
                  <li>Clear error message: "Email not confirmed"</li>
                  <li>Resend verification button appears automatically</li>
                  <li>Success feedback when verification email is sent</li>
                  <li>Guidance to check email and spam folder</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* Quick Links */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Links</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex gap-2 flex-wrap">
                <Button asChild variant="outline">
                  <a href="/login">Test Login Page</a>
                </Button>
                <Button asChild variant="outline">
                  <a href="/signup">Test Signup Page</a>
                </Button>
                <Button asChild variant="outline">
                  <a href="/debug">Debug Page</a>
                </Button>
                <Button asChild variant="outline">
                  <a href="/">Home</a>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </SimpleLayout>
  );
}
