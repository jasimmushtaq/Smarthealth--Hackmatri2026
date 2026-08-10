import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DoctorProfileForm } from "@/components/doctor/DoctorProfileForm";
import { DoctorAvailability } from "@/components/doctor/DoctorAvailability";
import { DoctorLeaves } from "@/components/doctor/DoctorLeaves";
import { DoctorStatusToggle } from "@/components/doctor/DoctorStatusToggle";
import { User, Clock, Calendar, Activity } from "lucide-react";

export default function DoctorDashboard() {
  const { user } = useAuth();
  const [doctor, setDoctor] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const fetchDoctor = async () => {
    if (!user) return;
    const { data } = await supabase.from("doctors").select("*").eq("user_id", user.id).maybeSingle();
    setDoctor(data);
    setLoading(false);
  };

  useEffect(() => { fetchDoctor(); }, [user]);

  const isProfileComplete = (doc: any) => {
    if (!doc) return false;
    return Boolean(
      doc.full_name?.trim() &&
      doc.specialization?.trim() &&
      doc.hospital_name?.trim() &&
      doc.state?.trim() &&
      doc.district?.trim() &&
      doc.bio?.trim() &&
      doc.profile_image_url?.trim()
    );
  };

  if (loading) return <div className="container mx-auto p-8"><div className="h-64 bg-muted animate-pulse rounded-xl" /></div>;

  const complete = isProfileComplete(doctor);

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-2xl font-bold mb-2 text-foreground">Doctor Dashboard</h1>
      
      {!complete && (
        <div className="bg-amber-50 border border-amber-200 text-amber-800 px-4 py-3 rounded-lg mb-6 flex gap-2 text-sm shadow-sm animate-pulse">
          <span className="font-bold">⚠️ Profile Incomplete:</span>
          <span>Please fill in every profile section (including specialization, hospital name, location, biography, and profile photo) to activate all account features.</span>
        </div>
      )}

      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList className="grid grid-cols-4 w-full">
          <TabsTrigger value="profile" className="flex items-center gap-1"><User className="h-4 w-4" />Profile</TabsTrigger>
          <TabsTrigger value="availability" className="flex items-center gap-1"><Clock className="h-4 w-4" />Availability</TabsTrigger>
          <TabsTrigger value="leaves" className="flex items-center gap-1"><Calendar className="h-4 w-4" />Leaves</TabsTrigger>
          <TabsTrigger value="status" className="flex items-center gap-1"><Activity className="h-4 w-4" />Status</TabsTrigger>
        </TabsList>

        <TabsContent value="profile">
          <DoctorProfileForm doctor={doctor} userId={user?.id || ""} onSave={fetchDoctor} />
        </TabsContent>
        <TabsContent value="availability">
          {complete && doctor ? (
            <DoctorAvailability doctorId={doctor.id} />
          ) : (
            <div className="p-6 border border-amber-200 bg-amber-50 rounded-lg text-amber-800 text-center">
              <p className="font-semibold">Profile Incomplete</p>
              <p className="text-sm mt-1">Please complete all profile details (including your profile photo) in the Profile tab to configure availability.</p>
            </div>
          )}
        </TabsContent>
        <TabsContent value="leaves">
          {complete && doctor ? (
            <DoctorLeaves doctorId={doctor.id} />
          ) : (
            <div className="p-6 border border-amber-200 bg-amber-50 rounded-lg text-amber-800 text-center">
              <p className="font-semibold">Profile Incomplete</p>
              <p className="text-sm mt-1">Please complete all profile details (including your profile photo) in the Profile tab to manage leaves.</p>
            </div>
          )}
        </TabsContent>
        <TabsContent value="status">
          {complete && doctor ? (
            <DoctorStatusToggle doctor={doctor} onUpdate={fetchDoctor} />
          ) : (
            <div className="p-6 border border-amber-200 bg-amber-50 rounded-lg text-amber-800 text-center">
              <p className="font-semibold">Profile Incomplete</p>
              <p className="text-sm mt-1">Please complete all profile details (including your profile photo) in the Profile tab to toggle availability status.</p>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
