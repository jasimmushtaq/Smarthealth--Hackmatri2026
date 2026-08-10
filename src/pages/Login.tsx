import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { Stethoscope } from "lucide-react";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { refreshRole } = useAuth();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      toast.error(error.message);
      setLoading(false);
      return;
    }

    toast.success("Logged in successfully");

    // Fetch role and refresh auth context
    const userId = data.user?.id;
    if (userId) {
      const { data: roleData } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", userId)
        .maybeSingle();

      // Refresh the role in AuthContext so ProtectedRoute sees it
      await refreshRole();

      const role = roleData?.role;
      if (role === "doctor") navigate("/doctor/dashboard");
      else if (role === "admin") navigate("/admin");
      else if (role === "clinic") navigate("/clinic/dashboard");
      else if (role === "ambulance") navigate("/ambulance/dashboard");
      else navigate("/");
    } else {
      navigate("/");
    }
    setLoading(false);
  };

  const handleDemoAmbulanceLogin = async () => {
    setLoading(true);
    const demoEmail = "jasimmushtaq786@gmail.com";
    const demoPassword = "jasim@4217";

    // Attempt login first
    let { data, error } = await supabase.auth.signInWithPassword({ email: demoEmail, password: demoPassword });
    
    // If user doesn't exist, sign them up
    if (error && error.message.includes("Invalid login")) {
      const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
        email: demoEmail,
        password: demoPassword,
        options: { data: { full_name: "Ambulance Admin" } }
      });
      
      if (signUpError) {
        toast.error("Failed to create demo account: " + signUpError.message);
        setLoading(false);
        return;
      }

      if (signUpData.user) {
        // Insert role
        await supabase.from("user_roles").insert({ user_id: signUpData.user.id, role: "ambulance" });
        // Login again
        const loginRes = await supabase.auth.signInWithPassword({ email: demoEmail, password: demoPassword });
        data = loginRes.data;
        error = loginRes.error;
      }
    }

    if (error) {
      toast.error(error.message);
      setLoading(false);
      return;
    }

    toast.success("Logged in as Ambulance Admin");
    await refreshRole();
    navigate("/ambulance/dashboard");
    setLoading(false);
  };

  return (
    <div className="relative min-h-[calc(100vh-64px)] flex items-center justify-center px-4 overflow-hidden">
      {/* Background with higher opacity to focus on the card */}
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
          <CardTitle className="text-2xl font-bold text-primary">Welcome Back</CardTitle>
          <CardDescription>Sign in to your SwasthyaCare account</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required placeholder="you@example.com" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required placeholder="••••••••" />
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Signing in..." : "Sign In"}
            </Button>
            
            <div className="relative my-4">
              <div className="absolute inset-0 flex items-center"><span className="w-full border-t" /></div>
              <div className="relative flex justify-center text-xs uppercase"><span className="bg-white px-2 text-muted-foreground">Or</span></div>
            </div>
            
            <Button type="button" variant="outline" className="w-full border-red-200 text-red-600 hover:bg-red-50" onClick={handleDemoAmbulanceLogin} disabled={loading}>
              Login as Ambulance Admin (Demo)
            </Button>
          </form>
          <p className="mt-4 text-center text-sm text-muted-foreground">
            Don't have an account?{" "}
            <Link to="/signup" className="text-primary hover:underline font-medium">Sign Up</Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
