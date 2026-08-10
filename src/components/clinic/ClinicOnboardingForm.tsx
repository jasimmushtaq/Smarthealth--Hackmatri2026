import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { toast } from "sonner";
import { Loader2, CheckCircle2, ChevronRight, ChevronLeft, MapPin, Plus, Trash2 } from "lucide-react";
import { INDIAN_STATES, STATE_DISTRICT_MAPPING } from "@/lib/states-data";
import { uploadToCloudinary } from "@/lib/cloudinary";

const CLINIC_TYPES = [
  "General Clinic", "Dental", "Eye Care", "Skin", "Pediatric", 
  "Gynecology", "Orthopedic", "Physiotherapy", "Diagnostic Center", 
  "Multi-Speciality", "Other"
];

const CLINIC_SERVICES = [
  "General Consultation", "Emergency Care", "Vaccination", "Lab Tests", 
  "Pharmacy", "X-Ray", "Ultrasound", "ECG", "Physiotherapy", 
  "Home Visits", "Teleconsultation"
];

export function ClinicOnboardingForm({ clinic, onComplete }: { clinic: any, onComplete: () => void }) {
  const [step, setStep] = useState(1);
  const [saving, setSaving] = useState(false);
  
  // Form States
  const [basicInfo, setBasicInfo] = useState({
    name: clinic.name || "",
    description: clinic.description || "",
    registration_number: clinic.registration_number || "",
    year_established: clinic.year_established?.toString() || "",
    logo_url: clinic.logo_url || "",
  });

  const [locationInfo, setLocationInfo] = useState({
    country: clinic.country || "India",
    state: clinic.state || "",
    district: clinic.district || "",
    city: clinic.city || "",
    area: clinic.area || "",
    address: clinic.address || "",
    landmark: clinic.landmark || "",
    pincode: clinic.pincode || "",
    latitude: clinic.latitude?.toString() || "",
    longitude: clinic.longitude?.toString() || "",
    google_maps_url: clinic.google_maps_url || "",
  });

  const [contactInfo, setContactInfo] = useState({
    contact_person: clinic.contact_person || "",
    contact_number: clinic.contact_number || "",
    alternate_number: clinic.alternate_number || "",
    email: clinic.email || "",
    website: clinic.website || "",
    whatsapp_number: clinic.whatsapp_number || "",
  });

  const [servicesInfo, setServicesInfo] = useState({
    clinic_type: clinic.clinic_type || "",
    services: clinic.services || [] as string[],
  });

  const [doctors, setDoctors] = useState<any[]>([]);
  const [loadingDoctors, setLoadingDoctors] = useState(false);

  const fetchDoctors = async () => {
    setLoadingDoctors(true);
    const { data, error } = await supabase
      .from('doctors')
      .select('*')
      .eq('clinic_id', clinic.id);
    if (!error && data) {
      setDoctors(data);
    }
    setLoadingDoctors(false);
  };

  const handleNext = () => setStep(prev => prev + 1);
  const handlePrev = () => setStep(prev => prev - 1);

  const saveClinicDetails = async () => {
    setSaving(true);
    const updateData = {
      ...basicInfo,
      year_established: basicInfo.year_established ? parseInt(basicInfo.year_established) : null,
      ...locationInfo,
      latitude: locationInfo.latitude ? parseFloat(locationInfo.latitude) : null,
      longitude: locationInfo.longitude ? parseFloat(locationInfo.longitude) : null,
      ...contactInfo,
      ...servicesInfo
    };

    let error;
    if (!clinic.id) {
      // Create new clinic record if it doesn't exist
      const { data, error: insertError } = await supabase
        .from('clinics')
        .insert({
          ...updateData,
          user_id: clinic.user_id,
          is_approved: true
        })
        .select()
        .single();
        
      error = insertError;
      if (data) {
        clinic.id = data.id; // Set ID for future steps
      }
    } else {
      const { error: updateError } = await supabase
        .from('clinics')
        .update(updateData)
        .eq('id', clinic.id);
      error = updateError;
    }

    setSaving(false);
    if (error) {
      toast.error(error.message);
      return false;
    }
    return true;
  };

  const handleSaveAndNext = async () => {
    if (step < 5) {
      const success = await saveClinicDetails();
      if (success) {
        if (step === 4) {
          await fetchDoctors();
        }
        handleNext();
      }
    } else {
      onComplete();
    }
  };

  const toggleService = (service: string) => {
    setServicesInfo(prev => {
      const exists = prev.services.includes(service);
      if (exists) {
        return { ...prev, services: prev.services.filter((s: string) => s !== service) };
      } else {
        return { ...prev, services: [...prev.services, service] };
      }
    });
  };

  const getLocation = () => {
    if (!navigator.geolocation) {
      toast.error("Geolocation is not supported by your browser");
      return;
    }
    toast.info("Fetching your current location...");
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocationInfo(prev => ({
          ...prev,
          latitude: position.coords.latitude.toString(),
          longitude: position.coords.longitude.toString()
        }));
        toast.success("Location fetched successfully!");
      },
      (err) => toast.error("Failed to get location. Please ensure location permissions are allowed in your browser settings.")
    );
  };

  const [newDoctor, setNewDoctor] = useState({
    full_name: "",
    specialization: "",
    qualification: "",
    experience_years: "",
    consultation_fee: "",
    status: "available"
  });
  
  const [addingDoctor, setAddingDoctor] = useState(false);

  const handleAddDoctor = async () => {
    if (!newDoctor.full_name) {
      toast.error("Doctor name is required");
      return;
    }
    setAddingDoctor(true);
    const { data, error } = await supabase
      .from('doctors')
      .insert({
        clinic_id: clinic.id,
        full_name: newDoctor.full_name,
        specialization: newDoctor.specialization,
        qualification: newDoctor.qualification,
        experience_years: newDoctor.experience_years ? parseInt(newDoctor.experience_years) : null,
        consultation_fee: newDoctor.consultation_fee ? parseFloat(newDoctor.consultation_fee) : null,
        status: newDoctor.status
      })
      .select()
      .single();

    setAddingDoctor(false);
    if (error) {
      toast.error(error.message);
    } else if (data) {
      toast.success("Doctor added!");
      setDoctors([...doctors, data]);
      setNewDoctor({
        full_name: "",
        specialization: "",
        qualification: "",
        experience_years: "",
        consultation_fee: "",
        status: "available"
      });
    }
  };

  const removeDoctor = async (id: string) => {
    const { error } = await supabase.from('doctors').delete().eq('id', id);
    if (!error) {
      setDoctors(doctors.filter(d => d.id !== id));
      toast.success("Doctor removed");
    }
  };

  return (
    <Card className="w-full max-w-4xl mx-auto shadow-lg border-primary/10">
      <CardHeader className="bg-muted/30 border-b">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-2xl text-primary">Clinic Profile Setup</CardTitle>
            <CardDescription>Step {step} of 5</CardDescription>
          </div>
          <div className="flex space-x-2">
            {[1, 2, 3, 4, 5].map((s) => (
              <div 
                key={s} 
                className={`w-3 h-3 rounded-full ${s === step ? 'bg-primary' : s < step ? 'bg-primary/50' : 'bg-muted-foreground/30'}`} 
              />
            ))}
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="p-6">
        {/* Step 1: Basic Information */}
        {step === 1 && (
          <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
            <h3 className="text-lg font-semibold border-b pb-2">1. Basic Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Clinic Name *</Label>
                <Input value={basicInfo.name} onChange={(e) => setBasicInfo({...basicInfo, name: e.target.value})} required />
              </div>
              <div className="space-y-2">
                <Label>Year Established</Label>
                <Input type="number" value={basicInfo.year_established} onChange={(e) => setBasicInfo({...basicInfo, year_established: e.target.value})} placeholder="e.g., 2010" />
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label>Registration Number (optional)</Label>
                <Input value={basicInfo.registration_number} onChange={(e) => setBasicInfo({...basicInfo, registration_number: e.target.value})} />
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label>Clinic Photo / Shop Image (Optional)</Label>
                <div className="flex items-center gap-4">
                  {basicInfo.logo_url && (
                    <img src={basicInfo.logo_url} alt="Clinic" className="h-16 w-16 object-cover rounded-md border" />
                  )}
                  <Input 
                    type="file" 
                    accept="image/*"
                    onChange={async (e) => {
                      const file = e.target.files?.[0];
                      if (!file) return;
                      toast.info("Uploading image...");
                      try {
                        const url = await uploadToCloudinary(file, "clinic-profiles");
                        setBasicInfo(prev => ({ ...prev, logo_url: url }));
                        toast.success("Image uploaded!");
                      } catch (error: any) {
                        toast.error(error.message || "Failed to upload image");
                      }
                    }} 
                  />
                </div>
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label>Clinic Description / About</Label>
                <Textarea value={basicInfo.description} onChange={(e) => setBasicInfo({...basicInfo, description: e.target.value})} rows={4} placeholder="Describe your clinic, mission, and facilities..." />
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Location */}
        {step === 2 && (
          <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
            <h3 className="text-lg font-semibold border-b pb-2">2. Location</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>State *</Label>
                <Select value={locationInfo.state} onValueChange={(v) => setLocationInfo({...locationInfo, state: v, district: ""})}>
                  <SelectTrigger><SelectValue placeholder="Select state" /></SelectTrigger>
                  <SelectContent>
                    {INDIAN_STATES.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>District *</Label>
                <Select value={locationInfo.district} onValueChange={(v) => setLocationInfo({...locationInfo, district: v})} disabled={!locationInfo.state}>
                  <SelectTrigger><SelectValue placeholder="Select district" /></SelectTrigger>
                  <SelectContent>
                    {(STATE_DISTRICT_MAPPING[locationInfo.state as keyof typeof STATE_DISTRICT_MAPPING] || []).map((d) => (
                      <SelectItem key={d} value={d}>{d}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>City / Town</Label>
                <Input value={locationInfo.city} onChange={(e) => setLocationInfo({...locationInfo, city: e.target.value})} />
              </div>
              <div className="space-y-2">
                <Label>Area / Locality</Label>
                <Input value={locationInfo.area} onChange={(e) => setLocationInfo({...locationInfo, area: e.target.value})} />
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label>Street Address</Label>
                <Input value={locationInfo.address} onChange={(e) => setLocationInfo({...locationInfo, address: e.target.value})} />
              </div>
              <div className="space-y-2">
                <Label>Landmark</Label>
                <Input value={locationInfo.landmark} onChange={(e) => setLocationInfo({...locationInfo, landmark: e.target.value})} />
              </div>
              <div className="space-y-2">
                <Label>PIN / ZIP Code</Label>
                <Input value={locationInfo.pincode} onChange={(e) => setLocationInfo({...locationInfo, pincode: e.target.value})} />
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label>Google Maps URL (optional)</Label>
                <Input value={locationInfo.google_maps_url} onChange={(e) => setLocationInfo({...locationInfo, google_maps_url: e.target.value})} placeholder="https://maps.google.com/..." />
              </div>
            </div>
            
            <div className="pt-4 border-t mt-4">
              <div className="flex items-center justify-between mb-2">
                <Label>Coordinates (for nearby search)</Label>
                <Button type="button" size="sm" variant="outline" onClick={getLocation}>
                  <MapPin className="h-4 w-4 mr-2" /> Get Location
                </Button>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <Input 
                  value={locationInfo.latitude} 
                  onChange={(e) => setLocationInfo({...locationInfo, latitude: e.target.value})} 
                  placeholder="Latitude (e.g. 28.7041)" 
                />
                <Input 
                  value={locationInfo.longitude} 
                  onChange={(e) => setLocationInfo({...locationInfo, longitude: e.target.value})} 
                  placeholder="Longitude (e.g. 77.1025)" 
                />
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Contact */}
        {step === 3 && (
          <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
            <h3 className="text-lg font-semibold border-b pb-2">3. Contact Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Contact Person Name</Label>
                <Input value={contactInfo.contact_person} onChange={(e) => setContactInfo({...contactInfo, contact_person: e.target.value})} />
              </div>
              <div className="space-y-2">
                <Label>Mobile Number *</Label>
                <Input value={contactInfo.contact_number} onChange={(e) => setContactInfo({...contactInfo, contact_number: e.target.value})} required />
              </div>
              <div className="space-y-2">
                <Label>Alternate Mobile Number</Label>
                <Input value={contactInfo.alternate_number} onChange={(e) => setContactInfo({...contactInfo, alternate_number: e.target.value})} />
              </div>
              <div className="space-y-2">
                <Label>WhatsApp Number</Label>
                <Input value={contactInfo.whatsapp_number} onChange={(e) => setContactInfo({...contactInfo, whatsapp_number: e.target.value})} />
              </div>
              <div className="space-y-2">
                <Label>Email Address</Label>
                <Input type="email" value={contactInfo.email} onChange={(e) => setContactInfo({...contactInfo, email: e.target.value})} />
              </div>
              <div className="space-y-2">
                <Label>Website (optional)</Label>
                <Input type="url" value={contactInfo.website} onChange={(e) => setContactInfo({...contactInfo, website: e.target.value})} placeholder="https://..." />
              </div>
            </div>
          </div>
        )}

        {/* Step 4: Services */}
        {step === 4 && (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
            <h3 className="text-lg font-semibold border-b pb-2">4. Clinic Services</h3>
            
            <div className="space-y-3">
              <Label>Clinic Type</Label>
              <Select value={servicesInfo.clinic_type} onValueChange={(v) => setServicesInfo({...servicesInfo, clinic_type: v})}>
                <SelectTrigger><SelectValue placeholder="Select primary clinic type" /></SelectTrigger>
                <SelectContent>
                  {CLINIC_TYPES.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-3">
              <Label>Available Services</Label>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {CLINIC_SERVICES.map(service => (
                  <div key={service} className="flex items-center space-x-2 border p-2 rounded-md hover:bg-muted/50">
                    <Checkbox 
                      id={`srv-${service}`} 
                      checked={servicesInfo.services.includes(service)}
                      onCheckedChange={() => toggleService(service)}
                    />
                    <label htmlFor={`srv-${service}`} className="text-sm cursor-pointer flex-1">
                      {service}
                    </label>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Step 5: Doctors */}
        {step === 5 && (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
            <h3 className="text-lg font-semibold border-b pb-2">5. Doctors</h3>
            
            <div className="space-y-4">
              {loadingDoctors ? (
                <div className="flex justify-center p-4"><Loader2 className="h-6 w-6 animate-spin text-primary" /></div>
              ) : doctors.length === 0 ? (
                <div className="text-center p-4 text-muted-foreground border border-dashed rounded-md">
                  No doctors added yet. Add your staff below.
                </div>
              ) : (
                <div className="grid gap-3">
                  {doctors.map(doctor => (
                    <div key={doctor.id} className="flex justify-between items-center p-3 border rounded-md bg-muted/20">
                      <div>
                        <p className="font-medium">{doctor.full_name}</p>
                        <p className="text-xs text-muted-foreground">
                          {doctor.specialization} • {doctor.qualification} • {doctor.experience_years ? `${doctor.experience_years} years exp.` : ''}
                        </p>
                      </div>
                      <Button variant="ghost" size="icon" className="text-destructive" onClick={() => removeDoctor(doctor.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <Card className="border-dashed bg-muted/10 shadow-none">
              <CardHeader className="py-3 px-4 border-b">
                <CardTitle className="text-sm">Add New Doctor</CardTitle>
              </CardHeader>
              <CardContent className="p-4 space-y-3">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <Label className="text-xs">Doctor Name *</Label>
                    <Input size={1} value={newDoctor.full_name} onChange={e => setNewDoctor({...newDoctor, full_name: e.target.value})} placeholder="Dr. John Doe" />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs">Specialization</Label>
                    <Input size={1} value={newDoctor.specialization} onChange={e => setNewDoctor({...newDoctor, specialization: e.target.value})} placeholder="e.g. Cardiologist" />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs">Qualification</Label>
                    <Input size={1} value={newDoctor.qualification} onChange={e => setNewDoctor({...newDoctor, qualification: e.target.value})} placeholder="e.g. MBBS, MD" />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs">Experience (Years)</Label>
                    <Input type="number" size={1} value={newDoctor.experience_years} onChange={e => setNewDoctor({...newDoctor, experience_years: e.target.value})} />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs">Consultation Fee (₹)</Label>
                    <Input type="number" size={1} value={newDoctor.consultation_fee} onChange={e => setNewDoctor({...newDoctor, consultation_fee: e.target.value})} />
                  </div>
                </div>
                <Button type="button" variant="secondary" onClick={handleAddDoctor} disabled={addingDoctor || !newDoctor.full_name} className="w-full mt-2">
                  {addingDoctor ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Plus className="h-4 w-4 mr-2" />}
                  Add Doctor
                </Button>
              </CardContent>
            </Card>

          </div>
        )}

        {/* Navigation Buttons */}
        <div className="flex justify-between mt-8 pt-4 border-t">
          <Button variant="outline" onClick={handlePrev} disabled={step === 1 || saving}>
            <ChevronLeft className="h-4 w-4 mr-2" /> Previous
          </Button>
          
          <Button onClick={handleSaveAndNext} disabled={saving} className={step === 5 ? "bg-green-600 hover:bg-green-700 text-white" : ""}>
            {saving && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
            {step === 5 ? (
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
