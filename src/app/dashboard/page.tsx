"use client";

import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SimpleLayout } from "@/components/layout/simple-layout";
import { User, Mail, Calendar, LogOut } from "lucide-react";

export default function DashboardPage() {
  const { user, loading, signOut, isAuthenticated, userMetadata } = useAuth();

  if (loading) {
    return (
      <SimpleLayout>
        <div className="flex justify-center items-center h-[calc(100vh-4rem)]">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </SimpleLayout>
    );
  }

  if (!isAuthenticated) {
    return (
      <SimpleLayout>
        <div className="flex justify-center items-center h-[calc(100vh-4rem)]">
          <Card className="w-full max-w-md">
            <CardContent className="pt-6">
              <div className="text-center">
                <h2 className="text-xl font-semibold mb-2">Access Denied</h2>
                <p className="text-muted-foreground mb-4">
                  You need to be logged in to access this page.
                </p>
                <Button onClick={() => window.location.href = '/login'}>
                  Go to Login
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </SimpleLayout>
    );
  }

  return (
    <SimpleLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold">Dashboard</h1>
              <p className="text-muted-foreground">
                Welcome back, {userMetadata.full_name || user?.email}!
              </p>
            </div>
            <Button variant="outline" onClick={signOut}>
              <LogOut className="w-4 h-4 mr-2" />
              Sign Out
            </Button>
          </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {/* User Info Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <User className="w-5 h-5 mr-2" />
                Profile Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div>
                <span className="text-sm font-medium">Email:</span>
                <p className="text-sm text-muted-foreground">{user?.email}</p>
              </div>
              <div>
                <span className="text-sm font-medium">Full Name:</span>
                <p className="text-sm text-muted-foreground">
                  {userMetadata.full_name || 'Not provided'}
                </p>
              </div>
              <div>
                <span className="text-sm font-medium">User ID:</span>
                <p className="text-sm text-muted-foreground font-mono text-xs">
                  {user?.id}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Account Status Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Mail className="w-5 h-5 mr-2" />
                Account Status
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div>
                <span className="text-sm font-medium">Email Verified:</span>
                <p className="text-sm text-muted-foreground">
                  {user?.email_confirmed_at ? (
                    <span className="text-green-600">✓ Verified</span>
                  ) : (
                    <span className="text-yellow-600">⚠ Pending</span>
                  )}
                </p>
              </div>
              <div>
                <span className="text-sm font-medium">Phone Verified:</span>
                <p className="text-sm text-muted-foreground">
                  {user?.phone_confirmed_at ? (
                    <span className="text-green-600">✓ Verified</span>
                  ) : (
                    <span className="text-gray-500">Not provided</span>
                  )}
                </p>
              </div>
              <div>
                <span className="text-sm font-medium">Provider:</span>
                <p className="text-sm text-muted-foreground capitalize">
                  {user?.app_metadata?.provider || 'email'}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Account Dates Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Calendar className="w-5 h-5 mr-2" />
                Account Dates
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div>
                <span className="text-sm font-medium">Created:</span>
                <p className="text-sm text-muted-foreground">
                  {user?.created_at ? new Date(user.created_at).toLocaleDateString() : 'Unknown'}
                </p>
              </div>
              <div>
                <span className="text-sm font-medium">Last Sign In:</span>
                <p className="text-sm text-muted-foreground">
                  {user?.last_sign_in_at ? new Date(user.last_sign_in_at).toLocaleDateString() : 'Unknown'}
                </p>
              </div>
              <div>
                <span className="text-sm font-medium">Updated:</span>
                <p className="text-sm text-muted-foreground">
                  {user?.updated_at ? new Date(user.updated_at).toLocaleDateString() : 'Unknown'}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-4">
              <Button variant="outline" onClick={() => window.location.href = '/'}>
                Go to Home
              </Button>
              <Button variant="outline" onClick={() => window.location.href = '/profile'}>
                Edit Profile
              </Button>
              <Button variant="outline" onClick={() => window.location.href = '/settings'}>
                Settings
              </Button>
            </div>
          </CardContent>
        </Card>
        </div>
      </div>
    </SimpleLayout>
  );
}
