import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { toast } from "sonner";
import { Loader2, CheckCircle2, ChevronRight, ChevronLeft, MapPin } from "lucide-react";
import { INDIAN_STATES, STATE_DISTRICT_MAPPING } from "@/lib/states-data";

const AMBULANCE_TYPES = ["Basic Life Support (BLS)", "Advanced Life Support (ALS)", "ICU Ambulance", "Neonatal Ambulance", "Patient Transport Ambulance"];
const MEDICAL_FACILITIES = ["Oxygen Cylinder", "Ventilator", "Cardiac Monitor", "Defibrillator (AED)", "First Aid Kit", "Stretcher", "Wheelchair", "Paramedic Available", "Doctor Available"];
const GOVT_SERVICE_FEATURES = ["Free Government Service", "GPS Tracking", "Live Location Sharing", "Accident Response", "Maternal Care Transport", "Emergency Patient Transport", "Disaster Response"];
const CAB_VEHICLE_TYPES = ["Hatchback", "Sedan", "SUV", "Van", "Wheelchair Accessible Vehicle"];
const CAB_SAFETY_FEATURES = ["GPS Tracking", "Live Location Sharing", "SOS Button", "Female Driver Available", "Wheelchair Accessible", "First Aid Kit Available", "Phone Charging Available"];

