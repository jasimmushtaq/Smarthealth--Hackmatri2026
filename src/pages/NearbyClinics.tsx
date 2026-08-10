import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Link } from "react-router-dom";
import { MapPin, Navigation, Phone, Map as MapIcon, Loader2, Eye, Building2, LocateFixed, Stethoscope } from "lucide-react";
import { toast } from "sonner";
import { INDIAN_STATES, STATE_DISTRICT_MAPPING } from "@/lib/states-data";
import { useAuth } from "@/contexts/AuthContext";

// Haversine formula to calculate distance between two coordinates in km
function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2); 
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
  return R * c;
}

interface ClinicWithDistance {
  id: string;
  name: string;
  address: string;
  state: string;
  district: string;
  contact_number: string;
  latitude: number;
  longitude: number;
  logo_url: string | null;
  distance?: number;
}

export default function NearbyClinics() {
  const { user } = useAuth();
  const [clinics, setClinics] = useState<ClinicWithDistance[]>([]);
  const [loading, setLoading] = useState(false);
  const [fetchingLocation, setFetchingLocation] = useState(false);
  const [userLocation, setUserLocation] = useState<{lat: number, lng: number} | null>(null);

  const [state, setState] = useState("");
  const [district, setDistrict] = useState("");
  const [isLocationLocked, setIsLocationLocked] = useState(false);

  // Fetch user profile to set default location
  useEffect(() => {
    if (user) {
      supabase.from("profiles").select("state, district").eq("user_id", user.id).maybeSingle()
        .then(({ data }) => {
          if (data?.state && data?.district) {
            setState(data.state);
            setDistrict(data.district);
            setIsLocationLocked(true);
          } else {
            if (data?.state) setState(data.state);
            if (data?.district) setDistrict(data.district);
          }
        });
    }
  }, [user]);

  const fetchClinics = async () => {
    setLoading(true);
    let query = supabase
      .from("clinics")
      .select("*")
      .eq("is_approved", true)
      .not("latitude", "is", null)
      .not("longitude", "is", null);

    if (!userLocation) {
      if (state && state !== "all") query = query.eq("state", state);
      if (district && district !== "all") query = query.ilike("district", `%${district}%`);
    }

    const { data, error } = await query;

    if (error) {
      toast.error("Failed to load clinics");
      setLoading(false);
      return;
    }

    let result = (data || []) as ClinicWithDistance[];

    if (userLocation) {
      result = result.map(clinic => ({
        ...clinic,
        distance: calculateDistance(userLocation.lat, userLocation.lng, clinic.latitude, clinic.longitude)
      })).sort((a, b) => (a.distance || 0) - (b.distance || 0));
    } else {
      result.sort((a, b) => a.name.localeCompare(b.name));
    }

    setClinics(result);
    setLoading(false);
  };

  useEffect(() => {
    fetchClinics();
  }, [state, district, userLocation]);

  const handleStateChange = (val: string) => {
    setState(val);
    setDistrict("");
  };

  const handleFindNearby = () => {
    if (!navigator.geolocation) {
      toast.error("Geolocation is not supported by your browser");
      return;
    }

    setFetchingLocation(true);
    
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setUserLocation({ lat: position.coords.latitude, lng: position.coords.longitude });
        if (!isLocationLocked) {
          setState("all");
          setDistrict("all");
        }
        setFetchingLocation(false);
        toast.success("Live location active! Showing closest clinics.");
      },
      (error) => {
        setFetchingLocation(false);
        toast.error("Failed to get location. Please allow location permissions.");
      }
    );
  };

  const getGoogleMapsLink = (lat: number, lng: number) => {
    return `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`;
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl min-h-[calc(100vh-200px)]">
      {/* Header Section */}
      <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-6 bg-gradient-to-r from-blue-50 to-indigo-50/30 p-6 md:p-8 rounded-2xl border border-blue-100/50 shadow-sm">
        <div>
          <div className="inline-flex items-center justify-center p-3 bg-blue-600 rounded-xl mb-4 shadow-lg shadow-blue-200">
            <Building2 className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">
            Verified Clinics Near You
          </h1>
          <p className="text-slate-600 mt-2 max-w-2xl text-lg">
            Find and book appointments at SwasthyaCare certified medical clinics and healthcare centers in your area.
          </p>
        </div>
        
        <Button 
          onClick={handleFindNearby} 
          disabled={fetchingLocation} 
          size="lg" 
          className="shadow-xl shadow-blue-200/50 hover:shadow-blue-300 transition-all duration-300 h-12 px-6 rounded-full group"
        >
          {fetchingLocation ? (
            <><Loader2 className="h-5 w-5 mr-2 animate-spin" /> Locating...</>
          ) : (
            <>
              <LocateFixed className={`h-5 w-5 mr-2 ${userLocation ? 'text-green-300' : 'text-blue-200 group-hover:scale-110 transition-transform'}`} /> 
              {userLocation ? "Location Active" : "Use Live Location"}
            </>
          )}
        </Button>
      </div>

      {/* Filter Section */}
      <Card className="mb-8 shadow-sm border-blue-100/50 bg-white/50 backdrop-blur-sm">
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label className="text-slate-700 font-semibold">Select State</Label>
              <Select value={state} onValueChange={handleStateChange} disabled={isLocationLocked}>
                <SelectTrigger className="h-12 bg-white"><SelectValue placeholder="All States" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All States</SelectItem>
                  {INDIAN_STATES.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label className="text-slate-700 font-semibold">Select District</Label>
              <Select value={district || "all"} onValueChange={(val) => setDistrict(val === "all" ? "" : val)} disabled={isLocationLocked || !state || state === "all"}>
                <SelectTrigger className="h-12 bg-white"><SelectValue placeholder={state ? "All Districts" : "Select state first"} /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Districts</SelectItem>
                  {(STATE_DISTRICT_MAPPING[state as keyof typeof STATE_DISTRICT_MAPPING] || []).map((d) => (
                    <SelectItem key={d} value={d}>{d}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Results Section */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map(i => (
            <Card key={i} className="animate-pulse h-[300px] bg-slate-100 border-0 rounded-2xl" />
          ))}
        </div>
      ) : clinics.length === 0 ? (
        <div className="text-center py-24 bg-slate-50/50 rounded-2xl border-2 border-dashed border-slate-200 flex flex-col items-center justify-center">
          <div className="bg-white p-4 rounded-full shadow-sm mb-4">
            <MapPin className="h-10 w-10 text-slate-400" />
          </div>
          <h3 className="text-2xl font-bold text-slate-900">No Clinics Found</h3>
          <p className="text-slate-500 mt-2 max-w-md">Try selecting a different state or district, or use your live location to find clinics near you.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {clinics.map((clinic) => (
            <Card 
              key={clinic.id} 
              className="group overflow-hidden hover:-translate-y-1 hover:shadow-xl transition-all duration-300 border-slate-200/60 rounded-2xl flex flex-col bg-white"
            >
              {clinic.logo_url ? (
                <div className="h-48 w-full bg-slate-100 overflow-hidden relative">
                  <img src={clinic.logo_url} alt={clinic.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-t from-black/50 to-transparent pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              ) : (
                <div className="h-2 w-full bg-gradient-to-r from-blue-500 to-cyan-400" />
              )}
              
              <CardHeader className="pb-4">
                <div className="flex justify-between items-start gap-4">
                  <CardTitle className="text-xl font-bold text-slate-900 group-hover:text-blue-600 transition-colors line-clamp-1">
                    {clinic.name}
                  </CardTitle>
                  {clinic.distance !== undefined && (
                    <Badge className="bg-blue-50 text-blue-700 hover:bg-blue-100 border-blue-200 shrink-0 px-3 py-1 rounded-full font-semibold">
                      {clinic.distance.toFixed(1)} km
                    </Badge>
                  )}
                </div>
                <CardDescription className="flex items-center gap-1.5 mt-2 text-sm text-slate-600">
                  <MapPin className="h-4 w-4 text-blue-500 shrink-0" />
                  <span className="font-medium">{clinic.district}, {clinic.state}</span>
                </CardDescription>
              </CardHeader>
              
              <CardContent className="pt-0 pb-4 space-y-4 flex-1">
                {clinic.address && (
                  <p className="text-sm text-slate-500 line-clamp-2 leading-relaxed h-[40px]">
                    {clinic.address}
                  </p>
                )}
                
                {clinic.contact_number && (
                  <div className="flex items-center gap-3 text-sm text-slate-700 bg-slate-50 p-3 rounded-xl border border-slate-100">
                    <div className="bg-white p-1.5 rounded-lg shadow-sm">
                      <Phone className="h-4 w-4 text-blue-600" />
                    </div>
                    <span className="font-semibold tracking-wide">{clinic.contact_number}</span>
                  </div>
                )}
              </CardContent>
              
              <CardFooter className="pt-4 pb-5 px-6 border-t border-slate-100 flex gap-3 mt-auto bg-slate-50/50">
                <Button 
                  variant="outline" 
                  className="w-12 shrink-0 h-11 rounded-xl border-slate-200 hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200 transition-colors"
                  onClick={() => window.open(getGoogleMapsLink(clinic.latitude, clinic.longitude), "_blank")}
                  title="View on Google Maps"
                >
                  <Navigation className="h-5 w-5" />
                </Button>
                <Link to={`/clinics/${clinic.id}`} className="flex-1">
                  <Button className="w-full h-11 rounded-xl bg-slate-900 hover:bg-blue-600 text-white transition-colors group-hover:shadow-md">
                    <Eye className="h-4 w-4 mr-2" />
                    View Profile
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
