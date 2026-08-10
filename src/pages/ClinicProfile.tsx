import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { DoctorCard } from "@/components/DoctorCard";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Loader2, MapPin, Phone, Mail, Globe, Map as MapIcon, Building2, Clock, Calendar, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { StarRating } from "@/components/StarRating";

export default function ClinicProfile() {
  const { id } = useParams<{ id: string }>();
  const { user, role } = useAuth();
  const [clinic, setClinic] = useState<any>(null);
  const [doctors, setDoctors] = useState<any[]>([]);
  const [averageRating, setAverageRating] = useState(0);
  const [totalRatings, setTotalRatings] = useState(0);
  const [userRating, setUserRating] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      if (!id) return;
      setLoading(true);

      // Fetch clinic details safely (excluding registration_number)
      const { data: clinicData, error: clinicError } = await supabase
        .from("clinics")
        .select(`id, name, address, state, district, latitude, longitude, contact_number, is_approved, created_at, logo_url, description, year_established, country, city, area, landmark, pincode, google_maps_url, contact_person, alternate_number, email, website, whatsapp_number, clinic_type, services`)
        .eq("id", id)
        .maybeSingle();

      if (clinicError || !clinicData) {
        toast.error("Failed to load clinic profile");
        setLoading(false);
        return;
      }

      setClinic(clinicData);

      // Fetch doctors for this clinic
      const { data: doctorsData, error: doctorsError } = await supabase
        .from("doctors")
        .select("*")
        .eq("clinic_id", id);

      if (!doctorsError && doctorsData) {
        setDoctors(doctorsData);
      }
      
      // Fetch ratings
      const { data: ratingsData } = await supabase
        .from("ratings")
        .select("*")
        .eq("target_id", id)
        .eq("target_type", "clinic");

      if (ratingsData) {
        setTotalRatings(ratingsData.length);
        if (ratingsData.length > 0) {
          const sum = ratingsData.reduce((acc, curr) => acc + curr.rating, 0);
          setAverageRating(Math.round((sum / ratingsData.length) * 10) / 10);
        }
        if (user) {
          const uRating = ratingsData.find((r) => r.user_id === user.id);
          if (uRating) setUserRating(uRating.rating);
        }
      }

      setLoading(false);
    }
    fetchData();
  }, [id, user]);

  const handleRate = async (rating: number) => {
    if (!user || role !== "patient") {
      toast.error("Only patients can leave a rating.");
      return;
    }
    
    setUserRating(rating);

    const { error } = await supabase.from("ratings").upsert({
      user_id: user.id,
      target_id: id,
      target_type: "clinic",
      rating,
    }, { onConflict: "user_id,target_id,target_type" });

    if (error) {
      console.error("Rating submission error:", error);
      toast.error(`Failed to submit rating: ${error.message}`);
      return;
    }

    toast.success("Thank you for your rating!");
    
    // Refetch ratings
    const { data: newRatings } = await supabase.from("ratings").select("*").eq("target_id", id).eq("target_type", "clinic");
    if (newRatings) {
      setTotalRatings(newRatings.length);
      if (newRatings.length > 0) {
        const sum = newRatings.reduce((acc, curr) => acc + curr.rating, 0);
        setAverageRating(Math.round((sum / newRatings.length) * 10) / 10);
      }
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-64px)]">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  if (!clinic) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-64px)]">
        <div className="text-center space-y-4">
          <Building2 className="h-16 w-16 mx-auto text-muted-foreground opacity-50" />
          <h2 className="text-2xl font-bold">Clinic Not Found</h2>
          <p className="text-muted-foreground">The clinic you are looking for does not exist or has been removed.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-64px)] bg-muted/20 pb-12 animate-in fade-in duration-500">
      {/* Hero Banner */}
      {clinic.logo_url && (
        <div className="w-full h-48 md:h-72 relative bg-slate-900 overflow-hidden">
          <img src={clinic.logo_url} alt={clinic.name} className="w-full h-full object-cover opacity-90" />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent pointer-events-none" />
        </div>
      )}

      {/* Hero Header */}
      <div className={`bg-white border-b sticky top-[64px] z-10 shadow-sm ${clinic.logo_url ? 'relative -mt-6 md:-mt-10 rounded-t-3xl border-t' : ''}`}>
        <div className="container mx-auto px-4 py-6 max-w-6xl">
          <div className="flex flex-col md:flex-row gap-6 items-start md:items-center justify-between">
            <div className="flex items-center gap-5">
              <div className="h-20 w-20 rounded-xl bg-primary/10 flex items-center justify-center shrink-0 border border-primary/20 shadow-sm overflow-hidden">
                {clinic.logo_url ? (
                  <img src={clinic.logo_url} alt={clinic.name} className="h-full w-full object-cover" />
                ) : (
                  <Building2 className="h-10 w-10 text-primary" />
                )}
              </div>
              <div>
                <div className="flex items-center gap-3 mb-1 flex-wrap">
                  <h1 className="text-3xl font-bold text-foreground">{clinic.name}</h1>
                  {clinic.clinic_type && (
                    <Badge variant="secondary" className="bg-blue-100 text-blue-800 hover:bg-blue-200">{clinic.clinic_type}</Badge>
                  )}
                  {clinic.is_approved && (
                    <Badge variant="outline" className="border-green-500 text-green-700 bg-green-50 gap-1 shadow-sm">
                      <CheckCircle2 className="h-3 w-3" /> Verified
                    </Badge>
                  )}
                </div>
                
                <div className="mb-2 flex items-center gap-4 flex-wrap">
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
                <p className="text-muted-foreground flex items-center gap-1.5 font-medium">
                  <MapPin className="h-4 w-4" />
                  {[clinic.area, clinic.city, clinic.district, clinic.state].filter(Boolean).join(", ")}
                </p>
              </div>
            </div>
            <div className="flex gap-3 w-full md:w-auto">
              {(clinic.latitude && clinic.longitude) || clinic.google_maps_url ? (
                <Button 
                  onClick={() => window.open(clinic.google_maps_url || `https://www.google.com/maps/search/?api=1&query=${clinic.latitude},${clinic.longitude}`, "_blank")}
                  className="w-full md:w-auto shadow-md hover:-translate-y-0.5 transition-transform"
                >
                  <MapIcon className="h-4 w-4 mr-2" /> View on Map
                </Button>
              ) : null}
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Main Content (Left) */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* About Section */}
            {clinic.description && (
              <section className="bg-white p-6 rounded-2xl shadow-sm border border-border/50 hover:shadow-md transition-shadow">
                <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                  <Building2 className="h-5 w-5 text-primary" /> About Clinic
                </h2>
                <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap">
                  {clinic.description}
                </p>
                {clinic.year_established && (
                  <p className="mt-4 text-sm text-slate-500 flex items-center gap-1.5 font-medium">
                    <Calendar className="h-4 w-4" /> Established in {clinic.year_established}
                  </p>
                )}
              </section>
            )}

            {/* Doctors Section */}
            <section>
              <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-primary" /> Available Doctors ({doctors.length})
              </h2>
              {doctors.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {doctors.map(doctor => (
                    <DoctorCard key={doctor.id} doctor={doctor} slots={[]} leaves={[]} />
                  ))}
                </div>
              ) : (
                <Card className="border-dashed bg-transparent shadow-none border-2">
                  <CardContent className="p-8 text-center text-muted-foreground">
                    No doctors have been listed for this clinic yet.
                  </CardContent>
                </Card>
              )}
            </section>
            
          </div>

          {/* Sidebar (Right) */}
          <div className="space-y-6">
            
            {/* Services */}
            {clinic.services && clinic.services.length > 0 && (
              <Card className="shadow-sm border-border/50 hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                    <CheckCircle2 className="h-5 w-5 text-primary" /> Services Available
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {clinic.services.map((service: string) => (
                      <Badge key={service} variant="secondary" className="px-3 py-1 bg-primary/5 text-primary-900 border border-primary/10 hover:bg-primary/10 transition-colors">
                        {service}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Contact Info */}
            <Card className="shadow-sm border-border/50 hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <h3 className="font-bold text-lg mb-5 flex items-center gap-2">
                  <Phone className="h-5 w-5 text-primary" /> Contact Details
                </h3>
                <div className="space-y-4">
                  {clinic.contact_number && (
                    <div className="flex items-start gap-3 group">
                      <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0 group-hover:bg-primary group-hover:text-white transition-colors">
                        <Phone className="h-4 w-4 text-primary group-hover:text-white" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-slate-900">Phone</p>
                        <p className="text-sm text-muted-foreground">{clinic.contact_number}</p>
                        {clinic.alternate_number && (
                          <p className="text-sm text-muted-foreground">{clinic.alternate_number}</p>
                        )}
                      </div>
                    </div>
                  )}

                  {clinic.email && (
                    <div className="flex items-start gap-3 group">
                      <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0 group-hover:bg-primary group-hover:text-white transition-colors">
                        <Mail className="h-4 w-4 text-primary group-hover:text-white" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-slate-900">Email</p>
                        <a href={`mailto:${clinic.email}`} className="text-sm text-primary hover:underline font-medium">{clinic.email}</a>
                      </div>
                    </div>
                  )}

                  {clinic.website && (
                    <div className="flex items-start gap-3 group">
                      <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0 group-hover:bg-primary group-hover:text-white transition-colors">
                        <Globe className="h-4 w-4 text-primary group-hover:text-white" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-slate-900">Website</p>
                        <a href={clinic.website} target="_blank" rel="noopener noreferrer" className="text-sm text-primary hover:underline font-medium break-all">
                          {clinic.website}
                        </a>
                      </div>
                    </div>
                  )}

                  <div className="flex items-start gap-3 pt-2">
                    <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                      <MapPin className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-slate-900">Address</p>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {[clinic.address, clinic.landmark, clinic.area, clinic.city, clinic.district, clinic.state, clinic.pincode].filter(Boolean).join(", ")}
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

          </div>
        </div>
      </div>
    </div>
  );
}
