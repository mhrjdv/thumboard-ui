"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SimpleLayout } from "@/components/layout/simple-layout";
import { inviteUser, acceptInvitation } from "@/lib/supabase";
import { AlertCircle, CheckCircle, UserPlus, Mail, ExternalLink, Info } from "lucide-react";

export default function TestInvitationPage() {
  const [email, setEmail] = useState("invited@example.com");
  const [password, setPassword] = useState("newpassword123");
  const [inviteToken, setInviteToken] = useState("demo_invite_token");
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const testSendInvitation = async () => {
    setLoading(true);
    try {
      const result = await inviteUser(email);
      setResult({ type: 'send-invitation', ...result });
    } catch (error) {
      setResult({ 
        type: 'send-invitation', 
        error: error instanceof Error ? error.message : 'Unknown error' 
      });
    } finally {
      setLoading(false);
    }
  };

  const testAcceptInvitation = async () => {
    setLoading(true);
    try {
      const result = await acceptInvitation(inviteToken, password);
      setResult({ type: 'accept-invitation', ...result });
    } catch (error) {
      setResult({ 
        type: 'accept-invitation', 
        error: error instanceof Error ? error.message : 'Unknown error' 
      });
    } finally {
      setLoading(false);
    }
  };

  const testInvitationCallback = () => {
    const url = `/auth/callback?type=invite&invite_token=demo_invite_token&access_token=demo_access_token`;
    window.open(url, '_blank');
  };

  const clearResult = () => {
    setResult(null);
  };

  return (
    <SimpleLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto space-y-6">
          <div>
            <h1 className="text-3xl font-bold">Invitation Flow Test</h1>
            <p className="text-muted-foreground">
              Test the complete user invitation and acceptance flow
            </p>
          </div>

          {/* Test Data */}
          <Card>
            <CardHeader>
              <CardTitle>Test Data</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email to Invite</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">New Password (for invited user)</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="inviteToken">Invitation Token</Label>
                <Input
                  id="inviteToken"
                  type="text"
                  value={inviteToken}
                  onChange={(e) => setInviteToken(e.target.value)}
                />
              </div>
              
              <div className="text-xs text-muted-foreground space-y-1">
                <p><strong>Demo Mode Behavior:</strong></p>
                <p>• Any email can be invited</p>
                <p>• Token "demo_invite_token" will work for acceptance</p>
                <p>• Other tokens will show invalid token error</p>
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
                  <h4 className="font-medium text-sm">1. Send Invitation</h4>
                  <Button 
                    onClick={testSendInvitation} 
                    disabled={loading || !email}
                    variant="outline"
                    className="justify-start"
                  >
                    <Mail className="w-4 h-4 mr-2" />
                    Send Invitation Email
                  </Button>
                </div>

                <div className="grid gap-2">
                  <h4 className="font-medium text-sm">2. Accept Invitation</h4>
                  <Button 
                    onClick={testAcceptInvitation} 
                    disabled={loading || !inviteToken}
                    variant="outline"
                    className="justify-start"
                  >
                    <UserPlus className="w-4 h-4 mr-2" />
                    Accept Invitation
                  </Button>
                </div>

                <div className="grid gap-2">
                  <h4 className="font-medium text-sm">3. Test Invitation Callback</h4>
                  <Button 
                    onClick={testInvitationCallback} 
                    disabled={loading}
                    variant="outline"
                    className="justify-start"
                  >
                    <ExternalLink className="w-4 h-4 mr-2" />
                    Test Invitation Callback Page
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
                  {/* Send Invitation Results */}
                  {result.type === 'send-invitation' && (
                    <div className="space-y-2">
                      {result.error ? (
                        <div className="p-3 bg-red-50 dark:bg-red-900/20 rounded-lg">
                          <p className="text-sm text-red-700 dark:text-red-300">
                            <strong>Invitation Error:</strong> {result.error.message || result.error}
                          </p>
                        </div>
                      ) : (
                        <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                          <p className="text-sm text-green-700 dark:text-green-300">
                            <strong>Invitation Sent:</strong> Invitation email sent to {email}
                          </p>
                          <p className="text-xs text-green-600 dark:text-green-400 mt-1">
                            In demo mode, this simulates sending an invitation email.
                          </p>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Accept Invitation Results */}
                  {result.type === 'accept-invitation' && (
                    <div className="space-y-2">
                      {result.error ? (
                        <div className="p-3 bg-red-50 dark:bg-red-900/20 rounded-lg">
                          <p className="text-sm text-red-700 dark:text-red-300">
                            <strong>Acceptance Error:</strong> {result.error.message || result.error}
                          </p>
                        </div>
                      ) : (
                        <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                          <p className="text-sm text-green-700 dark:text-green-300">
                            <strong>Invitation Accepted:</strong> User account activated successfully
                          </p>
                          <p className="text-xs text-green-600 dark:text-green-400 mt-1">
                            User can now access the application with their new password.
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
                Invitation Flow Overview
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm space-y-3">
              <div>
                <h4 className="font-medium">Complete Flow:</h4>
                <ol className="list-decimal list-inside text-muted-foreground space-y-1 mt-1">
                  <li>Admin sends invitation to user email</li>
                  <li>User receives invitation email with link</li>
                  <li>User clicks link → Invitation callback page</li>
                  <li>Shows "Invitation Accepted!" with countdown</li>
                  <li>Redirects to dashboard after 5 seconds</li>
                  <li>User can set password and access application</li>
                </ol>
              </div>

              <div>
                <h4 className="font-medium">Callback URL Structure:</h4>
                <code className="text-xs bg-muted p-2 rounded block mt-1">
                  /auth/callback?type=invite&invite_token=[token]&access_token=[token]
                </code>
              </div>

              <div>
                <h4 className="font-medium">Demo Mode Features:</h4>
                <ul className="list-disc list-inside text-muted-foreground space-y-1 mt-1">
                  <li>Simulates invitation sending without real emails</li>
                  <li>Token "demo_invite_token" works for testing</li>
                  <li>Creates demo user session upon acceptance</li>
                  <li>Shows proper success/error messages</li>
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
                  <a href="/auth/callback?type=invite&invite_token=demo_invite_token&access_token=demo_access_token">
                    Test Invitation Callback
                  </a>
                </Button>
                <Button asChild variant="outline">
                  <a href="/login">Login Page</a>
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
