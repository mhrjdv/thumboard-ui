"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SimpleLayout } from "@/components/layout/simple-layout";
import { resetPassword, checkUserProvider } from "@/lib/supabase";
import { AlertCircle, CheckCircle, Info } from "lucide-react";

export default function TestOAuthResetPage() {
  const [email, setEmail] = useState("");
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const testProviderCheck = async () => {
    if (!email) {
      setResult({ error: "Please enter an email address" });
      return;
    }

    setLoading(true);
    try {
      const result = await checkUserProvider(email);
      setResult({ type: 'provider-check', ...result });
    } catch (error) {
      setResult({ 
        type: 'provider-check', 
        error: error instanceof Error ? error.message : 'Unknown error' 
      });
    } finally {
      setLoading(false);
    }
  };

  const testPasswordReset = async () => {
    if (!email) {
      setResult({ error: "Please enter an email address" });
      return;
    }

    setLoading(true);
    try {
      const result = await resetPassword(email);
      setResult({ type: 'password-reset', ...result });
    } catch (error) {
      setResult({ 
        type: 'password-reset', 
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
            <h1 className="text-3xl font-bold">OAuth Password Reset Test</h1>
            <p className="text-muted-foreground">
              Test how the system handles password reset for OAuth users
            </p>
          </div>

          {/* Test Email Input */}
          <Card>
            <CardHeader>
              <CardTitle>Test Email</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter email to test"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              
              <div className="text-xs text-muted-foreground space-y-1">
                <p><strong>Test scenarios:</strong></p>
                <p>• Gmail addresses (e.g., user@gmail.com) - Simulated as Google OAuth users</p>
                <p>• Other addresses (e.g., user@example.com) - Simulated as email/password users</p>
              </div>
            </CardContent>
          </Card>

          {/* Test Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Test Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex gap-2 flex-wrap">
                <Button 
                  onClick={testProviderCheck} 
                  disabled={loading || !email}
                  variant="outline"
                >
                  Check Provider
                </Button>
                <Button 
                  onClick={testPasswordReset} 
                  disabled={loading || !email}
                >
                  Test Password Reset
                </Button>
                <Button 
                  onClick={clearResult} 
                  disabled={loading}
                  variant="ghost"
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
                  Test Result: {result.type || 'General'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Provider Check Results */}
                  {result.type === 'provider-check' && (
                    <div className="space-y-2">
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="font-medium">Success:</span>
                          <span className={`ml-2 ${result.success ? 'text-green-600' : 'text-red-600'}`}>
                            {result.success ? 'Yes' : 'No'}
                          </span>
                        </div>
                        <div>
                          <span className="font-medium">Provider:</span>
                          <span className="ml-2 capitalize">
                            {result.provider || 'Unknown'}
                          </span>
                        </div>
                        <div>
                          <span className="font-medium">Has Password:</span>
                          <span className={`ml-2 ${result.hasPassword ? 'text-green-600' : 'text-orange-600'}`}>
                            {result.hasPassword ? 'Yes' : 'No'}
                          </span>
                        </div>
                      </div>
                      
                      {!result.hasPassword && (
                        <div className="p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
                          <p className="text-sm text-orange-700 dark:text-orange-300">
                            <strong>OAuth User Detected:</strong> This user signed up with {result.provider} 
                            and doesn't have a password to reset.
                          </p>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Password Reset Results */}
                  {result.type === 'password-reset' && (
                    <div className="space-y-2">
                      {result.error ? (
                        <div className="p-3 bg-red-50 dark:bg-red-900/20 rounded-lg">
                          <p className="text-sm text-red-700 dark:text-red-300">
                            <strong>Error:</strong> {result.error.message || result.error}
                          </p>
                          {result.provider && result.provider !== 'email' && (
                            <p className="text-xs text-blue-700 dark:text-blue-300 mt-2">
                              <strong>Solution:</strong> User should sign in with their {result.provider} account instead.
                            </p>
                          )}
                        </div>
                      ) : (
                        <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                          <p className="text-sm text-green-700 dark:text-green-300">
                            <strong>Success:</strong> Password reset email would be sent to {email}
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
                How It Works
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm space-y-3">
              <div>
                <h4 className="font-medium">Problem:</h4>
                <p className="text-muted-foreground">
                  Users who sign up with Google OAuth don't have a password in the system. 
                  When they try to use "Forgot Password", they won't receive a reset email because 
                  there's no password to reset.
                </p>
              </div>

              <div>
                <h4 className="font-medium">Solution:</h4>
                <ul className="list-disc list-inside text-muted-foreground space-y-1">
                  <li>Check user's authentication provider before attempting password reset</li>
                  <li>Show appropriate error message for OAuth users</li>
                  <li>Provide "Sign in with Google" button as alternative</li>
                  <li>Guide users to use their original sign-up method</li>
                </ul>
              </div>

              <div>
                <h4 className="font-medium">Implementation:</h4>
                <ul className="list-disc list-inside text-muted-foreground space-y-1">
                  <li>Enhanced password reset function checks provider first</li>
                  <li>Improved error messages with actionable solutions</li>
                  <li>Added Google sign-in button to password reset form</li>
                  <li>Clear user guidance throughout the process</li>
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
