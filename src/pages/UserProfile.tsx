import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { INDIAN_STATES, STATE_DISTRICT_MAPPING } from "@/lib/states-data";
import { User, MapPin, Mail, Loader2, Save, LogOut } from "lucide-react";

export default function UserProfile() {
  const { user, role, signOut } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [profile, setProfile] = useState<any>(null);
  
  const [fullName, setFullName] = useState("");
  const [state, setState] = useState("");
  const [district, setDistrict] = useState("");

  const handleStateChange = (val: string) => {
    setState(val);
    setDistrict("");
  };

  useEffect(() => {
    if (!user) return;
    
    const fetchProfile = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("user_id", user.id)
        .maybeSingle();
        
      if (error) {
        toast.error("Failed to load profile");
      } else if (data) {
        setProfile(data);
        setFullName(data.full_name || "");
        setState(data.state || "");
        setDistrict(data.district || "");
      }
      setLoading(false);
    };

    fetchProfile();
  }, [user]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    
    setSaving(true);
    const { error } = await supabase
      .from("profiles")
      .update({ 
        full_name: fullName,
      })
      .eq("user_id", user.id);
      
    setSaving(false);
    
    if (error) {
      toast.error(error.message);
    } else {
      toast.success("Profile updated successfully!");
    }
  };

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-64px)]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground flex items-center gap-2">
          <User className="h-8 w-8 text-primary" />
          My Profile
        </h1>
        <p className="text-muted-foreground mt-2">Manage your account information and preferences.</p>
      </div>

      <Card className="shadow-md border-border/50">
        <CardHeader className="bg-muted/30 border-b border-border/50">
          <CardTitle>Personal Information</CardTitle>
          <CardDescription>Update your personal details here.</CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <form onSubmit={handleSave} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="email" className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  Email Address
                </Label>
                <Input 
                  id="email" 
                  value={user?.email || ""} 
                  disabled 
                  className="bg-muted"
                />
                <p className="text-xs text-muted-foreground">Your email cannot be changed.</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="role" className="flex items-center gap-2">
                  <User className="h-4 w-4 text-muted-foreground" />
                  Account Role
                </Label>
                <Input 
                  id="role" 
                  value={role ? role.charAt(0).toUpperCase() + role.slice(1) : ""} 
                  disabled 
                  className="bg-muted"
                />
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="fullName">Full Name</Label>
                <Input 
                  id="fullName" 
                  value={fullName} 
                  onChange={(e) => setFullName(e.target.value)} 
                  placeholder="Your full name"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  State
                </Label>
                <Select value={state} onValueChange={handleStateChange} disabled={true}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select state" />
                  </SelectTrigger>
                  <SelectContent>
                    {INDIAN_STATES.map((s) => (
                      <SelectItem key={s} value={s}>{s}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground">Location cannot be changed after registration.</p>
              </div>

              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  District
                </Label>
                <Select value={district} onValueChange={setDistrict} disabled={true}>
                  <SelectTrigger>
                    <SelectValue placeholder={state ? "Select district" : "Select state first"} />
                  </SelectTrigger>
                  <SelectContent>
                    {(STATE_DISTRICT_MAPPING[state] || []).map((d) => (
                      <SelectItem key={d} value={d}>{d}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex justify-between pt-4 border-t border-border/50">
              <Button type="button" variant="destructive" onClick={handleSignOut} className="min-w-[120px]">
                <LogOut className="mr-2 h-4 w-4" /> Sign Out
              </Button>
              <Button type="submit" disabled={saving} className="min-w-[120px]">
                {saving ? (
                  <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving...</>
                ) : (
                  <><Save className="mr-2 h-4 w-4" /> Save Changes</>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
