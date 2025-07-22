"use client";

import * as React from "react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { signUp, signIn, signInWithMagicLink } from "@/lib/supabase";
import { LogoCompact } from "@/components/ui/logo";



export default function SignupForm() {
  const [isLogin, setIsLogin] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [useMagicLink, setUseMagicLink] = useState(true);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      if (useMagicLink) {
        // Magic link authentication
        const { error } = await signInWithMagicLink(email);
        if (error) {
          setError(error.message);
        } else {
          setSuccess("Check your email for the magic link!");
        }
      } else {
        // Password authentication
        if (isLogin) {
          const { error } = await signIn(email, password);
          if (error) {
            setError(error.message);
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
      }
    } catch {
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen">
      <Card className="w-full max-w-sm rounded-4xl px-6 py-10 pt-14">
        <CardContent className="">
          <div className="flex flex-col items-center space-y-8">
            <LogoCompact width={120} height={36} priority />

            <div className="space-y-2 text-center">
              <h1 className="text-3xl font-semibold text-foreground">
                {isLogin ? "Welcome back!" : "Create your account"}
              </h1>
              <p className="text-muted-foreground text-sm">
                {isLogin ? (
                  <>
                    First time here?{" "}
                    <button 
                      onClick={() => setIsLogin(false)}
                      className="text-foreground hover:underline"
                    >
                      Sign up for free
                    </button>
                  </>
                ) : (
                  <>
                    Already have an account?{" "}
                    <button 
                      onClick={() => setIsLogin(true)}
                      className="text-foreground hover:underline"
                    >
                      Sign in
                    </button>
                  </>
                )}
              </p>
            </div>

            <form onSubmit={handleSubmit} className="w-full space-y-4">
              {error && (
                <div className="p-3 text-sm text-red-600 bg-red-50 dark:bg-red-900/20 dark:text-red-400 rounded-lg">
                  {error}
                </div>
              )}
              
              {success && (
                <div className="p-3 text-sm text-green-600 bg-green-50 dark:bg-green-900/20 dark:text-green-400 rounded-lg">
                  {success}
                </div>
              )}

              {!isLogin && (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                      id="name"
                      type="text"
                      placeholder="Your full name"
                      className="w-full rounded-xl"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      required={!isLogin}
                    />
                  </div>
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
              
              {!useMagicLink && (
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="Your password"
                    className="w-full rounded-xl"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required={!useMagicLink}
                    minLength={6}
                  />
                </div>
              )}
              
              <div className="flex flex-col gap-2">
                <Button 
                  type="submit" 
                  className="w-full rounded-xl" 
                  size="lg"
                  disabled={loading}
                >
                  {loading ? (
                    <div className="flex items-center gap-2">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      Loading...
                    </div>
                  ) : (
                    useMagicLink 
                      ? (isLogin ? "Send me the magic link" : "Create account with magic link")
                      : (isLogin ? "Sign in" : "Create account")
                  )}
                </Button>
                <Button
                  type="button"
                  variant="link"
                  className="w-full text-sm text-muted-foreground"
                  onClick={() => setUseMagicLink(!useMagicLink)}
                >
                  {useMagicLink 
                    ? (isLogin ? "Sign in using password" : "Sign up using password")
                    : (isLogin ? "Send me the magic link" : "Use magic link instead")
                  }
                </Button>
              </div>
            </form>

            <div className="flex items-center gap-4 py-2">
              <Separator className="flex-1" />
              <span className="text-sm text-muted-foreground">OR</span>
              <Separator className="flex-1" />
            </div>

            <Button variant="outline" className="w-full rounded-xl" size="lg">
              Single sign-on (SSO)
            </Button>

            <p className="text-center text-xs w-11/12 text-muted-foreground">
              You acknowledge that you read, and agree, to our{" "}
              <a href="#" className="underline hover:text-foreground">
                Terms of Service
              </a>{" "}
              and our{" "}
              <a href="#" className="underline hover:text-foreground">
                Privacy Policy
              </a>
              .
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}