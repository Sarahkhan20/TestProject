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
import { insertUserSchema } from "@shared/schema";
import { useAuth } from "@/hooks/use-auth";

// Add client-side validation for register form
const signupSchema = insertUserSchema.extend({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  confirmPassword: z.string().min(6, "Password must be at least 6 characters"),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type SignupFormValues = z.infer<typeof signupSchema>;

interface SignupFormProps {
  onLoginClick: () => void;
}

export default function SignupForm({ onLoginClick }: SignupFormProps) {
  const { registerMutation } = useAuth();

  const form = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      name: "",
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = (values: SignupFormValues) => {
    registerMutation.mutate(values);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm font-medium text-muted-foreground">Name</FormLabel>
              <FormControl>
                <Input
                  placeholder="John Doe"
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
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm font-medium text-muted-foreground">Username</FormLabel>
              <FormControl>
                <Input
                  placeholder="johndoe"
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
              <FormLabel className="text-sm font-medium text-muted-foreground">Password</FormLabel>
              <FormControl>
                <Input
                  type="password"
                  placeholder="••••••••"
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
          name="confirmPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm font-medium text-muted-foreground">Confirm Password</FormLabel>
              <FormControl>
                <Input
                  type="password"
                  placeholder="••••••••"
                  className="bg-background-card border-background-lighter"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <Button 
          type="submit" 
          className="w-full bg-primary hover:bg-primary/90"
          disabled={registerMutation.isPending}
        >
          {registerMutation.isPending ? "SIGNING UP..." : "SIGNUP"}
        </Button>
        
        <div className="text-center text-sm text-muted-foreground">
          <p>
            Already have an account?{" "}
            <Button
              type="button"
              variant="link"
              className="text-primary hover:text-primary/90 p-0 h-auto"
              onClick={onLoginClick}
            >
              Log in
            </Button>
          </p>
        </div>
      </form>
    </Form>
  );
}
