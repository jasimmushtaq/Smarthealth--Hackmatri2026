import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { Users, Stethoscope, Trash2, Database, FileText, Printer, CheckCircle, XCircle, Building2 } from "lucide-react";
import { SPECIALIZATIONS, INDIAN_STATES } from "@/lib/constants";

export default function AdminDashboard() {
  const [doctors, setDoctors] = useState<any[]>([]);
  const [clinics, setClinics] = useState<any[]>([]);
  const [roles, setRoles] = useState<any[]>([]);
  const [slots, setSlots] = useState<Record<string, any[]>>({});
  const [leaves, setLeaves] = useState<Record<string, any[]>>({});
  const [loading, setLoading] = useState(true);

  const fetchAll = async () => {
    const [{ data: docs }, { data: rls }, { data: sls }, { data: lvs }, { data: clns }] = await Promise.all([
      supabase.from("doctors").select("*").order("full_name"),
      supabase.from("user_roles").select("*"),
      supabase.from("availability_slots").select("*"),
      supabase.from("doctor_leaves").select("*"),
      supabase.from("clinics").select("*").order("name"),
    ]);
    
    setDoctors(docs || []);
    setRoles(rls || []);
    setClinics(clns || []);

    const sm: Record<string, any[]> = {};
    (sls || []).forEach((s) => { if (!sm[s.doctor_id]) sm[s.doctor_id] = []; sm[s.doctor_id].push(s); });
    setSlots(sm);

    const lm: Record<string, any[]> = {};
    (lvs || []).forEach((l) => { if (!lm[l.doctor_id]) lm[l.doctor_id] = []; lm[l.doctor_id].push(l); });
    setLeaves(lm);

    setLoading(false);
  };

  useEffect(() => { fetchAll(); }, []);

  const updateDoctorStatus = async (id: string, status: string) => {
    const { error } = await supabase.from("doctors").update({ status }).eq("id", id);
    if (error) toast.error(error.message); else toast.success("Status updated");
    fetchAll();
  };

  const toggleApproval = async (id: string, currentStatus: boolean) => {
    const { error } = await supabase.from("doctors").update({ is_approved: !currentStatus }).eq("id", id);
    if (error) {
      toast.error(error.message);
    } else {
      toast.success(currentStatus ? "Doctor approval revoked" : "Doctor approved successfully! ✅");
      fetchAll();
    }
  };

  const toggleClinicApproval = async (id: string, currentStatus: boolean) => {
    const { error } = await supabase.from("clinics").update({ is_approved: !currentStatus }).eq("id", id);
    if (error) {
      toast.error(error.message);
    } else {
      toast.success(currentStatus ? "Clinic approval revoked" : "Clinic approved successfully! ✅");
      fetchAll();
    }
  };

  const deleteDoctor = async (id: string) => {
    const { error } = await supabase.from("doctors").delete().eq("id", id);
    if (error) toast.error(error.message); else toast.success("Doctor deleted");
    fetchAll();
  };

  const deleteClinic = async (id: string) => {
    const { error } = await supabase.from("clinics").delete().eq("id", id);
    if (error) toast.error(error.message); else toast.success("Clinic deleted");
    fetchAll();
  };

  const seedDemoData = async () => {
    toast.success("Demo seeding requires actual user accounts. Create doctor accounts via signup.");
  };

  const statusBadge = (status: string) => {
    if (status === "available") return <Badge className="bg-success text-success-foreground">Available</Badge>;
    if (status === "on_leave") return <Badge className="bg-warning text-warning-foreground">On Leave</Badge>;
    return <Badge variant="secondary">Not Available</Badge>;
  };

  const downloadProfilePDF = (d: any) => {
    const printWindow = window.open("", "_blank");
    if (!printWindow) {
      toast.error("Please allow popups to download the PDF profile.");
      return;
    }

    const docSlots = slots[d.id] || [];
    const docLeaves = leaves[d.id] || [];

    const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const slotsHtml = docSlots.length > 0 
      ? docSlots.map(s => `<li>${days[s.day_of_week] || `Day ${s.day_of_week}`}: ${s.start_time.slice(0, 5)} - ${s.end_time.slice(0, 5)}</li>`).join("")
      : "<li>No availability slots configured</li>";

    const leavesHtml = docLeaves.length > 0
      ? docLeaves.map(l => `<li>${l.start_date} to ${l.end_date} ${l.reason ? `(Reason: ${l.reason})` : ''}</li>`).join("")
      : "<li>No leaves recorded</li>";

    const languagesText = Array.isArray(d.languages) && d.languages.length > 0
      ? d.languages.join(", ")
      : "Not specified";

    const htmlContent = `
      <html>
        <head>
          <title>${d.full_name} - Detailed Doctor Profile</title>
          <style>
            @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
            body {
              font-family: 'Inter', sans-serif;
              color: #1e293b;
              margin: 40px;
              line-height: 1.5;
            }
            .header {
              display: flex;
              gap: 24px;
              border-bottom: 2px solid #e2e8f0;
              padding-bottom: 24px;
              margin-bottom: 24px;
              align-items: center;
            }
            .photo {
              width: 120px;
              height: 120px;
              border-radius: 12px;
              object-fit: cover;
              border: 1px solid #cbd5e1;
            }
            .photo-placeholder {
              width: 120px;
              height: 120px;
              border-radius: 12px;
              background: #f1f5f9;
              display: flex;
              align-items: center;
              justify-content: center;
              font-size: 36px;
              color: #94a3b8;
              font-weight: bold;
              border: 1px solid #cbd5e1;
            }
            .details {
              flex: 1;
            }
            .name {
              font-size: 24px;
              font-weight: 700;
              margin: 0;
              color: #0f172a;
            }
            .specialization {
              font-size: 16px;
              color: #2563eb;
              font-weight: 600;
              margin-top: 4px;
            }
            .location {
              font-size: 14px;
              color: #64748b;
              margin-top: 4px;
            }
            .section {
              margin-bottom: 24px;
            }
            .section-title {
              font-size: 16px;
              font-weight: 700;
              color: #0f172a;
              border-left: 4px solid #2563eb;
              padding-left: 8px;
              margin-bottom: 12px;
            }
            .grid {
              display: grid;
              grid-template-cols: 1fr 1fr;
              gap: 16px;
              background: #f8fafc;
              padding: 16px;
              border-radius: 8px;
              margin-bottom: 24px;
            }
            .grid-item span {
              display: block;
              font-size: 12px;
              color: #64748b;
            }
            .grid-item strong {
              font-size: 14px;
              color: #0f172a;
            }
            ul {
              margin: 0;
              padding-left: 20px;
            }
            li {
              font-size: 14px;
              margin-bottom: 4px;
            }
            .footer {
              margin-top: 40px;
              text-align: center;
              font-size: 12px;
              color: #94a3b8;
              border-top: 1px solid #e2e8f0;
              padding-top: 16px;
            }
            @media print {
              body { margin: 0; }
              .no-print { display: none; }
            }
          </style>
        </head>
        <body>
          <div class="no-print" style="text-align: right; margin-bottom: 16px;">
            <button onclick="window.print()" style="padding: 8px 16px; background: #2563eb; color: white; border: none; border-radius: 6px; font-weight: 600; cursor: pointer; display: flex; align-items: center; gap: 6px; margin-left: auto;">
              Print / Save as PDF
            </button>
          </div>
          <div class="header">
            ${d.profile_image_url 
              ? `<img class="photo" src="${d.profile_image_url}" alt="${d.full_name}"/>`
              : `<div class="photo-placeholder">${d.full_name ? d.full_name[0] : 'DR'}</div>`
            }
            <div class="details">
              <h1 class="name">${d.full_name}</h1>
              <div class="specialization">${d.specialization || 'General Physician'}</div>
              <div class="location">${d.hospital_name ? `${d.hospital_name}, ` : ''}Room ${d.room_number || 'N/A'}, ${d.district || 'N/A'}, ${d.state || 'N/A'}</div>
            </div>
          </div>

          <div class="grid">
            <div class="grid-item">
              <span>Experience</span>
              <strong>${d.experience_years || 0} Years</strong>
            </div>
            <div class="grid-item">
              <span>Consultation Fee</span>
              <strong>₹${d.consultation_fee || 0}</strong>
            </div>
            <div class="grid-item">
              <span>Gender</span>
              <strong>${d.gender ? d.gender.charAt(0).toUpperCase() + d.gender.slice(1) : 'Not specified'}</strong>
            </div>
            <div class="grid-item">
              <span>Languages Spoken</span>
              <strong>${languagesText}</strong>
            </div>
          </div>

          <div class="section">
            <div class="section-title">Biography</div>
            <p style="font-size: 14px; color: #334155; margin: 0;">${d.bio || 'No biography details provided.'}</p>
          </div>

          <div class="section">
            <div class="section-title">Weekly Availability Slots</div>
            <ul style="color: #334155;">${slotsHtml}</ul>
          </div>

          <div class="section">
            <div class="section-title">Recorded Leaves / Absences</div>
            <ul style="color: #334155;">${leavesHtml}</ul>
          </div>

          <div class="footer">
            Generated automatically by SwasthyaCare Admin Dashboard on ${new Date().toLocaleDateString()}
          </div>
          <script>
            window.onload = function() {
              setTimeout(function() { window.print(); }, 500);
            };
          </script>
        </body>
      </html>
    `;

    printWindow.document.write(htmlContent);
    printWindow.document.close();
  };

  const downloadClinicProfilePDF = (c: any) => {
    const printWindow = window.open("", "_blank");
    if (!printWindow) {
      toast.error("Please allow popups to download the PDF profile.");
      return;
    }

    const servicesHtml = Array.isArray(c.services) && c.services.length > 0
      ? c.services.map((s: string) => `<li>${s}</li>`).join("")
      : "<li>No services specified</li>";

    const address = [c.address, c.landmark, c.area, c.city, c.district, c.state, c.pincode].filter(Boolean).join(", ");

    const htmlContent = `
      <html>
        <head>
          <title>${c.name} - Detailed Clinic Profile</title>
          <style>
            @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
            body {
              font-family: 'Inter', sans-serif;
              color: #1e293b;
              margin: 40px;
              line-height: 1.5;
            }
            .header {
              display: flex;
              gap: 24px;
              border-bottom: 2px solid #e2e8f0;
              padding-bottom: 24px;
              margin-bottom: 24px;
              align-items: center;
            }
            .photo {
              width: 120px;
              height: 120px;
              border-radius: 12px;
              object-fit: cover;
              border: 1px solid #cbd5e1;
            }
            .photo-placeholder {
              width: 120px;
              height: 120px;
              border-radius: 12px;
              background: #f1f5f9;
              display: flex;
              align-items: center;
              justify-content: center;
              font-size: 36px;
              color: #94a3b8;
              font-weight: bold;
              border: 1px solid #cbd5e1;
            }
            .details {
              flex: 1;
            }
            .name {
              font-size: 24px;
              font-weight: 700;
              margin: 0;
              color: #0f172a;
            }
            .specialization {
              font-size: 16px;
              color: #2563eb;
              font-weight: 600;
              margin-top: 4px;
            }
            .location {
              font-size: 14px;
              color: #64748b;
              margin-top: 4px;
            }
            .section {
              margin-bottom: 24px;
            }
            .section-title {
              font-size: 16px;
              font-weight: 700;
              color: #0f172a;
              border-left: 4px solid #2563eb;
              padding-left: 8px;
              margin-bottom: 12px;
            }
            .grid {
              display: grid;
              grid-template-cols: 1fr 1fr;
              gap: 16px;
              background: #f8fafc;
              padding: 16px;
              border-radius: 8px;
              margin-bottom: 24px;
            }
            .grid-item span {
              display: block;
              font-size: 12px;
              color: #64748b;
            }
            .grid-item strong {
              font-size: 14px;
              color: #0f172a;
            }
            ul {
              margin: 0;
              padding-left: 20px;
            }
            li {
              font-size: 14px;
              margin-bottom: 4px;
            }
            .footer {
              margin-top: 40px;
              text-align: center;
              font-size: 12px;
              color: #94a3b8;
              border-top: 1px solid #e2e8f0;
              padding-top: 16px;
            }
            @media print {
              body { margin: 0; }
              .no-print { display: none; }
            }
          </style>
        </head>
        <body>
          <div class="no-print" style="text-align: right; margin-bottom: 16px;">
            <button onclick="window.print()" style="padding: 8px 16px; background: #2563eb; color: white; border: none; border-radius: 6px; font-weight: 600; cursor: pointer; display: flex; align-items: center; gap: 6px; margin-left: auto;">
              Print / Save as PDF
            </button>
          </div>
          <div class="header">
            ${c.logo_url 
              ? `<img class="photo" src="${c.logo_url}" alt="${c.name}"/>`
              : `<div class="photo-placeholder">${c.name ? c.name[0] : 'C'}</div>`
            }
            <div class="details">
              <h1 class="name">${c.name}</h1>
              <div class="specialization">${c.clinic_type || 'General Clinic'}</div>
              <div class="location">${address || 'Address not specified'}</div>
            </div>
          </div>

          <div class="grid">
            <div class="grid-item">
              <span>Established Year</span>
              <strong>${c.year_established || 'N/A'}</strong>
            </div>
            <div class="grid-item">
              <span>Registration Number</span>
              <strong>${c.registration_number || 'N/A'}</strong>
            </div>
            <div class="grid-item">
              <span>Contact Person</span>
              <strong>${c.contact_person || 'N/A'}</strong>
            </div>
            <div class="grid-item">
              <span>Primary Phone</span>
              <strong>${c.contact_number || 'N/A'}</strong>
            </div>
            <div class="grid-item">
              <span>Alternate Phone</span>
              <strong>${c.alternate_number || 'N/A'}</strong>
            </div>
            <div class="grid-item">
              <span>WhatsApp Number</span>
              <strong>${c.whatsapp_number || 'N/A'}</strong>
            </div>
            <div class="grid-item">
              <span>Email Address</span>
              <strong>${c.email || 'N/A'}</strong>
            </div>
            <div class="grid-item">
              <span>Website</span>
              <strong>${c.website || 'N/A'}</strong>
            </div>
          </div>

          <div class="section">
            <div class="section-title">Clinic Description</div>
            <p style="font-size: 14px; color: #334155; margin: 0;">${c.description || 'No description provided.'}</p>
          </div>

          <div class="section">
            <div class="section-title">Available Services</div>
            <ul style="color: #334155;">${servicesHtml}</ul>
          </div>

          <div class="footer">
            Generated automatically by SwasthyaCare Admin Dashboard on ${new Date().toLocaleDateString()}
          </div>
          <script>
            window.onload = function() {
              setTimeout(function() { window.print(); }, 500);
            };
          </script>
        </body>
      </html>
    `;

    printWindow.document.write(htmlContent);
    printWindow.document.close();
  };

  const [selectedState, setSelectedState] = useState<string>("All");
  const [selectedClinicState, setSelectedClinicState] = useState<string>("All");

  const filteredDoctors = selectedState === "All" ? doctors : doctors.filter(d => d.state === selectedState);
  const filteredClinics = selectedClinicState === "All" ? clinics : clinics.filter(c => c.state === selectedClinicState);

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      <h1 className="text-2xl font-bold mb-6 text-foreground">Admin Dashboard</h1>

      <Tabs defaultValue="doctors">
        <TabsList className="grid grid-cols-4 w-full max-w-2xl">
          <TabsTrigger value="doctors"><Stethoscope className="h-4 w-4 mr-1" />Doctors</TabsTrigger>
          <TabsTrigger value="clinics"><Building2 className="h-4 w-4 mr-1" />Clinics</TabsTrigger>
          <TabsTrigger value="users"><Users className="h-4 w-4 mr-1" />Users</TabsTrigger>
          <TabsTrigger value="seed"><Database className="h-4 w-4 mr-1" />Seed</TabsTrigger>
        </TabsList>
        <TabsContent value="doctors" className="mt-6">
          <Card>
            <CardHeader className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <CardTitle>All Doctors ({filteredDoctors.length})</CardTitle>
              <Select value={selectedState} onValueChange={setSelectedState}>
                <SelectTrigger className="w-full md:w-[250px]">
                  <SelectValue placeholder="Filter by State" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="All">All States</SelectItem>
                  {INDIAN_STATES.map((state) => (
                    <SelectItem key={state} value={state}>{state}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </CardHeader>
            <CardContent>
              {loading ? <div className="h-32 bg-muted animate-pulse rounded-lg" /> : filteredDoctors.length === 0 ? (
                <p className="text-muted-foreground text-center py-8">No doctors found for this state.</p>
              ) : (
                <div className="space-y-4">
                  {filteredDoctors.map((d) => (
                    <div key={d.id} className="flex flex-col md:flex-row md:items-center justify-between bg-muted/30 border border-muted rounded-xl p-4 gap-4">
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="font-semibold text-foreground text-base">{d.full_name}</p>
                          {d.is_approved ? (
                            <Badge className="bg-green-100 text-green-800 hover:bg-green-100 flex items-center gap-1"><CheckCircle className="h-3 w-3" />Approved</Badge>
                          ) : (
                            <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-100 flex items-center gap-1"><XCircle className="h-3 w-3" />Pending Approval</Badge>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground mt-0.5">{d.specialization || "General Physician"} • {d.hospital_name || "No Hospital"} • {d.district}, {d.state}</p>
                      </div>
                      <div className="flex flex-wrap items-center gap-2">
                        {statusBadge(d.status)}
                        <Select defaultValue={d.status} onValueChange={(v) => updateDoctorStatus(d.id, v)}>
                          <SelectTrigger className="w-32 h-9 text-sm"><SelectValue /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="available">Available</SelectItem>
                            <SelectItem value="not_available">Not Available</SelectItem>
                            <SelectItem value="on_leave">On Leave</SelectItem>
                          </SelectContent>
                        </Select>
                        
                        {/* Approval Action */}
                        <Button
                          variant={d.is_approved ? "outline" : "default"}
                          size="sm"
                          onClick={() => toggleApproval(d.id, d.is_approved)}
                          className={d.is_approved ? "text-amber-600 border-amber-200 hover:bg-amber-50 h-9" : "bg-green-600 hover:bg-green-700 text-white h-9"}
                        >
                          {d.is_approved ? "Revoke" : "Approve"}
                        </Button>

                        {/* PDF Download Button */}
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => downloadProfilePDF(d)}
                          className="h-9 flex items-center gap-1.5"
                        >
                          <FileText className="h-4 w-4" />
                          PDF
                        </Button>

                        <Button variant="ghost" size="icon" className="h-9 w-9 text-destructive hover:bg-destructive/10" onClick={() => deleteDoctor(d.id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="clinics" className="mt-6">
          <Card>
            <CardHeader className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <CardTitle>All Clinics ({filteredClinics.length})</CardTitle>
              <Select value={selectedClinicState} onValueChange={setSelectedClinicState}>
                <SelectTrigger className="w-full md:w-[250px]">
                  <SelectValue placeholder="Filter by State" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="All">All States</SelectItem>
                  {INDIAN_STATES.map((state) => (
                    <SelectItem key={state} value={state}>{state}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </CardHeader>
            <CardContent>
              {loading ? <div className="h-32 bg-muted animate-pulse rounded-lg" /> : filteredClinics.length === 0 ? (
                <p className="text-muted-foreground text-center py-8">No clinics found for this state.</p>
              ) : (
                <div className="space-y-4">
                  {filteredClinics.map((c) => (
                    <div key={c.id} className="flex flex-col md:flex-row md:items-center justify-between bg-muted/30 border border-muted rounded-xl p-4 gap-4">
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="font-semibold text-foreground text-base">{c.name}</p>
                          {c.is_approved ? (
                            <Badge className="bg-green-100 text-green-800 hover:bg-green-100 flex items-center gap-1"><CheckCircle className="h-3 w-3" />Approved</Badge>
                          ) : (
                            <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-100 flex items-center gap-1"><XCircle className="h-3 w-3" />Pending Approval</Badge>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground mt-0.5">{c.address ? c.address + ", " : ""}{c.district}, {c.state}</p>
                        <p className="text-sm text-muted-foreground mt-0.5">Contact: {c.contact_number || "N/A"}</p>
                      </div>
                      <div className="flex flex-wrap items-center gap-2">
                        {/* Approval Action */}
                        <Button
                          variant={c.is_approved ? "outline" : "default"}
                          size="sm"
                          onClick={() => toggleClinicApproval(c.id, c.is_approved)}
                          className={c.is_approved ? "text-amber-600 border-amber-200 hover:bg-amber-50 h-9" : "bg-green-600 hover:bg-green-700 text-white h-9"}
                        >
                          {c.is_approved ? "Revoke" : "Approve"}
                        </Button>

                        {/* PDF Download Button */}
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => downloadClinicProfilePDF(c)}
                          className="h-9 flex items-center gap-1.5"
                        >
                          <FileText className="h-4 w-4" />
                          PDF
                        </Button>

                        <Button variant="ghost" size="icon" className="h-9 w-9 text-destructive hover:bg-destructive/10" onClick={() => deleteClinic(c.id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="users" className="mt-6">
          <Card>
            <CardHeader><CardTitle>User Roles ({roles.length})</CardTitle></CardHeader>
            <CardContent>
              {roles.length === 0 ? (
                <p className="text-muted-foreground text-center py-8">No users yet</p>
              ) : (
                <div className="space-y-2">
                  {roles.map((r) => (
                    <div key={r.id} className="flex items-center justify-between bg-muted/50 rounded-lg px-4 py-2">
                      <span className="text-sm font-mono text-muted-foreground">{r.user_id.slice(0, 8)}...</span>
                      <Badge>{r.role}</Badge>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="seed" className="mt-6">
          <Card>
            <CardHeader><CardTitle>Seed Demo Data</CardTitle></CardHeader>
            <CardContent>
              <p className="text-muted-foreground text-sm mb-4">Create demo doctor accounts by signing up with the doctor role, then populate their profiles.</p>
              <Button onClick={seedDemoData}><Database className="h-4 w-4 mr-1" />Seed Demo</Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
