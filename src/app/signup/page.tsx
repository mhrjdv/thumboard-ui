"use client";

import { useState } from "react";
import AuthForm from "@/components/auth/auth-form";
import { useRequireGuest } from "@/hooks/use-auth";

export default function SignupPage() {
  const [mode, setMode] = useState<'signin' | 'signup'>('signup');

  // Redirect authenticated users away from signup page
  const { loading } = useRequireGuest();

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50 dark:bg-gray-900">
      <AuthForm mode={mode} onModeChange={setMode} />
    </div>
  );
}