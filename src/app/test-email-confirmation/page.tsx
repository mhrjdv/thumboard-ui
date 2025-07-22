"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SimpleLayout } from "@/components/layout/simple-layout";
import { Mail, ExternalLink, Info, CheckCircle } from "lucide-react";

export default function TestEmailConfirmationPage() {
  const [testUrl, setTestUrl] = useState("");

  const generateTestUrl = (scenario: string) => {
    const baseUrl = window.location.origin;
    let url = "";
    
    switch (scenario) {
      case 'email-confirmation':
        url = `${baseUrl}/auth/callback?type=signup&access_token=demo_access_token&refresh_token=demo_refresh_token`;
        break;
      case 'oauth-callback':
        url = `${baseUrl}/auth/callback?code=demo_oauth_code&state=demo_state`;
        break;
      case 'error-callback':
        url = `${baseUrl}/auth/callback?error=access_denied&error_description=User+denied+access`;
        break;
      default:
        url = `${baseUrl}/auth/callback`;
    }
    
    setTestUrl(url);
  };

  const openTestUrl = (url: string) => {
    window.open(url, '_blank');
  };

  return (
    <SimpleLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto space-y-6">
          <div>
            <h1 className="text-3xl font-bold">Email Confirmation Flow Test</h1>
            <p className="text-muted-foreground">
              Test the email confirmation callback page with countdown timer
            </p>
          </div>

          {/* Test Scenarios */}
          <Card>
            <CardHeader>
              <CardTitle>Test Scenarios</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4">
                <div className="p-4 border rounded-lg space-y-3">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <h3 className="font-medium">Email Confirmation Success</h3>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Simulates a successful email confirmation with countdown timer and redirect.
                  </p>
                  <div className="flex gap-2">
                    <Button 
                      onClick={() => generateTestUrl('email-confirmation')}
                      variant="outline"
                      size="sm"
                    >
                      Generate URL
                    </Button>
                    <Button 
                      onClick={() => openTestUrl('/auth/callback?type=signup&access_token=demo_access_token&refresh_token=demo_refresh_token')}
                      size="sm"
                    >
                      <ExternalLink className="w-4 h-4 mr-2" />
                      Test Now
                    </Button>
                  </div>
                </div>

                <div className="p-4 border rounded-lg space-y-3">
                  <div className="flex items-center gap-2">
                    <Mail className="w-5 h-5 text-blue-600" />
                    <h3 className="font-medium">OAuth Callback</h3>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Simulates a regular OAuth callback (immediate redirect, no countdown).
                  </p>
                  <div className="flex gap-2">
                    <Button 
                      onClick={() => generateTestUrl('oauth-callback')}
                      variant="outline"
                      size="sm"
                    >
                      Generate URL
                    </Button>
                    <Button 
                      onClick={() => openTestUrl('/auth/callback?code=demo_oauth_code&state=demo_state')}
                      size="sm"
                    >
                      <ExternalLink className="w-4 h-4 mr-2" />
                      Test Now
                    </Button>
                  </div>
                </div>

                <div className="p-4 border rounded-lg space-y-3">
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 bg-red-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-xs font-bold">!</span>
                    </div>
                    <h3 className="font-medium">Error Callback</h3>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Simulates an authentication error callback.
                  </p>
                  <div className="flex gap-2">
                    <Button 
                      onClick={() => generateTestUrl('error-callback')}
                      variant="outline"
                      size="sm"
                    >
                      Generate URL
                    </Button>
                    <Button 
                      onClick={() => openTestUrl('/auth/callback?error=access_denied&error_description=User+denied+access')}
                      size="sm"
                      variant="destructive"
                    >
                      <ExternalLink className="w-4 h-4 mr-2" />
                      Test Now
                    </Button>
                  </div>
                </div>
              </div>

              {testUrl && (
                <div className="mt-4 p-3 bg-muted rounded-lg">
                  <p className="text-xs font-medium mb-2">Generated Test URL:</p>
                  <code className="text-xs break-all">{testUrl}</code>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Expected Behavior */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Info className="w-5 h-5 text-blue-500" />
                Expected Behavior
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm space-y-4">
              <div>
                <h4 className="font-medium text-green-700">Email Confirmation Success:</h4>
                <ul className="list-disc list-inside text-muted-foreground space-y-1 mt-1">
                  <li>Shows "Email Confirmed!" message with green checkmark</li>
                  <li>Displays countdown timer starting from 5 seconds</li>
                  <li>Provides "Go to Home Now" button for immediate redirect</li>
                  <li>Automatically redirects to home page when countdown reaches 0</li>
                  <li>Beautiful gradient background and professional styling</li>
                </ul>
              </div>

              <div>
                <h4 className="font-medium text-blue-700">OAuth Callback:</h4>
                <ul className="list-disc list-inside text-muted-foreground space-y-1 mt-1">
                  <li>Shows loading spinner briefly</li>
                  <li>Immediately redirects to home page (no countdown)</li>
                  <li>No confirmation message needed for OAuth</li>
                </ul>
              </div>

              <div>
                <h4 className="font-medium text-red-700">Error Callback:</h4>
                <ul className="list-disc list-inside text-muted-foreground space-y-1 mt-1">
                  <li>Shows error message with red styling</li>
                  <li>Displays the specific error description</li>
                  <li>Automatically redirects to login page after 3 seconds</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* Implementation Details */}
          <Card>
            <CardHeader>
              <CardTitle>Implementation Details</CardTitle>
            </CardHeader>
            <CardContent className="text-sm space-y-3">
              <div>
                <h4 className="font-medium">Detection Logic:</h4>
                <ul className="list-disc list-inside text-muted-foreground space-y-1">
                  <li><code>type=signup</code> parameter indicates email confirmation</li>
                  <li>Presence of <code>access_token</code> and <code>refresh_token</code> confirms success</li>
                  <li>OAuth callbacks have <code>code</code> parameter instead</li>
                  <li>Error callbacks have <code>error</code> parameter</li>
                </ul>
              </div>

              <div>
                <h4 className="font-medium">Timer Implementation:</h4>
                <ul className="list-disc list-inside text-muted-foreground space-y-1">
                  <li>5-second countdown using <code>setInterval</code></li>
                  <li>Updates every 1000ms (1 second)</li>
                  <li>Clears interval when countdown reaches 0</li>
                  <li>Manual redirect button bypasses timer</li>
                </ul>
              </div>

              <div>
                <h4 className="font-medium">User Experience:</h4>
                <ul className="list-disc list-inside text-muted-foreground space-y-1">
                  <li>Clear success feedback with visual confirmation</li>
                  <li>Countdown gives users time to read the message</li>
                  <li>Option to skip waiting with immediate redirect button</li>
                  <li>Professional styling matches application theme</li>
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
                  <a href="/login">Login Page</a>
                </Button>
                <Button asChild variant="outline">
                  <a href="/signup">Signup Page</a>
                </Button>
                <Button asChild variant="outline">
                  <a href="/test-email-verification">Email Verification Test</a>
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
