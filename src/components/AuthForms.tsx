import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { INDIAN_STATES, STATE_DISTRICT_MAPPING } from "@/lib/states-data";

export function LoginForm({ onToggle }: { onToggle: () => void }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { refreshRole } = useAuth();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    let { data, error } = await supabase.auth.signInWithPassword({ email, password });
    
    // Auto-create ambulance admin if using default credentials and account doesn't exist
    if (error && error.message.includes("Invalid login") && email === "arbazmushtaq001@gmail.com" && password === "23341a05a4") {
      const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { full_name: "Ambulance Admin" } }
      });
      if (signUpData.user && !signUpError) {
        await supabase.from("user_roles").insert({ user_id: signUpData.user.id, role: "ambulance" });
        const loginRes = await supabase.auth.signInWithPassword({ email, password });
        data = loginRes.data;
        error = loginRes.error;
      }
    }

    if (error) {
      toast.error(error.message);
      setLoading(false);
      return;
    }

    toast.success("Logged in successfully");
    const userId = data.user?.id;
    if (userId) {
      // FORCE ambulance role for demo account if it already exists as something else
      if (email === "arbazmushtaq001@gmail.com") {
        const { data: existingRole } = await supabase.from("user_roles").select("*").eq("user_id", userId).maybeSingle();
        if (existingRole) {
          await supabase.from("user_roles").update({ role: "ambulance" }).eq("user_id", userId);
        } else {
          await supabase.from("user_roles").insert({ user_id: userId, role: "ambulance" });
        }
      }

      const { data: roleData } = await supabase.from("user_roles").select("role").eq("user_id", userId).maybeSingle();
      await refreshRole();
      const role = roleData?.role;
      if (role === "doctor") navigate("/doctor/dashboard");
      else if (role === "admin") navigate("/admin");
      else if (role === "clinic") navigate("/clinic/dashboard");
      else if (role === "ambulance") navigate("/ambulance/dashboard");
      else if (role === "patient") navigate("/patient/dashboard");
      else navigate("/");
    } else {
      navigate("/");
    }
    setLoading(false);
  };

  return (
    <Card className="w-full max-w-md shadow-2xl border-border/40 bg-card/95 backdrop-blur-md">
      <CardHeader className="text-center">
        <div className="mx-auto mb-3">
          <img src="/logo.png" alt="SwasthyaCare Logo" className="h-16 mx-auto object-contain" />
        </div>
        <CardTitle className="text-2xl font-bold text-primary">Welcome Back</CardTitle>
        <CardDescription>Sign in to your SwasthyaCare account</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleLogin} className="space-y-4 text-left">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required placeholder="you@example.com" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <div className="relative">
              <Input id="password" type={showPassword ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} required placeholder="••••••••" />
              <button
                type="button"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-700"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Signing in..." : "Sign In"}
          </Button>
        </form>
        <p className="mt-4 text-center text-sm text-muted-foreground">
          Don't have an account?{" "}
          <button onClick={onToggle} className="text-primary hover:underline font-medium">Sign Up</button>
        </p>
      </CardContent>
    </Card>
  );
}

