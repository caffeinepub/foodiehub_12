import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useNavigate } from "@tanstack/react-router";
import {
  Loader2,
  Lock,
  Phone,
  ShieldCheck,
  UtensilsCrossed,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useInternetIdentity } from "../hooks/useInternetIdentity";

const ADMIN_PHONE = "7750049306";
const ADMIN_PASSWORD = "land0000";
const PHONE_AUTH_KEY = "foodiehub_phone_auth";

type Step = "phone" | "password" | "otp";

function generateOtp() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export default function LoginPage() {
  const { login, loginStatus, identity, isInitializing } =
    useInternetIdentity();
  const navigate = useNavigate();

  const isLoggedIn = !!identity;
  const isLoggingIn = loginStatus === "logging-in";

  const [step, setStep] = useState<Step>("phone");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");

  const [otpInputs, setOtpInputs] = useState(["", "", "", "", "", ""]);
  const [generatedOtp, setGeneratedOtp] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showIILogin, setShowIILogin] = useState(false);
  const otpRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (isLoggedIn) navigate({ to: "/admin" });
  }, [isLoggedIn, navigate]);

  useEffect(() => {
    const stored = localStorage.getItem(PHONE_AUTH_KEY);
    if (stored === "true") navigate({ to: "/admin" });
  }, [navigate]);

  const handlePhoneSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    const normalized = phone.replace(/\D/g, "").replace(/^91/, "");
    if (normalized !== ADMIN_PHONE) {
      setError("Phone number not found.");
      return;
    }
    setStep("password");
  };

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (password !== ADMIN_PASSWORD) {
      setError("Incorrect password. Please try again.");
      return;
    }
    setLoading(true);
    setTimeout(() => {
      const code = generateOtp();
      setGeneratedOtp(code);
      setLoading(false);
      setStep("otp");
    }, 800);
  };

  const handleOtpInput = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;
    const updated = [...otpInputs];
    updated[index] = value.slice(-1);
    setOtpInputs(updated);
    if (value && index < 5) {
      otpRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !otpInputs[index] && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }
  };

  const handleOtpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    const enteredOtp = otpInputs.join("");
    if (enteredOtp !== generatedOtp) {
      setError("Invalid OTP. Please check and try again.");
      return;
    }
    localStorage.setItem(PHONE_AUTH_KEY, "true");
    navigate({ to: "/admin" });
  };

  const resendOtp = () => {
    const code = generateOtp();
    setGeneratedOtp(code);
    setOtpInputs(["", "", "", "", "", ""]);
    setError("");
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
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-primary/5 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-80 h-80 rounded-full bg-primary/8 blur-3xl pointer-events-none" />

      <div className="glass-card rounded-3xl p-10 max-w-sm w-full text-center relative z-10 shadow-2xl">
        {/* Logo */}
        <div className="flex items-center justify-center mb-6">
          <div className="w-20 h-20 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center">
            <UtensilsCrossed className="w-10 h-10 text-primary" />
          </div>
        </div>

        <h1 className="font-display font-bold text-3xl mb-1">
          Foodie<span className="text-primary">Hub</span>
        </h1>
        <p className="text-muted-foreground text-sm mb-6">
          Sign in to access the admin &amp; delivery panel
        </p>

        {/* Step indicator */}
        {!showIILogin && (
          <div className="flex items-center justify-center gap-2 mb-8">
            {["phone", "password", "otp"].map((s, i) => (
              <div key={s} className="flex items-center gap-2">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                    step === s
                      ? "bg-primary text-primary-foreground shadow-lg"
                      : ["phone", "password", "otp"].indexOf(step) > i
                        ? "bg-primary/30 text-primary"
                        : "bg-white/10 text-muted-foreground"
                  }`}
                >
                  {["phone", "password", "otp"].indexOf(step) > i ? "✓" : i + 1}
                </div>
                {i < 2 && (
                  <div
                    className={`w-8 h-0.5 transition-all ${
                      ["phone", "password", "otp"].indexOf(step) > i
                        ? "bg-primary/50"
                        : "bg-white/10"
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        )}

        {/* Toggle II login */}
        {!showIILogin ? (
          <>
            {/* STEP 1: Phone */}
            {step === "phone" && (
              <form
                onSubmit={handlePhoneSubmit}
                className="text-left space-y-4"
              >
                <div className="space-y-1.5">
                  <Label
                    htmlFor="phone"
                    className="text-sm text-muted-foreground flex items-center gap-1.5"
                  >
                    <Phone className="w-3.5 h-3.5" /> Phone Number
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
                    autoFocus
                  />
                </div>
                {error && (
                  <p className="text-sm text-red-400 text-center">{error}</p>
                )}
                <Button
                  type="submit"
                  className="w-full bg-primary text-primary-foreground rounded-xl btn-green-glow h-12 text-base font-semibold mt-2"
                  data-ocid="login.submit_button"
                >
                  Continue
                </Button>
              </form>
            )}

            {/* STEP 2: Password */}
            {step === "password" && (
              <form
                onSubmit={handlePasswordSubmit}
                className="text-left space-y-4"
              >
                <div className="text-center mb-2">
                  <p className="text-xs text-muted-foreground">
                    Signing in as{" "}
                    <span className="text-foreground font-medium">{phone}</span>
                  </p>
                </div>
                <div className="space-y-1.5">
                  <Label
                    htmlFor="password"
                    className="text-sm text-muted-foreground flex items-center gap-1.5"
                  >
                    <Lock className="w-3.5 h-3.5" /> Password
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
                    autoFocus
                  />
                </div>
                {error && (
                  <p className="text-sm text-red-400 text-center">{error}</p>
                )}
                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-primary text-primary-foreground rounded-xl btn-green-glow h-12 text-base font-semibold mt-2"
                  data-ocid="login.submit_button"
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Sending
                      OTP...
                    </>
                  ) : (
                    "Send OTP"
                  )}
                </Button>
                <button
                  type="button"
                  onClick={() => {
                    setStep("phone");
                    setError("");
                    setPassword("");
                  }}
                  className="w-full text-sm text-muted-foreground hover:text-foreground transition-colors text-center"
                >
                  ← Change phone number
                </button>
              </form>
            )}

            {/* STEP 3: OTP */}
            {step === "otp" && (
              <form onSubmit={handleOtpSubmit} className="text-left space-y-5">
                <div className="text-center">
                  <ShieldCheck className="w-10 h-10 text-primary mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground">
                    OTP sent to{" "}
                    <span className="text-foreground font-medium">{phone}</span>
                  </p>
                  {/* Demo OTP display */}
                  <div className="mt-3 p-3 bg-primary/10 border border-primary/20 rounded-xl">
                    <p className="text-xs text-muted-foreground mb-1">
                      Your OTP (demo)
                    </p>
                    <p className="text-2xl font-bold tracking-widest text-primary">
                      {generatedOtp}
                    </p>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-sm text-muted-foreground text-center block">
                    Enter 6-digit OTP
                  </Label>
                  <div className="flex justify-center gap-2">
                    {["d1", "d2", "d3", "d4", "d5", "d6"].map((id, i) => (
                      <input
                        key={id}
                        ref={(el) => {
                          otpRefs.current[i] = el;
                        }}
                        type="text"
                        inputMode="numeric"
                        maxLength={1}
                        value={otpInputs[i]}
                        onChange={(e) => handleOtpInput(i, e.target.value)}
                        onKeyDown={(e) => handleOtpKeyDown(i, e)}
                        className="w-10 h-12 text-center text-lg font-bold bg-white/5 border border-white/10 rounded-xl focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-all"
                      />
                    ))}
                  </div>
                </div>

                {error && (
                  <p className="text-sm text-red-400 text-center">{error}</p>
                )}

                <Button
                  type="submit"
                  className="w-full bg-primary text-primary-foreground rounded-xl btn-green-glow h-12 text-base font-semibold"
                  data-ocid="login.submit_button"
                >
                  Verify &amp; Sign In
                </Button>

                <div className="flex items-center justify-between text-sm">
                  <button
                    type="button"
                    onClick={() => {
                      setStep("password");
                      setError("");
                      setOtpInputs(["", "", "", "", "", ""]);
                    }}
                    className="text-muted-foreground hover:text-foreground transition-colors"
                  >
                    ← Back
                  </button>
                  <button
                    type="button"
                    onClick={resendOtp}
                    className="text-primary hover:underline"
                  >
                    Resend OTP
                  </button>
                </div>
              </form>
            )}

            <div className="mt-6 pt-5 border-t border-white/10">
              <button
                type="button"
                onClick={() => setShowIILogin(true)}
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Sign in with Internet Identity instead
              </button>
            </div>
          </>
        ) : (
          <>
            <Button
              onClick={() => login()}
              disabled={isLoggingIn}
              className="w-full bg-primary text-primary-foreground rounded-xl btn-green-glow h-12 text-base font-semibold"
              data-ocid="login.primary_button"
            >
              {isLoggingIn ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Signing
                  in...
                </>
              ) : (
                "Sign In with Internet Identity"
              )}
            </Button>
            <p className="text-xs text-muted-foreground mt-3">
              Secure &amp; passwordless authentication
            </p>
            <div className="mt-6 pt-5 border-t border-white/10">
              <button
                type="button"
                onClick={() => setShowIILogin(false)}
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                ← Use phone login instead
              </button>
            </div>
          </>
        )}
      </div>

      <a
        href="/"
        className="mt-6 text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        &larr; Back to FoodieHub
      </a>
    </div>
  );
}
