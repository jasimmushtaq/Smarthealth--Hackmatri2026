import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { Stethoscope } from "lucide-react";
import { INDIAN_STATES, STATE_DISTRICT_MAPPING } from "@/lib/states-data";

export default function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
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
    if (!state || !district) {
      toast.error("Please select your State and District.");
      setLoading(false);
      return;
    }

    try {
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
          }
        }
      });

      if (authError) {
        toast.error(authError.message);
        setLoading(false);
        return;
      }

      if (!authData.user) {
        toast.error("Signup failed");
        setLoading(false);
        return;
      }

      const userId = authData.user.id;

      // Ensure user is signed in to access RLS policies
      if (!authData.session) {
        const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });
        if (signInError) {
           toast.error(signInError.message || "Please check your email to verify your account.");
           setLoading(false);
           return;
        }
      }

      // Determine final role to insert (jasimmushtaq31@gmail.com is auto-promoted to admin)
      const finalRole = email.trim().toLowerCase() === "jasimmushtaq31@gmail.com" ? "admin" : role;

      // Insert role
      await supabase.from("user_roles").insert({ user_id: userId, role: finalRole as "patient" | "doctor" | "admin" | "clinic" | "ambulance" });

      // Update profile with state and district
      await supabase.from("profiles").update({ state, district }).eq("user_id", userId);

      // If doctor, initialize doctor record (pending admin approval)
      if (finalRole === "doctor") {
        await supabase.from("doctors").insert({ 
          user_id: userId, 
          full_name: fullName, 
          state, 
          district,
          is_approved: false
        });
      }
      
      // If clinic, initialize clinic record (pending admin approval)
      if (finalRole === "clinic") {
        await supabase.from("clinics").insert({
          user_id: userId,
          name: fullName, // using full name as initial clinic name
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
      else navigate("/");
    } catch (err) {
      toast.error("Something went wrong. Please try again.");
    }

    setLoading(false);
  };

  return (
    <div className="relative min-h-[calc(100vh-64px)] flex items-center justify-center px-4 py-12 overflow-hidden">
      {/* Background */}
      <div 
        className="absolute inset-0 z-0 bg-cover bg-center"
        style={{ backgroundImage: "url('/medical-bg.png')" }}
      />
      <div className="absolute inset-0 z-10 bg-white/60 backdrop-blur-sm" />

      <Card className="relative z-20 w-full max-w-md shadow-2xl border-white/40 bg-white/95 backdrop-blur-md animate-in fade-in slide-in-from-bottom-4 duration-500">
        <CardHeader className="text-center">
          <div className="mx-auto mb-3">
            <img src="/logo.png" alt="SwasthyaCare Logo" className="h-16 mx-auto object-contain" />
          </div>
          <CardTitle className="text-2xl font-bold text-primary">Create Account</CardTitle>
          <CardDescription>Join the SwasthyaCare community</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSignup} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="fullName">Full Name</Label>
              <Input id="fullName" value={fullName} onChange={(e) => setFullName(e.target.value)} required placeholder="Dr. Jane Smith" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required placeholder="you@example.com" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={6} placeholder="••••••••" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>State</Label>
                <Select value={state} onValueChange={handleStateChange}>
                  <SelectTrigger><SelectValue placeholder="Select state" /></SelectTrigger>
                  <SelectContent>
                    {INDIAN_STATES.map((s) => (
                      <SelectItem key={s} value={s}>{s}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="district">District</Label>
                <Select value={district} onValueChange={setDistrict} disabled={!state}>
                  <SelectTrigger><SelectValue placeholder={state ? "Select district" : "Select state first"} /></SelectTrigger>
                  <SelectContent>
                    {(STATE_DISTRICT_MAPPING[state] || []).map((d) => (
                      <SelectItem key={d} value={d}>{d}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label>I am a</Label>
              <Select value={role} onValueChange={setRole}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="patient">Patient</SelectItem>
                  <SelectItem value="doctor">Doctor</SelectItem>
                  <SelectItem value="clinic">Clinic</SelectItem>
                  <SelectItem value="ambulance">Ambulance Admin</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Creating account..." : "Sign Up"}
            </Button>
          </form>
          <p className="mt-4 text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link to="/login" className="text-primary hover:underline font-medium">Sign In</Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
