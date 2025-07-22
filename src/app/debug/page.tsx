"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SimpleLayout } from "@/components/layout/simple-layout";
import { testSupabaseConnection, isSupabaseConfigured } from "@/lib/supabase";
import { CheckCircle, XCircle, AlertCircle, RefreshCw } from "lucide-react";

export default function DebugPage() {
  const [connectionTest, setConnectionTest] = useState<any>(null);
  const [testing, setTesting] = useState(false);
  const [browserInfo, setBrowserInfo] = useState<any>(null);

  const runConnectionTest = async () => {
    setTesting(true);
    try {
      const result = await testSupabaseConnection();
      setConnectionTest(result);
    } catch (error) {
      setConnectionTest({
        success: false,
        error: `Unexpected error: ${error instanceof Error ? error.message : 'Unknown error'}`
      });
    } finally {
      setTesting(false);
    }
  };

  useEffect(() => {
    runConnectionTest();

    // Set browser info on client side only
    if (typeof window !== 'undefined') {
      setBrowserInfo({
        userAgent: navigator.userAgent,
        url: window.location.href,
        origin: window.location.origin,
        online: navigator.onLine
      });
    }
  }, []);

  const envVars = {
    'NEXT_PUBLIC_SUPABASE_URL': process.env.NEXT_PUBLIC_SUPABASE_URL || 'Not set',
    'NEXT_PUBLIC_SUPABASE_ANON_KEY': process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? 
      `${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY.substring(0, 20)}...` : 'Not set',
    'NEXT_PUBLIC_APP_URL': process.env.NEXT_PUBLIC_APP_URL || 'Not set',
  };

  return (
    <SimpleLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-6">
          <div>
            <h1 className="text-3xl font-bold">Debug Information</h1>
            <p className="text-muted-foreground">
              Diagnostic information for troubleshooting authentication issues
            </p>
          </div>

          {/* Configuration Status */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertCircle className="w-5 h-5" />
                Configuration Status
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  {isSupabaseConfigured() ? (
                    <CheckCircle className="w-5 h-5 text-green-600" />
                  ) : (
                    <XCircle className="w-5 h-5 text-red-600" />
                  )}
                  <span className="font-medium">
                    Supabase Configuration: {isSupabaseConfigured() ? 'Valid' : 'Invalid'}
                  </span>
                </div>

                <div className="space-y-2">
                  <h4 className="font-medium">Environment Variables:</h4>
                  <div className="bg-muted p-3 rounded-lg space-y-1 text-sm font-mono">
                    {Object.entries(envVars).map(([key, value]) => (
                      <div key={key} className="flex justify-between">
                        <span className="text-muted-foreground">{key}:</span>
                        <span className={value === 'Not set' ? 'text-red-600' : 'text-green-600'}>
                          {value}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Connection Test */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <RefreshCw className="w-5 h-5" />
                Connection Test
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Button 
                  onClick={runConnectionTest} 
                  disabled={testing}
                  className="flex items-center gap-2"
                >
                  <RefreshCw className={`w-4 h-4 ${testing ? 'animate-spin' : ''}`} />
                  {testing ? 'Testing...' : 'Test Connection'}
                </Button>

                {connectionTest && (
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      {connectionTest.success ? (
                        <CheckCircle className="w-5 h-5 text-green-600" />
                      ) : (
                        <XCircle className="w-5 h-5 text-red-600" />
                      )}
                      <span className="font-medium">
                        Connection: {connectionTest.success ? 'Success' : 'Failed'}
                      </span>
                    </div>

                    <div className="bg-muted p-3 rounded-lg">
                      <pre className="text-sm whitespace-pre-wrap">
                        {connectionTest.success ? (
                          <>
                            {connectionTest.message}
                            {connectionTest.hasSession !== undefined && (
                              `\nActive Session: ${connectionTest.hasSession ? 'Yes' : 'No'}`
                            )}
                          </>
                        ) : (
                          connectionTest.error
                        )}
                      </pre>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Browser Information */}
          <Card>
            <CardHeader>
              <CardTitle>Browser Information</CardTitle>
            </CardHeader>
            <CardContent>
              {browserInfo ? (
                <div className="bg-muted p-3 rounded-lg space-y-1 text-sm font-mono">
                  <div>User Agent: {browserInfo.userAgent}</div>
                  <div>URL: {browserInfo.url}</div>
                  <div>Origin: {browserInfo.origin}</div>
                  <div>Online: {browserInfo.online ? 'Yes' : 'No'}</div>
                </div>
              ) : (
                <div className="bg-muted p-3 rounded-lg text-sm text-muted-foreground">
                  Loading browser information...
                </div>
              )}
            </CardContent>
          </Card>

          {/* Troubleshooting Tips */}
          <Card>
            <CardHeader>
              <CardTitle>Troubleshooting Tips</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 text-sm">
                <div>
                  <h4 className="font-medium">If connection fails:</h4>
                  <ul className="list-disc list-inside space-y-1 text-muted-foreground ml-2">
                    <li>Check your internet connection</li>
                    <li>Verify Supabase project is active and not paused</li>
                    <li>Ensure environment variables are correctly set</li>
                    <li>Check browser console for detailed error messages</li>
                    <li>Try accessing your Supabase dashboard directly</li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-medium">Common issues:</h4>
                  <ul className="list-disc list-inside space-y-1 text-muted-foreground ml-2">
                    <li>CORS errors: Check allowed origins in Supabase settings</li>
                    <li>Invalid credentials: Verify URL and anon key</li>
                    <li>Network timeouts: Check firewall/proxy settings</li>
                    <li>Project paused: Reactivate in Supabase dashboard</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex gap-2 flex-wrap">
                <Button asChild variant="outline">
                  <a href="https://supabase.com/dashboard" target="_blank" rel="noopener noreferrer">
                    Open Supabase Dashboard
                  </a>
                </Button>
                <Button asChild variant="outline">
                  <a href="/login">
                    Test Login Page
                  </a>
                </Button>
                <Button asChild variant="outline">
                  <a href="/">
                    Back to Home
                  </a>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </SimpleLayout>
  );
}
