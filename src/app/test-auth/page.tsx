"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SimpleLayout } from "@/components/layout/simple-layout";
import { testSupabaseConnection, signUp, signIn } from "@/lib/supabase";

export default function TestAuthPage() {
  const [email, setEmail] = useState("test@example.com");
  const [password, setPassword] = useState("password123");
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const testConnection = async () => {
    setLoading(true);
    try {
      const result = await testSupabaseConnection();
      setResult({ type: 'connection', ...result });
    } catch (error) {
      setResult({ 
        type: 'connection', 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      });
    } finally {
      setLoading(false);
    }
  };

  const testSignUp = async () => {
    setLoading(true);
    try {
      const result = await signUp({ email, password, fullName: "Test User" });
      setResult({ type: 'signup', ...result });
    } catch (error) {
      setResult({ 
        type: 'signup', 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      });
    } finally {
      setLoading(false);
    }
  };

  const testSignIn = async () => {
    setLoading(true);
    try {
      const result = await signIn(email, password);
      setResult({ type: 'signin', ...result });
    } catch (error) {
      setResult({ 
        type: 'signin', 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <SimpleLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto space-y-6">
          <div>
            <h1 className="text-3xl font-bold">Authentication Test</h1>
            <p className="text-muted-foreground">
              Test Supabase authentication functions directly
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
            </CardContent>
          </Card>

          {/* Test Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Test Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex gap-2 flex-wrap">
                <Button onClick={testConnection} disabled={loading}>
                  Test Connection
                </Button>
                <Button onClick={testSignUp} disabled={loading} variant="outline">
                  Test Sign Up
                </Button>
                <Button onClick={testSignIn} disabled={loading} variant="outline">
                  Test Sign In
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Results */}
          {result && (
            <Card>
              <CardHeader>
                <CardTitle>
                  Result: {result.type} - {result.success || !result.error ? 'Success' : 'Failed'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-muted p-4 rounded-lg">
                  <pre className="text-sm whitespace-pre-wrap">
                    {JSON.stringify(result, null, 2)}
                  </pre>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Quick Links */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Links</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex gap-2 flex-wrap">
                <Button asChild variant="outline">
                  <a href="/debug">Debug Page</a>
                </Button>
                <Button asChild variant="outline">
                  <a href="/login">Login Page</a>
                </Button>
                <Button asChild variant="outline">
                  <a href="/">Home</a>
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Instructions */}
          <Card>
            <CardHeader>
              <CardTitle>Instructions</CardTitle>
            </CardHeader>
            <CardContent className="text-sm space-y-2">
              <p>1. First, test the connection to ensure Supabase is reachable</p>
              <p>2. Try signing up with a test email (use a real email if you want to receive verification)</p>
              <p>3. Check the browser console for detailed error messages</p>
              <p>4. If connection fails, check the debug page for troubleshooting</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </SimpleLayout>
  );
}
