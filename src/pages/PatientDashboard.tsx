import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DoctorCard } from "@/components/DoctorCard";
import { toast } from "sonner";
import { INDIAN_STATES, STATE_DISTRICT_MAPPING } from "@/lib/states-data";
import { MapPin } from "lucide-react";

export default function PatientDashboard() {
  const { user } = useAuth();
  const [profile, setProfile] = useState<any>(null);
  const [state, setState] = useState("");
  const [district, setDistrict] = useState("");

  const handleStateChange = (val: string) => {
    setState(val);
    setDistrict("");
  };
  const [doctors, setDoctors] = useState<any[]>([]);
  const [slots, setSlots] = useState<Record<string, any[]>>({});
  const [leaves, setLeaves] = useState<Record<string, any[]>>({});

  useEffect(() => {
    if (!user) return;
    supabase.from("profiles").select("*").eq("user_id", user.id).maybeSingle().then(({ data }) => {
      if (data) { setProfile(data); setState(data.state || ""); setDistrict(data.district || ""); }
    });
  }, [user]);

  useEffect(() => {
    const fetchDoctors = async () => {
      let q = supabase.from("doctors").select("*");
      if (state) q = q.eq("state", state);
      if (district && district !== "all") q = q.ilike("district", `%${district}%`);
      const { data: docs } = await q;
      setDoctors(docs || []);

      if (docs && docs.length > 0) {
        const ids = docs.map((d) => d.id);
        const [{ data: sl }, { data: lv }] = await Promise.all([
          supabase.from("availability_slots").select("*").in("doctor_id", ids),
          supabase.from("doctor_leaves").select("*").in("doctor_id", ids),
        ]);
        const sm: Record<string, any[]> = {};
        (sl || []).forEach((s) => { if (!sm[s.doctor_id]) sm[s.doctor_id] = []; sm[s.doctor_id].push(s); });
        setSlots(sm);
        const lm: Record<string, any[]> = {};
        (lv || []).forEach((l) => { if (!lm[l.doctor_id]) lm[l.doctor_id] = []; lm[l.doctor_id].push(l); });
        setLeaves(lm);
      }
    };
    fetchDoctors();
  }, [state, district]);



  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      <h1 className="text-2xl font-bold mb-6 text-foreground">Patient Dashboard</h1>

      <Card className="mb-8">
        <CardHeader><CardTitle className="flex items-center gap-2"><MapPin className="h-5 w-5 text-primary" />Find Doctors by Location</CardTitle></CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label>State</Label>
              <Select value={state} onValueChange={handleStateChange} disabled={true}>
                <SelectTrigger><SelectValue placeholder="Select state" /></SelectTrigger>
                <SelectContent>
                  {profile?.state ? (
                    <SelectItem value={profile.state}>{profile.state}</SelectItem>
                  ) : (
                    INDIAN_STATES.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)
                  )}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>District</Label>
              <Select value={district || "all"} onValueChange={(val) => setDistrict(val === "all" ? "" : val)} disabled={!state}>
                <SelectTrigger><SelectValue placeholder={state ? "Select district" : "Select state first"} /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Districts</SelectItem>
                  {(STATE_DISTRICT_MAPPING[state] || []).map((d) => (
                    <SelectItem key={d} value={d}>{d}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-end">
              <p className="text-xs text-muted-foreground pb-2">You can only search for doctors within your registered state.</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <h2 className="text-lg font-semibold mb-4">Doctors Near You</h2>
      {doctors.length === 0 ? (
        <p className="text-muted-foreground text-center py-8">No doctors found in your area. Try adjusting your location.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {doctors.map((d) => <DoctorCard key={d.id} doctor={d} slots={slots[d.id] || []} leaves={leaves[d.id] || []} />)}
        </div>
      )}
    </div>
  );
}
