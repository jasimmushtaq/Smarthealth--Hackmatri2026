import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { DoctorCard } from "@/components/DoctorCard";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Search, Stethoscope, Filter } from "lucide-react";
import { SPECIALIZATIONS, INDIAN_STATES } from "@/lib/constants";
import { STATES_AND_DISTRICTS_RAW } from "@/lib/states-data";
import { useAuth } from "@/contexts/AuthContext";
import Landing from "@/components/Landing";

export default function Index() {
  const { user } = useAuth();
  const [doctors, setDoctors] = useState<any[]>([]);
  const [slots, setSlots] = useState<Record<string, any[]>>({});
  const [leaves, setLeaves] = useState<Record<string, any[]>>({});
  const [search, setSearch] = useState("");
  const [specFilter, setSpecFilter] = useState("all");
  const [stateFilter, setStateFilter] = useState("all");
  const [districtFilter, setDistrictFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [userProfile, setUserProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const availableDistricts = stateFilter === "all"
    ? Array.from(new Set(STATES_AND_DISTRICTS_RAW.states.flatMap(s => s.districts))).sort()
    : STATES_AND_DISTRICTS_RAW.states.find(s => s.state === stateFilter)?.districts || [];

  const fetchData = async () => {
    if (!user) return;
    const [{ data: docs }, { data: allSlots }, { data: allLeaves }, { data: profile }] = await Promise.all([
      supabase.from("doctors").select("*").order("full_name"),
      supabase.from("availability_slots").select("*"),
      supabase.from("doctor_leaves").select("*"),
      supabase.from("profiles").select("*").eq("user_id", user.id).maybeSingle(),
    ]);

    setDoctors(docs || []);

    const slotMap: Record<string, any[]> = {};
    (allSlots || []).forEach((s) => {
      if (!slotMap[s.doctor_id]) slotMap[s.doctor_id] = [];
      slotMap[s.doctor_id].push(s);
    });
    setSlots(slotMap);

    const leaveMap: Record<string, any[]> = {};
    (allLeaves || []).forEach((l) => {
      if (!leaveMap[l.doctor_id]) leaveMap[l.doctor_id] = [];
      leaveMap[l.doctor_id].push(l);
    });
    setLeaves(leaveMap);

    if (profile && profile.state) {
      setUserProfile(profile);
      setStateFilter(profile.state);
    }

    setLoading(false);
  };

  useEffect(() => {
    if (!user) return;
    fetchData();

    const channel = supabase
      .channel("public-doctors")
      .on("postgres_changes", { event: "*", schema: "public", table: "doctors" }, () => fetchData())
      .on("postgres_changes", { event: "*", schema: "public", table: "availability_slots" }, () => fetchData())
      .on("postgres_changes", { event: "*", schema: "public", table: "doctor_leaves" }, () => fetchData())
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [user]);

  if (!user) {
    return <Landing />;
  }

  const filtered = doctors.filter((d) => {
    // Hard restrict to user's native state
    if (userProfile?.state && d.state !== userProfile.state) return false;

    if (search && !d.full_name?.toLowerCase().includes(search.toLowerCase()) && !d.specialization?.toLowerCase().includes(search.toLowerCase())) return false;
    if (specFilter !== "all" && d.specialization !== specFilter) return false;
    if (stateFilter !== "all" && d.state !== stateFilter) return false;
    if (districtFilter !== "all" && d.district !== districtFilter) return false;
    if (statusFilter !== "all" && d.status !== statusFilter) return false;
    return true;
  });

  return (
    <div className="container mx-auto px-4 py-12">
      {/* Hero */}
      <div className="text-center mb-16 relative">
        <div className="absolute inset-0 -z-10 flex items-center justify-center">
           <div className="w-64 h-64 bg-primary/10 rounded-full blur-3xl" />
        </div>
        <div className="inline-flex items-center gap-2 gradient-primary text-primary-foreground px-5 py-2.5 rounded-full text-sm font-semibold mb-6 shadow-xl shadow-primary/20 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <Stethoscope className="h-4 w-4 animate-pulse" /> Real-time Doctor Availability
        </div>
        <h1 className="text-4xl md:text-6xl font-extrabold text-foreground mb-6 tracking-tight animate-in fade-in slide-in-from-bottom-5 duration-700 delay-100">
          Find <span className="text-gradient">Available Doctors</span>
        </h1>
        <p className="text-muted-foreground text-lg md:text-xl max-w-2xl mx-auto leading-relaxed animate-in fade-in slide-in-from-bottom-6 duration-700 delay-200">
          Check doctor availability instantly. No booking needed — just find who's available right now.
        </p>
      </div>

      {/* Filters */}
      <div className="bg-card/60 backdrop-blur-xl rounded-3xl shadow-xl border border-primary/10 p-6 mb-12 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-300">
        <div className="flex items-center gap-2 mb-4 text-sm font-medium text-foreground">
          <Filter className="h-4 w-4 text-primary" /> Advanced Filters
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search doctors..." className="pl-9" value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
          <Select value={specFilter} onValueChange={setSpecFilter}>
            <SelectTrigger><SelectValue placeholder="Specialization" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Specializations</SelectItem>
              {SPECIALIZATIONS.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
            </SelectContent>
          </Select>
          <Select value={stateFilter} onValueChange={(val) => { setStateFilter(val); setDistrictFilter("all"); }} disabled={!!userProfile?.state}>
            <SelectTrigger><SelectValue placeholder="State" /></SelectTrigger>
            <SelectContent>
              {userProfile?.state ? (
                 <SelectItem value={userProfile.state}>{userProfile.state}</SelectItem>
              ) : (
                <>
                  <SelectItem value="all">All States</SelectItem>
                  {INDIAN_STATES.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                </>
              )}
            </SelectContent>
          </Select>
          <Select value={districtFilter} onValueChange={setDistrictFilter} disabled={availableDistricts.length === 0}>
            <SelectTrigger><SelectValue placeholder="District" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Districts</SelectItem>
              {availableDistricts.map((d) => <SelectItem key={d} value={d}>{d}</SelectItem>)}
            </SelectContent>
          </Select>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger><SelectValue placeholder="Status" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="available">Available</SelectItem>
              <SelectItem value="not_available">Not Available</SelectItem>
              <SelectItem value="on_leave">On Leave</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Results */}
      <div className="flex items-center justify-between mb-6 animate-in fade-in duration-700 delay-500">
        <p className="text-sm font-medium text-muted-foreground bg-muted/50 px-3 py-1.5 rounded-full">{filtered.length} doctor{filtered.length !== 1 ? "s" : ""} found</p>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="h-[220px] bg-muted/50 animate-pulse rounded-2xl border border-border/50" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-24 bg-card/40 backdrop-blur-sm rounded-3xl border border-border/50 animate-in fade-in zoom-in-95 duration-500">
          <Stethoscope className="h-16 w-16 mx-auto mb-4 text-primary/20" />
          <p className="text-xl font-semibold text-foreground mb-2">No doctors found</p>
          <p className="text-muted-foreground">Try adjusting your filters or search terms</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((d) => (
            <DoctorCard key={d.id} doctor={d} slots={slots[d.id] || []} leaves={leaves[d.id] || []} />
          ))}
        </div>
      )}
    </div>
  );
}
