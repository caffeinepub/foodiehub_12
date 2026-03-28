import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useNavigate } from "@tanstack/react-router";
import { Loader2, Phone, UtensilsCrossed } from "lucide-react";
import { useEffect, useState } from "react";
import { useInternetIdentity } from "../hooks/useInternetIdentity";

const ADMIN_PHONE = "7750049306";
const ADMIN_PASSWORD = "land0000";
const PHONE_AUTH_KEY = "foodiehub_phone_auth";

export default function LoginPage() {
  const { login, loginStatus, identity, isInitializing } =
    useInternetIdentity();
  const navigate = useNavigate();

  const isLoggedIn = !!identity;
  const isLoggingIn = loginStatus === "logging-in";

  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [phoneError, setPhoneError] = useState("");
  const [phoneLoading, setPhoneLoading] = useState(false);

  useEffect(() => {
    if (isLoggedIn) {
      navigate({ to: "/admin" });
    }
  }, [isLoggedIn, navigate]);

  useEffect(() => {
    const stored = localStorage.getItem(PHONE_AUTH_KEY);
    if (stored === "true") {
      navigate({ to: "/admin" });
    }
  }, [navigate]);

  const handlePhoneLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setPhoneError("");
    setPhoneLoading(true);
    setTimeout(() => {
      const normalizedPhone = phone.replace(/\D/g, "").replace(/^91/, "");
      if (normalizedPhone === ADMIN_PHONE && password === ADMIN_PASSWORD) {
        localStorage.setItem(PHONE_AUTH_KEY, "true");
        navigate({ to: "/admin" });
      } else {
        setPhoneError("Invalid phone number or password. Please try again.");
      }
      setPhoneLoading(false);
    }, 600);
  };

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
          Sign in to access the admin &amp; delivery panel
        </p>

        <Tabs defaultValue="phone" className="w-full">
          <TabsList
            className="w-full mb-6 bg-white/5 border border-white/10 rounded-xl"
            data-ocid="login.tab"
          >
            <TabsTrigger
              value="phone"
              className="flex-1 rounded-lg text-sm"
              data-ocid="login.phone_tab"
            >
              <Phone className="w-3.5 h-3.5 mr-1.5" />
              Phone
            </TabsTrigger>
            <TabsTrigger
              value="ii"
              className="flex-1 rounded-lg text-sm"
              data-ocid="login.ii_tab"
            >
              Internet Identity
            </TabsTrigger>
          </TabsList>

          {/* Phone Login Tab */}
          <TabsContent value="phone">
            <form onSubmit={handlePhoneLogin} className="text-left space-y-4">
              <div className="space-y-1.5">
                <Label
                  htmlFor="phone"
                  className="text-sm text-muted-foreground"
                >
                  Phone Number
                </Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="e.g. 7750049306"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="bg-white/5 border-white/10 rounded-xl h-11"
                  data-ocid="login.input"
                  required
                />
              </div>
              <div className="space-y-1.5">
                <Label
                  htmlFor="password"
                  className="text-sm text-muted-foreground"
                >
                  Password
                </Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="bg-white/5 border-white/10 rounded-xl h-11"
                  data-ocid="login.password_input"
                  required
                />
              </div>

              {phoneError && (
                <p
                  className="text-sm text-red-400 text-center"
                  data-ocid="login.error_state"
                >
                  {phoneError}
                </p>
              )}

              <Button
                type="submit"
                disabled={phoneLoading}
                className="w-full bg-primary text-primary-foreground rounded-xl btn-green-glow h-12 text-base font-semibold mt-2"
                data-ocid="login.submit_button"
              >
                {phoneLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Signing in...
                  </>
                ) : (
                  "Sign In"
                )}
              </Button>
            </form>
          </TabsContent>

          {/* Internet Identity Tab */}
          <TabsContent value="ii">
            <Button
              onClick={() => login()}
              disabled={isLoggingIn}
              className="w-full bg-primary text-primary-foreground rounded-xl btn-green-glow h-12 text-base font-semibold"
              data-ocid="login.primary_button"
            >
              {isLoggingIn ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Signing in...
                </>
              ) : (
                "Sign In with Internet Identity"
              )}
            </Button>
            <p className="text-xs text-muted-foreground mt-4">
              Secure &amp; passwordless authentication
            </p>
          </TabsContent>
        </Tabs>
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
