import { useMemo, useState } from "react";
import { Loader2 } from "lucide-react";

import { Card, CardContent } from "./ui/card";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { cn } from "../lib/utils";

const DEFAULT_BASE_URL = "https://xayv-jjxe-ueqz.n7e.xano.io/api:h4DxYGE_";

export function LoginForm({ className, onSuccess }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [feedback, setFeedback] = useState("");

  const baseUrl = useMemo(() => {
    return process.env.REACT_APP_XANO_AUTH_BASE_URL?.replace(/\/$/, "") ?? DEFAULT_BASE_URL;
  }, []);

  const loginEndpoint = `${baseUrl}/auth/login`;
  const resetEndpoint = `${baseUrl}/reset-password`;

  async function handleSubmit(event) {
    event.preventDefault();
    setLoading(true);
    setError("");
    setFeedback("");

    try {
      const response = await fetch(loginEndpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ email, password })
      });

      const payload = await response.json();

      if (!response.ok) {
        throw new Error(payload?.message || "Unable to sign in with those credentials.");
      }

      const token = payload?.authToken || payload?.token || payload?.access_token || "";
      if (token) {
        localStorage.setItem("xanoAuthToken", token);
      }

      if (typeof onSuccess === "function") {
        onSuccess(token);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleReset() {
    if (!email) {
      setError("Enter your email address first to receive reset instructions.");
      setFeedback("");
      return;
    }

    setLoading(true);
    setError("");
    setFeedback("");

    try {
      const response = await fetch(resetEndpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ email })
      });

      const payload = await response.json();

      if (!response.ok) {
        throw new Error(payload?.message || "Unable to send reset instructions.");
      }

      setFeedback("Password reset email sent. Check your inbox.");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card className={cn("rounded-3xl border border-black/10 bg-white shadow-xl", className)}>
      <CardContent className="space-y-6 p-6 md:space-y-8">
        <div className="space-y-2 text-left">
          <h1 className="text-xl font-semibold tracking-tight">Login to your account</h1>
          <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
            Enter your email below to login to your account
          </p>
        </div>
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-3">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="m@example.com"
              autoComplete="email"
              required
              value={email}
              onChange={(event) => setEmail(event.target.value)}
            />
          </div>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label htmlFor="password">Password</Label>
              <button
                type="button"
                className="text-sm text-foreground underline-offset-4 hover:underline"
                onClick={handleReset}
                disabled={loading}
              >
                Forgot your password?
              </button>
            </div>
            <Input
              id="password"
              type="password"
              placeholder="Enter your password"
              autoComplete="current-password"
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
          {feedback && !error && (
            <p className="text-sm font-medium text-emerald-600" role="status">
              {feedback}
            </p>
          )}
          <div className="space-y-3">
            <Button
              className="w-full rounded-full bg-black text-white hover:bg-black/90"
              type="submit"
              disabled={loading}
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                  Logging in...
                </span>
              ) : (
                "Login"
              )}
            </Button>
            <Button
              type="button"
              variant="outline"
              className="w-full rounded-full border border-black/10"
              disabled={loading}
            >
              Login with Google
            </Button>
          </div>
        </form>
        <div className="space-y-6 text-center">
          <p className="text-sm text-muted-foreground">
            Don&apos;t have an account?{" "}
            <a
              className="text-muted-foreground underline underline-offset-4 hover:text-foreground"
              href={`${baseUrl}/auth/signup`}
              target="_blank"
              rel="noreferrer"
            >
              Sign up
            </a>
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