export function AmbulanceOnboardingForm({ onComplete, initialData = {} }: { onComplete: (data: any) => void, initialData?: any }) {
  const { user } = useAuth();
  const [step, setStep] = useState(1);
  const [saving, setSaving] = useState(false);
  const [recordId, setRecordId] = useState(initialData.id || null);
  
  const [providerType, setProviderType] = useState(initialData.provider_type || "Government");

  const totalSteps = providerType === "Government" ? 9 : 10;

  // ALL STATE FIELDS COMBINED
  const [data, setData] = useState({
    // Basic
    name: initialData.name || "",
    organization_name: initialData.organization_name || "",
    description: initialData.description || "",
    logo_url: initialData.logo_url || "",
    year_started: initialData.year_started?.toString() || "",

    // Location
    country: initialData.country || "India",
    state: initialData.state || "",
    district: initialData.district || "",
    city: initialData.city || "",
    area: initialData.area || "",
    base_hospital: initialData.base_hospital || "",
    address: initialData.address || "",
    landmark: initialData.landmark || "",
    pincode: initialData.pincode || "",
    latitude: initialData.latitude?.toString() || "",
    longitude: initialData.longitude?.toString() || "",
    google_maps_url: initialData.google_maps_url || "",

    // Contact
    emergency_number: initialData.emergency_number || "",
    alternate_number: initialData.alternate_number || "",
    control_room_number: initialData.control_room_number || "",
    email: initialData.email || "",
    website: initialData.website || "",
    contact_person_name: initialData.contact_person_name || "",
    whatsapp_number: initialData.whatsapp_number || "",

    // Ambulance Details (Govt)
    ambulance_types: initialData.ambulance_types || [] as string[],
    fleet_size: initialData.fleet_size?.toString() || "",
    coverage_area: initialData.coverage_area || "",

    // Medical Facilities (Govt)
    medical_facilities: initialData.medical_facilities || [] as string[],

    // Cab Details (Private)
    vehicle_type: initialData.vehicle_type || "",
    vehicle_model: initialData.vehicle_model || "",
    vehicle_registration: initialData.vehicle_registration || "",
    vehicle_color: initialData.vehicle_color || "",
    passenger_capacity: initialData.passenger_capacity?.toString() || "",
    has_ac: initialData.has_ac || false,

    // Driver Details (Private)
    driver_name: initialData.driver_name || "",
    driver_mobile: initialData.driver_mobile || "",
    driver_experience_years: initialData.driver_experience_years?.toString() || "",
    driver_photo_url: initialData.driver_photo_url || "",
    driver_emergency_contact: initialData.driver_emergency_contact || "",

    // Availability (Both)
    is_24_7: initialData.is_24_7 || false,
    night_service_available: initialData.night_service_available || false,
    operating_days: initialData.operating_days || "Monday - Sunday",
    operating_hours: initialData.operating_hours || "24 Hours",
    current_status: initialData.current_status || "Available",
    response_time: initialData.response_time || "",

    // Coverage Area (Private)
    service_radius_km: initialData.service_radius_km?.toString() || "",
    cities_covered: initialData.cities_covered || "",
    areas_covered: initialData.areas_covered || "",

    // Pricing (Private)
    base_fare: initialData.base_fare?.toString() || "",
    charge_per_km: initialData.charge_per_km?.toString() || "",
    night_charges: initialData.night_charges?.toString() || "",
    waiting_charges: initialData.waiting_charges?.toString() || "",

    // Service/Safety Features
    service_features: initialData.service_features || [] as string[],

    // Verification
    govt_department_name: initialData.govt_department_name || "",
    license_number: initialData.license_number || "",
    aadhaar_card_url: initialData.aadhaar_card_url || "",
  });

  const handleChange = (field: string, value: any) => {
    setData(prev => ({ ...prev, [field]: value }));
  };

  const handleNext = () => setStep(prev => prev + 1);
  const handlePrev = () => setStep(prev => prev - 1);

  const toggleArrayItem = (field: "ambulance_types" | "medical_facilities" | "service_features", item: string) => {
    setData(prev => {
      const arr = prev[field] as string[];
      if (arr.includes(item)) return { ...prev, [field]: arr.filter(i => i !== item) };
      return { ...prev, [field]: [...arr, item] };
    });
  };

  const saveDetails = async () => {
    setSaving(true);
    if (!user) return false;

    const payload = {
      user_id: user.id,
      provider_type: providerType,
      is_approved: true, // Auto approve for demo
      
      name: data.name,
      organization_name: data.organization_name,
      description: data.description,
      logo_url: data.logo_url,
      year_started: data.year_started ? parseInt(data.year_started) : null,
      
      country: data.country,
      state: data.state,
      district: data.district,
      city: data.city,
      area: data.area,
      base_hospital: data.base_hospital,
      address: data.address,
      landmark: data.landmark,
      pincode: data.pincode,
      latitude: data.latitude ? parseFloat(data.latitude) : null,
      longitude: data.longitude ? parseFloat(data.longitude) : null,
      google_maps_url: data.google_maps_url,
      
      emergency_number: data.emergency_number,
      alternate_number: data.alternate_number,
      control_room_number: data.control_room_number,
      email: data.email,
      website: data.website,
      contact_person_name: data.contact_person_name,
      whatsapp_number: data.whatsapp_number,

      ambulance_types: data.ambulance_types,
      fleet_size: data.fleet_size ? parseInt(data.fleet_size) : null,
      coverage_area: data.coverage_area,
      medical_facilities: data.medical_facilities,

      vehicle_type: data.vehicle_type,
      vehicle_model: data.vehicle_model,
      vehicle_registration: data.vehicle_registration,
      vehicle_color: data.vehicle_color,
      passenger_capacity: data.passenger_capacity ? parseInt(data.passenger_capacity) : null,
      has_ac: data.has_ac,

      driver_name: data.driver_name,
      driver_mobile: data.driver_mobile,
      driver_experience_years: data.driver_experience_years ? parseInt(data.driver_experience_years) : null,
      driver_photo_url: data.driver_photo_url,
      driver_emergency_contact: data.driver_emergency_contact,

      is_24_7: data.is_24_7,
      night_service_available: data.night_service_available,
      operating_days: data.operating_days,
      operating_hours: data.operating_hours,
      current_status: data.current_status,
      response_time: data.response_time,

      service_radius_km: data.service_radius_km ? parseInt(data.service_radius_km) : null,
      cities_covered: data.cities_covered,
      areas_covered: data.areas_covered,

      base_fare: data.base_fare ? parseFloat(data.base_fare) : null,
      charge_per_km: data.charge_per_km ? parseFloat(data.charge_per_km) : null,
      night_charges: data.night_charges ? parseFloat(data.night_charges) : null,
      waiting_charges: data.waiting_charges ? parseFloat(data.waiting_charges) : null,

      service_features: data.service_features,

      govt_department_name: data.govt_department_name,
      license_number: data.license_number,
      aadhaar_card_url: data.aadhaar_card_url,
    };

    let error;
    let finalData;

    if (!recordId) {
      const { data: resData, error: insertError } = await supabase.from('ambulances').insert(payload).select().single();
      error = insertError;
      finalData = resData;
      if (resData) setRecordId(resData.id);
    } else {
      const { data: resData, error: updateError } = await supabase.from('ambulances').update(payload).eq('id', recordId).select().single();
      error = updateError;
      finalData = resData;
    }

    setSaving(false);
    if (error) {
      toast.error(error.message);
      return false;
    }
    
    if (step === totalSteps) {
      onComplete(finalData);
    }
    return true;
  };

  const handleSaveAndNext = async () => {
    if (step === 1 && !data.name) { toast.error("Service Name is required"); return; }
    if (step === 2 && (!data.state || !data.district)) { toast.error("State and District are required"); return; }
    if (step === 3 && providerType === "Government" && !data.emergency_number) { toast.error("Emergency number is required"); return; }
    if (step === 3 && providerType === "Private" && !data.contact_person_name) { toast.error("Contact person is required"); return; }

    const success = await saveDetails();
    if (success && step < totalSteps) {
      handleNext();
    }
  };

  const getLocation = () => {
    if (!navigator.geolocation) {
      toast.error("Geolocation is not supported by your browser");
      return;
    }
    toast.info("Fetching location...");
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        handleChange('latitude', pos.coords.latitude.toString());
        handleChange('longitude', pos.coords.longitude.toString());
        toast.success("Location fetched!");
      },
      (err) => toast.error("Failed to get location. Please ensure location permissions are allowed in your browser settings.")
    );
  };

  return (
    <Card className="w-full max-w-4xl mx-auto shadow-lg border-primary/10">
      <CardHeader className="bg-muted/30 border-b">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-2xl text-primary">{providerType} Setup</CardTitle>
            <CardDescription>Step {step} of {totalSteps}</CardDescription>
          </div>
          <div className="flex space-x-1">
            {Array.from({length: totalSteps}).map((_, i) => {
              const s = i + 1;
              return <div key={s} className={`w-2 h-2 rounded-full ${s === step ? 'bg-primary' : s < step ? 'bg-primary/50' : 'bg-muted-foreground/30'}`} />;
            })}
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="p-6">
        
        {/* STEP 1: BASIC INFO */}
        {step === 1 && (
          <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
            <h3 className="text-lg font-semibold border-b pb-2">1. Basic Information</h3>
            <div className="space-y-4 mb-6">
              <Label>Select Provider Type</Label>
              <div className="flex gap-4">
                <Button type="button" variant={providerType === "Government" ? "default" : "outline"} onClick={() => { setProviderType("Government"); setStep(1); }}>
                  Government Ambulance
                </Button>
                <Button type="button" variant={providerType === "Private" ? "default" : "outline"} onClick={() => { setProviderType("Private"); setStep(1); }}>
                  Private Emergency Cab
                </Button>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>{providerType === "Government" ? "Ambulance Service Name *" : "Cab Service Name *"}</Label>
                <Input value={data.name} onChange={e => handleChange('name', e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>{providerType === "Government" ? "Govt Department / Organization Name" : "Company Name"}</Label>
                <Input value={data.organization_name} onChange={e => handleChange('organization_name', e.target.value)} />
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label>Service Description</Label>
                <Textarea value={data.description} onChange={e => handleChange('description', e.target.value)} rows={3} />
              </div>
              <div className="space-y-2">
                <Label>{providerType === "Government" ? "Year Started" : "Year Established"}</Label>
                <Input type="number" value={data.year_started} onChange={e => handleChange('year_started', e.target.value)} placeholder="e.g. 2015" />
              </div>
              <div className="space-y-2">
                <Label>Service Logo URL (Optional)</Label>
                <Input value={data.logo_url} onChange={e => handleChange('logo_url', e.target.value)} placeholder="https://..." />
              </div>
            </div>
          </div>
        )}

        {/* STEP 2: LOCATION */}
        {step === 2 && (
          <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
            <h3 className="text-lg font-semibold border-b pb-2">2. Location</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>State *</Label>
                <Select value={data.state} onValueChange={(v) => { handleChange('state', v); handleChange('district', ''); }}>
                  <SelectTrigger><SelectValue placeholder="Select state" /></SelectTrigger>
                  <SelectContent>{INDIAN_STATES.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>District *</Label>
                <Select value={data.district} onValueChange={(v) => handleChange('district', v)} disabled={!data.state}>
                  <SelectTrigger><SelectValue placeholder="Select district" /></SelectTrigger>
                  <SelectContent>
                    {(STATE_DISTRICT_MAPPING[data.state as keyof typeof STATE_DISTRICT_MAPPING] || []).map(d => <SelectItem key={d} value={d}>{d}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>City / Town</Label>
                <Input value={data.city} onChange={e => handleChange('city', e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>Area / Locality</Label>
                <Input value={data.area} onChange={e => handleChange('area', e.target.value)} />
              </div>
              {providerType === "Government" && (
                <div className="space-y-2">
                  <Label>Base Hospital / Station</Label>
                  <Input value={data.base_hospital} onChange={e => handleChange('base_hospital', e.target.value)} />
                </div>
              )}
              <div className="space-y-2 md:col-span-2">
                <Label>Street Address</Label>
                <Input value={data.address} onChange={e => handleChange('address', e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>Landmark</Label>
                <Input value={data.landmark} onChange={e => handleChange('landmark', e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>PIN Code</Label>
                <Input value={data.pincode} onChange={e => handleChange('pincode', e.target.value)} />
              </div>
            </div>
            <div className="pt-4 border-t mt-4">
              <div className="flex items-center justify-between mb-2">
                <Label>GPS Coordinates</Label>
                <Button type="button" size="sm" variant="outline" onClick={getLocation}><MapPin className="h-4 w-4 mr-2" /> Get Location</Button>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <Input value={data.latitude} onChange={e => handleChange('latitude', e.target.value)} placeholder="Latitude" />
                <Input value={data.longitude} onChange={e => handleChange('longitude', e.target.value)} placeholder="Longitude" />
              </div>
            </div>
          </div>
        )}

        {/* STEP 3: CONTACT */}
        {step === 3 && (
          <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
            <h3 className="text-lg font-semibold border-b pb-2">3. Contact Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {providerType === "Government" ? (
                <>
                  <div className="space-y-2">
                    <Label>Emergency Helpline Number *</Label>
                    <Input value={data.emergency_number} onChange={e => handleChange('emergency_number', e.target.value)} className="text-red-600 font-bold" />
                  </div>
                  <div className="space-y-2">
                    <Label>Alternative Contact Number (Optional)</Label>
                    <Input value={data.alternate_number} onChange={e => handleChange('alternate_number', e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label>Control Room Number (Optional)</Label>
                    <Input value={data.control_room_number} onChange={e => handleChange('control_room_number', e.target.value)} />
                  </div>
                </>
              ) : (
                <>
                  <div className="space-y-2">
                    <Label>Contact Person Name *</Label>
                    <Input value={data.contact_person_name} onChange={e => handleChange('contact_person_name', e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label>Mobile Number * (Used for Emergency Contact)</Label>
                    <Input value={data.emergency_number} onChange={e => handleChange('emergency_number', e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label>Alternate Mobile Number</Label>
                    <Input value={data.alternate_number} onChange={e => handleChange('alternate_number', e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label>WhatsApp Number</Label>
                    <Input value={data.whatsapp_number} onChange={e => handleChange('whatsapp_number', e.target.value)} />
                  </div>
                </>
              )}
              <div className="space-y-2">
                <Label>Email Address</Label>
                <Input type="email" value={data.email} onChange={e => handleChange('email', e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>Website (Optional)</Label>
                <Input value={data.website} onChange={e => handleChange('website', e.target.value)} />
              </div>
            </div>
          </div>
        )}

        {/* --- GOVERNMENT PATH (Steps 4-9) --- */}
        {providerType === "Government" && (
          <>
            {step === 4 && (
              <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
                <h3 className="text-lg font-semibold border-b pb-2">4. Ambulance Details</h3>
                <div className="space-y-3 mb-6">
                  <Label>Ambulance Type (Multi-select)</Label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {AMBULANCE_TYPES.map(type => (
                      <div key={type} className="flex items-center space-x-2 border p-2 rounded-md">
                        <Checkbox id={`t-${type}`} checked={data.ambulance_types.includes(type)} onCheckedChange={() => toggleArrayItem("ambulance_types", type)} />
                        <label htmlFor={`t-${type}`} className="text-sm flex-1 cursor-pointer">{type}</label>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Number of Ambulances Available</Label>
                    <Input type="number" value={data.fleet_size} onChange={e => handleChange('fleet_size', e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label>Coverage Area</Label>
                    <Input value={data.coverage_area} onChange={e => handleChange('coverage_area', e.target.value)} />
                  </div>
                </div>
              </div>
            )}
            
            {step === 5 && (
              <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
                <h3 className="text-lg font-semibold border-b pb-2">5. Medical Facilities</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {MEDICAL_FACILITIES.map(fac => (
                    <div key={fac} className="flex items-center space-x-2 border p-3 rounded-md bg-muted/10">
                      <Checkbox id={`f-${fac}`} checked={data.medical_facilities.includes(fac)} onCheckedChange={() => toggleArrayItem("medical_facilities", fac)} />
                      <label htmlFor={`f-${fac}`} className="text-sm flex-1 cursor-pointer">{fac}</label>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {step === 6 && (
              <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
                <h3 className="text-lg font-semibold border-b pb-2">6. Service Availability</h3>
                <div className="flex items-center space-x-2 mb-4 p-4 border rounded-md bg-blue-50/50">
                  <Checkbox id="is-24-7" checked={data.is_24_7} onCheckedChange={(checked) => { handleChange('is_24_7', !!checked); if(checked) { handleChange('operating_days', 'Monday - Sunday'); handleChange('operating_hours', '24 Hours'); } }} />
                  <label htmlFor="is-24-7" className="font-semibold text-blue-900 cursor-pointer">Available 24×7</label>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2"><Label>Operating Days</Label><Input value={data.operating_days} onChange={e => handleChange('operating_days', e.target.value)} disabled={data.is_24_7} /></div>
                  <div className="space-y-2"><Label>Operating Hours</Label><Input value={data.operating_hours} onChange={e => handleChange('operating_hours', e.target.value)} disabled={data.is_24_7} /></div>
                  <div className="space-y-2">
                    <Label>Current Status</Label>
                    <Select value={data.current_status} onValueChange={v => handleChange('current_status', v)}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Available">Available</SelectItem>
                        <SelectItem value="Busy">Busy</SelectItem>
                        <SelectItem value="Under Maintenance">Under Maintenance</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2"><Label>Average Response Time</Label><Input value={data.response_time} onChange={e => handleChange('response_time', e.target.value)} placeholder="e.g. 15 mins" /></div>
                </div>
              </div>
            )}

            {step === 7 && (
              <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
                <h3 className="text-lg font-semibold border-b pb-2">7. Service Features</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {GOVT_SERVICE_FEATURES.map(feature => (
                    <div key={feature} className="flex items-center space-x-2 border p-3 rounded-md hover:bg-muted/50">
                      <Checkbox id={`sf-${feature}`} checked={data.service_features.includes(feature)} onCheckedChange={() => toggleArrayItem("service_features", feature)} />
                      <label htmlFor={`sf-${feature}`} className="text-sm flex-1 cursor-pointer">{feature}</label>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {step === 8 && (
              <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
                <h3 className="text-lg font-semibold border-b pb-2">8. Verification</h3>
                <div className="space-y-4 bg-green-50 p-4 rounded-md border border-green-100">
                  <div className="space-y-2">
                    <Label>Government Department / Organization Name</Label>
                    <Input value={data.govt_department_name} onChange={e => handleChange('govt_department_name', e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label>Government Authorization / Approval Letter Number</Label>
                    <Input value={data.license_number} onChange={e => handleChange('license_number', e.target.value)} placeholder="Enter approval ID" />
                  </div>
                </div>
              </div>
            )}

            {step === 9 && (
              <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
                <h3 className="text-lg font-semibold border-b pb-2">9. Admin Status Summary</h3>
                <div className="p-8 text-center bg-muted/20 border-2 border-dashed rounded-lg">
                  <CheckCircle2 className="h-16 w-16 text-green-500 mx-auto mb-4" />
                  <h4 className="text-xl font-bold mb-2">Ready to Submit</h4>
                  <p className="text-muted-foreground">Your government ambulance profile will be saved. By default, it will be marked as <strong>Approved</strong> in the system.</p>
                </div>
              </div>
            )}
          </>
        )}


        {/* --- PRIVATE CAB PATH (Steps 4-10) --- */}
        {providerType === "Private" && (
          <>
            {step === 4 && (
              <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
                <h3 className="text-lg font-semibold border-b pb-2">4. Cab Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Vehicle Type</Label>
                    <Select value={data.vehicle_type} onValueChange={v => handleChange('vehicle_type', v)}>
                      <SelectTrigger><SelectValue placeholder="Select type" /></SelectTrigger>
                      <SelectContent>
                        {CAB_VEHICLE_TYPES.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2"><Label>Vehicle Model</Label><Input value={data.vehicle_model} onChange={e => handleChange('vehicle_model', e.target.value)} placeholder="e.g. Innova Crysta" /></div>
                  <div className="space-y-2"><Label>Vehicle Registration Number</Label><Input value={data.vehicle_registration} onChange={e => handleChange('vehicle_registration', e.target.value)} className="uppercase font-mono" /></div>
                  <div className="space-y-2"><Label>Vehicle Color</Label><Input value={data.vehicle_color} onChange={e => handleChange('vehicle_color', e.target.value)} /></div>
                  <div className="space-y-2"><Label>Passenger Capacity</Label><Input type="number" value={data.passenger_capacity} onChange={e => handleChange('passenger_capacity', e.target.value)} /></div>
                  <div className="flex items-center space-x-2 pt-8">
                    <Checkbox id="has-ac" checked={data.has_ac} onCheckedChange={c => handleChange('has_ac', !!c)} />
                    <label htmlFor="has-ac" className="font-medium cursor-pointer">Air Conditioning Available</label>
                  </div>
                </div>
              </div>
            )}

            {step === 5 && (
              <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
                <h3 className="text-lg font-semibold border-b pb-2">5. Driver Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2"><Label>Driver Name</Label><Input value={data.driver_name} onChange={e => handleChange('driver_name', e.target.value)} /></div>
                  <div className="space-y-2"><Label>Driver Mobile Number</Label><Input value={data.driver_mobile} onChange={e => handleChange('driver_mobile', e.target.value)} /></div>
                  <div className="space-y-2"><Label>Years of Driving Experience</Label><Input type="number" value={data.driver_experience_years} onChange={e => handleChange('driver_experience_years', e.target.value)} /></div>
                  <div className="space-y-2"><Label>Emergency Contact Number</Label><Input value={data.driver_emergency_contact} onChange={e => handleChange('driver_emergency_contact', e.target.value)} /></div>
                  <div className="space-y-2 md:col-span-2"><Label>Driver Photo URL (Optional)</Label><Input value={data.driver_photo_url} onChange={e => handleChange('driver_photo_url', e.target.value)} /></div>
                </div>
              </div>
            )}

            {step === 6 && (
              <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
                <h3 className="text-lg font-semibold border-b pb-2">6. Service Availability</h3>
                <div className="flex gap-4 mb-4">
                  <div className="flex items-center space-x-2 p-3 border rounded-md flex-1">
                    <Checkbox id="is-24-7" checked={data.is_24_7} onCheckedChange={(c) => handleChange('is_24_7', !!c)} />
                    <label htmlFor="is-24-7" className="font-medium cursor-pointer">Available 24×7</label>
                  </div>
                  <div className="flex items-center space-x-2 p-3 border rounded-md flex-1">
                    <Checkbox id="night-srv" checked={data.night_service_available} onCheckedChange={(c) => handleChange('night_service_available', !!c)} />
                    <label htmlFor="night-srv" className="font-medium cursor-pointer">Night Service</label>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2"><Label>Operating Days</Label><Input value={data.operating_days} onChange={e => handleChange('operating_days', e.target.value)} /></div>
                  <div className="space-y-2"><Label>Operating Hours</Label><Input value={data.operating_hours} onChange={e => handleChange('operating_hours', e.target.value)} /></div>
                  <div className="space-y-2">
                    <Label>Current Status</Label>
                    <Select value={data.current_status} onValueChange={v => handleChange('current_status', v)}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Available">Available</SelectItem>
                        <SelectItem value="On Trip">On Trip</SelectItem>
                        <SelectItem value="Offline">Offline</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            )}

            {step === 7 && (
              <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
                <h3 className="text-lg font-semibold border-b pb-2">7. Coverage Area</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2"><Label>Service Radius (km)</Label><Input type="number" value={data.service_radius_km} onChange={e => handleChange('service_radius_km', e.target.value)} /></div>
                  <div className="space-y-2"><Label>Cities Covered</Label><Input value={data.cities_covered} onChange={e => handleChange('cities_covered', e.target.value)} /></div>
                  <div className="space-y-2 md:col-span-2"><Label>Specific Areas Covered</Label><Textarea value={data.areas_covered} onChange={e => handleChange('areas_covered', e.target.value)} rows={2} /></div>
                </div>
              </div>
            )}

            {step === 8 && (
              <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
                <h3 className="text-lg font-semibold border-b pb-2">8. Pricing (₹)</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2"><Label>Base Fare</Label><Input type="number" value={data.base_fare} onChange={e => handleChange('base_fare', e.target.value)} /></div>
                  <div className="space-y-2"><Label>Charge per Kilometer</Label><Input type="number" value={data.charge_per_km} onChange={e => handleChange('charge_per_km', e.target.value)} /></div>
                  <div className="space-y-2"><Label>Night Charges (Extra)</Label><Input type="number" value={data.night_charges} onChange={e => handleChange('night_charges', e.target.value)} /></div>
                  <div className="space-y-2"><Label>Waiting Charges (per hr)</Label><Input type="number" value={data.waiting_charges} onChange={e => handleChange('waiting_charges', e.target.value)} /></div>
                </div>
              </div>
            )}

            {step === 9 && (
              <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
                <h3 className="text-lg font-semibold border-b pb-2">9. Safety Features</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {CAB_SAFETY_FEATURES.map(feature => (
                    <div key={feature} className="flex items-center space-x-2 border p-3 rounded-md hover:bg-muted/50">
                      <Checkbox id={`saf-${feature}`} checked={data.service_features.includes(feature)} onCheckedChange={() => toggleArrayItem("service_features", feature)} />
                      <label htmlFor={`saf-${feature}`} className="text-sm flex-1 cursor-pointer">{feature}</label>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {step === 10 && (
              <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
                <h3 className="text-lg font-semibold border-b pb-2">10. Verification</h3>
                <div className="space-y-4 bg-amber-50 p-4 rounded-md border border-amber-100">
                  <div className="space-y-2">
                    <Label>Aadhaar Card Number / Document ID</Label>
                    <Input value={data.aadhaar_card_url} onChange={e => handleChange('aadhaar_card_url', e.target.value)} placeholder="Provide Aadhaar for verification" />
                  </div>
                </div>
                <div className="mt-8 p-4 border border-blue-200 bg-blue-50 rounded-lg">
                  <h4 className="font-semibold text-blue-900 mb-2">Ready to Submit</h4>
                  <p className="text-sm text-blue-800">By completing this registration, you confirm that all provided details and driver verifications are accurate.</p>
                </div>
              </div>
            )}
          </>
        )}

        {/* Navigation Buttons */}
        <div className="flex justify-between mt-8 pt-4 border-t">
          <Button variant="outline" onClick={handlePrev} disabled={step === 1 || saving}>
            <ChevronLeft className="h-4 w-4 mr-2" /> Previous
          </Button>
          
          <Button onClick={handleSaveAndNext} disabled={saving} className={step === totalSteps ? "bg-green-600 hover:bg-green-700 text-white" : ""}>
            {saving && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
            {step === totalSteps ? (
              <><CheckCircle2 className="h-4 w-4 mr-2" /> Finish Setup</>
            ) : (
              <>Next Step <ChevronRight className="h-4 w-4 ml-2" /></>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
export default AmbulanceOnboardingForm;
