import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Stethoscope, MapPin, Building2, DoorOpen, BriefcaseMedical, IndianRupee, Languages, Clock, Calendar } from "lucide-react";
import { DAYS_OF_WEEK } from "@/lib/constants";
import { formatTime, isAvailableNow, isAvailableToday } from "@/lib/availability";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { StarRating } from "@/components/StarRating";

export default function DoctorProfile() {
  const { id } = useParams<{ id: string }>();
  const { user, role } = useAuth();
  const { toast } = useToast();
  const [doctor, setDoctor] = useState<any>(null);
  const [slots, setSlots] = useState<any[]>([]);
  const [leaves, setLeaves] = useState<any[]>([]);
  const [averageRating, setAverageRating] = useState(0);
  const [totalRatings, setTotalRatings] = useState(0);
  const [userRating, setUserRating] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    const fetch = async () => {
      const [{ data: doc }, { data: sl }, { data: lv }, { data: ratings }] = await Promise.all([
        supabase.from("doctors").select("*").eq("id", id).single(),
        supabase.from("availability_slots").select("*").eq("doctor_id", id).order("day_of_week"),
        supabase.from("doctor_leaves").select("*").eq("doctor_id", id).order("start_date"),
        supabase.from("ratings").select("*").eq("target_id", id).eq("target_type", "doctor"),
      ]);
      setDoctor(doc);
      setSlots(sl || []);
      setLeaves(lv || []);
      
      if (ratings) {
        setTotalRatings(ratings.length);
        if (ratings.length > 0) {
          const sum = ratings.reduce((acc, curr) => acc + curr.rating, 0);
          setAverageRating(Math.round((sum / ratings.length) * 10) / 10);
        }
        if (user) {
          const uRating = ratings.find((r) => r.user_id === user.id);
          if (uRating) setUserRating(uRating.rating);
        }
      }
      setLoading(false);
    };
    fetch();
  }, [id, user]);

  const handleRate = async (rating: number) => {
    if (!user || role !== "patient") {
      toast({
        title: "Authentication Required",
        description: "Only patients can leave a rating.",
        variant: "destructive",
      });
      return;
    }
    
    // Update local state optimistically
    setUserRating(rating);

    const { error } = await supabase.from("ratings").upsert({
      user_id: user.id,
      target_id: id,
      target_type: "doctor",
      rating,
    }, { onConflict: "user_id,target_id,target_type" });

    if (error) {
      console.error("Rating submission error:", error);
      toast({
        title: "Error",
        description: `Failed to submit rating: ${error.message}`,
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Success",
      description: "Thank you for your rating!",
    });
    
    // Refetch ratings to update average
    const { data: newRatings } = await supabase.from("ratings").select("*").eq("target_id", id).eq("target_type", "doctor");
    if (newRatings) {
      setTotalRatings(newRatings.length);
      if (newRatings.length > 0) {
        const sum = newRatings.reduce((acc, curr) => acc + curr.rating, 0);
        setAverageRating(Math.round((sum / newRatings.length) * 10) / 10);
      }
    }
  };

  if (loading) return <div className="container mx-auto p-8"><div className="h-64 bg-muted animate-pulse rounded-xl" /></div>;
  if (!doctor) return <div className="container mx-auto p-8 text-center text-muted-foreground">Doctor not found</div>;

  const availToday = isAvailableToday(slots, leaves, doctor.status);
  const availNow = isAvailableNow(slots, leaves, doctor.status);

  const statusColor = doctor.status === "available" ? "bg-success text-success-foreground" :
    doctor.status === "on_leave" ? "bg-warning text-warning-foreground" : "bg-muted text-muted-foreground";

  const slotsByDay = slots.reduce((acc: Record<number, any[]>, s) => {
    if (!acc[s.day_of_week]) acc[s.day_of_week] = [];
    acc[s.day_of_week].push(s);
    return acc;
  }, {});

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <Card className="shadow-lg">
        <CardContent className="p-6 md:p-8">
          <div className="flex items-start gap-6">
            <Avatar className="h-20 w-20 shrink-0 border-4 border-primary/10">
              <AvatarImage src={doctor.profile_image_url} alt={doctor.full_name} className="object-cover" />
              <AvatarFallback className="gradient-primary text-primary-foreground font-bold text-3xl">
                {doctor.full_name?.charAt(0) || "D"}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <div className="flex items-center gap-3 flex-wrap">
                <h1 className="text-2xl font-bold text-foreground">{doctor.full_name}</h1>
                <Badge className={statusColor}>{doctor.status === "available" ? "Available" : doctor.status === "on_leave" ? "On Leave" : "Not Available"}</Badge>
                {availNow && <Badge className="bg-success text-success-foreground animate-pulse">Available Now</Badge>}
                {!availNow && availToday && <Badge variant="outline" className="border-success text-success">Available Today</Badge>}
              </div>
              
              <div className="mt-2 flex items-center gap-4 flex-wrap">
                <StarRating 
                  rating={averageRating} 
                  totalRatings={totalRatings} 
                  readonly 
                  size="sm"
                />
                
                {role === "patient" && (
                  <div className="flex items-center gap-2 border-l pl-4 border-border">
                    <span className="text-sm font-medium text-muted-foreground">Your Rating:</span>
                    <StarRating 
                      rating={userRating} 
                      onRate={handleRate} 
                      size="sm"
                    />
                  </div>
                )}
              </div>
              {doctor.specialization && (
                <p className="text-primary flex items-center gap-1 mt-1 font-medium"><Stethoscope className="h-4 w-4" />{doctor.specialization}</p>
              )}
              {doctor.bio && <p className="mt-3 text-muted-foreground">{doctor.bio}</p>}

              <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                {doctor.hospital_name && <div className="flex items-center gap-2 text-muted-foreground"><Building2 className="h-4 w-4" />{doctor.hospital_name}</div>}
                {doctor.room_number && <div className="flex items-center gap-2 text-muted-foreground"><DoorOpen className="h-4 w-4" />Room {doctor.room_number}</div>}
                {(doctor.state || doctor.district || doctor.area) && (
                  <div className="flex items-center gap-2 text-muted-foreground"><MapPin className="h-4 w-4" />{[doctor.area, doctor.district, doctor.state].filter(Boolean).join(", ")}</div>
                )}
                {doctor.experience_years != null && <div className="flex items-center gap-2 text-muted-foreground"><BriefcaseMedical className="h-4 w-4" />{doctor.experience_years} years experience</div>}
                {doctor.consultation_fee != null && <div className="flex items-center gap-2 text-muted-foreground"><IndianRupee className="h-4 w-4" />₹{doctor.consultation_fee}</div>}
                {doctor.languages?.length > 0 && <div className="flex items-center gap-2 text-muted-foreground"><Languages className="h-4 w-4" />{doctor.languages.join(", ")}</div>}
                {doctor.gender && <div className="flex items-center gap-2 text-muted-foreground capitalize">{doctor.gender}</div>}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Availability */}
      <Card className="mt-6 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><Clock className="h-5 w-5 text-primary" />Weekly Schedule</CardTitle>
        </CardHeader>
        <CardContent>
          {Object.keys(slotsByDay).length === 0 ? (
            <p className="text-muted-foreground text-sm">No availability slots set</p>
          ) : (
            <div className="space-y-3">
              {[0, 1, 2, 3, 4, 5, 6].filter((d) => slotsByDay[d]).map((d) => (
                <div key={d} className="flex items-center gap-4">
                  <span className="font-medium w-28 text-sm">{DAYS_OF_WEEK[d]}</span>
                  <div className="flex flex-wrap gap-2">
                    {slotsByDay[d].map((s: any) => (
                      <Badge key={s.id} variant={s.is_active ? "default" : "secondary"} className="text-xs">
                        {formatTime(s.start_time)} – {formatTime(s.end_time)}
                      </Badge>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Upcoming Leaves */}
      {leaves.length > 0 && (
        <Card className="mt-6 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Calendar className="h-5 w-5 text-warning" />Upcoming Leaves</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {leaves.filter((l) => l.end_date >= new Date().toISOString().split("T")[0]).map((l) => (
                <div key={l.id} className="flex items-center gap-3 text-sm">
                  <Badge variant="outline" className="text-warning border-warning">{l.start_date} → {l.end_date}</Badge>
                  {l.reason && <span className="text-muted-foreground">{l.reason}</span>}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
