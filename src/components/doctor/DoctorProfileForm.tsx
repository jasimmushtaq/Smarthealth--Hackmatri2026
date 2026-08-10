import { useState, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { SPECIALIZATIONS, LANGUAGES } from "@/lib/constants";
import { INDIAN_STATES, STATE_DISTRICT_MAPPING } from "@/lib/states-data";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Camera, Loader2 } from "lucide-react";
import { uploadToCloudinary } from "@/lib/cloudinary";

interface Props {
  doctor: any;
  userId: string;
  onSave: () => void;
}

export function DoctorProfileForm({ doctor, userId, onSave }: Props) {
  const [form, setForm] = useState({
    full_name: doctor?.full_name || "",
    gender: doctor?.gender || "",
    specialization: doctor?.specialization || "",
    hospital_name: doctor?.hospital_name || "",
    room_number: doctor?.room_number || "",
    state: doctor?.state || "",
    district: doctor?.district || "",
    area: doctor?.area || "",
    experience_years: doctor?.experience_years?.toString() || "0",
    bio: doctor?.bio || "",
    consultation_fee: doctor?.consultation_fee?.toString() || "0",
    languages: doctor?.languages || [],
    profile_image_url: doctor?.profile_image_url || "",
  });
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const fields = ["full_name", "gender", "specialization", "hospital_name", "state", "district", "experience_years", "consultation_fee", "bio", "profile_image_url"];
  const filled = fields.filter((f) => form[f as keyof typeof form] && form[f as keyof typeof form] !== "0" && form[f as keyof typeof form] !== "").length;
  const completion = Math.round((filled / fields.length) * 100);

  const update = (key: string, value: any) => {
    setForm((p) => {
      const updated = { ...p, [key]: value };
      if (key === "state") {
        updated.district = "";
      }
      return updated;
    });
  };

  const toggleLang = (lang: string) => {
    setForm((p) => ({
      ...p,
      languages: p.languages.includes(lang) ? p.languages.filter((l: string) => l !== lang) : [...p.languages, lang],
    }));
  };

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image must be less than 5MB");
      return;
    }

    setUploading(true);
    try {
      const imageUrl = await uploadToCloudinary(file);
      update("profile_image_url", imageUrl);

      // Also update in DB immediately if doctor exists
      if (doctor) {
        await supabase.from("doctors").update({ profile_image_url: imageUrl }).eq("id", doctor.id);
        onSave();
      }

      toast.success("Photo uploaded ✅");
    } catch (err: any) {
      toast.error("Upload failed: " + (err.message || "Unknown error"));
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async () => {
    if (!form.full_name.trim()) {
      toast.error("Full name is required");
      return;
    }
    setSaving(true);
    const payload = {
      ...form,
      gender: form.gender || null,
      experience_years: parseInt(form.experience_years) || 0,
      consultation_fee: parseFloat(form.consultation_fee) || 0,
      user_id: userId,
    };

    if (doctor) {
      const { error } = await supabase.from("doctors").update(payload).eq("id", doctor.id);
      if (error) toast.error(error.message);
      else toast.success("Profile saved ✅");
    } else {
      const { error } = await supabase.from("doctors").insert(payload);
      if (error) toast.error(error.message);
      else toast.success("Profile created ✅");
    }
    setSaving(false);
    onSave();
  };

  const initials = form.full_name
    ? form.full_name.split(" ").map((n: string) => n[0]).join("").toUpperCase().slice(0, 2)
    : "DR";

  return (
    <Card>
      <CardHeader>
        <CardTitle>My Profile</CardTitle>
        <div className="flex items-center gap-3 mt-2">
          <Progress value={completion} className="flex-1" />
          <span className="text-sm text-muted-foreground font-medium">{completion}%</span>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Photo Upload */}
        <div className="flex items-center gap-4">
          <div className="relative group">
            <Avatar className="h-20 w-20 border-2 border-primary/20">
              <AvatarImage src={form.profile_image_url} alt={form.full_name} />
              <AvatarFallback className="text-lg bg-primary/10 text-primary">{initials}</AvatarFallback>
            </Avatar>
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
              className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-full opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
            >
              {uploading ? (
                <Loader2 className="h-5 w-5 text-white animate-spin" />
              ) : (
                <Camera className="h-5 w-5 text-white" />
              )}
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handlePhotoUpload}
              className="hidden"
            />
          </div>
          <div>
            <p className="font-medium text-foreground">{form.full_name || "Your Name"}</p>
            <p className="text-sm text-muted-foreground">Click photo to upload</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Full Name *</Label>
            <Input value={form.full_name} onChange={(e) => update("full_name", e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label>Gender</Label>
            <Select value={form.gender} onValueChange={(v) => update("gender", v)}>
              <SelectTrigger><SelectValue placeholder="Select gender" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="male">Male</SelectItem>
                <SelectItem value="female">Female</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Specialization</Label>
            <Select value={form.specialization} onValueChange={(v) => update("specialization", v)}>
              <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
              <SelectContent>
                {SPECIALIZATIONS.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Hospital Name</Label>
            <Input value={form.hospital_name} onChange={(e) => update("hospital_name", e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label>Room Number</Label>
            <Input value={form.room_number} onChange={(e) => update("room_number", e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label>State</Label>
            <Select value={form.state} onValueChange={(v) => update("state", v)} disabled={true}>
              <SelectTrigger><SelectValue placeholder="Select state" /></SelectTrigger>
              <SelectContent>
                {INDIAN_STATES.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>District</Label>
            <Select value={form.district} onValueChange={(v) => update("district", v)} disabled={true}>
              <SelectTrigger><SelectValue placeholder={form.state ? "Select district" : "Select state first"} /></SelectTrigger>
              <SelectContent>
                {(STATE_DISTRICT_MAPPING[form.state] || []).map((d) => (
                  <SelectItem key={d} value={d}>{d}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Area</Label>
            <Input value={form.area} onChange={(e) => update("area", e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label>Experience (years)</Label>
            <Input type="number" min="0" value={form.experience_years} onChange={(e) => update("experience_years", e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label>Consultation Fee (₹)</Label>
            <Input type="number" min="0" value={form.consultation_fee} onChange={(e) => update("consultation_fee", e.target.value)} />
          </div>
        </div>

        <div className="space-y-2">
          <Label>Bio</Label>
          <Textarea value={form.bio} onChange={(e) => update("bio", e.target.value)} placeholder="Brief about yourself..." rows={3} />
        </div>

        <div className="space-y-2">
          <Label>Languages</Label>
          <div className="flex flex-wrap gap-2">
            {LANGUAGES.map((l) => (
              <Badge key={l} variant={form.languages.includes(l) ? "default" : "outline"} className="cursor-pointer" onClick={() => toggleLang(l)}>
                {l}
              </Badge>
            ))}
          </div>
        </div>

        <Button onClick={handleSave} disabled={saving} className="w-full md:w-auto">
          {saving ? "Saving..." : "Save Profile"}
        </Button>
      </CardContent>
    </Card>
  );
}
