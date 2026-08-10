import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MapPin, Clock, Stethoscope, Building2, DoorOpen, IndianRupee, Languages, BriefcaseMedical } from "lucide-react";
import { Link } from "react-router-dom";
import { isAvailableToday, isAvailableNow } from "@/lib/availability";

interface DoctorCardProps {
  doctor: any;
  slots: any[];
  leaves: any[];
}

export function DoctorCard({ doctor, slots, leaves }: DoctorCardProps) {
  const availToday = isAvailableToday(slots, leaves, doctor.status);
  const availNow = isAvailableNow(slots, leaves, doctor.status);

  const statusColor = doctor.status === "available" ? "bg-success text-success-foreground" :
    doctor.status === "on_leave" ? "bg-warning text-warning-foreground" :
    "bg-muted text-muted-foreground";

  const statusLabel = doctor.status === "available" ? "Available" :
    doctor.status === "on_leave" ? "On Leave" : "Not Available";

  return (
    <Link to={`/doctors/${doctor.id}`} className="group block h-full animate-in fade-in zoom-in-95 duration-500">
      <Card className={`relative overflow-hidden hover:shadow-2xl transition-all duration-500 hover:-translate-y-1 cursor-pointer h-full border-border/50 bg-card/80 backdrop-blur-sm ${doctor.status === 'available' ? 'hover:border-success/50' : ''}`}>
        <div className={`absolute top-0 left-0 w-1 h-full ${doctor.status === 'available' ? 'bg-success' : doctor.status === 'on_leave' ? 'bg-warning' : 'bg-muted'} transition-all duration-300 group-hover:w-1.5`} />
        <CardContent className="p-6">
          <div className="flex items-start gap-5">
            <Avatar className="h-16 w-16 shrink-0 border-2 border-primary/10 shadow-sm transition-transform duration-300 group-hover:scale-105 group-hover:border-primary/30">
              <AvatarImage src={doctor.profile_image_url} alt={doctor.full_name} className="object-cover" />
              <AvatarFallback className="gradient-primary text-primary-foreground font-bold text-xl">
                {doctor.full_name?.charAt(0) || "D"}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2.5 flex-wrap mb-1">
                <h3 className="font-bold text-lg text-foreground truncate transition-colors duration-300 group-hover:text-primary">{doctor.full_name}</h3>
                <Badge className={`${statusColor} text-[10px] font-bold tracking-wider uppercase px-2 py-0.5 shadow-sm`}>{statusLabel}</Badge>
                {availNow && <Badge className="bg-success/20 text-success border border-success/30 text-[10px] font-bold tracking-wider uppercase px-2 py-0.5 animate-pulse">Now</Badge>}
                {!availNow && availToday && <Badge variant="outline" className="text-[10px] font-bold tracking-wider uppercase px-2 py-0.5 border-success/30 text-success">Today</Badge>}
              </div>

              {doctor.specialization && (
                <p className="text-sm font-medium text-primary/80 flex items-center gap-1.5 mb-3">
                  <Stethoscope className="h-4 w-4" />
                  {doctor.specialization}
                </p>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-2.5 gap-x-4 text-[13px] text-muted-foreground bg-muted/30 p-3 rounded-xl border border-border/50">
                {doctor.hospital_name && (
                  <span className="flex items-center gap-1.5"><Building2 className="h-3.5 w-3.5 text-primary/60 shrink-0" /><span className="truncate">{doctor.hospital_name}</span></span>
                )}
                {(doctor.state || doctor.district) && (
                  <span className="flex items-center gap-1.5"><MapPin className="h-3.5 w-3.5 text-primary/60 shrink-0" /><span className="truncate">{[doctor.area, doctor.district, doctor.state].filter(Boolean).join(", ")}</span></span>
                )}
                {doctor.room_number && (
                  <span className="flex items-center gap-1.5"><DoorOpen className="h-3.5 w-3.5 text-primary/60 shrink-0" />Room {doctor.room_number}</span>
                )}
                {doctor.experience_years != null && (
                  <span className="flex items-center gap-1.5"><BriefcaseMedical className="h-3.5 w-3.5 text-primary/60 shrink-0" />{doctor.experience_years} yrs exp</span>
                )}
                {doctor.consultation_fee != null && (
                  <span className="flex items-center gap-1.5"><IndianRupee className="h-3.5 w-3.5 text-primary/60 shrink-0" />{doctor.consultation_fee === 0 ? "Free" : doctor.consultation_fee}</span>
                )}
                {doctor.languages?.length > 0 && (
                  <span className="flex items-center gap-1.5"><Languages className="h-3.5 w-3.5 text-primary/60 shrink-0" /><span className="truncate">{doctor.languages.join(", ")}</span></span>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
