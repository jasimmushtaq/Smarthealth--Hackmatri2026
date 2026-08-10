import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { MapPin, Building2, Save, Loader2 } from "lucide-react";
import { ClinicOnboardingForm } from "@/components/clinic/ClinicOnboardingForm";
import { Badge } from "@/components/ui/badge";

export default function ClinicDashboard() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [clinic, setClinic] = useState<any>(null);

  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    async function fetchClinic() {
      if (!user) return;
      const { data, error } = await supabase
        .from("clinics")
        .select("*")
        .eq("user_id", user.id)
        .maybeSingle();

      if (error) {
        toast.error("Failed to load clinic details");
      } else if (data) {
        setClinic(data);
        if (!data.clinic_type || !data.services || data.services.length === 0) {
          setIsEditing(true);
        }
      } else {
        // No clinic record found (possibly an older account), create one on the fly or just set empty state
        setClinic({
          id: "", // Will indicate it's new, but wait, onboarding expects ID.
          name: user.user_metadata?.full_name || "",
          user_id: user.id
        });
        setIsEditing(true);
      }
      setLoading(false);
    }
    fetchClinic();
  }, [user]);

  const handleOnboardingComplete = () => {
    setIsEditing(false);
    toast.success("Clinic details saved successfully!");
    // Refresh clinic data
    window.location.reload();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-64px)]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (isEditing) {
    return (
      <div className="container mx-auto px-4 py-8">
        <ClinicOnboardingForm clinic={clinic} onComplete={handleOnboardingComplete} />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-foreground flex items-center gap-2">
            <Building2 className="h-8 w-8 text-primary" />
            {clinic?.name || "Clinic Dashboard"}
          </h1>
          <p className="text-muted-foreground mt-2 flex items-center gap-2">
            <MapPin className="h-4 w-4" /> 
            {clinic?.city ? `${clinic.city}, ${clinic.state}` : clinic?.address || "Location not set"}
          </p>
        </div>
        <Button onClick={() => setIsEditing(true)}>
          Edit Profile
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label className="text-muted-foreground">Registration Number</Label>
              <p className="font-medium">{clinic?.registration_number || "N/A"}</p>
            </div>
            <div>
              <Label className="text-muted-foreground">Year Established</Label>
              <p className="font-medium">{clinic?.year_established || "N/A"}</p>
            </div>
            <div>
              <Label className="text-muted-foreground">About</Label>
              <p className="font-medium text-sm mt-1">{clinic?.description || "No description provided."}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Contact Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label className="text-muted-foreground">Contact Person</Label>
              <p className="font-medium">{clinic?.contact_person || "N/A"}</p>
            </div>
            <div>
              <Label className="text-muted-foreground">Mobile</Label>
              <p className="font-medium">{clinic?.contact_number || "N/A"}</p>
            </div>
            <div>
              <Label className="text-muted-foreground">Email</Label>
              <p className="font-medium">{clinic?.email || "N/A"}</p>
            </div>
          </CardContent>
        </Card>
        
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Services Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="mb-4">
              <Label className="text-muted-foreground">Primary Type</Label>
              <p className="font-medium">{clinic?.clinic_type || "General"}</p>
            </div>
            <div>
              <Label className="text-muted-foreground mb-2 block">Available Services</Label>
              <div className="flex flex-wrap gap-2">
                {clinic?.services && clinic.services.length > 0 ? (
                  clinic.services.map((s: string) => (
                    <Badge key={s} variant="secondary">{s}</Badge>
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground">No services listed.</p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
