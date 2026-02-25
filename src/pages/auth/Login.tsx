import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Package, Mail, Lock, Eye, EyeOff, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import api from "@/lib/api";

export default function Login() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState("");

  const handleEmailLogin = async (e: React.FormEvent) => {
  e.preventDefault();
  setIsLoading(true);

  try {
    const email = (document.getElementById("email") as HTMLInputElement).value;
    const password = (document.getElementById("password") as HTMLInputElement).value;

    const response = await api.post("/auth/login", {
      email,
      password,
    });

    const { access_token, user } = response.data;

    // Save token + user
    localStorage.setItem("token", access_token);
    localStorage.setItem("user", JSON.stringify(user));

    // Redirect based on role
if (user.role === "admin") {
  navigate("/dashboard");
} else if (user.role === "manager") {
  navigate("/dashboard");
} else if (user.role === "staff") {
  navigate("/deliveries");
} else {
  navigate("/login");
}
  } catch (error: any) {
    alert(error.response?.data?.detail || "Login failed");
  } finally {
    setIsLoading(false);
  }
};

  const handlePhoneLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otpSent) {
      setIsLoading(true);
      // Simulate OTP sending
      setTimeout(() => {
        setIsLoading(false);
        setOtpSent(true);
      }, 1000);
    } else {
      setIsLoading(true);
      // Simulate OTP verification
      setTimeout(() => {
        setIsLoading(false);
        navigate("/dashboard");
      }, 1000);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-primary relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary to-primary/80" />
        <div className="relative z-10 flex flex-col justify-center px-12 text-primary-foreground">
          <div className="flex items-center gap-3 mb-8">
            <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-primary-foreground/20">
              <Package className="h-8 w-8" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">SAS Negombo</h1>
              <p className="text-primary-foreground/80">Distribution Management System</p>
            </div>
          </div>
          
          <h2 className="text-4xl font-bold mb-4">
            Streamline Your<br />Distribution Operations
          </h2>
          <p className="text-lg text-primary-foreground/80 max-w-md">
            Manage suppliers, track inventory, process orders, and optimize deliveries 
            for your dairy and biscuit distribution business.
          </p>

          <div className="mt-12 grid grid-cols-2 gap-6">
            <div className="bg-primary-foreground/10 rounded-lg p-4">
              <h3 className="font-semibold mb-1">Dairy Products</h3>
              <p className="text-sm text-primary-foreground/70">
                Fresh milk, curd, yogurt tracking with batch expiry management
              </p>
            </div>
            <div className="bg-primary-foreground/10 rounded-lg p-4">
              <h3 className="font-semibold mb-1">Biscuit Products</h3>
              <p className="text-sm text-primary-foreground/70">
                Complete inventory for cookies and crackers distribution
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="flex-1 flex items-center justify-center p-8 bg-background">
        <div className="w-full max-w-md">
          {/* Mobile Logo */}
          <div className="lg:hidden flex items-center justify-center gap-3 mb-8">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary text-primary-foreground">
              <Package className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-xl font-bold">SAS Negombo</h1>
              <p className="text-sm text-muted-foreground">Distribution System</p>
            </div>
          </div>

          <Card className="border-0 shadow-lg">
            <CardHeader className="space-y-1 text-center">
              <CardTitle className="text-2xl font-bold">Welcome back</CardTitle>
              <CardDescription>
                Sign in to your account to continue
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="email" className="w-full">
                <TabsList className="grid w-full grid-cols-2 mb-6">
                  <TabsTrigger value="email">Email</TabsTrigger>
                  <TabsTrigger value="phone">Phone OTP</TabsTrigger>
                </TabsList>

                <TabsContent value="email">
                  <form onSubmit={handleEmailLogin} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                          id="email"
                          type="email"
                          placeholder="kamal@dms.lk"
                          className="pl-10"
                          required
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="password">Password</Label>
                        <Button
                          variant="link"
                          className="px-0 text-xs"
                          type="button"
                          onClick={() => navigate("/forgot-password")}
                        >
                          Forgot password?
                        </Button>
                      </div>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                          id="password"
                          type={showPassword ? "text" : "password"}
                          placeholder="Enter your password"
                          className="pl-10 pr-10"
                          required
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="absolute right-1 top-1/2 h-7 w-7 -translate-y-1/2"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                    </div>
                    <Button type="submit" className="w-full" disabled={isLoading}>
                      {isLoading ? "Signing in..." : "Sign In"}
                    </Button>
                  </form>
                </TabsContent>

                <TabsContent value="phone">
                  <form onSubmit={handlePhoneLogin} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number</Label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                          id="phone"
                          type="tel"
                          placeholder="+94 77 123 4567"
                          className="pl-10"
                          disabled={otpSent}
                          required
                        />
                      </div>
                    </div>

                    {otpSent && (
                      <div className="space-y-2">
                        <Label>Enter OTP</Label>
                        <div className="flex justify-center">
                          <InputOTP
                            maxLength={6}
                            value={otp}
                            onChange={setOtp}
                          >
                            <InputOTPGroup>
                              <InputOTPSlot index={0} />
                              <InputOTPSlot index={1} />
                              <InputOTPSlot index={2} />
                              <InputOTPSlot index={3} />
                              <InputOTPSlot index={4} />
                              <InputOTPSlot index={5} />
                            </InputOTPGroup>
                          </InputOTP>
                        </div>
                        <p className="text-center text-sm text-muted-foreground">
                          Didn't receive code?{" "}
                          <Button
                            variant="link"
                            className="px-0 h-auto"
                            type="button"
                            onClick={() => setOtpSent(false)}
                          >
                            Resend
                          </Button>
                        </p>
                      </div>
                    )}

                    <Button type="submit" className="w-full" disabled={isLoading}>
                      {isLoading
                        ? otpSent
                          ? "Verifying..."
                          : "Sending OTP..."
                        : otpSent
                        ? "Verify & Sign In"
                        : "Send OTP"}
                    </Button>
                  </form>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>

          <p className="text-center text-sm text-muted-foreground mt-6">
            © 2025 SAS Negombo. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
}
