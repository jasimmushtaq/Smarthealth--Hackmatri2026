import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import AmbulanceOnboardingForm from "@/components/ambulance/AmbulanceOnboardingForm";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Ambulance, Car, CheckCircle2, IndianRupee, MapPin, Phone, ShieldCheck, User, XCircle, Plus, ChevronLeft } from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export default function AmbulanceDashboard() {
  const { user } = useAuth();
  const [ambulances, setAmbulances] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);

  const fetchAmbulances = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("ambulances")
      .select("*")
      .eq("user_id", user?.id)
      .order('created_at', { ascending: false });
      
    if (error) {
      toast.error("Failed to fetch details");
    } else {
      setAmbulances(data || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (user) fetchAmbulances();
  }, [user]);

  if (loading) {
    return <div className="flex items-center justify-center min-h-[50vh]"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" /></div>;
  }

  // If adding a new service
  if (showForm) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {ambulances.length > 0 && (
          <Button variant="ghost" className="mb-4" onClick={() => setShowForm(false)}>
            <ChevronLeft className="w-4 h-4 mr-2" /> Back to Dashboard
          </Button>
        )}
        <div className="mb-8 text-center space-y-2">
          <div className="mx-auto bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mb-4">
            <Ambulance className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight">Register Emergency Service</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Welcome! Please register your Government Ambulance or Private Emergency Cab service.
          </p>
        </div>
        
        <AmbulanceOnboardingForm onComplete={() => {
          setShowForm(false);
          fetchAmbulances();
        }} />
      </div>
    );
  }

  // Render Admin Dashboard showing all registered services
  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            Emergency Services Dashboard
          </h1>
          <p className="text-muted-foreground">Manage your registered ambulances and cab services</p>
        </div>
        <Button onClick={() => setShowForm(true)} className="flex items-center gap-2">
          <Plus className="w-4 h-4" /> Add New Service
        </Button>
      </div>

      {ambulances.length === 0 ? (
        <div className="text-center py-16 bg-slate-50 border-2 border-dashed border-slate-200 rounded-xl mt-8">
          <div className="mx-auto bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mb-4">
            <Ambulance className="w-8 h-8 text-primary" />
          </div>
          <h2 className="text-xl font-bold mb-2">No Services Registered Yet</h2>
          <p className="text-muted-foreground max-w-md mx-auto mb-6">
            You haven't registered any Government Ambulances or Private Emergency Cabs. Click below to add your first service.
          </p>
          <Button onClick={() => setShowForm(true)} size="lg" className="flex items-center gap-2">
            <Plus className="w-5 h-5" /> Add New Service
          </Button>
        </div>
      ) : (
        <div className="space-y-8">
          {ambulances.map((ambulance) => {
          const isGovt = ambulance.provider_type === "Government";

          return (
            <div key={ambulance.id} className="grid grid-cols-1 md:grid-cols-3 gap-6 bg-slate-50/50 p-4 rounded-xl border border-slate-200 shadow-sm">
              {/* LEFT COLUMN: Profile Overview */}
              <Card className="md:col-span-1 shadow-sm border-primary/10">
                <CardHeader className={isGovt ? "bg-blue-50/50" : "bg-red-50/50"}>
                  <div className="flex justify-between items-start">
                    <CardTitle className="flex items-center gap-2">
                      Profile
                      {isGovt && <ShieldCheck className="w-4 h-4 text-blue-600" />}
                    </CardTitle>
                    {ambulance.is_approved ? (
                      <Badge className="bg-green-100 text-green-800 hover:bg-green-100 flex items-center gap-1"><CheckCircle2 className="w-3 h-3"/> Approved</Badge>
                    ) : (
                      <Badge variant="secondary" className="flex items-center gap-1"><XCircle className="w-3 h-3"/> Pending</Badge>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="pt-4">
                  {ambulance.logo_url && (
                    <img src={ambulance.logo_url} alt="Logo" className="w-full h-32 object-contain mb-4 rounded-md bg-muted/20" />
                  )}
                  <h3 className="font-bold text-xl">{ambulance.name}</h3>
                  {ambulance.organization_name && <p className="text-sm font-medium text-muted-foreground mb-4">{ambulance.organization_name}</p>}
                  
                  <div className="space-y-3 text-sm mt-4">
                    <div className="flex items-start gap-2">
                      <Phone className="w-4 h-4 text-primary mt-0.5" />
                      <div>
                        <p className="font-medium text-foreground">Emergency Contact</p>
                        <p className="text-muted-foreground">{ambulance.emergency_number}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <MapPin className="w-4 h-4 text-primary mt-0.5" />
                      <div>
                        <p className="font-medium text-foreground">Location / Base</p>
                        <p className="text-muted-foreground">{ambulance.address || ambulance.base_hospital}</p>
                        <p className="text-muted-foreground">{ambulance.city}, {ambulance.district}</p>
                      </div>
                    </div>
                    
                    <div className="pt-4 border-t">
                      <p className="text-xs font-semibold uppercase text-muted-foreground mb-2">Availability</p>
                      <div className="flex justify-between items-center mb-1">
                        <span>Status:</span>
                        <Badge variant={ambulance.current_status === 'Available' ? 'default' : 'secondary'}>{ambulance.current_status}</Badge>
                      </div>
                      <div className="flex justify-between items-center">
                        <span>24x7 Service:</span>
                        <span className="font-medium">{ambulance.is_24_7 ? "Yes" : "No"}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* RIGHT COLUMN: Specific Details */}
              <Card className="md:col-span-2 shadow-sm border-primary/10">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    {isGovt ? <Ambulance className="h-5 w-5 text-blue-600" /> : <Car className="h-5 w-5 text-red-600" />}
                    {isGovt ? "Ambulance Details & Facilities" : "Cab & Driver Details"}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-8">
                  
                  {isGovt ? (
                    <>
                      <div>
                        <h4 className="font-semibold text-sm text-muted-foreground uppercase tracking-wider mb-3">Ambulance Types ({ambulance.fleet_size || 0} Total)</h4>
                        <div className="flex flex-wrap gap-2">
                          {(ambulance.ambulance_types || []).map((t: string) => (
                            <Badge key={t} variant="secondary">{t}</Badge>
                          ))}
                        </div>
                      </div>
                      <div>
                        <h4 className="font-semibold text-sm text-muted-foreground uppercase tracking-wider mb-3">Medical Facilities onboard</h4>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                          {(ambulance.medical_facilities || []).map((f: string) => (
                            <div key={f} className="flex items-center gap-2 text-sm bg-blue-50/50 p-2 rounded-md border border-blue-100">
                              <CheckCircle2 className="w-4 h-4 text-blue-500 shrink-0" />
                              <span>{f}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        {/* Vehicle Details */}
                        <div className="bg-slate-50 p-4 rounded-lg border">
                          <h4 className="font-semibold text-sm flex items-center gap-2 mb-4"><Car className="w-4 h-4 text-slate-500"/> Vehicle Details</h4>
                          <div className="space-y-2 text-sm">
                            <div className="flex justify-between border-b pb-1">
                              <span className="text-muted-foreground">Type</span>
                              <span className="font-medium">{ambulance.vehicle_type}</span>
                            </div>
                            <div className="flex justify-between border-b pb-1">
                              <span className="text-muted-foreground">Model</span>
                              <span className="font-medium">{ambulance.vehicle_model}</span>
                            </div>
                            <div className="flex justify-between border-b pb-1">
                              <span className="text-muted-foreground">Reg. Number</span>
                              <span className="font-medium uppercase">{ambulance.vehicle_registration}</span>
                            </div>
                            <div className="flex justify-between pb-1">
                              <span className="text-muted-foreground">Capacity / AC</span>
                              <span className="font-medium">{ambulance.passenger_capacity} pax {ambulance.has_ac ? "(AC)" : "(Non-AC)"}</span>
                            </div>
                          </div>
                        </div>

                        {/* Driver Details */}
                        <div className="bg-slate-50 p-4 rounded-lg border">
                          <h4 className="font-semibold text-sm flex items-center gap-2 mb-4"><User className="w-4 h-4 text-slate-500"/> Driver Details</h4>
                          <div className="space-y-2 text-sm">
                            <div className="flex justify-between border-b pb-1">
                              <span className="text-muted-foreground">Name</span>
                              <span className="font-medium">{ambulance.driver_name}</span>
                            </div>
                            <div className="flex justify-between border-b pb-1">
                              <span className="text-muted-foreground">Mobile</span>
                              <span className="font-medium">{ambulance.driver_mobile}</span>
                            </div>
                            <div className="flex justify-between border-b pb-1">
                              <span className="text-muted-foreground">Experience</span>
                              <span className="font-medium">{ambulance.driver_experience_years} years</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Pricing Details */}
                      <div>
                        <h4 className="font-semibold text-sm flex items-center gap-2 mb-3"><IndianRupee className="w-4 h-4 text-green-600"/> Pricing Details</h4>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                          <div className="bg-green-50 border border-green-100 p-3 rounded-lg text-center">
                            <span className="block text-xs text-green-800 font-medium mb-1">Base Fare</span>
                            <span className="text-lg font-bold text-green-700">₹{ambulance.base_fare || 'N/A'}</span>
                          </div>
                          <div className="bg-green-50 border border-green-100 p-3 rounded-lg text-center">
                            <span className="block text-xs text-green-800 font-medium mb-1">Per KM</span>
                            <span className="text-lg font-bold text-green-700">₹{ambulance.charge_per_km || 'N/A'}</span>
                          </div>
                          <div className="bg-green-50 border border-green-100 p-3 rounded-lg text-center">
                            <span className="block text-xs text-green-800 font-medium mb-1">Night Charge</span>
                            <span className="text-lg font-bold text-green-700">₹{ambulance.night_charges || 'N/A'}</span>
                          </div>
                          <div className="bg-green-50 border border-green-100 p-3 rounded-lg text-center">
                            <span className="block text-xs text-green-800 font-medium mb-1">Waiting (hr)</span>
                            <span className="text-lg font-bold text-green-700">₹{ambulance.waiting_charges || 'N/A'}</span>
                          </div>
                        </div>
                      </div>
                    </>
                  )}

                  <div>
                    <h4 className="font-semibold text-sm text-muted-foreground uppercase tracking-wider mb-3">Service Features</h4>
                    <div className="flex flex-wrap gap-2">
                      {(ambulance.service_features || []).map((f: string) => (
                        <Badge key={f} variant="outline" className="bg-primary/5">{f}</Badge>
                      ))}
                    </div>
                  </div>

                </CardContent>
              </Card>
            </div>
          );
        })}
        </div>
      )}
    </div>
  );
}
