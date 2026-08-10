import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Ambulance, MapPin, PhoneCall, AlertTriangle, ShieldCheck, Clock, Navigation, Car, IndianRupee, User, Info, LocateFixed } from "lucide-react";
import { INDIAN_STATES, STATE_DISTRICT_MAPPING } from "@/lib/states-data";
import { useAuth } from "@/contexts/AuthContext";

// Helper function to calculate distance using Haversine formula
function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number) {
  const R = 6371; // Radius of the earth in km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c; // Distance in km
}

export default function NearbyAmbulances() {
  const { user, role } = useAuth();
  const [ambulances, setAmbulances] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [state, setState] = useState("");
  const [district, setDistrict] = useState("");
  const [filterType, setFilterType] = useState("all");
  
  const [userLocation, setUserLocation] = useState<{lat: number, lng: number} | null>(null);
  const [locationLoading, setLocationLoading] = useState(false);
  const [userProfile, setUserProfile] = useState<any>(null);

  // Fetch user profile to set default location
  useEffect(() => {
    if (user) {
      supabase.from("profiles").select("state, district").eq("user_id", user.id).maybeSingle()
        .then(({ data }) => {
          if (data) {
            setUserProfile(data);
            if (role !== "admin") {
              if (data.state) setState(data.state);
              if (data.district) setDistrict(data.district);
            } else {
              if (data.state && !state) setState(data.state);
              if (data.district && !district) setDistrict(data.district);
            }
          }
        });
    }
  }, [user, role]);

  const isLocked = role !== "admin" && !!userProfile?.state && !!userProfile?.district;

  const fetchAmbulances = async () => {
    setLoading(true);
    let query = supabase.from("ambulances").select("*").eq("is_approved", true);
    
    if (!userLocation) {
      if (state && state !== "all") query = query.eq("state", state);
      if (district && district !== "all") query = query.ilike("district", `%${district}%`);
    } else {
      query = query.not("latitude", "is", null).not("longitude", "is", null);
    }
    if (filterType !== "all") query = query.eq("provider_type", filterType);
    
    const { data } = await query;
    let sorted = data || [];
    
    // Sort by live location if available
    if (userLocation) {
      sorted = sorted.map(amb => {
        if (amb.latitude && amb.longitude) {
          amb.distance = calculateDistance(userLocation.lat, userLocation.lng, amb.latitude, amb.longitude);
        }
        return amb;
      }).sort((a, b) => {
        if (a.distance !== undefined && b.distance !== undefined) return a.distance - b.distance;
        if (a.distance !== undefined) return -1;
        if (b.distance !== undefined) return 1;
        return 0;
      });
    } else {
      // Sort so Available and Govt are prioritized
      sorted = sorted.sort((a, b) => {
        if (a.current_status === "Available" && b.current_status !== "Available") return -1;
        if (b.current_status === "Available" && a.current_status !== "Available") return 1;
        if (a.provider_type === "Government" && b.provider_type !== "Government") return -1;
        return 0;
      });
    }
    
    setAmbulances(sorted);
    setLoading(false);
  };

  useEffect(() => {
    fetchAmbulances();
  }, [state, district, filterType, userLocation]);

  const handleStateChange = (val: string) => {
    setState(val);
    setDistrict("");
  };

  const getUserLocation = () => {
    setLocationLoading(true);
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
          if (!isLocked) {
            setState("all");
            setDistrict("all");
          }
          setLocationLoading(false);
        },
        (error) => {
          console.error("Error getting location:", error);
          setLocationLoading(false);
        }
      );
    } else {
      setLocationLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch(status?.toLowerCase()) {
      case 'available': return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Available</Badge>;
      case 'busy': 
      case 'on trip': return <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-100">{status}</Badge>;
      default: return <Badge variant="secondary">{status || 'Unknown'}</Badge>;
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground flex items-center gap-2">
            <Ambulance className="h-8 w-8 text-red-500" />
            Emergency Service Locator
          </h1>
          <p className="text-muted-foreground mt-2">Find and contact verified government ambulances and private emergency cabs near you instantly.</p>
        </div>
        <Button onClick={getUserLocation} disabled={locationLoading} variant="outline" className="shrink-0 flex items-center gap-2 border-primary/20 hover:bg-primary/5">
          <LocateFixed className={`h-4 w-4 text-primary ${locationLoading ? 'animate-spin' : ''}`} />
          {userLocation ? "Location Active" : "Use Live Location"}
        </Button>
      </div>

      <Card className="mb-8 shadow-sm border-primary/10">
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label>Service Type</Label>
              <Select value={filterType} onValueChange={setFilterType}>
                <SelectTrigger><SelectValue placeholder="All Services" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Services</SelectItem>
                  <SelectItem value="Government">Government Ambulance</SelectItem>
                  <SelectItem value="Private">Private Emergency Cab</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Select State</Label>
              <Select value={state} onValueChange={handleStateChange} disabled={isLocked}>
                <SelectTrigger><SelectValue placeholder="All States" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All States</SelectItem>
                  {INDIAN_STATES.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Select District</Label>
              <Select value={district || "all"} onValueChange={(val) => setDistrict(val === "all" ? "" : val)} disabled={isLocked || !state || state === "all"}>
                <SelectTrigger><SelectValue placeholder={state ? "All Districts" : "Select state first"} /></SelectTrigger>
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

      {loading ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {[1, 2, 3, 4].map(i => (
            <Card key={i} className="animate-pulse h-80 bg-muted/20" />
          ))}
        </div>
      ) : ambulances.length === 0 ? (
        <div className="text-center py-16 bg-muted/20 rounded-xl border border-dashed">
          <AlertTriangle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold">No Services Found</h3>
          <p className="text-muted-foreground">Try selecting a different location or service type.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {ambulances.map((amb) => {
            const isGovt = amb.provider_type === "Government";
            
            return (
              <Card key={amb.id} className={`flex flex-col overflow-hidden border-2 transition-all hover:shadow-md ${isGovt ? "border-blue-100" : "border-red-100"}`}>
                <div className={`h-2 w-full ${isGovt ? "bg-blue-600" : "bg-red-500"}`} />
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start gap-4">
                    <div>
                      <CardTitle className="text-xl flex items-center gap-2">
                        {isGovt ? <Ambulance className="h-5 w-5 text-blue-600" /> : <Car className="h-5 w-5 text-red-600" />}
                        {amb.name}
                        {isGovt && <ShieldCheck className="h-5 w-5 text-blue-600" title="Govt Verified" />}
                      </CardTitle>
                      <CardDescription className="mt-1 flex items-center gap-1 font-medium">
                        {isGovt ? <span className="text-blue-600">Government Service</span> : <span className="text-red-600">Private Cab</span>}
                        {amb.organization_name && <span className="text-muted-foreground font-normal">• {amb.organization_name}</span>}
                      </CardDescription>
                    </div>
                    {getStatusBadge(amb.current_status)}
                  </div>
                </CardHeader>
                <CardContent className="space-y-4 pb-4 flex-1">
                  <div className="flex items-start justify-between gap-2 text-sm text-muted-foreground">
                    <div className="flex items-start gap-2">
                      <MapPin className="h-4 w-4 shrink-0 mt-0.5" />
                      <span>
                        {amb.address ? `${amb.address}, ` : ''}{amb.city ? `${amb.city}, ` : ''}{amb.district}, {amb.state}
                      </span>
                    </div>
                    {amb.distance !== undefined && (
                      <Badge variant="outline" className="shrink-0 bg-blue-50 text-blue-700 border-blue-200">
                        {amb.distance.toFixed(1)} km away
                      </Badge>
                    )}
                  </div>
                  
                  {isGovt ? (
                    // GOVT SPECIFIC VIEW
                    <>
                      <div className="grid grid-cols-2 gap-2 text-sm bg-blue-50/50 p-3 rounded-lg border border-blue-100">
                        <div className="flex flex-col">
                          <span className="text-xs text-muted-foreground uppercase">Response Time</span>
                          <span className="font-medium flex items-center gap-1"><Clock className="h-3 w-3" /> {amb.response_time || "N/A"}</span>
                        </div>
                        <div className="flex flex-col">
                          <span className="text-xs text-muted-foreground uppercase">24x7 Available</span>
                          <span className="font-medium text-blue-800">{amb.is_24_7 ? "Yes" : "No"}</span>
                        </div>
                      </div>

                      {amb.ambulance_types && amb.ambulance_types.length > 0 && (
                        <div>
                          <span className="text-xs text-muted-foreground block mb-1">Ambulance Types:</span>
                          <div className="flex flex-wrap gap-1">
                            {amb.ambulance_types.map((type: string) => (
                              <span key={type} className="text-xs font-medium bg-slate-100 text-slate-700 px-2 py-0.5 rounded-full">{type}</span>
                            ))}
                          </div>
                        </div>
                      )}

                      {amb.medical_facilities && amb.medical_facilities.length > 0 && (
                        <div>
                          <span className="text-xs text-muted-foreground block mb-1">Facilities:</span>
                          <div className="flex flex-wrap gap-1">
                            {amb.medical_facilities.slice(0, 5).map((type: string) => (
                              <span key={type} className="text-xs text-blue-700 bg-blue-50 border border-blue-100 px-2 py-0.5 rounded-full">{type}</span>
                            ))}
                            {amb.medical_facilities.length > 5 && <span className="text-xs text-muted-foreground px-1 py-0.5">+{amb.medical_facilities.length - 5} more</span>}
                          </div>
                        </div>
                      )}
                    </>
                  ) : (
                    // PRIVATE CAB SPECIFIC VIEW
                    <>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-sm bg-red-50/50 p-3 rounded-lg border border-red-100">
                        <div className="flex flex-col col-span-2">
                          <span className="text-xs text-muted-foreground uppercase">Vehicle</span>
                          <span className="font-medium flex items-center gap-1"><Car className="h-3 w-3" /> {amb.vehicle_model || amb.vehicle_type || "N/A"} {amb.has_ac ? '(AC)' : ''}</span>
                        </div>
                        <div className="flex flex-col">
                          <span className="text-xs text-muted-foreground uppercase">Capacity</span>
                          <span className="font-medium">{amb.passenger_capacity ? `${amb.passenger_capacity} pax` : "N/A"}</span>
                        </div>
                        <div className="flex flex-col">
                          <span className="text-xs text-muted-foreground uppercase">Base Fare</span>
                          <span className="font-bold text-green-700">{amb.base_fare ? `₹${amb.base_fare}` : "N/A"}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 bg-slate-50 p-2 rounded-md border text-sm">
                        <User className="h-4 w-4 text-slate-500" />
                        <span className="text-muted-foreground">Driver:</span>
                        <span className="font-medium">{amb.driver_name || "Assigned on booking"}</span>
                        {amb.driver_experience_years && <span className="text-xs text-muted-foreground ml-auto">({amb.driver_experience_years} yrs exp)</span>}
                      </div>

                      {amb.service_features && amb.service_features.length > 0 && (
                        <div>
                          <span className="text-xs text-muted-foreground block mb-1">Safety & Features:</span>
                          <div className="flex flex-wrap gap-1">
                            {amb.service_features.map((type: string) => (
                              <span key={type} className="text-xs font-medium bg-slate-100 text-slate-700 px-2 py-0.5 rounded-full">{type}</span>
                            ))}
                          </div>
                        </div>
                      )}
                    </>
                  )}
                  
                </CardContent>
                <CardFooter className="bg-muted/10 pt-4 flex gap-2 mt-auto">
                  <Button 
                    className={`w-full font-bold text-lg h-12 ${isGovt ? "bg-blue-600 hover:bg-blue-700 text-white" : "bg-red-600 hover:bg-red-700 text-white"}`}
                    onClick={() => window.location.href = `tel:${amb.emergency_number}`}
                  >
                    <PhoneCall className="h-5 w-5 mr-2 animate-pulse" />
                    Call {isGovt ? "Ambulance" : "Cab"} ({amb.emergency_number})
                  </Button>
                  {amb.google_maps_url && (
                    <Button variant="outline" className="h-12 w-12 shrink-0" onClick={() => window.open(amb.google_maps_url, '_blank')} title="View on Maps">
                      <Navigation className="h-5 w-5 text-slate-600" />
                    </Button>
                  )}
                </CardFooter>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
