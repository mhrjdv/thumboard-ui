"use client";

import { useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import AuthForm from "@/components/auth/auth-form";
import { useRequireGuest } from "@/hooks/use-auth";

function LoginForm() {
  const searchParams = useSearchParams();
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');

  // Redirect authenticated users away from login page
  const { loading } = useRequireGuest();

  // Show error message if there's an error in URL params
  const error = searchParams.get('error');

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50 dark:bg-gray-900">
      {error && (
        <div className="fixed top-4 right-4 p-4 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-lg border border-red-200 dark:border-red-800">
          {error === 'auth_callback_error' && 'Authentication failed. Please try again.'}
          {error === 'unexpected_error' && 'An unexpected error occurred. Please try again.'}
          {error && !['auth_callback_error', 'unexpected_error'].includes(error) && error}
        </div>
      )}
      <AuthForm mode={mode} onModeChange={setMode} />
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    }>
      <LoginForm />
    </Suspense>
  );
}