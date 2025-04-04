import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import LoginForm from "@/components/auth/login-form";
import SignupForm from "@/components/auth/signup-form";
import ForgotPasswordForm from "@/components/auth/forgot-password-form";
import { useAuth } from "@/hooks/use-auth";
import { Redirect } from "wouter";

type AuthFormType = "login" | "signup" | "forgot-password";

export default function AuthPage() {
  const [currentForm, setCurrentForm] = useState<AuthFormType>("login");
  const { user, isLoading } = useAuth();

  useEffect(() => {
    document.title = "futureKonnect | Authentication";
  }, []);

  // If the user is already logged in, redirect to the dashboard
  if (user && !isLoading) {
    return <Redirect to="/" />;
  }

  return (
    <div className="flex min-h-screen w-full bg-background">
      <div className="flex-1 flex items-center justify-center p-4">
        <Card className="w-full max-w-md bg-background-lighter shadow-lg border-background-card">
          <CardContent className="pt-6">
            <div className="text-center mb-8">
              <h1 className="text-2xl font-semibold">
                <span className="text-white">future</span>
                <span className="text-primary">konnect</span>
              </h1>
            </div>

            {currentForm === "login" && (
              <LoginForm
                onForgotPassword={() => setCurrentForm("forgot-password")}
                onSignupClick={() => setCurrentForm("signup")}
              />
            )}

            {currentForm === "signup" && (
              <SignupForm onLoginClick={() => setCurrentForm("login")} />
            )}

            {currentForm === "forgot-password" && (
              <ForgotPasswordForm onLoginClick={() => setCurrentForm("login")} />
            )}
          </CardContent>
        </Card>
      </div>

      <div className="hidden lg:flex flex-1 bg-gradient-to-br from-background to-background-lighter p-8 flex-col justify-center">
        <div className="max-w-lg">
          <h2 className="text-3xl font-bold mb-4">
            Network Management Dashboard
          </h2>
          <p className="text-text-secondary mb-6">
            Welcome to futureKonnect, the comprehensive network management solution 
            for monitoring your routers, hotspots, and fleet connectivity. Track 
            data usage, manage tenants, and maintain security through our powerful dashboard.
          </p>
          <ul className="space-y-3">
            <li className="flex items-center">
              <span className="mr-2 flex-shrink-0 w-5 h-5 bg-primary rounded-full flex items-center justify-center text-white">✓</span>
              <span>Real-time monitoring of network devices</span>
            </li>
            <li className="flex items-center">
              <span className="mr-2 flex-shrink-0 w-5 h-5 bg-primary rounded-full flex items-center justify-center text-white">✓</span>
              <span>Comprehensive audit trails and logging</span>
            </li>
            <li className="flex items-center">
              <span className="mr-2 flex-shrink-0 w-5 h-5 bg-primary rounded-full flex items-center justify-center text-white">✓</span>
              <span>Tenant management and data usage analytics</span>
            </li>
            <li className="flex items-center">
              <span className="mr-2 flex-shrink-0 w-5 h-5 bg-primary rounded-full flex items-center justify-center text-white">✓</span>
              <span>Firewall template configuration</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
