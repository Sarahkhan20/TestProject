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
import { useAuth } from "@/hooks/use-auth";

const forgotPasswordSchema = z.object({
  email: z.string().email("Invalid email address"),
});

type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>;

interface ForgotPasswordFormProps {
  onLoginClick: () => void;
}

export default function ForgotPasswordForm({ onLoginClick }: ForgotPasswordFormProps) {
  const { forgotPasswordMutation } = useAuth();

  const form = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = (values: ForgotPasswordFormValues) => {
    forgotPasswordMutation.mutate(values);
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
        
        <Button 
          type="submit" 
          className="w-full bg-primary hover:bg-primary/90"
          disabled={forgotPasswordMutation.isPending}
        >
          {forgotPasswordMutation.isPending ? "PROCESSING..." : "RESET"}
        </Button>
        
        <div className="text-center text-sm text-muted-foreground">
          <p>
            Remember your password?{" "}
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
