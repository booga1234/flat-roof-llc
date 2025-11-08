import { cn } from "../lib/utils";
import { LoginForm } from "../components/login-form";

export function LoginPage({ className, onSuccess }) {
  return (
    <div className={cn("flex min-h-svh w-full items-center justify-center p-6 md:p-10", className)}>
      <div className="w-full max-w-sm">
        <LoginForm onSuccess={onSuccess} />
      </div>
    </div>
  );
}

