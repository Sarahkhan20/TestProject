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

    </div>
  );
}