export function SignupForm({ onToggle }: { onToggle: () => void }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [fullName, setFullName] = useState("");
  const [state, setState] = useState("");
  const [district, setDistrict] = useState("");

  const handleStateChange = (val: string) => {
    setState(val);
    setDistrict("");
  };
  const [role, setRole] = useState<string>("patient");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    if (password !== confirmPassword) {
      toast.error("Passwords do not match.");
      setLoading(false);
      return;
    }
    if (!state || !district) {
      toast.error("Please select your State and District.");
      setLoading(false);
      return;
    }
    try {
      const { data: authData, error: authError } = await supabase.auth.signUp({ email, password, options: { data: { full_name: fullName } } });
      if (authError) { toast.error(authError.message); setLoading(false); return; }
      if (!authData.user) { toast.error("Signup failed"); setLoading(false); return; }
      const userId = authData.user.id;
      if (!authData.session) {
        const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });
        if (signInError) { toast.error(signInError.message || "Please check your email."); setLoading(false); return; }
      }
      // Determine final role to insert (jasimmushtaq31@gmail.com is auto-promoted to admin)
      const finalRole = email.trim().toLowerCase() === "jasimmushtaq31@gmail.com" ? "admin" : role;

      await supabase.from("user_roles").insert({ user_id: userId, role: finalRole as "patient" | "doctor" | "admin" | "clinic" | "ambulance" });
      
      // Wait for the profile trigger to create the profile row
      for (let i = 0; i < 5; i++) {
        const { data: existingProfile } = await supabase.from("profiles").select("id").eq("user_id", userId).maybeSingle();
        if (existingProfile) break;
        await new Promise(r => setTimeout(r, 1000));
      }
      
      await supabase.from("profiles").update({ state, district, full_name: fullName }).eq("user_id", userId);
      
      if (finalRole === "doctor") { 
        await supabase.from("doctors").insert({ 
          user_id: userId, 
          full_name: fullName, 
          state, 
          district,
          is_approved: false
        }); 
      } else if (finalRole === "clinic") {
        await supabase.from("clinics").insert({
          user_id: userId,
          name: fullName,
          state,
          district,
          is_approved: false
        });
      }
      
      toast.success("Account created successfully!");
      if (finalRole === "admin") navigate("/admin");
      else if (finalRole === "doctor") navigate("/doctor/dashboard");
      else if (finalRole === "clinic") navigate("/clinic/dashboard");
      else if (finalRole === "ambulance") navigate("/ambulance/dashboard");
      else navigate("/patient/dashboard");
    } catch (err) { toast.error("Something went wrong."); }
    setLoading(false);
  };

  return (
    <Card className="w-full max-w-md shadow-2xl border-border/40 bg-card/95 backdrop-blur-md overflow-y-auto max-h-[80vh]">
      <CardHeader className="text-center">
        <div className="mx-auto mb-3">
          <img src="/logo.png" alt="SwasthyaCare Logo" className="h-12 mx-auto object-contain" />
        </div>
        <CardTitle className="text-2xl font-bold text-primary">Create Account</CardTitle>
        <CardDescription>Join the SwasthyaCare community</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSignup} className="space-y-3 text-left">
          <div className="space-y-1">
            <Label htmlFor="fullName">Full Name</Label>
            <Input id="fullName" value={fullName} onChange={(e) => setFullName(e.target.value)} required placeholder="Full Name" />
          </div>
          <div className="space-y-1">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required placeholder="Email" />
          </div>
          <div className="space-y-1">
            <Label htmlFor="password">Password</Label>
            <div className="relative">
              <Input id="password" type={showPassword ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} required minLength={6} placeholder="••••••••" />
              <button
                type="button"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-700"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>
          <div className="space-y-1">
            <Label htmlFor="confirmPassword">Confirm Password</Label>
            <div className="relative">
              <Input id="confirmPassword" type={showConfirmPassword ? "text" : "password"} value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required minLength={6} placeholder="••••••••" />
              <button
                type="button"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-700"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div className="space-y-1">
              <Label>State</Label>
              <Select value={state} onValueChange={handleStateChange}><SelectTrigger className="h-9"><SelectValue placeholder="State" /></SelectTrigger><SelectContent>{INDIAN_STATES.map((s) => (<SelectItem key={s} value={s}>{s}</SelectItem>))}</SelectContent></Select>
            </div>
            <div className="space-y-1">
              <Label htmlFor="district">District</Label>
              <Select value={district} onValueChange={setDistrict} disabled={!state}>
                <SelectTrigger className="h-9"><SelectValue placeholder={state ? "District" : "State first"} /></SelectTrigger>
                <SelectContent>
                  {(STATE_DISTRICT_MAPPING[state] || []).map((d) => (
                    <SelectItem key={d} value={d}>{d}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="space-y-1">
            <Label>I am a</Label>
            <Select value={role} onValueChange={setRole}><SelectTrigger className="h-9"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="patient">Patient</SelectItem><SelectItem value="doctor">Doctor</SelectItem><SelectItem value="clinic">Clinic</SelectItem></SelectContent></Select>
          </div>
          <Button type="submit" className="w-full" disabled={loading}>{loading ? "Creating..." : "Sign Up"}</Button>
        </form>
        <p className="mt-3 text-center text-sm text-muted-foreground">
          Already have an account?{" "}
          <button onClick={onToggle} className="text-primary hover:underline font-medium">Sign In</button>
        </p>
      </CardContent>
    </Card>
  );
}
