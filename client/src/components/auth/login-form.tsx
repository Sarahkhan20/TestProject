import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { loginSchema, LoginData } from "@shared/schema";
import { useAuth } from "@/hooks/use-auth";

interface LoginFormProps {
  onForgotPassword: () => void;
  onSignupClick: () => void;
}

export default function LoginForm({ onForgotPassword, onSignupClick }: LoginFormProps) {
  const { loginMutation } = useAuth();

  const form = useForm<LoginData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = (values: LoginData) => {
    loginMutation.mutate(values);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm font-medium text-muted-foreground">Email</FormLabel>
              <FormControl>
                <Input
                  placeholder="you@test.dev"
                  className="bg-background-card border-background-lighter"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <div className="flex justify-between items-center">
                <FormLabel className="text-sm font-medium text-muted-foreground">Password</FormLabel>
              </div>
              <FormControl>
                <Input
                  type="password"
                  placeholder="••••••••"
                  className="bg-background-card border-background-lighter"
                  {...field}
                />
              </FormControl>
              <div className="mt-2 text-right">
                <Button
                  type="button"
                  variant="link"
                  className="text-xs text-primary hover:text-primary/90 p-0 h-auto"
                  onClick={onForgotPassword}
                >
                  Forgot Password?
                </Button>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <Button 
          type="submit" 
          className="w-full bg-primary hover:bg-primary/90"
          disabled={loginMutation.isPending}
        >
          {loginMutation.isPending ? "LOGGING IN..." : "LOGIN"}
        </Button>
        
        <div className="text-center text-sm text-muted-foreground">
          <p>
            Don't have an account?{" "}
            <Button
              type="button"
              variant="link"
              className="text-primary hover:text-primary/90 p-0 h-auto"
              onClick={onSignupClick}
            >
              Sign up
            </Button>
          </p>
        </div>
      </form>
    </Form>
  );
}
