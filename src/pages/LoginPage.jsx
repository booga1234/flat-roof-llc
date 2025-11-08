import { useMemo, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "../components/ui/card";
import { Label } from "../components/ui/label";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { Loader2 } from "lucide-react";
import { cn } from "../lib/utils";

const DEFAULT_BASE_URL = "https://xayv-jjxe-ueqz.n7e.xano.io/api:h4DxYGE_";

export function LoginPage({ className, onSuccess }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const baseUrl = useMemo(() => {
    return process.env.REACT_APP_XANO_AUTH_BASE_URL?.replace(/\/$/, "") ?? DEFAULT_BASE_URL;
  }, []);

  const loginEndpoint = `${baseUrl}/auth/login`;
  const resetEndpoint = `${baseUrl}/reset-password`;

  async function handleSubmit(event) {
    event.preventDefault();
    setLoading(true);
    setError("");
    setMessage("");

    try {
      const response = await fetch(loginEndpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          email,
          password
        })
      });

      const payload = await response.json();

      if (!response.ok) {
        throw new Error(payload?.message || "Unable to sign in with those credentials.");
      }

      const token = payload?.authToken || payload?.token || payload?.access_token;
      if (token) {
        localStorage.setItem("xanoAuthToken", token);
      }

      setMessage("Logged in successfully.");
      if (typeof onSuccess === "function") {
        onSuccess(token || null);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleReset(event) {
    event.preventDefault();
    if (!email) {
      setError("Enter your email to request a password reset link.");
      return;
    }

    setLoading(true);
    setError("");
    setMessage("");

    try {
      const response = await fetch(resetEndpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          email
        })
      });

      const payload = await response.json();

      if (!response.ok) {
        throw new Error(payload?.message || "Unable to send reset instructions.");
      }

      setMessage("Password reset instructions sent. Please check your email.");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      className={cn(
        "flex min-h-screen items-center justify-center bg-muted/50 px-4 py-10",
        className
      )}
    >
      <Card className="w-full max-w-md border-border/50 bg-background/95 shadow-xl backdrop-blur">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-3xl font-semibold">Welcome back</CardTitle>
          <CardDescription>Sign in to access your Flat Roof LLC dashboard.</CardDescription>
        </CardHeader>
        <CardContent>
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                autoComplete="email"
                placeholder="you@example.com"
                required
                value={email}
                onChange={(event) => setEmail(event.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                autoComplete="current-password"
                placeholder="Enter your password"
                required
                value={password}
                onChange={(event) => setPassword(event.target.value)}
              />
            </div>
            {error && (
              <p className="text-sm font-medium text-destructive" role="alert">
                {error}
              </p>
            )}
            {message && (
              <p className="text-sm font-medium text-green-600" role="status">
                {message}
              </p>
            )}
            <Button className="w-full" type="submit" disabled={loading}>
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                  Signing in...
                </span>
              ) : (
                "Sign in"
              )}
            </Button>
          </form>
          <div className="mt-6 flex items-center justify-between text-sm text-muted-foreground">
            <button
              type="button"
              className="text-primary hover:underline"
              onClick={handleReset}
              disabled={loading}
            >
              Forgot password?
            </button>
            <a
              className="text-primary hover:underline"
              href="https://xayv-jjxe-ueqz.n7e.xano.io/api:h4DxYGE_/auth/signup"
              target="_blank"
              rel="noreferrer"
            >
              Create account
            </a>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

