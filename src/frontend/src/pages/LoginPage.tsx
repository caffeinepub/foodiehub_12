import { Button } from "@/components/ui/button";
import { useNavigate } from "@tanstack/react-router";
import { Loader2, UtensilsCrossed } from "lucide-react";
import { useEffect } from "react";
import { useInternetIdentity } from "../hooks/useInternetIdentity";

export default function LoginPage() {
  const { login, loginStatus, identity, isInitializing } =
    useInternetIdentity();
  const navigate = useNavigate();

  const isLoggedIn = !!identity;
  const isLoggingIn = loginStatus === "logging-in";

  useEffect(() => {
    if (isLoggedIn) {
      navigate({ to: "/admin" });
    }
  }, [isLoggedIn, navigate]);

  if (isInitializing) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-4 relative overflow-hidden">
      {/* Background glow blobs */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-primary/5 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-80 h-80 rounded-full bg-primary/8 blur-3xl pointer-events-none" />

      {/* Card */}
      <div className="glass-card rounded-3xl p-10 max-w-sm w-full text-center relative z-10 shadow-2xl">
        {/* Logo area */}
        <div className="flex items-center justify-center mb-8">
          <div className="w-20 h-20 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center">
            <UtensilsCrossed className="w-10 h-10 text-primary" />
          </div>
        </div>

        <h1 className="font-display font-bold text-3xl mb-1">
          Foodie<span className="text-primary">Hub</span>
        </h1>
        <p className="text-muted-foreground text-sm mb-8">
          Sign in to access the admin & delivery panel
        </p>

        <Button
          onClick={() => login()}
          disabled={isLoggingIn}
          className="w-full bg-primary text-primary-foreground rounded-xl btn-green-glow h-12 text-base font-semibold"
        >
          {isLoggingIn ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Signing in...
            </>
          ) : (
            "Sign In"
          )}
        </Button>

        <p className="text-xs text-muted-foreground mt-6">
          Powered by Internet Identity &mdash; secure &amp; passwordless
        </p>
      </div>

      {/* Footer link */}
      <a
        href="/"
        className="mt-6 text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        &larr; Back to FoodieHub
      </a>
    </div>
  );
}
